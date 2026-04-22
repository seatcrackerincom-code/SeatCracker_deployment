import json

agri_path = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\EAMCET\real_mocks\Agriculture\mock_test_1\realMock1.json'
with open(agri_path, 'r', encoding='utf-8') as f:
    agri_data = json.load(f)

# Filter Physics (81-120) and Chemistry (121-160)
phy_chem = [q for q in agri_data if q['subject'] in ['PHYSICS', 'CHEMISTRY']]

new_questions = []
for q in phy_chem:
    opts = q['options']
    # If options are fewer than 4, pad them
    while len(opts) < 4:
        opts.append("")
    
    new_q = {
        "id": q['id'],
        "question": q['question'],
        "options": {
            "A": opts[0].replace("(1) ", "").replace("(A) ", "").strip(),
            "B": opts[1].replace("(2) ", "").replace("(B) ", "").strip(),
            "C": opts[2].replace("(3) ", "").replace("(C) ", "").strip(),
            "D": opts[3].replace("(4) ", "").replace("(D) ", "").strip()
        },
        "correct_answer": chr(64 + int(q['answer'])) if q['answer'].isdigit() else q['answer'],
        "correct_answer_text": opts[int(q['answer'])-1].replace("(%s) " % q['answer'], "").strip() if q['answer'].isdigit() and int(q['answer']) <= len(opts) else ""
    }
    if q.get('image'):
        # Update image path to point to Engineering folder
        new_q['image'] = q['image'].replace('/Agriculture/', '/Engineering/')
        
    new_questions.append(new_q)

print(json.dumps(new_questions, indent=4))
