import json
import os

botany_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\botany'

botany_cleanup = {
    "biomolecules.json": [
        {"question": "In the 'L-form' and 'D-form' of amino acids, which form is almost exclusively used in protein synthesis in living organisms?", "difficulty": "Hard", "options": {"A": "L-form", "B": "D-form", "C": "Both equally", "D": "Neither"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following is an example of a 'Storage' polysaccharide in animals and fungi?", "difficulty": "Hard", "options": {"A": "Glycogen", "B": "Starch", "C": "Cellulose", "D": "Inulin"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Michaelis-Menten' constant (K_m) represents the substrate concentration at which the reaction velocity is:", "difficulty": "Hard", "options": {"A": "Half of V_max", "B": "Equal to V_max", "C": "Zero", "D": "Double V_max"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following is a 'Globular' protein that acts as an enzyme?", "difficulty": "Hard", "options": {"A": "Lysozyme", "B": "Keratin", "C": "Collagen", "D": "Silk fibroin"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Primary Structure' of a protein refers to its:", "difficulty": "Hard", "options": {"A": "Amino acid sequence", "B": "Alpha-helix", "C": "Beta-pleated sheet", "D": "Overall 3D shape"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Secondary Structure' of proteins (like Alpha-helix) is stabilized primarily by which type of bonds?", "difficulty": "Hard", "options": {"A": "Hydrogen bonds", "B": "Disulfide bridges", "C": "Ionic bonds", "D": "Peptide bonds"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Antiparallel' nature of DNA strands means they run in opposite directions, specifically:", "difficulty": "Hard", "options": {"A": "5' to 3' and 3' to 5'", "B": "Both 5' to 3'", "C": "Both 3' to 5'", "D": "Clockwise and Counter-clockwise"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Chargaff's Rule' states that in a DNA molecule, the ratio of A:T and G:C is always:", "difficulty": "Hard", "options": {"A": "One (Equimolar)", "B": "Two", "C": "Zero", "D": "Variable"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following describes the 'Zwitterion' form of an amino acid?", "difficulty": "Hard", "options": {"A": "An ion with both positive and negative charges, making it electrically neutral", "B": "Always positively charged", "C": "Always negatively charged", "D": "An ion with no charge"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'A-DNA' differs from 'B-DNA' (the standard form) primarily in its:", "difficulty": "Hard", "options": {"A": "Right-handedness vs Left-handedness (Z-DNA is left)", "B": "Helix diameter and base pairs per turn", "C": "Sugar type", "D": "Phosphate group"}, "answer": "B", "tag": "conceptual"},
        {"question": "Which of the following is a 'Competitive' inhibitor of Succinate Dehydrogenase?", "difficulty": "Hard", "options": {"A": "Malonate", "B": "Lactate", "C": "Cyanide", "D": "ATP"}, "answer": "A", "tag": "conceptual"},
        {"question": "In 'Non-competitive' inhibition, the inhibitor binds to which part of the enzyme?", "difficulty": "Hard", "options": {"A": "A site other than the active site (Allosteric site)", "B": "The active site", "C": "The substrate", "D": "The product"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following is an 'Essential' amino acid that cannot be synthesized by the body?", "difficulty": "Hard", "options": {"A": "Leucine", "B": "Glycine", "C": "Alanine", "D": "Serine"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Apoenzyme' is the ______ part of a holoenzyme.", "difficulty": "Hard", "options": {"A": "Protein part", "B": "Non-protein part", "C": "Active part only", "0": "Inactive part"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Prosthetic Group' of an enzyme is a:", "difficulty": "Hard", "options": {"A": "Tightly bound non-protein cofactor", "B": "Loosely bound cofactor", "C": "Side chain", "D": "Nucleic acid"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following is a 'Vitamin' that acts as a coenzyme (specifically in NAD/NADP)?", "difficulty": "Hard", "options": {"A": "Niacin", "B": "Vitamin A", "C": "Vitamin C", "D": "Vitamin D"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Alpha-1,4-glycosidic' bond is characteristic of which polysaccharide?", "difficulty": "Hard", "options": {"A": "Amylose (and Glycogen)", "B": "Cellulose", "C": "Sucrose", "D": "Chitin"}, "answer": "A", "tag": "conceptual"},
        {"question": "'Chitin' is a homopolymer of:", "difficulty": "Hard", "options": {"A": "N-acetylglucosamine", "B": "Glucose", "C": "Fructose", "D": "Amino acids"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following describes 'Aromatic' amino acids?", "difficulty": "Hard", "options": {"A": "Tyrosine, Phenylalanine, and Tryptophan", "B": "Glycine and Valine", "C": "Lysine and Arginine", "D": "Cysteine"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Turnover Number' of an enzyme refers to:", "difficulty": "Hard", "options": {"A": "The number of substrate molecules converted to product per unit time by one enzyme molecule", "B": "The age of the enzyme", "C": "The weight", "D": "The energy requirement"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which enzyme is the 'Fastest' known enzyme, catalyzing the hydration of CO2?", "difficulty": "Hard", "options": {"A": "Carbonic Anhydrase", "B": "Catalase", "C": "RuBisCO", "D": "ATP Synthase"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Feedback Inhibition' (End-product inhibition) is an example of:", "difficulty": "Hard", "options": {"A": "Allosteric regulation", "B": "Irreversible inhibition", "C": "Denaturation", "D": "Mutation"}, "answer": "A", "tag": "conceptual"},
        {"question": "In 'B-DNA', the distance between two base pairs is:", "difficulty": "Hard", "options": {"A": "0.34 nm (3.4 Angstroms)", "B": "3.4 nm", "C": "10 nm", "D": "0.1 nm"}, "answer": "A", "tag": "conceptual"},
        {"question": "Wait, the number of base pairs in one full turn of 'B-DNA' is:", "difficulty": "Hard", "options": {"A": "10", "B": "11", "C": "12", "D": "8"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following is a 'Secondary' metabolite?", "difficulty": "Hard", "options": {"A": "Alkaloids and Flavonoids", "B": "Proteins for growth", "0": "ATP", "D": "Glucose"}, "answer": "A", "tag": "conceptual"}
    ],
    "cell_the_unit_of_life.json": [
        {"question": "The 'Cis' and 'Trans' faces of the Golgi apparatus are respectively the ______ and ______ faces.", "difficulty": "Hard", "options": {"A": "Forming (Convex), Maturing (Concave)", "B": "Maturing, Forming", "C": "Protein, Lipid", "D": "Inside, Outside"}, "answer": "A", "tag": "conceptual"}
    ]
}

for filename, questions in botany_cleanup.items():
    filepath = os.path.join(botany_dir, filename)
    if not os.path.exists(filepath): continue
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    existing_qs = data.get('questions', [])
    start_id = len(existing_qs) + 1
    for i, q in enumerate(questions):
        q['id'] = start_id + i
        if 'hasDiagram' not in q: q['hasDiagram'] = False
        if 'diagram_description' not in q: q['diagram_description'] = ""
        existing_qs.append(q)
    data['questions'] = existing_qs[:80]
    for idx, q in enumerate(data['questions']):
        q['id'] = idx + 1
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Cleanup Finalized {filename}: Total = {len(data['questions'])}")
