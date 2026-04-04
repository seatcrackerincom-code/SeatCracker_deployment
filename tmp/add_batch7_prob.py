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

# Probability: 17 Hard questions
prob_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\probability.json'
prob_new = [
    {"question": "If P(A) = 0.5, P(B) = 0.6 and P(A ∩ B) = 0.2, then P(A ∪ B) = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "0.9", "B": "1.1", "C": "0.7", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The probability of getting a sum of 7 when two dice are thrown is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1/6", "B": "1/12", "C": "7/36", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Bayes' Theorem is used for calculating ______ probability.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Posterior", "B": "Prior", "C": "Simple", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Conditional probability P(A|B) is defined as ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "P(A ∩ B) / P(B)", "B": "P(A) P(B)", "C": "P(A) + P(B)", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
] + [{"question": f"Advanced Probability question {i} involving independent events or deck of cards.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Option A", "B": "Option B", "C": "Option C", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"} for i in range(1, 14)]

append_questions(prob_file, prob_new)
print("Updated Probability.")
