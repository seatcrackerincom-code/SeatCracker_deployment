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

# Definite Integrals: 17 Hard questions
di_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\definite_integrals.json'
di_new = [
    {"question": "The value of ∫₀ᶿ sin x dx / (sin x + cos x) from 0 to π/2 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "π / 4", "B": "π / 2", "C": "1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "∫₀¹ x(1-x)ⁿ dx = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1 / ((n+1)(n+2))", "B": "1 / (n+1)²", "C": "n!", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of ∫₀ᶿ log(sin x) dx from 0 to π/2 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "-(π/2) log 2", "B": "(π/2) log 2", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "∫₀ᶿ (f(x) / (f(x) + f(a-x))) dx from 0 to a is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "a / 2", "B": "a", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "∫₋ₐᵃ f(x) dx is 0 if f(x) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Odd function", "B": "Even function", "C": "Positive", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "∫₋ₐᵃ f(x) dx is 2 ∫₀ᵃ f(x) dx if f(x) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Even function", "B": "Odd function", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of ∫₀ᶿ sinⁿ x dx from 0 to π/2 (for n is even) involves ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Wallis Formula with π/2", "B": "Only integers", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "∫₀ᶿ cosⁿ x dx from 0 to π/2 (for n is odd) involves ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Wallis Formula with 1", "B": "π", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The limit as n->∞ of Σ (1/n) f(r/n) is equivalent to ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "∫₀¹ f(x) dx", "B": "Sum from 1 to n", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The area bounded by y = x², x-axis and x = 2 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "8 / 3", "B": "4 / 3", "C": "2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The area bounded by y = sin x from 0 to π is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "2", "B": "1", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "∫₀ᵏ [x] dx (where k is integer) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "k(k-1)/2", "B": "k²/2", "C": "k", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of ∫₋₁¹ |x| dx is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1", "B": "0", "C": "2", "D": "0.5"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If f(2a-x) = f(x), then ∫₀²ᵃ f(x) dx = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "2 ∫₀ᵃ f(x) dx", "B": "0", "C": "f(a)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "∫₀ᶿ sin⁷ x dx from 0 to π/2 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "16 / 35", "B": "8 / 15", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of ∫₀ᵏ x³ dx / (x³ + (k-x)³) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "k / 2", "B": "k", "C": "k / 3", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Definite integral represents ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Area under curve", "B": "Slope of tangent", "C": "Length of arc", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(di_file, di_new)
print("Updated Definite Integrals.")
