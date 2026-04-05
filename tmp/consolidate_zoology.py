import json
import os
import shutil

zoology_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\zoology'
unwanted_dir = os.path.join(zoology_dir, "SYLLABUS", "unwanted_zoology")

if not os.path.exists(unwanted_dir):
    os.makedirs(unwanted_dir)

# Mapping legacy files to core topics
mapping = {
    "animal_kingdom.json": ["animal_kingdom.json", "animal_kingdom_classification.json"],
    "structural_organisation_in_animals.json": ["structural_organisation_in_animals.json", "structural_organization_periplaneta_americana.json"],
    "biomolecules.json": ["biomolecules.json", "biomolecules_zoology_angle.json"],
    "digestion_and_absorption.json": ["digestion_absorption.json", "digestion_and_absorption.json"],
    "breathing_and_exchange_of_gases.json": ["breathing_and_exchange_of_gases.json", "breathing_exchange.json", "breathing_exchange_of_gases.json"],
    "body_fluids_and_circulation.json": ["body_fluids_and_circulation.json", "body_fluids_circulation.json"],
    "excretory_products_and_their_elimination.json": ["excretory_products_and_their_elimination.json", "excretory_products_elimination.json"],
    "locomotion_and_movement.json": ["locomotion_and_movement.json", "locomotion_movement.json"],
    "neural_control_and_coordination.json": ["neural_control_and_coordination.json", "neural_control_coordination.json"],
    "chemical_coordination_and_integration.json": ["chemical_coordination_and_integration.json", "chemical_coordination_integration.json"],
    "human_reproduction_and_reproductive_health.json": ["human_reproduction.json", "human_reproduction_reproductive_health.json", "reproductive_health.json"],
    "genetics_and_evolution.json": ["genetics_evolution.json", "genetics_heredity.json", "evolution.json", "principles_of_inheritance_and_variation.json"],
    "human_health_and_disease.json": ["health_disease.json", "human_health_and_disease.json", "human_health_disease.json"],
    "animal_husbandry_strategies.json": ["animal_husbandry.json"],
    "microbes_in_human_welfare.json": ["microbes_human_welfare.json"],
    "biotechnology_and_applications.json": ["biotechnology_applications.json", "applied_biology.json"],
    "organisms_and_populations.json": ["organisms_and_populations.json", "organisms_populations.json"],
    "ecosystems.json": ["ecosystems.json"]
}

for core_topic, source_files in mapping.items():
    all_qs = []
    seen_qs = set()
    
    for src in source_files:
        src_path = os.path.join(zoology_dir, src)
        if os.path.exists(src_path):
            with open(src_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                for q in data.get('questions', []):
                    # Dedup by question text
                    q_text = q['question'].strip().lower()
                    if q_text not in seen_qs:
                        seen_qs.add(q_text)
                        all_qs.append(q)
            # Move to unwanted/legacy after processing
            shutil.move(src_path, os.path.join(unwanted_dir, src))
            
    # Write consolidated file
    with open(os.path.join(zoology_dir, core_topic), 'w', encoding='utf-8') as f:
        json.dump({"questions": all_qs}, f, indent=2, ensure_ascii=False)
    print(f"Consolidated {core_topic}: {len(all_qs)} unique questions.")
