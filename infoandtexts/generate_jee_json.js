const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'seatcracker-app', 'public', 'JEE_Advanced');

/**
 * JEE Advanced Question Generator
 * Paper 1: 4 MCQ + 3 MSQ + 6 SA + 4 MATCH = 17 per subject × 3 = 51
 * Paper 2: 4 MCQ + 3 MSQ + 6 SA + 4 SA_DECIMAL = 17 per subject × 3 = 51
 */
const generateQuestions = (paperNum) => {
    const questions = [];
    let id = 1;
    const subjects = ["Math", "Phy", "Chem"];

    const sections = paperNum === 1
        ? [
            { count: 4, type: "MCQ",   marks: "+3, -1",  sec: 1 },
            { count: 3, type: "MSQ",   marks: "+4, -2",  sec: 2 },
            { count: 6, type: "SA",    marks: "+4, 0",   sec: 3 },
            { count: 4, type: "MATCH", marks: "+3, -1",  sec: 4 },
          ]
        : [
            { count: 4, type: "MCQ",       marks: "+3, -1", sec: 1 },
            { count: 3, type: "MSQ",       marks: "+4, -2", sec: 2 },
            { count: 6, type: "SA",        marks: "+4, 0",  sec: 3 },
            { count: 4, type: "SA_DECIMAL", marks: "+3, 0", sec: 4 },
          ];

    subjects.forEach((sub) => {
        sections.forEach((sec) => {
            for (let q = 0; q < sec.count; q++) {
                const question = {
                    id: `${sub}-${sec.sec}-${q}`,
                    subject: sub,
                    section: sec.sec,
                    number: id,
                    type: sec.type,
                    text: "",
                    image: `images/${id}.png`,
                    marks: sec.marks,
                    answer: sec.type === "SA" ? "0" : sec.type === "SA_DECIMAL" ? "0.00" : "1",
                };

                // Add options for MCQ/MSQ/MATCH
                if (sec.type === "MCQ" || sec.type === "MSQ") {
                    question.options = ["A", "B", "C", "D"];
                }

                // Add match_options for MATCH type (Paper 1 Section 4)
                if (sec.type === "MATCH") {
                    question.options = ["A", "B", "C", "D"];
                    question.match_options = {
                        "A": { "P": 3, "Q": 1, "R": 4, "S": 2 },
                        "B": { "P": 1, "Q": 3, "R": 2, "S": 4 },
                        "C": { "P": 2, "Q": 4, "R": 1, "S": 3 },
                        "D": { "P": 4, "Q": 2, "R": 3, "S": 1 },
                    };
                }

                // Add passage for SA_DECIMAL (Paper 2 Section 4)
                if (sec.type === "SA_DECIMAL") {
                    const paraIdx = Math.floor(q / 2) + 1;
                    question.passage = `Paragraph ${paraIdx}`;
                    question.passage_id = paraIdx;
                }

                // MSQ answer is array
                if (sec.type === "MSQ") {
                    question.answer = ["1", "3"];
                }

                questions.push(question);
                id++;
            }
        });
    });

    return { questions };
};

// Generate for all 10 days × 2 papers
for (let d = 1; d <= 10; d++) {
    for (let p = 1; p <= 2; p++) {
        const dir = path.join(basePath, `Day_${d}`, `Paper_${p}`);
        const file = path.join(dir, 'paper.json');

        // Create directory if needed
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const jsonData = JSON.stringify(generateQuestions(p), null, 2);
        fs.writeFileSync(file, jsonData);
    }
}

console.log("✅ JEE Advanced JSON generated for all 10 days × 2 papers (51 questions each).");
console.log("   Paper 1: 4 MCQ + 3 MSQ + 6 SA + 4 MATCH = 17/subject × 3 = 51");
console.log("   Paper 2: 4 MCQ + 3 MSQ + 6 SA + 4 SA_DECIMAL = 17/subject × 3 = 51");
