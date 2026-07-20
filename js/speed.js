// === SPEED DRILLS LOGIC MODULE ===
let drillMode = "squares"; 
let drillAnswerVal = null;
let drillAttempts = 0;
let drillCorrect = 0;
let drillStreak = 0;
let drillTimerInterval = null;
let drillTimerSecs = 15;
let drillIsPlaying = false;

let isChallengeActive = false;
let challengeTimeRemaining = 900;
let challengeTimerInterval = null;
let challengeQuestionIndex = 0;
let challengeScore = 0;
let challengeCorrectAnswerVal = null;

// Dynamically expose values to window namespace
Object.defineProperty(window, 'drillIsPlaying', {
    get: () => drillIsPlaying,
    set: (v) => { drillIsPlaying = v; }
});
Object.defineProperty(window, 'isChallengeActive', {
    get: () => isChallengeActive,
    set: (v) => { isChallengeActive = v; }
});

// Mode Config Mapping for display titles
const DRILL_MODE_LABELS = {
    squares: "Squares (1 to 30)",
    cubes: "Cubes (1 to 20)",
    tables: "Tables (1 to 40)",
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
            "1/6", "5/6", "1/8", "3/8", "5/8", "7/8",
            "1/√2", "√2", "√3", "√3/2", "1/√3", "2/√3", "√5",
            "Not Defined", "sec²θ", "cosec²θ", "cot θ", "cos θ", "sin θ",
            "tan θ", "sec θ", "cosec θ"
        ];
        while (options.size < 4) {
            const rand = pool[Math.floor(Math.random() * pool.length)];
            if (rand !== correctStr) options.add(rand);
        }
    } else if (isPercentage) {
        const pool = ["50%", "33.33%", "66.67%", "25%", "75%", "20%", "40%", "60%", "80%",
            "16.67%", "83.33%", "12.5%", "37.5%", "62.5%", "87.5%", "8.33%",
            "6.67%", "6.25%", "10%", "14.28%", "11.11%", "9.09%"];
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
            // Use percentage offsets so large numbers get proportional distractors
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
    // Always return exactly 4 shuffled options as strings
    return Array.from(options).slice(0, 4).sort(() => Math.random() - 0.5);
}

