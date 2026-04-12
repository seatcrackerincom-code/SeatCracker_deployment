import json
import os
import glob

def remove_easy_questions(directory):
    json_files = glob.glob(os.path.join(directory, "*.json"))
    total_removed = 0
    files_processed = 0

    for file_path in json_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if 'questions' not in data:
                continue
            
            original_count = len(data['questions'])
            # Filter out easy questions (case-insensitive)
            filtered_questions = [
                q for q in data['questions'] 
                if q.get('difficulty', '').lower() != 'easy'
            ]
            
            new_count = len(filtered_questions)
            removed_in_file = original_count - new_count
            
            if removed_in_file > 0:
                data['questions'] = filtered_questions
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2)
                print(f"Processed {os.path.basename(file_path)}: Removed {removed_in_file} easy questions.")
                total_removed += removed_in_file
            
            files_processed += 1
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

    print(f"\nSummary: Processed {files_processed} files. Total easy questions removed: {total_removed}")

if __name__ == "__main__":
    physics_dir = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\physics"
    remove_easy_questions(physics_dir)
