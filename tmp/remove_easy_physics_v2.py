import json
import os
import glob

def remove_from_master(master_path):
    print(f"Checking master file: {master_path}")
    try:
        with open(master_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        total_removed = 0
        # Master format is a list of topics, each with a 'questions' list
        for topic in data:
            if 'questions' in topic:
                original_count = len(topic['questions'])
                topic['questions'] = [
                    q for q in topic['questions'] 
                    if q.get('difficulty', '').lower() != 'easy'
                ]
                total_removed += (original_count - len(topic['questions']))
        
        if total_removed > 0:
            with open(master_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4)
            print(f"Master file updated: Removed {total_removed} easy questions.")
        else:
            print("No easy questions found in master file.")
        return total_removed
    except Exception as e:
        print(f"Error processing master file: {e}")
        return 0

def remove_from_topic_wise(directory):
    print(f"Checking topic-wise directory: {directory}")
    json_files = glob.glob(os.path.join(directory, "*.json"))
    total_removed = 0
    
    for file_path in json_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if 'questions' not in data:
                continue
            
            original_count = len(data['questions'])
            data['questions'] = [
                q for q in data['questions'] 
                if q.get('difficulty', '').lower() != 'easy'
            ]
            
            removed_in_file = original_count - len(data['questions'])
            if removed_in_file > 0:
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2)
                print(f"Updated {os.path.basename(file_path)}: Removed {removed_in_file} questions.")
                total_removed += removed_in_file
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
    
    print(f"Topic-wise cleanup complete. Total removed: {total_removed}")
    return total_removed

if __name__ == "__main__":
    master_physics = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\SYLLABUS\questions\physics.json"
    topic_wise_dir = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\physics"
    
    removed_master = remove_from_master(master_physics)
    removed_topics = remove_from_topic_wise(topic_wise_dir)
    
    print(f"\nFinal Summary:")
    print(f"Easy questions removed from Master: {removed_master}")
    print(f"Easy questions removed from Topic-wise: {removed_topics}")