// Core Math Drills Question & Answer Generator
function generateQuestionTextAndAnswer(mode, level) {
    let questionText = "";
    let answer = "";

    if (mode === "squares") {
        let min = 1, max = 10;
        if (level === "medium") { min = 11; max = 20; }
        else if (level === "advance") { min = 21; max = 30; }
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        questionText = `${num}² = ?`;
        answer = String(num * num);

    } else if (mode === "cubes") {
        let min = 1, max = 7;
        if (level === "medium") { min = 8; max = 14; }
        else if (level === "advance") { min = 15; max = 20; }
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        questionText = `${num}³ = ?`;
        answer = String(num * num * num);

    } else if (mode === "tables") {
        let n1Min = 2, n1Max = 12, n2Min = 1, n2Max = 10;
        if (level === "medium") { n1Min = 13; n1Max = 25; }
        else if (level === "advance") { n1Min = 26; n1Max = 40; n2Max = 15; }
        const n1 = Math.floor(Math.random() * (n1Max - n1Min + 1)) + n1Min;
        const n2 = Math.floor(Math.random() * (n2Max - n2Min + 1)) + n2Min;
        questionText = `${n1} × ${n2} = ?`;
        answer = String(n1 * n2);

    } else if (mode === "fracPerc") {
        const fracPercPairs = [
            { f: "1/2",  p: "50%" },   { f: "1/3",  p: "33.33%" }, { f: "2/3",  p: "66.67%" },
            { f: "1/4",  p: "25%" },   { f: "3/4",  p: "75%" },   { f: "1/5",  p: "20%" },
            { f: "2/5",  p: "40%" },   { f: "3/5",  p: "60%" },   { f: "4/5",  p: "80%" },
            { f: "1/6",  p: "16.67%"}, { f: "5/6",  p: "83.33%"}, { f: "1/7",  p: "14.28%"},
            { f: "1/8",  p: "12.5%" }, { f: "3/8",  p: "37.5%" }, { f: "5/8",  p: "62.5%" },
            { f: "7/8",  p: "87.5%" }, { f: "1/9",  p: "11.11%"}, { f: "1/11", p: "9.09%" },
            { f: "1/12", p: "8.33%" }, { f: "1/15", p: "6.67%" }, { f: "1/16", p: "6.25%" },
            { f: "1/10", p: "10%" },   { f: "3/10", p: "30%" },   { f: "7/10", p: "70%" }
        ];
        let pool;
        if (level === "easy")    pool = fracPercPairs.slice(0, 8);
        else if (level === "medium") pool = fracPercPairs.slice(8, 16);
        else                     pool = fracPercPairs.slice(16);
        const item = pool[Math.floor(Math.random() * pool.length)];
        if (Math.random() < 0.5) {
            questionText = `Percentage of '${item.f}' = ?`;
            answer = item.p;
        } else {
            questionText = `Fraction of '${item.p}' = ?`;
            answer = item.f;
        }

    } else if (mode === "triplets") {
        const baseTriplets = [
            [3,4,5], [5,12,13], [8,15,17], [7,24,25], [9,40,41],
            [11,60,61], [12,35,37], [20,21,29], [9,12,15], [10,24,26],
            [6,8,10], [15,20,25], [20,48,52], [28,45,53], [33,56,65]
        ];
        const base = baseTriplets[Math.floor(Math.random() * baseTriplets.length)];
        let mult = 1;
        if (level === "medium") mult = Math.floor(Math.random() * 2) + 2;
        else if (level === "advance") mult = Math.floor(Math.random() * 3) + 4;
        const trip = base.map(v => v * mult);
        const blankIdx = Math.floor(Math.random() * 3);
        answer = String(trip[blankIdx]);
        const display = trip.map((v, i) => i === blankIdx ? "?" : v);
        questionText = `Triplet: ${display.join(", ")}`;

    } else if (mode === "algebra") {
        const a = Math.floor(Math.random() * 8) + 3;
        const b = Math.floor(Math.random() * 4) + 1;
        let types;
        if (level === "easy")         types = [0, 1, 2];
        else if (level === "medium")  types = [2, 3, 4];
        else                          types = [3, 4, 5, 6, 7];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 0) { questionText = `If a=${a}, b=${b}: a + b = ?`; answer = String(a + b); }
        else if (type === 1) { questionText = `If a=${a}, b=${b}: a - b = ?`; answer = String(a - b); }
        else if (type === 2) { questionText = `If a=${a}, b=${b}: a × b = ?`; answer = String(a * b); }
        else if (type === 3) { questionText = `If a=${a}, b=${b}: a² - b² = ?`; answer = String(a*a - b*b); }
        else if (type === 4) { questionText = `If a=${a}, b=${b}: a² + b² = ?`; answer = String(a*a + b*b); }
        else if (type === 5) { questionText = `If a=${a}, b=${b}: (a-b)² = ?`; answer = String((a-b)*(a-b)); }
        else if (type === 6) { questionText = `If a=${a}, b=${b}: (a+b)² = ?`; answer = String((a+b)*(a+b)); }
        else                 { questionText = `If a=${a}, b=${b}: a³ - b³ = ?`; answer = String(a*a*a - b*b*b); }

    } else if (mode === "lcm") {
        const list = [
            // Easy
            { n:[2,3,4],   a:12  }, { n:[3,4,6],   a:12  }, { n:[4,6,8],   a:24  }, { n:[2,4,6],   a:12 },
            { n:[3,6,9],   a:18  }, { n:[4,8,12],  a:24  },
            // Medium
            { n:[5,10,15], a:30  }, { n:[6,9,12],  a:36  }, { n:[8,12,16], a:48  }, { n:[10,12,15],a:60 },
            { n:[12,15,20],a:60  }, { n:[6,10,15], a:30  }, { n:[9,12,18], a:36  }, { n:[10,15,20],a:60 },
            // Advance
            { n:[8,12,15], a:120 }, { n:[12,16,24],a:48  }, { n:[15,20,30],a:60  }, { n:[16,24,32],a:96 },
            { n:[18,24,36],a:72  }, { n:[20,25,30],a:300 }, { n:[14,21,35],a:210 }, { n:[12,18,27],a:108}
        ];
        let pool;
        if (level === "easy")    pool = list.slice(0, 6);
        else if (level === "medium") pool = list.slice(6, 14);
        else                     pool = list.slice(14);
        const item = pool[Math.floor(Math.random() * pool.length)];
        const shuffled = [...item.n].sort(() => Math.random() - 0.5);
        questionText = `LCM of (${shuffled.join(", ")}) = ?`;
        answer = String(item.a);

    } else if (mode === "hcf") {
        let minF = 2, maxF = 6;
        if (level === "medium") { minF = 7; maxF = 15; }
        else if (level === "advance") { minF = 13; maxF = 25; }
        const f = Math.floor(Math.random() * (maxF - minF + 1)) + minF;
        const multiplierSets = [
            [2,3,5], [2,5,7], [3,4,5], [3,5,7], [2,3,7], [4,5,7],
            [2,3,11],[3,4,7],[5,6,7],[2,7,9],[4,5,9],[3,7,8]
        ];
        const mults = multiplierSets[Math.floor(Math.random() * multiplierSets.length)];
        questionText = `HCF of (${f*mults[0]}, ${f*mults[1]}, ${f*mults[2]}) = ?`;
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
        const chosenChar = pool[Math.floor(Math.random() * pool.length)];
        const pos = chosenChar.charCodeAt(0) - 64;

        if (type === 0) { questionText = `Position of Letter '${chosenChar}' = ?`; answer = String(pos); }
        else if (type === 1) { questionText = `Reverse position of '${chosenChar}' (A=26) = ?`; answer = String(27 - pos); }
        else { questionText = `Opposite letter of '${chosenChar}' = ?`; answer = String.fromCharCode(155 - chosenChar.charCodeAt(0)); }

    } else if (mode === "geomCenters") {
        // Expanded: more type variety and all levels
        let types;
        if (level === "easy")        types = [0, 1, 5];
        else if (level === "medium") types = [0, 1, 2, 5];
        else                         types = [0, 1, 2, 3, 4, 5];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 0) {
            const a = (Math.floor(Math.random() * 9) + 4) * 10;
            questionText = `In △ABC, I=Incenter, ∠A=${a}°. Find ∠BIC.`;
            answer = String(90 + a / 2);
        } else if (type === 1) {
            const a = (Math.floor(Math.random() * 10) + 4) * 10;
            questionText = `In △ABC, O=Orthocenter, ∠A=${a}°. Find ∠BOC.`;
            answer = String(180 - a);
        } else if (type === 2) {
            const a = (Math.floor(Math.random() * 6) + 3) * 10;
            questionText = `In △ABC, C=Circumcenter, ∠A=${a}°. Find ∠BOC.`;
            answer = String(2 * a);
        } else if (type === 3) {
            const triplets = [[3,4,5],[5,12,13],[8,15,17],[6,8,10],[9,12,15]];
            const rip = triplets[Math.floor(Math.random() * triplets.length)];
            questionText = `Right △ABC (sides ${rip[0]},${rip[1]},${rip[2]}). Inradius = ?`;
            answer = String((rip[0] + rip[1] - rip[2]) / 2);
        } else if (type === 4) {
            const triplets = [[3,4,5],[5,12,13],[8,15,17],[6,8,10],[10,24,26]];
            const rip = triplets[Math.floor(Math.random() * triplets.length)];
            questionText = `Right △ABC (hypotenuse ${rip[2]}). Circumradius = ?`;
            answer = String(rip[2] / 2);
        } else {
            questionText = `Centroid G divides median AD (vertex A). Ratio AG:GD = ?`;
            answer = "2:1";
        }

    } else if (mode === "trigReflex") {
        // Only exam-standard angles: 0°, 30°, 45°, 60°, 90°
        const sinCos = [
            { q:"sin(0°)",    a:"0" },     { q:"sin(30°)",   a:"1/2" },
            { q:"sin(45°)",   a:"1/√2" },  { q:"sin(60°)",   a:"√3/2" }, { q:"sin(90°)",   a:"1" },
            { q:"cos(0°)",    a:"1" },     { q:"cos(30°)",   a:"√3/2" },
            { q:"cos(45°)",   a:"1/√2" },  { q:"cos(60°)",   a:"1/2" },  { q:"cos(90°)",   a:"0" },
        ];
        const tanCot = [
            { q:"tan(0°)",    a:"0" },     { q:"tan(30°)",   a:"1/√3" },
            { q:"tan(45°)",   a:"1" },     { q:"tan(60°)",   a:"√3" },   { q:"tan(90°)",   a:"Not Defined" },
            { q:"cot(0°)",    a:"Not Defined" },  { q:"cot(30°)",   a:"√3" },
            { q:"cot(45°)",   a:"1" },     { q:"cot(60°)",   a:"1/√3" }, { q:"cot(90°)",   a:"0" },
        ];
        const secCosec = [
            { q:"sec(0°)",    a:"1" },     { q:"sec(30°)",   a:"2/√3" },
            { q:"sec(45°)",   a:"√2" },   { q:"sec(60°)",   a:"2" },    { q:"sec(90°)",   a:"Not Defined" },
            { q:"cosec(0°)",  a:"Not Defined" },  { q:"cosec(30°)", a:"2" },
            { q:"cosec(45°)", a:"√2" },   { q:"cosec(60°)", a:"2/√3" },{ q:"cosec(90°)", a:"1" },
        ];
        const identities = [
            { q:"sin²θ + cos²θ",   a:"1" },
            { q:"1 + tan²θ",       a:"sec²θ" },
            { q:"1 + cot²θ",       a:"cosec²θ" },
            { q:"sec²θ - tan²θ",   a:"1" },
            { q:"cosec²θ - cot²θ", a:"1" },
            { q:"sin(90° - θ)",    a:"cos θ" },
            { q:"cos(90° - θ)",    a:"sin θ" },
            { q:"tan(90° - θ)",    a:"cot θ" },
            { q:"cot(90° - θ)",    a:"tan θ" },
            { q:"sec(90° - θ)",    a:"cosec θ" },
            { q:"cosec(90° - θ)",  a:"sec θ" },
        ];

        let pool;
        if (level === "easy")        pool = sinCos;                                         // sin + cos
        else if (level === "medium") pool = [...sinCos, ...tanCot];                        // + tan + cot
        else                         pool = [...sinCos, ...tanCot, ...secCosec, ...identities]; // all 6 + identities

        const item = pool[Math.floor(Math.random() * pool.length)];
        const isIdentity = !item.q.match(/^(sin|cos|tan|cot|sec|cosec)\(\d/);
        questionText = isIdentity ? `Identity: ${item.q} = ?` : `Evaluate: ${item.q} = ?`;
        answer = item.a;
    }
    return { q: questionText, a: answer };
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
        return;
    }

    // Toggle Difficulty Dropdown VS Close button in header
    const selectLevel = document.getElementById("select-maths-level");
    if (selectLevel) window.setDropdownVisible(selectLevel, false);
    const stopBtn = document.getElementById("btn-drill-stop");
    if (stopBtn) stopBtn.classList.remove("hidden");

    // Activate Blackout Focus Mode
    document.documentElement.classList.add("quiz-focus-active"); document.body.classList.add("quiz-focus-active");

    const level = selectLevel ? selectLevel.value : "medium";
    const qData = generateQuestionTextAndAnswer(drillMode, level);
    drillAnswerVal = qData.a;

    qLabel.innerText = qData.q;

    // Restore plain hot streak representation in clean green
    const feedback = document.getElementById("drill-feedback");
    if (feedback) {
        feedback.innerText = `Streak: ${drillStreak} 🔥`;
        feedback.className = "text-xs font-semibold text-accentGreen";
    }

    const choices = generateMathOptions(qData.a);
    const optionsGrid = document.getElementById("drill-options");
    if (optionsGrid) {
        optionsGrid.innerHTML = "";
        optionsGrid.classList.remove("hidden");
        
        choices.forEach(val => {
            const btn = document.createElement("button");
            btn.className = "math-opt-btn p-3 rounded-xl border border-white/5 bg-white/2px hover:bg-cyan-500/10 hover:border-accentCyan transition text-sm font-bold text-gray-200";
            btn.innerText = val;
            btn.setAttribute("data-val", String(val));
            btn.onclick = () => checkDrillAnswer(val);
            optionsGrid.appendChild(btn);
        });
    }

    clearInterval(drillTimerInterval);
    let maxSeconds = 7;
    if (level === "easy") maxSeconds = 10;
    else if (level === "advance") maxSeconds = 5;
    
    drillTimerSecs = maxSeconds;
    const fill = document.getElementById("drill-timer-fill");
    if (fill) fill.style.width = "100%";

    drillTimerInterval = setInterval(() => {
        drillTimerSecs--;
        if (fill) fill.style.width = `${(drillTimerSecs / maxSeconds) * 100}%`;

        if (drillTimerSecs <= 0) {
            clearInterval(drillTimerInterval);
            drillAttempts++;
            drillStreak = 0;
            
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

            speakText("Time out");
            setTimeout(generateDrillQuestion, 1500);
        }
    }, 1000);
}

