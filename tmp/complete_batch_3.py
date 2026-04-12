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

# Batch 3 Data
biomolecules_qs = [
    {"question": "Sucrose on hydrolysis gives a mixture of:", "difficulty": "hard", "options": {"A": "Glucose + Fructose", "B": "Glucose + Galactose", "C": "Two molecules of Glucose", "D": "Fructose + Galactose"}, "answer": "A"},
    {"question": "The glycosidic linkage in Maltose is between:", "difficulty": "hard", "options": {"A": "C1 of one glucose and C4 of another", "B": "C1 of glucose and C2 of fructose", "C": "C1 of galactose and C4 of glucose", "D": "C1 and C6 of glucose"}, "answer": "A"},
    {"question": "Which of the following is a non-reducing sugar?", "difficulty": "hard", "options": {"A": "Sucrose", "B": "Maltose", "C": "Lactose", "D": "Cellobiose"}, "answer": "A"},
    {"question": "Proteins are polymers of:", "difficulty": "hard", "options": {"A": "Alpha-amino acids", "B": "Beta-amino acids", "C": "Alcohols", "D": "Esters"}, "answer": "A"},
    {"question": "The sequence of amino acids in a protein refers to its:", "difficulty": "hard", "options": {"A": "Primary structure", "B": "Secondary structure", "C": "Tertiary structure", "D": "Quaternary structure"}, "answer": "A"},
    {"question": "Identify the sulfur-containing amino acid:", "difficulty": "hard", "options": {"A": "Cysteine", "B": "Glycine", "C": "Alanine", "D": "Serine"}, "answer": "A"},
    {"question": "Which vitamin is water soluble?", "difficulty": "hard", "options": {"A": "Vitamin C", "B": "Vitamin A", "C": "Vitamin D", "D": "Vitamin K"}, "answer": "A"},
    {"question": "Deficiency of Vitamin B12 causes:", "difficulty": "hard", "options": {"A": "Pernicious anemia", "B": "Scurvy", "C": "Rickets", "D": "Beriberi"}, "answer": "A"},
    {"question": "The double helix structure of DNA is held by:", "difficulty": "hard", "options": {"A": "Hydrogen bonds between bases", "B": "Covalent bonds", "C": "Ionic bonds", "D": "Van der Waals"}, "answer": "A"},
    {"question": "Which base is present in RNA but not in DNA?", "difficulty": "hard", "options": {"A": "Uracil", "B": "Thymine", "C": "Adenine", "D": "Guanine"}, "answer": "A"},
    {"question": "The sugar present in DNA is:", "difficulty": "hard", "options": {"A": "2-Deoxy-D-ribose", "B": "D-Ribose", "C": "D-Glucose", "D": "L-Ribose"}, "answer": "A"},
    {"question": "Denaturation of protein refers to:", "difficulty": "hard", "options": {"A": "Loss of biological activity due to change in structure", "B": "Formation of peptide bonds", "C": "Synthesis of protein", "D": "Hydrolysis of protein"}, "answer": "A"},
    {"question": "Zwitterion structure of an amino acid contains:", "difficulty": "hard", "options": {"A": "Both positive and negative charge", "B": "Only positive charge", "C": "Only negative charge", "D": "No charge"}, "answer": "A"},
    {"question": "The linkage between two nucleotides in a nucleic acid is:", "difficulty": "hard", "options": {"A": "Phosphodiester linkage", "B": "Peptide linkage", "C": "Glycosidic linkage", "D": "Hydrogen bond"}, "answer": "A"},
    {"question": "Which of the following is an essential amino acid?", "difficulty": "hard", "options": {"A": "Lysine", "B": "Glycine", "C": "Alanine", "D": "Serine"}, "answer": "A"},
    {"question": "The fibrous protein among the following is:", "difficulty": "hard", "options": {"A": "Keratin", "B": "Insulin", "C": "Albumin", "D": "Hemoglobin"}, "answer": "A"},
    {"question": "An example of a globular protein is:", "difficulty": "hard", "options": {"A": "Albumin", "B": "Collagen", "C": "Fibrin", "D": "Myosin"}, "answer": "A"},
    {"question": "Which enzyme converts starch to maltose?", "difficulty": "hard", "options": {"A": "Amylase", "B": "Zymase", "C": "Invertase", "D": "Maltase"}, "answer": "A"},
    {"question": "Vitamins are also known as:", "difficulty": "hard", "options": {"A": "Accessory dietary factors", "B": "Macronutrients", "C": "Enzymes", "D": "Hormones"}, "answer": "A"},
    {"question": "Scurvy is caused by deficiency of:", "difficulty": "hard", "options": {"A": "Vitamin C", "B": "Vitamin B1", "C": "Vitamin D", "D": "Vitamin A"}, "answer": "A"},
    {"question": "The number of Chiral centers in D-Glucose is:", "difficulty": "hard", "options": {"A": "4", "B": "5", "C": "3", "D": "6"}, "answer": "A"},
    {"question": "Blood sugar is:", "difficulty": "hard", "options": {"A": "Glucose", "B": "Fructose", "C": "Sucrose", "D": "Lactose"}, "answer": "A"},
    {"question": "Nucleoside consists of:", "difficulty": "hard", "options": {"A": "Base + Sugar", "B": "Base + Sugar + Phosphate", "C": "Sugar + Phosphate", "D": "Base + Phosphate"}, "answer": "A"},
    {"question": "Which bond is responsible for the secondary structure of proteins?", "difficulty": "hard", "options": {"A": "Intramolecular Hydrogen bonds", "B": "Peptide bonds", "C": "Ionic bonds", "D": "Covalent bonds"}, "answer": "A"},
    {"question": "Invert sugar is:", "difficulty": "hard", "options": {"A": "Equimolar mixture of glucose and fructose obtained from sucrose", "B": "Pure glucose", "C": "Pure fructose", "D": "Lactose"}, "answer": "A"},
    {"question": "The isoelectronic point of an amino acid is information about:", "difficulty": "hard", "options": {"A": "The pH at which it exists as a neutral zwitterion", "B": "Molecular weight", "C": "Optical rotation", "D": "Solubility in ether"}, "answer": "A"}
]

