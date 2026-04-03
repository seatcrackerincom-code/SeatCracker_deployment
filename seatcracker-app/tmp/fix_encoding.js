const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/admin/OneDrive/Desktop/SeatCracker/seatcracker-app';
const syllabusDir = path.join(baseDir, 'public/SYLLABUS');

let fixed = 0;
let skipped = 0;

function fixFile(p) {
    const raw = fs.readFileSync(p);
    let parsed;

    if (raw[0] === 0xFF && raw[1] === 0xFE) {
        // UTF-16LE with BOM — decode and re-save as UTF-8
        try {
            parsed = JSON.parse(raw.toString('utf16le').replace(/^\uFEFF/, ''));
        } catch (e) {
            console.error(`[PARSE-ERROR] ${p}: ${e.message}`);
            return;
        }
        fs.writeFileSync(p, JSON.stringify(parsed, null, 2), 'utf8');
        console.log(`[FIXED-UTF16] ${p.replace(baseDir, '')}`);
        fixed++;
    } else if (raw[0] === 0xEF && raw[1] === 0xBB && raw[2] === 0xBF) {
        // UTF-8 with BOM — strip it
        const content = raw.slice(3).toString('utf8');
        try { parsed = JSON.parse(content); } catch (e) {
            console.error(`[PARSE-ERROR] ${p}: ${e.message}`);
            return;
        }
        fs.writeFileSync(p, JSON.stringify(parsed, null, 2), 'utf8');
        console.log(`[FIXED-BOM8] ${p.replace(baseDir, '')}`);
        fixed++;
    } else {
        skipped++;
    }
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(name => {
        const full = path.join(dir, name);
        if (fs.statSync(full).isDirectory()) walkDir(full);
        else if (name.endsWith('.json')) fixFile(full);
    });
}

walkDir(syllabusDir);

console.log(`\n--- ENCODING FIX COMPLETE ---`);
console.log(`Fixed: ${fixed} | Already UTF-8: ${skipped}`);
