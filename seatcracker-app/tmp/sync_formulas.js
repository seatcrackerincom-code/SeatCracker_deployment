const fs = require('fs');
const path = require('path');

const formulaPath = 'c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app/public/SYLLABUS/formulas/chemistry.json';
const data = JSON.parse(fs.readFileSync(formulaPath, 'utf8'));

const mapping = {
  "CHEMICAL KINETICS & ELECTRO CHEMISTRY": "Chemical Kinetics",
  "CHEMICAL EQUILIBRIUM & IONIC EQUILIBRIUM": "Chemical Equilibrium",
  "14TH GROUP (CARBON FAMILY)": "Carbon Family",
  "CLASSIFICATION OF ELEMENTS AND PERIODIC TABLE": "Periodic Table",
  "D & F BLOCK ELEMENTS": "d & f Block",
  "CO-ORDINATION COMPOUNDS": "Coordination Compounds",
  "ORGANIC COMPOUND CONTAINING C, H, O": "Organic (C, H, O)",
  "CARBONYL COMPOUNDS": "Carbonyl Compounds",
  "CARBOXYLIC ACIDS AND DERIVATIONS": "Carboxylic Acids",
  "HYDRO CARBONS": "Hydrocarbons",
  "ORGANIC COMPOUND CONTAINING NITROGEN": "Nitrogen Compounds",
  "POLYMERS": "Polymers",
  "PRINCIPLES OF EXTRACTIVE METALLURGY": "Metallurgy",
  "S-BLOCK ELEMENTS": "s-Block Elements",
  "STOICHIOMETRY": "Stoichiometry",
  "GENREL ORGANIC CHEMISTRY [GOC]": "GOC",
  "CHEMISTRY IN EVERYDAY LIFE": "Everyday Chemistry",
  "HYDROGEN AND ITS COMPOUNDS": "Hydrogen",
  "13TH GROUP [BORON FAMILY]": "Boron Family",
  "SOLID STATE": "Solid State",
  "BENZENE (AROMATIC HYDRO CARBON)": "Hydrocarbons"
};

data.forEach(topic => {
  if (mapping[topic.topic_name]) {
    console.log(`[FORMULA-FIX] ${topic.topic_name} -> ${mapping[topic.topic_name]}`);
    topic.topic_name = mapping[topic.topic_name];
  }
});

fs.writeFileSync(formulaPath, JSON.stringify(data, null, 2), 'utf8');
console.log('--- CHEMISTRY FORMULA SYNC SUCCESS ---');
