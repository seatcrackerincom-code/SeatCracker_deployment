import fitz
import json
import re

pdf_path = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\extract_questions\agriculture1.pdf'
doc = fitz.open(pdf_path)

out_text = ""
for page_num in range(len(doc)):
    page = doc.load_page(page_num)
    out_text += page.get_text("text")

with open(r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\extract_questions\agriculture1.txt', 'w', encoding='utf-8') as f:
    f.write(out_text)
print("Done")
