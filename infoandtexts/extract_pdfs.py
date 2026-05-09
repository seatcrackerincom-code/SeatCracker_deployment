import PyPDF2

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

ap_path = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\cheatcodemode's\repeated concepts and formulas\Important Topics for AP-EAPCET 2026.pdf"
ap_out = "ap_extract.txt"

ts_path = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\cheatcodemode's\repeated concepts and formulas\_Important Topics for TS-EAPCET 2026.pdf"
ts_out = "ts_extract.txt"

extract_pdf(ap_path, ap_out)
extract_pdf(ts_path, ts_out)

