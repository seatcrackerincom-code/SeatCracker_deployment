const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app/public/questions_v2';

const PYQ_DATA = {
  "botany/anatomy_flowering_plants.json": [
    { "question": "Which of the following tissues is dead at maturity and provides mechanical support in plants?", "options": { "A": "Parenchyma", "B": "Collenchyma", "C": "Sclerenchyma", "D": "Phloem" }, "answer": "C", "difficulty": "Hard", "pyq": true },
    { "question": "The term used for the arrangement of vascular bundles in a stem where xylem and phloem are on the same radius is:", "options": { "A": "Radial", "B": "Conjoint", "C": "Concentric", "D": "Endarch" }, "answer": "B", "difficulty": "Medium", "pyq": true },
    { "question": "Water-containing cavities in vascular bundles are found in:", "options": { "A": "Sun-flower", "B": "Maize", "C": "Cycas", "D": "Pinus" }, "answer": "B", "difficulty": "Hard", "pyq": true }
  ],
  "botany/cell_cycle_and_cell_division.json": [
    { "question": "In which stage of meiosis does the dissolution of the synaptonemal complex occur?", "options": { "A": "Leptotene", "B": "Zygotene", "C": "Pachytene", "D": "Diplotene" }, "answer": "D", "difficulty": "Hard", "pyq": true },
    { "question": "The stage during which separation of the paired homologous chromosomes begins is:", "options": { "A": "Pachytene", "B": "Diplotene", "C": "Diakinesis", "D": "Zygotene" }, "answer": "B", "difficulty": "Hard", "pyq": true }
  ],
  "chemistry/atomic_structure.json": [
    { "question": "The orientation of an atomic orbital is governed by:", "options": { "A": "Principal quantum number", "B": "Magnetic quantum number", "C": "Spin quantum number", "D": "Azimuthal quantum number" }, "answer": "B", "difficulty": "Medium", "pyq": true },
    { "question": "Which of the following is the correct order of increasing energy of orbitals in an atom of Ti?", "options": { "A": "3s, 3p, 3d, 4s", "B": "3s, 3p, 4s, 3d", "C": "4s, 3s, 3p, 3d", "D": "3s, 4s, 3p, 3d" }, "answer": "B", "difficulty": "Hard", "pyq": true }
  ],
  "physics/thermodynamics.json": [
    { "question": "In an adiabatic process, the volume of a gas is made 4 times. Its pressure will become (take gamma = 1.5):", "options": { "A": "1/8 times", "B": "1/4 times", "C": "4 times", "D": "8 times" }, "answer": "A", "difficulty": "Hard", "pyq": true }
  ]
};

function inject() {
  Object.keys(PYQ_DATA).forEach(relPath => {
    const filePath = path.join(dir, relPath);
    if (!fs.existsSync(filePath)) return;
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const newQs = PYQ_DATA[relPath];
      
      // Add and re-index
      newQs.forEach((q, idx) => {
        data.questions.push({
          id: data.questions.length + 1,
          ...q,
          hasDiagram: false,
          diagram_description: ""
        });
      });
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`[INJECTED] ${relPath}: +${newQs.length} questions`);
    } catch (e) {
      console.error(`ERROR injecting ${relPath}: ${e.message}`);
    }
  });
}

inject();
