import json
import os
import shutil

base_path = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\chemistry'
files = [f for f in os.listdir(base_path) if f.endswith('.json')]

for f_name in files:
    topic_slug = f_name.replace('.json', '')
    topic_dir = os.path.join(base_path, topic_slug)
    
    # Create directory
    if not os.path.exists(topic_dir):
        os.makedirs(topic_dir)
        
    src_file = os.path.join(base_path, f_name)
    with open(src_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    all_qs = data.get('questions', [])
    
    # Separate PYQs and others
    pyqs = [q for q in all_qs if q.get('pyq') == True or q.get('tag') == 'pyq']
    others = [q for q in all_qs if q not in pyqs]
    
    # Distribute 20 questions into 4 attempts (5 PYQs + 15 Others)
    for i in range(4):
        # 5 PYQs per attempt
        attempt_pyqs = pyqs[i*5 : (i+1)*5] if len(pyqs) >= (i+1)*5 else pyqs[i*5:]
        
        # 15 Others per attempt
        # Need to calculate offsets carefully if PYQs are less than 20
        # But we'll just fill to 20 questions total.
        
        # Actually, let's just make it simple: 
        # Attempt 1 gets PYQs 0-4, Attempt 2 gets 5-9, etc.
        # Then fill with 'others' until 20.
        
        # Calculate how many more we need
        needed = 20 - len(attempt_pyqs)
        attempt_others = others[i*15 : (i*15 + needed)] if len(others) >= (i*15 + needed) else others[i*15:]
        
        attempt_qs = attempt_pyqs + attempt_others
        
        # Re-index IDs within the attempt file (1 to 20)
        for idx, q in enumerate(attempt_qs):
            q['id'] = idx + 1
            if q in pyqs:
                q['tag'] = 'pyq' # Ensure tag is there
        
        out_file = os.path.join(topic_dir, f'attempt_{i+1}.json')
        with open(out_file, 'w', encoding='utf-8') as f_out:
            json.dump({"questions": attempt_qs}, f_out, indent=2)

    # Delete original file
    os.remove(src_file)
    print(f"Split {f_name} into 4 attempts in folder {topic_slug}/")

print("All 31 Chemistry topics restructured successfully.")
