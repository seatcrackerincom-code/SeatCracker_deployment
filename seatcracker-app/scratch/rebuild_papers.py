import json

def create_perfect_paper(path, paper_folder):
    questions = []
    subjects = [("Math", "Mathematics"), ("Phy", "Physics"), ("Chem", "Chemistry")]
    
    global_q_num = 1
    for sub_code, sub_name in subjects:
        for sec in range(1, 5):
            count = 4 if sec == 1 else 3 if sec == 2 else 6 if sec == 3 else 4
            q_type = "MSQ" if sec == 2 else "SA" if sec == 3 else "MCQ"
            marks = "+4, -2" if sec == 2 else "+4, 0" if sec == 3 else "+3, -1"
            
            for i in range(count):
                local_num = i + 1 + (4 if sec > 1 else 0) + (3 if sec > 2 else 0) + (6 if sec > 3 else 0)
                questions.append({
                    "id": f"{sub_code}-{sec}-{i}-{paper_folder}",
                    "subject": sub_code,
                    "section": sec,
                    "number": len([q for q in questions if q['subject'] == sub_code]) + 1,
                    "type": q_type,
                    "text": "",
                    "image": f"/JEE_Advanced/Day_1/{paper_folder}/images/q_{global_q_num}.png",
                    "marks": marks,
                    "answer": "1",
                    "options": ["A", "B", "C", "D"] if q_type != "SA" else []
                })
                global_q_num += 1
                
    with open(path, 'w') as f:
        json.dump({"questions": questions}, f, indent=2)
    print(f"Created Perfect Paper at {path} with {len(questions)} questions.")

create_perfect_paper('c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app/public/JEE_Advanced/Day_1/Paper_1/paper.json', 'Paper_1')
create_perfect_paper('c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app/public/JEE_Advanced/Day_1/Paper_2/paper.json', 'Paper_2')
