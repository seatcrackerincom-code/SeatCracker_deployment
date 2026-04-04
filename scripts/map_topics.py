import os
import json

base_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS'
topic_map = {}

for filename in os.listdir(base_dir):
    if filename.endswith('.json'):
        with open(os.path.join(base_dir, filename), 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
                topic_name = data.get('topic_name', 'UNKNOWN')
                topic_map[topic_name] = filename
            except:
                pass

print(json.dumps(topic_map, indent=2))
