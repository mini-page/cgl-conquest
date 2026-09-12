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
            btn1.className = "px-3 py-1 rounded-lg text-xs font-black transition duration-200 text-white bg-blue-600 shadow-md shadow-blue-500/20 cursor-pointer";
            btn2.className = "px-3 py-1 rounded-lg text-xs font-bold transition duration-200 text-gray-400 hover:text-white cursor-pointer";
        } else {
            btn1.className = "px-3 py-1 rounded-lg text-xs font-bold transition duration-200 text-gray-400 hover:text-white cursor-pointer";
            btn2.className = "px-3 py-1 rounded-lg text-xs font-black transition duration-200 text-white bg-blue-600 shadow-md shadow-blue-500/20 cursor-pointer";
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
    const streakMiniBadge = document.getElementById("streak-badge-mini");
    if (streakMiniBadge) {
        const mult = (window.rewardsSystem ? window.rewardsSystem.getStreakMultiplier(appState.streak || 1).mult : 1.0).toFixed(1);
        streakMiniBadge.textContent = `${mult}x`;
    }
    
    // Day progress card
    document.getElementById("day-progress").innerText = `Day ${appState.currentDay} of 40`;
    const progressPercent = ((appState.currentDay) / 40) * 100;
    document.getElementById("day-progress-fill").style.width = Math.min(progressPercent, 100) + "%";
    
    // Roadmap progress pill (links to Study Plan)
    const pctEl = document.getElementById("plan-pct");
    const fillEl = document.getElementById("plan-pct-fill");
    if (pctEl && typeof PLAN_DATA !== "undefined" && PLAN_DATA.length) {
        const totalDays = PLAN_DATA.length;
        const completedDays = PLAN_DATA.filter(d => d.day < appState.currentDay).length;
        const planPct = Math.round((completedDays / totalDays) * 100);
        pctEl.innerText = `${planPct}% (${completedDays}/${totalDays} Completed)`;
        if (fillEl) fillEl.style.width = planPct + "%";
    }
    
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
    renderSubjectProgressBars();
    
    // Load daily rituals checkbox states
    loadRituals();

    // Render Spaced Repetition Review (SRS) Due Banner
    renderSrsBanner();

    // Synchronize Hero Bar Nudge Status & Badge
    if (typeof window.renderNudgeHub === 'function') {
        window.renderNudgeHub();
    }
    if (typeof window.setupHeroNudgePopover === 'function') {
        window.setupHeroNudgePopover();
    }
}

function getSrsDueTopics() {
    const srs = appState.srsRecords || {};
    const now = Date.now();
    const intervals = [1 * 86400000, 3 * 86400000, 7 * 86400000, 14 * 86400000, 30 * 86400000];
    const dueIds = [];

    Object.keys(appState.syllabusProgress || {}).forEach(subId => {
        const prog = appState.syllabusProgress[subId];
        if (prog && (prog.learned || prog.practiced) && !prog.mastered) {
            const record = srs[subId] || { lastReviewed: 0, level: 0 };
            const lvl = Math.min(record.level || 0, intervals.length - 1);
            const interval = intervals[lvl];
            if (now - record.lastReviewed >= interval) {
                dueIds.push(subId);
            }
        }
    });
    return dueIds;
}

