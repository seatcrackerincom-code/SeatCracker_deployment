import os
import json
import re
import shutil

def get_input(prompt, default=None):
    val = input(f"{prompt} [{default}]: " if default else f"{prompt}: ")
    return val.strip() if val.strip() else default

def normalize_answer(ans):
    ans_map = {"A": "1", "B": "2", "C": "3", "D": "4"}
    return ans_map.get(str(ans).upper(), str(ans))

def automate_mock_pipeline():
    print("=== SeatCracker Mock Test Pipeline Automation ===")
    
    # 1. Get Course
    course = get_input("Enter Course (1: Engineering, 2: Agriculture, 3: Pharmacy)", "1")
    course_map = {"1": "Engineering", "2": "Agriculture", "3": "Pharmacy"}
    course = course_map.get(course, course)
    
    # 2. Get Mock Number
    mock_num = get_input("Enter Mock Test Number (e.g. 4)")
    if not mock_num:
        print("Error: Mock number is required.")
        return

    # 3. Get Source Directory
    src_dir = get_input("Enter SOURCE directory containing the 160 images")
    if not os.path.exists(src_dir):
        print(f"Error: Source directory '{src_dir}' does not exist.")
        return

    # 4. Set Destination
    base_dest = os.path.join("seatcracker-app", "public", "EAMCET", "real_mocks", course, f"mock_test_{mock_num}")
    img_dest = os.path.join(base_dest, "images")
    json_path = os.path.join(base_dest, f"realMock{mock_num}.json")

    print(f"\nTarget Destination: {base_dest}")
    
    if not os.path.exists(img_dest):
        os.makedirs(img_dest, exist_ok=True)
        print(f"Created directory: {img_dest}")

    # 5. Process Answers
    ans_dict = {}
    ans_file = os.path.join(src_dir, "answers.txt")
    if os.path.exists(ans_file):
        print("Found answers.txt in source. Loading...")
        with open(ans_file, 'r') as f:
            lines = [l.strip() for l in f.readlines() if l.strip()]
            for i, val in enumerate(lines):
                parts = val.split()
                if len(parts) > 1 and parts[0].replace('.','').isdigit():
                    q_num = int(parts[0].replace('.',''))
                    ans = parts[1]
                else:
                    q_num = i + 1
                    ans = val
                ans_dict[q_num] = normalize_answer(ans)

    # 6. Process Images and Build JSON
    existing_src_files = os.listdir(src_dir)
    questions = []
    missing_count = 0
    
    for i in range(1, 161):
        # Find image in source
        found_file = None
        # Priority: q_1.png, q1.png, q_1.jpg, etc.
        patterns = [f"q_{i}.png", f"q{i}.png", f"q_{i}.jpg", f"q{i}.jpg", f"Q_{i}.png", f"Q{i}.png", f"q_{i}.PNG"]
        for p in patterns:
            if p in existing_src_files:
                found_file = p
                break
        
        target_img_name = f"q_{i}.png" # We normalize to q_X.png in destination
        
        if found_file:
            # Copy to destination
            src_file_path = os.path.join(src_dir, found_file)
            dest_file_path = os.path.join(img_dest, target_img_name)
            shutil.copy2(src_file_path, dest_file_path)
        else:
            missing_count += 1
            
        # Determine subject
        if course == "Engineering":
            if i <= 80: subj = "Mathematics"
            elif i <= 120: subj = "Physics"
            else: subj = "Chemistry"
        else:
            if i <= 40: subj = "Botany"
            elif i <= 80: subj = "Zoology"
            elif i <= 120: subj = "Physics"
            else: subj = "Chemistry"

        questions.append({
            "id": i,
            "subject": subj,
            "question": "",
            "options": ["1", "2", "3", "4"],
            "answer": ans_dict.get(i, "1"),
            "image": f"/real_mocks/{course}/mock_test_{mock_num}/images/{target_img_name}"
        })

    # 7. Write JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2)

    print("\n--- Summary ---")
    print(f"Course: {course}")
    print(f"Mock: {mock_num}")
    print(f"Images Copied: {160 - missing_count}/160")
    if missing_count > 0:
        print(f"WARNING: {missing_count} images were missing from source.")
    print(f"JSON Generated: {json_path}")
    print("Done!")

if __name__ == "__main__":
    automate_mock_pipeline()
