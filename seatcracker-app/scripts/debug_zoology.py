import os
import json

def debug_zoology():
    v2_dir = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2"
    blacklist = set()
    subjects = ["zoology"]
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
    
    print(f"Zoology Blacklist size: {len(blacklist)}")
    
    source_root = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\splitted\questions\zoology"
    used_uids = set()
    # Load from Mock 1, 2, 3, 4
    mock_base = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\mock_questions\agri_pharma"
    for m in [1, 2, 3, 4]:
        p = os.path.join(mock_base, f"mock_{m}", "zoology.json")
        if os.path.exists(p):
            with open(p, 'r') as f:
                data = json.load(f)
                for q in data:
                    if q.get("_uid"): used_uids.add(q.get("_uid"))
    
    print(f"Used UIDs: {len(used_uids)}")
    
    available = []
    for f in os.listdir(source_root):
        if f.endswith(".json"):
            with open(os.path.join(source_root, f), 'r', encoding='utf-8') as file:
                data = json.load(file)
                for q in data.get("questions", []):
                    uid = f"{f}_{q.get('id')}"
                    txt = q.get("question", "").strip()
                    
                    reasons = []
                    if uid in used_uids: reasons.append("USED")
                    if txt in blacklist: reasons.append("IN_V2")
                    
                    if not reasons:
                        available.append(uid)
    
    print(f"Truly available for Mock 5, 6: {len(available)}")

if __name__ == "__main__":
    debug_zoology()