function renderSrsBanner() {
    const banner = document.getElementById("srs-due-banner");
    const badge = document.getElementById("srs-count-badge");
    if (!banner) return;

    const dueTopics = getSrsDueTopics();
    if (dueTopics.length > 0) {
        banner.classList.remove("hidden");
        if (badge) badge.innerText = `${dueTopics.length} Due Today`;
    } else {
        banner.classList.add("hidden");
    }
}
window.getSrsDueTopics = getSrsDueTopics;
window.renderSrsBanner = renderSrsBanner;

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
        badgeEl.className = "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accentPurple/20 border border-accentPurple/30 text-purple-300 uppercase shrink-0 whitespace-nowrap ml-auto sm:ml-0";
    } else if (dayData.phase === 2) {
        badgeEl.innerText = "Phase 2: Application";
        badgeEl.className = "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accentAmber/20 border border-accentAmber/30 text-amber-300 uppercase shrink-0 whitespace-nowrap ml-auto sm:ml-0";
    } else if (dayData.phase === 3) {
        badgeEl.innerText = "Phase 3: Advanced Math";
        badgeEl.className = "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accentCyan/20 border border-accentCyan/30 text-cyan-300 uppercase shrink-0 whitespace-nowrap ml-auto sm:ml-0";
    } else {
        badgeEl.innerText = "Phase 4: Revision";
        badgeEl.className = "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accentRose/20 border border-accentRose/30 text-rose-300 uppercase shrink-0 whitespace-nowrap ml-auto sm:ml-0";
    }

    if (dayData.targets.length === 0) {
        // Revision / Mock Day
        container.innerHTML = `
            <div class="bg-bgCard border-l-4 border-accentRose border-t border-r border-b border-white/5 rounded-xl p-3.5 sm:p-4 shadow">
                <div class="flex justify-between items-center mb-2 flex-wrap gap-2">
                    <span class="text-[10px] font-bold uppercase text-accentRose flex items-center"><i class="fa-solid fa-trophy mr-1"></i> Simulation Mock Challenge</span>
                    <span class="px-2 py-0.5 bg-accentRose/15 text-accentRose rounded text-[9px] font-bold uppercase">High Weight</span>
                </div>
                <h4 class="text-xs sm:text-sm font-bold text-white">${dayData.name}</h4>
                <p class="text-xs text-gray-400 mt-1 leading-relaxed">${dayData.desc}</p>
                <div class="mt-3 p-2.5 bg-rose-950/20 border border-rose-900/30 rounded-lg text-xs text-rose-300">
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
            const subTheme = topicFound.subject === "Quantitative Aptitude" ? { text: "text-red-400", border: "border-l-red-500", glow: "hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]" } :
                             topicFound.subject === "General Intelligence & Reasoning" ? { text: "text-yellow-400", border: "border-l-yellow-400", glow: "hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]" } :
                             topicFound.subject === "English Language & Comprehension" ? { text: "text-emerald-400", border: "border-l-emerald-500", glow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]" } :
                             topicFound.subject === "General Awareness" ? { text: "text-blue-400", border: "border-l-blue-500", glow: "hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]" } :
                             { text: "text-slate-300", border: "border-l-slate-400", glow: "hover:shadow-[0_0_20px_rgba(148,163,184,0.15)]" };
            
            const badgeDiffClass = subFound.difficulty === "Easy" ? "bg-accentGreen/10 border-accentGreen/20 text-accentGreen" :
                                   subFound.difficulty === "Moderate" ? "bg-accentAmber/10 border-accentAmber/20 text-accentAmber" : 
                                   "bg-accentRose/10 border-accentRose/20 text-accentRose";

            html += `
                <div class="bg-bgCard/90 border border-white/10 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-lg hover:border-white/20 ${subTheme.glow} transition duration-200" data-subtopic-id="${subFound.id}">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <!-- Left Side: Topic Info & Badges -->
                        <div class="space-y-1.5 flex-1 min-w-0">
                            <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                <span class="text-[10px] font-bold uppercase ${subTheme.text} flex items-center gap-1 leading-tight"><i class="fa-solid fa-folder-open text-[9px]"></i> ${topicFound.subject} &bull; ${topicFound.topic}</span>
                                <span class="border px-1.5 sm:px-2 py-0.5 rounded text-[9px] font-bold uppercase ${badgeDiffClass}">${subFound.difficulty}</span>
                                <span class="bg-white/5 border border-white/5 px-1.5 sm:px-2 py-0.5 rounded text-[9px] font-bold text-gray-400 uppercase">${subFound.weightage} Weight</span>
                            </div>
                            <h4 class="text-xs sm:text-sm font-extrabold text-white leading-snug break-words">${subFound.name}${appState.weakAlerts && appState.weakAlerts[subFound.id] ? ' <span class="inline-flex items-center text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded font-bold ml-1 animate-pulse">🚨 Weak</span>' : ''}</h4>
                        </div>
                        
                        <!-- Right Side: Responsive Clean Checkbox Pill Controls Matching Syllabus -->
                        <div class="flex items-center justify-between sm:justify-start gap-1 sm:gap-2.5 w-full md:w-auto bg-[#0a1128]/95 border border-blue-900/60 shadow-inner px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl shrink-0">
                            <div data-dash-tri="${subFound.id}" data-flag="learned" class="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none group/tb py-1 px-1 rounded hover:bg-white/5 active:scale-95 transition" title="Mark as Learned">
                                <span class="tri-box learned shrink-0 ${prog.learned ? 'on' : ''}">${prog.learned ? '✓' : ''}</span>
                                <span class="text-[11px] sm:text-xs font-medium ${prog.learned ? 'text-teal-400 font-semibold' : 'text-zinc-400 group-hover/tb:text-zinc-200'} transition whitespace-nowrap">Learned</span>
                            </div>
                            <span class="text-blue-900/80 select-none text-xs">|</span>
                            <div data-dash-tri="${subFound.id}" data-flag="practiced" class="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none group/tb py-1 px-1 rounded hover:bg-white/5 active:scale-95 transition" title="Mark as Practiced">
                                <span class="tri-box practiced p shrink-0 ${prog.practiced ? 'on p' : ''}">${prog.practiced ? '✓' : ''}</span>
                                <span class="text-[11px] sm:text-xs font-medium ${prog.practiced ? 'text-violet-400 font-semibold' : 'text-zinc-400 group-hover/tb:text-zinc-200'} transition whitespace-nowrap">Practiced</span>
                            </div>
                            <span class="text-blue-900/80 select-none text-xs">|</span>
                            <div data-dash-tri="${subFound.id}" data-flag="mastered" class="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none group/tb py-1 px-1 rounded hover:bg-white/5 active:scale-95 transition" title="Mark as Mastered">
                                <span class="tri-box mastered m shrink-0 ${prog.mastered ? 'on m' : ''}">${prog.mastered ? '✓' : ''}</span>
                                <span class="text-[11px] sm:text-xs font-medium ${prog.mastered ? 'text-amber-400 font-semibold' : 'text-zinc-400 group-hover/tb:text-zinc-200'} transition whitespace-nowrap">Mastered</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    container.innerHTML = html;

    // Attach listeners to dashboard mission tri-boxes matching syllabus
    container.querySelectorAll("[data-dash-tri]").forEach(el => {
        el.onclick = (e) => {
            e.stopPropagation();
            const subId = el.dataset.dashTri;
            const flagKey = el.dataset.flag;
            if (!appState.syllabusProgress[subId]) {
                appState.syllabusProgress[subId] = { learned: false, practiced: false, mastered: false };
            }
            const f = { ...appState.syllabusProgress[subId] };
            f[flagKey] = !f[flagKey];
            if (flagKey === 'mastered' && f.mastered) { f.learned = true; f.practiced = true; }
            if (flagKey === 'practiced' && f.practiced) { f.learned = true; }
            if (flagKey === 'learned' && !f.learned) { f.practiced = false; f.mastered = false; }
            if (flagKey === 'practiced' && !f.practiced) { f.mastered = false; }
            appState.syllabusProgress[subId] = f;

            // Trigger ranked confetti celebration feedback
            if (f[flagKey] && window.triggerConfetti) {
                if (flagKey === 'mastered') window.triggerConfetti('high');
                else if (flagKey === 'practiced') window.triggerConfetti('medium');
                else if (flagKey === 'learned') window.triggerConfetti('low');
            }

            // Gamification reward activity dispatch with dedupKey anti-cheat
            if (f[flagKey] && window.rewardsSystem && typeof window.rewardsSystem.recordActivity === 'function') {
                let subName = 'Topic Target';
                if (typeof SYLLABUS_DATA !== 'undefined' && Array.isArray(SYLLABUS_DATA)) {
                    for (const t of SYLLABUS_DATA) {
                        const s = (t.subtopics || []).find(sub => sub.id === subId);
                        if (s) { subName = s.name; break; }
                    }
                }
                const rewardCfg = flagKey === 'mastered'
                    ? { xp: 60, coins: 25, stars: 1 }
                    : (flagKey === 'practiced' ? { xp: 40, coins: 15, stars: 0 } : { xp: 25, coins: 10, stars: 0 });
                window.rewardsSystem.recordActivity({
                    type: 'syllabus',
                    dedupKey: `syllabus_${subId}_${flagKey}`,
                    title: `${subName} (${flagKey})`,
                    xp: rewardCfg.xp,
                    coins: rewardCfg.coins,
                    stars: rewardCfg.stars
                });
            }

            saveStateToStorage();
            renderAll();
        };
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
            if (typeof window.playSound === 'function') {
                const total = Object.values(appState.dailyRituals).filter(Boolean).length;
                if (checked && total === 4) {
                    window.playSound('success.strong');
                } else if (checked) {
                    window.playSound('checkbox');
                } else {
                    window.playSound('checkbox', { pitch: 0.85 });
                }
            }

            // Gamification reward recording with daily dedupKey anti-cheat
            if (checked && window.rewardsSystem && typeof window.rewardsSystem.recordActivity === 'function') {
                const titles = {
                    drill: 'Speed Drill Ritual',
                    vocab: 'English Vocab Daily Drill',
                    ca: 'Current Affairs Daily Digest',
                    computer: 'Computer Awareness Practice'
                };
                window.rewardsSystem.recordActivity({
                    type: 'ritual',
                    dedupKey: `ritual_${key}`,
                    title: titles[key] || 'Daily Ritual Completed',
                    xp: 35,
                    coins: 10,
                    stars: 0
                });
            }
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
        let subBarColor = "bg-rose-500";
        let subClass = "text-rose-400";
        let icon = "fa-calculator";
        let label = "QUANTITATIVE APTITUDE";
        
        if (sub === "General Intelligence & Reasoning") {
            subBarColor = "bg-amber-400";
            subClass = "text-amber-400";
            icon = "fa-brain";
            label = "REASONING MODULE";
        } else if (sub === "English Language & Comprehension") {
            subBarColor = "bg-emerald-400";
            subClass = "text-emerald-400";
            icon = "fa-language";
            label = "ENGLISH GRAMMAR & COMP";
        } else if (sub === "General Awareness") {
            subBarColor = "bg-blue-400";
            subClass = "text-blue-400";
            icon = "fa-globe";
            label = "GENERAL GK & CURRENT";
        } else if (sub === "Computer Knowledge") {
            subBarColor = "bg-slate-400";
            subClass = "text-slate-300";
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

function updateCountdown() {
    const cd = (typeof window.getExamCountdownData === 'function') 
        ? window.getExamCountdownData()
        : { formattedFull: "40d : 00h : 00m : 00s", formattedShort: "40d Left", days: 40, reached: false, examName: (typeof appState !== 'undefined' && appState.examName) || "Conquest" };
    
    const labelEl = document.getElementById("countdown-label");
    if (labelEl) {
        labelEl.innerText = `${cd.examName}:`;
    }

    const timerEl = document.getElementById("countdown-timer");
    if (timerEl) {
        timerEl.innerText = cd.reached ? "Target Reached!" : (cd.formattedShort || `${cd.days}d Left`);
        timerEl.removeAttribute("title");
    }
    
    const mobTimer = document.getElementById("countdown-timer-mobile");
    if (mobTimer) {
        mobTimer.innerText = cd.reached ? "Target Reached!" : (cd.formattedShort || `${cd.days}d Left`);
        mobTimer.removeAttribute("title");
    }

    const nameDisplay = document.getElementById("display-exam-name");
    if (nameDisplay) nameDisplay.innerText = cd.examName;

    const examBtn = document.getElementById("btn-edit-exam-target");
    const formattedDate = (typeof formatDateReadable === 'function' && typeof appState !== 'undefined' && appState.examDate)
        ? formatDateReadable(appState.examDate)
        : (cd.examDate || "Target Date");
    const statusText = cd.reached ? "Target Reached!" : `Remaining: ${cd.formattedFull}`;
    const liveTooltipText = `🎯 Target Exam: ${cd.examName} (${formattedDate})\n⏱️ ${statusText}\n✏️ Click to change date`;

    if (examBtn) {
        examBtn.setAttribute("data-tooltip", liveTooltipText);
        examBtn.removeAttribute("title");
        if (typeof window.updateActiveCustomTooltip === 'function') {
            window.updateActiveCustomTooltip(examBtn, liveTooltipText);
        }
    }
    if (timerEl) {
        timerEl.setAttribute("data-tooltip", liveTooltipText);
    }
}

// 40-day countdown timer (Centralized Reactive Engine)
function startExamCountdown() {
    updateCountdown();
    if (window.countdownInterval) clearInterval(window.countdownInterval);
    window.countdownInterval = setInterval(updateCountdown, 1000);
}
window.startExamCountdown = startExamCountdown;
window.updateCountdown = updateCountdown;


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

    // 3. Popover Drawer UI (#pomo-time-display, #pomo-status-label, #btn-pomo-start, #btn-pomo-pause, #btn-pomo-reset)
    const popoverTimeEl = document.getElementById("pomo-time-display");
    if (popoverTimeEl) popoverTimeEl.innerText = formattedText;
    const popoverStatusEl = document.getElementById("pomo-status-label");
    if (popoverStatusEl) {
        if (isStopwatch) {
            popoverStatusEl.innerText = "STOPWATCH SESSION";
        } else if (appState.timerMode === "short-break") {
            popoverStatusEl.innerText = "REST BREAK (5M)";
        } else if (appState.timerMode === "long-break") {
            popoverStatusEl.innerText = "LONG REST (15M)";
        } else if (appState.timerMode === "sprint") {
            popoverStatusEl.innerText = "FOCUS SPRINT (15M)";
        } else if (appState.timerMode === "deep") {
            popoverStatusEl.innerText = "DEEP WORK (50M)";
        } else {
            popoverStatusEl.innerText = "POMODORO FOCUS (25M)";
        }
    }

    const dailyCountEl = document.getElementById("pomo-daily-count");
    if (dailyCountEl) {
        const todayCount = appState.pomoSessionsToday || 0;
        dailyCountEl.innerText = `${todayCount} 🍅`;
    }

    // Dynamic Context-Aware Button Morphing (Idle -> Running -> Paused)
    const popoverStartBtn = document.getElementById("btn-pomo-start");
    const popoverPauseBtn = document.getElementById("btn-pomo-pause");
    const popoverResetBtn = document.getElementById("btn-pomo-reset");
    const startBtnText = document.getElementById("btn-pomo-start-text");

    const isRunning = Boolean(appState.timerActive);
    const isPaused = !isRunning && (isStopwatch ? ((appState.sessionTime || 0) > 0) : ((appState.pomoTime || 0) < (appState.pomoInitialTime || 1500)));

    if (popoverStartBtn && popoverPauseBtn) {
        if (isRunning) {
            // Running: Morph into Pause button (amber pulse), hide start
            popoverStartBtn.classList.add("hidden");
            popoverPauseBtn.classList.remove("hidden");
            popoverPauseBtn.disabled = false;
            if (popoverResetBtn) {
                popoverResetBtn.classList.remove("opacity-40", "pointer-events-none");
                popoverResetBtn.title = "Stop & Reset Session";
            }
        } else if (isPaused) {
            // Paused: Morph into Resume button (emerald/teal), hide pause
            popoverPauseBtn.classList.add("hidden");
            popoverStartBtn.classList.remove("hidden");
            popoverStartBtn.disabled = false;
            popoverStartBtn.className = "flex-grow bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-2 px-3 rounded-xl text-[10px] font-extrabold uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition cursor-pointer flex items-center justify-center gap-1.5";
            if (startBtnText) startBtnText.innerText = "Resume Session";
            if (popoverResetBtn) {
                popoverResetBtn.classList.remove("opacity-40", "pointer-events-none");
                popoverResetBtn.title = "Reset Session";
            }
        } else {
            // Idle / Stopped: Start session (cyan/blue), hide pause
            popoverPauseBtn.classList.add("hidden");
            popoverStartBtn.classList.remove("hidden");
            popoverStartBtn.disabled = false;
            popoverStartBtn.className = "flex-grow bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-2 px-3 rounded-xl text-[10px] font-extrabold uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition cursor-pointer flex items-center justify-center gap-1.5";
            if (startBtnText) startBtnText.innerText = isStopwatch ? "Start Stopwatch" : "Start Session";
            if (popoverResetBtn) {
                popoverResetBtn.classList.add("opacity-40");
                popoverResetBtn.title = "Reset Session";
            }
        }
    }

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
            const rawOffset = pomoRingCircumference * (1 - pct);
            const offset = isNaN(rawOffset) ? 0 : rawOffset;
            if (window.gsap) {
                gsap.to(ringFill, {
                    strokeDashoffset: offset,
                    duration: 0.35,
                    ease: "power2.out"
                });
            } else {
                ringFill.style.strokeDashoffset = offset;
            }
            ringFill.style.stroke = (appState.timerMode === "short-break" || appState.timerMode === "long-break") ? "#10b981" : "#f43f5e";
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
    if (!appState.pomoSessionStartedAt && appState.timerMode !== "short-break" && appState.timerMode !== "long-break") {
        appState.pomoSessionStartedAt = Date.now();
        appState.pomoSessionDurationTarget = appState.pomoInitialTime || 1500;
    }
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
                const isBreak = appState.timerMode === "short-break" || appState.timerMode === "long-break";
                if (!isBreak) {
                    const startedAt = appState.pomoSessionStartedAt;
                    const elapsedRealSec = startedAt ? Math.round((Date.now() - startedAt) / 1000) : 0;
                    const targetSec = appState.pomoSessionDurationTarget || appState.pomoInitialTime || 1500;
                    // Anti-cheat: Require at least 50% of nominal session or 300s (whichever is smaller)
                    const minAllowedSec = Math.min(300, Math.floor(targetSec * 0.5));

                    appState.pomoSessionStartedAt = null;

                    if (startedAt && elapsedRealSec < minAllowedSec) {
                        const warnMsg = `⚠️ Focus session voided: elapsed duration (${elapsedRealSec}s) was too short for full session credit.`;
                        if (window.showToast) window.showToast(warnMsg, "warning");
                        if (window.rewardsSystem && typeof window.rewardsSystem._ensureState === 'function') {
                            const r = window.rewardsSystem._ensureState();
                            if (r) {
                                r.penalties.unshift({
                                    id: `pen_${Date.now()}`,
                                    reason: `Timer speedrun exploit attempt: Finished in ${elapsedRealSec}s (< ${minAllowedSec}s target)`,
                                    action: 'Voided Pomodoro reward payout',
                                    time: new Date().toLocaleTimeString()
                                });
                                if (r.penalties.length > 15) r.penalties.pop();
                            }
                        }
                    } else {
                        // Legitimate Pomodoro completion
                        appState.pomoSessionsToday = (appState.pomoSessionsToday || 0) + 1;
                        if (window.rewardsSystem && typeof window.rewardsSystem.recordActivity === 'function') {
                            const taskLabel = appState.pomoCurrentTask ? ` on "${appState.pomoCurrentTask}"` : '';
                            window.rewardsSystem.recordActivity({
                                type: 'pomodoro',
                                dedupKey: `pomodoro_session_${Date.now()}`,
                                minCooldown: 5 * 60 * 1000,
                                title: `Focus Session Completed${taskLabel}`,
                                xp: 30,
                                coins: 15,
                                stars: 0
                            });
                        } else {
                            if (!appState.rewards) {
                                appState.rewards = { coins: 0, points: 0, unlocked: [], claimedTrophies: [] };
                            }
                            appState.rewards.coins = (appState.rewards.coins || 0) + 15;
                            appState.rewards.points = (appState.rewards.points || 0) + 30;
                            saveStateToStorage();
                        }

                        if (typeof window.triggerConfetti === "function") {
                            try { window.triggerConfetti('medium'); } catch (e) {}
                        }
                        if (typeof window.playSound === "function") {
                            window.playSound('achievement');
                            setTimeout(() => window.playSound('reward'), 250);
                        }
                        const taskLabel = appState.pomoCurrentTask ? ` on "${appState.pomoCurrentTask}"` : '';
                        const msg = `🎉 Focus session completed${taskLabel}! +15 Coins & +30 XP awarded.`;
                        if (typeof speakText === "function") speakText("Focus session completed. Excellent discipline soldier!");
                        if (window.showToast) window.showToast(msg, "success");
                    }
                } else {
                    if (typeof window.playSound === "function") window.playSound('bell');
                    const msg = "Rest break completed! Ready for the next sprint soldier?";
                    if (typeof speakText === "function") speakText(msg);
                    if (window.showToast) window.showToast(msg, "info");
                }
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
    appState.pomoSessionStartedAt = null;
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
        if (typeof window.closeShortcutsHelpModal === "function") {
            window.closeShortcutsHelpModal();
        }
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

    // Session Focus Intent Input Binding
    const inputPomoTask = document.getElementById("input-pomo-task");
    if (inputPomoTask) {
        if (appState.pomoCurrentTask) inputPomoTask.value = appState.pomoCurrentTask;
        inputPomoTask.addEventListener("input", (e) => {
            appState.pomoCurrentTask = e.target.value.trim();
            saveStateToStorage();
        });
    }

    window.showPomoPopover = showPomoPopover;
    window.hidePomoPopover = hidePomoPopover;
    window.togglePomoPopover = togglePomoPopover;

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
    if (inputDate) {
        let curDate = appState.examDate;
        if (!curDate || curDate === "2026-08-15") {
            const defaultFuture = new Date(Date.now() + 40 * 24 * 60 * 60 * 1000);
            const dfY = defaultFuture.getFullYear();
            const dfM = String(defaultFuture.getMonth() + 1).padStart(2, '0');
            const dfD = String(defaultFuture.getDate()).padStart(2, '0');
            curDate = `${dfD}-${dfM}-${dfY}`;
        }
        if (typeof window.parseDateInputSafe === "function" && typeof window.formatDateToDMY === "function") {
            inputDate.value = window.formatDateToDMY(window.parseDateInputSafe(curDate));
        } else {
            inputDate.value = String(curDate).split("T")[0];
        }
    }

    modal.classList.remove("hidden");
    void modal.offsetWidth;

    modal.classList.remove("opacity-0", "pointer-events-none");
    modal.classList.add("opacity-100", "pointer-events-auto", "active");
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
    modal.classList.remove("opacity-100", "pointer-events-auto", "active");
    modal.classList.add("opacity-0", "pointer-events-none");
    setTimeout(() => {
        modal.classList.add("hidden");
    }, 200);
}

// Attach backdrop click for exam target modal on load
document.addEventListener("DOMContentLoaded", () => {
    const examModal = document.getElementById("exam-target-modal");
    if (examModal) {
        examModal.addEventListener("click", (e) => {
            if (e.target === examModal) closeExamTargetModal();
        });
    }
});

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

window.renderDashboardOverview = renderDashboardOverview;
window.renderSubjectProgressBars = renderSubjectProgressBars;
window.calculateOverallStats = calculateOverallStats;
window.updateTodayGoalsRatio = updateTodayGoalsRatio;
window.loadRituals = loadRituals;
window.updateStreakData = updateStreakData;
window.renderTodayMissions = renderTodayMissions;
