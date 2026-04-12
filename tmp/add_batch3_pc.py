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

# Permutations & Combinations: 21 Hard questions
pc_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\permutations_combinations.json'
pc_new = [
    {"question": "Number of ways in which 5 identical balls can be distributed into 3 distinct boxes such that no box remains empty is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "6", "B": "10", "C": "15", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The number of divisors of 10800 which are perfect squares is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "12", "B": "18", "C": "24", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The sum of all 4-digit numbers that can be formed using the digits 1, 2, 3, 4 without repetition is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "66660", "B": "66666", "C": "66000", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Number of ways of arranging 5 people in a circle is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "24", "B": "120", "C": "60", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Number of ways 5 friends can be seated at a round table such that two particular friends always sit together is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "12", "B": "24", "C": "6", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The number of onto functions from {1,2,3,4} to {1,2,3} is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "36", "B": "81", "C": "64", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "In how many ways can 10 distinct balls be put into 2 identical boxes such that no box is empty?", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "511", "B": "1023", "C": "512", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Rank of the word 'RANDOM' in dictionary order is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "614", "B": "615", "C": "613", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Number of ways to form a committee of 5 from 7 men and 6 women such that it contains at least 3 men is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "756", "B": "852", "C": "946", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The sum of digits in the unit's place of all numbers formed with 1, 2, 3, 4, 5 without repetition is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "360", "B": "120", "C": "720", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Number of ways of selecting 4 items from 10 distinct items such that two particular items are always included is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "²⁸C₂ = 28", "B": "45", "C": "⁷⁰", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The number of strictly increasing functions from {1,2,3} to {1,2,3,4,5} is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "10", "B": "20", "C": "30", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Number of ways 5 keys can be arranged in a circular key ring is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "12", "B": "24", "C": "48", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Number of ways to distribute 10 identical chocolates to 3 children such that each child gets at least one is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "36", "B": "45", "C": "55", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If nC₁₂ = nC₈, then n = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "20", "B": "4", "C": "96", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Number of diagonals in a decagon is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "35", "B": "45", "C": "10", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "In how many ways can 8 people be seated at a round table if two particular people must NOT sit together?", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "3600", "B": "5040", "C": "4320", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Number of 5-digit numbers that can be formed using digits 1, 2, 3 such that each digit appears at least once is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "150", "B": "243", "C": "120", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The number of ways in which 12 identical coins can be put into 5 different purses is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1820", "B": "1001", "C": "1287", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Number of ways of arranging the letters of the word 'GOOGLE' is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "180", "B": "720", "C": "360", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The total number of ways of and answering 5 true/false questions is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "32", "B": "25", "C": "10", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(pc_file, pc_new)
print("Updated Permutations & Combinations.")
