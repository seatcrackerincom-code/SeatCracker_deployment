import json
import os
import shutil
import random

# Path to public/questions_v2/MATHS
maths_dir = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS"

def migrate_topic_with_pyq_balance(filename):
    if not filename.endswith(".json.bak"):
        return

    topic_slug = filename.replace(".json.bak", "")
    backup_path = os.path.join(maths_dir, filename)
    target_dir = os.path.join(maths_dir, topic_slug)

    # Ensure target directory exists
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)

    try:
        with open(backup_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            questions = data.get("questions", [])

        # Separate PYQs and others
        pyqs = [q for q in questions if q.get('pyq')]
        others = [q for q in questions if not q.get('pyq')]

        if len(pyqs) < 20:
             print(f"Warning: {topic_slug} has only {len(pyqs)} PYQs. Will distribute what's available.")
        
        # Distribute 5 PYQs and 15 others into each of 4 attempts
        for i in range(4):
            # Take 5 PYQs (if available)
            batch_pyqs = pyqs[i*5 : (i+1)*5]
            # Take 15 others
            batch_others = others[i*15 : (i+1)*15]
            
            # Combine
            batch = batch_pyqs + batch_others
            
            # If still short (less than 20), backfill from remaining 'others' if any
            if len(batch) < 20:
                used_ids = set(q.get('id', q.get('question')) for q in batch)
                remaining = [q for q in questions if q.get('id', q.get('question')) not in used_ids]
                needed = 20 - len(batch)
                batch += remaining[:needed]

            # Shuffle the batch internally
            random.shuffle(batch)

            # Re-index IDs for the new batch (1-20)
            for idx, q in enumerate(batch):
                q['id'] = idx + 1

            attempt_data = {"questions": batch}
            attempt_filename = f"attempt_{i+1}.json"
            attempt_path = os.path.join(target_dir, attempt_filename)

            with open(attempt_path, 'w', encoding='utf-8') as out:
                json.dump(attempt_data, out, ensure_ascii=False, indent=2)

        print(f"Re-migrated {topic_slug} with balanced PYQs (Attempt 1-4).")

    except Exception as e:
        print(f"Error migrating {filename}: {e}")

# Run for all .bak files
for f in os.listdir(maths_dir):
    if f.endswith(".json.bak"):
        migrate_topic_with_pyq_balance(f)

print("Re-migration complete.")
