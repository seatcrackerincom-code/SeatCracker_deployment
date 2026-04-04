import os
import json

base_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS'
report = []

for filename in os.listdir(base_dir):
    if filename.endswith('.json'):
        with open(os.path.join(base_dir, filename), 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
                questions = data.get('questions', [])
                hard_count = len([q for q in questions if q.get('difficulty') == 'Hard'])
                pyq_count = len([q for q in questions if q.get('pyq') == True])
                name = data.get('topic_name', filename)
                report.append(f"{name}: {hard_count} Hard, {pyq_count} PYQs")
            except:
                pass

with open(r'c:\Users\admin\OneDrive\Desktop\SeatCracker\math_gap_report.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(report))

print("Gap report generated successfully.")
