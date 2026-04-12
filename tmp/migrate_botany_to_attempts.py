import json
import os
import shutil

botany_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\botany'

def migrate_topic_to_attempts(filename):
    topic_path = os.path.join(botany_dir, filename)
    topic_id = filename.replace('.json', '')
    dest_folder = os.path.join(botany_dir, topic_id)
    
    if not os.path.exists(topic_path):
        print(f"Skipping {filename}: File not found.")
        return

    with open(topic_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    all_qs = data.get('questions', [])
    if len(all_qs) < 80:
        print(f"Warning: {filename} has only {len(all_qs)} questions. Continuing with split...")

    # Categorize questions
    pyqs = [q for q in all_qs if q.get('pyq') == True or q.get('tag') == 'pyq']
    others = [q for q in all_qs if q not in pyqs]
    
    # Check if we have enough
    if len(pyqs) < 20:
        print(f"Warning: {filename} has only {len(pyqs)} PYQs. Supplementing with others for deterministic split.")
        pyqs += others[: (20 - len(pyqs))]
        others = others[(20 - len(pyqs)):]

    # Create destination folder
    if not os.path.exists(dest_folder):
        os.makedirs(dest_folder)
        
    # Split into 4 attempts (5 PYQs + 15 Others each)
    for i in range(1, 5):
        attempt_qs = []
        # Take 5 PYQs
        attempt_pyqs = pyqs[(i-1)*5 : i*5]
        # Take 15 Others
        attempt_others = others[(i-1)*15 : i*15]
        
        attempt_qs = attempt_pyqs + attempt_others
        
        # Final sanity check: if others is empty, just fill from whatever is left
        if len(attempt_qs) < 20:
            remaining = all_qs # fallback
            attempt_qs = remaining[(i-1)*20 : i*20]

        # Re-index IDs for the attempt file
        for idx, q in enumerate(attempt_qs):
            q['id'] = idx + 1
            
        output_file = os.path.join(dest_folder, f"attempt_{i}.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({"questions": attempt_qs}, f, indent=2, ensure_ascii=False)
            
    print(f"Successfully migrated {filename} to {topic_id}/ (4 attempts created)")
    
    # After migration, move original file to SYLLABUS/legacy/
    legacy_dir = os.path.join(botany_dir, "SYLLABUS", "legacy")
    if not os.path.exists(legacy_dir):
        os.makedirs(legacy_dir)
    shutil.move(topic_path, os.path.join(legacy_dir, filename))

# Process all 24 topics
for f in os.listdir(botany_dir):
    if f.endswith('.json'):
        migrate_topic_to_attempts(f)
