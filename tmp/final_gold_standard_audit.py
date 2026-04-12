import json
import os

base_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2'

def audit_subject(subject_name):
    subj_dir = os.path.join(base_dir, subject_name)
    if not os.path.exists(subj_dir):
        return []
    
    rows = []
    topics = [d for d in os.listdir(subj_dir) if os.path.isdir(os.path.join(subj_dir, d)) and d not in ['SYLLABUS','unwanted_zoology','legacy']]
    
    for t in sorted(topics):
        tp = os.path.join(subj_dir, t)
        counts = []
        for i in range(1, 5):
            ap = os.path.join(tp, f'attempt_{i}.json')
            if os.path.exists(ap):
                with open(ap, 'r', encoding='utf-8') as f:
                    counts.append(len(json.load(f).get('questions', [])))
            else:
                counts.append(0)
        
        total = sum(counts)
        rows.append(f"| {t} | {counts} | **{total}** |")
    return rows

print("### Botany Final Audit")
print("| Topic | Attempts [1,2,3,4] | Total Qs |")
print("| :--- | :---: | :---: |")
for row in audit_subject('botany'):
    print(row)

print("\n### Zoology Final Audit")
print("| Topic | Attempts [1,2,3,4] | Total Qs |")
print("| :--- | :---: | :---: |")
for row in audit_subject('zoology'):
    print(row)
