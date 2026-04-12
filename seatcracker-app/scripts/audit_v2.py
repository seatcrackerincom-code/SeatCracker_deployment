import os
import json

base_v1 = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions'
base_v2 = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2'

subjects = ['maths', 'physics', 'chemistry']

for sub in subjects:
    path_v2 = os.path.join(base_v2, sub)
    if not os.path.exists(path_v2):
        continue
    
    files = [f for f in os.listdir(path_v2) if f.endswith('.json')]
    for f in files:
        full_path = os.path.join(path_v2, f)
        try:
            with open(full_path, 'r', encoding='utf-8') as jf:
                data = json.load(jf)
                count = len(data.get('questions', []))
                if count != 80:
                    print(f"[COUNT_MISMATCH] {sub}/{f}: {count} questions")
        except Exception as e:
            print(f"[CORRUPTED] {sub}/{f}: {str(e)}")

print("\n--- SUBJECT TOTALS in ARCHIVE ---")
for sub in subjects:
    path_v1 = os.path.join(base_v1, sub)
    if os.path.exists(path_v1):
        files = [f for f in os.listdir(path_v1) if f.endswith('.json')]
        print(f"{sub}: {len(files)} topics")