coordination_compounds_qs = [
    {"question": "The IUPAC name of [Co(NH3)5Cl]Cl2 is:", "difficulty": "hard", "options": {"A": "Pentaamminechloridocobalt(III) chloride", "B": "Pentaamminechlorocobalt(II) chloride", "C": "Chloropentaamminecobalt(III) chloride", "D": "Pentaamminechlorocobalt(III) dichloride"}, "answer": "A"},
    {"question": "How many ions are produced by [Co(NH3)6]Cl3 in aqueous solution?", "difficulty": "hard", "options": {"A": "4", "B": "3", "C": "2", "D": "6"}, "answer": "A"},
    {"question": "The effective atomic number (EAN) of Fe in [Fe(CN)6]4- is:", "difficulty": "hard", "options": {"A": "36", "B": "34", "C": "35", "D": "37"}, "answer": "A"},
    {"question": "Which of the following is a chelating ligand?", "difficulty": "hard", "options": {"A": "Oxalate ion (ox)", "B": "Ammonia", "C": "Chloride", "D": "Water"}, "answer": "A"},
    {"question": "The coordination number of Cr in [Cr(en)3]Cl3 is:", "difficulty": "hard", "options": {"A": "6", "B": "3", "C": "2", "D": "4"}, "answer": "A"},
    {"question": "The geometry of [Ni(CN)4]2- is ______ and its hybridization is ______.", "difficulty": "hard", "options": {"A": "Square planar, dsp2", "B": "Tetrahedral, sp3", "C": "Octahedral, sp3d2", "D": "Square planar, sp3"}, "answer": "A"},
    {"question": "Which complex is paramagnetic?", "difficulty": "hard", "options": {"A": "[Fe(CN)6]3-", "B": "[Fe(CN)6]4-", "C": "[Ni(CO)4]", "D": "[Co(NH3)6]3+"}, "answer": "A"},
    {"question": "Crystal Field Stabilisation Energy (CFSE) for high spin d4 octahedral complex is:", "difficulty": "hard", "options": {"A": "-0.6 delta_o", "B": "-1.2 delta_o", "C": "-0.4 delta_o", "D": "0"}, "answer": "A"},
    {"question": "According to CFT, the order of splitting of d-orbitals in tetrahedral field is:", "difficulty": "hard", "options": {"A": "e lower than t2", "B": "t2 lower than e", "C": "eg lower than t2g", "D": "No splitting"}, "answer": "A"},
    {"question": "The number of geometrical isomers for [Pt(NH3)2Cl2] is:", "difficulty": "hard", "options": {"A": "2 (cis and trans)", "B": "3", "C": "4", "D": "1"}, "answer": "A"},
    {"question": "Which of the following shows linkage isomerism?", "difficulty": "hard", "options": {"A": "[Co(NH3)5(NO2)]Cl2", "B": "[Co(NH3)6]Cl3", "C": "[Cr(en)3]Cl3", "D": "[Co(NH3)5(SO4)]Br"}, "answer": "A"},
    {"question": "The color of coordination compounds is due to:", "difficulty": "hard", "options": {"A": "d-d transitions", "B": "Charge transfer", "C": "Metal-metal bond", "D": "Ligand color only"}, "answer": "A"},
    {"question": "In the spectrochemical series, which ligand produces the maximum splitting?", "difficulty": "hard", "options": {"A": "CO", "B": "CN-", "C": "en", "D": "I-"}, "answer": "A"},
    {"question": "The complex [Co(NH3)6][Cr(CN)6] shows:", "difficulty": "hard", "options": {"A": "Coordination isomerism", "B": "Ionization isomerism", "C": "Linkage isomerism", "D": "Solvate isomerism"}, "answer": "A"},
    {"question": "Fac-mer isomerism is observed in complexes of the type:", "difficulty": "hard", "options": {"A": "[MA3B3]", "B": "[MA2B4]", "C": "[MA4B2]", "D": "[MABCD]"}, "answer": "A"},
    {"question": "The spin-only magnetic moment of [MnCl4]2- is:", "difficulty": "hard", "options": {"A": "5.92 BM", "B": "1.73 BM", "C": "3.87 BM", "D": "4.90 BM"}, "answer": "A"},
    {"question": "The formula of Prussian blue is:", "difficulty": "hard", "options": {"A": "Fe4[Fe(CN)6]3", "B": "Fe3[Fe(CN)6]4", "C": "Na4[Fe(CN)6]", "D": "Fe[Fe(CN)6]"}, "answer": "A"},
    {"question": "The synergic effect in metal carbonyls involves:", "difficulty": "hard", "options": {"A": "Both sigma-donation from L to M and pi-back donation from M to L", "B": "Only sigma donation", "C": "Only pi back donation", "D": "Electrostatic attraction"}, "answer": "A"},
    {"question": "Cis-platin is used as an:", "difficulty": "hard", "options": {"A": "Anti-cancer drug", "B": "Antipyretic", "C": "Antibiotic", "D": "Catalyst"}, "answer": "A"},
    {"question": "What is the coordination number of Fe in Haemoglobin?", "difficulty": "hard", "options": {"A": "6", "B": "4", "C": "5", "D": "8"}, "answer": "A"},
    {"question": "The ligand EDTA is ______.", "difficulty": "hard", "options": {"A": "Hexadentate", "B": "Tetradentate", "C": "Bidentate", "D": "Didentate"}, "answer": "A"},
    {"question": "Which of the following complexes is outer orbital complex?", "difficulty": "hard", "options": {"A": "[CoF6]3-", "B": "[Co(NH3)6]3+", "C": "[Fe(CN)6]3-", "D": "[Cr(NH3)6]3+"}, "answer": "A"},
    {"question": "The hybridization of Central metal in [Fe(CO)5] is:", "difficulty": "hard", "options": {"A": "dsp3", "B": "sp3d2", "C": "sp3d", "D": "sp3"}, "answer": "A"},
    {"question": "Wilson's disease is caused by excess of:", "difficulty": "hard", "options": {"A": "Copper", "B": "Iron", "C": "Lead", "D": "Cobalt"}, "answer": "A"},
    {"question": "The complex used in the estimation of hardness of water is:", "difficulty": "hard", "options": {"A": "Na2EDTA", "B": "KMnO4", "C": "AgNO3", "D": "K2Cr2O7"}, "answer": "A"},
    {"question": "An example of a pi-acid ligand is:", "difficulty": "hard", "options": {"A": "CO", "B": "H2O", "C": "Cl-", "D": "NH3"}, "answer": "A"},
    {"question": "Ambidentate ligands like SCN- can bind through:", "difficulty": "hard", "options": {"A": "Both S and N atoms", "B": "Only S", "C": "Only N", "D": "Only C"}, "answer": "A"}
]

