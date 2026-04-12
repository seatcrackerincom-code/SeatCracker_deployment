import json
import os

def add_questions(file_path, new_questions):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    existing_qs = data.get('questions', [])
    start_id = len(existing_qs) + 1
    
    for i, q in enumerate(new_questions):
        q['id'] = start_id + i
        q['pyq'] = False
        if 'hasDiagram' not in q: q['hasDiagram'] = False
        if 'diagram_description' not in q: q['diagram_description'] = ""
        existing_qs.append(q)
    
    data['questions'] = existing_qs
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)
    print(f"Updated {os.path.basename(file_path)} to {len(existing_qs)} questions.")

# Carbonyl Compounds - 21 Hard Questions
carbonyl_qs = [
    {"question": "What is the IUPAC name of the product formed when propanone reacts with CH3MgBr followed by hydrolysis?", "difficulty": "hard", "options": {"A": "2-Methylpropan-2-ol", "B": "2-Methylpropan-1-ol", "C": "Butan-2-ol", "D": "Butan-1-ol"}, "answer": "A"},
    {"question": "Which of the following does NOT give a silver mirror with Tollen's reagent?", "difficulty": "hard", "options": {"A": "Formaldehyde", "B": "Acetaldehyde", "C": "Acetone", "D": "Benzaldehyde"}, "answer": "C"},
    {"question": "The reagent used for the conversion of an acid chloride to an aldehyde (Rosenmund reduction) is:", "difficulty": "hard", "options": {"A": "LiAlH4", "B": "H2/Pd-BaSO4", "C": "NaBH4", "D": "SnCl2/HCl"}, "answer": "B"},
    {"question": "Clemmensen reduction of ketones involves the use of:", "difficulty": "hard", "options": {"A": "NH2NH2/KOH", "B": "Zn-Hg/conc. HCl", "C": "LiAlH4", "D": "Red P/HI"}, "answer": "B"},
    {"question": "Aldol condensation is given by aldehydes/ketones containing:", "difficulty": "hard", "options": {"A": "At least one alpha-hydrogen", "B": "No alpha-hydrogen", "C": "Only one carbon atom", "D": "An ester group"}, "answer": "A"},
    {"question": "Which of the following compounds will undergo Cannizzaro reaction?", "difficulty": "hard", "options": {"A": "Acetaldehyde", "B": "Propanaldehyde", "C": "Benzaldehyde", "D": "Acetone"}, "answer": "C"},
    {"question": "The hybridisation of Carbon in the carbonyl group is:", "difficulty": "hard", "options": {"A": "sp", "B": "sp2", "C": "sp3", "D": "dsp2"}, "answer": "B"},
    {"question": "Treatment of Benzaldehyde with conc. NaOH gives:", "difficulty": "hard", "options": {"A": "Benzyl alcohol and Sodium benzoate", "B": "Benzene and Methanol", "C": "Benzoic acid only", "D": "Benzyl alcohol only"}, "answer": "A"},
    {"question": "Wolff-Kishner reduction of propanone produces:", "difficulty": "hard", "options": {"A": "Propane", "B": "Propanol", "C": "Propene", "D": "Ethane"}, "answer": "A"},
    {"question": "Reaction of Carbonyl compound with HCN followed by hydrolysis gives:", "difficulty": "hard", "options": {"A": "Alpha-hydroxy acid", "B": "Alpha-amino acid", "C": "Alpha-keto acid", "D": "Di-carboxylic acid"}, "answer": "A"},
    {"question": "Which of the following is most reactive towards nucleophilic addition?", "difficulty": "hard", "options": {"A": "HCHO", "B": "CH3CHO", "C": "CH3COCH3", "D": "(CH3)3C-CHO"}, "answer": "A"},
    {"question": "The formation of Cyanohydrin from a ketone is an example of:", "difficulty": "hard", "options": {"A": "Electrophilic addition", "B": "Nucleophilic addition", "C": "Free radical addition", "D": "Substitution"}, "answer": "B"},
    {"question": "Acetophenone on reaction with I2 and NaOH gives a yellow precipitate of:", "difficulty": "hard", "options": {"A": "CH3I", "B": "CHI3", "C": "I2", "D": "C6H5I"}, "answer": "B"},
    {"question": "Fehling's solution B is:", "difficulty": "hard", "options": {"A": "Aqueous CuSO4", "B": "Alkaline Sodium Potassium Tartrate (Rochelle salt)", "C": "Na2CO3", "D": "Ammonia solution"}, "answer": "B"},
    {"question": "Cyclohexanone reacts with NH2OH to form:", "difficulty": "hard", "options": {"A": "Oxime", "B": "Hydrazone", "C": "Semicarbazone", "D": "Schiff base"}, "answer": "A"},
    {"question": "The product of the reaction between HCHO and NH3 is:", "difficulty": "hard", "options": {"A": "Formamide", "B": "Urotropine (Hexamethylenetetramine)", "C": "Methylamine", "D": "Urea"}, "answer": "B"},
    {"question": "Ketones are prepared by the reaction of Grignard reagent with:", "difficulty": "hard", "options": {"A": "Nitriles", "B": "Aldehydes", "C": "Alcohols", "D": "Ethers"}, "answer": "A"},
    {"question": "Reaction of R-COCl with H2 in presence of Pd/BaSO4 gives:", "difficulty": "hard", "options": {"A": "R-CH2OH", "B": "R-CHO", "C": "R-COOH", "D": "R-CH3"}, "answer": "B"},
    {"question": "Etard reaction is used to prepare Benzaldehyde from Toluene using:", "difficulty": "hard", "options": {"A": "CrO2Cl2 (Chromyl chloride)", "B": "KMnO4", "C": "K2Cr2O7", "D": "V2O5"}, "answer": "A"},
    {"question": "Identify the compound that does NOT respond to Iodoform test:", "difficulty": "hard", "options": {"A": "Acetone", "B": "Ethanol", "C": "Pentane-3-one", "D": "Acetophenone"}, "answer": "C"},
    {"question": "Gattermann-Koch reaction is used to prepare:", "difficulty": "hard", "options": {"A": "Chlorobenzene", "B": "Benzaldehyde", "C": "Phenol", "D": "Toluene"}, "answer": "B"}
]

add_questions(r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\chemistry\carbonyl_compounds.json', carbonyl_qs)
