const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app';
const syllabusDir = path.join(baseDir, 'public/SYLLABUS');
const questionsRootDir = path.join(baseDir, 'public/questions_v2');

function readJsonSafe(p) {
    let content = fs.readFileSync(p);
    if (content[0] === 0xFF && content[1] === 0xFE) {
        return JSON.parse(content.toString('utf16le').replace(/^\uFEFF/, ''));
    }
    return JSON.parse(content.toString('utf8').replace(/^\uFEFF/, ''));
}

function writeJsonUtf16le(p, obj) {
    const str = JSON.stringify(obj, null, 2);
    fs.writeFileSync(p, Buffer.from('\ufeff' + str, 'utf16le'));
}

function slugify(text) {
    return text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

// 1. Load masters
const botanyMaster = readJsonSafe(path.join(syllabusDir, 'newjeons/EAMCET_Botany_Syllabus.json'));
const zoologyMaster = readJsonSafe(path.join(syllabusDir, 'newjeons/EAMCET_Zoology_Syllabus.json'));
const chemistryMaster = readJsonSafe(path.join(syllabusDir, 'newjeons/EAMCET_Chemistry_Syllabus.json'));

const mappedBotany = botanyMaster.chapters.map(ch => ({
    topic_id: ch.topic_id,
    chapter: ch.chapter,
    topic_slug: slugify(ch.chapter.replace(/\(.*\)/, '').trim()), // Clean slugs
    ap: ch.ap_questions || 0,
    ts: ch.ap_questions || 0,
    priority: ch.priority,
    subtopics: ch.subtopics
}));

const mappedZoology = zoologyMaster.chapters.map(ch => ({
    topic_id: ch.topic_id,
    chapter: ch.chapter,
    topic_slug: slugify(ch.chapter.replace(/\(.*\)/, '').trim()),
    ap: ch.ap_questions || 0,
    ts: ch.ap_questions || 0,
    priority: ch.priority,
    subtopics: ch.subtopics
}));

const mappedChemistry = chemistryMaster.chapters.map(ch => ({
    topic_id: ch.topic_id,
    chapter: ch.chapter,
    topic_slug: slugify(ch.chapter.replace(/\(.*\)/, '').trim()),
    ap: ch.ap_questions || 0,
    ts: ch.ap_questions || 0,
    priority: ch.priority,
    subtopics: ch.subtopics
}));

// 2. Inject into all 22 syllabus files
const states = ['AP', 'TS'];
const streams = ['Engineering', 'Agriculture', 'Pharmacy'];

states.forEach(state => {
    streams.forEach(stream => {
        const subjects = ['Botany', 'Zoology', 'Chemistry'];
        subjects.forEach(subject => {
            const p = path.join(syllabusDir, state, stream, subject, `${subject}.json`);
            if (fs.existsSync(p)) {
                console.log(`[SYNC] ${state}/${stream}/${subject}`);
                const data = readJsonSafe(p);
                if (subject === 'Botany') data.chapters = mappedBotany;
                if (subject === 'Zoology') data.chapters = mappedZoology;
                if (subject === 'Chemistry') data.chapters = mappedChemistry;
                writeJsonUtf16le(p, data);
            }
        });
    });
});

// 3. Question File Mapping (Fuzzy migration)
const allChapters = [...mappedBotany, ...mappedZoology, ...mappedChemistry];

allChapters.forEach(ch => {
    const isBotany = mappedBotany.includes(ch);
    const isZoology = mappedZoology.includes(ch);
    const isChemistry = mappedChemistry.includes(ch);
    
    let sub = 'chemistry';
    if (isBotany) sub = 'botany';
    if (isZoology) sub = 'zoology';
    
    const targetFolder = path.join(questionsRootDir, sub);
    if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });
    
    const targetName = ch.topic_slug + '.json';
    const targetPath = path.join(targetFolder, targetName);
    
    if (fs.existsSync(targetPath)) return;
    
    const oldQRoot = path.join(baseDir, 'public/questions');
    const searchDirs = [targetFolder, path.join(oldQRoot, sub)];
    const keywords = ch.chapter.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    for (const d of searchDirs) {
        if (!fs.existsSync(d)) continue;
        const files = fs.readdirSync(d, { recursive: true }).filter(f => f.endsWith('.json'));
        const match = files.find(f => {
            const cleanF = path.basename(f).toLowerCase().replace(/[^a-z0-9]/g, '');
            return cleanF === keywords || keywords.includes(cleanF) || cleanF.includes(keywords);
        });
        
        if (match) {
            console.log(`[MAP] ${sub}/${match} -> ${targetName}`);
            fs.copyFileSync(path.join(d, match), targetPath);
            break;
        }
    }
});

console.log('--- ULTIMATE REORG SUCCESS ---');