d_f_block_qs = [
    {"question": "Transition elements show variable oxidation states because:", "difficulty": "hard", "options": {"A": "(n-1)d and ns electrons have comparable energy", "B": "They are metals", "C": "They have high density", "D": "They belong to d-block"}, "answer": "A"},
    {"question": "Which transition metal shows the maximum oxidation state of +8?", "difficulty": "hard", "options": {"A": "Osmium (Os)", "B": "Manganese (Mn)", "C": "Iron (Fe)", "D": "Chromium (Cr)"}, "answer": "A"},
    {"question": "Lanthanoid contraction is caused by:", "difficulty": "hard", "options": {"A": "Poor shielding effect of 4f electrons", "B": "High nuclear charge only", "C": "Increase in number of shells", "D": "Presence of d-electrons"}, "answer": "A"},
    {"question": "Which of the following is most basic?", "difficulty": "hard", "options": {"A": "La(OH)3", "B": "Lu(OH)3", "C": "Gd(OH)3", "D": "Ce(OH)3"}, "answer": "A"},
    {"question": "Potassium dichromate (K2Cr2O7) reacts with H2S to give:", "difficulty": "hard", "options": {"A": "Sulphur", "B": "SO2", "C": "H2SO4", "D": "No reaction"}, "answer": "A"},
    {"question": "In acidic medium, one mole of KMnO4 accepts ______ moles of electrons.", "difficulty": "hard", "options": {"A": "5", "B": "2", "C": "3", "D": "6"}, "answer": "A"},
    {"question": "The color of CrO4 2- (Chromate) changes to Cr2O7 2- (Dichromate) on:", "difficulty": "hard", "options": {"A": "Decreasing pH (Adding acid)", "B": "Increasing pH", "C": "Adding oxidant", "D": "Heating"}, "answer": "A"},
    {"question": "The magnetic moment of Transition metal ion with d3 configuration is:", "difficulty": "hard", "options": {"A": "3.87 BM", "B": "1.73 BM", "C": "2.83 BM", "D": "4.90 BM"}, "answer": "A"},
    {"question": "Misch metal is an alloy of Lanthanoids with:", "difficulty": "hard", "options": {"A": "Iron", "B": "Copper", "C": "Zinc", "D": "Aluminum"}, "answer": "A"},
    {"question": "Which of the following is a radioactive Lanthanoid?", "difficulty": "hard", "options": {"A": "Promethium (Pm)", "B": "Cerium", "C": "Gadolinium", "D": "Lutetium"}, "answer": "A"},
    {"question": "The general electronic configuration of Lanthanoids is:", "difficulty": "hard", "options": {"A": "[Xe] 4f(1-14) 5d(0-1) 6s2", "B": "[Xe] 4f(0-14) 5d(0-1) 6s2", "C": "[Xe] 5f(1-14) 6d(0-1) 7s2", "D": "None"}, "answer": "A"},
    {"question": "Transition metals are good catalysts because of:", "difficulty": "hard", "options": {"A": "Variable oxidation states and large surface area", "B": "High melting point", "C": "Lustre", "D": "Malleability"}, "answer": "A"},
    {"question": "Interstitial compounds of transition metals are:", "difficulty": "hard", "options": {"A": "Non-stoichiometric", "B": "Highly reactive", "C": "Soft", "D": "Ionic"}, "answer": "A"},
    {"question": "In the reaction: 2KMnO4 --(Heat)--> A + MnO2 + O2; A is:", "difficulty": "hard", "options": {"A": "K2MnO4 (Potassium manganate)", "B": "Mn2O7", "C": "MnO3", "D": "KOH"}, "answer": "A"},
    {"question": "Which of the following ions is colorless?", "difficulty": "hard", "options": {"A": "Sc3+", "B": "Ti3+", "C": "V3+", "D": "Cr3+"}, "answer": "A"},
    {"question": "The most common oxidation state of Lanthanoids is:", "difficulty": "hard", "options": {"A": "+3", "B": "+2", "C": "+4", "D": "+5"}, "answer": "A"},
    {"question": "Actinoid contraction is greater than Lanthanoid contraction because:", "difficulty": "hard", "options": {"A": "5f orbitals have poorer shielding than 4f", "B": "5f is smaller", "C": "Actinoids are heavier", "D": "Nuclear charge is very high"}, "answer": "A"},
    {"question": "Transition metals and their ions are generally paramagnetic due to:", "difficulty": "hard", "options": {"A": "Presence of unpaired electrons in d-orbitals", "B": "High density", "C": "Metallic bonding", "D": "Small size"}, "answer": "A"},
    {"question": "When KMnO4 is treated with Na2S2O3 in neutral/faintly alkaline medium, it forms:", "difficulty": "hard", "options": {"A": "SO4 2-", "B": "S", "C": "SO3 2-", "D": "H2S"}, "answer": "A"},
    {"question": "The structure of Cr2O7 2- ion consists of:", "difficulty": "hard", "options": {"A": "Two tetrahedra sharing one oxygen", "B": "Planar structure", "C": "Octahedral", "D": "Ring"}, "answer": "A"},
    {"question": "Which ion has the highest magnetic moment?", "difficulty": "hard", "options": {"A": "Fe3+", "B": "Cr3+", "C": "Mn2+", "D": "Co2+"}, "answer": "C (both Fe3+ and Mn2+ have 5 unpaired)"},
    {"question": "The chemistry of Actinoids is more complex than Lanthanoids due to:", "difficulty": "hard", "options": {"A": "Wider range of oxidation states", "B": "Radioactivity", "C": "Smaller size", "D": "Less availability"}, "answer": "A"},
    {"question": "Which transition metal ion is used in making powerful magnets?", "difficulty": "hard", "options": {"A": "Co", "B": "Ni", "C": "Fe", "D": "Cu"}, "answer": "A"},
    {"question": "Copper sulfate reacts with excess KCN to give:", "difficulty": "hard", "options": {"A": "K3[Cu(CN)4] + cyanogen gas", "B": "CuCN", "C": "K[Cu(CN)2]", "D": "No reaction"}, "answer": "A"},
    {"question": "The geometry of Permanganate ion is:", "difficulty": "hard", "options": {"A": "Tetrahedral", "B": "Square planar", "C": "Pyramidal", "D": "Octahedral"}, "answer": "A"},
    {"question": "Zinc, Cadmium and Mercury are not considered typical transition elements because:", "difficulty": "hard", "options": {"A": "They have completely filled d-orbitals in ground and common ox. states", "B": "They are soft", "C": "They have low MP", "D": "They are in group 12"}, "answer": "A"}
]

