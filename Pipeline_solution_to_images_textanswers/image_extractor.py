import os
import re
import fitz
import tkinter as tk
from tkinter import filedialog
from PIL import Image

# ===== CONFIG =====
ZOOM = 2.0
PADDING_TOP = 10
TOTAL_QUESTIONS = 160


# ===== FILE PICKER =====
def choose_files():
    root = tk.Tk()
    root.withdraw()

    pdf_path = filedialog.askopenfilename(
        title="Select PDF",
        filetypes=[("PDF files", "*.pdf")]
    )

    output_folder = filedialog.askdirectory(
        title="Select Output Folder"
    )

    if not pdf_path or not output_folder:
        print("❌ Cancelled")
        exit()

    return pdf_path, output_folder


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
            if re.match(r'^\d{1,3}\.$', txt) and x0 < 80:
                q = int(txt[:-1])
                if q not in q_pages:
                    q_pages[q] = p
    return q_pages


def get_q_start_y(doc, page_num, q_num):
    for span in get_spans(doc[page_num]):
        txt = span["text"].strip()
        if re.match(rf'^{q_num}\.$', txt):
            return span["bbox"][1]
    return None


# ===== MULTI-PAGE EXTRACTION =====
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

            # Skip text before our question starts on the first page
            if p == page_num and span["bbox"][1] < q_start_y - 2:
                continue

            # STOP CONDITION 1: Stop immediately before the "Correct Answer" section
            if re.match(r'^Correct\s+Answer', txt, re.IGNORECASE):
                y_bottom = span["bbox"][1] - 5  # Cut 5 pixels above "Correct Answer"
                stop_found = True
                break
            
            # STOP CONDITION 2: Stop if we hit the NEXT question number
            if re.match(rf'^{q_num + 1}\.', txt) and span["bbox"][0] < 80:
                y_bottom = span["bbox"][1] - 5
                stop_found = True
                break

        # Prevent negative height clips
        if y_bottom > y_top:
            clip = fitz.Rect(30, max(0, y_top - PADDING_TOP),
                             page.rect.width - 30, y_bottom)

            pix = page.get_pixmap(matrix=fitz.Matrix(ZOOM, ZOOM), clip=clip)
            images.append(pix)

        if stop_found:
            break

    return images


# ===== ANSWER EXTRACTION =====
def extract_answer(doc, page_num, q_num):
    q_start_y = get_q_start_y(doc, page_num, q_num)
    if q_start_y is None:
        return ""

    for p in range(page_num, min(page_num + 3, len(doc))):
        page = doc[p]
        spans = get_spans(page)

        for i, span in enumerate(spans):
            # Skip past anything before the question starts
            if p == page_num and span["bbox"][1] < q_start_y - 5:
                continue
            
            txt = span["text"].strip()
            
            # Find the span that says "Correct Answer"
            if re.match(r'^Correct\s+Answer', txt, re.IGNORECASE):
                # Grab this span and the next few to handle text splitting safely
                context_text = " ".join([s["text"].strip() for s in spans[i:i+6]])
                
                # Regex isolates the option number (1-4) or letter (A-D)
                match = re.search(r'Correct\s+Answer\s*[:\-]?\s*[\(\[]?([1-4A-D])', context_text, re.IGNORECASE)
                if match:
                    return match.group(1)
                    
    return ""


# ===== MERGE IMAGES =====
def merge_images(pixmaps):
    pil_images = []

    for pix in pixmaps:
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        pil_images.append(img)

    total_height = sum(img.height for img in pil_images)
    max_width = max(img.width for img in pil_images)

    final_img = Image.new("RGB", (max_width, total_height))

    y_offset = 0
    for img in pil_images:
        final_img.paste(img, (0, y_offset))
        y_offset += img.height

    return final_img


# ===== MAIN =====
def run(pdf_path, output_folder):
    images_dir = os.path.join(output_folder, "images")
    os.makedirs(images_dir, exist_ok=True)

    answers_path = os.path.join(output_folder, "answers.txt")

    doc = fitz.open(pdf_path)
    q_pages = find_question_pages(doc)

    answers = {}

    for q in range(1, TOTAL_QUESTIONS + 1):
        if q not in q_pages:
            print(f"❌ Q{q} not found")
            continue

        page_num = q_pages[q]

        # 📸 Extract images
        pixmaps = extract_question_images(doc, page_num, q)

        if pixmaps:
            final_img = merge_images(pixmaps)
            final_img.save(os.path.join(images_dir, f"q_{q}.png"))

        # 🧠 Extract answer (Updated to pass the question number)
        answers[q] = extract_answer(doc, page_num, q)

        print(f"✅ Q{q} done")

    # 📝 Save answers
    with open(answers_path, "w", encoding="utf-8") as f:
        for q in range(1, TOTAL_QUESTIONS + 1):
            f.write(f"Q{q}: {answers.get(q, '')}\n")

    print("\n🔥 ALL DONE")


# ===== RUN =====
if __name__ == "__main__":
    pdf, out = choose_files()
    run(pdf, out)