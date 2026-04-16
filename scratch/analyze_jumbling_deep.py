import os
import json
from collections import defaultdict

root_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2'

def analyze_jumbling():
    subject_topics = []
    for sub in os.listdir(root_dir):
        sub_path = os.path.join(root_dir, sub)
        if os.path.isdir(sub_path):
            for topic in os.listdir(sub_path):
                topic_path = os.path.join(sub_path, topic)
                if os.path.isdir(topic_path):
                    subject_topics.append((sub, topic, topic_path))

    # question_text -> list of (subject, topic)
    question_map = defaultdict(list)
    
    for sub, topic, topic_path in subject_topics:
        for attempt_file in os.listdir(topic_path):
            if attempt_file.startswith('attempt_') and attempt_file.endswith('.json'):
                file_path = os.path.join(topic_path, attempt_file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        for q in data.get('questions', []):
                            text = q.get('question', '').strip()
                            if text:
                                # Clean up (Variant XXX) for grouping
                                base_text = text.split('(Variant')[0].strip()
                                if base_text not in [pair[1] for pair in question_map[base_text]]:
                                     question_map[base_text].append((sub, topic))
                except Exception as e:
                    pass

    # Find widespread questions
    print("--- Widespread Jumbled Questions ---")
    for q_text, occurrences in question_map.items():
        if len(occurrences) > 3:
            print(f"Question: {q_text[:70]}...")
            print(f"Count: {len(occurrences)} topics")
            # Sample first 5 topics
            sample = [f"{s}/{t}" for s, t in occurrences[:5]]
            print(f"Sample Locations: {', '.join(sample)}")
            print("-" * 30)

if __name__ == "__main__":
    analyze_jumbling()
