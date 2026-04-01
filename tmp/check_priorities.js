const fs = require('fs');
const path = require('path');

const BASE_DIR = 'C:\\Users\\admin\\OneDrive\\Desktop\\SeatCracker';
const SYLLABUS_DIRS = [
  path.join(BASE_DIR, 'SYLLABUS'),
  path.join(BASE_DIR, 'seatcracker-app', 'public', 'SYLLABUS')
];

function checkFiles(dir) {
  if (!fs.existsSync(dir)) return;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkFiles(fullPath);
    } else if (entry.name.endsWith('.json') && !fullPath.includes('questions') && !fullPath.includes('formulas') && !fullPath.includes('newjeons')) {
      try {
        const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        const chapters = Array.isArray(data) ? data : data.chapters;
        if (chapters) {
          const highCount = chapters.filter(c => c.priority === 'High').length;
          const subject = Array.isArray(data) ? "RawArray" : data.subject;
          console.log(`${fullPath.replace(BASE_DIR, '')} | Format: ${subject} | High: ${highCount}`);
        }
      } catch (e) {
        console.log(`Failed to parse: ${fullPath.replace(BASE_DIR, '')}`);
      }
    }
  }
}

SYLLABUS_DIRS.forEach(d => checkFiles(d));
