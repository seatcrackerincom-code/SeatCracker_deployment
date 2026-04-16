const fs = require('fs');
const path = require('path');

const rootDir = 'seatcracker-app/public/questions_v2/botany';

// Taxonomy Mapping
const taxonomy = {
  "anatomy_of_flowering_plants": ["xylem", "phloem", "parenchyma", "collenchyma", "sclerenchyma", "cambium", "dicot", "monocot", "stomata", "bulliform", "phellogen", "heartwood", "sapwood", "vascular"],
  "biodiversity_and_conservation": ["hotspot", "extinction", "IUCN", "red data", "sanctuary", "reserve", "biosphere", "endemic"],
  "biological_classification": ["monera", "protista", "fungi", "classification", "virus", "viroid", "prion", "lichen", "whittaker"],
  "biomolecules": ["amino acid", "enzyme", "protein", "carbohydrate", "peptide", "monosaccharide", "lipid", "nucleic acid"],
  "biotechnology": ["rDNA", "restriction enzyme", "plasmid", "vector", "PCR", "pBR322", "agarose", "ligase", "bioreactor"],
  "cell_cycle_and_cell_division": ["mitosis", "meiosis", "interphase", "prophase", "metaphase", "anaphase", "telophase", "cytokinesis", "spindle", "crossing over"],
  "cell_the_unit_of_life": ["mitochondria", "ribosome", "nucleus", "organelle", "prokaryotic", "eukaryotic", "chloroplast", "lysosome", "golgi"],
  "diversity_in_living_world": ["taxonomic", "genus", "species", "family", "nomenclature", "herbarium", "museum"],
  "ecosystem": ["trophic", "productivity", "decomposition", "energy flow", "pyramid", "consumer", "producer", "food chain"],
  "environmental_issues": ["pollution", "ozone", "greenhouse", "global warming", "deforestation", "e-waste", "BOD", "eutrophication"],
  "evolution": ["miller", "darwin", "lamarck", "natural selection", "homology", "analogy", "fossil", "adaptive radiation"],
  "microbes_in_human_welfare": ["antibiotic", "sewage", "biogas", "fermenter", "penicillin", "lactobacillus", "microbe"],
  "mineral_nutrition": ["nitrogen fixation", "rhizobium", "leghemoglobin", "macronutrient", "micronutrient", "hydroponics"],
  "molecular_basis_of_inheritance": ["DNA", "RNA", "helix", "griffith", "replication", "transcription", "translation", "operon"],
  "morphology_of_flowering_plants": ["root", "stem", "leaf", "flower", "inflorescence", "fruit", "seed", "placentation", "phyllotaxy"],
  "organisms_and_populations": ["niche", "natality", "mortality", "symbiosis", "parasitism", "mutualism", "competition"],
  "photosynthesis_in_higher_plants": ["chlorophyll", "P700", "P680", "calvin", "kranz", "C3", "C4", "RuBisCO", "photosystem", "Z-scheme"],
  "plant_growth_and_development": ["hormone", "auxin", "gibberellin", "cytokinin", "abscisic acid", "ABA", "ethylene", "stress hormone", "vernalization", "photoperiodism"],
  "plant_kingdom": ["algae", "bryophyte", "pteridophyte", "gymnosperm", "angiosperm", "alternation of generations"],
  "principles_of_inheritance_and_variation": ["mendel", "allele", "genotype", "phenotype", "monohybrid", "linkage", "mutation", "pedigree"],
  "respiration_in_plants": ["glycolysis", "krebs", "TCA", "electron transport", "ETS", "fermentation", "ATP", "NADH"],
  "sexual_reproduction_in_flowering_plants": ["pollen", "pollination", "embryo sac", "double fertilization", "triple fusion", "endosperm", "apomixis"],
  "strategies_for_enhancement_in_food_production": ["plant breeding", "tissue culture", "explant", "somaclone", "biofortification"],
  "transport_in_plants": ["munch", "mass flow", "translocation", "phloem sap", "guttation", "hydathodes", "osmosis", "transpiration"]
};

function restore() {
  const allQuestions = [];
  const topics = fs.readdirSync(rootDir).filter(f => fs.statSync(path.join(rootDir, f)).isDirectory());

  console.log(`Searching through ${topics.length} topics...`);

  // Phase 1: Harvest
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

  // Deduplicate by question text
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

  // Phase 2: Categorize
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

  // Phase 3: Write Back
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

  console.log("Restoration Complete.");
}

restore();
