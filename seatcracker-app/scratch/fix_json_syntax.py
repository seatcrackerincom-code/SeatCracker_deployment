import re
import json

file_path = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\EAMCET\real_mocks\Engineering\mock_test_1\realMock1.json'

with open(file_path, 'r', encoding='utf-8') as f:
    raw_content = f.read()

# Fix the ][ transition
# It looks like:
# ...
#   }
# ]
# [
#   {
# ...
fixed_content = raw_content.replace(']\n[', ',')

# Fix the missing closing brace at the end
# The user's edit ended with:
#   }
# 
# ]
# But wait, looking at the last lines:
# 2110:     "image": "/real_mocks/Agriculture/mock_test_1/images/Q160.png"
# 2111:   
# 2112: ]
# It seems to be missing the closing } for Q160.

# I'll use a regex to find all objects and put them into a list
# This is safer if the structure is messy.
import json

# Try to parse the fixed content
try:
    # First, try to just remove the middle brackets
    # Remove all ][ patterns with optional whitespace
    cleaned = re.sub(r'\]\s*\[', ',', raw_content)
    # The last object might be missing a }
    # 2110:     "image": "/real_mocks/Agriculture/mock_test_1/images/Q160.png"
    # 2111:   
    # 2112: ]
    # We need to add } before ]
    if not re.search(r'\}\s*\]\s*$', cleaned):
        cleaned = re.sub(r'\]\s*$', '}\n]', cleaned)
    
    data = json.loads(cleaned)
    
    # Now fix image paths and ensure correctness
    for q in data:
        if q.get('image'):
            # Replace Agriculture with Engineering in paths
            q['image'] = q['image'].replace('/Agriculture/', '/Engineering/')
        if q.get('images'):
            q['images'] = [img.replace('/Agriculture/', '/Engineering/') for img in q['images']]
            
    # Write back clean JSON
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print(f"Successfully fixed JSON syntax and image paths for {len(data)} questions.")

except Exception as e:
    print(f"Error parsing JSON: {e}")
    # Fallback: manually reconstruct if it's too broken
    # I'll try to find all { ... } blocks
    blocks = re.findall(r'\{[^{}]*\}', raw_content, re.DOTALL)
    print(f"Found {len(blocks)} blocks via regex fallback.")
