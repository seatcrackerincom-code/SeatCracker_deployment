import json
import os

def append_questions(file_path, new_questions):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Renumber to be safe
    for i, q in enumerate(data['questions']):
        q['id'] = i + 1
        
    start_id = len(data['questions']) + 1
    for i, q in enumerate(new_questions):
        q['id'] = start_id + i
        data['questions'].append(q)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Locus: 16 Hard questions
locus_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\locus.json'
locus_new = [
    {
        "question": "The locus of a point P such that the sum of the squares of its distances from the points (a,0) and (-a,0) is 2c² is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "x² + y² = c² - a²", "B": "x² + y² = c² + a²", "C": "x² - y² = c²", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "A point moves so that its distance from the y-axis is half of its distance from the origin. The locus is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "3x² - y² = 0", "B": "x² - 3y² = 0", "C": "y² - 3x² = 0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The locus of a point which moves such that its distance from the point (0,0) is twice its distance from the line x = 3 is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "3x² - y² - 24x + 36 = 0", "B": "x² + 3y² = 36", "C": "3x² + y² = 36", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The locus of the centroid of a triangle whose vertices are (a cos t, a sin t), (b sin t, -b cos t) and (1, 0), where t is a parameter, is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "(3x-1)² + (3y)² = a² + b²", "B": "x² + y² = a² + b²", "C": "(x-1)² + y² = a² + b²", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "If the sum of distances of a point P from two perpendicular lines is 1, then the locus of P is a ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "Square", "B": "Circle", "C": "Straight Line", "D": "Pair of lines"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "Locus of a point P such that PA² + PB² = 2k² where A=(3,4,5) and B=(-1,3,-7) is a ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "Sphere", "B": "Circle", "C": "Parabola", "D": "Hyperbola"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "Find the locus of a point which is equidistant from (1,3) and the x-axis.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "x² - 2x - 6y + 10 = 0", "B": "y² - 6y - 2x + 10 = 0", "C": "x² + y² = 10", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The locus of a point which moves such that the square of its distance from the origin is equal to its distance from the line y = 2 is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "x² + y² = |y-2|", "B": "x² + y² = y - 2", "C": "x² + y² = 4", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The locus of a point P such that the area of triangle PAB is 10 sq units, where A=(2,3) and B=(-4,5) is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "x + 3y - 3 = 0 or x + 3y - 23 = 0", "B": "x - 3y + 20 = 0", "C": "3x + y = 10", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The locus of a point which moves such that the sum of the squares of its distances from the sides of a square is constant is a ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "Circle", "B": "Square", "C": "Ellipse", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The locus of the point of intersection of the lines x/a + y/b = k and x/a - y/b = 1/k is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "x²/a² - y²/b² = 1", "B": "x²/a² + y²/b² = 1", "C": "xy = ab", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "Locus of a point P such that arg(z-1)/arg(z+1) = π/3 is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "A part of a circle", "B": "A straight line", "C": "An ellipse", "D": "A parabola"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "If A=(1,1) and B=(-2,3) are two points, then the locus of a point P such that area of ΔPAB is 9 is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "2x + 3y - 23 = 0", "B": "2x + 3y + 13 = 0", "C": "Both A and B", "D": "None"}, "answer": "C", "pyq": False, "tag": "hard"
    },
    {
        "question": "The locus of a point which moves so that the difference of its distances from (5,0) and (-5,0) is 8 is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "x²/16 - y²/9 = 1", "B": "x²/9 - y²/16 = 1", "C": "x²/25 + y²/16 = 1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "A line segment of fixed length L slides with its endpoints on the coordinate axes. The locus of the midpoint is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "x² + y² = L²/4", "B": "x² + y² = L²", "C": "x² + y² = L²/2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The locus of a point whose distance from the origin is 3 times its distance from the plane z = 0 is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "x² + y² - 8z² = 0", "B": "x² + y² + z² = 9", "C": "x² + y² = 9z²", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    }
]

append_questions(locus_file, locus_new)
print("Updated Locus.")