// Check inline question answers
function checkDrillAnswer(chosenVal) {
    clearInterval(drillTimerInterval);
    drillAttempts++;

    const feedback = document.getElementById("drill-feedback");
    const scoreEl = document.getElementById("drill-score");
    const buttons = document.querySelectorAll("#drill-options button");

    buttons.forEach(b => {
        b.disabled = true;
        const val = b.getAttribute("data-val") || b.innerText.trim();
        if (val === String(drillAnswerVal)) {
            b.className = b.className.replace("border-white/5", "border-accentGreen bg-accentGreen/15 text-accentGreen");
        } else if (val === String(chosenVal)) {
            b.className = b.className.replace("border-white/5", "border-accentRose bg-accentRose/15 text-accentRose");
        }
    });

    if (String(chosenVal) === String(drillAnswerVal)) {
        drillCorrect++;
        drillStreak++;
        if (feedback) {
            feedback.innerText = `Correct! Streak: ${drillStreak} 🔥`;
            feedback.className = "text-xs font-semibold text-accentGreen";
        }
        speakText("Correct");
    } else {
        drillStreak = 0;
        if (feedback) {
            feedback.innerText = `Incorrect! Answer was ${drillAnswerVal} ❌`;
            feedback.className = "text-xs font-semibold text-accentRose";
        }
        speakText("Wrong answer");
    }

    if (scoreEl) scoreEl.innerText = `Score: ${drillCorrect}/${drillAttempts}`;
    
    setTimeout(generateDrillQuestion, 1500);
}

