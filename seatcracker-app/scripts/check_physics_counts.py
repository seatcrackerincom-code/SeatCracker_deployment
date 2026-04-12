import os
import json

dir_path = 'public/questions_v2/physics_clean'
files = sorted([f for f in os.listdir(dir_path) if f.endswith('.json')])
for f in files:
    with open(os.path.join(dir_path, f), encoding='utf-8') as jf:
        data = json.load(jf)
        print(f"{f}: {len(data['questions'])}")
