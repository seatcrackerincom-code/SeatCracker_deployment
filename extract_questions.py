import PyPDF2
import os

def extract_pdf(pdf_path, out_path):
    try:
        reader = PyPDF2.PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Extracted to {out_path}")
    except Exception as e:
        print(f"Error extracting {pdf_path}: {e}")

math_path = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\cheatcodemode's\repeated questions\maths\EAPCET_2026 Maths 160Q.pdf"
phy_path = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\cheatcodemode's\repeated questions\phy\EAPCET_2026 Physics 80Q.pdf"

extract_pdf(math_path, "math_questions_extract.txt")
extract_pdf(phy_path, "phy_questions_extract.txt")
