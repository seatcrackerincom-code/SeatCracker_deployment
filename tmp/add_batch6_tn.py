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

# Tangents and Normals: 13 Hard questions
tn_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\tangents_and_normals.json'
tn_new = [
    {"question": "The slope of the tangent to the curve y = f(x) at point (x1, y1) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "f'(x1)", "B": "f(x1)", "C": "-1/f'(x1)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The slope of the normal to the curve y = f(x) at point (x1, y1) is ______ (if f'(x1) ≠ 0).", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "-1 / f'(x1)", "B": "f'(x1)", "C": "1 / f'(x1)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The equation of tangent at (x1, y1) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "y - y1 = m(x - x1)", "B": "y = mx + c", "C": "y - y1 = -1/m(x - x1)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If two curves intersect orthogonally, the product of their slopes at intersection is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "-1", "B": "1", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Length of the tangent is given by ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "|y1| √ (1 + (1/m)²) ", "B": "|y1| √ (1 + m²)", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Length of the normal is given by ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "|y1| √ (1 + m²)", "B": "|y1| √ (1 + (1/m)²) ", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The angle between two curves at a point of intersection is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "arctan(|(m1 - m2) / (1 + m1 m2)|)", "B": "arctan(m1 - m2)", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If the tangent is parallel to the x-axis, then m = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "0", "B": "1", "C": "∞", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If the tangent is perpendicular to the x-axis, then m = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "∞", "B": "0", "C": "1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Common tangent to two curves exists if ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Slopes and points match", "B": "They intersect", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Length of subtangent is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "|y1 / m|", "B": "|y1 m|", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Length of subnormal is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "|y1 m|", "B": "|y1 / m|", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The intercept of tangent on x-axis is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "x1 - y1/m", "B": "y1 - x1 m", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(tn_file, tn_new)
print("Updated Tangents and Normals.")
