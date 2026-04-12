import json
import os

# 1. Physics Data (31 Topics)
physics_data = [
    {"chapter": "THERMODYNAMICS", "ap": 4, "priority": "High", "subtopics": ["Zeroth, First & Second Laws", "Heat Engines and Refrigerators", "Carnot Cycle & Efficiency"]},
    {"chapter": "SYSTEM OF PARTICLES AND ROTATORY MOTION", "ap": 3, "priority": "High", "subtopics": ["Centre of Mass of Rigid Bodies", "Moment of Force (Torque) & Angular Momentum", "Equilibrium of Rigid Bodies", "Rolling Motion"]},
    {"chapter": "MOVING CHARGES AND MAGNETISM", "ap": 3, "priority": "High", "subtopics": ["Biot-Savart Law", "Ampere’s Circuital Law", "Force on Moving Charges", "Cyclotron & Galvanometer"]},
    {"chapter": "WORK POWER ENERGY", "ap": 3, "priority": "High", "subtopics": ["Work-Energy Theorem", "Potential Energy of Spring", "Conservative Forces", "Collisions (1D/2D)"]},
    {"chapter": "OSCILLATIONS", "ap": 2, "priority": "High", "subtopics": ["Simple Harmonic Motion", "Simple Pendulum", "Energy in SHM", "Damped/Forced Oscillations"]},
    {"chapter": "SEMI CONDUCTORS", "ap": 2, "priority": "High", "subtopics": ["p-n Junction Diode", "Half & Full wave Rectifiers", "Zener Diode", "Logic Gates"]},
    {"chapter": "CURRENT ELECTRICITY", "ap": 3, "priority": "High", "subtopics": ["Ohm’s Law & Drift Velocity", "Kirchhoff’s Rules", "Wheatstone Bridge", "Potentiometer"]},
    {"chapter": "ELECTROSTATIC POTENTIAL AND CAPACITANCE", "ap": 2, "priority": "High", "subtopics": ["Equipotential Surfaces", "Capacitors & Dielectrics", "Energy Stored in Capacitors"]},
    {"chapter": "FRICTION (NEWTONS LAWS OF MOTION)", "ap": 2, "priority": "High", "subtopics": ["Newton's Laws", "Static & Kinetic Friction", "Banking of Roads", "Pulley Systems"]},
    {"chapter": "ATOMIC PHYSICS", "ap": 2, "priority": "High", "subtopics": ["Bohr's Model", "Hydrogen Spectrum", "X-rays Properties"]},
    {"chapter": "ELECTRIC CHARGES AND FIELDS", "ap": 2, "priority": "High", "subtopics": ["Coulomb’s Law", "Electric Field & Dipoles", "Gauss’s Law & Applications"]},
    {"chapter": "THERMAL PROPERTIES - I AND II", "ap": 2, "priority": "High", "subtopics": ["Thermal Expansion", "Calorimetry & Latent Heat", "Heat Transfer (Conduction, Convection, Radiation)"]},
    {"chapter": "KINETIC THEORY OF GASES", "ap": 1, "priority": "Medium", "subtopics": ["Ideal Gas Law", "Law of Equipartition", "RMS Speed & Mean Free Path"]},
    {"chapter": "MOTION IN A STRAIGHT LINE", "ap": 2, "priority": "Medium", "subtopics": ["Velocity & Speed", "Kinematic Equations", "Free Fall & Relative Velocity"]},
    {"chapter": "ALTERNATING CURRENT", "ap": 2, "priority": "Medium", "subtopics": ["LCR Series Circuit & Resonance", "Wattless Current", "Transformers"]},
    {"chapter": "ELECTRO MAGNETIC WAVES", "ap": 1, "priority": "Medium", "subtopics": ["Displacement Current", "EM Spectrum & Uses"]},
    {"chapter": "GRAVITATION", "ap": 2, "priority": "Medium", "subtopics": ["Kepler’s Laws", "Acceleration due to gravity variation", "Escape Velocity & Satellites"]},
    {"chapter": "MECHANICAL PROPERTIES OF FLUIDS", "ap": 1, "priority": "Medium", "subtopics": ["Bernoulli’s Principle", "Surface Tension", "Viscosity & Stokes' Law"]},
    {"chapter": "NUCLEAR PHYSICS", "ap": 1, "priority": "Medium", "subtopics": ["Mass-Energy Relation", "Radioactivity", "Fission & Fusion"]},
    {"chapter": "RAY OPTICS", "ap": 2, "priority": "Medium", "subtopics": ["Spherical Mirrors", "Total Internal Reflection", "Lens Maker’s Formula", "Microscopes & Telescopes"]},
    {"chapter": "UNITS AND MEASUREMENTS", "ap": 1, "priority": "Medium", "subtopics": ["Accuracy & Errors", "Significant Figures", "Dimensional Analysis"]},
    {"chapter": "WAVE OPTICS", "ap": 1, "priority": "Medium", "subtopics": ["Huygens Principle", "Interference & Diffraction", "Polarisation"]},
    {"chapter": "COMMUNICATION SYSTEM", "ap": 1, "priority": "Medium", "subtopics": ["Modulation (AM, FM)", "Antenna Height", "Signal Transmission"]},
    {"chapter": "ELECTRO MAGNETIC INDUCTION", "ap": 1, "priority": "Medium", "subtopics": ["Faraday’s & Lenz’s Laws", "Self & Mutual Inductance", "Eddy Currents"]},
    {"chapter": "MECHANICAL PROPERTIES OF SOLIDS", "ap": 1, "priority": "Low", "subtopics": ["Stress-Strain Relationship", "Hooke’s Law", "Young’s, Bulk & Shear Moduli"]},
    {"chapter": "WAVE MOTION", "ap": 1, "priority": "Low", "subtopics": ["Transverse & Longitudinal Waves", "Superposition & Beats", "Doppler Effect"]},
    {"chapter": "MAGNETISM & MATTER", "ap": 1, "priority": "Low", "subtopics": ["Earth’s Magnetism", "Para, Dia & Ferromagnetism", "Bar Magnet Properties"]},
    {"chapter": "MOTION IN A PLANE", "ap": 2, "priority": "Low", "subtopics": ["Scalars & Vectors", "Projectile Motion", "Uniform Circular Motion"]},
    {"chapter": "DUAL NATURE OF RADIATION & MATTER", "ap": 1, "priority": "Low", "subtopics": ["Photoelectric Effect", "Einstein’s Equation", "Wave Nature of Matter (de Broglie)"]},
    {"chapter": "VECTORS", "ap": 1, "priority": "Low", "subtopics": ["Scalar & Vector Products", "Resolution of Vectors", "Vector Applications"]},
    {"chapter": "COLLISIONS", "ap": 1, "priority": "Low", "subtopics": ["Elastic & Inelastic Collisions", "Coefficient of Restitution"]}
]

