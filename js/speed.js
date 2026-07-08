// Modal drill states
window.window.isDrillModalActive = false;
let activeModalDrillType = "";
// === SPEED DRILLS & CHALLENGES MODULE ===
// 14. SPEED DRILLS ("MAKE IT FAST"), FLASHCARDS & COMPUTER QUIZ ENGINES
// ==========================================================================

const EMBEDDED_FLASHCARDS = [
    { word: "Pernicious", def: "Having a harmful effect, especially in a gradual or subtle way.", ex: "\"The pernicious influence of negative company.\"" },
    { word: "Supercilious", def: "Behaving or looking as though one thinks one is superior to others.", ex: "\"A supercilious lady who looked down on servants.\"" },
    { word: "Ephemeral", def: "Lasting for a very short time; transient.", ex: "\"Fame is ephemeral, but knowledge stays.\"" },
    { word: "Alacrity", def: "Brisk and cheerful readiness.", ex: "\"She accepted the study challenge with alacrity.\"" },
    { word: "Cacophony", def: "A harsh, discordant mixture of sounds.", ex: "\"The cacophony of the busy marketplace.\"" },
    { word: "Benevolent", def: "Well-meaning and kindly.", ex: "\"A benevolent teacher who helped poor children.\"" },
    { word: "Burn the midnight oil", def: "To study or work late into the night.", ex: "\"He is burning the midnight oil for the CGL exam.\"" },
    { word: "A feather in one's cap", def: "An achievement to be proud of.", ex: "\"Clearing CGL with Rank 1 will be a feather in his cap.\"" },
    { word: "By leaps and bounds", def: "Very rapidly; making quick progress.", ex: "\"His speed has improved by leaps and bounds.\"" },
    { word: "Spick and span", def: "Neat, clean, and well-organized.", ex: "\"The study desk was kept spick and span.\"" },
    { word: "Loquacious", def: "Tending to talk a great deal; extremely talkative.", ex: "\"A loquacious candidate lost time in interviews.\"" },
    { word: "Pragmatic", def: "Dealing with things sensibly and realistically based on practical experiences.", ex: "\"A pragmatic study plan is better than a fantasy one.\"" },
    { word: "Red Herring", def: "Something, especially a clue, that is or is intended to be misleading.", ex: "\"The mock question had a red herring option.\"" },
    { word: "At one's beck and call", def: "Always ready to obey someone's orders immediately.", ex: "\"You must not be at anyone's beck and call during study hours.\"" },
    { word: "Frugal", def: "Sparing or economical with regard to money or food; simple.", ex: "\"Living a frugal life to save time and resources.\"" }
];

const EMBEDDED_ENGLISH_QUESTIONS = [
    { q: "Synonym of 'ABATE':", o: ["Diminish", "Increase", "Prolong", "Intensify"], a: 0 },
    { q: "Antonym of 'ALACRITY':", o: ["Enthusiasm", "Apathy", "Swiftness", "Zeal"], a: 1 },
    { q: "Find the correctly spelled word:", o: ["Committee", "Comitee", "Committe", "Comitte"], a: 0 },
    { q: "One Word Substitution: 'One who hates mankind'", o: ["Philanthropist", "Misogynist", "Misanthrope", "Egotist"], a: 2 },
    { q: "Idiom Meaning: 'To spill the beans'", o: ["To cook beans", "To reveal a secret", "To waste money", "To cause an accident"], a: 1 },
    { q: "Synonym of 'FUTILE':", o: ["Fruitful", "Useless", "Productive", "Important"], a: 1 },
    { q: "Antonym of 'HOSTILE':", o: ["Friendly", "Adverse", "Antagonistic", "Unkind"], a: 0 },
    { q: "Identify the part of speech of the underlined word: 'She runs fast.'", o: ["Noun", "Adjective", "Adverb", "Verb"], a: 2 }
];

const EMBEDDED_REASONING_QUESTIONS = [
    { q: "Complete the series: 3, 7, 15, 31, 63, ?", o: ["127", "95", "128", "125"], a: 0 },
    { q: "If 'MONKEY' is coded as 'XDJMNL', how is 'TIGER' coded?", o: ["SDFHS", "QDFHS", "QDYTR", "SDFTR"], a: 1 },
    { q: "In a family, A is B's brother, C is A's father, D is C's mother. How is B related to D?", o: ["Grandson", "Granddaughter", "Grandchild", "Daughter-in-law"], a: 2 },
    { q: "Select the odd one out: 27, 64, 125, 144", o: ["27", "64", "125", "144"], a: 3 },
{ q: "Find the next term in the series: B2D, E3G, H4J, ?", o: ["K5M", "K6N", "L5M", "K5N"], a: 0, d: "easy" },
    { q: "Pointing to a photograph, a man said: 'I have no brother or sister, but that man's father is my father's son.' Whose photograph was it?", o: ["His own", "His father's", "His son's", "His nephew's"], a: 2, d: "hard" },
    { q: "If '+' means '×', '-' means '÷', '×' means '-' and '÷' means '+', then: 16 + 4 - 8 × 2 ÷ 3 = ?", o: ["12", "9", "6", "11"], a: 1, d: "medium" },
    { q: "A clock shows 4:30. If the minute hand points East, in which direction does the hour hand point?", o: ["North", "North-East", "South-East", "North-West"], a: 1, d: "hard" },
    { q: "If A=1, FAT=27, then FAITH = ?", o: ["44", "42", "40", "41"], a: 0, d: "hard" },
    { q: "Which number replaces the question mark? 12 : 144 :: 13 : ?", o: ["169", "156", "182", "196"], a: 0, d: "medium" }
];

const EMBEDDED_COMP_QUESTIONS = [
    { q: "Which of the following keyboard shortcut is used to close the active application window in MS Windows OS?", o: ["Alt + F4", "Ctrl + C", "Win + L", "Alt + Tab"], a: 0, d: "easy" },
    { q: "What is the default port number used by HTTPS (Secure Hypertext Protocol)?", o: ["Port 80", "Port 21", "Port 443", "Port 22"], a: 2, d: "easy" },
    { q: "Which keyboard command opens the 'Run' utility dialog box in Windows OS?", o: ["Win + R", "Win + E", "Win + D", "Ctrl + Shift + Esc"], a: 0, d: "easy" },
    { q: "What is the network protocol port number commonly used for sending email messages (SMTP)?", o: ["Port 25", "Port 110", "Port 143", "Port 53"], a: 0, d: "medium" },
    { q: "Which key combination launches the Windows Task Manager directly?", o: ["Ctrl + Alt + Del", "Ctrl + Shift + Esc", "Win + Tab", "Alt + Shift + Enter"], a: 1, d: "medium" },
    { q: "In Microsoft Excel, which cell referencing remains completely fixed when a formula is copy-pasted?", o: ["Relative (A1)", "Absolute ($A$1)", "Mixed ($A1)", "Dynamic (A1:B1)"], a: 1, d: "medium" },
    { q: "Which Excel formula is used to look up a value in the leftmost column of a table and return a value in the same row?", o: ["HLOOKUP", "VLOOKUP", "LOOKUP", "MATCH"], a: 1, d: "medium" },
    { q: "What malware encrypts the user's hard drive files and demands payment to decrypt them?", o: ["Ransomware", "Trojan", "Adware", "Rootkit"], a: 0, d: "hard" },
    { q: "A firewall is primarily used in networking systems to protect against which of the following?", o: ["Virus transmission in flash drives", "Unauthorized incoming/outgoing network access", "Power supply fluctuations", "Physical theft of hard disks"], a: 1, d: "hard" },
    { q: "Which type of malware replicates itself across computer networks without needing to attach to a host file?", o: ["Trojan Horse", "Ransomware", "Worm", "Spyware"], a: 2, d: "hard" }
];

const EMBEDDED_GK_QUESTIONS = [
    { q: "River Ganga originates from which of the following glaciers?", o: ["Yamunotri", "Gangotri", "Alkapuri", "Milam"], a: 1, d: "easy" },
    { q: "Which river is also known as 'Dakshin Ganga' due to its length and size?", o: ["Krishna", "Cauvery", "Godavari", "Mahanadi"], a: 2, d: "easy" },
    { q: "On which river is the Sardar Sarovar Dam constructed?", o: ["Narmada", "Tapi", "Sabarmati", "Mahi"], a: 0, d: "easy" },
    { q: "Which of the following is the highest peak in the Western Ghats of India?", o: ["Doda Betta", "Anamudi", "Mahendragiri", "Kalsubai"], a: 1, d: "medium" },
    { q: "The Kanchenjunga peak, the third highest mountain in the world, is located in which Indian state?", o: ["Uttarakhand", "Himachal Pradesh", "Sikkim", "Arunachal Pradesh"], a: 2, d: "medium" },
    { q: "Which is the longest dam in India, built across the Mahanadi river in Odisha?", o: ["Tehri Dam", "Bhakra Dam", "Hirakud Dam", "Nagarjuna Sagar Dam"], a: 2, d: "medium" },
    { q: "Which boundary line separates the territories of India and China?", o: ["Radcliffe Line", "McMahon Line", "Durand Line", "Line of Control"], a: 1, d: "medium" },
    { q: "In which year did the famous Battle of Haldighati take place between Akbar and Maharana Pratap?", o: ["1556", "1576", "1526", "1586"], a: 1, d: "hard" },
    { q: "Who was the founder of the ancient Maurya Dynasty in India?", o: ["Ashoka", "Chandragupta Maurya", "Bindusara", "Chandragupta I"], a: 1, d: "hard" },
    { q: "The historic First Battle of Panipat was fought in which year?", o: ["1526", "1556", "1761", "1530"], a: 0, d: "hard" },
    { q: "In which year did Mahatma Gandhi lead the Dandi Salt March?", o: ["1920", "1930", "1942", "1919"], a: 1, d: "hard" }
];

