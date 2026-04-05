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

# Batch 4 Data
s_block_qs = [
    {"question": "Which of the following alkali metals has the highest hydration enthalpy?", "difficulty": "hard", "options": {"A": "Li+", "B": "Na+", "C": "K+", "D": "Cs+"}, "answer": "A"},
    {"question": "Reaction of Sodium with excess Oxygen gives:", "difficulty": "hard", "options": {"A": "Na2O2 (Peroxide)", "B": "Na2O", "C": "NaO2", "D": "No reaction"}, "answer": "A"},
    {"question": "Beryllium shows diagonal relationship with:", "difficulty": "hard", "options": {"A": "Aluminum", "B": "Silicon", "C": "Boron", "D": "Magnesium"}, "answer": "A"},
    {"question": "The solubility of Alkaline earth metal sulfates in water ______ down the group.", "difficulty": "hard", "options": {"A": "Decreases", "B": "Increases", "C": "Stays constant", "D": "Varies randomly"}, "answer": "A"},
    {"question": "Solvay process is used for manufacture of:", "difficulty": "hard", "options": {"A": "Sodium carbonate (Na2CO3)", "B": "Sodium hydroxide", "C": "Potassium carbonate", "D": "Ammonia"}, "answer": "A"},
    {"question": "Which of the following alkaline earth metals does NOT give a flame test color?", "difficulty": "hard", "options": {"A": "Beryllium (Be) and Magnesium (Mg)", "B": "Calcium", "C": "Strontium", "D": "Barium"}, "answer": "A"},
    {"question": "Gypsum is chemically:", "difficulty": "hard", "options": {"A": "CaSO4.2H2O", "B": "CaSO4.1/2H2O", "C": "MgSO4.7H2O", "D": "Na2SO4.10H2O"}, "answer": "A"},
    {"question": "Temporary hardness of water is due to:", "difficulty": "hard", "options": {"A": "Mg(HCO3)2 and Ca(HCO3)2", "B": "CaCl2", "C": "MgSO4", "D": "MgCl2"}, "answer": "A"},
    {"question": "The chemical formula of Plaster of Paris is:", "difficulty": "hard", "options": {"A": "CaSO4.1/2H2O", "B": "CaSO4.2H2O", "C": "CaSO4", "D": "MgSO4.1/2H2O"}, "answer": "A"},
    {"question": "Which alkali metal is used in photoelectric cells?", "difficulty": "hard", "options": {"A": "Cesium (Cs)", "B": "Lithium", "C": "Sodium", "D": "Potassium"}, "answer": "A"},
    {"question": "The density of alkali metals generally increases down the group, but ______ is less dense than ______.", "difficulty": "hard", "options": {"A": "Potassium, Sodium", "B": "Sodium, Potassium", "C": "Lithium, Cesium", "D": "Cesium, Francium"}, "answer": "A"},
    {"question": "Common salt (NaCl) is purified by passing ______ gas through its saturated solution.", "difficulty": "hard", "options": {"A": "HCl", "B": "Cl2", "C": "H2", "D": "NH3"}, "answer": "A"},
    {"question": "Which of the following is used as a biological preservative? No. Replaced: Which biological cation is involved in blood clotting?", "difficulty": "hard", "options": {"A": "Ca2+", "B": "Na+", "C": "K+", "D": "Mg2+"}, "answer": "A"},
    {"question": "Castner-Kellner cell is used for manufacture of:", "difficulty": "hard", "options": {"A": "NaOH", "B": "Na2CO3", "C": "NaHCO3", "D": "Na metal"}, "answer": "A"},
    {"question": "Dead burnt plaster is:", "difficulty": "hard", "options": {"A": "Anhydrous CaSO4", "B": "CaSO4.2H2O", "C": "CaO", "D": "Ca(OH)2"}, "answer": "A"},
    {"question": "The metal used in the manufacture of Grignard reagent is:", "difficulty": "hard", "options": {"A": "Magnesium", "B": "Zinc", "C": "Sodium", "D": "Lithium"}, "answer": "A"},
    {"question": "Epsom salt is:", "difficulty": "hard", "options": {"A": "MgSO4.7H2O", "B": "Na2SO4.10H2O", "C": "CaSO4.2H2O", "D": "FeSO4.7H2O"}, "answer": "A"},
    {"question": "The mobility of alkali metal ions in aqueous solution is highest for:", "difficulty": "hard", "options": {"A": "Cs+", "B": "Li+", "C": "Na+", "D": "K+"}, "answer": "A"},
    {"question": "Reaction of Li with N2 gives:", "difficulty": "hard", "options": {"A": "Li3N (Lithium nitride)", "B": "LiN3", "C": "LiNO3", "D": "No reaction"}, "answer": "A"},
    {"question": "Potassium carbonate (K2CO3) cannot be prepared by Solvay process because:", "difficulty": "hard", "options": {"A": "KHCO3 is highly soluble in water", "B": "K2CO3 is unstable", "C": "K is radioactive", "D": "NH3 does not react"}, "answer": "A"},
    {"question": "Washing soda is:", "difficulty": "hard", "options": {"A": "Na2CO3.10H2O", "B": "Na2CO3", "C": "NaHCO3", "D": "NaOH"}, "answer": "A"},
    {"question": "The metal used for making strong but light alloys with Al is:", "difficulty": "hard", "options": {"A": "Magnesium", "B": "Sodium", "C": "Calcium", "D": "Iron"}, "answer": "A"},
    {"question": "Slaking of lime is an ______ process.", "difficulty": "hard", "options": {"A": "Exothermic", "B": "Endothermic", "C": "Isothermal", "D": "Adiabatic"}, "answer": "A"},
    {"question": "Chlorine used for bleaching is prepared from:", "difficulty": "hard", "options": {"A": "Bleaching powder (CaOCl2)", "B": "NaCl", "C": "HCl", "D": "KCl"}, "answer": "A"},
    {"question": "Cement contains predominantly:", "difficulty": "hard", "options": {"A": "Calcium silicates and aluminates", "B": "Sodium salts", "C": "Iron oxides", "D": "Clays"}, "answer": "A"},
    {"question": "Which s-block element is found in Chlorophyll?", "difficulty": "hard", "options": {"A": "Mg", "B": "Ca", "C": "Na", "D": "K"}, "answer": "A"},
    {"question": "Quick lime on reaction with P4O10 gives:", "difficulty": "hard", "options": {"A": "Ca3(PO4)2 (Calcium phosphate)", "B": "CaH2PO4", "C": "CaHPO4", "D": "No reaction"}, "answer": "A"}
]

