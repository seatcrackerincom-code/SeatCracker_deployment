const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app/public/questions_v2';

function cleanUnicode(str) {
  if (typeof str !== 'string') return str;
  // Fix specifically the reported broken Nu (\u03bd\u0304) and others
  return str.replace(/\\u03bd\\u0304/g, 'ν̄').replace(/\\u03bb/g, 'λ').replace(/\\u03bd/g, 'ν').replace(/\\u03c0/g, 'π');
}

function scrubFiles() {
  const subjects = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());
  subjects.forEach(sub => {
    if (sub === 'ARCHIVE') return;
    const subDir = path.join(dir, sub);
    const files = fs.readdirSync(subDir).filter(f => f.endsWith('.json'));
    files.forEach(file => {
      try {
        const filePath = path.join(subDir, file);
        let rawContent = fs.readFileSync(filePath, 'utf8');
        
        // Pre-fix raw string for common JSON escapes that break parsers
        rawContent = rawContent.replace(/\\u03bd\\u0304/g, 'ν̄');
        
        const data = JSON.parse(rawContent);
        if (!data.questions) return;

        // Quality Filter: Remove questions that are too short/basic
        const filtered = data.questions.filter(q => {
          const isTooShort = q.question.length < 35;
          const isBasicDefinition = /is called|is defined as|is known as/i.test(q.question);
          // If it was originally "easy" (based on my previous relabeling heuristic) AND it's too simple, trash it.
          if (q.difficulty === 'Medium' && q.pyq === true && (isTooShort || isBasicDefinition)) {
            return false; // DELETE
          }
          return true;
        });

        // Re-index
        filtered.forEach((q, idx) => {
          q.id = idx + 1;
          q.question = cleanUnicode(q.question);
          if (q.options) {
            Object.keys(q.options).forEach(k => {
              q.options[k] = cleanUnicode(q.options[k]);
            });
          }
        });

        data.questions = filtered;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`[SCRUBBED] ${sub}/${file}: Questions remaining: ${filtered.length}`);
      } catch (e) {
        console.error(`ERROR scrubbing ${file}: ${e.message}`);
      }
    });
  });
}

scrubFiles();