// Reset calculations stats
function resetDrillSession() {
    clearInterval(drillTimerInterval);
    drillAttempts = 0;
    drillCorrect = 0;
    drillStreak = 0;
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
    if (qLabel) qLabel.innerText = "Select a mode & press Start";
    if (fill) fill.style.width = "100%";
    if (optionsGrid) {
        optionsGrid.innerHTML = "";
        optionsGrid.classList.add("hidden");
    }
}

// === CONQUEST CHALLENGE ENGINE CONTROLLERS ===
function startChallengeRun() {
    isChallengeActive = true;
    drillIsPlaying = true;
    challengeTimeRemaining = 900; 
    challengeQuestionIndex = 0;
    challengeScore = 0;
    
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

    clearInterval(challengeTimerInterval);
    challengeTimerInterval = setInterval(() => {
        challengeTimeRemaining--;
        updateChallengeUI();
        if (challengeTimeRemaining <= 0) {
            endChallengeRun(false); 
        }
    }, 1000);

    speakText("Challenge started");
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
        
        qData.o.forEach(choice => {
            const btn = document.createElement("button");
            btn.className = "math-opt-btn p-3 rounded-xl border border-white/5 bg-white/2px hover:bg-cyan-500/10 hover:border-accentCyan transition text-sm font-bold text-gray-200";
            btn.innerText = choice;
            btn.onclick = () => submitChallengeAnswer("maths", choice, qData.a, optionsGrid.querySelectorAll("button"));
            optionsGrid.appendChild(btn);
        });
    }
}

