const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app/public/questions_v2';
const reportPath = 'c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app/question_gap_report.txt';

const subjects = ['chemistry', 'physics', 'maths', 'botany', 'zoology'];

fs.writeFileSync(reportPath, 'QUESTION GAP ANALYSIS REPORT\n' + '='.repeat(30) + '\n\n');

function runPurgeAndReport() {
  subjects.forEach(sub => {
    const subDir = path.join(baseDir, sub);
    if (!fs.existsSync(subDir)) return;

    let subReport = `### SUBJECT: ${sub.toUpperCase()}\n`;
    subReport += `| Topic | Deleted (Easy) | Hard Gap (Need 40) | Med Gap (Need 20) | PYQ Gap (Need 20) | Total Gap |\n`;
    subReport += `| :--- | :---: | :---: | :---: | :---: | :---: |\n`;

    const files = fs.readdirSync(subDir).filter(f => f.endsWith('.json'));
    files.forEach(file => {
      try {
        const filePath = path.join(subDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Basic Unicode fix for Nu/Lambda before parsing
        content = content.replace(/\\u03bd/g, 'v').replace(/\\u03bb/g, 'l');
        
        const data = JSON.parse(content);
        const qs = data.questions || [];
        
        // Count and Filter
        const easyCount = qs.filter(q => q.difficulty.toLowerCase() === 'easy').length;
        const filteredQs = qs.filter(q => q.difficulty.toLowerCase() !== 'easy');
        
        const currentHard = filteredQs.filter(q => q.difficulty.toLowerCase() === 'hard' && !q.pyq).length;
        const currentMed = filteredQs.filter(q => q.difficulty.toLowerCase() === 'medium' && !q.pyq).length;
        const currentPYQ = filteredQs.filter(q => q.pyq === true).length;
        
        const hardGap = Math.max(0, 40 - currentHard);
        const medGap = Math.max(0, 20 - currentMed);
        const pyqGap = Math.max(0, 20 - currentPYQ);
        const totalGap = hardGap + medGap + pyqGap;

        // Save purged file
        data.questions = filteredQs;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        const topicName = file.replace('.json', '');
        subReport += `| ${topicName} | ${easyCount} | ${hardGap} | ${medGap} | ${pyqGap} | ${totalGap} |\n`;
        
      } catch (e) {
        console.error(`Error processing ${file}: ${e.message}`);
      }
    });

    fs.appendFileSync(reportPath, subReport + '\n');
    console.log(`[COMPLETED] ${sub}`);
  });
}

runPurgeAndReport();
console.log(`Report generated at: ${reportPath}`);
