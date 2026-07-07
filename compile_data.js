const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const statePath = path.join(rootDir, 'js/state.js');
const dataDir = path.join(rootDir, 'data');
const gkDir = path.join(rootDir, 'data/gk');

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

// 3. Compile primary databases
const primaryRegex = /\/\/ 1\. SYLLABUS DATABASE \(INLINE COMPILED\)[\s\S]*?async function loadApplicationData\(\) \{[\s\S]*?\}/;
const primaryReplace = `// 1. SYLLABUS DATABASE (INLINE COMPILED)
const SYLLABUS_DATA = ${syllabus.trim()};
const PLAN_DATA = ${plan.trim()};
const FLASHCARDS = ${vocab.trim()};
const EMBEDDED_QUIZZES = ${quizzes.trim()};
const ENGLISH_QUESTIONS = EMBEDDED_QUIZZES.english;
const REASONING_QUESTIONS = EMBEDDED_QUIZZES.reasoning;
const COMP_QUESTIONS = EMBEDDED_QUIZZES.computer;
const GK_QUESTIONS = EMBEDDED_QUIZZES.gk;

async function loadApplicationData() {
    console.log("Application databases successfully loaded directly from inline JS objects.");
}`;

if (primaryRegex.test(stateJs)) {
    stateJs = stateJs.replace(primaryRegex, primaryReplace);
    console.log("✔ Primary databases compiled successfully.");
} else {
    console.warn("⚠ Warning: Primary database boundary markers not matched in js/state.js.");
}

// 4. Compile GK databases
const gkRegex = /\/\/ === GK STATIC DATA \(INLINE COMPILED\) ===[\s\S]*?\};/;
const gkReplace = `// === GK STATIC DATA (INLINE COMPILED) ===
const GK_STATIC_DATA = {
  polity: ${polity.trim()},
  history: ${history.trim()},
  geography: ${geography.trim()},
  science: ${science.trim()}
};`;

if (gkRegex.test(stateJs)) {
    stateJs = stateJs.replace(gkRegex, gkReplace);
    console.log("✔ GK static databases compiled successfully.");
} else {
    // If not found, append to end
    stateJs = stateJs + '\n\n' + gkReplace;
    console.log("✔ GK static databases appended to state.js.");
}

fs.writeFileSync(statePath, stateJs, 'utf8');
console.log("SUCCESS: Data synchronization complete! js/state.js is fully rebuilt.");
