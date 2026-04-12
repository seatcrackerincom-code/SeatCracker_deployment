import json
import os

path = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS'
files = [f for f in os.listdir(path) if f.endswith('.json')]
report = []

for f_name in files:
    f_path = os.path.join(path, f_name)
    with open(f_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    count = len(data.get('questions', []))
    report.append(f"{f_name}: {count}")

for line in report:
    print(line)

print(f"Total files: {len(report)}")