surface_chemistry_qs = [
    {"question": "Physical adsorption (Physisorption) is ______.", "difficulty": "hard", "options": {"A": "Reversible and exothermic", "B": "Irreversible", "C": "Endothermic", "D": "Monolayer only"}, "answer": "A"},
    {"question": "Chemical adsorption (Chemisorption) ______ with increase in temperature initially.", "difficulty": "hard", "options": {"A": "Increases", "B": "Decreases", "C": "Remains constant", "D": "Varies randomly"}, "answer": "A"},
    {"question": "Freundlich adsorption isotherm is represented as:", "difficulty": "hard", "options": {"A": "x/m = k.P^(1/n)", "B": "x/m = k.P", "C": "x/m = k/P", "D": "P = k.x/m"}, "answer": "A"},
    {"question": "In Haber's process for NH3, the catalyst and promoter are:", "difficulty": "hard", "options": {"A": "Iron (Fe) and Molybdenum (Mo)", "B": "Pt and Ni", "C": "V2O5", "D": "Cu and Zn"}, "answer": "A"},
    {"question": "The zig-zag motion of colloidal particles is:", "difficulty": "hard", "options": {"A": "Brownian movement", "B": "Tyndall effect", "C": "Electrophoresis", "D": "Coagulation"}, "answer": "A"},
    {"question": "The scattering of light by colloidal particles is:", "difficulty": "hard", "options": {"A": "Tyndall effect", "B": "Rayleigh scattering", "C": "Refraction", "D": "Interference"}, "answer": "A"},
    {"question": "Hardy-Schulze rule is related to:", "difficulty": "hard", "options": {"A": "Coagulation (Higher the valency, greater is the coagulating power)", "B": "Adsorption", "C": "Diffusion", "D": "Osmosis"}, "answer": "A"},
    {"question": "Which of the following is a lyophilic colloid?", "difficulty": "hard", "options": {"A": "Starch", "B": "Sulfur sol", "C": "Gold sol", "D": "Fe(OH)3 sol"}, "answer": "A"},
    {"question": "The process of removing dissolved impurities from a sol by diffusion through a membrane is:", "difficulty": "hard", "options": {"A": "Dialysis", "B": "Peptization", "C": "Coagulation", "D": "Electrophoresis"}, "answer": "A"},
    {"question": "Micelles are formed above a certain concentration called:", "difficulty": "hard", "options": {"A": "Critical Micelle Concentration (CMC)", "B": "Threshold concentration", "C": "Molarity", "D": "Saturation"}, "answer": "A"},
    {"question": "Formation of micelles occurs above a temperature called:", "difficulty": "hard", "options": {"A": "Kraft temperature", "B": "Boiling point", "C": "Curie temperature", "D": "Absolute zero"}, "answer": "A"},
    {"question": "Peptization is the process of:", "difficulty": "hard", "options": {"A": "Converting a precipitate into colloidal sol", "B": "Coagulation", "C": "Purification", "D": "Heating"}, "answer": "A"},
    {"question": "An example of a solid-in-liquid sol is:", "difficulty": "hard", "options": {"A": "Paint", "B": "Milk", "C": "Dust", "D": "Cheese"}, "answer": "A"},
    {"question": "Gold Number is a measure of:", "difficulty": "hard", "options": {"A": "Protective power of a lyophilic colloid", "B": "Purity of gold", "C": "Size of gold particles", "D": "Coagulating power"}, "answer": "A"},
    {"question": "Alum is used to purify water by:", "difficulty": "hard", "options": {"A": "Coagulating suspended clay particles", "B": "Killing bacteria", "C": "Dissolving salts", "D": "Filtering"}, "answer": "A"},
    {"question": "The process of 'Seed selection' in flotation involves use of:", "difficulty": "hard", "options": {"A": "Collectors and Frothers", "B": "Water only", "C": "Oil only", "D": "Salt"}, "answer": "A"},
    {"question": "Enzymes are ______ catalysts.", "difficulty": "hard", "options": {"A": "Biological (Proteinaceous)", "B": "Inorganic", "C": "Metallic", "D": "Gaseous"}, "answer": "A"},
    {"question": "Which of the following is an oil-in-water (O/W) emulsion?", "difficulty": "hard", "options": {"A": "Milk", "B": "Butter", "C": "Cold cream", "D": "Cod liver oil"}, "answer": "A"},
    {"question": "The cloud is an example of:", "difficulty": "hard", "options": {"A": "Aerosol (Liquid in gas)", "B": "Emulsion", "C": "Sol", "D": "Solid sol"}, "answer": "A"},
    {"question": "Electrophoresis involves the movement of:", "difficulty": "hard", "options": {"A": "Colloidal particles towards electrodes", "B": "Solvent particles", "C": "Ions only", "D": "Gas bubbles"}, "answer": "A"},
    {"question": "Tanning of leather involves the process of:", "difficulty": "hard", "options": {"A": "Coagulation of protein by tanning agents", "B": "Drying", "C": "Coloring", "D": "Cleaning"}, "answer": "A"},
    {"question": "For the adsorption of a gas on a solid, the value of delta_G is ______.", "difficulty": "hard", "options": {"A": "Negative", "B": "Positive", "C": "Zero", "D": "Infinite"}, "answer": "A"}
]

