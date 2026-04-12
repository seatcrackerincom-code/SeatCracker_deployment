import json
import os

pyq_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\pyqs\eamcet_botany_pyqs.json'
botany_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\botany'

mapping = {
    "Diversity in Living World": "diversity_in_living_world.json",
    "Plant Kingdom": "plant_kingdom.json",
    "Cell Structure & Functions": "cell_the_unit_of_life.json",
    "Cell Division": "cell_cycle_and_cell_division.json",
    "Biomolecules": "biomolecules.json",
    "Photosynthesis": "photosynthesis_in_higher_plants.json",
    "Respiration in Plants": "respiration_in_plants.json",
    "Sexual Reproduction in Flowering Plants": "sexual_reproduction_in_flowering_plants.json",
    "Principles of Inheritance & Variation": "principles_of_inheritance_and_variation.json",
    "Molecular Basis of Inheritance": "molecular_basis_of_inheritance.json",
    "Biotechnology": "biotechnology.json",
    "Morphology of Flowering Plants": "morphology_of_flowering_plants.json",
    "Plant Growth & Development": "plant_growth_and_development.json",
    "Transport in Plants": "transport_in_plants.json",
    "Evolution": "evolution.json",
    "Food Production Strategies": "strategies_for_enhancement_in_food_production.json",
    "Microbes in Human Welfare": "microbes_in_human_welfare.json",
    "Organisms & Populations": "organisms_and_populations.json",
    "Ecosystem": "ecosystem.json",
    "Biodiversity & Conservation": "biodiversity_and_conservation.json",
    "Environmental Issues": "environmental_issues.json"
}

with open(pyq_file, 'r', encoding='utf-8') as f:
    pyq_data = json.load(f)

for topic_key, target_file in mapping.items():
    topic_path = os.path.join(botany_dir, target_file)
    
    if not os.path.exists(topic_path):
        print(f"Warning: Target file {target_file} NOT found. Creating placeholders.")
        existing_data = {"questions": []}
    else:
        with open(topic_path, 'r', encoding='utf-8') as f:
            existing_data = json.load(f)
            if not isinstance(existing_data, dict): existing_data = {"questions": []}
            if "questions" not in existing_data: existing_data["questions"] = []

    new_pyqs = pyq_data.get(topic_key, [])
    
    # Process new PYQs
    processed_pyqs = []
    for q in new_pyqs:
        q['pyq'] = True
        q['tag'] = 'pyq'
        if 'difficulty' not in q: q['difficulty'] = 'hard'
        processed_pyqs.append(q)

    # Merge
    existing_q_texts = {q.get('question', '').strip().lower() for q in existing_data['questions']}
    added_count = 0
    for q in processed_pyqs:
        if q.get('question', '').strip().lower() not in existing_q_texts:
            existing_data['questions'].append(q)
            added_count += 1
    
    # Re-index
    for idx, q in enumerate(existing_data['questions']):
        q['id'] = idx + 1
        
    # Save back
    with open(topic_path, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, indent=2, ensure_ascii=False)
        
    print(f"Topic: {topic_key:<40} | Added: {added_count:>3} | Result Total: {len(existing_data['questions'])}")
