import os
import json

base_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS'
report = []
total_missing = 0

for filename in sorted(os.listdir(base_dir)):
    if filename.endswith('.json'):
        with open(os.path.join(base_dir, filename), 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
                questions = data.get('questions', [])
                current_total = len(questions)
                missing = 80 - current_total
                if missing < 0: missing = 0
                
                name = data.get('topic_name', filename).upper()
                report.append(f"{name}: {current_total} questions ({missing} missing to reach 80)")
                total_missing += missing
            except:
                pass

report.append(f"\nTOTAL QUESTIONS MISSING ACROSS ALL MATHS TOPICS: {total_missing}")

with open(r'c:\Users\admin\OneDrive\Desktop\SeatCracker\math_80_gap_report.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(report))

print(f"80-mark gap report generated successfully. Total missing: {total_missing}")
