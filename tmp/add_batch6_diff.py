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

# Differentiation: 16 Hard questions
diff_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\differentiation.json'
diff_new = [
    {"question": "The derivative of sin⁻¹ x is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1 / √(1 - x²)", "B": "-1 / √(1 - x²)", "C": "1 / (1 + x²)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If y = x^x, then dy/dx = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "x^x (1 + log x)", "B": "x^x log x", "C": "x x^{x-1}", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Derivative of tan⁻¹ x is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1 / (1 + x²)", "B": "1 / (1 - x²)", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If y = log(sec x + tan x), then dy/dx = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "sec x", "B": "tan x", "C": "sec x + tan x", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If x = a cos θ, y = b sin θ, then dy/dx = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "-(b/a) cot θ", "B": "(b/a) tan θ", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The derivative of f(g(x)) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "f'(g(x)) g'(x)", "B": "f'(g(x))", "C": "f'(x) g'(x)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If y = √(sin x + √(sin x + ...)), then dy/dx = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "cos x / (2y - 1)", "B": "sin x / (2y - 1)", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The derivative of log |x| is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1/x", "B": "-1/x", "C": "1/|x|", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If y = sin(mx), the second derivative d²y/dx² is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "-m² y", "B": "-m y", "C": "m² y", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If x² + y² = a², then dy/dx = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "-x/y", "B": "-y/x", "C": "x/y", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The derivative of a^x is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "a^x log a", "B": "x a^{x-1}", "C": "a^x", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If y = e^f(x), then dy/dx = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "e^f(x) f'(x)", "B": "e^f(x)", "C": "f'(x)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The nth derivative of log(x+a) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(-1)^{n-1} (n-1)! / (x+a)ⁿ", "B": "None", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Leibniz formula is used for ______ derivative of product of two functions.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "nth", "B": "1st", "C": "2nd", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If y = cos⁻¹((1-x²)/(1+x²)), then dy/dx = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "2 / (1 + x²)", "B": "-2 / (1 + x²)", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The derivative of xⁿ is n x^{n-1} for ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "All real n", "B": "Only integers", "C": "Only positive n", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(diff_file, diff_new)
print("Updated Differentiation.")
