/**
 * add_questions_all.js
 * Reads all q_data_*.json part files, merges them,
 * then appends 10 new questions to attempt_1.json for every topic found.
 * Run: node add_questions_all.js
 */

const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, 'public', 'questions_v2');

// ── Map each subject to its data source files ────────────────────────────────
const SUBJECTS = {
  chemistry: {
    folder: 'chemistry',
    dataFiles: ['q_data_chemistry_part1.json', 'q_data_chemistry_part2.json']
  },
  physics: {
    folder: 'physics',
    dataFiles: ['q_data_physics_part1.json', 'q_data_physics_part2.json']
  },
  maths: {
    folder: 'maths',
    dataFiles: ['q_data_maths_part1.json', 'q_data_maths_part2.json']
  },
  botany: {
    folder: 'botany',
    dataFiles: ['q_data_botany.json']
  },
  zoology: {
    folder: 'zoology',
    dataFiles: ['q_data_zoology.json']
  }
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠ File not found: ${filePath}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error(`  ✗ JSON parse error in ${filePath}: ${e.message}`);
    return null;
  }
}

function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function mergeDataFiles(dataFiles) {
  const merged = {};
  for (const fileName of dataFiles) {
    const filePath = path.join(__dirname, fileName);
    const data = loadJSON(filePath);
    if (data) {
      Object.assign(merged, data);
    }
  }
  return merged;
}

function getExistingQuestions(topicDir) {
  const allQuestions = [];
  for (let a = 2; a <= 4; a++) {
    const attemptFile = path.join(topicDir, `attempt_${a}.json`);
    const data = loadJSON(attemptFile);
    if (data && Array.isArray(data.questions)) {
      allQuestions.push(...data.questions);
    }
  }
  return allQuestions;
}

function getHighestId(questions) {
  let maxId = 0;
  for (const q of questions) {
    const num = parseInt(String(q.id || '0').replace(/\D/g, ''), 10);
    if (!isNaN(num) && num > maxId) maxId = num;
  }
  return maxId;
}

function isDuplicate(newQ, existingQs) {
  const newText = newQ.question.trim().toLowerCase();
  return existingQs.some(q => {
    const existText = (q.question || '').trim().toLowerCase();
    return existText === newText;
  });
}

// ── Main logic ───────────────────────────────────────────────────────────────

let totalAdded = 0;
let totalSkipped = 0;
let totalTopics = 0;
let topicsNotFound = [];

for (const [subjectKey, config] of Object.entries(SUBJECTS)) {
  console.log(`\n==== ${subjectKey.toUpperCase()} ====`);
  
  const subjectData = mergeDataFiles(config.dataFiles);
  const topicKeys = Object.keys(subjectData);
  console.log(`  Loaded ${topicKeys.length} topics from data files.`);

  const subjectDir = path.join(BASE, config.folder);
  if (!fs.existsSync(subjectDir)) {
    console.warn(`  ⚠ Subject directory not found: ${subjectDir}`);
    continue;
  }

  // Get all topic folders present on disk
  const topicFolders = fs.readdirSync(subjectDir)
    .filter(f => fs.statSync(path.join(subjectDir, f)).isDirectory());

  for (const topicSlug of topicFolders) {
    const topicDir = path.join(subjectDir, topicSlug);
    const attempt1File = path.join(topicDir, 'attempt_1.json');

    if (!fs.existsSync(attempt1File)) {
      console.warn(`    ⚠ No attempt_1.json for topic: ${topicSlug}`);
      continue;
    }

    // Find matching key in data file (flexible matching)
    const matchKey = topicKeys.find(k => {
      const a = k.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const b = topicSlug.toLowerCase().replace(/[^a-z0-9]/g, '_');
      return a === b || a.includes(b) || b.includes(a);
    });

    if (!matchKey) {
      topicsNotFound.push(`${subjectKey}/${topicSlug}`);
      continue;
    }

    const newQuestions = subjectData[matchKey];
    if (!Array.isArray(newQuestions) || newQuestions.length === 0) {
      console.warn(`    ⚠ No questions for key: ${matchKey}`);
      continue;
    }

    totalTopics++;

    // Load attempt_1
    const attempt1 = loadJSON(attempt1File);
    if (!attempt1 || !Array.isArray(attempt1.questions)) {
      console.warn(`    ⚠ Invalid attempt_1.json for: ${topicSlug}`);
      continue;
    }

    // Gather all existing questions (all attempts) for deduplication
    const allExisting = [
      ...attempt1.questions,
      ...getExistingQuestions(topicDir)
    ];

    let highestId = getHighestId(allExisting);
    let addedCount = 0;

    for (const q of newQuestions) {
      if (addedCount >= 10) break;

      if (isDuplicate(q, allExisting)) {
        totalSkipped++;
        continue;
      }

      highestId++;
      attempt1.questions.push({
        id: `${topicSlug}_${highestId}`,
        question: q.question,
        options: q.options,
        answer: q.answer,
        difficulty: q.difficulty || 'medium'
      });

      allExisting.push({ question: q.question });
      addedCount++;
      totalAdded++;
    }

    saveJSON(attempt1File, attempt1);
    console.log(`    ✓ ${topicSlug}: +${addedCount} questions (total: ${attempt1.questions.length})`);
  }
}

console.log('\n════════════════════════════════════════');
console.log(`✅ DONE!`);
console.log(`   Topics processed : ${totalTopics}`);
console.log(`   Questions added  : ${totalAdded}`);
console.log(`   Duplicates skipped: ${totalSkipped}`);
if (topicsNotFound.length > 0) {
  console.log(`\n⚠ Topics with no data match (${topicsNotFound.length}):`);
  topicsNotFound.forEach(t => console.log(`   - ${t}`));
}
console.log('════════════════════════════════════════\n');
