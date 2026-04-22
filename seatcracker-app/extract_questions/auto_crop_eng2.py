import fitz
from PIL import Image
import io
import os
import json

pdf_path = r'extract_questions\engineering2.pdf'
out_dir = r'public\EAMCET\real_mocks\Engineering\mock_test_2\images'
os.makedirs(out_dir, exist_ok=True)

doc = fitz.open(pdf_path)

# Build a list of all blocks with their page numbers
all_blocks = []
for page_num in range(len(doc)):
    page = doc.load_page(page_num)
    blocks = page.get_text("blocks")
    for b in blocks:
        # b is (x0, y0, x1, y1, "text", block_no, block_type)
        all_blocks.append({
            'page': page_num,
            'rect': fitz.Rect(b[:4]),
            'text': b[4],
            'page_width': page.rect.width,
            'page_height': page.rect.height
        })

def crop_question(qid):
    start_idx = -1
    end_idx = -1
    
    for i, b in enumerate(all_blocks):
        if b['text'].strip().startswith(f"{qid}."):
            start_idx = i
            break
            
    if start_idx == -1:
        print(f"Could not find start for Q{qid}")
        return False
        
    for i in range(start_idx, len(all_blocks)):
        if "Correct Answer:" in all_blocks[i]['text']:
            end_idx = i
            break
            
    if end_idx == -1:
        print(f"Could not find end for Q{qid}")
        return False
        
    q_blocks = all_blocks[start_idx:end_idx]
    
    pages_dict = {}
    for b in q_blocks:
        p = b['page']
        if p not in pages_dict:
            pages_dict[p] = []
        pages_dict[p].append(b['rect'])
        
    images = []
    for p, rects in pages_dict.items():
        page = doc.load_page(p)
        x0 = min(r.x0 for r in rects)
        y0 = min(r.y0 for r in rects)
        x1 = max(r.x1 for r in rects)
        y1 = max(r.y1 for r in rects)
        
        crop_rect = fitz.Rect(max(0, x0-10), max(0, y0-10), min(page.rect.width, x1+10), min(page.rect.height, y1+10))
        pix = page.get_pixmap(clip=crop_rect, dpi=200)
        
        img_data = pix.tobytes("png")
        img = Image.open(io.BytesIO(img_data))
        images.append(img)
        
    if not images:
        return False
        
    if len(images) == 1:
        final_img = images[0]
    else:
        total_height = sum(img.height for img in images)
        max_width = max(img.width for img in images)
        final_img = Image.new('RGB', (max_width, total_height), (255, 255, 255))
        
        y_offset = 0
        for img in images:
            final_img.paste(img, (0, y_offset))
            y_offset += img.height
            
    out_path = os.path.join(out_dir, f"Q{qid}.png")
    final_img.save(out_path)
    print(f"Saved {out_path}")
    return True

messy_ids = [1, 3, 5, 7, 10, 11, 12, 14, 15, 16, 19, 20, 21, 23, 24, 25, 26, 28, 29, 31, 32, 36, 37, 38, 39, 40, 41, 43, 45, 47, 49, 51, 53, 54, 56, 57, 58, 59, 61, 62, 63, 64, 65, 66, 68, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 88, 93, 98, 103, 108, 109, 112, 113, 114, 116, 120, 121, 122, 123, 127, 128, 130, 134, 138, 140, 144, 146, 148, 149, 150, 151, 152, 154, 158]

success_ids = []
for qid in messy_ids:
    if crop_question(qid):
        success_ids.append(qid)

# Update JSON
json_path = r'public\EAMCET\real_mocks\Engineering\mock_test_2\realMock2.json'
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for q in data:
    if q['id'] in success_ids:
        q['image'] = f"/real_mocks/Engineering/mock_test_2/images/Q{q['id']}.png"
        q['question'] = ""
        q['options'] = ["(1) ", "(2) ", "(3) ", "(4) "]

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print(f"Successfully processed and updated {len(success_ids)} questions!")
