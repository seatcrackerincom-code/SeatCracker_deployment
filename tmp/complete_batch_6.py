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

# Batch 6 Data
periodic_table_qs = [
    {"question": "Which of the following elements has the highest electron gain enthalpy (negative)?", "difficulty": "hard", "options": {"A": "Chlorine (Cl)", "B": "Fluorine (F)", "C": "Oxygen", "D": "Nitrogen"}, "answer": "A"},
    {"question": "Electronegativity ______ across a period and ______ down a group.", "difficulty": "hard", "options": {"A": "Increases, Decreases", "B": "Decreases, Increases", "C": "Increases, Increases", "D": "Decreases, Decreases"}, "answer": "A"},
    {"question": "The first ionization enthalpy of Nitrogen is higher than Oxygen because:", "difficulty": "hard", "options": {"A": "Nitrogen has half-filled p-orbital", "B": "Oxygen is more electronegative", "C": "Size of Nitrogen is smaller", "D": "Nitrogen is a gas"}, "answer": "A"},
    {"question": "Which of the following species is largest in size?", "difficulty": "hard", "options": {"A": "O2-", "B": "F-", "C": "Na+", "D": "Mg2+"}, "answer": "A"},
    {"question": "The diagonal relationship between Beryllium and Aluminum is due to similar:", "difficulty": "hard", "options": {"A": "Ionic charge/radius ratio", "B": "Atomic number", "C": "Valence electrons", "D": "Boiling point"}, "answer": "A"},
    {"question": "Elements with atomic numbers 19, 37, 55 belong to which group?", "difficulty": "hard", "options": {"A": "Group 1 (Alkali metals)", "B": "Group 2", "C": "Group 17", "D": "Group 18"}, "answer": "A"},
    {"question": "The most metallic element among the following is:", "difficulty": "hard", "options": {"A": "Francium (Fr)", "B": "Cesium", "C": "Sodium", "D": "Potassium"}, "answer": "A"},
    {"question": "Which block of elements contains only metals?", "difficulty": "hard", "options": {"A": "s, d, f blocks", "B": "p block", "C": "d block only", "D": "f block only"}, "answer": "A"},
    {"question": "Correct order of decreasing atomic radius:", "difficulty": "hard", "options": {"A": "Na > Mg > Al > Si", "B": "Si > Al > Mg > Na", "C": "Al > Si > Na > Mg", "D": "Mg > Na > Al > Si"}, "answer": "A"},
    {"question": "Modern Periodic Law states that properties are a periodic function of:", "difficulty": "hard", "options": {"A": "Atomic number", "B": "Atomic mass", "C": "Density", "D": "Electron shell"}, "answer": "A"},
    {"question": "Transuranic elements (Z > 92) belong to which series?", "difficulty": "hard", "options": {"A": "Actinoids", "B": "Lanthanoids", "C": "Transition metals", "D": "Alkaline earth"}, "answer": "A"},
    {"question": "Identify the element with noble gas configuration [Ar] 3d10 4s2 4p5:", "difficulty": "hard", "options": {"A": "Bromine (Br)", "B": "Iodine", "C": "Chlorine", "D": "Selenium"}, "answer": "A"},
    {"question": "Metalloids are located in which block?", "difficulty": "hard", "options": {"A": "p-block", "B": "s-block", "C": "d-block", "D": "f-block"}, "answer": "A"},
    {"question": "Effective nuclear charge (Zeff) ______ across a period.", "difficulty": "hard", "options": {"A": "Increases", "B": "Decreases", "C": "Stays constant", "D": "First increases then decreases"}, "answer": "A"},
    {"question": "Which of the following is most acidic?", "difficulty": "hard", "options": {"A": "P2O5", "B": "Na2O", "C": "MgO", "D": "Al2O3"}, "answer": "A"},
    {"question": "Elements in the same group have the same:", "difficulty": "hard", "options": {"A": "Number of valence electrons", "B": "Atomic mass", "C": "Atomic number", "D": "Number of shells"}, "answer": "A"},
    {"question": "The element with Z=114 belongs to which group and period?", "difficulty": "hard", "options": {"A": "Group 14, Period 7", "B": "Group 12, Period 6", "C": "Group 18, Period 7", "D": "Group 10, Period 5"}, "answer": "A"},
    {"question": "Lanthanoid contraction is observed in elements of ______ series.", "difficulty": "hard", "options": {"A": "4f", "B": "5f", "C": "3d", "D": "5d"}, "answer": "A"},
    {"question": "Valency of s-block and p-block elements is related to number of ______ electrons.", "difficulty": "hard", "options": {"A": "Valence", "B": "Inner", "C": "d", "D": "All"}, "answer": "A"},
    {"question": "Which element has highest second ionization enthalpy?", "difficulty": "hard", "options": {"A": "Lithium", "B": "Beryllium", "C": "Sodium", "D": "Magnesium"}, "answer": "A"},
    {"question": "Electronic configuration of Gadolinium (Z=64) is:", "difficulty": "hard", "options": {"A": "[Xe] 4f7 5d1 6s2", "B": "[Xe] 4f8 6s2", "C": "[Xe] 4f5 5d1 6s2", "D": "None"}, "answer": "A"},
    {"question": "Isoelectronic species order of size: K+, Cl-, S2-, Ca2+", "difficulty": "hard", "options": {"A": "S2- > Cl- > K+ > Ca2+", "B": "Ca2+ > K+ > Cl- > S2-", "C": "Cl- > S2- > K+ > Ca2+", "D": "K+ > Ca2+ > Cl- > S2-"}, "answer": "A"},
    {"question": "General electronic configuration of d-block elements is:", "difficulty": "hard", "options": {"A": "(n-1)d(1-10) ns(1-2)", "B": "nd(1-10) ns(2)", "C": "(n-1)d(10) ns(2)", "D": "(n-1)d(0) ns(1)"}, "answer": "A"},
    {"question": "Oxidation state +1 is most stable for which element in Group 13?", "difficulty": "hard", "options": {"A": "Thallium (Tl) due to inert pair effect", "B": "Boron", "C": "Aluminum", "D": "Gallium"}, "answer": "A"},
    {"question": "Group 16 elements are also known as:", "difficulty": "hard", "options": {"A": "Chalcogens", "B": "Pnictogens", "C": "Halogens", "D": "Noble gases"}, "answer": "A"},
    {"question": "The maximum number of elements possible in the 6th period is:", "difficulty": "hard", "options": {"A": "32", "B": "18", "C": "8", "D": "50"}, "answer": "A"},
    {"question": "Which of the following is not transition metal?", "difficulty": "hard", "options": {"A": "Zn", "B": "Fe", "C": "Cu", "D": "Ag"}, "answer": "A"},
    {"question": "Which alkali metal shows unusual properties compared to others in its group?", "difficulty": "hard", "options": {"A": "Lithium", "B": "Sodium", "C": "Potassium", "D": "Cesium"}, "answer": "A"}
]

