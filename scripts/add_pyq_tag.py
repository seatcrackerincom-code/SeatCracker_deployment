import json

file_path = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\PYQS\Maths\eamcet_pyq_questions_maths.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for topic in data:
    for question in data[topic]:
        question['tag'] = 'pyq'

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Successfully added 'pyq' tags to all questions.")
