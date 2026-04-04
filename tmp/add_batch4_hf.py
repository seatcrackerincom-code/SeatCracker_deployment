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

# Hyperbolic Functions: 26 Hard questions
hf_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\hyperbolic_functions.json'
hf_new = [
    {"question": "If cosh x = sec θ, then sinh x = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "tan θ", "B": "sin θ", "C": "cos θ", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of sinh⁻¹ x is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "ln(x + √(x² + 1))", "B": "ln(x - √(x² + 1))", "C": "sin⁻¹ x", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "cosh² x - sinh² x = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1", "B": "-1", "C": "cosh 2x", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "sinh 2x in terms of sinh x and cosh x is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "2 sinh x cosh x", "B": "sinh x cosh x", "C": "cosh² x + sinh² x", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If sinh x = 3/4, then cosh 2x = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "17/8", "B": "25/16", "C": "1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "In hyperbolic functions, cosh(x+y) = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "cosh x cosh y + sinh x sinh y", "B": "cosh x cosh y - sinh x sinh y", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The derivative of sinh x is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "cosh x", "B": "-cosh x", "C": "sech² x", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The derivative of cosh x is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "sinh x", "B": "-sinh x", "C": "cosech² x", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of sinh 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "0", "B": "1", "C": "-1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of cosh 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1", "B": "0", "C": "-1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If x = log(tan(π/4 + θ/2)), then sinh x = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "tan θ", "B": "sin θ", "C": "sec θ", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "tanh x in terms of e is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(e^x - e^-x) / (e^x + e^-x)", "B": "e^x + e^-x", "C": "e^x - e^-x", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "cosh 2x in terms of cosh x is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "2 cosh² x - 1", "B": "2 cosh² x + 1", "C": "cosh² x + 1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "sinh(ix) = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "i sin x", "B": "sin(ix)", "C": "cos x", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "cosh(ix) = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "cos x", "B": "i cos x", "C": "sinh x", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The domain of cosh x is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(-∞, ∞)", "B": "[1, ∞)", "C": "(0, ∞)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The range of cosh x is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "[1, ∞)", "B": "(-∞, ∞)", "C": "(0, 1)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of tanh⁻¹ x is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1/2 ln((1+x)/(1-x))", "B": "ln(1+x)", "C": "1/2 ln(1-x)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If cosh x = 5/4, then sinh x = ______ (x > 0).", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "3/4", "B": "4/5", "C": "3/5", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "sinh(x-y) = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "sinh x cosh y - cosh x sinh y", "B": "sinh x cosh y + cosh x sinh y", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "sech² x + tanh² x = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1", "B": "-1", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "cosh⁻¹ x = ______ (x ≥ 1).", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "ln(x + √(x² - 1))", "B": "ln(x - √(x² - 1))", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The period of hyperbolic functions is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "None (non-periodic)", "B": "2π", "C": "i 2π", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "sinh x + sinh y = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "2 sinh((x+y)/2) cosh((x-y)/2)", "B": "2 cosh((x+y)/2) sinh((x-y)/2)", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of (cosh x + sinh x)ⁿ is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "cosh nx + sinh nx", "B": "cosh nx - sinh nx", "C": "1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If tanh x = 1/2, then e²x = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "3", "B": "2", "C": "log 3", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(hf_file, hf_new)
print("Updated Hyperbolic Functions.")
