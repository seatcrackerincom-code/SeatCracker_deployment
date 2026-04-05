import json
import os
import re

def slugify(text):
    text = text.lower()
    text = re.sub(r' & ', '_', text)
    text = re.sub(r'\(c,h,o\)', 'c_h_o', text)
    text = re.sub(r'\(', '', text)
    text = re.sub(r'\)', '', text)
    text = re.sub(r' ', '_', text)
    text = re.sub(r'-', '_', text)
    return text

def integrate_pyqs():
    pyq_file = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\pyqs\chemistry.json"
    topics_dir = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\chemistry"
    syllabus_file = r"c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\SYLLABUS\AP\Engineering\Chemistry\Chemistry.json"

    # 1. Load Syllabus to get the definitive slugs
    with open(syllabus_file, 'r', encoding='utf-8') as f:
        syllabus = json.load(f)
    
    # Map syllabus chapter name to its official slug
    chapter_to_slug = {item['chapter']: item['topic_slug'] for item in syllabus}
    
    # 2. Load PYQs
    with open(pyq_file, 'r', encoding='utf-8') as f:
        pyq_data = json.load(f)
    pyq_questions = pyq_data.get('questions', {})

    report = []

    # 3. Process Topic by Topic from PYQ file
    for pyq_topic_name, pyqs in pyq_questions.items():
        # Map PYQ topic name to official slug
        # First try direct slugify, then try manual mapping if it's special
        official_slug = chapter_to_slug.get(pyq_topic_name, slugify(pyq_topic_name))
        
        # Correct some specific mappings
        if pyq_topic_name == "s-block": official_slug = "s_block_elements"
        if pyq_topic_name == "d & f Block": official_slug = "d_f_block"
        if pyq_topic_name == "Periodic Table": official_slug = "periodic_table"
        if pyq_topic_name == "Organic (C,H,O)": official_slug = "organic_c_h_o"
        if pyq_topic_name == "GOC": official_slug = "goc"

        target_file = os.path.join(topics_dir, f"{official_slug}.json")
        
        # Load existing questions
        existing_qs = []
        if os.path.exists(target_file):
            with open(target_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                existing_qs = data.get('questions', []) if isinstance(data, dict) else data
        
        # Deduplication and Merging
        question_texts = {q.get('question', '').strip().lower() for q in existing_qs}
        added_count = 0
        for pyq in pyqs:
            q_text = pyq.get('question', '').strip().lower()
            if q_text not in question_texts:
                # Format PYQ to match target schema
                formatted_pyq = {
                    "question": pyq.get('question'),
                    "difficulty": pyq.get('difficulty', 'medium'),
                    "pyq": True,
                    "options": pyq.get('options'),
                    "answer": pyq.get('answer'),
                    "hasDiagram": pyq.get('hasDiagram', False),
                    "diagram_description": pyq.get('diagram_description', "")
                }
                existing_qs.append(formatted_pyq)
                question_texts.add(q_text)
                added_count += 1
        
        # Re-index
        for i, q in enumerate(existing_qs):
            q['id'] = i + 1
            
        # Save merged file
        final_data = {
            "subject": "Chemistry",
            "topic": pyq_topic_name,
            "questions": existing_qs
        }
        with open(target_file, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, indent=4)
        
        current_count = len(existing_qs)
        shortfall = max(0, 80 - current_count)
        report.append({
            "topic": pyq_topic_name,
            "added": added_count,
            "current": current_count,
            "shortfall": shortfall
        })

    # 4. Handle p-block elements (missing from PYQs)
    pblock_slug = "p_block_elements"
    pblock_file = os.path.join(topics_dir, f"{pblock_slug}.json")
    if os.path.exists(pblock_file):
        with open(pblock_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            p_qs = data.get('questions', []) if isinstance(data, dict) else data
        report.append({
            "topic": "p-Block Elements",
            "added": 0,
            "current": len(p_qs),
            "shortfall": max(0, 80 - len(p_qs))
        })

    # Output report
    print("| Topic | PYQs Added | Current Count | Shortfall to 80 |")
    print("| :--- | :--- | :--- | :--- |")
    for row in report:
        print(f"| {row['topic']} | {row['added']} | {row['current']} | {row['shortfall']} |")

if __name__ == "__main__":
    integrate_pyqs()
