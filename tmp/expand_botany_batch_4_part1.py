import json
import os

botany_dir = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\seatcracker-app\public\questions_v2\botany'

batch_4_p1 = {
    "transport_in_plants.json": [
        {"question": "In the 'Cohesion-Tension' theory, what is the 'Tensile Strength' of water attributed to?", "difficulty": "Hard", "options": {"A": "Hydrogen bonding between water molecules", "B": "High surface tension", "C": "Ionic bonds", "D": "Van der Waals forces"}, "answer": "A", "tag": "conceptual"},
        {"question": "What happens to the 'Water Potential' (Psi_w) of a solution when more solute is added?", "difficulty": "Hard", "options": {"A": "It decreases (becomes more negative)", "B": "It increases (becomes more positive)", "C": "It remains zero", "D": "It becomes positive"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Hydathodes' involved in guttation are found in which part of the leaf?", "difficulty": "Hard", "options": {"A": "Leaf margins and tips", "B": "Upper epidermis", "C": "Lower epidermis", "D": "Midrib area"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following is a 'Unidirectional' transport process in plants?", "difficulty": "Hard", "options": {"A": "Xylem transport of water and minerals", "B": "Phloem transport of sugars", "C": "Cytoplasmic streaming", "D": "Mineral ion exchange in roots"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Apoplast' pathway is restricted by the ______ in the endodermis.", "difficulty": "Hard", "options": {"A": "Casparian strip", "B": "Plasma membrane", "C": "Plasmodesmata", "D": "Lenticels"}, "answer": "A", "tag": "conceptual"},
        {"question": "A cell placed in a 'Hypertonic' solution will undergo:", "difficulty": "Hard", "options": {"A": "Plasmolysis", "B": "Deplasmolysis", "C": "Turgidity", "D": "No change"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Pressure Flow Hypothesis' for phloem transport was proposed by:", "difficulty": "Hard", "options": {"A": "Ernst Munch", "B": "Stephen Hales", "C": "Dixon and Jolly", "D": "Priestley"}, "answer": "A", "tag": "conceptual"},
        {"question": "What is the primary function of 'Lenticels' in woody stems?", "difficulty": "Hard", "options": {"A": "Gaseous exchange", "B": "Water absorption", "C": "Photosynthesis", "D": "Food storage"}, "answer": "A", "tag": "conceptual"}
    ],
    "mineral_nutrition.json": [
        {"question": "Which of the following describes the 'Active' absorption of mineral ions from soil?", "difficulty": "Hard", "options": {"A": "Moving ions against their concentration gradient using ATP", "B": "Moving ions along the gradient", "C": "Only occurs in dead cells", "D": "Requires only light energy"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which mineral is required for the synthesis of 'Chlorophyll' and is also a component of ferredoxin?", "difficulty": "Hard", "options": {"A": "Iron (Fe)", "B": "Magnesium (Mg)", "C": "Zinc (Zn)", "D": "Copper (Cu)"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Critical concentration' of an element is defined as the concentration below which:", "difficulty": "Hard", "options": {"A": "Plant growth is retarded", "B": "The plant dies immediately", "C": "The plant flowers early", "D": "Respiration stops"}, "answer": "A", "tag": "conceptual"},
        {"question": "Deficiency of which element causes 'Whiptail' of cauliflower?", "difficulty": "Hard", "options": {"A": "Molybdenum (Mo)", "B": "Boron (B)", "C": "Zinc (Zn)", "D": "Copper (Cu)"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following is a 'Micro-nutrient' found in many enzymes like alcohol dehydrogenase?", "difficulty": "Hard", "options": {"A": "Zinc (Zn)", "B": "Sulfur (S)", "C": "Calcium (Ca)", "D": "Magnesium (Mg)"}, "answer": "A", "tag": "conceptual"},
        {"question": "Nitrogen-fixing bacteria in root nodules require an ______ environment provided by leghaemoglobin.", "difficulty": "Hard", "options": {"A": "Anaerobic (Oxygen-free)", "B": "Aerobic", "C": "Acidic", "D": "High pressure"}, "answer": "A", "tag": "conceptual"},
        {"question": "The process of 'Nitrification' converts ammonia to nitrates using which bacteria?", "difficulty": "Hard", "options": {"A": "Nitrosomonas and Nitrobacter", "B": "Rhizobium", "C": "Azotobacter", "D": "Anabaena"}, "answer": "A", "tag": "conceptual"},
        {"question": "Manganese toxicity causes deficiency symptoms of which elements?", "difficulty": "Hard", "options": {"A": "Fe, Mg, and Ca", "B": "N, P, and K", "C": "B and Mo", "D": "Zn and Cu"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which mineral is essential for 'Pollen Germination' and carbohydrate translocation?", "difficulty": "Hard", "options": {"A": "Boron (B)", "B": "Zinc (Zn)", "C": "Calcium (Ca)", "D": "Copper (Cu)"}, "answer": "A", "tag": "conceptual"},
        {"question": "The enzyme 'Nitrogenase' contains which of the following mineral elements?", "difficulty": "Hard", "options": {"A": "Mo and Fe", "B": "Zn and Cu", "C": "Mg and Ca", "D": "N and P"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which mineral is essential for the 'Splitting of Water' during photosynthesis?", "difficulty": "Hard", "options": {"A": "Mn and Cl", "B": "Mg and Ca", "C": "Fe and Zn", "D": "Cu and B"}, "answer": "A", "tag": "conceptual"},
        {"question": "Deficiency of which mineral causes 'Necrosis' (death of leaf tissue)?", "difficulty": "Hard", "options": {"A": "Ca, Mg, Cu, and K", "B": "N, P, K", "C": "Fe, Zn", "D": "B, Mo"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which mineral is a constituent of 'Biotin' and 'Coenzyme A'?", "difficulty": "Hard", "options": {"A": "Sulfur (S)", "B": "Phosphorus (P)", "C": "Iron (Fe)", "D": "Magnesium (Mg)"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Ammonification' process is the conversion of organic nitrogen into ______.", "difficulty": "Hard", "options": {"A": "Ammonia", "B": "Nitrate", "C": "Nitrite", "D": "Nitrogen gas"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which mineral is a structural component of the 'Middle Lamella' in plant cell walls?", "difficulty": "Hard", "options": {"A": "Calcium (Ca)", "B": "Magnesium (Mg)", "C": "Phosphorus (P)", "D": "Potassium (K)"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Reductive Amination' process converts ammonia into which amino acid?", "difficulty": "Hard", "options": {"A": "Glutamic acid", "B": "Alanine", "C": "Tryptophan", "D": "Valine"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which mineral is involved in the opening and closing of 'Stomata'?", "difficulty": "Hard", "options": {"A": "Potassium (K)", "B": "Sodium (Na)", "C": "Calcium (Ca)", "D": "Magnesium (Mg)"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which element is considered a 'Beneficial' element in plants like silicon and selenium?", "difficulty": "Hard", "options": {"A": "Sodium (Na)", "B": "Carbon (C)", "C": "Nitrogen (N)", "D": "Phosphorus (P)"}, "answer": "A", "tag": "conceptual"},
        {"question": "The term 'Chlorosis' refers to the loss of ______ leading to yellowing of leaves.", "difficulty": "Hard", "options": {"A": "Chlorophyll", "B": "Sugar", "C": "Water", "D": "Proteins"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which element is the only 'Macronutrient' synthesized from the air?", "difficulty": "Hard", "options": {"A": "Carbon (C)", "B": "Nitrogen (N)", "C": "Oxygen (O)", "D": "All of the above"}, "answer": "D", "tag": "conceptual"},
        {"question": "In the 'Transamination' process, the amino group is transferred from one amino acid to a ______.", "difficulty": "Hard", "options": {"A": "Keto acid", "B": "Fatty acid", "C": "Sugar", "D": "Nucleic acid"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following is a symptom of 'Nitrogen' deficiency in plants?", "difficulty": "Hard", "options": {"A": "Stunted growth and yellowing of older leaves", "B": "Purple leaves", "C": "Excessive flowering", "D": "Rapid growth"}, "answer": "A", "tag": "conceptual"}
    ],
    "anatomy_of_flowering_plants.json": [
        {"question": "The 'Vascular Cambium' in a dicot stem is formed from:", "difficulty": "Hard", "options": {"A": "Intrafascicular and Interfascicular cambium", "B": "Apical meristem", "C": "Phellogen", "D": "Epidermis"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following describes 'Sapwood' (Alburnum)?", "difficulty": "Hard", "options": {"A": "Outer peripheral functional part of secondary xylem for water conduction", "B": "Central dark non-functional part", "C": "The bark", "D": "The phloem"}, "answer": "A", "tag": "conceptual"},
        {"question": "The lens-shaped openings in the bark of woody stems for gas exchange are:", "difficulty": "Hard", "options": {"A": "Lenticels", "B": "Stomata", "C": "Hydathodes", "D": "Plasmodesmata"}, "answer": "A", "tag": "conceptual"},
        {"question": "In 'Monocot' roots, the number of xylem bundles is typically:", "difficulty": "Hard", "options": {"A": "More than six (Polyarch)", "B": "Two to four", "C": "One", "D": "None"}, "answer": "A", "tag": "conceptual"},
        {"question": "What is the primary function of the 'Casparian Strips' in the endodermis?", "difficulty": "Hard", "options": {"A": "To force water and minerals to move across the plasma membrane into the symplast", "B": "To store sugar", "C": "To provide strength", "D": "To allow water to bypass cells"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following cell types lacks a 'Nucleus' at maturity?", "difficulty": "Hard", "options": {"A": "Sieve tube elements", "B": "Companion cells", "C": "Tracheids", "D": "Vessels"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Phellogen' is another name for:", "difficulty": "Hard", "options": {"A": "Cork cambium", "B": "Vascular cambium", "C": "Secondary phloem", "D": "Pith"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which tissue is responsible for 'Primary Growth' (increase in length) in plants?", "difficulty": "Hard", "options": {"A": "Apical meristem", "B": "Lateral meristem", "C": "Cambium", "D": "Xylem"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Guard Cells' in dicots are typically ______-shaped.", "difficulty": "Hard", "options": {"A": "Bean", "B": "Dumbbell", "C": "Circular", "D": "Star"}, "answer": "A", "tag": "conceptual"},
        {"question": "The term 'Stelar' system includes which components?", "difficulty": "Hard", "options": {"A": "Xylem, Phloem, and Pericycle", "B": "Epidermis and Cortex", "C": "Bark and Lenticels", "D": "Endodermis only"}, "answer": "A", "tag": "conceptual"},
        {"question": "In 'Secondary Growth' of roots, the vascular cambium originates from:", "difficulty": "Hard", "options": {"A": "Pericycle and tissues below phloem bundles", "B": "Epidermis", "C": "Pith", "D": "Apical meristem"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following tissues provides 'Mechanical strength' to young dicot stems?", "difficulty": "Hard", "options": {"A": "Collenchyma", "B": "Parenchyma", "C": "Aerenchyma", "D": "Chlorenchyma"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Exarch' condition of xylem is found in:", "difficulty": "Hard", "options": {"A": "Roots (Protoxylem towards periphery)", "B": "Stems (Protoxylem towards center)", "C": "Leaves", "D": "Flowers"}, "answer": "A", "tag": "conceptual"},
        {"question": "What are 'Tyloses'?", "difficulty": "Hard", "options": {"A": "Balloon-like outgrowths of parenchyma into the vessel lumen", "B": "Holes in the bark", "C": "Stomata on roots", "D": "Dead phloem cells"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Mesophyll' of a dicot leaf is differentiated into:", "difficulty": "Hard", "options": {"A": "Palisade and Spongy parenchyma", "B": "Xylem and Phloem", "C": "Epidermis and Endodermis", "D": "Meristem and Permanent tissue"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following is NOT a 'Lateral' meristem?", "difficulty": "Hard", "options": {"A": "Apical meristem", "B": "Vascular cambium", "C": "Cork cambium", "D": "Interfascicular cambium"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Periderm' includes which three layers?", "difficulty": "Hard", "options": {"A": "Phellem, Phellogen, and Phelloderm", "B": "Xylem, Phloem, and Cambium", "C": "Cortex, Endodermis, and Pericycle", "D": "Bark and Wood"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Pith' is highly developed and large in which type of roots?", "difficulty": "Hard", "options": {"A": "Dicot roots", "B": "Monocot roots", "C": "Both", "D": "None"}, "answer": "B", "tag": "conceptual"},
        {"question": "What is 'Spring Wood'?", "difficulty": "Hard", "options": {"A": "Xylem produced during the spring with larger vessels", "B": "Xylem produced during winter", "C": "Dead wood", "D": "The bark"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which tissue in the leaf facilitates 'Gas Exchange'?", "difficulty": "Hard", "options": {"A": "Spongy parenchyma with large air cavities", "B": "Palisade parenchyma", "C": "Vascular bundles", "D": "Epidermis with no holes"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Scattered' vascular bundles in monocot stems are characterized as:", "difficulty": "Hard", "options": {"A": "Conjoint, collateral, and closed", "B": "Conjoint, collateral, and open", "C": "Radial", "D": "Bicollateral"}, "answer": "A", "tag": "conceptual"},
        {"question": "The term 'Endarch' describes xylem where:", "difficulty": "Hard", "options": {"A": "Protoxylem is towards the center (in stems)", "B": "Protoxylem is towards periphery (in roots)", "C": "Xylem is combined with phloem", "D": "Xylem is absent"}, "answer": "A", "tag": "conceptual"},
        {"question": "What happens to 'Companion Cells' when the sieve tube dies?", "difficulty": "Hard", "options": {"A": "They also die as they are sister cells", "B": "They survive", "C": "They turn into bark", "D": "They divide"}, "answer": "A", "tag": "conceptual"}
    ],
    "plant_kingdom.json": [
        {"question": "Which of the following describes 'Isogamy' found in *Ulothrix*?", "difficulty": "Hard", "options": {"A": "Fusion of flagellated and similar-sized gametes", "B": "Fusion of non-flagellated similar gametes", "C": "Fusion of different sized gametes", "D": "Fusion of static large egg and small motile male gamete"}, "answer": "A", "tag": "conceptual"},
        {"question": "What is the primary photosynthetic pigment in the 'Brown Algae' (Phaeophyceae)?", "difficulty": "Hard", "options": {"A": "Chlorophyll a and c, with fucoxanthin", "B": "Chlorophyll a and b", "C": "Chlorophyll a and d", "D": "Chlorophyll a and phycobilins"}, "answer": "A", "tag": "conceptual"},
        {"question": "In the life cycle of 'Gymnosperms', the megaspore mother cell undergoes meiosis to form four megaspores. How many become functional?", "difficulty": "Hard", "options": {"A": "One", "B": "Two", "C": "Three", "D": "Four"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following is a 'Heterosporous' fern?", "difficulty": "Hard", "options": {"A": "Salvinia", "B": "Dryopteris", "C": "Pteris", "D": "Adiantum"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Endosperm' in Gymnosperms is produced ______ fertilization and is ______.", "difficulty": "Hard", "options": {"A": "Before, Haploid (n)", "B": "After, Triploid (3n)", "C": "After, Diploid (2n)", "D": "During, Haploid"}, "answer": "A", "tag": "conceptual"}
    ],
    "cell_cycle_and_cell_division.json": [
        {"question": "The 'Quiescent Stage' (G_0) of the cell cycle is one where cells:", "difficulty": "Hard", "options": {"A": "Remain metabolically active but no longer proliferate", "B": "Are dead", "C": "Undergo rapid division", "D": "Are in S phase"}, "answer": "A", "tag": "conceptual"},
        {"question": "In which stage of Prophase I does 'Crossing Over' occur?", "difficulty": "Hard", "options": {"A": "Pachytene", "B": "Leptotene", "C": "Zygotene", "D": "Diplotene"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Synaptonemal Complex' is a structure formed during which stage of meiosis?", "difficulty": "Hard", "options": {"A": "Zygotene", "B": "Pachytene", "C": "Anaphase", "D": "Metaphase"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which enzyme catalyzes the process of 'Recombination' during Pachytene?", "difficulty": "Hard", "options": {"A": "Recombinase", "B": "Ligase", "C": "Polymerase", "D": "Helicase"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Split' of centromeres and separation of sister chromatids occurs in:", "difficulty": "Hard", "options": {"A": "Anaphase (Mitosis) and Anaphase II (Meiosis)", "B": "Anaphase I", "C": "Metaphase", "D": "Prophase"}, "answer": "A", "tag": "conceptual"},
        {"question": "In 'Plant Cell Division', cytokinesis primarily occurs through the formation of a:", "difficulty": "Hard", "options": {"A": "Cell plate", "B": "Cleavage furrow", "C": "Centriole", "D": "Contractile ring"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following describes 'Chiasmata'?", "difficulty": "Hard", "options": {"A": "X-shaped structures representing sites of crossing over", "B": "The two cells after division", "C": "Spindle fibers", "D": "Chromatids"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Colchicine' chemical inhibits cell division by preventing the formation of:", "difficulty": "Hard", "options": {"A": "Spindle fibers (Microtubules)", "B": "DNA", "C": "RNA", "D": "Cell wall"}, "answer": "A", "tag": "conceptual"},
        {"question": "At which stage of the cell cycle is 'DNA Replication' completed?", "difficulty": "Hard", "options": {"A": "S phase", "B": "G1 phase", "C": "G2 phase", "D": "M phase"}, "answer": "A", "tag": "conceptual"},
        {"question": "The number of chromosomes remains the same, but the amount of DNA per cell doubles from 2C to 4C during:", "difficulty": "Hard", "options": {"A": "S phase", "B": "Mitosis", "C": "G1 phase", "D": "Meiosis"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following is characteristic of 'Metaphase I' of meiosis?", "difficulty": "Hard", "options": {"A": "Bivalent chromosomes align on the equatorial plate", "B": "Sister chromatids separate", "C": "Crossing over starts", "D": "Nucleolus reappears"}, "answer": "A", "tag": "conceptual"},
        {"question": "The stage between two meiotic divisions is called ______ and typically lacks DNA replication.", "difficulty": "Hard", "options": {"A": "Interkinesis", "B": "Interphase", "C": "G1 phase", "D": "Prophase I"}, "answer": "A", "tag": "conceptual"},
        {"question": "In an 'Oocyte' of some vertebrates, which stage of Prophase I can last for months or years?", "difficulty": "Hard", "options": {"A": "Diplotene", "B": "Pachytene", "C": "Diakinesis", "D": "Leptotene"}, "answer": "A", "tag": "conceptual"},
        {"question": "The process of 'Pairing' of homologous chromosomes is called:", "difficulty": "Hard", "options": {"A": "Synapsis", "B": "Recombination", "C": "Disjunction", "D": "Translocation"}, "answer": "A", "tag": "conceptual"},
        {"question": "How many mitotic divisions are required to form 128 cells from a single cell?", "difficulty": "Hard", "options": {"A": "7", "B": "127", "C": "6", "D": "8"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following check-points is the most critical for deciding whether the cell proceeds to division?", "difficulty": "Hard", "options": {"A": "G1/S check-point", "B": "G2/M check-point", "C": "Metaphase check-point", "D": "Anaphase check-point"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Kinetochore' is a protein structure located at the:", "difficulty": "Hard", "options": {"A": "Centromere of the chromosome", "B": "Ends of the chromosome (Telomeres)", "C": "Nucleolus", "D": "Spindle poles"}, "answer": "A", "tag": "conceptual"},
        {"question": "In 'Amitosis', the nucleus divides by:", "difficulty": "Hard", "options": {"A": "Direct constriction without spindle formation", "B": "Mitotic steps", "C": "Meiotic steps", "D": "Fusion"}, "answer": "A", "tag": "conceptual"},
        {"question": "What is the 'Functional' significance of meiosis?", "difficulty": "Hard", "options": {"A": "Maintenance of chromosome number across generations and creation of variation", "B": "Repair of tissues", "C": "Growth of the organism", "D": "Asexual reproduction"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Disjunction' refers to the:", "difficulty": "Hard", "options": {"A": "Separation of homologous chromosomes during Anaphase I", "B": "Fusion of chromosomes", "C": "Breaking of DNA", "D": "Duplication of DNA"}, "answer": "A", "tag": "conceptual"},
        {"question": "Which of the following does NOT occur during 'Interphase'?", "difficulty": "Hard", "options": {"A": "Chromatin condensation into chromosomes", "B": "Cell growth", "C": "DNA replication", "D": "Centriole duplication"}, "answer": "A", "tag": "conceptual"},
        {"question": "The term 'Generation Time' refers to:", "difficulty": "Hard", "options": {"A": "The time required for one complete cell cycle", "B": "The age of the cell", "C": "The time in S phase", "D": "The time since birth"}, "answer": "A", "tag": "conceptual"},
        {"question": "At the end of 'Telophase', which components reappeared in the cell?", "difficulty": "Hard", "options": {"A": "Nucleolus, Nuclear envelope, and Golgi complex", "B": "Spindle fibers", "C": "Recombination nodules", "D": "Chiasmata"}, "answer": "A", "tag": "conceptual"},
        {"question": "Chromosomes are most clearly visible and their morphology can be studied during:", "difficulty": "Hard", "options": {"A": "Metaphase", "B": "Prophase", "C": "Anaphase", "D": "Interphase"}, "answer": "A", "tag": "conceptual"},
        {"question": "The 'Syncytium' is formed when:", "difficulty": "Hard", "options": {"A": "Karyokinesis is not followed by cytokinesis", "B": "Two cells fuse together", "C": "Cell division stops", "D": "Mitosis occurs twice"}, "answer": "A", "tag": "conceptual"}
    ]
}

# Expand and sanitize IDs to reach exactly 80.
for filename, questions in batch_4_p1.items():
    filepath = os.path.join(botany_dir, filename)
    if not os.path.exists(filepath): continue
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    existing_qs = data.get('questions', [])
    
    # Calculate how many to reach 80
    current_count = len(existing_qs)
    limit = 80
    to_add = questions
    
    start_id = current_count + 1
    for i, q in enumerate(to_add):
        q['id'] = start_id + i
        if 'hasDiagram' not in q: q['hasDiagram'] = False
        if 'diagram_description' not in q: q['diagram_description'] = ""
        existing_qs.append(q)
    
    # Force limit exactly 80
    data['questions'] = existing_qs[:80]
    
    # Final ID check
    for idx, q in enumerate(data['questions']):
        q['id'] = idx + 1
        
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Finalized {filename}: Total = {len(data['questions'])}")
