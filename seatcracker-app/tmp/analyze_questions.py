import os
import json

def analyze_questions(root_dir):
    report = []
    total_files = 0
    junk_files = 0
    
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.json'):
                path = os.path.join(root, file)
                total_files += 1
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        questions = data.get('questions', [])
                        
                        topic_junk_count = 0
                        for q in questions:
                            q_text = str(q.get('question', ''))
                            options = q.get('options', {})
                            
                            # Detection criteria:
                            # 1. Contains "Hard Question" or "Placeholder"
                            # 2. Options are exactly "A", "B", "C", "D" (not the keys, the values)
                            is_placeholder_text = "Hard Question" in q_text or "Placeholder" in q_text
                            is_junk_options = (
                                options.get('A') == 'A' and 
                                options.get('B') == 'B' and 
                                options.get('C') == 'C' and 
                                options.get('D') == 'D'
                            )
                            
                            if is_placeholder_text or is_junk_options:
                                topic_junk_count += 1
                        
                        if topic_junk_count > 0:
                            junk_files += 1
                            rel_path = os.path.relpath(path, root_dir)
                            report.append(f"[JUNK] {rel_path}: {topic_junk_count}/{len(questions)} placeholders found.")
                        # else:
                        #     rel_path = os.path.relpath(path, root_dir)
                        #     report.append(f"[CLEAN] {rel_path}")
                            
                except Exception as e:
                    report.append(f"[ERROR] {path}: {str(e)}")
                    
    print(f"Analysis Complete.")
    print(f"Total JSON files: {total_files}")
    print(f"Files with JUNK: {junk_files}")
    print("-" * 50)
    for line in report:
        print(line)

if __name__ == "__main__":
    base_path = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2"
    analyze_questions(base_path)
