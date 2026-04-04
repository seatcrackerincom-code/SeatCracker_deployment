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

# Partial Fractions: 15 Hard questions
pf_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\partial_fractions.json'
pf_new = [
    {"question": "If 1 / ((x+1)(x+2)) = A/(x+1) + B/(x+2), then A + B = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "0", "B": "1", "C": "-1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The partial fraction of (2x+3) / ((x+1)²) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "2/(x+1) + 1/(x+1)²", "B": "2/(x+1) - 1/(x+1)²", "C": "1/(x+1) + 2/(x+1)²", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If (x²+1) / ((x-1)(x-2)(x-3)) = A/(x-1) + B/(x-2) + C/(x-3), then A = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1", "B": "5", "C": "10", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Partial fraction decomposition of 1 / (x³ + 1) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1/3(x+1) - (x-2)/3(x²-x+1)", "B": "1/(x+1) + (x+1)/(x²-x+1)", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If (3x+4) / ((x+1)(x-2)) = A/(x+1) + B/(x-2), then B = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "10/3", "B": "1/3", "C": "3", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The number of partial fractions for 1 / ((x²+1)(x²+2)) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "2", "B": "4", "C": "1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "In the partial fraction of P(x)/Q(x), if deg(P) ≥ deg(Q), we must first ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Divide P(x) by Q(x)", "B": "Multiply P(x) by Q(x)", "C": "Factorize Q(x)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The coefficient of 1/(x+1) in partial fraction of (x+5) / (x²+x-6) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Depends on factors", "B": "1", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If (x+1) / ((x-1)²(x-2)) = A/(x-1) + B/(x-1)² + C/(x-2), then C = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "3", "B": "1", "C": "-2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Partial fraction of (x²) / (x²-1) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1 + 1/2(x-1) - 1/2(x+1)", "B": "1/(x-1) - 1/(x+1)", "C": "1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If 1 / (x(x+1)...(x+n)) = Σ A_r / (x+r), then A_0 = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1/n!", "B": "n!", "C": "1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The general form of partial fraction for a repeated irreducible quadratic factor (x²+ax+b)² is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(Ax+B)/(x²+ax+b) + (Cx+D)/(x²+ax+b)²", "B": "A/(x²+ax+b)", "C": "Ax + B", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If (x²+3x+1) / (x²-5x+6) = 1 + A/(x-2) + B/(x-3), then A = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "-11", "B": "19", "C": "8", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The number of constants to be determined in the partial fractions of (x²+1) / ((x-1)³(x+2)) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "4", "B": "3", "C": "2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Partial fraction of (f(x))/(x-a) involves a constant calculated as ______ (Heaviside's method).", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "f(a)", "B": "f'(a)", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(pf_file, pf_new)
print("Updated Partial Fractions.")
