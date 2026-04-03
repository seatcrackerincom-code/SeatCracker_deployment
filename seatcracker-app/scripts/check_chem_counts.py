import os
import json

dir_path = 'public/questions_v2/chemistry'
files = sorted([f for f in os.listdir(dir_path) if f.endswith('.json')])
for f in files:
    try:
        with open(os.path.join(dir_path, f), encoding='utf-8') as jf:
            data = json.load(jf)
            print(f"{f}: {len(data['questions'])}")
    except Exception as e:
        print(f"Error in {f}: {e}")
