import json
import os

files = [
    r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\vector_addition.json',
    r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\dot_product_vectors.json',
    r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\cross_product_vectors.json',
    r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\integration.json',
    r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS\definite_integrals.json'
]

for f_path in files:
    try:
        with open(f_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        questions = data.get('questions', [])
        for i, q in enumerate(questions):
            q['id'] = i + 1
        print(f"{os.path.basename(f_path)}: {len(questions)} questions")
        data['questions'] = questions
        with open(f_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error with {f_path}: {e}")
