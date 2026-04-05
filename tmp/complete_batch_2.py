import json
import os

def add_questions(file_path, new_questions):
    p = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\chemistry\\' + file_path
    if not os.path.exists(p):
        print(f"File not found: {p}")
        return
    with open(p, 'r', encoding='utf-8') as f:
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
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)
    print(f"Updated {file_path} to {len(existing_qs)} questions.")

# Batch 2 Data
carboxylic_acids_qs = [
    {"question": "The acidity of carboxylic acids increases with the presence of:", "difficulty": "hard", "options": {"A": "Electron donating groups", "B": "Electron withdrawing groups", "C": "Alkyl groups", "D": "None"}, "answer": "B"},
    {"question": "Reaction of a carboxylic acid with NH3 followed by heating gives:", "difficulty": "hard", "options": {"A": "Amide", "B": "Amine", "C": "Alcohol", "D": "Aldehyde"}, "answer": "A"},
    {"question": "HVZ (Hell-Volhard-Zelinsky) reaction is used for alpha-halogenation of:", "difficulty": "hard", "options": {"A": "Aliphatic acids with alpha-H", "B": "Aromatic acids", "C": "Aldehydes", "D": "Alcohols"}, "answer": "A"},
    {"question": "Reduction of carboxylic acids with LiAlH4 produces:", "difficulty": "hard", "options": {"A": "Primary alcohols", "B": "Secondary alcohols", "C": "Tertiary alcohols", "D": "Alkanes"}, "answer": "A"},
    {"question": "Which of the following does NOT give HVZ reaction?", "difficulty": "hard", "options": {"A": "CH3COOH", "B": "CH3CH2COOH", "C": "(CH3)3CCOOH", "D": "HCOOH"}, "answer": "D"},
    {"question": "Decarboxylation of Sodium Acetate with Sodalime gives:", "difficulty": "hard", "options": {"A": "Methane", "B": "Ethane", "C": "Ethylene", "D": "Acetone"}, "answer": "A"},
    {"question": "Which of the following is most acidic?", "difficulty": "hard", "options": {"A": "CH2ClCOOH", "B": "CHCl2COOH", "C": "CCl3COOH", "D": "CH3COOH"}, "answer": "C"},
    {"question": "Formic acid reduces Tollen's reagent because it contains:", "difficulty": "hard", "options": {"A": "CO group", "B": "CHO group in its structure (-H-C=O)", "C": "OH group", "D": "Ionic nature"}, "answer": "B"},
    {"question": "Esterification reaction is catalyzed by:", "difficulty": "hard", "options": {"A": "Dilute base", "B": "Concentrated Acid", "C": "Neutral salt", "D": "No catalyst"}, "answer": "B"},
    {"question": "The reaction R-COOH + N3H \u2192 R-NH2 + CO2 + N2 is:", "difficulty": "hard", "options": {"A": "Schmidt reaction", "B": "Hofmann reaction", "C": "Curtius reaction", "D": "Lossen reaction"}, "answer": "A"},
    {"question": "Action of PCl5 on Acetic acid gives:", "difficulty": "hard", "options": {"A": "Acetyl chloride", "B": "Ethyl chloride", "C": "Methyl chloride", "D": "No reaction"}, "answer": "A"},
    {"question": "Heating Ammonium acetate produces:", "difficulty": "hard", "options": {"A": "Acetamide", "B": "Methylamine", "C": "Methane", "D": "Acetonitrile"}, "answer": "A"},
    {"question": "The boiling points of carboxylic acids are higher than alcohols of comparable mass because of:", "difficulty": "hard", "options": {"A": "Greater polarity", "B": "Formation of dimeric structures through H-bonding", "C": "Presence of double bond", "D": "Higher O content"}, "answer": "B"},
    {"question": "Succinic acid on heating gives:", "difficulty": "hard", "options": {"A": "Acrylic acid", "B": "Succinic anhydride", "C": "Maleic acid", "D": "Fumaric acid"}, "answer": "B"},
    {"question": "Saponification of ethyl acetate with KOH gives:", "difficulty": "hard", "options": {"A": "Potassium acetate and Ethanol", "B": "Sodium acetate and Methanol", "C": "Acetic acid and Ethanol", "D": "No reaction"}, "answer": "A"},
    {"question": "Vapor phase oxidation of Cumene is used to prepare:", "difficulty": "hard", "options": {"A": "Phenol and Acetone", "B": "Benzoic acid", "C": "Salicylic acid", "D": "Acetic acid"}, "answer": "A"},
    {"question": "Electrolysis of aqueous solution of Sodium Succinate gives:", "difficulty": "hard", "options": {"A": "Ethylene", "B": "Ethane", "C": "Acetylene", "D": "Methane"}, "answer": "A"},
    {"question": "Addition of Ammonia to an Acyl chloride results in:", "difficulty": "hard", "options": {"A": "Amide", "B": "Nitrate", "C": "Aldehyde", "D": "Hydrocarbon"}, "answer": "A"},
    {"question": "Lactic acid is an example of:", "difficulty": "hard", "options": {"A": "Hydroxy acid", "B": "Keto acid", "C": "Dicarboxylic acid", "D": "Amino acid"}, "answer": "A"},
    {"question": "Preparation of Benzoic acid from Benzonitrile involves:", "difficulty": "hard", "options": {"A": "Reduction", "B": "Hydrolysis", "C": "Oxidation", "D": "Isomerization"}, "answer": "B"},
    {"question": "Phthalic acid on reaction with NH3 followed by strong heating gives:", "difficulty": "hard", "options": {"A": "Benzamide", "B": "Phthalimide", "C": "Benzoic acid", "D": "Aniline"}, "answer": "B"},
    {"question": "Correct order of decreasing acidity: (I) Benzoic acid, (II) p-Nitrobenzoic acid, (III) p-Methoxybenzoic acid.", "difficulty": "hard", "options": {"A": "II > I > III", "B": "I > II > III", "C": "III > I > II", "D": "II > III > I"}, "answer": "A"},
    {"question": "Acetic anhydride is prepared by heating Acetic acid with:", "difficulty": "hard", "options": {"A": "P2O5", "B": "H2SO4", "C": "NaOH", "D": "ZnCl2"}, "answer": "A"},
    {"question": "Reduction of Esters to Alcohols using Sodium and Ethanol is:", "difficulty": "hard", "options": {"A": "Bouveault-Blanc reduction", "B": "Rosenmund reduction", "C": "Stephen's reduction", "D": "Clemmensen reduction"}, "answer": "A"}
]

