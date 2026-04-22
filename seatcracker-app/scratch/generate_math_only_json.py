import json
import os

# Extracted answers for Math (Q1-80) from engineering1.txt
math_answers = {
    1: "1", 2: "2", 3: "3", 4: "1", 5: "2", 6: "3", 7: "4", 8: "1", 9: "2", 10: "3",
    11: "4", 12: "2", 13: "2", 14: "4", 15: "1", 16: "1", 17: "4", 18: "3", 19: "4", 20: "3",
    21: "4", 22: "1", 23: "3", 24: "2", 25: "3", 26: "4", 27: "4", 28: "4", 29: "1", 30: "4",
    31: "2", 32: "3", 33: "4", 34: "1", 35: "2", 36: "3", 37: "4", 38: "1", 39: "2", 40: "3",
    41: "2", 42: "3", 43: "1", 44: "3", 45: "1", 46: "4", 47: "1", 48: "2", 49: "3", 50: "2",
    51: "1", 52: "2", 53: "3", 54: "4", 55: "1", 56: "2", 57: "3", 58: "3", 59: "2", 60: "3",
    61: "2", 62: "1", 63: "2", 64: "3", 65: "2", 66: "1", 67: "1", 68: "2", 69: "3", 70: "4",
    71: "1", 72: "2", 73: "3", 74: "4", 75: "1", 76: "2", 77: "3", 78: "4", 79: "2", 80: "1"
}

multi_image_qs = [8, 15, 17, 38, 42, 50, 55]

target_path = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\EAMCET\real_mocks\Engineering\mock_test_1\realMock1.json'

# Generate ONLY Math questions (1-80)
math_questions = []
for qid in range(1, 81):
    q_entry = {
        "id": qid,
        "subject": "MATHEMATICS",
        "question": "",
        "options": ["(1) ", "(2) ", "(3) ", "(4) "],
        "answer": math_answers.get(qid, "1")
    }
    
    if qid in multi_image_qs:
        q_entry["image"] = None
        q_entry["images"] = [
            f"/real_mocks/Engineering/mock_test_1/images/Q{qid}.png",
            f"/real_mocks/Engineering/mock_test_1/images/Q{qid}a.png"
        ]
    else:
        q_entry["image"] = f"/real_mocks/Engineering/mock_test_1/images/Q{qid}.png"

    math_questions.append(q_entry)

with open(target_path, 'w', encoding='utf-8') as f:
    json.dump(math_questions, f, indent=2)

print(f"Successfully saved only 80 Mathematics questions to realMock1.json.")