metallurgy_qs = [
    {"question": "The method of Froth Flotation is used for concentration of:", "difficulty": "hard", "options": {"A": "Sulfide ores", "B": "Oxide ores", "C": "Carbonate ores", "D": "Halide ores"}, "answer": "A"},
    {"question": "In Froth Flotation, the 'depressant' used to separate PbS from ZnS is:", "difficulty": "hard", "options": {"A": "NaCN", "B": "Pine oil", "C": "Xanthates", "D": "Water"}, "answer": "A"},
    {"question": "Calcination is the process of heating the ore:", "difficulty": "hard", "options": {"A": "In absence of air or limited supply", "B": "In excess air", "C": "With coke", "D": "In water"}, "answer": "A"},
    {"question": "Roasting is general used for:", "difficulty": "hard", "options": {"A": "Sulfide ores", "B": "Oxide ores", "C": "Chlorides", "D": "Silicates"}, "answer": "A"},
    {"question": "The flux used to remove Silica (acidic impurity) is:", "difficulty": "hard", "options": {"A": "CaO (Basic flux)", "B": "P2O5", "C": "Coke", "D": "Clay"}, "answer": "A"},
    {"question": "Which metal is extracted by Hydrometallurgy?", "difficulty": "hard", "options": {"A": "Silver (Ag)", "B": "Iron (Fe)", "C": "Sodium (Na)", "D": "Aluminum (Al)"}, "answer": "A"},
    {"question": "The Mac-Arthur Forest process is used for extraction of:", "difficulty": "hard", "options": {"A": "Gold and Silver", "B": "Copper", "C": "Zinc", "D": "Lead"}, "answer": "A"},
    {"question": "Self-reduction is observed in extraction of:", "difficulty": "hard", "options": {"A": "Hg, Cu, Pb from their sulfide ores", "B": "Al", "C": "Fe", "D": "Na"}, "answer": "A"},
    {"question": "In the extraction of Aluminum, the role of Cryolite (Na3AlF6) is:", "difficulty": "hard", "options": {"A": "To lower MP and increase conductivity", "B": "As reducing agent", "C": "As oxidizing agent", "D": "Filter"}, "answer": "A"},
    {"question": "The principal ore of Iron is:", "difficulty": "hard", "options": {"A": "Haematite (Fe2O3)", "B": "Magnetite", "C": "Siderite", "D": "Iron pyrites"}, "answer": "A"},
    {"question": "Mond's process is used for refining of:", "difficulty": "hard", "options": {"A": "Nickel", "B": "Zirconium", "C": "Titanium", "D": "Copper"}, "answer": "A"},
    {"question": "Van Arkel method is used for refining:", "difficulty": "hard", "options": {"A": "Zr and Ti", "B": "Ni", "C": "Cu", "D": "Sn"}, "answer": "A"},
    {"question": "Zone refining is based on:", "difficulty": "hard", "options": {"A": "Impurities are more soluble in melt than in solid metal", "B": "Difference in BP", "C": "Adsorption", "D": "Density"}, "answer": "A"},
    {"question": "Blister copper is obtained from Bessemer converter. Its blister appearance is due to evolution of:", "difficulty": "hard", "options": {"A": "SO2", "B": "CO2", "C": "H2", "D": "O2"}, "answer": "A"},
    {"question": "Poling method is used for refining ______.", "difficulty": "hard", "options": {"A": "Copper (containing Cu2O)", "B": "Iron", "C": "Aluminum", "D": "Zinc"}, "answer": "A"},
    {"question": "The Ellingham diagram represents change in:", "difficulty": "hard", "options": {"A": "Gibbs free energy with temperature", "B": "Enthalpy", "C": "Entropy", "D": "Cell potential"}, "answer": "A"},
    {"question": "Which of the following is a carbonate ore?", "difficulty": "hard", "options": {"A": "Siderite", "B": "Cinnabar", "C": "Galena", "D": "Bauxite"}, "answer": "A"},
    {"question": "Copper matte consists of:", "difficulty": "hard", "options": {"A": "Cu2S and FeS", "B": "Cu2O and FeO", "C": "Cu and Fe", "D": "SiO2"}, "answer": "A"},
    {"question": "Bauxite is concentrated by:", "difficulty": "hard", "options": {"A": "Leaching (Baeyer's process)", "B": "Magnetic separation", "C": "Froth flotation", "D": "Gravity separation"}, "answer": "A"},
    {"question": "Iron obtained from Blast furnace is:", "difficulty": "hard", "options": {"A": "Pig iron", "B": "Cast iron", "C": "Wrought iron", "D": "Steel"}, "answer": "A"},
    {"question": "Wrought iron is the ______ form of iron.", "difficulty": "hard", "options": {"A": "Purest commercial", "B": "Most impure", "C": "Highest carbon", "D": "Alloy"}, "answer": "A"},
    {"question": "Electrolytic refining of Copper uses which of the following as anode?", "difficulty": "hard", "options": {"A": "Impure Copper", "B": "Pure Copper", "C": "Graphite", "D": "Steel"}, "answer": "A"},
    {"question": "Anode mud in electrolytic refining of Cu contains:", "difficulty": "hard", "options": {"A": "Ag, Au, Pt", "B": "Fe, Zn", "C": "Al, Mg", "D": "Na, K"}, "answer": "A"},
    {"question": "The main reducing agent in the upper part of Blast furnace is:", "difficulty": "hard", "options": {"A": "CO", "B": "C (Coke)", "C": "H2", "D": "CO2"}, "answer": "A"}
]

