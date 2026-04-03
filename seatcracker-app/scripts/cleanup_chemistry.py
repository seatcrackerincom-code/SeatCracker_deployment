import os
import json

src_dir = 'public/questions_v2/chemistry'
out_dir = 'public/questions_v2/chemistry_clean'
os.makedirs(out_dir, exist_ok=True)

# 23-Topic Syllabus Map (filenames)
chem_map = {
    "p_block_elements": ["13th_group_boron_family.json", "14th_group_carbon_family.json", "16th_group.json", "17th_group.json", "18th_group.json"],
    "hydrocarbons": ["hydro_carbons.json", "benzene_aromatic_hydro_carbon.json"],
    "atomic_structure": ["atomic_structure.json"],
    "chemical_bonding": ["chemical_bonding.json"],
    "basic_organic_principles": ["genrel_organic_chemistry_goc.json"],
    "coordination_compounds": ["co_ordination_compounds.json"],
    "electrochemistry_redox": ["chemical_kinetics_electro_chemistry.json"],
    "thermodynamics": ["thermodynamics.json"],
    "chemical_equilibrium": ["chemical_equilibrium_ionic_equilibrium.json"],
    "periodic_classification": ["classification_of_elements_and_periodic_table.json"],
    "aldehydes_ketones_carboxylic_acids": ["carbonyl_compounds.json", "carboxylic_acids_and_derivations.json"],
    "d_f_block_elements": ["d_f_block_elements.json"],
    "alcohols_phenols_ethers": ["organic_compound_containing_c_h_o.json"],
    "chemical_kinetics": ["chemical_kinetics_electro_chemistry.json"],
    "solutions": ["solutions.json"],
    "solid_state": ["solid_state.json"],
    "stoichiometry_mole_concept": ["stoichiometry.json"],
    "states_of_matter": ["states_of_matter.json"],
    "haloalkanes_haloarenes": ["halo_alkanes_halo_arenes.json"],
    "nitrogen_organic_compounds": ["organic_compound_containing_nitrogen.json"],
    "surface_chemistry": ["surface_chemistry.json"],
    "polymers_biomolecules": ["polymers.json", "biomolecules.json", "chemistry_in_everyday_life.json"],
    "environmental_chemistry": [], # New
    "metallurgy_s_block": ["principles_of_extractive_metallurgy.json", "s_block_elements.json", "hydrogen_and_its_compounds.json"]
}

for out_name, src_files in chem_map.items():
    all_q = []
    for sf in src_files:
        p = os.path.join(src_dir, sf)
        if os.path.exists(p):
            with open(p, 'r', encoding='utf-8') as f:
                data = json.load(f)
                all_q.extend(data['questions'])
    
    # Simple deduplication by question text
    unique_q = {}
    for q in all_q:
        unique_q[q['question']] = q
        
    final_q = list(unique_q.values())
    # Re-index
    for idx, q in enumerate(final_q):
        q['id'] = idx + 1
        
    result = {
        "subject": "Chemistry",
        "topic": out_name.replace("_", " ").title(),
        "questions": final_q
    }
    
    with open(os.path.join(out_dir, f"{out_name}.json"), 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2)

print("Chemistry consolidation complete. Files in /chemistry_clean/")
