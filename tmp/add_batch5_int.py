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

# Integration: 18 Hard questions
int_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\integration.json'
int_new = [
    {"question": "The integral of 1 / (1 + cos x) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "tan(x/2) + C", "B": "cot(x/2) + C", "C": "sec(x/2) + C", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "∫ e^x (sin x + cos x) dx = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "e^x sin x + C", "B": "e^x cos x + C", "C": "e^x tan x + C", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The integral of log x dx is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "x log x - x + C", "B": "log x + C", "C": "x log x + C", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "∫ 1 / (x² + a²) dx = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(1/a) tan⁻¹(x/a) + C", "B": "tan⁻¹(x/a) + C", "C": "sin⁻¹(x/a) + C", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "∫ 1 / √(a² - x²) dx = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "sin⁻¹(x/a) + C", "B": "cos⁻¹(x/a) + C", "C": "tan⁻¹(x/a) + C", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Integrating by parts: ∫ u dv = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "uv - ∫ v du", "B": "uv + ∫ v du", "C": "∫ u v dx", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "∫ sec² x dx = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "tan x + C", "B": "sec x tan x + C", "C": "-cot x + C", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "∫ tan x dx = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "ln |sec x| + C", "B": "ln |sin x| + C", "C": "sec² x + C", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "∫ sin³ x dx = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(1/3) cos³ x - cos x + C", "B": "None", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The integral of 1 / (x log x) dx is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "log(log x) + C", "B": "log x + C", "C": "1/log x + C", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "∫ sqrt(a² - x²) dx = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "0.5 [x√(a²-x²) + a² sin⁻¹(x/a)] + C", "B": "None", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "∫ 1 / (x² - a²) dx = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(1/2a) ln|(x-a)/(x+a)| + C", "B": "None", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "∫ e^ax sin bx dx = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(e^ax / (a²+b²)) (a sin bx - b cos bx) + C", "B": "None", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Substitution for integral ∫ √(a² - x²) dx is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "x = a sin θ", "B": "x = a tan θ", "C": "x = a sec θ", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The integral of x e^x dx is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(x-1)e^x + C", "B": "xe^x + C", "C": "e^x + C", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "∫ (dx) / (x² + 2x + 5) = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(1/2) tan⁻¹((x+1)/2) + C", "B": "None", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The constant of integration C is added because ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Derivative of constant is zero", "B": "To make it pretty", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "∫ sin² x dx = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "x/2 - (sin 2x)/4 + C", "B": "x/2 + (sin 2x)/4 + C", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(int_file, int_new)
print("Updated Integration.")
