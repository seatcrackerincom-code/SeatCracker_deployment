import json
import re

file_path = r'public\EAMCET\real_mocks\Agriculture\mock_test_2\realMock2.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for q in data:
    for i in range(4):
        opt = q['options'][i]
        
        # Fix missing (A) in Assertion/Reason
        opt = re.sub(r'^\(1\) and \(R\) are correct', '(1) Both (A) and (R) are correct', opt)
        opt = re.sub(r'^\(2\) and \(R\) are correct', '(2) Both (A) and (R) are correct', opt)
        opt = re.sub(r'^\(3\) is correct, but \(R\)', '(3) (A) is correct, but (R)', opt)
        opt = re.sub(r'^\(4\) is not correct, but \(R\)', '(4) (A) is not correct, but (R)', opt)
        
        q['options'][i] = opt

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
print('Done!')
