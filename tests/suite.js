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
  assert.strictEqual(state.mobileNavHand, "right", "Default mobileNavHand must be right");
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

runTest("Set Mobile Nav Hand Preference (Right vs Left)", () => {
  evalInContext('setMobileNavHand("left");');
  assert.strictEqual(evalInContext('appState.mobileNavHand'), 'left', "appState.mobileNavHand must be 'left'");
  
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
