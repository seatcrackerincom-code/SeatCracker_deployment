import json
import os

SYLLABUS_BASE = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\SYLLABUS\AP\Agriculture"
QUESTIONS_BASE = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2"

def verify_subject(subject):
    syllabus_path = os.path.join(SYLLABUS_BASE, subject, f"{subject}.json")
    if not os.path.exists(syllabus_path):
        print(f"❌ Syllabus not found: {syllabus_path}")
        return

    with open(syllabus_path, 'r') as f:
        data = json.load(f)

    print(f"\n--- Verifying {subject} ---")
    chapters = data.get('chapters', [])
    for ch in chapters:
        slug = ch.get('topic_slug')
        folder_path = os.path.join(QUESTIONS_BASE, subject.lower(), slug)
        
        if os.path.exists(folder_path):
            # Check for attempts
            attempts = [f"attempt_{i}.json" for i in range(1, 5)]
            missing_attempts = [a for a in attempts if not os.path.exists(os.path.join(folder_path, a))]
            if not missing_attempts:
                print(f"[OK] {slug}")
            else:
                print(f"[MISSING ATTEMPTS] {slug}: {missing_attempts}")
        else:
            print(f"[NOT FOUND] {slug}: Folder NOT FOUND at {folder_path}")

if __name__ == "__main__":
    verify_subject("Botany")
    verify_subject("Zoology")