nitrogen_compounds_qs = [
    {"question": "Basicity of amines in aqueous solution follows the order (for methyl):", "difficulty": "hard", "options": {"A": "2 > 1 > 3 > NH3", "B": "3 > 2 > 1 > NH3", "C": "1 > 2 > 3 > NH3", "D": "All equal"}, "answer": "A"},
    {"question": "Gabriel Phthalimide synthesis is used for preparation of:", "difficulty": "hard", "options": {"A": "Primary aliphatic amines", "B": "Secondary amines", "C": "Tertiary amines", "D": "Aromatic amines"}, "answer": "A"},
    {"question": "Hoffmann Bromamide degradation converts an Amide to an Amine with:", "difficulty": "hard", "options": {"A": "One carbon more", "B": "One carbon less", "C": "Same carbons", "D": "No relation"}, "answer": "B"},
    {"question": "Carbylamine test is given by:", "difficulty": "hard", "options": {"A": "Primary amines only", "B": "Secondary amines", "C": "Tertiary amines", "D": "Amides"}, "answer": "A"},
    {"question": "Hinsberg reagent is:", "difficulty": "hard", "options": {"A": "Benzene sulfonyl chloride", "B": "Benzene sulfochloride", "C": "Benzene chloride", "D": "Chloroform/KOH"}, "answer": "A"},
    {"question": "Reaction of Aniline with NaNO2/HCl at 273-278 K gives:", "difficulty": "hard", "options": {"A": "Benzene diazonium chloride", "B": "Nitrobenzene", "C": "Chlorobenzene", "D": "Phenol"}, "answer": "A"},
    {"question": "Reduction of Nitrobenzene with Sn/HCl gives:", "difficulty": "hard", "options": {"A": "Aniline", "B": "Nitrosobenzene", "C": "Hydrazobenzene", "D": "Azobenzene"}, "answer": "A"},
    {"question": "Ethylamine reacts with HNO2 to give:", "difficulty": "hard", "options": {"A": "Ethanol + N2", "B": "Nitroethane", "C": "Ethyl nitrite", "D": "Ethane"}, "answer": "A"},
    {"question": "Coupling reaction of Benzene diazonium chloride with Phenol in alkaline medium gives:", "difficulty": "hard", "options": {"A": "p-Hydroxyazobenzene (Orange dye)", "B": "Aniline", "C": "Benzene", "D": "Chlorobenzene"}, "answer": "A"},
    {"question": "Which of the following is most basic?", "difficulty": "hard", "options": {"A": "Aniline", "B": "p-Nitroaniline", "C": "p-Methylaniline", "D": "p-Chloroaniline"}, "answer": "C"},
    {"question": "Identifying 1, 2, and 3 amines using Benzene sulfonyl chloride, 3 amine:", "difficulty": "hard", "options": {"A": "Does not react", "B": "Reacts to form soluble salt", "C": "Reacts to form precipitate", "D": "Reacts with gas evolution"}, "answer": "A"},
    {"question": "Aniline reacts with excess Bromine water to give:", "difficulty": "hard", "options": {"A": "2,4,6-Tribromoaniline", "B": "p-Bromoaniline", "C": "o-Bromoaniline", "D": "No reaction"}, "answer": "A"},
    {"question": "Mendeus reaction involves reduction of Cyanides with:", "difficulty": "hard", "options": {"A": "Na/Ethanol", "B": "LiAlH4", "C": "H2/Ni", "D": "Sn/HCl"}, "answer": "A"},
    {"question": "Schotten-Baumann reaction involves acylation of Aniline with:", "difficulty": "hard", "options": {"A": "Benzoyl chloride in presence of NaOH", "B": "Acetyl chloride", "C": "Acetic anhydride", "D": "Benzoic acid"}, "answer": "A"},
    {"question": "Which of the following will NOT undergo Diazotization?", "difficulty": "hard", "options": {"A": "Aniline", "B": "Benzylamine", "C": "p-Toluidine", "D": "o-Nitroaniline"}, "answer": "B"},
    {"question": "Liberal test for secondary amines involves reaction with:", "difficulty": "hard", "options": {"A": "Nitrous acid (HNO2)", "B": "HCl", "C": "NaOH", "D": "Br2/KOH"}, "answer": "A"},
    {"question": "The structure of Quaternary ammonium salts is:", "difficulty": "hard", "options": {"A": "R4N+ X-", "B": "R3N X", "C": "R2NH2 X", "D": "RN X"}, "answer": "A"},
    {"question": "Aniline treats with conc. H2SO4 at 453-473 K to give:", "difficulty": "hard", "options": {"A": "Sulfanilic acid", "B": "Aniline sulfate", "C": "Nitrobenzene", "D": "Benzene sulfonic acid"}, "answer": "A"},
    {"question": "Reduction of Methyl Isocyanide with Na/Hg and Ethanol gives:", "difficulty": "hard", "options": {"A": "Dimethylamine", "B": "Ethylamine", "C": "Methylamine", "D": "Trimethylamine"}, "answer": "A"},
    {"question": "The IUPAC name of Isocyanides is:", "difficulty": "hard", "options": {"A": "Carbylamines", "B": "Nitriles", "C": "Isocyanonitrates", "D": "Amines"}, "answer": "A"},
    {"question": "Sandmeyer reaction cannot be used for preparation of:", "difficulty": "hard", "options": {"A": "Fluorobenznene", "B": "Chlorobenzene", "C": "Bromobenzene", "D": "Benzonitrile"}, "answer": "A"},
    {"question": "Which of the following has a fishy odor?", "difficulty": "hard", "options": {"A": "Aniline", "B": "Amethylamine", "C": "Nitrobenzene", "D": "Pyridine"}, "answer": "B"},
    {"question": "Gomberg-Bachmann reaction converts diazonium salt to:", "difficulty": "hard", "options": {"A": "Biphenyl", "B": "Benzene", "C": "Phenol", "D": "Chlorobenzene"}, "answer": "A"}
]