chemical_kinetics_qs = [
    {"question": "The rate of a first order reaction depends on:", "difficulty": "hard", "options": {"A": "Concentration of one reactant", "B": "Two reactants", "C": "Temperature only", "D": "No concentration"}, "answer": "A"},
    {"question": "The unit of rate constant for a zero order reaction is:", "difficulty": "hard", "options": {"A": "mol L-1 s-1", "B": "s-1", "C": "L mol-1 s-1", "D": "L2 mol-2 s-1"}, "answer": "A"},
    {"question": "If the concentration of a reactant is doubled and the rate becomes 4 times, the order is:", "difficulty": "hard", "options": {"A": "2", "B": "1", "C": "0", "D": "3"}, "answer": "A"},
    {"question": "Half-life of a first order reaction is ______ of initial concentration.", "difficulty": "hard", "options": {"A": "Independent", "B": "Directly proportional", "C": "Inversely proportional", "D": "Exponentially related"}, "answer": "A"},
    {"question": "The Arrhenius equation is:", "difficulty": "hard", "options": {"A": "k = A.e^(-Ea/RT)", "B": "k = A.log(T)", "C": "k = Ae^(RT/Ea)", "D": "Rate = k.C"}, "answer": "A"},
    {"question": "Molecularity of a reaction can never be:", "difficulty": "hard", "options": {"A": "Zero or Fractional", "B": "1", "C": "2", "D": "3"}, "answer": "A"},
    {"question": "Collision theory assumes that reactant molecules are:", "difficulty": "hard", "options": {"A": "Hard spheres", "B": "Point masses", "C": "Fluid droplets", "D": "Wave patterns"}, "answer": "A"},
    {"question": "Activation energy (Ea) can be calculated from the slope of plot between:", "difficulty": "hard", "options": {"A": "log k vs 1/T", "B": "k vs T", "C": "log k vs T", "D": "log k vs log T"}, "answer": "A"},
    {"question": "A catalyst increases the rate of reaction by:", "difficulty": "hard", "options": {"A": "Lowering the activation energy", "B": "Increasing the number of collisions", "C": "Decreasing temperature", "D": "Increasing Gibb's energy"}, "answer": "A"},
    {"question": "For a zero order reaction, the plot of [A] vs time is a straight line with slope ______.", "difficulty": "hard", "options": {"A": "-k", "B": "+k", "C": "1/k", "D": "log k"}, "answer": "A"},
    {"question": "The rate constant of a reaction increases 2-3 times for every ______ rise in temperature.", "difficulty": "hard", "options": {"A": "10 K", "B": "1 K", "C": "100 K", "D": "25 K"}, "answer": "A"},
    {"question": "Radioactive decay follows ______ order kinetics.", "difficulty": "hard", "options": {"A": "First", "B": "Zero", "C": "Second", "D": "Third"}, "answer": "A"},
    {"question": "The threshold energy is the sum of:", "difficulty": "hard", "options": {"A": "Activation energy + Kinetic energy of molecules", "B": "Ea + Potential energy", "C": "Free energy", "D": "Heat of reaction"}, "answer": "A"},
    {"question": "Pseudo first order reaction example:", "difficulty": "hard", "options": {"A": "Acid catalyzed hydrolysis of ethyl acetate", "B": "Decomposition of HI", "C": "Reaction between H2 and I2", "D": "Combustion of Methane"}, "answer": "A"},
    {"question": "In a multistep reaction, the rate is determined by the ______ step.", "difficulty": "hard", "options": {"A": "Slowest", "B": "Fastest", "C": "Intermediate", "D": "First"}, "answer": "A"},
    {"question": "Unit of rate constant k for n-th order reaction is:", "difficulty": "hard", "options": {"A": "(mol L-1)^(1-n) s-1", "B": "mol L-n s-1", "C": "L mol s-1", "D": "s-1"}, "answer": "A"},
    {"question": "Inversion of cane sugar is a ______ reaction.", "difficulty": "hard", "options": {"A": "Pseudo first order", "B": "Second order", "C": "Zero order", "D": "Instantaneous"}, "answer": "A"},
    {"question": "The frequency factor 'A' in Arrhenius equation depends on:", "difficulty": "hard", "options": {"A": "Frequency of collisions and effective orientation of molecules", "B": "Temperature only", "C": "Activation energy", "D": "Catalyst"}, "answer": "A"},
    {"question": "Half-life of a zero order reaction is:", "difficulty": "hard", "options": {"A": "[A]0 / 2k", "B": "0.693 / k", "C": "1 / (k [A]0)", "D": "2k / [A]0"}, "answer": "A"},
    {"question": "For a first order reaction, if time taken for 50% completion is 10 min, time for 75% completion will be:", "difficulty": "hard", "options": {"A": "20 min", "B": "15 min", "C": "30 min", "D": "40 min"}, "answer": "A"},
    {"question": "The order of reaction for H2 + Cl2 --(Light)--> 2HCl over water is:", "difficulty": "hard", "options": {"A": "0", "B": "1", "C": "2", "D": "3"}, "answer": "A"},
    {"question": "Molecularity of a reaction is determined from ______.", "difficulty": "hard", "options": {"A": "The balanced chemical equation of an elementary step", "B": "Experiments only", "C": "Mechanism", "D": "Rate law"}, "answer": "A"},
    {"question": "Ea (acid) > Ea (neutral). Which reaction is faster?", "difficulty": "hard", "options": {"A": "Neutral", "B": "Acidic", "C": "Both same", "D": "Depends on P"}, "answer": "A"}
]

