import os
import json

def audit_batch_1():
    # 1. Load Blacklist
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
    
    # 2. Check Mocks
    mock_base = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\mock_questions"
    courses = ["engineering", "agri_pharma"]
    overlaps = []
    diagrams = []
    
    for c in courses:
        for m in [1, 2]:
            mock_dir = os.path.join(mock_base, c, f"mock_{m}")
            if not os.path.exists(mock_dir): continue
            for f in os.listdir(mock_dir):
                if f.endswith(".json"):
                    with open(os.path.join(mock_dir, f), 'r', encoding='utf-8') as file:
                        qs = json.load(file)
                        for q in qs:
                            txt = q.get("question", "").strip()
                            if txt in blacklist:
                                overlaps.append(f"{c}/mock_{m}/{f}: {txt[:50]}...")
                            if q.get("hasDiagram"):
                                diagrams.append(f"{c}/mock_{m}/{f}: {q.get('id')}")
    
    print(f"--- AUDIT RESULTS ---")
    print(f"Overlaps with questions_v2: {len(overlaps)}")
    for o in overlaps[:10]: print(f"  [OVERLAP] {o}")
    
    print(f"Questions with Diagrams: {len(diagrams)}")
    for d in diagrams[:10]: print(f"  [DIAGRAM] {d}")

if __name__ == "__main__":
    audit_batch_1()
