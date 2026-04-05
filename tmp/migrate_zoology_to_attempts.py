import json
import os
import shutil

zoology_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\zoology'

def migrate_topic_to_attempts(filename):
    topic_path = os.path.join(zoology_dir, filename)
    topic_id = filename.replace('.json', '')
    dest_folder = os.path.join(zoology_dir, topic_id)
    
    if not os.path.exists(topic_path):
        return

    with open(topic_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    all_qs = data.get('questions', [])
    
    # Categorize questions
    pyqs = [q for q in all_qs if q.get('pyq') == True or q.get('tag') == 'pyq']
    others = [q for q in all_qs if q not in pyqs]
    
    # Ensure we have enough
    if len(pyqs) < 20:
        pyqs += others[: (20 - len(pyqs))]
        others = others[(20 - len(pyqs)):]

    # Create destination folder
    if not os.path.exists(dest_folder):
        os.makedirs(dest_folder)
        
    # Split into 4 attempts (5 PYQs + 15 Others each)
    for i in range(1, 5):
        attempt_pyqs = pyqs[(i-1)*5 : i*5]
        attempt_others = others[(i-1)*15 : i*15]
        attempt_qs = attempt_pyqs + attempt_others
        
        # Fallback if counts are off
        if len(attempt_qs) < 20:
            attempt_qs = all_qs[(i-1)*20 : i*20]

        # Re-index
        for idx, q in enumerate(attempt_qs):
            q['id'] = idx + 1
            
        output_file = os.path.join(dest_folder, f"attempt_{i}.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({"questions": attempt_qs}, f, indent=2, ensure_ascii=False)
            
    print(f"Successfully migrated {filename} to {topic_id}/ (4 attempts created)")
    
    # Move original to legacy
    legacy_dir = os.path.join(zoology_dir, "SYLLABUS", "legacy")
    if not os.path.exists(legacy_dir):
        os.makedirs(legacy_dir)
    shutil.move(topic_path, os.path.join(legacy_dir, filename))

# Process all 18 topics
core_topics = [
    "animal_kingdom.json", "structural_organisation_in_animals.json", "biomolecules.json",
    "digestion_and_absorption.json", "breathing_and_exchange_of_gases.json", "body_fluids_and_circulation.json",
    "excretory_products_and_their_elimination.json", "locomotion_and_movement.json", "neural_control_and_coordination.json",
    "chemical_coordination_and_integration.json", "human_reproduction_and_reproductive_health.json",
    "genetics_and_evolution.json", "human_health_and_disease.json", "animal_husbandry_strategies.json",
    "microbes_in_human_welfare.json", "biotechnology_and_applications.json", "organisms_and_populations.json", "ecosystems.json"
]

for f in core_topics:
    migrate_topic_to_attempts(f)
