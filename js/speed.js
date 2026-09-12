// === SPEED DRILLS LOGIC MODULE ===
let drillMode = "squares"; 
let drillAnswerVal = null;
let drillAttempts = 0;
let drillCorrect = 0;
let drillStreak = 0;
let drillTimerInterval = null;
let drillTimerSecs = 15;
let drillIsPlaying = false;
let consecutiveTimeoutsCount = 0;

let isChallengeActive = false;
let challengeTimeRemaining = 900;
let challengeTimerInterval = null;
let challengeQuestionIndex = 0;
let challengeScore = 0;
let challengeCorrectAnswerVal = null;

let currentDrillInputMethod = "mcq";
let ghostRecoveryQueue = [];
let currentDrillSessionTurn = 0;
let isCurrentQuestionRecovery = false;
let currentQuestionData = null;
let isHesitantTargetMode = false;

// Dynamically expose values to window namespace
if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'drillIsPlaying', {
        get: () => drillIsPlaying,
        set: (v) => { drillIsPlaying = v; }
    });
    Object.defineProperty(window, 'isChallengeActive', {
        get: () => isChallengeActive,
        set: (v) => { isChallengeActive = v; }
    });
    Object.defineProperty(window, 'currentDrillInputMethod', {
        get: () => currentDrillInputMethod,
        set: (v) => { currentDrillInputMethod = v; }
    });
    Object.defineProperty(window, 'isHesitantTargetMode', {
        get: () => isHesitantTargetMode,
        set: (v) => { isHesitantTargetMode = v; }
    });
}

if (typeof window.setDropdownVisible !== 'function') {
    window.setDropdownVisible = function(el, visible) {
        if (!el) return;
        if (visible) el.classList.remove('hidden');
        else el.classList.add('hidden');
    };
}

// Mode Config Mapping for display titles
const DRILL_MODE_LABELS = {
    squares: "Squares (11 to 40)",
    cubes: "Cubes (5 to 30)",
    tables: "Tables (11 to 50)",
    fracPerc: "Frac-Percent (Dual)",
    triplets: "Triplets (Δ)",
    algebra: "Algebra Ident.",
    lcm: "LCM (3 Nos)",
    hcf: "HCF (3 Nos)",
    alphabets: "Alphabet Codes",
    geomCenters: "Geometry Centers",
    trigReflex: "Trig Reflexes"
};

// 5-second Idle Auto-Close logic
let autoCloseTimer = null;

function startIdleTimer() {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = setTimeout(() => {
        const overlay = document.getElementById("drill-paused-overlay");
        if (overlay && !overlay.classList.contains("hidden")) {
            if (isChallengeActive) {
                endChallengeRun(false, true); // Abort challenge
            } else {
                resetDrillSession(); // Stop free drill
            }
            speakText("Session closed due to inactivity");
        }
    }, 5000);
}

function clearIdleTimer() {
    clearTimeout(autoCloseTimer);
}

// === ADAPTIVE SPEED DRILLS HEATMAP & ML/AI INTELLIGENCE ENGINE ===
let currentQuestionStartTime = 0;
let currentTargetValue = null;
let currentQuestionTargetKey = null;

class MicroFrequencyHeatmap {
    constructor(containerEl, options = {}) {
        this.container = typeof containerEl === 'string' ? document.querySelector(containerEl) : containerEl;
        this.options = Object.assign({
            category: 'squares',
            onSelectValue: null,
            enableFocusFilter: true
        }, options);

        this.focusedValue = null;
        this.activeCategory = this.options.category;
    }

    static getDomainSpec(category) {
        switch (category) {
            case 'squares':
                return {
                    title: 'Squares (11–40) Heatmap',
                    unit: '²',
                    cols: 6,
                    items: Array.from({ length: 30 }, (_, i) => {
                        const n = i + 11;
                        return {
                            id: n,
                            label: `${n}²`,
                            short: String(n),
                            expected: String(n * n)
                        };
                    })
                };
            case 'cubes':
                return {
                    title: 'Cubes (5–30) Heatmap',
                    unit: '³',
                    cols: 6,
                    items: Array.from({ length: 26 }, (_, i) => {
                        const n = i + 5;
                        return {
                            id: n,
                            label: `${n}³`,
                            short: String(n),
                            expected: String(n * n * n)
                        };
                    })
                };
            case 'tables':
                return {
                    title: 'Tables (11–50) Heatmap',
                    unit: '×',
                    cols: 8,
                    items: Array.from({ length: 40 }, (_, i) => {
                        const n = i + 11;
                        return {
                            id: n,
                            label: `T-${n}`,
                            short: String(n),
                            expected: `×${n}`
                        };
                    })
                };
            case 'fracPerc':
                return {
                    title: 'Fraction Families Heatmap',
                    unit: '%',
                    cols: 5,
                    items: [
                        { id: '1/3', label: '1/3', short: '1/3', expected: '33.33%' },
                        { id: '2/3', label: '2/3', short: '2/3', expected: '66.67%' },
                        { id: '1/4', label: '1/4', short: '1/4', expected: '25%' },
                        { id: '3/4', label: '3/4', short: '3/4', expected: '75%' },
                        { id: '1/5', label: '1/5', short: '1/5', expected: '20%' },
                        { id: '2/5', label: '2/5', short: '2/5', expected: '40%' },
                        { id: '3/5', label: '3/5', short: '3/5', expected: '60%' },
                        { id: '4/5', label: '4/5', short: '4/5', expected: '80%' },
                        { id: '1/6', label: '1/6', short: '1/6', expected: '16.67%' },
                        { id: '5/6', label: '5/6', short: '5/6', expected: '83.33%' },
                        { id: '1/7', label: '1/7', short: '1/7', expected: '14.28%' },
                        { id: '2/7', label: '2/7', short: '2/7', expected: '28.57%' },
                        { id: '3/7', label: '3/7', short: '3/7', expected: '42.85%' },
                        { id: '4/7', label: '4/7', short: '4/7', expected: '57.14%' },
                        { id: '5/7', label: '5/7', short: '5/7', expected: '71.42%' },
                        { id: '6/7', label: '6/7', short: '6/7', expected: '85.71%' },
                        { id: '1/8', label: '1/8', short: '1/8', expected: '12.5%' },
                        { id: '3/8', label: '3/8', short: '3/8', expected: '37.5%' },
                        { id: '5/8', label: '5/8', short: '5/8', expected: '62.5%' },
                        { id: '7/8', label: '7/8', short: '7/8', expected: '87.5%' },
                        { id: '1/9', label: '1/9', short: '1/9', expected: '11.11%' },
                        { id: '2/9', label: '2/9', short: '2/9', expected: '22.22%' },
                        { id: '4/9', label: '4/9', short: '4/9', expected: '44.44%' },
                        { id: '5/9', label: '5/9', short: '5/9', expected: '55.56%' },
                        { id: '7/9', label: '7/9', short: '7/9', expected: '77.78%' },
                        { id: '8/9', label: '8/9', short: '8/9', expected: '88.89%' },
                        { id: '1/11', label: '1/11', short: '1/11', expected: '9.09%' },
                        { id: '2/11', label: '2/11', short: '2/11', expected: '18.18%' },
                        { id: '3/11', label: '3/11', short: '3/11', expected: '27.27%' },
                        { id: '4/11', label: '4/11', short: '4/11', expected: '36.36%' },
                        { id: '5/11', label: '5/11', short: '5/11', expected: '45.45%' },
                        { id: '6/11', label: '6/11', short: '6/11', expected: '54.54%' },
                        { id: '7/11', label: '7/11', short: '7/11', expected: '63.63%' },
                        { id: '8/11', label: '8/11', short: '8/11', expected: '72.72%' },
                        { id: '9/11', label: '9/11', short: '9/11', expected: '81.81%' },
                        { id: '10/11', label: '10/11', short: '10/11', expected: '90.90%' },
                        { id: '1/12', label: '1/12', short: '1/12', expected: '8.33%' },
                        { id: '5/12', label: '5/12', short: '5/12', expected: '41.67%' },
                        { id: '7/12', label: '7/12', short: '7/12', expected: '58.33%' },
                        { id: '11/12', label: '11/12', short: '11/12', expected: '91.67%' },
                        { id: '1/13', label: '1/13', short: '1/13', expected: '7.69%' },
                        { id: '1/14', label: '1/14', short: '1/14', expected: '7.14%' },
                        { id: '1/15', label: '1/15', short: '1/15', expected: '6.67%' },
                        { id: '1/16', label: '1/16', short: '1/16', expected: '6.25%' },
                        { id: '1/17', label: '1/17', short: '1/17', expected: '5.88%' },
                        { id: '1/18', label: '1/18', short: '1/18', expected: '5.56%' },
                        { id: '1/19', label: '1/19', short: '1/19', expected: '5.26%' },
                        { id: '1/20', label: '1/20', short: '1/20', expected: '5%' },
                        { id: '1/24', label: '1/24', short: '1/24', expected: '4.17%' },
                        { id: '1/25', label: '1/25', short: '1/25', expected: '4%' },
                        { id: '1/40', label: '1/40', short: '1/40', expected: '2.5%' }
                    ]
                };
            case 'triplets':
                return {
                    title: 'Base Triplets (Δ) Heatmap',
                    unit: 'Δ',
                    cols: 4,
                    items: [
                        { id: '3-4-5', label: '3, 4, 5', short: '3-4-5', expected: '5' },
                        { id: '5-12-13', label: '5, 12, 13', short: '5-12', expected: '13' },
                        { id: '8-15-17', label: '8, 15, 17', short: '8-15', expected: '17' },
                        { id: '7-24-25', label: '7, 24, 25', short: '7-24', expected: '25' },
                        { id: '9-40-41', label: '9, 40, 41', short: '9-40', expected: '41' },
                        { id: '11-60-61', label: '11, 60, 61', short: '11-60', expected: '61' },
                        { id: '12-35-37', label: '12, 35, 37', short: '12-35', expected: '37' },
                        { id: '20-21-29', label: '20, 21, 29', short: '20-21', expected: '29' },
                        { id: '28-45-53', label: '28, 45, 53', short: '28-45', expected: '53' },
                        { id: '33-56-65', label: '33, 56, 65', short: '33-56', expected: '65' },
                        { id: '16-63-65', label: '16, 63, 65', short: '16-63', expected: '65' },
                        { id: '48-55-73', label: '48, 55, 73', short: '48-55', expected: '73' }
                    ]
                };
            case 'algebra':
                return {
                    title: 'Algebra Identities Heatmap',
                    unit: 'ƒ',
                    cols: 3,
                    items: [
                        { id: 'a+b', label: 'a + b', short: 'a+b', expected: 'Sum' },
                        { id: 'a-b', label: 'a - b', short: 'a-b', expected: 'Diff' },
                        { id: 'ab', label: 'a × b', short: 'ab', expected: 'Prod' },
                        { id: 'a2-b2', label: 'a² - b²', short: 'a²-b²', expected: '(a-b)(a+b)' },
                        { id: 'a2+b2', label: 'a² + b²', short: 'a²+b²', expected: '(a+b)²-2ab' },
                        { id: 'a-b_sq', label: '(a - b)²', short: '(a-b)²', expected: 'a²-2ab+b²' },
                        { id: 'a+b_sq', label: '(a + b)²', short: '(a+b)²', expected: 'a²+2ab+b²' },
                        { id: 'a3-b3', label: 'a³ - b³', short: 'a³-b³', expected: '(a-b)(a²+ab+b²)' },
                        { id: 'a3+b3', label: 'a³ + b³', short: 'a³+b³', expected: '(a+b)(a²-ab+b²)' }
                    ]
                };
            case 'lcm':
                return {
                    title: 'LCM Benchmark Sets Heatmap',
                    unit: 'L',
                    cols: 4,
                    items: [
                        { id: '2-3-4', label: '2, 3, 4', short: '2,3,4', expected: '12' },
                        { id: '3-4-6', label: '3, 4, 6', short: '3,4,6', expected: '12' },
                        { id: '4-6-8', label: '4, 6, 8', short: '4,6,8', expected: '24' },
                        { id: '3-6-9', label: '3, 6, 9', short: '3,6,9', expected: '18' },
                        { id: '5-10-15', label: '5, 10, 15', short: '5,10,15', expected: '30' },
                        { id: '6-9-12', label: '6, 9, 12', short: '6,9,12', expected: '36' },
                        { id: '8-12-16', label: '8, 12, 16', short: '8,12,16', expected: '48' },
                        { id: '10-12-15', label: '10, 12, 15', short: '10,12,15', expected: '60' },
                        { id: '12-15-20', label: '12, 15, 20', short: '12,15,20', expected: '60' },
                        { id: '8-12-15', label: '8, 12, 15', short: '8,12,15', expected: '120' },
                        { id: '12-16-24', label: '12, 16, 24', short: '12,16,24', expected: '48' },
                        { id: '18-24-36', label: '18, 24, 36', short: '18,24,36', expected: '72' }
                    ]
                };
            case 'hcf':
                return {
                    title: 'HCF Factor Heatmap',
                    unit: 'H',
                    cols: 4,
                    items: [
                        { id: '2', label: 'Factor 2', short: 'F-2', expected: '2' },
                        { id: '3', label: 'Factor 3', short: 'F-3', expected: '3' },
                        { id: '4', label: 'Factor 4', short: 'F-4', expected: '4' },
                        { id: '5', label: 'Factor 5', short: 'F-5', expected: '5' },
                        { id: '6', label: 'Factor 6', short: 'F-6', expected: '6' },
                        { id: '7', label: 'Factor 7', short: 'F-7', expected: '7' },
                        { id: '8', label: 'Factor 8', short: 'F-8', expected: '8' },
                        { id: '9', label: 'Factor 9', short: 'F-9', expected: '9' },
                        { id: '10', label: 'Factor 10', short: 'F-10', expected: '10' },
                        { id: '12', label: 'Factor 12', short: 'F-12', expected: '12' },
                        { id: '15', label: 'Factor 15', short: 'F-15', expected: '15' },
                        { id: '20', label: 'Factor 20', short: 'F-20', expected: '20' }
                    ]
                };
            case 'alphabets':
                return {
                    title: 'Alphabet Codes (A–Z) Heatmap',
                    unit: '#',
                    cols: 6,
                    items: Array.from({ length: 26 }, (_, i) => {
                        const char = String.fromCharCode(65 + i);
                        return {
                            id: char,
                            label: `${char} (${i + 1})`,
                            short: char,
                            expected: String(i + 1)
                        };
                    })
                };
            case 'geomCenters':
                return {
                    title: 'Geometry Centers Heatmap',
                    unit: '∠',
                    cols: 3,
                    items: [
                        { id: 'incenter', label: 'Incenter (BIC)', short: 'Incenter', expected: '90+A/2' },
                        { id: 'orthocenter', label: 'Orthocenter (BOC)', short: 'Ortho', expected: '180-A' },
                        { id: 'circumcenter', label: 'Circumcenter (BOC)', short: 'Circum', expected: '2A' },
                        { id: 'inradius', label: 'Inradius (r)', short: 'r (In)', expected: '(a+b-c)/2' },
                        { id: 'circumradius', label: 'Circumradius (R)', short: 'R (Circ)', expected: 'c/2' },
                        { id: 'centroid', label: 'Centroid (AG:GD)', short: 'Centroid', expected: '2:1' }
                    ]
                };
            case 'trigReflex':
                return {
                    title: 'Trigonometry Reflex Heatmap',
                    unit: 'θ',
                    cols: 5,
                    items: [
                        { id: 'sin30', label: 'sin(30°)', short: 'sin30', expected: '1/2' },
                        { id: 'sin45', label: 'sin(45°)', short: 'sin45', expected: '1/√2' },
                        { id: 'sin60', label: 'sin(60°)', short: 'sin60', expected: '√3/2' },
                        { id: 'cos30', label: 'cos(30°)', short: 'cos30', expected: '√3/2' },
                        { id: 'cos60', label: 'cos(60°)', short: 'cos60', expected: '1/2' },
                        { id: 'tan30', label: 'tan(30°)', short: 'tan30', expected: '1/√3' },
                        { id: 'tan45', label: 'tan(45°)', short: 'tan45', expected: '1' },
                        { id: 'tan60', label: 'tan(60°)', short: 'tan60', expected: '√3' },
                        { id: 'cot30', label: 'cot(30°)', short: 'cot30', expected: '√3' },
                        { id: 'sec45', label: 'sec(45°)', short: 'sec45', expected: '√2' },
                        { id: 'cosec45', label: 'cosec(45°)', short: 'csc45', expected: '√2' },
                        { id: 'pyth_id', label: 'sin²+cos²', short: 'sin²+cos²', expected: '1' },
                        { id: 'sec_tan', label: 'sec²-tan²', short: 'sec²-tan²', expected: '1' },
                        { id: 'csc_cot', label: 'cosec²-cot²', short: 'csc²-cot²', expected: '1' },
                        { id: 'tan_comp', label: 'tan(90-θ)', short: 'tan(90-θ)', expected: 'cot θ' }
                    ]
                };
            default:
                return null;
        }
    }

    static getWeakKeys(category) {
        const records = MicroFrequencyHeatmap.getDailyStore();
        const prefix = `${category}:`;
        const weakKeys = [];
        for (const k in records) {
            if (k.startsWith(prefix)) {
                const rec = records[k];
                const acc = rec.attempts > 0 ? (rec.correct / rec.attempts) * 100 : 100;
                const avgMs = rec.attempts > 0 ? (rec.totalTimeMs / rec.attempts) : 0;
                if (rec.wrong > 0 || acc < 75 || avgMs > 3000) {
                    weakKeys.push(k.slice(prefix.length));
                }
            }
        }
        return weakKeys;
    }

    static getHesitantKeys(category) {
        const records = MicroFrequencyHeatmap.getDailyStore();
        const prefix = `${category}:`;
        const hesitantKeys = [];
        for (const k in records) {
            if (k.startsWith(prefix)) {
                const rec = records[k];
                if (rec.attempts >= 2) {
                    const acc = (rec.correct / rec.attempts) * 100;
                    const avgMs = rec.totalTimeMs / rec.attempts;
                    // Hesitant fact: user knows the fact (>=75% acc) but calculates slowly (2.5s - 4.5s)
                    if (acc >= 75 && avgMs >= 2500 && avgMs <= 4500) {
                        hesitantKeys.push(k.slice(prefix.length));
                    }
                }
            }
        }
        return hesitantKeys;
    }

    static getFactMaturation(category, valueKey) {
        const win = typeof window !== 'undefined' ? window : {};
        if (!win.appState) win.appState = {};
        if (!win.appState.factMaturation) win.appState.factMaturation = {};
        const compositeKey = `${category}:${valueKey}`;
        return win.appState.factMaturation[compositeKey] || { tier: 1, history: [] };
    }

    static updateFactMaturation(category, valueKey, isCorrect, responseTimeMs) {
        const win = typeof window !== 'undefined' ? window : {};
        if (!win.appState) win.appState = {};
        if (!win.appState.factMaturation) win.appState.factMaturation = {};
        const compositeKey = `${category}:${valueKey}`;

        const records = MicroFrequencyHeatmap.getDailyStore();
        const rec = records[compositeKey];
        if (!rec) return;

        let mat = win.appState.factMaturation[compositeKey] || { tier: 1, history: [] };
        if (!Array.isArray(mat.history)) mat.history = [];
        mat.history.push({ isCorrect, timeMs: responseTimeMs, at: Date.now() });
        if (mat.history.length > 10) mat.history.shift();

        const recentAttempts = mat.history.length;
        const recentCorrect = mat.history.filter(h => h.isCorrect).length;
        const recentAcc = recentAttempts > 0 ? (recentCorrect / recentAttempts) * 100 : 0;
        const recentAvgSec = recentAttempts > 0 ? (mat.history.reduce((sum, h) => sum + h.timeMs, 0) / (recentAttempts * 1000)) : 99;

        // 3-Tier Fact Maturation Engine
        // Tier 3: Permanent Reflex (acc >= 95%, avg < 1.2s, min 4 attempts, zero recent errors)
        // Tier 2: Stabilization (acc >= 85%, avg < 2.0s, min 2 attempts)
        // Tier 1: Acquisition (first learned / fluctuating)
        if (recentAttempts >= 4 && recentAcc >= 95 && recentAvgSec < 1.2 && isCorrect) {
            mat.tier = 3;
        } else if (recentAttempts >= 2 && recentAcc >= 85 && recentAvgSec < 2.0) {
            mat.tier = 2;
        } else {
            mat.tier = 1;
        }

        mat.updatedAt = Date.now();
        win.appState.factMaturation[compositeKey] = mat;
    }

    static getDailyStore() {
        const win = typeof window !== 'undefined' ? window : {};
        if (!win.appState) win.appState = {};
        const todayKey = new Date().toISOString().split('T')[0];
        if (!win.appState.drillHeatmap || win.appState.drillHeatmap.date !== todayKey) {
            win.appState.drillHeatmap = {
                date: todayKey,
                records: {}
            };
        }
        return win.appState.drillHeatmap.records;
    }

    static recordAttempt(category, valueKey, isCorrect, responseTimeMs = 1200) {
        if (!valueKey) return null;
        const records = MicroFrequencyHeatmap.getDailyStore();
        const compositeKey = `${category}:${valueKey}`;
        
        if (!records[compositeKey]) {
            records[compositeKey] = {
                attempts: 0,
                correct: 0,
                wrong: 0,
                totalTimeMs: 0,
                slowestMs: 0,
                lastResult: null,
                updatedAt: Date.now()
            };
        }

        const rec = records[compositeKey];
        rec.attempts += 1;
        if (isCorrect) {
            rec.correct += 1;
            rec.lastResult = 'correct';
        } else {
            rec.wrong += 1;
            rec.lastResult = 'wrong';
        }

        rec.totalTimeMs += responseTimeMs;
        if (responseTimeMs > rec.slowestMs) {
            rec.slowestMs = responseTimeMs;
        }
        rec.updatedAt = Date.now();

        MicroFrequencyHeatmap.updateFactMaturation(category, valueKey, isCorrect, responseTimeMs);

        const win = typeof window !== 'undefined' ? window : {};
        if (typeof win.saveStateToStorage === 'function') {
            win.saveStateToStorage();
        }

        if (win.activeSpeedHeatmap && win.activeSpeedHeatmap.activeCategory === category) {
            win.activeSpeedHeatmap.render();
        }

        return rec;
    }

    static getStats(category, valueKey) {
        const records = MicroFrequencyHeatmap.getDailyStore();
        const compositeKey = `${category}:${valueKey}`;
        const rec = records[compositeKey];

        if (!rec || rec.attempts === 0) {
            return {
                status: 'untried',
                attempts: 0,
                accuracy: null,
                avgSeconds: null,
                slowestSeconds: null,
                heatClass: 'border-white/5 bg-slate-900/40 text-gray-500 hover:border-cyan-500/30'
            };
        }

        const accuracy = Math.round((rec.correct / rec.attempts) * 100);
        const avgSeconds = (rec.totalTimeMs / (rec.attempts * 1000)).toFixed(2);
        const slowestSeconds = (rec.slowestMs / 1000).toFixed(2);

        let heatClass = '';
        let status = 'moderate';

        if (rec.wrong >= 2 || accuracy < 60) {
            status = 'critical';
            heatClass = 'border-rose-500/50 bg-rose-950/40 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]';
        } else if (rec.wrong === 1 || accuracy < 80 || avgSeconds > 3.0) {
            status = 'warning';
            heatClass = 'border-amber-500/50 bg-amber-950/40 text-amber-300';
        } else if (accuracy >= 85 && avgSeconds <= 1.8) {
            status = 'mastered';
            heatClass = 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300';
        } else {
            status = 'good';
            heatClass = 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300';
        }

        return {
            status,
            attempts: rec.attempts,
            correct: rec.correct,
            wrong: rec.wrong,
            accuracy,
            avgSeconds,
            slowestSeconds,
            heatClass
        };
    }

    setCategory(category) {
        this.activeCategory = category;
        this.focusedValue = null;
        currentTargetValue = null;
        this.render();
    }

    render() {
        if (!this.container) return;
        const domain = MicroFrequencyHeatmap.getDomainSpec(this.activeCategory);

        if (!domain) {
            this.container.innerHTML = `
                <div class="bg-slate-900/60 border border-white/10 rounded-2xl p-4 text-center text-xs text-gray-400">
                    <div class="flex items-center justify-center gap-2 text-cyan-400 font-bold mb-1">
                        <i class="fa-solid fa-chart-simple"></i> Reflex Telemetry
                    </div>
                    <p class="text-[11px] text-gray-500">Live procedural calculations active. Switch to Squares, Cubes, Tables, or Triplets for micro-frequency heatmap.</p>
                </div>
            `;
            return;
        }

        const records = MicroFrequencyHeatmap.getDailyStore();
        let totalCategoryAttempts = 0;
        let categoryWeakCount = 0;

        domain.items.forEach(item => {
            const stats = MicroFrequencyHeatmap.getStats(this.activeCategory, item.id);
            if (stats.attempts > 0) {
                totalCategoryAttempts += stats.attempts;
                if (stats.status === 'critical' || stats.status === 'warning') {
                    categoryWeakCount++;
                }
            }
        });

        const gridColsStyle = `grid-template-columns: repeat(${domain.cols}, minmax(0, 1fr));`;

        let cellsHtml = '';
        domain.items.forEach(item => {
            const stats = MicroFrequencyHeatmap.getStats(this.activeCategory, item.id);
            const isFocused = String(this.focusedValue) === String(item.id);
            const focusRing = isFocused ? 'ring-2 ring-accentCyan ring-offset-1 ring-offset-slate-950 scale-105 z-10' : '';

            let tooltipText = `${item.label}`;
            if (stats.attempts === 0) {
                tooltipText += ' • Untried today';
            } else {
                tooltipText += ` • Acc: ${stats.accuracy}% • Avg: ${stats.avgSeconds}s • Errs: ${stats.wrong}`;
            }

            cellsHtml += `
                <button type="button" 
                    class="heatmap-cell group relative flex flex-col items-center justify-center h-8 rounded-lg border text-[11px] font-mono font-bold transition-all duration-150 cursor-pointer ${stats.heatClass} ${focusRing}"
                    data-cat="${this.activeCategory}" 
                    data-val="${item.id}"
                    data-tooltip="${tooltipText}"
                    title="${tooltipText}"
                    aria-label="${item.label}">
                    <span>${item.short}</span>
                    ${stats.wrong > 0 ? `<span class="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500"></span>` : ''}
                </button>
            `;
        });

        this.container.innerHTML = `
            <div class="bg-slate-900/60 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-xl flex flex-col gap-2.5">
                <!-- Header -->
                <div class="flex items-center justify-between border-b border-white/5 pb-2">
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                            <i class="fa-solid fa-fire-flame-curved"></i>
                        </span>
                        <span class="text-xs font-heading font-extrabold text-white tracking-wide">Heatmap</span>
                    </div>
                    <div class="flex items-center gap-2 text-[10px] font-mono font-bold">
                        <span class="text-gray-400">${totalCategoryAttempts} logged</span>
                        ${categoryWeakCount > 0 ? `<span class="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">${categoryWeakCount} weak</span>` : ''}
                    </div>
                </div>

                <!-- Adaptive Grid -->
                <div class="grid gap-1.5" style="${gridColsStyle}">
                    ${cellsHtml}
                </div>

                <!-- Footer & Legend -->
                <div class="flex items-center justify-between text-[9px] text-gray-500 pt-1 border-t border-white/5 flex-wrap gap-1.5">
                    <div class="flex items-center gap-2">
                        <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-sm bg-emerald-500/60"></span> Fast</span>
                        <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-sm bg-amber-500/60"></span> Hesitant</span>
                        <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-sm bg-rose-500/60"></span> Weak</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <button type="button" id="btn-target-hesitant" class="px-2 py-0.5 rounded-lg text-[9px] font-bold transition flex items-center gap-1 cursor-pointer ${(typeof isHesitantTargetMode !== 'undefined' && isHesitantTargetMode) ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm' : 'text-gray-400 hover:text-amber-300 bg-white/5 hover:bg-white/10 border border-white/5'}" data-tooltip="Target hesitant facts (2.5s–4.5s latency) to achieve permanent reflex" title="Drill Hesitant Facts">
                            <i class="fa-solid fa-bolt ${(typeof isHesitantTargetMode !== 'undefined' && isHesitantTargetMode) ? 'text-amber-400 animate-pulse' : 'text-amber-400/70'}"></i>
                            <span>Hesitant (${MicroFrequencyHeatmap.getHesitantKeys(this.activeCategory).length})</span>
                        </button>
                        ${this.focusedValue ? `
                            <button type="button" id="btn-clear-heatmap-focus" class="text-cyan-400 hover:text-cyan-300 font-bold transition cursor-pointer">
                                Reset Focus
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        // Wire click-to-focus listeners
        const cells = this.container.querySelectorAll('.heatmap-cell');
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                const val = cell.getAttribute('data-val');
                if (String(this.focusedValue) === String(val)) {
                    this.focusedValue = null;
                    currentTargetValue = null;
                    if (typeof window.showToast === 'function') {
                        window.showToast(`Drill focus cleared. Full random rotation.`);
                    }
                } else {
                    this.focusedValue = val;
                    currentTargetValue = val;
                    if (typeof window.showToast === 'function') {
                        window.showToast(`Focusing drill on ${domain.unit} ${val}!`, 'info');
                    }
                }
                this.render();
                if (typeof this.options.onSelectValue === 'function') {
                    this.options.onSelectValue(this.focusedValue);
                }
            });
        });

        const clearBtn = this.container.querySelector('#btn-clear-heatmap-focus');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.focusedValue = null;
                currentTargetValue = null;
                this.render();
                if (typeof this.options.onSelectValue === 'function') {
                    this.options.onSelectValue(null);
                }
            });
        }

        const hesitantBtn = this.container.querySelector('#btn-target-hesitant');
        if (hesitantBtn) {
            hesitantBtn.addEventListener('click', () => {
                if (typeof toggleHesitantFactTargeting === 'function') {
                    toggleHesitantFactTargeting();
                }
            });
        }
    }
}
window.MicroFrequencyHeatmap = MicroFrequencyHeatmap;

