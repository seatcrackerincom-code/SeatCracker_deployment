const fs = require('fs');
const path = require('path');

const BASE_DIR = 'C:\\Users\\admin\\OneDrive\\Desktop\\SeatCracker';

// Read modern syllabus files for Ground Truth names
const physSyllabus = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'SYLLABUS/AP/Engineering/Physics/Physics.json'), 'utf8')).chapters;
const chemSyllabus = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'SYLLABUS/AP/Engineering/Chemistry/Chemistry.json'), 'utf8')).chapters;

function normalize(s) {
  if (!s) return '';
  return s.replace(/[^A-Z0-9]/gi, '').toUpperCase()
          .replace(/AND/g, '').replace(/THE/g, '').replace(/OF/g, '');
}

function getBestMatch(originalTopicName, syllabusChapters) {
  const normOriginal = normalize(originalTopicName);
  
  // 1. Exact match
  for (const ch of syllabusChapters) {
    if (ch.chapter.toUpperCase() === originalTopicName.toUpperCase()) return ch.chapter;
  }
  
  // 2. Normalized match
  for (const ch of syllabusChapters) {
    if (normalize(ch.chapter) === normOriginal) return ch.chapter;
  }
  
  // 3. Substring match
  for (const ch of syllabusChapters) {
    const normCh = normalize(ch.chapter);
    if (normOriginal.includes(normCh) || normCh.includes(normOriginal)) return ch.chapter;
  }
  return null;
}

function updateQuestionBank(subject, syllabusChapters) {
  const qFilePath = path.join(BASE_DIR, `SYLLABUS/questions/${subject}.json`);
  const qData = JSON.parse(fs.readFileSync(qFilePath, 'utf8'));
  
  let changes = 0;
  
  const topicsArray = Array.isArray(qData) ? qData : qData.topics;
  
  topicsArray.forEach(topic => {
    const bestMatch = getBestMatch(topic.topic_name, syllabusChapters);
    if (bestMatch && bestMatch !== topic.topic_name) {
      console.log(`[${subject}] Renaming: "${topic.topic_name}" -> "${bestMatch}"`);
      topic.topic_name = bestMatch;
      changes++;
    } else if (!bestMatch) {
      console.log(`[${subject}] NO MATCH FOUND FOR: "${topic.topic_name}"`);
    }
  });
  
  if (changes > 0) {
    fs.writeFileSync(qFilePath, JSON.stringify(qData, null, 4));
    console.log(`Updated ${changes} topics in ${subject}.json`);
  } else {
    console.log(`No changes needed for ${subject}.json`);
  }
}

updateQuestionBank('physics', physSyllabus);
updateQuestionBank('chemistry', chemSyllabus);
