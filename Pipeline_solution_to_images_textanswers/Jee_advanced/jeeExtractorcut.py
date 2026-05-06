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
TOTAL_QUESTIONS = 51  # 17 questions * 3 subjects = 51 total


# ===== FILE PICKER & INPUTS =====
def get_user_inputs():
    root = tk.Tk()
    root.withdraw()
    root.attributes('-topmost', True) 

    pdf_path = filedialog.askopenfilename(
        title="1. Select JEE PDF File",
        filetypes=[("PDF files", "*.pdf")]
    )
    if not pdf_path: return None, None, None

    output_base = filedialog.askdirectory(
        title="2. Select Destination Folder"
    )
    if not output_base: return None, None, None

    test_name = simpledialog.askstring(
        "3. Test Name",
        "Enter Mock Test Name (e.g., jee_adv_mock_1):",
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


def build_jee_question_map(doc):
    """
    Scans the document for Subject, Section, Paragraph, and Question boundaries.
    Automatically extracts Question Types and Marks from Section headers.
    """
    span_cache = {}
    for p in range(len(doc)):
        span_cache[p] = get_spans(doc[p])

    boundaries = []
    stops = []

    for p in range(len(doc)):
        for span in span_cache[p]:
            txt = span["text"].strip()
            x0 = span["bbox"][0]
            y0 = span["bbox"][1]

            # 1. Subject Headers (Maths, Physics, Chemistry) -> RECORD FOR JSON ONLY
            if re.match(r'^\s*(Mathematics|Physics|Chemistry)\s*$', txt, re.IGNORECASE) and x0 < 300:
                boundaries.append({'type': 'SUBJECT', 'p': p, 'y': y0, 'text': txt})
                
            # 2. Section Headers -> EXTRACT MARKS & TYPE
            elif re.match(r'^SECTION\s*\d', txt, re.IGNORECASE):
                sec_num = int(re.search(r'SECTION\s*(\d)', txt, re.IGNORECASE).group(1))
                
                # Look ahead to extract Marks and Type
                idx = span_cache[p].index(span)
                lookahead_spans = span_cache[p][idx:min(idx+80, len(span_cache[p]))]
                lookahead_text = " ".join([s["text"].strip() for s in lookahead_spans])

                # Determine Type
                q_type = "MCQ"
                if "ONE OR MORE" in lookahead_text: q_type = "MSQ"
                elif "ONLY ONE" in lookahead_text: q_type = "MCQ"
                elif "NON-NEGATIVE INTEGER" in lookahead_text: q_type = "INTEGER"
                elif "NUMERICAL VALUE" in lookahead_text: q_type = "NUMERICAL"

                # Determine Marks
                full_m = "+3"
                neg_m = "0"
                fm_match = re.search(r'Full Marks\s*:\s*(\+\d)', lookahead_text, re.IGNORECASE)
                if fm_match: full_m = fm_match.group(1)
                    
                nm_match = re.search(r'Negative Marks\s*:\s*(-\d)', lookahead_text, re.IGNORECASE)
                if nm_match: neg_m = nm_match.group(1)

                marks = f"{full_m}, {neg_m}"

                boundaries.append({
                    'type': 'SECTION', 'p': p, 'y': y0, 'text': txt,
                    'sec_num': sec_num, 'q_type': q_type, 'marks': marks
                })
                
            # 3. Paragraph/Instruction Headers -> CUT THESE INTO IMAGE
            elif re.match(r'^PARAGRAPH', txt, re.IGNORECASE):
                boundaries.append({'type': 'HEADER', 'p': p, 'y': y0, 'text': txt})
                
            # 4. Question Numbers (Matches "Q.1" or "1.")
            else:
                match = re.match(r'^(?:Q\.\s*(\d{1,2})\b|(\d{1,2})\.)', txt)
                if match and x0 < 85:
                    q_local = int(match.group(1) or match.group(2))
                    boundaries.append({'type': 'QUESTION', 'p': p, 'y': y0, 'local_q': q_local, 'text': txt})

            # Stops (Solution Blocks)
            if re.match(r'^(Correct\s+Answer|Solution|Answer\s*Key)', txt, re.IGNORECASE):
                stops.append({'p': p, 'y': y0})

    # Sort vertically across the document
    boundaries.sort(key=lambda b: (b['p'], b['y']))

    questions = []
    pending_headers = []
    
    current_subject = "Mathematics"
    current_section = 1
    current_type = "MCQ"
    current_marks = "+3, -1"
    expected_local_q = 1

    for b in boundaries:
        if b['type'] == 'SUBJECT':
            current_subject = b['text'].strip().title()

        elif b['type'] == 'SECTION':
            current_section = b['sec_num']
            current_type = b['q_type']
            current_marks = b['marks']
            pending_headers.append(b)
            
        elif b['type'] == 'HEADER':
            pending_headers.append(b)

        elif b['type'] == 'QUESTION':
            q_local = b['local_q']

            if q_local == 1 or (expected_local_q <= q_local <= expected_local_q + 3):
                expected_local_q = q_local + 1

                if pending_headers:
                    start_p = pending_headers[0]['p']
                    start_y = pending_headers[0]['y']
                else:
                    start_p = b['p']
                    start_y = b['y']

                questions.append({
                    'abs_q': len(questions) + 1,  
                    'local_q': q_local,           
                    'subject': current_subject,   
                    'section': current_section,
                    'type': current_type,
                    'marks': current_marks,
                    'start_p': start_p,
                    'start_y': start_y,
                    'q_p': b['p'],
                    'q_y': b['y']
                })
                
                pending_headers = []
                if len(questions) == TOTAL_QUESTIONS:
                    break

    return questions, stops


# ===== MERGE IMAGES =====
def merge_images(pixmaps):
    if not pixmaps: return None
    pil_images = [Image.frombytes("RGB", [pix.width, pix.height], pix.samples) for pix in pixmaps]
    total_height = sum(img.height for img in pil_images)
    max_width = max(img.width for img in pil_images)
    
    final_img = Image.new("RGB", (max_width, total_height), (255, 255, 255))
    y_offset = 0
    for img in pil_images:
        final_img.paste(img, (0, y_offset))
        y_offset += img.height
    return final_img


# ===== MAIN PIPELINE =====
def run(pdf_path, output_base, test_name):
    test_folder_path = os.path.join(output_base, test_name)
    images_dir = os.path.join(test_folder_path, "images")
    os.makedirs(images_dir, exist_ok=True)

    print(f"\n🚀 Starting JEE Advanced Extraction for: {test_name}")
    doc = fitz.open(pdf_path)
    
    print("⏳ Scanning document for Subjects, Sections, and Questions...")
    questions, stops = build_jee_question_map(doc)
    
    if len(questions) < TOTAL_QUESTIONS:
        print(f"⚠️ Warning: Found only {len(questions)}/{TOTAL_QUESTIONS} questions.")

    json_questions = []
    json_base_image_path = f"/real_mocks/Engineering/{test_name}/images"

    for i, q in enumerate(questions):
        abs_q = q['abs_q']
        start_p = q['start_p']
        start_y = q['start_y']

        next_p, next_y = None, None
        if i < len(questions) - 1:
            next_p = questions[i+1]['start_p']
            next_y = questions[i+1]['start_y']

        images = []
        for p in range(start_p, min(start_p + 4, len(doc))):
            page = doc[p]
            y_top = start_y if p == start_p else 50
            y_limit = page.rect.height - 40 

            if p == next_p:
                y_limit = min(y_limit, next_y - 5)

            stop_found = False
            for stop in stops:
                if stop['p'] == p and stop['y'] > y_top:
                    if p != next_p or stop['y'] < next_y:
                        y_limit = min(y_limit, stop['y'] - 5)
                        stop_found = True

            if y_limit > y_top:
                clip = fitz.Rect(20, max(0, y_top - PADDING_TOP), page.rect.width - 20, y_limit)
                pix = page.get_pixmap(matrix=fitz.Matrix(ZOOM, ZOOM), clip=clip)
                images.append(pix)

            if stop_found or p == next_p:
                break

        if images:
            final_img = merge_images(images)
            if final_img:
                final_img.save(os.path.join(images_dir, f"q_{abs_q}.png"))

        # Formulate exact ID (e.g., Math-1-0)
        subject_short = q['subject'][:4]
        q_id = f"{subject_short}-{q['section']}-{q['local_q'] - 1}"
        
        # Options array (Empty for Integer/Numerical)
        options_array = ["A", "B", "C", "D"] if q['type'] in ["MCQ", "MSQ"] else []

        # Build precise JSON Struct
        json_questions.append({
            "id": q_id,
            "subject": subject_short,
            "section": q['section'],
            "number": q['local_q'],
            "type": q['type'],
            "text": "",
            "image": f"{json_base_image_path}/q_{abs_q}.png",
            "marks": q['marks'],
            "answer": "",
            "options": options_array
        })

        if abs_q % 10 == 0 or abs_q == TOTAL_QUESTIONS:
            print(f"✅ Processed up to Q{abs_q} ({q['subject']})...")

    # Save JSON File
    print("\n🏗️ Building JSON Loader File...")
    test_number_match = re.search(r'mock_test_(\d+)', test_name, re.IGNORECASE)
    json_filename = f"realMock{test_number_match.group(1)}.json" if test_number_match else f"{test_name}.json"
    
    json_path = os.path.join(test_folder_path, json_filename)
    with open(json_path, "w", encoding="utf-8") as json_file:
        json.dump(json_questions, json_file, indent=2)

    print(f"✅ Saved JSON Loader:  {json_path}")
    print(f"🔥 ALL DONE! Successfully extracted {len(questions)} perfectly cut JEE questions.")

# ===== RUN =====
if __name__ == "__main__":
    pdf, out_base, t_name = get_user_inputs()
    if pdf and out_base and t_name:
        run(pdf, out_base, t_name)
    else:
        print("❌ Inputs cancelled. Exiting.")