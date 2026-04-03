const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app';
const syllabusDir = path.join(baseDir, 'public/SYLLABUS');
const qRoot = path.join(baseDir, 'public/questions_v2');

function readJsonSafe(p) {
    let content = fs.readFileSync(p);
    if (content[0] === 0xFF && content[1] === 0xFE) {
        return JSON.parse(content.toString('utf16le').replace(/^\uFEFF/, ''));
    }
    return JSON.parse(content.toString('utf8').replace(/^\uFEFF/, ''));
}

function writeJsonUtf16le(p, data) {
    const str = JSON.stringify(data, null, 2);
    const buffer = Buffer.from('\ufeff' + str, 'utf16le');
    fs.writeFileSync(p, buffer);
}

function slugify(text) {
    if (!text) return 'undefined';
    return text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

// 1. Process all 22 files
const states = ['AP', 'TS'];
const streams = ['Engineering', 'Agriculture', 'Pharmacy'];
const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Botany', 'Zoology'];

states.forEach(state => {
    streams.forEach(stream => {
        subjects.forEach(subject => {
            const p = path.join(syllabusDir, state, stream, subject, subject + '.json');
            if (fs.existsSync(p)) {
                let data = readJsonSafe(p);
                const chapters = Array.isArray(data) ? data : data.chapters || [];
                chapters.forEach(ch => {
                    if (!ch.topic_slug) {
                       ch.topic_slug = slugify(ch.chapter.replace(/\(.*\)/, '').trim());
                    }
                });
                writeJsonUtf16le(p, chapters);
            }
        });
    });
});

// 2. Fix the last 11 missing renames
const fixes = [
    { sub: 'chemistry', old: 'chemical_bonding.json', new: 'chemical_bonding_molecular_structure.json' },
    { sub: 'chemistry', old: 'basic_organic_principles.json', new: 'some_basic_principles_of_organic_chemistry.json' },
    { sub: 'chemistry', old: 'electro-chemistry.json', new: 'redox_reactions_electrochemistry.json' },
    { sub: 'chemistry', old: 'carbonyl_compounds.json', new: 'aldehydes_ketones_carboxylic_acids.json' },
    { sub: 'chemistry', old: 'alcohols_phenols_ethers.json', new: 'alcohols_phenols_ethers.json' },
    { sub: 'chemistry', old: 'stoichiometry.json', new: 'stoichiometry_mole_concept.json' },
    { sub: 'chemistry', old: 'amines.json', new: 'organic_compounds_with_nitrogen.json' },
    { sub: 'botany', old: 'cell_structure_and_functions.json', new: 'cell_structure_functions.json' }
];

fixes.forEach(f => {
    const oldP = path.join(qRoot, f.sub, f.old);
    const newP = path.join(qRoot, f.sub, f.new);
    if (fs.existsSync(oldP) && !fs.existsSync(newP)) {
        console.log(`[FIX-RENAME] ${f.sub}/${f.old} -> ${f.new}`);
        fs.renameSync(oldP, newP);
    }
});

console.log('--- FINAL POLISH SUCCESS ---');
