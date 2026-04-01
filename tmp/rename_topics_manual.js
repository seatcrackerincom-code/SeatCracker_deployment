const fs = require('fs');
const path = require('path');

const BASE_DIR = 'C:\\Users\\admin\\OneDrive\\Desktop\\SeatCracker';

const manualMapPhysics = {
  "SEMI CONDUCTORS": "Semiconductor Devices",
  "ATOMIC PHYSICS": "Atoms & Nuclei",
  "ELECTRIC CHARGES AND FIELDS": "Electrostatic Potential & Capacitance",
  "THERMAL PROPERTIES - I AND II": "Thermal Properties of Matter",
  "KINETIC THEORY OF GASES": "Thermal Properties of Matter",
  "NUCLEAR PHYSICS": "Atoms & Nuclei",
  "UNITS AND MEASUREMENTS": "Units, Dimensions & Errors",
  "COMMUNICATION SYSTEM": "Electromagnetic Waves", // closest match
  "WAVE MOTION": "Waves",
  "MAGNETISM & MATTER": "Moving Charges & Magnetism",
  "DUAL NATURE OF RADIATION & MATTER": "Dual Nature of Matter & Radiation",
  "VECTORS": "Motion in a Plane", // vectors are usually covered here
  "COLLISIONS": "Work, Power & Energy"
};

const manualMapChemistry = {
  "14TH GROUP (CARBON FAMILY)": "P-Block Elements (Groups 13-18)",
  "CLASSIFICATION OF ELEMENTS AND PERIODIC TABLE": "Classification of Elements & Periodicity",
  "ORGANIC COMPOUND CONTAINING C, H, O": "Alcohols, Phenols & Ethers",
  "CARBONYL COMPOUNDS": "Aldehydes, Ketones & Carboxylic Acids",
  "CARBOXYLIC ACIDS AND DERIVATIONS": "Aldehydes, Ketones & Carboxylic Acids",
  "ORGANIC COMPOUND CONTAINING NITROGEN": "Organic Compounds with Nitrogen",
  "PRINCIPLES OF EXTRACTIVE METALLURGY": "General Principles of Metallurgy",
  "s-BLOCK ELEMENTS": "S-Block Elements",
  "GENREL ORGANIC CHEMISTRY [GOC]": "Some Basic Principles of Organic Chemistry",
  "CHEMISTRY IN EVERYDAY LIFE": "Chemistry in Everyday Life",
  "HYDROGEN AND ITS COMPOUNDS": "Hydrogen & its Compounds",
  "13TH GROUP [BORON FAMILY]": "P-Block Elements (Groups 13-18)",
  "16TH GROUP": "P-Block Elements (Groups 13-18)",
  "17TH GROUP": "P-Block Elements (Groups 13-18)",
  "18TH GROUP": "P-Block Elements (Groups 13-18)",
  "BENZENE (AROMATIC HYDRO CARBON)": "Hydrocarbons"
};

function updateQuestionBank(subject, manualMap) {
  const qFilePath = path.join(BASE_DIR, `SYLLABUS/questions/${subject}.json`);
  const qData = JSON.parse(fs.readFileSync(qFilePath, 'utf8'));
  
  let changes = 0;
  const topicsArray = Array.isArray(qData) ? qData : qData.topics;
  
  topicsArray.forEach(topic => {
    if (manualMap[topic.topic_name.toUpperCase()]) {
      const newName = manualMap[topic.topic_name.toUpperCase()];
      console.log(`[${subject}] Manual Renaming: "${topic.topic_name}" -> "${newName}"`);
      topic.topic_name = newName;
      changes++;
    } else if (manualMap[topic.topic_name]) {
      const newName = manualMap[topic.topic_name];
      console.log(`[${subject}] Manual Renaming: "${topic.topic_name}" -> "${newName}"`);
      topic.topic_name = newName;
      changes++;
    }
  });
  
  if (changes > 0) {
    fs.writeFileSync(qFilePath, JSON.stringify(qData, null, 4));
    console.log(`Manually updated ${changes} topics in ${subject}.json`);
  }
}

updateQuestionBank('physics', manualMapPhysics);
updateQuestionBank('chemistry', manualMapChemistry);
