const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app/public/questions_v2';
const reportPath = 'c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app/final_gap_report.txt';

const subjects = ['chemistry', 'physics', 'maths', 'botany', 'zoology'];

fs.writeFileSync(reportPath, 'FINAL GAP ANALYSIS REPORT (TOTAL PURGE)\n' + '='.repeat(40) + '\n\n');

function runTotalPurgeAndReport() {
  subjects.forEach(sub => {
    const subDir = path.join(baseDir, sub);
    if (!fs.existsSync(subDir)) return;

    let subReport = `### SUBJECT: ${sub.toUpperCase()}\n`;
    subReport += `| Topic Name | Hard Gap | Med Gap | PYQ Gap | Total to Add |\n`;
    subReport += `| :--- | :---: | :---: | :---: | :---: |\n`;

    const files = fs.readdirSync(subDir).filter(f => f.endsWith('.json'));
    files.forEach(file => {
      try {
        const filePath = path.join(subDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Basic Unicode fix
        content = content.replace(/\\u03bd/g, 'v').replace(/\\u03bb/g, 'l');
        
        const data = JSON.parse(content);
        const qs = data.questions || [];
        
        // TOTAL PURGE: Remove Easy AND all PYQs
        const filteredQs = qs.filter(q => {
          const isEasy = q.difficulty.toLowerCase() === 'easy';
          const isPYQ = q.pyq === true;
          return !isEasy && !isPYQ;
        });
        
        const currentHard = filteredQs.filter(q => q.difficulty.toLowerCase() === 'hard').length;
        const currentMed = filteredQs.filter(q => q.difficulty.toLowerCase() === 'medium').length;
        
        const hardGap = Math.max(0, 40 - currentHard);
        const medGap = Math.max(0, 20 - currentMed);
        const pyqGap = 20; // Always 20 because we deleted all
        const totalToAdd = hardGap + medGap + pyqGap;

        // Save purged file
        data.questions = filteredQs;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        const topicName = file.replace('.json', '');
        subReport += `| ${topicName} | ${hardGap} | ${medGap} | ${pyqGap} | ${totalToAdd} |\n`;
        
      } catch (e) {
        console.error(`Error processing ${file}: ${e.message}`);
      }
    });

    fs.appendFileSync(reportPath, subReport + '\n');
    console.log(`[TOTAL PURGE COMPLETED] ${sub}`);
  });
}

runTotalPurgeAndReport();
console.log(`Final Report generated at: ${reportPath}`);