electrochemistry_qs = [
    {"question": "The EMF of a cell is related to delta_G by:", "difficulty": "hard", "options": {"A": "delta_G = -nFE", "B": "delta_G = nFE", "C": "E = nF/delta_G", "D": "delta_G = -E/nF"}, "answer": "A"},
    {"question": "Kohlrausch Law is related to:", "difficulty": "hard", "options": {"A": "Molar conductivity at infinite dilution", "B": "EMF", "C": "Standard potential", "D": "Resistance"}, "answer": "A"},
    {"question": "Specific conductivity (Kappa) ______ with decrease in concentration.", "difficulty": "hard", "options": {"A": "Decreases", "B": "Increases", "C": "Stays constant", "D": "Becomes infinite"}, "answer": "A"},
    {"question": "Molar conductivity ______ with decrease in concentration.", "difficulty": "hard", "options": {"A": "Increases", "B": "Decreases", "C": "Stays constant", "D": "Is independent"}, "answer": "A"},
    {"question": "The standard reduction potential of Zn2+/Zn is -0.76 V. This means:", "difficulty": "hard", "options": {"A": "Zn is a stable metal", "B": "Zn has more tendency to be reduced than H+", "C": "Zn acts as a strong reducing agent (oxidized easily)", "D": "Zn is an inert cathode"}, "answer": "C"},
    {"question": "Faraday's first law of electrolysis states m = ______.", "difficulty": "hard", "options": {"A": "Zit", "B": "it/Z", "Z": "it/F", "D": "Fi/t"}, "answer": "A"},
    {"question": "One Faraday is approximately equal to:", "difficulty": "hard", "options": {"A": "96500 C", "B": "96485 C", "C": "1.6 x 10^-19 C", "D": "1 C"}, "answer": "A"},
    {"question": "In a dry cell, the anode is made of:", "difficulty": "hard", "options": {"A": "Zinc container", "B": "Carbon rod", "C": "Copper", "D": "Lead"}, "answer": "A"},
    {"question": "Fuel cells convert ______ energy directly into electrical energy.", "difficulty": "hard", "options": {"A": "Chemical (Combustion)", "B": "Nuclear", "C": "Solar", "D": "Thermal"}, "answer": "A"},
    {"question": "Corrosion is an ______ process.", "difficulty": "hard", "options": {"A": "Electrochemical", "B": "Acidic", "C": "Thermal", "D": "Purely physical"}, "answer": "A"},
    {"question": "In the lead storage battery, the electrolyte is:", "difficulty": "hard", "options": {"A": "38% H2SO4", "B": "Dilute HCl", "C": "Fused NaCl", "D": "KOH"}, "answer": "A"},
    {"question": "Rust is chemically:", "difficulty": "hard", "options": {"A": "Fe2O3.xH2O", "B": "Fe3O4", "C": "FeO", "D": "Fe(OH)2"}, "answer": "A"},
    {"question": "Galvanization is the coating of iron with:", "difficulty": "hard", "options": {"A": "Zinc", "B": "Tin", "C": "Chromium", "D": "Gold"}, "answer": "A"},
    {"question": "The salt bridge in a galvanic cell serves to:", "difficulty": "hard", "options": {"A": "Maintain electrical neutrality", "B": "Increase voltage", "C": "Decrease resistance", "D": "Act as catalyst"}, "answer": "A"},
    {"question": "Standard Hydrogen Electrode (SHE) has a potential of ______ V.", "difficulty": "hard", "options": {"A": "0.00", "B": "1.00", "C": "1.10", "D": "-0.76"}, "answer": "A"},
    {"question": "Nernst equation for a cell reaction at 298 K is:", "difficulty": "hard", "options": {"A": "E = E0 - (0.059/n) log Q", "B": "E = E0 + (0.059/n) log Q", "C": "E = E0 - (RT/nF) log Q", "D": "Both A and C"}, "answer": "D"},
    {"question": "The cell constant G* is defined as:", "difficulty": "hard", "options": {"A": "l / A", "B": "A / l", "C": "R / Kappa", "D": "Kappa / R"}, "answer": "A"},
    {"question": "The unit of molar conductivity is:", "difficulty": "hard", "options": {"A": "S cm2 mol-1", "B": "S cm-1", "C": "ohm-1 cm-1", "D": "ohm cm"}, "answer": "A"},
    {"question": "Standard potential E0_cell is related to equilibrium constant Kc by:", "difficulty": "hard", "options": {"A": "E0_cell = (0.059/n) log Kc", "B": "log Kc = (n E0_cell) / 0.059", "C": "E0_cell = (RT/nF) ln Kc", "D": "All of the above"}, "answer": "D"},
    {"question": "Prevention of corrosion by connecting iron to a more active metal like Mg is called:", "difficulty": "hard", "options": {"A": "Cathodic protection (Sacrificial protection)", "B": "Galvanizing", "C": "Barrier protection", "D": "Painting"}, "answer": "A"},
    {"question": "During charging of a lead storage battery, PbSO4 on cathode is converted to:", "difficulty": "hard", "options": {"A": "Pb", "B": "PbO2", "C": "PbSO4", "D": "H2SO4"}, "answer": "A"},
    {"question": "For a strong electrolyte like KCl, the molar conductivity increases ______ with square root of concentration.", "difficulty": "hard", "options": {"A": "Linearly", "B": "Exponentially", "C": "Inversely", "D": "Logarithmically"}, "answer": "A"},
    {"question": "The resistance of a solution is 50 ohm. Its conductance is:", "difficulty": "hard", "options": {"A": "0.02 S", "B": "50 S", "C": "0.2 S", "D": "1 S"}, "answer": "A"},
    {"question": "The element with the most negative standard reduction potential in the periodic table is:", "difficulty": "hard", "options": {"A": "Lithium", "B": "Fluorine", "C": "Sodium", "D": "Cesium"}, "answer": "A"},
    {"question": "The charge of one mole of electrons is equal to faraday's constant. The value is:", "difficulty": "hard", "options": {"A": "96487 C", "B": "6.023 x 10^23 C", "C": "1.6 x 10^-19 C", "D": "1000 C"}, "answer": "A"},
    {"question": "Conductivity cells are calibrated using ______.", "difficulty": "hard", "options": {"A": "KCl solution of known concentration", "B": "Pure water", "C": "NaCl", "D": "CuSO4"}, "answer": "A"},
    {"question": "Which of the following is a primary cell?", "difficulty": "hard", "options": {"A": "Dry cell", "B": "Lead storage battery", "C": "Ni-Cd cell", "D": "Li-ion battery"}, "answer": "A"},
    {"question": "Maximum electrical work from a cell is:", "difficulty": "hard", "options": {"A": "delta_G", "B": "delta_H", "C": "delta_S", "D": "E0_cell"}, "answer": "A"},
    {"question": "Potential difference between two electrodes when no current is flowing is:", "difficulty": "hard", "options": {"A": "EMF", "B": "Standard potential", "C": "Potential drop", "D": "V"}, "answer": "A"},
    {"question": "When iron is exposed to moisture, it acts as ______.", "difficulty": "hard", "options": {"A": "Corrosion cell (Anode where oxidation of Fe to Fe2+ happens)", "B": "Stable metal", "C": "Cathode", "D": "Pure iron"}, "answer": "A"},
    {"question": "The electrolysis of fused NaCl giving Na at cathode and Cl2 at anode was first done by:", "difficulty": "hard", "options": {"A": "Davy", "B": "Faraday", "C": "Newton", "D": "Dalton"}, "answer": "A"},
    {"question": "Standard electrode potential for Cl2/Cl- is 1.36 V. This means:", "difficulty": "hard", "options": {"A": "Chlorine is a good oxidizing agent", "B": "Chloride ion is oxidized easily", "C": "Chlorine is inert", "D": "Chlorine has zero potential"}, "answer": "A"},
    {"question": "Fuel cell efficiency is theoretically ______ compared to thermal power plants.", "difficulty": "hard", "options": {"A": "Much higher (70-100%)", "B": "Lower", "C": "Same", "D": "Zero"}, "answer": "A"},
    {"question": "Reduction happens at which electrode in a galvanic cell?", "difficulty": "hard", "options": {"A": "Cathode", "B": "Anode", "C": "Both", "D": "Neither"}, "answer": "A"},
    {"question": "Which of the following is not used to prevent rusting?", "difficulty": "hard", "options": {"A": "Adding saline water", "B": "Painting", "C": "Greasing", "D": "Tin plating"}, "answer": "A"},
    {"question": "Molar conductivity of a weak electrolyte like CH3COOH at infinite dilution is calculated using:", "difficulty": "hard", "options": {"A": "Kohlrausch Law", "B": "Faraday's Law", "C": "Nernst equation", "D": "Ohm's Law"}, "answer": "A"},
    {"question": "What is the equivalent mass of Copper (atomic mass 63.5) in the reduction of Cu2+ to Cu?", "difficulty": "hard", "options": {"A": "31.75", "B": "63.5", "C": "127", "D": "15.8"}, "answer": "A"},
    {"question": "Electrolysis of aqueous CuSO4 using Platinum electrodes gives:", "difficulty": "hard", "options": {"A": "Cu at cathode and O2 at anode", "B": "Cu at cathode and H2 at anode", "C": "H2 at cathode and O2 at anode", "D": "No reaction"}, "answer": "A"},
    {"question": "Cell potential depends on:", "difficulty": "hard", "options": {"A": "Nature of electrodes, Concentration and Temperature", "B": "Color", "C": "Size of vessel", "D": "Only time"}, "answer": "A"},
    {"question": "The device which converts chemical energy to electrical energy is:", "difficulty": "hard", "options": {"A": "Electrochemical cell", "B": "Electrolytic cell", "C": "Photovoltaic cell", "D": "Electric motor"}, "answer": "A"},
    {"question": "Hydrogen fuel cells produce ______ as the only byproduct.", "difficulty": "hard", "options": {"A": "Water", "B": "CO2", "C": "Ash", "D": "Smoke"}, "answer": "A"},
    {"question": "Rusting of iron is catalyzed by:", "difficulty": "hard", "options": {"A": "H+ ions (Acidic medium)", "B": "OH- ions", "C": "Nitrogen", "D": "Argon"}, "answer": "A"},
    {"question": "Oxidation of H2O at anode produces:", "difficulty": "hard", "options": {"A": "O2 + 4H+ + 4e-", "B": "H2", "C": "OH-", "D": "Ozone"}, "answer": "A"},
    {"question": "The number of electrons required to deposit 1 mole of Al from Al3+ is:", "difficulty": "hard", "options": {"A": "3 Faradays", "B": "1 Faraday", "C": "2 Faradays", "D": "6 Faradays"}, "answer": "A"},
    {"question": "Lead acid battery is commonly used in:", "difficulty": "hard", "options": {"A": "Automobiles", "B": "Watches", "C": "Calculators", "D": "Satellites"}, "answer": "A"},
    {"question": "Daniell cell is composed of which electrodes?", "difficulty": "hard", "options": {"A": "Zinc and Copper", "B": "Silver and Gold", "C": "Iron and Tin", "D": "Platinum and Hydrogen"}, "answer": "A"},
    {"question": "Standard electrode potential is measured at ______ concentration.", "difficulty": "hard", "options": {"A": "1 M", "B": "0.1 M", "C": "Saturation", "D": "Infinite dilution"}, "answer": "A"},
    {"question": "The relationship between cell potential and equilibrium constant derived from Nernst equation is:", "difficulty": "hard", "options": {"A": "log Kc = (n E0_cell) / 0.0591", "B": "E0 = RT ln Kc", "C": "E0 = 0.693/k", "D": "None"}, "answer": "A"},
    {"question": "A spontaneous redox reaction corresponds to:", "difficulty": "hard", "options": {"A": "E_cell > 0 and delta_G < 0", "B": "E_cell < 0", "C": "delta_G > 0", "D": "delta_S < 0"}, "answer": "A"},
    {"question": "Molar conductivity of strong electrolyte changes ______ with concentration.", "difficulty": "hard", "options": {"A": "Very little", "B": "Rapidly", "C": "Linearly over long range", "D": "Not at all"}, "answer": "A"}
]