chemical_bonding_qs = [
    {"question": "The geometry of NH3 molecule is ______ and hybridization of Nitrogen is ______.", "difficulty": "hard", "options": {"A": "Pyramidal, sp3", "B": "Tetrahedral, sp3", "C": "Bent, sp2", "D": "Planar, sp2"}, "answer": "A"},
    {"question": "According to MOT, what is the bond order for O2 molecule?", "difficulty": "hard", "options": {"A": "2", "B": "1.5", "C": "2.5", "D": "1"}, "answer": "A"},
    {"question": "Which of the following is paramagnetic?", "difficulty": "hard", "options": {"A": "O2", "B": "N2", "C": "F2", "D": "CO"}, "answer": "A"},
    {"question": "Hybridization of Xenon in XeF2 is:", "difficulty": "hard", "options": {"A": "sp3d", "B": "sp3", "C": "sp3d2", "D": "dsp2"}, "answer": "A"},
    {"question": "The dipole moment of BF3 is:", "difficulty": "hard", "options": {"A": "Zero", "B": "Positive", "C": "Negative", "D": "Maximum"}, "answer": "A"},
    {"question": "Which bond is most polar?", "difficulty": "hard", "options": {"A": "H-F", "B": "H-Cl", "C": "H-Br", "D": "H-I"}, "answer": "A"},
    {"question": "Hydrogen bonding is strongest in:", "difficulty": "hard", "options": {"A": "H2O", "B": "NH3", "C": "HF", "D": "H2S"}, "answer": "C (highest per bond)"},
    {"question": "Bond angle in CH4 is approx:", "difficulty": "hard", "options": {"A": "109.5\u00b0", "B": "120\u00b0", "C": "90\u00b0", "D": "180\u00b0"}, "answer": "A"},
    {"question": "Sigma bond is formed by ______ overlapping of orbitals.", "difficulty": "hard", "options": {"A": "Head-on (Axial)", "B": "Sideways (Lateral)", "C": "Random", "D": "No overlap"}, "answer": "A"},
    {"question": "Which of the following consists of two pi bonds only based on MOT?", "difficulty": "hard", "options": {"A": "C2", "B": "O2", "C": "N2", "D": "B2"}, "answer": "A"},
    {"question": "The shape of PCl5 is ______ and it has ______ hybrid orbitals.", "difficulty": "hard", "options": {"A": "Trigonal bipyramidal, sp3d", "B": "Octahedral, sp3d2", "C": "Tetrahedral, sp3", "D": "Square planar, dsp2"}, "answer": "A"},
    {"question": "Fajans' rule predicts high covalent character when:", "difficulty": "hard", "options": {"A": "Cation size is small and anion size is large", "B": "Ionic bond is formed", "C": "Large cation/Small anion", "D": "Zero charge"}, "answer": "A"},
    {"question": "Lattice energy ______ as ionic size decreases and charge increases.", "difficulty": "hard", "options": {"A": "Increases", "B": "Decreases", "C": "Stays same", "D": "Zeros"}, "answer": "A"},
    {"question": "H2O has higher boiling point than H2S due to:", "difficulty": "hard", "options": {"A": "Hydrogen bonding", "B": "Molecular weight", "C": "van der Waals", "D": "Viscosity"}, "answer": "A"},
    {"question": "Hybridization in Carbon of C2H2 (Acetylene) is:", "difficulty": "hard", "options": {"A": "sp", "B": "sp2", "C": "sp3", "D": "dsp2"}, "answer": "A"},
    {"question": "Number of lone pairs in XeF4 is:", "difficulty": "hard", "options": {"A": "2", "B": "0", "C": "1", "D": "3"}, "answer": "A"},
    {"question": "Isoelectronic species have the same ______.", "difficulty": "hard", "options": {"A": "Number of electrons", "B": "Mass", "C": "Protons", "D": "Size"}, "answer": "A"},
    {"question": "Formal charge on Nitrogen in NH4+ is:", "difficulty": "hard", "options": {"A": "+1", "B": "0", "C": "-1", "D": "+4"}, "answer": "A"},
    {"question": "Which of the following is an expanded octet compound?", "difficulty": "hard", "options": {"A": "SF6", "B": "CO2", "C": "CH4", "D": "H2O"}, "answer": "A"},
    {"question": "Percentage of s-character in sp2 hybrid orbital is:", "difficulty": "hard", "options": {"A": "33.3%", "B": "50%", "C": "25%", "D": "100%"}, "answer": "A"},
    {"question": "The overlapping of two p-orbitals sideways gives ______ bond.", "difficulty": "hard", "options": {"A": "pi", "B": "sigma", "C": "delta", "D": "Ionic"}, "answer": "A"},
    {"question": "Bond length is ______ related to bond order.", "difficulty": "hard", "options": {"A": "Inversely", "B": "Directly", "C": "Linearly", "D": "No relation"}, "answer": "A"},
    {"question": "Resonance occurs only in molecules with:", "difficulty": "hard", "options": {"A": "Delocalized pi-electrons", "B": "Only sigma bonds", "C": "Single atoms", "D": "Metals"}, "answer": "A"}
]

