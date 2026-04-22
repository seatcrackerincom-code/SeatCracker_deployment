import json
import re
import os

input_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\extract_questions\agriculture3.txt'
output_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\EAMCET\real_mocks\Agriculture\mock_test_3\realMock3.json'

with open(input_file, 'r', encoding='utf-8') as f:
    text = f.read()

# Skip the general instructions by finding the first actual question section
if "Botany" in text:
    text = text.split("Botany", 1)[1]

questions = []
for i in range(1, 161):
    pattern = rf'\n{i}\.\s+(.*?)(?=\n{i+1}\.\s+|\Z)'
    match = re.search(pattern, text, re.DOTALL)
    if match:
        q_text = match.group(1).strip()
        ans_match = re.search(r'Correct Answer:\s*(.*?)\n', q_text)
        correct_ans_str = ans_match.group(1).strip() if ans_match else ""
        parts = q_text.split('\nCorrect Answer:', 1)
        top_part = parts[0]
        options = []
        q_body = top_part
        opt_matches = list(re.finditer(r'\n\s*(\(?[A-D1-4]\)?\s*[\.\-]?)\s*(.*?)(?=\n\s*\(?[A-D1-4]\)?\s*[\.\-]?\s*|\Z)', top_part, re.DOTALL))
        if len(opt_matches) >= 4:
            opt_matches = opt_matches[-4:]
            q_body = top_part[:opt_matches[0].start()].strip()
            options = [m.group(2).strip().replace('\n', ' ') for m in opt_matches]
        
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
            
        q_body = re.sub(r'\n\s*([A-D]\.)', r'\n\1', q_body)
        q_body = re.sub(r'\n\s*(I{1,3}V?\.)', r'\n\1', q_body)
        q_body = re.sub(r'\n\s*(Statement I[I]?:)', r'\n\1', q_body)
        lines = q_body.split('\n')
        cleaned_lines = []
        for line in lines:
            line = line.strip()
            if not line: continue
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
        while len(options) < 4:
            options.append(f"Option {len(options)+1}")
        formatted_options = []
        for idx, opt in enumerate(options):
            prefix = f"({idx+1})"
            if not opt.startswith('(') and not re.match(r'^[A-D1-4]\.', opt):
                formatted_options.append(f"{prefix} {opt}")
            else:
                formatted_options.append(opt)
            
        # Mock 2 might have different image questions, we'll manually check later
        image_path = None
        
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
