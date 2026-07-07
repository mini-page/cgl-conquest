// === 40-DAY STUDY PLAN MODULE ===
// 9. 40-DAY STUDY PLANTIMELINE VIEW
function renderStudyPlan() {
    const container = document.getElementById("plan-days-container");
    const activeTab = document.querySelector(".phase-tab-btn.active");
    const activePhase = activeTab ? parseInt(activeTab.getAttribute("data-phase")) : 1;

    const filteredDays = PLAN_DATA.filter(d => d.phase === activePhase);
    
    // Plan complete calculations
    const totalDays = PLAN_DATA.length;
    const completedDays = PLAN_DATA.filter(d => d.day < appState.currentDay).length;
    const planPct = Math.round((completedDays / totalDays) * 100);
    
    document.getElementById("plan-pct").innerText = `${planPct}% (${completedDays}/${totalDays} Completed)`;
    document.getElementById("plan-pct-fill").style.width = planPct + "%";

    let html = "";
    
    filteredDays.forEach(dayItem => {
        const isCompleted = dayItem.day < appState.currentDay;
        const isToday = dayItem.day === appState.currentDay;
        
        let cardBorderClass = "border-white/5";
        let cardBgClass = "bg-bgCard";
        
        if (isCompleted) {
            cardBorderClass = "border-accentGreen/30";
            cardBgClass = "bg-bgCard/80";
        } else if (isToday) {
            cardBorderClass = "border-accentPurple/80 shadow-violet-500/5 ring-1 ring-accentPurple/20";
            cardBgClass = "bg-white/2px";
        }

        let badgeHtml = "";
        if (dayItem.dayType === "test" || dayItem.targets.length === 0) {
            badgeHtml = `<span class="bg-accentRose/15 text-accentRose px-2 py-0.5 rounded text-[9px] font-bold uppercase"><i class="fa-solid fa-trophy mr-1"></i> Simulation Mock</span>`;
        } else {
            badgeHtml = `<span class="bg-accentCyan/15 text-accentCyan px-2 py-0.5 rounded text-[9px] font-bold uppercase">${dayItem.targets.length} Chapters</span>`;
        }

        const expandedClass = isToday ? "block" : "hidden";
        const chevronClass = isToday ? "rotate-180" : "";

        html += `
            <div class="bg-bgCard border ${cardBorderClass} rounded-xl shadow-md overflow-hidden transition-all duration-300" id="plan-day-card-${dayItem.day}">
                <div class="flex items-center justify-between p-4 cursor-pointer hover:bg-white/2px select-none" onclick="togglePlanDay(${dayItem.day})">
                    <div class="flex items-center gap-3.5">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center font-heading font-extrabold text-xs border ${isCompleted ? 'bg-accentGreen/15 border-accentGreen text-accentGreen' : isToday ? 'bg-accentPurple/15 border-accentPurple text-accentPurple' : 'bg-white/5 border-white/10 text-gray-400'}">${dayItem.day}</div>
                        <div>
                            <h3 class="text-xs font-bold text-white flex items-center gap-1.5">${dayItem.name} ${isToday ? '<span class="text-accentCyan text-[9px] font-extrabold uppercase">&bull; Active Today</span>' : ''}</h3>
                            <p class="text-[11px] text-gray-500 max-w-lg mt-0.5">${dayItem.desc}</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-3">
                        <div class="hidden sm:flex gap-1.5">
                            ${badgeHtml}
                            <span class="bg-white/5 border border-white/5 text-gray-400 px-2 py-0.5 rounded text-[9px] font-bold uppercase"><i class="fa-solid fa-hourglass mr-1"></i> ${dayItem.time}</span>
                        </div>
                        <i class="fa-solid fa-chevron-down text-gray-500 text-xs transition duration-200 plan-chevron-${dayItem.day} ${chevronClass}"></i>
                    </div>
                </div>
                
                <div class="plan-day-content ${expandedClass} border-t border-white/5 p-4 bg-black/10">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                        <div class="space-y-3">
                            <h4 class="font-bold text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/5 pb-1">Topic Targets Checklist</h4>
                            <div class="space-y-2">
        `;

        if (dayItem.targets.length === 0) {
            html += `
                <div class="flex gap-2 text-gray-400">
                    <i class="fa-solid fa-triangle-exclamation text-accentAmber text-xs mt-0.5"></i>
                    <span>No chapter lessons. Complete mock: <strong>${dayItem.test}</strong></span>
                </div>
            `;
        } else {
            dayItem.targets.forEach(targetId => {
                let subFound = null;
                for (const topic of SYLLABUS_DATA) {
                    const sub = topic.subtopics.find(s => s.id === targetId);
                    if (sub) {
                        subFound = sub;
                        break;
                    }
                }

                if (subFound) {
                    const prog = appState.syllabusProgress[subFound.id] || { learned: false, practiced: false, mastered: false };
                    const checkedStr = (prog.practiced || prog.mastered) ? "checked" : "";
                    
                    html += `
                        <label class="flex items-start gap-2.5 cursor-pointer text-gray-300 hover:text-white select-none">
                            <input type="checkbox" id="plan-cb-${subFound.id}" data-id="${subFound.id}" ${checkedStr} class="plan-subtopic-toggle mt-0.5 accent-accentCyan">
                            <span><strong>${subFound.name}</strong> <span class="text-gray-500 text-[10px]">(${subFound.difficulty} | Weight: ${subFound.weightage})</span></span>
                        </label>
                    `;
                }
            });
        }

        html += `
                            </div>
                        </div>

                        <!-- Right list -->
                        <div class="space-y-3">
                            <h4 class="font-bold text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/5 pb-1">Drills & Test Target</h4>
                            <div class="space-y-2 text-gray-400">
                                <div class="flex gap-2"><i class="fa-solid fa-bolt text-accentCyan mt-0.5"></i> <span>Tables, fraction conversions and speed formulas drills (20 mins).</span></div>
                                <div class="flex gap-2"><i class="fa-solid fa-book text-accentRose mt-0.5"></i> <span>Vocabulary rules & synonyms cards from Study Toolkit (15 mins).</span></div>
                                <div class="flex gap-2"><i class="fa-solid fa-trophy text-accentAmber mt-0.5"></i> <span><strong>Target Test:</strong> ${dayItem.test}</span></div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end items-center gap-2 mt-4 pt-4 border-t border-white/5">
                        <button class="bg-white/5 hover:bg-white/10 text-gray-300 px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-white/5 transition" onclick="openDayDetailModal(${dayItem.day})">
                            <i class="fa-solid fa-eye"></i> Reference Guide
                        </button>
                        ${isToday ? `
                            <button class="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow transition" onclick="completeActiveDay()">
                                <i class="fa-solid fa-circle-check"></i> Complete & Advance
                            </button>
                        ` : isCompleted ? `
                            <button class="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-white/5 transition" onclick="resetActiveDayTo(${dayItem.day})">
                                <i class="fa-solid fa-rotate-left"></i> Reset Roadmap to here
                            </button>
                        ` : `
                            <button class="bg-white/5 text-gray-600 px-4 py-1.5 rounded-lg text-xs font-semibold border border-white/5 cursor-not-allowed" disabled>Locked</button>
                        `}
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Attach timeline phase tab clicks
    const tabBtns = document.querySelectorAll(".phase-tab-btn");
    tabBtns.forEach(btn => {
        btn.onclick = () => {
            tabBtns.forEach(b => {
                b.classList.remove("active");
                b.querySelector("span").className = "text-xs font-bold text-gray-300";
            });
            btn.classList.add("active");
            btn.querySelector("span").className = "text-xs font-bold text-white";
            
            renderStudyPlan();
        };
    });

    // Checkbox toggling inside Plan list
    container.querySelectorAll(".plan-subtopic-toggle").forEach(cb => {
        cb.addEventListener("change", (e) => {
            const subId = cb.getAttribute("data-id");
            if (!appState.syllabusProgress[subId]) {
                appState.syllabusProgress[subId] = { learned: false, practiced: false, mastered: false };
            }
            appState.syllabusProgress[subId].learned = cb.checked;
            appState.syllabusProgress[subId].practiced = cb.checked;
            
            saveStateToStorage();
            renderAll();
        });
    });
    
    // Trigger LaTeX typesetting
    setTimeout(triggerMathTypesetting, 50);
}

function togglePlanDay(dayNum) {
    const card = document.getElementById(`plan-day-card-${dayNum}`);
    const content = card.querySelector(".plan-day-content");
    const icon = card.querySelector(`.plan-chevron-${dayNum}`);
    
    if (content) {
        content.classList.toggle("hidden");
        icon.classList.toggle("rotate-180");
    }
}

function completeActiveDay() {
    if (appState.currentDay < PLAN_DATA.length) {
        appState.dailyRituals = { drill: false, vocab: false, ca: false, computer: false };
        appState.currentDay++;
        saveStateToStorage();
        renderAll();

        speakText(`Success! Day ${appState.currentDay - 1} completed. Welcome to Day ${appState.currentDay}!`);

        const nextDayData = PLAN_DATA.find(d => d.day === appState.currentDay);
        if (nextDayData) {
            const tab = document.querySelector(`.phase-tab-btn[data-phase="${nextDayData.phase}"]`);
            if (tab) {
                document.querySelectorAll(".phase-tab-btn").forEach(b => b.classList.remove("active"));
                tab.classList.add("active");
            }
        }
        renderStudyPlan();
    } else {
        speakText("Congratulations! You have completed the 40-day course!");
    }
}

function resetActiveDayTo(dayNum) {
    if (confirm(`Reset preparation progress back to Day ${dayNum}?`)) {
        appState.currentDay = dayNum;
        appState.dailyRituals = { drill: false, vocab: false, ca: false, computer: false };
        saveStateToStorage();
        renderAll();
        renderStudyPlan();
    }
}

// Complete day trigger in Dashboard view
document.getElementById("btn-complete-day").onclick = () => {
    completeActiveDay();
};
