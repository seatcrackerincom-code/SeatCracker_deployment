// run: node add_questions.js chemistry
// then: node add_questions.js physics
// then: node add_questions.js maths
// then: node add_questions.js botany
// then: node add_questions.js zoology

const fs = require("fs");
const path = require("path");

const subject = process.argv[2];
if (!subject) { console.error("Usage: node add_questions.js <subject>"); process.exit(1); }

const dataFile = path.join(__dirname, `q_data_${subject}.json`);
if (!fs.existsSync(dataFile)) { console.error(`Data file not found: ${dataFile}`); process.exit(1); }

const newQsByTopic = JSON.parse(fs.readFileSync(dataFile, "utf8"));
const baseDir = path.join(__dirname, "public", "questions_v2", subject);
let totalUpdated = 0, totalSkipped = 0;

for (const [topic, newQs] of Object.entries(newQsByTopic)) {
  const file = path.join(baseDir, topic, "attempt_1.json");
  if (!fs.existsSync(file)) {
    console.warn(`SKIP (no file): ${topic}`);
    totalSkipped++;
    continue;
  }

  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const existing = data.questions || [];

  // Collect all existing question texts from ALL attempts to check duplicates
  const existingTexts = new Set(existing.map(q => q.question.trim().toLowerCase()));
  // Also load attempts 2-4 for dedup
  for (let a = 2; a <= 4; a++) {
    const af = path.join(baseDir, topic, `attempt_${a}.json`);
    if (fs.existsSync(af)) {
      const ad = JSON.parse(fs.readFileSync(af, "utf8"));
      (ad.questions || []).forEach(q => existingTexts.add(q.question.trim().toLowerCase()));
    }
  }

  let maxId = Math.max(0, ...existing.map(q => q.id || 0));
  let added = 0;

  for (const q of newQs) {
    if (existingTexts.has(q.question.trim().toLowerCase())) {
      console.warn(`  DEDUP: "${q.question.substring(0, 60)}"`);
      continue;
    }
    maxId++;
    existing.push({
      id: maxId,
      question: q.question,
      difficulty: q.difficulty,
      hasDiagram: false,
      diagram_description: "",
      options: q.options,
      answer: q.answer,
      pyq: false,
      tag: q.difficulty,
    });
    existingTexts.add(q.question.trim().toLowerCase());
    added++;
  }

  data.questions = existing;
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log(`✅ ${topic}: +${added} questions (total: ${existing.length})`);
  totalUpdated++;
}

console.log(`\nDone! Updated: ${totalUpdated}, Skipped: ${totalSkipped}`);