// === PHONETIC NUMBER NORMALIZER & AUDIO REFLEX PIPELINE (PHASE 6) ===
function parseSpokenNumberToDigits(text) {
    if (!text || typeof text !== 'string') return null;
    text = text.replace(/-/g, ' ').trim().toLowerCase();
    
    // Direct numerical check
    if (/^\d+(\.\d+)?$/.test(text)) {
        return text;
    }

    // Decimal handling ("fourteen point two eight")
    if (text.includes(' point ')) {
        const parts = text.split(' point ');
        const whole = parseSpokenNumberToDigits(parts[0]);
        let frac = '';
        const fracTokens = parts[1].trim().split(/\s+/);
        const digitMap = { zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9' };
        for (const t of fracTokens) {
            if (digitMap[t] !== undefined) frac += digitMap[t];
            else if (/^\d+$/.test(t)) frac += t;
        }
        if (whole !== null && frac) return `${whole}.${frac}`;
    }

    const units = {
        zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
        six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
        eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
        sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19
    };
    const tens = {
        twenty: 20, thirty: 30, forty: 40, fifty: 50,
        sixty: 60, seventy: 70, eighty: 80, ninety: 90
    };

    const words = text.split(/\s+/);
    
    // 1. Check if all words are single-digit words (e.g. "five seven six" -> "576")
    const allDigits = words.every(w => units[w] !== undefined && units[w] < 10);
    if (allDigits && words.length > 1) {
        return words.map(w => units[w]).join('');
    }

    // 2. Check for colloquial hundred grouping: e.g. "five seventy six" -> 500 + 76 = 576
    if (words.length >= 2 && words.length <= 3 && units[words[0]] !== undefined && units[words[0]] >= 1 && units[words[0]] <= 19 && !words.includes('hundred') && !words.includes('thousand')) {
        const firstNum = units[words[0]];
        let secondNum = 0;
        if (words.length === 2) {
            if (tens[words[1]] !== undefined) secondNum = tens[words[1]];
            else if (units[words[1]] !== undefined) secondNum = units[words[1]];
        } else if (words.length === 3) {
            if (tens[words[1]] !== undefined && units[words[2]] !== undefined) {
                secondNum = tens[words[1]] + units[words[2]];
            }
        }
        if (secondNum > 0) {
            return String(firstNum * 100 + secondNum);
        }
    }

    // 3. Standard formal number grammar: e.g. "five hundred seventy six", "two thousand"
    let total = 0;
    let current = 0;
    let recognizedAny = false;

    for (let i = 0; i < words.length; i++) {
        const w = words[i];
        if (w === 'and') continue;

        if (units[w] !== undefined) {
            current += units[w];
            recognizedAny = true;
        } else if (tens[w] !== undefined) {
            current += tens[w];
            recognizedAny = true;
        } else if (w === 'hundred') {
            current = (current === 0 ? 1 : current) * 100;
            recognizedAny = true;
        } else if (w === 'thousand') {
            total += (current === 0 ? 1 : current) * 1000;
            current = 0;
            recognizedAny = true;
        } else if (/^\d+$/.test(w)) {
            current += parseInt(w, 10);
            recognizedAny = true;
        } else {
            return null;
        }
    }

    if (recognizedAny) {
        return String(total + current);
    }
    return null;
}

function normalizeVoiceNumber(rawTranscript, expectedAnswer) {
    if (!rawTranscript || typeof rawTranscript !== 'string') {
        return { status: 'RECOGNITION_ERROR', normalized: '', raw: '', confidence: 0 };
    }
    
    // Clean string: lower case, remove punctuation (preserve . for decimals and / for fractions)
    let s = rawTranscript.toLowerCase().trim()
        .replace(/[?!,;]/g, ' ')
        .replace(/\s+/g, ' ');
    
    // Strip common speech filler phrases
    s = s.replace(/^(the answer is|it is|answer is|equals to|equal to|is|equals|equal|i think it is|i think)\s+/i, '');
    s = s.replace(/\s+(please|thanks|thank you)$/i, '');
    s = s.trim();

    if (!s) {
        return { status: 'RECOGNITION_ERROR', normalized: '', raw: rawTranscript, confidence: 0 };
    }

    const expStr = String(expectedAnswer != null ? expectedAnswer : '').trim().toLowerCase();

    // Direct match check
    if (s === expStr) {
        return { status: 'CORRECT', normalized: String(expectedAnswer), raw: rawTranscript, confidence: 1.0 };
    }

    // Special mathematical terms
    if (s === 'not defined' || s === 'undefined' || s === 'infinity') {
        const norm = 'Not Defined';
        return {
            status: norm.toLowerCase() === expStr ? 'CORRECT' : 'WRONG',
            normalized: norm,
            raw: rawTranscript,
            confidence: 0.9
        };
    }

    // Comprehensive fractional & trig phrase maps
    const phraseMap = {
        'half': '1/2', 'one half': '1/2', 'one by two': '1/2', '1 by 2': '1/2',
        'one third': '1/3', 'one by three': '1/3', '1 by 3': '1/3',
        'two thirds': '2/3', 'two third': '2/3', 'two by three': '2/3', '2 by 3': '2/3',
        'one fourth': '1/4', 'one quarter': '1/4', 'one by four': '1/4', '1 by 4': '1/4',
        'three fourths': '3/4', 'three fourth': '3/4', 'three by four': '3/4', '3 by 4': '3/4',
        'one fifth': '1/5', 'one by five': '1/5', '1 by 5': '1/5',
        'two fifths': '2/5', 'two by five': '2/5', '2 by 5': '2/5',
        'three fifths': '3/5', 'three by five': '3/5', '3 by 5': '3/5',
        'four fifths': '4/5', 'four by five': '4/5', '4 by 5': '4/5',
        'one sixth': '1/6', 'one by six': '1/6', '1 by 6': '1/6',
        'five sixths': '5/6', 'five by six': '5/6', '5 by 6': '5/6',
        'one seventh': '1/7', 'one by seven': '1/7', '1 by 7': '1/7',
        'two sevenths': '2/7', 'two by seven': '2/7', '2 by 7': '2/7',
        'three sevenths': '3/7', 'three by seven': '3/7', '3 by 7': '3/7',
        'four sevenths': '4/7', 'four by seven': '4/7', '4 by 7': '4/7',
        'five sevenths': '5/7', 'five by seven': '5/7', '5 by 7': '5/7',
        'six sevenths': '6/7', 'six by seven': '6/7', '6 by 7': '6/7',
        'one eighth': '1/8', 'one by eight': '1/8', '1 by 8': '1/8',
        'three eighths': '3/8', 'three by eight': '3/8', '3 by 8': '3/8',
        'five eighths': '5/8', 'five by eight': '5/8', '5 by 8': '5/8',
        'seven eighths': '7/8', 'seven by eight': '7/8', '7 by 8': '7/8',
        'one ninth': '1/9', 'one by nine': '1/9', '1 by 9': '1/9',
        'two ninths': '2/9', 'two by nine': '2/9', '2 by 9': '2/9',
        'four ninths': '4/9', 'four by nine': '4/9', '4 by 9': '4/9',
        'five ninths': '5/9', 'five by nine': '5/9', '5 by 9': '5/9',
        'seven ninths': '7/9', 'seven by nine': '7/9', '7 by 9': '7/9',
        'eight ninths': '8/9', 'eight by nine': '8/9', '8 by 9': '8/9',
        'one tenth': '1/10', 'one by ten': '1/10', '1 by 10': '1/10',
        'one eleventh': '1/11', 'one by eleven': '1/11', '1 by 11': '1/11',
        'two elevenths': '2/11', 'two by eleven': '2/11', '2 by 11': '2/11',
        'three elevenths': '3/11', 'three by eleven': '3/11', '3 by 11': '3/11',
        'four elevenths': '4/11', 'four by eleven': '4/11', '4 by 11': '4/11',
        'five elevenths': '5/11', 'five by eleven': '5/11', '5 by 11': '5/11',
        'six elevenths': '6/11', 'six by eleven': '6/11', '6 by 11': '6/11',
        'seven elevenths': '7/11', 'seven by eleven': '7/11', '7 by 11': '7/11',
        'eight elevenths': '8/11', 'eight by eleven': '8/11', '8 by 11': '8/11',
        'nine elevenths': '9/11', 'nine by eleven': '9/11', '9 by 11': '9/11',
        'ten elevenths': '10/11', 'ten by eleven': '10/11', '10 by 11': '10/11',
        'one twelfth': '1/12', 'one by twelve': '1/12', '1 by 12': '1/12',
        'five twelfths': '5/12', 'five by twelve': '5/12', '5 by 12': '5/12',
        'seven twelfths': '7/12', 'seven by twelve': '7/12', '7 by 12': '7/12',
        'eleven twelfths': '11/12', 'eleven by twelve': '11/12', '11 by 12': '11/12',
        'one thirteenth': '1/13', 'one by thirteen': '1/13', '1 by 13': '1/13',
        'one fourteenth': '1/14', 'one by fourteen': '1/14', '1 by 14': '1/14',
        'one fifteenth': '1/15', 'one by fifteen': '1/15', '1 by 15': '1/15',
        'one sixteenth': '1/16', 'one by sixteen': '1/16', '1 by 16': '1/16',
        'one seventeenth': '1/17', 'one by seventeen': '1/17', '1 by 17': '1/17',
        'one eighteenth': '1/18', 'one by eighteen': '1/18', '1 by 18': '1/18',
        'one nineteenth': '1/19', 'one by nineteen': '1/19', '1 by 19': '1/19',
        'one twentieth': '1/20', 'one by twenty': '1/20', '1 by 20': '1/20',
        'one twenty first': '1/21', 'one by twenty one': '1/21', '1 by 21': '1/21',
        'one twenty second': '1/22', 'one by twenty two': '1/22', '1 by 22': '1/22',
        'one twenty third': '1/23', 'one by twenty three': '1/23', '1 by 23': '1/23',
        'one twenty fourth': '1/24', 'one by twenty four': '1/24', '1 by 24': '1/24',
        'one twenty fifth': '1/25', 'one by twenty five': '1/25', '1 by 25': '1/25',
        'one fortieth': '1/40', 'one by forty': '1/40', '1 by 40': '1/40',
        'root three by two': '√3/2', 'root 3 by 2': '√3/2', 'square root three by two': '√3/2',
        'one by root two': '1/√2', '1 by root 2': '1/√2',
        'two by root three': '2/√3', '2 by root 3': '2/√3',
        'one by root three': '1/√3', '1 by root 3': '1/√3',
        'root two': '√2', 'root 2': '√2', 'square root two': '√2',
        'root three': '√3', 'root 3': '√3', 'square root three': '√3',
        'root five': '√5', 'root 5': '√5'
    };

    if (phraseMap[s]) {
        const norm = phraseMap[s];
        return {
            status: norm.toLowerCase() === expStr ? 'CORRECT' : 'WRONG',
            normalized: norm,
            raw: rawTranscript,
            confidence: 0.95
        };
    }

    // Generalized fraction parser: e.g. "X by Y", "X / Y", "X over Y"
    const fracMatch = s.match(/^([a-z0-9\s]+?)\s*(?:by|over|divided by|\/)\s*([a-z0-9\s]+)$/);
    if (fracMatch) {
        const numPart = parseSpokenNumberToDigits(fracMatch[1]) || fracMatch[1].trim();
        const denPart = parseSpokenNumberToDigits(fracMatch[2]) || fracMatch[2].trim();
        if (/^\d+$/.test(numPart) && /^\d+$/.test(denPart)) {
            const fracNorm = `${numPart}/${denPart}`;
            return {
                status: fracNorm === expStr ? 'CORRECT' : 'WRONG',
                normalized: fracNorm,
                raw: rawTranscript,
                confidence: 0.95
            };
        }
    }

    // Percentage conversion: e.g. "fourteen point two eight percent" -> "14.28%"
    if (s.includes('percent') || s.includes('%')) {
        let cleanPct = s.replace(/percent|%/g, '').trim();
        let pctNum = parseSpokenNumberToDigits(cleanPct);
        if (pctNum !== null) {
            const norm = `${pctNum}%`;
            return {
                status: norm.toLowerCase() === expStr ? 'CORRECT' : 'WRONG',
                normalized: norm,
                raw: rawTranscript,
                confidence: 0.95
            };
        }
    }

    // If expected answer is a percentage, and user spoke the digits without saying "percent"
    if (expStr.endsWith('%')) {
        const purePctVal = expStr.slice(0, -1);
        const parsedWithoutPct = parseSpokenNumberToDigits(s);
        if (parsedWithoutPct !== null && String(parsedWithoutPct) === purePctVal) {
            return {
                status: 'CORRECT',
                normalized: expStr,
                raw: rawTranscript,
                confidence: 0.95
            };
        }
    }

    // General spoken number to integer/decimal parsing
    const parsedNum = parseSpokenNumberToDigits(s);
    if (parsedNum !== null) {
        const norm = String(parsedNum);
        return {
            status: norm === expStr ? 'CORRECT' : 'WRONG',
            normalized: norm,
            raw: rawTranscript,
            confidence: 0.9
        };
    }

    // If raw transcript has numeric digits inside
    const matchDigits = s.match(/\d+(\.\d+)?/);
    if (matchDigits) {
        const norm = matchDigits[0];
        if (expStr.endsWith('%') && `${norm}%` === expStr) {
            return {
                status: 'CORRECT',
                normalized: expStr,
                raw: rawTranscript,
                confidence: 0.85
            };
        }
        return {
            status: norm === expStr ? 'CORRECT' : 'WRONG',
            normalized: norm,
            raw: rawTranscript,
            confidence: 0.75
        };
    }

    return { status: 'RECOGNITION_ERROR', normalized: s, raw: rawTranscript, confidence: 0 };
}
window.parseSpokenNumberToDigits = parseSpokenNumberToDigits;
window.normalizeVoiceNumber = normalizeVoiceNumber;

// Voice Reflex Controller State
let isVoiceReflexActive = false;
let speechRecognizer = null;
let isListeningForAnswer = false;

function initVoiceReflexEngine() {
    if (typeof window === 'undefined') return false;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        return false;
    }
    if (speechRecognizer) return true;

    try {
        speechRecognizer = new SpeechRecognition();
        speechRecognizer.continuous = true;
        speechRecognizer.interimResults = true;
        speechRecognizer.lang = 'en-US';

        speechRecognizer.onstart = () => {
            isListeningForAnswer = true;
            updateVoiceStatusUI('listening');
        };

        speechRecognizer.onresult = (event) => {
            if (!event.results || event.results.length === 0) return;
            
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const res = event.results[i];
                if (res.isFinal) {
                    finalTranscript += res[0].transcript;
                } else {
                    interimTranscript += res[0].transcript;
                }
            }

            const currentSpeech = (finalTranscript || interimTranscript || '').trim();
            if (!currentSpeech) return;

            // Stream live transcription to interceptor UI
            updateVoiceStatusUI('interpreting', currentSpeech);

            // Check if interim or final speech already contains the correct answer
            const candidateResult = normalizeVoiceNumber(currentSpeech, drillAnswerVal);
            if (candidateResult.status === 'CORRECT') {
                updateVoiceStatusUI('matched', candidateResult.normalized);
                checkDrillAnswer(candidateResult.normalized, 'voice');
                return;
            }

            // If speech recognizer finalized the utterance
            if (finalTranscript.trim()) {
                const finalResult = normalizeVoiceNumber(finalTranscript.trim(), drillAnswerVal);
                if (finalResult.status === 'RECOGNITION_ERROR') {
                    updateVoiceStatusUI('retry', finalTranscript.trim());
                    if (typeof window.showToast === 'function') {
                        window.showToast(`Didn't catch "${finalTranscript.trim()}". Speak clearly or tap an option.`, 'warning');
                    }
                } else {
                    updateVoiceStatusUI(finalResult.status === 'CORRECT' ? 'matched' : 'wrong', finalResult.normalized);
                    checkDrillAnswer(finalResult.normalized, 'voice');
                }
            }
        };

        speechRecognizer.onerror = (event) => {
            if (event.error === 'no-speech') {
                return; // Benign continuous silence
            }
            if (event.error === 'not-allowed') {
                isListeningForAnswer = false;
                toggleVoiceReflexMode(false);
                if (typeof window.showToast === 'function') {
                    window.showToast('Microphone access was denied.', 'warning');
                }
                updateVoiceStatusUI('idle');
            }
        };

        speechRecognizer.onend = () => {
            isListeningForAnswer = false;
            // Auto-reconnect if still active and drill is playing
            if (isVoiceReflexActive && drillIsPlaying) {
                setTimeout(() => {
                    if (isVoiceReflexActive && drillIsPlaying && !isListeningForAnswer) {
                        try {
                            speechRecognizer.start();
                            isListeningForAnswer = true;
                            updateVoiceStatusUI('listening');
                        } catch (err) {
                            // Recognition already active
                        }
                    }
                }, 250);
            } else {
                updateVoiceStatusUI('idle');
            }
        };
        return true;
    } catch (e) {
        console.warn('SpeechRecognition initialization error:', e);
        return false;
    }
}

let voiceTimerInterval = null;
let voiceSecondsElapsed = 0;

function startVoiceTimer() {
    stopVoiceTimer();
    voiceSecondsElapsed = 0;
    const timerDisplay = document.getElementById("voice-timer-display");
    if (timerDisplay) timerDisplay.innerText = "0:00";
    voiceTimerInterval = setInterval(() => {
        voiceSecondsElapsed++;
        const mins = Math.floor(voiceSecondsElapsed / 60);
        const secs = voiceSecondsElapsed % 60;
        const formatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        const disp = document.getElementById("voice-timer-display");
        if (disp) disp.innerText = formatted;
    }, 1000);
}

function stopVoiceTimer() {
    if (voiceTimerInterval) {
        clearInterval(voiceTimerInterval);
        voiceTimerInterval = null;
    }
    const timerDisplay = document.getElementById("voice-timer-display");
    if (timerDisplay) timerDisplay.innerText = "0:00";
}

// =========================================================================
// COGNITIVE DRILL CHEAT SHEET & MEMORIZATION ENGINE
// =========================================================================
let currentCheatSubtab = 'all';
let currentCheatSearch = '';
let isCheatPeekHidden = false;
let prevCheatMode = null;

// Dynamic generator for all multiplication tables 11 to 50
// Formatted as clean vertical recitation sequence: 11, 22, 33... without redundant '11 × 1' clutter
function generateTablesCheatGroups() {
    const groups = [];
    for (let t = 11; t <= 50; t++) {
        let range = "11–20";
        if (t >= 41) range = "41–50";
        else if (t >= 31) range = "31–40";
        else if (t >= 21) range = "21–30";

        const items = [];
        for (let m = 1; m <= 10; m++) {
            items.push({
                idx: m,
                q: `${m}.`,
                a: `${t * m}`,
                val: t * m
            });
        }
        groups.push({
            name: `Table ${t}`,
            badge: ``,
            range: range,
            items: items
        });
    }
    return groups;
}

