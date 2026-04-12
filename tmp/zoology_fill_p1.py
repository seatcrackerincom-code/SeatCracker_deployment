import json
import os

zoology_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\zoology'
legacy_dir = os.path.join(zoology_dir, 'SYLLABUS', 'legacy')
pyq_file = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\pyqs\eamcet_zoology_pyq_all_topics.json'

with open(pyq_file, 'r', encoding='utf-8') as f:
    pyq_topics = json.load(f).get('topics', {})

# Mapping for specific topics needing questions
needs_filling = {
    "structural_organisation_in_animals.json": {"pyq_key": "Structural Organisation in Animals", "needed": 6, "new_qs": [
        {"question": "In Periplaneta americana, the sclerites of the exoskeleton are joined to each other by a thin, flexible membrane called:", "difficulty": "Hard", "options": {"A": "Arthrodial membrane", "B": "Basement membrane", "C": "Connective tissue", "D": "Cuticle"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Tergites' in a cockroach represent which part of the segment's sclerites?", "difficulty": "Medium", "options": {"A": "Dorsal", "B": "Ventral", "C": "Lateral", "D": "Anterior"}, "answer": "A", "tag": "conceptual"},
        {"question": "The visual units of the compound eyes in cockroaches are known as:", "difficulty": "Medium", "options": {"A": "Ommatidia", "B": "Ocelli", "C": "Rhabdoms", "D": "Corneal lenses"}, "answer": "A", "tag": "conceptual"},
        {"question": "How many pairs of spiracles are present in the respiratory system of a cockroach?", "difficulty": "Hard", "options": {"A": "10 pairs (2 thoracic, 8 abdominal)", "B": "8 pairs", "C": "12 pairs", "D": "6 pairs"}, "answer": "A", "tag": "conceptual"},
        {"question": "The development of Periplaneta americana is 'Paurometabolous', meaning it involves:", "difficulty": "Hard", "options": {"A": "Nymphal stages", "B": "Larval stages", "C": "Direct development", "D": "Complete metamorphosis"}, "answer": "A", "tag": "conceptual"},
        {"question": "In the male cockroach, mushroom-shaped glands are present in which abdominal segments?", "difficulty": "Hard", "options": {"A": "6th and 7th", "B": "4th and 5th", "C": "8th and 9th", "D": "2nd and 3rd"}, "answer": "A", "tag": "conceptual"}
    ]},
    "excretory_products_and_their_elimination.json": {"pyq_key": "Excretory Products & Their Elimination", "needed": 10, "new_qs": [
        {"question": "The 'Micturition Reflex' is initiated by the stretching of the urinary bladder Wall. Which nervous system pathway is primarily involved?", "difficulty": "Hard", "options": {"A": "Parasympathetic", "B": "Sympathetic", "C": "Somatic only", "D": "Enteric"}, "answer": "A", "tag": "conceptual"},
        {"question": "What is the primary role of the 'Juxtaglomerular Cells' in renal regulation?", "difficulty": "Hard", "options": {"A": "Secreting Renin in response to low BP", "B": "Secreting Erythropoietin", "C": "Monitoring Sodium concentration in DCT", "D": "Filtering blood in Glomerulus"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Osmolarity' of the filtrate in the 'Henle's Loop' is highest at which point?", "difficulty": "Hard", "options": {"A": "Hairpin bend (bottom of loop)", "B": "Descending limb top", "C": "Ascending limb top", "D": "DCT"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which hormone acts as an antagonist to the RAAS system by decreasing blood pressure?", "difficulty": "Hard", "options": {"A": "Atrial Natriuretic Factor (ANF)", "B": "Aldosterone", "C": "Vasopressin", "D": "Angiotensin II"}, "answer": "A", "tag": "conceptual"},
        {"question": "The condition 'Uremia' is characterized by the accumulation of:", "difficulty": "Medium", "options": {"A": "Urea in blood", "B": "Uric acid in joints", "C": "Glucose in urine", "D": "Ketone bodies in blood"}, "answer": "A", "tag": "conceptual"},
        {"question": "What is the primary function of the 'Podocytes' found in the Bowman's capsule?", "difficulty": "Hard", "options": {"A": "Creating filtration slits", "B": "Secreting mucus", "C": "Contracting the glomerulus", "D": "Phagocytosis of bacteria"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Counter Current Mechanism' works because of the close proximity of Henle's loop and:", "difficulty": "Medium", "options": {"A": "Vasa Recta", "B": "Afferent Arteriole", "C": "Proximal Tubule", "D": "Collecting Duct"}, "answer": "A", "tag": "conceptual"},
        {"question": "Antidiuretic Hormone (ADH) primarily acts on the:", "difficulty": "Medium", "options": {"A": "Distal convoluted tubule and Collecting duct", "B": "Loop of Henle", "C": "Proximal convoluted tubule", "D": "Glomerulus"}, "answer": "A", "tag": "conceptual"},
        {"question": "Nitrogenous waste excreted by Birds and Land Snails is:", "difficulty": "Medium", "options": {"A": "Uric Acid", "B": "Urea", "C": "Ammonia", "D": "Creatinine"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following describes 'Amniotelic' animals correctly?", "difficulty": "Medium", "options": {"A": "Excrete ammonia and live in aquatic environments", "B": "Excrete urea to conserve water", "C": "Excrete uric acid as paste", "D": "Live exclusively on land"}, "answer": "A", "tag": "conceptual"}
    ]},
    "chemical_coordination_and_integration.json": {"pyq_key": "Chemical Coordination & Integration", "needed": 14, "new_qs": [
        {"question": "Which hormone is known as the 'Anti-Diuretic Hormone' (ADH) and where is it synthesized?", "difficulty": "Hard", "options": {"A": "Vasopressin, synthesized in Hypothalamus", "B": "Oxytocin, synthesized in Pituitary", "C": "Aldosterone, synthesized in Adrenal", "D": "ACTH, synthesized in Pituitary"}, "answer": "A", "tag": "conceptual"},
        {"question": "What is the primary effect of Parathyroid Hormone (PTH) on Calcium levels in the blood?", "difficulty": "Hard", "options": {"A": "Increases Ca2+ levels by stimulating bone resorption", "B": "Decreases Ca2+ levels by promoting excretion", "C": "Inhibits Vitamin D activation", "D": "Increases Calcium storage in bones"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which layer of the Adrenal Cortex secretes Glucocorticoids (like Cortisol)?", "difficulty": "Hard", "options": {"A": "Zona Fasciculata", "B": "Zona Glomerulosa", "C": "Zona Reticularis", "D": "Adrenal Medulla"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Emergency Hormone' Epinephrine is secreted by the:", "difficulty": "Medium", "options": {"A": "Adrenal Medulla", "B": "Adrenal Cortex", "C": "Pancreas", "D": "Pineal Gland"}, "answer": "A", "tag": "conceptual"},
        {"question": "Diabetes Insipidus is caused by the deficiency of which hormone?", "difficulty": "Hard", "options": {"A": "Vasopressin (ADH)", "B": "Insulin", "C": "Glucagon", "D": "Thyroxine"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Master Gland' of the endocrine system is often considered to be the:", "difficulty": "Medium", "options": {"A": "Pituitary gland", "B": "Hypothalamus", "C": "Thyroid gland", "D": "Adrenal gland"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which cells in the Gastric mucosa secrete Gastrin?", "difficulty": "Hard", "options": {"A": "G cells", "B": "Chief cells", "C": "Parietal cells", "D": "Mucous cells"}, "answer": "A", "tag": "conceptual"},
        {"question": "Melatonin is secreted by which gland to regulate the 24-hour rhythm of the body?", "difficulty": "Medium", "options": {"A": "Pineal Gland", "B": "Thymus", "C": "Thyroid", "D": "Pancreas"}, "answer": "A", "tag": "conceptual"},
        {"question": "Erythropoietin is produced by the Juxtaglomerular cells of the Kidney and stimulates:", "difficulty": "Hard", "options": {"A": "Erythropoiesis (RBC production)", "B": "Leukopoiesis", "C": "Platelet production", "D": "Urine concentration"}, "answer": "A", "tag": "conceptual"},
        {"question": "Hormones like Insulin and Glucagon are examples of which chemical class?", "difficulty": "Medium", "options": {"A": "Peptide/Protein hormones", "B": "Steroid hormones", "C": "Iodothyronines", "D": "Amino acid derivatives"}, "answer": "A", "tag": "conceptual"},
        {"question": "Graves' disease is a form of hyperthyroidism characterized by:", "difficulty": "Hard", "options": {"A": "Exophthalmic goitre", "B": "Cretinism", "C": "Myxoedema", "D": "Dwarfism"}, "answer": "A", "tag": "conceptual"},
        {"question": "The corpus luteum secretes primarily which hormone?", "difficulty": "Medium", "options": {"A": "Progesterone", "B": "Estrogen", "C": "LH", "D": "FSH"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following is NOT a second messenger in hormone action?", "difficulty": "Hard", "options": {"A": "Sodium ions", "B": "cAMP", "C": "IP3", "D": "Calcium ions"}, "answer": "A", "tag": "conceptual"},
        {"question": "Glucagon acts primarily on which organ to induce glycogenolysis?", "difficulty": "Medium", "options": {"A": "Liver", "B": "Muscles", "C": "Brain", "D": "Kidneys"}, "answer": "A", "tag": "conceptual"}
    ]}
}

for filename, info in needs_filling.items():
    legacy_path = os.path.join(legacy_dir, filename)
    with open(legacy_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    unique_qs = data.get('questions', [])
    seen_texts = set(q['question'].strip().lower() for q in unique_qs)
    
    # Merge PYQs
    pyqs = pyq_topics.get(info['pyq_key'], [])
    for q in pyqs:
        txt = q['question'].strip().lower()
        if txt not in seen_texts:
            seen_texts.add(txt)
            q['pyq'] = True
            q['tag'] = 'pyq'
            unique_qs.append(q)
            
    # Add newly generated conceptual questions
    for q in info['new_qs']:
        txt = q['question'].strip().lower()
        if txt not in seen_texts:
            seen_texts.add(txt)
            q['pyq'] = False
            unique_qs.append(q)
            
    # Re-index and save
    for idx, q in enumerate(unique_qs):
        q['id'] = idx + 1
        
    data['questions'] = unique_qs
    with open(legacy_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Updated {filename}: Total Questions = {len(unique_qs)}")