# 2. Chemistry Data (23 Topics)
chemistry_data = [
    {"chapter": "P-Block Elements (Groups 13–18)", "ap": 3, "priority": "High", "subtopics": ["Boron, Nitrogen, Oxygen Groups", "Noble Gases", "Important Compounds"]},
    {"chapter": "Hydrocarbons", "ap": 3, "priority": "High", "subtopics": ["Alkanes, Alkenes, Alkynes", "Benzene & Aromaticity", "Named Reactions"]},
    {"chapter": "Atomic Structure", "ap": 2, "priority": "High", "subtopics": ["Bohr's Model & Quantum Numbers", "Electronic Configurations", "Hydrogen Line Spectra"]},
    {"chapter": "Chemical Bonding & Molecular Structure", "ap": 2, "priority": "High", "subtopics": ["VSEPR Theory", "Hybridization & MO Theory", "Ionic & Covalent Bonds"]},
    {"chapter": "Some Basic Principles of Organic Chemistry", "ap": 2, "priority": "High", "subtopics": ["IUPAC Nomenclature", "Isomerism", "SN1, SN2 Mechanisms"]},
    {"chapter": "Coordination Compounds", "ap": 2, "priority": "High", "subtopics": ["Ligands & Werner Theory", "Crystal Field Theory", "IUPAC Naming of Complexes"]},
    {"chapter": "Redox Reactions & Electrochemistry", "ap": 2, "priority": "High", "subtopics": ["Oxidation Number", "Nernst Equation", "Faraday's Laws", "Electrochemical Cells"]},
    {"chapter": "Chemical Thermodynamics", "ap": 2, "priority": "High", "subtopics": ["Hess's Law", "Enthalpy, Entropy & Gibbs Energy", "Laws of Thermodynamics"]},
    {"chapter": "Chemical Equilibrium", "ap": 2, "priority": "High", "subtopics": ["Le Chatelier's Principle", "Kc, Kp & Ionic Equilibrium", "pH & Buffer Solutions"]},
    {"chapter": "Classification of Elements & Periodicity", "ap": 2, "priority": "High", "subtopics": ["Trends in Periodic Table", "Anomalous Properties", "Electronic Blocks (s, p, d, f)"]},
    {"chapter": "Aldehydes, Ketones & Carboxylic Acids", "ap": 2, "priority": "High", "subtopics": ["Named Reactions (Aldol, etc.)", "Preparation & Properties", "Acidic Strength Trends"]},
    {"chapter": "D & F Block Elements", "ap": 2, "priority": "Medium", "subtopics": ["Transition Metal Properties", "Lanthanoid Contraction", "Potassium Permanganate reactions"]},
    {"chapter": "Alcohols, Phenols & Ethers", "ap": 2, "priority": "Medium", "subtopics": ["Primary, Secondary, Tertiary Tests", "Preparation & Industrial uses", "Ether preparation"]},
    {"chapter": "Chemical Kinetics", "ap": 1, "priority": "Medium", "subtopics": ["Rate Laws & Order", "Arrhenius Equation", "Molecularity vs Order"]},
    {"chapter": "Solutions", "ap": 1, "priority": "Medium", "subtopics": ["Raoult's Law", "Colligative Properties", "Van't Hoff Factor"]},
    {"chapter": "Solid State", "ap": 1, "priority": "Medium", "subtopics": ["Crystal Lattices & Defects", "Packing Efficiencies", "Magnetic & Electrical Properties"]},
    {"chapter": "Stoichiometry & Mole Concept", "ap": 1, "priority": "Medium", "subtopics": ["Mole, Molarity, Normality", "Limiting Reagent", "Equivalent Weights"]},
    {"chapter": "States of Matter", "ap": 1, "priority": "Medium", "subtopics": ["Gas Laws & Real Gases", "Kinetic Theory of Gases", "Liquid Properties"]},
    {"chapter": "Haloalkanes & Haloarenes", "ap": 1, "priority": "Medium", "subtopics": ["Preparation from Alcohols/Hydrocarbons", "Reactions of Haloarenes", "Uses & Environmental impacts"]},
    {"chapter": "Organic Compounds with Nitrogen", "ap": 1, "priority": "Medium", "subtopics": ["Amines Preparation & Properties", "Diazonium Salts", "Cyanides & Isocyanides"]},
    {"chapter": "Surface Chemistry", "ap": 1, "priority": "Low", "subtopics": ["Adsorption & Catalysis", "Colloids & Emulsions", "Applications of Adsorption"]},
    {"chapter": "Polymers & Biomolecules", "ap": 1, "priority": "Low", "subtopics": ["Classification of Polymers", "Carbohydrates, Proteins, Nucleic Acids", "Vitamins & Hormones"]},
    {"chapter": "Environmental Chemistry", "ap": 1, "priority": "Low", "subtopics": ["Atmospheric Pollution", "Water & Soil Pollution", "Green Chemistry Principles"]}
]

