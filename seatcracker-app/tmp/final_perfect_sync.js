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

// Manual overrides for tricky math/physics slugs to ensure match
const manualSlugs = {
  'maths': {
     'random_variables_and_probability_distribution': 'random_variables_and_probability_distribution',
     'trigonometry_upto_transformations': 'trigonometry_upto_transformations',
     'de_moivre_s_theorem': 'de_moivre_s_theorem',
     'system_of_circles': 'system_of_circles',
     'dc_s_and_dr_s': 'dc_s_and_dr_s'
  }
};

const states = ['AP', 'TS'];
const streams = ['Engineering', 'Agriculture', 'Pharmacy'];
const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Botany', 'Zoology'];

states.forEach(state => {
    streams.forEach(stream => {
        subjects.forEach(subject => {
            const p = path.join(syllabusDir, state, stream, subject, subject + '.json');
            if (fs.existsSync(p)) {
                console.log(`[PERFECT-SYNC] ${state}/${stream}/${subject}`);
                let rawData = readJsonSafe(p);
                const chapters = Array.isArray(rawData) ? rawData : rawData.chapters || [];
                
                // Construct the "Premium" Object Wrapper
                const newData = {
                    subject: subject,
                    chapters: chapters.map(ch => {
                        let slug = slugify(ch.chapter.replace(/\(.*\)/, '').trim());
                        
                        // Check if file exists in v2
                        const subFolder = subject.toLowerCase() === 'mathematics' ? 'maths' : subject.toLowerCase();
                        const checkPath = path.join(qRoot, subFolder, slug + '.json');
                        
                        if (!fs.existsSync(checkPath)) {
                            // Try fuzzy match in v2
                            const files = fs.readdirSync(path.join(qRoot, subFolder)).filter(f => f.endsWith('.json'));
                            const bestMatch = files.find(f => {
                                const cleanF = f.replace('.json','').replace(/_/g, '');
                                const cleanS = slug.replace(/_/g, '');
                                return cleanF === cleanS || cleanF.includes(cleanS) || cleanS.includes(cleanF);
                            });
                            if (bestMatch) slug = bestMatch.replace('.json', '');
                        }
                        
                        return { ...ch, topic_slug: slug };
                    })
                };
                writeJsonUtf16le(p, newData);
            }
        });
    });
});

console.log('--- FINAL PERFECT SYNC COMPLETE ---');
