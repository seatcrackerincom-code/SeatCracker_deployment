import os
import re
import json
import fitz
import tkinter as tk
from tkinter import filedialog, simpledialog
from PIL import Image

# ===== CONFIG =====
ZOOM = 2.0
PADDING_TOP = 10
TOTAL_QUESTIONS = 160


# ===== FILE PICKER & INPUTS =====
def get_user_inputs():
    root = tk.Tk()
    root.withdraw()
    root.attributes('-topmost', True) 

    pdf_path = filedialog.askopenfilename(
        title="1. Select PDF File",
        filetypes=[("PDF files", "*.pdf")]
    )
    if not pdf_path: return None, None, None

    output_base = filedialog.askdirectory(
        title="2. Select Destination Folder"
    )
    if not output_base: return None, None, None

    test_name = simpledialog.askstring(
        "3. Test Name",
        "Enter Mock Test Name (e.g., mock_test_4):",
        parent=root
    )
    if not test_name: return None, None, None

    root.destroy()
    return pdf_path, output_base, test_name


# ===== HELPERS =====
def get_spans(page):
    spans = []
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            for span in line["spans"]:
                spans.append(span)
    return spans


def find_test_start(doc):
    """Finds the last mention of 'Mathematics' on the first few pages."""
    best_p = 0
    best_y = 0
    for p in range(min(3, len(doc))):
        for span in get_spans(doc[p]):
            if "mathematics" in span["text"].strip().lower():
                best_p = p
                best_y = span["bbox"][3]
    return best_p, best_y


def is_real_question(start_p, y0, q_num, span_cache):
    """Strictly verifies if it's a real question by looking ahead for options."""
    spans_to_check = []
    # Grab spans from the cache up to 3 pages ahead
    for p in range(start_p, min(start_p + 3, len(span_cache))):
        spans_to_check.extend(span_cache.get(p, []))
        
    start_idx = -1
    for i, span in enumerate(spans_to_check):
        if abs(span["bbox"][1] - y0) < 2 and re.match(rf'^{q_num}\.$', span["text"].strip()):
            start_idx = i
            break
            
    if start_idx == -1: return False
    
    # Look ahead for option (1)
    for i in range(start_idx + 1, min(start_idx + 150, len(spans_to_check))):
        txt = spans_to_check[i]["text"].strip()
        x0 = spans_to_check[i]["bbox"][0]
        
        # 1. Stop if we hit a solution block
        if re.match(r'^(Correct\s+Answer|Solution|Answer\s*:|Key\s*:)', txt, re.IGNORECASE):
            return False
            
        # 2. CONFIRMED REAL: Valid option 1 found
        if re.match(r'^(\(1\)|\(A\)|1\.|A\.)\s*$', txt, re.IGNORECASE):
            return True
            
        # 3. CONFIRMED FAKE: Hit ANOTHER question number in the margin before finding options!
        match_next_q = re.match(r'^(\d{1,3})\.$', txt)
        if match_next_q and x0 < 85:
            next_q = int(match_next_q.group(1))
            if next_q != q_num:  # We crashed into a different question
                return False
            
    return False


def build_question_map(doc, start_page, start_y):
    """Builds a foolproof map of where every question starts using cached data."""
    q_starts = {}
    span_cache = {}
    
    # 1. READ ONCE: Cache all page text to avoid massive slowdowns
    for p in range(start_page, len(doc)):
        span_cache[p] = get_spans(doc[p])

    # 2. Find all possible question numbers in one pass
    all_candidates = {q: [] for q in range(1, TOTAL_QUESTIONS + 1)}
    for p in range(start_page, len(doc)):
        for span in span_cache[p]:
            txt = span["text"].strip()
            x0 = span["bbox"][0]
            y0 = span["bbox"][1]
            
            if p == start_page and y0 < start_y: continue
            
            match = re.match(r'^(\d{1,3})\.$', txt)
            if match and x0 < 85:
                q = int(match.group(1))
                if 1 <= q <= TOTAL_QUESTIONS:
                    all_candidates[q].append((p, y0))
                    
    # 3. Filter out the fake numbers
    for q, candidates in all_candidates.items():
        if not candidates:
            continue
        if len(candidates) == 1:
            q_starts[q] = candidates[0]
        else:
            real_cands = [c for c in candidates if is_real_question(c[0], c[1], q, span_cache)]
            if real_cands:
                q_starts[q] = real_cands[0]
            else:
                # CRITICAL FIX: Always default to the FIRST candidate found. 
                # The actual test appears chronologically before stray numbers in the solutions.
                q_starts[q] = candidates[0]
                
    return q_starts, span_cache


