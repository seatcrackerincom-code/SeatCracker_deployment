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

# Multiple and Sub Multiple Angles: 7 Hard questions
msma_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\multiple_and_sub_multiple_angles.json'
msma_new = [
    {"question": "The value of sin 18° is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(√5 - 1) / 4", "B": "(√5 + 1) / 4", "C": "√(10 - 2√5) / 4", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of cos 36° is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(√5 + 1) / 4", "B": "(√5 - 1) / 4", "C": "1/2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of tan 22.5° is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "√2 - 1", "B": "√2 + 1", "C": "1 - √2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If sin A = 3/5, then sin 2A = ______ (assuming A is acute).", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "24/25", "B": "12/25", "C": "7/25", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of 8 cos³ 20° - 6 cos 20° is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1", "B": "0", "C": "2 cos 60°", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The maximum value of sin x cos x is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1/2", "B": "1", "C": "2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Expression for tan 3A is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(3 tan A - tan³ A) / (1 - 3 tan² A)", "B": "3 tan A", "C": "tan A", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(msma_file, msma_new)
print("Updated Multiple and Sub Multiple Angles.")
