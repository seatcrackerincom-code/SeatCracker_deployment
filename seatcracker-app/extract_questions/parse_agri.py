import json
import re
import os

input_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\extract_questions\agriculture1.txt'
output_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\EAMCET\real_mocks\Agriculture\mock_test_1\realMock1.json'

with open(input_file, 'r', encoding='utf-8') as f:
    text = f.read()

# Split into questions
# We look for \n1. , \n2. up to \n160.
questions = []
for i in range(1, 161):
    pattern = rf'\n{i}\.\s+(.*?)(?=\n{i+1}\.\s+|\Z)'
    match = re.search(pattern, text, re.DOTALL)
    if match:
        q_text = match.group(1).strip()
        
        # Now extract the parts
        # Question text ends before options or "Correct Answer:"
        # Options can be (A) (B) (C) (D) or (1) (2) (3) (4) or 1. 2. 3. 4.
        
        # Let's find "Correct Answer: "
        ans_match = re.search(r'Correct Answer:\s*(.*?)\n', q_text)
        if ans_match:
            correct_ans_str = ans_match.group(1).strip()
        else:
            correct_ans_str = ""
            
        # Let's extract options
        # A common pattern is having them right before the Correct Answer
        # It's better to split by "\nCorrect Answer:" and process the top part.
        parts = q_text.split('\nCorrect Answer:', 1)
        top_part = parts[0]
        
        # Try to find options in the top part
        # They might be lines starting with (1), (2), (3), (4) or (A), (B), (C), (D) or 1., 2., 3., 4.
        # We can search backwards or just split by them.
        options = []
        q_body = top_part
        opt_matches = list(re.finditer(r'\n\s*(\(?[A-D1-4]\)?\s*[\.\-]?)\s*(.*?)(?=\n\s*\(?[A-D1-4]\)?\s*[\.\-]?\s*|\Z)', top_part, re.DOTALL))
        if len(opt_matches) >= 4:
            # We take the last 4 as the main options, just in case there are statements labeled A, B, C, D
            opt_matches = opt_matches[-4:]
            q_body = top_part[:opt_matches[0].start()].strip()
            options = [m.group(2).strip().replace('\n', ' ') for m in opt_matches]
        else:
            # Maybe they are inline?
            pass
            
        # Standardize answer to 1, 2, 3, or 4
        ans_idx = 1
        correct_ans_str = correct_ans_str.upper()
        if '(1)' in correct_ans_str or ' 1.' in correct_ans_str or correct_ans_str.startswith('1.'): ans_idx = 1
        elif '(2)' in correct_ans_str or ' 2.' in correct_ans_str or correct_ans_str.startswith('2.'): ans_idx = 2
        elif '(3)' in correct_ans_str or ' 3.' in correct_ans_str or correct_ans_str.startswith('3.'): ans_idx = 3
        elif '(4)' in correct_ans_str or ' 4.' in correct_ans_str or correct_ans_str.startswith('4.'): ans_idx = 4
        elif '(A)' in correct_ans_str: ans_idx = 1
        elif '(B)' in correct_ans_str: ans_idx = 2
        elif '(C)' in correct_ans_str: ans_idx = 3
        elif '(D)' in correct_ans_str: ans_idx = 4
            
        # Format question body (add newlines for statements)
        q_body = re.sub(r'\n\s*([A-D]\.)', r'\n\1', q_body)
        q_body = re.sub(r'\n\s*(I{1,3}V?\.)', r'\n\1', q_body)
        q_body = re.sub(r'\n\s*(Statement I[I]?:)', r'\n\1', q_body)
        
        # Cleanup q_body (remove excessive newlines but keep intentional ones)
        # We can just replace \n with ' ' unless it's before a statement
        lines = q_body.split('\n')
        cleaned_lines = []
        for line in lines:
            line = line.strip()
            if not line: continue
            
            # Filter out PDF artifacts like lone numbers or "The correct answer is"
            if re.match(r'^\d+$', line): continue
            if "The correct answer is" in line:
                line = line.replace("The correct answer is", "").strip()
                if not line: continue
                
            if re.match(r'^([A-D]\.|I{1,3}V?\.|\d+\.|Statement|Assertion|Reason)', line, re.IGNORECASE):
                cleaned_lines.append("\n" + line)
            else:
                if cleaned_lines and not cleaned_lines[-1].startswith("\n"):
                    cleaned_lines[-1] += " " + line
                else:
                    cleaned_lines.append(line)
        q_body = "".join(cleaned_lines).strip()
        
        # Ensure minimum 4 options and add prefix
        while len(options) < 4:
            options.append(f"Option {len(options)+1}")
        
        # Add option prefixes if not present
        formatted_options = []
        for idx, opt in enumerate(options):
            prefix = f"({idx+1})"
            if not opt.startswith('(') and not re.match(r'^[A-D1-4]\.', opt):
                formatted_options.append(f"{prefix} {opt}")
            else:
                formatted_options.append(opt)
            
        image_path = f"/images/Q_{i}.png" if i in [17, 19, 26, 96, 143, 145] else None
        
        if i <= 40: subject = "BOTANY"
        elif i <= 80: subject = "ZOOLOGY"
        elif i <= 120: subject = "PHYSICS"
        else: subject = "CHEMISTRY"
        
        questions.append({
            "id": i,
            "subject": subject,
            "question": q_body,
            "options": formatted_options,
            "answer": str(ans_idx),
            "image": image_path
        })

os.makedirs(os.path.dirname(output_file), exist_ok=True)
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2)

print(f"Generated {len(questions)} questions in {output_file}")
