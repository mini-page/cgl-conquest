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
    const options = new Set([correct]);
    
    if (typeof correct === "string") {
        if (correct.length === 1 && correct >= "A" && correct <= "Z") {
            while (options.size < 4) {
                const charCode = correct.charCodeAt(0);
                const offset = Math.floor(Math.random() * 9) - 4; // -4 to +4
                const distractorCode = charCode + offset;
                if (distractorCode >= 65 && distractorCode <= 90 && distractorCode !== charCode) {
                    options.add(String.fromCharCode(distractorCode));
                }
            }
        } else if (correct.includes("/") || correct.includes("√") || correct === "Not Defined" || correct.includes("θ") || correct.includes("sec") || correct.includes("cosec") || correct.includes("sin") || correct.includes("cos")) {
            const allFracs = ["1/2", "1/3", "2/3", "1/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "5/6", "1/8", "3/8", "5/8", "7/8", "1/12", "1/15", "1/16", "1/10", "1/√2", "√3/2", "1/1.414", "1/√3", "√3", "Not Defined", "sec²θ", "cosec²θ", "cot θ", "cos θ", "sin θ"];
            while (options.size < 4) {
                const rand = allFracs[Math.floor(Math.random() * allFracs.length)];
                if (rand !== correct) options.add(rand);
            }
        } else if (correct.includes("%")) {
            const allPercs = ["50%", "33.33%", "66.67%", "25%", "75%", "20%", "40%", "60%", "80%", "16.67%", "83.33%", "12.5%", "37.5%", "62.5%", "87.5%", "8.33%", "6.67%", "6.25%", "10%"];
            while (options.size < 4) {
                const rand = allPercs[Math.floor(Math.random() * allPercs.length)];
                if (rand !== correct) options.add(rand);
            }
        } else if (correct.includes(":")) {
            return [correct, "1:2", "3:1", "1:1"].sort(() => Math.random() - 0.5);
        }
    } else {
        while (options.size < 4) {
            const offsets = [-3, -2, -1, 1, 2, 3, -10, 10, -5, 5, -20, 20];
            const offset = offsets[Math.floor(Math.random() * offsets.length)];
            const distractor = correct + offset;
            if (distractor > 0 && distractor !== correct) {
                options.add(distractor);
            }
        }
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
}

// Core Math Drills Question & Answer Generator
function generateQuestionTextAndAnswer(mode, level) {
    let questionText = "";
    let answer = 0;

    if (mode === "squares") {
        let min = 1, max = 10;
        if (level === "medium") { min = 11; max = 20; }
        else if (level === "advance") { min = 21; max = 30; }
        const num = Math.floor(Math.random() * (max - min + 1)) + min; 
        questionText = `${num}² = ?`;
        answer = num * num;
    } else if (mode === "cubes") {
        let min = 1, max = 7;
        if (level === "medium") { min = 8; max = 14; }
        else if (level === "advance") { min = 15; max = 20; }
        const num = Math.floor(Math.random() * (max - min + 1)) + min; 
        questionText = `${num}³ = ?`;
        answer = num * num * num;
    } else if (mode === "tables") {
        let n1Min = 2, n1Max = 12, n2Min = 1, n2Max = 10;
        if (level === "medium") {
            n1Min = 13; n1Max = 25;
        } else if (level === "advance") {
            n1Min = 26; n1Max = 40;
            n2Max = 12;
        }
        const n1 = Math.floor(Math.random() * (n1Max - n1Min + 1)) + n1Min; 
        const n2 = Math.floor(Math.random() * (n2Max - n2Min + 1)) + n2Min; 
        questionText = `${n1} × ${n2} = ?`;
        answer = n1 * n2;
    } else if (mode === "fracPerc") {
        const fracPercPairs = [
            { f: "1/2", p: "50%" }, { f: "1/3", p: "33.33%" }, { f: "2/3", p: "66.67%" },
            { f: "1/4", p: "25%" }, { f: "3/4", p: "75%" }, { f: "1/5", p: "20%" },
            { f: "2/5", p: "40%" }, { f: "3/5", p: "60%" }, { f: "4/5", p: "80%" },
            { f: "1/6", p: "16.67%" }, { f: "5/6", p: "83.33%" }, { f: "1/7", p: "14.28%" },
            { f: "1/8", p: "12.5%" }, { f: "3/8", p: "37.5%" }, { f: "5/8", p: "62.5%" },
            { f: "7/8", p: "87.5%" }, { f: "1/9", p: "11.11%" }, { f: "1/11", p: "9.09%" },
            { f: "1/12", p: "8.33%" }, { f: "1/15", p: "6.67%" }, { f: "1/16", p: "6.25%" }
        ];
        let minIdx = 0, maxIdx = 6;
        if (level === "medium") { minIdx = 7; maxIdx = 13; }
        else if (level === "advance") { minIdx = 14; maxIdx = 20; }
        const subList = fracPercPairs.slice(minIdx, maxIdx + 1);
        const item = subList[Math.floor(Math.random() * subList.length)];
        const type = Math.floor(Math.random() * 2); 
        if (type === 0) {
            questionText = `Percentage value of fraction '${item.f}' = ?`;
            answer = item.p;
        } else {
            questionText = `Fraction value of percentage '${item.p}' = ?`;
            answer = item.f;
        }
    } else if (mode === "triplets") {
        const baseTriplets = [
            [3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25],
            [9, 40, 41], [11, 60, 61], [12, 35, 37], [20, 21, 29]
        ];
        const base = baseTriplets[Math.floor(Math.random() * baseTriplets.length)];
        let mult = 1;
        if (level === "medium") mult = Math.floor(Math.random() * 2) + 2; 
        else if (level === "advance") mult = Math.floor(Math.random() * 3) + 4; 
        const trip = base.map(val => val * mult);

        const blankIdx = Math.floor(Math.random() * 3);
        answer = trip[blankIdx];

        const displayArr = trip.map((val, idx) => idx === blankIdx ? "?" : val);
        questionText = `Triplet: ${displayArr.join(", ")}`;
    } else if (mode === "algebra") {
        const a = Math.floor(Math.random() * 6) + 3; 
        const b = Math.floor(Math.random() * 2) + 1; 
        let type = 0;
        if (level === "easy") {
            type = Math.floor(Math.random() * 2); 
        } else if (level === "medium") {
            const choices = [2, 4]; 
            type = choices[Math.floor(Math.random() * choices.length)];
        } else {
            const choices = [3, 5]; 
            type = choices[Math.floor(Math.random() * choices.length)];
        }

        if (type === 0) {
            questionText = `If a = ${a}, b = ${b}, find value of a + b`;
            answer = a + b;
        } else if (type === 1) {
            questionText = `If a = ${a}, b = ${b}, find value of a - b`;
            answer = a - b;
        } else if (type === 2) {
            questionText = `If a = ${a}, b = ${b}, find value of ab`;
            answer = a * b;
        } else if (type === 3) {
            questionText = `If a = ${a}, b = ${b}, find value of a² - b²`;
            answer = (a * a) - (b * b);
        } else if (type === 4) {
            questionText = `If a = ${a}, b = ${b}, find value of a² + b²`;
            answer = (a * a) + (b * b);
        } else {
            questionText = `If a = ${a}, b = ${b}, find value of (a-b)²`;
            answer = (a - b) * (a - b);
        }
    } else if (mode === "lcm") {
        const list = [
            { n: [2, 3, 4], a: 12 }, { n: [3, 4, 6], a: 12 }, { n: [4, 6, 8], a: 24 },
            { n: [6, 8, 12], a: 24 }, { n: [5, 10, 15], a: 30 }, { n: [6, 9, 12], a: 36 },
            { n: [8, 12, 16], a: 48 }, { n: [10, 12, 15], a: 60 }, { n: [12, 15, 20], a: 60 },
            { n: [8, 12, 15], a: 120 }, { n: [12, 16, 24], a: 48 }, { n: [15, 20, 30], a: 60 },
            { n: [9, 12, 18], a: 36 }
        ];
        let minIdx = 0, maxIdx = 3;
        if (level === "medium") { minIdx = 4; maxIdx = 8; }
        else if (level === "advance") { minIdx = 9; maxIdx = 12; }
        const subList = list.slice(minIdx, maxIdx + 1);
        const item = subList[Math.floor(Math.random() * subList.length)];
        const shuffled = [...item.n].sort(() => Math.random() - 0.5);
        questionText = `LCM of (${shuffled.join(", ")}) = ?`;
        answer = item.a;
    } else if (mode === "hcf") {
        let minF = 2, maxF = 6;
        if (level === "medium") { minF = 7; maxF = 12; }
        else if (level === "advance") { minF = 13; maxF = 20; }
        const f = Math.floor(Math.random() * (maxF - minF + 1)) + minF;
        const multipliers = [
            [2, 3, 5], [2, 5, 7], [3, 4, 5], [3, 5, 7], [2, 3, 7], [4, 5, 7]
        ];
        const mults = multipliers[Math.floor(Math.random() * multipliers.length)];
        questionText = `HCF of (${f * mults[0]}, ${f * mults[1]}, ${f * mults[2]}) = ?`;
        answer = f;
    } else if (mode === "alphabets") {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let chosenChar = "";
        let type = 0;
        
        if (level === "easy") {
            const lettersSub = "ABCDEFGHIJ";
            chosenChar = lettersSub[Math.floor(Math.random() * lettersSub.length)];
            type = 0;
        } else if (level === "medium") {
            const lettersSub = "KLMNOPQRSTUVWXYZ";
            chosenChar = lettersSub[Math.floor(Math.random() * lettersSub.length)];
            type = Math.floor(Math.random() * 2); 
        } else {
            chosenChar = letters[Math.floor(Math.random() * letters.length)];
            type = 2; 
        }
        
        if (type === 0) {
            questionText = `Position of Letter '${chosenChar}' = ?`;
            answer = chosenChar.charCodeAt(0) - 64; 
        } else if (type === 1) {
            questionText = `Reverse Position of '${chosenChar}' (A=26) = ?`;
            answer = 27 - (chosenChar.charCodeAt(0) - 64); 
        } else {
            questionText = `Opposite Letter of '${chosenChar}' = ?`;
            answer = String.fromCharCode(155 - chosenChar.charCodeAt(0)); 
        }
    } else if (mode === "geomCenters") {
        let type = 0;
        if (level === "easy") {
            const choices = [0, 1, 5];
            type = choices[Math.floor(Math.random() * choices.length)];
        } else if (level === "medium") {
            const choices = [0, 1, 2];
            type = choices[Math.floor(Math.random() * choices.length)];
        } else {
            const choices = [3, 4];
            type = choices[Math.floor(Math.random() * choices.length)];
        }

        if (type === 0) {
            const a = (Math.floor(Math.random() * 9) + 4) * 10; 
            questionText = `In △ABC, I is Incenter. If ∠A = ${a}°, find ∠BIC.`;
            answer = 90 + (a / 2);
        } else if (type === 1) {
            const a = (Math.floor(Math.random() * 10) + 4) * 10; 
            questionText = `In △ABC, O is Orthocenter. If ∠A = ${a}°, find ∠BOC.`;
            answer = 180 - a;
        } else if (type === 2) {
            const a = (Math.floor(Math.random() * 6) + 3) * 10; 
            questionText = `In △ABC, C is Circumcenter. If ∠A = ${a}°, find ∠BOC.`;
            answer = 2 * a;
        } else if (type === 3) {
            const triplets = [
                [3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15]
            ];
            const rip = triplets[Math.floor(Math.random() * triplets.length)];
            questionText = `In right △ABC (sides ${rip[0]}, ${rip[1]}, ${rip[2]}), find Inradius.`;
            answer = (rip[0] + rip[1] - rip[2]) / 2;
        } else if (type === 4) {
            const triplets = [
                [3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [10, 24, 26]
            ];
            const rip = triplets[Math.floor(Math.random() * triplets.length)];
            questionText = `In right △ABC (hypotenuse ${rip[2]}), find Circumradius.`;
            answer = rip[2] / 2;
        } else {
            questionText = `Centroid G divides median AD from vertex (AG:GD) in ratio = ?`;
            answer = "2:1";
        }
    } else if (mode === "trigReflex") {
        let type = 0;
        if (level === "easy") {
            type = Math.floor(Math.random() * 2); 
        } else if (level === "medium") {
            const choices = [1, 2]; 
            type = choices[Math.floor(Math.random() * choices.length)];
        } else {
            type = 3; 
        }

        if (type === 0) {
            const list = [
                { q: "sin(0°)", a: "0" }, { q: "sin(30°)", a: "1/2" },
                { q: "sin(45°)", a: "1/√2" }, { q: "sin(60°)", a: "√3/2" }, { q: "sin(90°)", a: "1" }
            ];
            const item = list[Math.floor(Math.random() * list.length)];
            questionText = `Evaluate: ${item.q} = ?`;
            answer = item.a;
        } else if (type === 1) {
            const list = [
                { q: "cos(0°)", a: "1" }, { q: "cos(30°)", a: "√3/2" },
                { q: "cos(45°)", a: "1/&radic;2" }, { q: "cos(60°)", a: "1/2" }, { q: "cos(90°)", a: "0" }
            ];
            const item = list[Math.floor(Math.random() * list.length)];
            questionText = `Evaluate: ${item.q} = ?`;
            answer = item.a;
        } else if (type === 2) {
            const list = [
                { q: "tan(0°)", a: "0" }, { q: "tan(30°)", a: "1/√3" },
                { q: "tan(45°)", a: "1" }, { q: "tan(60°)", a: "√3" }, { q: "tan(90°)", a: "Not Defined" }
            ];
            const item = list[Math.floor(Math.random() * list.length)];
            questionText = `Evaluate: ${item.q} = ?`;
            answer = item.a;
        } else {
            const list = [
                { q: "sin²θ + cos²θ", a: "1" }, { q: "1 + tan²θ", a: "sec²θ" },
                { q: "1 + cot²θ", a: "cosec²θ" }, { q: "sin(90° - θ)", a: "cos θ" },
                { q: "cos(90° - θ)", a: "sin θ" }, { q: "tan(90° - θ)", a: "cot θ" }
            ];
            const item = list[Math.floor(Math.random() * list.length)];
            questionText = `Identity: ${item.q} = ?`;
            answer = item.a;
        }
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
    if (selectLevel) selectLevel.classList.add("hidden");
    const stopBtn = document.getElementById("btn-drill-stop");
    if (stopBtn) stopBtn.classList.remove("hidden");

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
                if (b.innerText === String(drillAnswerVal)) {
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
        const val = b.innerText;
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
    if (selectLevel) selectLevel.classList.remove("hidden");
    const stopBtn = document.getElementById("btn-drill-stop");
    if (stopBtn) stopBtn.classList.add("hidden");

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

    // Hide difficulty dropdown and show close button in header
    const selectLevel = document.getElementById("select-maths-level");
    if (selectLevel) selectLevel.classList.add("hidden");
    const stopBtn = document.getElementById("btn-drill-stop");
    if (stopBtn) stopBtn.classList.remove("hidden");

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

    const btnChallengeStart = document.getElementById("btn-challenge-start");
    if (btnChallengeStart) {
        btnChallengeStart.innerHTML = `<i class="fa-solid fa-play mr-1"></i> Start Challenge`;
        btnChallengeStart.className = "w-full bg-accentCyan hover:bg-cyan-500 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition duration-200 shadow-md";
    }

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
            resetDrillSession();
            generateDrillQuestion();
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
                
                // Show inline pause overlay
                const inlineOverlay = document.getElementById("drill-paused-overlay");
                if (inlineOverlay) inlineOverlay.classList.remove("hidden");
                const inlineWrapper = document.getElementById("drill-interactive-area");
                if (inlineWrapper) inlineWrapper.classList.add("blur-md");
                
                speakText("Paused");
            } else {
                drillIsPlaying = true;
                pauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i> <span>Pause</span>`;
                
                // Hide inline pause overlay
                const inlineOverlay = document.getElementById("drill-paused-overlay");
                if (inlineOverlay) inlineOverlay.classList.add("hidden");
                const inlineWrapper = document.getElementById("drill-interactive-area");
                if (inlineWrapper) inlineWrapper.classList.remove("blur-md");
                
                // Hide difficulty dropdown and show close button in header
                const selectLevel = document.getElementById("select-maths-level");
                if (selectLevel) selectLevel.classList.add("hidden");
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

    // 9. Custom tooltips setup
    initCustomTooltips();
}

// Global reference exposed to navigation resets
window.resetDrillSession = resetDrillSession;

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

function parseMarkdown(text) {
    if (!text) return "";
    
    let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Headings
    html = html.replace(/^### (.*?)$/gm, '<h5 class="text-xs font-bold text-white mt-2 mb-1">$1</h5>');
    html = html.replace(/^## (.*?)$/gm, '<h4 class="text-sm font-bold text-white mt-3 mb-1">$1</h4>');
    html = html.replace(/^# (.*?)$/gm, '<h3 class="text-base font-extrabold text-white mt-4 mb-2">$1</h3>');

    // Bold (**text**)
    html = html.replace(/\*\*(.*?)\*\"/g, '<strong class="text-white font-extrabold">$1</strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-extrabold">$1</strong>');

    // Italic (*text*)
    html = html.replace(/\*(.*?)\*/g, '<em class="text-gray-200 italic">$1</em>');

    // Links ([text](url))
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-accentCyan hover:underline font-bold">$1</a>');

    // Blockquotes
    html = html.replace(/^&gt; (.*?)$/gm, '<blockquote class="border-l-2 border-accentPurple pl-2 text-gray-400 my-1.5 italic bg-white/2px p-1 rounded">$1</blockquote>');

    // Code blocks / Inline code
    html = html.replace(/`(.*?)`/g, '<code class="bg-black/40 px-1 py-0.5 rounded font-mono text-accentCyan text-[10px]">$1</code>');

    // Horizontal Rule
    html = html.replace(/^---$/gm, '<hr class="border-white/5 my-2">');

    // Parse tables
    const lines = html.split('\n');
    let inTable = false;
    let tableHtml = '';
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (line.startsWith('|') && line.endsWith('|')) {
            const cells = line.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
            if (!inTable) {
                inTable = true;
                tableHtml = '<div class="overflow-x-auto my-3"><table class="w-full text-left text-[11px] border-collapse"><thead>';
                tableHtml += '<tr class="border-b border-white/10 text-gray-400 font-bold text-[9px] uppercase">';
                cells.forEach(c => tableHtml += `<th class="pb-1">${c}</th>`);
                tableHtml += '</tr></thead><tbody class="text-gray-300 font-mono">';
            } else {
                if (cells.every(c => c.match(/^:-*:-*$|^-+$|^:-+$|^-+:$/))) {
                    lines[i] = '';
                    continue;
                }
                tableHtml += '<tr class="border-b border-white/5">';
                cells.forEach(c => tableHtml += `<td class="py-1">${c}</td>`);
                tableHtml += '</tr>';
            }
            lines[i] = '';
        } else {
            if (inTable) {
                inTable = false;
                tableHtml += '</tbody></table></div>';
                lines[i] = tableHtml + '\n' + lines[i];
                tableHtml = '';
            }
        }
    }
    if (inTable) {
        tableHtml += '</tbody></table></div>';
        lines.push(tableHtml);
    }
    html = lines.filter(l => l !== '').join('\n');

    // Bullet Lists (- or *)
    html = html.replace(/^\s*[-*]\s+(.*?)$/gm, '<li class="list-disc list-inside ml-2 text-gray-300">$1</li>');

    // Lists wrapper
    html = html.replace(/(<li.*?>.*?<\/li>)+/gs, '<ul>$&</ul>');

    // Newlines mapping
    html = html.replace(/\n\n/g, '<p class="my-2"></p>');
    html = html.replace(/\n/g, '<br>');

    return html;
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

function triggerMathTypesetting() {
    if (window.triggerMathTypesetting) {
        window.triggerMathTypesetting();
    } else if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise().catch(err => console.log('MathJax error:', err));
    }
}

// Expose functions globally
window.initCustomTooltips = initCustomTooltips;
window.initSpeedDrillsPage = initSpeedDrillsPage;
window.startIdleTimer = startIdleTimer;
