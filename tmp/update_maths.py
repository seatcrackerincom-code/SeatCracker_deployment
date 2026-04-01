import json

path = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\SYLLABUS\questions\maths.json'
try:
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    with open(r'c:\Users\admin\OneDrive\Desktop\SeatCracker\tmp\topic_35.json', 'r', encoding='utf-8') as f:
        t35 = json.load(f)[0]
    with open(r'c:\Users\admin\OneDrive\Desktop\SeatCracker\tmp\topic_36.json', 'r', encoding='utf-8') as f:
        t36 = json.load(f)[0]

    # Find Topic 35
    idx_35 = next((i for i, t in enumerate(data) if t.get('topic_id') == 35), None)
    
    # Check if Topic 36 already exists (just in case)
    idx_36 = next((i for i, t in enumerate(data) if t.get('topic_id') == 36), None)

    if idx_35 is not None:
        print(f"Replacing Topic 35 at index {idx_35}")
        data[idx_35] = t35
        if idx_36 is None:
            print("Inserting Topic 36 after Topic 35")
            data.insert(idx_35 + 1, t36)
        else:
            print(f"Replacing existing Topic 36 at index {idx_36}")
            data[idx_36] = t36
    else:
        print("Topic 35 not found. Finding Topic 34 to insert after.")
        idx_34 = next((i for i, t in enumerate(data) if t.get('topic_id') == 34), None)
        if idx_34 is not None:
            data.insert(idx_34 + 1, t35)
            data.insert(idx_34 + 2, t36)
        else:
            print("Topic 34 not found either. Appending to end (not ideal).")
            data.append(t35)
            data.append(t36)

    # Sort data by topic_id just to be sure
    data.sort(key=lambda x: x.get('topic_id', 0))

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)
    print("Successfully updated maths.json")

except Exception as e:
    print(f"Error: {e}")
