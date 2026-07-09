// === DASHBOARD & TIMER MODULE ===
function initExamTargetEditor() {
    const btnToggle = document.getElementById("btn-toggle-exam-edit");
    const viewPanel = document.getElementById("exam-target-view");
    const editPanel = document.getElementById("exam-target-edit");
    const inputName = document.getElementById("input-exam-name");
    const inputDate = document.getElementById("input-exam-date");
    const btnSave = document.getElementById("btn-save-exam-target");
    const btnCancel = document.getElementById("btn-cancel-exam-target");

    function updateDisplay() {
        const displayName = document.getElementById("display-exam-name");
        const displayDate = document.getElementById("display-exam-date");
        const headerLabel = document.getElementById("countdown-label");

        if (displayName) displayName.innerText = appState.examName;
        if (displayDate) {
            const dateObj = new Date(appState.examDate);
            if (!isNaN(dateObj)) {
                displayDate.innerText = dateObj.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
            } else {
                displayDate.innerText = appState.examDate;
            }
        }
        if (headerLabel) headerLabel.innerText = `${appState.examName}:`;
    }

    if (btnToggle) {
        btnToggle.onclick = () => {
            const isEditing = !editPanel.classList.contains("hidden");
            if (isEditing) {
                editPanel.classList.add("hidden");
                viewPanel.classList.remove("hidden");
                btnToggle.innerText = "Edit";
            } else {
                inputName.value = appState.examName;
                inputDate.value = appState.examDate.split("T")[0];
                editPanel.classList.remove("hidden");
                viewPanel.classList.add("hidden");
                btnToggle.innerText = "Close";
            }
        };
    }

    if (btnCancel) {
        btnCancel.onclick = () => {
            editPanel.classList.add("hidden");
            viewPanel.classList.remove("hidden");
            if (btnToggle) btnToggle.innerText = "Edit";
        };
    }

    if (btnSave) {
        btnSave.onclick = () => {
            const nameVal = inputName.value.trim();
            const dateVal = inputDate.value;

            if (!nameVal || !dateVal) {
                alert("Please enter both target exam name and date.");
                return;
            }

            appState.examName = nameVal;
            appState.examDate = dateVal;
            saveStateToStorage();
            updateDisplay();

            editPanel.classList.add("hidden");
            viewPanel.classList.remove("hidden");
            if (btnToggle) btnToggle.innerText = "Edit";
        };
    }

    updateDisplay();
}


// 5. TOOLKIT SUB-TABS INTERACTIVITY
function initToolkitTabs() {
    const tkTabs = document.querySelectorAll(".toolkit-tab-btn");
    const tkPanels = document.querySelectorAll(".toolkit-panel");

    tkTabs.forEach(tab => {
        tab.onclick = () => {
            tkTabs.forEach(t => t.classList.remove("active-nav-tab"));
            tab.classList.add("active-nav-tab");

            const targetPanelId = tab.getAttribute("data-target");
            tkPanels.forEach(p => p.classList.add("hidden"));
            
            const targetPanel = document.getElementById(targetPanelId);
            if (targetPanel) {
                targetPanel.classList.remove("hidden");
            }

            if (typeof renderToolkitSubTab === "function") {
                renderToolkitSubTab(targetPanelId);
            }
        };
    });

    // Custom Note Book Sub-categories Filtering
    const noteFilterBtns = document.querySelectorAll(".note-filter-btn");
    noteFilterBtns.forEach(btn => {
        btn.onclick = () => {
            noteFilterBtns.forEach(b => b.classList.remove("active-nav-tab"));
            btn.classList.add("active-nav-tab");
            renderToolkit();
        };
    });

    // Trigger initial render of active tab (e.g., Quant Formulas on load)
    const activeTab = document.querySelector(".toolkit-tab-btn.active-nav-tab");
    if (activeTab) {
        const targetPanelId = activeTab.getAttribute("data-target");
        if (typeof renderToolkitSubTab === "function") {
            renderToolkitSubTab(targetPanelId);
        }
    }
}

// 6. GENERAL PROGRESS COMPUTATIONS & RENDER
function renderAll() {
    renderDashboardOverview();
    renderSubjectProgressBars();
    setTimeout(triggerMathTypesetting, 50);
}

