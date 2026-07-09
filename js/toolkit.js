// Dynamic GK Tab Renderer
function renderGKTab() {
    const container = document.getElementById("gk-dynamic-container");
    if (!container) return;
    
    const polity = GK_STATIC_DATA.polity || [];
    const history = GK_STATIC_DATA.history || [];
    const geography = GK_STATIC_DATA.geography || {};
    const science = GK_STATIC_DATA.science || {};
    
    let html = "";
    
    // 1. Polity
    polity.forEach(card => {
        html += `
        <div class="bg-white/2px border border-white/5 rounded-2xl p-4 space-y-3">
            <h4 class="text-xs font-bold text-accentAmber uppercase mb-1">${card.title}</h4>
            <div class="text-xs text-gray-300 leading-relaxed space-y-2">
                ${parseMarkdown(card.content)}
            </div>
        </div>`;
    });
    
    // 2. History
    history.forEach(card => {
        html += `
        <div class="bg-white/2px border border-white/5 rounded-2xl p-4 space-y-3">
            <h4 class="text-xs font-bold text-accentAmber uppercase mb-1">${card.title}</h4>
            <div class="text-xs text-gray-300 leading-relaxed space-y-2">
                ${parseMarkdown(card.content)}
            </div>
        </div>`;
    });
    
    // 3. Geography
    if (geography.rivers || geography.mountains || geography.dams || geography.passes) {
        html += `
        <div class="bg-white/2px border border-white/5 rounded-2xl p-4 space-y-3">
            <h4 class="text-xs font-bold text-accentAmber uppercase mb-1">Geography Major Rivers, Mountains &amp; Dams</h4>`;
            
        if (geography.rivers) {
            html += `
            <div class="space-y-1.5">
                <span class="text-[9px] text-gray-400 font-bold block uppercase">🌊 Indian Rivers by Length (in India)</span>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-[11px] border-collapse">
                        <thead>
                            <tr class="border-b border-white/10 text-gray-400 font-bold text-[9px] uppercase">
                                <th class="pb-1">River</th>
                                <th class="pb-1">Length</th>
                                <th class="pb-1">Origin Place</th>
                                <th class="pb-1">Key Detail</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-300 font-mono">`;
            geography.rivers.forEach(r => {
                html += `
                            <tr class="border-b border-white/5">
                                <td class="py-1 font-bold text-accentAmber">${r.name}</td>
                                <td>${r.length}</td>
                                <td>${r.origin}</td>
                                <td>${r.detail}</td>
                            </tr>`;
            });
            html += `
                        </tbody>
                    </table>
                </div>
            </div>`;
        }
        
        if (geography.mountains) {
            html += `
            <div class="space-y-1.5 pt-2">
                <span class="text-[9px] text-gray-400 font-bold block uppercase">⛰️ Mountain Ranges of India</span>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-[11px] border-collapse">
                        <thead>
                            <tr class="border-b border-white/10 text-gray-400 font-bold text-[9px] uppercase">
                                <th class="pb-1">Range</th>
                                <th class="pb-1">Highest Peak</th>
                                <th class="pb-1">Elevation</th>
                                <th class="pb-1">Key Characteristic</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-300 font-mono">`;
            geography.mountains.forEach(m => {
                html += `
                            <tr class="border-b border-white/5">
                                <td class="py-1 font-bold text-accentAmber">${m.range}</td>
                                <td>${m.peak}</td>
                                <td>${m.elevation}</td>
                                <td>${m.detail}</td>
                            </tr>`;
            });
            html += `
                        </tbody>
                    </table>
                </div>
            </div>`;
        }
        
        if (geography.dams) {
            html += `
            <div class="space-y-1.5 pt-2">
                <span class="text-[9px] text-gray-400 font-bold block uppercase">🧱 Major Dams in India</span>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-[11px] border-collapse">
                        <thead>
                            <tr class="border-b border-white/10 text-gray-400 font-bold text-[9px] uppercase">
                                <th class="pb-1">Dam Name</th>
                                <th class="pb-1">River</th>
                                <th class="pb-1">State</th>
                                <th class="pb-1">Significance</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-300 font-mono">`;
            geography.dams.forEach(d => {
                html += `
                            <tr class="border-b border-white/5">
                                <td class="py-1 font-bold text-accentAmber">${d.name}</td>
                                <td>${d.river}</td>
                                <td>${d.state}</td>
                                <td>${d.significance}</td>
                            </tr>`;
            });
            html += `
                        </tbody>
                    </table>
                </div>
            </div>`;
        }
        
        if (geography.passes) {
            html += `
            <div class="bg-black/20 p-2.5 rounded-xl border border-white/5 text-[11px]">
                <span class="text-[9px] text-gray-400 font-bold block uppercase mb-1">🏔️ Mountain Passes &amp; Borders</span>
                <ul class="list-disc list-inside space-y-1 text-gray-200">`;
            geography.passes.forEach(p => {
                html += `
                    <li><strong class="text-accentAmber font-mono">${p.name}:</strong> ${p.detail}</li>`;
            });
            html += `
                </ul>
            </div>`;
        }
        
        html += `
        </div>`;
    }
    
    // 4. Science
    if (science.units || science.facts) {
        html += `
        <div class="bg-white/2px border border-white/5 rounded-2xl p-4">
            <h4 class="text-xs font-bold text-accentAmber uppercase mb-1">SI Units &amp; General Science Facts</h4>`;
            
        if (science.units) {
            html += `
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-gray-300 mt-2">`;
            science.units.forEach(u => {
                html += `
                <div>${u.name}: <strong>${u.unit}</strong></div>`;
            });
            html += `
            </div>`;
        }
        
        if (science.facts) {
            html += `
            <p class="text-xs text-gray-300 mt-2 leading-relaxed">${science.facts}</p>`;
        }
        
        html += `
        </div>`;
    }
    
    container.innerHTML = html;
}