hydrogen_qs = [
    {"question": "The fuel value (calorific value) of dihydrogen is ______ than coal/petrol.", "difficulty": "hard", "options": {"A": "Higher", "B": "Lower", "C": "Same", "D": "Zero"}, "answer": "A"},
    {"question": "Isotope of hydrogen which is radioactive is:", "difficulty": "hard", "options": {"A": "Tritium", "B": "Deuterium", "C": "Protium", "D": "Hydrogen-4"}, "answer": "A"},
    {"question": "Temporary hardness of water can be removed by:", "difficulty": "hard", "options": {"A": "Boiling or Clark's process", "B": "Calgon's process", "C": "Ion-exchange", "D": "Adding NaCl"}, "answer": "A"},
    {"question": "Hydrogen peroxide (H2O2) has a ______ structure.", "difficulty": "hard", "options": {"A": "Non-planar (Open book type)", "B": "Planar", "C": "Linear", "D": "Tetrahedral"}, "answer": "A"},
    {"question": "Which hydride is ionic?", "difficulty": "hard", "options": {"A": "NaH", "B": "NH3", "C": "H2O", "D": "B2H6"}, "answer": "A"},
    {"question": "Water gas is a mixture of:", "difficulty": "hard", "options": {"A": "CO + H2", "B": "CO2 + H2", "C": "CH4 + H2O", "D": "Producer gas"}, "answer": "A"},
    {"question": "Syn-gas refers to:", "difficulty": "hard", "options": {"A": "CO + H2", "B": "CH4", "C": "N2 + H2", "D": "O2"}, "answer": "A"},
    {"question": "Calgon is used for removing permanent hardness. Its formula is:", "difficulty": "hard", "options": {"A": "Na6P6O18", "B": "Na2P2O7", "C": "NaHPO4", "D": "MgSO4"}, "answer": "A"},
    {"question": "Heavy water (D2O) is used in nuclear reactors as:", "difficulty": "hard", "options": {"A": "Moderator", "B": "Fuel", "C": "Coolant only", "D": "Absorber"}, "answer": "A"},
    {"question": "Action of light on H2O2 results in decomposition to:", "difficulty": "hard", "options": {"A": "H2O + O2", "B": "H2 + O2", "C": "Ozone", "D": "No reaction"}, "answer": "A"},
    {"question": "Saline hydrides react with water to give:", "difficulty": "hard", "options": {"A": "H2 gas and metal hydroxide", "B": "Metal only", "C": "Hydrogen peroxide", "D": "Oxygen"}, "answer": "A"},
    {"question": "Hydrides of transition metals (Group 3, 4, 5) are:", "difficulty": "hard", "options": {"A": "Metallic or Interstitial hydrides", "B": "Ionic", "C": "Covalent", "D": "Molecular"}, "answer": "A"},
    {"question": "Volume strength of 1.5 M H2O2 is approx:", "difficulty": "hard", "options": {"A": "16.8", "B": "10", "C": "20", "D": "30"}, "answer": "A (11.2 * M)"},
    {"question": "Permutit is another name for:", "difficulty": "hard", "options": {"A": "Sodium aluminum silicate (Zeolite)", "B": "Calgon", "C": "Lime", "D": "Potash Alum"}, "answer": "A"},
    {"question": "Reaction of H2O2 with acidified KMnO4 gives:", "difficulty": "hard", "options": {"A": "Mn2+ and O2", "B": "MnO2", "C": "K2MnO4", "D": "No change"}, "answer": "A"},
    {"question": "Dihydrogen can be prepared by electrolysis of acidified water using ______ electrodes.", "difficulty": "hard", "options": {"A": "Platinum", "B": "Copper", "C": "Iron", "D": "Graphite"}, "answer": "A"},
    {"question": "The dipole moment of D2O is ______ than H2O.", "difficulty": "hard", "options": {"A": "Slightly less", "B": "Slightly more", "C": "Same", "D": "Zero"}, "answer": "A"},
    {"question": "Formation of polyatomic hydrides like B2H6 etc. is a property of ______ block elements.", "difficulty": "hard", "options": {"A": "p-block", "B": "s-block", "C": "d-block", "D": "f-block"}, "answer": "A"},
    {"question": "Hydrogen burns in air with a ______ flame.", "difficulty": "hard", "options": {"A": "Pale blue", "B": "Yellow", "C": "Green", "D": "Sooty"}, "answer": "A"},
    {"question": "The boiling point of heavy water (D2O) is ______ K.", "difficulty": "hard", "options": {"A": "374.4 (Higher than H2O)", "B": "373", "C": "100", "D": "273"}, "answer": "A"},
    {"question": "Proportion of Tritium in nature is:", "difficulty": "hard", "options": {"A": "Extremely low (Tracing amount)", "B": "99.9%", "C": "0.1%", "D": "50%"}, "answer": "A"},
    {"question": "Which catalyst is used in Haber's process for manufacture of Ammonia?", "difficulty": "hard", "options": {"A": "Iron (Fe)", "B": "Platinum", "C": "Nickel", "D": "V2O5"}, "answer": "A"},
    {"question": "Which of the following is electron-precise hydride?", "difficulty": "hard", "options": {"A": "CH4", "B": "B2H6", "C": "NH3", "D": "H2O"}, "answer": "A"},
    {"question": "Dihydrogen is used in the manufacture of ______ from vegetable oils.", "difficulty": "hard", "options": {"A": "Vanaspati ghee", "B": "Soap", "C": "Detergent", "D": "Paint"}, "answer": "A"},
    {"question": "Hydrogenation refers to ______ of unsaturated compounds.", "difficulty": "hard", "options": {"A": "Addition of H2", "B": "Removal of H2", "C": "Oxidation", "D": "Hydrolysis"}, "answer": "A"}
]