polymers_qs = [
    {"question": "Terylene (Dacron) is a condensation polymer of:", "difficulty": "hard", "options": {"A": "Ethylene glycol and Terephthalic acid", "B": "Ethylene glycol and Phthalic acid", "C": "Adipic acid and Hexamethylenediamine", "D": "Phenol and Formaldehyde"}, "answer": "A"},
    {"question": "Nylon-6 is prepared from:", "difficulty": "hard", "options": {"A": "Caprolactam", "B": "Adipic acid", "C": "Glycine", "D": "Ethylene glycol"}, "answer": "A"},
    {"question": "Nylon-6,6 is a:", "difficulty": "hard", "options": {"A": "Polyamide", "B": "Polyester", "C": "Polyether", "D": "Polyalkene"}, "answer": "A"},
    {"question": "Natural rubber is a linear polymer of:", "difficulty": "hard", "options": {"A": "Isoprene (2-methyl-1,3-butadiene)", "B": "Chloroprene", "C": "Butadiene", "D": "Styrene"}, "answer": "A"},
    {"question": "Vulcanization of rubber involves heating it with:", "difficulty": "hard", "options": {"A": "Sulfur", "B": "Carbon", "C": "Chlorine", "D": "Phosphorus"}, "answer": "A"},
    {"question": "Bakelite is formed by cross-linking of:", "difficulty": "hard", "options": {"A": "Novolac", "B": "PVC", "C": "Teflon", "D": "Polystyrene"}, "answer": "A"},
    {"question": "PHBV is a biodegradable polymer of:", "difficulty": "hard", "options": {"A": "3-hydroxybutanoic acid and 3-hydroxypentanoic acid", "B": "Glycine and Aminocaproic acid", "C": "Lactic acid", "D": "Vinyl chloride"}, "answer": "A"},
    {"question": "Neoprene is a polymer of:", "difficulty": "hard", "options": {"A": "Chloroprene (2-chloro-1,3-butadiene)", "B": "Caprolactam", "C": "TFE", "D": "Vinyl cyanide"}, "answer": "A"},
    {"question": "Teflon (PTFE) is used for:", "difficulty": "hard", "options": {"A": "Non-stick coating", "B": "Synthetic wool", "C": "Ductile pipes", "D": "Transparent plastics"}, "answer": "A"},
    {"question": "Buna-N is a copolymer of:", "difficulty": "hard", "options": {"A": "1,3-butadiene and Acrylonitrile", "B": "1,3-butadiene and Styrene", "C": "Chloroprene", "D": "Ethylene glycol"}, "answer": "A"},
    {"question": "Buna-S (SBR) is used for:", "difficulty": "hard", "options": {"A": "Tires", "B": "Hoses", "C": "Fiber", "D": "Coating"}, "answer": "A"},
    {"question": "The monomer of PVC is:", "difficulty": "hard", "options": {"A": "Vinyl chloride", "B": "Ethylene", "C": "TFE", "D": "Propene"}, "answer": "A"},
    {"question": "Which of the following is a step-growth polymer?", "difficulty": "hard", "options": {"A": "Nylon", "B": "Polyethylene", "C": "Polypropylene", "D": "PVC"}, "answer": "A"},
    {"question": "Zeigler-Natta catalyst (TiCl4 + Al(C2H5)3) is used for:", "difficulty": "hard", "options": {"A": "High density polyethylene (HDPE)", "B": "Low density polyethylene (LDPE)", "C": "PVC", "D": "Polystyrene"}, "answer": "A"},
    {"question": "Melamine-formaldehyde resin is used for:", "difficulty": "hard", "options": {"A": "Unbreakable crockery", "B": "Electrical switches", "C": "Comb manufacture", "D": "Paints"}, "answer": "A"},
    {"question": "Orlon (Acrilan) is a polymer of:", "difficulty": "hard", "options": {"A": "Acrylonitrile", "B": "Vinyl acetate", "C": "Styrene", "D": "Butadiene"}, "answer": "A"},
    {"question": "Which of the following is a thermosetting polymer?", "difficulty": "hard", "options": {"A": "Bakelite", "B": "PVC", "C": "Nylon", "D": "Polystyrene"}, "answer": "A"},
    {"question": "Biodegradable Nylon-2-Nylon-6 is a copolymer of:", "difficulty": "hard", "options": {"A": "Glycine and Amino caproic acid", "B": "Alanine and Adipic acid", "C": "Serine and Glycolic acid", "D": "Lactic acid"}, "answer": "A"},
    {"question": "The intermolecular forces in fibers (like Nylon) are:", "difficulty": "hard", "options": {"A": "Hydrogen bonding", "B": "Van der Waals", "C": "Dipole-dipole", "D": "Ionic"}, "answer": "A"},
    {"question": "Polytetrafluoroethylene (PTFE) monomers contain:", "difficulty": "hard", "options": {"A": "F only", "B": "Cl and F", "C": "H and F", "D": "Br"}, "answer": "A"},
    {"question": "Percentage of sulfur in ebonite (hard rubber) is about:", "difficulty": "hard", "options": {"A": "20-30%", "B": "5%", "C": "50%", "D": "1%"}, "answer": "A"},
    {"question": "Rayon is a:", "difficulty": "hard", "options": {"A": "Semi-synthetic polymer", "B": "Synthetic polymer", "C": "Natural polymer", "D": "Protein"}, "answer": "A"},
    {"question": "Which of the following is a condensation polymer?", "difficulty": "hard", "options": {"A": "Terylene", "B": "Polypropylene", "C": "Teflon", "D": "Polystyrene"}, "answer": "A"},
    {"question": "Glyptal is a polymer of Ethylene glycol and:", "difficulty": "hard", "options": {"A": "Phthalic acid", "B": "Terephthalic acid", "C": "Adipic acid", "D": "Nylon"}, "answer": "A"},
    {"question": "The monomer of PAN is:", "difficulty": "hard", "options": {"A": "CH2=CHCN", "B": "CH2=CH-Cl", "C": "CH2=CH-CH3", "D": "CF2=CF2"}, "answer": "A"}
]

