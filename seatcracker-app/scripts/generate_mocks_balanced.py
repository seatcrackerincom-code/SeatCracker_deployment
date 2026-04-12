import json
import os
import random
import sys

def load_practice_blacklist():
    """Build a set of all question strings currently in questions_v2 to exclude them from mocks."""
    v2_dir = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2"
    blacklist = set()
    subjects = ["maths", "physics", "chemistry", "botany", "zoology"]
    
    for s in subjects:
        subj_path = os.path.join(v2_dir, s)
        if not os.path.exists(subj_path): continue
        
        for root, dirs, files in os.walk(subj_path):
            for f in files:
                if f.endswith(".json"):
                    try:
                        with open(os.path.join(root, f), 'r', encoding='utf-8') as file:
                            data = json.load(file)
                            qs = data.get("questions", [])
                            for q in qs:
                                txt = q.get("question", "").strip()
                                if txt: blacklist.add(txt)
                    except: pass
    print(f"Loaded {len(blacklist)} questions into the practice blacklist.")
    return blacklist

def load_mock_used_ids(course, mock_range):
    """Load UIDs from existing mock JSONs to ensure we don't repeat them in the new batch."""
    used = { subj: set() for subj in ["maths", "physics", "chemistry", "botany", "zoology"] }
    mock_base = rf"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\mock_questions\{course}"
    
    for m in mock_range:
        mock_dir = os.path.join(mock_base, f"mock_{m}")
        if not os.path.exists(mock_dir): continue
        for f in os.listdir(mock_dir):
            if f.endswith(".json"):
                subj = f.replace(".json", "")
                try:
                    with open(os.path.join(mock_dir, f), 'r', encoding='utf-8') as file:
                        qs = json.load(file)
                        for q in qs:
                            uid = q.get("_uid")
                            if uid: used[subj].add(uid)
                except: pass
    return used

def select_questions(subject_path, target_count, used_ids, blacklist, hard_ratio=0.8):
    hard_target = int(target_count * hard_ratio)
    medium_target = target_count - hard_target
    
    selected = []
    hard_questions = []
    medium_questions = []
    easy_questions = []
    
    # Get all topic files
    files = [f for f in os.listdir(subject_path) if f.endswith('.json')]
    
    for f in files:
        with open(os.path.join(subject_path, f), 'r', encoding='utf-8') as file:
            data = json.load(file)
            for q in data.get('questions', []):
                q_uid = f"{f}_{q.get('id')}"
                # Filter rules
                # Use a looser filter for diagrams as requested, to ensure we have enough unique questions
                if q_uid in used_ids: continue
                if q.get('question', '').strip() in blacklist: continue
                
                diff = q.get('difficulty', '').lower()
                q['_uid'] = q_uid # attach for tracking
                if diff == 'hard':
                    hard_questions.append(q)
                elif diff == 'medium':
                    medium_questions.append(q)
                else:
                    easy_questions.append(q)
    
    # Shuffle to ensure randomness across topics
    random.shuffle(hard_questions)
    random.shuffle(medium_questions)
    random.shuffle(easy_questions)
    
    if len(hard_questions) < hard_target:
        print(f"Warning: Only {len(hard_questions)} hard questions available for {subject_path}")
        hard_target = len(hard_questions)
    
    # Try to fill up to target_count with whatever we have
    final_picks = hard_questions[:hard_target]
    remaining_needed = target_count - len(final_picks)
    
    if remaining_needed > 0:
        # Fill with Medium first
        final_picks += medium_questions[:remaining_needed]
        remaining_needed = target_count - len(final_picks)
    
    if remaining_needed > 0:
        # Fill with Easy as last resort
        final_picks += easy_questions[:remaining_needed]
        remaining_needed = target_count - len(final_picks)
    for q in final_picks:
        used_ids.add(q.get('_uid'))
        
    if len(final_picks) < target_count:
        print(f"ERROR: Not enough unique questions for {subject_path}. Found {len(final_picks)}/{target_count}")
        # We don't want to compromise on uniqueness, so we'll just return what we have and fail the audit later
        
    random.shuffle(final_picks)
    return final_picks

def create_mock_batch(course, start_num, end_num, blacklist, initial_used=None):
    counts = {"maths": 80, "physics": 40, "chemistry": 40} if course == "engineering" else {"botany": 40, "zoology": 40, "physics": 40, "chemistry": 40}
    
    # Track used IDs across all mocks in this course batch to prevent INTRA-MOCK repetition
    course_used_ids = initial_used if initial_used else {subject: set() for subject in counts.keys()}
    
    for i in range(start_num, end_num + 1):
        base_target = f"public/mock_questions/{course}/mock_{i}"
        os.makedirs(base_target, exist_ok=True)
        
        for subject, count in counts.items():
            subject_path = f"c:/Users/admin/OneDrive/Desktop/SeatCracker/splitted/questions/{subject}"
            
            # Use the actual set from the dict so it updates in-place for all mocks in the batch
            used_set = course_used_ids[subject]
            questions = select_questions(subject_path, count, used_set, blacklist)
            
            target_file = f"c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app/{base_target}/{subject}.json"
            with open(target_file, 'w', encoding='utf-8') as f:
                json.dump(questions, f, indent=2, ensure_ascii=False)
            print(f"Created {target_file} with {len(questions)} questions.")

# Workflow: FULL SYNC (Mocks 1-6)
practice_blacklist = load_practice_blacklist()

# 1. Engineering
eng_used = set() # We start fresh to ensure all mocks are generated with the NEW encoding
create_mock_batch("engineering", 1, 6, practice_blacklist)

# 2. Agri/Pharma
agri_used = set()
create_mock_batch("agri_pharma", 1, 6, practice_blacklist)