goc_qs = [
    {"question": "Which effect is permanent?", "difficulty": "hard", "options": {"A": "Inductive and Resonance", "B": "Electromeric", "C": "Inductomeric", "D": "Catalytic"}, "answer": "A"},
    {"question": "Carbocations have ______ hybridization and ______ geometry.", "difficulty": "hard", "options": {"A": "sp2, Trigonal planar", "B": "sp3, Tetrahedral", "C": "sp, Linear", "D": "dsp2, Square planar"}, "answer": "A"},
    {"question": "Stability of free radicals follows the order:", "difficulty": "hard", "options": {"A": "3 > 2 > 1 > Methyl", "B": "Methyl > 1 > 2 > 3", "C": "2 > 3 > 1", "D": "All equal"}, "answer": "A"},
    {"question": "Nucleophiles are ______.", "difficulty": "hard", "options": {"A": "Electron rich species (Lewis bases)", "B": "Electron deficient", "C": "Positively charged only", "D": "Inert"}, "answer": "A"},
    {"question": "Hyperconjugation involves delocalization of ______ electrons.", "difficulty": "hard", "options": {"A": "sigma-electrons of C-H bond", "B": "lone pair", "C": "pi-electrons", "D": "None"}, "answer": "A"},
    {"question": "Mesomeric effect involves delocalization of ______ electrons.", "difficulty": "hard", "options": {"A": "pi-electrons", "B": "sigma-electrons", "C": "s-electrons", "D": "All"}, "answer": "A"},
    {"question": "Which of the following is the strongest base?", "difficulty": "hard", "options": {"A": "CH3NH2", "B": "NH3", "C": "C6H5NH2", "D": "H2O"}, "answer": "A"},
    {"question": "Enantiomers have identical physical properties except:", "difficulty": "hard", "options": {"A": "Direction of optical rotation", "B": "Boiling point", "C": "Solubility", "D": "Density"}, "answer": "A"},
    {"question": "Geometrical isomerism is shown by compounds with:", "difficulty": "hard", "options": {"A": "Restricted rotation (Double bond/cyclic)", "B": "Chiral center", "C": "Plane of symmetry", "D": "No bonds"}, "answer": "A"},
    {"question": "A racemic mixture is ______.", "difficulty": "hard", "options": {"A": "Optically inactive due to external compensation", "B": "Inactive due to internal compensation (Meso)", "C": "Highly active", "D": "Pure isomer"}, "answer": "A"},
    {"question": "Function of anhydrous AlCl3 in Friedel-Crafts reaction is:", "difficulty": "hard", "options": {"A": "Generation of electrophile", "B": "Oxidation", "C": "Reduction", "D": "Solvent"}, "answer": "A"},
    {"question": "Structure of 2,2-Dimethylpropane (Neopentane) has how many secondary carbons?", "difficulty": "hard", "options": {"A": "0", "B": "1", "C": "4", "D": "2"}, "answer": "A"},
    {"question": "Correct order of inductive effect (+I) for alkyl groups:", "difficulty": "hard", "options": {"A": "t-Butyl > Isopropyl > Ethyl > Methyl", "B": "Methyl > Ethyl > Isopropyl > t-Butyl", "C": "All same", "D": "Alternating"}, "answer": "A"},
    {"question": "Paper chromatography is an example of:", "difficulty": "hard", "options": {"A": "Partition chromatography", "B": "Adsorption chromatography", "C": "Size exclusion", "D": "Ion exchange"}, "answer": "A"},
    {"question": "Lassaigne's test is used for detection of:", "difficulty": "hard", "options": {"A": "N, S, Halogens", "B": "Carbon", "C": "Oxygen", "D": "Metals"}, "answer": "A"},
    {"question": "Purification of organic solids is best done by:", "difficulty": "hard", "options": {"A": "Crystallization", "B": "Distillation", "C": "Sublimation", "D": "Filtration"}, "answer": "A"},
    {"question": "Which of the following is most stable?", "difficulty": "hard", "options": {"A": "Triphenylmethyl carbocation", "B": "Benzyl carbocation", "C": "Ethyl carbocation", "D": "Isopropyl carbocation"}, "answer": "A"},
    {"question": "The number of hyperconjugative structures in Propene is:", "difficulty": "hard", "options": {"A": "3", "B": "2", "C": "1", "D": "6"}, "answer": "A"},
    {"question": "Which of the following shows +M effect?", "difficulty": "hard", "options": {"A": "-OH", "B": "-NO2", "C": "-CN", "D": "-COOH"}, "answer": "A"},
    {"question": "Homolysis of C-C bond produces:", "difficulty": "hard", "options": {"A": "Free radicals", "B": "Ions", "C": "Stable molecules", "D": "Neutral atoms"}, "answer": "A"},
    {"question": "Reagent which attacks electron-deficient centers is:", "difficulty": "hard", "options": {"A": "Nucleophile", "B": "Electrophile", "C": "Free radical", "D": "Catalyst"}, "answer": "A"},
    {"question": "Tautomerism is a special case of ______ isomerism.", "difficulty": "hard", "options": {"A": "Functional", "B": "Position", "C": "Chain", "D": "Stereo"}, "answer": "A"},
    {"question": "Kjeldahl's method is used for estimation of ______.", "difficulty": "hard", "options": {"A": "Nitrogen", "B": "Carbon", "C": "Oxygen", "D": "Halogen"}, "answer": "A"},
    {"question": "Carius method is used for estimation of ______.", "difficulty": "hard", "options": {"A": "Halogens and Sulfur", "B": "Nitrogen", "C": "Metals", "D": "Bonds"}, "answer": "A"},
    {"question": "Stereoisomer which are non-superimposable mirror images are:", "difficulty": "hard", "options": {"A": "Enantiomers", "B": "Diastereomers", "C": "Constitutional isomers", "D": "Meso compounds"}, "answer": "A"},
    {"question": "Resonance energy is the energy difference between:", "difficulty": "hard", "options": {"A": "Most stable canonical structure and actual hybrid", "B": "Two isomers", "C": "Ground and excited state", "D": "Atoms"}, "answer": "A"}
]

