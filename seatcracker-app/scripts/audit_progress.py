import os
import json

base_v1 = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions'
base_v2 = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2'

subjects = ['maths', 'physics', 'chemistry']

print("--- MODERNIZATION STATUS (questions_v2) ---")
for sub in subjects:
    path = os.path.join(base_v2, sub)
    if not os.path.exists(path):
        print(f"Subject {sub}: NOT STARTED")
        continue
    
    files = [f for f in os.listdir(path) if f.endswith('.json')]
    print(f"\nSubject {sub}: {len(files)} topics modernized")
    for f in files:
        with open(os.path.join(path, f), 'r', encoding='utf-8') as jf:
            data = json.load(jf)
            count = len(data.get('questions', []))
            if count < 80:
                print(f"  [UNDERWEIGHT] {f}: {count} questions")
            # else:
            #    print(f"  [OK] {f}: {count}")

print("\n--- ARCHIVE REMAINING (questions) ---")
for sub in subjects:
    path_v1 = os.path.join(base_v1, sub)
    path_v2 = os.path.join(base_v2, sub)
    
    if not os.path.exists(path_v1):
        continue
    
    files_v1 = set([f for f in os.listdir(path_v1) if f.endswith('.json')])
    files_v2 = set()
    if os.path.exists(path_v2):
        files_v2 = set([f for f in os.listdir(path_v2) if f.endswith('.json')])
    
    remaining = files_v1 - files_v2
    print(f"Subject {sub}: {len(remaining)} topics remaining to modernize")
    if remaining:
        print(f"  Topics: {sorted(list(remaining))[:5]} ...")