const DRILL_CHEAT_DATA = {
    squares: {
        title: "Squares (11–50)",
        ranges: ["All (11–50)", "11–20", "21–30", "31–40", "41–50", "Speed Tricks"],
        groups: [
            {
                name: "11–20 Squares",
                badge: "Foundations",
                range: "11–20",
                items: [
                    { q: "11²", a: "121" }, { q: "12²", a: "144" }, { q: "13²", a: "169" },
                    { q: "14²", a: "196" }, { q: "15²", a: "225" }, { q: "16²", a: "256" },
                    { q: "17²", a: "289" }, { q: "18²", a: "324" }, { q: "19²", a: "361" },
                    { q: "20²", a: "400" }
                ]
            },
            {
                name: "21–30 Squares",
                badge: "Symmetry Base",
                range: "21–30",
                items: [
                    { q: "21²", a: "441" }, { q: "22²", a: "484" }, { q: "23²", a: "529" },
                    { q: "24²", a: "576" }, { q: "25²", a: "625" }, { q: "26²", a: "676" },
                    { q: "27²", a: "729" }, { q: "28²", a: "784" }, { q: "29²", a: "841" },
                    { q: "30²", a: "900" }
                ]
            },
            {
                name: "31–40 Squares",
                badge: "Base 50/1000",
                range: "31–40",
                items: [
                    { q: "31²", a: "961" }, { q: "32²", a: "1024" }, { q: "33²", a: "1089" },
                    { q: "34²", a: "1156" }, { q: "35²", a: "1225" }, { q: "36²", a: "1296" },
                    { q: "37²", a: "1369" }, { q: "38²", a: "1444" }, { q: "39²", a: "1521" },
                    { q: "40²", a: "1600" }
                ]
            },
            {
                name: "41–50 Squares",
                badge: "(25-d)|d²",
                range: "41–50",
                items: [
                    { q: "41² (25-9|9²)", a: "1681" }, { q: "42² (25-8|8²)", a: "1764" },
                    { q: "43² (25-7|7²)", a: "1849" }, { q: "44² (25-6|6²)", a: "1936" },
                    { q: "45² (25-5|5²)", a: "2025" }, { q: "46² (25-4|4²)", a: "2116" },
                    { q: "47² (25-3|3²)", a: "2209" }, { q: "48² (25-2|2²)", a: "2304" },
                    { q: "49² (25-1|1²)", a: "2401" }, { q: "50² (25-0|0²)", a: "2500" }
                ]
            },
            {
                name: "Symmetry Twins & Ends in 5",
                badge: "Mental Hacks",
                range: "Speed Tricks",
                items: [
                    { isFormula: true, q: "Ends in 5: n5² ➔ [n × (n+1)] | 25", a: "15²=225, 25²=625, 35²=1225, 45²=2025, 55²=3025, 65²=4225, 75²=5625" },
                    { isFormula: true, q: "Symmetry Pair: 21² ⇄ 29² (diff 400)", a: "21² = 441  ⇄  29² = 841" },
                    { isFormula: true, q: "Symmetry Pair: 22² ⇄ 28² (diff 300)", a: "22² = 484  ⇄  28² = 784" },
                    { isFormula: true, q: "Symmetry Pair: 23² ⇄ 27² (diff 200)", a: "23² = 529  ⇄  27² = 729" },
                    { isFormula: true, q: "Symmetry Pair: 24² ⇄ 26² (diff 100)", a: "24² = 576  ⇄  26² = 676" },
                    { isFormula: true, q: "Base 50 Rule: (50 ± d)²", a: "(25 ± d) × 100 + d²  (e.g., 53² = 2809, 47² = 2209)" }
                ]
            }
        ]
    },
    cubes: {
        title: "Cubes (1–30)",
        ranges: ["All (1–30)", "1–10", "11–20", "21–30", "Unit Digits & Laws"],
        groups: [
            {
                name: "1–10 Cubes",
                badge: "Foundations",
                range: "1–10",
                items: [
                    { q: "1³", a: "1" }, { q: "2³", a: "8" }, { q: "3³", a: "27" },
                    { q: "4³", a: "64" }, { q: "5³", a: "125" }, { q: "6³", a: "216" },
                    { q: "7³", a: "343" }, { q: "8³", a: "512" }, { q: "9³", a: "729" },
                    { q: "10³", a: "1000" }
                ]
            },
            {
                name: "11–20 Cubes",
                badge: "Tier 1 High-Yield",
                range: "11–20",
                items: [
                    { q: "11³", a: "1331" }, { q: "12³", a: "1728" }, { q: "13³", a: "2197" },
                    { q: "14³", a: "2744" }, { q: "15³", a: "3375" }, { q: "16³", a: "4096" },
                    { q: "17³", a: "4913" }, { q: "18³", a: "5832" }, { q: "19³", a: "6859" },
                    { q: "20³", a: "8000" }
                ]
            },
            {
                name: "21–30 Cubes",
                badge: "Tier 2 Elite",
                range: "21–30",
                items: [
                    { q: "21³", a: "9261" }, { q: "22³", a: "10648" }, { q: "23³", a: "12167" },
                    { q: "24³", a: "13824" }, { q: "25³", a: "15625" }, { q: "26³", a: "17576" },
                    { q: "27³", a: "19683" }, { q: "28³", a: "21952" }, { q: "29³", a: "24389" },
                    { q: "30³", a: "27000" }
                ]
            },
            {
                name: "Unit Digit Laws & Properties",
                badge: "Last Digit Laws",
                range: "Unit Digits & Laws",
                items: [
                    { isFormula: true, q: "Numbers ending in 2 ⇄ 8", a: "2³ ends in 8  •  8³ ends in 2 (Sum of pair = 10)" },
                    { isFormula: true, q: "Numbers ending in 3 ⇄ 7", a: "3³ ends in 7  •  7³ ends in 3 (Sum of pair = 10)" },
                    { isFormula: true, q: "Self-Reflective Digits (0, 1, 4, 5, 6, 9)", a: "Retain identical unit digit: 0³➔0, 1³➔1, 4³➔4, 5³➔5, 6³➔6, 9³➔9" },
                    { isFormula: true, q: "Digital Sum of Perfect Cubes", a: "Digital sum of ANY integer cube is always 1, 8, or 9 (0)." }
                ]
            }
        ]
    },
    tables: {
        title: "Multiplication Tables (11–50)",
        ranges: ["All (11–50)", "11–20", "21–30", "31–40", "41–50"],
        groups: generateTablesCheatGroups()
    },
    fracPerc: {
        title: "Fractions to Percentages (Family Groups)",
        ranges: ["All", "Halves, 4ths & 8ths", "3rds, 6ths & 12ths", "5ths, 10ths & 20ths", "Cyclic 7ths", "Cyclic 9ths & 11ths", "Prime Fractions (1/13–1/25)"],
        groups: [
            {
                name: "Base 2 Family: Halves, 4ths, 8ths & 16ths",
                badge: "÷2 Halving Chain",
                range: "Halves, 4ths & 8ths",
                items: [
                    { q: "1/2", a: "50%" },
                    { q: "1/4", a: "25%" },
                    { q: "3/4", a: "75%" },
                    { q: "1/8", a: "12.5% (12 ½%)" },
                    { q: "3/8", a: "37.5% (37 ½%)" },
                    { q: "5/8", a: "62.5% (62 ½%)" },
                    { q: "7/8", a: "87.5% (87 ½%)" },
                    { q: "1/16", a: "6.25% (6 ¼%)" },
                    { q: "3/16", a: "18.75% (18 ¾%)" },
                    { q: "5/16", a: "31.25% (31 ¼%)" },
                    { q: "7/16", a: "43.75% (43 ¾%)" }
                ]
            },
            {
                name: "Base 3 Family: 3rds, 6ths & 12ths",
                badge: "1/3 Multiples",
                range: "3rds, 6ths & 12ths",
                items: [
                    { q: "1/3", a: "33.33% (33 ⅓%)" },
                    { q: "2/3", a: "66.67% (66 ⅔%)" },
                    { q: "1/6", a: "16.67% (16 ⅔%)" },
                    { q: "5/6", a: "83.33% (83 ⅓%)" },
                    { q: "1/12", a: "8.33% (8 ⅓%)" },
                    { q: "5/12", a: "41.67% (41 ⅔%)" },
                    { q: "7/12", a: "58.33% (58 ⅓%)" },
                    { q: "11/12", a: "91.67% (91 ⅔%)" }
                ]
            },
            {
                name: "Base 5 & 10 Family: 5ths, 10ths, 20ths & 25ths",
                badge: "Decimal Base",
                range: "5ths, 10ths & 20ths",
                items: [
                    { q: "1/5", a: "20%" },
                    { q: "2/5", a: "40%" },
                    { q: "3/5", a: "60%" },
                    { q: "4/5", a: "80%" },
                    { q: "1/10", a: "10%" },
                    { q: "3/10", a: "30%" },
                    { q: "7/10", a: "70%" },
                    { q: "9/10", a: "90%" },
                    { q: "1/20", a: "5%" },
                    { q: "1/25", a: "4%" },
                    { q: "1/50", a: "2%" }
                ]
            },
            {
                name: "Cyclic 7ths Family (Table of 14.28)",
                badge: "Cyclic 14-28-57",
                range: "Cyclic 7ths",
                items: [
                    { q: "1/7", a: "14.28% (14 2/7%)" },
                    { q: "2/7", a: "28.57% (28 4/7%)" },
                    { q: "3/7", a: "42.85% (42 6/7%)" },
                    { q: "4/7", a: "57.14% (57 1/7%)" },
                    { q: "5/7", a: "71.42% (71 3/7%)" },
                    { q: "6/7", a: "85.71% (85 5/7%)" }
                ]
            },
            {
                name: "Cyclic Twins: 9ths & 11ths Family",
                badge: "Reciprocal Twins",
                range: "Cyclic 9ths & 11ths",
                items: [
                    { q: "1/9 (Table of 11)", a: "11.11% (11 ⅑%)" },
                    { q: "2/9", a: "22.22%" },
                    { q: "4/9", a: "44.44%" },
                    { q: "5/9", a: "55.56%" },
                    { q: "7/9", a: "77.78%" },
                    { q: "8/9", a: "88.89%" },
                    { q: "1/11 (Table of 9)", a: "9.09% (9 ¹/₁₁%)" },
                    { q: "2/11", a: "18.18%" },
                    { q: "3/11", a: "27.27%" },
                    { q: "4/11", a: "36.36%" },
                    { q: "5/11", a: "45.45%" },
                    { q: "6/11", a: "54.54%" },
                    { q: "7/11", a: "63.63%" },
                    { q: "8/11", a: "72.72%" },
                    { q: "9/11", a: "81.81%" },
                    { q: "10/11", a: "90.90%" }
                ]
            },
            {
                name: "Prime & Advanced Fractions (1/13 to 1/40)",
                badge: "High-Yield CGL",
                range: "Prime Fractions (1/13–1/25)",
                items: [
                    { q: "1/13", a: "7.69% (7 ⁹/₁₃%)" },
                    { q: "1/14 (Half of 1/7)", a: "7.14% (7 ⅐%)" },
                    { q: "1/15", a: "6.67% (6 ⅔%)" },
                    { q: "1/17", a: "5.88% (5 ¹⁵/₁₇%)" },
                    { q: "1/18 (Half of 1/9)", a: "5.56% (5 ⁵/₉%)" },
                    { q: "1/19", a: "5.26% (5 ⁵/₁₉%)" },
                    { q: "1/24", a: "4.17% (4 ⅙%)" },
                    { q: "1/30", a: "3.33% (3 ⅓%)" },
                    { q: "1/40", a: "2.5% (2 ½%)" }
                ]
            }
        ]
    },
    triplets: {
        title: "Pythagorean Triplets & Right Triangle Reflexes",
        ranges: ["All", "Odd Base Families", "Even Base Families", "Scaled Multiples", "Advanced Exam Triplets", "Right Δ Radius Reflexes"],
        groups: [
            {
                name: "Odd Base Triplet Families",
                badge: "n, (n²-1)/2, (n²+1)/2",
                range: "Odd Base Families",
                items: [
                    { q: "Base n = 3", a: "3, 4, 5 (Hyp = 5)" },
                    { q: "Base n = 5", a: "5, 12, 13 (Hyp = 13)" },
                    { q: "Base n = 7", a: "7, 24, 25 (Hyp = 25)" },
                    { q: "Base n = 9", a: "9, 40, 41 (Hyp = 41)" },
                    { q: "Base n = 11", a: "11, 60, 61 (Hyp = 61)" },
                    { q: "Base n = 13", a: "13, 84, 85 (Hyp = 85)" }
                ]
            },
            {
                name: "Even Base Triplet Families",
                badge: "2m, m²-1, m²+1",
                range: "Even Base Families",
                items: [
                    { q: "Base 2m = 8 (m=4)", a: "8, 15, 17 (Hyp = 17)" },
                    { q: "Base 2m = 12 (m=6)", a: "12, 35, 37 (Hyp = 37)" },
                    { q: "Base 2m = 16 (m=8)", a: "16, 63, 65 (Hyp = 65)" },
                    { q: "Base 2m = 20 (m=10)", a: "20, 21, 29 (Hyp = 29)" },
                    { q: "Base 2m = 28 (m=14)", a: "28, 45, 53 (Hyp = 53)" }
                ]
            },
            {
                name: "Scaled Exam Multiples",
                badge: "CGL Most Repeated",
                range: "Scaled Multiples",
                items: [
                    { q: "(3, 4, 5) × 2", a: "6, 8, 10" },
                    { q: "(3, 4, 5) × 3", a: "9, 12, 15" },
                    { q: "(3, 4, 5) × 4", a: "12, 16, 20" },
                    { q: "(3, 4, 5) × 5", a: "15, 20, 25" },
                    { q: "(5, 12, 13) × 2", a: "10, 24, 26" },
                    { q: "(7, 24, 25) × 2", a: "14, 48, 50" },
                    { q: "(8, 15, 17) × 2", a: "16, 30, 34" },
                    { q: "(9, 40, 41) × 2", a: "18, 80, 82" },
                    { q: "(20, 21, 29) × 2", a: "40, 42, 58" }
                ]
            },
            {
                name: "Tier-2 Advanced Triplets",
                badge: "Elite Level",
                range: "Advanced Exam Triplets",
                items: [
                    { q: "Base 20, 21", a: "29 (Hyp = 29)" },
                    { q: "Base 33, 56", a: "65 (Hyp = 65)" },
                    { q: "Base 36, 77", a: "85 (Hyp = 85)" },
                    { q: "Base 39, 80", a: "89 (Hyp = 89)" },
                    { q: "Base 48, 55", a: "73 (Hyp = 73)" },
                    { q: "Base 65, 72", a: "97 (Hyp = 97)" }
                ]
            },
            {
                name: "Right Δ Radius Reflexes",
                badge: "Instant Solves",
                range: "Right Δ Radius Reflexes",
                items: [
                    { isFormula: true, q: "Inradius r formula", a: "r = (a + b - c) / 2" },
                    { isFormula: true, q: "Circumradius R formula", a: "R = c / 2 (Hypotenuse / 2)" },
                    { isFormula: true, q: "In 3-4-5 Δ", a: "r = 1, R = 2.5" },
                    { isFormula: true, q: "In 5-12-13 Δ", a: "r = 2, R = 6.5" },
                    { isFormula: true, q: "In 8-15-17 Δ", a: "r = 3, R = 8.5" },
                    { isFormula: true, q: "In 7-24-25 Δ", a: "r = 3, R = 12.5" },
                    { isFormula: true, q: "In 9-40-41 Δ", a: "r = 4, R = 20.5" },
                    { isFormula: true, q: "In 20-21-29 Δ", a: "r = 6, R = 14.5" }
                ]
            }
        ]
    },
    algebra: {
        title: "Algebra Identities & Transforms",
        ranges: ["All", "Squares & Products", "Cubes & Factoring", "3-Variable Special", "x + 1/x Speed Rules"],
        groups: [
            {
                name: "Square Identities & Products",
                badge: "Degree 2",
                range: "Squares & Products",
                items: [
                    { isFormula: true, q: "(a + b)²", a: "a² + 2ab + b²" },
                    { isFormula: true, q: "(a - b)²", a: "a² - 2ab + b²" },
                    { isFormula: true, q: "(a + b)² + (a - b)²", a: "2(a² + b²)" },
                    { isFormula: true, q: "(a + b)² - (a - b)²", a: "4ab" },
                    { isFormula: true, q: "a² - b²", a: "(a + b)(a - b)" },
                    { isFormula: true, q: "(a + b + c)²", a: "a² + b² + c² + 2(ab + bc + ca)" }
                ]
            },
            {
                name: "Cube Identities & Factoring",
                badge: "Degree 3",
                range: "Cubes & Factoring",
                items: [
                    { isFormula: true, q: "(a + b)³", a: "a³ + b³ + 3ab(a + b)" },
                    { isFormula: true, q: "(a - b)³", a: "a³ - b³ - 3ab(a - b)" },
                    { isFormula: true, q: "a³ + b³", a: "(a + b)(a² - ab + b²)" },
                    { isFormula: true, q: "a³ - b³", a: "(a - b)(a² + ab + b²)" },
                    { isFormula: true, q: "(a + b)³ + (a - b)³", a: "2a(a² + 3b²)" },
                    { isFormula: true, q: "(a + b)³ - (a - b)³", a: "2b(3a² + b²)" }
                ]
            },
            {
                name: "3-Variable SSC Super Formulas",
                badge: "Most Tested",
                range: "3-Variable Special",
                items: [
                    { isFormula: true, q: "a³+b³+c³ - 3abc (Form 1)", a: "(a+b+c)(a²+b²+c² - ab - bc - ca)" },
                    { isFormula: true, q: "a³+b³+c³ - 3abc (Form 2)", a: "½(a+b+c)[(a-b)² + (b-c)² + (c-a)²]" },
                    { isFormula: true, q: "a³+b³+c³ - 3abc (Form 3)", a: "(a+b+c)[(a+b+c)² - 3(ab + bc + ca)]" },
                    { isFormula: true, q: "Special Case: If a + b + c = 0", a: "a³ + b³ + c³ = 3abc" },
                    { isFormula: true, q: "Special Case: If a = b = c", a: "a³ + b³ + c³ - 3abc = 0" }
                ]
            },
            {
                name: "x + 1/x Direct Speed Transforms",
                badge: "High Speed Reflexes",
                range: "x + 1/x Speed Rules",
                items: [
                    { isFormula: true, q: "x + 1/x = k ➔ x² + 1/x²", a: "k² - 2" },
                    { isFormula: true, q: "x - 1/x = k ➔ x² + 1/x²", a: "k² + 2" },
                    { isFormula: true, q: "x + 1/x = k ➔ x³ + 1/x³", a: "k³ - 3k" },
                    { isFormula: true, q: "x - 1/x = k ➔ x³ - 1/x³", a: "k³ + 3k" },
                    { isFormula: true, q: "Special Value: x + 1/x = 1", a: "x³ = -1 (x³ + 1 = 0)" },
                    { isFormula: true, q: "Special Value: x + 1/x = -1", a: "x³ = +1 (x³ - 1 = 0)" },
                    { isFormula: true, q: "Special Value: x + 1/x = √3", a: "x⁶ = -1 (x⁶ + 1 = 0)" }
                ]
            }
        ]
    },
    alphabets: {
        title: "Alphabet Codes, Reverse & Mnemonics",
        ranges: ["All (13 Pairs)", "A–G Pairs (1–7)", "H–M Pairs (8–13)", "Speed Anchors & Rules"],
        groups: [
            {
                name: "A to G Opposite Pairs (1–7)",
                badge: "Pairs 1–7",
                range: "A–G Pairs (1–7)",
                items: [
                    { isAlphabetPair: true, left: "A", leftPos: 1, right: "Z", rightPos: 26, mnemonic: "AZad / A-to-Z", q: "A (1) ⇄ Z (26)", a: "AZad" },
                    { isAlphabetPair: true, left: "B", leftPos: 2, right: "Y", rightPos: 25, mnemonic: "BoY", q: "B (2) ⇄ Y (25)", a: "BoY" },
                    { isAlphabetPair: true, left: "C", leftPos: 3, right: "X", rightPos: 24, mnemonic: "CraX / CruX", q: "C (3) ⇄ X (24)", a: "CraX" },
                    { isAlphabetPair: true, left: "D", leftPos: 4, right: "W", rightPos: 23, mnemonic: "Dew / DoodhWala", q: "D (4) ⇄ W (23)", a: "Dew" },
                    { isAlphabetPair: true, left: "E", leftPos: 5, right: "V", rightPos: 22, mnemonic: "Evening / LovE", q: "E (5) ⇄ V (22)", a: "Evening" },
                    { isAlphabetPair: true, left: "F", leftPos: 6, right: "U", rightPos: 21, mnemonic: "FUll / For U", q: "F (6) ⇄ U (21)", a: "FUll" },
                    { isAlphabetPair: true, left: "G", leftPos: 7, right: "T", rightPos: 20, mnemonic: "GT Road", q: "G (7) ⇄ T (20)", a: "GT Road" }
                ]
            },
            {
                name: "H to M Opposite Pairs (8–13)",
                badge: "Pairs 8–13",
                range: "H–M Pairs (8–13)",
                items: [
                    { isAlphabetPair: true, left: "H", leftPos: 8, right: "S", rightPos: 19, mnemonic: "High School", q: "H (8) ⇄ S (19)", a: "High School" },
                    { isAlphabetPair: true, left: "I", leftPos: 9, right: "R", rightPos: 18, mnemonic: "Indian Railway", q: "I (9) ⇄ R (18)", a: "Indian Railway" },
                    { isAlphabetPair: true, left: "J", leftPos: 10, right: "Q", rightPos: 17, mnemonic: "Jungle Queen", q: "J (10) ⇄ Q (17)", a: "Jungle Queen" },
                    { isAlphabetPair: true, left: "K", leftPos: 11, right: "P", rightPos: 16, mnemonic: "Kurta Pajama / PK", q: "K (11) ⇄ P (16)", a: "Kurta Pajama" },
                    { isAlphabetPair: true, left: "L", leftPos: 12, right: "O", rightPos: 15, mnemonic: "LOve / Light On", q: "L (12) ⇄ O (15)", a: "LOve" },
                    { isAlphabetPair: true, left: "M", leftPos: 13, right: "N", rightPos: 14, mnemonic: "MaN / Moon", q: "M (13) ⇄ N (14)", a: "MaN" }
                ]
            },
            {
                name: "Speed Anchors & Shape Hacks",
                badge: "Instant Memory Hooks",
                range: "Speed Anchors & Rules",
                items: [
                    { isFormula: true, q: "E - J - O - T - Y (Table of 5)", a: "5, 10, 15, 20, 25" },
                    { isFormula: true, q: "C - F - I - L - O - R - U - X (Table of 3)", a: "3, 6, 9, 12, 15, 18, 21, 24" },
                    { isFormula: true, q: "Sum of Opposites Law", a: "Pos + Rev ALWAYS = 27 (e.g. A[1]+Z[26]=27, K[11]+P[16]=27)" },
                    { isFormula: true, q: "Letter G (has 7 inside)", a: "G = 7 (Recall G-7 Global Summit)" },
                    { isFormula: true, q: "Letter H (close top & bottom)", a: "H = 8 (forms a digital 8)" },
                    { isFormula: true, q: "Letter I (cursive 9)", a: "I = 9 (Recall 'I know' ➔ 9)" },
                    { isFormula: true, q: "Letter K (2 sticks)", a: "K = 11 (Kings XI Punjab)" },
                    { isFormula: true, q: "Letter M & W (3 points)", a: "M = 13 (First 3)  |  W = 23 (Second 3)" },
                    { isFormula: true, q: "Letter T (cricket)", a: "T = 20 (T-20 cricket)" },
                    { isFormula: true, q: "Letter V (victory 2 fingers)", a: "V = 22 (Two fingers up)" }
                ]
            }
        ]
    },
    geomCenters: {
        title: "Geometry Centers & Theorems",
        ranges: ["All", "Incenter (I)", "Circumcenter (O)", "Orthocenter (H)", "Centroid (G)"],
        groups: [
            {
                name: "Incenter (I) — Angle Bisectors",
                badge: "Inscribed Circle",
                range: "Incenter (I)",
                items: [
                    { isFormula: true, q: "Definition", a: "Intersection point of 3 internal angle bisectors" },
                    { isFormula: true, q: "Core Property", a: "Equidistant from all 3 sides (Distance = Inradius r)" },
                    { isFormula: true, q: "∠BIC (Angle at Incenter)", a: "90° + ∠A / 2" },
                    { isFormula: true, q: "∠AIC (Angle at Incenter)", a: "90° + ∠B / 2" },
                    { isFormula: true, q: "Inradius r formula", a: "r = Area / Semiperimeter (Δ / s)" },
                    { isFormula: true, q: "Equilateral Δ Inradius", a: "r = a / (2√3)" }
                ]
            },
            {
                name: "Circumcenter (O) — Side Bisectors",
                badge: "Circumscribed",
                range: "Circumcenter (O)",
                items: [
                    { isFormula: true, q: "Definition", a: "Intersection point of perpendicular side bisectors" },
                    { isFormula: true, q: "Core Property", a: "Equidistant from all 3 vertices (Distance = Circumradius R)" },
                    { isFormula: true, q: "∠BOC (Angle at Circumcenter)", a: "2 × ∠A" },
                    { isFormula: true, q: "Circumradius R formula", a: "R = abc / (4Δ)" },
                    { isFormula: true, q: "Equilateral Δ Circumradius", a: "R = a / √3" },
                    { isFormula: true, q: "Right-angle Δ Location", a: "Midpoint of Hypotenuse (R = Hypotenuse / 2)" },
                    { isFormula: true, q: "Equilateral R : r Ratio", a: "R : r = 2 : 1 (Circumradius = 2 × Inradius)" }
                ]
            },
            {
                name: "Orthocenter (H) — Altitudes",
                badge: "Heights",
                range: "Orthocenter (H)",
                items: [
                    { isFormula: true, q: "Definition", a: "Intersection point of 3 altitudes (heights)" },
                    { isFormula: true, q: "∠BHC (Angle at Orthocenter)", a: "180° - ∠A" },
                    { isFormula: true, q: "Right-angle Δ Location", a: "Lies exactly AT the Right Angle Vertex" },
                    { isFormula: true, q: "Obtuse-angle Δ Location", a: "Lies OUTSIDE the triangle" },
                    { isFormula: true, q: "Acute-angle Δ Location", a: "Lies INSIDE the triangle" }
                ]
            },
            {
                name: "Centroid (G) — Medians",
                badge: "Center of Mass",
                range: "Centroid (G)",
                items: [
                    { isFormula: true, q: "Definition", a: "Intersection point of 3 medians" },
                    { isFormula: true, q: "Median Ratio", a: "Divides each median in 2 : 1 (Vertex : Base)" },
                    { isFormula: true, q: "Area Division", a: "Divides triangle into 6 equal-area triangles" },
                    { isFormula: true, q: "Apollonius Theorem", a: "AB² + AC² = 2(AD² + BD²)  [where AD is median]" },
                    { isFormula: true, q: "Euler Line (Collinear)", a: "H, G, O collinear with HG : GO = 2 : 1" }
                ]
            }
        ]
    },
    trigReflex: {
        title: "Trig Angles, Identities & Conjugates",
        ranges: ["All", "Standard Angles", "Pythagorean Identities", "Conjugates & Reflexes", "Complementary Pairs"],
        groups: [
            {
                name: "0° to 90° Standard Angles",
                badge: "Fundamental",
                range: "Standard Angles",
                items: [
                    { q: "sin (0°, 30°, 45°, 60°, 90°)", a: "0, 1/2, 1/√2, √3/2, 1" },
                    { q: "cos (0°, 30°, 45°, 60°, 90°)", a: "1, √3/2, 1/√2, 1/2, 0" },
                    { q: "tan (0°, 30°, 45°, 60°, 90°)", a: "0, 1/√3, 1, √3, ∞" },
                    { q: "cot (0°, 30°, 45°, 60°, 90°)", a: "∞, √3, 1, 1/√3, 0" },
                    { q: "sec (0°, 30°, 45°, 60°, 90°)", a: "1, 2/√3, √2, 2, ∞" },
                    { q: "cosec (0°, 30°, 45°, 60°, 90°)", a: "∞, 2, √2, 2/√3, 1" }
                ]
            },
            {
                name: "Pythagorean Identities",
                badge: "Trig Powers",
                range: "Pythagorean Identities",
                items: [
                    { isFormula: true, q: "sin²θ + cos²θ", a: "1" },
                    { isFormula: true, q: "sec²θ - tan²θ", a: "1" },
                    { isFormula: true, q: "cosec²θ - cot²θ", a: "1" },
                    { isFormula: true, q: "sin⁴θ + cos⁴θ", a: "1 - 2sin²θ·cos²θ" },
                    { isFormula: true, q: "sin⁶θ + cos⁶θ", a: "1 - 3sin²θ·cos²θ" },
                    { isFormula: true, q: "sec⁴θ - tan⁴θ", a: "sec²θ + tan²θ" },
                    { isFormula: true, q: "cosec⁴θ - cot⁴θ", a: "cosec²θ + cot²θ" }
                ]
            },
            {
                name: "Conjugate Reciprocal Reflexes",
                badge: "High Speed",
                range: "Conjugates & Reflexes",
                items: [
                    { isFormula: true, q: "If secθ + tanθ = p", a: "secθ - tanθ = 1/p" },
                    { isFormula: true, q: "secθ in terms of p", a: "(p² + 1) / 2p" },
                    { isFormula: true, q: "tanθ in terms of p", a: "(p² - 1) / 2p" },
                    { isFormula: true, q: "If cosecθ + cotθ = q", a: "cosecθ - cotθ = 1/q" },
                    { isFormula: true, q: "cosecθ in terms of q", a: "(q² + 1) / 2q" },
                    { isFormula: true, q: "cotθ in terms of q", a: "(q² - 1) / 2q" }
                ]
            },
            {
                name: "Complementary Pairs (A+B = 90°)",
                badge: "A + B = 90°",
                range: "Complementary Pairs",
                items: [
                    { isFormula: true, q: "sin A =", a: "cos B" },
                    { isFormula: true, q: "tan A =", a: "cot B" },
                    { isFormula: true, q: "sec A =", a: "cosec B" },
                    { isFormula: true, q: "tan A · tan B", a: "1" },
                    { isFormula: true, q: "cot A · cot B", a: "1" },
                    { isFormula: true, q: "sin²A + sin²B", a: "1" },
                    { isFormula: true, q: "cos²A + cos²B", a: "1" }
                ]
            }
        ]
    },
    lcm: {
        title: "LCM Frequent Exam Triples & Formulas",
        ranges: ["All", "Work & Time Triples", "Speed & Mensuration", "Master Formulas"],
        groups: [
            {
                name: "Work & Time LCM Triples",
                badge: "CGL Most Repeated",
                range: "Work & Time Triples",
                items: [
                    { q: "LCM(10, 12, 15)", a: "60" },
                    { q: "LCM(12, 15, 20)", a: "60" },
                    { q: "LCM(15, 20, 30)", a: "60" },
                    { q: "LCM(12, 16, 24)", a: "48" },
                    { q: "LCM(12, 18, 24)", a: "72" },
                    { q: "LCM(16, 20, 24)", a: "240" },
                    { q: "LCM(18, 24, 36)", a: "72" },
                    { q: "LCM(20, 25, 30)", a: "300" },
                    { q: "LCM(14, 21, 28)", a: "84" },
                    { q: "LCM(8, 12, 15)", a: "120" }
                ]
            },
            {
                name: "Speed & Mensuration LCM",
                badge: "Advanced Triples",
                range: "Speed & Mensuration",
                items: [
                    { q: "LCM(24, 32, 40)", a: "480" },
                    { q: "LCM(25, 30, 45)", a: "450" },
                    { q: "LCM(36, 45, 60)", a: "180" },
                    { q: "LCM(40, 50, 60)", a: "600" },
                    { q: "LCM(15, 25, 40)", a: "600" }
                ]
            },
            {
                name: "LCM Master Rules & Formulas",
                badge: "Super Rules",
                range: "Master Formulas",
                items: [
                    { isFormula: true, q: "Product Rule", a: "LCM(a, b) × HCF(a, b) = a × b" },
                    { isFormula: true, q: "LCM of Fractions", a: "LCM(Numerators) / HCF(Denominators)" },
                    { isFormula: true, q: "Ratio Rule (x:y with HCF H)", a: "Numbers = Hx, Hy ➔ LCM = H·x·y" }
                ]
            }
        ]
    },
    hcf: {
        title: "HCF Quick Factoring & Properties",
        ranges: ["All", "Quick Factoring Rules", "Frequent Exam HCF", "Master Formulas"],
        groups: [
            {
                name: "Quick Factoring Rules",
                badge: "Direct Factors",
                range: "Quick Factoring Rules",
                items: [
                    { isFormula: true, q: "HCF of consecutive numbers (n, n+1)", a: "Always 1 (Coprime)" },
                    { isFormula: true, q: "HCF of consecutive even numbers", a: "Always 2" },
                    { isFormula: true, q: "HCF of consecutive odd numbers", a: "Always 1" },
                    { isFormula: true, q: "Difference Rule: HCF(a, b)", a: "HCF always divides |a - b|" }
                ]
            },
            {
                name: "Frequent CGL Exam HCF",
                badge: "Exam Triples",
                range: "Frequent Exam HCF",
                items: [
                    { q: "HCF(12, 18, 24)", a: "6" },
                    { q: "HCF(15, 25, 35)", a: "5" },
                    { q: "HCF(16, 24, 32)", a: "8" },
                    { q: "HCF(24, 36, 60)", a: "12" },
                    { q: "HCF(30, 45, 75)", a: "15" },
                    { q: "HCF(40, 60, 100)", a: "20" },
                    { q: "HCF(48, 72, 108)", a: "12" }
                ]
            },
            {
                name: "HCF Master Rules & Formulas",
                badge: "Super Rules",
                range: "Master Formulas",
                items: [
                    { isFormula: true, q: "HCF of Fractions", a: "HCF(Numerators) / LCM(Denominators)" },
                    { isFormula: true, q: "Product Rule", a: "HCF(a, b) = (a × b) / LCM(a, b)" },
                    { isFormula: true, q: "Greatest Number dividing x,y,z leaving remainder r", a: "HCF(x-r, y-r, z-r)" }
                ]
            }
        ]
    }
};

// =========================================================================
// CHEAT SHEET TELEMETRY RESOLVER & DIRECT MICRO-DRILL LAUNCH ENGINE
// =========================================================================

function resolveCheatTelemetryAndTarget(category, item, group) {
    let targetKey = null;
    let label = '';

    if (category === 'tables') {
        const match = group && group.name ? group.name.match(/\d+/) : null;
        targetKey = match ? match[0] : '11';
        label = `Table ${targetKey}`;
    } else if (category === 'squares' || category === 'cubes') {
        const match = item && item.q ? item.q.match(/\d+/) : null;
        targetKey = match ? match[0] : null;
        label = item ? (item.q || `${targetKey}`) : '';
    } else if (category === 'fracPerc') {
        const match = item && item.q ? item.q.match(/\d+\/\d+/) : null;
        targetKey = match ? match[0] : null;
        label = targetKey || (item ? item.q : '');
    } else if (category === 'alphabets') {
        if (item && item.left) {
            targetKey = item.left;
            label = `${item.left} ⇄ ${item.right}`;
        } else if (item && item.q) {
            const match = item.q.match(/[A-Z]/);
            targetKey = match ? match[0] : null;
            label = targetKey || item.q;
        }
    } else if (category === 'triplets') {
        const combined = `${item ? item.q : ''} ${item ? item.a : ''}`;
        if (combined.includes("3, 4, 5") || combined.includes("n = 3") || combined.includes("6, 8, 10") || combined.includes("9, 12, 15")) targetKey = "3-4-5";
        else if (combined.includes("5, 12, 13") || combined.includes("n = 5") || combined.includes("10, 24, 26")) targetKey = "5-12-13";
        else if (combined.includes("7, 24, 25") || combined.includes("n = 7") || combined.includes("14, 48, 50")) targetKey = "7-24-25";
        else if (combined.includes("8, 15, 17") || combined.includes("m=4") || combined.includes("16, 30, 34")) targetKey = "8-15-17";
        else if (combined.includes("9, 40, 41") || combined.includes("n = 9") || combined.includes("18, 80, 82")) targetKey = "9-40-41";
        else if (combined.includes("11, 60, 61") || combined.includes("n = 11")) targetKey = "11-60-61";
        else if (combined.includes("12, 35, 37") || combined.includes("m=6")) targetKey = "12-35-37";
        else if (combined.includes("13, 84, 85") || combined.includes("n = 13")) targetKey = "13-84-85";
        else if (combined.includes("20, 21, 29") || combined.includes("m=10") || combined.includes("40, 42, 58")) targetKey = "20-21-29";
        else if (combined.includes("28, 45, 53") || combined.includes("m=14")) targetKey = "28-45-53";
        else if (combined.includes("16, 63, 65") || combined.includes("m=8")) targetKey = "16-63-65";
        else if (combined.includes("33, 56, 65")) targetKey = "33-56-65";
        else if (combined.includes("48, 55, 73")) targetKey = "48-55-73";
        else targetKey = "3-4-5";
        label = item ? item.q : 'Triplet';
    } else if (category === 'algebra') {
        const q = (item && item.q ? item.q : '').toLowerCase();
        if (q.includes("a + b") && q.includes("³")) targetKey = "a+b";
        else if (q.includes("a - b") && q.includes("³")) targetKey = "a-b";
        else if (q.includes("a³ + b³") || q.includes("a³ - b³")) targetKey = "a3-b3";
        else if (q.includes("a² - b²")) targetKey = "a2-b2";
        else if (q.includes("(a - b)²")) targetKey = "a-b_sq";
        else if (q.includes("(a + b)²")) targetKey = "a+b_sq";
        else if (q.includes("a + b")) targetKey = "a+b";
        else if (q.includes("a - b")) targetKey = "a-b";
        else if (q.includes("x + 1/x = k ➔ x²")) targetKey = "a2+b2";
        else if (q.includes("x + 1/x = k ➔ x³")) targetKey = "a3-b3";
        else targetKey = "a+b";
        label = item ? item.q : 'Identity';
    } else if (category === 'geomCenters') {
        const q = (item && item.q ? item.q : '').toLowerCase();
        if (q.includes("incenter") || q.includes("inradius")) targetKey = "incenter";
        else if (q.includes("circumcenter") || q.includes("circumradius")) targetKey = "circumcenter";
        else if (q.includes("orthocenter")) targetKey = "orthocenter";
        else if (q.includes("centroid")) targetKey = "centroid";
        else targetKey = "incenter";
        label = item ? item.q : 'Center';
    } else if (category === 'lcm') {
        const match = item && item.q ? item.q.match(/\d+[\s,]+\d+[\s,]+\d+/) : null;
        if (match) targetKey = match[0].replace(/[\s,]+/g, '-');
        label = item ? item.q : 'LCM';
    } else if (category === 'hcf') {
        const match = item && item.a ? item.a.match(/\d+/) : null;
        if (match) targetKey = match[0];
        label = item ? item.q : 'HCF';
    }

    let telemetry = null;
    if (targetKey && typeof MicroFrequencyHeatmap !== 'undefined') {
        const records = MicroFrequencyHeatmap.getDailyStore ? MicroFrequencyHeatmap.getDailyStore() : {};
        const compositeKey = `${category}:${targetKey}`;
        const rec = records[compositeKey];
        const mat = MicroFrequencyHeatmap.getFactMaturation ? MicroFrequencyHeatmap.getFactMaturation(category, targetKey) : { tier: 1 };
        telemetry = {
            targetKey,
            attempts: rec ? rec.attempts : 0,
            correct: rec ? rec.correct : 0,
            wrong: rec ? rec.wrong : 0,
            tier: mat ? mat.tier : 1
        };
    }

    return { targetKey, label, telemetry };
}

// Render small subtle maturity pip (Red, Amber, Cyan, Gray ring) based on telemetry
function renderMasteryPipHtml(telemetry) {
    if (!telemetry || telemetry.attempts === 0) {
        return `<span class="w-2 h-2 rounded-full border border-white/20 bg-white/5 inline-block shrink-0" title="Untested in drills"></span>`;
    }
    if (telemetry.tier === 3) {
        return `<span class="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)] inline-block shrink-0 animate-pulse" title="Mastered Reflex (Tier 3: 95%+ Acc, <1.2s)"></span>`;
    }
    if (telemetry.tier === 2) {
        return `<span class="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.6)] inline-block shrink-0" title="Practicing / Developing (Tier 2: 85%+ Acc)"></span>`;
    }
    return `<span class="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.7)] inline-block shrink-0" title="Frequent Mistake / Needs Practice (${telemetry.wrong} errors)"></span>`;
}

