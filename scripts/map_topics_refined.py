import os
import json

base_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS'
pyq_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\PYQS\Maths\eamcet_pyq_questions_maths (2).json'

with open(pyq_file, 'r', encoding='utf-8') as f:
    pyq_data = json.load(f)

pyq_topics = list(pyq_data.keys())

# Get existing files and their topic names
topic_to_file = {}
for filename in os.listdir(base_dir):
    if filename.endswith('.json'):
        with open(os.path.join(base_dir, filename), 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
                topic_name = data.get('topic_name', '').upper()
                topic_to_file[topic_name] = filename
            except:
                pass

mapping = {}
unmapped = []

# Improved fuzzy mapping
for topic in pyq_topics:
    topic_upper = topic.upper()
    found = False
    
    # Direct match
    if topic_upper in topic_to_file:
        mapping[topic] = topic_to_file[topic_upper]
        found = True
    else:
        # Partial match
        for existing_name, filename in topic_to_file.items():
            if topic_upper in existing_name or existing_name in topic_upper:
                mapping[topic] = filename
                found = True
                break
    
    if not found:
        unmapped.append(topic)

print("Mapping:")
print(json.dumps(mapping, indent=2))
print("\nUnmapped:")
print(unmapped)
