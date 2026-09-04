/**
 * Conquest Web Application - Comprehensive Automated Test Suite
 * File: tests/suite.js
 * Usage: node tests/suite.js
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

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