# ===== MULTI-PAGE EXTRACTION =====
def extract_question_images(doc, q_num, q_starts, span_cache):
    if q_num not in q_starts: return []

    page_num, q_start_y = q_starts[q_num]
    images = []

    for p in range(page_num, min(page_num + 3, len(doc))):
        page = doc[p]
        spans = span_cache.get(p) or get_spans(page)

        y_top = q_start_y if p == page_num else 0
        MAX_PAGE_Y = page.rect.height - 35 
        y_limit = MAX_PAGE_Y
        stop_found = False

        for span in spans:
            txt = span["text"].strip()

            if p == page_num and span["bbox"][1] < q_start_y - 2:
                continue

            # STOP 1: Hit 'Correct Answer'
            if re.match(r'^(Correct\s+Answer|Solution|Answer\s*:|Key\s*:)', txt, re.IGNORECASE):
                y_limit = span["bbox"][1] - 8
                stop_found = True
                break
            
            # STOP 2: Hit the verified start of the NEXT question
            if q_num + 1 in q_starts:
                next_p, next_y = q_starts[q_num + 1]
                if p == next_p and abs(span["bbox"][1] - next_y) < 2:
                    y_limit = span["bbox"][1] - 8
                    stop_found = True
                    break

        if y_limit > y_top:
            clip = fitz.Rect(20, max(0, y_top - PADDING_TOP), page.rect.width - 20, y_limit)
            pix = page.get_pixmap(matrix=fitz.Matrix(ZOOM, ZOOM), clip=clip)
            images.append(pix)

        if stop_found:
            break

    return images


# ===== ANSWER EXTRACTION =====
def extract_answer(doc, q_num, q_starts, span_cache):
    if q_num not in q_starts: return ""
    page_num, q_start_y = q_starts[q_num]

    for p in range(page_num, min(page_num + 3, len(doc))):
        spans = span_cache.get(p) or get_spans(doc[p])

        for i, span in enumerate(spans):
            if p == page_num and span["bbox"][1] < q_start_y - 5:
                continue
            
            txt = span["text"].strip()
            
            if re.match(r'^Correct\s+Answer', txt, re.IGNORECASE):
                context_text = " ".join([s["text"].strip() for s in spans[i:i+6]])
                match = re.search(r'Correct\s+Answer\s*[:\-]?\s*[\(\[]?([1-4A-D])', context_text, re.IGNORECASE)
                if match:
                    return match.group(1)
                    
    return ""


# ===== MERGE IMAGES =====
def merge_images(pixmaps):
    if not pixmaps: return None

    pil_images = []
    for pix in pixmaps:
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        pil_images.append(img)

    total_height = sum(img.height for img in pil_images)
    max_width = max(img.width for img in pil_images)

    final_img = Image.new("RGB", (max_width, total_height), (255, 255, 255))

    y_offset = 0
    for img in pil_images:
        final_img.paste(img, (0, y_offset))
        y_offset += img.height

    return final_img


# ===== SUBJECT MAPPING =====
def get_subject_name(q_num):
    if 1 <= q_num <= 80: return "Mathematics"
    elif 81 <= q_num <= 120: return "Physics"
    elif 121 <= q_num <= 160: return "Chemistry"
    return "Unknown"


# ===== MAIN =====
def run(pdf_path, output_base, test_name):
    test_folder_path = os.path.join(output_base, test_name)
    images_dir = os.path.join(test_folder_path, "images")
    os.makedirs(images_dir, exist_ok=True)

    print(f"\n🚀 Starting Extraction for: {test_name}")
    
    doc = fitz.open(pdf_path)
    
    start_page, start_y = find_test_start(doc)
    print(f"📍 Test instructions bypassed. Begins on Page {start_page + 1}.")
    
    print("⏳ Analyzing document structure (This will take ~2 seconds)...")
    q_starts, span_cache = build_question_map(doc, start_page, start_y)
    extracted_answers = {}

    for q in range(1, TOTAL_QUESTIONS + 1):
        if q not in q_starts:
            print(f"❌ Q{q} not found")
            continue

        # Images
        pixmaps = extract_question_images(doc, q, q_starts, span_cache)
        if pixmaps:
            final_img = merge_images(pixmaps)
            if final_img:
                final_img.save(os.path.join(images_dir, f"q_{q}.png"))

        # Answers
        extracted_answers[q] = extract_answer(doc, q, q_starts, span_cache)

        if q % 10 == 0:
            print(f"✅ Processed up to Q{q}...")

    # Save answers.txt
    answers_path = os.path.join(test_folder_path, "answers.txt")
    with open(answers_path, "w", encoding="utf-8") as f:
        for q in range(1, TOTAL_QUESTIONS + 1):
            f.write(f"Q{q}: {extracted_answers.get(q, '')}\n")

    # Save JSON File
    print("\n🏗️ Building JSON Loader File...")
    json_questions = []
    json_base_image_path = f"/real_mocks/Engineering/{test_name}/images"

    for q in range(1, TOTAL_QUESTIONS + 1):
        if q not in q_starts: continue

        question_data = {
            "id": q,
            "subject": get_subject_name(q),
            "question": "",
            "options": ["1", "2", "3", "4"],
            "answer": extracted_answers.get(q, ""),
            "image": f"{json_base_image_path}/q_{q}.png"
        }
        json_questions.append(question_data)

    test_number_match = re.search(r'mock_test_(\d+)', test_name, re.IGNORECASE)
    json_filename = f"realMock{test_number_match.group(1)}.json" if test_number_match else f"{test_name}.json"
    
    json_path = os.path.join(test_folder_path, json_filename)
    with open(json_path, "w", encoding="utf-8") as json_file:
        json.dump(json_questions, json_file, indent=2)

    print(f"✅ Saved Answers Text: {answers_path}")
    print(f"✅ Saved JSON Loader:  {json_path}")
    print("\n🔥 ALL DONE! Automation complete.")


# ===== RUN =====
if __name__ == "__main__":
    pdf, out_base, t_name = get_user_inputs()
    if pdf and out_base and t_name:
        run(pdf, out_base, t_name)
    else:
        print("❌ Inputs cancelled. Exiting.")