// === 40-DAY STUDY PLAN MODULE ===
// Synchronizes roadmap phases, day cards, custom glowing checklist, and drills

function updatePhaseTabs(activePhase) {
    const tabBtns = document.querySelectorAll(".phase-tab-btn");
    tabBtns.forEach(btn => {
        const p = parseInt(btn.getAttribute("data-phase"));
        const isActive = p === activePhase;
        const numBadge = btn.querySelector(".phase-num-badge");
        const titleEl = btn.querySelector(".phase-title-text");
        const subEl = btn.querySelector(".phase-sub-text");
        
        if (isActive) {
            btn.className = "phase-tab-btn active shrink-0 snap-start flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-cyan-400/80 bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-blue-950/80 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30 transition-all duration-300 cursor-pointer select-none";
            if (numBadge) numBadge.className = "phase-num-badge w-8 h-8 rounded-xl bg-cyan-500/25 border border-cyan-400 text-cyan-300 font-black text-xs flex items-center justify-center shadow-inner";
            if (titleEl) titleEl.className = "phase-title-text text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5 whitespace-nowrap";
            if (subEl) subEl.className = "phase-sub-text text-[10px] text-cyan-300 font-semibold whitespace-nowrap";
        } else {
            btn.className = "phase-tab-btn shrink-0 snap-start flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-white/10 bg-slate-950/70 hover:border-white/20 hover:bg-slate-900/80 text-gray-400 hover:text-white transition-all duration-300 cursor-pointer select-none";
            if (numBadge) numBadge.className = "phase-num-badge w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-black text-xs flex items-center justify-center shadow-inner";
            if (titleEl) titleEl.className = "phase-title-text text-xs sm:text-sm font-bold text-gray-300 flex items-center gap-1.5 whitespace-nowrap";
            if (subEl) subEl.className = "phase-sub-text text-[10px] text-gray-500 font-medium whitespace-nowrap";
        }
    });
}