everyday_chemistry_qs = [
    {"question": "Aspirin is chemically:", "difficulty": "hard", "options": {"A": "Acetyl salicylic acid", "B": "Methyl salicylate", "C": "Sodium salicylate", "D": "Benzoic acid"}, "answer": "A"},
    {"question": "Paracetamol is used as:", "difficulty": "hard", "options": {"A": "Antipyretic and Analgesic", "B": "Antibiotic", "C": "Tranquilizer", "D": "Antiseptic"}, "answer": "A"},
    {"question": "Which of the following is a narrow spectrum antibiotic?", "difficulty": "hard", "options": {"A": "Penicillin G", "B": "Ampicillin", "C": "Amoxycillin", "D": "Chloramphenicol"}, "answer": "A"},
    {"question": "Chloramphenicol is effective against:", "difficulty": "hard", "options": {"A": "Typhoid", "B": "Malaria", "C": "Cancer", "D": "Tuberculosis"}, "answer": "A"},
    {"question": "Antiseptics like Dettol contain:", "difficulty": "hard", "options": {"A": "Chloroxylenol and Terpineol", "B": "Bithionol", "C": "Iodine", "D": "Phenol"}, "answer": "A"},
    {"question": "A 0.2% solution of phenol acts as:", "difficulty": "hard", "options": {"A": "Antiseptic", "B": "Disinfectant", "C": "Analgesic", "D": "Antibiotic"}, "answer": "A"},
    {"question": "Tranquilizers like Equanil are used to treat:", "difficulty": "hard", "options": {"A": "Mental tension/Depression", "B": "Bacterial infection", "C": "Fever", "D": "Acidity"}, "answer": "A"},
    {"question": "Artificial sweetener 'Aspartame' is unstable at:", "difficulty": "hard", "options": {"A": "Cooking temperature", "B": "Room temperature", "C": "Freezing temperature", "D": "Body temperature"}, "answer": "A"},
    {"question": "Which artificial sweetener is most stable at cooking temperature?", "difficulty": "hard", "options": {"A": "Sucralose", "B": "Aspartame", "C": "Alitame", "D": "Saccharin"}, "answer": "A"},
    {"question": "Sodium benzoate is used as:", "difficulty": "hard", "options": {"A": "Food preservative", "B": "Sweetener", "C": "Antibiotic", "D": "Detergent"}, "answer": "A"},
    {"question": "Synthetic detergents are divided into how many types?", "difficulty": "hard", "options": {"A": "Anionic, Cationic, Non-ionic", "B": "Acidic, Basic", "C": "Two types", "D": "Single type"}, "answer": "A"},
    {"question": "Cationic detergents (e.g. Cetyltrimethylammonium bromide) are used in:", "difficulty": "hard", "options": {"A": "Hair conditioners", "B": "Laundry", "C": "Dishwashers", "D": "Glass cleaners"}, "answer": "A"},
    {"question": "Anionic detergents are typically:", "difficulty": "hard", "options": {"A": "Sodium salts of sulfonated long chain alcohols/hydrocarbons", "B": "Chlorides", "C": "Quaternary ammonium salts", "D": "Esters"}, "answer": "A"},
    {"question": "Which gas is used for preservation of fruit juices?", "difficulty": "hard", "options": {"A": "SO2", "B": "H2", "C": "O2", "D": "Cl2"}, "answer": "A"},
    {"question": "Birth control pills contain a mixture of:", "difficulty": "hard", "options": {"A": "Estrogen and Progesterone derivatives", "B": "Aspirin", "C": "Penicillin", "D": "Insulin"}, "answer": "A"},
    {"question": "Norethindrone is an example of:", "difficulty": "hard", "options": {"A": "Synthetic progesterone", "B": "Antibiotic", "C": "Antihistamine", "D": "Analgesic"}, "answer": "A"},
    {"question": "Cimetidine and Ranitidine are used as:", "difficulty": "hard", "options": {"A": "Antacids", "B": "Antiseptics", "C": "Antibiotics", "D": "Analgesics"}, "answer": "A"},
    {"question": "Bithionol is added to soap to impart:", "difficulty": "hard", "options": {"A": "Antiseptic properties", "B": "Fragrance", "C": "Color", "D": "Lather"}, "answer": "A"},
    {"question": "Tincture of iodine is:", "difficulty": "hard", "options": {"A": "2-3% solution of iodine in alcohol-water", "B": "Iodine in Benzene", "C": "Iodoform solution", "D": "KI solution"}, "answer": "A"},
    {"question": "Which of the following is a narcotic analgesic?", "difficulty": "hard", "options": {"A": "Morphine", "B": "Aspirin", "C": "Paracetamol", "D": "Brufen"}, "answer": "A"},
    {"question": "Salvarsan was the first effective treatment discovered for:", "difficulty": "hard", "options": {"A": "Syphilis", "B": "Typhoid", "C": "Malaria", "D": "Cholera"}, "answer": "A"},
    {"question": "Saccharin is how many times sweeter than cane sugar?", "difficulty": "hard", "options": {"A": "550", "B": "100", "C": "1000", "D": "2000"}, "answer": "A"},
    {"question": "The hydrophilic part of a soap molecule is:", "difficulty": "hard", "options": {"A": "Carboxylate group (-COO- Na+)", "B": "Alkyl chain", "C": "Benzene ring", "D": "Cl atom"}, "answer": "A"},
    {"question": "Biodegradable detergents have:", "difficulty": "hard", "options": {"A": "Unbranched hydrocarbon chains", "B": "Highly branched chains", "C": "Aromatic rings", "D": "Sulfate groups"}, "answer": "A"}
]

