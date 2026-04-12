import json

syll_path = r'c:\Users\admin\OneDrive\Desktop\SeatCracker\SYLLABUS\questions\chemistry.json'

with open(syll_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Mapping derived from user request
weights = {
    "Thermodynamics": ("High", 2),
    "Chemical Thermodynamics": ("High", 2),
    "Chemical Kinetics": ("High", 2),
    "States of Matter": ("High", 2),
    "Biomolecules": ("High", 2),
    "Polymers & Biomolecules": ("High", 2), # Biomolecules is High
    "Chemical Equilibrium": ("High", 2),
    "Solutions": ("High", 2),
    "Atomic Structure": ("High", 2),
    "Haloalkanes & Haloarenes": ("High", 2),
    "Surface Chemistry": ("High", 2),
    "Chemical Bonding": ("High", 2),
    "Chemical Bonding & Molecular Structure": ("High", 2),
    
    "Carbon Family": ("Medium", 1),
    "Periodic Table": ("Medium", 1),
    "Classification of Elements & Periodicity": ("Medium", 1),
    "d & f Block": ("Medium", 1),
    "D & F Block Elements": ("Medium", 1),
    "Coordination Compounds": ("Medium", 1),
    "Organic (C, H, O)": ("Medium", 1),
    "Alcohols, Phenols & Ethers": ("Medium", 1),
    "Carbonyl Compounds": ("Medium", 1),
    "Aldehydes, Ketones & Carboxylic Acids": ("Medium", 1),
    "Carboxylic Acids": ("Medium", 1),
    "Hydrocarbons": ("Medium", 1),
    "Nitrogen Compounds": ("Medium", 1),
    "Organic Compounds with Nitrogen": ("Medium", 1),
    "Polymers": ("Medium", 1),
    "Metallurgy": ("Medium", 1),
    "General Principles of Metallurgy": ("Medium", 1),
    "s-Block Elements": ("Medium", 1),
    "S-Block Elements": ("Medium", 1),
    "Stoichiometry": ("Medium", 1),
    "Stoichiometry & Mole Concept": ("Medium", 1),
    "GOC": ("Medium", 1),
    "Some Basic Principles of Organic Chemistry": ("Medium", 1),
    "Everyday Chemistry": ("Medium", 1),
    "Chemistry in Everyday Life": ("Medium", 1),
    "Hydrogen": ("Medium", 1),
    "Hydrogen & its Compounds": ("Medium", 1),
    "Boron Family": ("Medium", 1),
    "Solid State": ("Medium", 1),
}

# Low topics (0 Q)
low_topics = ["p-block", "p-Block Elements", "P-Block Elements (Groups 13-18)", "Electrochemistry", "Environmental Chemistry"]

for topic in data:
    name = topic.get('topic_name')
    if name in weights:
        priority, weight = weights[name]
        topic['priority'] = priority
        topic['weightage'] = weight
        print(f"Updated {name} -> {priority} ({weight} Q)")
    elif any(low in name for low in low_topics):
        topic['priority'] = "Low"
        topic['weightage'] = 0
        print(f"Updated {name} -> Low (0 Q)")
    else:
        # Fallback for any missed
        topic['priority'] = "Low"
        topic['weightage'] = 0
        print(f"Defaulting {name} -> Low (0 Q)")

with open(syll_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4)

print("Syllabus weights updated successfully.")
