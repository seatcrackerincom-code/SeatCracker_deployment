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

# Properties of Triangles: 12 Hard questions
pot_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\properties_of_triangles.json'
pot_new = [
    {"question": "In a triangle ABC, if a=5, b=7, c=8, then the area of the triangle is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "10√3", "B": "15√3", "C": "20", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The circumradius R of a triangle with area Δ and sides a, b, c is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "abc / 4Δ", "B": "abc / Δ", "C": "2Δ / abc", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The inradius r of a triangle with area Δ and semi-perimeter s is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Δ / s", "B": "s / Δ", "C": "Δs", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "In ΔABC, r₁ (ex-radius opposite to vertex A) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Δ / (s-a)", "B": "Δ / s", "C": "s-a", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "According to the Cosine Rule, cos A = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(b² + c² - a²) / 2bc", "B": "(a² + b² - c²) / 2ab", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of r₁ + r₂ + r₃ - r is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "4R", "B": "2R", "C": "R", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If in a ΔABC, a cos A = b cos B, then the triangle is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Isosceles or Right-angled", "B": "Equilateral", "C": "Scalene", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The area of a triangle with vertices (x₁,y₁), (x₂,y₂), (x₃,y₃) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "0.5 |x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|", "B": "x₁y₂ + x₂y₃ + x₃y₁", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The distance between the circumcenter and orthocenter of a triangle is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "R√(1 - 8 cos A cos B cos C)", "B": "R", "C": "3R", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "In a ΔABC, tan((A-B)/2) = ______ (Napier's Analogy).", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "((a-b)/(a+b)) cot(C/2)", "B": "((a+b)/(a-b)) tan(C/2)", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Angle A of a triangle with sides 3, 5, 7 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "60°", "B": "120°", "C": "45°", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of 1/r₁ + 1/r₂ + 1/r₃ is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1/r", "B": "r", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(pot_file, pot_new)
print("Updated Properties of Triangles.")
