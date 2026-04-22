import json
import re

file_path = r'public\EAMCET\real_mocks\Engineering\mock_test_3\realMock3.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

bad_questions = []

for q in data:
    qid = q['id']
    is_bad = False
    
    # 1. Check options for newlines
    for opt in q['options']:
        if '\n' in opt.strip():
            is_bad = True
            break
            
    # 2. Check question text for stacked fractions
    # E.g. "1\n2" or multiple short lines
    q_lines = q['question'].split('\n')
    short_lines = [l for l in q_lines if len(l.strip()) < 5 and len(l.strip()) > 0]
    
    if len(short_lines) > 2:
        is_bad = True

    # 3. Check for diagram keywords
    if re.search(r'(?i)match the following|major product|sequence|arrange the following', q['question']):
        is_bad = True
        
    if is_bad:
        bad_questions.append(qid)

print(f"Total messy questions found: {len(bad_questions)}")
print("IDs:", ", ".join(map(str, bad_questions)))
