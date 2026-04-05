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

# Batch 5 Data
thermodynamics_qs = [
    {"question": "For a spontaneous process at all temperatures, the conditions are:", "difficulty": "hard", "options": {"A": "delta_H < 0 and delta_S > 0", "B": "delta_H > 0 and delta_S < 0", "C": "delta_G = 0", "D": "delta_H = delta_S"}, "answer": "A"},
    {"question": "Entropy of the universe is constantly:", "difficulty": "hard", "options": {"A": "Increasing", "B": "Decreasing", "C": "Remaining constant", "D": "Negative"}, "answer": "A"},
    {"question": "What is the relationship between delta_H and delta_U for a chemical reaction?", "difficulty": "hard", "options": {"A": "delta_H = delta_U + delta_ngRT", "B": "delta_H = delta_U", "C": "delta_H = delta_U - RT", "D": "delta_H = RT log K"}, "answer": "A"},
    {"question": "The second law of thermodynamics state that for any spontaneous process:", "difficulty": "hard", "options": {"A": "delta_S_total > 0", "B": "delta_S_system < 0", "C": "delta_H < 0", "D": "delta_G > 0"}, "answer": "A"},
    {"question": "Standard enthalpy of formation (delta_f_H0) for any element in its standard state is:", "difficulty": "hard", "options": {"A": "Zero", "B": "1", "C": "-1", "D": "Variable"}, "answer": "A"},
    {"question": "Heat capacity at constant pressure (Cp) and at constant volume (Cv) for 1 mole of an ideal gas are related as:", "difficulty": "hard", "options": {"A": "Cp - Cv = R", "B": "Cv - Cp = R", "C": "Cp/Cv = R", "D": "Cp + Cv = R"}, "answer": "A"},
    {"question": "Hess's Law states that enthalpy change for a reaction is independent of:", "difficulty": "hard", "options": {"A": "The path or number of steps taken", "B": "Final state", "C": "Initial state", "D": "Temperature"}, "answer": "A"},
    {"question": "Gibbs-Helmholtz equation relates delta_G and delta_H as:", "difficulty": "hard", "options": {"A": "delta_G = delta_H - T.delta_S", "B": "delta_G = delta_H + T.delta_S", "C": "delta_H = delta_G - T.delta_S", "D": "delta_S = delta_G/T"}, "answer": "A"},
    {"question": "For an adiabatic process, the condition is:", "difficulty": "hard", "options": {"A": "q = 0", "B": "w = 0", "C": "delta_U = 0", "D": "delta_V = 0"}, "answer": "A"},
    {"question": "The intensive property among the following is:", "difficulty": "hard", "options": {"A": "Temperature", "B": "Enthalpy", "C": "Mass", "D": "Volume"}, "answer": "A"},
    {"question": "Internal energy delta_U for an isolated system in a spontaneous process:", "difficulty": "hard", "options": {"A": "Remains constant", "B": "Increases", "C": "Decreases", "D": "Becomes zero"}, "answer": "A"},
    {"question": "Work done in an isothermal reversible expansion of an ideal gas is:", "difficulty": "hard", "options": {"A": "w = -2.303 nRT log(V2/V1)", "B": "w = -P.delta_V", "C": "w = nRT", "D": "w = 0"}, "answer": "A"},
    {"question": "Enthalpy of neutralization of a strong acid by a strong base is approximately:", "difficulty": "hard", "options": {"A": "-57.1 kJ/mol", "B": "-13.7 kJ/mol", "C": "0 kJ/mol", "D": "100 kJ/mol"}, "answer": "A"},
    {"question": "Which of the following is not a state function?", "difficulty": "hard", "options": {"A": "Heat (q)", "B": "Temperature (T)", "C": "Pressure (P)", "D": "Internal Energy (U)"}, "answer": "A"},
    {"question": "The criteria for chemical equilibrium is:", "difficulty": "hard", "options": {"A": "delta_G = 0", "B": "delta_H = 0", "C": "delta_S = 0", "D": "delta_U = 0"}, "answer": "A"},
    {"question": "Entropy change in melting of ice at 273 K is:", "difficulty": "hard", "options": {"A": "delta_H_fus / T", "B": "Zero", "C": "delta_U / T", "D": "Negative"}, "answer": "A"},
    {"question": "Bom calorimeter is used to measure:", "difficulty": "hard", "options": {"A": "delta_U (Heat of reaction at constant volume)", "B": "delta_H", "C": "delta_S", "D": "delta_T"}, "answer": "A"},
    {"question": "Unit of Entropy is:", "difficulty": "hard", "options": {"A": "J K-1 mol-1", "B": "J mol-1", "C": "kJ", "D": "J s"}, "answer": "A"},
    {"question": "Bond dissociation enthalpy is always ______.", "difficulty": "hard", "options": {"A": "Positive", "B": "Negative", "C": "Zero", "D": "Depends on bond"}, "answer": "A"},
    {"question": "Atomicity of 1 mole of Ozone gas involves entropy:", "difficulty": "hard", "options": {"A": "Increase when O3 dissociates to O2 + O", "B": "Decrease", "C": "No change", "D": "Constant"}, "answer": "A"},
    {"question": "Which system can exchange both energy and matter with surroundings?", "difficulty": "hard", "options": {"A": "Open system", "B": "Closed system", "C": "Isolated system", "D": "Adiabatic system"}, "answer": "A"},
    {"question": "For a cyclic process, the net change in internal energy is:", "difficulty": "hard", "options": {"A": "0", "B": "q + w", "C": "Max", "D": "Min"}, "answer": "A"},
    {"question": "Molar heat capacity of water is approximately:", "difficulty": "hard", "options": {"A": "75.3 J mol-1 K-1", "B": "4.18 J mol-1 K-1", "C": "1.0 J mol-1 K-1", "D": "18 J mol-1 K-1"}, "answer": "A"},
    {"question": "The enthalpy of atomization of Hydrogen gas (H2) is twice the:", "difficulty": "hard", "options": {"A": "Bond enthalpy of H-H", "B": "Bond energy", "C": "Ionization energy", "D": "Zero"}, "answer": "A"},
    {"question": "Which of the following process is non-spontaneous?", "difficulty": "hard", "options": {"A": "Flow of heat from cold body to hot body", "B": "Expansion of gas into vacuum", "C": "Diffusion of solutes", "D": "Rusting of iron"}, "answer": "A"},
    {"question": "Enthalpy change during combustion is always ______.", "difficulty": "hard", "options": {"A": "Negative", "B": "Positive", "C": "Zero", "D": "Variable"}, "answer": "A"},
    {"question": "For an isothermal expansion of an ideal gas into vacuum (free expansion), w = 0 and delta_U = ______.", "difficulty": "hard", "options": {"A": "0", "B": "q", "C": "it", "D": "RT"}, "answer": "A"},
    {"question": "Cp and Cv relationship for monatomic gas is:", "difficulty": "hard", "options": {"A": "Cp = 5/2 R, Cv = 3/2 R", "B": "Cp = 3/2 R", "C": "Cp = 7/2 R", "D": "Cp = R"}, "answer": "A"},
    {"question": "The third law of thermodynamics states that at 0 K, entropy of a perfectly crystalline solid is:", "difficulty": "hard", "options": {"A": "Zero", "B": "Infinite", "C": "1", "D": "-1"}, "answer": "A"}
]

