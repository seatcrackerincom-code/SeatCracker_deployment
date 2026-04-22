import json
import collections

file_path = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\EAMCET\real_mocks\Engineering\mock_test_1\realMock1.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check for duplicate IDs
ids = [q['id'] for q in data]
id_counts = collections.Counter(ids)
duplicate_ids = [id for id, count in id_counts.items() if count > 1]

# Check for duplicate question text (if question is not empty)
# Many questions use images, so their 'question' field is ""
# But some might be duplicated.
questions = [q['question'] for q in data if q['question'].strip()]
q_counts = collections.Counter(questions)
duplicate_questions = [q for q, count in q_counts.items() if count > 1]

# Check for duplicate images
images = [q['image'] for q in data if q.get('image')]
img_counts = collections.Counter(images)
duplicate_images = [img for img, count in img_counts.items() if count > 1]

# Check for duplicate images in 'images' array
all_sub_images = []
for q in data:
    if q.get('images'):
        all_sub_images.extend(q['images'])
sub_img_counts = collections.Counter(all_sub_images)
duplicate_sub_images = [img for img, count in sub_img_counts.items() if count > 1]

print(f"Total questions: {len(data)}")
print(f"Duplicate IDs: {duplicate_ids}")
print(f"Duplicate Questions: {len(duplicate_questions)}")
print(f"Duplicate Images: {duplicate_images}")
print(f"Duplicate Sub-Images: {duplicate_sub_images}")

if duplicate_ids or duplicate_images:
    print("\nWarning: Duplicates found!")
    # Automatically fix duplicate IDs by re-indexing if needed?
    # No, the user wants them DELETED if they are true duplicates.
else:
    print("\nNo duplicates found in IDs or Images.")
