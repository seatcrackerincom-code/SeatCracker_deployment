import json
import os

def fix_paper_comprehensive(path, paper_folder):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return
    
    with open(path, 'r') as f:
        data = json.load(f)
    
    # We must preserve the order in paper.json which is Math, then Phy, then Chem
    # Let's just iterate and keep a global counter for images
    for i, q in enumerate(data['questions']):
        # Image numbering is 1-indexed based on index in list
        img_num = i + 1
        q['image'] = f"/JEE_Advanced/Day_1/{paper_folder}/images/q_{img_num}.png"
        
        # Ensure marks are correct
        sec = q.get('section', 1)
        if sec == 1: # MCQ
            q['marks'] = "+3, -1"
        elif sec == 2: # MSQ
            q['marks'] = "+4, -2"
        elif sec == 3: # SA (Numerical)
            q['marks'] = "+4, 0"
        else:
            q['marks'] = "+3, 0"
            
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Comprehensively fixed {path}")

# Fix Paper 1
fix_paper_comprehensive('c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app/public/JEE_Advanced/Day_1/Paper_1/paper.json', 'Paper_1')
# Fix Paper 2
fix_paper_comprehensive('c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app/public/JEE_Advanced/Day_1/Paper_2/paper.json', 'Paper_2')
