import os
import shutil

v2_path = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2'
backup_path = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2_backup'

def analyze():
    subjects = ['botany', 'chemistry', 'maths', 'physics', 'zoology']
    results = []

    for sub in subjects:
        v2_sub = os.path.join(v2_path, sub)
        backup_sub = os.path.join(backup_path, sub)

        if not os.path.exists(v2_sub): continue

        topics = os.listdir(v2_sub)
        for topic in topics:
            t_path = os.path.join(v2_sub, topic)
            if not os.path.isdir(t_path): continue

            v2_files = [f for f in os.listdir(t_path) if f.startswith('attempt_') and f.endswith('.json')]
            
            b_path = os.path.join(backup_sub, topic)
            b_files = []
            if os.path.exists(b_path):
                b_files = [f for f in os.listdir(b_path) if f.startswith('attempt_') and f.endswith('.json')]

            if len(v2_files) != 4 or len(b_files) != 4:
                results.append({
                    'subject': sub,
                    'topic': topic,
                    'v2_count': len(v2_files),
                    'backup_count': len(b_files),
                    'v2_list': sorted(v2_files),
                    'backup_list': sorted(b_files)
                })
    
    for r in results:
        print(f"{r['subject']}/{r['topic']}: V2={r['v2_count']}, Backup={r['backup_count']}")

if __name__ == "__main__":
    analyze()
