import json

eng_path = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\EAMCET\real_mocks\Engineering\mock_test_1\realMock1.json'
with open(eng_path, 'r', encoding='utf-8') as f:
    eng_data = json.load(f)

conv_path = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\extract_questions\converted_questions.json'
# Converted questions might be in UTF-16LE because of > redirect in powershell
try:
    with open(conv_path, 'r', encoding='utf-16') as f:
        new_q = json.load(f)
except:
    with open(conv_path, 'r', encoding='utf-8') as f:
        new_q = json.load(f)

# Append new questions to the 'questions' array
eng_data['questions'].extend(new_q)

# Save merged JSON
with open(eng_path, 'w', encoding='utf-8') as f:
    json.dump(eng_data, f, indent=4)

print("Merged successfully. Total questions:", len(eng_data['questions']))
