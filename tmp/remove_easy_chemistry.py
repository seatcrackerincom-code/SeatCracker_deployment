import json
import os

def remove_easy_chemistry():
    # 1. Process topic-wise files
    topics_dir = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\chemistry"
    files = [f for f in os.listdir(topics_dir) if f.endswith(".json")]
    
    for filename in files:
        file_path = os.path.join(topics_dir, filename)
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Handle different potential structures (array vs object with 'questions' key)
        if isinstance(data, list):
            original_count = len(data)
            updated_qs = [q for q in data if q.get('difficulty', '').lower() != 'easy']
            final_data = updated_qs
        else:
            original_qs = data.get('questions', [])
            original_count = len(original_qs)
            updated_qs = [q for q in original_qs if q.get('difficulty', '').lower() != 'easy']
            data['questions'] = updated_qs
            final_data = data
        
        # Re-index IDs if they exist
        if isinstance(final_data, list):
            for i, q in enumerate(final_data):
                if 'id' in q: q['id'] = i + 1
        else:
            for i, q in enumerate(final_data['questions']):
                if 'id' in q: q['id'] = i + 1
                
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, indent=4)
        
        new_count = len(updated_qs)
        if original_count != new_count:
            print(f"Cleaned {filename}: {original_count} -> {new_count} questions.")

    # 2. Process master file
    master_path = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\SYLLABUS\questions\chemistry.json"
    if os.path.exists(master_path):
        with open(master_path, 'r', encoding='utf-8') as f:
            master_data = json.load(f)
        
        # Master format is a list of topic objects: [{"topic_id": 1, "questions": [...]}, ...]
        if isinstance(master_data, list):
            total_removed = 0
            for topic in master_data:
                if 'questions' in topic:
                    original_topic_count = len(topic['questions'])
                    updated_topic_qs = [q for q in topic['questions'] if q.get('difficulty', '').lower() != 'easy']
                    topic['questions'] = updated_topic_qs
                    
                    # Re-index topic questions
                    for i, q in enumerate(topic['questions']):
                        q['id'] = i + 1
                    
                    total_removed += (original_topic_count - len(updated_topic_qs))
            
            with open(master_path, 'w', encoding='utf-8') as f:
                json.dump(master_data, f, indent=4)
            print(f"Cleaned master chemistry.json: Total {total_removed} 'easy' questions removed.")

if __name__ == "__main__":
    remove_easy_chemistry()
