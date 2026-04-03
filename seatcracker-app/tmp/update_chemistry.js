const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app';
const syllabusDir = path.join(baseDir, 'public/SYLLABUS');

// ── New Chemistry Syllabus (user-defined) ──────────────────────────────────
const newChemistry = [
  // HIGH (weight 2)
  { chapter: "Thermodynamics",          topic_slug: "thermodynamics",                ap: 2, ts: 2, priority: "High",   subtopics: ["Laws of Thermodynamics", "Enthalpy & Entropy", "Gibbs Energy, Spontaneity"] },
  { chapter: "Chemical Kinetics",       topic_slug: "chemical_kinetics",             ap: 2, ts: 2, priority: "High",   subtopics: ["Rate of Reaction, Rate Laws", "Activation Energy, Arrhenius Equation", "First & Second Order Reactions"] },
  { chapter: "States of Matter",        topic_slug: "states_of_matter",              ap: 2, ts: 2, priority: "High",   subtopics: ["Kinetic Theory of Gases", "Gas Laws", "Real Gases, van der Waals"] },
  { chapter: "Biomolecules",            topic_slug: "biomolecules",                  ap: 2, ts: 2, priority: "High",   subtopics: ["Carbohydrates", "Proteins & Amino Acids", "Nucleic Acids, DNA & RNA"] },
  { chapter: "Chemical Equilibrium",    topic_slug: "chemical_equilibrium",          ap: 2, ts: 2, priority: "High",   subtopics: ["Le Chatelier's Principle", "Kc and Kp", "Ionic Equilibrium, pH, Buffers"] },
  { chapter: "Solutions",               topic_slug: "solutions",                     ap: 2, ts: 2, priority: "High",   subtopics: ["Concentration Terms", "Raoult's Law, Colligative Properties", "Van't Hoff Factor"] },
  { chapter: "Atomic Structure",        topic_slug: "atomic_structure",              ap: 2, ts: 2, priority: "High",   subtopics: ["Bohr's Model, Quantum Numbers", "Orbitals, Electronic Configuration", "Aufbau, Hund's Rule, Pauli Principle"] },
  { chapter: "Haloalkanes & Haloarenes", topic_slug: "haloalkanes_haloarenes",       ap: 2, ts: 2, priority: "High",   subtopics: ["Nucleophilic Substitution (SN1, SN2)", "Elimination Reactions", "Uses of Halogen Compounds"] },
  { chapter: "Surface Chemistry",       topic_slug: "surface_chemistry",             ap: 2, ts: 2, priority: "High",   subtopics: ["Adsorption & Absorption", "Colloids & Emulsions", "Catalysis"] },
  { chapter: "Chemical Bonding",        topic_slug: "chemical_bonding",              ap: 2, ts: 2, priority: "High",   subtopics: ["Ionic, Covalent, Metallic Bonding", "VSEPR Theory, Hybridization", "Molecular Orbital Theory"] },

  // MEDIUM (weight 1)
  { chapter: "Carbon Family",           topic_slug: "carbon_family",                 ap: 1, ts: 1, priority: "Medium", subtopics: ["Allotropes of Carbon", "Compounds of Carbon, Silicon", "Properties & Uses"] },
  { chapter: "Periodic Table",          topic_slug: "periodic_table",                ap: 1, ts: 1, priority: "Medium", subtopics: ["Periodic Trends (IE, EA, EN, Radius)", "s, p, d, f Block Overview", "Anomalous Properties"] },
  { chapter: "d & f Block",             topic_slug: "d_f_block",                     ap: 1, ts: 1, priority: "Medium", subtopics: ["Transition Metals Properties", "Lanthanides & Actinides", "KMnO4, K2Cr2O7 Reactions"] },
  { chapter: "Coordination Compounds",  topic_slug: "coordination_compounds",        ap: 1, ts: 1, priority: "Medium", subtopics: ["Ligands & Complex Formation", "IUPAC Naming", "Crystal Field Theory, Isomerism"] },
  { chapter: "Organic (C, H, O)",       topic_slug: "organic_c_h_o",                ap: 1, ts: 1, priority: "Medium", subtopics: ["Alcohols, Phenols, Ethers", "Preparation & Properties", "Lucas Test, Victor Meyer Test"] },
  { chapter: "Carbonyl Compounds",      topic_slug: "carbonyl_compounds",            ap: 1, ts: 1, priority: "Medium", subtopics: ["Aldehydes & Ketones", "Nucleophilic Addition Reactions", "Aldol, Cannizzaro Reactions"] },
  { chapter: "Carboxylic Acids",        topic_slug: "carboxylic_acids",              ap: 1, ts: 1, priority: "Medium", subtopics: ["Preparation & Properties", "Esterification", "Acidity & Reactions"] },
  { chapter: "Hydrocarbons",            topic_slug: "hydrocarbons",                  ap: 1, ts: 1, priority: "Medium", subtopics: ["Alkanes, Alkenes, Alkynes", "Aromatic Hydrocarbons (Benzene)", "Addition, Substitution Reactions"] },
  { chapter: "Nitrogen Compounds",      topic_slug: "nitrogen_compounds",            ap: 1, ts: 1, priority: "Medium", subtopics: ["Amines (Classification, Properties)", "Diazonium Salts", "Cyanides & Isocyanides"] },
  { chapter: "Polymers",                topic_slug: "polymers",                      ap: 1, ts: 1, priority: "Medium", subtopics: ["Addition & Condensation Polymers", "Natural & Synthetic Polymers", "Properties & Uses"] },
  { chapter: "Metallurgy",              topic_slug: "metallurgy",                    ap: 1, ts: 1, priority: "Medium", subtopics: ["Ore Extraction Methods", "Refining Techniques", "Thermodynamics of Metallurgy"] },
  { chapter: "s-Block Elements",        topic_slug: "s_block_elements",              ap: 1, ts: 1, priority: "Medium", subtopics: ["Alkali Metals (Group 1)", "Alkaline Earth Metals (Group 2)", "Compounds: NaOH, Na2CO3, CaCO3"] },
  { chapter: "Stoichiometry",           topic_slug: "stoichiometry",                 ap: 1, ts: 1, priority: "Medium", subtopics: ["Mole & Avogadro's Number", "Limiting Reagent, % Yield", "Empirical & Molecular Formula"] },
  { chapter: "GOC",                     topic_slug: "goc",                           ap: 1, ts: 1, priority: "Medium", subtopics: ["Functional Groups, IUPAC Naming", "Isomerism (Structural, Stereo)", "Reaction Mechanisms"] },
  { chapter: "Everyday Chemistry",      topic_slug: "everyday_chemistry",            ap: 1, ts: 1, priority: "Medium", subtopics: ["Soaps & Detergents", "Medicines, Drugs", "Food Preservatives & Dyes"] },
  { chapter: "Hydrogen",                topic_slug: "hydrogen",                      ap: 1, ts: 1, priority: "Medium", subtopics: ["Preparation & Properties of H2", "Water & Heavy Water", "Hydrogen Peroxide"] },
  { chapter: "Boron Family",            topic_slug: "boron_family",                  ap: 1, ts: 1, priority: "Medium", subtopics: ["Boron & Compounds", "Aluminium & Al2O3", "Properties & Uses"] },
  { chapter: "Solid State",             topic_slug: "solid_state",                   ap: 1, ts: 1, priority: "Medium", subtopics: ["Crystal Systems, Unit Cell", "Packing Efficiency", "Defects in Crystals"] },

  // LOW (weight 0 — kept at bottom, no question bank)
  { chapter: "p-Block Elements",        topic_slug: "p_block_elements",              ap: 0, ts: 0, priority: "Low",    subtopics: ["Groups 13-18 Overview", "Important Compounds & Reactions"] },
];

