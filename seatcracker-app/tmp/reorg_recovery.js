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

function writeJsonUtf16le(p, data) {
    const str = JSON.stringify(data, null, 2);
    // Write UTF-16LE with BOM
    const buffer = Buffer.from('\ufeff' + str, 'utf16le');
    fs.writeFileSync(p, buffer);
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
    chapter: ch.chapter,
    topic_slug: slugify(ch.chapter.replace(/\(.*\)/, '').trim()),
    ap: ch.ap_questions || 0,
    ts: ch.ap_questions || 0,
    priority: ch.priority,
    subtopics: ch.subtopics
}));

const mappedZoology = zoologyMaster.chapters.map(ch => ({
    chapter: ch.chapter,
    topic_slug: slugify(ch.chapter.replace(/\(.*\)/, '').trim()),
    ap: ch.ap_questions || 0,
    ts: ch.ap_questions || 0,
    priority: ch.priority,
    subtopics: ch.subtopics
}));

const mappedChemistry = chemistryMaster.chapters.map(ch => ({
    chapter: ch.chapter,
    topic_slug: slugify(ch.chapter.replace(/\(.*\)/, '').trim()),
    ap: ch.ap_questions || 0,
    ts: ch.ap_questions || 0,
    priority: ch.priority,
    subtopics: ch.subtopics
}));

// 2. Process all states and subjects
const states = ['AP', 'TS'];
const streams = ['Engineering', 'Agriculture', 'Pharmacy'];

states.forEach(state => {
    streams.forEach(stream => {
        ['Botany', 'Zoology', 'Chemistry'].forEach(subject => {
            const p = path.join(syllabusDir, state, stream, subject, subject + '.json');
            if (fs.existsSync(p)) {
                console.log(`[RECOVERY] ${state}/${stream}/${subject}`);
                if (subject === 'Botany') writeJsonUtf16le(p, mappedBotany);
                if (subject === 'Zoology') writeJsonUtf16le(p, mappedZoology);
                if (subject === 'Chemistry') writeJsonUtf16le(p, mappedChemistry);
            }
        });
    });
});

console.log('--- RECOVERY REORG SUCCESS ---');
