import json
import os

def fix_paper(path, paper_folder):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return
    
    with open(path, 'r') as f:
        data = json.load(f)
    
    for q in data['questions']:
        # Fix Image Path
        # The images are in /JEE_Advanced/Day_1/Paper_X/images/q_N.png
        q_num = q.get('number', 1)
        # Ensure we point to the correct paper folder
        q['image'] = f"/JEE_Advanced/Day_1/{paper_folder}/images/q_{q_num}.png"
        
        # Fix Marking Scheme
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
    print(f"Fixed {path}")

# Fix Paper 1
fix_paper('c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app/public/JEE_Advanced/Day_1/Paper_1/paper.json', 'Paper_1')
# Fix Paper 2
fix_paper('c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app/public/JEE_Advanced/Day_1/Paper_2/paper.json', 'Paper_2')
