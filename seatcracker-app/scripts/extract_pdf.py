import pypdf
import os

pdf_path = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\previous_yearqps\AP\agricluture2024_prevQP.pdf'
output_path = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\tmp\pyq_text.txt'

def extract_text():
    if not os.path.exists(pdf_path):
        print(f"Error: PDF not found at {pdf_path}")
        return

    try:
        reader = pypdf.PdfReader(pdf_path)
        with open(output_path, 'w', encoding='utf-8') as f:
            for page in reader.pages:
                text = page.extract_text()
                f.write(text + "\n" + "-"*50 + "\n")
        print(f"Successfully extracted text to {output_path}")
    except Exception as e:
        print(f"Error during extraction: {e}")

if __name__ == "__main__":
    extract_text()
