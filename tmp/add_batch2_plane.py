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

# Plane: 25 Hard questions
plane_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\plane.json'
plane_new = [
    {"question": "Equation of the plane passing through (1,2,3) and parallel to the plane 3x + 4y - 5z = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "3x + 4y - 5z + 4 = 0", "B": "3x + 4y - 5z - 4 = 0", "C": "x + y + z = 6", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The angle between the planes 2x - y + z = 1 and x + y + 2z = 3 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "60°", "B": "30°", "C": "45°", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The perpendicular distance of the point (2,3,4) from the plane 3x - 6y + 2z + 11 = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "1", "B": "2", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The equation of the plane passing through the intersection of the planes x + y + z = 6 and 2x + 3y + 4z + 5 = 0 and the point (1,1,1) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "20x + 23y + 26z - 69 = 0", "B": "x + y + z = 3", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If the planes 2x + 3y + kz = 0 and x + 2y + 3z = 0 are perpendicular, then k = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "-8/3", "B": "8/3", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Equation of the plane containing the line (x-1)/2 = (y-2)/3 = (z-3)/4 and parallel to x-axis is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "4y - 3z + 1 = 0", "B": "2y - z = 0", "C": "y + z = 5", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The foot of the perpendicular from the origin to the plane 2x + 3y - z + 14 = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(-2, -3, 1)", "B": "(2, 3, -1)", "C": "(0, 0, 0)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The points (1,1,1) and (-3,0,1) are on the ______ side of the plane 3x + 4y - 12z + 13 = 0.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "Same", "B": "Opposite", "C": "On the plane", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The distance between the parallel planes 2x - y + 2z + 3 = 0 and 4x - 2y + 4z + 5 = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "1/6", "B": "1/3", "C": "1/2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Equation of the plane passing through (a,0,0), (0,b,0), (0,0,c) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "x/a + y/b + z/c = 1", "B": "ax + by + cz = 1", "C": "x+y+z = a+b+c", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The image of the point (1,3,4) in the plane 2x - y + z + 3 = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(-3, 5, 2)", "B": "(3, -5, -2)", "C": "(-1, 0, 0)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Angle between the plane x + 2y - 2z = 5 and the line (x-1)/2 = (y-3)/3 = (z-2)/6 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "sin⁻¹(4/21)", "B": "cos⁻¹(4/21)", "C": "45°", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The planes x + y + z = 1 and 2x + 3y - z = 4 intersect in a line whose direction ratios are ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(-4, 3, 1)", "B": "(1, 1, 1)", "C": "(2, 3, -1)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The distance of the point (1,-2,3) from the plane x - y + z = 5 measured parallel to the line x/2 = y/3 = z/(-6) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "1", "B": "2", "C": "7", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If the plane ax + by + cz + d = 0 is parallel to the z-axis, then ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "c = 0", "B": "a=0, b=0", "C": "d = 0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Find the intercepts of the plane 3x + 4y - 7z = 84 on the coordinate axes.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(28, 21, -12)", "B": "(3, 4, -7)", "C": "(1, 1, 1)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Equation of the plane passing through (1,2,-1) and (3,0,2) and perpendicular to the plane x - y + 2z = 5 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "x + 7y + 3z - 12 = 0", "B": "x - y + z = 0", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The locus of points equidistant from the planes x + 2y + 2z = 3 and 2x - y + 2z = 5 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "x - 3y + 2 = 0 or 3x + y + 4z - 8 = 0", "B": "x + y + z = 1", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The projection of the line segment joining (1,2,3) and (4,5,6) on the plane x + y + z = 1 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "√6", "B": "3√2", "C": "6", "D": "None"}, "answer": "B", "pyq": False, "tag": "hard"},
    {"question": "Equation of the plane containing the parallel lines (x-1)/2 = (y-2)/3 = (z-3)/4 and (x-2)/2 = (y-3)/3 = (z-4)/4 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "x - y + 1 = 0", "B": "y - z + 1 = 0", "C": "x - z + 2 = 0", "D": "None"}, "answer": "B", "pyq": False, "tag": "hard"},
    {"question": "The area of the triangle formed by the intersection of the plane x/a + y/b + z/c = 1 with the coordinate axes is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "0.5 * √(a²b² + b²c² + c²a²)", "B": "0.5 * abc", "C": "a + b + c", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The point of intersection of the plane 2x + y - z = 3 and the line passing through (1,2,3) and (4,5,6) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(-2, -1, 0)", "B": "(1, 2, 3)", "C": "(0, 0, 0)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If the length of perpendicular from origin to a plane is p and its DCs are l, m, n, then its equation is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "lx + my + nz = p", "B": "lx + my + nz + p = 0", "C": "x/l + y/m + z/n = p", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The ratio in which the plane 2x + 3y + 4z = 13 divides the segment joining (1,2,1) and (3,4,3) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1 : 3", "B": "3 : 1", "C": "2 : 3", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Find the plane through (1,1,1) perpendicular to the planes x + 2y + 3z = 7 and 2x - 3y + 4z = 0.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "17x + 2y - 7z - 12 = 0", "B": "x - y + z = 1", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(plane_file, plane_new)
print("Updated Plane.")