hydrocarbons_qs = [
    {"question": "Wurtz reaction of ethyl bromide in presence of dry ether gives:", "difficulty": "hard", "options": {"A": "n-Butane", "B": "Ethane", "C": "Propane", "D": "Hexane"}, "answer": "A"},
    {"question": "Kolbe's electrolysis of aqueous Sodium Acetate gives ______ at anode.", "difficulty": "hard", "options": {"A": "Ethane + CO2", "B": "Methane", "C": "Hydrogen", "D": "Oxygen"}, "answer": "A"},
    {"question": "Adding Br2/CCl4 to Ethene produces:", "difficulty": "hard", "options": {"A": "1,2-Dibromoethane", "B": "Bromoethane", "C": "1,1-Dibromoethane", "D": "No reaction"}, "answer": "A"},
    {"question": "Markownikoff's rule applies to ______ of HBr to asymmetric alkenes.", "difficulty": "hard", "options": {"A": "Electrophilic addition", "B": "Nucleophilic addition", "C": "Free radical addition", "D": "Elimination"}, "answer": "A"},
    {"question": "Anti-Markownikoff addition (Peroxide effect) is shown only by:", "difficulty": "hard", "options": {"A": "HBr", "B": "HCl", "C": "HI", "D": "HF"}, "answer": "A"},
    {"question": "Ozonolysis of 2-Butene gives two molecules of:", "difficulty": "hard", "options": {"A": "Acetaldehyde (Ethanal)", "B": "Acetone", "C": "Formaldehyde", "D": "Acetic acid"}, "answer": "A"},
    {"question": "Acidity of hydrocarbons follows the order:", "difficulty": "hard", "options": {"A": "Alkyne > Alkene > Alkane", "B": "Alkane > Alkene > Alkyne", "C": "Equal", "D": "Random"}, "answer": "A"},
    {"question": "Lindlar's catalyst (Pd/CaCO3 poisoned by lead) reduces Alkynes to:", "difficulty": "hard", "options": {"A": "cis-Alkenes", "B": "trans-Alkenes", "C": "Alkanes", "D": "Alcohols"}, "answer": "A"},
    {"question": "Birch reduction (Na in liquid NH3) reduces Alkynes to:", "difficulty": "hard", "options": {"A": "trans-Alkenes", "B": "cis-Alkenes", "C": "Alkanes", "D": "Arenes"}, "answer": "A"},
    {"question": "Benzene on ozonolysis gives three molecules of:", "difficulty": "hard", "options": {"A": "Glyoxal", "B": "Acetaldehyde", "C": "Ethane", "D": "Butadiene"}, "answer": "A"},
    {"question": "Hückel's rule for aromaticity states that system must have:", "difficulty": "hard", "options": {"A": "(4n + 2) pi electrons", "B": "4n pi electrons", "C": "Even number of electrons", "D": "No electrons"}, "answer": "A"},
    {"question": "Friedel-Crafts alkylation of Benzene with Methyl chloride uses which catalyst?", "difficulty": "hard", "options": {"A": "Anhydrous AlCl3", "B": "Conc. H2SO4", "C": "Pt", "D": "Ni"}, "answer": "A"},
    {"question": "Orientation of -NO2 group in Nitrobenzene directs incoming electrophile to:", "difficulty": "hard", "options": {"A": "Meta position", "B": "Ortho position", "C": "Para position", "D": "All positions"}, "answer": "A"},
    {"question": "Ethyne (Acetylene) on cyclic polymerization in red hot iron tube gives:", "difficulty": "hard", "options": {"A": "Benzene", "B": "Toluene", "C": "Cyclohexane", "D": "Polystyrene"}, "answer": "A"},
    {"question": "Reaction of Propene with NBS (N-bromosuccinimide) gives:", "difficulty": "hard", "options": {"A": "3-Bromoprop-1-ene (Allyl bromide)", "B": "1-Bromopropene", "C": "2-Bromopropene", "D": "No reaction"}, "answer": "A"},
    {"question": "Action of Chlorine on Benzene in presence of UV light (no catalyst) gives:", "difficulty": "hard", "options": {"A": "BHC (Benzene hexachloride / Gammaxene)", "B": "Chlorobenzene", "C": "1,2-Dichlorobenzene", "D": "Hexachlorobenzene"}, "answer": "A"},
    {"question": "Electrophile in the nitration of benzene is:", "difficulty": "hard", "options": {"A": "NO2+", "B": "NO2", "C": "NO3-", "D": "HNO3"}, "answer": "A"},
    {"question": "Converting Alkane to aromatic hydrocarbon using V2O5 at high T/P is:", "difficulty": "hard", "options": {"A": "Aromatization", "B": "Cracking", "C": "Isomerization", "D": "Combustion"}, "answer": "A"},
    {"question": "Cracking (Pyrolysis) of Alkanes gives:", "difficulty": "hard", "options": {"A": "Mixture of lower alkanes and alkenes", "B": "Carbon only", "C": "Polymers", "D": "Alcohols"}, "answer": "A"},
    {"question": "But-2-ene reacts with cold dilute KMnO4 (Baeyer's reagent) to give:", "difficulty": "hard", "options": {"A": "Butane-2,3-diol", "B": "Acetic acid", "C": "Butane", "D": "Oxime"}, "answer": "A"},
    {"question": "Which of the following is not aromatic?", "difficulty": "hard", "options": {"A": "Cyclooctatetraene (non-planar)", "B": "Benzene", "C": "Naphthalene", "D": "Anthracene"}, "answer": "A"},
    {"question": "The C-C bond length in Benzene is ______.", "difficulty": "hard", "options": {"A": "1.39 Angstrom (Intermediate between C-C and C=C)", "B": "1.54 Angstrom", "C": "1.34 Angstrom", "D": "1.20 Angstrom"}, "answer": "A"}
]

