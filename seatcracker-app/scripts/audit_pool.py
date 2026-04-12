import os
import json

def audit_pool():
    v2_dir = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2"
    blacklist = set()
    subjects = ["maths", "physics", "chemistry", "botany", "zoology"]
    for s in subjects:
        subj_path = os.path.join(v2_dir, s)
        if not os.path.exists(subj_path): continue
        for root, dirs, files in os.walk(subj_path):
            for f in files:
                if f.endswith(".json"):
                    with open(os.path.join(root, f), 'r', encoding='utf-8') as file:
                        data = json.load(file)
                        for q in data.get("questions", []):
                            txt = q.get("question", "").strip()
                            if txt: blacklist.add(txt)
    
    print(f"Practice Blacklist size: {len(blacklist)}")
    
    source_root = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\splitted\questions"
    for s in subjects:
        source_path = os.path.join(source_root, s)
        total_unique = 0
        total_found = 0
        topic_count = 0
        if not os.path.exists(source_path): continue
        for f in os.listdir(source_path):
            if f.endswith(".json"):
                topic_count += 1
                with open(os.path.join(source_path, f), 'r', encoding='utf-8') as file:
                    data = json.load(file)
                    for q in data.get("questions", []):
                        total_found += 1
                        txt = q.get("question", "").strip()
                        if txt not in blacklist:
                            total_unique += 1
        print(f"Subject: {s:10} | Raw questions: {total_found:5} | Unique from practice: {total_unique:5} | Topics: {topic_count}")

if __name__ == "__main__":
    audit_pool()
