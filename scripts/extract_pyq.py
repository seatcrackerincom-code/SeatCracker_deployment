import pdfplumber
import re
import json
import os
import sys

def extract_questions_from_pdf(pdf_path, output_json):
    """
    Extracts questions and options from a standard competitive exam PDF.
    Expects English followed by Telugu.
    """
    questions = []
    current_q = None
    
    # Regex patterns
    q_pattern = re.compile(r'^(?:Question\s*No\.?\s*|Q\.?\s*)(\d+)', re.IGNORECASE)
    opt_pattern = re.compile(r'^\s*[\(\[]?([A-D1-4])[\)\]\.]?\s+(.*)')

    print(f"Opening {pdf_path}...")
    
    with pdfplumber.open(pdf_path) as pdf:
        full_text = ""
        for page in pdf.pages:
            full_text += page.extract_text() + "\n"

    lines = full_text.split('\n')
    
    buffer = []
    mode = "text" # text or option
    
    q_idx = 1
    
    for line in lines:
        line = line.strip()
        if not line: continue
        
        # Check for new question
        q_match = q_pattern.match(line)
        if q_match:
            # Save previous
            if current_q:
                # Basic logic to split En and Te: 
                # Usually English is first. We search for the first Telugu character block.
                text = " ".join(buffer)
                en_te_split = re.split(r'([\u0C00-\u0C7F].*)', text, 1)
                current_q["questionEn"] = en_te_split[0].strip()
                current_q["questionTe"] = en_te_split[1].strip() if len(en_te_split) > 1 else ""
                questions.append(current_q)
            
            current_q = {
                "id": int(q_match.group(1)),
                "subject": "Unknown", # Needs manual assignment or heuristic
                "questionEn": "",
                "questionTe": "",
                "options": {},
                "optionsTe": {},
                "answer": "A" # Placeholder
            }
            buffer = []
            continue
            
        # Check for options
        opt_match = opt_pattern.match(line)
        if opt_match and current_q:
            label = opt_match.group(1)
            # Map 1-4 to A-D
            if label.isdigit():
                label = chr(64 + int(label))
            
            content = opt_match.group(2).strip()
            # Split En/Te in option
            opt_split = re.split(r'([\u0C00-\u0C7F].*)', content, 1)
            current_q["options"][label] = opt_split[0].strip()
            current_q["optionsTe"][label] = opt_split[1].strip() if len(opt_split) > 1 else ""
            continue
            
        if current_q:
            buffer.append(line)

    # Final question
    if current_q:
        text = " ".join(buffer)
        en_te_split = re.split(r'([\u0C00-\u0C7F].*)', text, 1)
        current_q["questionEn"] = en_te_split[0].strip()
        current_q["questionTe"] = en_te_split[1].strip() if len(en_te_split) > 1 else ""
        questions.append(current_q)

    # Heuristic: Assign subjects based on EAMCET standard (1-80 Math, 81-120 Phys, 121-160 Chem)
    for q in questions:
        num = q["id"]
        if num <= 80: q["subject"] = "Mathematics"
        elif num <= 120: q["subject"] = "Physics"
        else: q["subject"] = "Chemistry"

    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    
    print(f"Successfully extracted {len(questions)} questions to {output_json}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python extract_pyq.py <input.pdf> <output.json>")
    else:
        extract_questions_from_pdf(sys.argv[1], sys.argv[2])
