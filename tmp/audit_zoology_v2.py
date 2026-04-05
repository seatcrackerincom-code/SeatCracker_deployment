import json
import os

base_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\zoology'
legacy_dir = os.path.join(base_dir, 'SYLLABUS', 'legacy')
pyq_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\pyqs\eamcet_zoology_pyq_all_topics.json'

with open(pyq_file, 'r', encoding='utf-8') as f:
    pyq_data = json.load(f)

pyq_topics = pyq_data.get('topics', {})

mapping = {
    "animal_kingdom.json": "Animal Kingdom",
    "structural_organisation_in_animals.json": "Structural Organisation in Animals",
    "biomolecules.json": "Biomolecules",
    "digestion_and_absorption.json": "Digestion & Absorption",
    "breathing_and_exchange_of_gases.json": "Breathing & Exchange of Gases",
    "body_fluids_and_circulation.json": "Body Fluids & Circulation",
    "excretory_products_and_their_elimination.json": "Excretory Products & Their Elimination",
    "locomotion_and_movement.json": "Locomotion & Movement",
    "neural_control_and_coordination.json": "Neural Control & Coordination",
    "chemical_coordination_and_integration.json": "Chemical Coordination & Integration",
    "human_reproduction_and_reproductive_health.json": "Human Reproduction & Reproductive Health",
    "genetics_and_evolution.json": "Genetics & Evolution",
    "human_health_and_disease.json": "Human Health & Disease",
    "animal_husbandry_strategies.json": "Animal Husbandry",
    "microbes_in_human_welfare.json": "Microbes in Human Welfare",
    "biotechnology_and_applications.json": "Biotechnology & Applications",
    "organisms_and_populations.json": "Organisms and Populations",
    "ecosystems.json": "Ecosystems"
}

output = []
output.append("| Core Topic | Legacy Qs | Cleaned PYQs | Total Unique | Needed for 80 |")
output.append("| :--- | :---: | :---: | :---: | :---: |")

for filename, pyq_key in mapping.items():
    legacy_path = os.path.join(legacy_dir, filename)
    if not os.path.exists(legacy_path):
        output.append(f"| {filename} | MISSING | - | - | - |")
        continue
        
    with open(legacy_path, 'r', encoding='utf-8') as f:
        legacy_qs = json.load(f).get('questions', [])
        
    pyq_qs = pyq_topics.get(pyq_key, [])
    
    # Deduplicate based on question text
    seen_texts = set()
    unique_qs = []
    
    for q in legacy_qs:
        txt = q['question'].strip().lower()
        if txt not in seen_texts:
            seen_texts.add(txt)
            unique_qs.append(q)
            
    for q in pyq_qs:
        txt = q['question'].strip().lower()
        if txt not in seen_texts:
            seen_texts.add(txt)
            unique_qs.append(q)
            
    total = len(unique_qs)
    needed = max(0, 80 - total)
    
    output.append(f"| {pyq_key} | {len(legacy_qs)} | {len(pyq_qs)} | {total} | **{needed}** |")

print("\n".join(output))
