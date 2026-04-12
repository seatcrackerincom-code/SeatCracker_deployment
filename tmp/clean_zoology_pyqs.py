import json
import os

pyq_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\pyqs\eamcet_zoology_pyq_all_topics.json'

if not os.path.exists(pyq_file):
    print(f"Error: {pyq_file} not found.")
    exit(1)

with open(pyq_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

old_count = data.get('total_questions', 0)
new_topics = {}
removed_count = 0
kept_count = 0

for topic, questions in data.get('topics', {}).items():
    cleaned_qs = []
    for q in questions:
        # Filter out easy questions
        if q.get('difficulty', '').lower() == 'easy':
            removed_count += 1
            continue
        
        # Ensure metadata is present
        q['pyq'] = True
        q['tag'] = 'pyq'
        if 'hasDiagram' not in q: q['hasDiagram'] = False
        if 'diagram_description' not in q: q['diagram_description'] = ""
        
        cleaned_qs.append(q)
        kept_count += 1
    
    if cleaned_qs:
        new_topics[topic] = cleaned_qs

data['topics'] = new_topics
data['total_questions'] = kept_count

with open(pyq_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Cleaning Complete.")
print(f"Original Questions: {old_count}")
print(f"Removed (Easy): {removed_count}")
print(f"Kept (Medium/Hard): {kept_count}")