solutions_qs = [
    {"question": "According to Raoult's Law, the relative lowering of vapor pressure is equal to:", "difficulty": "hard", "options": {"A": "Mole fraction of solute", "B": "Mole fraction of solvent", "C": "Molarity", "D": "Molality"}, "answer": "A"},
    {"question": "An ideal solution obeys Raoult's Law and its heat of mixing (delta_mix_H) is:", "difficulty": "hard", "options": {"A": "Zero", "B": "Positive", "C": "Negative", "D": "Infinite"}, "answer": "A"},
    {"question": "Which of the following concentration terms is independent of temperature?", "difficulty": "hard", "options": {"A": "Molality", "B": "Molarity", "C": "Normality", "D": "Formality"}, "answer": "A"},
    {"question": "The boiling point of a 1 M NaCl solution is ______ than 1 M sugar solution.", "difficulty": "hard", "options": {"A": "Higher (due to i = 2)", "B": "Lower", "C": "Same", "D": "Exactly double"}, "answer": "A"},
    {"question": "Osmotic pressure (pi) is given by the formula:", "difficulty": "hard", "options": {"A": "pi = i CRT", "B": "pi = MRT", "C": "pi = nRT", "D": "pi = pV"}, "answer": "A"},
    {"question": "Van't Hoff factor (i) for Al2(SO4)3 assuming complete dissociation is:", "difficulty": "hard", "options": {"A": "5", "B": "2", "C": "3", "D": "4"}, "answer": "A"},
    {"question": "The azeotropic mixture of water and ethanol (95%) is:", "difficulty": "hard", "options": {"A": "Minimum boiling azeotrope", "B": "Maximum boiling azeotrope", "C": "Ideal solution", "D": "Insoluble"}, "answer": "A"},
    {"question": "Reverse osmosis is used for:", "difficulty": "hard", "options": {"A": "Desalination of seawater", "B": "Increasing hardness", "C": "Preparing sugar", "D": "Battery charging"}, "answer": "A"},
    {"question": "Henry's Law constant KH ______ with increase in temperature.", "difficulty": "hard", "options": {"A": "Increases", "B": "Decreases", "C": "Stays constant", "D": "Zeros"}, "answer": "A"},
    {"question": "Solutions showing positive deviation from Raoult's law have:", "difficulty": "hard", "options": {"A": "delta_mix_V > 0", "B": "delta_mix_H < 0", "C": "A-B interactions stronger than A-A", "D": "Lower VP"}, "answer": "A"},
    {"question": "An example of a solution showing negative deviation is:", "difficulty": "hard", "options": {"A": "Acetone + Chloroform", "B": "Ethanol + Water", "C": "Benzene + Toluene", "D": "n-Hexane + n-Heptane"}, "answer": "A"},
    {"question": "Molal elevation constant (Kb) depends only on:", "difficulty": "hard", "options": {"A": "Nature of solvent", "B": "Nature of solute", "C": "Temperature", "D": "Pressure"}, "answer": "A"},
    {"question": "Isotonic solutions have the same:", "difficulty": "hard", "options": {"A": "Osmotic pressure", "B": "VP", "C": "BP", "D": "Density"}, "answer": "A"},
    {"question": "Which colligative property is most appropriate for determining molecular mass of proteins?", "difficulty": "hard", "options": {"A": "Osmotic pressure", "B": "Elevation in BP", "C": "Depression in FP", "D": "Relative lowering of VP"}, "answer": "A"},
    {"question": "Cryoscopic constant is another name for:", "difficulty": "hard", "options": {"A": "Molal depression constant (Kf)", "B": "Kb", "C": "KH", "D": "R"}, "answer": "A"},
    {"question": "The mole fraction of water in a mixture of 18g water and 46g ethanol is:", "difficulty": "hard", "options": {"A": "0.5", "B": "1", "C": "0.1", "D": "0.8"}, "answer": "A"},
    {"question": "Sea water freezes at a ______ temperature than pure water.", "difficulty": "hard", "options": {"A": "Lower", "B": "Higher", "C": "Same", "D": "0\u00b0C"}, "answer": "A"},
    {"question": "For a solute that undergoes association in solvent, the Van't Hoff factor (i) is:", "difficulty": "hard", "options": {"A": "< 1", "B": "> 1", "C": "1", "D": "0"}, "answer": "A"},
    {"question": "Maximum boiling azeotropes show:", "difficulty": "hard", "options": {"A": "Large negative deviation from Raoult's Law", "B": "Positive deviation", "C": "Zero deviation", "D": "No VP"}, "answer": "A"},
    {"question": "One molal solution contains 1 mole of solute in:", "difficulty": "hard", "options": {"A": "1000 g of solvent", "B": "1000 mL of solution", "C": "1 kg of solution", "D": "1 mole of solvent"}, "answer": "A"},
    {"question": "Solubility of gases in liquids ______ with increase in pressure.", "difficulty": "hard", "options": {"A": "Increases", "B": "Decreases", "C": "Stays constant", "D": "None"}, "answer": "A"},
    {"question": "According to Raoult's law, VP of solution P = ______.", "difficulty": "hard", "options": {"A": "P0 . X_solvent", "B": "P0 . X_solute", "C": "P0 / X", "D": "P0 + X"}, "answer": "A"},
    {"question": "An ideal solution is formed when components are mixed. delta_mix_V is:", "difficulty": "hard", "options": {"A": "0", "B": "> 0", "C": "< 0", "D": "Undefined"}, "answer": "A"},
    {"question": "Semi-permeable membrane allows only ______ molecules to pass through.", "difficulty": "hard", "options": {"A": "Solvent", "B": "Solute", "C": "Both", "D": "None"}, "answer": "A"},
    {"question": "Elevation of boiling point ΔTb = ______.", "difficulty": "hard", "options": {"A": "Kb . m", "B": "Kf . m", "C": "i Kb m", "D": "Both A and C"}, "answer": "D"},
    {"question": "For common salt in water, i =", "difficulty": "hard", "options": {"A": "2", "B": "1", "C": "3", "D": "0"}, "answer": "A"},
    {"question": "The freezing point of water is lowered by adding:", "difficulty": "hard", "options": {"A": "Salt", "B": "Sugar", "C": "Anti-freeze (Ethylene glycol)", "D": "All of the above"}, "answer": "D"},
    {"question": "Molality of pure water is:", "difficulty": "hard", "options": {"A": "55.5 m", "B": "1.0 m", "C": "18 m", "D": "None"}, "answer": "A"},
    {"question": "Which of the following properties is not a colligative property?", "difficulty": "hard", "options": {"A": "Vapor pressure (only lowering is colligative)", "B": "Elevation in BP", "C": "Osmotic pressure", "D": "Depression in FP"}, "answer": "A"}
]