// Dynamic Study Toolkit Cards Renderer
function renderStaticToolkitCards(category, containerId, accentClass) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (typeof TOOLKIT_STATIC_DATA === "undefined") {
        console.warn("TOOLKIT_STATIC_DATA is undefined!");
        return;
    }
    
    const cards = TOOLKIT_STATIC_DATA[category] || [];
    let html = "";
    
    cards.forEach(card => {
        let cardAccent = accentClass;
        if (category === "laws") {
            if (card.title.includes("Quant")) cardAccent = "text-accentCyan";
            else if (card.title.includes("Reasoning")) cardAccent = "text-accentPurple";
            else if (card.title.includes("Grammar") || card.title.includes("English")) cardAccent = "text-accentRose";
            else if (card.title.includes("Computer") || card.title.includes("Science")) cardAccent = "text-accentAmber";
        } else if (category === "patterns") {
            if (card.title.includes("Quant")) cardAccent = "text-accentCyan";
            else if (card.title.includes("Reasoning") || card.title.includes("Intelligence")) cardAccent = "text-accentPurple";
            else if (card.title.includes("Grammar") || card.title.includes("English") || card.title.includes("Language")) cardAccent = "text-accentRose";
            else if (card.title.includes("Awareness") || card.title.includes("GK") || card.title.includes("GS")) cardAccent = "text-accentAmber";
        }
        
        html += `
        <div class="bg-white/2px border border-white/5 rounded-2xl p-4 space-y-3">
            <h4 class="text-xs font-bold ${cardAccent} uppercase">${card.title}</h4>
            <div class="text-xs text-gray-300 leading-relaxed space-y-2">
                ${parseMarkdown(card.content)}
            </div>
        </div>`;
    });
    
    container.innerHTML = html;
}

// Centralized Study Toolkit Sub-Tab Dispatcher
function renderToolkitSubTab(targetPanelId) {
    if (targetPanelId === "tk-quant") {
        renderStaticToolkitCards("quant", "tk-quant-container", "text-accentCyan");
    } else if (targetPanelId === "tk-grammar") {
        renderStaticToolkitCards("grammar", "tk-grammar-container", "text-accentRose");
    } else if (targetPanelId === "tk-reasoning") {
        renderStaticToolkitCards("reasoning", "tk-reasoning-container", "text-accentPurple");
    } else if (targetPanelId === "tk-physics") {
        renderGKTab();
    } else if (targetPanelId === "tk-computer") {
        renderStaticToolkitCards("computer", "tk-computer-container", "text-cyan-400");
    } else if (targetPanelId === "tk-laws") {
        renderStaticToolkitCards("laws", "tk-laws-container", "text-accentAmber");
    } else if (targetPanelId === "tk-patterns") {
        renderStaticToolkitCards("patterns", "tk-patterns-container", "text-accentAmber");
    } else if (targetPanelId === "tk-custom") {
        renderToolkit();
    }
    
    setTimeout(triggerMathTypesetting, 50);
}

