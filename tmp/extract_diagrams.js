const fs = require('fs');
const path = require('path');

const mathsDir = 'c:\\Users\\admin\\OneDrive\\Desktop\\SeatCracker\\seatcracker-app\\public\\questions\\maths';
const outputFilePath = 'c:\\Users\\admin\\OneDrive\\Desktop\\SeatCracker\\math_diagram_questions.json';

const allDiagramQuestions = [];

try {
    const files = fs.readdirSync(mathsDir);
    files.forEach(file => {
        if (file.endsWith('.json')) {
            const topicName = file.replace('.json', '').replace(/_/g, ' ').toUpperCase();
            const fullPath = path.join(mathsDir, file);
            const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            const questions = Array.isArray(content) ? content : (content.questions || []);

            const diagramQs = questions.filter(q => q.hasDiagram === true);
            diagramQs.forEach(q => {
                allDiagramQuestions.push({
                    topic: topicName,
                    ...q
                });
            });
        }
    });

    fs.writeFileSync(outputFilePath, JSON.stringify(allDiagramQuestions, null, 2));
    console.log(`Successfully extracted ${allDiagramQuestions.length} diagram questions to ${outputFilePath}`);
} catch (err) {
    console.error('Error during extraction:', err);
}
