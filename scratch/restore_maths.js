const fs = require('fs');
const path = require('path');

const rootDir = 'seatcracker-app/public/questions_v2/maths';

const taxonomy = {
  "binomial_theorem": ["Binomial", "expansion", "coefficient"],
  "circles": ["Circle", "tangent", "normal", "radius", "center", "locus", "power of a point"],
  "complex_numbers": ["Complex number", "modulus", "amplitude", "argument", "imaginary", "real part", "conjugate"],
  "dc_s_and_dr_s": ["Direction cosines", "Direction ratios"],
  "de_moivre_s_theorem": ["De Moivre", "root of unity", "cis theta"],
  "definite_integrals": ["Definite integral", "from 0 to", "from a to"],
  "differential_equations": ["Differential equation", "order", "degree", "dy/dx"],
  "differentiation": ["derivative", "d/dx", "differentiate", "slope of tangent"],
  "ellipse": ["Ellipse", "eccentricity", "focus", "latus rectum"],
  "functions": ["Function", "domain", "range", "one-to-one", "onto", "composite", "inverse"],
  "hyperbola": ["Hyperbola", "asymptote"],
  "integration": ["Integral", "integration of", "dx"],
  "limits_continuity": ["Limit as x approaches", "continuity", "limit", "approaches"],
  "matrices_and_determinants": ["Matrix", "Determinant", "trace", "inverse of A", "system of linear equations"],
  "probability": ["Probability", "dice", "cards", "event", "permutation", "combination"],
  "quadratic_equations_and_expressions": ["Quadratic", "roots", "discriminant", "ax^2"],
  "statistics": ["Mean", "variance", "standard deviation", "frequency distribution"],
  "trigonometry_upto_transformations": ["Sine", "Cosine", "Tangent", "tan(", "sin(", "cos(", "identity", "theta"],
  "vector_addition": ["Vector", "magnitude", "parallel", "resultant"],
  "dot_product_vectors": ["Dot product", "scalar product", "orthogonal"],
  "cross_product_vectors": ["Cross product", "vector product", "perpendicular vector"]
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

  console.log("Maths Restoration Complete.");
}

restore();
