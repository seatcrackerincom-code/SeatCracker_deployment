import json
import re

def check_mock(name, path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Could not read {name}: {e}")
        return
        
    missing = []
    for q in data:
        # Check if it has an image
        has_image = bool(q.get('image'))
        
        # Check if it's likely a diagram question
        q_text = q.get('question', '')
        opts = q.get('options', [])
        
        # 1. Are options completely empty? (Meaning they were diagrams in the PDF)
        opts_empty = all(len(o.strip()) <= 4 for o in opts) # e.g. "(1) "
        
        # 2. Does text contain diagram keywords?
        has_keywords = bool(re.search(r'(?i)diagram|figure|match the following|reaction sequence|major product|structure of', q_text))
        
        if not has_image and (opts_empty or has_keywords):
            missing.append(q['id'])
            
    if missing:
        print(f"[{name}] Missing Diagram Suspects: {missing}")
    else:
        print(f"[{name}] All good! No missing diagrams detected.")

print("Checking Mock 1s...")
check_mock("Agriculture Mock 1", r"public\EAMCET\real_mocks\Agriculture\mock_test_1\realMock1.json")
check_mock("Pharmacy Mock 1", r"public\EAMCET\real_mocks\Pharmacy\mock_test_1\realMock1.json")
check_mock("Engineering Mock 1", r"public\EAMCET\real_mocks\Engineering\mock_test_1\realMock1.json")
