import json
import re

json_path = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\JEE_Advanced\Day_1\Paper_1\jee_adv_mock_1.json"
answers_path = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\JEE_Advanced\Day_1\Paper_1\answers.txt"
output_path = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\JEE_Advanced\Day_1\Paper_1\paper.json"

with open(answers_path, 'r') as f:
    ans_text = f.read()

with open(json_path, 'r') as f:
    questions = json.load(f)

def get_answers_for_section(text):
    matches = re.findall(r"Q(\d+)\)\s*(.+)", text)
    results = {}
    for q_num, ans_val in matches:
        ans_val = ans_val.split('Q')[0].strip()
        if "," in ans_val:
            results[int(q_num)] = [x.strip() for x in ans_val.split(",")]
        else:
            results[int(q_num)] = ans_val
    return results

parts = re.split(r"MATHEMATICS|PHYSICS|CHEMISTRY", ans_text)
math_ans = get_answers_for_section(parts[1])
phys_ans = get_answers_for_section(parts[2])
chem_ans = get_answers_for_section(parts[3])

ans_map = {
    "Math": math_ans,
    "Phys": phys_ans,
    "Phy": phys_ans,  # Handle both
    "Chem": chem_ans
}

for q in questions:
    subj = q['subject']
    num = q['number']
    
    # Standardize Subject Name
    if subj == "Phys": q['subject'] = "Phy"
    if subj == "Math": q['subject'] = "Math"
    if subj == "Chem": q['subject'] = "Chem"
    
    current_subj = q['subject']
    if current_subj in ans_map and num in ans_map[current_subj]:
        q['answer'] = ans_map[current_subj][num]
    
    if q['type'] == 'INTEGER':
        q['type'] = 'SA'

with open(output_path, 'w') as f:
    json.dump({"questions": questions}, f, indent=2)

print(f"Final standardized merge complete: {output_path}")