states_of_matter_qs = [
    {"question": "For an ideal gas, the plot of PV vs P is a:", "difficulty": "hard", "options": {"A": "Horizontal straight line", "B": "Hyperbola", "C": "Passing through origin", "D": "Parabola"}, "answer": "A"},
    {"question": "Real gases behave most like ideal gases at:", "difficulty": "hard", "options": {"A": "Low pressure and high temperature", "B": "High pressure and low temperature", "C": "STP", "D": "Standard state"}, "answer": "A"},
    {"question": "The van der Waals constant 'a' measures:", "difficulty": "hard", "options": {"A": "Intermolecular forces of attraction", "B": "Effective size of molecules", "C": "Collision frequency", "D": "Velocity"}, "answer": "A"},
    {"question": "The compressibility factor Z for an ideal gas is:", "difficulty": "hard", "options": {"A": "1", "B": "0", "C": "> 1", "D": "< 1"}, "answer": "A"},
    {"question": "Dalton's Law of partial pressures applies only to:", "difficulty": "hard", "options": {"A": "Non-reacting gas mixtures", "B": "Reacting gases", "C": "Liquids", "D": "All gases"}, "answer": "A"},
    {"question": "Graham's Law of diffusion states that rate of diffusion is inversely proportional to:", "difficulty": "hard", "options": {"A": "Square root of molecular mass", "B": "Temperature", "C": "Pressure", "D": "Density"}, "answer": "A"},
    {"question": "Critical temperature (Tc) is the temperature above which:", "difficulty": "hard", "options": {"A": "A gas cannot be liquefied however high the pressure", "B": "Gas becomes liquid", "C": "Gas becomes solid", "D": "Liquid boils"}, "answer": "A"},
    {"question": "Boyle's temperature (Tb) is the temperature at which a real gas:", "difficulty": "hard", "options": {"A": "Behaves ideally over an appreciable range of pressure", "B": "Liquefies", "C": "Freezes", "D": "Boils"}, "answer": "A"},
    {"question": "Kinetic energy of 1 mole of an ideal gas is:", "difficulty": "hard", "options": {"A": "3/2 RT", "B": "1/2 mv^2", "C": "RT", "D": "3/2 kT"}, "answer": "A"},
    {"question": "Average kinetic energy of gas molecules is directly proportional to:", "difficulty": "hard", "options": {"A": "Absolute temperature", "B": "Pressure", "C": "Volume", "D": "Molecular weight"}, "answer": "A"},
    {"question": "Root mean square (RMS) velocity of gas molecules is given by:", "difficulty": "hard", "options": {"A": "sqrt(3RT/M)", "B": "sqrt(2RT/M)", "C": "sqrt(8RT/piM)", "D": "3RT/M"}, "answer": "A"},
    {"question": "The SI unit of surface tension is:", "difficulty": "hard", "options": {"A": "N m-1", "B": "N m", "C": "J m-2", "D": "Both A and C"}, "answer": "D"},
    {"question": "Viscosity of liquids ______ with increase in temperature.", "difficulty": "hard", "options": {"A": "Decreases", "B": "Increases", "C": "Stays constant", "D": "Becomes zero"}, "answer": "A"},
    {"question": "The total pressure of a mixture of 4g H2 and 16g O2 in a 1L vessel at 0\u00b0C is ______ atm.", "difficulty": "hard", "options": {"A": "56.0", "B": "22.4", "C": "11.2", "D": "1.0"}, "answer": "A"},
    {"question": "Universal gas constant R has value of 0.0821 in units of:", "difficulty": "hard", "options": {"A": "L atm K-1 mol-1", "B": "J K-1 mol-1", "C": "cal K-1 mol-1", "D": "erg"}, "answer": "A"},
    {"question": "The value of Z < 1 for a gas at moderate pressure indicates that:", "difficulty": "hard", "options": {"A": "Attractive forces are dominant", "B": "Repulsive forces are dominant", "C": "Gas is ideal", "D": "Gas is solid"}, "answer": "A"},
    {"question": "Surface tension of a liquid is due to:", "difficulty": "hard", "options": {"A": "Imbalance of intermolecular forces at the surface", "B": "Vapor pressure", "C": "Gravity", "D": "Viscosity"}, "answer": "A"},
    {"question": "Vapor pressure of a liquid ______ with increase in temperature.", "difficulty": "hard", "options": {"A": "Increases exponentially", "B": "Decreases", "C": "Increases linearly", "D": "Stays same"}, "answer": "A"},
    {"question": "The temperature at which vapor pressure of liquid equals atmospheric pressure is:", "difficulty": "hard", "options": {"A": "Boiling point", "B": "Freezing point", "C": "Critical point", "D": "Flash point"}, "answer": "A"},
    {"question": "Which of the following has highest viscosity?", "difficulty": "hard", "options": {"A": "Glycerol", "B": "Water", "C": "Ethanol", "D": "Ether"}, "answer": "A"},
    {"question": "For a gas, P.V = constant at constant T is ______ Law.", "difficulty": "hard", "options": {"A": "Boyle's", "B": "Charles'", "C": "Avogadro's", "D": "Gay-Lussac's"}, "answer": "A"},
    {"question": "Molecular velocity order: v_rms ______ v_avg ______ v_most_probable.", "difficulty": "hard", "options": {"A": "> , >", "B": "< , <", "C": "> , <", "D": "All same"}, "answer": "A"},
    {"question": "Value of Tc for a gas is ______.", "difficulty": "hard", "options": {"A": "8a/27Rb", "B": "a/Rb", "C": "3b", "D": "8b/27Ra"}, "answer": "A"},
    {"question": "Liquefaction of gases was first studied extensively by:", "difficulty": "hard", "options": {"A": "Andrews", "B": "Boyle", "C": "Charles", "D": "Einstein"}, "answer": "A"},
    {"question": "Which of the following is not a property of gases?", "difficulty": "hard", "options": {"A": "High density", "B": "Compressibility", "C": "Diffusion", "D": "Exerting pressure in all directions"}, "answer": "A"}
]

