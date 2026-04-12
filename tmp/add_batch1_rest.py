import json
import os

def append_questions(file_path, new_questions):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    start_id = len(data['questions']) + 1
    for i, q in enumerate(new_questions):
        q['id'] = start_id + i
        data['questions'].append(q)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Areas: 21 Hard questions
areas_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\areas.json'
areas_new = [
    {
        "question": "The area bounded by the curves y = x², y = (1-x)², and y = 2x(1-x) is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "1/3", "B": "1/2", "C": "1/6", "D": "1"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "Area of region {(x, y) : x² ≤ y ≤ √x} is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "1/3", "B": "2/3", "C": "1", "D": "1/2"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The area of the region bounded by y² = 2x + 1 and x - y - 1 = 0 is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "16/3", "B": "8/3", "C": "4/3", "D": "2/3"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The area of the region bounded by the curves y = sin x, y = cos x and the y-axis (0 ≤ x ≤ π/4) is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "√2 - 1", "B": "√2 + 1", "C": "1", "D": "2"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The area bounded by the curve y = xeˣ², x-axis and the ordinate x = 1 is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "(e - 1) / 2", "B": "e / 2", "C": "e - 1", "D": "1/2"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "Area of the loop of the curve r = a sin 2θ is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "πa² / 8", "B": "πa² / 4", "C": "πa² / 2", "D": "πa²"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "Area common to the circles x² + y² = 4 and (x - 2)² + y² = 4 is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "8π/3 - 2√3", "B": "4π/3 - √3", "C": "8π/3 + 2√3", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "Area bounded by the curve y²(2a - x) = x³ (cissoid of Diocles) and its asymptote x = 2a is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "3πa²", "B": "2πa²", "C": "πa²", "D": "4πa²"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "Area between the parabola y² = 4ax and the chord x + y = 3a is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "64a² / 3", "B": "32a² / 3", "C": "16a² / 3", "D": "8a² / 3"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "Area bounded by the curve y = x³ - x and the x-axis is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "1/2", "B": "1/4", "C": "1", "D": "0"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "Area of the region {(x, y) : y² ≤ 4x, 4x² + 4y² ≤ 9} is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "9π/8 + √2/6", "B": "9π/4 + √2/3", "C": "9π/4 - √2/3", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "Area of the region bounded by y = [x] and x-axis from x=0 to x=3 (where [x] is G.I.F) is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "3", "B": "6", "C": "1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "Area bounded by y² = 4ax and x² = 4ay is 16a²/3. If this area is 1, then a = ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "√3 / 4", "B": "3/16", "C": "√3 / 2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The area bounded by y = x², y = 4 and x-axis is ______ (assuming first quadrant).",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "16 / 3", "B": "8 / 3", "C": "4 / 3", "D": "0"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The area of the loop of r = a cos 3θ is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "πa² / 12", "B": "πa² / 4", "C": "πa² / 6", "D": "πa² / 2"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The area bounded by y = tan x, y = cot x and x-axis (0 ≤ x ≤ π/2) is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "ln 2", "B": "(1/2) ln 2", "C": "2 ln 2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "Area of region bounded by x² + y² = 1, x² + y² = 2x is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "2π/3 - √3/2", "B": "π/3 - √3/2", "C": "2π/3 + √3/2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "Area of the curve r = a (1 - cos θ) (cardioid) is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "3πa² / 2", "B": "2πa²", "C": "πa²", "D": "3πa²"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The area of the smaller part of the circle x² + y² = a² cut off by the line x = a/√2 is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "a²/4 (π - 2)", "B": "a²/2 (π - 2)", "C": "a²/4 (π + 2)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The area enclosed between the curve x²y = a²(a-y) and its asymptote y = 0 is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "πa²", "B": "2πa²", "C": "4πa²", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The area of the sector of the circle x² + y² = 25 from x = 0 to x = 3 is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "25/2 sin⁻¹(3/5) + 6", "B": "25 sin⁻¹(3/5)", "C": "12", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    }
]

# Areas Under Curves: 9 Hard questions
auc_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\areas_under_curves.json'
auc_new = [
    {
        "question": "The area of the region bounded by y = x|x|, x-axis and the ordinates x = -1 and x = 1 is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "2/3", "B": "1/3", "C": "0", "D": "1"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "Area of region bounded by the curve y = cos x, x-axis, x = 0 and x = 2π is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "4", "B": "2", "C": "0", "D": "1"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The area of the region bounded by the curve y² = x, line y = 4 and the y-axis is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "64 / 3", "B": "32 / 3", "C": "16 / 3", "D": "8 / 3"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "Area bounded by the curve y = sin x between x = 0 and x = π is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "2", "B": "1", "C": "π", "D": "0"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The area of the region bounded by x² = 4y, y = 2, y = 4 and the y-axis in the first quadrant is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "8/3 (2√2 - 1)", "B": "4/3 (8 - 2√2)", "C": "8/3 (4 - √2)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "Area bounded by the curve y = log x, x-axis and x = 2 is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "2 ln 2 - 1", "B": "ln 2", "C": "1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "Area of the region bounded by y = √x and y = x is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "1/6", "B": "1/3", "C": "1/2", "D": "1"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The area of the region bounded by y = cos x between x = 0 and x = π/2 is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "1", "B": "2", "C": "1/2", "D": "0"}, "answer": "A", "pyq": False, "tag": "hard"
    },
    {
        "question": "The area bounded by the curve y = x³ and x-axis from x = -1 to x = 1 is ______.",
        "difficulty": "Hard", "hasDiagram": False, "diagram_description": "",
        "options": {"A": "1/2", "B": "1/4", "C": "1", "D": "0"}, "answer": "A", "pyq": False, "tag": "hard"
    }
]

append_questions(areas_file, areas_new)
append_questions(auc_file, auc_new)
print("Successfully updated Areas and Areas Under Curves.")
