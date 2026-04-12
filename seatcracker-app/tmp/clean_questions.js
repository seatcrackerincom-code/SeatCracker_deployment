const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app/public/questions_v2';

function cleanFiles() {
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

        data.questions.forEach(q => {
          // Convert Easy to Medium + PYQ
          if (q.difficulty.toLowerCase() === 'easy') {
            q.difficulty = 'Medium';
            q.pyq = true;
          }
          // Ensure standard casing for Difficulty
          if (q.difficulty.toLowerCase() === 'medium') q.difficulty = 'Medium';
          if (q.difficulty.toLowerCase() === 'hard') q.difficulty = 'Hard';
        });

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`[CLEANED] ${sub}/${file}`);
      } catch (e) {
        console.error(`ERROR ${file}: ${e.message}`);
      }
    });
  });
}

cleanFiles();