function submitChallengeAnswer(subject, chosenVal, correctVal, optButtons) {
    let isCorrect = (String(chosenVal) === String(correctVal));
    
    optButtons.forEach(b => {
        b.disabled = true;
        const val = b.innerText;
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
        alert("Challenge Run was aborted.");
    } else if (completed) {
        const timeTaken = 900 - challengeTimeRemaining;
        const pass = (challengeScore >= 20); 
        
        if (pass) {
            speakText("Conquest cleared");
            alert(`🔥 CONQUEST RUN CLEARED!\nScore: ${challengeScore} / 25 correct!\nTime taken: ${timeTaken} seconds.\nRating: Super Human reflexes unlocked!`);
        } else {
            speakText("Cutoff not cleared");
            alert(`❌ CHALLENGE FINISHED\nScore: ${challengeScore} / 25 correct.\nTime taken: ${timeTaken} seconds.\nYou need at least 20/25 to clear the CGL Tier-2 qualifying cutoff. Keep practicing!`);
        }
    } else {
        speakText("Time out");
        alert(`⏰ TIMEOUT! You ran out of time on question ${challengeQuestionIndex + 1}.\nScore: ${challengeScore} / 25 correct.`);
    }

    resetDrillSession();
}

function toggleFreeModeComponents(show) {
    const startPauseBtn = document.getElementById("btn-drill-pause");
    if (startPauseBtn) {
        if (show) startPauseBtn.classList.remove("hidden");
        else startPauseBtn.classList.add("hidden");
    }
}

// Core initialization trigger
function initSpeedDrillsPage() {
    // 1. Math drill categories tab listeners (Squares, Cubes, etc.)
    const modeTabs = document.querySelectorAll(".speed-tab-btn");
    modeTabs.forEach(tab => {
        tab.onclick = () => {
            if (isChallengeActive) {
                speakText("Challenge in progress");
                alert("Conquest run is active! Abort or complete the current 15-minute challenge before switching categories.");
                return;
            }
            modeTabs.forEach(t => t.classList.remove("active-nav-tab"));
            tab.classList.add("active-nav-tab");
            drillMode = tab.getAttribute("data-mode");

            // If already playing, restart with new mode immediately
            if (drillIsPlaying) {
                resetDrillSession();
                drillIsPlaying = true;
                generateDrillQuestion();
            } else {
                // Not playing — just show mode-ready idle state
                const qLabel = document.getElementById("drill-question-label");
                const modeLabel = DRILL_MODE_LABELS[drillMode] || drillMode;
                if (qLabel) qLabel.innerText = `${modeLabel} — press Start to begin`;
            }
        };
    });


    // 2. Start / Pause toggle
    const pauseBtn = document.getElementById("btn-drill-pause");
    if (pauseBtn) {
        pauseBtn.onclick = () => {
            if (isChallengeActive) return;
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
                
                speakText("Paused");
            } else {
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
            if (isChallengeActive) {
                endChallengeRun(false, true); // Abort challenge
            } else {
                resetDrillSession();
            }
            speakText("Drill stopped");
        };
    }

    // 5. Bind inline resume button click listener
    const inlineResumeBtn = document.getElementById("btn-drill-resume");
    if (inlineResumeBtn) {
        inlineResumeBtn.onclick = () => {
            const pauseBtn = document.getElementById("btn-drill-pause");
            if (pauseBtn) pauseBtn.click();
        };
    }

    // 6. Conquest Challenge Trigger
    const btnChallengeStart = document.getElementById("btn-challenge-start");
    if (btnChallengeStart) {
        btnChallengeStart.onclick = () => {
            if (isChallengeActive) {
                endChallengeRun(false, true); // Abort
            } else {
                startChallengeRun();
            }
        };
    }

    // 7. Auto-pause logic on document click outside the drill card
    document.addEventListener("click", (e) => {
        if (drillIsPlaying && !isChallengeActive) {
            const drillCard = document.getElementById("unified-drill-card");
            if (drillCard && !drillCard.contains(e.target) && !e.target.closest(".speed-tab-btn") && !e.target.closest("#mobile-floating-nav")) {
                const pauseBtn = document.getElementById("btn-drill-pause");
                if (pauseBtn && pauseBtn.querySelector("span").innerText === "Pause") {
                    pauseBtn.click();
                }
            }
        }
    });

    // 8. Auto-pause logic on browser blur (switching tabs/windows)
    window.addEventListener("blur", () => {
        if (drillIsPlaying) {
            const pauseBtn = document.getElementById("btn-drill-pause");
            if (pauseBtn && pauseBtn.querySelector("span").innerText === "Pause") {
                pauseBtn.click();
            }
            startIdleTimer();
        }
    });

    // 9. Conquest Capsule Popover bindings
    const btnConquestCapsule = document.getElementById("btn-conquest-capsule");
    const conquestPopover = document.getElementById("conquest-popover");
    const btnConquestPopoverClose = document.getElementById("btn-conquest-popover-close");

    if (btnConquestCapsule && conquestPopover) {
        btnConquestCapsule.onclick = (e) => {
            e.stopPropagation();
            if (isChallengeActive) {
                speakText("Challenge in progress");
                alert("Conquest run is active! Use the Close button in the simulator card to abort the challenge.");
                return;
            }
            const isHidden = conquestPopover.classList.contains("hidden");
            if (isHidden) {
                conquestPopover.classList.remove("hidden");
                void conquestPopover.offsetWidth;
                conquestPopover.classList.remove("opacity-0", "pointer-events-none", "-translate-y-2");
                conquestPopover.classList.add("translate-y-0");
            } else {
                conquestPopover.classList.add("opacity-0", "pointer-events-none", "-translate-y-2");
                conquestPopover.classList.remove("translate-y-0");
                setTimeout(() => {
                    conquestPopover.classList.add("hidden");
                }, 200);
            }
        };
    }

    if (btnConquestPopoverClose && conquestPopover) {
        btnConquestPopoverClose.onclick = (e) => {
            e.stopPropagation();
            conquestPopover.classList.add("opacity-0", "pointer-events-none", "-translate-y-2");
            conquestPopover.classList.remove("translate-y-0");
            setTimeout(() => {
                conquestPopover.classList.add("hidden");
            }, 200);
        };
    }

    document.addEventListener("click", (e) => {
        if (conquestPopover && !conquestPopover.contains(e.target) && e.target !== btnConquestCapsule) {
            conquestPopover.classList.add("opacity-0", "pointer-events-none", "-translate-y-2");
            conquestPopover.classList.remove("translate-y-0");
            setTimeout(() => {
                conquestPopover.classList.add("hidden");
            }, 200);
        }
    });

    // 10. Custom tooltips setup
    initCustomTooltips();
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
        tooltipEl.className = "fixed pointer-events-none z-[9999]";
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

    function showTooltip(target) {
        if (isScrolling) return;
        const tipText = target.getAttribute("data-tooltip") || target.getAttribute("data-title-backup");
        if (!tipText) return;
        
        tooltipEl.innerText = tipText;
        tooltipEl.classList.add("active");
        
        const rect = target.getBoundingClientRect();
        const tooltipRect = tooltipEl.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 8;
        
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 8;
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
            }, 700); 
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
window.initCustomTooltips = initCustomTooltips;
window.initSpeedDrillsPage = initSpeedDrillsPage;
