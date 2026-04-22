import json
import os

courses = ['Agriculture', 'Pharmacy']
img_dir_agri = r'public\EAMCET\real_mocks\Agriculture\mock_test_2\images'

# Get all available image IDs
available_ids = set()
if os.path.exists(img_dir_agri):
    for f in os.listdir(img_dir_agri):
        if f.lower().endswith('.png'):
            # Extract number from q11.png
            try:
                qid = int(f.lower().replace('q', '').replace('.png', ''))
                available_ids.add(qid)
            except:
                pass

for course in courses:
    json_path = rf'public\EAMCET\real_mocks\{course}\mock_test_2\realMock2.json'
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    for q in data:
        if q['id'] in available_ids:
            q['image'] = f'/real_mocks/{course}/mock_test_2/images/Q{q["id"]}.png'
            
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

print(f"Assigned image paths for {len(available_ids)} images across both JSONs.")
