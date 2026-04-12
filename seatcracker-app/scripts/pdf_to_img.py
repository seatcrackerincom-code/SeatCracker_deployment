import fitz  # PyMuPDF
import os

pdf_path = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\previous_yearqps\AP\agricluture2024_prevQP.pdf'
output_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\tmp'
output_img = os.path.join(output_dir, 'pyq_page_1.png')

def convert_first_page():
    if not os.path.exists(pdf_path):
        print(f"Error: PDF not found at {pdf_path}")
        return

    try:
        doc = fitz.open(pdf_path)
        page = doc.load_page(0)  # load the first page
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # high res
        pix.save(output_img)
        print(f"Successfully saved first page to {output_img}")
        doc.close()
    except Exception as e:
        print(f"Error during image conversion: {e}")

if __name__ == "__main__":
    convert_first_page()