// Render small quick-drill icon button to launch targeted 60-second micro-drill
function renderQuickDrillButtonHtml(category, targetKey, label, size = 'sm') {
    if (!targetKey) return '';
    const safeTarget = String(targetKey).replace(/"/g, '&quot;').replace(/'/g, "\\'");
    const safeLabel = String(label).replace(/"/g, '&quot;').replace(/'/g, "\\'");
    const sizeCls = size === 'xs' ? 'w-5 h-5 text-[9px]' : 'w-6 h-6 text-[10px]';
    return `
        <button type="button" 
                class="btn-micro-drill-launch ${sizeCls} rounded-md bg-white/5 hover:bg-amber-400/20 text-gray-400 hover:text-amber-300 border border-white/5 hover:border-amber-400/40 transition flex items-center justify-center shrink-0 cursor-pointer shadow-sm group/btn select-none" 
                title="⚡ Launch focused 60-second micro-drill on ${safeLabel}"
                onclick="event.stopPropagation(); launchTargetedMicroDrill('${category}', '${safeTarget}', '${safeLabel}');">
            <i class="fa-solid fa-bolt transition-transform group-hover/btn:scale-110"></i>
        </button>
    `;
}

// Launch focused 60-second micro-drill on entity/family from cheat sheet
function launchTargetedMicroDrill(category, targetValue, label) {
    if (typeof document === 'undefined') return;
    if (isChallengeActive) {
        if (window.showCustomAlert) {
            window.showCustomAlert({
                title: "Conquest Run Active",
                message: "A Conquest run is active! Abort or complete it before launching a micro-drill.",
                icon: "fa-bolt",
                type: "warning",
                buttonText: "Understood"
            });
        }
        return;
    }

    // 1. Switch category if different
    if (category && drillMode !== category) {
        drillMode = category;
        const modeTabs = document.querySelectorAll(".speed-tab-btn");
        modeTabs.forEach(t => {
            if (t.getAttribute("data-mode") === category) {
                t.classList.add("active-nav-tab");
            } else {
                t.classList.remove("active-nav-tab");
            }
        });
        if (window.activeSpeedHeatmap) {
            window.activeSpeedHeatmap.setCategory(category);
        }
        renderDrillCheatSheet(category);
    }

    // 2. Lock target value for focused questions
    currentTargetValue = String(targetValue);
    if (window.activeSpeedHeatmap) {
        window.activeSpeedHeatmap.focusedValue = String(targetValue);
        window.activeSpeedHeatmap.render();
    }

    // 3. Switch to Blitz 60s mode for micro-drill
    currentSpeedMode = SPEED_MODES.BLITZ;
    blitzSecondsRemaining = 60;
    updateModeBadgeUI();

    // 4. Start drill immediately in Blitz mode
    restartDrillSession();
    currentTargetValue = String(targetValue);
    if (window.activeSpeedHeatmap) {
        window.activeSpeedHeatmap.focusedValue = String(targetValue);
        window.activeSpeedHeatmap.render();
    }
    generateDrillQuestion();

    // 5. Scroll smoothly up to drill hero card
    const heroCard = document.getElementById("unified-drill-card");
    if (heroCard) {
        heroCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // 6. Provide immediate feedback
    const targetDisplay = label || targetValue;
    if (typeof window.showToast === 'function') {
        window.showToast(`⚡ Focused 60s Micro-Drill: ${targetDisplay}!`, 'info');
    }
    showDrillHudFeedback(`MICRO-DRILL ➔ ${String(targetDisplay).toUpperCase()}`, '<i class="fa-solid fa-bolt text-amber-400"></i>');
}
window.launchTargetedMicroDrill = launchTargetedMicroDrill;

function renderDrillCheatSheet(mode, activeSubtab, searchQuery) {
    if (typeof document === 'undefined') return;
    const currentMode = mode || drillMode || 'squares';
    const card = document.getElementById("drill-cheat-sheet-card");
    if (!card) return;

    // Reset subtab to 'all' whenever category mode switches without an explicit activeSubtab
    if (currentMode !== prevCheatMode && activeSubtab === undefined) {
        currentCheatSubtab = 'all';
    }
    prevCheatMode = currentMode;

    const data = DRILL_CHEAT_DATA[currentMode] || DRILL_CHEAT_DATA.squares;
    const badge = document.getElementById("cheat-sheet-category-badge");
    if (badge) badge.innerText = data.title;

    if (activeSubtab !== undefined) currentCheatSubtab = activeSubtab;
    if (searchQuery !== undefined) currentCheatSearch = searchQuery;

    // Normalize activeSubtab: if not set or invalid for current mode, default to 'all'
    const availableRanges = data.ranges || ["All"];
    const hasMatch = availableRanges.some(r => r.toLowerCase() === currentCheatSubtab.toLowerCase() || (currentCheatSubtab === 'all' && (r === 'All' || r.startsWith('All'))));
    if (!hasMatch) {
        currentCheatSubtab = 'all';
    }

    // 1. Render Sub-tabs
    const subtabsContainer = document.getElementById("cheat-sheet-subtabs");
    if (subtabsContainer) {
        let subtabsHtml = '';
        availableRanges.forEach(rangeName => {
            const isRangeAll = (rangeName === 'All' || rangeName.startsWith('All'));
            const isActive = (currentCheatSubtab.toLowerCase() === rangeName.toLowerCase() || (currentCheatSubtab === 'all' && isRangeAll));
            const activeCls = isActive ? "bg-blue-600 text-white shadow-sm" : "bg-white/5 text-gray-400 hover:text-white";
            subtabsHtml += `<button type="button" class="cheat-range-pill px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition cursor-pointer shrink-0 ${activeCls}" data-range="${rangeName}">${rangeName}</button>`;
        });
        subtabsContainer.innerHTML = subtabsHtml;

        subtabsContainer.querySelectorAll(".cheat-range-pill").forEach(btn => {
            btn.onclick = () => {
                const selected = btn.getAttribute("data-range");
                currentCheatSubtab = (selected === 'All' || selected.startsWith('All')) ? 'all' : selected.toLowerCase();
                renderDrillCheatSheet(currentMode, currentCheatSubtab, currentCheatSearch);
            };
        });
    }

    // 2. Filter Groups and Items
    let groups = data.groups || [];
    if (currentCheatSubtab && currentCheatSubtab !== 'all') {
        groups = groups.filter(g => g.range && g.range.toLowerCase() === currentCheatSubtab);
    }

    const query = (currentCheatSearch || '').toLowerCase().trim();

    // 3. Render Body as Vertical Column Cards
    const body = document.getElementById("drill-cheat-sheet-body");
    if (body) {
        const answerClass = isCheatPeekHidden ? "cheat-val-hidden blur-[5px] select-none cursor-pointer bg-white/10 px-2 py-0.5 rounded transition" : "text-cyan-400 font-bold";

        let renderedGroupsHtml = '';
        let totalItemsRendered = 0;

        groups.forEach(group => {
            let matchingItems = group.items;
            if (query) {
                matchingItems = matchingItems.filter(it => 
                    (it.q && it.q.toLowerCase().includes(query)) || 
                    (it.a && it.a.toLowerCase().includes(query)) ||
                    (it.letter && it.letter.toLowerCase().includes(query)) ||
                    (it.left && it.left.toLowerCase().includes(query)) ||
                    (it.right && it.right.toLowerCase().includes(query)) ||
                    (it.leftPos && String(it.leftPos).includes(query)) ||
                    (it.rightPos && String(it.rightPos).includes(query)) ||
                    (it.mnemonic && it.mnemonic.toLowerCase().includes(query)) ||
                    (group.name && group.name.toLowerCase().includes(query))
                );
            }
            if (matchingItems.length === 0) return;

            totalItemsRendered += matchingItems.length;

            let itemsHtml = '';
            matchingItems.forEach(it => {
                // Style 1: Tables (Ultra-clean vertical recitation sequence 11, 22, 33...)
                if (currentMode === 'tables') {
                    itemsHtml += `
                        <div class="cheat-item-row flex items-center justify-between px-2 py-1 rounded bg-black/40 hover:bg-white/[0.08] border border-white/5 hover:border-cyan-500/30 transition group cursor-pointer" onclick="this.querySelector('.cheat-val-hidden')?.classList.toggle('blur-[5px]')">
                            <span class="font-mono text-[10px] text-gray-500 font-bold w-4 text-left select-none">${it.q}</span>
                            <span class="font-mono text-xs font-black text-cyan-300 group-hover:text-cyan-200 tracking-wide text-right ${answerClass}">${it.a}</span>
                        </div>
                    `;
                }
                // Style 2: Alphabet Opposite Pair Tile (Matches user design: [A] 1 ⟷ 26 [Z] with mnemonic below)
                else if (it.isAlphabetPair) {
                    const itInfo = resolveCheatTelemetryAndTarget(currentMode, it, group);
                    const pipHtml = renderMasteryPipHtml(itInfo.telemetry);
                    const drillBtn = renderQuickDrillButtonHtml(currentMode, it.left, `${it.left} ⇄ ${it.right}`, 'xs');
                    const hideClass = isCheatPeekHidden ? "cheat-val-hidden blur-[5px] select-none cursor-pointer bg-white/10 rounded transition" : "";

                    itemsHtml += `
                        <div class="cheat-item-card p-2 sm:p-2.5 rounded-xl bg-black/40 hover:bg-white/[0.08] border border-white/5 hover:border-blue-500/40 transition group flex items-center justify-between gap-1 sm:gap-2 cursor-pointer" onclick="this.querySelectorAll('.cheat-val-hidden').forEach(el => el.classList.toggle('blur-[5px]'))">
                            <!-- Left Letter Badge & Position with Mastery Pip -->
                            <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                ${pipHtml}
                                <span class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600/30 text-blue-300 font-mono font-black text-sm sm:text-base flex items-center justify-center border border-blue-500/40 shadow-sm shrink-0 select-none">${it.left}</span>
                                <span class="font-mono text-sm sm:text-base font-black text-cyan-300 w-5 sm:w-6 text-center shrink-0 select-none">${it.leftPos}</span>
                            </div>

                            <!-- Center Double-Headed Arrow & Mnemonic Hook -->
                            <div class="flex-1 flex flex-col items-center justify-center px-1 sm:px-2 min-w-0">
                                <svg class="w-8 sm:w-12 h-3 text-amber-400 shrink-0 select-none" viewBox="0 0 48 14" fill="currentColor">
                                    <path d="M0 7l6-5v3.5h36V2l6 5-6 5v-3.5H6V12z"/>
                                </svg>
                                <span class="text-[10px] sm:text-[11px] font-mono font-bold text-gray-200 tracking-tight text-center leading-tight mt-0.5 break-words">${it.mnemonic}</span>
                            </div>

                            <!-- Right Position, Opposite Letter Badge & Quick Drill Bolt -->
                            <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                <span class="font-mono text-sm sm:text-base font-black text-cyan-300 w-5 sm:w-6 text-center shrink-0 ${hideClass}">${it.rightPos}</span>
                                <span class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600/30 text-blue-300 font-mono font-black text-sm sm:text-base flex items-center justify-center border border-blue-500/40 shadow-sm shrink-0 select-none ${hideClass}">${it.right}</span>
                                ${drillBtn}
                            </div>
                        </div>
                    `;
                }
                // Style 3: Formulas, Definitions, Long Rules (Stacked layout with break-words - Zero Clipping!)
                else if (it.isFormula || (it.q && it.q.length > 20) || (it.a && it.a.length > 22)) {
                    const itInfo = resolveCheatTelemetryAndTarget(currentMode, it, group);
                    const pipHtml = renderMasteryPipHtml(itInfo.telemetry);
                    const drillBtn = itInfo.targetKey ? renderQuickDrillButtonHtml(currentMode, itInfo.targetKey, it.q, 'xs') : '';

                    itemsHtml += `
                        <div class="cheat-item-card p-2.5 rounded-xl bg-black/40 hover:bg-white/[0.08] border border-white/5 hover:border-blue-500/30 transition flex flex-col gap-1.5 cursor-pointer group/card" onclick="this.querySelector('.cheat-val-hidden')?.classList.toggle('blur-[5px]')">
                            <div class="flex items-start justify-between gap-2">
                                <div class="text-[11px] font-mono font-bold text-gray-200 leading-snug break-words flex items-center gap-1.5 min-w-0">
                                    ${pipHtml}
                                    <span>${it.q}</span>
                                </div>
                                ${drillBtn}
                            </div>
                            <div class="text-xs font-mono font-bold text-cyan-300 break-words leading-relaxed pl-2 border-l-2 border-cyan-500/40 ${answerClass}">
                                ${it.a}
                            </div>
                        </div>
                    `;
                }
                // Style 4: Clean Standard Two-Column Row (Squares, Cubes, Multiples, Fractions)
                else {
                    const itInfo = resolveCheatTelemetryAndTarget(currentMode, it, group);
                    const pipHtml = renderMasteryPipHtml(itInfo.telemetry);
                    const drillBtn = itInfo.targetKey ? renderQuickDrillButtonHtml(currentMode, itInfo.targetKey, it.q, 'xs') : '';

                    itemsHtml += `
                        <div class="cheat-item-row flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-black/40 hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition group cursor-pointer" onclick="this.querySelector('.cheat-val-hidden')?.classList.toggle('blur-[5px]')">
                            <div class="flex items-center gap-2 min-w-0 mr-2">
                                ${pipHtml}
                                <span class="font-mono text-xs text-gray-300 font-semibold group-hover:text-white transition break-words" title="${it.q}">${it.q}</span>
                            </div>
                            <div class="flex items-center gap-1.5 shrink-0">
                                <span class="font-mono text-xs text-right ${answerClass}">${it.a}</span>
                                ${drillBtn}
                            </div>
                        </div>
                    `;
                }
            });

            // Card Header: allow group name to wrap, show mastery pip & quick-drill bolt
            const showBadge = (group.badge && group.badge.trim() !== '' && currentMode !== 'tables');
            
            // For tables or groups with a primary target, compute group header telemetry & drill button
            let groupPipHtml = '';
            let groupDrillBtn = '';
            if (currentMode === 'tables') {
                const tableNum = group.name.replace(/\D/g, '');
                const groupInfo = resolveCheatTelemetryAndTarget('tables', { q: tableNum }, group);
                groupPipHtml = renderMasteryPipHtml(groupInfo.telemetry);
                groupDrillBtn = renderQuickDrillButtonHtml('tables', tableNum, `Table ${tableNum}`, 'xs');
            } else if (group.items && group.items[0]) {
                const firstInfo = resolveCheatTelemetryAndTarget(currentMode, group.items[0], group);
                if (firstInfo && firstInfo.targetKey) {
                    groupPipHtml = renderMasteryPipHtml(firstInfo.telemetry);
                    groupDrillBtn = renderQuickDrillButtonHtml(currentMode, firstInfo.targetKey, group.name, 'xs');
                }
            }

            renderedGroupsHtml += `
                <div class="cheat-group-column bg-slate-950/70 border border-white/10 rounded-2xl p-3 shadow-md backdrop-blur-md flex flex-col gap-2 transition hover:border-blue-500/40">
                    <div class="flex items-center justify-between border-b border-white/5 pb-2 gap-1.5">
                        <span class="font-heading font-black text-xs text-white tracking-wide flex items-center gap-1.5 min-w-0">
                            ${groupPipHtml}
                            <i class="fa-solid fa-table-cells text-[10px] text-cyan-400 shrink-0"></i>
                            <span class="break-words">${group.name}</span>
                        </span>
                        <div class="flex items-center gap-1.5 shrink-0">
                            ${showBadge ? `<span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold shrink-0 border border-blue-500/30 whitespace-nowrap">${group.badge}</span>` : ''}
                            ${groupDrillBtn}
                        </div>
                    </div>
                    <div class="space-y-1">
                        ${itemsHtml}
                    </div>
                </div>
            `;
        });

        if (totalItemsRendered === 0) {
            body.innerHTML = `<div class="p-8 text-center text-xs font-mono text-gray-500">No matching cheat sheet values found for "${query}".</div>`;
            return;
        }

        // Layout columns: Responsive grid tuned per category type
        let colsClass = 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4';
        if (currentMode === 'tables') {
            colsClass = 'grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-10 gap-2.5';
        } else if (currentMode === 'squares' || currentMode === 'cubes') {
            colsClass = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5';
        } else if (currentMode === 'alphabets') {
            colsClass = 'grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4';
        } else {
            // fracPerc, triplets, algebra, geomCenters, trigReflex, lcm, hcf
            colsClass = 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4';
        }

        body.innerHTML = `<div class="grid ${colsClass} items-start">${renderedGroupsHtml}</div>`;
    }
}
window.renderDrillCheatSheet = renderDrillCheatSheet;

let isCheatSheetCollapsed = false;

function setCheatSheetCollapseState(collapsed) {
    isCheatSheetCollapsed = Boolean(collapsed);
    try {
        localStorage.setItem('conquest_cheat_notes_collapsed', isCheatSheetCollapsed ? 'true' : 'false');
    } catch (e) {}

    const card = document.getElementById("drill-cheat-sheet-card");
    const headerBar = document.getElementById("cheat-sheet-header-bar");
    const filterControls = document.getElementById("cheat-sheet-filter-controls");
    const collapsibleContent = document.getElementById("cheat-sheet-collapsible-content");
    const collapsedHint = document.getElementById("cheat-sheet-collapsed-hint");
    const chevrons = document.querySelectorAll(".icon-cheat-collapse-chevron");
    const labels = document.querySelectorAll(".label-cheat-collapse-text");

    if (card) {
        if (isCheatSheetCollapsed) {
            card.classList.add("is-collapsed");
            card.classList.remove("space-y-3.5", "space-y-2", "sm:space-y-3.5");
        } else {
            card.classList.remove("is-collapsed");
            card.classList.add("space-y-2", "sm:space-y-3.5");
        }
    }

    if (headerBar) {
        if (isCheatSheetCollapsed) {
            headerBar.classList.remove("border-b", "pb-3", "pb-2", "sm:pb-3");
        } else {
            headerBar.classList.add("border-b", "pb-2", "sm:pb-3");
        }
    }

    if (filterControls) {
        if (isCheatSheetCollapsed) filterControls.classList.add("hidden");
        else filterControls.classList.remove("hidden");
    }

    if (collapsibleContent) {
        if (isCheatSheetCollapsed) collapsibleContent.classList.add("hidden");
        else collapsibleContent.classList.remove("hidden");
    }

    if (collapsedHint) {
        if (isCheatSheetCollapsed) collapsedHint.classList.remove("hidden");
        else collapsedHint.classList.add("hidden");
    }

    chevrons.forEach(icon => {
        if (isCheatSheetCollapsed) {
            icon.className = "fa-solid fa-chevron-down text-xs text-cyan-400 transition-transform duration-300 icon-cheat-collapse-chevron";
        } else {
            icon.className = "fa-solid fa-chevron-up text-xs text-cyan-400 transition-transform duration-300 icon-cheat-collapse-chevron";
        }
    });

    labels.forEach(lbl => {
        lbl.innerText = isCheatSheetCollapsed ? "Expand" : "Collapse";
    });
}
window.setCheatSheetCollapseState = setCheatSheetCollapseState;

function toggleCheatSheetCollapse() {
    setCheatSheetCollapseState(!isCheatSheetCollapsed);
    if (typeof window.playSound === 'function') window.playSound('click');
}
window.toggleCheatSheetCollapse = toggleCheatSheetCollapse;

function initDrillCheatSheet() {
    if (typeof document === 'undefined') return;
    const searchInput = document.getElementById("cheat-search-input");
    if (searchInput) {
        searchInput.oninput = (e) => {
            currentCheatSearch = e.target.value;
            renderDrillCheatSheet(drillMode, currentCheatSubtab, currentCheatSearch);
        };
    }

    const peekBtn = document.getElementById("btn-cheat-peek-mode");
    if (peekBtn) {
        peekBtn.onclick = () => {
            isCheatPeekHidden = !isCheatPeekHidden;
            const label = document.getElementById("label-cheat-peek");
            const icon = document.getElementById("icon-cheat-peek");
            if (label) label.innerText = isCheatPeekHidden ? "Show Ans" : "Hide Ans";
            if (icon) icon.className = isCheatPeekHidden ? "fa-solid fa-eye text-xs text-amber-400" : "fa-solid fa-eye-slash text-xs text-accentCyan";
            renderDrillCheatSheet(drillMode, currentCheatSubtab, currentCheatSearch);
        };
    }

    // Wire Collapse / Expand Buttons
    const collapseBtn = document.getElementById("btn-cheat-collapse");
    if (collapseBtn) {
        collapseBtn.onclick = toggleCheatSheetCollapse;
    }
    const collapseBtnMobile = document.getElementById("btn-cheat-collapse-mobile");
    if (collapseBtnMobile) {
        collapseBtnMobile.onclick = toggleCheatSheetCollapse;
    }

    // Restore persisted collapse state
    try {
        const saved = localStorage.getItem('conquest_cheat_notes_collapsed');
        if (saved === 'true') {
            setCheatSheetCollapseState(true);
        }
    } catch (e) {}

    renderDrillCheatSheet(drillMode || 'squares');
}
window.initDrillCheatSheet = initDrillCheatSheet;

// Voice reflex mode removed from speed drilling
function toggleVoiceReflexMode(forceState) { return false; }
window.toggleVoiceReflexMode = toggleVoiceReflexMode;
function listenForVoiceAnswer() {}
window.listenForVoiceAnswer = listenForVoiceAnswer;
function updateVoiceStatusUI() {}
window.updateVoiceStatusUI = updateVoiceStatusUI;


// === PLUGGABLE ML/AI DRILL INTELLIGENCE ENGINE ===
class DrillIntelligenceEngine {
    constructor() {
        this.provider = 'heuristic'; // 'heuristic' | 'gemini' | 'openai'
        this.apiKey = null;
    }

    selectWeightedCandidate(mode, level, candidates, targetKeyExtractor) {
        return selectAdaptiveValue(mode, level, candidates, targetKeyExtractor);
    }

    normalizeVoiceInput(rawTranscript, expectedAnswer) {
        return normalizeVoiceNumber(rawTranscript, expectedAnswer);
    }

    parseSpokenNumberToDigits(text) {
        return parseSpokenNumberToDigits(text);
    }

    async explainMistake(question, userAns, correctAns, responseMs) {
        return getMicroTrickForQuestion(drillMode, currentQuestionTargetKey);
    }

    setAiApiKey(key, provider = 'gemini') {
        this.apiKey = key;
        this.provider = key ? provider : 'heuristic';
    }

    isAiEnabled() {
        return Boolean(this.apiKey);
    }
}
window.DrillIntelligenceEngine = new DrillIntelligenceEngine();

// === GAMIFIED SPEED MODES ENGINE (PHASE 5) ===
const SPEED_MODES = {
    CLASSIC: 'classic',
    BLITZ: 'blitz',
    SUDDEN_DEATH: 'sudden_death',
    LADDER: 'ladder',
    MIX: 'mix',
    WEAK_PRACTICE: 'weak_practice'
};
window.SPEED_MODES = SPEED_MODES;

let currentSpeedMode = SPEED_MODES.CLASSIC;
let blitzSecondsRemaining = 60;
let blitzGlobalInterval = null;
let ladderCurrentDifficulty = 'easy'; // 'easy' -> 'medium' -> 'advance'
const MIX_CATEGORIES = ['squares', 'cubes', 'tables', 'fracPerc', 'triplets', 'algebra', 'trigReflex'];
let currentMixCategory = null;

function setSpeedGameMode(modeKey) {
    if (isChallengeActive) {
        if (typeof window.showToast === 'function') window.showToast('Conquest challenge is active.', 'warning');
        return;
    }
    if (!Object.values(SPEED_MODES).includes(modeKey)) return;

    currentSpeedMode = modeKey;

    // Update Mode Dropdown button label and icon
    const modeNameMap = {
        classic: 'Classic',
        blitz: 'Blitz 60s',
        sudden_death: 'Sudden Death',
        ladder: 'Ladder',
        mix: 'Mix Shuffle',
        weak_practice: 'Weak Practice'
    };
    const modeIconMap = {
        classic: '<i class="fa-solid fa-play"></i>',
        blitz: '<i class="fa-solid fa-stopwatch"></i>',
        sudden_death: '<i class="fa-solid fa-skull"></i>',
        ladder: '<i class="fa-solid fa-stairs"></i>',
        mix: '<i class="fa-solid fa-shuffle"></i>',
        weak_practice: '<i class="fa-solid fa-bullseye"></i>'
    };
    const activeModeLabelEl = document.getElementById("active-mode-label") || document.getElementById("drill-active-mode-name");
    if (activeModeLabelEl) {
        activeModeLabelEl.innerText = modeNameMap[modeKey] || modeKey;
    }
    const activeModeIconEl = document.getElementById("active-mode-icon");
    if (activeModeIconEl && modeIconMap[modeKey]) {
        activeModeIconEl.innerHTML = modeIconMap[modeKey];
    }

    // Update Dropdown Item active highlights (Active Tab Accent is #2563eb / bg-blue-600)
    const modeItems = document.querySelectorAll(".drill-mode-item");
    modeItems.forEach(item => {
        const m = item.getAttribute("data-mode-val");
        if (m === modeKey) {
            item.classList.add("bg-blue-600/20", "border", "border-blue-500/40");
        } else {
            item.classList.remove("bg-blue-600/20", "border", "border-blue-500/40");
        }
    });

    // Close Dropdown menu cleanly
    const modeDropdown = document.getElementById("drill-mode-dropdown");
    const modeChevron = document.getElementById("icon-mode-chevron") || document.getElementById("drill-mode-chevron");
    const btnModeDropdown = document.getElementById("btn-drill-mode-dropdown");
    if (modeDropdown) modeDropdown.classList.add("hidden");
    if (modeChevron) modeChevron.classList.remove("rotate-180");
    if (btnModeDropdown) btnModeDropdown.setAttribute("aria-expanded", "false");
    const headerGroup = document.querySelector(".drill-header-group");
    if (headerGroup) {
        headerGroup.classList.remove("dropdown-open");
        headerGroup.style.zIndex = "";
    }

    // Update legacy pills if any exist for compatibility
    const pills = document.querySelectorAll(".drill-mode-pill");
    pills.forEach(pill => {
        const m = pill.getAttribute("data-game-mode");
        if (m === modeKey) {
            pill.classList.add("text-white", "font-extrabold");
            pill.classList.remove("text-gray-400");
        } else {
            pill.classList.remove("text-white", "font-extrabold");
            pill.classList.add("text-gray-400");
        }
    });

    // Reset drill session cleanly
    resetDrillSession();

    // Update Mode Status Badge in card header
    updateModeBadgeUI();

    if (typeof window.playSound === 'function') window.playSound('click');
}
window.setSpeedGameMode = setSpeedGameMode;

function updateModeBadgeUI() {
    const badge = document.getElementById("badge-mode-status");
    const selectLevel = document.getElementById("select-maths-level");
    if (!badge) return;

    // When drill is actively playing, hide the mode badge to avoid visual clutter
    if (drillIsPlaying) {
        badge.classList.add("hidden");
        return;
    }

    badge.classList.remove("hidden");
    badge.setAttribute("data-tooltip", "Active Game Mode • Click or press [M] to cycle");
    badge.style.cursor = "pointer";

    const baseBadgeClass = "inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full font-mono border cursor-pointer select-none shadow-sm transition whitespace-nowrap shrink-0";

    if (currentSpeedMode === SPEED_MODES.CLASSIC) {
        badge.className = `${baseBadgeClass} bg-blue-500/15 border-blue-500/30 text-blue-400 hover:bg-blue-500/25`;
        badge.innerHTML = `<i class="fa-solid fa-play text-[8px]"></i> <span>Classic</span>`;
        if (selectLevel) window.setDropdownVisible(selectLevel, !drillIsPlaying);
    } else if (currentSpeedMode === SPEED_MODES.BLITZ) {
        badge.className = `${baseBadgeClass} bg-cyan-500/15 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25`;
        badge.innerHTML = `<i class="fa-solid fa-stopwatch text-[8px]"></i> <span>Blitz (${blitzSecondsRemaining}s)</span>`;
    } else if (currentSpeedMode === SPEED_MODES.SUDDEN_DEATH) {
        badge.className = `${baseBadgeClass} bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-500/25`;
        badge.innerHTML = `<i class="fa-solid fa-skull text-[8px]"></i> <span>Sudden Death</span>`;
    } else if (currentSpeedMode === SPEED_MODES.LADDER) {
        badge.className = `${baseBadgeClass} bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25`;
        badge.innerHTML = `<i class="fa-solid fa-stairs text-[8px]"></i> <span>Ladder: ${ladderCurrentDifficulty.toUpperCase()}</span>`;
        if (selectLevel) selectLevel.value = ladderCurrentDifficulty;
    } else if (currentSpeedMode === SPEED_MODES.MIX) {
        badge.className = `${baseBadgeClass} bg-purple-500/15 border-purple-500/30 text-purple-300 hover:bg-purple-500/25`;
        badge.innerHTML = `<i class="fa-solid fa-shuffle text-[8px]"></i> <span>Mix Mode</span>`;
    } else if (currentSpeedMode === SPEED_MODES.WEAK_PRACTICE) {
        badge.className = `${baseBadgeClass} bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25`;
        badge.innerHTML = `<i class="fa-solid fa-bullseye text-[8px]"></i> <span>Weak Practice</span>`;
    }
}

function startBlitzCountdown() {
    clearInterval(blitzGlobalInterval);
    blitzSecondsRemaining = 60;
    updateModeBadgeUI();

    blitzGlobalInterval = setInterval(() => {
        blitzSecondsRemaining--;
        updateModeBadgeUI();

        if (blitzSecondsRemaining <= 0) {
            clearInterval(blitzGlobalInterval);
            finishBlitzSession();
        }
    }, 1000);
}

function finishBlitzSession() {
    clearInterval(drillTimerInterval);
    clearInterval(blitzGlobalInterval);
    drillIsPlaying = false;

    const correct = drillCorrect;
    const attempts = drillAttempts;
    const acc = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

    let prevPB = 0;
    const win = typeof window !== 'undefined' ? window : {};
    try {
        if (win.appState && win.appState.speedPersonalBests && win.appState.speedPersonalBests.blitz != null) {
            prevPB = Number(win.appState.speedPersonalBests.blitz);
        } else {
            prevPB = parseInt(localStorage.getItem('speed_blitz_pb') || '0', 10);
        }
    } catch (e) {}
    const isNewPB = correct > prevPB;
    if (isNewPB) {
        try { localStorage.setItem('speed_blitz_pb', String(correct)); } catch (e) {}
        if (!win.appState) win.appState = {};
        if (!win.appState.speedPersonalBests) win.appState.speedPersonalBests = { blitz: 0, suddenDeath: 0 };
        win.appState.speedPersonalBests.blitz = correct;
        if (typeof win.saveStateToStorage === 'function') win.saveStateToStorage();
    }
    updateSpeedPersonalBestsHUD();

    // Auto-fulfill Speed Drill Daily Ritual if not already fulfilled
    if (win.appState && win.appState.dailyRituals && !win.appState.dailyRituals.drill) {
        win.appState.dailyRituals.drill = true;
        if (typeof win.saveStateToStorage === 'function') win.saveStateToStorage();
        if (typeof win.updateTodayGoalsRatio === 'function') win.updateTodayGoalsRatio();
        if (typeof win.updateRitualProgress === 'function') win.updateRitualProgress();
        const cb = typeof document !== 'undefined' ? document.getElementById("ritual-drill") : null;
        if (cb) {
            cb.checked = true;
            if (typeof win.syncRitualVisual === 'function') win.syncRitualVisual(cb, true);
        }
    }

    if (isNewPB && window.triggerConfetti) {
        window.triggerConfetti();
    }

    if (window.rewardsSystem && typeof window.rewardsSystem.recordActivity === 'function') {
        window.rewardsSystem.recordActivity({
            type: 'speed',
            dedupKey: `blitz_60s_${Date.now()}`,
            minCooldown: 10000,
            title: `Blitz 60s (${correct} Correct • ${acc}%)`,
            xp: Math.max(20, correct * 10),
            coins: Math.max(5, Math.round(correct * 3)),
            stars: correct >= 15 ? 2 : 1
        });
    }

    if (window.playSound) {
        window.playSound(isNewPB || correct >= 10 ? 'achievement' : 'complete');
    }

    if (window.showCustomAlert) {
        window.showCustomAlert({
            title: isNewPB ? "🔥 NEW BLITZ PERSONAL BEST!" : "⏱️ BLITZ 60s COMPLETE",
            message: `Time's up! You conquered ${correct} questions in 60 seconds.`,
            detailsHtml: `
                <div class="grid grid-cols-2 gap-2 text-center">
                    <div class="p-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl">
                        <span class="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Correct</span>
                        <span class="text-xl text-emerald-400 font-black">${correct} / ${attempts}</span>
                    </div>
                    <div class="p-2.5 bg-cyan-500/10 border border-cyan-500/25 rounded-xl">
                        <span class="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Accuracy</span>
                        <span class="text-xl text-cyan-400 font-black">${acc}%</span>
                    </div>
                </div>
                <div class="text-center pt-2 text-xs font-mono ${isNewPB ? 'text-amber-300 font-bold' : 'text-gray-400'}">
                    ${isNewPB ? `🏆 New Record! Previous best was ${prevPB}` : `Personal Best: ${prevPB} correct`}
                </div>
            `,
            icon: "fa-stopwatch",
            type: "success",
            buttonText: "Awesome!"
        });
    }

    resetDrillSession();
}

function finishSuddenDeathSession(streak) {
    clearInterval(drillTimerInterval);
    drillIsPlaying = false;

    let prevRecord = 0;
    const win = typeof window !== 'undefined' ? window : {};
    try {
        if (win.appState && win.appState.speedPersonalBests && win.appState.speedPersonalBests.suddenDeath != null) {
            prevRecord = Number(win.appState.speedPersonalBests.suddenDeath);
        } else {
            prevRecord = parseInt(localStorage.getItem('speed_sudden_death_pb') || '0', 10);
        }
    } catch (e) {}
    const isNewRecord = streak > prevRecord;
    if (isNewRecord) {
        try { localStorage.setItem('speed_sudden_death_pb', String(streak)); } catch (e) {}
        if (!win.appState) win.appState = {};
        if (!win.appState.speedPersonalBests) win.appState.speedPersonalBests = { blitz: 0, suddenDeath: 0 };
        win.appState.speedPersonalBests.suddenDeath = streak;
        if (typeof win.saveStateToStorage === 'function') win.saveStateToStorage();
    }
    updateSpeedPersonalBestsHUD();

    // Auto-fulfill Speed Drill Daily Ritual if streak >= 5
    if (streak >= 5 && win.appState && win.appState.dailyRituals && !win.appState.dailyRituals.drill) {
        win.appState.dailyRituals.drill = true;
        if (typeof win.saveStateToStorage === 'function') win.saveStateToStorage();
        if (typeof win.updateTodayGoalsRatio === 'function') win.updateTodayGoalsRatio();
        if (typeof win.updateRitualProgress === 'function') win.updateRitualProgress();
        const cb = typeof document !== 'undefined' ? document.getElementById("ritual-drill") : null;
        if (cb) {
            cb.checked = true;
            if (typeof win.syncRitualVisual === 'function') win.syncRitualVisual(cb, true);
        }
    }

    if (window.playSound) {
        window.playSound('warning');
    }

    if (isNewRecord && window.triggerConfetti) {
        window.triggerConfetti();
    }

    if (window.rewardsSystem && typeof window.rewardsSystem.recordActivity === 'function') {
        window.rewardsSystem.recordActivity({
            type: 'speed',
            dedupKey: `sudden_death_${Date.now()}`,
            minCooldown: 10000,
            title: `Sudden Death (${streak} Streak)`,
            xp: Math.max(10, streak * 15),
            coins: Math.max(2, streak * 3),
            stars: streak >= 20 ? 3 : (streak >= 10 ? 2 : 0)
        });
    }

    if (window.showCustomAlert) {
        window.showCustomAlert({
            title: "💀 SUDDEN DEATH OVER",
            message: `One mistake ended the run! You survived ${streak} questions.`,
            detailsHtml: `
                <div class="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-center space-y-1">
                    <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Survival Streak</span>
                    <span class="text-2xl text-rose-400 font-black font-mono">${streak} 🔥</span>
                </div>
                <div class="text-center pt-2 text-xs font-mono ${isNewRecord ? 'text-amber-300 font-bold' : 'text-gray-400'}">
                    ${isNewRecord ? `🏆 New Survival Record! Previous was ${prevRecord}` : `Personal Best: ${prevRecord} streak`}
                </div>
            `,
            icon: "fa-skull",
            type: "warning",
            buttonText: "Try Again"
        });
    }

    resetDrillSession();
}

function updateSpeedPersonalBestsHUD() {
    if (typeof document === 'undefined') return;
    const blitzEl = document.getElementById("telemetry-blitz-pb");
    const suddenEl = document.getElementById("telemetry-survival-pb");

    const win = typeof window !== 'undefined' ? window : {};
    let blitzPB = '0';
    let suddenPB = '0';
    try {
        if (win.appState && win.appState.speedPersonalBests) {
            if (win.appState.speedPersonalBests.blitz != null) blitzPB = String(win.appState.speedPersonalBests.blitz);
            if (win.appState.speedPersonalBests.suddenDeath != null) suddenPB = String(win.appState.speedPersonalBests.suddenDeath);
        } else if (typeof localStorage !== 'undefined') {
            blitzPB = localStorage.getItem('speed_blitz_pb') || '0';
            suddenPB = localStorage.getItem('speed_sudden_death_pb') || '0';
        }
    } catch (e) {}

    if (blitzEl) blitzEl.innerText = `${blitzPB} pts`;
    if (suddenEl) suddenEl.innerText = `${suddenPB} streak`;
}
window.updateSpeedPersonalBestsHUD = updateSpeedPersonalBestsHUD;

// Math Options Generator (creates distractors)
function generateMathOptions(correct) {
    const options = new Set([String(correct)]);
    const correctStr = String(correct);

    // Detect answer type by content
    const isSingleAlpha = correctStr.length === 1 && correctStr >= "A" && correctStr <= "Z";
    const isTrigOrFrac = correctStr.includes("/") || correctStr.includes("√") || correctStr.includes("Not Defined")
        || correctStr.includes("θ") || correctStr.includes("sec") || correctStr.includes("cosec")
        || correctStr.includes("sin") || correctStr.includes("cos") || correctStr.includes("cot");
    const isPercentage = correctStr.includes("%");
    const isRatio = correctStr.includes(":");

    if (isSingleAlpha) {
        while (options.size < 4) {
            const charCode = correctStr.charCodeAt(0);
            const offset = Math.floor(Math.random() * 9) - 4;
            const dc = charCode + offset;
            if (dc >= 65 && dc <= 90 && dc !== charCode) options.add(String.fromCharCode(dc));
        }
    } else if (isTrigOrFrac) {
        // Rich pool of trig/fraction values using real Unicode √
        const pool = [
            "0", "1", "1/2", "1/3", "2/3", "1/4", "3/4", "1/5", "2/5", "3/5", "4/5",
            "1/6", "5/6", "1/7", "2/7", "3/7", "4/7", "5/7", "6/7",
            "1/8", "3/8", "5/8", "7/8", "1/9", "2/9", "4/9", "5/9", "7/9", "8/9",
            "1/10", "1/11", "2/11", "3/11", "4/11", "5/11", "6/11", "7/11", "8/11", "9/11", "10/11",
            "1/12", "5/12", "7/12", "11/12", "1/13", "1/14", "1/15", "1/16", "1/17", "1/18", "1/19",
            "1/20", "1/21", "1/22", "1/23", "1/24", "1/25", "1/40",
            "1/√2", "√2", "√3", "√3/2", "1/√3", "2/√3", "√5",
            "Not Defined", "sec²θ", "cosec²θ", "cot θ", "cos θ", "sin θ",
            "tan θ", "sec θ", "cosec θ"
        ];
        while (options.size < 4) {
            const rand = pool[Math.floor(Math.random() * pool.length)];
            if (rand !== correctStr) options.add(rand);
        }
    } else if (isPercentage) {
        const pool = [
            "2.5%", "4%", "4.17%", "4.35%", "4.55%", "4.76%", "5%", "5.26%", "5.56%", "5.88%",
            "6.25%", "6.67%", "7.14%", "7.69%", "8.33%", "9.09%", "10%", "11.11%", "12.5%",
            "14.28%", "16.67%", "18.18%", "20%", "22.22%", "25%", "27.27%", "28.57%", "30%",
            "33.33%", "36.36%", "37.5%", "40%", "41.67%", "42.85%", "44.44%", "45.45%", "50%",
            "54.54%", "55.56%", "57.14%", "58.33%", "60%", "62.5%", "63.63%", "66.67%", "70%",
            "71.42%", "72.72%", "75%", "77.78%", "80%", "81.81%", "83.33%", "85.71%", "87.5%",
            "88.89%", "90.90%", "91.67%"
        ];
        while (options.size < 4) {
            const rand = pool[Math.floor(Math.random() * pool.length)];
            if (rand !== correctStr) options.add(rand);
        }
    } else if (isRatio) {
        const pool = ["2:1", "1:2", "3:1", "1:1", "2:3", "3:2", "1:3", "4:1", "1:4"];
        while (options.size < 4) {
            const rand = pool[Math.floor(Math.random() * pool.length)];
            if (rand !== correctStr) options.add(rand);
        }
    } else {
        // Numeric answer — generate close distractors relative to magnitude
        const num = parseFloat(correctStr);
        const magnitude = Math.max(1, Math.abs(num));
        const tried = new Set();
        let safetyValve = 0;
        while (options.size < 4 && safetyValve < 200) {
            safetyValve++;
            const pctOffsets = [-0.05, -0.1, -0.15, 0.05, 0.1, 0.15, -0.2, 0.2, -0.3, 0.3];
            const smallOffsets = [-3, -2, -1, 1, 2, 3, -5, 5, -10, 10];
            let distractor;
            if (magnitude > 100) {
                const pct = pctOffsets[Math.floor(Math.random() * pctOffsets.length)];
                distractor = Math.round(num + num * pct);
            } else {
                distractor = num + smallOffsets[Math.floor(Math.random() * smallOffsets.length)];
            }
            const key = String(distractor);
            if (distractor !== num && distractor > 0 && !tried.has(key)) {
                tried.add(key);
                options.add(key);
            }
        }
    }
    return Array.from(options).slice(0, 4).sort(() => Math.random() - 0.5);
}

// Adaptive Candidate Selector based on Daily Weakness & Familiarity
function selectAdaptiveValue(mode, level, candidates, targetKeyExtractor) {
    if (!Array.isArray(candidates) || candidates.length === 0) return null;
    
    // If user explicitly clicked a heatmap cell to focus:
    if (currentTargetValue !== null && currentTargetValue !== undefined) {
        const matched = candidates.find(c => String(targetKeyExtractor(c)) === String(currentTargetValue));
        if (matched) return matched;
    }

    // If Hesitant Fact Targeting is active, prefer hesitant candidates in current pool:
    if (typeof isHesitantTargetMode !== 'undefined' && isHesitantTargetMode) {
        const hesitantKeys = MicroFrequencyHeatmap.getHesitantKeys(mode);
        if (hesitantKeys && hesitantKeys.length > 0) {
            const hesitantCandidates = candidates.filter(c => hesitantKeys.includes(String(targetKeyExtractor(c))));
            if (hesitantCandidates.length > 0) {
                return hesitantCandidates[Math.floor(Math.random() * hesitantCandidates.length)];
            }
        }
    }

    // Weakness & familiarity weighted random selection
    const records = MicroFrequencyHeatmap.getDailyStore();
    const weights = candidates.map(item => {
        const key = `${mode}:${targetKeyExtractor(item)}`;
        const rec = records[key];
        let weight = 1.0;
        if (rec && rec.attempts > 0) {
            const errorRate = rec.wrong / rec.attempts;
            const avgTimeSec = rec.totalTimeMs / (rec.attempts * 1000);
            
            // Boost weak / slow facts
            weight += (errorRate * 3.0);
            if (avgTimeSec > 2.5) weight += 1.5;
            
            // Familiarity dampening for mastered facts
            if (rec.correct > 15 && rec.wrong === 0) {
                weight = Math.max(0.35, weight * 0.5);
            }
        }
        return weight;
    });

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let rand = Math.random() * totalWeight;
    for (let i = 0; i < candidates.length; i++) {
        if (rand < weights[i]) {
            return candidates[i];
        }
        rand -= weights[i];
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
}

// Core Math Drills Question & Answer Generator
function generateQuestionTextAndAnswer(mode, level) {
    let questionText = "";
    let answer = "";
    let targetKey = null;

    const isWeakPracticeMode = currentSpeedMode === SPEED_MODES.WEAK_PRACTICE;
    const weakKeys = isWeakPracticeMode ? MicroFrequencyHeatmap.getWeakKeys(mode) : [];

    if (mode === "squares") {
        let min = 11, max = 20;
        if (level === "medium") { min = 21; max = 30; }
        else if (level === "advance") { min = 31; max = 40; }
        
        let num;
        if (currentTargetValue !== null && currentTargetValue !== undefined && !isNaN(parseInt(currentTargetValue, 10))) {
            num = parseInt(currentTargetValue, 10);
        } else if (isWeakPracticeMode && weakKeys.length > 0) {
            const wk = weakKeys[Math.floor(Math.random() * weakKeys.length)];
            num = parseInt(wk, 10) || (Math.floor(Math.random() * (max - min + 1)) + min);
        } else {
            const nums = Array.from({ length: max - min + 1 }, (_, idx) => min + idx);
            const selectedNum = selectAdaptiveValue("squares", level, nums, n => n);
            num = selectedNum || (Math.floor(Math.random() * (max - min + 1)) + min);
        }
        targetKey = String(num);
        questionText = `${num}² = ?`;
        answer = String(num * num);

    } else if (mode === "cubes") {
        let min = 5, max = 12;
        if (level === "medium") { min = 13; max = 20; }
        else if (level === "advance") { min = 21; max = 30; }
        
        let num;
        if (currentTargetValue !== null && currentTargetValue !== undefined && !isNaN(parseInt(currentTargetValue, 10))) {
            num = parseInt(currentTargetValue, 10);
        } else if (isWeakPracticeMode && weakKeys.length > 0) {
            const wk = weakKeys[Math.floor(Math.random() * weakKeys.length)];
            num = parseInt(wk, 10) || (Math.floor(Math.random() * (max - min + 1)) + min);
        } else {
            const nums = Array.from({ length: max - min + 1 }, (_, idx) => min + idx);
            const selectedNum = selectAdaptiveValue("cubes", level, nums, n => n);
            num = selectedNum || (Math.floor(Math.random() * (max - min + 1)) + min);
        }
        targetKey = String(num);
        questionText = `${num}³ = ?`;
        answer = String(num * num * num);

    } else if (mode === "tables") {
        let n1Min = 11, n1Max = 20, n2Min = 1, n2Max = 10;
        if (level === "medium") { n1Min = 21; n1Max = 35; }
        else if (level === "advance") { n1Min = 36; n1Max = 50; n2Max = 12; }
        
        let n1;
        if (currentTargetValue !== null && currentTargetValue !== undefined && !isNaN(parseInt(currentTargetValue, 10))) {
            n1 = parseInt(currentTargetValue, 10);
        } else if (isWeakPracticeMode && weakKeys.length > 0) {
            const wk = weakKeys[Math.floor(Math.random() * weakKeys.length)];
            n1 = parseInt(wk, 10) || (Math.floor(Math.random() * (n1Max - n1Min + 1)) + n1Min);
        } else {
            const tableBases = Array.from({ length: n1Max - n1Min + 1 }, (_, idx) => n1Min + idx);
            const selectedTable = selectAdaptiveValue("tables", level, tableBases, n => n);
            n1 = selectedTable || (Math.floor(Math.random() * (n1Max - n1Min + 1)) + n1Min);
        }
        const n2 = Math.floor(Math.random() * (n2Max - n2Min + 1)) + n2Min;
        targetKey = String(n1);
        questionText = `${n1} × ${n2} = ?`;
        answer = String(n1 * n2);

    } else if (mode === "fracPerc") {
        // Full reference matrix transcribed from 1000015976.png
        const fracPercMatrix = [
            // Easy
            { f: "1/3",  p: "33.33%" }, { f: "2/3",  p: "66.67%" },
            { f: "1/4",  p: "25%" },    { f: "3/4",  p: "75%" },
            { f: "1/5",  p: "20%" },    { f: "2/5",  p: "40%" },   { f: "3/5",  p: "60%" }, { f: "4/5",  p: "80%" },
            { f: "1/6",  p: "16.67%" }, { f: "5/6",  p: "83.33%" },
            { f: "1/8",  p: "12.5%" },  { f: "3/8",  p: "37.5%" },  { f: "5/8",  p: "62.5%" }, { f: "7/8",  p: "87.5%" },
            { f: "1/10", p: "10%" },

            // Medium (7, 9, 11, 12 sets)
            { f: "1/7",  p: "14.28%" }, { f: "2/7",  p: "28.57%" }, { f: "3/7",  p: "42.85%" }, { f: "4/7",  p: "57.14%" },
            { f: "5/7",  p: "71.42%" }, { f: "6/7",  p: "85.71%" },
            { f: "1/9",  p: "11.11%" }, { f: "2/9",  p: "22.22%" }, { f: "4/9",  p: "44.44%" }, { f: "5/9",  p: "55.56%" },
            { f: "7/9",  p: "77.78%" }, { f: "8/9",  p: "88.89%" },
            { f: "1/11", p: "9.09%" },  { f: "2/11", p: "18.18%" }, { f: "3/11", p: "27.27%" }, { f: "4/11", p: "36.36%" },
            { f: "5/11", p: "45.45%" }, { f: "6/11", p: "54.54%" }, { f: "7/11", p: "63.63%" }, { f: "8/11", p: "72.72%" },
            { f: "9/11", p: "81.81%" }, { f: "10/11",p: "90.90%" },
            { f: "1/12", p: "8.33%" },  { f: "5/12", p: "41.67%" }, { f: "7/12", p: "58.33%" }, { f: "11/12",p: "91.67%" },

            // Advance (13 to 40)
            { f: "1/13", p: "7.69%" },  { f: "1/14", p: "7.14%" },  { f: "1/15", p: "6.67%" },  { f: "1/16", p: "6.25%" },
            { f: "1/17", p: "5.88%" },  { f: "1/18", p: "5.56%" },  { f: "1/19", p: "5.26%" },  { f: "1/20", p: "5%" },
            { f: "1/21", p: "4.76%" },  { f: "1/22", p: "4.55%" },  { f: "1/23", p: "4.35%" },  { f: "1/24", p: "4.17%" },
            { f: "1/25", p: "4%" },     { f: "1/40", p: "2.5%" }
        ];

        let pool;
        if (level === "easy") pool = fracPercMatrix.slice(0, 15);
        else if (level === "medium") pool = fracPercMatrix.slice(15, 37);
        else pool = fracPercMatrix.slice(37);

        let item;
        if (currentTargetValue !== null && currentTargetValue !== undefined) {
            item = fracPercMatrix.find(p => p.f === String(currentTargetValue)) || pool[0];
        } else if (isWeakPracticeMode && weakKeys.length > 0) {
            const wk = weakKeys[Math.floor(Math.random() * weakKeys.length)];
            item = fracPercMatrix.find(p => p.f === wk) || pool[Math.floor(Math.random() * pool.length)];
        } else {
            const selectedItem = selectAdaptiveValue("fracPerc", level, pool, p => p.f);
            item = selectedItem || pool[Math.floor(Math.random() * pool.length)];
        }
        targetKey = item.f;

        // Short punchy format
        if (Math.random() < 0.5) {
            questionText = `${item.f} = ?`;
            answer = item.p;
        } else {
            questionText = `${item.p} = ?`;
            answer = item.f;
        }

    } else if (mode === "triplets") {
        const baseTriplets = [
            [3,4,5], [5,12,13], [8,15,17], [7,24,25], [9,40,41],
            [11,60,61], [12,35,37], [20,21,29], [28,45,53], [33,56,65],
            [16,63,65], [48,55,73]
        ];
        let base;
        if (currentTargetValue !== null && currentTargetValue !== undefined) {
            base = baseTriplets.find(t => t.join('-') === String(currentTargetValue)) || baseTriplets[0];
        } else if (isWeakPracticeMode && weakKeys.length > 0) {
            const wk = weakKeys[Math.floor(Math.random() * weakKeys.length)];
            base = baseTriplets.find(t => t.join('-') === wk) || baseTriplets[Math.floor(Math.random() * baseTriplets.length)];
        } else {
            const selectedBase = selectAdaptiveValue("triplets", level, baseTriplets, trip => trip.join("-"));
            base = selectedBase || baseTriplets[Math.floor(Math.random() * baseTriplets.length)];
        }
        targetKey = base.join("-");
        let mult = 1;
        if (level === "medium") mult = Math.floor(Math.random() * 2) + 2;
        else if (level === "advance") mult = Math.floor(Math.random() * 3) + 4;
        const trip = base.map(v => v * mult);
        const blankIdx = Math.floor(Math.random() * 3);
        answer = String(trip[blankIdx]);
        const display = trip.map((v, i) => i === blankIdx ? "?" : v);
        questionText = `△: ${display.join(", ")}`;

    } else if (mode === "algebra") {
        const a = Math.floor(Math.random() * 8) + 3;
        const b = Math.floor(Math.random() * 4) + 1;
        let types;
        if (level === "easy")         types = [0, 1, 2];
        else if (level === "medium")  types = [2, 3, 4];
        else                          types = [3, 4, 5, 6, 7];
        
        const typeKeys = ['a+b', 'a-b', 'ab', 'a2-b2', 'a2+b2', 'a-b_sq', 'a+b_sq', 'a3-b3'];
        let type;
        if (currentTargetValue !== null && currentTargetValue !== undefined && typeKeys.includes(String(currentTargetValue))) {
            type = typeKeys.indexOf(String(currentTargetValue));
        } else if (isWeakPracticeMode && weakKeys.length > 0) {
            const wk = weakKeys[Math.floor(Math.random() * weakKeys.length)];
            const idx = typeKeys.indexOf(wk);
            type = idx !== -1 ? idx : types[Math.floor(Math.random() * types.length)];
        } else {
            type = types[Math.floor(Math.random() * types.length)];
        }

        targetKey = typeKeys[type] || 'a+b';
        if (type === 0) { questionText = `a=${a}, b=${b} ➔ a+b = ?`; answer = String(a + b); }
        else if (type === 1) { questionText = `a=${a}, b=${b} ➔ a-b = ?`; answer = String(a - b); }
        else if (type === 2) { questionText = `a=${a}, b=${b} ➔ a×b = ?`; answer = String(a * b); }
        else if (type === 3) { questionText = `a=${a}, b=${b} ➔ a²-b² = ?`; answer = String(a*a - b*b); }
        else if (type === 4) { questionText = `a=${a}, b=${b} ➔ a²+b² = ?`; answer = String(a*a + b*b); }
        else if (type === 5) { questionText = `a=${a}, b=${b} ➔ (a-b)² = ?`; answer = String((a-b)*(a-b)); }
        else if (type === 6) { questionText = `a=${a}, b=${b} ➔ (a+b)² = ?`; answer = String((a+b)*(a+b)); }
        else                 { questionText = `a=${a}, b=${b} ➔ a³-b³ = ?`; answer = String(a*a*a - b*b*b); }

    } else if (mode === "lcm") {
        const list = [
            // Easy
            { id: '2-3-4', n:[2,3,4], a:12 }, { id: '3-4-6', n:[3,4,6], a:12 },
            { id: '4-6-8', n:[4,6,8], a:24 }, { id: '3-6-9', n:[3,6,9], a:18 },
            // Medium
            { id: '5-10-15', n:[5,10,15], a:30 }, { id: '6-9-12', n:[6,9,12], a:36 },
            { id: '8-12-16', n:[8,12,16], a:48 }, { id: '10-12-15', n:[10,12,15], a:60 },
            { id: '12-15-20', n:[12,15,20], a:60 },
            // Advance
            { id: '8-12-15', n:[8,12,15], a:120 }, { id: '12-16-24', n:[12,16,24], a:48 },
            { id: '18-24-36', n:[18,24,36], a:72 }
        ];
        let pool;
        if (level === "easy")    pool = list.slice(0, 4);
        else if (level === "medium") pool = list.slice(4, 9);
        else                     pool = list.slice(9);

        let item;
        if (currentTargetValue !== null && currentTargetValue !== undefined) {
            item = list.find(l => l.id === String(currentTargetValue)) || pool[0];
        } else if (isWeakPracticeMode && weakKeys.length > 0) {
            const wk = weakKeys[Math.floor(Math.random() * weakKeys.length)];
            item = list.find(l => l.id === wk) || pool[Math.floor(Math.random() * pool.length)];
        } else {
            item = pool[Math.floor(Math.random() * pool.length)];
        }
        targetKey = item.id;
        const shuffled = [...item.n].sort(() => Math.random() - 0.5);
        questionText = `LCM(${shuffled.join(", ")}) = ?`;
        answer = String(item.a);

    } else if (mode === "hcf") {
        const factorList = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20];
        let pool;
        if (level === "easy") pool = [2, 3, 4, 5];
        else if (level === "medium") pool = [6, 7, 8, 9, 10];
        else pool = [12, 15, 20];

        let f;
        if (currentTargetValue !== null && currentTargetValue !== undefined && !isNaN(parseInt(currentTargetValue, 10))) {
            f = parseInt(currentTargetValue, 10);
        } else if (isWeakPracticeMode && weakKeys.length > 0) {
            const wk = weakKeys[Math.floor(Math.random() * weakKeys.length)];
            f = parseInt(wk, 10) || pool[Math.floor(Math.random() * pool.length)];
        } else {
            f = pool[Math.floor(Math.random() * pool.length)];
        }
        targetKey = String(f);
        const multiplierSets = [
            [2,3,5], [2,5,7], [3,4,5], [3,5,7], [2,3,7], [4,5,7],
            [2,3,11],[3,4,7],[5,6,7],[2,7,9],[4,5,9],[3,7,8]
        ];
        const mults = multiplierSets[Math.floor(Math.random() * multiplierSets.length)];
        questionText = `HCF(${f*mults[0]}, ${f*mults[1]}, ${f*mults[2]}) = ?`;
        answer = String(f);

    } else if (mode === "alphabets") {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let types;
        if (level === "easy")        types = [0];
        else if (level === "medium") types = [0, 1];
        else                         types = [0, 1, 2];
        const type = types[Math.floor(Math.random() * types.length)];
        let pool;
        if (level === "easy")        pool = "ABCDEFGHIJ";
        else if (level === "medium") pool = "KLMNOPQRST";
        else                         pool = letters;

        let chosenChar;
        if (currentTargetValue !== null && currentTargetValue !== undefined && /^[A-Za-z]$/.test(String(currentTargetValue))) {
            chosenChar = String(currentTargetValue).toUpperCase();
        } else if (isWeakPracticeMode && weakKeys.length > 0) {
            chosenChar = weakKeys[Math.floor(Math.random() * weakKeys.length)] || pool[Math.floor(Math.random() * pool.length)];
        } else {
            chosenChar = pool[Math.floor(Math.random() * pool.length)];
        }
        targetKey = chosenChar;
        const pos = chosenChar.charCodeAt(0) - 64;

        if (type === 0) { questionText = `Letter '${chosenChar}' = ?`; answer = String(pos); }
        else if (type === 1) { questionText = `Rev '${chosenChar}' (A=26) = ?`; answer = String(27 - pos); }
        else { questionText = `Opposite '${chosenChar}' = ?`; answer = String.fromCharCode(155 - chosenChar.charCodeAt(0)); }

    } else if (mode === "geomCenters") {
        const geomList = [
            { id: 'incenter', type: 0 },
            { id: 'orthocenter', type: 1 },
            { id: 'circumcenter', type: 2 },
            { id: 'inradius', type: 3 },
            { id: 'circumradius', type: 4 },
            { id: 'centroid', type: 5 }
        ];
        let types;
        if (level === "easy")        types = [0, 1, 5];
        else if (level === "medium") types = [0, 1, 2, 5];
        else                         types = [0, 1, 2, 3, 4, 5];

        let chosen;
        if (isWeakPracticeMode && weakKeys.length > 0) {
            const wk = weakKeys[Math.floor(Math.random() * weakKeys.length)];
            chosen = geomList.find(g => g.id === wk) || { id: 'incenter', type: types[0] };
        } else {
            const t = types[Math.floor(Math.random() * types.length)];
            chosen = geomList.find(g => g.type === t) || geomList[0];
        }
        targetKey = chosen.id;

        if (chosen.type === 0) {
            const a = (Math.floor(Math.random() * 9) + 4) * 10;
            questionText = `Incenter ∠A=${a}° ➔ ∠BIC = ?`;
            answer = String(90 + a / 2);
        } else if (chosen.type === 1) {
            const a = (Math.floor(Math.random() * 10) + 4) * 10;
            questionText = `Orthocenter ∠A=${a}° ➔ ∠BOC = ?`;
            answer = String(180 - a);
        } else if (chosen.type === 2) {
            const a = (Math.floor(Math.random() * 6) + 3) * 10;
            questionText = `Circumcenter ∠A=${a}° ➔ ∠BOC = ?`;
            answer = String(2 * a);
        } else if (chosen.type === 3) {
            const triplets = [[3,4,5],[5,12,13],[8,15,17],[6,8,10],[9,12,15]];
            const rip = triplets[Math.floor(Math.random() * triplets.length)];
            questionText = `Right △ (${rip[0]},${rip[1]},${rip[2]}) ➔ Inradius = ?`;
            answer = String((rip[0] + rip[1] - rip[2]) / 2);
        } else if (chosen.type === 4) {
            const triplets = [[3,4,5],[5,12,13],[8,15,17],[6,8,10],[10,24,26]];
            const rip = triplets[Math.floor(Math.random() * triplets.length)];
            questionText = `Right △ (Hypotenuse ${rip[2]}) ➔ Circumradius = ?`;
            answer = String(rip[2] / 2);
        } else {
            questionText = `Centroid G ➔ AG:GD = ?`;
            answer = "2:1";
        }

    } else if (mode === "trigReflex") {
        const trigItems = [
            { id: "sin30",  q:"sin(30°)",   a:"1/2" },
            { id: "sin45",  q:"sin(45°)",   a:"1/√2" },
            { id: "sin60",  q:"sin(60°)",   a:"√3/2" },
            { id: "cos30",  q:"cos(30°)",   a:"√3/2" },
            { id: "cos60",  q:"cos(60°)",   a:"1/2" },
            { id: "tan30",  q:"tan(30°)",   a:"1/√3" },
            { id: "tan45",  q:"tan(45°)",   a:"1" },
            { id: "tan60",  q:"tan(60°)",   a:"√3" },
            { id: "cot30",  q:"cot(30°)",   a:"√3" },
            { id: "sec45",  q:"sec(45°)",   a:"√2" },
            { id: "cosec45",q:"cosec(45°)", a:"√2" },
            { id: "pyth_id",q:"sin²θ + cos²θ", a:"1" },
            { id: "sec_tan",q:"sec²θ - tan²θ", a:"1" },
            { id: "csc_cot",q:"cosec²θ - cot²θ", a:"1" },
            { id: "tan_comp",q:"tan(90° - θ)", a:"cot θ" }
        ];

        let item;
        if (isWeakPracticeMode && weakKeys.length > 0) {
            const wk = weakKeys[Math.floor(Math.random() * weakKeys.length)];
            item = trigItems.find(t => t.id === wk) || trigItems[Math.floor(Math.random() * trigItems.length)];
        } else {
            item = trigItems[Math.floor(Math.random() * trigItems.length)];
        }
        targetKey = item.id;
        questionText = `${item.q} = ?`;
        answer = item.a;
    }
    return { q: questionText, a: answer, targetKey: targetKey };
}

// Generate active question for inline speed drills
function generateDrillQuestion() {
    if (isChallengeActive) {
        generateChallengeQuestion();
        return;
    }

    const qLabel = document.getElementById("drill-question-label");
    if (!qLabel) return;

    if (!drillIsPlaying) {
        qLabel.innerText = "Select a mode & press Start";
        const optionsGrid = document.getElementById("drill-options");
        if (optionsGrid) optionsGrid.classList.add("hidden");
        const directContainer = document.getElementById("drill-direct-container");
        if (directContainer) directContainer.classList.add("hidden");
        return;
    }

    // Toggle Difficulty Dropdown VS Close button in header & hide mode badge during play
    const selectLevel = document.getElementById("select-maths-level");
    if (selectLevel) window.setDropdownVisible(selectLevel, false);
    const stopBtn = document.getElementById("btn-drill-stop");
    if (stopBtn) stopBtn.classList.remove("hidden");
    updateModeBadgeUI();

    // Activate Blackout Focus Mode
    if (typeof document !== 'undefined') {
        if (document.documentElement) document.documentElement.classList.add("quiz-focus-active");
        if (document.body) document.body.classList.add("quiz-focus-active");
    }

    // Speed Game Modes Logic (Phase 5)
    let activeCategory = drillMode;
    if (currentSpeedMode === SPEED_MODES.MIX) {
        activeCategory = MIX_CATEGORIES[Math.floor(Math.random() * MIX_CATEGORIES.length)];
        currentMixCategory = activeCategory;
    }

    let level = selectLevel ? selectLevel.value : "medium";
    if (currentSpeedMode === SPEED_MODES.LADDER) {
        level = ladderCurrentDifficulty;
        if (selectLevel) selectLevel.value = ladderCurrentDifficulty;
    }

    // Start Blitz 60s global countdown on first question
    if (currentSpeedMode === SPEED_MODES.BLITZ && !blitzGlobalInterval) {
        startBlitzCountdown();
    }
    updateModeBadgeUI();

    // Ghost Loop turn counter & retrieval check
    currentDrillSessionTurn++;
    isCurrentQuestionRecovery = false;
    let qData = null;

    const dueGhostIdx = ghostRecoveryQueue.findIndex(g => g.dueTurn <= currentDrillSessionTurn);
    if (dueGhostIdx !== -1) {
        const ghostItem = ghostRecoveryQueue.splice(dueGhostIdx, 1)[0];
        qData = ghostItem.qData;
        isCurrentQuestionRecovery = true;
    } else {
        qData = generateQuestionTextAndAnswer(activeCategory, level);
    }

    currentQuestionData = qData;
    drillAnswerVal = qData.a;
    currentQuestionTargetKey = qData.targetKey || null;
    currentQuestionStartTime = Date.now();

    if (isCurrentQuestionRecovery) {
        qLabel.innerHTML = `
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 mb-2 animate-pulse">
                <i class="fa-solid fa-ghost text-xs"></i> <span>Ghost Recovery Re-test</span>
            </div>
            <div class="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">${qData.q}</div>
        `;
    } else {
        qLabel.innerText = qData.q;
    }

    // Restore plain hot streak representation in clean green
    const feedback = document.getElementById("drill-feedback");
    if (feedback) {
        feedback.innerText = `Streak: ${drillStreak} 🔥`;
        feedback.className = "text-xs font-semibold text-accentGreen";
    }

    // Dual Input Presentation
    const optionsGrid = document.getElementById("drill-options");
    const directContainer = document.getElementById("drill-direct-container");
    const directInput = document.getElementById("drill-direct-input");
    const directCorrection = document.getElementById("drill-direct-correction");

    if (currentDrillInputMethod === 'direct') {
        if (optionsGrid) optionsGrid.classList.add("hidden");
        if (directContainer) {
            directContainer.classList.remove("hidden");
            if (directCorrection) directCorrection.classList.add("hidden");
            if (directInput) {
                directInput.value = "";
                directInput.disabled = false;
                directInput.className = "w-full text-center text-3xl sm:text-4xl font-mono font-black py-3 px-4 rounded-2xl bg-black/40 border-2 border-white/20 text-white placeholder-gray-600 focus:outline-none focus:border-accentCyan focus:ring-4 focus:ring-cyan-500/20 transition duration-150 tracking-widest shadow-inner";
                directInput.focus();
            }
        }
    } else {
        if (directContainer) directContainer.classList.add("hidden");
        if (optionsGrid) {
            optionsGrid.innerHTML = "";
            optionsGrid.classList.remove("hidden");
            
            const choices = generateMathOptions(qData.a);
            let optIdx = 1;
            choices.forEach(val => {
                const btn = document.createElement("button");
                btn.className = "math-opt-btn relative group p-4 rounded-xl border border-white/5 bg-white/2px hover:bg-cyan-500/10 hover:border-accentCyan transition text-sm font-bold text-gray-200 flex items-center justify-center cursor-pointer";
                btn.setAttribute("data-val", String(val));

                const badge = document.createElement("span");
                badge.className = "absolute top-2 left-2.5 text-[10px] font-bold text-gray-500 font-mono group-hover:text-cyan-400 transition pointer-events-none select-none";
                badge.innerText = String(optIdx++);

                const textSpan = document.createElement("span");
                textSpan.innerText = val;

                btn.appendChild(badge);
                btn.appendChild(textSpan);
                btn.onclick = () => checkDrillAnswer(val, 'mcq');
                optionsGrid.appendChild(btn);
            });
        }
    }

    // Trigger Voice Reflex listening if active (Phase 6)
    if (isVoiceReflexActive) {
        listenForVoiceAnswer();
    }

    clearInterval(drillTimerInterval);
    let maxSeconds = 7;
    if (level === "easy") maxSeconds = 10;
    else if (level === "advance") maxSeconds = 5;
    
    drillTimerSecs = maxSeconds;
    const fill = document.getElementById("drill-timer-fill");
    if (fill) {
        fill.style.width = "100%";
        fill.style.backgroundColor = "#10b981";
        fill.style.transition = "width 1s linear, background-color 0.5s ease";
    }

    drillTimerInterval = setInterval(() => {
        drillTimerSecs--;
        const pct = (drillTimerSecs / maxSeconds) * 100;
        if (fill) {
            fill.style.width = `${pct}%`;
            if (pct > 50) {
                fill.style.backgroundColor = "#10b981"; // Emerald (100% to 50%)
            } else if (pct > 25) {
                fill.style.backgroundColor = "#f59e0b"; // Amber (50% to 25%)
            } else {
                fill.style.backgroundColor = "#ef4444"; // Warning Red (< 25%)
            }
        }

        if (drillTimerSecs <= 0) {
            clearInterval(drillTimerInterval);
            drillAttempts++;
            drillStreak = 0;
            updateStreakAura(0);
            consecutiveTimeoutsCount++;
            
            // Record timeout to MicroFrequencyHeatmap telemetry
            if (currentQuestionTargetKey) {
                MicroFrequencyHeatmap.recordAttempt(activeCategory, currentQuestionTargetKey, false, maxSeconds * 1000);
            }

            // Enqueue into Ghost Loop if not already recovery turn
            if (!isCurrentQuestionRecovery && currentQuestionData) {
                ghostRecoveryQueue.push({
                    qData: currentQuestionData,
                    dueTurn: currentDrillSessionTurn + 3,
                    originalLatency: maxSeconds * 1000
                });
            }

            if (typeof window.playSound === 'function') {
                window.playSound('warning');
            }

            // Sudden Death timeout immediately terminates session
            if (currentSpeedMode === SPEED_MODES.SUDDEN_DEATH) {
                finishSuddenDeathSession(0);
                return;
            }

            // Ladder timeout steps difficulty down
            if (currentSpeedMode === SPEED_MODES.LADDER) {
                if (ladderCurrentDifficulty === 'advance') ladderCurrentDifficulty = 'medium';
                else if (ladderCurrentDifficulty === 'medium') ladderCurrentDifficulty = 'easy';
                updateModeBadgeUI();
            }

            const scoreEl = document.getElementById("drill-score");

            if (feedback) {
                feedback.innerText = "Timeout! Answer was " + drillAnswerVal + " ❌";
                feedback.className = "text-xs font-semibold text-accentRose";
            }
            if (scoreEl) scoreEl.innerText = `Score: ${drillCorrect}/${drillAttempts}`;
            
            const buttons = document.querySelectorAll("#drill-options button");
            buttons.forEach(b => {
                b.disabled = true;
                const val = b.getAttribute("data-val") || b.innerText.trim();
                if (val === String(drillAnswerVal)) {
                    b.className = b.className.replace("border-white/5", "border-accentGreen bg-accentGreen/15 text-accentGreen");
                }
            });

            // Direct input timeout feedback
            const directInputEl = document.getElementById("drill-direct-input");
            const correctionEl = document.getElementById("drill-direct-correction");
            const wrongValEl = document.getElementById("drill-direct-wrong-val");
            const correctValSpan = document.querySelector("#drill-direct-correct-val span");
            if (directInputEl && currentDrillInputMethod === 'direct') {
                directInputEl.disabled = true;
                directInputEl.className = "w-full text-center text-3xl sm:text-4xl font-mono font-black py-3 px-4 rounded-2xl border-2 border-rose-500 bg-rose-950/40 text-rose-300 transition duration-150 tracking-widest shadow-inner";
                if (correctionEl && wrongValEl && correctValSpan) {
                    wrongValEl.innerText = "Timeout";
                    correctValSpan.innerText = String(drillAnswerVal);
                    correctionEl.classList.remove("hidden");
                }
            }

            speakText("Time out");

            if (consecutiveTimeoutsCount >= 2) {
                setTimeout(() => {
                    resetDrillSession();
                    if (typeof showToast === "function") {
                        showToast("Drill auto-stopped due to inactivity (2 consecutive missed questions)", "warning");
                    }
                    speakText("Drill auto stopped due to inactivity");
                }, 1200);
                return;
            }

            const nextTimeoutDelay = currentSpeedMode === SPEED_MODES.BLITZ ? 600 : 1500;
            setTimeout(generateDrillQuestion, nextTimeoutDelay);
        }
    }, 1000);
}

// Check inline question answers
function checkDrillAnswer(chosenVal, inputMethod = currentDrillInputMethod) {
    clearInterval(drillTimerInterval);
    drillAttempts++;
    consecutiveTimeoutsCount = 0;

    const responseTimeMs = currentQuestionStartTime > 0 ? (Date.now() - currentQuestionStartTime) : 1000;
    const isCorrect = String(chosenVal).trim().toLowerCase() === String(drillAnswerVal).trim().toLowerCase();

    // Record attempt to MicroFrequencyHeatmap
    if (currentQuestionTargetKey) {
        MicroFrequencyHeatmap.recordAttempt(drillMode, currentQuestionTargetKey, isCorrect, responseTimeMs);
    }

    const feedback = document.getElementById("drill-feedback");
    const scoreEl = document.getElementById("drill-score");
    const buttons = document.querySelectorAll("#drill-options button");

    buttons.forEach(b => {
        b.disabled = true;
        const val = b.getAttribute("data-val") || b.innerText.trim();
        if (val === String(drillAnswerVal)) {
            b.className = b.className.replace("border-white/5", "border-accentGreen bg-accentGreen/15 text-accentGreen");
            if (window.gsap) {
                gsap.fromTo(b, { scale: 0.94 }, { scale: 1.06, duration: 0.3, ease: "elastic.out(1, 0.6)" });
            }
        } else if (val === String(chosenVal)) {
            b.className = b.className.replace("border-white/5", "border-accentRose bg-accentRose/15 text-accentRose");
            if (window.gsap) {
                gsap.fromTo(b, { x: -6 }, { x: 0, duration: 0.35, ease: "elastic.out(1.5, 0.4)" });
            }
        }
    });

    let resultType = isCorrect ? 'correct' : 'wrong';

    if (isCorrect) {
        drillCorrect++;
        drillStreak++;
        updateStreakAura(drillStreak);

        if (isCurrentQuestionRecovery) {
            resultType = 'recovered';
            if (feedback) {
                feedback.innerText = `Recovered! 👻 Streak: ${drillStreak} 🔥`;
                feedback.className = "text-xs font-semibold text-purple-400";
            }
            showDrillHudFeedback("GHOST FACT RECOVERED! 👻", '<i class="fa-solid fa-ghost text-purple-400"></i>');
        } else {
            if (feedback) {
                feedback.innerText = `Correct! Streak: ${drillStreak} 🔥`;
                feedback.className = "text-xs font-semibold text-accentGreen";
            }
        }

        // Milestone achievements
        if (drillStreak === 5 || drillStreak === 10 || drillStreak === 20 || drillStreak === 35) {
            showDrillHudFeedback(`🔥 STREAK ${drillStreak} REACHED!`);
        }

        if (typeof window.playSound === 'function') {
            window.playSound(drillStreak > 0 && drillStreak % 5 === 0 ? 'achievement' : 'correct');
        }
        speakText("Correct");

        // Ladder mode promotion check every 5 streak
        if (currentSpeedMode === SPEED_MODES.LADDER) {
            if (drillStreak > 0 && drillStreak % 5 === 0) {
                if (ladderCurrentDifficulty === 'easy') {
                    ladderCurrentDifficulty = 'medium';
                    if (typeof window.showToast === 'function') window.showToast('🪜 Ladder Promoted: Level is now MEDIUM! 🔥', 'success');
                } else if (ladderCurrentDifficulty === 'medium') {
                    ladderCurrentDifficulty = 'advance';
                    if (typeof window.showToast === 'function') window.showToast('🪜 Ladder Promoted: Level is now ADVANCE! 🚀', 'success');
                }
                updateModeBadgeUI();
            }
        }
    } else {
        // Enqueue mistake into Ghost Loop if not already a recovery attempt
        if (!isCurrentQuestionRecovery && currentQuestionData) {
            ghostRecoveryQueue.push({
                qData: currentQuestionData,
                dueTurn: currentDrillSessionTurn + 3,
                originalLatency: responseTimeMs
            });
        }

        const failedStreak = drillStreak;
        drillStreak = 0;
        updateStreakAura(0);

        if (feedback) {
            feedback.innerText = `Incorrect! Answer was ${drillAnswerVal} ❌`;
            feedback.className = "text-xs font-semibold text-accentRose";
        }
        if (typeof window.playSound === 'function') {
            window.playSound('wrong');
        }
        speakText("Wrong answer");

        // Sudden death mode terminates immediately on error!
        if (currentSpeedMode === SPEED_MODES.SUDDEN_DEATH) {
            finishSuddenDeathSession(failedStreak);
            return;
        }

        // Ladder mode demotion on error
        if (currentSpeedMode === SPEED_MODES.LADDER) {
            if (ladderCurrentDifficulty === 'advance') {
                ladderCurrentDifficulty = 'medium';
                if (typeof window.showToast === 'function') window.showToast('🪜 Ladder Demoted: Dropped to MEDIUM.', 'warning');
            } else if (ladderCurrentDifficulty === 'medium') {
                ladderCurrentDifficulty = 'easy';
                if (typeof window.showToast === 'function') window.showToast('🪜 Ladder Demoted: Dropped to EASY.', 'warning');
            }
            updateModeBadgeUI();
        }
    }

    if (scoreEl) scoreEl.innerText = `Score: ${drillCorrect}/${drillAttempts}`;
    
    // Auto-fulfill Speed Drill Daily Ritual after 10 attempts
    if (drillAttempts >= 10) {
        const win = typeof window !== 'undefined' ? window : {};
        if (win.appState && win.appState.dailyRituals && !win.appState.dailyRituals.drill) {
            win.appState.dailyRituals.drill = true;
            if (typeof win.saveStateToStorage === 'function') win.saveStateToStorage();
            if (typeof win.updateTodayGoalsRatio === 'function') win.updateTodayGoalsRatio();
            if (typeof win.updateRitualProgress === 'function') win.updateRitualProgress();
            const cb = typeof document !== 'undefined' ? document.getElementById("ritual-drill") : null;
            if (cb) {
                cb.checked = true;
                if (typeof win.syncRitualVisual === 'function') win.syncRitualVisual(cb, true);
            }
        }
    }

    // Update Live Reflex Telemetry HUD
    updateReflexTelemetryHUD(responseTimeMs);

    // Record into Split-Time Attempt History Feed (Phase 3)
    const activeDrillCat = currentMixCategory || drillMode;
    const currentQText = currentQuestionData ? currentQuestionData.q : (document.getElementById("drill-question-label") ? document.getElementById("drill-question-label").innerText : activeDrillCat);
    recordSplitTimeAttempt({
        question: currentQText,
        chosenVal: chosenVal,
        correctVal: drillAnswerVal,
        isCorrect: isCorrect,
        responseTimeMs: responseTimeMs,
        category: activeDrillCat,
        inputMethod: inputMethod,
        resultType: resultType
    });

    // Update Contextual Mental Math Tricks HUD (Phase 4)
    updateContextualMicroTrick(activeDrillCat, currentQuestionTargetKey, isCorrect, responseTimeMs);

    let nextDelay = currentSpeedMode === SPEED_MODES.BLITZ ? 500 : 1300;
    if (inputMethod === 'direct') {
        nextDelay = isCorrect ? 320 : 850;
    }
    setTimeout(generateDrillQuestion, nextDelay);
}

// === SPLIT-TIME ATTEMPT FEED & TIMELINE STREAM (PHASE 3) ===
let recentDrillAttempts = [];
let currentSessionMistakes = [];

function recordSplitTimeAttempt(attemptData) {
    recentDrillAttempts.unshift(attemptData);
    if (recentDrillAttempts.length > 20) {
        recentDrillAttempts.pop();
    }
    if (!attemptData.isCorrect) {
        currentSessionMistakes.push(attemptData);
    }
    renderSplitTimeFeed();
    renderSplitTimeTimeline();
}

function renderSplitTimeFeed() {
    const feedContainer = document.getElementById("drill-attempt-feed");
    const countEl = document.getElementById("attempt-feed-count");
    if (!feedContainer) return;

    if (countEl) countEl.innerText = `${recentDrillAttempts.length} logged`;

    if (recentDrillAttempts.length === 0) {
        feedContainer.innerHTML = `
            <div class="py-4 text-center text-[11px] text-gray-500 font-mono">
                Start drilling to view live split times and mistake analysis.
            </div>
        `;
        return;
    }

    feedContainer.innerHTML = recentDrillAttempts.map((att, idx) => {
        const sec = (att.responseTimeMs / 1000).toFixed(2);
        const isGreen = att.isCorrect;
        const icon = isGreen ? `<i class="fa-solid fa-check text-emerald-400"></i>` : `<i class="fa-solid fa-xmark text-rose-400"></i>`;
        const borderClass = isGreen ? 'border-emerald-500/20 bg-emerald-950/15' : 'border-rose-500/20 bg-rose-950/15';

        const methodBadge = att.inputMethod === 'direct'
            ? `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">DIR</span>`
            : `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-400 font-bold">MCQ</span>`;

        const recoveryBadge = att.resultType === 'recovered'
            ? `<span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">👻 RECOVERED</span>`
            : '';

        let detailText = '';
        if (isGreen) {
            detailText = `<span class="text-gray-300 font-mono font-bold">${att.question} <span class="text-emerald-300">= ${att.correctVal}</span></span>`;
        } else {
            detailText = `<span class="text-gray-300 font-mono font-bold">${att.question}</span> <span class="text-rose-400 font-mono text-[10px]">Chose: ${att.chosenVal} [Ans: ${att.correctVal}]</span>`;
        }

        return `
            <div class="flex items-center justify-between p-2 rounded-xl border ${borderClass} text-xs transition">
                <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-lg flex items-center justify-center text-xs ${isGreen ? 'bg-emerald-500/20' : 'bg-rose-500/20'}">
                        ${icon}
                    </span>
                    <div class="flex flex-wrap items-center gap-1.5">
                        ${methodBadge}
                        ${recoveryBadge}
                        ${detailText}
                    </div>
                </div>
                <span class="font-mono text-[10px] font-bold ${isGreen ? 'text-emerald-400' : 'text-rose-400'} shrink-0 ml-2">
                    ${sec}s
                </span>
            </div>
        `;
    }).join("");
}

// In-card Horizontal Split-Time Timeline Stream (Inspired by get inpiration od design.png)
function renderSplitTimeTimeline() {
    const track = document.getElementById("drill-timeline-track");
    if (!track) return;

    if (!recentDrillAttempts || recentDrillAttempts.length === 0) {
        track.innerHTML = `<div class="text-[10px] text-gray-500 font-mono italic">Start drilling to stream reflex timeline nodes...</div>`;
        return;
    }

    // Chronological order: oldest to newest, left to right (last 10)
    const timelineAttempts = [...recentDrillAttempts].reverse().slice(-10);

    track.innerHTML = timelineAttempts.map((att, idx) => {
        const sec = (att.responseTimeMs / 1000).toFixed(2);
        const isCorrect = att.isCorrect;
        const isLast = idx === timelineAttempts.length - 1;

        let latencyColor = 'text-emerald-400';
        let dotBorder = 'border-emerald-500/50 bg-emerald-950/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]';
        let dotCore = 'bg-emerald-400';

        if (!isCorrect) {
            latencyColor = 'text-rose-400';
            dotBorder = 'border-rose-500/50 bg-rose-950/60 shadow-[0_0_8px_rgba(244,63,94,0.3)]';
            dotCore = 'bg-rose-500';
        } else if (att.responseTimeMs <= 1200) {
            latencyColor = 'text-emerald-400';
            dotBorder = 'border-emerald-500/50 bg-emerald-950/60';
            dotCore = 'bg-emerald-400';
        } else if (att.responseTimeMs <= 2500) {
            latencyColor = 'text-cyan-400';
            dotBorder = 'border-cyan-500/50 bg-cyan-950/60';
            dotCore = 'bg-cyan-400';
        } else if (att.responseTimeMs <= 4000) {
            latencyColor = 'text-amber-400';
            dotBorder = 'border-amber-500/50 bg-amber-950/60';
            dotCore = 'bg-amber-400';
        } else {
            latencyColor = 'text-rose-400';
            dotBorder = 'border-rose-500/50 bg-rose-950/60';
            dotCore = 'bg-rose-400';
        }

        let shortLabel = att.category || '';
        if (att.question) {
            const cleanQ = att.question.replace(/\s*=\s*\?/, '').trim();
            shortLabel = cleanQ.length <= 9 ? cleanQ : cleanQ.slice(0, 8) + '…';
        }

        const tooltipTitle = `${att.question} | Ans: ${att.correctVal} | ${sec}s (${isCorrect ? 'Correct' : 'Mistake'})`;

        return `
            <div class="flex items-center gap-2 shrink-0">
                <div class="flex flex-col items-center group cursor-pointer" title="${tooltipTitle}">
                    <span class="text-[10px] font-mono font-extrabold ${latencyColor} tracking-tighter">${sec}s</span>
                    <div class="w-3 h-3 rounded-full flex items-center justify-center my-0.5 border ${dotBorder} transition-transform group-hover:scale-125">
                        <div class="w-1.5 h-1.5 rounded-full ${dotCore}"></div>
                    </div>
                    <span class="text-[9px] font-mono text-gray-400 font-bold max-w-[55px] truncate text-center">${shortLabel}</span>
                </div>
                ${!isLast ? '<div class="w-4 h-0.5 bg-white/10 shrink-0"></div>' : ''}
            </div>
        `;
    }).join('');

    track.scrollLeft = track.scrollWidth;
}
window.renderSplitTimeTimeline = renderSplitTimeTimeline;

// === CONTEXTUAL MENTAL MATH SHORTCUTS & MICRO-TRICKS (PHASE 4) ===
function getMicroTrickForQuestion(category, targetKey) {
    if (category === "squares") {
        const n = parseInt(targetKey, 10);
        if (n && n % 10 === 5) {
            const ten = Math.floor(n / 10);
            return {
                badge: `Ends in 5 Rule (n=${n})`,
                heuristic: `${n}² = [${ten} × (${ten}+1)] followed by 25 = [${ten * (ten + 1)}]25 = ${n * n}`,
                mnemonic: `Multiply the leading digit by (digit + 1) and attach 25.`
            };
        }
        if (n && n >= 21 && n <= 29) {
            const d = n - 25;
            return {
                badge: `Base 25 / Near 50 Rule`,
                heuristic: `${n}² = (25 + ${d}) × 100 + (${d})² = ${25 + d}00 + ${d * d} = ${n * n}`,
                mnemonic: `Pivot around 25: (25 ± deviation) × 100 + deviation²`
            };
        }
        if (n) {
            return {
                badge: `Algebra Identity (a+b)²`,
                heuristic: `${n}² = (20 + ${n - 20})² = 400 + ${2 * 20 * (n - 20)} + ${(n - 20) * (n - 20)} = ${n * n}`,
                mnemonic: `Break into base tens: a² + 2ab + b²`
            };
        }
    } else if (category === "cubes") {
        const n = parseInt(targetKey, 10);
        const lastDigitMap = { 1: 1, 2: 8, 3: 7, 4: 4, 5: 5, 6: 6, 7: 3, 8: 2, 9: 9, 0: 0 };
        if (n && lastDigitMap[n % 10] !== undefined) {
            return {
                badge: `Unit Digit Reflection Rule`,
                heuristic: `${n}³ unit digit must end in ${lastDigitMap[n % 10]}. Result: ${n * n * n}`,
                mnemonic: `Pairs: 2↔8 and 3↔7. All other numbers (1,4,5,6,9,0) retain their exact unit digit!`
            };
        }
    } else if (category === "tables") {
        const n = parseInt(targetKey, 10);
        if (n) {
            return {
                badge: `Distributive Split Rule`,
                heuristic: `${n} × k = (${Math.floor(n / 10) * 10} × k) + (${n % 10} × k)`,
                mnemonic: `Split larger tables into tens + units (e.g. 27 × 6 = 120 + 42 = 162).`
            };
        }
    } else if (category === "fracPerc") {
        return {
            badge: `Reciprocal Fraction Neighbors`,
            heuristic: `1/7 ≈ 14.28%  •  2/7 ≈ 28.57%  •  3/7 ≈ 42.85%  •  4/7 ≈ 57.14%`,
            mnemonic: `Recall 1/7 digits: sequence 14, 28, 57 repeats cyclic!`
        };
    } else if (category === "triplets") {
        return {
            badge: `Pythagorean Scaling & Euler Forms`,
            heuristic: `m² - n², 2mn, m² + n²  (e.g., m=2, n=1 → 3, 4, 5)`,
            mnemonic: `All CGL exam triplets are multiples of (3,4,5), (5,12,13), (8,15,17), or (7,24,25).`
        };
    }

    return {
        badge: `Mental Math Reflex`,
        heuristic: `Always look for algebraic identities (a²-b²), complement to 90°, or base-10 factoring.`,
        mnemonic: `Speed in SSC CGL comes from eliminating calculation through pattern recognition.`
    };
}

function updateContextualMicroTrick(category, targetKey, isCorrect, responseTimeMs) {
    const badgeEl = document.getElementById("trick-context-badge");
    const autoTagEl = document.getElementById("trick-auto-tag");
    const contentArea = document.getElementById("trick-content-area");

    const trick = getMicroTrickForQuestion(category, targetKey);
    if (!trick) return;

    if (badgeEl) badgeEl.innerText = trick.badge;
    if (contentArea) {
        contentArea.innerHTML = `
            <div class="space-y-2">
                <div class="text-base sm:text-lg font-bold text-cyan-300 tracking-wide">${trick.heuristic}</div>
                <div class="text-xs sm:text-sm text-gray-200 font-sans leading-relaxed">💡 <strong class="text-amber-300 font-bold">Shortcut:</strong> ${trick.mnemonic}</div>
            </div>
        `;
    }
}

// Post-Session Mistakes & Reflex Review Deck (Only shown after pause or stop)
function renderPostSessionMistakeReview() {
    const badgeEl = document.getElementById("trick-context-badge");
    const autoTagEl = document.getElementById("trick-auto-tag");
    const contentArea = document.getElementById("trick-content-area");
    const bodyEl = document.getElementById("drill-microtricks-body");
    const iconEl = document.getElementById("icon-toggle-microtricks");

    if (!contentArea) return;

    if (!currentSessionMistakes || currentSessionMistakes.length === 0) {
        if (badgeEl) badgeEl.innerText = "Clean Reflex Run";
        if (autoTagEl) autoTagEl.classList.add("hidden");
        contentArea.innerHTML = `
            <div class="text-emerald-400 font-bold text-sm sm:text-base flex items-center gap-2 py-1.5">
                <i class="fa-solid fa-circle-check text-base"></i>
                <span>Flawless reflex run! Zero mistakes recorded in this session.</span>
            </div>
        `;
        return;
    }

    if (badgeEl) badgeEl.innerText = `${currentSessionMistakes.length} Mistake${currentSessionMistakes.length > 1 ? 's' : ''} to Review`;
    if (autoTagEl) {
        autoTagEl.classList.remove("hidden");
        autoTagEl.innerText = "POST-DRILL REVIEW";
    }

    // Auto-reveal the review deck on pause/stop
    if (bodyEl && bodyEl.classList.contains("hidden")) {
        bodyEl.classList.remove("hidden");
        if (iconEl) iconEl.classList.add("rotate-180");
    }

    contentArea.innerHTML = `
        <div class="space-y-3">
            <div class="text-xs sm:text-sm font-mono text-gray-300 font-bold border-b border-white/10 pb-2 flex items-center justify-between">
                <span>Mistakes & Mental Shortcuts:</span>
                <span class="text-rose-400 font-extrabold">${currentSessionMistakes.length} missed</span>
            </div>
            ${currentSessionMistakes.slice(-6).map(m => {
                const trick = getMicroTrickForQuestion(m.category, m.targetKey);
                return `
                    <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-rose-500/30 space-y-2 shadow-md">
                        <div class="flex items-center justify-between text-sm sm:text-base font-mono">
                            <span class="text-white font-bold tracking-wide">${m.question}</span>
                            <span class="text-rose-400 text-xs sm:text-sm font-semibold">Chose: <span class="line-through text-rose-300">${m.chosenVal}</span> ➔ Ans: <span class="text-emerald-300 font-bold">${m.correctVal}</span></span>
                        </div>
                        ${trick ? `
                            <div class="text-xs sm:text-sm text-cyan-200 bg-cyan-950/60 p-2.5 rounded-xl border border-cyan-500/30 font-sans leading-relaxed">
                                💡 <strong class="text-amber-300 font-bold">Shortcut:</strong> ${trick.heuristic} — <span class="text-gray-200">${trick.mnemonic}</span>
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('')}
        </div>
    `;
}
window.renderPostSessionMistakeReview = renderPostSessionMistakeReview;

// Update Live Reflex Telemetry HUD metrics
function updateReflexTelemetryHUD(lastResponseMs) {
    const avgSpeedEl = document.getElementById("telemetry-avg-speed");
    const ppmEl = document.getElementById("telemetry-ppm");
    const todayAccEl = document.getElementById("telemetry-today-acc");
    const speedTierEl = document.getElementById("telemetry-speed-tier");

    const records = MicroFrequencyHeatmap.getDailyStore();
    let totalAttempts = 0;
    let totalCorrect = 0;
    let totalTimeMs = 0;

    Object.values(records).forEach(rec => {
        if (rec && rec.attempts > 0) {
            totalAttempts += rec.attempts;
            totalCorrect += rec.correct;
            totalTimeMs += rec.totalTimeMs;
        }
    });

    if (totalAttempts > 0) {
        const avgSec = (totalTimeMs / (totalAttempts * 1000)).toFixed(2);
        const accuracy = Math.round((totalCorrect / totalAttempts) * 100);
        const ppm = Math.round(60 / Math.max(0.5, (totalTimeMs / (totalAttempts * 1000))));

        if (avgSpeedEl) avgSpeedEl.innerText = `${avgSec}s`;
        if (ppmEl) ppmEl.innerText = `${ppm}`;
        if (todayAccEl) todayAccEl.innerText = `${accuracy}%`;

        if (speedTierEl) {
            if (avgSec <= 1.2 && accuracy >= 90) {
                speedTierEl.innerHTML = `<span class="text-accentCyan font-black">⚡ Lightning</span>`;
            } else if (avgSec <= 2.0 && accuracy >= 80) {
                speedTierEl.innerHTML = `<span class="text-accentGreen font-bold">🚀 Swift</span>`;
            } else if (avgSec <= 3.5) {
                speedTierEl.innerHTML = `<span class="text-accentAmber font-bold">🎯 Steady</span>`;
            } else {
                speedTierEl.innerHTML = `<span class="text-accentRose font-bold">📚 Building</span>`;
            }
        }
    }

    // Update 3-Tier Fact Maturation Mastery Count
    const masteryEl = document.getElementById("telemetry-mastery-count");
    if (masteryEl) {
        const activeCat = (typeof currentMixCategory !== 'undefined' && currentMixCategory) ? currentMixCategory : (drillMode || "squares");
        const domain = MicroFrequencyHeatmap.getDomainSpec(activeCat);
        if (domain && Array.isArray(domain.items)) {
            const total = domain.items.length;
            const masteredCount = domain.items.filter(item => {
                const mat = MicroFrequencyHeatmap.getFactMaturation(activeCat, item.id);
                return mat && mat.tier === 3;
            }).length;
            masteryEl.innerText = `${masteredCount} / ${total}`;
        } else {
            masteryEl.innerText = "0 / 30";
        }
    }

    updateSpeedPersonalBestsHUD();
}

// Render 2-line selection and start prompt when idle
function updateDrillIdleDisplay() {
    const qLabel = document.getElementById("drill-question-label");
    if (!qLabel || drillIsPlaying) return;
    
    const activeCat = (typeof currentMixCategory !== 'undefined' && currentMixCategory) ? currentMixCategory : (drillMode || "squares");
    let line1 = DRILL_MODE_LABELS[activeCat] || "Speed Drill";
    if (currentSpeedMode === SPEED_MODES.MIX) {
        line1 = "Multi-Category Mix";
    }

    qLabel.innerHTML = `
        <span class="block text-2xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">${line1}</span>
        <span class="block text-xs sm:text-sm font-mono font-medium text-cyan-400 mt-2 uppercase tracking-widest">Press Start to begin</span>
    `;
}

// Reset calculations stats
function resetDrillSession() {
    clearInterval(drillTimerInterval);
    clearInterval(blitzGlobalInterval);
    blitzGlobalInterval = null;
    blitzSecondsRemaining = 60;
    currentMixCategory = null;
    drillAttempts = 0;
    drillCorrect = 0;
    drillStreak = 0;
    consecutiveTimeoutsCount = 0;
    drillIsPlaying = false; 
    
    clearIdleTimer();

    // Disable Blackout Focus Mode
    document.documentElement.classList.remove("quiz-focus-active"); document.body.classList.remove("quiz-focus-active");

    const scoreEl = document.getElementById("drill-score");
    const feedback = document.getElementById("drill-feedback");
    const pauseBtn = document.getElementById("btn-drill-pause");
    const qLabel = document.getElementById("drill-question-label");
    const fill = document.getElementById("drill-timer-fill");
    const optionsGrid = document.getElementById("drill-options");

    // Hide inline pause overlay on reset
    const inlineOverlay = document.getElementById("drill-paused-overlay");
    if (inlineOverlay) inlineOverlay.classList.add("hidden");
    const inlineWrapper = document.getElementById("drill-interactive-area");
    if (inlineWrapper) inlineWrapper.classList.remove("blur-md");

    // Restore difficulty dropdown and hide close button in header
    const selectLevel = document.getElementById("select-maths-level");
    if (selectLevel) window.setDropdownVisible(selectLevel, true);
    const stopBtn = document.getElementById("btn-drill-stop");
    if (stopBtn) stopBtn.classList.add("hidden");
    const activeBadge = document.getElementById("conquest-active-badge");
    if (activeBadge) activeBadge.classList.add("hidden");

    if (scoreEl) scoreEl.innerText = "Score: 0/0";
    if (feedback) {
        feedback.innerText = "Streak: 0 🔥";
        feedback.className = "text-xs font-semibold text-gray-400";
    }

    if (pauseBtn) pauseBtn.innerHTML = `<i class="fa-solid fa-play mr-1"></i> Start`;
    updateDrillIdleDisplay();
    if (fill) {
        fill.style.width = "100%";
        fill.style.backgroundColor = "#10b981";
    }
    if (optionsGrid) {
        optionsGrid.innerHTML = "";
        optionsGrid.classList.add("hidden");
    }
    ghostRecoveryQueue = [];
    currentDrillSessionTurn = 0;
    isCurrentQuestionRecovery = false;
    currentQuestionData = null;
    updateStreakAura(0);

    const directContainer = document.getElementById("drill-direct-container");
    if (directContainer) directContainer.classList.add("hidden");
    const directInput = document.getElementById("drill-direct-input");
    if (directInput) {
        directInput.value = "";
        directInput.disabled = false;
    }
    const directCorrection = document.getElementById("drill-direct-correction");
    if (directCorrection) directCorrection.classList.add("hidden");

    updateModeBadgeUI();
    updateVoiceStatusUI('idle');
    renderPostSessionMistakeReview();
}

// === CONQUEST CHALLENGE ENGINE CONTROLLERS ===
let challengeQuestionStartTime = 0;
let challengeQuestionTelemetry = [];

function startChallengeRun() {
    isChallengeActive = true;
    drillIsPlaying = true;
    challengeTimeRemaining = 900; 
    challengeQuestionIndex = 0;
    challengeScore = 0;
    challengeQuestionTelemetry = [];
    
    const btnChallengeStart = document.getElementById("btn-challenge-start");
    if (btnChallengeStart) {
        btnChallengeStart.innerHTML = `<i class="fa-solid fa-square mr-1"></i> Abort Run`;
        btnChallengeStart.className = "w-full bg-accentRose hover:bg-rose-500 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition duration-200 shadow-md animate-pulse";
    }

    const badge = document.getElementById("challenge-badge");
    if (badge) {
        badge.innerText = "Run On";
        badge.className = badge.className.replace("bg-accentCyan/10 text-accentCyan", "bg-accentRose/10 text-accentRose border-accentRose/20");
    }

    // Hide difficulty dropdown, show active badge and close button in card header
    const selectLevel = document.getElementById("select-maths-level");
    if (selectLevel) window.setDropdownVisible(selectLevel, false);
    const activeBadge = document.getElementById("conquest-active-badge");
    if (activeBadge) activeBadge.classList.remove("hidden");
    const stopBtn = document.getElementById("btn-drill-stop");
    if (stopBtn) stopBtn.classList.remove("hidden");

    // Close popover panel automatically
    const popover = document.getElementById("conquest-popover");
    if (popover) {
        popover.classList.add("hidden", "opacity-0", "pointer-events-none", "-translate-y-2");
        popover.classList.remove("translate-y-0");
    }

    // Activate Blackout Focus Mode
    document.documentElement.classList.add("quiz-focus-active"); document.body.classList.add("quiz-focus-active");

    toggleFreeModeComponents(false);
    updateChallengeUI();

    // 3-2-1 Countdown Overlay Sequence with GSAP
    const countdownOverlay = document.getElementById("conquest-countdown-overlay");
    const countdownNum = document.getElementById("conquest-countdown-num");
    
    if (countdownOverlay && countdownNum && window.gsap) {
        countdownOverlay.classList.remove("hidden", "opacity-0", "pointer-events-none");
        countdownOverlay.classList.add("opacity-100");
        
        let count = 3;
        countdownNum.innerText = count;
        speakText("3");
        gsap.fromTo(countdownNum, { scale: 2.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2)" });
        
        const timer = setInterval(() => {
            count--;
            if (count > 0) {
                countdownNum.innerText = count;
                speakText(String(count));
                gsap.fromTo(countdownNum, { scale: 2.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2)" });
            } else if (count === 0) {
                countdownNum.innerText = "GO!";
                speakText("Go!");
                gsap.fromTo(countdownNum, { scale: 2.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
            } else {
                clearInterval(timer);
                countdownOverlay.classList.remove("opacity-100");
                countdownOverlay.classList.add("opacity-0", "pointer-events-none");
                setTimeout(() => countdownOverlay.classList.add("hidden"), 300);
            }
        }, 550);
    } else {
        speakText("Challenge started");
    }

    clearInterval(challengeTimerInterval);
    challengeTimerInterval = setInterval(() => {
        challengeTimeRemaining--;
        updateChallengeUI();
        if (challengeTimeRemaining <= 0) {
            endChallengeRun(false); 
        }
    }, 1000);

    generateChallengeQuestion();
}

function updateChallengeUI() {
    const min = Math.floor(challengeTimeRemaining / 60);
    const sec = challengeTimeRemaining % 60;
    const formattedTime = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    
    const timerEl = document.getElementById("challenge-timer");
    const progressEl = document.getElementById("challenge-progress");
    const diffEl = document.getElementById("challenge-diff");

    if (timerEl) timerEl.innerText = formattedTime;
    if (progressEl) progressEl.innerText = `${challengeQuestionIndex + 1} / 25`;
    
    let level = "Easy";
    let colorClass = "text-accentGreen";
    if (challengeQuestionIndex >= 15) {
        level = "Hard";
        colorClass = "text-accentRose";
    } else if (challengeQuestionIndex >= 5) {
        level = "Medium";
        colorClass = "text-accentAmber";
    }
    
    if (diffEl) {
        diffEl.innerText = level;
        diffEl.className = `font-bold text-xs uppercase ${colorClass}`;
    }

    // Turn the quiz card stats row into Conquest card layout with details
    const scoreEl = document.getElementById("drill-score");
    if (scoreEl) scoreEl.innerHTML = `Conquest: <span class="font-mono text-white ml-1">${challengeQuestionIndex + 1} / 25</span> <span class="${colorClass} ml-1.5 font-extrabold">(${level})</span>`;
    
    const feedback = document.getElementById("drill-feedback");
    if (feedback) {
        feedback.innerText = `Time: ${formattedTime} ⏰`;
        feedback.className = "text-xs font-semibold text-accentCyan";
    }
}

function generateProceduralMathQuestion(difficulty) {
    const modes = ["squares", "cubes", "tables", "fracPerc", "triplets", "algebra", "lcm", "hcf", "geomCenters", "trigReflex"];
    const mode = modes[Math.floor(Math.random() * modes.length)];
    const qData = generateQuestionTextAndAnswer(mode, difficulty);
    const choices = generateMathOptions(qData.a);
    return { q: qData.q, a: qData.a, o: choices };
}

function generateChallengeQuestion() {
    if (!isChallengeActive) return;
    updateChallengeUI();

    let diff = "easy";
    if (challengeQuestionIndex >= 15) {
        diff = "hard";
    } else if (challengeQuestionIndex >= 5) {
        diff = "medium";
    }

    const qLabel = document.getElementById("drill-question-label");
    const optionsGrid = document.getElementById("drill-options");
    if (qLabel && optionsGrid) {
        optionsGrid.innerHTML = "";
        optionsGrid.classList.remove("hidden");
        
        const qData = generateProceduralMathQuestion(diff);
        qLabel.innerText = qData.q;
        challengeCorrectAnswerVal = qData.a;
        challengeQuestionStartTime = Date.now();
        
        let optIdx = 1;
        qData.o.forEach(choice => {
            const btn = document.createElement("button");
            btn.className = "math-opt-btn relative group p-4 rounded-xl border border-white/5 bg-white/2px hover:bg-cyan-500/10 hover:border-accentCyan transition text-sm font-bold text-gray-200 flex items-center justify-center";
            btn.setAttribute("data-val", String(choice));

            const badge = document.createElement("span");
            badge.className = "absolute top-2 left-2.5 text-[10px] font-bold text-gray-500 font-mono group-hover:text-cyan-400 transition pointer-events-none select-none";
            badge.innerText = String(optIdx++);

            const textSpan = document.createElement("span");
            textSpan.innerText = choice;

            btn.appendChild(badge);
            btn.appendChild(textSpan);
            btn.onclick = () => submitChallengeAnswer("maths", choice, qData.a, optionsGrid.querySelectorAll("button"));
            optionsGrid.appendChild(btn);
        });
    }
}

function submitChallengeAnswer(subject, chosenVal, correctVal, optButtons) {
    let isCorrect = (String(chosenVal) === String(correctVal));
    
    // Telemetry tracking
    const elapsedSec = challengeQuestionStartTime ? Math.round(((Date.now() - challengeQuestionStartTime) / 1000) * 10) / 10 : 0;
    challengeQuestionTelemetry.push({
        qIndex: challengeQuestionIndex + 1,
        timeSec: elapsedSec,
        correct: isCorrect
    });
    
    optButtons.forEach(b => {
        b.disabled = true;
        const val = b.getAttribute("data-val") || b.innerText.trim();
        if (val === String(correctVal)) {
            b.className = b.className.replace("border-white/5", "border-accentGreen bg-accentGreen/15 text-accentGreen");
        } else if (val === String(chosenVal)) {
            b.className = b.className.replace("border-white/5", "border-accentRose bg-accentRose/15 text-accentRose");
        }
    });

    if (isCorrect) {
        challengeScore++;
        speakText("Correct");
    } else {
        speakText("Wrong");
    }

    setTimeout(() => {
        if (challengeQuestionIndex >= 24) {
            endChallengeRun(true);
        } else {
            challengeQuestionIndex++;
            generateChallengeQuestion();
        }
    }, 1500);
}

function endChallengeRun(completed = false, aborted = false) {
    isChallengeActive = false;
    drillIsPlaying = false;
    clearInterval(challengeTimerInterval);

    // Disable Blackout Focus Mode
    document.documentElement.classList.remove("quiz-focus-active"); document.body.classList.remove("quiz-focus-active");

    const btnChallengeStart = document.getElementById("btn-challenge-start");
    if (btnChallengeStart) {
        btnChallengeStart.innerHTML = `Start Challenge`;
        btnChallengeStart.className = "w-full bg-accentCyan hover:bg-cyan-500 text-white font-extrabold py-2 rounded-xl text-xs uppercase tracking-wider transition duration-200 shadow-md";
    }

    const badge = document.getElementById("challenge-badge");
    if (badge) {
        badge.innerText = "Run Off";
        badge.className = badge.className.replace("bg-accentRose/10 text-accentRose", "bg-accentCyan/10 text-accentCyan border-accentCyan/20");
    }

    // Hide active badge in card header
    const activeBadge = document.getElementById("conquest-active-badge");
    if (activeBadge) activeBadge.classList.add("hidden");

    const timerEl = document.getElementById("challenge-timer");
    const progressEl = document.getElementById("challenge-progress");
    if (timerEl) timerEl.innerText = "15:00";
    if (progressEl) progressEl.innerText = "0 / 25";

    toggleFreeModeComponents(true);

    if (aborted) {
        speakText("Challenge aborted");
        if (window.showCustomAlert) {
            window.showCustomAlert({
                title: "Conquest Run Aborted",
                message: "The 15-minute Conquest challenge run was aborted.",
                icon: "fa-ban",
                type: "warning",
                buttonText: "Got It"
            });
        }
    } else if (completed) {
        const timeTaken = 900 - challengeTimeRemaining;
        const pass = (challengeScore >= 20); 
        const telemetryCount = challengeQuestionTelemetry.length || 1;
        const avgSpeed = (timeTaken / telemetryCount).toFixed(1);
        const slowCount = challengeQuestionTelemetry.filter(t => t.timeSec > 10).length;
        const fastCount = challengeQuestionTelemetry.filter(t => t.timeSec <= 3 && t.correct).length;
        
        const telemetryCardHtml = `
            <div class="mt-3 p-3 bg-white/5 border border-white/10 rounded-xl text-left space-y-1.5 text-xs">
                <div class="flex items-center justify-between font-bold text-gray-300">
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-bolt text-cyan-400"></i> Avg Speed / Question:</span>
                    <span class="text-cyan-400 font-mono font-black">${avgSpeed}s</span>
                </div>
                <div class="flex items-center justify-between font-bold text-gray-300">
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-rocket text-emerald-400"></i> Rapid Solves (≤3s):</span>
                    <span class="text-emerald-400 font-mono font-black">${fastCount} / ${telemetryCount}</span>
                </div>
                <div class="flex items-center justify-between font-bold text-gray-300">
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-hourglass-half text-amber-400"></i> Slow Solves (>10s):</span>
                    <span class="${slowCount > 0 ? 'text-amber-400 font-black' : 'text-gray-400 font-mono'}">${slowCount} questions</span>
                </div>
            </div>
        `;

        if (pass) {
            speakText("Conquest cleared");
            if (window.triggerConfetti) window.triggerConfetti();
            if (window.rewardsSystem && typeof window.rewardsSystem.recordActivity === 'function') {
                window.rewardsSystem.recordActivity({
                    type: 'speed',
                    dedupKey: `speed_run_${Date.now()}`,
                    minCooldown: 10000,
                    title: `Conquest Run (${challengeScore}/25 - Cleared)`,
                    xp: 120,
                    coins: 50,
                    stars: 2
                });
            }
            if (window.showCustomAlert) {
                window.showCustomAlert({
                    title: "🔥 CONQUEST RUN CLEARED!",
                    message: "Super Human reflexes unlocked! You passed the qualifying cutoff.",
                    detailsHtml: `
                        <div class="grid grid-cols-2 gap-2 text-center">
                            <div class="p-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl">
                                <span class="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Score</span>
                                <span class="text-lg text-emerald-400 font-black">${challengeScore} / 25</span>
                            </div>
                            <div class="p-2.5 bg-cyan-500/10 border border-cyan-500/25 rounded-xl">
                                <span class="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Time Taken</span>
                                <span class="text-lg text-cyan-400 font-black">${timeTaken}s</span>
                            </div>
                        </div>
                        <div class="text-center pt-1 text-cyan-300 font-extrabold text-xs">
                            ⚡ Tier-2 Cutoff Cleared!
                        </div>
                        ${telemetryCardHtml}
                    `,
                    icon: "fa-trophy",
                    type: "success",
                    buttonText: "Awesome!"
                });
            }
        } else {
            speakText("Cutoff not cleared");
            if (window.rewardsSystem && typeof window.rewardsSystem.recordActivity === 'function') {
                window.rewardsSystem.recordActivity({
                    type: 'speed',
                    dedupKey: `speed_run_${Date.now()}`,
                    minCooldown: 10000,
                    title: `Conquest Run (${challengeScore}/25)`,
                    xp: 50,
                    coins: 20,
                    stars: 0
                });
            }
            if (window.showCustomAlert) {
                window.showCustomAlert({
                    title: "❌ Conquest Run Finished",
                    message: "You need at least 20/25 correct to clear the CGL Tier-2 qualifying cutoff. Keep practicing!",
                    detailsHtml: `
                        <div class="grid grid-cols-2 gap-2 text-center">
                            <div class="p-2.5 bg-rose-500/10 border border-rose-500/25 rounded-xl">
                                <span class="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Score</span>
                                <span class="text-lg text-rose-400 font-black">${challengeScore} / 25</span>
                            </div>
                            <div class="p-2.5 bg-cyan-500/10 border border-cyan-500/25 rounded-xl">
                                <span class="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Time Taken</span>
                                <span class="text-lg text-cyan-400 font-black">${timeTaken}s</span>
                            </div>
                        </div>
                        ${telemetryCardHtml}
                    `,
                    icon: "fa-circle-xmark",
                    type: "error",
                    buttonText: "Try Again"
                });
            }
        }
    } else {
        speakText("Time out");
        if (window.showCustomAlert) {
            window.showCustomAlert({
                title: "⏰ Time Limit Expired!",
                message: `You ran out of time on question ${challengeQuestionIndex + 1}.`,
                detailsHtml: `
                    <div class="text-center font-bold text-white text-xs py-2 bg-amber-500/10 border border-amber-500/25 rounded-xl">
                        Final Score: <span class="text-amber-400 font-extrabold text-sm ml-1">${challengeScore} / 25</span>
                    </div>
                `,
                icon: "fa-clock",
                type: "warning",
                buttonText: "Close"
            });
        }
    }

    resetDrillSession();
    updateModeBadgeUI();
    updateVoiceStatusUI('idle');
    renderPostSessionMistakeReview();
}

// Core initialization trigger
function initSpeedDrillsPage() {
    // 1. Math drill categories tab listeners (Squares, Cubes, etc.)
    const modeTabs = document.querySelectorAll(".speed-tab-btn");
    modeTabs.forEach(tab => {
        tab.onclick = () => {
            if (isChallengeActive) {
                speakText("Challenge in progress");
                if (window.showCustomAlert) {
                    window.showCustomAlert({
                        title: "Conquest Run Active",
                        message: "Conquest run is active! Abort or complete the current 15-minute challenge before switching categories.",
                        icon: "fa-bolt",
                        type: "warning",
                        buttonText: "Understood"
                    });
                }
                return;
            }
            modeTabs.forEach(t => t.classList.remove("active-nav-tab"));
            tab.classList.add("active-nav-tab");
            drillMode = tab.getAttribute("data-mode");

            // Sync heatmap category
            if (window.activeSpeedHeatmap) {
                window.activeSpeedHeatmap.setCategory(drillMode);
            }

            // Sync Cognitive Cheat Notes
            renderDrillCheatSheet(drillMode);

            // If already playing, restart with new mode immediately
            if (drillIsPlaying) {
                resetDrillSession();
                drillIsPlaying = true;
                generateDrillQuestion();
            } else {
                // Not playing — just show mode-ready idle state
                updateDrillIdleDisplay();
            }
        };
    });


    // 2. Start / Pause toggle
    const pauseBtn = document.getElementById("btn-drill-pause");
    if (pauseBtn) {
        pauseBtn.onclick = () => {
            if (isChallengeActive) return;
            if (typeof window.playSound === 'function') window.playSound('click');
            if (drillIsPlaying) {
                drillIsPlaying = false;
                pauseBtn.innerHTML = `<i class="fa-solid fa-play"></i> <span>Resume</span>`;
                clearInterval(drillTimerInterval);
                
                // Disable Blackout Focus Mode on pause
                document.documentElement.classList.remove("quiz-focus-active"); document.body.classList.remove("quiz-focus-active");

                // Show inline pause overlay
                const inlineOverlay = document.getElementById("drill-paused-overlay");
                if (inlineOverlay) inlineOverlay.classList.remove("hidden");
                const inlineWrapper = document.getElementById("drill-interactive-area");
                if (inlineWrapper) inlineWrapper.classList.add("blur-md");
                
                renderPostSessionMistakeReview();
                updateModeBadgeUI();
                speakText("Paused");
            } else {
                if (drillAttempts === 0) {
                    currentSessionMistakes = [];
                }
                drillIsPlaying = true;
                pauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i> <span>Pause</span>`;
                
                // Activate Blackout Focus Mode on resume
                document.documentElement.classList.add("quiz-focus-active"); document.body.classList.add("quiz-focus-active");

                // Hide inline pause overlay
                const inlineOverlay = document.getElementById("drill-paused-overlay");
                if (inlineOverlay) inlineOverlay.classList.add("hidden");
                const inlineWrapper = document.getElementById("drill-interactive-area");
                if (inlineWrapper) inlineWrapper.classList.remove("blur-md");
                
                // Hide difficulty dropdown and show close button in header
                const selectLevel = document.getElementById("select-maths-level");
                if (selectLevel) window.setDropdownVisible(selectLevel, false);
                const stopBtn = document.getElementById("btn-drill-stop");
                if (stopBtn) stopBtn.classList.remove("hidden");
                
                clearIdleTimer();
                generateDrillQuestion();
                speakText("Resumed");
            }
        };
    }

    // 3. Level selector change listener
    const selectLevel = document.getElementById("select-maths-level");
    if (selectLevel) {
        selectLevel.onchange = () => {
            resetDrillSession();
            generateDrillQuestion();
        };
    }

    // 4. Bind inline stop button listener
    const inlineStopBtn = document.getElementById("btn-drill-stop");
    if (inlineStopBtn) {
        inlineStopBtn.onclick = () => {
            if (typeof window.playSound === 'function') window.playSound('warning');
            if (isChallengeActive) {
                endChallengeRun(false, true); // Abort challenge
            } else {
                resetDrillSession();
            }
            renderPostSessionMistakeReview();
            speakText("Drill stopped");
        };
    }

    // 5. Bind inline resume button click listener
    const inlineResumeBtn = document.getElementById("btn-drill-resume");
    if (inlineResumeBtn) {
        inlineResumeBtn.onclick = () => {
            if (typeof window.playSound === 'function') window.playSound('click');
            const pauseBtn = document.getElementById("btn-drill-pause");
            if (pauseBtn) pauseBtn.click();
        };
    }

    // 6. Auto-pause logic on document click outside the drill card & cheat notes
    if (!window.__speedAutoPauseWired) {
        window.__speedAutoPauseWired = true;
        document.addEventListener("click", (e) => {
            if (drillIsPlaying && !isChallengeActive) {
                const drillCard = document.getElementById("unified-drill-card");
                if (drillCard && !drillCard.contains(e.target) && 
                    !e.target.closest(".speed-tab-btn") && 
                    !e.target.closest("#mobile-floating-nav") &&
                    !e.target.closest("#drill-timeline-container") &&
                    !e.target.closest("#drill-microtricks-card") &&
                    !e.target.closest("#drill-cheat-sheet-card") &&
                    !e.target.closest("#drill-mode-dropdown-wrap") &&
                    !e.target.closest("#drill-mode-dropdown")) {
                    const pauseBtn = document.getElementById("btn-drill-pause");
                    if (pauseBtn && pauseBtn.querySelector("span") && pauseBtn.querySelector("span").innerText === "Pause") {
                        pauseBtn.click();
                    }
                }
            }
        });

        // 7. Auto-pause logic on browser blur (switching tabs/windows)
        window.addEventListener("blur", () => {
            if (drillIsPlaying) {
                const pauseBtn = document.getElementById("btn-drill-pause");
                if (pauseBtn && pauseBtn.querySelector("span") && pauseBtn.querySelector("span").innerText === "Pause") {
                    pauseBtn.click();
                }
                startIdleTimer();
            }
        });
    }

    // 8. Custom tooltips setup
    initCustomTooltips();

    // 9. Mount and initialize MicroFrequencyHeatmap on left rail
    const heatmapContainer = document.getElementById("drill-heatmap-container");
    if (heatmapContainer) {
        window.activeSpeedHeatmap = new MicroFrequencyHeatmap(heatmapContainer, {
            category: drillMode,
            onSelectValue: (focusedVal) => {
                currentTargetValue = focusedVal;
            }
        });
        window.activeSpeedHeatmap.render();
    }

    // 10. Wire Gamified Speed Mode Dropdown Menu & Items
    const btnModeDropdown = document.getElementById("btn-drill-mode-dropdown");
    const modeDropdown = document.getElementById("drill-mode-dropdown");
    const modeChevron = document.getElementById("icon-mode-chevron") || document.getElementById("drill-mode-chevron");

    function openModeDropdown() {
        if (!modeDropdown) return;
        modeDropdown.classList.remove("hidden");
        const headerGroup = document.querySelector(".drill-header-group");
        if (headerGroup) {
            headerGroup.classList.add("dropdown-open");
            headerGroup.style.zIndex = "70";
        }
        if (btnModeDropdown) btnModeDropdown.setAttribute("aria-expanded", "true");
        if (modeChevron) modeChevron.classList.add("rotate-180");
    }

    function closeModeDropdown() {
        if (!modeDropdown) return;
        modeDropdown.classList.add("hidden");
        const headerGroup = document.querySelector(".drill-header-group");
        if (headerGroup) {
            headerGroup.classList.remove("dropdown-open");
            headerGroup.style.zIndex = "";
        }
        if (btnModeDropdown) btnModeDropdown.setAttribute("aria-expanded", "false");
        if (modeChevron) modeChevron.classList.remove("rotate-180");
    }

    if (btnModeDropdown && modeDropdown) {
        btnModeDropdown.onclick = (e) => {
            e.stopPropagation();
            const isHidden = modeDropdown.classList.contains("hidden");
            if (isHidden) {
                openModeDropdown();
            } else {
                closeModeDropdown();
            }
        };

        document.addEventListener("click", (e) => {
            if (!modeDropdown.contains(e.target) && !btnModeDropdown.contains(e.target)) {
                closeModeDropdown();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !modeDropdown.classList.contains("hidden")) {
                closeModeDropdown();
            }
        });
    }

    const modeItems = document.querySelectorAll(".drill-mode-item");
    modeItems.forEach(item => {
        item.onclick = (e) => {
            if (e.target.closest(".mode-info-btn")) return;
            const mode = item.getAttribute("data-mode-val");
            if (mode) {
                setSpeedGameMode(mode);
                closeModeDropdown();
            }
        };
    });

    // Wire Gamified Speed Mode Pills (Compatibility with test suite)
    const modePills = document.querySelectorAll(".drill-mode-pill");
    modePills.forEach(pill => {
        pill.addEventListener("click", (e) => {
            e.stopPropagation();
            const mode = pill.getAttribute("data-game-mode");
            if (mode) {
                setSpeedGameMode(mode);
                closeModeDropdown();
            }
        });
    });

    // 11. Wire Attempt History Expand/Collapse Toggle
    const btnToggleAttemptFeed = document.getElementById("btn-toggle-attempt-feed");
    const attemptFeedWrapper = document.getElementById("drill-attempt-feed-wrapper");
    const iconToggleAttemptFeed = document.getElementById("icon-toggle-attempt-feed");
    const labelToggleAttemptFeed = document.getElementById("label-toggle-attempt-feed");

    if (btnToggleAttemptFeed && attemptFeedWrapper) {
        btnToggleAttemptFeed.onclick = (e) => {
            e.stopPropagation();
            const isHidden = attemptFeedWrapper.classList.contains("hidden");
            if (isHidden) {
                attemptFeedWrapper.classList.remove("hidden");
                if (iconToggleAttemptFeed) iconToggleAttemptFeed.classList.add("rotate-180");
                if (labelToggleAttemptFeed) labelToggleAttemptFeed.innerText = "Hide Log";
            } else {
                attemptFeedWrapper.classList.add("hidden");
                if (iconToggleAttemptFeed) iconToggleAttemptFeed.classList.remove("rotate-180");
                if (labelToggleAttemptFeed) labelToggleAttemptFeed.innerText = "Detailed Log";
            }
            if (typeof window.playSound === 'function') window.playSound('click');
        };
    }

    // 12. Wire Contextual Micro-Tricks & Mental Shortcuts Toggle
    const btnToggleMicrotricks = document.getElementById("btn-toggle-microtricks");
    const microtricksBody = document.getElementById("drill-microtricks-body");
    const iconToggleMicrotricks = document.getElementById("icon-toggle-microtricks");

    if (btnToggleMicrotricks && microtricksBody) {
        btnToggleMicrotricks.onclick = (e) => {
            e.stopPropagation();
            const isHidden = microtricksBody.classList.contains("hidden");
            if (isHidden) {
                microtricksBody.classList.remove("hidden");
                if (iconToggleMicrotricks) iconToggleMicrotricks.classList.add("rotate-180");
            } else {
                microtricksBody.classList.add("hidden");
                if (iconToggleMicrotricks) iconToggleMicrotricks.classList.remove("rotate-180");
            }
            if (typeof window.playSound === 'function') window.playSound('click');
        };
    }

    // 13. Wire Voice Reflex Mode Button (Phase 6)
    const btnVoice = document.getElementById("btn-drill-voice");
    if (btnVoice) {
        btnVoice.addEventListener("click", () => {
            toggleVoiceReflexMode();
        });
    }

    // 14. Initialize Mode Badge, Timeline & Personal Bests HUD
    updateModeBadgeUI();
    updateSpeedPersonalBestsHUD();
    renderSplitTimeTimeline();
    updateDrillIdleDisplay();

    // 15. Drilling System Refinements: Direct Numeric Input, Pills, and Unified Keyboard
    wireDirectNumericInput();
    wireInputMethodToggle();
    wireDifficultyPills();
    initSpeedKeyboardShortcuts();

    // 16. Initialize Cognitive Cheat Notes Card
    initDrillCheatSheet();

    const badgeMode = document.getElementById("badge-mode-status");
    if (badgeMode) {
        badgeMode.onclick = () => {
            cycleSpeedGameMode();
        };
    }
}

// Global reference exposed to navigation resets
window.resetDrillSession = resetDrillSession;
window.startIdleTimer = startIdleTimer;

// ==========================================================================
// TOOLTIP & TEXT CONVERTERS
// ==========================================================================
function isHighWeightTopic(topicName) {
    if (!topicName) return false;
    const name = topicName.trim().toLowerCase();
    const highWeight = [
        "percentage", "profit & loss", "ratio & proportion", "average", "si & ci", 
        "mixture & alligation", "partnership", "algebra", "geometry", "mensuration",
        "time, speed & distance", "time & work", "series", "coding-decoding", 
        "direction sense", "blood relations", "puzzles", "non-verbal reasoning", 
        "subject-verb agreement", "voice & narration", "tenses", "articles & nouns", 
        "prepositions", "ancient & medieval history", "modern history", "polity", 
        "economics", "general science"
    ];
    return highWeight.some(hw => name.includes(hw) || hw.includes(name));
}


// === CUSTOM TOOLTIP ENGINE ===
let tooltipTimeout = null;
let activeTarget = null;
let isTouchActive = false;
let isScrolling = false;
let scrollTimeout = null;

function initCustomTooltips() {
    let tooltipEl = document.getElementById("custom-tooltip");
    if (!tooltipEl) {
        tooltipEl = document.createElement("div");
        tooltipEl.id = "custom-tooltip";
        tooltipEl.className = "fixed pointer-events-none z-[100000000]";
        document.body.appendChild(tooltipEl);
    }
    
    function hideTooltip() {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = null;
        activeTarget = null;
        if (tooltipEl) {
            tooltipEl.classList.remove("active");
        }
    }

    function updateActiveCustomTooltip(target, newText) {
        if (!tooltipEl || !tooltipEl.classList.contains("active")) return;
        if (activeTarget && (activeTarget === target || target.contains(activeTarget) || activeTarget.contains(target))) {
            tooltipEl.innerText = newText;
        }
    }
    window.updateActiveCustomTooltip = updateActiveCustomTooltip;

    function showTooltip(target) {
        if (isScrolling || !target) return;
        let tipText = target.getAttribute("data-tooltip") || target.getAttribute("data-title-backup");
        
        // Dynamically compute live countdown string for target pill / button
        if (typeof window.getExamCountdownData === 'function' && (target.id === 'btn-edit-exam-target' || target.closest('#btn-edit-exam-target') || target.id === 'countdown-timer')) {
            const cd = window.getExamCountdownData();
            const formattedDate = (typeof formatDateReadable === 'function' && typeof appState !== 'undefined' && appState.examDate)
                ? formatDateReadable(appState.examDate)
                : (cd.examDate || "Target Date");
            const statusText = cd.reached ? "Target Reached!" : `Remaining: ${cd.formattedFull}`;
            tipText = `🎯 ${cd.examName} (${formattedDate})\n⏱️ ${statusText}\n✏️ Click to change date`;
        }

        if (!tipText) return;
        
        tooltipEl.innerText = tipText;
        tooltipEl.classList.add("active");
        
        const rect = target.getBoundingClientRect();
        const tooltipRect = tooltipEl.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 8;
        
        const pos = target.getAttribute("data-tooltip-pos");
        const isIslandElement = target.closest("#sync-island-pill, #action-center-island-wrap, #pomo-capsule");

        if (pos === "bottom" || isIslandElement || top < 10) {
            const syncPill = document.getElementById("sync-island-pill");
            if (syncPill && syncPill.classList.contains("island-visible") && target.closest("#action-center-island-wrap") && !target.closest("#sync-island-pill")) {
                const pillRect = syncPill.getBoundingClientRect();
                top = pillRect.bottom + 8;
            } else {
                top = rect.bottom + 8;
            }
        }
        
        // Ensure tooltip stays strictly within viewport boundaries
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) top = 10;
        if (top + tooltipRect.height > window.innerHeight - 10) {
            top = Math.max(10, rect.top - tooltipRect.height - 8);
        }
        
        tooltipEl.style.left = `${left}px`;
        tooltipEl.style.top = `${top}px`;
    }

    function handleTitleAttributes(element) {
        if (!element) return;
        if (element.hasAttribute("title")) {
            if (!element.hasAttribute("data-tooltip")) {
                element.setAttribute("data-tooltip", element.getAttribute("title"));
            }
            element.setAttribute("data-title-backup", element.getAttribute("title"));
            element.removeAttribute("title");
        }
    }

    // Scroll event setup (run once)
    if (!window.hasTooltipScrollListener) {
        window.hasTooltipScrollListener = true;
        window.addEventListener("scroll", () => {
            isScrolling = true;
            hideTooltip();
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 200);
        }, { passive: true });
    }

    // Setup global delegated events (run once)
    if (!window.hasTooltipDelegatedEvents) {
        window.hasTooltipDelegatedEvents = true;

        // Hover events (Desktop)
        document.body.addEventListener("mouseover", (e) => {
            if (isTouchActive) return;
            if (isScrolling) return;

            const target = e.target.closest("[data-tooltip], [title]");
            if (!target) {
                if (activeTarget) {
                    hideTooltip();
                }
                return;
            }

            handleTitleAttributes(target);

            if (activeTarget === target) return;

            if (activeTarget) {
                hideTooltip();
            }

            activeTarget = target;
            tooltipTimeout = setTimeout(() => {
                if (activeTarget === target && !isScrolling) {
                    showTooltip(target);
                }
            }, 180); 
        });

        document.body.addEventListener("mouseout", (e) => {
            if (isTouchActive) return;
            if (!activeTarget) return;

            const related = e.relatedTarget;
            if (!related || !activeTarget.contains(related)) {
                hideTooltip();
            }
        });

        // Touch events (Mobile Long Press)
        document.body.addEventListener("touchstart", (e) => {
            isTouchActive = true;
            if (isScrolling) return;

            const target = e.target.closest("[data-tooltip], [title]");
            if (!target) {
                if (activeTarget) {
                    hideTooltip();
                }
                return;
            }

            handleTitleAttributes(target);

            if (activeTarget === target) return;

            if (activeTarget) {
                hideTooltip();
            }

            activeTarget = target;
            tooltipTimeout = setTimeout(() => {
                if (activeTarget === target && !isScrolling) {
                    showTooltip(target);
                }
            }, 700); 
        }, { passive: true });

        document.body.addEventListener("touchend", () => {
            setTimeout(() => { isTouchActive = false; }, 500);
            hideTooltip();
        });

        document.body.addEventListener("touchcancel", () => {
            setTimeout(() => { isTouchActive = false; }, 500);
            hideTooltip();
        });

        document.body.addEventListener("touchmove", () => {
            hideTooltip();
        });
    }
}


// Expose functions globally
function cycleDrillMode(dir) {
    if (isChallengeActive) return false;
    const modeTabs = Array.from(document.querySelectorAll(".speed-tab-btn"));
    if (!modeTabs.length) return false;
    let currIdx = modeTabs.findIndex(t => t.classList.contains("active-nav-tab"));
    if (currIdx === -1) currIdx = 0;
    let nextIdx = currIdx + dir;
    if (nextIdx < 0) nextIdx = modeTabs.length - 1;
    if (nextIdx >= modeTabs.length) nextIdx = 0;
    modeTabs[nextIdx].click();
    modeTabs[nextIdx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    if (typeof window.playSound === 'function') window.playSound('click');
    return true;
}
window.cycleDrillMode = cycleDrillMode;

function selectDrillCategory(modeKey) {
    const targetTab = document.querySelector(`.speed-tab-btn[data-mode="${modeKey}"]`);
    if (targetTab) {
        targetTab.click();
        targetTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        const unifiedCard = document.getElementById("unified-drill-card");
        if (unifiedCard) {
            unifiedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}
window.selectDrillCategory = selectDrillCategory;

// ==========================================================================
// DRILLING SYSTEM: INPUT, RECALL & FLOW-STATE REFINEMENT FUNCTIONS
// ==========================================================================

const DRILL_DIFFICULTIES = ['easy', 'medium', 'advance'];

function setDrillDifficulty(level) {
    if (!DRILL_DIFFICULTIES.includes(level)) return;
    const selectLevel = typeof document !== 'undefined' ? document.getElementById("select-maths-level") : null;
    if (selectLevel) {
        selectLevel.value = level;
        if (selectLevel.customDropdownInstance) {
            selectLevel.customDropdownInstance.refresh();
        }
    }

    if (typeof document !== 'undefined') {
        const pills = document.querySelectorAll("#drill-difficulty-pills .diff-pill");
        pills.forEach(pill => {
            const diff = pill.getAttribute("data-diff");
            if (diff === level) {
                pill.className = "diff-pill px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-600 text-white shadow-sm transition cursor-pointer flex items-center gap-1.5";
            } else {
                pill.className = "diff-pill px-2.5 py-1 rounded-lg text-[11px] font-bold text-gray-400 hover:text-white transition cursor-pointer flex items-center gap-1.5";
            }
        });
    }

    resetDrillSession();
    generateDrillQuestion();
    if (typeof window.showToastNotification === 'function') {
        window.showToastNotification(`Difficulty set to ${level.toUpperCase()}`);
    }
}
window.setDrillDifficulty = setDrillDifficulty;

function cycleDrillDifficulty() {
    const selectLevel = typeof document !== 'undefined' ? document.getElementById("select-maths-level") : null;
    const current = selectLevel ? selectLevel.value : 'medium';
    const nextIdx = (DRILL_DIFFICULTIES.indexOf(current) + 1) % DRILL_DIFFICULTIES.length;
    const nextDiff = DRILL_DIFFICULTIES[nextIdx];
    setDrillDifficulty(nextDiff);
    showDrillHudFeedback(`DIFFICULTY → ${nextDiff.toUpperCase()}`);
    if (typeof window.playSound === 'function') window.playSound('click');
}
window.cycleDrillDifficulty = cycleDrillDifficulty;

function wireDifficultyPills() {
    if (typeof document === 'undefined') return;
    const selectLevel = document.getElementById("select-maths-level");
    if (selectLevel && typeof window.initCustomDropdown === 'function') {
        window.initCustomDropdown(selectLevel);
    }
    const container = document.getElementById("drill-difficulty-pills");
    if (container && container.dataset.wired === "true") return;
    if (container) container.dataset.wired = "true";
    const pills = document.querySelectorAll("#drill-difficulty-pills .diff-pill");
    pills.forEach(pill => {
        pill.addEventListener("click", () => {
            const diff = pill.getAttribute("data-diff");
            if (diff) setDrillDifficulty(diff);
        });
    });
}

function setInputMethod(method) {
    if (method !== 'mcq' && method !== 'direct') return;
    currentDrillInputMethod = method;
    const win = typeof window !== 'undefined' ? window : {};
    win.currentDrillInputMethod = method;

    const btnMcq = typeof document !== 'undefined' ? document.getElementById("btn-input-mcq") : null;
    const btnDirect = typeof document !== 'undefined' ? document.getElementById("btn-input-direct") : null;
    const btnToggle = typeof document !== 'undefined' ? document.getElementById("btn-toggle-input-mode") : null;
    const labelToggle = typeof document !== 'undefined' ? document.getElementById("label-input-mode") : null;
    const iconToggle = typeof document !== 'undefined' ? document.getElementById("icon-input-mode") : null;

    const optionsGrid = typeof document !== 'undefined' ? document.getElementById("drill-options") : null;
    const directContainer = typeof document !== 'undefined' ? document.getElementById("drill-direct-container") : null;
    const directInput = typeof document !== 'undefined' ? document.getElementById("drill-direct-input") : null;

    if (btnMcq && btnDirect) {
        const activeClasses = "input-mode-pill py-1.5 px-3 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5";
        const inactiveClasses = "input-mode-pill py-1.5 px-3 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5";
        if (method === 'direct') {
            btnDirect.className = activeClasses;
            btnMcq.className = inactiveClasses;
        } else {
            btnMcq.className = activeClasses;
            btnDirect.className = inactiveClasses;
        }
    }

    if (method === 'direct') {
        if (labelToggle) labelToggle.innerText = "Direct";
        if (iconToggle) iconToggle.className = "fa-solid fa-keyboard text-cyan-400";
        if (btnToggle) btnToggle.classList.add("border-cyan-500/40", "bg-cyan-500/10");

        if (drillIsPlaying) {
            if (optionsGrid) optionsGrid.classList.add("hidden");
            if (directContainer) {
                directContainer.classList.remove("hidden");
                if (directInput) {
                    directInput.value = "";
                    directInput.disabled = false;
                    directInput.focus();
                }
            }
        }
    } else {
        if (labelToggle) labelToggle.innerText = "MCQ";
        if (iconToggle) iconToggle.className = "fa-solid fa-list-check text-cyan-400";
        if (btnToggle) btnToggle.classList.remove("border-cyan-500/40", "bg-cyan-500/10");

        if (directContainer) directContainer.classList.add("hidden");
        if (drillIsPlaying && optionsGrid) {
            optionsGrid.classList.remove("hidden");
        }
    }
}
window.setInputMethod = setInputMethod;

function cycleDrillInputMethod() {
    const nextMethod = currentDrillInputMethod === 'mcq' ? 'direct' : 'mcq';
    setInputMethod(nextMethod);
    showDrillHudFeedback(`INPUT → ${nextMethod === 'direct' ? 'DIRECT NUMERIC' : 'OPTIONS (MCQ)'}`);
    if (typeof window.playSound === 'function') window.playSound('click');
}
window.cycleDrillInputMethod = cycleDrillInputMethod;

function wireInputMethodToggle() {
    if (typeof document === 'undefined') return;
    const btnToggle = document.getElementById("btn-toggle-input-mode");
    if (btnToggle && btnToggle.dataset.wired === "true") return;
    if (btnToggle) {
        btnToggle.dataset.wired = "true";
        btnToggle.addEventListener("click", () => {
            cycleDrillInputMethod();
        });
    }
    const btnMcq = document.getElementById("btn-input-mcq");
    if (btnMcq) {
        btnMcq.addEventListener("click", () => {
            setInputMethod('mcq');
            showDrillHudFeedback("INPUT → OPTIONS (MCQ)");
            if (typeof window.playSound === 'function') window.playSound('click');
        });
    }
    const btnDirect = document.getElementById("btn-input-direct");
    if (btnDirect) {
        btnDirect.addEventListener("click", () => {
            setInputMethod('direct');
            showDrillHudFeedback("INPUT → DIRECT NUMERIC");
            if (typeof window.playSound === 'function') window.playSound('click');
        });
    }
}

function wireDirectNumericInput() {
    if (typeof document === 'undefined') return;
    const inputEl = document.getElementById("drill-direct-input");
    if (!inputEl || inputEl.dataset.wired === "true") return;
    inputEl.dataset.wired = "true";

    // Keyboard Shortcuts & Strict Input Filter inside Direct Numeric input field
    inputEl.addEventListener("keydown", (e) => {
        // Space -> Toggle Start / Pause reliably in direct input mode
        if (e.key === " " || e.key === "Spacebar" || e.code === "Space" || e.keyCode === 32) {
            e.preventDefault();
            e.stopPropagation();
            const pauseBtn = document.getElementById("btn-drill-pause");
            if (pauseBtn) pauseBtn.click();
            return;
        }

        // X / Escape -> Stop / Close drill session
        if (e.key === "x" || e.key === "X" || e.key === "Escape") {
            e.preventDefault();
            const stopBtn = document.getElementById("btn-drill-stop");
            if (stopBtn && !stopBtn.classList.contains("hidden")) {
                stopBtn.click();
            }
            return;
        }

        // R -> Rapid Restart drill session
        if ((e.key === "r" || e.key === "R") && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            restartDrillSession();
            return;
        }

        // M -> Cycle Game Mode across all 6 modes
        if ((e.key === "m" || e.key === "M") && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            cycleSpeedGameMode();
            return;
        }

        // D -> Cycle Difficulty (Easy ➔ Medium ➔ Advance)
        if ((e.key === "d" || e.key === "D") && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            cycleDrillDifficulty();
            return;
        }

        // I -> Cycle Input Method (Options ⇄ Direct)
        if ((e.key === "i" || e.key === "I") && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            cycleDrillInputMethod();
            return;
        }

        // V -> Toggle Global Voice Announcements
        if ((e.key === "v" || e.key === "V") && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            const speechBtn = document.getElementById("speech-toggle");
            if (speechBtn) {
                speechBtn.click();
            } else if (typeof window.toggleSpeechMode === 'function') {
                window.toggleSpeechMode();
            }
            return;
        }

        // Enter -> If wrong prefix or submitted
        if (e.key === "Enter") {
            e.preventDefault();
            const typed = inputEl.value.trim();
            const expected = String(drillAnswerVal).trim();
            if (typed !== "" && typed.toLowerCase() !== expected.toLowerCase()) {
                inputEl.disabled = true;
                inputEl.className = "w-full text-center text-3xl sm:text-4xl font-mono font-black py-3 px-4 rounded-2xl border-2 border-rose-500 bg-rose-950/40 text-rose-300 transition duration-150 tracking-widest shadow-inner";

                const correctionEl = document.getElementById("drill-direct-correction");
                const wrongValEl = document.getElementById("drill-direct-wrong-val");
                const correctValSpan = document.querySelector("#drill-direct-correct-val span");
                if (correctionEl && wrongValEl && correctValSpan) {
                    wrongValEl.innerText = typed;
                    correctValSpan.innerText = expected;
                    correctionEl.classList.remove("hidden");
                }
                checkDrillAnswer(typed, 'direct');
            }
            return;
        }

        // Allow navigation/editing keys: Backspace, Delete, Arrow keys, Tab
        if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
            return;
        }

        // Strictly reject any other character that is not a digit (0-9) or math fraction/percent symbol (/ . %)
        if (e.key.length === 1 && !/[0-9/.%]/.test(e.key)) {
            e.preventDefault();
            return;
        }
    });

    inputEl.addEventListener("input", () => {
        // Sanitize immediately to ensure no letters or spaces can ever linger
        if (/[^0-9/.%]/.test(inputEl.value)) {
            inputEl.value = inputEl.value.replace(/[^0-9/.%]/g, '');
        }

        if (!drillIsPlaying || !drillAnswerVal) return;
        const typed = inputEl.value.trim();
        if (typed === "") return;

        const expected = String(drillAnswerVal).trim();

        // Instant match! Auto-validates without Enter!
        if (typed.toLowerCase() === expected.toLowerCase()) {
            inputEl.disabled = true;
            inputEl.className = "w-full text-center text-3xl sm:text-4xl font-mono font-black py-3 px-4 rounded-2xl border-2 border-emerald-500 bg-emerald-950/40 text-emerald-300 transition duration-150 tracking-widest shadow-inner";
            checkDrillAnswer(typed, 'direct');
            return;
        }

        // Prefix validation:
        // As soon as typed prefix diverges from expected answer, reject immediately!
        if (!expected.toLowerCase().startsWith(typed.toLowerCase())) {
            inputEl.disabled = true;
            inputEl.className = "w-full text-center text-3xl sm:text-4xl font-mono font-black py-3 px-4 rounded-2xl border-2 border-rose-500 bg-rose-950/40 text-rose-300 transition duration-150 tracking-widest shadow-inner";

            const correctionEl = document.getElementById("drill-direct-correction");
            const wrongValEl = document.getElementById("drill-direct-wrong-val");
            const correctValSpan = document.querySelector("#drill-direct-correct-val span");
            if (correctionEl && wrongValEl && correctValSpan) {
                wrongValEl.innerText = typed;
                correctValSpan.innerText = expected;
                correctionEl.classList.remove("hidden");
            }

            checkDrillAnswer(typed, 'direct');
            return;
        }
    });
}

const DRILL_MODES_CYCLE = ['classic', 'blitz', 'sudden_death', 'ladder', 'mix', 'weak_practice'];

function cycleSpeedGameMode() {
    const currentIdx = DRILL_MODES_CYCLE.indexOf(currentSpeedMode);
    const nextIdx = (currentIdx === -1) ? 0 : ((currentIdx + 1) % DRILL_MODES_CYCLE.length);
    const nextMode = DRILL_MODES_CYCLE[nextIdx];
    setSpeedGameMode(nextMode);

    const modeDisplayMap = {
        classic: 'CLASSIC FREE DRILL',
        blitz: 'BLITZ 60s RUSH',
        sudden_death: 'SUDDEN DEATH',
        ladder: 'LADDER GAUNTLET',
        mix: 'MULTI-CATEGORY MIX',
        weak_practice: 'WEAK PRACTICE'
    };
    const modeIconMap = {
        classic: '<i class="fa-solid fa-play"></i>',
        blitz: '<i class="fa-solid fa-stopwatch"></i>',
        sudden_death: '<i class="fa-solid fa-skull"></i>',
        ladder: '<i class="fa-solid fa-stairs"></i>',
        mix: '<i class="fa-solid fa-shuffle"></i>',
        weak_practice: '<i class="fa-solid fa-bullseye"></i>'
    };
    showDrillHudFeedback(`MODE → ${modeDisplayMap[nextMode] || nextMode.toUpperCase()}`, modeIconMap[nextMode] || null);
    if (typeof window.playSound === 'function') window.playSound('click');
}
window.cycleSpeedGameMode = cycleSpeedGameMode;

function restartDrillSession() {
    resetDrillSession();
    drillIsPlaying = true;
    const pauseBtn = typeof document !== 'undefined' ? document.getElementById("btn-drill-pause") : null;
    if (pauseBtn) pauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i> <span>Pause</span>`;

    if (typeof document !== 'undefined') {
        if (document.documentElement) document.documentElement.classList.add("quiz-focus-active");
        if (document.body) document.body.classList.add("quiz-focus-active");
    }

    const selectLevel = typeof document !== 'undefined' ? document.getElementById("select-maths-level") : null;
    if (selectLevel) window.setDropdownVisible(selectLevel, false);
    const stopBtn = typeof document !== 'undefined' ? document.getElementById("btn-drill-stop") : null;
    if (stopBtn) stopBtn.classList.remove("hidden");

    showDrillHudFeedback("RESTARTING DRILL...", '<i class="fa-solid fa-arrows-rotate animate-spin"></i>');
    if (typeof window.playSound === 'function') window.playSound('click');
    generateDrillQuestion();
}
window.restartDrillSession = restartDrillSession;

function updateStreakAura(streak) {
    const drillCard = typeof document !== 'undefined' ? document.getElementById("unified-drill-card") : null;
    if (!drillCard) return;

    drillCard.classList.remove(
        "border-cyan-500/40", "shadow-[0_0_20px_rgba(6,182,212,0.25)]",
        "border-purple-500/50", "shadow-[0_0_25px_rgba(168,85,247,0.35)]",
        "border-amber-500/60", "shadow-[0_0_30px_rgba(245,158,11,0.4)]",
        "border-blue-400", "shadow-[0_0_35px_rgba(59,130,246,0.5)]"
    );

    if (streak >= 35) {
        drillCard.classList.add("border-blue-400", "shadow-[0_0_35px_rgba(59,130,246,0.5)]");
    } else if (streak >= 20) {
        drillCard.classList.add("border-amber-500/60", "shadow-[0_0_30px_rgba(245,158,11,0.4)]");
    } else if (streak >= 10) {
        drillCard.classList.add("border-purple-500/50", "shadow-[0_0_25px_rgba(168,85,247,0.35)]");
    } else if (streak >= 5) {
        drillCard.classList.add("border-cyan-500/40", "shadow-[0_0_20px_rgba(6,182,212,0.25)]");
    }
}
window.updateStreakAura = updateStreakAura;

let hudToastTimer = null;
function showDrillHudFeedback(message, iconHtml = '') {
    if (typeof document === 'undefined') return;
    const toast = document.getElementById("drill-hud-toast");
    const toastText = document.getElementById("drill-hud-toast-text");
    if (!toast || !toastText) return;

    clearTimeout(hudToastTimer);
    toastText.innerHTML = iconHtml ? `${iconHtml} ${message}` : message;
    toast.classList.remove("hidden");

    if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(() => {
            toast.classList.remove("opacity-0", "-translate-y-1");
            toast.classList.add("opacity-100", "translate-y-0");
        });
    } else {
        toast.classList.remove("opacity-0", "-translate-y-1");
        toast.classList.add("opacity-100", "translate-y-0");
    }

    hudToastTimer = setTimeout(() => {
        toast.classList.remove("opacity-100", "translate-y-0");
        toast.classList.add("opacity-0", "-translate-y-1");
        setTimeout(() => {
            if (toast.classList.contains("opacity-0")) {
                toast.classList.add("hidden");
            }
        }, 200);
    }, 1100);
}
window.showDrillHudFeedback = showDrillHudFeedback;

function toggleHesitantFactTargeting() {
    isHesitantTargetMode = !isHesitantTargetMode;
    const win = typeof window !== 'undefined' ? window : {};
    win.isHesitantTargetMode = isHesitantTargetMode;

    if (typeof win.showToast === 'function') {
        if (isHesitantTargetMode) {
            win.showToast("🎯 Hesitant Targeting Active: Prioritizing slow calculations (2.5s–4.5s)", "info");
        } else {
            win.showToast("Hesitant Targeting Disabled. Standard rotation resumed.", "info");
        }
    }
    showDrillHudFeedback(isHesitantTargetMode ? "TARGETING: HESITANT FACTS" : "TARGETING: STANDARD");
    if (typeof win.playSound === 'function') win.playSound('click');
    if (win.activeSpeedHeatmap) {
        win.activeSpeedHeatmap.render();
    }
}
window.toggleHesitantFactTargeting = toggleHesitantFactTargeting;

function initSpeedKeyboardShortcuts() {
    // Keyboard shortcuts for the Speed Drilling page (D, M, I, V, R) are centrally
    // dispatched by the canonical router in js/navigation.js to avoid duplicate event firing.
}

window.initCustomTooltips = initCustomTooltips;
window.initSpeedDrillsPage = initSpeedDrillsPage;
