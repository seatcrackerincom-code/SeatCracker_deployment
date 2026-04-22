import fitz

pdf_path = r'extract_questions\engineering1.pdf'
doc = fitz.open(pdf_path)

# Let's try to find Q1 and crop it
for page_num in range(len(doc)):
    page = doc.load_page(page_num)
    
    # Search for "1. The domain"
    rls = page.search_for("1. The domain")
    if rls:
        # Found Q1 start
        start_rect = rls[0]
        
        # Search for Q2 start on same page
        rls2 = page.search_for("2. If")
        if rls2:
            end_rect = rls2[0]
            
            # Crop box from left edge to right edge, from start_rect.y0 to end_rect.y0
            crop_rect = fitz.Rect(0, start_rect.y0, page.rect.width, end_rect.y0)
            
            pix = page.get_pixmap(clip=crop_rect, dpi=150)
            pix.save("test_crop_Q1.png")
            print("Successfully cropped Q1 to test_crop_Q1.png")
            break
