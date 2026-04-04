const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app/public/questions_v2';

function checkCounts() {
  const subjects = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());
  subjects.forEach(sub => {
    const subDir = path.join(dir, sub);
    const files = fs.readdirSync(subDir).filter(f => f.endsWith('.json'));
    files.forEach(file => {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(subDir, file), 'utf8'));
        const count = content.questions ? content.questions.length : 0;
        if (count < 80) {
          console.log(`[LOW] ${sub}/${file}: ${count}`);
        } else {
          console.log(`[OK] ${sub}/${file}: ${count}`);
        }
      } catch (e) {
        console.error(`ERROR ${file}: ${e.message}`);
      }
    });
  });
}

checkCounts();