stoichiometry_qs = [
    {"question": "The number of atoms in 0.1 mole of a triatomic gas is:", "difficulty": "hard", "options": {"A": "1.806 x 10^23", "B": "6.023 x 10^22", "C": "6.023 x 10^23", "D": "10^23"}, "answer": "A"},
    {"question": "Empirical formula of Glucose (C6H12O6) is:", "difficulty": "hard", "options": {"A": "CH2O", "C": "CHO", "D": "C6H12O6", "B": "CH3O"}, "answer": "A"},
    {"question": "One mole of CO2 at STP occupies:", "difficulty": "hard", "options": {"A": "22.4 L", "B": "11.2 L", "C": "44 g", "D": "Both A and C"}, "answer": "D"},
    {"question": "The reactant that stays in excess and does not limit product formation is:", "difficulty": "hard", "options": {"A": "Excess reagent", "B": "Limiting reagent", "C": "Catalyst", "D": "Inert"}, "answer": "A"},
    {"question": "What is the normality of 0.5 M H2SO4?", "difficulty": "hard", "options": {"A": "1.0 N", "B": "0.5 N", "C": "0.25 N", "D": "2.0 N"}, "answer": "A"},
    {"question": "Mass of one atom of Carbon-12 is exactly:", "difficulty": "hard", "options": {"A": "1.99 x 10^-23 g", "B": "12 g", "C": "1 g", "D": "12 amu"}, "answer": "D"},
    {"question": "Avogadro Number (NA) is:", "difficulty": "hard", "options": {"A": "6.022 x 10^23 mol-1", "B": "6.626 x 10^-34", "C": "3 x 10^8", "D": "1.6 x 10^-19"}, "answer": "A"},
    {"question": "The percentage of Oxygen in NaOH (Molar mass 40) is:", "difficulty": "hard", "options": {"A": "40%", "B": "10%", "C": "16%", "D": "60%"}, "answer": "A"},
    {"question": "Equivalent weight of KMnO4 in acidic medium is:", "difficulty": "hard", "options": {"A": "M/5", "B": "M/3", "C": "M/1", "D": "M/2"}, "answer": "A"},
    {"question": "Oxidation state of Cr in K2Cr2O7 is:", "difficulty": "hard", "options": {"A": "+6", "B": "+3", "C": "+7", "D": "+4"}, "answer": "A"},
    {"question": "The number of water molecules in 18 mL of water (density = 1 g/mL) is:", "difficulty": "hard", "options": {"A": "6.022 x 10^23", "B": "10^23", "C": "18 x 10^23", "D": "1000"}, "answer": "A"},
    {"question": "Molarity of pure water is:", "difficulty": "hard", "options": {"A": "55.5 M", "B": "18 M", "C": "1 M", "D": "None"}, "answer": "A"},
    {"question": "Number of moles in 44.8 L of O2 at STP is:", "difficulty": "hard", "options": {"A": "2", "B": "1", "C": "0.5", "D": "4"}, "answer": "A"},
    {"question": "Molar mass of a gas is double its ______.", "difficulty": "hard", "options": {"A": "Vapor density", "B": "Density", "C": "Atomic mass", "D": "Volume"}, "answer": "A"},
    {"question": "Mole fraction is a ratio and thus has units of:", "difficulty": "hard", "options": {"A": "No units", "B": "mol/L", "C": "mol/kg", "D": "g/mol"}, "answer": "A"},
    {"question": "Stoichiometry deals with ______ relationship between reactants and products.", "difficulty": "hard", "options": {"A": "Quantitative", "B": "Qualitative", "C": "Time", "D": "Color"}, "answer": "A"},
    {"question": "Law of multiple proportions was given by:", "difficulty": "hard", "options": {"A": "Dalton", "B": "Lavoisier", "C": "Proust", "D": "Gay-Lussac"}, "answer": "A"},
    {"question": "Which of the following follows Law of definite proportions?", "difficulty": "hard", "options": {"A": "Pure water from any source always contains H and O in 2:16 mass ratio", "B": "CO and CO2", "C": "Air", "D": "Soil"}, "answer": "A"},
    {"question": "The number of significant figures in 0.0025 is:", "difficulty": "hard", "options": {"A": "2", "B": "4", "C": "3", "D": "5"}, "answer": "A"},
    {"question": "Rounding off 2.345 to three significant figures gives:", "difficulty": "hard", "options": {"A": "2.34", "B": "2.35", "C": "2.3", "D": "2.345"}, "answer": "A"},
    {"question": "If n mole of a gas A are mixed with m mole of gas B, mole fraction of A is:", "difficulty": "hard", "options": {"A": "n / (n+m)", "B": "n/m", "C": "m/n", "D": "1"}, "answer": "A"},
    {"question": "One amu is equal to ______ g.", "difficulty": "hard", "options": {"A": "1.66 x 10^-24", "B": "1", "C": "12", "D": "6.022 x 10^23"}, "answer": "A"},
    {"question": "Combining volumes of gases at same T and P follow simple ratios. This is ______ Law.", "difficulty": "hard", "options": {"A": "Gay-Lussac's", "B": "Avogadro's", "C": "Charles'", "D": "Boyle's"}, "answer": "A"},
    {"question": "Gram molecular mass of O2 is:", "difficulty": "hard", "options": {"A": "32 g", "B": "16 g", "C": "32 amu", "D": "16 amu"}, "answer": "A"},
    {"question": "The oxidation number of Mn in KMnO4 is:", "difficulty": "hard", "options": {"A": "+7", "B": "+6", "C": "+5", "D": "+4"}, "answer": "A"},
    {"question": "Percentage of Nitrogen in Urea (NH2CONH2) is about:", "difficulty": "hard", "options": {"A": "46.6%", "B": "30%", "C": "25%", "D": "60%"}, "answer": "A"},
    {"question": "Number of significant figures in 126,000 is ______.", "difficulty": "hard", "options": {"A": "3", "B": "6", "C": "5", "D": "Infinite"}, "answer": "A"},
    {"question": "Volume of 1g Hydrogen gas at STP is:", "difficulty": "hard", "options": {"A": "11.2 L", "B": "22.4 L", "C": "5.6 L", "D": "1 L"}, "answer": "A"},
    {"question": "Equivalent mass of Carbon in CO2 is:", "difficulty": "hard", "options": {"A": "3", "B": "12", "C": "6", "D": "4"}, "answer": "A"},
    {"question": "Limiting reagent in reaction of 2g H2 and 2g O2 to form H2O is:", "difficulty": "hard", "options": {"A": "O2", "B": "H2", "C": "Neither", "D": "H2O"}, "answer": "A"}
]

