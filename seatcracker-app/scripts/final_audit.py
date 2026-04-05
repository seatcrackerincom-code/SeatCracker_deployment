import os
import json

def final_audit():
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
    
    mock_base = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\mock_questions"
    courses = ["engineering", "agri_pharma"]
    
    print(f"--- FINAL AUDIT (MOCKS 1-6) ---")
    for c in courses:
        for m in range(1, 7):
            mock_dir = os.path.join(mock_base, c, f"mock_{m}")
            total_q = 0
            overlaps = 0
            if not os.path.exists(mock_dir):
                print(f"[{c.upper()} MOCK {m}] MISSING")
                continue
            
            for f in os.listdir(mock_dir):
                if f.endswith(".json"):
                    with open(os.path.join(mock_dir, f), 'r', encoding='utf-8') as file:
                        qs = json.load(file)
                        total_q += len(qs)
                        for q in qs:
                            if q.get("question", "").strip() in blacklist:
                                overlaps += 1
            print(f"[{c.upper()} MOCK {m}] Questions: {total_q:3} | Overlaps with Practice: {overlaps}")

if __name__ == "__main__":
    final_audit()
