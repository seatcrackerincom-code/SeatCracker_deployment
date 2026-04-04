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

# System of Circles: 23 Hard questions
soc_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\system_of_circles.json'
soc_new = [
    {"question": "The radical axis of two circles S = 0 and S' = 0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "S - S' = 0", "B": "S + S' = 0", "C": "SS' = 0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The condition for two circles to intersect orthogonally is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "2gg' + 2ff' = c + c'", "B": "g' + f' = c", "C": "2(g+g') = c", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The radical axis of two circles is always ______ to the line joining their centers.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Perpendicular", "B": "Parallel", "C": "Coincident", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The point of intersection of radical axes of three circles taken in pairs is called ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Radical Center", "B": "Circumcenter", "C": "Orthocenter", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If two circles touch each other, their radical axis is their ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Common tangent at point of contact", "B": "Line of centers", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The collection of circles in which every pair has the same radical axis is called ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Coaxal System", "B": "Orthogonal System", "C": "Concentric System", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Limiting points of a coaxal system of circles are circles of ______ radius.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Zero", "B": "Unit", "C": "Infinite", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The equation of any circle in a coaxal system with radical axis x=0 is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "x² + y² + 2gx + c = 0", "B": "x² + y² + 2fy + c = 0", "C": "x² + y² = c", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": " Radical axis of three circles are ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Concurrent or Parallel", "B": "Always Concurrent", "C": "Always Parallel", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Distance of the radical center from any of the three circles along a tangent is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Equal", "B": "Different", "C": "Zero", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The radical axis of two circles S and S' passes through their points of intersection if they ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Intersect", "B": "Are separate", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If two circles are concentric, their radical axis is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "At infinity", "B": "Not defined", "C": "x=0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Orthogonal circle to three given circles has its center at the ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Radical Center", "B": "Centroid", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Radius of the circle orthogonal to three circles is ______ to radical center.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Length of tangent from RC to any circle", "B": "None", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Condition for circles x²+y²+2gx+c=0 and x²+y²+2g'x+c=0 to be orthogonal is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "2gg' = c+c'", "B": "g=g'", "C": "c=0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Common chord of two intersecting circles is along their ______ axis.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Radical", "B": "Major", "C": "Minor", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Position of limiting points is proportional to ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "±√c", "B": "c²", "C": "g/f", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Intercept on the radical axis by any circle of a coaxal system is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Constant", "B": "Variable", "C": "Zero", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Number of circles cutting three non-intersecting circles orthogonally is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "One", "B": "Zero", "C": "Infinite", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Equation of common tangent to two circles touching externally is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "S - S' = 0", "B": "S + S' = 0", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Intersection points of radical axes of four circles taken in triples is a ______ center property.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Complex", "B": "Simple", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If a circle S = 0 cuts circle S' = 0 orthogonally, then the power of its center wrt S' is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "r²", "B": "0", "C": "1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The locus of centers of circles cutting two given circles orthogonally is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Radical Axis", "B": "Circle", "C": "Pair of lines", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(soc_file, soc_new)
print("Updated System of Circles.")