atomic_structure_qs = [
    {"question": "The number of radial nodes in 3p orbital is:", "difficulty": "hard", "options": {"A": "1", "B": "2", "C": "0", "D": "3"}, "answer": "A"},
    {"question": "Heisenberg's Uncertainty Principle is represented as:", "difficulty": "hard", "options": {"A": "delta_x . delta_p >= h / (4*pi)", "B": "E = h.nu", "C": "lambda = h/p", "D": "E = mc^2"}, "answer": "A"},
    {"question": "Quantum number which specifies the shape of the orbital is:", "difficulty": "hard", "options": {"A": "Azimuthal (l)", "B": "Principal (n)", "C": "Magnetic (m)", "D": "Spin (s)"}, "answer": "A"},
    {"question": "For n=3, the total number of orbitals is:", "difficulty": "hard", "options": {"A": "9", "B": "3", "C": "6", "D": "18"}, "answer": "A"},
    {"question": "The electronic configuration of Chromium (Z=24) is:", "difficulty": "hard", "options": {"A": "[Ar] 3d5 4s1", "B": "[Ar] 3d4 4s2", "C": "[Ar] 3d6", "D": "[Ar] 4s2"}, "answer": "A"},
    {"question": "Which of the following is the correct order of orbital filling (Aufbau principle)?", "difficulty": "hard", "options": {"A": "4s < 3d < 4p", "B": "3d < 4s < 4p", "C": "4s < 4p < 3d", "D": "3p < 3d < 4s"}, "answer": "A"},
    {"question": "The de-Broglie wavelength (lambda) of a particle is:", "difficulty": "hard", "options": {"A": "h / mv", "B": "mv / h", "C": "h . mv", "D": "mv^2 / 2"}, "answer": "A"},
    {"question": "Which transition in Hydrogen atom spectrum emits light in visible region?", "difficulty": "hard", "options": {"A": "Balmer series", "B": "Lyman series", "C": "Paschen series", "D": "Bracket series"}, "answer": "A"},
    {"question": "The radius of n-th Bohr orbit of H-atom is proportional to:", "difficulty": "hard", "options": {"A": "n^2", "B": "n", "C": "1/n", "D": "sqrt(n)"}, "answer": "A"},
    {"question": "According to Pauli Exclusion Principle, an orbital can have maximum ______ electrons with ______ spins.", "difficulty": "hard", "options": {"A": "2, Opposite", "B": "2, Parallel", "C": "1, Clockwise", "D": "Infinite"}, "answer": "A"},
    {"question": "Hund's Rule states that pairing of electrons in p, d, f orbitals begins when:", "difficulty": "hard", "options": {"A": "Each orbital of the subshell is half-filled", "B": "First orbital is two-filled", "C": "Atom is ionized", "D": "Random"}, "answer": "A"},
    {"question": "The value of Planck's constant 'h' is:", "difficulty": "hard", "options": {"A": "6.626 x 10^-34 J s", "B": "3 x 10^8", "C": "9.1 x 10^-31", "D": "1.6 x 10^-19"}, "answer": "A"},
    {"question": "Which species is isoelectronic with Ne?", "difficulty": "hard", "options": {"A": "Na+", "B": "Mg2+", "C": "O2-", "D": "All of the above"}, "answer": "D"},
    {"question": "The energy of an electron in an orbital is determined by ______ for multi-electron atoms.", "difficulty": "hard", "options": {"A": "(n + l) rule", "B": "Only n", "C": "Only l", "D": "Spin"}, "answer": "A"},
    {"question": "Photoelectric effect was explained by Einstein using the concept of:", "difficulty": "hard", "options": {"A": "Photons (Quantization of energy)", "B": "Electrons", "C": "X-rays", "D": "Waves"}, "answer": "A"},
    {"question": "Cathode rays consist of:", "difficulty": "hard", "options": {"A": "Electrons", "B": "Protons", "C": "Neutrons", "D": "Positrons"}, "answer": "A"},
    {"question": "Rutherford's alpha-scattering experiment led to the discovery of:", "difficulty": "hard", "options": {"A": "Nucleus", "B": "Electron", "C": "Proton", "D": "Neutron"}, "answer": "A"},
    {"question": "Maximum number of electrons in a subshell is given by:", "difficulty": "hard", "options": {"A": "2(2l + 1)", "B": "2n^2", "C": "2l + 1", "D": "n^2"}, "answer": "A"},
    {"question": "The wavelength of Lyman series limit is:", "difficulty": "hard", "options": {"A": "1 / RH", "B": "RH", "C": "4 / RH", "D": "9 / RH"}, "answer": "A"},
    {"question": "Energy of n-th orbit of H-atom is En = ______.", "difficulty": "hard", "options": {"A": "-13.6 / n^2 eV", "B": "-21.8 x 10^-19 / n^2 J", "C": "-313.6 / n^2 kcal", "D": "All of the above"}, "answer": "D"},
    {"question": "Which of the following is not possible?", "difficulty": "hard", "options": {"A": "2d", "B": "2p", "C": "3f", "D": "Both A and C"}, "answer": "D"},
    {"question": "The orbital angular momentum for s-orbital is:", "difficulty": "hard", "options": {"A": "Zero", "B": "h / 2*pi", "C": "sqrt(2) h / 2*pi", "D": "1"}, "answer": "A"},
    {"question": "Size of orbital is determined by ______ quantum number.", "difficulty": "hard", "options": {"A": "Principal (n)", "B": "Azimuthal", "C": "Magnetic", "D": "Spin"}, "answer": "A"},
    {"question": "Number of angular nodes in d-orbital is:", "difficulty": "hard", "options": {"A": "2", "B": "1", "C": "0", "D": "3"}, "answer": "A"},
    {"question": "The wave function Ψ (psi) in Schrodinger equation represents:", "difficulty": "hard", "options": {"A": "Probability amplitude of finding an electron", "B": "Position", "C": "Velocity", "D": "Charge"}, "answer": "A"},
    {"question": "Which principle limits the number of electrons in an atom?", "difficulty": "hard", "options": {"A": "Pauli Exclusion Principle", "B": "Aufbau Principle", "C": "Hund's Rule", "D": "Uncertainty Principle"}, "answer": "A"},
    {"question": "A photon of frequency nu has energy E = h.nu. What is its momentum?", "difficulty": "hard", "options": {"A": "h / lambda", "B": "h.nu / c", "C": "Both A and B", "D": "mc"}, "answer": "C"}
]

add_questions('thermodynamics.json', thermodynamics_qs)
add_questions('solutions.json', solutions_qs)
add_questions('states_of_matter.json', states_of_matter_qs)
add_questions('stoichiometry.json', stoichiometry_qs)
add_questions('atomic_structure.json', atomic_structure_qs)
