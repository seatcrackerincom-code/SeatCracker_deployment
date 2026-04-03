import json
import os

botany_data = [
    {"chapter": "Biological Classification", "ap": 2, "priority": "High", "subtopics": ["Monera, Protista, Fungi", "Viruses & Viroids"]},
    {"chapter": "Plant Kingdom", "ap": 2, "priority": "High", "subtopics": ["Algae, Bryophytes, Pteridophytes", "Gymnosperms & Angiosperms"]},
    {"chapter": "Morphology of Flowering Plants", "ap": 2, "priority": "High", "subtopics": ["Root, Stem, Leaf", "Inflorescence, Flower, Seed"]},
    {"chapter": "Anatomy of Flowering Plants", "ap": 2, "priority": "High", "subtopics": ["Meristematic Tissues", "Dicot & Monocot Anatomy"]},
    {"chapter": "Sexual Reproduction in Flowering Plants", "ap": 3, "priority": "High", "subtopics": ["Pollination", "Double Fertilization", "Seed Development"]},
    {"chapter": "Photosynthesis", "ap": 2, "priority": "High", "subtopics": ["Light and Dark Reactions", "C3 and C4 Pathways"]},
    {"chapter": "Respiration in Plants", "ap": 2, "priority": "High", "subtopics": ["Glycolysis", "Aerobic Respiration", "TCA Cycle"]},
    {"chapter": "Plant Growth and Development", "ap": 1, "priority": "Medium", "subtopics": ["Growth Regulators", "Photoperiodism"]},
    {"chapter": "Transport in Plants", "ap": 1, "priority": "Medium", "subtopics": ["Osmosis & Plasmolysis", "Transpiration Pull"]},
    {"chapter": "Cell: The Unit of Life", "ap": 2, "priority": "Medium", "subtopics": ["Organelles", "Nucleus", "Ribosomes"]},
    {"chapter": "Cell Cycle and Cell Division", "ap": 2, "priority": "Medium", "subtopics": ["Mitosis Stages", "Meiosis & Crossing Over"]},
    {"chapter": "Genetics: Principles", "ap": 3, "priority": "High", "subtopics": ["Mendelian Inheritance", "Linkage & Mutation"]},
    {"chapter": "Molecular Basis of Inheritance", "ap": 3, "priority": "High", "subtopics": ["DNA Structure", "Transcription & Translation"]},
    {"chapter": "Biotechnology: Principles", "ap": 2, "priority": "High", "subtopics": ["Restriction Enzymes", "Vectors & Cloning"]},
    {"chapter": "Biotechnology and its Applications", "ap": 2, "priority": "Medium", "subtopics": ["Bt Cotton", "Insulin Production"]},
    {"chapter": "Strategies for Enhancement in Food Production", "ap": 1, "priority": "Medium", "subtopics": ["Plant Breeding", "Tissue Culture"]},
    {"chapter": "Microbes in Human Welfare", "ap": 1, "priority": "Low", "subtopics": ["Sewage Treatment", "Antibiotics"]},
    {"chapter": "Organisms and Populations", "ap": 1, "priority": "Low", "subtopics": ["Population Growth", "Interactions"]},
    {"chapter": "Ecosystem", "ap": 1, "priority": "Low", "subtopics": ["Energy Flow", "Ecological Pyramids"]},
    {"chapter": "Biodiversity and its Conservation", "ap": 1, "priority": "Low", "subtopics": ["Conservation Methods", "Hotspots"]},
    {"chapter": "Environmental Issues", "ap": 1, "priority": "Low", "subtopics": ["Air & Water Pollution", "Greenhouse Effect"]}
]

zoology_data = [
    {"chapter": "Animal Kingdom", "ap": 3, "priority": "High", "subtopics": ["Invertebrates", "Chordates Classification"]},
    {"chapter": "Structural Organisation in Animals", "ap": 2, "priority": "High", "subtopics": ["Epithelial Tissue", "Connective Tissue Systems"]},
    {"chapter": "Biomolecules", "ap": 2, "priority": "High", "subtopics": ["Metabolism & Enzymes", "Nucleic Acids Concepts"]},
    {"chapter": "Digestion and Absorption", "ap": 2, "priority": "Medium", "subtopics": ["Alimentary Canal", "Absorption of Nutrients"]},
    {"chapter": "Breathing and Exchange of Gases", "ap": 2, "priority": "Medium", "subtopics": ["Respiratory Volumes", "Transport of Gases"]},
    {"chapter": "Body Fluids and Circulation", "ap": 2, "priority": "High", "subtopics": ["Blood Groups", "Cardiac Cycle & ECG"]},
    {"chapter": "Excretory Products and their Elimination", "ap": 2, "priority": "Medium", "subtopics": ["Urine Formation", "Dialysis & Kidney"]},
    {"chapter": "Locomotion and Movement", "ap": 2, "priority": "Medium", "subtopics": ["Muscle Contraction", "Joints & Skeleton"]},
    {"chapter": "Neural Control and Coordination", "ap": 2, "priority": "Medium", "subtopics": ["Neuron", "Brain & Reflex Action"]},
    {"chapter": "Chemical Coordination and Integration", "ap": 2, "priority": "Medium", "subtopics": ["Endocrine Glands", "Hormones Mechanisms"]},
    {"chapter": "Human Reproduction", "ap": 3, "priority": "High", "subtopics": ["Fertilization", "Menstrual Cycle", "Pregnancy"]},
    {"chapter": "Reproductive Health", "ap": 2, "priority": "Medium", "subtopics": ["STDs", "Birth Control Methods"]},
    {"chapter": "Principles of Inheritance and Variation", "ap": 2, "priority": "High", "subtopics": ["Mendel's Laws", "Gene Interaction"]},
    {"chapter": "Evolution", "ap": 2, "priority": "Medium", "subtopics": ["Darwinian Theory", "Human Evolution Stages"]},
    {"chapter": "Human Health and Disease", "ap": 3, "priority": "High", "subtopics": ["Immunity", "Cancer", "Drug Abuse"]},
    {"chapter": "Strategies for Enhancement in Food Production", "ap": 1, "priority": "Low", "subtopics": ["Animal Husbandry", "Apiculture"]},
    {"chapter": "Biotechnology and its Applications", "ap": 2, "priority": "Medium", "subtopics": ["Gene Therapy", "Transgenic Animals"]},
    {"chapter": "Organisms and Environment", "ap": 1, "priority": "Low", "subtopics": ["Ecology Overview", "Adaptations"]}
]

botany_targets = [
    "public/SYLLABUS/AP/Agriculture/Botany/Botany.json",
    "public/SYLLABUS/AP/Pharmacy/Botany/Botany.json",
    "public/SYLLABUS/TS/Agriculture/Botany/Botany.json",
    "public/SYLLABUS/TS/Pharmacy/Botany/Botany.json"
]

zoology_targets = [
    "public/SYLLABUS/AP/Agriculture/Zoology/Zoology.json",
    "public/SYLLABUS/AP/Pharmacy/Zoology/Zoology.json",
    "public/SYLLABUS/TS/Agriculture/Zoology/Zoology.json",
    "public/SYLLABUS/TS/Pharmacy/Zoology/Zoology.json"
]

for t in botany_targets:
    os.makedirs(os.path.dirname(t), exist_ok=True)
    with open(t, 'w', encoding='utf-8') as f:
        json.dump(botany_data, f, indent=4)

for t in zoology_targets:
    os.makedirs(os.path.dirname(t), exist_ok=True)
    with open(t, 'w', encoding='utf-8') as f:
        json.dump(zoology_data, f, indent=4)

print("Standardized Botany and Zoology metadata.")
