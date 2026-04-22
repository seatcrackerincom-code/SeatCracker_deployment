import re
import json
import os

input_file = r'extract_questions\engineering2.txt'
output_file = r'public\EAMCET\real_mocks\Engineering\mock_test_2\realMock2.json'

os.makedirs(os.path.dirname(output_file), exist_ok=True)
os.makedirs(os.path.join(os.path.dirname(output_file), 'images'), exist_ok=True)

with open(input_file, 'r', encoding='utf-8') as f:
    text = f.read()

# Skip the general instructions
# In Eng 2, the section starts after "Mathematics\n1. The domain"
match = re.search(r'\nMathematics\n1\.\s+', text)
if match:
    text = "\n1. " + text[match.end():]
else:
    print("Could not find start marker!")

questions = []
for i in range(1, 161):
    pattern = rf'\n{i}\.\s+(.*?)(?=\n{i+1}\.\s+|\Z)'
    match = re.search(pattern, text, re.DOTALL)
    
    if match:
        q_text = match.group(1).strip()
        
        # Determine subject
        if 1 <= i <= 80:
            subject = "MATHEMATICS"
        elif 81 <= i <= 120:
            subject = "PHYSICS"
        elif 121 <= i <= 160:
            subject = "CHEMISTRY"
            
        # Extract options
        options = []
        for j in range(1, 5):
            opt_pattern = rf'\({j}\)\s+(.*?)(?=\({j+1}\)\s+|Correct Answer:|\Z)'
            opt_match = re.search(opt_pattern, q_text, re.DOTALL)
            if opt_match:
                options.append(f"({j}) {opt_match.group(1).strip()}")
        
        # If options are missing (diagram/match), create placeholders
        while len(options) < 4:
            options.append(f"({len(options)+1}) ")

        # Extract answer
        ans_pattern = r'Correct Answer:\s*\(([1-4])\)'
        ans_match = re.search(ans_pattern, q_text)
        answer = ans_match.group(1) if ans_match else ""

        # Clean question text
        clean_q = re.split(r'\n\(1\)\s+', q_text)[0].strip()
        
        question = {
            "id": i,
            "subject": subject,
            "question": clean_q,
            "options": options,
            "answer": answer,
            "image": None
        }
        questions.append(question)

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2)

print(f"Generated {len(questions)} questions in {output_file}")
