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

# Functions: 29 Hard questions
func_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\functions.json'
func_new = [
    {"question": "The domain of f(x) = √(3 - x) + sinh⁻¹ x is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(-∞, 3]", "B": "[3, ∞)", "C": "(-∞, ∞)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If f(x) = x / (x-1) and g(x) = 1 / (x-2), the domain of (f+g)(x) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "R - {1, 2}", "B": "R", "C": "R - {1}", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The range of f(x) = 1 / (2 - cos 3x) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "[1/3, 1]", "B": "(-∞, ∞)", "C": "[0, 1]", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If f: R -> R is defined by f(x) = x², then it is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Neither one-one nor onto", "B": "One-one and onto", "C": "One-one but not onto", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The inverse of f(x) = 3x - 5 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(x+5) / 3", "B": "3x + 5", "C": "x / 3 + 5", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If f(x+y) = f(x) + f(y) for all x, y in R and f(1) = 7, then Σ f(r) from r=1 to n is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "7n(n+1) / 2", "B": "7n", "C": "7n²", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The period of f(x) = cos(x/3) + sin(x/2) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "12π", "B": "6π", "C": "2π", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "A function f: A -> B is onto if ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Range of f = B", "B": "f(x) = f(y) => x = y", "C": "Every x has a unique y", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If f(x) = |x| and g(x) = [x], then f(g(-1/2)) = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1", "B": "0", "C": "0.5", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The function f(x) = log(x + √(x² + 1)) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Odd function", "B": "Even function", "C": "Neither", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If f(x) = (a^x + a^-x) / 2, then f(x+y) + f(x-y) = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "2 f(x) f(y)", "B": "f(x) f(y)", "C": "2 f(x+y)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If f is even and g is odd, then fog is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Even", "B": "Odd", "C": "Neither", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of f(f(x)) if f(x) = 1 / (1-x) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(x-1) / x", "B": "x", "C": "1-x", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If A = {1, 2, 3} and B = {4, 5}, the number of functions from A to B is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "8", "B": "9", "C": "6", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Domain of f(x) = log(x-1) + log(4-x) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(1, 4)", "B": "[1, 4]", "C": "(-∞, 4)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If f(x) = cos(log x), then f(x) f(y) - 0.5(f(x/y) + f(xy)) = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "0", "B": "1", "C": "cos(log x + log y)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Range of f(x) = sin x / x is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(-1, 1)", "B": "[-1, 1]", "C": "(0, 1]", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If f(x) = x+1, then f(f(f(x))) = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "x+3", "B": "3x+3", "C": "x³+1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Number of one-one functions from A to B if n(A)=3 and n(B)=4 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "24", "B": "64", "C": "12", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If f: R -> R, f(x) = cos x, then f is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Many-one", "B": "One-one", "C": "Onto", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If f(x) = (x+1)/(x-1), then f(f(x)) = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "x", "B": "1/x", "C": "x+1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The domain of f(x) = √(x² - 5x + 6) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(-∞, 2] U [3, ∞)", "B": "[2, 3]", "C": "R", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Which of the following is not a function from A to B?", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "One element in A has two images", "B": "One element in B has two preimages", "C": "Some element in B has no preimage", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The identity function I on A is defined as ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "I(x) = x", "B": "I(x) = 1", "C": "I(x) = 0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If f(x) = x + 1/x, then f(x) = f(1/x) for ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "All x ≠ 0", "B": "Only x = 1", "C": "Only x = -1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Range of f(x) = [x] - x is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(-1, 0]", "B": "[0, 1)", "C": "R", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If n(A) = p, then number of subsets of A is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "2^p", "B": "p²", "C": "2p", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If f(x) = x³ - 1/x³, then f(x) + f(1/x) = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "0", "B": "2 f(x)", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Number of onto functions from A to A if n(A) = n is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "n!", "B": "n^n", "C": "2^n", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(func_file, func_new)
print("Updated Functions.")