function calculateOverallStats() {
    let totalSubtopics = 0;
    let learnedCount = 0;
    let practicedCount = 0;
    let masteredCount = 0;
    
    Object.keys(appState.syllabusProgress).forEach(id => {
        totalSubtopics++;
        const prog = appState.syllabusProgress[id];
        if (prog.learned) learnedCount++;
        if (prog.practiced) practicedCount++;
        if (prog.mastered) masteredCount++;
    });

    let totalPrepPoints = 0;
    Object.keys(appState.syllabusProgress).forEach(id => {
        const prog = appState.syllabusProgress[id];
        if (prog.mastered) {
            totalPrepPoints += 1.0;
        } else if (prog.practiced) {
            totalPrepPoints += 0.6;
        } else if (prog.learned) {
            totalPrepPoints += 0.3;
        }
    });

    const prepScorePercent = totalSubtopics > 0 ? Math.round((totalPrepPoints / totalSubtopics) * 100) : 0;
    
    // Subject wise progress
    const subjectProgress = {};
    const subjectTotals = {};
    
    SYLLABUS_DATA.forEach(topic => {
        const subName = topic.subject;
        if (!subjectProgress[subName]) {
            subjectProgress[subName] = 0;
            subjectTotals[subName] = 0;
        }
        
        topic.subtopics.forEach(sub => {
            subjectTotals[subName]++;
            const prog = appState.syllabusProgress[sub.id];
            if (prog) {
                if (prog.mastered) subjectProgress[subName] += 1.0;
                else if (prog.practiced) subjectProgress[subName] += 0.6;
                else if (prog.learned) subjectProgress[subName] += 0.3;
            }
        });
    });

    const subjectScores = {};
    Object.keys(subjectTotals).forEach(sub => {
        subjectScores[sub] = Math.round((subjectProgress[sub] / subjectTotals[sub]) * 100);
    });

    return {
        prepScore: prepScorePercent,
        learned: learnedCount,
        practiced: practicedCount,
        mastered: masteredCount,
        total: totalSubtopics,
        subjectScores: subjectScores
    };
}

function renderDashboardOverview() {
    const stats = calculateOverallStats();
    
    // Prep Score card
    document.getElementById("prep-score").innerText = stats.prepScore + "%";
    document.getElementById("prep-score-fill").style.width = stats.prepScore + "%";
    
    // Day progress card
    document.getElementById("day-progress").innerText = `Day ${appState.currentDay} of 40`;
    const progressPercent = ((appState.currentDay) / 40) * 100;
    document.getElementById("day-progress-fill").style.width = Math.min(progressPercent, 100) + "%";
    
    // Mocks card
    const loggedMocks = appState.mocks.length;
    document.getElementById("mocks-taken-count").innerText = loggedMocks;
    const mockPercent = (loggedMocks / 30) * 100; // Target: 30 Mocks
    document.getElementById("mocks-fill").style.width = Math.min(mockPercent, 100) + "%";
    
    // Mission Day Num
    document.getElementById("mission-day-num").innerText = appState.currentDay;

    // Daily Goals card - Calculated via Today's target checkmarks
    updateTodayGoalsRatio();

    // Load Today's tasks (Missions)
    renderTodayMissions();
    
    // Load daily rituals checkbox states
    loadRituals();
}

function updateTodayGoalsRatio() {
    const dayData = PLAN_DATA.find(d => d.day === appState.currentDay);
    if (!dayData) return;

    let targetCount = dayData.targets.length;
    let completedCount = 0;

    dayData.targets.forEach(targetId => {
        const prog = appState.syllabusProgress[targetId];
        // Goal is complete if either Practiced or Mastered is checked
        if (prog && (prog.practiced || prog.mastered)) {
            completedCount++;
        }
    });

    // Add extra ritual goals (total 4 checks)
    const ritualsCompleted = Object.values(appState.dailyRituals).filter(Boolean).length;
    const totalGoals = targetCount + 4;
    const completedGoals = completedCount + ritualsCompleted;

    document.getElementById("daily-goals-ratio").innerText = `${completedGoals}/${totalGoals} Done`;
    const goalPercent = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
    document.getElementById("daily-goals-fill").style.width = goalPercent + "%";
}

