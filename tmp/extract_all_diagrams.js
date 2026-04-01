const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\admin\\OneDrive\\Desktop\\SeatCracker\\seatcracker-app\\public\\questions';
const outputDir = 'c:\\Users\\admin\\OneDrive\\Desktop\\SeatCracker';

const subjects = ['physics', 'chemistry', 'botany', 'zoology', 'maths'];

subjects.forEach(subject => {
    const subjectDir = path.join(baseDir, subject);
    const outputFilePath = path.join(outputDir, `${subject}_diagram_questions.json`);
    const allDiagramQuestions = [];

    if (!fs.existsSync(subjectDir)) {
        console.warn(`Directory not found: ${subjectDir}`);
        return;
    }

    try {
        const files = fs.readdirSync(subjectDir);
        files.forEach(file => {
            if (file.endsWith('.json')) {
                const topicName = file.replace('.json', '').replace(/_/g, ' ').toUpperCase();
                const fullPath = path.join(subjectDir, file);
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

        if (allDiagramQuestions.length > 0) {
            fs.writeFileSync(outputFilePath, JSON.stringify(allDiagramQuestions, null, 2));
            console.log(`Successfully extracted ${allDiagramQuestions.length} diagram questions for ${subject} to ${outputFilePath}`);
        } else {
            console.log(`No diagram questions found for ${subject}.`);
        }
    } catch (err) {
        console.error(`Error during extraction for ${subject}:`, err);
    }
});
