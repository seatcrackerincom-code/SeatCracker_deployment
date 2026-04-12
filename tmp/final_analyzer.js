const fs = require('fs');
const path = require('path');

const BASE_DIR = 'C:\\Users\\admin\\OneDrive\\Desktop\\SeatCracker';

const SYLLABUS_PATHS = {
  Mathematics: 'SYLLABUS/AP/Engineering/Mathematics/Mathematics.json',
  Physics: 'SYLLABUS/AP/Engineering/Physics/Physics.json',
  Chemistry: 'SYLLABUS/AP/Engineering/Chemistry/Chemistry.json',
  Botany: 'SYLLABUS/AP/Agriculture/Botany/Botany.json',
  Zoology: 'SYLLABUS/AP/Agriculture/Zoology/Zoology.json'
};

const QUESTIONS_FILES = {
  Mathematics: 'SYLLABUS/questions/maths.json',
  Physics: 'SYLLABUS/questions/physics.json',
  Chemistry: 'SYLLABUS/questions/chemistry.json',
  Botany: 'SYLLABUS/questions/botany.json',
  Zoology: 'SYLLABUS/questions/zoology.json'
};

const report = {};

async function analyze() {
  const allSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Botany', 'Zoology'];
  
  for (const subject of allSubjects) {
    report[subject] = {
      missingTopics: [],
      lowCountTopics: [],
      totalSyllabusTopics: 0
    };

    const syllabusPath = path.join(BASE_DIR, SYLLABUS_PATHS[subject]);
    const questionsPath = path.join(BASE_DIR, QUESTIONS_FILES[subject]);

    if (!fs.existsSync(syllabusPath) || !fs.existsSync(questionsPath)) continue;

    const syllabusJson = JSON.parse(fs.readFileSync(syllabusPath, 'utf8'));
    const questionsJson = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

    // Fix for different json structures
    const chapters = Array.isArray(syllabusJson) ? syllabusJson : syllabusJson.chapters;
    const qTopics = Array.isArray(questionsJson) ? questionsJson : (questionsJson.topics || questionsJson.data || []);

    report[subject].totalSyllabusTopics = chapters.length;

    chapters.forEach(ch => {
      const chName = ch.chapter;
      // Exact match after our renaming script
      const foundTopic = qTopics.find(t => t.topic_name === chName);

      if (!foundTopic) {
        report[subject].missingTopics.push(chName);
      } else {
        const qCount = foundTopic.questions ? foundTopic.questions.length : 0;
        if (qCount < 50) {
          report[subject].lowCountTopics.push(`${chName} (${qCount} questions)`);
        }
      }
    });
  }

  // Print Report
  console.log('\n=======================================');
  console.log('--- FINAL QUESTION BANK ANALYSIS ---');
  console.log('=======================================\n');

  for (const [sub, data] of Object.entries(report)) {
    console.log(`[${sub}] (${data.totalSyllabusTopics} total syllabus topics)`);
    
    if (data.missingTopics.length > 0) {
      console.log(`  ⚠️ COMPLETELY MISSING TOPICS (${data.missingTopics.length}):`);
      data.missingTopics.forEach(m => console.log(`      - ${m}`));
    }
    
    if (data.lowCountTopics.length > 0) {
      console.log(`  📉 LESS THAN 50 QUESTIONS (${data.lowCountTopics.length}):`);
      data.lowCountTopics.forEach(lc => console.log(`      - ${lc}`));
    }

    if (data.missingTopics.length === 0 && data.lowCountTopics.length === 0) {
      console.log('  ✅ ALL PERFECT. 50+ questions for every topic.');
    }
    console.log('---------------------------------------');
  }
}

analyze();