equilibrium_qs = [
    {"question": "For the reaction N2(g) + 3H2(g) <=> 2NH3(g), the relationship between Kp and Kc is:", "difficulty": "hard", "options": {"A": "Kp = Kc(RT)^(-2)", "B": "Kp = Kc(RT)^2", "C": "Kp = Kc", "D": "Kp = Kc(RT)"}, "answer": "A"},
    {"question": "According to Le Chatelier's Principle, addition of heat (increasing temperature) favors which reaction for an endothermic process?", "difficulty": "hard", "options": {"A": "Forward", "B": "Backward", "C": "No change", "D": "Depends on pressure"}, "answer": "A"},
    {"question": "For a reaction to be at equilibrium, the value of delta_G is:", "difficulty": "hard", "options": {"A": "Zero", "B": "Maximum", "C": "Minimum", "D": "Negative"}, "answer": "A"},
    {"question": "Which of the following will not affect the position of equilibrium for a gaseous reaction?", "difficulty": "hard", "options": {"A": "Addition of a catalyst", "B": "Adding reactant", "C": "Changing temperature", "D": "Changing pressure when delta_n != 0"}, "answer": "A"},
    {"question": "The pH of a 0.001 M HCl solution is:", "difficulty": "hard", "options": {"A": "3", "B": "1", "C": "2", "D": "11"}, "answer": "A"},
    {"question": "The ionic product of water (Kw) at 298 K is:", "difficulty": "hard", "options": {"A": "10^-14", "B": "10^-7", "C": "10^-1", "D": "1.0"}, "answer": "A"},
    {"question": "What is the pH of pure water at high temperature (> 25\u00b0C)?", "difficulty": "hard", "options": {"A": "Less than 7 (still neutral because [H+]=[OH-])", "B": "Greater than 7", "C": "Exact 7", "D": "14"}, "answer": "A"},
    {"question": "Solubility product (Ksp) for AgCl is related to its solubility (S) by:", "difficulty": "hard", "options": {"A": "Ksp = S^2", "B": "Ksp = 4S^3", "C": "Ksp = S", "D": "Ksp = 2S"}, "answer": "A"},
    {"question": "Buffer solutions resist change in pH on adding small amounts of acid/base. Blood is a buffer primarily due to:", "difficulty": "hard", "options": {"A": "H2CO3 / HCO3- system", "B": "NaCl", "C": "Ammonia", "D": "Hydrochloric acid"}, "answer": "A"},
    {"question": "Ostwald's Dilution Law is applicable to:", "difficulty": "hard", "options": {"A": "Weak electrolytes", "B": "Strong electrolytes", "C": "Non-electrolytes", "D": "Gases"}, "answer": "A"},
    {"question": "For a sparingly soluble salt AB2, the solubility product is:", "difficulty": "hard", "options": {"A": "4S^3", "B": "S^2", "C": "27S^4", "D": "S"}, "answer": "A"},
    {"question": "Equilibrium constant Kc depends only on:", "difficulty": "hard", "options": {"A": "Temperature", "B": "Initial concentration", "C": "Pressure", "D": "Catalyst"}, "answer": "A"},
    {"question": "The relationship between pKa and pKb for a conjugate acid-base pair is:", "difficulty": "hard", "options": {"A": "pKa + pKb = pKw (14 at 25\u00b0C)", "B": "pKa - pKb = 14", "C": "pKa * pKb = 1", "D": "pKa = pKb"}, "answer": "A"},
    {"question": "Common ion effect refers to the decrease in degree of dissociation of:", "difficulty": "hard", "options": {"A": "Weak electrolyte when a strong electrolyte with a common ion is added", "B": "Strong electrolyte", "C": "Acid only", "D": "Water"}, "answer": "A"},
    {"question": "Henry's Law is related to:", "difficulty": "hard", "options": {"A": "Solubility of gas in liquid", "B": "Vapor pressure of liquid", "C": "Adsorption", "D": "Boiling point"}, "answer": "A"},
    {"question": "The pH of a buffer containing equal concentrations of weak acid and its conjugate base is:", "difficulty": "hard", "options": {"A": "pKa", "B": "7", "C": "pKb", "D": "14 - pKa"}, "answer": "A"},
    {"question": "Hydrolysis of a salt of strong acid and weak base gives a solution that is:", "difficulty": "hard", "options": {"A": "Acidic", "B": "Basic", "C": "Neutral", "D": "Varies"}, "answer": "A"},
    {"question": "Lewis base is a substance that can ______ a lone pair of electrons.", "difficulty": "hard", "options": {"A": "Donate", "B": "Accept", "C": "Dissociate", "D": "Neutralize"}, "answer": "A"},
    {"question": "Which of the following is a Lewis acid?", "difficulty": "hard", "options": {"A": "BF3", "B": "NH3", "C": "H2O", "D": "Cl-"}, "answer": "A"},
    {"question": "A reaction with large equilibrium constant (very large Kc) indicates that:", "difficulty": "hard", "options": {"A": "Reaction proceeds almost to completion", "B": "Reaction is very slow", "C": "Equilibrium favors reactants", "D": "Reaction cannot happen"}, "answer": "A"},
    {"question": "A catalyst added to an equilibrium system:", "difficulty": "hard", "options": {"A": "Does not change K, but decreases the time to reach equilibrium", "B": "Increases K", "C": "Shifts equilibrium to right", "D": "Consumes reactants"}, "answer": "A"},
    {"question": "The value of Kc for the reverse reaction is ______ of the Kc for the forward reaction.", "difficulty": "hard", "options": {"A": "Reciprocal", "B": "Negative", "C": "Same", "D": "Double"}, "answer": "A"},
    {"question": "Increasing pressure on the equilibrium H2(g) + I2(g) <=> 2HI(g) will:", "difficulty": "hard", "options": {"A": "Have no effect on equilibrium position (delta_n = 0)", "B": "Favor forward reaction", "C": "Favor backward reaction", "D": "Change Kp"}, "answer": "A"},
    {"question": "Acid rain result from decrease in pH due to dissolution of which gas in rain water?", "difficulty": "hard", "options": {"A": "SO2 and NO2", "B": "CO2 only", "C": "O2", "D": "Ar"}, "answer": "A"},
    {"question": "The degree of dissociation of a weak electrolyte ______ on dilution.", "difficulty": "hard", "options": {"A": "Increases", "B": "Decreases", "C": "Stays constant", "D": "Zeros"}, "answer": "A"},
    {"question": "Kw value increases with ______ in temperature.", "difficulty": "hard", "options": {"A": "Increase", "B": "Decrease", "C": "Pressure", "D": "Volume"}, "answer": "A"},
    {"question": "If Q < K, the reaction proceeds in in the ______ direction to reach equilibrium.", "difficulty": "hard", "options": {"A": "Forward", "B": "Backward", "C": "Neither", "D": "Random"}, "answer": "A"},
    {"question": "Which of the following salt undergoes hydrolysis to give an alkaline solution?", "difficulty": "hard", "options": {"A": "CH3COONa", "B": "NaCl", "C": "NH4Cl", "D": "KCl"}, "answer": "A"},
    {"question": "Dissociation of Lead Sulfate is repressed by adding:", "difficulty": "hard", "options": {"A": "Sodium Sulfate (Common ion effect)", "B": "Pure water", "C": "HCl", "D": "Nitric acid"}, "answer": "A"},
    {"question": "Ksp of a salt decreases as temperature ______.", "difficulty": "hard", "options": {"A": "Decreases (for endothermic dissolution)", "B": "Increases", "C": "Independent", "D": "Never change"}, "answer": "A"},
    {"question": "Acid-base indicators are usually:", "difficulty": "hard", "options": {"A": "Weak organic acids or bases", "B": "Strong acids", "C": "Neutral salts", "D": "Metals"}, "answer": "A"}
]

add_questions('s_block_elements.json', s_block_qs)
add_questions('surface_chemistry.json', surface_chemistry_qs)
add_questions('chemical_kinetics.json', chemical_kinetics_qs)
add_questions('electrochemistry_redox.json', electrochemistry_qs)
add_questions('chemical_equilibrium.json', equilibrium_qs)
