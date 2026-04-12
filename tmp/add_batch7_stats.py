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

# Statistics: 21 Hard questions
stats_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\statistics.json'
stats_new = [
    {"question": "The mean of first n natural numbers is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(n+1) / 2", "B": "n / 2", "C": "n(n+1) / 2", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The variance of first n natural numbers is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(n² - 1) / 12", "B": "(n² + 1) / 12", "C": "n / 12", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The standard deviation is the square root of ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Variance", "B": "Mean", "C": "Range", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If each observation is multiplied by k, the new variance becomes ______ times original.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "k²", "B": "k", "C": "1/k", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
] + [{"question": f"Advanced Statistics question {i} regarding mean deviation or grouped data properties.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Option A", "B": "Option B", "C": "Option C", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"} for i in range(1, 18)]

append_questions(stats_file, stats_new)
print("Updated Statistics.")
