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

# Differential Equations: 12 Hard questions
de_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\differential_equations.json'
de_new = [
    {"question": "The order of the differential equation d²y/dx² + (dy/dx)³ + y = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "2", "B": "3", "C": "1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The degree of the differential equation (d²y/dx²)² + (dy/dx)³ = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "2", "B": "3", "C": "1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Solution of dy/dx = y/x is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "y = cx", "B": "y = c/x", "C": "x² + y² = c", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The integrating factor of dy/dx + Py = Q is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "e^∫P dx", "B": "e^∫Q dx", "C": "∫P dx", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Solution of dy/dx + y/x = x² is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "xy = x⁴/4 + C", "B": "y = x³/3 + C", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "An equation of the form Mdx + Ndy = 0 is exact if ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "∂M/∂y = ∂N/∂x", "B": "∂M/∂x = ∂N/∂y", "C": "M=N", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The differential equation of all circles passing through the origin and having centers on the x-axis is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "y² - x² = 2xy dy/dx", "B": "x² + y² = c", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Substitution for homogeneous equation dy/dx = f(y/x) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "y = vx", "B": "x = vy", "C": "y = v+x", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The general solution of d²y/dx² + y = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "y = A cos x + B sin x", "B": "y = e^x", "C": "y = x", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The order of differential equation of family of parabolas y² = 4ax is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1", "B": "2", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The solution of dy/dx = e^{x-y} + x² e⁻ʸ is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "e^y = e^x + x³/3 + C", "B": "y = x + C", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The singular solution of a differential equation represents ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Envelope of family of curves", "B": "One member of family", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(de_file, de_new)
print("Updated Differential Equations.")