environmental_chemistry_qs = [
    {"question": "Which of the following is a greenhouse gas?", "difficulty": "hard", "options": {"A": "CH4", "B": "CO2", "C": "N2O", "D": "All of the above"}, "answer": "D"},
    {"question": "Global warming is primarily caused by:", "difficulty": "hard", "options": {"A": "Infrared radiation trapped by CO2", "B": "UV radiation", "C": "Ozone layer thinning", "D": "Acid rain"}, "answer": "A"},
    {"question": "Eutrophication of water bodies is caused by:", "difficulty": "hard", "options": {"A": "Excessive nutrients (Phosphates/Nitrates)", "B": "Heavy metals", "C": "Oil spills", "D": "Thermal pollution"}, "answer": "A"},
    {"question": "The thickness of ozone layer is measured in:", "difficulty": "hard", "options": {"A": "Dobson units", "B": "Pascal", "C": "Coulomb", "D": "Angstrom"}, "answer": "A"},
    {"question": "Minamata disease is caused by poisoning of:", "difficulty": "hard", "options": {"A": "Mercury", "B": "Lead", "C": "Cadmium", "D": "Arsenic"}, "answer": "A"},
    {"question": "Itai-itai disease is caused by:", "difficulty": "hard", "options": {"A": "Cadmium", "B": "Lead", "C": "Mercury", "D": "Iron"}, "answer": "A"},
    {"question": "BOD (Biochemical Oxygen Demand) measures:", "difficulty": "hard", "options": {"A": "Organic matter in water", "B": "Oxygen dissolved in water", "C": "Inorganic salts", "D": "Acidity"}, "answer": "A"},
    {"question": "A water sample with BOD value of 5 ppm is considered:", "difficulty": "hard", "options": {"A": "Clean water", "B": "Polluted water", "C": "Very polluted", "D": "Toxic"}, "answer": "A"},
    {"question": "Photochemical smog is formed in:", "difficulty": "hard", "options": {"A": "Warm and sunny climate with NOx and Hydrocarbons", "B": "Cool and humid climate", "C": "Industrial areas with SOx", "D": "Rural areas"}, "answer": "A"},
    {"question": "Main component of Classical Smog is:", "difficulty": "hard", "options": {"A": "SO2 + Smoke", "B": "NO2 + Ozone", "C": "PAN", "D": "Aldehydes"}, "answer": "A"},
    {"question": "Blue baby syndrome (Methemoglobinemia) is caused by:", "difficulty": "hard", "options": {"A": "Excess Nitrates in drinking water", "B": "Excess Fluorides", "C": "Lead", "D": "Sulfate"}, "answer": "A"},
    {"question": "Maximum permissible limit of Lead in drinking water is:", "difficulty": "hard", "options": {"A": "50 ppb", "B": "10 ppb", "C": "100 ppm", "D": "5 ppm"}, "answer": "A"},
    {"question": "Excess fluoride (> 2 ppm) in water causes:", "difficulty": "hard", "options": {"A": "Mottling of teeth", "B": "Bony deformities", "C": "Anemia", "D": "Blindness"}, "answer": "A"},
    {"question": "DDT is a:", "difficulty": "hard", "options": {"A": "Non-biodegradable pollutant", "B": "Biodegradable pollutant", "C": "Natural hormone", "D": "Fertilizer"}, "answer": "A"},
    {"question": "PAN (Peroxyacetyl nitrate) is a:", "difficulty": "hard", "options": {"A": "Secondary pollutant", "B": "Primary pollutant", "C": "Herbicide", "D": "Inert gas"}, "answer": "A"},
    {"question": "Acid rain has a pH value:", "difficulty": "hard", "options": {"A": "Below 5.6", "B": "Above 7", "C": "8.5", "D": "6.5"}, "answer": "A"},
    {"question": "Statues made of marble are damaged by acid rain due to:", "difficulty": "hard", "options": {"A": "Reaction of CaCO3 with H2SO4 to form soluble CaSO4", "B": "Iron oxidation", "C": "Heat", "D": "Light"}, "answer": "A"},
    {"question": "Ozone hole is mainly observed over:", "difficulty": "hard", "options": {"A": "Antarctica", "B": "Equator", "C": "North Pole", "D": "Asia"}, "answer": "A"},
    {"question": "Chlorofluorocarbons (CFCs) deplete ozone by:", "difficulty": "hard", "options": {"A": "Releasing Chlorine free radicals", "B": "Absorbing UV", "C": "Reacting with water", "D": "Inertness"}, "answer": "A"},
    {"question": "London smog is also known as:", "difficulty": "hard", "options": {"A": "Reducing smog", "B": "Oxidizing smog", "C": "Dry smog", "D": "Brown smog"}, "answer": "A"},
    {"question": "The sink for CO in the environment is:", "difficulty": "hard", "options": {"A": "Soil microorganisms", "B": "Ocean water", "C": "Plants", "D": "Upper atmosphere"}, "answer": "A"},
    {"question": "Green Chemistry aims to:", "difficulty": "hard", "options": {"A": "Reduce hazardous substances in design/manufacture", "B": "Study plants only", "C": "Increase pollution", "D": "Stop all chemical industries"}, "answer": "A"},
    {"question": "Bio-magnification of DDT in birds leads to:", "difficulty": "hard", "options": {"A": "Premature breaking of eggshells", "B": "Faster growth", "C": "Improved vision", "D": "Nesting behavior"}, "answer": "A"},
    {"question": "Which of the following is NOT an air pollutant gas?", "difficulty": "hard", "options": {"A": "N2", "B": "CO", "C": "SO2", "D": "NO2"}, "answer": "A"},
    {"question": "Threshold limit value (TLV) refers to:", "difficulty": "hard", "options": {"A": "Permissible limit of pollutant for an 8-hour shift", "B": "Lethal dose", "C": "Absolute zero", "D": "Boiling point"}, "answer": "A"},
    {"question": "Maximum dissolved oxygen (DO) in cold water is:", "difficulty": "hard", "options": {"A": "10 ppm", "B": "1 ppm", "C": "100 ppm", "D": "50 ppm"}, "answer": "A"},
    {"question": "COD (Chemical Oxygen Demand) is usually ______ than BOD.", "difficulty": "hard", "options": {"A": "Higher", "B": "Lower", "C": "Same", "D": "Zero"}, "answer": "A"},
    {"question": "White lung cancer is caused by:", "difficulty": "hard", "options": {"A": "Asbestos", "B": "Coal dust", "C": "Silica", "D": "Cotton fiber"}, "answer": "A"},
    {"question": "The principal component of natural gas is:", "difficulty": "hard", "options": {"A": "Methane", "B": "Ethane", "C": "Propane", "D": "Butane"}, "answer": "A"},
    {"question": "Albedo effect refers to:", "difficulty": "hard", "options": {"A": "Reflectivity of a surface", "B": "Absorption of heat", "C": "Ozone depletion", "D": "Water pollution"}, "answer": "A"},
    {"question": "Which metal was responsible for the Love Canal tragedy?", "difficulty": "hard", "options": {"A": "Toxic chemical waste (Dioxins/Solvents)", "B": "Gold", "C": "Iron", "D": "Sodium"}, "answer": "A"},
    {"question": "The range of UV radiation is:", "difficulty": "hard", "options": {"A": "100-400 nm", "B": "400-700 nm", "C": "700-1000 nm", "D": "1 cm"}, "answer": "A"},
    {"question": "Which of the following is biodegradable?", "difficulty": "hard", "options": {"A": "Paper", "B": "Polythene", "C": "PVC", "D": "DDT"}, "answer": "A"},
    {"question": "Chernobyl disaster (1986) was related to:", "difficulty": "hard", "options": {"A": "Nuclear radiation leak", "B": "Chemical leak (MIC)", "C": "Oil spill", "D": "Acid rain"}, "answer": "A"},
    {"question": "Bhopal Gas Tragedy (1984) involved:", "difficulty": "hard", "options": {"A": "Methyl Isocyanate (MIC)", "B": "Phosgene", "C": "Chlorine", "D": "Ammonia"}, "answer": "A"},
    {"question": "Excess concentration of Copper in water causes:", "difficulty": "hard", "options": {"A": "Liver damage", "B": "Tooth decay", "C": "Blindness", "D": "Deafness"}, "answer": "A"},
    {"question": "Acid rain is not caused by:", "difficulty": "hard", "options": {"A": "NH3", "B": "SO2", "C": "NO2", "D": "CO2 (natural acidity)"}, "answer": "A"},
    {"question": "Green Chemistry solvent Example:", "difficulty": "hard", "options": {"A": "Supercritical CO2", "B": "Benzene", "C": "Chloroform", "D": "CCl4"}, "answer": "A"},
    {"question": "Black lung disease occurs in:", "difficulty": "hard", "options": {"A": "Coal miners", "B": "Textile workers", "C": "Farmers", "D": "Painters"}, "answer": "A"},
    {"question": "Fly ash is a byproduct of:", "difficulty": "hard", "options": {"A": "Thermal power plants", "B": "Hydroelectric plants", "C": "Nuclear plants", "D": "Solar plants"}, "answer": "A"},
    {"question": "Methane is produced naturally in:", "difficulty": "hard", "options": {"A": "Marshes/Paddy fields", "B": "Forests", "C": "Oceans", "D": "Deserts"}, "answer": "A"},
    {"question": "Lead in gasoline was used as:", "difficulty": "hard", "options": {"A": "Anti-knocking agent (TEL)", "B": "Fuel", "C": "Coolant", "D": "Lubricant"}, "answer": "A"},
    {"question": "The main component of cigarette smoke that causes cancer is:", "difficulty": "hard", "options": {"A": "Benzopyrene/Tar", "B": "Nicotine only", "C": "Water vapor", "D": "Oxygen"}, "answer": "A"},
    {"question": "Chlorinated pesticides show:", "difficulty": "hard", "options": {"A": "High persistence in environment", "B": "Fast degradation", "C": "No toxicity", "D": "Short half-life"}, "answer": "A"},
    {"question": "Which of the following is a herbicide?", "difficulty": "hard", "options": {"A": "Sodium chlorate", "B": "DDT", "C": "Aldrin", "D": "Dieldrin"}, "answer": "A"},
    {"question": "The depletion of ozone layer leads to increase in case of:", "difficulty": "hard", "options": {"A": "Skin cancer", "B": "Cataracts", "C": "Damage to phytoplankton", "D": "All of the above"}, "answer": "D"},
    {"question": "Ozone is a ______ pollutant in the troposphere.", "difficulty": "hard", "options": {"A": "Secondary", "B": "Primary", "C": "Natural", "D": "Inert"}, "answer": "A"},
    {"question": "Which of the following is not a primary air pollutant?", "difficulty": "hard", "options": {"A": "Ozone", "B": "CO", "C": "NO", "D": "SO2"}, "answer": "A"},
    {"question": "The biggest source of CO pollution is:", "difficulty": "hard", "options": {"A": "Automobile exhaust", "B": "Volcanoes", "C": "Forest fires", "D": "Industrial plants"}, "answer": "A"}
]

add_questions('carboxylic_acids.json', carboxylic_acids_qs)
add_questions('nitrogen_compounds.json', nitrogen_compounds_qs)
add_questions('polymers.json', polymers_qs)
add_questions('everyday_chemistry.json', everyday_chemistry_qs)
add_questions('environmental_chemistry.json', environmental_chemistry_qs)
