const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const statePath = path.join(rootDir, 'js/state.js');
const dataDir = path.join(rootDir, 'data');
const gkDir = path.join(rootDir, 'data/gk');
const tkDir = path.join(rootDir, 'data/toolkit');

console.log("Starting SSC CGL Dashboard Data Compilation...");

if (!fs.existsSync(statePath)) {
    console.error("ERROR: js/state.js not found!");
    process.exit(1);
}

let stateJs = fs.readFileSync(statePath, 'utf8');
stateJs = stateJs.replace(/\r\n/g, '\n');

// 1. Read primary JSON databases
const syllabus = fs.readFileSync(path.join(dataDir, 'syllabus.json'), 'utf8');
const plan = fs.readFileSync(path.join(dataDir, 'plan.json'), 'utf8');
const vocab = fs.readFileSync(path.join(dataDir, 'vocab.json'), 'utf8');
const quizzes = fs.readFileSync(path.join(dataDir, 'quizzes.json'), 'utf8');

// 2. Read GK/GS static JSON databases
const polity = fs.readFileSync(path.join(gkDir, 'polity.json'), 'utf8');
const history = fs.readFileSync(path.join(gkDir, 'history.json'), 'utf8');
const geography = fs.readFileSync(path.join(gkDir, 'geography.json'), 'utf8');
const science = fs.readFileSync(path.join(gkDir, 'science.json'), 'utf8');

// 3. Read Toolkit static JSON databases
const quant = fs.readFileSync(path.join(tkDir, 'quant.json'), 'utf8');
const grammar = fs.readFileSync(path.join(tkDir, 'grammar.json'), 'utf8');
const reasoning = fs.readFileSync(path.join(tkDir, 'reasoning.json'), 'utf8');
const computer = fs.readFileSync(path.join(tkDir, 'computer.json'), 'utf8');
const laws = fs.readFileSync(path.join(tkDir, 'laws.json'), 'utf8');
const patterns = fs.readFileSync(path.join(tkDir, 'patterns.json'), 'utf8');

// 4. Compile primary databases
const primaryRegex = /\/\/ 1\. SYLLABUS DATABASE \(INLINE COMPILED\)[\s\S]*?async function loadApplicationData\(\) \{[\s\S]*?\}/;
const primaryReplace = '// 1. SYLLABUS DATABASE (INLINE COMPILED)\n' +
  'const SYLLABUS_DATA = ' + syllabus.trim() + ';\n' +
  'const PLAN_DATA = ' + plan.trim() + ';\n' +
  'const FLASHCARDS = ' + vocab.trim() + ';\n' +
  'const EMBEDDED_QUIZZES = ' + quizzes.trim() + ';\n' +
  'const ENGLISH_QUESTIONS = EMBEDDED_QUIZZES.english;\n' +
  'const REASONING_QUESTIONS = EMBEDDED_QUIZZES.reasoning;\n' +
  'const COMP_QUESTIONS = EMBEDDED_QUIZZES.computer;\n' +
  'const GK_QUESTIONS = EMBEDDED_QUIZZES.gk;\n\n' +
  'async function loadApplicationData() {\n' +
  '    console.log("Application databases successfully loaded directly from inline JS objects.");\n' +
  '}';

if (primaryRegex.test(stateJs)) {
    stateJs = stateJs.replace(primaryRegex, () => primaryReplace);
    console.log("✔ Primary databases compiled successfully.");
} else {
    const rawDeclarationsRegex = /\/\/ 1\. SYLLABUS DATABASE[\s\S]*?async function loadApplicationData\(\) \{[\s\S]*?\}/;
    if (rawDeclarationsRegex.test(stateJs)) {
        stateJs = stateJs.replace(rawDeclarationsRegex, () => primaryReplace);
        console.log("✔ Placed primary database compiles over raw let templates.");
    } else {
        console.warn("⚠ Warning: Primary database boundary markers not matched in js/state.js.");
    }
}

// 5. Compile GK databases
const gkRegex = /\/\/ === GK STATIC DATA \(INLINE COMPILED\) ===[\s\S]*?\};/;
const gkReplace = '// === GK STATIC DATA (INLINE COMPILED) ===\n' +
  'const GK_STATIC_DATA = {\n' +
  '  polity: ' + polity.trim() + ',\n' +
  '  history: ' + history.trim() + ',\n' +
  '  geography: ' + geography.trim() + ',\n' +
  '  science: ' + science.trim() + '\n};';

if (gkRegex.test(stateJs)) {
    stateJs = stateJs.replace(gkRegex, () => gkReplace);
    console.log("✔ GK static databases compiled successfully.");
} else {
    stateJs = stateJs + '\n\n' + gkReplace;
    console.log("✔ GK static databases appended to state.js.");
}

// 6. Compile Toolkit databases
const tkRegex = /\/\/ === TOOLKIT STATIC DATA \(INLINE COMPILED\) ===[\s\S]*?\};/;
const tkReplace = '// === TOOLKIT STATIC DATA (INLINE COMPILED) ===\n' +
  'const TOOLKIT_STATIC_DATA = {\n' +
  '  quant: ' + quant.trim() + ',\n' +
  '  grammar: ' + grammar.trim() + ',\n' +
  '  reasoning: ' + reasoning.trim() + ',\n' +
  '  computer: ' + computer.trim() + ',\n' +
  '  laws: ' + laws.trim() + ',\n' +
  '  patterns: ' + patterns.trim() + '\n};';

if (tkRegex.test(stateJs)) {
    stateJs = stateJs.replace(tkRegex, () => tkReplace);
    console.log("✔ Toolkit static databases compiled successfully.");
} else {
    stateJs = stateJs + '\n\n' + tkReplace;
    console.log("✔ Toolkit static databases appended to state.js.");
}

// Restore line endings before saving
const originalEndings = fs.readFileSync(statePath, 'utf8').includes('\r\n') ? '\r\n' : '\n';
if (originalEndings === '\r\n') {
    stateJs = stateJs.replace(/\n/g, '\r\n');
}

fs.writeFileSync(statePath, stateJs, 'utf8');
console.log("SUCCESS: Injection-safe callback-based compilation complete! js/state.js is fully rebuilt.");