function renderTodayMissions() {
    const container = document.getElementById("today-tasks-container");
    const dayData = PLAN_DATA.find(d => d.day === appState.currentDay);
    
    if (!dayData) {
        container.innerHTML = `<div class="text-center text-xs text-gray-500 py-4">No study targets scheduled for today. Complete the preparation!</div>`;
        return;
    }

    // Set phase badge
    const badgeEl = document.getElementById("mission-phase-badge");
    if (dayData.phase === 1) {
        badgeEl.innerText = "Phase 1: Foundations";
        badgeEl.className = "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accentPurple/20 border border-accentPurple/30 text-purple-300 uppercase";
    } else if (dayData.phase === 2) {
        badgeEl.innerText = "Phase 2: Application";
        badgeEl.className = "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accentAmber/20 border border-accentAmber/30 text-amber-300 uppercase";
    } else if (dayData.phase === 3) {
        badgeEl.innerText = "Phase 3: Advanced Math";
        badgeEl.className = "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accentCyan/20 border border-accentCyan/30 text-cyan-300 uppercase";
    } else {
        badgeEl.innerText = "Phase 4: Revision";
        badgeEl.className = "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accentRose/20 border border-accentRose/30 text-rose-300 uppercase";
    }

    if (dayData.targets.length === 0) {
        // Revision / Mock Day
        container.innerHTML = `
            <div class="bg-bgCard border-l-4 border-accentRose border-t border-r border-b border-white/5 rounded-xl p-4 shadow">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-[10px] font-bold uppercase text-accentRose"><i class="fa-solid fa-trophy mr-1"></i> Simulation Mock Challenge</span>
                    <span class="px-2 py-0.5 bg-accentRose/15 text-accentRose rounded text-[9px] font-bold uppercase">High Weight</span>
                </div>
                <h4 class="text-xs font-bold text-white">${dayData.name}</h4>
                <p class="text-xs text-gray-400 mt-1 leading-relaxed">${dayData.desc}</p>
                <div class="mt-3 p-2 bg-rose-950/20 border border-rose-900/30 rounded text-xs text-rose-300">
                    <strong>Assignment:</strong> ${dayData.test}
                </div>
            </div>
        `;
        return;
    }

    // Load actual topics mapped to this day
    let html = "";
    
    dayData.targets.forEach(targetId => {
        let subFound = null;
        let topicFound = null;
        
        for (const topic of SYLLABUS_DATA) {
            const sub = topic.subtopics.find(s => s.id === targetId);
            if (sub) {
                subFound = sub;
                topicFound = topic;
                break;
            }
        }

        if (subFound && topicFound) {
            const prog = appState.syllabusProgress[subFound.id] || { learned: false, practiced: false, mastered: false };
            const subClass = topicFound.subject === "Quantitative Aptitude" ? "accentCyan" :
                             topicFound.subject === "General Intelligence & Reasoning" ? "accentPurple" :
                             topicFound.subject === "English Language & Comprehension" ? "accentRose" : "accentAmber";
            
            const badgeDiffClass = subFound.difficulty === "Easy" ? "bg-accentGreen/10 border-accentGreen/20 text-accentGreen" :
                                   subFound.difficulty === "Moderate" ? "bg-accentAmber/10 border-accentAmber/20 text-accentAmber" : 
                                   "bg-accentRose/10 border-accentRose/20 text-accentRose";

            html += `
                <div class="bg-bgCard border border-white/5 rounded-xl p-4 shadow hover:border-white/10 transition duration-200" data-subtopic-id="${subFound.id}">
                    <div class="flex justify-between items-start gap-2 flex-wrap mb-2">
                        <span class="text-[10px] font-bold uppercase text-${subClass}"><i class="fa-solid fa-folder-open mr-1"></i> ${topicFound.subject} &bull; ${topicFound.topic}</span>
                        <div class="flex gap-1.5">
                            <span class="border px-2 py-0.5 rounded text-[9px] font-bold uppercase ${badgeDiffClass}">${subFound.difficulty}</span>
                            <span class="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[9px] font-bold text-gray-400 uppercase">${subFound.weightage} Weight</span>
                        </div>
                    </div>
                    <h4 class="text-xs font-bold text-white mb-3">${subFound.name}</h4>
                    
                    <div class="flex gap-4 border-t border-white/5 pt-3">
                        <label class="flex items-center gap-2 cursor-pointer text-xs text-gray-400 hover:text-white select-none">
                            <input type="checkbox" class="task-cb-learned accent-accentCyan" data-id="${subFound.id}" ${prog.learned ? 'checked' : ''}>
                            <span>Learned</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer text-xs text-gray-400 hover:text-white select-none">
                            <input type="checkbox" class="task-cb-practiced accent-accentPurple" data-id="${subFound.id}" ${prog.practiced ? 'checked' : ''}>
                            <span>Practiced (PYQs)</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer text-xs text-gray-400 hover:text-white select-none">
                            <input type="checkbox" class="task-cb-mastered accent-accentGreen" data-id="${subFound.id}" ${prog.mastered ? 'checked' : ''}>
                            <span>Mastered</span>
                        </label>
                    </div>
                </div>
            `;
        }
    });

    container.innerHTML = html;

    // Attach listeners to dashboard mission checkboxes
    container.querySelectorAll("input[type='checkbox']").forEach(cb => {
        cb.addEventListener("change", (e) => {
            const subId = cb.getAttribute("data-id");
            const isLearned = e.target.classList.contains("task-cb-learned");
            const isPracticed = e.target.classList.contains("task-cb-practiced");
            const isMastered = e.target.classList.contains("task-cb-mastered");

            if (!appState.syllabusProgress[subId]) {
                appState.syllabusProgress[subId] = { learned: false, practiced: false, mastered: false };
            }

            if (isLearned) appState.syllabusProgress[subId].learned = cb.checked;
            if (isPracticed) appState.syllabusProgress[subId].practiced = cb.checked;
            if (isMastered) appState.syllabusProgress[subId].mastered = cb.checked;

            saveStateToStorage();
            renderAll();
        });
    });
}