solid_state_qs = [
    {"question": "The number of atoms per unit cell in BCC lattice is:", "difficulty": "hard", "options": {"A": "2", "B": "1", "C": "4", "D": "8"}, "answer": "A"},
    {"question": "Packing efficiency of FCC (CCP) lattice is:", "difficulty": "hard", "options": {"A": "74%", "B": "68%", "C": "52.4%", "D": "100%"}, "answer": "A"},
    {"question": "Schottky defect is observed in ionic solids when:", "difficulty": "hard", "options": {"A": "Equal number of cations and anions are missing from lattice", "B": "Cation moves to interstitial site", "C": "Presence of extra anion", "D": "Impurity is added"}, "answer": "A"},
    {"question": "F-centers are formed when ______.", "difficulty": "hard", "options": {"A": "Electrons are trapped in anionic vacancies", "B": "Metal deficiency occurs", "C": "Solid is heated in air", "D": "X-rays are passed"}, "answer": "A"},
    {"question": "Coordination number of an atom in HCP structure is:", "difficulty": "hard", "options": {"A": "12", "B": "8", "C": "6", "D": "4"}, "answer": "A"},
    {"question": "Frenkel defect is also called ______ defect.", "difficulty": "hard", "options": {"A": "Dislocation", "B": "Point", "C": "Line", "D": "Plane"}, "answer": "A"},
    {"question": "Which crystal system has all axial lengths different and all angles different from 90\u00b0?", "difficulty": "hard", "options": {"A": "Triclinic", "B": "Tetragonal", "C": "Monoclinic", "D": "Orthorhombic"}, "answer": "A"},
    {"question": "Example of a Network (Covalent) solid is:", "difficulty": "hard", "options": {"A": "Diamond (or Quartz)", "B": "NaCl", "C": "Ice", "D": "Dry ice"}, "answer": "A"},
    {"question": "Magnetic property of Fe3O4 (Magnetite) is:", "difficulty": "hard", "options": {"A": "Ferrimagnetic", "B": "Ferromagnetic", "C": "Antiferromagnetic", "D": "Paramagnetic"}, "answer": "A"},
    {"question": "A substance shows superconductivity at:", "difficulty": "hard", "options": {"A": "Very low temperatures", "B": "Very high temperatures", "C": "Room temperature", "D": "Melting point"}, "answer": "A"},
    {"question": "The ratio of voids to atoms in a unit cell (CCP) is:", "difficulty": "hard", "options": {"A": "2 (Octahedral + Tetrahedral)", "B": "1", "C": "3", "D": "4"}, "answer": "A"},
    {"question": "Bragg's equation is n*lambda = ______.", "difficulty": "hard", "options": {"A": "2d sin(theta)", "B": "d sin(theta)", "C": "2d", "D": "h/p"}, "answer": "A"},
    {"question": "The total volume occupied by atoms in SCC unit cell is:", "difficulty": "hard", "options": {"A": "pi*r^3 * (4/3)", "B": "2 * (4/3)pi*r^3", "C": "8 * pi*r^3", "D": "1"}, "answer": "A"},
    {"question": "Doping of Silicon with Boron gives ______ type semiconductor.", "difficulty": "hard", "options": {"A": "p-type", "B": "n-type", "C": "Intrinsic", "D": "Metallic"}, "answer": "A"},
    {"question": "For a crystal, the density rho = ______.", "difficulty": "hard", "options": {"A": "(Z * M) / (a^3 * NA)", "B": "Z / (a^3 * M)", "C": "M / (Z * a^3)", "D": "a^3 / ZM"}, "answer": "A"},
    {"question": "Unit cell with a=b=c and alpha=beta=gamma=90\u00b0 is ______.", "difficulty": "hard", "options": {"A": "Cubic", "B": "Rhombic", "C": "Hexagonal", "D": "Triclinic"}, "answer": "A"},
    {"question": "Edge length of FCC unit cell is related to radius r by:", "difficulty": "hard", "options": {"A": "a = 2*sqrt(2)*r", "B": "a = 4r / sqrt(3)", "C": "a = 2r", "D": "a = r / 2"}, "answer": "A"},
    {"question": "Graphite is a good conductor of electricity because of:", "difficulty": "hard", "options": {"A": "Presence of free mobile pi-electrons", "B": "Metallic bonding", "C": "Ionic nature", "D": "Small size"}, "answer": "A"},
    {"question": "ZnO on heating turns yellow because of:", "difficulty": "hard", "options": {"A": "Metal excess defect (loss of oxygen)", "B": "Impurity", "C": "Decomposition", "D": "Melting"}, "answer": "A"},
    {"question": "Solid CO2 is a ______ solid.", "difficulty": "hard", "options": {"A": "Molecular", "B": "Ionic", "C": "Covalent", "D": "Metallic"}, "answer": "A"},
    {"question": "Percentage of empty space in BCC unit cell is:", "difficulty": "hard", "options": {"A": "32%", "B": "26%", "C": "47.6%", "D": "68%"}, "answer": "A"},
    {"question": "Distance between nearest neighbors in FCC is:", "difficulty": "hard", "options": {"A": "a / sqrt(2)", "B": "a", "C": "sqrt(3)a / 2", "D": "2a"}, "answer": "A"},
    {"question": "The number of Bravis lattices possible in total is:", "difficulty": "hard", "options": {"A": "14", "B": "7", "C": "230", "D": "32"}, "answer": "A"},
    {"question": "Antiferromagnetic substances have alignment of magnetic moments resulting in net moment of:", "difficulty": "hard", "options": {"A": "Zero", "B": "Max", "C": "Variable", "D": "Positive"}, "answer": "A"},
    {"question": "Superconductors show zero ______.", "difficulty": "hard", "options": {"A": "Electrical resistance", "B": "Magnetic flux", "C": "Density", "D": "Refractive index"}, "answer": "A"}
]

add_questions('periodic_table.json', periodic_table_qs)
add_questions('chemical_bonding.json', chemical_bonding_qs)
add_questions('hydrogen.json', hydrogen_qs)
add_questions('goc.json', goc_qs)
add_questions('hydrocarbons.json', hydrocarbons_qs)
add_questions('solid_state.json', solid_state_qs)
