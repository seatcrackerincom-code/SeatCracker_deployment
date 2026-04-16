const fs = require('fs');
const path = require('path');

const rootDir = 'seatcracker-app/public/questions_v2/chemistry';

const taxonomy = {
  "atomic_structure": ["Bohr", "Quantum number", "orbital", "electronic configuration", "de Broglie", "Heisenberg"],
  "biomolecules": ["Glucose", "Carbohydrate", "Amino acid", "Protein", "Vitamin", "Nucleic acid"],
  "chemical_bonding": ["Hybridization", "VSEPR", "Ionic bond", "Covalent bond", "Dipole moment", "Hydrogen bonding"],
  "chemical_equilibrium": ["Le Chatelier", "equilibrium constant", "Kp", "Kc", "pH", "Buffer", "Solubility product"],
  "chemical_kinetics": ["Rate of reaction", "Activation energy", "First order", "Zero order", "Catalyst", "Arrhenius"],
  "coordination_compounds": ["Ligand", "Coordination number", "Werner", "Crystal field", "CFT", "VBT"],
  "electrochemistry_redox": ["Galvanic cell", "Nernst equation", "Faraday", "Conductivity", "Redox", "Electrolysis"],
  "environmental_chemistry": ["Pollution", "Ozone", "Greenhouse", "Smog", "Acid rain"],
  "everyday_chemistry": ["Analgesic", "Antipyretic", "Antibiotic", "Soap", "Detergent"],
  "goc": ["Inductive effect", "Resonance", "Hyperconjugation", "Electrophile", "Nucleophile", "Isomerism"],
  "hydrocarbons": ["Alkane", "Alkene", "Alkyne", "Benzene", "Aromatic", "Methane", "Ethane"],
  "periodic_table": ["Atomic radius", "Ionization enthalpy", "Electronegativity", "Mendeleev", "Modern periodic"],
  "polymers": ["Monomer", "Nylon", "Polythene", "Bakelite", "Rubber", "PVC"],
  "solid_state": ["Crystal lattice", "Unit cell", "Bragg", "Schottky", "Frenkel", "Packing efficiency"],
  "solutions": ["Molarity", "Molality", "Raoult", "Colligative property", "Osmotic pressure", "Vapor pressure"],
  "states_of_matter": ["Ideal gas", "Boyle", "Charles", "Graham", "Maxwell-Boltzmann", "Viscosity"],
  "stoichiometry": ["Mole", "Molar mass", "Empirical formula", "Balanced equation", "Limiting reagent"],
  "surface_chemistry": ["Adsorption", "Colloid", "Emulsion", "Tyndall", "Brownian motion"],
  "thermodynamics": ["Enthalpy", "Entropy", "Gibbs free energy", "Spontaneity", "Hess's law", "Heat capacity"],
  "boron_family": ["Boron", "Aluminum", "Borax", "Boric acid"],
  "carbon_family": ["Carbon", "Silicon", "Silicate", "Zeolite"],
  "carbonyl_compounds": ["Aldehyde", "Ketone", "Carbonyl"],
  "carboxylic_acids": ["Carboxylic acid", "Ester", "Anhydride"],
  "d_f_block": ["Transition elements", "Lanthanoid", "Actinoid", "KMnO4", "K2Cr2O7"],
  "haloalkanes_haloarenes": ["Haloalkane", "Haloarene", "SN1", "SN2"],
  "hydrogen": ["Hydrogen", "Isotopes", "Heavy water", "Hydride"],
  "metallurgy": ["Ore", "Calcination", "Roasting", "Froth floatation"],
  "nitrogen_compounds": ["Amine", "Diazonium", "Nitro"],
  "organic_c_h_o": ["Alcohol", "Phenol", "Ether"],
  "p_block_elements": ["Nitrogen family", "Oxygen family", "Halogen family", "Noble gas"],
  "s_block_elements": ["Alkali metals", "Alkaline earth metals", "Sodium", "Magnesium"]
};

function restore() {
  const allQuestions = [];
  const topics = fs.readdirSync(rootDir).filter(f => fs.statSync(path.join(rootDir, f)).isDirectory());

  console.log(`Searching through ${topics.length} topics...`);

  // Harvest
  topics.forEach(topic => {
    const topicPath = path.join(rootDir, topic);
    const files = fs.readdirSync(topicPath).filter(f => f.endsWith('.json'));

    files.forEach(file => {
      const filePath = path.join(topicPath, file);
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (data.questions) {
          data.questions.forEach(q => {
            q._sourceTopic = topic;
            allQuestions.push(q);
          });
        }
      } catch (e) {
        console.error(`Error reading ${filePath}: ${e.message}`);
      }
    });
  });

  console.log(`Total questions harvested: ${allQuestions.length}`);

  const uniqueQuestions = [];
  const seenTexts = new Set();
  allQuestions.forEach(q => {
    const cleanText = q.question.toLowerCase().trim();
    if (!seenTexts.has(cleanText)) {
      seenTexts.add(cleanText);
      uniqueQuestions.push(q);
    }
  });

  console.log(`Unique questions remaining: ${uniqueQuestions.length}`);

  const topicBuckets = {};
  topics.forEach(t => topicBuckets[t] = []);

  uniqueQuestions.forEach(q => {
    const text = q.question.toLowerCase();
    let routed = false;

    for (const [topicName, keywords] of Object.entries(taxonomy)) {
      if (keywords.some(k => text.includes(k.toLowerCase()))) {
        topicBuckets[topicName].push(q);
        routed = true;
        break; 
      }
    }

    if (!routed && taxonomy[q._sourceTopic]) {
      topicBuckets[q._sourceTopic].push(q);
    }
  });

  // Write Back
  topics.forEach(topic => {
    if (!topicBuckets[topic]) return;
    
    const bucket = topicBuckets[topic];
    console.log(`Topic ${topic}: ${bucket.length} questions`);

    const attempt1 = [], attempt2 = [], attempt3 = [], attempt4 = [];
    bucket.forEach((q, idx) => {
      const cleanQ = { ...q };
      delete cleanQ._sourceTopic;
      cleanQ.id = idx + 1;

      if (idx % 4 === 0) attempt1.push(cleanQ);
      else if (idx % 4 === 1) attempt2.push(cleanQ);
      else if (idx % 4 === 2) attempt3.push(cleanQ);
      else attempt4.push(cleanQ);
    });

    const topicPath = path.join(rootDir, topic);
    const writeBatch = (filename, list) => {
        fs.writeFileSync(path.join(topicPath, filename), JSON.stringify({ questions: list }, null, 4));
    };

    writeBatch('attempt_1.json', attempt1);
    writeBatch('attempt_2.json', attempt2);
    writeBatch('attempt_3.json', attempt3);
    writeBatch('attempt_4.json', attempt4);
  });

  console.log("Chemistry Restoration Complete.");
}

restore();
