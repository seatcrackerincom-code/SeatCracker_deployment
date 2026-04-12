import json
import os
import shutil

zoology_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\zoology'
legacy_dir = os.path.join(zoology_dir, 'SYLLABUS', 'legacy')

def migrate_topic_v2(filename):
    legacy_path = os.path.join(legacy_dir, filename)
    topic_id = filename.replace('.json', '')
    dest_folder = os.path.join(zoology_dir, topic_id)
    
    if not os.path.exists(legacy_path):
        print(f"Skipping {filename} (not found in legacy)")
        return

    with open(legacy_path, 'r', encoding='utf-8') as f:
        all_qs = json.load(f).get('questions', [])
    
    # Categorize questions
    pyqs = [q for q in all_qs if q.get('pyq') == True]
    others = [q for q in all_qs if q not in pyqs]
    
    # Ensure destination folder exists
    if not os.path.exists(dest_folder):
        os.makedirs(dest_folder)
        
    # Split into 4 attempts (Total 80 Qs)
    # Target: 5 PYQs + 15 Others per attempt
    for i in range(1, 5):
        # We take a slice of available PYQs and Others
        att_pyqs = pyqs[(i-1)*5 : i*5]
        att_others = others[(i-1)*15 : i*15]
        
        att_qs = att_pyqs + att_others
        
        # If we have less than 20 (e.g. not enough PYQs or Others), pad with remaining pool
        if len(att_qs) < 20:
            remaining = [q for q in all_qs if q not in att_qs]
            att_qs += remaining[:20-len(att_qs)]
            
        # Hard limit of 20
        att_qs = att_qs[:20]
        
        # Re-index
        for idx, q in enumerate(att_qs):
            q['id'] = idx + 1
            
        output_file = os.path.join(dest_folder, f"attempt_{i}.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({"questions": att_qs}, f, indent=2, ensure_ascii=False)
            
    print(f"Finalized {topic_id}/ (4 attempts created)")

# List of 18 core topics
core_topics = [
    "animal_kingdom.json", "structural_organisation_in_animals.json", "biomolecules.json",
    "digestion_and_absorption.json", "breathing_and_exchange_of_gases.json", "body_fluids_and_circulation.json",
    "excretory_products_and_their_elimination.json", "locomotion_and_movement.json", "neural_control_and_coordination.json",
    "chemical_coordination_and_integration.json", "human_reproduction_and_reproductive_health.json",
    "genetics_and_evolution.json", "human_health_and_disease.json", "animal_husbandry_strategies.json",
    "microbes_in_human_welfare.json", "biotechnology_and_applications.json", "organisms_and_populations.json", "ecosystems.json"
]

# Run the migration
for f in core_topics:
    migrate_topic_v2(f)
