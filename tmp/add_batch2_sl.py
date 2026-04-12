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

# Straight Lines: 30 Hard questions
sl_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\straight_lines.json'
sl_new = [
    {"question": "The coordinates of the foot of the perpendicular from (1,3) to the line 3x - 4y - 16 = 0 are ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(4, -1)", "B": "(1, -1)", "C": "(-4, 1)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The orthocenter of the triangle formed by the lines x - 2y + 9 = 0, x + y - 9 = 0 and 2x - y - 9 = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(5, 7)", "B": "(1, 1)", "C": "(0, 0)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Equation of the line passing through (2,3) and making an angle of 45° with the line x - y = 5 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "x = 2 or y = 3", "B": "x + y = 5", "C": "2x - y = 1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The distance between the lines 5x + 12y - 1 = 0 and 10x + 24y + 3 = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "5 / 26", "B": "5 / 13", "C": "1 / 13", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If the lines x + y - 1 = 0, 2x - y + 3 = 0 and kx + 2y - 5 = 0 are concurrent, then k = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "11/7", "B": "1", "C": "5", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The image of the point (4, -13) with respect to the line 5x + y + 6 = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(-1, -14)", "B": "(1, 14)", "C": "(-6, 3)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Area of the triangle formed by the lines y = x, y = 2x and y = 3x + 4 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "4", "B": "8", "C": "2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The lines (a+2b)x + (a-3b)y = a-b for different values of a and b pass through the fixed point ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(2/5, 3/5)", "B": "(1, 1)", "C": "(0, 0)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The obtuse angle between the lines x + y - 5 = 0 and x - 7y + 3 = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "135°", "B": "120°", "C": "150°", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Distance of the point (2,3) from the line 2x - 3y + 6 = 0 measured parallel to the line x - y = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "√2", "B": "1", "C": "2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The locus of the point of intersection of the lines x cos α + y sin α = a and x sin α - y cos α = b is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "x² + y² = a² + b²", "B": "x² + y² = a² - b²", "C": "x² - y² = a² + b²", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Area of the parallelogram formed by the lines y = mx + c, y = mx + d, y = nx + e, y = nx + f is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "|(c-d)(e-f)| / |m-n|", "B": "|(c+d)(e+f)| / |m-n|", "C": "|(c-d)| / |m-n|", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "A line passing through (h,k) splits the segment [a,b] in the ratio 2:1. Its equation is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "Depends on a, b", "B": "y - k = m(x - h)", "C": "x/h + y/k = 1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Equation of the internal bisector of the angle between 3x + 4y - 1 = 0 and 12x - 5y + 7 = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "9x - 13y + 6 = 0", "B": "21x + 7y + 6 = 0", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Point of intersection of the lines (1/ a)x + (1/ b)y = 1 and (1/ b)x + (1/ a)y = 1 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(ab/(a+b), ab/(a+b))", "B": "(a, b)", "C": "(1, 1)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The triangle with vertices (0,0), (3,0) and (0,4) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "Right angled", "B": "Equilateral", "C": "Isosceles", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Circumcenter of the triangle formed by (1,3), (0,-2) and (-3,1) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(-1, 1/2)", "B": "(0, 0)", "C": "(1, 1)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If the vertices of a triangle are (0,0), (a,0) and (x,y), then its area is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "0.5 * a * |y|", "B": "a * y", "C": "x * y", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Equation of the line whose portion intercepted between the axes is bisected at (p,q) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "x/p + y/q = 2", "B": "x/p + y/q = 1", "C": "px + qy = 1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If the slope of the line passing through (2,3) and (x,5) is 2, then x = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "3", "B": "4", "C": "1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Angle between the lines y = (2-√3)x + 5 and y = (2+√3)x - 7 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "30°", "B": "60°", "C": "45°", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Area of the region bounded by x/a + y/b = 1, x-axis and y-axis is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "0.5 * |ab|", "B": "|ab|", "C": "a² + b²", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The lines x - 2 = 0 and y + 3 = 0 intersect at ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(2, -3)", "B": "(-2, 3)", "C": "(0, 0)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Centroid of the triangle formed by the axes and the line x/a + y/b = 1 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(a/3, b/3)", "B": "(a/2, b/2)", "C": "(a, b)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The reflection of the point (1,2) in the origin is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(-1, -2)", "B": "(1, -2)", "C": "(-1, 2)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If a line makes equal intercepts on the coordinate axes and passes through (2,3), its equation is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "x + y = 5", "B": "x - y = 1", "C": "x + y = 1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The collinear points (1,2), (3,4) and (5,k) satisfy k = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "6", "B": "5", "C": "4", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Distance of origin from the line 3x + 4y - 10 = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "2", "B": "5", "C": "10", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The line x = y is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "Bisector of the first and third quadrants", "B": "Vertical line", "C": "Horizontal line", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Locus of the point of intersection of perpendicular tangents to a circle is its ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "Director Circle", "B": "Auxiliary Circle", "C": "Center", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(sl_file, sl_new)
print("Updated Straight Lines.")
