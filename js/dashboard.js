// === DASHBOARD & TIMER MODULE ===
function initExamTargetEditor() {
    const btnToggle = document.getElementById("btn-toggle-exam-edit");
    const viewPanel = document.getElementById("exam-target-view");
    const editPanel = document.getElementById("exam-target-edit");
    const inputName = document.getElementById("input-exam-name");
    const inputDate = document.getElementById("input-exam-date");
    const btnSave = document.getElementById("btn-save-exam-target");
    const btnCancel = document.getElementById("btn-cancel-exam-target");

    if (inputDate && window.initCustomCalendar) {
        window.initCustomCalendar(inputDate);
    }

    function updateDisplay() {
        const displayName = document.getElementById("display-exam-name");
        const displayDate = document.getElementById("display-exam-date");
        const headerLabel = document.getElementById("countdown-label");

        if (displayName) displayName.innerText = appState.examName || "Conquest";
        if (displayDate) displayDate.innerText = formatDateReadable(appState.examDate || "2026-08-15");
        if (headerLabel) headerLabel.innerText = `${appState.examName || "Conquest"}:`;
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
                if (window.showToast) {
                    window.showToast("Please enter both target exam name and date.", "warning");
                } else {
                    alert("Please enter both target exam name and date.");
                }
                return;
            }

            appState.examName = nameVal;
            appState.examDate = dateVal;
            saveStateToStorage();
            updateDisplay();
            startExamCountdown();

            if (typeof closeExamTargetModal === "function") closeExamTargetModal();
            if (editPanel) editPanel.classList.add("hidden");
            if (viewPanel) viewPanel.classList.remove("hidden");
            if (btnToggle) btnToggle.innerText = "Edit";
            if (window.showToast) window.showToast("Target settings saved successfully!", "success");
        };
    }

    updateDisplay();
    initTierToggler();
}