# 3. Apply to all targets
physics_targets = [
    "public/SYLLABUS/AP/Engineering/Physics/Physics.json",
    "public/SYLLABUS/AP/Agriculture/Physics/Physics.json",
    "public/SYLLABUS/AP/Pharmacy/Physics/Physics.json",
    "public/SYLLABUS/TS/Engineering/Physics/Physics.json",
    "public/SYLLABUS/TS/Agriculture/Physics/Physics.json",
    "public/SYLLABUS/TS/Pharmacy/Physics/Physics.json"
]

chemistry_targets = [
    "public/SYLLABUS/AP/Engineering/Chemistry/Chemistry.json",
    "public/SYLLABUS/AP/Agriculture/Chemistry/Chemistry.json",
    "public/SYLLABUS/AP/Pharmacy/Chemistry/Chemistry.json",
    "public/SYLLABUS/TS/Engineering/Chemistry/Chemistry.json",
    "public/SYLLABUS/TS/Agriculture/Chemistry/Chemistry.json",
    "public/SYLLABUS/TS/Pharmacy/Chemistry/Chemistry.json"
]

for t in physics_targets:
    os.makedirs(os.path.dirname(t), exist_ok=True)
    with open(t, 'w', encoding='utf-8') as f:
        json.dump(physics_data, f, indent=4)

for t in chemistry_targets:
    os.makedirs(os.path.dirname(t), exist_ok=True)
    with open(t, 'w', encoding='utf-8') as f:
        json.dump(chemistry_data, f, indent=4)

print("Standardized Physics and Chemistry metadata.")