// ── Write to master newjeons file ─────────────────────────────────────────
const masterPath = path.join(syllabusDir, 'newjeons/EAMCET_Chemistry_Syllabus.json');
const masterObj = {
  subject: "Chemistry",
  stream: "MPC + BiPC (Both Streams)",
  exam: "AP EAPCET / TS EAMCET",
  total_chapters: newChemistry.length,
  chapters: newChemistry
};
fs.writeFileSync(masterPath, JSON.stringify(masterObj, null, 2), 'utf8');
console.log('[MASTER] Updated EAMCET_Chemistry_Syllabus.json');

// ── Inject into all Chemistry syllabus files (AP/TS × Eng/Agri/Pharmacy) ─
const states = ['AP', 'TS'];
const streams = ['Engineering', 'Agriculture', 'Pharmacy'];

states.forEach(state => {
  streams.forEach(stream => {
    const p = path.join(syllabusDir, state, stream, 'Chemistry', 'Chemistry.json');
    if (fs.existsSync(p)) {
      fs.writeFileSync(p, JSON.stringify(newChemistry, null, 2), 'utf8');
      console.log(`[UPDATED] ${state}/${stream}/Chemistry`);
    }
  });
});

console.log('\n--- CHEMISTRY SYLLABUS UPDATE COMPLETE ---');
console.log(`High (2q): ${newChemistry.filter(c=>c.priority==='High').length} topics`);
console.log(`Medium (1q): ${newChemistry.filter(c=>c.priority==='Medium').length} topics`);
console.log(`Low (0q): ${newChemistry.filter(c=>c.priority==='Low').length} topics`);