function initTierToggler() {
    const btn1 = document.getElementById("btn-tier-1-toggle");
    const btn2 = document.getElementById("btn-tier-2-toggle");
    
    if (!btn1 || !btn2) return;
    
    function updateTogglerUI() {
        const tier = appState.examTier || 1;
        if (tier === 1) {
            btn1.className = "px-2.5 py-0.5 rounded-md transition duration-200 text-white bg-accentPurple";
            btn2.className = "px-2.5 py-0.5 rounded-md transition duration-200 text-gray-400 hover:text-white";
        } else {
            btn1.className = "px-2.5 py-0.5 rounded-md transition duration-200 text-gray-400 hover:text-white";
            btn2.className = "px-2.5 py-0.5 rounded-md transition duration-200 text-white bg-accentPurple";
        }
    }
    
    btn1.onclick = () => {
        if (appState.examTier === 1) return;
        appState.examTier = 1;
        saveStateToStorage();
        updateTogglerUI();
        if (window.updateMockFormLimits) window.updateMockFormLimits();
        renderAll();
        if (typeof renderMockAnalytics === "function") renderMockAnalytics();
        if (window.showToast) window.showToast("Switched target view to SSC CGL Tier 1", "info");
    };
    
    btn2.onclick = () => {
        if (appState.examTier === 2) return;
        appState.examTier = 2;
        saveStateToStorage();
        updateTogglerUI();
        if (window.updateMockFormLimits) window.updateMockFormLimits();
        renderAll();
        if (typeof renderMockAnalytics === "function") renderMockAnalytics();
        if (window.showToast) window.showToast("Switched target view to SSC CGL Tier 2", "info");
    };
    
    updateTogglerUI();
    if (window.updateMockFormLimits) window.updateMockFormLimits();
}
window.initTierToggler = initTierToggler;


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
    
    // Prep Score & Exam Readiness Capsules
    document.getElementById("prep-score").innerText = stats.prepScore + "%";
    document.getElementById("prep-score-fill").style.width = stats.prepScore + "%";
    const readinessEl = document.getElementById("readiness-score-display");
    if (readinessEl) readinessEl.innerText = stats.prepScore + "%";
    const readinessFillEl = document.getElementById("readiness-score-fill");
    if (readinessFillEl) readinessFillEl.style.width = stats.prepScore + "%";

    // Streak Capsule Update
    updateStreakData();
    const streakEl = document.getElementById("streak-count-display");
    if (streakEl) streakEl.innerText = `${appState.streak || 1}d Streak`;
    
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
                             topicFound.subject === "English Language & Comprehension" ? "accentRose" :
                             topicFound.subject === "Computer Knowledge" ? "blue-400" : "accentAmber";
            
            const badgeDiffClass = subFound.difficulty === "Easy" ? "bg-accentGreen/10 border-accentGreen/20 text-accentGreen" :
                                   subFound.difficulty === "Moderate" ? "bg-accentAmber/10 border-accentAmber/20 text-accentAmber" : 
                                   "bg-accentRose/10 border-accentRose/20 text-accentRose";

            html += `
                <div class="bg-bgCard/90 border border-white/10 rounded-2xl p-4 shadow-lg hover:border-white/20 transition duration-200" data-subtopic-id="${subFound.id}">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <!-- Left Side: Topic Info & Badges -->
                        <div class="space-y-1.5 flex-1 min-w-0">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-[10px] font-bold uppercase text-${subClass}"><i class="fa-solid fa-folder-open mr-1"></i> ${topicFound.subject} &bull; ${topicFound.topic}</span>
                                <span class="border px-2 py-0.5 rounded text-[9px] font-bold uppercase ${badgeDiffClass}">${subFound.difficulty}</span>
                                <span class="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[9px] font-bold text-gray-400 uppercase">${subFound.weightage} Weight</span>
                            </div>
                            <h4 class="text-xs font-extrabold text-white leading-snug">${subFound.name}${appState.weakAlerts && appState.weakAlerts[subFound.id] ? ' <span class="inline-flex items-center text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded font-bold ml-1.5 animate-pulse">🚨 Weak</span>' : ''}</h4>
                        </div>
                        
                        <!-- Right Side (Desktop/Laptop): Clean Checkbox Pill Controls -->
                        <div class="flex items-center gap-3 shrink-0 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-white/10 shadow-inner">
                            <label class="flex items-center gap-1.5 cursor-pointer text-xs text-gray-300 hover:text-white select-none">
                                <input type="checkbox" class="task-cb-learned accent-cyan-400" data-id="${subFound.id}" ${prog.learned ? 'checked' : ''}>
                                <span class="text-[11px] font-bold">Learned</span>
                            </label>
                            <span class="text-gray-600 text-xs">|</span>
                            <label class="flex items-center gap-1.5 cursor-pointer text-xs text-gray-300 hover:text-white select-none">
                                <input type="checkbox" class="task-cb-practiced accent-purple-400" data-id="${subFound.id}" ${prog.practiced ? 'checked' : ''}>
                                <span class="text-[11px] font-bold">Practiced</span>
                            </label>
                            <span class="text-gray-600 text-xs">|</span>
                            <label class="flex items-center gap-1.5 cursor-pointer text-xs text-gray-300 hover:text-white select-none">
                                <input type="checkbox" class="task-cb-mastered accent-emerald-400" data-id="${subFound.id}" ${prog.mastered ? 'checked' : ''}>
                                <span class="text-[11px] font-bold">Mastered</span>
                            </label>
                        </div>
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

            // Trigger ranked confetti celebration feedback
            if (cb.checked) {
                if (isMastered) {
                    if (window.triggerConfetti) window.triggerConfetti('high');
                } else if (isPracticed) {
                    if (window.triggerConfetti) window.triggerConfetti('medium');
                } else if (isLearned) {
                    if (window.triggerConfetti) window.triggerConfetti('low');
                }
            }

            saveStateToStorage();
            renderAll();
        });
    });
}

function loadRituals() {
    const ritualKeys = [
        { id: "ritual-drill", key: "drill" },
        { id: "ritual-vocab", key: "vocab" },
        { id: "ritual-ca", key: "ca" },
        { id: "ritual-computer", key: "computer" }
    ];

    ritualKeys.forEach(({ id, key }) => {
        const cb = document.getElementById(id);
        if (!cb) return;

        const isChecked = appState.dailyRituals[key] === true;
        cb.checked = isChecked;
        syncRitualVisual(cb, isChecked);

        cb.onchange = (e) => {
            const checked = e.target.checked;
            appState.dailyRituals[key] = checked;
            syncRitualVisual(cb, checked);
            saveStateToStorage();
            updateTodayGoalsRatio();
            updateRitualProgress();
        };
    });

    updateRitualProgress();
}

function syncRitualVisual(cb, checked) {
    const label = cb.closest(".ritual-checkbox");
    if (!label) return;

    const circle = label.querySelector("div.w-4");
    const icon = label.querySelector("i.fa-check");
    if (!circle || !icon) return;

    if (checked) {
        circle.classList.remove("border-white/20");
        circle.classList.add("border-accentAmber/50", "bg-accentAmber/10");
        icon.classList.remove("opacity-0");
        icon.classList.add("opacity-100");
    } else {
        circle.classList.remove("border-accentAmber/50", "bg-accentAmber/10");
        circle.classList.add("border-white/20");
        icon.classList.remove("opacity-100");
        icon.classList.add("opacity-0");
    }
}

function updateRitualProgress() {
    const completed = Object.values(appState.dailyRituals).filter(Boolean).length;
    const labelEl = document.getElementById("ritual-progress-label");
    if (labelEl) labelEl.innerText = `${completed}/4`;
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
        } else if (sub === "Computer Knowledge") {
            subBarColor = "bg-blue-500";
            subClass = "text-blue-400";
            icon = "fa-laptop";
            label = "COMPUTER KNOWLEDGE";
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
        
        const formatStr = `${days}d : ${hours.toString().padStart(2, "0")}h : ${minutes.toString().padStart(2, "0")}m : ${seconds.toString().padStart(2, "0")}s`;
        const timerEl = document.getElementById("countdown-timer");
        if (timerEl) timerEl.innerText = formatStr;
        
        const mobTimer = document.getElementById("countdown-timer-mobile");
        if (mobTimer) {
            mobTimer.innerText = formatStr;
        }
    }
    
    updateCountdown();
    if (window.countdownInterval) clearInterval(window.countdownInterval);
    window.countdownInterval = setInterval(updateCountdown, 1000);
}


// // 11. UNIFIED MASTER STUDY & POMODORO TIMER ENGINE
let masterTimerInterval = null;

function updateMasterTimerUI() {
    const isStopwatch = (appState.timerMode || "stopwatch") === "stopwatch";
    const isActive = appState.timerActive === true;
    
    // Formatted Time String
    let formattedText = "";
    if (isStopwatch) {
        formattedText = formatTimeSeconds(appState.sessionTime || 0);
    } else {
        const mins = Math.floor((appState.pomoTime || 1500) / 60);
        const secs = (appState.pomoTime || 1500) % 60;
        formattedText = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    // 1. Dashboard Widget UI (#session-time, #btn-toggle-session)
    const dashTimeEl = document.getElementById("session-time");
    if (dashTimeEl) dashTimeEl.innerText = formattedText;
    const dashToggleBtn = document.getElementById("btn-toggle-session");
    if (dashToggleBtn) {
        dashToggleBtn.innerHTML = isActive 
            ? '<i class="fa-solid fa-pause text-rose-400"></i> Pause'
            : '<i class="fa-solid fa-play text-cyan-400"></i> Start';
    }

    // 2. Top Bar Capsule UI (#pomo-capsule-time, #pomo-capsule-icon, #btn-pomo-capsule-toggle)
    const capsuleTimeEl = document.getElementById("pomo-capsule-time");
    if (capsuleTimeEl) capsuleTimeEl.innerText = formattedText;
    const capsuleIconEl = document.getElementById("pomo-capsule-icon");
    if (capsuleIconEl) capsuleIconEl.innerText = isStopwatch ? "⏱" : "🍅";
    const capsuleToggleBtn = document.getElementById("btn-pomo-capsule-toggle");
    if (capsuleToggleBtn) {
        capsuleToggleBtn.innerHTML = isActive ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    }

    // 3. Popover Drawer UI (#pomo-time-display, #pomo-status-label, #btn-pomo-start, #btn-pomo-pause)
    const popoverTimeEl = document.getElementById("pomo-time-display");
    if (popoverTimeEl) popoverTimeEl.innerText = formattedText;
    const popoverStatusEl = document.getElementById("pomo-status-label");
    if (popoverStatusEl) {
        popoverStatusEl.innerText = isStopwatch 
            ? "STOPWATCH SESSION" 
            : (appState.timerMode === "short-break" ? "REST BREAK" : "POMODORO FOCUS");
    }

    const popoverStartBtn = document.getElementById("btn-pomo-start");
    const popoverPauseBtn = document.getElementById("btn-pomo-pause");
    if (popoverStartBtn) popoverStartBtn.disabled = isActive;
    if (popoverPauseBtn) popoverPauseBtn.disabled = !isActive;

    // Progress Ring Calculation
    const ringFill = document.getElementById("pomo-progress");
    if (ringFill) {
        if (isStopwatch) {
            const pct = ((appState.sessionTime || 0) % 60) / 60;
            ringFill.style.strokeDashoffset = pomoRingCircumference * (1 - pct);
            ringFill.style.stroke = "#22d3ee";
        } else {
            const initialTime = appState.pomoInitialTime || 1500;
            const pct = (appState.pomoTime || 0) / initialTime;
            const offset = pomoRingCircumference * (1 - pct);
            ringFill.style.strokeDashoffset = isNaN(offset) ? 0 : offset;
            ringFill.style.stroke = appState.timerMode === "short-break" ? "#10b981" : "#f43f5e";
        }
    }
}

function toggleMasterTimer() {
    if (appState.timerActive) {
        pauseMasterTimer();
    } else {
        startMasterTimer();
    }
}

function startMasterTimer() {
    appState.timerActive = true;
    appState.sessionActive = true;
    appState.pomoActive = true;
    updateMasterTimerUI();

    if (masterTimerInterval) clearInterval(masterTimerInterval);
    masterTimerInterval = setInterval(() => {
        const isStopwatch = (appState.timerMode || "stopwatch") === "stopwatch";
        if (isStopwatch) {
            appState.sessionTime = (appState.sessionTime || 0) + 1;
            if (appState.sessionTime % 60 === 0) saveStateToStorage();
        } else {
            if (appState.pomoTime > 0) {
                appState.pomoTime--;
            } else {
                pauseMasterTimer();
                const msg = "Focus session completed! Great job soldier, take a short rest.";
                if (typeof speakText === "function") speakText(msg);
                if (window.showToast) window.showToast(msg, "success");
                appState.pomoTime = appState.pomoInitialTime || 1500;
            }
        }
        updateMasterTimerUI();
    }, 1000);
}

function pauseMasterTimer() {
    appState.timerActive = false;
    appState.sessionActive = false;
    appState.pomoActive = false;
    if (masterTimerInterval) clearInterval(masterTimerInterval);
    saveStateToStorage();
    updateMasterTimerUI();
}

function resetMasterTimer() {
    pauseMasterTimer();
    const isStopwatch = (appState.timerMode || "stopwatch") === "stopwatch";
    if (isStopwatch) {
        appState.sessionTime = 0;
    } else {
        appState.pomoTime = appState.pomoInitialTime || 1500;
    }
    saveStateToStorage();
    updateMasterTimerUI();
}

function initSessionTimer() {
    const btnToggle = document.getElementById("btn-toggle-session");
    const btnReset = document.getElementById("btn-reset-session");

    if (btnToggle) btnToggle.onclick = () => toggleMasterTimer();
    if (btnReset) {
        btnReset.onclick = () => {
            if (confirm("Reset current study session timer?")) resetMasterTimer();
        };
    }
    updateMasterTimerUI();
}

function formatTimeSeconds(secs) {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return [hours, minutes, seconds].map(v => v.toString().padStart(2, "0")).join(":");
}

function initPomoTimer() {
    if (!appState.timerMode) appState.timerMode = "stopwatch";
    if (!appState.sessionTime) appState.sessionTime = 0;
    if (!appState.pomoTime) appState.pomoTime = 1500;
    if (!appState.pomoInitialTime) appState.pomoInitialTime = 1500;

    const btnStart = document.getElementById("btn-pomo-start");
    const btnPause = document.getElementById("btn-pomo-pause");
    const btnReset = document.getElementById("btn-pomo-reset");
    const modesButtons = document.querySelectorAll(".btn-pomo-mode");

    if (btnStart) btnStart.onclick = () => startMasterTimer();
    if (btnPause) btnPause.onclick = () => pauseMasterTimer();
    if (btnReset) btnReset.onclick = () => resetMasterTimer();

    modesButtons.forEach(btn => {
        btn.onclick = () => {
            modesButtons.forEach(b => {
                b.classList.remove("active-pomo-mode", "bg-cyan-600", "text-white");
                b.classList.add("bg-white/5", "text-gray-400");
            });
            btn.classList.add("active-pomo-mode", "bg-cyan-600", "text-white");
            btn.classList.remove("bg-white/5", "text-gray-400");

            const mode = btn.getAttribute("data-mode");
            const seconds = parseInt(btn.getAttribute("data-time")) || 0;

            appState.timerMode = mode;
            if (mode === "stopwatch") {
                appState.sessionTime = 0;
            } else {
                appState.pomoInitialTime = seconds;
                appState.pomoTime = seconds;
            }

            resetMasterTimer();
        };
    });

    // Top Bar Capsule & Drawer Popover Toggle
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
        if (isHidden) showPomoPopover();
        else hidePomoPopover();
    }

    if (pomoCapsule && pomoDrawer) {
        pomoCapsule.onclick = (e) => {
            if (e.target.closest("#btn-pomo-capsule-toggle")) {
                toggleMasterTimer();
                e.stopPropagation();
                return;
            }
            togglePomoPopover();
        };

        if (pomoDrawerClose) {
            pomoDrawerClose.onclick = () => hidePomoPopover();
        }

        document.addEventListener("click", (e) => {
            if (!pomoCapsule.contains(e.target) && !pomoDrawer.contains(e.target)) {
                hidePomoPopover();
            }
        });
    }

    updateMasterTimerUI();
}

window.toggleMasterTimer = toggleMasterTimer;
window.startMasterTimer = startMasterTimer;
window.pauseMasterTimer = pauseMasterTimer;
window.resetMasterTimer = resetMasterTimer;

// Update Daily Streak Calculation
function updateStreakData() {
    const today = new Date().toISOString().split('T')[0];
    if (!appState.lastActiveDate) {
        appState.lastActiveDate = today;
        appState.streak = 1;
        saveStateToStorage();
        return;
    }

    if (appState.lastActiveDate === today) {
        return; // Already active today
    }

    const lastDate = new Date(appState.lastActiveDate);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        appState.streak = (appState.streak || 1) + 1;
    } else if (diffDays > 1) {
        appState.streak = 1;
    }
    appState.lastActiveDate = today;
    saveStateToStorage();
}

// Exam Target Popup Modal Functions
function openExamTargetModal() {
    const modal = document.getElementById("exam-target-modal");
    if (!modal) return;
    const inputName = document.getElementById("input-exam-name");
    const inputDate = document.getElementById("input-exam-date");
    if (inputName) inputName.value = appState.examName || "Conquest";
    if (inputDate) inputDate.value = appState.examDate ? appState.examDate.split("T")[0] : "2026-08-15";

    modal.classList.remove("opacity-0", "pointer-events-none");
    modal.classList.add("opacity-100", "pointer-events-auto");
    const card = modal.firstElementChild;
    if (card) {
        card.classList.remove("scale-95");
        card.classList.add("scale-100");
    }
}

function closeExamTargetModal() {
    const modal = document.getElementById("exam-target-modal");
    if (!modal) return;
    const card = modal.firstElementChild;
    if (card) {
        card.classList.remove("scale-100");
        card.classList.add("scale-95");
    }
    modal.classList.remove("opacity-100", "pointer-events-auto");
    modal.classList.add("opacity-0", "pointer-events-none");
}
window.openExamTargetModal = openExamTargetModal;
window.closeExamTargetModal = closeExamTargetModal;

// Global Lightweight Canvas Confetti Engine with Tiered Celebration Intensities
window.triggerConfetti = function(intensity = 'medium') {
    try {
        const canvas = document.createElement("canvas");
        canvas.style.position = "fixed";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
        canvas.style.pointerEvents = "none";
        canvas.style.zIndex = "99999";
        document.body.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = ["#06b6d4", "#8b5cf6", "#f43f5e", "#f59e0b", "#10b981", "#ec4899", "#3b82f6"];
        const particles = [];
        let particleCount = 50;
        let speedMult = 1.0;

        if (intensity === 'low') {
            particleCount = 25;
            speedMult = 0.7;
        } else if (intensity === 'medium') {
            particleCount = 55;
            speedMult = 1.0;
        } else if (intensity === 'high') {
            particleCount = 95;
            speedMult = 1.3;
        } else if (intensity === 'grand') {
            particleCount = 150;
            speedMult = 1.6;
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: canvas.width / 2 + (Math.random() * 260 - 130),
                y: canvas.height * 0.35 + (Math.random() * 100 - 50),
                vx: (Math.random() - 0.5) * 14 * speedMult,
                vy: (Math.random() - 0.85) * 14 * speedMult,
                size: Math.random() * 9 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rSpeed: (Math.random() - 0.5) * 12,
                opacity: 1
            });
        }

        const startTime = Date.now();
        const duration = intensity === 'low' ? 1400 : intensity === 'medium' ? 1800 : 2500;
        function animate() {
            const elapsed = Date.now() - startTime;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.28; // Gravity
                p.rotation += p.rSpeed;
                p.opacity = Math.max(0, 1 - elapsed / duration);

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            });

            if (elapsed < duration) {
                requestAnimationFrame(animate);
            } else {
                canvas.remove();
            }
        }
        requestAnimationFrame(animate);
    } catch (e) {
        console.warn("Confetti trigger failed:", e);
    }
};