// Calculation Drills & Sectional Challenge States
let drillMode = "squares"; 
let drillAnswerVal = null;
let drillAttempts = 0;
let drillCorrect = 0;
let drillStreak = 0;
let drillTimerInterval = null;
let drillTimerSecs = 15;
let drillIsPlaying = false; 

// Challenge Engine States
let isChallengeActive = false;
let challengeTimeRemaining = 900; 
let challengeTimerInterval = null;
let challengeQuestionIndex = 0; 
let challengeScore = 0;
let challengeActiveTab = "maths"; 
let challengeCorrectAnswerVal = null; 

function initSpeedDrillsPage() {
    // 0. Speed Sub-Tabs selector
    const speedTabs = document.querySelectorAll(".speed-tab-btn");
    const speedPanels = document.querySelectorAll(".speed-tab-content");
    speedTabs.forEach(tab => {
        tab.onclick = () => {
            if (isChallengeActive) {
                speakText("Challenge in progress");
                alert("Conquest run is active! Abort or complete the current 15-minute challenge before switching tabs.");
                return;
            }
            
            speedTabs.forEach(t => t.classList.remove("active-nav-tab"));
            tab.classList.add("active-nav-tab");
            
            const target = tab.getAttribute("data-target");
            speedPanels.forEach(p => p.classList.add("hidden"));
            const targetPanel = document.getElementById(target);
            if (targetPanel) targetPanel.classList.remove("hidden");
            
            if (target !== "speed-tab-maths") {
                drillIsPlaying = false;
                clearInterval(drillTimerInterval);
                const pauseBtn = document.getElementById("btn-drill-pause");
                if (pauseBtn) pauseBtn.innerHTML = `<i class="fa-solid fa-play mr-1"></i> Start`;
                const optionsGrid = document.getElementById("drill-options");
                if (optionsGrid) optionsGrid.classList.add("hidden");
            } else {
                resetDrillSession();
            }
        };
    });

    // 0.5 Challenge Controller Start/Abort Trigger
    const btnChallengeStart = document.getElementById("btn-challenge-start");
    if (btnChallengeStart) {
        btnChallengeStart.onclick = () => {
            if (isChallengeActive) {
                endChallengeRun(false, true);
            } else {
                startChallengeRun();
            }
        };
    }

    // 1. Math Drills Mode Buttons Initializer (Free Mode)
    const modeBtns = document.querySelectorAll(".drill-mode-btn");
    modeBtns.forEach(btn => {
        btn.onclick = () => {
            if (isChallengeActive) return;
            modeBtns.forEach(b => b.classList.remove("active-nav-tab"));
            btn.classList.add("active-nav-tab");
            drillMode = btn.getAttribute("data-mode");
            resetDrillSession();
        };
    });

    const pauseBtn = document.getElementById("btn-drill-pause");
    if (pauseBtn) {
        pauseBtn.onclick = () => {
            if (isChallengeActive) return; 
            if (drillIsPlaying) {
                drillIsPlaying = false;
                pauseBtn.innerHTML = `<i class="fa-solid fa-play mr-1"></i> Start`;
                clearInterval(drillTimerInterval);
                closeDrillModal();
                speakText("Paused");
            } else {
                drillIsPlaying = true;
                pauseBtn.innerHTML = `<i class="fa-solid fa-pause mr-1"></i> Pause`;
                openDrillModal("Maths Speed Drill: " + drillMode.toUpperCase(), true);
                activeModalDrillType = "maths";
                generateDrillQuestion();
            }
        };
    }

    // 2. Vocab Flashcards Initializer (Free Mode)
    let currentVocabIndex = 0;
    const updateVocabCardDisplay = () => {
        const item = FLASHCARDS[currentVocabIndex];
        const card = document.getElementById("vocab-card");
        if (card) card.classList.remove("flipped");
        
        setTimeout(() => {
            const frontWord = document.getElementById("vocab-front-word");
            const backDef = document.getElementById("vocab-back-definition");
            const backEx = document.getElementById("vocab-back-example");
            const counter = document.getElementById("vocab-counter");

            if (frontWord) frontWord.innerText = item.word;
            if (backDef) backDef.innerText = item.def;
            if (backEx) backEx.innerText = item.ex;
            if (counter) counter.innerText = `${currentVocabIndex + 1} / ${FLASHCARDS.length}`;
        }, 150);
    };

    const prevVocabBtn = document.getElementById("btn-vocab-prev");
    const nextVocabBtn = document.getElementById("btn-vocab-next");

    if (prevVocabBtn) {
        prevVocabBtn.onclick = () => {
            if (isChallengeActive) return;
            currentVocabIndex = (currentVocabIndex - 1 + FLASHCARDS.length) % FLASHCARDS.length;
            updateVocabCardDisplay();
        };
    }
    if (nextVocabBtn) {
        nextVocabBtn.onclick = () => {
            if (isChallengeActive) return;
            currentVocabIndex = (currentVocabIndex + 1) % FLASHCARDS.length;
            updateVocabCardDisplay();
        };
    }

    // 3. English Quiz Initializer (Free Mode)
    let currentEngQIndex = 0;
    let engAttempts = 0;
    let engCorrect = 0;

    const renderEnglishQuestion = () => {
        if (isChallengeActive) return; 
        const item = ENGLISH_QUESTIONS[currentEngQIndex];
        const qNum = document.getElementById("eng-q-num");
        const qText = document.getElementById("eng-q-text");

        if (qNum) qNum.innerText = currentEngQIndex + 1;
        if (qText) qText.innerText = item.q;

        const optionsContainer = document.getElementById("eng-options");
        if (!optionsContainer) return;
        
        optionsContainer.innerHTML = "";

        item.o.forEach((option, idx) => {
            const btn = document.createElement("button");
            btn.className = "eng-opt-btn w-full text-left p-3 rounded-xl border border-white/5 hover:border-accentRose bg-white/2px hover:bg-white/5 transition text-xs font-semibold text-gray-300";
            btn.innerText = option;
            btn.onclick = () => {
                if (window.isDrillModalActive) {
                    highlightModalOptions(item.a, idx, "english");
                }
                const modalScore = document.getElementById("modal-drill-score");
                if (modalScore) setTimeout(() => { modalScore.innerText = `Score: ${engCorrect}/${engAttempts}`; }, 50);
                engAttempts++;
                const buttons = optionsContainer.querySelectorAll(".eng-opt-btn");
                buttons.forEach((b, bIdx) => {
                    b.disabled = true;
                    if (bIdx === item.a) {
                        b.className = b.className.replace("border-white/5", "border-accentGreen bg-accentGreen/15 text-accentGreen");
                    } else if (bIdx === idx) {
                        b.className = b.className.replace("border-white/5", "border-accentRose bg-accentRose/15 text-accentRose");
                    }
                });

                if (idx === item.a) {
                    engCorrect++;
                    speakText("Correct");
                } else {
                    speakText("Wrong");
                }

                const scoreEl = document.getElementById("eng-quiz-score");
                if (scoreEl) scoreEl.innerText = `Score: ${engCorrect}/${engAttempts}`;

                setTimeout(() => {
                    currentEngQIndex = (currentEngQIndex + 1) % ENGLISH_QUESTIONS.length;
                    renderEnglishQuestion();
                }, 1800);
            };
            optionsContainer.appendChild(btn);
        });
        
        // Sync modal choices
        syncModalContent(
            item.q, 
            item.o, 
            (val, idx) => {
                const btns = optionsContainer.querySelectorAll(".eng-opt-btn");
                if (btns[idx]) btns[idx].click();
            }, 
            "english"
        );
    };

    const resetEngBtn = document.getElementById("btn-eng-reset");
    if (resetEngBtn) {
        resetEngBtn.onclick = () => {
            if (isChallengeActive) return;
            currentEngQIndex = 0;
            engAttempts = 0;
            engCorrect = 0;
            const scoreEl = document.getElementById("eng-quiz-score");
            if (scoreEl) scoreEl.innerText = "Score: 0/0";
            renderEnglishQuestion();
        };
    }

    // 4. Reasoning Quiz Initializer (Free Mode)
    let currentReasQIndex = 0;
    let reasAttempts = 0;
    let reasCorrect = 0;

    const renderReasoningQuestion = () => {
        if (isChallengeActive) return; 
        const item = REASONING_QUESTIONS[currentReasQIndex];
        const qNum = document.getElementById("reas-q-num");
        const qText = document.getElementById("reas-q-text");

        if (qNum) qNum.innerText = currentReasQIndex + 1;
        if (qText) qText.innerText = item.q;

        const optionsContainer = document.getElementById("reas-options");
        if (!optionsContainer) return;
        
        optionsContainer.innerHTML = "";

        item.o.forEach((option, idx) => {
            const btn = document.createElement("button");
            btn.className = "reas-opt-btn w-full text-left p-3 rounded-xl border border-white/5 hover:border-accentPurple bg-white/2px hover:bg-white/5 transition text-xs font-semibold text-gray-300";
            btn.innerText = option;
            btn.onclick = () => {
                if (window.isDrillModalActive) {
                    highlightModalOptions(item.a, idx, "reasoning");
                }
                const modalScore = document.getElementById("modal-drill-score");
                if (modalScore) setTimeout(() => { modalScore.innerText = `Score: ${reasCorrect}/${reasAttempts}`; }, 50);
                reasAttempts++;
                const buttons = optionsContainer.querySelectorAll(".reas-opt-btn");
                buttons.forEach((b, bIdx) => {
                    b.disabled = true;
                    if (bIdx === item.a) {
                        b.className = b.className.replace("border-white/5", "border-accentGreen bg-accentGreen/15 text-accentGreen");
                    } else if (bIdx === idx) {
                        b.className = b.className.replace("border-white/5", "border-accentPurple bg-accentPurple/15 text-accentPurple");
                    }
                });

                if (idx === item.a) {
                    reasCorrect++;
                    speakText("Correct");
                } else {
                    speakText("Incorrect");
                }

                const scoreEl = document.getElementById("reas-quiz-score");
                if (scoreEl) scoreEl.innerText = `Score: ${reasCorrect}/${reasAttempts}`;

                setTimeout(() => {
                    currentReasQIndex = (currentReasQIndex + 1) % REASONING_QUESTIONS.length;
                    renderReasoningQuestion();
                }, 1800);
            };
            optionsContainer.appendChild(btn);
        });
        
        // Sync modal choices
        syncModalContent(
            item.q, 
            item.o, 
            (val, idx) => {
                const btns = optionsContainer.querySelectorAll(".reas-opt-btn");
                if (btns[idx]) btns[idx].click();
            }, 
            "reasoning"
        );
    };

    const resetReasBtn = document.getElementById("btn-reas-reset");
    if (resetReasBtn) {
        resetReasBtn.onclick = () => {
            if (isChallengeActive) return;
            currentReasQIndex = 0;
            reasAttempts = 0;
            reasCorrect = 0;
            const scoreEl = document.getElementById("reas-quiz-score");
            if (scoreEl) scoreEl.innerText = "Score: 0/0";
            renderReasoningQuestion();
        };
    }

    // 5. Computer Quiz Initializer (Free Mode)
    let currentCompQIndex = 0;
    let compAttempts = 0;
    let compCorrect = 0;

    const renderComputerQuestion = () => {
        if (isChallengeActive) return; 
        const item = COMP_QUESTIONS[currentCompQIndex];
        const qNum = document.getElementById("comp-q-num");
        const qText = document.getElementById("comp-q-text");

        if (qNum) qNum.innerText = currentCompQIndex + 1;
        if (qText) qText.innerText = item.q;

        const optionsContainer = document.getElementById("comp-options");
        if (!optionsContainer) return;
        
        optionsContainer.innerHTML = "";

        item.o.forEach((option, idx) => {
            const btn = document.createElement("button");
            btn.className = "comp-opt-btn w-full text-left p-3 rounded-xl border border-white/5 hover:border-accentAmber bg-white/2px hover:bg-white/5 transition text-xs font-semibold text-gray-300";
            btn.innerText = option;
            btn.onclick = () => {
                if (window.isDrillModalActive) {
                    highlightModalOptions(item.a, idx, "computer");
                }
                const modalScore = document.getElementById("modal-drill-score");
                if (modalScore) setTimeout(() => { modalScore.innerText = `Score: ${compCorrect}/${compAttempts}`; }, 50);
                compAttempts++;
                const buttons = optionsContainer.querySelectorAll(".comp-opt-btn");
                buttons.forEach((b, bIdx) => {
                    b.disabled = true;
                    if (bIdx === item.a) {
                        b.className = b.className.replace("border-white/5", "border-accentGreen bg-accentGreen/15 text-accentGreen");
                    } else if (bIdx === idx) {
                        b.className = b.className.replace("border-white/5", "border-accentAmber bg-accentAmber/15 text-accentAmber");
                    }
                });

                if (idx === item.a) {
                    compCorrect++;
                    speakText("Correct answer");
                } else {
                    speakText("Incorrect answer");
                }

                const scoreEl = document.getElementById("comp-quiz-score");
                if (scoreEl) scoreEl.innerText = `Score: ${compCorrect}/${compAttempts}`;

                setTimeout(() => {
                    currentCompQIndex = (currentCompQIndex + 1) % COMP_QUESTIONS.length;
                    renderComputerQuestion();
                }, 1800);
            };
            optionsContainer.appendChild(btn);
        });
        
        // Sync modal choices
        syncModalContent(
            item.q, 
            item.o, 
            (val, idx) => {
                const btns = optionsContainer.querySelectorAll(".comp-opt-btn");
                if (btns[idx]) btns[idx].click();
            }, 
            "computer"
        );
    };

    const resetCompBtn = document.getElementById("btn-comp-reset");
    if (resetCompBtn) {
        resetCompBtn.onclick = () => {
            if (isChallengeActive) return;
            currentCompQIndex = 0;
            compAttempts = 0;
            compCorrect = 0;
            const scoreEl = document.getElementById("comp-quiz-score");
            if (scoreEl) scoreEl.innerText = "Score: 0/0";
            renderComputerQuestion();
        };
    }

    // Load initial states
    resetDrillSession();
    updateVocabCardDisplay();
    renderEnglishQuestion();
    renderReasoningQuestion();
    renderComputerQuestion();

    // 6. GK Quiz Initializer
    let currentGkQIndex = 0;
    let gkAttempts = 0;
    let gkCorrect = 0;

    const renderGkQuestion = () => {
        if (isChallengeActive) return; 
        if (!GK_QUESTIONS || GK_QUESTIONS.length === 0) return;
        const item = GK_QUESTIONS[currentGkQIndex];
        const qNum = document.getElementById("gk-q-num");
        const qText = document.getElementById("gk-q-text");

        if (qNum) qNum.innerText = currentGkQIndex + 1;
        if (qText) qText.innerText = item.q;

        const optionsContainer = document.getElementById("gk-options");
        if (!optionsContainer) return;
        
        optionsContainer.innerHTML = "";

        item.o.forEach((option, idx) => {
            const btn = document.createElement("button");
            btn.className = "gk-opt-btn w-full text-left p-3 rounded-xl border border-white/5 hover:border-accentGreen bg-white/2px hover:bg-white/5 transition text-xs font-semibold text-gray-300";
            btn.innerText = option;
            btn.onclick = () => {
                if (window.isDrillModalActive) {
                    highlightModalOptions(item.a, idx, "gk");
                }
                const modalScore = document.getElementById("modal-drill-score");
                if (modalScore) setTimeout(() => { modalScore.innerText = `Score: ${gkCorrect}/${gkAttempts}`; }, 50);
                gkAttempts++;
                const buttons = optionsContainer.querySelectorAll(".gk-opt-btn");
                buttons.forEach((b, bIdx) => {
                    b.disabled = true;
                    if (bIdx === item.a) {
                        b.className = b.className.replace("border-white/5", "border-accentGreen bg-accentGreen/15 text-accentGreen");
                    } else if (bIdx === idx) {
                        b.className = b.className.replace("border-white/5", "border-accentRose bg-accentRose/15 text-accentRose");
                    }
                });

                if (idx === item.a) {
                    gkCorrect++;
                    speakText("Correct answer");
                } else {
                    speakText("Incorrect answer");
                }

                const scoreEl = document.getElementById("gk-quiz-score");
                if (scoreEl) scoreEl.innerText = `Score: ${gkCorrect}/${gkAttempts}`;

                setTimeout(() => {
                    currentGkQIndex = (currentGkQIndex + 1) % GK_QUESTIONS.length;
                    renderGkQuestion();
                }, 1800);
            };
            optionsContainer.appendChild(btn);
        });
        
        // Sync modal choices
        syncModalContent(
            item.q, 
            item.o, 
            (val, idx) => {
                const btns = optionsContainer.querySelectorAll(".gk-opt-btn");
                if (btns[idx]) btns[idx].click();
            }, 
            "gk"
        );
    };

    const resetGkBtn = document.getElementById("btn-gk-reset");
    if (resetGkBtn) {
        resetGkBtn.onclick = () => {
            if (isChallengeActive) return;
            currentGkQIndex = 0;
            gkAttempts = 0;
            gkCorrect = 0;
            const scoreEl = document.getElementById("gk-quiz-score");
            if (scoreEl) scoreEl.innerText = "Score: 0/0";
            renderGkQuestion();
        };
    }

    // Modal close, pause & fullscreen event triggers
    const btnDrillClose = document.getElementById("btn-drill-modal-close");
    if (btnDrillClose) btnDrillClose.onclick = () => closeDrillModal();
    
    const btnDrillPause = document.getElementById("btn-drill-modal-pause");
    if (btnDrillPause) btnDrillPause.onclick = () => toggleModalPause();
    
    const btnDrillFull = document.getElementById("btn-drill-fullscreen");
    if (btnDrillFull) btnDrillFull.onclick = () => toggleDrillFullscreen();
    
    // Launch Quizzes in Immersive Simulator
    const btnLaunchEng = document.getElementById("btn-launch-eng-quiz");
    if (btnLaunchEng) {
        btnLaunchEng.onclick = () => {
            if (isChallengeActive) return;
            openDrillModal("English Vocabulary Quiz", true);
            startQuizInModal("english");
        };
    }
    
    const btnLaunchReas = document.getElementById("btn-launch-reas-quiz");
    if (btnLaunchReas) {
        btnLaunchReas.onclick = () => {
            if (isChallengeActive) return;
            openDrillModal("Reasoning Logical Speed Test", true);
            startQuizInModal("reasoning");
        };
    }
    
    const btnLaunchComp = document.getElementById("btn-launch-comp-quiz");
    if (btnLaunchComp) {
        btnLaunchComp.onclick = () => {
            if (isChallengeActive) return;
            openDrillModal("Computer Tier-2 Practice", true);
            startQuizInModal("computer");
        };
    }
    
    const btnLaunchGk = document.getElementById("btn-launch-gk-quiz");
    if (btnLaunchGk) {
        btnLaunchGk.onclick = () => {
            if (isChallengeActive) return;
            openDrillModal("GK & General Studies Practice", true);
            startQuizInModal("gk");
        };
    }

    renderGkQuestion();
}

