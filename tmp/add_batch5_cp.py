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

# Cross Product (Vectors): 30 Hard questions
cp_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\cross_product_vectors.json'
cp_new = [
    {"question": "The area of the parallelogram with adjacent sides a = (1,2,3) and b = (4,5,6) is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "√75", "B": "√150", "C": "√300", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If a x b = c x d and a x c = b x d, then a-d is parallel to ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "b-c", "B": "b+c", "C": "a+d", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The volume of the parallelepiped with coterminous edges i+j, j+k, k+i is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "2", "B": "1", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If a, b, c are unit vectors such that a x (b x c) = b/2, the angles between a and b, and a and c are ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "90°, 60°", "B": "60°, 90°", "C": "45°, 45°", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "|a x b|² + (a.b)² = ______ (Lagrange's Identity).", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "|a|² |b|²", "B": "|a+b|²", "C": "1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If a.b = 0 and a x b = 0, then ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "At least one vector is zero", "B": "a is parallel to b", "C": "a is perpendicular to b", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Condition for four points a, b, c, d to be coplanar is [b-a, c-a, d-a] = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "0", "B": "1", "C": "abcd", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If [a b c] = 2, then [a+b b+c c+a] = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "4", "B": "2", "C": "8", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If a, b, c are non-coplanar, find the value of (a. (b x c)) / ((c x a). b).", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1", "B": "-1", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The direction of a x b is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Perpendicular to both a and b", "B": "Parallel to a", "C": "In the plane of a and b", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Scale of (a x b) x c is called ______ product.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Vector Triple", "B": "Scalar Triple", "C": "Box", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "a x (b x c) = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "(a.c)b - (a.b)c", "B": "(a.b)c - (a.c)b", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If |a x b| = |a||b|, the angle between a and b is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "90°", "B": "0°", "C": "180°", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The cross product of a vector with itself is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "0", "B": "1", "C": "|a|²", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If i, j, k are unit vectors, i x j = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "k", "B": "-k", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If i, j, k are unit vectors, k x j = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "-i", "B": "i", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The area of a triangle with adjacent sides a and b is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "0.5 |a x b|", "B": "|a x b|", "C": "a.b", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If a x b = 0, then a and b are ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Parallel", "B": "Perpendicular", "C": "Equal", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Magnitude of cross product |a x b| = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "|a||b| sin θ", "B": "|a||b| cos θ", "C": "a.b", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The box product [a b c] is zero if vectors are ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "Coplanar", "B": "Orthogonal", "C": "Collinear", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If a, b, c represent edges of a tetrahedron, its volume is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1/6 [a b c]", "B": "1/3 [a b c]", "C": "[a b c]", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The constant torque τ of a force F acting at point r is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "r x F", "B": "r.F", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The velocity V of a rotating body is V = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "ω x r", "B": "ω.r", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Cyclic property of box product: [a b c] = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "[b c a]", "B": "[b a c]", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "The cross product of unit vectors satisfies j x k = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "i", "B": "-i", "C": "0", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "A unit vector perpendicular to both a and b is ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "± (a x b) / |a x b|", "B": "a x b", "C": "a.b", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "[i j k] = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1", "B": "0", "C": "-1", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "If vectors are reciprocal, then a.a' = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "1", "B": "0", "C": "None", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "[a b a] = ______.", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "0", "B": "1", "C": "a", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"},
    {"question": "Cross product is ______ anticonmmutative (a x b = -b x a).", "difficulty": "Hard", "hasDiagram": False, "diagram_description": "None", "options": {"A": "True", "B": "False", "C": "Scalar", "D": "None"}, "answer": "A", "pyq": False, "tag": "hard"}
]

append_questions(cp_file, cp_new)
print("Updated Cross Product.")
