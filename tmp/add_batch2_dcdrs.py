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

# DC'S AND DR'S: 19 Hard questions
dcdrs_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\dc_s_and_dr_s.json'
dcdrs_new = [
    {"question": "If a line makes angles α, β, γ with the coordinate axes, then cos 2α + cos 2β + cos 2γ = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "-1", "B": "1", "C": "-2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The direction cosines of a line which is perpendicular to the lines with direction ratios (1,-2,2) and (0,2,1) are ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(-6/7, -1/7, 2/7)", "B": "(2/3, 1/3, 2/3)", "C": "(1, 0, 0)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If the direction cosines of two lines are given by l + m + n = 0 and l² + m² - n² = 0, then the angle between them is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "π/2", "B": "π/3", "C": "π/6", "D": "None"}, "answer": "B", "pyq": False, "tag": "hard"},
    {"question": "The direction ratios of the line joining (1,2,3) and (4,5,6) are ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(3, 3, 3)", "B": "(1, 1, 1)", "C": "(9, 9, 9)", "D": "None"}, "answer": "B", "pyq": False, "tag": "hard"},
    {"question": "If a line makes angles of 45° and 60° with the x and y axes, then the angle it makes with the z-axis is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "60° or 120°", "B": "45°", "C": "30°", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The projection of the segment joining (1,2,3) and (4,5,6) on the line with direction cosines (1/√3, 1/√3, 1/√3) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "3√3", "B": "√3", "C": "9", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If l₁, m₁, n₁ and l₂, m₂, n₂ are DCs of two perpendicular lines, then DCs of a line perpendicular to both are ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(m₁n₂ - m₂n₁, n₁l₂ - n₂l₁, l₁m₂ - l₂m₁)", "B": "(l₁+l₂, m₁+m₂, n₁+n₂)", "C": "(0, 0, 0)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "A line makes equal angles with the coordinate axes. Its direction cosines are ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(±1/√3, ±1/√3, ±1/√3)", "B": "(1, 1, 1)", "C": "(1/2, 1/2, 1/2)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If direction ratios of two lines are (2,3,6) and (1,2,2), the angle between them is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "cos⁻¹(20/21)", "B": "cos⁻¹(1/2)", "C": "cos⁻¹(19/21)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Number of lines making equal angles with the three coordinate axes is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "4", "B": "8", "C": "2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "A line passes through (x₁, y₁, z₁) and has direction ratios (a, b, c). Its equation is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(x-x₁)/a = (y-y₁)/b = (z-z₁)/c", "B": "ax + by + cz = 0", "C": "lx + my + nz = p", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If a line makes angles α, β, γ with the axes such that α + β = 90°, then cos² γ = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "0", "B": "1", "C": "1/2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Direction cosines of the y-axis are ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(0, 1, 0)", "B": "(1, 0, 0)", "C": "(0, 0, 1)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If the direction ratios of a line are (1, 1, 2), then its direction cosines are ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(1/√6, 1/√6, 2/√6)", "B": "(1/2, 1/2, 1)", "C": "(1, 1, 2)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The angle between a line with DCs (1/2, 1/√2, 1/2) and another with DCs (1/2, -1/√2, 1/2) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "90°", "B": "60°", "C": "45°", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If l, m, n are the DCs of a line, then l² + m² + n² = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "1", "B": "0", "C": "Depends on the line", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Two lines with direction ratios (a₁, b₁, c₁) and (a₂, b₂, c₂) are coincident if ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "a₁/a₂ = b₁/b₂ = c₁/c₂", "B": "a₁a₂ + b₁b₂ + c₁c₂ = 0", "C": "a₁² + b₁² + c₁² = 1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Direction ratios of the normal to the plane 2x - 3y + 4z = 5 are ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(2, -3, 4)", "B": "(2, 3, 4)", "C": "(1, 1, 1)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Find the DCs of a line which makes an angle of 30° with the z-axis and equal angles with the x and y axes.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "", "options": {"A": "(1/2, 1/2, √3/2)", "B": "(√3/2, √3/2, 1/2)", "C": "(1/√2, 1/√2, 1/2)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(dcdrs_file, dcdrs_new)
print("Updated DC'S AND DR'S.")
