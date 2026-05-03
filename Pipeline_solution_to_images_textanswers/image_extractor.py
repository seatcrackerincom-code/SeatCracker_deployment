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


def find_question_pages(doc):
    q_pages = {}
    for p in range(len(doc)):
        for span in get_spans(doc[p]):
            txt = span["text"].strip()
            x0 = span["bbox"][0]
            # Relaxed margin check to < 85 to ensure we catch indented questions
            if re.match(r'^\d{1,3}\.$', txt) and x0 < 85:
                q = int(txt[:-1])
                if q not in q_pages:
                    q_pages[q] = p
    return q_pages


def get_q_start_y(doc, page_num, q_num):
    matches = []
    for span in get_spans(doc[page_num]):
        txt = span["text"].strip()
        x0 = span["bbox"][0]
        if re.match(rf'^{q_num}\.$', txt) and x0 < 85:
            matches.append(span["bbox"][1])
            
    # Return the LAST match on the page to bypass instruction headers
    if matches:
        return matches[-1] 
    return None


# ===== MULTI-PAGE EXTRACTION (FLAWLESS CUTTING) =====
def extract_question_images(doc, page_num, q_num):
    q_start_y = get_q_start_y(doc, page_num, q_num)
    if q_start_y is None:
        return []

    images = []

    for p in range(page_num, min(page_num + 3, len(doc))):
        page = doc[p]
        spans = get_spans(page)

        y_top = q_start_y if p == page_num else 0
        y_bottom = page.rect.height
        stop_found = False

        for span in spans:
            txt = span["text"].strip()

            # Skip everything before the question starts
            if p == page_num and span["bbox"][1] < q_start_y - 2:
                continue

            # STOP CONDITION 1: Stop immediately before Solutions/Answers blocks
            if re.match(r'^(Correct\s+Answer|Solution|Answer\s*:|Key\s*:)', txt, re.IGNORECASE):
                y_bottom = span["bbox"][1] - 8  # Cut slightly above to be safe
                stop_found = True
                break
            
            # STOP CONDITION 2: Stop if we hit the NEXT question number in the margin
            if re.match(rf'^{q_num + 1}\.', txt) and span["bbox"][0] < 85:
                y_bottom = span["bbox"][1] - 8
                stop_found = True
                break

        # Prevent negative height clips
        if y_bottom > y_top:
            clip = fitz.Rect(20, max(0, y_top - PADDING_TOP),
                             page.rect.width - 20, y_bottom)

            pix = page.get_pixmap(matrix=fitz.Matrix(ZOOM, ZOOM), clip=clip)
            images.append(pix)

        if stop_found:
            break

    return images


# ===== ANSWER EXTRACTION =====
def extract_answer(doc, page_num, q_num):
    q_start_y = get_q_start_y(doc, page_num, q_num)
    if q_start_y is None: return ""

    for p in range(page_num, min(page_num + 3, len(doc))):
        page = doc[p]
        spans = get_spans(page)

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
    if not pixmaps:
        return None

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
    q_pages = find_question_pages(doc)
    extracted_answers = {}

    for q in range(1, TOTAL_QUESTIONS + 1):
        if q not in q_pages:
            print(f"❌ Q{q} not found")
            continue

        page_num = q_pages[q]

        # Images
        pixmaps = extract_question_images(doc, page_num, q)
        if pixmaps:
            final_img = merge_images(pixmaps)
            if final_img:
                final_img.save(os.path.join(images_dir, f"q_{q}.png"))

        # Answers
        extracted_answers[q] = extract_answer(doc, page_num, q)

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
        if q not in q_pages: continue

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