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

# Matrices and Determinants: 20 Hard questions
mat_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\matrices_and_determinants.json'
mat_new = [
    {"question": "If A is a 3x3 non-singular matrix such that |A| = 5, then |adj(adj A)| is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "5⁴", "B": "5⁹", "C": "5²", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If the system of equations x + y + z = 6, x + 2y + 3z = 10, x + 2y + λz = μ has infinite solutions, then ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "λ = 3, μ = 10", "B": "λ ≠ 3", "C": "λ = 3, μ ≠ 10", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If A and B are square matrices of order n such that AB = O and B is non-singular, then A = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "O", "B": "I", "C": "B⁻¹", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The value of a determinant with rows (1, a, a²), (1, b, b²), (1, c, c²) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(a-b)(b-c)(c-a)", "B": "(a+b)(b+c)(c+a)", "C": "abc", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If A is an idempotent matrix, then (I+A)ⁿ = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "I + (2ⁿ-1)A", "B": "I + nA", "C": "I + A", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If A is a skew-symmetric matrix of odd order, then |A| = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "0", "B": "1", "C": "-1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The rank of the matrix [[1,2,3],[2,3,4],[3,4,5]] is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "2", "B": "3", "C": "1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If A = [[cosθ, sinθ], [-sinθ, cosθ]], then Aⁿ = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "[[cos nθ, sin nθ], [-sin nθ, cos nθ]]", "B": "[[cosⁿθ, sinⁿθ], [-sinⁿθ, cosⁿθ]]", "C": "I", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If A is a 3x3 matrix and |adj A| = 64, then |A| = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "±8", "B": "64", "C": "4", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The inverse of a symmetric matrix is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Symmetric", "B": "Skew-symmetric", "C": "Diagonal", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If A² - A + I = O, then the inverse of A is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "I - A", "B": "A - I", "C": "A", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If a, b, c are in AP, then the determinant [[x+1, x+2, x+a], [x+2, x+3, x+b], [x+3, x+4, x+c]] is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "0", "B": "1", "C": "x", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The matrix A such that A * [[1, 2], [3, 4]] = [[1, 0], [0, 1]] is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "[[-2, 1], [1.5, -0.5]]", "B": "[[4, -2], [-3, 1]]", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If A is an orthogonal matrix, then |A| = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "±1", "B": "0", "C": "I", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If Trace(A) = 5 and Trace(B) = 3, then Trace(2A + 3B) = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "19", "B": "8", "C": "15", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "A square matrix A is called singular if ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "|A| = 0", "B": "|A| ≠ 0", "C": "A² = I", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If A is involuntary, then A² = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "I", "B": "O", "C": "A", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The number of symmetric matrices of order 3 with entries from {0, 1} is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "64", "B": "512", "C": "2⁷", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The product of eigenvalues of a matrix is equal to ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Determinant", "B": "Trace", "C": "Rank", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Sum of eigenvalues of a matrix is equal to ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Trace", "B": "Determinant", "C": "Rank", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(mat_file, mat_new)
print("Updated Matrices and Determinants.")