function renderStudyPlan() {
    const container = document.getElementById("plan-days-container");
    if (!container) return;

    const activeTab = document.querySelector(".phase-tab-btn.active");
    const activePhase = activeTab ? parseInt(activeTab.getAttribute("data-phase")) : 1;
    updatePhaseTabs(activePhase);

    const filteredDays = PLAN_DATA.filter(d => d.phase === activePhase);
    
    // Roadmap progress calculation
    const totalDays = PLAN_DATA.length;
    const completedDays = PLAN_DATA.filter(d => d.day < appState.currentDay).length;
    const planPct = Math.round((completedDays / totalDays) * 100);
    
    const pctEl = document.getElementById("plan-pct");
    const fillEl = document.getElementById("plan-pct-fill");
    if (pctEl) pctEl.innerText = `${planPct}% (${completedDays}/${totalDays} Completed)`;
    if (fillEl) fillEl.style.width = planPct + "%";

    let html = "";
    
    filteredDays.forEach(dayItem => {
        const isCompleted = dayItem.day < appState.currentDay;
        const isToday = dayItem.day === appState.currentDay;
        
        let cardOuterClass = "border-white/10 bg-slate-900/50 hover:border-white/20 hover:bg-slate-900/70";
        if (isToday) {
            cardOuterClass = "border-cyan-500/50 bg-gradient-to-r from-cyan-950/30 via-slate-900/80 to-purple-950/30 shadow-[0_0_25px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30";
        } else if (isCompleted) {
            cardOuterClass = "border-emerald-500/25 bg-slate-900/70 hover:border-emerald-500/40";
        }

        let badgeHtml = "";
        if (dayItem.dayType === "test" || dayItem.targets.length === 0) {
            badgeHtml = `<span class="bg-rose-500/15 border border-rose-500/30 text-rose-300 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shadow-sm flex items-center gap-1"><i class="fa-solid fa-trophy text-[9px]"></i> Simulation Mock</span>`;
        } else {
            badgeHtml = `<span class="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shadow-sm flex items-center gap-1"><i class="fa-solid fa-layer-group text-[9px]"></i> ${dayItem.targets.length} Chapters</span>`;
        }

        const expandedClass = isToday ? "block" : "hidden";
        const chevronClass = isToday ? "rotate-180" : "";

        html += `
            <div class="border ${cardOuterClass} rounded-2xl shadow-lg backdrop-blur-xl overflow-hidden transition-all duration-300" id="plan-day-card-${dayItem.day}">
                <!-- Clickable Day Header -->
                <div class="flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-white/5 select-none transition duration-200" onclick="togglePlanDay(${dayItem.day})">
                    <div class="flex items-center gap-3.5 min-w-0">
                        <!-- Day Number Badge -->
                        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-heading font-black text-xs sm:text-sm border shrink-0 transition-all ${isCompleted ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : isToday ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] ring-1 ring-cyan-400/40' : 'bg-slate-950/80 border-white/10 text-gray-400'}">${dayItem.day}</div>
                        <div class="min-w-0">
                            <h3 class="text-xs sm:text-sm font-black text-white flex items-center gap-2 flex-wrap">
                                <span>${dayItem.name}</span>
                                ${isToday ? '<span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/50 text-cyan-300 shadow-sm flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>Active Today</span>' : isCompleted ? '<span class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1"><i class="fa-solid fa-check text-[9px]"></i> Completed</span>' : ''}
                            </h3>
                            <p class="text-[11px] sm:text-xs text-gray-400 max-w-xl mt-0.5 truncate sm:whitespace-normal">${dayItem.desc}</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-3 shrink-0">
                        <div class="hidden sm:flex items-center gap-2">
                            ${badgeHtml}
                            <span class="bg-purple-500/10 border border-purple-500/30 text-purple-300 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shadow-sm flex items-center gap-1"><i class="fa-solid fa-clock text-[9px]"></i> ${dayItem.time}</span>
                        </div>
                        <div class="w-7 h-7 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition">
                            <i class="fa-solid fa-chevron-down text-xs transition duration-300 plan-chevron-${dayItem.day} ${chevronClass}"></i>
                        </div>
                    </div>
                </div>
                
                <!-- Expanded Day Content -->
                <div class="plan-day-content ${expandedClass} border-t border-white/10 p-4 sm:p-5 bg-slate-950/60 backdrop-blur-md">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
                        <!-- Left Column: Topic Targets Checklist -->
                        <div class="space-y-3">
                            <div class="flex items-center justify-between pb-1.5 border-b border-white/10">
                                <h4 class="font-extrabold text-gray-300 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                                    <i class="fa-solid fa-list-check text-cyan-400 text-xs"></i> Topic Targets Checklist
                                </h4>
                                <span class="text-[10px] text-gray-400 font-semibold">${dayItem.targets.length} targets</span>
                            </div>
                            <div class="space-y-2">
        `;

        if (dayItem.targets.length === 0) {
            html += `
                <div class="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                    <i class="fa-solid fa-triangle-exclamation text-base shrink-0"></i>
                    <span class="text-xs font-semibold">No individual chapter lessons today. Complete mock exam: <strong class="text-white">${dayItem.test}</strong></span>
                </div>
            `;
        } else {
            dayItem.targets.forEach(targetId => {
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

                if (subFound) {
                    const prog = appState.syllabusProgress[subFound.id] || { learned: false, practiced: false, mastered: false };
                    const isDone = !!(prog.learned || prog.practiced || prog.mastered);
                    const checkedStr = isDone ? "checked" : "";
                    
                    // Difficulty Chip
                    const diff = (subFound.difficulty || "Easy").toLowerCase();
                    let diffBadge = "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
                    if (diff === "hard") diffBadge = "bg-rose-500/15 text-rose-300 border-rose-500/30";
                    else if (diff.includes("mod") || diff.includes("med")) diffBadge = "bg-amber-500/15 text-amber-300 border-amber-500/30";

                    // Weightage Chip
                    const wt = (subFound.weightage || "Medium").toLowerCase();
                    let wtBadge = "bg-slate-800/80 text-gray-300 border-white/10";
                    if (wt === "high") wtBadge = "bg-purple-500/15 text-purple-300 border-purple-500/30";
                    else if (wt === "low") wtBadge = "bg-slate-800/50 text-gray-400 border-white/5";

                    // Subject Chip
                    let subjName = topicFound ? topicFound.subject.split(' ')[0] : 'Subject';
                    let subjBadge = "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
                    if (topicFound && topicFound.subject.includes("Reason")) {
                        subjBadge = "bg-amber-500/15 text-amber-300 border-amber-500/30";
                        subjName = "Reasoning";
                    } else if (topicFound && topicFound.subject.includes("English")) {
                        subjBadge = "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
                        subjName = "English";
                    } else if (topicFound && (topicFound.subject.includes("Awareness") || topicFound.subject.includes("GK"))) {
                        subjBadge = "bg-blue-500/15 text-blue-300 border-blue-500/30";
                        subjName = "GK/GS";
                    } else if (topicFound && topicFound.subject.includes("Quant")) {
                        subjBadge = "bg-rose-500/15 text-rose-300 border-rose-500/30";
                        subjName = "Math";
                    }

                    html += `
                        <div class="topic-target-card flex items-center justify-between gap-3 p-3 rounded-xl border ${isDone ? 'bg-cyan-950/20 border-cyan-500/30' : 'bg-slate-950/60 border-white/5 hover:border-white/15'} transition-all duration-200 group">
                            <label class="flex items-center gap-3 cursor-pointer select-none min-w-0 flex-1">
                                <input type="checkbox" id="plan-cb-${subFound.id}" data-id="${subFound.id}" ${checkedStr} class="plan-subtopic-toggle sr-only">
                                <span class="plan-chk-box ${isDone ? 'on' : ''}">✓</span>
                                <div class="min-w-0 flex-1 space-y-1">
                                    <div class="flex items-center gap-1.5 flex-wrap">
                                        <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${subjBadge}">${subjName}</span>
                                        <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${diffBadge}">${subFound.difficulty}</span>
                                        <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${wtBadge}">${subFound.weightage} Weight</span>
                                    </div>
                                    <div class="text-xs font-bold ${isDone ? 'text-cyan-200 line-through opacity-75' : 'text-white'} transition-all leading-snug">
                                        ${subFound.name}
                                    </div>
                                </div>
                            </label>
                            ${isDone ? `
                                <span class="shrink-0 text-[10px] font-extrabold uppercase text-cyan-400 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/25 hidden sm:inline-flex items-center gap-1">
                                    <i class="fa-solid fa-circle-check text-[9px]"></i> Done
                                </span>
                            ` : ''}
                        </div>
                    `;
                }
            });
        }

        html += `
                            </div>
                        </div>

                        <!-- Right Column: Drills & Test Target -->
                        <div class="space-y-3">
                            <div class="flex items-center justify-between pb-1.5 border-b border-white/10">
                                <h4 class="font-extrabold text-gray-300 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                                    <i class="fa-solid fa-bullseye text-cyan-400 text-xs"></i> Drills & Test Targets
                                </h4>
                                <span class="text-[10px] text-gray-400 font-semibold">Scheduled Today</span>
                            </div>
                            <div class="space-y-2.5">
                                <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
                                    <div class="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 shadow-inner">
                                        <i class="fa-solid fa-bolt text-xs"></i>
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <div class="font-extrabold text-white text-xs">Speed Math & Drills</div>
                                        <div class="text-[11px] text-gray-400 truncate">Tables, fraction conversions & speed formulas</div>
                                    </div>
                                    <span class="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-extrabold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30">20 mins</span>
                                </div>

                                <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-rose-500/20 hover:border-rose-500/40 transition-all">
                                    <div class="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 shadow-inner">
                                        <i class="fa-solid fa-book-open text-xs"></i>
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <div class="font-extrabold text-white text-xs">Vocabulary & Flashcards</div>
                                        <div class="text-[11px] text-gray-400 truncate">Vocabulary rules & synonyms from Study Toolkit</div>
                                    </div>
                                    <span class="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-extrabold text-rose-300 bg-rose-500/15 border border-rose-500/30">15 mins</span>
                                </div>

                                <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-amber-500/20 hover:border-amber-500/40 transition-all">
                                    <div class="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
                                        <i class="fa-solid fa-trophy text-xs"></i>
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <div class="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider">Target Assessment</div>
                                        <div class="font-extrabold text-white text-xs truncate">${dayItem.test && dayItem.test !== 'None' ? dayItem.test : 'Daily Practice Revision'}</div>
                                    </div>
                                    <span class="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-extrabold text-amber-300 bg-amber-500/15 border border-amber-500/30">${dayItem.test && dayItem.test !== 'None' ? 'Qualifying' : 'Sectional'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer Action (Reference Guide Removed) -->
                    <div class="flex justify-end items-center gap-3 mt-4 pt-4 border-t border-white/10">
                        ${isToday ? `
                            <button class="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-500/30 border border-cyan-400/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2" onclick="completeActiveDay()">
                                <i class="fa-solid fa-circle-check text-sm"></i> Complete Day ${dayItem.day} & Advance
                            </button>
                        ` : isCompleted ? `
                            <button class="bg-slate-950/80 hover:bg-slate-900 text-gray-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold border border-white/10 hover:border-amber-500/40 transition duration-200 cursor-pointer flex items-center gap-2 shadow-sm" onclick="resetActiveDayTo(${dayItem.day})">
                                <i class="fa-solid fa-rotate-left text-amber-400"></i> Reset Roadmap to here
                            </button>
                        ` : `
                            <span class="text-gray-500 text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5"><i class="fa-solid fa-lock text-gray-600 text-xs"></i> Locked (Complete Day ${dayItem.day - 1} first)</span>
                        `}
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Attach phase tab listeners
    const tabBtns = document.querySelectorAll(".phase-tab-btn");
    tabBtns.forEach(btn => {
        btn.onclick = () => {
            const p = parseInt(btn.getAttribute("data-phase"));
            updatePhaseTabs(p);
            renderStudyPlan();
        };
    });

    // Checkbox toggling inside Plan list
    container.querySelectorAll(".plan-subtopic-toggle").forEach(cb => {
        cb.addEventListener("change", () => {
            const subId = cb.getAttribute("data-id");
            if (!appState.syllabusProgress[subId]) {
                appState.syllabusProgress[subId] = { learned: false, practiced: false, mastered: false };
            }
            appState.syllabusProgress[subId].learned = cb.checked;
            appState.syllabusProgress[subId].practiced = cb.checked;
            appState.syllabusProgress[subId].mastered = cb.checked;
            
            // Visual feedback on the custom box immediately
            const box = cb.parentElement.querySelector(".plan-chk-box");
            if (box) {
                if (cb.checked) box.classList.add("on");
                else box.classList.remove("on");
            }
            
            if (cb.checked && window.triggerConfetti) {
                window.triggerConfetti('low');
            }

            saveStateToStorage();
            renderAll();
        });
    });
    
    // Trigger LaTeX typesetting
    setTimeout(triggerMathTypesetting, 50);
}

function togglePlanDay(dayNum) {
    const card = document.getElementById(`plan-day-card-${dayNum}`);
    if (!card) return;
    const content = card.querySelector(".plan-day-content");
    const icon = card.querySelector(`.plan-chevron-${dayNum}`);
    
    if (content) {
        content.classList.toggle("hidden");
        if (icon) icon.classList.toggle("rotate-180");
    }
}

async function completeActiveDay() {
    if (appState.currentDay < PLAN_DATA.length) {
        let confirmed = false;
        if (window.showConfirm) {
            confirmed = await window.showConfirm("Advance Study Plan", `Complete Day ${appState.currentDay} and advance roadmap to Day ${appState.currentDay + 1}?`);
        } else {
            confirmed = confirm(`Complete Day ${appState.currentDay} and advance roadmap to Day ${appState.currentDay + 1}?`);
        }
        if (!confirmed) return;

        appState.dailyRituals = { drill: false, vocab: false, ca: false, computer: false };
        appState.currentDay++;
        saveStateToStorage();
        renderAll();

        const successMsg = `Day ${appState.currentDay - 1} completed! Welcome to Day ${appState.currentDay}.`;
        speakText(successMsg);
        if (window.showToast) window.showToast(successMsg, "success");
        if (window.triggerConfetti) window.triggerConfetti('grand');

        const nextDayData = PLAN_DATA.find(d => d.day === appState.currentDay);
        if (nextDayData) {
            updatePhaseTabs(nextDayData.phase);
        }
        renderStudyPlan();
    } else {
        speakText("Congratulations! You have completed the 40-day course!");
        if (window.showToast) window.showToast("Congratulations! You have completed the 40-day course!", "success");
    }
}

async function resetActiveDayTo(dayNum) {
    let confirmed = false;
    if (window.showConfirm) {
        confirmed = await window.showConfirm("Reset Preparation Day", `Reset preparation progress back to Day ${dayNum}?`);
    } else {
        confirmed = confirm(`Reset preparation progress back to Day ${dayNum}?`);
    }
    if (!confirmed) return;

    appState.currentDay = dayNum;
    appState.dailyRituals = { drill: false, vocab: false, ca: false, computer: false };
    saveStateToStorage();
    renderAll();
    renderStudyPlan();
    if (window.showToast) window.showToast(`Preparation progress reset back to Day ${dayNum}`, "warning");
}

// Complete day trigger in Dashboard view
const btnCompleteDay = document.getElementById("btn-complete-day");
if (btnCompleteDay) {
    btnCompleteDay.onclick = () => {
        completeActiveDay();
    };
}

