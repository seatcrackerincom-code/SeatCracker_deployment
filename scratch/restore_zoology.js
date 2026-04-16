const fs = require('fs');
const path = require('path');

const rootDir = 'seatcracker-app/public/questions_v2/zoology';

const taxonomy = {
  "animal_kingdom": ["Chordata", "Arthropoda", "Mollusca", "Porifera", "Coelenterata", "Platyhelminthes", "Aschelminthes", "Annelida", "Echinodermata", "Hemichordata", "Vertebrata", "Amphibia", "Reptilia", "Aves", "Mammalia"],
  "body_fluids_and_circulation": ["Blood", "Lymph", "Plasma", "RBC", "WBC", "Platelets", "Heart", "ECG", "Circulation", "Artery", "Vein"],
  "breathing_and_exchange_of_gases": ["Lung", "Respiration", "Inspiration", "Expiration", "Alveoli", "Oxygen transport", "Hemoglobin"],
  "chemical_coordination_and_integration": ["Hormone", "Endocrine", "Pituitary", "Thyroid", "Adrenal", "Insulin", "Glucagon", "Hypothalamus"],
  "digestion_and_absorption": ["Stomach", "Intestine", "Digestive", "Enzyme", "Pepsin", "Trypsin", "Amylase", "Bile", "Villi"],
  "excretory_products_and_their_elimination": ["Kidney", "Nephron", "Urine", "Dialysis", "Urea", "Uric acid", "Ammonia", "Glomerulus"],
  "human_health_and_disease": ["Immunity", "Vaccine", "Pathogen", "AIDS", "Cancer", "Malaria", "Typhoid", "Pneumonia", "Antibody", "Antigen"],
  "human_reproduction_and_reproductive_health": ["Testis", "Ovary", "Sperm", "Ovum", "Fertilization", "Embryo", "Pregnancy", "Contraception", "STD", "IVF", "Menstrual"],
  "locomotion_and_movement": ["Muscle", "Skeleton", "Bone", "Joint", "Actin", "Myosin", "Sarcomere"],
  "neural_control_and_coordination": ["Neuron", "Brain", "Spinal cord", "Reflex", "Synapse", "Nerve", "Cerebrum", "Cerebellum", "Eye", "Ear"],
  "animal_husbandry_strategies": ["Breeding", "Poultry", "Fisheries", "Apiculture", "Sericulture"],
  "biomolecules": ["Enzyme", "Amino acid", "Protein", "Nucleotide", "DNA", "RNA"],
  "biotechnology_and_applications": ["rDNA", "PCR", "Insulin", "Gene therapy", "Transgenic", "Bt cotton"],
  "ecosystems": ["Trophic", "Productivity", "Pyramid", "Food chain", "Environment"],
  "genetics_and_evolution": ["Mendel", "Darwin", "Mutation", "Genetic code", "Evolution", "Natural selection"],
  "microbes_in_human_welfare": ["Antibiotic", "Sewage", "Biogas", "Fermenter", "Lactobacillus"],
  "organisms_and_populations": ["Habitat", "Population", "Ecology", "Niche", "Adaptation"],
  "structural_organisation_in_animals": ["Tissue", "Epithelium", "Connective", "Cockroach", "Frog", "Earthworm"]
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

  console.log("Zoology Restoration Complete.");
}

restore();
