import json
import os

backup_path = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2_backup\mock_test_1\realMock1.json'
target_path = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\EAMCET\real_mocks\Engineering\mock_test_1\realMock1.json'
images_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\EAMCET\real_mocks\Engineering\mock_test_1\images'

with open(backup_path, 'r', encoding='utf-8') as f:
    questions = json.load(f)

for q in questions:
    qid = q['id']
    
    found_images = []
    
    # Check for primary image
    main_img = f'Q{qid}.png'
    if os.path.exists(os.path.join(images_dir, main_img)):
        found_images.append(f'/real_mocks/Engineering/mock_test_1/images/{main_img}')
    
    # Check for sub-images (a, b, c...)
    for sub in ['a', 'b', 'c']:
        sub_img = f'Q{qid}{sub}.png'
        if os.path.exists(os.path.join(images_dir, sub_img)):
            found_images.append(f'/real_mocks/Engineering/mock_test_1/images/{sub_img}')
    
    if len(found_images) == 1:
        q['image'] = found_images[0]
        if 'images' in q: del q['images']
        q['question'] = ""
    elif len(found_images) > 1:
        q['image'] = None
        q['images'] = found_images
        q['question'] = ""
    else:
        q['image'] = None
        if 'images' in q: del q['images']

with open(target_path, 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2)

print(f"Successfully processed {len(questions)} questions with multi-image support.")
