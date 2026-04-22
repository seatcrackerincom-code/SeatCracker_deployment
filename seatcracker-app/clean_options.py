import json
import re

file_path = r'public\EAMCET\real_mocks\Agriculture\mock_test_2\realMock2.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for q in data:
    for i in range(4):
        opt = q['options'][i].strip()
        
        # Remove any existing prefix like (1), (2), (A), 1., etc. at the very beginning
        # Actually, let's just make sure it starts with exactly '(i+1) '
        prefix = f'({i+1})'
        
        if not opt.startswith(prefix):
            # Try to clean up existing wrong prefixes
            opt = re.sub(r'^\(\d+\)\s*', '', opt) # remove (1) , (2) 
            opt = re.sub(r'^\([A-Za-z]+\)\s*', '', opt) # remove (A), (i), etc.
            opt = re.sub(r'^\d+\.\s*', '', opt) # remove 1. , 2. 
            
            q['options'][i] = f'{prefix} {opt}'
        else:
            # It starts with (1), but let's make sure it has a space
            opt = re.sub(r'^\(\d+\)\s*', '', opt)
            q['options'][i] = f'{prefix} {opt}'

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
print('Done!')