function loadRituals() {
    const rDrill = document.getElementById("ritual-drill");
    const rVocab = document.getElementById("ritual-vocab");
    const rCA = document.getElementById("ritual-ca");
    const rComp = document.getElementById("ritual-computer");

    rDrill.checked = appState.dailyRituals.drill;
    rVocab.checked = appState.dailyRituals.vocab;
    rCA.checked = appState.dailyRituals.ca;
    rComp.checked = appState.dailyRituals.computer;

    const ritualCbs = [
        { el: rDrill, key: "drill" },
        { el: rVocab, key: "vocab" },
        { el: rCA, key: "ca" },
        { el: rComp, key: "computer" }
    ];

    ritualCbs.forEach(item => {
        const newEl = item.el.cloneNode(true);
        item.el.parentNode.replaceChild(newEl, item.el);
        
        newEl.addEventListener("change", (e) => {
            appState.dailyRituals[item.key] = e.target.checked;
            saveStateToStorage();
            updateTodayGoalsRatio();
        });
    });
}

function renderSubjectProgressBars() {
    const stats = calculateOverallStats();
    const container = document.getElementById("subject-progress-dashboard-container");
    
    let html = "";
    
    Object.keys(stats.subjectScores).forEach(sub => {
        const score = stats.subjectScores[sub];
        let subBarColor = "bg-accentCyan";
        let subClass = "text-accentCyan";
        let icon = "fa-calculator";
        let label = "QUANTITATIVE APTITUDE";
        
        if (sub === "General Intelligence & Reasoning") {
            subBarColor = "bg-accentPurple";
            subClass = "text-accentPurple";
            icon = "fa-brain";
            label = "REASONING MODULE";
        } else if (sub === "English Language & Comprehension") {
            subBarColor = "bg-accentRose";
            subClass = "text-accentRose";
            icon = "fa-language";
            label = "ENGLISH GRAMMAR & COMP";
        } else if (sub === "General Awareness") {
            subBarColor = "bg-accentAmber";
            subClass = "text-accentAmber";
            icon = "fa-globe";
            label = "GENERAL GK & CURRENT";
        }

        html += `
            <div class="space-y-1">
                <div class="flex justify-between items-center text-[10px] font-bold text-gray-400">
                    <span><i class="fa-solid ${icon} mr-1 ${subClass}"></i> ${label}</span>
                    <span class="${subClass}">${score}%</span>
                </div>
                <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div class="${subBarColor} h-full rounded-full transition-all duration-300" style="width: ${score}%"></div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// 40-day countdown timer (Count from July 6, 2026 midnight - target August 15, 2026)
function startExamCountdown() {
    function getTargetTime() {
        const dateStr = appState.examDate || "2026-08-15";
        const parts = dateStr.split("T")[0].split("-");
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);
        return new Date(year, month, day).getTime();
    }
    
    function updateCountdown() {
        const targetDate = getTargetTime();
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        const labelEl = document.getElementById("countdown-label");
        if (labelEl) {
            labelEl.innerText = `${appState.examName || "Countdown"}:`;
        }

        if (distance < 0) {
            const labelStr = "TARGET REACHED!";
            const timerEl = document.getElementById("countdown-timer");
            if (timerEl) timerEl.innerText = labelStr;
            const mobTimer = document.getElementById("countdown-timer-mobile");
            if (mobTimer) mobTimer.innerText = labelStr;
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const formatStr = `${days}d : ${hours.toString().padStart(2, "0")}h : ${minutes.toString().padStart(2, "0")}m`;
        const timerEl = document.getElementById("countdown-timer");
        if (timerEl) timerEl.innerText = formatStr;
        
        const mobTimer = document.getElementById("countdown-timer-mobile");
        if (mobTimer) {
            mobTimer.innerText = `${formatStr} : ${seconds.toString().padStart(2, "0")}s`;
        }
    }
    
    updateCountdown();
    if (window.countdownInterval) clearInterval(window.countdownInterval);
    window.countdownInterval = setInterval(updateCountdown, 1000);
}


// 11. STOPWATCH SESSION STUDY & POMODORO TIMER
function initSessionTimer() {
    const btnToggle = document.getElementById("btn-toggle-session");
    const btnReset = document.getElementById("btn-reset-session");
    const timeDisplay = document.getElementById("session-time");

    btnToggle.onclick = () => {
        if (appState.sessionActive) {
            appState.sessionActive = false;
            clearInterval(sessionTimerInterval);
            btnToggle.innerHTML = '<i class="fa-solid fa-play text-accentCyan"></i> Start Timer';
            saveStateToStorage();
        } else {
            appState.sessionActive = true;
            btnToggle.innerHTML = '<i class="fa-solid fa-pause text-accentRose"></i> Pause';
            sessionTimerInterval = setInterval(() => {
                appState.sessionTime++;
                timeDisplay.innerText = formatTimeSeconds(appState.sessionTime);
                if (appState.sessionTime % 60 === 0) saveStateToStorage();
            }, 1000);
        }
    };

    btnReset.onclick = () => {
        if (confirm("Reset current session timer?")) {
            appState.sessionActive = false;
            clearInterval(sessionTimerInterval);
            appState.sessionTime = 0;
            timeDisplay.innerText = "00:00:00";
            btnToggle.innerHTML = '<i class="fa-solid fa-play text-accentCyan"></i> Start Timer';
            saveStateToStorage();
        }
    };

    if (appState.sessionActive) {
        appState.sessionActive = false;
        btnToggle.click();
    } else {
        timeDisplay.innerText = formatTimeSeconds(appState.sessionTime);
    }
}

function formatTimeSeconds(secs) {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return [hours, minutes, seconds].map(v => v.toString().padStart(2, "0")).join(":");
}

function initPomoTimer() {
    // Enforce 25m study timer as default
    appState.pomoTime = 1500;
    appState.pomoMode = "study";
    appState.pomoActive = false;
    
    const btnStart = document.getElementById("btn-pomo-start");
    const btnPause = document.getElementById("btn-pomo-pause");
    const btnReset = document.getElementById("btn-pomo-reset");
    const timeDisplay = document.getElementById("pomo-time-display");
    const ringFill = document.getElementById("pomo-progress");
    const statusLabel = document.getElementById("pomo-status-label");
    const modesButtons = document.querySelectorAll(".btn-pomo-mode");

    let initialTime = appState.pomoTime;

    const updatePomoDisplay = () => {
        const mins = Math.floor(appState.pomoTime / 60);
        const secs = appState.pomoTime % 60;
        const formatted = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        
        if (timeDisplay) timeDisplay.innerText = formatted;
        
        const capsuleTime = document.getElementById("pomo-capsule-time");
        if (capsuleTime) capsuleTime.innerText = formatted;
        
        const pct = appState.pomoTime / initialTime;
        const offset = pomoRingCircumference * (1 - pct);
        if (ringFill) ringFill.style.strokeDashoffset = isNaN(offset) ? 0 : offset;
        
        // Update Play/Pause button icon inside Pomo Capsule in the Top Bar
        const capsuleToggle = document.getElementById("btn-pomo-capsule-toggle");
        if (capsuleToggle) {
            capsuleToggle.innerHTML = appState.pomoActive ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
        }
    };

    btnStart.onclick = () => {
        appState.pomoActive = true;
        if (btnStart) btnStart.disabled = true;
        if (btnPause) btnPause.disabled = false;
        
        updatePomoDisplay(); // Sync Play/Pause icon immediately
        
        pomoTimerInterval = setInterval(() => {
            if (appState.pomoTime > 0) {
                appState.pomoTime--;
                updatePomoDisplay();
            } else {
                clearInterval(pomoTimerInterval);
                appState.pomoActive = false;
                if (btnStart) btnStart.disabled = false;
                if (btnPause) btnPause.disabled = true;
                
                speakText("Focus timer completed. Great job, soldier! Take a rest break.");
                appState.pomoTime = initialTime;
                updatePomoDisplay();
            }
        }, 1000);
    };

    btnPause.onclick = () => {
        appState.pomoActive = false;
        if (btnStart) btnStart.disabled = false;
        if (btnPause) btnPause.disabled = true;
        clearInterval(pomoTimerInterval);
        updatePomoDisplay(); // Sync Play/Pause icon immediately
    };

    btnReset.onclick = () => {
        appState.pomoActive = false;
        if (btnStart) btnStart.disabled = false;
        if (btnPause) btnPause.disabled = true;
        clearInterval(pomoTimerInterval);
        appState.pomoTime = initialTime;
        updatePomoDisplay();
    };

    modesButtons.forEach(btn => {
        btn.onclick = () => {
            modesButtons.forEach(b => b.classList.remove("active-nav-tab"));
            btn.classList.add("active-nav-tab");
            
            const seconds = parseInt(btn.getAttribute("data-time"));
            const mode = btn.getAttribute("data-mode");
            
            appState.pomoMode = mode;
            initialTime = seconds;
            appState.pomoTime = seconds;
            
            if (statusLabel) statusLabel.innerText = mode === "study" ? "STUDY TIME" : "REST BREAK";
            if (ringFill) ringFill.style.stroke = mode === "study" ? "var(--accent-rose)" : "var(--accent-green)";
            
            btnReset.click();
        };
    });

    // === TOP BAR POMODORO CAPSULE & POPOVER TOGGLE LISTENERS ===
    const pomoCapsule = document.getElementById("pomo-capsule");
    const pomoDrawer = document.getElementById("pomo-drawer");
    const pomoDrawerClose = document.getElementById("btn-pomo-drawer-close");

    function showPomoPopover() {
        if (!pomoDrawer) return;
        pomoDrawer.classList.remove("opacity-0", "pointer-events-none", "-translate-y-2");
        pomoDrawer.classList.add("opacity-100", "pointer-events-auto", "translate-y-0");
    }

    function hidePomoPopover() {
        if (!pomoDrawer) return;
        pomoDrawer.classList.add("opacity-0", "pointer-events-none", "-translate-y-2");
        pomoDrawer.classList.remove("opacity-100", "pointer-events-auto", "translate-y-0");
    }

    function togglePomoPopover() {
        if (!pomoDrawer) return;
        const isHidden = pomoDrawer.classList.contains("opacity-0");
        if (isHidden) {
            showPomoPopover();
        } else {
            hidePomoPopover();
        }
    }

    if (pomoCapsule && pomoDrawer) {
        pomoCapsule.onclick = (e) => {
            // If play/pause button inside capsule was clicked
            if (e.target.closest("#btn-pomo-capsule-toggle")) {
                if (appState.pomoActive) {
                    if (btnPause) btnPause.click();
                } else {
                    if (btnStart) btnStart.click();
                }
                e.stopPropagation();
                return;
            }
            togglePomoPopover();
        };
    }

    if (pomoDrawerClose) {
        pomoDrawerClose.onclick = () => {
            hidePomoPopover();
        };
    }

    // Close popover when clicking outside it
    document.addEventListener("click", (e) => {
        if (pomoDrawer && !pomoDrawer.classList.contains("opacity-0")) {
            if (!pomoDrawer.contains(e.target) && !pomoCapsule.contains(e.target)) {
                hidePomoPopover();
            }
        }
    });

    updatePomoDisplay();
}

function speakText(txt) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(txt);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}