p_block_qs = [
    {"question": "Which of the following shows the highest tendency for catenation?", "difficulty": "hard", "options": {"A": "Carbon", "B": "Silicon", "C": "Phosphorus", "D": "Nitrogen"}, "answer": "A"},
    {"question": "White phosphorus is more reactive than red phosphorus because it:", "difficulty": "hard", "options": {"A": "Contains P4 tetrahedra with angular strain", "B": "Is a polymer", "C": "Is less soluble", "D": "Is non-toxic"}, "answer": "A"},
    {"question": "Reaction of excess Chlorine with Ammonia gives:", "difficulty": "hard", "options": {"A": "NCl3 + HCl", "B": "NH4Cl + N2", "C": "NH4Cl", "D": "N2"}, "answer": "A"},
    {"question": "The basicity of H3PO3 is:", "difficulty": "hard", "options": {"A": "2", "B": "3", "C": "1", "D": "4"}, "answer": "A"},
    {"question": "Which of the following is a neutral oxide?", "difficulty": "hard", "options": {"A": "N2O, NO, CO", "B": "N2O3", "C": "P2O5", "D": "NO2"}, "answer": "A"},
    {"question": "The brown ring test for NO3- is due to formation of:", "difficulty": "hard", "options": {"A": "[Fe(H2O)5(NO)]2+", "B": "[Fe(CN)5(NO)]2-", "C": "Fe(NO3)2", "D": "Fe2(SO4)3"}, "answer": "A"},
    {"question": "Phosphine (PH3) is prepared by reaction of White Phosphorus with:", "difficulty": "hard", "options": {"A": "NaOH solution", "B": "Dilute HCl", "C": "Water", "D": "Liquid NH3"}, "answer": "A"},
    {"question": "The boiling point of NH3 is higher than PH3 due to:", "difficulty": "hard", "options": {"A": "Hydrogen bonding", "B": "Van der Waals", "C": "Large size", "D": "Dipole-dipole"}, "answer": "A"},
    {"question": "Which of the following is used in smoke screens?", "difficulty": "hard", "options": {"A": "PH3 (Phosphine)", "B": "NH3", "C": "CO2", "D": "N2"}, "answer": "A"},
    {"question": "Allotropic form of Oxygen is:", "difficulty": "hard", "options": {"A": "Ozone (O3)", "B": "Diamond", "C": "Graphite", "D": "Fullerene"}, "answer": "A"},
    {"question": "Ozone reacts with KI and starch to give ______ color.", "difficulty": "hard", "options": {"A": "Blue", "B": "Red", "C": "Yellow", "D": "Green"}, "answer": "A"},
    {"question": "The hybridization of Oxygen in H2O is ______ and its shape is ______.", "difficulty": "hard", "options": {"A": "sp3, Bent", "B": "sp2, Linear", "C": "sp3, Tetrahedral", "D": "sp, Bent"}, "answer": "A"},
    {"question": "Contact process is used for manufacture of:", "difficulty": "hard", "options": {"A": "H2SO4", "B": "HNO3", "C": "NH3", "D": "HCl"}, "answer": "A"},
    {"question": "In the contact process, the catalyst used is:", "difficulty": "hard", "options": {"A": "V2O5", "B": "Fe", "C": "Pt/Rh", "D": "Ni"}, "answer": "A"},
    {"question": "The chemical formula of Marshall's acid is:", "difficulty": "hard", "options": {"A": "H2S2O8", "B": "H2S2O7", "C": "H2SO5 (Caro's acid)", "D": "H2S2O3"}, "answer": "A"},
    {"question": "The correct order of bond dissociation enthalpy of halogens is:", "difficulty": "hard", "options": {"A": "Cl2 > Br2 > F2 > I2", "B": "F2 > Cl2 > Br2 > I2", "C": "Cl2 > F2 > Br2 > I2", "D": "I2 > Br2 > Cl2 > F2"}, "answer": "A"},
    {"question": "Chlorine bleaches the organic matter by reaching ______.", "difficulty": "hard", "options": {"A": "Oxidation (nascent oxygen)", "B": "Reduction", "C": "Substitution", "D": "Hydrolysis"}, "answer": "A"},
    {"question": "Interhalogen compound ICl is ______ than Iodine.", "difficulty": "hard", "options": {"A": "More reactive", "B": "Less reactive", "C": "Equally reactive", "D": "Inert"}, "answer": "A"},
    {"question": "The noble gas used in magnetic resonance imaging (MRI) is:", "difficulty": "hard", "options": {"A": "Helium", "B": "Neon", "C": "Argon", "D": "Xenon"}, "answer": "A"},
    {"question": "Which of the following compounds has a square pyramidal shape?", "difficulty": "hard", "options": {"A": "XeOF4", "B": "XeF4", "C": "XeF6", "D": "XeO3"}, "answer": "A"},
    {"question": "Hydrolysis of XeF6 gives ______ as final product.", "difficulty": "hard", "options": {"A": "XeO3", "B": "XeO2", "C": "Xe", "D": "XeF2"}, "answer": "A"},
    {"question": "The hybridization of Xe in XeF2 is:", "difficulty": "hard", "options": {"A": "sp3d", "B": "sp3d2", "C": "sp3", "D": "sp3d3"}, "answer": "A"},
    {"question": "Interhalogen compounds like IF7 show geometry of:", "difficulty": "hard", "options": {"A": "Pentagonal bipyramidal", "B": "Octahedral", "C": "Square planar", "D": "Tetrahedral"}, "answer": "A"},
    {"question": "Which noble gas is used in advertising glow tubes?", "difficulty": "hard", "options": {"A": "Neon", "B": "Argon", "C": "Helium", "D": "Radon"}, "answer": "A"},
    {"question": "The bleaching action of SO2 is temporary because it is due to:", "difficulty": "hard", "options": {"A": "Reduction", "B": "Oxidation", "C": "Acidic nature", "D": "Presence of S"}, "answer": "A"},
    {"question": "Fluorine is the most powerful oxidizing agent because of:", "difficulty": "hard", "options": {"A": "Low bond dissociation energy and high hydration energy", "B": "High atomic size", "C": "Low IE", "D": "Covalent nature"}, "answer": "A"},
    {"question": "The oxyacid of Phosphorus that is monobasic and strong reducing agent:", "difficulty": "hard", "options": {"A": "H3PO2 (Hypophosphorous acid)", "B": "H3PO3", "C": "H3PO4", "D": "H4P2O7"}, "answer": "A"},
    {"question": "Lead(II) compounds are more stable than Lead(IV) compounds due to:", "difficulty": "hard", "options": {"A": "Inert pair effect", "B": "Resonance", "C": "Octet rule", "D": "Small size"}, "answer": "A"},
    {"question": "The number of P-O-P bonds in P4O10 is:", "difficulty": "hard", "options": {"A": "6", "B": "4", "C": "10", "D": "8"}, "answer": "A"},
    {"question": "Chlorine reacts with hot and concentrated NaOH to give:", "difficulty": "hard", "options": {"A": "NaCl + NaClO3", "B": "NaCl + NaOCl", "C": "NaClO2", "D": "No reaction"}, "answer": "A"},
    {"question": "Which of the following is isoelectronic with ClO2?", "difficulty": "hard", "options": {"A": "NO2", "B": "CO2", "C": "SO2", "D": "O3"}, "answer": "A"},
    {"question": "The gas that gives white fumes with HCl is:", "difficulty": "hard", "options": {"A": "NH3", "B": "N2", "C": "Cl2", "D": "H2"}, "answer": "A"},
    {"question": "Solid PCl5 exists as ionic species:", "difficulty": "hard", "options": {"A": "[PCl4]+ [PCl6]-", "B": "[PCl3]+ [PCl2]-", "C": "PCl2+ PCl3-", "D": "None"}, "answer": "A"},
    {"question": "Which of the following has 'banana bonds'?", "difficulty": "hard", "options": {"A": "B2H6", "B": "PH3", "C": "NH3", "D": "CH4"}, "answer": "A"},
    {"question": "Fluorine reacts with ice to give:", "difficulty": "hard", "options": {"A": "HF + HOF", "B": "F2O", "C": "O2", "D": "No reaction"}, "answer": "A"},
    {"question": "The oxidizing power of oxyacids of halogens follows the order:", "difficulty": "hard", "options": {"A": "HClO > HClO2 > HClO3 > HClO4", "B": "HClO4 > HClO3 > HClO2 > HClO", "C": "HClO4 > HClO > HClO3 > HClO2", "D": "All equal"}, "answer": "A"},
    {"question": "Sulfur molecule (S8) at 1000 K exists as:", "difficulty": "hard", "options": {"A": "S2 (paramagnetic like O2)", "B": "S8 (crown)", "C": "S8 (chair)", "D": "S"}, "answer": "A"},
    {"question": "Xenon hexafluoride (XeF6) is a ______ compound.", "difficulty": "hard", "options": {"A": "Distorted octahedral", "B": "Perfect octahedral", "C": "Planar", "D": "Linear"}, "answer": "A"},
    {"question": "Which gas is used in beacon lights for air navigation?", "difficulty": "hard", "options": {"A": "Neon", "B": "Argon", "C": "Helium", "D": "Krypton"}, "answer": "A"},
    {"question": "The order of boiling point of noble gases is:", "difficulty": "hard", "options": {"A": "He < Ne < Ar < Kr < Xe < Rn", "B": "Rn < Xe < Kr < Ar < Ne < He", "C": "He < Ar < Ne < Kr", "D": "All same"}, "answer": "A"}
]

add_questions('biomolecules.json', biomolecules_qs)
add_questions('coordination_compounds.json', coordination_compounds_qs)
add_questions('d_f_block.json', d_f_block_qs)
add_questions('metallurgy.json', metallurgy_qs)
add_questions('p_block_elements.json', p_block_qs)
