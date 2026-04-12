const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app/public/questions_v2';

function auditSets() {
  const subjects = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());
  subjects.forEach(sub => {
    if (sub === 'ARCHIVE') return;
    const subDir = path.join(dir, sub);
    const files = fs.readdirSync(subDir).filter(f => f.endsWith('.json'));
    files.forEach(file => {
      try {
        const filePath = path.join(subDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (!data.questions) return;

        const hard = data.questions.filter(q => q.difficulty === 'Hard').length;
        const medium = data.questions.filter(q => q.difficulty === 'Medium').length;
        const pyq = data.questions.filter(q => q.pyq === true).length;
        const total = data.questions.length;

        const maxBasedOnHard = Math.floor(hard / 10);
        const maxBasedOnMed = Math.floor(medium / 5);
        const maxBasedOnPyq = Math.floor(pyq / 5);
        const maxAttemptsPossible = Math.min(maxBasedOnHard, maxBasedOnMed, maxBasedOnPyq, 4);

        if (maxAttemptsPossible < 4) {
          console.log(`[LOW] ${sub}/${file}: H:${hard} M:${medium} P:${pyq} -> Max Attempts: ${maxAttemptsPossible}`);
        } else {
          console.log(`[OK] ${sub}/${file}: H:${hard} M:${medium} P:${pyq} -> Max Attempts: 4`);
        }
      } catch (e) {
        console.error(`ERROR ${file}: ${e.message}`);
      }
    });
  });
}

auditSets();