// === STUDY TOOLKIT MODULE ===
// 12. STUDY NOTES LOGIC (MISTAKE BOOK / CUSTOM NOTES)
function renderToolkit() {
    const container = document.getElementById("notes-container");
    const activeBtn = document.querySelector(".note-filter-btn.active-nav-tab");
    const category = activeBtn ? activeBtn.getAttribute("data-category") : "all";

    const filtered = category === "all" ? 
                     appState.notes : 
                     appState.notes.filter(n => n.category === category);

    if (filtered.length === 0) {
        container.innerHTML = `<div class="text-center text-xs text-gray-500 py-6">No custom notes saved under this tab. Create one using the form above!</div>`;
        return;
    }

    let html = "";
    filtered.forEach(n => {
        const catLabel = n.category === "mistake" ? "Mistake Book" : n.category === "formula" ? "Formula/Trick" : "Static GK";
        const catBorder = n.category === "mistake" ? "border-l-accentRose" : n.category === "formula" ? "border-l-accentCyan" : "border-l-accentAmber";
        
        html += `
            <div class="bg-white/2px border-l-2 ${catBorder} border-t border-r border-b border-white/5 rounded-lg p-3 relative hover:bg-white/5 transition">
                <div class="flex justify-between items-start gap-2">
                    <h5 class="text-xs font-bold text-white">${n.title}</h5>
                    <button class="text-gray-500 hover:text-accentRose text-xs" onclick="deleteNote('${n.id}')" title="Delete Note">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                <div class="text-[9px] text-gray-500 font-semibold uppercase mt-0.5">Subject: ${n.subject} &bull; ${catLabel} &bull; ${n.date}</div>
                <div class="text-[11px] text-gray-300 mt-2">${parseMarkdown(n.content)}</div>
            </div>
        `;
    });

    container.innerHTML = html;
    
    // Trigger LaTeX typesetting
    setTimeout(triggerMathTypesetting, 50);
}

function deleteNote(id) {
    if (confirm("Delete this note?")) {
        appState.notes = appState.notes.filter(n => n.id !== id);
        saveStateToStorage();
        renderToolkit();
    }
}

// 13. MODALS AND DETAILS MANAGEMENT
function initModals() {
    const closeBtns = document.querySelectorAll(".modal-close-btn");
    closeBtns.forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
        };
    });

    window.onclick = (e) => {
        if (e.target.classList.contains("modal")) {
            e.target.classList.remove("active");
        }
    };
}

function openDayDetailModal(dayNum) {
    const modal = document.getElementById("modal-day-detail");
    const dayData = PLAN_DATA.find(d => d.day === dayNum);
    
    if (!dayData) return;

    document.getElementById("md-day-num").innerText = dayNum;
    
    let phaseTitle = "Phase 1: Foundations";
    if (dayData.phase === 2) phaseTitle = "Phase 2: Applications & Practice";
    else if (dayData.phase === 3) phaseTitle = "Phase 3: Advanced Math (Tier 2 Level)";
    else if (dayData.phase === 4) phaseTitle = "Phase 4: Simulation Mock Runs";

    document.getElementById("md-phase-title").innerText = `${phaseTitle} (Day ${dayNum} of 40)`;
    document.getElementById("md-day-description").innerText = dayData.desc;
    document.getElementById("md-total-time").innerText = dayData.time + " Est.";
    document.getElementById("md-total-tasks").innerText = (dayData.targets.length > 0 ? dayData.targets.length : "Full Mock") + " Targets";

    const listContainer = document.getElementById("md-topics-list-container");
    listContainer.innerHTML = "";

    if (dayData.targets.length === 0) {
        listContainer.innerHTML = `
            <div class="p-3 bg-accentRose/10 border border-accentRose/20 rounded-lg text-xs text-rose-300">
                <i class="fa-solid fa-trophy mr-1 text-accentRose"></i> Mock Challenge: <strong>${dayData.test}</strong>
            </div>
        `;
    } else {
        dayData.targets.forEach(targetId => {
            let sub = null;
            let parentTopic = null;
            
            for (const t of SYLLABUS_DATA) {
                sub = t.subtopics.find(s => s.id === targetId);
                if (sub) { parentTopic = t; break; }
            }

            if (sub && parentTopic) {
                const prog = appState.syllabusProgress[sub.id] || { learned: false, practiced: false, mastered: false };
                const stateText = prog.mastered ? 'MASTERED' : prog.practiced ? 'PRACTICED' : prog.learned ? 'LEARNED' : 'NOT STARTED';
                const stateColor = prog.mastered ? 'text-accentGreen' : prog.practiced ? 'text-accentPurple' : prog.learned ? 'text-accentCyan' : 'text-gray-500';

                listContainer.innerHTML += `
                    <div class="p-3 bg-white/2px border border-white/5 rounded-lg flex justify-between items-center text-xs">
                        <div>
                            <div class="font-bold text-gray-200">${sub.name}</div>
                            <div class="text-[9px] text-gray-500 font-bold uppercase mt-0.5">${parentTopic.subject} &bull; ${sub.difficulty}</div>
                        </div>
                        <div class="font-extrabold text-[10px] ${stateColor}">${stateText}</div>
                    </div>
                `;
            }
        });
    }

    const btnMarkComplete = document.getElementById("md-btn-mark-complete");
    if (dayNum === appState.currentDay) {
        btnMarkComplete.classList.remove("hidden");
        btnMarkComplete.onclick = () => {
            completeActiveDay();
            modal.classList.remove("active");
        };
    } else {
        btnMarkComplete.classList.add("hidden");
    }

    modal.classList.add("active");
    
    // Trigger LaTeX typesetting
    setTimeout(triggerMathTypesetting, 100);
}