function flipVocabCard() {
    const card = document.getElementById("vocab-card");
    if (card) card.classList.toggle("flipped");
}

function generateMathOptions(correct) {
    const options = new Set([correct]);
    
    if (typeof correct === "string") {
        if (correct.length === 1 && correct >= "A" && correct <= "Z") {
            // Letter mapping
            while (options.size < 4) {
                const charCode = correct.charCodeAt(0);
                const offset = Math.floor(Math.random() * 9) - 4; // -4 to +4
                const distractorCode = charCode + offset;
                if (distractorCode >= 65 && distractorCode <= 90 && distractorCode !== charCode) {
                    options.add(String.fromCharCode(distractorCode));
                }
            }
        } else if (correct.includes("/") || correct.includes("√") || correct === "Not Defined" || correct.includes("θ") || correct.includes("sec") || correct.includes("cosec") || correct.includes("sin") || correct.includes("cos")) {
            // Fraction & Trig mapping
            const allFracs = ["1/2", "1/3", "2/3", "1/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/6", "5/6", "1/8", "3/8", "5/8", "7/8", "1/12", "1/15", "1/16", "1/10", "1/√2", "√3/2", "1/1.414", "1/√3", "√3", "Not Defined", "sec²θ", "cosec²θ", "cot θ", "cos θ", "sin θ"];
            while (options.size < 4) {
                const rand = allFracs[Math.floor(Math.random() * allFracs.length)];
                if (rand !== correct) options.add(rand);
            }
        } else if (correct.includes("%")) {
            // Percentage mapping
            const allPercs = ["50%", "33.33%", "66.67%", "25%", "75%", "20%", "40%", "60%", "80%", "16.67%", "83.33%", "12.5%", "37.5%", "62.5%", "87.5%", "8.33%", "6.67%", "6.25%", "10%"];
            while (options.size < 4) {
                const rand = allPercs[Math.floor(Math.random() * allPercs.length)];
                if (rand !== correct) options.add(rand);
            }
        } else if (correct.includes(":")) {
            // Centroid ratio or similar ratio string
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

function generateDrillQuestion() {
    const qLabel = document.getElementById("drill-question-label");
    if (!qLabel) return;

    if (!drillIsPlaying) {
        qLabel.innerText = "Select a mode & press Start";
        const optionsGrid = document.getElementById("drill-options");
        if (optionsGrid) optionsGrid.classList.add("hidden");
        return;
    }

    let questionText = "";
    let answer = 0;

    if (drillMode === "squares") {
        const num = Math.floor(Math.random() * 30) + 1; 
        questionText = `${num}² = ?`;
        answer = num * num;
    } else if (drillMode === "cubes") {
        const num = Math.floor(Math.random() * 20) + 1; 
        questionText = `${num}³ = ?`;
        answer = num * num * num;
    } else if (drillMode === "tables") {
        const n1 = Math.floor(Math.random() * 39) + 2; 
        const n2 = Math.floor(Math.random() * 10) + 1; 
        questionText = `${n1} × ${n2} = ?`;
        answer = n1 * n2;
    } else if (drillMode === "fractions") {
        const fracList = [
            { f: "1/2", a: 50 }, { f: "1/3", a: 33 }, { f: "1/4", a: 25 },
            { f: "1/5", a: 20 }, { f: "1/6", a: 16 }, { f: "1/7", a: 14 },
            { f: "1/8", a: 12 }, { f: "1/9", a: 11 }, { f: "1/10", a: 10 },
            { f: "1/11", a: 9 }, { f: "1/12", a: 8 }, { f: "1/15", a: 6 },
            { f: "1/16", a: 6 }, { f: "3/8", a: 37 }, { f: "5/8", a: 62 }
        ];
        const item = fracList[Math.floor(Math.random() * fracList.length)];
        questionText = `${item.f} as % (approx) = ?`;
        answer = item.a;
    } else if (drillMode === "triplets") {
        const baseTriplets = [
            [3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25],
            [9, 40, 41], [11, 60, 61], [12, 35, 37], [20, 21, 29]
        ];
        const base = baseTriplets[Math.floor(Math.random() * baseTriplets.length)];
        const mult = Math.floor(Math.random() * 3) + 1; 
        const trip = base.map(val => val * mult);

        const blankIdx = Math.floor(Math.random() * 3);
        answer = trip[blankIdx];

        const displayArr = trip.map((val, idx) => idx === blankIdx ? "?" : val);
        questionText = `Triplet: ${displayArr.join(", ")}`;
    } else if (drillMode === "algebra") {
        const a = Math.floor(Math.random() * 6) + 3; 
        const b = Math.floor(Math.random() * 2) + 1; 
        const type = Math.floor(Math.random() * 6); 

        if (type === 0) {
            questionText = `If a = 	ext{a}, b = 	ext{b}, find value of a + b`.replace('a', a).replace('b', b);
            answer = a + b;
        } else if (type === 1) {
            questionText = `If a = 	ext{a}, b = 	ext{b}, find value of a - b`.replace('a', a).replace('b', b);
            answer = a - b;
        } else if (type === 2) {
            questionText = `If a = 	ext{a}, b = 	ext{b}, find value of ab`.replace('a', a).replace('b', b);
            answer = a * b;
        } else if (type === 3) {
            questionText = `If a = 	ext{a}, b = 	ext{b}, find value of a² - b²`.replace('a', a).replace('b', b);
            answer = (a * a) - (b * b);
        } else if (type === 4) {
            questionText = `If a = 	ext{a}, b = 	ext{b}, find value of a² + b²`.replace('a', a).replace('b', b);
            answer = (a * a) + (b * b);
        } else {
            questionText = `If a = 	ext{a}, b = 	ext{b}, find value of (a-b)²`.replace('a', a).replace('b', b);
            answer = (a - b) * (a - b);
        }
    } else if (drillMode === "lcm") {
        const list = [
            { n: [2, 3, 4], a: 12 }, { n: [3, 4, 6], a: 12 }, { n: [4, 6, 8], a: 24 },
            { n: [6, 8, 12], a: 24 }, { n: [5, 10, 15], a: 30 }, { n: [6, 9, 12], a: 36 },
            { n: [8, 12, 16], a: 48 }, { n: [10, 12, 15], a: 60 }, { n: [12, 15, 20], a: 60 },
            { n: [8, 12, 15], a: 120 }, { n: [12, 16, 24], a: 48 }, { n: [15, 20, 30], a: 60 },
            { n: [9, 12, 18], a: 36 }
        ];
        const item = list[Math.floor(Math.random() * list.length)];
        const shuffled = [...item.n].sort(() => Math.random() - 0.5);
        questionText = `LCM of (${shuffled.join(", ")}) = ?`;
        answer = item.a;
    } else if (drillMode === "hcf") {
        const f = Math.floor(Math.random() * 12) + 2; // HCF factor 2 to 14
        const multipliers = [
            [2, 3, 5], [2, 5, 7], [3, 4, 5], [3, 5, 7], [2, 3, 7], [4, 5, 7]
        ];
        const mults = multipliers[Math.floor(Math.random() * multipliers.length)];
        questionText = `HCF of (${f * mults[0]}, ${f * mults[1]}, ${f * mults[2]}) = ?`;
        answer = f;
    } else if (drillMode === "alphabets") {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const chosenChar = letters[Math.floor(Math.random() * letters.length)];
        const type = Math.floor(Math.random() * 3); // 0 = forward, 1 = backward, 2 = opposite
        
        if (type === 0) {
            questionText = `Position of Letter '${chosenChar}' = ?`;
            answer = chosenChar.charCodeAt(0) - 64; // A=1
        } else if (type === 1) {
            questionText = `Reverse Position of '${chosenChar}' (A=26) = ?`;
            answer = 27 - (chosenChar.charCodeAt(0) - 64); // A=26
        } else {
            questionText = `Opposite Letter of '${chosenChar}' = ?`;
            answer = String.fromCharCode(155 - chosenChar.charCodeAt(0)); // A <-> Z
        }
    } else if (drillMode === "fracPerc") {
        const fracPercPairs = [
            { f: "1/2", p: "50%" }, { f: "1/3", p: "33.33%" }, { f: "2/3", p: "66.67%" },
            { f: "1/4", p: "25%" }, { f: "3/4", p: "75%" }, { f: "1/5", p: "20%" },
            { f: "2/5", p: "40%" }, { f: "3/5", p: "60%" }, { f: "4/5", p: "80%" },
            { f: "1/6", p: "16.67%" }, { f: "5/6", p: "83.33%" }, { f: "1/7", p: "14.28%" },
            { f: "1/8", p: "12.5%" }, { f: "3/8", p: "37.5%" }, { f: "5/8", p: "62.5%" },
            { f: "7/8", p: "87.5%" }, { f: "1/9", p: "11.11%" }, { f: "1/11", p: "9.09%" },
            { f: "1/12", p: "8.33%" }, { f: "1/15", p: "6.67%" }, { f: "1/16", p: "6.25%" }
        ];
        const item = fracPercPairs[Math.floor(Math.random() * fracPercPairs.length)];
        const type = Math.floor(Math.random() * 2); // 0 = fraction to percent, 1 = percent to fraction
        if (type === 0) {
            questionText = `Percentage value of fraction '${item.f}' = ?`;
            answer = item.p;
        } else {
            questionText = `Fraction value of percentage '${item.p}' = ?`;
            answer = item.f;
        }
    } else if (drillMode === "geomCenters") {
        const type = Math.floor(Math.random() * 6);
        if (type === 0) {
            // Incenter angle: 90 + A/2
            const a = (Math.floor(Math.random() * 9) + 4) * 10; // 40, 50, ..., 120
            questionText = `In △ABC, I is Incenter. If ∠A = 	ext{a}°, find ∠BIC.`.replace('a', a);
            answer = 90 + (a / 2);
        } else if (type === 1) {
            // Orthocenter angle: 180 - A
            const a = (Math.floor(Math.random() * 10) + 4) * 10; // 40, 50, ..., 130
            questionText = `In △ABC, O is Orthocenter. If ∠A = 	ext{a}°, find ∠BOC.`.replace('a', a);
            answer = 180 - a;
        } else if (type === 2) {
            // Circumcenter angle: 2A
            const a = (Math.floor(Math.random() * 6) + 3) * 10; // 30, 40, ..., 80
            questionText = `In △ABC, C is Circumcenter. If ∠A = 	ext{a}°, find ∠BOC.`.replace('a', a);
            answer = 2 * a;
        } else if (type === 3) {
            // Inradius of right triangle: (a+b-c)/2
            const triplets = [
                [3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15]
            ];
            const rip = triplets[Math.floor(Math.random() * triplets.length)];
            questionText = `In right △ABC (sides ${rip[0]}, ${rip[1]}, ${rip[2]}), find Inradius.`;
            answer = (rip[0] + rip[1] - rip[2]) / 2;
        } else if (type === 4) {
            // Circumradius of right triangle: c/2
            const triplets = [
                [3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [10, 24, 26]
            ];
            const rip = triplets[Math.floor(Math.random() * triplets.length)];
            questionText = `In right △ABC (hypotenuse ${rip[2]}), find Circumradius.`;
            answer = rip[2] / 2;
        } else {
            // Centroid median segment ratio
            questionText = `Centroid G divides median AD from vertex (AG:GD) in ratio = ?`;
            answer = "2:1";
        }
    } else if (drillMode === "trigReflex") {
        const type = Math.floor(Math.random() * 4);
        if (type === 0) {
            // Standard Sine values
            const list = [
                { q: "sin(0°)", a: "0" }, { q: "sin(30°)", a: "1/2" },
                { q: "sin(45°)", a: "1/√2" }, { q: "sin(60°)", a: "√3/2" }, { q: "sin(90°)", a: "1" }
            ];
            const item = list[Math.floor(Math.random() * list.length)];
            questionText = `Evaluate: ${item.q} = ?`;
            answer = item.a;
        } else if (type === 1) {
            // Standard Cosine values
            const list = [
                { q: "cos(0°)", a: "1" }, { q: "cos(30°)", a: "√3/2" },
                { q: "cos(45°)", a: "1/√2" }, { q: "cos(60°)", a: "1/2" }, { q: "cos(90°)", a: "0" }
            ];
            const item = list[Math.floor(Math.random() * list.length)];
            questionText = `Evaluate: ${item.q} = ?`;
            answer = item.a;
        } else if (type === 2) {
            // Standard Tangent values
            const list = [
                { q: "tan(0°)", a: "0" }, { q: "tan(30°)", a: "1/√3" },
                { q: "tan(45°)", a: "1" }, { q: "tan(60°)", a: "√3" }, { q: "tan(90°)", a: "Not Defined" }
            ];
            const item = list[Math.floor(Math.random() * list.length)];
            questionText = `Evaluate: ${item.q} = ?`;
            answer = item.a;
        } else {
            // Trigonometric Identities
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

    qLabel.innerText = questionText;
    const modalQLabel = document.getElementById("modal-drill-question");
    if (modalQLabel) modalQLabel.innerText = questionText;
    
    drillAnswerVal = answer;

    const choices = generateMathOptions(answer);
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
    
    // Sync to modal options
    syncModalContent(
        questionText, 
        choices, 
        (val, idx) => {
            const btns = document.querySelectorAll(".math-opt-btn");
            if (btns[idx]) btns[idx].click();
        }, 
        "maths"
    );

    clearInterval(drillTimerInterval);
    drillTimerSecs = 15;
    const fill = document.getElementById("drill-timer-fill");
    const modalFill = document.getElementById("modal-drill-timer-fill");
    if (fill) fill.style.width = "100%";
    if (modalFill) modalFill.style.width = "100%";

    drillTimerInterval = setInterval(() => {
        drillTimerSecs--;
        if (fill) fill.style.width = `${(drillTimerSecs / 15) * 100}%`;
        if (modalFill) modalFill.style.width = `${(drillTimerSecs / 15) * 100}%`;

        if (drillTimerSecs <= 0) {
            clearInterval(drillTimerInterval);
            drillAttempts++;
            drillStreak = 0;
            
            const feedback = document.getElementById("drill-feedback");
            const scoreEl = document.getElementById("drill-score");

            if (feedback) {
                feedback.innerText = "Timeout! Answer was " + drillAnswerVal + " ❌";
                feedback.className = "text-xs font-semibold text-accentRose";
            }
            if (scoreEl) scoreEl.innerText = `Score: &apos;${drillCorrect}/${drillAttempts}&apos;`.replace(/&apos;/g, "'");
            
            const buttons = document.querySelectorAll(".math-opt-btn");
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

function checkDrillAnswer(chosenVal) {
    clearInterval(drillTimerInterval);
    drillAttempts++;

    const feedback = document.getElementById("drill-feedback");
    const scoreEl = document.getElementById("drill-score");
    const buttons = document.querySelectorAll(".math-opt-btn");

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
            feedback.className = "text-xs font-semibold text-accentGreen animate-bounce";
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
    const modalScore = document.getElementById("modal-drill-score");
    if (modalScore) modalScore.innerText = `Score: ${drillCorrect}/${drillAttempts}`;
    
    if (window.isDrillModalActive) {
        const btnTextArr = Array.from(buttons).map(b => b.innerText);
        const correctIdx = btnTextArr.indexOf(String(drillAnswerVal));
        const chosenIdx = btnTextArr.indexOf(String(chosenVal));
        highlightModalOptions(correctIdx, chosenIdx, "maths");
    }
    
    setTimeout(generateDrillQuestion, 1500);
}

function resetDrillSession() {
    clearInterval(drillTimerInterval);
    drillAttempts = 0;
    drillCorrect = 0;
    drillStreak = 0;
    drillIsPlaying = false; 
    
    const scoreEl = document.getElementById("drill-score");
    const feedback = document.getElementById("drill-feedback");
    const pauseBtn = document.getElementById("btn-drill-pause");
    const qLabel = document.getElementById("drill-question-label");
    const fill = document.getElementById("drill-timer-fill");
    const optionsGrid = document.getElementById("drill-options");

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

// ==========================================================================
// 15. SECTIONAL TIMER CHALLENGE CONTROLLERS (15 MINS, 25 PROGRESSIVE Qs)
// ==========================================================================

function startChallengeRun() {
    isChallengeActive = true;
    challengeTimeRemaining = 900; // 15 mins
    openDrillModal("⚡ Conquest Challenge", true);
    activeModalDrillType = "challenge";
    challengeQuestionIndex = 0;
    challengeScore = 0;
    
    const activeTabBtn = document.querySelector(".speed-tab-btn.active-nav-tab");
    challengeActiveTab = activeTabBtn ? activeTabBtn.getAttribute("data-target").replace("speed-tab-", "") : "maths";
    
    const btnChallengeStart = document.getElementById("btn-challenge-start");
    if (btnChallengeStart) {
        btnChallengeStart.innerHTML = `<i class="fa-solid fa-square mr-1"></i> Abort Run`;
        btnChallengeStart.className = "bg-accentRose hover:bg-rose-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition duration-200 ml-2 animate-pulse";
    }

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
    
    // Update modal title, progress and score
    if (window.isDrillModalActive) {
        const titleEl = document.getElementById("drill-modal-title");
        if (titleEl) titleEl.innerText = `⚡ Conquest Challenge [${formattedTime}]`;
        
        const modalScore = document.getElementById("modal-drill-score");
        if (modalScore) modalScore.innerText = `Score: ${challengeScore}`;
        
        const modalStreak = document.getElementById("modal-drill-streak");
        if (modalStreak) modalStreak.innerText = `Q: ${challengeQuestionIndex + 1} / 25 (${level})`;
        
        const modalFill = document.getElementById("modal-drill-timer-fill");
        if (modalFill) modalFill.style.width = `${(challengeTimeRemaining / 900) * 100}%`;
    }
}

function getChallengeQuestion(subject, difficulty) {
    let pool = [];
    if (subject === "english") pool = ENGLISH_QUESTIONS;
    else if (subject === "reasoning") pool = REASONING_QUESTIONS;
    else if (subject === "computer") pool = COMP_QUESTIONS;
    
    const filtered = pool.filter(q => q.d === difficulty);
    if (filtered.length === 0) return pool[Math.floor(Math.random() * pool.length)];
    return filtered[Math.floor(Math.random() * filtered.length)];
}

function generateProceduralMathQuestion(difficulty) {
    let questionText = "";
    let answer = 0;
    const modes = ["squares", "cubes", "tables", "fracPerc", "triplets", "algebra", "lcm", "hcf", "geomCenters"];
    const mode = modes[Math.floor(Math.random() * modes.length)];
    
    if (difficulty === "easy") {
        if (mode === "squares") {
            const num = Math.floor(Math.random() * 12) + 1; 
            questionText = `${num}² = ?`;
            answer = num * num;
        } else if (mode === "cubes") {
            const num = Math.floor(Math.random() * 5) + 1; 
            questionText = `${num}³ = ?`;
            answer = num * num * num;
        } else if (mode === "tables") {
            const n1 = Math.floor(Math.random() * 9) + 2; 
            const n2 = Math.floor(Math.random() * 10) + 1; 
            questionText = `${n1} × ${n2} = ?`;
            answer = n1 * n2;
        } else if (mode === "fracPerc") {
            const list = [
                { f: "1/2", p: "50%" }, { f: "1/3", p: "33.33%" }, { f: "1/4", p: "25%" },
                { f: "1/5", p: "20%" }, { f: "1/10", p: "10%" }
            ];
            const item = list[Math.floor(Math.random() * list.length)];
            const type = Math.floor(Math.random() * 2);
            if (type === 0) {
                questionText = `Percentage value of fraction '${item.f}' = ?`;
                answer = item.p;
            } else {
                questionText = `Fraction value of percentage '${item.p}' = ?`;
                answer = item.f;
            }
        } else if (mode === "triplets") {
            const base = [[3, 4, 5], [5, 12, 13]];
            const trip = base[Math.floor(Math.random() * base.length)];
            const blankIdx = Math.floor(Math.random() * 3);
            answer = trip[blankIdx];
            const display = trip.map((val, idx) => idx === blankIdx ? "?" : val);
            questionText = `Triplet: ${display.join(", ")}`;
        } else if (mode === "lcm") {
            const list = [
                { n: [2, 3, 4], a: 12 }, { n: [3, 4, 6], a: 12 }, { n: [2, 5, 10], a: 10 },
                { n: [3, 5, 15], a: 15 }, { n: [4, 5, 10], a: 20 }
            ];
            const item = list[Math.floor(Math.random() * list.length)];
            const shuffled = [...item.n].sort(() => Math.random() - 0.5);
            questionText = `LCM of (${shuffled.join(", ")}) = ?`;
            answer = item.a;
        } else if (mode === "hcf") {
            const f = Math.floor(Math.random() * 3) + 2; // HCF factor 2, 3, 4
            const multipliers = [[2, 3, 5], [3, 4, 5], [2, 5, 7]];
            const mults = multipliers[Math.floor(Math.random() * multipliers.length)];
            questionText = `HCF of (${f * mults[0]}, ${f * mults[1]}, ${f * mults[2]}) = ?`;
            answer = f;
        } else if (mode === "geomCenters") {
            const type = Math.floor(Math.random() * 2);
            if (type === 0) {
                questionText = `Centroid G divides median AD from vertex (AG:GD) in ratio = ?`;
                answer = "2:1";
            } else {
                questionText = `Circumradius of right △ABC with sides 6, 8, 10 (hypotenuse 10) = ?`;
                answer = 5;
            }
        } else {
            const a = Math.floor(Math.random() * 4) + 2; 
            const b = Math.floor(Math.random() * 2) + 1; 
            const type = Math.floor(Math.random() * 3);
            if (type === 0) {
                questionText = `If a = ${a}, b = ${b}, find a + b`;
                answer = a + b;
            } else if (type === 1) {
                questionText = `If a = ${a}, b = ${b}, find a - b`;
                answer = a - b;
            } else {
                questionText = `If a = ${a}, b = ${b}, find ab`;
                answer = a * b;
            }
        }
    } else if (difficulty === "medium") {
        if (mode === "squares") {
            const num = Math.floor(Math.random() * 10) + 13; 
            questionText = `${num}² = ?`;
            answer = num * num;
        } else if (mode === "cubes") {
            const num = Math.floor(Math.random() * 7) + 6; 
            questionText = `${num}³ = ?`;
            answer = num * num * num;
        } else if (mode === "tables") {
            const n1 = Math.floor(Math.random() * 10) + 11; 
            const n2 = Math.floor(Math.random() * 10) + 1; 
            questionText = `${n1} × ${n2} = ?`;
            answer = n1 * n2;
        } else if (mode === "fracPerc") {
            const list = [
                { f: "2/3", p: "66.67%" }, { f: "3/4", p: "75%" }, { f: "2/5", p: "40%" },
                { f: "3/5", p: "60%" }, { f: "4/5", p: "80%" }, { f: "1/6", p: "16.67%" },
                { f: "1/8", p: "12.5%" }
            ];
            const item = list[Math.floor(Math.random() * list.length)];
            const type = Math.floor(Math.random() * 2);
            if (type === 0) {
                questionText = `Percentage value of fraction '${item.f}' = ?`;
                answer = item.p;
            } else {
                questionText = `Fraction value of percentage '${item.p}' = ?`;
                answer = item.f;
            }
        } else if (mode === "triplets") {
            const base = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [20, 21, 29]];
            const selected = base[Math.floor(Math.random() * base.length)];
            const trip = selected.map(val => val * 2); 
            const blankIdx = Math.floor(Math.random() * 3);
            answer = trip[blankIdx];
            const display = trip.map((val, idx) => idx === blankIdx ? "?" : val);
            questionText = `Triplet: ${display.join(", ")}`;
        } else if (mode === "lcm") {
            const list = [
                { n: [4, 6, 8], a: 24 }, { n: [6, 8, 12], a: 24 }, { n: [5, 10, 15], a: 30 },
                { n: [6, 9, 12], a: 36 }, { n: [8, 12, 16], a: 48 }
            ];
            const item = list[Math.floor(Math.random() * list.length)];
            const shuffled = [...item.n].sort(() => Math.random() - 0.5);
            questionText = `LCM of (${shuffled.join(", ")}) = ?`;
            answer = item.a;
        } else if (mode === "hcf") {
            const f = Math.floor(Math.random() * 4) + 5; // HCF factor 5, 6, 7, 8
            const multipliers = [[2, 3, 5], [3, 4, 5], [2, 5, 7]];
            const mults = multipliers[Math.floor(Math.random() * multipliers.length)];
            questionText = `HCF of (${f * mults[0]}, ${f * mults[1]}, ${f * mults[2]}) = ?`;
            answer = f;
        } else if (mode === "geomCenters") {
            const type = Math.floor(Math.random() * 2);
            const a = (Math.floor(Math.random() * 5) + 4) * 10; // 40 to 80
            if (type === 0) {
                questionText = `In △ABC, I is Incenter. If ∠A = ${a}°, find ∠BIC.`;
                answer = 90 + (a / 2);
            } else {
                questionText = `In △ABC, C is Circumcenter. If ∠A = ${a}°, find ∠BOC.`;
                answer = 2 * a;
            }
        } else {
            const a = Math.floor(Math.random() * 5) + 5; 
            const b = Math.floor(Math.random() * 3) + 2; 
            const type = Math.floor(Math.random() * 3);
            if (type === 0) {
                questionText = `If a = ${a}, b = ${b}, find a² - b²`;
                answer = (a * a) - (b * b);
            } else if (type === 1) {
                questionText = `If a = ${a}, b = ${b}, find a² + b²`;
                answer = (a * a) + (b * b);
            } else {
                questionText = `If a = ${a}, b = ${b}, find (a-b)²`;
                answer = (a - b) * (a - b);
            }
        }
    } else {
        if (mode === "squares") {
            const num = Math.floor(Math.random() * 8) + 23; 
            questionText = `${num}² = ?`;
            answer = num * num;
        } else if (mode === "cubes") {
            const num = Math.floor(Math.random() * 7) + 13; 
            questionText = `${num}³ = ?`;
            answer = num * num * num;
        } else if (mode === "tables") {
            const n1 = Math.floor(Math.random() * 15) + 26; 
            const n2 = Math.floor(Math.random() * 10) + 1; 
            questionText = `${n1} × ${n2} = ?`;
            answer = n1 * n2;
        } else if (mode === "fracPerc") {
            const list = [
                { f: "5/6", p: "83.33%" }, { f: "1/7", p: "14.28%" }, { f: "3/8", p: "37.5%" },
                { f: "5/8", p: "62.5%" }, { f: "7/8", p: "87.5%" }, { f: "1/9", p: "11.11%" },
                { f: "1/11", p: "9.09%" }, { f: "1/12", p: "8.33%" }, { f: "1/15", p: "6.67%" },
                { f: "1/16", p: "6.25%" }
            ];
            const item = list[Math.floor(Math.random() * list.length)];
            const type = Math.floor(Math.random() * 2);
            if (type === 0) {
                questionText = `Percentage value of fraction '${item.f}' = ?`;
                answer = item.p;
            } else {
                questionText = `Fraction value of percentage '${item.p}' = ?`;
                answer = item.f;
            }
        } else if (mode === "triplets") {
            const base = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
            const selected = base[Math.floor(Math.random() * base.length)];
            const trip = selected.map(val => val * 3); 
            const blankIdx = Math.floor(Math.random() * 3);
            answer = trip[blankIdx];
            const display = trip.map((val, idx) => idx === blankIdx ? "?" : val);
            questionText = `Triplet: ${display.join(", ")}`;
        } else if (mode === "lcm") {
            const list = [
                { n: [8, 12, 15], a: 120 }, { n: [12, 15, 20], a: 60 }, { n: [10, 12, 15], a: 60 },
                { n: [12, 16, 24], a: 48 }, { n: [9, 12, 18], a: 36 }
            ];
            const item = list[Math.floor(Math.random() * list.length)];
            const shuffled = [...item.n].sort(() => Math.random() - 0.5);
            questionText = `LCM of (${shuffled.join(", ")}) = ?`;
            answer = item.a;
        } else if (mode === "hcf") {
            const f = Math.floor(Math.random() * 6) + 10; // HCF factor 10 to 15
            const multipliers = [[2, 3, 5], [3, 4, 5], [2, 5, 7], [2, 3, 7]];
            const mults = multipliers[Math.floor(Math.random() * multipliers.length)];
            questionText = `HCF of (${f * mults[0]}, ${f * mults[1]}, ${f * mults[2]}) = ?`;
            answer = f;
        } else if (mode === "geomCenters") {
            const type = Math.floor(Math.random() * 2);
            if (type === 0) {
                const a = (Math.floor(Math.random() * 6) + 5) * 10; // 50 to 100
                questionText = `In △ABC, O is Orthocenter. If ∠A = ${a}°, find ∠BOC.`;
                answer = 180 - a;
            } else {
                const triplets = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]];
                const rip = triplets[Math.floor(Math.random() * triplets.length)];
                questionText = `Find Inradius of right △ABC with sides 	ext{sides}.`.replace('sides', rip.join(', '));
                answer = (rip[0] + rip[1] - rip[2]) / 2;
            }
        } else {
            const finalA = Math.floor(Math.random() * 6) + 4; 
            const finalB = Math.floor(Math.random() * 3) + 1; 
            const type = Math.floor(Math.random() * 2);
            if (type === 0) {
                const sum = finalA + finalB;
                const prod = finalA * finalB;
                questionText = `If a+b = 	ext{sum}, ab = 	ext{prod}, find a² + b²`.replace(/\text{sum}/, sum).replace(/\text{prod}/, prod);
                answer = (finalA * finalA) + (finalB * finalB);
            } else {
                const diff = finalA - finalB;
                const prod = finalA * finalB;
                questionText = `If a-b = 	ext{diff}, ab = 	ext{prod}, find a² + b²`.replace(/\text{diff}/, diff).replace(/\text{prod}/, prod);
                answer = (finalA * finalA) + (finalB * finalB);
            }
        }
    }
    
    const choices = generateMathOptions(answer);
    return { q: questionText, a: answer, o: choices };
}

function generateChallengeQuestion() {
    updateChallengeUI();

    let diff = "easy";
    if (challengeQuestionIndex >= 15) {
        diff = "hard";
    } else if (challengeQuestionIndex >= 5) {
        diff = "medium";
    }

    if (challengeActiveTab === "maths") {
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
                btn.onclick = () => submitChallengeAnswer("maths", choice, qData.a, optionsGrid.querySelectorAll(".math-opt-btn"));
                optionsGrid.appendChild(btn);
            });
            
            syncModalContent(
                qData.q,
                qData.o,
                (val, idx) => {
                    const btns = optionsGrid.querySelectorAll(".math-opt-btn");
                    if (btns[idx]) btns[idx].click();
                },
                "maths"
            );
        }
    } else if (challengeActiveTab === "english") {
        const qText = document.getElementById("eng-q-text");
        const optionsGrid = document.getElementById("eng-options");
        if (qText && optionsGrid) {
            optionsGrid.innerHTML = "";
            const qData = getChallengeQuestion("english", diff);
            qText.innerText = qData.q;
            challengeCorrectAnswerVal = qData.a;
            
            qData.o.forEach((choice, idx) => {
                const btn = document.createElement("button");
                btn.className = "eng-opt-btn w-full text-left p-3 rounded-xl border border-white/5 hover:border-accentRose bg-white/2px hover:bg-white/5 transition text-xs font-semibold text-gray-300";
                btn.innerText = choice;
                btn.onclick = () => submitChallengeAnswer("english", idx, qData.a, optionsGrid.querySelectorAll(".eng-opt-btn"));
                optionsGrid.appendChild(btn);
            });
            
            syncModalContent(
                qData.q,
                qData.o,
                (val, mIdx) => {
                    const btns = optionsGrid.querySelectorAll(".eng-opt-btn");
                    if (btns[mIdx]) btns[mIdx].click();
                },
                "english"
            );
        }
    } else if (challengeActiveTab === "reasoning") {
        const qText = document.getElementById("reas-q-text");
        const optionsGrid = document.getElementById("reas-options");
        if (qText && optionsGrid) {
            optionsGrid.innerHTML = "";
            const qData = getChallengeQuestion("reasoning", diff);
            qText.innerText = qData.q;
            challengeCorrectAnswerVal = qData.a;
            
            qData.o.forEach((choice, idx) => {
                const btn = document.createElement("button");
                btn.className = "reas-opt-btn w-full text-left p-3 rounded-xl border border-white/5 hover:border-accentPurple bg-white/2px hover:bg-white/5 transition text-xs font-semibold text-gray-300";
                btn.innerText = choice;
                btn.onclick = () => submitChallengeAnswer("reasoning", idx, qData.a, optionsGrid.querySelectorAll(".reas-opt-btn"));
                optionsGrid.appendChild(btn);
            });
            
            syncModalContent(
                qData.q,
                qData.o,
                (val, mIdx) => {
                    const btns = optionsGrid.querySelectorAll(".reas-opt-btn");
                    if (btns[mIdx]) btns[mIdx].click();
                },
                "reasoning"
            );
        }
    } else if (challengeActiveTab === "computer") {
        const qText = document.getElementById("comp-q-text");
        const optionsGrid = document.getElementById("comp-options");
        if (qText && optionsGrid) {
            optionsGrid.innerHTML = "";
            const qData = getChallengeQuestion("computer", diff);
            qText.innerText = qData.q;
            challengeCorrectAnswerVal = qData.a;
            
            qData.o.forEach((choice, idx) => {
                const btn = document.createElement("button");
                btn.className = "comp-opt-btn w-full text-left p-3 rounded-xl border border-white/5 hover:border-accentAmber bg-white/2px hover:bg-white/5 transition text-xs font-semibold text-gray-300";
                btn.innerText = choice;
                btn.onclick = () => submitChallengeAnswer("computer", idx, qData.a, optionsGrid.querySelectorAll(".comp-opt-btn"));
                optionsGrid.appendChild(btn);
            });
            
            syncModalContent(
                qData.q,
                qData.o,
                (val, mIdx) => {
                    const btns = optionsGrid.querySelectorAll(".comp-opt-btn");
                    if (btns[mIdx]) btns[mIdx].click();
                },
                "computer"
            );
        }
    }
}

function submitChallengeAnswer(subject, chosenValOrIndex, correctValOrIndex, optButtons) {
    let isCorrect = (chosenValOrIndex === correctValOrIndex);
    
    optButtons.forEach((b, bIdx) => {
        b.disabled = true;
        if (subject === "maths") {
            const val = parseInt(b.innerText);
            if (val === correctValOrIndex) {
                b.className = b.className.replace("border-white/5", "border-accentGreen bg-accentGreen/15 text-accentGreen");
            } else if (val === chosenValOrIndex) {
                b.className = b.className.replace("border-white/5", "border-accentRose bg-accentRose/15 text-accentRose");
            }
        } else {
            const activeColorClass = (subject === "english" ? "border-accentRose bg-accentRose/15 text-accentRose" :
                                      subject === "reasoning" ? "border-accentPurple bg-accentPurple/15 text-accentPurple" :
                                      "border-accentAmber bg-accentAmber/15 text-accentAmber");
            if (bIdx === correctValOrIndex) {
                b.className = b.className.replace("border-white/5", "border-accentGreen bg-accentGreen/15 text-accentGreen");
            } else if (bIdx === chosenValOrIndex) {
                b.className = b.className.replace("border-white/5", activeColorClass);
            }
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
    closeDrillModal();
    clearInterval(challengeTimerInterval);

    const btnChallengeStart = document.getElementById("btn-challenge-start");
    if (btnChallengeStart) {
        btnChallengeStart.innerHTML = `<i class="fa-solid fa-play mr-1"></i> Start Challenge`;
        btnChallengeStart.className = "bg-accentCyan hover:bg-cyan-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition duration-200 ml-2";
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
            alert(`🔥 CONQUEST RUN CLEARED!\nSubject: ${challengeActiveTab.toUpperCase()}\nScore: ${challengeScore} / 25 correct!\nTime taken: ${timeTaken} seconds.\nRating: Super Human reflexes unlocked!`);
        } else {
            speakText("Cutoff not cleared");
            alert(`❌ CHALLENGE FINISHED\nSubject: ${challengeActiveTab.toUpperCase()}\nScore: ${challengeScore} / 25 correct.\nTime taken: ${timeTaken} seconds.\nYou need at least 20/25 to clear the CGL Tier-2 qualifying cutoff. Keep practicing!`);
        }
    } else {
        speakText("Time out");
        alert(`⏰ TIMEOUT! You ran out of time on question ${challengeQuestionIndex + 1}.\nScore: ${challengeScore} / 25 correct.`);
    }

    const activeTabBtn = document.querySelector(".speed-tab-btn.active-nav-tab");
    const target = activeTabBtn ? activeTabBtn.getAttribute("data-target") : "speed-tab-maths";
    
    if (target === "speed-tab-maths") {
        resetDrillSession();
    } else if (target === "speed-tab-english") {
        renderEnglishQuestion();
    } else if (target === "speed-tab-reasoning") {
        renderReasoningQuestion();
    } else if (target === "speed-tab-computer") {
        renderComputerQuestion();
    }
}

function toggleFreeModeComponents(show) {
    const modeSelectors = document.querySelector(".grid.grid-cols-2.sm\\:grid-cols-3.gap-2.mb-6");
    if (modeSelectors) {
        if (show) modeSelectors.classList.remove("hidden");
        else modeSelectors.classList.add("hidden");
    }

    const startPauseBtn = document.getElementById("btn-drill-pause");
    if (startPauseBtn) {
        if (show) startPauseBtn.classList.remove("hidden");
        else startPauseBtn.classList.add("hidden");
    }

    const flashcardsBlock = document.querySelector("#speed-tab-english > div:first-child");
    if (flashcardsBlock) {
        if (show) flashcardsBlock.classList.remove("hidden");
        else flashcardsBlock.classList.add("hidden");
    }

    const btnEngReset = document.getElementById("btn-eng-reset");
    const btnReasReset = document.getElementById("btn-reas-reset");
    const btnCompReset = document.getElementById("btn-comp-reset");
    
    if (btnEngReset) btnEngReset.style.display = show ? "flex" : "none";
    if (btnReasReset) btnReasReset.style.display = show ? "flex" : "none";
    if (btnCompReset) btnCompReset.style.display = show ? "flex" : "none";
}

// PWA & Markdown Helpers
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
    
    // Simple HTML escape to prevent visual breakage
    let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Headings
    html = html.replace(/^### (.*?)$/gm, '<h5 class="text-xs font-bold text-white mt-2 mb-1">$1</h5>');
    html = html.replace(/^## (.*?)$/gm, '<h4 class="text-sm font-bold text-white mt-3 mb-1">$1</h4>');
    html = html.replace(/^# (.*?)$/gm, '<h3 class="text-base font-extrabold text-white mt-4 mb-2">$1</h3>');

    // Bold (**text**)
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
                    continue; // Skip separator line
                }
                tableHtml += '<tr class="border-b border-white/5">';
                cells.forEach(c => tableHtml += `<td class="py-1">${c}</td>`);
                tableHtml += '</tr>';
            }
            lines[i] = ''; // Clear line as it is consumed by the table
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


// === IMMERSIVE DRILL SIMULATOR MODAL HELPERS ===
function openDrillModal(title, isMCQ) {
    const modal = document.getElementById("modal-drill-window");
    if (!modal) return;
    
    const floatingNav = document.getElementById("mobile-floating-nav");
    if (floatingNav) floatingNav.classList.add("hidden");
    document.getElementById("floating-nav-trigger").classList.add("hidden");
    document.getElementById("drill-modal-title").innerText = title;
    
    const inputWrapper = document.getElementById("modal-drill-input-wrapper");
    const optionsGrid = document.getElementById("modal-drill-options");
    
    if (isMCQ) {
        if (inputWrapper) inputWrapper.classList.add("hidden");
        if (optionsGrid) optionsGrid.classList.remove("hidden");
    } else {
        if (inputWrapper) inputWrapper.classList.remove("hidden");
        if (optionsGrid) optionsGrid.classList.add("hidden");
        
        const inputField = document.getElementById("modal-drill-answer");
        if (inputField) {
            inputField.value = "";
            inputField.disabled = false;
            setTimeout(() => inputField.focus(), 100);
        }
    }
    
    modal.classList.add("active");
    modal.classList.remove("opacity-0", "pointer-events-none");
    window.isDrillModalActive = true;
}

function closeDrillModal() {
    const modal = document.getElementById("modal-drill-window");
    if (!modal) return;
    
    modal.classList.remove("active");
    modal.classList.add("opacity-0", "pointer-events-none");
    window.isDrillModalActive = false;
    
    // Restore navigation bar
    const floatingNav = document.getElementById("mobile-floating-nav");
    if (floatingNav) floatingNav.classList.remove("hidden");
    
    // Reset pause overlays and state
    drillIsPaused = false;
    const overlay = document.getElementById("modal-drill-paused-overlay");
    const wrapper = document.getElementById("modal-drill-content-wrapper");
    const pauseBtn = document.getElementById("btn-drill-modal-pause");
    if (overlay) overlay.classList.add("hidden");
    if (wrapper) wrapper.classList.remove("blur-md");
    if (pauseBtn) pauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i> <span>Pause</span>';
    
    // Also reset fullscreen classes if active
    const card = document.getElementById("drill-window-card");
    if (card) card.classList.remove("fullscreen-drill-card");
    
    const expandBtn = document.getElementById("btn-drill-fullscreen");
    if (expandBtn) expandBtn.innerHTML = '<i class="fa-solid fa-expand"></i> <span>Fullscreen</span>';
    
    // Stop Maths drill if running
    if (drillIsPlaying) {
        drillIsPlaying = false;
        const pauseBtn = document.getElementById("btn-drill-pause");
        if (pauseBtn) pauseBtn.innerHTML = `<i class="fa-solid fa-play mr-1"></i> Start`;
        clearInterval(drillTimerInterval);
    }
    
    // Abort Conquest Challenge if running
    if (isChallengeActive) {
        endChallengeRun(false, true);
    }
}

function toggleDrillFullscreen() {
    const card = document.getElementById("drill-window-card");
    const btn = document.getElementById("btn-drill-fullscreen");
    if (!card || !btn) return;
    
    const isFullscreen = card.classList.toggle("fullscreen-drill-card");
    if (isFullscreen) {
        btn.innerHTML = '<i class="fa-solid fa-compress"></i> <span>Exit Fullscreen</span>';
    } else {
        btn.innerHTML = '<i class="fa-solid fa-expand"></i> <span>Fullscreen</span>';
    }
}

function syncModalContent(question, choices, onOptionClick, subject) {
    if (!window.isDrillModalActive) return;
    
    const modalQ = document.getElementById("modal-drill-question");
    if (modalQ) modalQ.innerText = question;
    
    const modalOptions = document.getElementById("modal-drill-options");
    if (modalOptions) {
        modalOptions.innerHTML = "";
        
        let hoverBorder = "hover:border-accentCyan";
        if (subject === "english") hoverBorder = "hover:border-accentRose";
        else if (subject === "reasoning") hoverBorder = "hover:border-accentPurple";
        else if (subject === "computer") hoverBorder = "hover:border-accentAmber";
        else if (subject === "gk") hoverBorder = "hover:border-accentGreen";
        
        choices.forEach((choice, idx) => {
            const btn = document.createElement("button");
            btn.className = `math-opt-btn w-full text-left p-4 rounded-2xl border border-white/5 bg-white/2px ${hoverBorder} hover:bg-white/5 transition text-sm font-semibold text-gray-200`;
            btn.innerText = choice;
            btn.onclick = () => onOptionClick(choice, idx, btn);
            modalOptions.appendChild(btn);
        });
    }
}

function highlightModalOptions(correctIndex, chosenIndex, subject) {
    if (!window.isDrillModalActive) return;
    const modalOptions = document.getElementById("modal-drill-options");
    if (!modalOptions) return;
    
    const buttons = modalOptions.querySelectorAll("button");
    
    let activeRose = "border-accentRose bg-accentRose/15 text-accentRose";
    let activePurple = "border-accentPurple bg-accentPurple/15 text-accentPurple";
    let activeAmber = "border-accentAmber bg-accentAmber/15 text-accentAmber";
    
    buttons.forEach((b, idx) => {
        b.disabled = true;
        if (idx === correctIndex) {
            b.className = b.className.replace("border-white/5", "border-accentGreen bg-accentGreen/15 text-accentGreen");
        } else if (idx === chosenIndex) {
            let color = activeRose;
            if (subject === "reasoning") color = activePurple;
            else if (subject === "computer") color = activeAmber;
            else if (subject === "maths" || subject === "challenge") color = "border-accentCyan bg-accentCyan/15 text-accentCyan";
            b.className = b.className.replace("border-white/5", color);
        }
    });
}


let drillIsPaused = false;

function toggleModalPause() {
    if (!window.isDrillModalActive) return;
    
    drillIsPaused = !drillIsPaused;
    
    const overlay = document.getElementById("modal-drill-paused-overlay");
    const wrapper = document.getElementById("modal-drill-content-wrapper");
    const pauseBtn = document.getElementById("btn-drill-modal-pause");
    
    if (drillIsPaused) {
        if (overlay) overlay.classList.remove("hidden");
        if (wrapper) wrapper.classList.add("blur-md");
        if (pauseBtn) pauseBtn.innerHTML = '<i class="fa-solid fa-play"></i> <span>Resume</span>';
        
        // Pause active timers
        if (activeModalDrillType === "maths") {
            clearInterval(drillTimerInterval);
        } else if (activeModalDrillType === "challenge") {
            clearInterval(challengeTimerInterval);
        }
        speakText("Paused");
    } else {
        if (overlay) overlay.classList.add("hidden");
        if (wrapper) wrapper.classList.remove("blur-md");
        if (pauseBtn) pauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i> <span>Pause</span>';
        
        // Resume active timers
        if (activeModalDrillType === "maths") {
            const fill = document.getElementById("drill-timer-fill");
            const modalFill = document.getElementById("modal-drill-timer-fill");
            clearInterval(drillTimerInterval);
            drillTimerInterval = setInterval(() => {
                drillTimerSecs--;
                if (fill) fill.style.width = `${(drillTimerSecs / 15) * 100}%`;
                if (modalFill) modalFill.style.width = `${(drillTimerSecs / 15) * 100}%`;
                if (drillTimerSecs <= 0) {
                    checkDrillAnswer("");
                }
            }, 1000);
        } else if (activeModalDrillType === "challenge") {
            clearInterval(challengeTimerInterval);
            challengeTimerInterval = setInterval(() => {
                challengeTimeRemaining--;
                updateChallengeUI();
                if (challengeTimeRemaining <= 0) {
                    endChallengeRun(false); 
                }
            }, 1000);
        }
        speakText("Resumed");
    }
}
