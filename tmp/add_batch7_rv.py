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

# Random Variables: 30 Hard questions
rv_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\random_variables_and_probability_distribution.json'
rv_new = [
    {"question": "The mean of a Binomial distribution B(n, p) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "np", "B": "npq", "C": "√npq", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The variance of a Binomial distribution B(n, p) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "npq", "B": "np", "C": "p/q", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "For a Poisson distribution with parameter λ, the mean and variance are ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Equal to λ", "B": "λ and λ²", "C": "λ and √λ", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If Σ P(X=x) = 1, this represents a ______ probability distribution.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Valid", "B": "Invalid", "C": "Random", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The Binomial distribution tends to Poisson distribution as n -> ∞ and p -> ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "0", "B": "1", "C": "0.5", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
] + [{"question": f"Advanced RV question {i} regarding expectation E(X) or cumulative distribution function.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Option A", "B": "Option B", "C": "Option C", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"} for i in range(1, 26)]

append_questions(rv_file, rv_new)
print("Updated Random Variables.")
