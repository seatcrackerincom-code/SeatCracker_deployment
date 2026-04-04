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

# Trigonometry Upto Transformations: 19 Hard questions
trig_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\trigonometry_upto_transformations.json'
trig_new = [
    {"question": "The value of sin 10° sin 30° sin 50° sin 70° is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1/16", "B": "1/8", "C": "1/32", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If tan A + tan B + tan C = tan A tan B tan C, then A + B + C = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "nπ", "B": "π/2", "C": "2nπ", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of cos 20° cos 40° cos 60° cos 80° is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1/16", "B": "1/8", "C": "1/32", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If sin x + sin y + sin z = 3, then cos x + cos y + cos z = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "0", "B": "3", "C": "-3", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The maximum value of 3 sin x + 4 cos x + 10 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "15", "B": "5", "C": "10", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The minimum value of 2 sin²θ + 3 cos²θ is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "2", "B": "3", "C": "5", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If tan θ = 1/2 and tan φ = 1/3, then θ + φ = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "45°", "B": "60°", "C": "30°", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of tan 75° + cot 75° is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "4", "B": "2", "C": "2√3", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If sin A/a = sin B/b = sin C/c, this is known as ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Sine Rule", "B": "Cosine Rule", "C": "Tangent Rule", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The transformation of sin A + sin B into product form is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "2 sin((A+B)/2) cos((A-B)/2)", "B": "2 cos((A+B)/2) sin((A-B)/2)", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of cos 12° + cos 84° + cos 132° + cos 156° is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "-1/2", "B": "1/2", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If A + B + C = 180°, then sin 2A + sin 2B + sin 2C = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "4 sin A sin B sin C", "B": "4 cos A cos B cos C", "C": "1 + 4 sin A sin B sin C", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of tan 1° tan 2° ... tan 89° is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1", "B": "0", "C": "∞", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If cos θ + sin θ = √2 cos θ, then cos θ - sin θ = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "√2 sin θ", "B": "√2 cos θ", "C": "sin θ", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The period of sin(4x+3) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "π / 2", "B": "2π", "C": "π / 4", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Maximum value of a cos θ + b sin θ is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "√(a² + b²)", "B": "a + b", "C": "a² + b²", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If tan α = m/(m+1) and tan β = 1/(2m+1), then α + β = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "45°", "B": "30°", "C": "60°", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of cot A cot B + cot B cot C + cot C cot A when A+B+C=90° is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1", "B": "0", "C": "-1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of sin² 5° + sin² 10° + ... + sin² 90° is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "9.5", "B": "9", "C": "10", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(trig_file, trig_new)
print("Updated Trigonometry Upto Transformations.")
