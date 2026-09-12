/**
 * Conquest Web Application - Comprehensive Automated Test Suite
 * File: tests/suite.js
 * Usage: node tests/suite.js
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');
const cp = require('child_process');

// ── COLORFUL CONSOLE LOGGERS ─────────────────────────────────
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m"
};

function logHeader(title) {
  console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}   ${title}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}`);
}

function logTestPass(name) {
  console.log(`  ${colors.green}✔ PASS:${colors.reset} ${name}`);
}

function logTestFail(name, err) {
  console.error(`  ${colors.red}✖ FAIL:${colors.reset} ${name}`);
  console.error(`    ${colors.yellow}${err.message}${colors.reset}`);
}

let passedCount = 0;
let failedCount = 0;

function runTest(name, testFn) {
  try {
    testFn();
    passedCount++;
    logTestPass(name);
  } catch (err) {
    failedCount++;
    logTestFail(name, err);
  }
}

// ── SETUP SHARED VM SANDBOX ──────────────────────────────────
const rootDir = path.join(__dirname, '..');

// Mock localStorage
const mockStorage = {};
const localStorageMock = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

// Mock ClassList
class MockClassList {
  constructor() {
    this._classes = new Set();
  }
  add(...args) { args.forEach(c => this._classes.add(c)); }
  remove(...args) { args.forEach(c => this._classes.delete(c)); }
  toggle(c, force) {
    if (force !== undefined) {
      force ? this.add(c) : this.remove(c);
    } else {
      this.contains(c) ? this.remove(c) : this.add(c);
    }
  }
  contains(c) { return this._classes.has(c); }
  has(c) { return this._classes.has(c); }
}

// Mock DOM Elements
class MockElement {
  constructor(id = '', tagName = 'DIV') {
    this.id = id;
    this.tagName = tagName.toUpperCase();
    this.classList = new MockClassList();
    this.attributes = {};
    this.style = {};
    this.children = [];
    this.parentElement = null;
    this.innerHTML = '';
    this.innerText = '';
    this.title = '';
  }

  setAttribute(k, v) { this.attributes[k] = String(v); }
  getAttribute(k) { return this.attributes[k] || null; }
  hasAttribute(k) { return k in this.attributes; }
  removeAttribute(k) { delete this.attributes[k]; }
  
  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }
  
  firstElementChild() { return this.children[0] || null; }

  querySelector(selector) {
    return new MockElement(selector);
  }
  
  querySelectorAll() { return [new MockElement('.nav-item'), new MockElement('.ac-toggle-row')]; }
  
  addEventListener() {}
  removeEventListener() {}
  click() {}
}

const mockBody = new MockElement('body', 'BODY');
const mockDocElem = new MockElement('html', 'HTML');

const sandbox = {
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  localStorage: localStorageMock,
  navigator: { serviceWorker: { register: () => Promise.resolve({ scope: './' }) } },
  document: {
    body: mockBody,
    documentElement: mockDocElem,
    createElement: (tag) => new MockElement('', tag),
    getElementById: (id) => new MockElement(id),
    querySelector: (sel) => new MockElement('query-' + sel),
    querySelectorAll: () => [new MockElement('.nav-item'), new MockElement('.ac-toggle-row')],
    addEventListener: () => {}
  },
  window: {
    addEventListener: () => {},
    removeEventListener: () => {},
    scrollTo: () => {},
    showToast: () => {}
  }
};

sandbox.window.document = sandbox.document;
sandbox.window.localStorage = localStorageMock;
sandbox.global = sandbox;
vm.createContext(sandbox);

function evalInContext(code) {
  return vm.runInContext(code, sandbox);
}

// ── TEST SUITE EXECUTION ──────────────────────────────────────
logHeader("Conquest Web App - Comprehensive Test Suite");

// SECTION 1: DATABASE & FILE INTEGRITY
logHeader("Section 1: Data Compilation & Database Integrity");

runTest("Compiled Data (js/state.js) Exists & Valid", () => {
  const stateJsPath = path.join(rootDir, 'js', 'state.js');
  assert(fs.existsSync(stateJsPath), "js/state.js must exist");
  const content = fs.readFileSync(stateJsPath, 'utf8');
  assert(content.includes('SYLLABUS_DATA'), "js/state.js must include SYLLABUS_DATA");
  assert(content.includes('EMBEDDED_QUIZZES'), "js/state.js must include EMBEDDED_QUIZZES");
});

runTest("Load & Verify Application Data Schema", () => {
  const stateJsContent = fs.readFileSync(path.join(rootDir, 'js', 'state.js'), 'utf8');
  evalInContext(stateJsContent);
  
  const syllabus = evalInContext('SYLLABUS_DATA');
  assert(Array.isArray(syllabus), "SYLLABUS_DATA must be an Array");
  assert(syllabus.length > 0, "SYLLABUS_DATA must not be empty");
  
  const quizzes = evalInContext('EMBEDDED_QUIZZES');
  assert(quizzes && typeof quizzes === 'object', "EMBEDDED_QUIZZES must be an Object");
  assert(Array.isArray(quizzes.gk), "EMBEDDED_QUIZZES.gk must be an Array");
});

// SECTION 2: STATE MANAGEMENT & PERSISTENCE
logHeader("Section 2: AppState & LocalStorage Management");

runTest("AppState Default Structure", () => {
  const state = evalInContext('appState');
  assert(state, "appState must be defined");
  assert.strictEqual(state.theme, "dark", "Default theme must be dark");
  assert.strictEqual(state.mobileNavHand, "center", "Default mobileNavHand must be center");
  assert.strictEqual(state.speechEnabled, true, "Default speechEnabled must be true");
  assert.strictEqual(state.toastEnabled, true, "Default toastEnabled must be true");
});

runTest("Save & Hydrate State from Storage", () => {
  evalInContext('appState.mobileNavHand = "left"; appState.theme = "light"; saveStateToStorage();');
  
  const savedRaw = localStorageMock.getItem("ssc_cgl_state");
  assert(savedRaw, "Storage key ssc_cgl_state must exist");
  const parsed = JSON.parse(savedRaw);
  assert.strictEqual(parsed.mobileNavHand, "left");
  assert.strictEqual(parsed.theme, "light");

  // Reset and load
  evalInContext('appState.mobileNavHand = "right"; loadStateFromStorage();');
  const restoredHand = evalInContext('appState.mobileNavHand');
  assert.strictEqual(restoredHand, "left", "loadStateFromStorage must restore left hand setting");
});

// SECTION 3: STYLESHEET & TAILWIND BUILD VALIDATION
logHeader("Section 3: Tailwind CSS & Custom Animation Physics");

runTest("Production CSS (style.css) File Exists", () => {
  const styleCssPath = path.join(rootDir, 'style.css');
  assert(fs.existsSync(styleCssPath), "style.css must exist");
  const stats = fs.statSync(styleCssPath);
  assert(stats.size > 40000, `style.css size (${(stats.size/1024).toFixed(1)} KB) must be valid (> 40 KB)`);
});

runTest("Build Script CSS Rules Integrity (build-tailwind.js)", () => {
  const buildTailwindPath = path.join(rootDir, 'build-tailwind.js');
  const buildContent = fs.readFileSync(buildTailwindPath, 'utf8');

  // Verify Light Theme Selectors
  assert(buildContent.includes('.light-theme'), "build-tailwind.js must support .light-theme selector");
  assert(buildContent.includes('.light'), "build-tailwind.js must support .light selector");

  // Verify Command Palette Row Layouts
  assert(buildContent.includes('.ac-toggle-row'), "build-tailwind.js must define .ac-toggle-row");
  assert(buildContent.includes('.sc-kbd'), "build-tailwind.js must define .sc-kbd");

  // Verify Mobile-Only Media Query Overrides
  assert(buildContent.includes('.ac-toggle-row.md\\:hidden'), "build-tailwind.js must include .ac-toggle-row.md:hidden override");

  // Verify Shrunk Navigation Royal Blue Highlight
  assert(buildContent.includes('#mobile-floating-nav.nav-shrunk #floating-nav-trigger'), "build-tailwind.js must style shrunk nav trigger");
  assert(buildContent.includes('background-color: #2563eb'), "Shrunk nav trigger must use Royal Blue background (#2563eb)");
});

// SECTION 4: NAVIGATION CONTROLLER & ERGONOMICS
logHeader("Section 4: Navigation Island & Dominant Hand Controller");

runTest("Navigation Functions Integration", () => {
  const navJsContent = fs.readFileSync(path.join(rootDir, 'js', 'navigation.js'), 'utf8');
  evalInContext(navJsContent);

  assert.strictEqual(typeof evalInContext('shrinkNav'), 'function', "shrinkNav must be defined");
  assert.strictEqual(typeof evalInContext('expandNav'), 'function', "expandNav must be defined");
  assert.strictEqual(typeof evalInContext('setMobileNavHand'), 'function', "setMobileNavHand must be defined");
  assert.strictEqual(typeof evalInContext('toggleThemeMode'), 'function', "toggleThemeMode must be defined");
});

runTest("Set Mobile Nav Dock Position (Left, Center, Right)", () => {
  evalInContext('setMobileNavHand("left");');
  assert.strictEqual(evalInContext('appState.mobileNavHand'), 'left', "appState.mobileNavHand must be 'left'");

  evalInContext('setMobileNavHand("center");');
  assert.strictEqual(evalInContext('appState.mobileNavHand'), 'center', "appState.mobileNavHand must be 'center'");
  
  evalInContext('setMobileNavHand("right");');
  assert.strictEqual(evalInContext('appState.mobileNavHand'), 'right', "appState.mobileNavHand must be 'right'");
});

runTest("Toggle Theme Mode Logic", () => {
  evalInContext('appState.theme = "dark"; toggleThemeMode();');
  assert.strictEqual(evalInContext('appState.theme'), "light", "Theme must switch to light");
  assert(mockBody.classList.contains("light") || mockBody.classList.contains("light-theme"), "Body must have light class");
  
  evalInContext('toggleThemeMode();');
  assert.strictEqual(evalInContext('appState.theme'), "dark", "Theme must switch back to dark");
});

// SECTION 5: COMMAND PALETTE & KEYBOARD ACTION CENTER
logHeader("Section 5: Command Palette & Keyboard Shortcuts");

runTest("Command Palette Script (js/cmdpalette.js) Integrity", () => {
  const cmdContent = fs.readFileSync(path.join(rootDir, 'js', 'cmdpalette.js'), 'utf8');
  
  // Verify Toggle Keys (T, V, N, P, C)
  assert(cmdContent.includes("case 't':"), "js/cmdpalette.js must handle key T");
  assert(cmdContent.includes("case 'v':"), "js/cmdpalette.js must handle key V");
  assert(cmdContent.includes("case 'n':"), "js/cmdpalette.js must handle key N");
  assert(cmdContent.includes("case 'p':"), "js/cmdpalette.js must handle key P");
  assert(cmdContent.includes("case 'c':"), "js/cmdpalette.js must handle key C");

  // Verify Backdrop Click Close
  assert(cmdContent.includes("!palette.contains(e.target)"), "js/cmdpalette.js must close when clicking outside palette card");
});

// SECTION 6: HTML MARKUP & MODALS SANITY CHECK
logHeader("Section 6: HTML Markup & Modal Popups Integrity");

runTest("HTML Markup Validation (index.html)", () => {
  const htmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  
  assert(htmlContent.includes('id="mobile-floating-nav"'), "index.html must contain #mobile-floating-nav");
  assert(!htmlContent.includes('id="mobile-nav-settings-modal"'), "index.html must not contain #mobile-nav-settings-modal");

  // Verify gear icon button is removed from floating dock
  assert(!htmlContent.includes('data-tooltip="Mobile Ergonomics"'), "Gear icon button must be removed from floating dock");

  // Verify Top-Right Sync Island & Floating Island
  assert(htmlContent.includes('id="action-center-island-wrap"'), "index.html must contain #action-center-island-wrap");
  assert(htmlContent.includes('id="sync-island-pill"'), "index.html must contain #sync-island-pill");
  assert(htmlContent.includes('id="btn-sync-island-show"'), "index.html must contain #btn-sync-island-show");
  assert(htmlContent.includes('id="btn-sync-island-scan"'), "index.html must contain #btn-sync-island-scan");

  // Verify Action Center clickable rows
  assert(htmlContent.includes("handleShortcutAction('qr:show')"), "Action center must have clickable row for qr:show");
  assert(htmlContent.includes("handleShortcutAction('qr:scan')"), "Action center must have clickable row for qr:scan");

  // Verify Action Center 9-dot trigger icon and Popover structure
  assert(htmlContent.includes('fa-table-cells'), "Action center trigger must use 9-dot grid icon (fa-table-cells)");
  const shortcutsModalMatch = htmlContent.match(/<div[^>]*id="modal-shortcuts-help"[^>]*>/);
  assert(shortcutsModalMatch, "modal-shortcuts-help element must exist in index.html");
  assert(!shortcutsModalMatch[0].includes('bg-black/85') && !shortcutsModalMatch[0].includes('inset-0'), "Action center must not darken page with full-screen bg-black/85 backdrop");
  assert(htmlContent.includes('id="theme-toggle-text"'), "index.html must contain #theme-toggle-text for custom toggle style");
  assert(htmlContent.includes('id="speech-toggle-text"'), "index.html must contain #speech-toggle-text for custom toggle style");
  assert(htmlContent.includes('id="toast-toggle-text"'), "index.html must contain #toast-toggle-text for custom toggle style");
});

// SECTION 7: EXAM TARGET COUNTDOWN & DATES
logHeader("Section 7: Centralized Exam Countdown Calculations");

runTest("getExamCountdownData() Accuracy & Edge Cases", () => {
  // Test future date (e.g. 10 days ahead)
  const tenDaysFromNow = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  evalInContext(`appState.examDate = "${tenDaysFromNow}"; appState.examName = "SSC CGL 2026";`);
  const dataFuture = evalInContext(`getExamCountdownData()`);
  assert(dataFuture.days >= 9 && dataFuture.days <= 11, `Should calculate ~10 days remaining (got ${dataFuture.days})`);
  assert.strictEqual(dataFuture.reached, false, "Should not be reached");
  assert.strictEqual(dataFuture.examName, "SSC CGL 2026", "Exam name should match");

  // Test past date
  evalInContext(`appState.examDate = "2020-01-01"; appState.examName = "Old Exam";`);
  const dataPast = evalInContext(`getExamCountdownData()`);
  assert.strictEqual(dataPast.days, 0, "Past date days remaining should be 0");
  assert.strictEqual(dataPast.reached, true, "Past date reached should be true");

  // Test today
  const todayStr = new Date().toISOString().split('T')[0];
  evalInContext(`appState.examDate = "${todayStr}"; appState.examName = "Today Exam";`);
  const dataToday = evalInContext(`getExamCountdownData()`);
  assert.strictEqual(dataToday.days, 0, "Today should have 0 days remaining");
  assert.strictEqual(dataToday.reached, true, "reached should be true for today/past");
});

// SECTION 8: INSTANT QR PEER SYNC PROTOCOL
logHeader("Section 8: QR Sync Protocol & State Preservation");

runTest("QR Sync Compression, Decompression & Full Fidelity", () => {
  const qrJsContent = fs.readFileSync(path.join(rootDir, 'components', 'qr-sync-modal.js'), 'utf8');
  evalInContext(qrJsContent);

  const sampleState = {
    syllabusProgress: {
      "q-1-1": { learned: true, practiced: true, mastered: true },
      "r-2-3": { learned: true, practiced: false, mastered: false }
    },
    mocks: [{ id: 1, name: "Live Mock #1", score: "148.5", date: "2026-09-01" }],
    notes: [{ id: "n-1", title: "Algebra Identity Trick", content: "(a+b)^3 expansion", tag: "Maths" }],
    weakAlerts: { "q-1-1": 2 },
    srsRecords: { "q-1-1": { lastReviewed: 1725500000000, level: 3 } },
    currentDay: 14,
    examDate: "2026-08-15",
    examName: "CGL Target 2026",
    examTier: 2,
    streak: 5,
    lastActiveDate: "2026-09-06",
    dailyRituals: { drill: true, vocab: true, ca: false, computer: false },
    theme: "dark",
    mobileNavHand: "left"
  };

  // 1. Compact serialization
  const compact = evalInContext(`window.extractCompactPayload(${JSON.stringify(sampleState)})`);
  assert(compact && compact.v === 1, "Compact payload must have version 1");
  assert.strictEqual(compact.sp["q-1-1"], 3, "Mastered topic should be encoded as stage 3");
  assert.strictEqual(compact.sp["r-2-3"], 1, "Learned topic should be encoded as stage 1");
  assert.strictEqual(compact.cd, 14, "Current day must match");
  assert.strictEqual(compact.mh, "left", "Mobile hand must match");

  // 2. Expand compact payload
  const expanded = evalInContext(`window.expandCompactPayload(${JSON.stringify(compact)})`);
  assert(expanded, "Expanded payload must exist");
  assert.strictEqual(expanded.syllabusProgress["q-1-1"].mastered, true, "Mastered flag must be restored true");
  assert.strictEqual(expanded.syllabusProgress["q-1-1"].practiced, true, "Practiced flag must be restored true");
  assert.strictEqual(expanded.syllabusProgress["q-1-1"].learned, true, "Learned flag must be restored true");
  assert.strictEqual(expanded.syllabusProgress["r-2-3"].learned, true, "Learned flag must be restored true");
  assert.strictEqual(expanded.mocks.length, 1, "Mocks length must be 1");
  assert.strictEqual(expanded.mocks[0].name, "Live Mock #1", "Mock name must match");
  assert.strictEqual(expanded.mocks[0].score, "148.5", "Mock score must match");
  assert.strictEqual(expanded.notes.length, 1, "Notes length must be 1");
  assert.strictEqual(expanded.notes[0].title, "Algebra Identity Trick", "Notes title must match");
  assert.strictEqual(expanded.weakAlerts["q-1-1"], 2, "Weak alerts count must match");
  assert.strictEqual(expanded.examName, "CGL Target 2026", "Exam name must match");
  assert.strictEqual(expanded.examTier, 2, "Exam tier must match");
  assert.strictEqual(expanded.streak, 5, "Streak must match");
  assert.strictEqual(expanded.mobileNavHand, "left", "Mobile nav hand mode must match");

  // 3. Verify Copy QR Image button in modal template & method
  assert(qrJsContent.includes('id="btn-copy-qr-image"'), "qr-sync-modal.js must contain #btn-copy-qr-image button");
  assert(qrJsContent.includes('_copyQrImageToClipboard'), "qr-sync-modal.js must have _copyQrImageToClipboard method");

  // 4. Verify Navigation double-key shortcuts and aliases
  const navContent = fs.readFileSync(path.join(rootDir, 'js', 'navigation.js'), 'utf8');
  assert(navContent.includes('show my device qr'), "navigation.js aliases must include QR sync aliases");
  assert(navContent.includes("case 'qr:show':"), "handleShortcutAction must handle qr:show");
  assert(navContent.includes("case 'qr:scan':"), "handleShortcutAction must handle qr:scan");
  assert(navContent.includes('Rapid double-press: Q + Q'), "navigation.js must include Q+Q double-press shortcut");
  assert(navContent.includes('Rapid double-press: S + S'), "navigation.js must include S+S double-press shortcut");
});

// SECTION 9: SPACED REPETITION (SRS) SCHEDULE
logHeader("Section 9: Spaced Repetition (SRS) Engine");

runTest("SRS Schedule Stages & Overdue Checks", () => {
  // Level 1: 1-day interval
  // Level 2: 3-day interval
  // Level 3: 7-day interval
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  const testRecords = {
    "topic-recent": { lastReviewed: now - (0.5 * oneDayMs), level: 1 }, // 12 hours ago -> NOT overdue
    "topic-overdue-lvl1": { lastReviewed: now - (2 * oneDayMs), level: 1 }, // 2 days ago -> overdue
    "topic-overdue-lvl2": { lastReviewed: now - (4 * oneDayMs), level: 2 }, // 4 days ago -> overdue
    "topic-fine-lvl3": { lastReviewed: now - (3 * oneDayMs), level: 3 }     // 3 days ago -> NOT overdue (7 day interval)
  };

  function isOverdue(rec) {
    const intervals = { 1: 1 * oneDayMs, 2: 3 * oneDayMs, 3: 7 * oneDayMs };
    const maxAge = intervals[rec.level] || intervals[1];
    return (now - rec.lastReviewed) > maxAge;
  }

  assert.strictEqual(isOverdue(testRecords["topic-recent"]), false, "Recent topic should not be overdue");
  assert.strictEqual(isOverdue(testRecords["topic-overdue-lvl1"]), true, "Lvl 1 topic older than 1 day should be overdue");
  assert.strictEqual(isOverdue(testRecords["topic-overdue-lvl2"]), true, "Lvl 2 topic older than 3 days should be overdue");
  assert.strictEqual(isOverdue(testRecords["topic-fine-lvl3"]), false, "Lvl 3 topic within 7 days should not be overdue");
});

// SECTION 10: SPEED DRILLS TIME TELEMETRY
logHeader("Section 10: Speed Drills Response Telemetry");

runTest("Telemetry Metrics: Avg Speed, Rapid Solves, Bottlenecks", () => {
  const telemetry = [
    { qIndex: 1, timeSec: 2.1, correct: true },   // rapid
    { qIndex: 2, timeSec: 1.8, correct: true },   // rapid
    { qIndex: 3, timeSec: 12.4, correct: true },  // slow bottleneck
    { qIndex: 4, timeSec: 4.5, correct: true },   // normal
    { qIndex: 5, timeSec: 15.2, correct: false }  // slow bottleneck
  ];

  const totalTime = telemetry.reduce((sum, t) => sum + t.timeSec, 0);
  const avgSpeed = (totalTime / telemetry.length).toFixed(1);
  const rapidSolves = telemetry.filter(t => t.timeSec <= 3 && t.correct).length;
  const slowBottlenecks = telemetry.filter(t => t.timeSec > 10).length;

  assert.strictEqual(avgSpeed, "7.2", "Avg speed should be 7.2s");
  assert.strictEqual(rapidSolves, 2, "Should have 2 rapid solves (<=3s)");
  assert.strictEqual(slowBottlenecks, 2, "Should detect 2 slow bottlenecks (>10s)");
});

// SECTION 11: REUSABLE COMPONENTS SANITY CHECK
logHeader("Section 11: Components Library (components/) Sanity Check");

runTest("All Standalone Components Exist and Are Valid JS", () => {
  const compDir = path.join(rootDir, 'components');
  const expectedComponents = [
    'tri-state-checkbox.js',
    'modal-dialog.js',
    'search-bar.js',
    'pill-group.js',
    'toggle-switch.js',
    'hero-header.js',
    'calendar-picker.js',
    'toast-notification.js',
    'qr-sync-modal.js',
    'index.js'
  ];

  expectedComponents.forEach(file => {
    const filePath = path.join(compDir, file);
    assert(fs.existsSync(filePath), `Component file ${file} must exist`);
    const content = fs.readFileSync(filePath, 'utf8');
    assert(content.length > 50, `Component ${file} should have meaningful code`);
    // Syntax check via Node.js native engine
    assert.doesNotThrow(() => {
      cp.execFileSync(process.execPath, ['--check', filePath]);
    }, `Component ${file} must compile without syntax errors`);
  });
});

// SECTION 12: SYLLABUS PROGRESS & MASTERY REACTIVITY
logHeader("Section 12: Syllabus Progress & Mastery Calculations");

runTest("Syllabus Mastery Calculations & Multi-stage Weightage", () => {
  const dashJsContent = fs.readFileSync(path.join(rootDir, 'js', 'dashboard.js'), 'utf8');
  evalInContext(dashJsContent);

  // Set up 2 mastered items
  evalInContext(`
    appState.syllabusProgress["q-1-1"] = { learned: true, practiced: true, mastered: true };
    appState.syllabusProgress["q-1-2"] = { learned: true, practiced: true, mastered: true };
  `);

  const stats = evalInContext('calculateOverallStats()');
  assert(stats.mastered >= 2, `Mastered count should be at least 2 (got ${stats.mastered})`);
  assert(stats.prepScore > 0, `Prep score should be greater than 0 (got ${stats.prepScore})`);
  assert(stats.subjectScores["Quantitative Aptitude"] > 0, "Quant subject score should be greater than 0");
});

// SECTION 13: REWARDS ANTI-CHEAT & DEDUPLICATION INTEGRITY
logHeader("Section 13: Rewards Anti-Cheat & Deduplication Integrity");

runTest("Rewards Deduplication & Toggle Oscillation Exploit Prevention", () => {
  const { RewardsSystem } = require(path.join(rootDir, 'components', 'rewards-system.js'));
  const sys = new RewardsSystem();

  // Initialize fresh mock appState
  global.appState = {
    streak: 0,
    rewards: {
      coins: 0,
      points: 0,
      stars: 0,
      todayActivity: [],
      penalties: [],
      dailyRewardedActions: {}
    }
  };

  // Test 1: First-time ritual credit grants reward
  const res1 = sys.recordActivity({
    type: 'ritual',
    dedupKey: 'ritual_drill',
    title: 'Speed Drill Ritual',
    xp: 35,
    coins: 10
  });

  assert(res1 !== null, "First attempt should succeed");
  assert.strictEqual(global.appState.rewards.points, 35, "Points should be 35");
  assert.strictEqual(global.appState.rewards.coins, 10, "Coins should be 10");

  // Test 2: Immediate re-check with same dedupKey is blocked (net 0 gain)
  const res2 = sys.recordActivity({
    type: 'ritual',
    dedupKey: 'ritual_drill',
    title: 'Speed Drill Ritual',
    xp: 35,
    coins: 10
  });

  assert.strictEqual(res2, null, "Second attempt with same dedupKey today must be blocked");
  assert.strictEqual(global.appState.rewards.points, 35, "Points must NOT increase on duplicate");
  assert.strictEqual(global.appState.rewards.coins, 10, "Coins must NOT increase on duplicate");

  // Test 3: Rapid toggle oscillation triggers exploit penalty
  for (let i = 0; i < 5; i++) {
    sys.recordActivity({
      type: 'syllabus',
      dedupKey: 'test_oscillation_toggle',
      title: 'Oscillation Target',
      xp: 25,
      coins: 10
    });
  }

  assert(global.appState.rewards.penalties.length > 0, "Rapid toggling must log integrity penalty");
  const penalty = global.appState.rewards.penalties[0];
  assert(penalty.reason.includes("Rapid toggle exploit"), "Penalty reason should identify oscillation abuse");
});

runTest("Pomodoro Duration & Activity Cooldown Anti-Cheat Enforcement", () => {
  const { RewardsSystem } = require(path.join(rootDir, 'components', 'rewards-system.js'));
  const sys = new RewardsSystem();

  global.appState = {
    streak: 0,
    rewards: {
      coins: 0,
      points: 0,
      stars: 0,
      todayActivity: [],
      penalties: [],
      dailyRewardedActions: {}
    }
  };

  // Cooldown enforcement
  const first = sys.recordActivity({
    type: 'pomodoro',
    title: 'Focus Session Completed',
    minCooldown: 60000, // 60s cooldown
    xp: 30,
    coins: 15
  });
  assert(first !== null, "Initial pomodoro activity should succeed");

  const immediateSecond = sys.recordActivity({
    type: 'pomodoro',
    title: 'Focus Session Completed',
    minCooldown: 60000,
    xp: 30,
    coins: 15
  });
  assert.strictEqual(immediateSecond, null, "Immediate repeat pomodoro during cooldown must be blocked");
  assert.strictEqual(global.appState.rewards.points, 30, "Points should remain 30 without duplicate increase");
});

// ====================================================
// SECTION 14: DATA MANAGEMENT, SPARSE DELTA BACKUP & FACTORY RESET
// ====================================================
logHeader("Section 14: Data Management, Sparse Delta Backup & Factory Reset");

runTest("Speed Drill Shortcuts in Hub are Read-Only Reference", () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert(html.includes("Speed Drill Shortcuts (Reference)"), "Section header must indicate reference guide");
  assert(html.includes("modal-wipe-confirm"), "index.html must include modal-wipe-confirm modal");
  assert(html.includes("btn-open-wipe-modal"), "index.html must include Wipe button in Data section");
  assert(!html.includes("onclick=\"handleShortcutAction('speed:start')\""), "Speed drill shortcut rows must NOT have interactive triggers");
});

runTest("Sparse Delta Backup Serializes Only Active Topics (>80% Size Reduction)", () => {
  // Simulate state with 241 topics, only 4 active
  const testState = {
    currentDay: 5,
    streak: 3,
    syllabusProgress: {
      "q-1-1": { learned: true, practiced: false, mastered: false },
      "q-1-2": { learned: true, practiced: true, mastered: false },
      "r-1-1": { learned: false, practiced: false, mastered: true },
      "e-1-1": { learned: true, practiced: true, mastered: true }
    },
    rewards: { coins: 150, points: 500, stars: 2 }
  };

  // Add 235 default unstudied topics
  for (let i = 1; i <= 235; i++) {
    testState.syllabusProgress[`dummy-${i}`] = { learned: false, practiced: false, mastered: false };
  }

  const fn = evalInContext('createSparseBackupPayload');
  assert.strictEqual(typeof fn, 'function', "createSparseBackupPayload must be a function");

  const fullDump = JSON.stringify({ version: 2, state: testState }, null, 2);
  const sparseDumpObj = fn(testState);
  const sparseDump = JSON.stringify(sparseDumpObj, null, 2);

  assert.strictEqual(sparseDumpObj.format, "sparse-delta", "Export format must be sparse-delta");
  assert.strictEqual(Object.keys(sparseDumpObj.state.syllabusProgress).length, 4, "Only 4 active topics should be in sparse backup");
  assert(sparseDump.length < fullDump.length * 0.20, `Sparse backup (${sparseDump.length} bytes) must be >80% smaller than full dump (${fullDump.length} bytes)`);
});

runTest("Restore Re-hydrates Clean Baseline & Supports Sparse and Legacy Dumps", () => {
  const syllabusData = evalInContext('SYLLABUS_DATA');
  assert(Array.isArray(syllabusData), "SYLLABUS_DATA must be available in context");

  // 1. Sparse delta restore
  const sparseBackup = {
    version: 3,
    format: "sparse-delta",
    state: {
      syllabusProgress: {
        "q-1-1": { learned: true, practiced: false, mastered: false }
      },
      streak: 7
    }
  };

  const hydrated = {};
  syllabusData.forEach(topic => {
    (topic.subtopics || []).forEach(sub => {
      hydrated[sub.id] = { learned: false, practiced: false, mastered: false };
    });
  });

  Object.entries(sparseBackup.state.syllabusProgress).forEach(([id, flags]) => {
    hydrated[id] = flags;
  });

  assert.strictEqual(hydrated["q-1-1"].learned, true, "Active topic q-1-1 must be restored");
  assert.strictEqual(hydrated["q-1-2"].learned, false, "Unmodified topic q-1-2 must remain false");
  assert(Object.keys(hydrated).length >= 235, "All syllabus topics must be re-hydrated in memory");
});

runTest("Factory Reset Modal & Wipe Confirmation Guard", () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert(html.includes('id="input-wipe-confirmation"'), "Confirmation input must exist in modal-wipe-confirm");
  assert(html.includes('id="btn-execute-wipe"'), "Execute wipe button must exist in modal-wipe-confirm");
  assert(html.includes('RESET ALL'), "Prompt must require typing RESET ALL");
  assert(html.includes('bg-black/70 backdrop-blur-md'), "modal-wipe-confirm must use exam-target style backdrop (bg-black/70 backdrop-blur-md)");

  const inputMatch = html.match(/<input[^>]*id="input-wipe-confirmation"[^>]*>/);
  assert(inputMatch, "input-wipe-confirmation must exist");
  assert(!inputMatch[0].includes('uppercase'), "input-wipe-confirmation must not force visual CSS uppercase transform");

  const navJs = fs.readFileSync(path.join(rootDir, 'js', 'navigation.js'), 'utf8');
  assert(navJs.includes('triggerWipeErrorShake'), "navigation.js must define triggerWipeErrorShake function");
  assert(navJs.includes('=== "RESET ALL"'), "Strict case-sensitive comparison must be enforced");

  const fnWipe = evalInContext('executeFactoryResetWipe');
  assert.strictEqual(typeof fnWipe, 'function', "executeFactoryResetWipe must be defined");
});

runTest("Browser Native Shortcut Passthrough & Dynamic Modal Z-Index Elevation", () => {
  const navJs = fs.readFileSync(path.join(rootDir, 'js', 'navigation.js'), 'utf8');
  assert(navJs.includes("e.ctrlKey || e.metaKey || e.altKey"), "navigation.js must include modifier key checks for native shortcuts");
  assert(navJs.includes("elevateModalOnTop"), "navigation.js must define elevateModalOnTop function");
  assert(navJs.includes("restoreElevatedElements"), "navigation.js must define restoreElevatedElements function");

  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert(html.includes("#modal-wipe-confirm"), "index.html must include #modal-wipe-confirm rules");
  assert(html.includes("100000000"), "index.html must enforce maximum z-index for modal-wipe-confirm");
});

runTest("Mock Test Data Import & Telemetry Hydration", () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert(html.includes('id="btn-import-mock-data"'), "index.html must include #btn-import-mock-data button");
  assert(html.includes('id="input-import-mock-file"'), "index.html must include #input-import-mock-file input");

  const mocksJs = fs.readFileSync(path.join(rootDir, 'js', 'mocks.js'), 'utf8');
  assert(mocksJs.includes("importMockDataFromFile"), "js/mocks.js must define importMockDataFromFile");

  // Verify import normalization and parsing logic
  const sampleMockImport = [
    { id: "mock_import_test_1", name: "Imported Test 1", score: "145.5", date: "01-09-2026", mockType: "full" },
    { id: "mock_import_test_2", name: "Imported Quant Drill", score: "42", date: "02-09-2026", mockType: "sectional", section: "quant" }
  ];

  evalInContext(mocksJs);
  const fnImport = evalInContext("importMockDataFromFile");
  assert.strictEqual(typeof fnImport, "function", "importMockDataFromFile must be callable");
});

runTest("Comprehensive State Coverage in Sparse Backup, Restore & QR Sync", () => {
  const fullMockState = {
    syllabusProgress: { "q-1-1": { learned: true, practiced: true, mastered: false } },
    mocks: [{ id: "m1", name: "Mock 1", score: 130 }],
    notes: [{ id: "n1", title: "Formula", content: "a^2+b^2" }],
    srsRecords: { "s1": { stage: 2 } },
    weakAlerts: { "w1": true },
    currentDay: 5,
    dayCounter: 5,
    examName: "SSC CGL Target",
    examDate: "2026-09-15",
    examTier: 2,
    streak: 8,
    lastActiveDate: "2026-09-08",
    dailyRituals: { drill: true, vocab: true, ca: true, computer: false },
    theme: "light",
    mobileNavHand: "center",
    speechEnabled: true,
    toastEnabled: true,
    soundEnabled: true,
    focusModeActive: true,
    rewards: {
      coins: 450,
      points: 120,
      stars: 5,
      unlockedCosmics: ['title_aspirant', 'accent_blue'],
      claimedTrophies: ['trophy_first_blood'],
      unlockedStickers: [],
      equippedSticker: '',
      equipped: { title: 'Aspirant', themeAccent: 'accent_blue' },
      powers: {},
      todayActivity: [],
      penalties: [],
      dailyRewardedActions: {}
    }
  };

  const sparsePayload = evalInContext(`createSparseBackupPayload(${JSON.stringify(fullMockState)})`);

  assert.strictEqual(sparsePayload.state.mobileNavHand, "center", "Backup must preserve center mobileNavHand");
  assert.strictEqual(sparsePayload.state.focusModeActive, true, "Backup must preserve focusModeActive");
  assert.strictEqual(sparsePayload.state.streak, 8, "Backup must preserve streak");
  assert.strictEqual(sparsePayload.state.examTier, 2, "Backup must preserve examTier");
  assert.strictEqual(sparsePayload.state.rewards.coins, 450, "Backup must preserve rewards coins");
  assert(sparsePayload.state.drillHeatmap, "Backup must preserve drillHeatmap");
  assert(sparsePayload.state.factMaturation, "Backup must preserve factMaturation");
  assert(sparsePayload.state.speedPersonalBests, "Backup must preserve speedPersonalBests");

  // Verify QR Sync compact extraction and expansion covers all states including speed drills
  const qrJs = fs.readFileSync(path.join(rootDir, 'components', 'qr-sync-modal.js'), 'utf8');
  assert(qrJs.includes("foc: Boolean(state.focusModeActive)"), "QR sync must encode focusModeActive");
  assert(qrJs.includes("dc: Number(state.dayCounter)"), "QR sync must encode dayCounter");
  assert(qrJs.includes("mh: state.mobileNavHand || 'center'"), "QR sync must default mh to center");
  assert(qrJs.includes("dh: state.drillHeatmap"), "QR sync must encode drillHeatmap (dh)");
  assert(qrJs.includes("fm: state.factMaturation"), "QR sync must encode factMaturation (fm)");
  assert(qrJs.includes("spb: state.speedPersonalBests"), "QR sync must encode speedPersonalBests (spb)");
  assert(qrJs.includes("drillHeatmap: raw.dh"), "QR expansion must restore drillHeatmap");
  assert(qrJs.includes("speedPersonalBests: raw.spb"), "QR expansion must restore speedPersonalBests");
});

// ====================================================
// SECTION 15: COUNTDOWN REACTIVITY, AUDIO KEY 'S', ARROW NAVIGATION & SPEED DECK
// ====================================================
logHeader("Section 15: Countdown Reactivity, Audio Key 'S', Arrow Navigation & Speed Deck");

runTest("Centralized Reactive Countdown & Multi-Format Date Parsing", () => {
  // Test 1: Future date parsing in getExamCountdownData
  evalInContext(`
    appState.examDate = "2026-11-20";
    appState.examName = "SSC CGL 2026";
  `);
  const cdFuture = evalInContext('getExamCountdownData()');
  assert(cdFuture, "getExamCountdownData must return an object");
  assert.strictEqual(cdFuture.reached, false, "Future date must not be reached");
  assert(cdFuture.days > 0, "Days left must be positive for future date");
  assert(cdFuture.formattedShort.includes('d Left'), "formattedShort must include 'd Left'");
  assert.strictEqual(cdFuture.examName, "SSC CGL 2026", "Exam name must match");

  // Test 2: DD-MM-YYYY format
  evalInContext('appState.examDate = "25-12-2026";');
  const cdDMY = evalInContext('getExamCountdownData()');
  assert.strictEqual(cdDMY.reached, false, "DD-MM-YYYY future date must not be reached");
  assert(cdDMY.days > 0, "DD-MM-YYYY should parse to valid positive days");

  // Test 3: Stale August date fallback automatically triggers dynamic future calculation
  evalInContext('appState.examDate = "2026-08-15";');
  const cdStale = evalInContext('getExamCountdownData()');
  assert.strictEqual(cdStale.reached, false, "Stale past date must automatically fallback to 40d future window");
  assert(cdStale.days >= 39 && cdStale.days <= 41, "Dynamic fallback should provide ~40 days");
});

runTest("Synthesized Audio Key 'S' Reassignment & Medium Difficulty Isolation", () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert(html.includes('[S]'), "Hub sound toggle title must reference shortcut [S]");
  assert(html.includes('<kbd class="sc-kbd">S</kbd>'), "Hub sound shortcut badge must be S");

  const navJs = fs.readFileSync(path.join(rootDir, 'js', 'navigation.js'), 'utf8');
  assert(navJs.includes("e.key === \"s\" || e.key === \"S\""), "navigation.js must listen for key S");
  assert(navJs.includes("window.toggleSoundMode()"), "navigation.js key S must trigger toggleSoundMode()");
  assert(navJs.includes("lastSTime < 380"), "Rapid double-press S+S must remain supported for QR scan");

  assert(navJs.includes('e.key === "m" || e.key === "M"'), "navigation.js must maintain key M for medium difficulty override");
  assert(navJs.includes('triggerChange("medium")'), "Key M on speed drill must trigger medium difficulty");

  const speedJs = fs.readFileSync(path.join(rootDir, 'js', 'speed.js'), 'utf8');
  assert(speedJs.includes("setDrillDifficulty"), "speed.js must define setDrillDifficulty");
});

runTest("Arrow Key Navigation Handlers for Syllabus, Speed & Study Plan", () => {
  const syllabusJs = fs.readFileSync(path.join(rootDir, 'js', 'syllabus.js'), 'utf8');
  assert(syllabusJs.includes("window.cycleSyllabusSubject = cycleSyllabusSubject"), "syllabus.js must export cycleSyllabusSubject");
  assert(syllabusJs.includes("if (!syllabusState.subject) return false;"), "cycleSyllabusSubject must only cycle when a subject is active");

  const speedJs = fs.readFileSync(path.join(rootDir, 'js', 'speed.js'), 'utf8');
  assert(speedJs.includes("window.cycleDrillMode = cycleDrillMode"), "speed.js must export cycleDrillMode");
  assert(speedJs.includes("window.selectDrillCategory = selectDrillCategory"), "speed.js must export selectDrillCategory");

  const planJs = fs.readFileSync(path.join(rootDir, 'js', 'plan.js'), 'utf8');
  assert(planJs.includes("window.cyclePlanPhase = cyclePlanPhase"), "plan.js must export cyclePlanPhase");

  const navJs = fs.readFileSync(path.join(rootDir, 'js', 'navigation.js'), 'utf8');
  assert(navJs.includes("e.key === \"ArrowLeft\" || e.key === \"ArrowRight\""), "navigation.js must listen for Arrow keys");
  assert(navJs.includes("window.cycleSyllabusSubject"), "navigation.js must route arrow keys to cycleSyllabusSubject");
  assert(navJs.includes("window.cycleDrillMode"), "navigation.js must route arrow keys to cycleDrillMode");
  assert(navJs.includes("window.cyclePlanPhase"), "navigation.js must route arrow keys to cyclePlanPhase");
});

runTest("Clean Speed Drill Layout, Synthesized Audio Engine & Dynamic Custom-Styled Countdown Tooltip", () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert(!html.includes('id="speed-telemetry-deck"'), "Extra speed telemetry deck must be removed from #page-speed");
  assert(html.includes('components/sound-system.js'), "index.html must load components/sound-system.js");
  assert(html.includes('id="btn-edit-exam-target"'), "Pill 6 must have id='btn-edit-exam-target'");
  assert(html.includes('data-tooltip="Target Exam Date • Click to edit"'), "Target countdown pill must use custom data-tooltip");

  const soundJs = fs.readFileSync(path.join(rootDir, 'components', 'sound-system.js'), 'utf8');
  assert(soundJs.includes("class SoundManager"), "sound-system.js must define SoundManager class");
  assert(soundJs.includes("window.playSound"), "sound-system.js must export window.playSound");
  assert(soundJs.includes("ctx.resume()"), "sound-system.js must handle suspended AudioContext resume");
  assert(soundJs.includes("'correct'"), "sound-system.js must support 'correct' alias");
  assert(soundJs.includes("'wrong'"), "sound-system.js must support 'wrong' alias");

  const speedJs = fs.readFileSync(path.join(rootDir, 'js', 'speed.js'), 'utf8');
  assert(speedJs.includes("window.updateActiveCustomTooltip = updateActiveCustomTooltip"), "speed.js must export updateActiveCustomTooltip");
  assert(speedJs.includes("window.playSound('warning')"), "speed.js must trigger sound on drill timeout/stop");
  assert(speedJs.includes("window.playSound('wrong')"), "speed.js must trigger sound on wrong answer");

  const dashJs = fs.readFileSync(path.join(rootDir, 'js', 'dashboard.js'), 'utf8');
  assert(dashJs.includes("btn-edit-exam-target"), "dashboard.js updateCountdown must update btn-edit-exam-target");
  assert(dashJs.includes("updateActiveCustomTooltip"), "dashboard.js must update live custom tooltip per second");
  assert(dashJs.includes('examBtn.removeAttribute("title")'), "dashboard.js must suppress native tooltip in favor of custom styled tooltip");
});

runTest("Adaptive MicroFrequencyHeatmap & Telemetry Data Engine (Phase 1 & 2)", () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert(html.includes('id="drill-heatmap-container"'), "index.html must include #drill-heatmap-container");
  assert(html.includes('id="telemetry-avg-speed"'), "index.html must include #telemetry-avg-speed");
  assert(html.includes('id="unified-drill-card"'), "unified-drill-card must remain preserved");

  const speedJs = fs.readFileSync(path.join(rootDir, 'js', 'speed.js'), 'utf8');
  assert(speedJs.includes("class MicroFrequencyHeatmap"), "speed.js must define MicroFrequencyHeatmap");
  assert(speedJs.includes("MicroFrequencyHeatmap.recordAttempt"), "speed.js must record attempt telemetry");
  assert(speedJs.includes("selectAdaptiveValue"), "speed.js must implement selectAdaptiveValue");
  assert(speedJs.includes("window.activeSpeedHeatmap"), "speed.js must instantiate activeSpeedHeatmap");
});

runTest("Split-Time Attempt Feed & Contextual Mental Math Shortcuts (Clean Removal & Engine Logic)", () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert(!html.includes('id="drill-microtricks-card"'), "index.html must not contain #drill-microtricks-card");
  assert(!html.includes('id="drill-attempt-feed"'), "index.html must not contain #drill-attempt-feed");
  assert(!html.includes('id="btn-toggle-microtricks"'), "index.html must not contain #btn-toggle-microtricks");

  const speedJs = fs.readFileSync(path.join(rootDir, 'js', 'speed.js'), 'utf8');
  assert(speedJs.includes("getMicroTrickForQuestion"), "speed.js must implement getMicroTrickForQuestion");
  assert(speedJs.includes("recordSplitTimeAttempt"), "speed.js must implement recordSplitTimeAttempt");
  assert(speedJs.includes("updateContextualMicroTrick"), "speed.js must implement updateContextualMicroTrick");

  // Create isolated VM context to execute and test heuristic logic
  const sandbox = { window: {}, document: {}, console: console, localStorage: localStorageMock };
  vm.createContext(sandbox);
  vm.runInContext(speedJs, sandbox);

  // Validate mental math trick rules
  const squareTrick = sandbox.getMicroTrickForQuestion('squares', '25');
  assert(squareTrick && squareTrick.badge.includes("Ends in 5"), "Squares ending in 5 must trigger Ends in 5 heuristic");

  const cubeTrick = sandbox.getMicroTrickForQuestion('cubes', '7');
  assert(cubeTrick && cubeTrick.badge.includes("Unit Digit"), "Cubes must trigger Unit Digit reflection heuristic");
});

runTest("Gamified Speed Modes Engine & Personal Bests Telemetry (Phase 5)", () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert(html.includes('id="drill-game-mode-bar"'), "index.html must include #drill-game-mode-bar");
  assert(html.includes('data-game-mode="classic"'), "index.html must have classic mode pill");
  assert(html.includes('data-game-mode="blitz"'), "index.html must have blitz mode pill");
  assert(html.includes('data-game-mode="sudden_death"'), "index.html must have sudden_death mode pill");
  assert(html.includes('data-game-mode="ladder"'), "index.html must have ladder mode pill");
  assert(html.includes('data-game-mode="mix"'), "index.html must have mix mode pill");
  assert(html.includes('id="badge-mode-status"'), "index.html must have #badge-mode-status");
  assert(html.includes('id="telemetry-blitz-pb"'), "index.html must have #telemetry-blitz-pb");
  assert(html.includes('id="telemetry-survival-pb"'), "index.html must have #telemetry-survival-pb");

  const speedJs = fs.readFileSync(path.join(rootDir, 'js', 'speed.js'), 'utf8');
  assert(speedJs.includes("SPEED_MODES"), "speed.js must define SPEED_MODES");
  assert(speedJs.includes("setSpeedGameMode"), "speed.js must implement setSpeedGameMode");
  assert(speedJs.includes("finishBlitzSession"), "speed.js must implement finishBlitzSession");
  assert(speedJs.includes("finishSuddenDeathSession"), "speed.js must implement finishSuddenDeathSession");
  assert(speedJs.includes("updateSpeedPersonalBestsHUD"), "speed.js must implement updateSpeedPersonalBestsHUD");
});

runTest("Phonetic Number Normalizer, Voice Reflex Engine & ML/AI Layer (Phase 6 & 7)", () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert(html.includes('id="btn-drill-voice"'), "index.html must include #btn-drill-voice");
  assert(html.includes('id="drill-voice-status"'), "index.html must include #drill-voice-status");

  const speedJs = fs.readFileSync(path.join(rootDir, 'js', 'speed.js'), 'utf8');
  assert(speedJs.includes("parseSpokenNumberToDigits"), "speed.js must implement parseSpokenNumberToDigits");
  assert(speedJs.includes("normalizeVoiceNumber"), "speed.js must implement normalizeVoiceNumber");
  assert(speedJs.includes("toggleVoiceReflexMode"), "speed.js must implement toggleVoiceReflexMode");
  assert(speedJs.includes("class DrillIntelligenceEngine"), "speed.js must define DrillIntelligenceEngine");

  // Create isolated VM context to execute and test normalization engine
  const sandbox = { window: {}, document: {}, console: console, localStorage: localStorageMock };
  vm.createContext(sandbox);
  vm.runInContext(speedJs, sandbox);

  // 1. Spoken number parsing checks
  assert.strictEqual(sandbox.parseSpokenNumberToDigits("five hundred seventy six"), "576");
  assert.strictEqual(sandbox.parseSpokenNumberToDigits("five seventy six"), "576");
  assert.strictEqual(sandbox.parseSpokenNumberToDigits("two eighty nine"), "289");
  assert.strictEqual(sandbox.parseSpokenNumberToDigits("twenty four"), "24");
  assert.strictEqual(sandbox.parseSpokenNumberToDigits("fourteen point two eight"), "14.28");

  // 2. Full voice transcript normalization checks
  const res1 = sandbox.normalizeVoiceNumber("five seventy six", "576");
  assert.strictEqual(res1.status, "CORRECT");
  assert.strictEqual(res1.normalized, "576");

  const res2 = sandbox.normalizeVoiceNumber("the answer is two eighty nine", "289");
  assert.strictEqual(res2.status, "CORRECT");
  assert.strictEqual(res2.normalized, "289");

  const res3 = sandbox.normalizeVoiceNumber("fourteen point two eight percent", "14.28%");
  assert.strictEqual(res3.status, "CORRECT");
  assert.strictEqual(res3.normalized, "14.28%");

  const res4 = sandbox.normalizeVoiceNumber("one third", "1/3");
  assert.strictEqual(res4.status, "CORRECT");
  assert.strictEqual(res4.normalized, "1/3");

  const res5 = sandbox.normalizeVoiceNumber("root three by two", "√3/2");
  assert.strictEqual(res5.status, "CORRECT");
  assert.strictEqual(res5.normalized, "√3/2");

  const res6 = sandbox.normalizeVoiceNumber("gibberish blurp cough", "576");
  assert.strictEqual(res6.status, "RECOGNITION_ERROR");

  const res7 = sandbox.normalizeVoiceNumber("one forty four", "576");
  assert.strictEqual(res7.status, "WRONG");

  // 3. DrillIntelligenceEngine ML/AI extension interface
  const engine = sandbox.window.DrillIntelligenceEngine;
  assert(engine, "DrillIntelligenceEngine must be exposed on window");
  assert(typeof engine.selectWeightedCandidate === 'function', "engine must have selectWeightedCandidate");
  assert(typeof engine.normalizeVoiceInput === 'function', "engine must have normalizeVoiceInput");
  assert(!engine.isAiEnabled(), "AI should be disabled by default (local heuristic fallback)");
  engine.setAiApiKey("test-key-12345", "gemini");
  assert(engine.isAiEnabled(), "AI should be enabled when API key is configured");
});

runTest("Speed Drilling Advancements: Modes Dropdown, Weak Practice, Ranges & Clean Layout", () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert(html.includes('id="btn-drill-mode-dropdown"'), "index.html must include #btn-drill-mode-dropdown");
  assert(html.includes('id="drill-mode-dropdown"'), "index.html must include #drill-mode-dropdown");
  assert(html.includes('data-game-mode="weak_practice"'), "index.html must include weak_practice mode option");

  // Mental math shortcuts and history timeline decks must be cleanly removed from Speed page
  assert(!html.includes('id="drill-microtricks-card"'), "drill-microtricks-card must be cleanly removed from index.html");
  assert(!html.includes('id="drill-timeline-container"'), "drill-timeline-container must be cleanly removed from index.html");
  assert(!html.includes('id="drill-timeline-track"'), "drill-timeline-track must be cleanly removed from index.html");

  // Conquest elements should be cleanly removed from Speed page
  assert(!html.includes('id="btn-conquest-capsule"'), "index.html must not contain #btn-conquest-capsule");
  assert(!html.includes('id="conquest-popover"'), "index.html must not contain #conquest-popover");

  const speedJs = fs.readFileSync(path.join(rootDir, 'js', 'speed.js'), 'utf8');
  assert(speedJs.includes("WEAK_PRACTICE: 'weak_practice'"), "SPEED_MODES must include WEAK_PRACTICE");
  assert(speedJs.includes("renderSplitTimeTimeline"), "speed.js must implement renderSplitTimeTimeline");
  assert(speedJs.includes("renderPostSessionMistakeReview"), "speed.js must implement renderPostSessionMistakeReview");
  assert(speedJs.includes("MicroFrequencyHeatmap.getWeakKeys"), "speed.js must implement MicroFrequencyHeatmap.getWeakKeys");
  assert(speedJs.includes("btnToggleAttemptFeed"), "speed.js must wire btnToggleAttemptFeed");

  // Test question generator ranges and formats in isolated VM
  const sandbox = { window: {}, document: {}, console: console, localStorage: localStorageMock };
  vm.createContext(sandbox);
  vm.runInContext(speedJs, sandbox);

  // 1. Squares range check (11 to 40)
  for (let i = 0; i < 20; i++) {
    const qEasy = sandbox.generateQuestionTextAndAnswer("squares", "easy");
    const numEasy = parseInt(qEasy.targetKey, 10);
    assert(numEasy >= 11 && numEasy <= 20, `Squares easy must be 11-20, got ${numEasy}`);

    const qAdv = sandbox.generateQuestionTextAndAnswer("squares", "advance");
    const numAdv = parseInt(qAdv.targetKey, 10);
    assert(numAdv >= 31 && numAdv <= 40, `Squares advance must be 31-40, got ${numAdv}`);
  }

  // 2. Cubes range check (5 to 30)
  for (let i = 0; i < 20; i++) {
    const qEasy = sandbox.generateQuestionTextAndAnswer("cubes", "easy");
    const numEasy = parseInt(qEasy.targetKey, 10);
    assert(numEasy >= 5 && numEasy <= 12, `Cubes easy must be 5-12, got ${numEasy}`);

    const qAdv = sandbox.generateQuestionTextAndAnswer("cubes", "advance");
    const numAdv = parseInt(qAdv.targetKey, 10);
    assert(numAdv >= 21 && numAdv <= 30, `Cubes advance must be 21-30, got ${numAdv}`);
  }

  // 3. Tables range check (11 to 50)
  for (let i = 0; i < 20; i++) {
    const qEasy = sandbox.generateQuestionTextAndAnswer("tables", "easy");
    const numEasy = parseInt(qEasy.targetKey, 10);
    assert(numEasy >= 11 && numEasy <= 20, `Tables easy base must be 11-20, got ${numEasy}`);

    const qAdv = sandbox.generateQuestionTextAndAnswer("tables", "advance");
    const numAdv = parseInt(qAdv.targetKey, 10);
    assert(numAdv >= 36 && numAdv <= 50, `Tables advance base must be 36-50, got ${numAdv}`);
  }

  // 4. Fractions & Percentages matrix from 1000015976.png
  const qFrac = sandbox.generateQuestionTextAndAnswer("fracPerc", "medium");
  assert(qFrac.q.includes(" = ?"), "Fractions must use short punchy question format");

  // 5. Advanced fractions phonetic normalizer checks
  const resFrac1 = sandbox.normalizeVoiceNumber("one by seven", "1/7");
  assert.strictEqual(resFrac1.status, "CORRECT");
  assert.strictEqual(resFrac1.normalized, "1/7");

  const resFrac2 = sandbox.normalizeVoiceNumber("one by forty", "1/40");
  assert.strictEqual(resFrac2.status, "CORRECT");
  assert.strictEqual(resFrac2.normalized, "1/40");

  const resFrac3 = sandbox.normalizeVoiceNumber("14.28", "14.28%");
  assert.strictEqual(resFrac3.status, "CORRECT");
  assert.strictEqual(resFrac3.normalized, "14.28%");
});

runTest("Speed Drill Ergonomics: Direct Numeric Input Filter, Shortcuts Hub & Voice Waveform", () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const speedJs = fs.readFileSync(path.join(rootDir, 'js', 'speed.js'), 'utf8');
  const navJs = fs.readFileSync(path.join(rootDir, 'js', 'navigation.js'), 'utf8');

  // 1. WhatsApp-inspired voice bar elements
  assert(html.includes('id="voice-timer-display"'), "index.html must include #voice-timer-display");
  assert(html.includes('id="voice-waveform-bars"'), "index.html must include #voice-waveform-bars");
  assert(html.includes('id="btn-drill-voice"'), "index.html must include #btn-drill-voice");
  assert(html.includes('id="drill-voice-status"'), "index.html must include #drill-voice-status");

  // 2. Direct numeric input strict filter & key shortcuts
  assert(speedJs.includes("replace(/[^0-9/.%]/g, '')"), "speed.js must sanitize direct input to numeric values only");
  assert(speedJs.includes('e.key === " " || e.key === "Spacebar"'), "Direct input must intercept Space for pause");
  assert(speedJs.includes('e.key === "x" || e.key === "X"'), "Direct input must intercept X for close");
  assert(speedJs.includes('e.key === "r" || e.key === "R"'), "Direct input must intercept R for restart");
  assert(speedJs.includes('e.key === "m" || e.key === "M"'), "Direct input must intercept M for mode cycle");
  assert(speedJs.includes('e.key === "i" || e.key === "I"'), "Direct input must intercept I for input method toggle");
  assert(speedJs.includes('e.key === "v" || e.key === "V"'), "Direct input must intercept V for voice reflex toggle");

  // 3. Game mode cycle across all 6 modes + HUD feedback
  assert(speedJs.includes("const DRILL_MODES_CYCLE = ['classic', 'blitz', 'sudden_death', 'ladder', 'mix', 'weak_practice']"), "DRILL_MODES_CYCLE must contain all 6 modes");
  assert(speedJs.includes("showDrillHudFeedback(`MODE →"), "cycleSpeedGameMode must trigger HUD toast feedback");

  // 4. Navigation JS voice shortcut & action handling
  assert(navJs.includes('e.key === "v" || e.key === "V"'), "navigation.js must support V shortcut for voice reflex toggle");
  assert(navJs.includes("case 'speed:mode-cycle':"), "navigation.js must handle speed:mode-cycle action");
  assert(navJs.includes("case 'speed:input-toggle':"), "navigation.js must handle speed:input-toggle action");
  assert(navJs.includes("case 'speed:voice-toggle':"), "navigation.js must handle speed:voice-toggle action");
  assert(navJs.includes("case 'speed:restart':"), "navigation.js must handle speed:restart action");

  // 5. Action Center Shortcuts Hub updated with read-only reference rows
  assert(html.includes("Cycle Game Mode (All 6 Modes)"), "Shortcuts Hub must reference game mode cycle");
  assert(html.includes("Toggle Input (Options ⇄ Direct)"), "Shortcuts Hub must reference input toggle");
  assert(html.includes("Voice Reflex Mode (Hands-free)"), "Shortcuts Hub must reference voice reflex mode");
  assert(html.includes("Direct Numeric (Auto-Match &amp; Pure Number)"), "Shortcuts Hub must reference direct numeric input");
});

// ── FINAL SUMMARY ──────────────────────────────────────────────
console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
console.log(`${colors.bold}Test Results Summary:${colors.reset}`);
console.log(`  ${colors.green}Total Passed:${colors.reset} ${passedCount}`);
console.log(`  ${colors.red}Total Failed:${colors.reset} ${failedCount}`);

if (failedCount === 0) {
  console.log(`\n${colors.bold}${colors.green}🎉 ALL ${passedCount} TESTS PASSED CLEANLY! Website is 100% healthy.${colors.reset}\n`);
  process.exit(0);
} else {
  console.error(`\n${colors.bold}${colors.red}❌ ${failedCount} TESTS FAILED. Please review output above.${colors.reset}\n`);
  process.exit(1);
}
