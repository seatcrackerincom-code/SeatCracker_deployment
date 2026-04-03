const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app';
const qRoot = path.join(baseDir, 'public/questions_v2');
const syllabusDir = path.join(baseDir, 'public/SYLLABUS');

const states = ['AP', 'TS'];
const streams = ['Engineering', 'Agriculture', 'Pharmacy'];
const subjectsByStream = {
    'Engineering': ['Mathematics', 'Physics', 'Chemistry'],
    'Agriculture': ['Botany', 'Zoology', 'Physics', 'Chemistry'],
    'Pharmacy': ['Botany', 'Zoology', 'Physics', 'Chemistry']
};

function readJsonSafe(p) {
    let content = fs.readFileSync(p);
    if (content[0] === 0xFF && content[1] === 0xFE) {
        return JSON.parse(content.toString('utf16le').replace(/^\uFEFF/, ''));
    }
    return JSON.parse(content.toString('utf8').replace(/^\uFEFF/, ''));
}

const results = [];
states.forEach(state => {
    streams.forEach(stream => {
        subjectsByStream[stream].forEach(subject => {
            const p = path.join(syllabusDir, state, stream, subject, subject + '.json');
            if (fs.existsSync(p)) {
                const data = readJsonSafe(p);
                (Array.isArray(data) ? data : data.chapters || []).forEach(ch => {
                    const target = path.join(qRoot, subject.toLowerCase(), ch.topic_slug + '.json');
                    const exists = fs.existsSync(target);
                    results.push({ state, stream, subject, chapter: ch.chapter, slug: ch.topic_slug, exists });
                });
            }
        });
    });
});

const missing = results.filter(r => !r.exists);
const uniqueMissing = [...new Set(missing.map(m => m.subject + '/' + m.slug))];

console.log('--- ULTIMATE SYNC AUDIT ---');
console.log('Total Checks:', results.length);
console.log('Perfect:', results.length - missing.length);
console.log('Missing Unique:', uniqueMissing.length);
if (uniqueMissing.length > 0) {
    console.log('Missing Chapters:', JSON.stringify(uniqueMissing, null, 2));
}
console.log('--- AUDIT COMPLETE ---');
