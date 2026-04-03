import json
import os

base_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions'
output_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2'

# Ensure the output directory map exists
subjects = ['maths', 'physics', 'chemistry', 'botany', 'zoology']
for sub in subjects:
    path = os.path.join(output_dir, sub)
    if not os.path.exists(path):
        os.makedirs(path)

def clean_diagrams():
    total_cleaned = 0
    topic_count = 0
    
    for sub in subjects:
        sub_dir = os.path.join(base_dir, sub)
        if not os.path.exists(sub_dir):
            continue
            
        for filename in os.listdir(sub_dir):
            if not filename.endswith('.json'):
                continue
                
            input_path = os.path.join(sub_dir, filename)
            output_path = os.path.join(output_dir, sub, filename)
            
            try:
                with open(input_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                # Check if it's a list (some botany/zoology files are just lists of questions)
                # or a structured object with "questions" key
                if isinstance(data, list):
                    questions = data
                else:
                    questions = data.get('questions', [])
                
                # Filter out diagrams
                clean_qs = [q for q in questions if not q.get('hasDiagram', False)]
                removed_count = len(questions) - len(clean_qs)
                total_cleaned += removed_count
                
                # Re-index
                for i, q in enumerate(clean_qs):
                    q['id'] = i + 1
                    
                if isinstance(data, list):
                    final_data = clean_qs
                else:
                    data['questions'] = clean_qs
                    final_data = data
                
                with open(output_path, 'w', encoding='utf-8') as f:
                    json.dump(final_data, f, indent=2, ensure_ascii=False)
                
                topic_count += 1
                if removed_count > 0:
                    print(f"Cleaned {removed_count} diagram questions from {sub}/{filename}")
                    
            except Exception as e:
                print(f"Error processing {sub}/{filename}: {e}")

    print(f"--- GLOBAL CLEAN-UP COMPLETE ---")
    print(f"Total topics processed: {topic_count}")
    print(f"Total diagram questions removed: {total_cleaned}")
    print(f"Cleaned files saved in: {output_dir}")

if __name__ == "__main__":
    clean_diagrams()
