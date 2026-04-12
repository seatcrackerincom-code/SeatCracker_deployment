const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app/public/questions_v2';

function finalAudit() {
  const subjects = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());
  let report = [];
  subjects.forEach(sub => {
    if (sub === 'ARCHIVE') return;
    const subDir = path.join(dir, sub);
    const files = fs.readdirSync(subDir).filter(f => f.endsWith('.json'));
    files.forEach(file => {
      try {
        const filePath = path.join(subDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const qs = data.questions || [];
        const hard = qs.filter(q => q.difficulty === 'Hard').length;
        const med = qs.filter(q => q.difficulty === 'Medium').length;
        const pyq = qs.filter(q => q.pyq === true).length;
        const total = qs.length;
        
        report.push({
          topic: `${sub}/${file}`,
          total,
          hard,
          med,
          pyq,
          status: total >= 80 ? 'OK' : (total >= 60 ? '3-ATTEMPTS' : 'LOW')
        });
      } catch (e) {
        console.error(`ERROR audit ${file}: ${e.message}`);
      }
    });
  });
  
  console.table(report.sort((a, b) => a.total - b.total).slice(0, 30));
}

finalAudit();
