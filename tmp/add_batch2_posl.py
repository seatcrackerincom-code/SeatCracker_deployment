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

# Pair of Straight Lines: 18 Hard questions
posl_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\pair_of_straight_lines.json'
posl_new = [
    {"question": "The combined equation of the lines passing through the origin and perpendicular to the lines represented by ax² + 2hxy + by² = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "bx² - 2hxy + ay² = 0", "B": "bx² + 2hxy + ay² = 0", "C": "ax² - 2hxy + by² = 0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If the lines represented by 6x² + 5xy - 6y² + 32x + 4y + k = 0 are perpendicular, then k = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "-10", "B": "10", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The angle between the pair of lines x² - 7xy + 12y² = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "tan⁻¹(1/7)", "B": "tan⁻¹(7/13)", "C": "tan⁻¹(1)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If h² = ab, then the lines represented by ax² + 2hxy + by² = 0 are ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "Coincident", "B": "Perpendicular", "C": "Imaginary", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The point of intersection of the lines represented by x² - xy - 6y² - 7x + 31y - 18 = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(4, 2)", "B": "(2, 4)", "C": "(-1, 3)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The distance between the parallel lines represented by 4x² + 12xy + 9y² - 6x - 9y + 2 = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "1 / √13", "B": "2 / √13", "C": "1 / 13", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If the pair of lines ax² + 2hxy + by² + 2gx + 2fy + c = 0 represents two parallel lines, then ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "h² = ab and af² = bg²", "B": "h² = ab and ag² = bf²", "C": "h² + ab = 0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Angle between the lines represented by (x² + y²) sin²α = (x cos θ - y sin θ)² is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "2α", "B": "α", "C": "π/2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The centroid of the triangle formed by the lines ax² + 2hxy + by² = 0 and lx + my = 1 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "( (bl-hm)/3(am²-2hlm+bl²), (am-hl)/3(am²-2hlm+bl²) )", "B": "(l/3, m/3)", "C": "(0, 0)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If the pair of lines x² - 2pxy - y² = 0 and x² - 2qxy - y² = 0 are such that each pair bisects the angle between the other, then ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "pq = -1", "B": "pq = 1", "C": "p + q = 0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The product of the perpendiculars from (x₁, y₁) to the lines ax² + 2hxy + by² = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "|ax₁² + 2hx₁y₁ + by₁²| / √((a-b)² + 4h²)", "B": "|ax₁ + by₁| / √(a²+b²)", "C": "ab / h", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Area of the triangle formed by the lines ax² + 2hxy + by² = 0 and lx + my + n = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(n²√(h²-ab)) / |am² - 2hlm + bl²|", "B": "n² / |ab|", "C": "h² - ab", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Combined equation of bisectors of angles between ax² + 2hxy + by² = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(x² - y²) / (a - b) = xy / h", "B": "(x² + y²) / (a + b) = xy / h", "C": "h(x² - y²) + (a - b)xy = 0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If the lines joining the origin to the points of intersection of y = mx + c and x² + y² = a² are perpendicular, then ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "c² = a²(1 + m²)", "B": "c² = a²(1 + m²)/2", "C": "2c² = a²(1 + m²)", "D": "None"}, "answer": "C", "pyq": False, "tag": "hard"},
    {"question": "If the lines represent a triangle's height, then the intersection of ax² + 2hxy + by² = 0 and y = k is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "Origin as a vertex", "B": "Area is k²", "C": "Perpendicularity at origin", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If λx² - 10xy + 12y² + 5x - 16y - 3 = 0 represents a pair of lines, then λ = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "2", "B": "1", "C": "3", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The condition that one of the lines ax² + 2hxy + by² = 0 bisects the angle between the axes is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(a+b)² = 4h²", "B": "a+b = 0", "C": "h² = ab", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The pair of lines hxy + gx + fy + c = 0 represents two lines if ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "fg = hc", "B": "fh = gc", "C": "gh = fc", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(posl_file, posl_new)
print("Updated Pair of Straight Lines.")
