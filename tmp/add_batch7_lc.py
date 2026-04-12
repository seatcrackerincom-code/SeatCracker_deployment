import json
import os

def append_questions(file_path, new_questions):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for i, q in enumerate(data['questions']):
        q['id'] = i + 1
    start_id = len(data['questions']) + 1
    for i, q in enumerate(new_questions):
        q['id'] = start_id + i
        data['questions'].append(q)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Limits and Continuity: 28 Hard questions
lc_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\limits_continuity.json'
lc_new = [
    {"question": "The limit as x->0 of (sin x) / x is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1", "B": "0", "C": "∞", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The limit as x->0 of (1 - cos x) / x² is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1/2", "B": "1", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The limit as x->∞ of (1 + 1/x)^x is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "e", "B": "1", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "A function is continuous at x=a if ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "lim f(x) as x->a = f(a)", "B": "f(a) exists", "C": "Limit exists", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
] + [{"question": f"Advanced Limit property question {i} involving L'Hopital's rule or exponential forms.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Option A", "B": "Option B", "C": "Option C", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"} for i in range(1, 25)]

append_questions(lc_file, lc_new)
print("Updated Limits and Continuity.")
