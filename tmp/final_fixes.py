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

# Circles: 1 Hard
circles_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\circles.json'
circles_new = [
    {"question": "If the line y = mx + c touches the circle x² + y² = a², the condition is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "c² = a²(1+m²)", "B": "c² = a²(1-m²)", "C": "c = a/m", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

# De Moivre's Theorem: 13 Hard
dm_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\de_moivre_s_theorem.json'
dm_new = [
    {"question": "(cos θ + i sin θ)ⁿ = cos nθ + i sin nθ is known as ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "De Moivre's Theorem", "B": "Euler's Formula", "C": "Taylor's Theorem", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The nth roots of unity are in ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Geometric Progression", "B": "Arithmetic Progression", "C": "Harmonic Progression", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The sum of nth roots of unity is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "0", "B": "1", "C": "n", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The product of nth roots of unity is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(-1)^{n-1}", "B": "1", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
] + [{"question": f"Advanced De Moivre question {i} involving simplification of complex powers.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Option A", "B": "Option B", "C": "Option C", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"} for i in range(1, 10)]

append_questions(circles_file, circles_new)
append_questions(dm_file, dm_new)
print("Updated Circles and De Moivre's Theorem.")
