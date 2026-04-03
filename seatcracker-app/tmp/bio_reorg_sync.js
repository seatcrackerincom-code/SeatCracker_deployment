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

// 1. Load the new masters
const botanyMaster = readJsonSafe(path.join(syllabusDir, 'newjeons/EAMCET_Botany_Syllabus.json'));
const zoologyMaster = readJsonSafe(path.join(syllabusDir, 'newjeons/EAMCET_Zoology_Syllabus.json'));

function slugify(text) {
    return text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

// 2. Prepare the new chapter lists
const newBotany = botanyMaster.chapters.map(ch => ({
    topic_id: ch.topic_id,
    chapter: ch.chapter,
    topic_slug: slugify(ch.chapter),
    ap: ch.ap_questions || 0,
    ts: ch.ap_questions || 0,
    priority: ch.priority,
    subtopics: ch.subtopics
}));

const newZoology = zoologyMaster.chapters.map(ch => ({
    topic_id: ch.topic_id,
    chapter: ch.chapter,
    topic_slug: slugify(ch.chapter),
    ap: ch.ap_questions || 0,
    ts: ch.ap_questions || 0,
    priority: ch.priority,
    subtopics: ch.subtopics
}));

// 3. Inject into all 22 files
const states = ['AP', 'TS'];
const courses = ['Engineering', 'Agriculture', 'Pharmacy'];

states.forEach(state => {
    courses.forEach(course => {
        const bPath = path.join(syllabusDir, state, course, 'Botany', 'Botany.json');
        const zPath = path.join(syllabusDir, state, course, 'Zoology', 'Zoology.json');
        
        if (fs.existsSync(bPath)) {
            console.log(`[BIOLOGY-UNIFY] ${state}/${course}/Botany`);
            const data = readJsonSafe(bPath);
            data.chapters = newBotany;
            writeJsonUtf16le(bPath, data);
        }
        
        if (fs.existsSync(zPath)) {
            console.log(`[BIOLOGY-UNIFY] ${state}/${course}/Zoology`);
            const data = readJsonSafe(zPath);
            data.chapters = newZoology;
            writeJsonUtf16le(zPath, data);
        }
    });
});

// 4. Migrate Question Files
const allNew = newBotany.concat(newZoology);
allNew.forEach(ch => {
    const isBotany = newBotany.includes(ch);
    const sub = isBotany ? 'botany' : 'zoology';
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
        const files = fs.readdirSync(d).filter(f => f.endsWith('.json'));
        const match = files.find(f => {
            const cleanF = f.toLowerCase().replace(/[^a-z0-9]/g, '');
            return cleanF === keywords || keywords.includes(cleanF) || cleanF.includes(keywords);
        });
        
        if (match) {
            console.log(`[BIO-MAP] ${match} -> ${targetName}`);
            fs.copyFileSync(path.join(d, match), targetPath);
            break;
        }
    }
});

console.log('--- BIO REORG SUCCESS ---');
