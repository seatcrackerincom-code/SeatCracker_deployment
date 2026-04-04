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

# Quadratic Equations and Expressions: 24 Hard questions
quad_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\quadratic_equations_and_expressions.json'
quad_new = [
    {"question": "If α and β are roots of ax² + bx + c = 0, then the equation whose roots are 1/α and 1/β is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "cx² + bx + a = 0", "B": "ax² - bx + c = 0", "C": "cx² - bx + a = 0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If the roots of ax² + bx + c = 0 are in the ratio m:n, then ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "mnb² = ac(m+n)²", "B": "mna² = bc(m+n)²", "C": "mnc² = ab(m+n)²", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If α, β are roots of x² - px + q = 0, then α/β + β/α = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(p²-2q)/q", "B": "(p²-q)/q", "C": "p²/q", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The condition that one root of ax² + bx + c = 0 is square of the other is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "b³ + a²c + ac² = 3abc", "B": "b³ + a²c + ac² = 0", "C": "a + c + b = 0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If α, β are roots of x² - 6x + 2 = 0, then α¹⁰ - 2α⁸ / 2α⁹ = ______ (approx Newton's Sums application).", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "3", "B": "6", "C": "12", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The minimum value of f(x) = ax² + bx + c for a > 0 occurs at x = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "-b / 2a", "B": "b / 2a", "C": "4ac-b² / 4a", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Maximum value of -3x² + 4x + 7 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "25 / 3", "B": "7", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Number of real roots of |x|² - 3|x| + 2 = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "4", "B": "2", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If the equations x² + ax + b = 0 and x² + bx + a = 0 have a common root, then a + b = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "-1", "B": "1", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The expression x² + 2bx + c is positive for all real x if ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "b² < c", "B": "b² > c", "C": "b² = c", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If α, β are roots of ax² + bx + c = 0, then the sum of roots of ax² + bpx + cp² = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "p(α+β)", "B": "α+β", "C": "p²(α+β)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The roots of (x-a)(x-b) = k² are always ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Real", "B": "Imaginary", "C": "Equal", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If x is real, the maximum value of (x²+14x+9)/(x²+2x+3) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "4", "B": "5", "C": "6", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The constant term in the equation whose roots are square of roots of x² - px + q = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "q²", "B": "q", "C": "p²", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Condition for ax² + bx + c = 0 to have both roots greater than k is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "D≥0, -b/2a > k and af(k) > 0", "B": "af(k) < 0", "C": "D < 0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If the roots of (b-c)x² + (c-a)x + (a-b) = 0 are equal, then a, b, c are in ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "AP", "B": "GP", "C": "HP", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Find the range of x² - 3x + 4 / x² + 3x + 4 for x in R.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "[1/7, 7]", "B": "[0, ∞]", "C": "[-7, 1/7]", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The number of real solutions of e^x = x is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "0", "B": "1", "C": "2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If sum of roots is S and product is P, the equation is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "x² - Sx + P = 0", "B": "x² + Sx + P = 0", "C": "Px² - Sx + 1 = 0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If roots of x² - bx + c = 0 are two consecutive integers, then b² - 4c = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1", "B": "0", "C": "2", "D": "4"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If α, β are roots of x² - px + q = 0, then the value of α³ + β³ is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "p³ - 3pq", "B": "p³ + 3pq", "C": "p³ - pq", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Difference of the roots of x² - px + q = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "√(p² - 4q)", "B": "p² - 4q", "C": "p - q", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If α+β=5 and αβ=6, then α²-β² (where α>β) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "5", "B": "1", "C": "25", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Condition for ax² + bx + c = 0 to have roots with opposite signs is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "ac < 0", "B": "ac > 0", "C": "b² < 4ac", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(quad_file, quad_new)
print("Updated Quadratic Equations.")
