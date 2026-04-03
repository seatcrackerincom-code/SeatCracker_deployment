const fs = require('fs');
const path = require('path');

const chemDir = 'c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app/public/questions_v2/chemistry';

// Map: new slug → existing filename (if different)
const renames = [
  // These new slugs need to point to existing files
  { from: 'chemical_bonding_and_molecular_structure.json', to: 'chemical_bonding.json' },
  { from: 'chemical_thermodynamics.json',                  to: 'thermodynamics.json' },
  { from: 'd_f_block_elements.json',                       to: 'd_f_block.json' },
  { from: 'classification_of_elements_periodicity.json',   to: 'periodic_table.json' }, // periodic_table.json already exists
  { from: 'goc_principles_techniques.json',                to: 'goc.json' },
  { from: 'hydrogen_and_its_compounds.json',               to: 'hydrogen.json' },
  { from: 'organic_compounds_with_nitrogen.json',          to: 'nitrogen_compounds.json' },
  { from: 'stoichiometry_mole_concept.json',               to: 'stoichiometry.json' },
  { from: 'aldehydes_ketones_carboxylic_acids.json',       to: 'carbonyl_compounds.json' }, // carbonyl_compounds slug
  { from: 'environmental_chemistry.json',                  to: 'everyday_chemistry.json' }, // fallback to everyday if env missing
];

// Also ensure organic_c_h_o exists — map from alcohols/phenols if available
const organicSrc = path.join(chemDir, 'alcohols_phenols_ethers.json');
const organicDst = path.join(chemDir, 'organic_c_h_o.json');
if (fs.existsSync(organicSrc) && !fs.existsSync(organicDst)) {
  fs.copyFileSync(organicSrc, organicDst);
  console.log('[COPY] alcohols_phenols_ethers -> organic_c_h_o');
}

// Also create boron_family.json from p_block if missing
const boronSrc = path.join(chemDir, 'p_block_elements.json');
const boronDst = path.join(chemDir, 'boron_family.json');
if (fs.existsSync(boronSrc) && !fs.existsSync(boronDst)) {
  fs.copyFileSync(boronSrc, boronDst);
  console.log('[COPY] p_block_elements -> boron_family');
}

// Also carbon_family from p_block_groups_13_18
const carbonSrc = path.join(chemDir, 'p_block_elements_groups_13_18.json');
const carbonDst = path.join(chemDir, 'carbon_family.json');
if (fs.existsSync(carbonSrc) && !fs.existsSync(carbonDst)) {
  fs.copyFileSync(carbonSrc, carbonDst);
  console.log('[COPY] p_block_elements_groups_13_18 -> carbon_family');
}

// Apply renames (copy source → target if target doesn't exist)
renames.forEach(({from, to}) => {
  const src = path.join(chemDir, from);
  const dst = path.join(chemDir, to);
  if (fs.existsSync(src) && !fs.existsSync(dst)) {
    fs.copyFileSync(src, dst);
    console.log(`[COPY] ${from} -> ${to}`);
  } else if (fs.existsSync(dst)) {
    console.log(`[OK] ${to} already exists`);
  } else {
    console.log(`[MISSING-SRC] ${from}`);
  }
});

// Final audit
const allSlugs = [
  'thermodynamics','chemical_kinetics','states_of_matter','biomolecules',
  'chemical_equilibrium','solutions','atomic_structure','haloalkanes_haloarenes',
  'surface_chemistry','chemical_bonding','carbon_family','periodic_table',
  'd_f_block','coordination_compounds','organic_c_h_o','carbonyl_compounds',
  'carboxylic_acids','hydrocarbons','nitrogen_compounds','polymers',
  'metallurgy','s_block_elements','stoichiometry','goc','everyday_chemistry',
  'hydrogen','boron_family','solid_state'
];

console.log('\n--- CHEMISTRY QUESTION FILE AUDIT ---');
let found = 0, missing = [];
allSlugs.forEach(slug => {
  const p = path.join(chemDir, slug + '.json');
  if (fs.existsSync(p)) { found++; }
  else { missing.push(slug); }
});
console.log(`Found: ${found}/${allSlugs.length}`);
if (missing.length) console.log('Still missing:', missing.join(', '));
else console.log('ALL PERFECT ✅');
