import json
import os
import shutil

# Path to public/questions_v2/MATHS
maths_dir = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\MATHS"

def migrate_topic(filename):
    if not filename.endswith(".json"):
        return

    topic_slug = filename.replace(".json", "")
    topic_path = os.path.join(maths_dir, filename)
    target_dir = os.path.join(maths_dir, topic_slug)

    # Create directory if it doesn't exist
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)

    try:
        with open(topic_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            questions = data.get("questions", [])

        # Split into 4 attempts of 20 questions each
        for i in range(4):
            start = i * 20
            end = (i + 1) * 20
            batch = questions[start:end]

            # Re-index IDs for the new batch if desired (1-20)
            for idx, q in enumerate(batch):
                q['id'] = idx + 1

            attempt_data = {"questions": batch}
            attempt_filename = f"attempt_{i+1}.json"
            attempt_path = os.path.join(target_dir, attempt_filename)

            with open(attempt_path, 'w', encoding='utf-8') as out:
                json.dump(attempt_data, out, ensure_ascii=False, indent=2)

        print(f"Migrated {topic_slug}: 4 attempts created.")

        # Backup the original file
        backup_path = topic_path + ".bak"
        if not os.path.exists(backup_path):
            shutil.move(topic_path, backup_path)
            print(f"Backed up {filename} to {filename}.bak")
        else:
            # If already backed up, just delete original to avoid confusion
            os.remove(topic_path)
            print(f"Removed original {filename} (backup already exists).")

    except Exception as e:
        print(f"Error migrating {filename}: {e}")

# Run for all JSON files
for f in os.listdir(maths_dir):
    if f.endswith(".json"):
        migrate_topic(f)

print("Migration complete.")
