import json
import os

dirs_to_process = [
    r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\chemistry',
    r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\maths',
    r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\physics',
    r'c:\Users\admin\OneDrive\Desktop\SeatCracker\SYLLABUS\questions'
]

def process_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Writing with ensure_ascii=False converts \u escape sequences to literal symbols
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Processed: {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

for base_dir in dirs_to_process:
    if not os.path.exists(base_dir):
        print(f"Directory not found: {base_dir}")
        continue
    
    for root, _, files in os.walk(base_dir):
        for f in files:
            if f.endswith('.json'):
                process_file(os.path.join(root, f))

print("Unicode symbol conversion complete.")
