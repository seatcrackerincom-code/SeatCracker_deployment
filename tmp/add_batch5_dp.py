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

# Dot Product (Vectors): 15 Hard questions
dp_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\dot_product_vectors.json'
dp_new = [
    {"question": "The angle between a and b if |a.b| = |a x b| is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "45°", "B": "90°", "C": "0°", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If |a|=2, |b|=3 and a.b=4, the length of a-b is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "√5", "B": "5", "C": "1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The work done by a force F = (1,1,1) in moving a particle from (0,0,0) to (1,2,3) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "6 units", "B": "3 units", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Projection of a = i + j on b = j + k is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1/√2", "B": "1", "C": "√2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If a, b, c are unit vectors such that a+b+c=0, then a.b + b.c + c.a = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "-1.5", "B": "1", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Condition for the dot product of two vectors to be zero is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "a is perpendicular to b", "B": "a is parallel to b", "C": "a=b", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Component of a vector a perpendicular to b in the plane of a, b is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "a - ((a.b)/|b|²) b", "B": "a + b", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If a, b are unit vectors and θ is the angle between them, then |a-b| = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "2 sin(θ/2)", "B": "2 cos(θ/2)", "C": "1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If |a+b| < |a-b|, the angle between a and b is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Obtuse", "B": "Acute", "C": "Right", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Angle between a = (1,1,1) and the x-axis is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "cos⁻¹(1/√3)", "B": "45°", "C": "60°", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Cos θ for two vectors a, b is found using ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(a.b) / (|a||b|)", "B": "|a x b|", "C": "a.b", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "A vector is perpendicular to itself only if it is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Zero vector", "B": "Unit vector", "C": "Proper vector", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If i, j, k are unit vectors, then i.j = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "0", "B": "1", "C": "k", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Scalar product is ______ (a.b = b.a).", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Commutative", "B": "Distributive", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The power P in mechanics is the dot product of ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Force and Velocity", "B": "Force and Displacement", "C": "Mass and Acceleration", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(dp_file, dp_new)
print("Updated Dot Product.")
