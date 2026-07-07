// === SYLLABUS TRACKER MODULE ===
// 7. SYLLABUS VIEWS AND RENDERING
function initSearchAndFilters() {
    const search = document.getElementById("syllabus-search");
    const fSubject = document.getElementById("filter-subject");
    const fDiff = document.getElementById("filter-difficulty");
    const fWeight = document.getElementById("filter-weightage");
    const fStatus = document.getElementById("filter-status");
    const vMode = document.getElementById("view-mode-select");

    const triggerRender = () => {
        const activeView = vMode.value;
        document.querySelectorAll(".view-panel").forEach(p => p.classList.add("hidden"));
        
        const targetPanel = document.getElementById(`view-${activeView}`);
        if (targetPanel) {
            targetPanel.classList.remove("hidden");
        }

        renderSyllabus();
    };

    [search, fSubject, fDiff, fWeight, fStatus].forEach(ctrl => {
        ctrl.addEventListener("input", triggerRender);
    });

    vMode.addEventListener("change", triggerRender);
}

function getFilteredSyllabus() {
    const query = document.getElementById("syllabus-search").value.toLowerCase();
    const sub = document.getElementById("filter-subject").value;
    const diff = document.getElementById("filter-difficulty").value;
    const weight = document.getElementById("filter-weightage").value;
    const status = document.getElementById("filter-status").value;

    const filtered = [];

    SYLLABUS_DATA.forEach(topic => {
        if (sub && topic.subject !== sub) return;

        const matchingSubtopics = topic.subtopics.filter(subtopic => {
            const textMatch = topic.topic.toLowerCase().includes(query) || 
                              subtopic.name.toLowerCase().includes(query) ||
                              topic.subject.toLowerCase().includes(query);
            if (query && !textMatch) return false;

            if (diff && subtopic.difficulty !== diff) return false;
            if (weight && subtopic.weightage !== weight) return false;

            const prog = appState.syllabusProgress[subtopic.id] || { learned: false, practiced: false, mastered: false };
            if (status) {
                if (status === "not-started" && (prog.learned || prog.practiced || prog.mastered)) return false;
                if (status === "completed" && !(prog.practiced || prog.mastered)) return false;
            }

            return true;
        });

        if (matchingSubtopics.length > 0) {
            filtered.push({
                ...topic,
                subtopics: matchingSubtopics
            });
        }
    });

    return filtered;
}

function renderSyllabus() {
    const viewMode = document.getElementById("view-mode-select").value;
    const data = getFilteredSyllabus();

    if (viewMode === "tree") {
        renderTreeHierarchy(data);
    } else if (viewMode === "table") {
        renderTableLayout(data);
    } else if (viewMode === "cards") {
        renderCardsLayout(data);
    } else if (viewMode === "mindmap") {
        renderMindMap(data);
    }
    
    // Trigger LaTeX typesetting
    setTimeout(triggerMathTypesetting, 50);
}

// Render Collapsible Tree Accordion
function renderTreeHierarchy(filteredData) {
    const container = document.getElementById("view-tree");
    if (filteredData.length === 0) {
        container.innerHTML = `<div class="bg-bgCard border border-white/5 rounded-xl p-5 text-center text-xs text-gray-500 shadow-md">No topics matched your search parameters.</div>`;
        return;
    }

    const subjects = {};
    filteredData.forEach(item => {
        if (!subjects[item.subject]) {
            subjects[item.subject] = [];
        }
        subjects[item.subject].push(item);
    });

    let html = "";

    Object.keys(subjects).forEach(subName => {
        const topics = subjects[subName];
        
        let subTotal = 0;
        let subDone = 0;
        topics.forEach(t => {
            t.subtopics.forEach(s => {
                subTotal++;
                const prog = appState.syllabusProgress[s.id];
                if (prog && (prog.practiced || prog.mastered)) subDone++;
            });
        });
        const subPct = subTotal > 0 ? Math.round((subDone / subTotal) * 100) : 0;

        let subClass = "accentCyan";
        let subBgBar = "bg-accentCyan";
        let icon = "fa-calculator";
        
        if (subName === "General Intelligence & Reasoning") { subClass = "accentPurple"; subBgBar = "bg-accentPurple"; icon = "fa-brain"; }
        else if (subName === "English Language & Comprehension") { subClass = "accentRose"; subBgBar = "bg-accentRose"; icon = "fa-language"; }
        else if (subName === "General Awareness") { subClass = "accentAmber"; subBgBar = "bg-accentAmber"; icon = "fa-globe"; }

        html += `
            <div class="bg-bgCard border border-white/5 rounded-xl shadow-md overflow-hidden transition-all" id="tree-subject-${subName.replace(/\s+/g, '-')}">
                <div class="tree-subject-header flex items-center justify-between p-4 cursor-pointer hover:bg-white/2px select-none">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-${subClass}/10 text-${subClass} flex items-center justify-center text-sm">
                            <i class="fa-solid ${icon}"></i>
                        </div>
                        <h3 class="text-xs font-bold text-white uppercase tracking-wider">${subName}</h3>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="hidden sm:flex items-center gap-2.5 text-xs font-bold text-gray-400">
                            <span class="w-16 bg-white/5 h-1.5 rounded-full overflow-hidden"><span class="block ${subBgBar} h-full rounded-full" style="width: ${subPct}%"></span></span>
                            <span class="text-${subClass}">${subPct}%</span>
                        </div>
                        <i class="fa-solid fa-chevron-down text-gray-500 text-xs transition duration-200 chevron-icon"></i>
                    </div>
                </div>
                <div class="tree-subject-content border-t border-white/5 p-4 space-y-4">
        `;

        const categories = {};
        topics.forEach(t => {
            const cat = t.category || "General";
            if (!categories[cat]) {
                categories[cat] = [];
            }
            categories[cat].push(t);
        });

        Object.keys(categories).forEach(catName => {
            html += `
                <div class="space-y-2">
                    <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-1">${catName}</div>
            `;

            categories[catName].forEach(topicItem => {
                let topicDone = 0;
                topicItem.subtopics.forEach(s => {
                    const prog = appState.syllabusProgress[s.id];
                    if (prog && (prog.practiced || prog.mastered)) topicDone++;
                });

                html += `
                    <div class="border border-white/5 rounded-lg overflow-hidden" id="tree-topic-${topicItem.id}">
                        <div class="tree-topic-header flex items-center justify-between p-2.5 cursor-pointer hover:bg-white/2px select-none bg-white/2px">
                            <div class="flex items-center gap-2 text-xs font-semibold text-gray-200">
                                <i class="fa-solid fa-folder text-accentCyan"></i>
                                <span>${isHighWeightTopic(topicItem.topic) ? '<i class="fa-solid fa-star text-accentAmber mr-1.5 animate-pulse" title="High-Weight Core Topic (SSC Obsession)"></i>' : ''}${topicItem.topic}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded">${topicDone}/${topicItem.subtopics.length} Done</span>
                                <i class="fa-solid fa-chevron-right text-gray-600 text-[10px] transition duration-200"></i>
                            </div>
                        </div>
                        <div class="tree-topic-content hidden bg-black/10 border-t border-white/5 p-3 space-y-3">
                `;

                topicItem.subtopics.forEach(sub => {
                    const prog = appState.syllabusProgress[sub.id] || { learned: false, practiced: false, mastered: false };
                    const diffBadge = sub.difficulty === "Easy" ? "bg-accentGreen/10 border-accentGreen/20 text-accentGreen" :
                                      sub.difficulty === "Moderate" ? "bg-accentAmber/10 border-accentAmber/20 text-accentAmber" :
                                      "bg-accentRose/10 border-accentRose/20 text-accentRose";

                    const hasAlert = appState.weakAlerts && appState.weakAlerts[sub.id];
                    const alertBadge = hasAlert ? `<span class="red-alert-flag text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ml-1.5"><i class="fa-solid fa-triangle-exclamation mr-0.5 animate-pulse"></i> Red Alert</span>` : '';

                    html += `
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5 last:border-b-0 last:pb-0" data-id="${sub.id}">
                            <div class="space-y-1">
                                <div class="text-xs font-medium text-gray-200 flex items-center">${sub.name} ${alertBadge}</div>
                                <div class="flex items-center gap-2 text-[9px] text-gray-500 font-bold uppercase">
                                    <span class="border px-1.5 py-0.5 rounded ${diffBadge}">${sub.difficulty}</span>
                                    <span class="bg-white/5 border border-white/5 px-1.5 py-0.5 rounded">${sub.weightage} Weight</span>
                                    <span>Effort: ${sub.effort}</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-3.5 flex-wrap">
                                <label class="flex items-center gap-2 cursor-pointer text-[10px] text-gray-400 hover:text-white select-none">
                                    <input type="checkbox" class="tree-cb-learned accent-accentCyan" data-id="${sub.id}" ${prog.learned ? 'checked' : ''}>
                                    <span>Learned</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer text-[10px] text-gray-400 hover:text-white select-none">
                                    <input type="checkbox" class="tree-cb-practiced accent-accentPurple" data-id="${sub.id}" ${prog.practiced ? 'checked' : ''}>
                                    <span>Practiced</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer text-[10px] text-gray-400 hover:text-white select-none">
                                    <input type="checkbox" class="tree-cb-mastered accent-accentGreen" data-id="${sub.id}" ${prog.mastered ? 'checked' : ''}>
                                    <span>Mastered</span>
                                </label>
                            </div>
                        </div>
                    `;
                });

                html += `
                        </div>
                    </div>
                `;
            });

            html += `</div>`; // Category end
        });

        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Attach subject toggle
    container.querySelectorAll(".tree-subject-header").forEach(header => {
        header.addEventListener("click", () => {
            const card = header.parentElement;
            const content = card.querySelector(".tree-subject-content");
            const icon = header.querySelector(".chevron-icon");
            
            content.classList.toggle("hidden");
            icon.classList.toggle("rotate-180");
        });
    });

    // Attach topic toggle
    container.querySelectorAll(".tree-topic-header").forEach(header => {
        header.addEventListener("click", () => {
            const row = header.parentElement;
            const content = row.querySelector(".tree-topic-content");
            const icon = header.querySelector(".fa-chevron-right");
            
            content.classList.toggle("hidden");
            icon.classList.toggle("rotate-90");
        });
    });

    // Checkbox toggling
    container.querySelectorAll("input[type='checkbox']").forEach(cb => {
        cb.addEventListener("change", (e) => {
            const subId = cb.getAttribute("data-id");
            const isLearned = e.target.classList.contains("tree-cb-learned");
            const isPracticed = e.target.classList.contains("tree-cb-practiced");
            const isMastered = e.target.classList.contains("tree-cb-mastered");

            if (isLearned) appState.syllabusProgress[subId].learned = cb.checked;
            if (isPracticed) appState.syllabusProgress[subId].practiced = cb.checked;
            if (isMastered) appState.syllabusProgress[subId].mastered = cb.checked;

            if (cb.checked && (isPracticed || isMastered)) {
                if (appState.weakAlerts) delete appState.weakAlerts[subId];
            }

            saveStateToStorage();
            renderAll();
        });
    });
}

// Render Table Layout
function renderTableLayout(filteredData) {
    const tbody = document.getElementById("syllabus-table-body");
    if (filteredData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-xs text-gray-500 py-6">No topics matched your search parameters.</td></tr>`;
        return;
    }

    let html = "";
    filteredData.forEach(topic => {
        topic.subtopics.forEach(sub => {
            const prog = appState.syllabusProgress[sub.id] || { learned: false, practiced: false, mastered: false };
            const subClass = topic.subject === "Quantitative Aptitude" ? "text-accentCyan" :
                             topic.subject === "General Intelligence & Reasoning" ? "text-accentPurple" :
                             topic.subject === "English Language & Comprehension" ? "text-accentRose" : "text-accentAmber";

            const diffBadge = sub.difficulty === "Easy" ? "bg-accentGreen/10 border-accentGreen/20 text-accentGreen" :
                              sub.difficulty === "Moderate" ? "bg-accentAmber/10 border-accentAmber/20 text-accentAmber" :
                              "bg-accentRose/10 border-accentRose/20 text-accentRose";

            html += `
                <tr class="hover:bg-white/2px transition">
                    <td class="px-4 py-2.5">
                        <strong class="${subClass} font-heading text-[10px] tracking-wide block">${topic.subject}</strong>
                        <span class="text-gray-500 text-[9px] uppercase font-bold">${topic.category || 'Core'}</span>
                    </td>
                    <td class="px-4 py-2.5 font-semibold text-gray-200">${isHighWeightTopic(topic.topic) ? '<i class="fa-solid fa-star text-accentAmber mr-1.5" title="High-Weight Core Topic (SSC Obsession)"></i>' : ''}${topic.topic}</td>
                    <td class="px-4 py-2.5 text-gray-300">
                        <span class="flex items-center gap-1.5">
                            ${sub.name}
                            ${(appState.weakAlerts && appState.weakAlerts[sub.id]) ? `<span class="red-alert-flag text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full"><i class="fa-solid fa-triangle-exclamation mr-0.5 animate-pulse"></i> Alert</span>` : ''}
                        </span>
                    </td>
                    <td class="px-4 py-2.5 text-center"><span class="border text-[9px] font-bold px-1.5 py-0.5 rounded ${diffBadge}">${sub.difficulty}</span></td>
                    <td class="px-4 py-2.5 text-center"><span class="bg-white/5 border border-white/5 text-gray-400 text-[9px] font-bold px-1.5 py-0.5 rounded">${sub.weightage}</span></td>
                    <td class="px-4 py-2.5">
                        <div class="flex items-center gap-3">
                            <label class="flex items-center gap-1 cursor-pointer text-[10px] text-gray-400 hover:text-white select-none">
                                <input type="checkbox" class="tbl-cb-learned accent-accentCyan" data-id="${sub.id}" ${prog.learned ? 'checked' : ''}>
                                <span>L</span>
                            </label>
                            <label class="flex items-center gap-1 cursor-pointer text-[10px] text-gray-400 hover:text-white select-none">
                                <input type="checkbox" class="tbl-cb-practiced accent-accentPurple" data-id="${sub.id}" ${prog.practiced ? 'checked' : ''}>
                                <span>P</span>
                            </label>
                            <label class="flex items-center gap-1 cursor-pointer text-[10px] text-gray-400 hover:text-white select-none">
                                <input type="checkbox" class="tbl-cb-mastered accent-accentGreen" data-id="${sub.id}" ${prog.mastered ? 'checked' : ''}>
                                <span>M</span>
                            </label>
                        </div>
                    </td>
                    <td class="px-4 py-2.5 text-right">
                        <button class="bg-white/5 hover:bg-accentGreen/10 border border-white/5 hover:border-accentGreen/20 text-gray-400 hover:text-accentGreen text-[10px] font-bold px-2 py-1 rounded transition table-quick-master" data-id="${sub.id}">
                            <i class="fa-solid fa-circle-check"></i> Master
                        </button>
                    </td>
                </tr>
            `;
        });
    });

    tbody.innerHTML = html;

    // Attach checkbox changes
    tbody.querySelectorAll("input[type='checkbox']").forEach(cb => {
        cb.addEventListener("change", (e) => {
            const subId = cb.getAttribute("data-id");
            const isLearned = e.target.classList.contains("tbl-cb-learned");
            const isPracticed = e.target.classList.contains("tbl-cb-practiced");
            const isMastered = e.target.classList.contains("tbl-cb-mastered");

            if (isLearned) appState.syllabusProgress[subId].learned = cb.checked;
            if (isPracticed) appState.syllabusProgress[subId].practiced = cb.checked;
            if (isMastered) appState.syllabusProgress[subId].mastered = cb.checked;

            if (cb.checked && (isPracticed || isMastered)) {
                if (appState.weakAlerts) delete appState.weakAlerts[subId];
            }

            saveStateToStorage();
            renderAll();
        });
    });

    tbody.querySelectorAll(".table-quick-master").forEach(btn => {
        btn.onclick = () => {
            const subId = btn.getAttribute("data-id");
            appState.syllabusProgress[subId] = { learned: true, practiced: true, mastered: true };
            if (appState.weakAlerts) delete appState.weakAlerts[subId];
            saveStateToStorage();
            renderAll();
            renderTableLayout(filteredData);
        };
    });
}

// Render Card Layout
function renderCardsLayout(filteredData) {
    const container = document.getElementById("view-cards");
    if (filteredData.length === 0) {
        container.innerHTML = `<div class="bg-bgCard border border-white/5 rounded-xl p-5 text-center text-xs text-gray-500 shadow-md col-span-3">No topics matched your search parameters.</div>`;
        return;
    }

    let html = "";
    filteredData.forEach(topic => {
        const topicTotal = topic.subtopics.length;
        let learnedCount = 0;
        let practicedCount = 0;
        let masteredCount = 0;

        topic.subtopics.forEach(s => {
            const prog = appState.syllabusProgress[s.id];
            if (prog) {
                if (prog.learned) learnedCount++;
                if (prog.practiced) practicedCount++;
                if (prog.mastered) masteredCount++;
            }
        });

        let cardScore = Math.round(((masteredCount + (practicedCount * 0.6) + (learnedCount * 0.3)) / topicTotal) * 100);
        cardScore = Math.min(cardScore, 100);

        const subClass = topic.subject === "Quantitative Aptitude" ? "text-accentCyan" :
                         topic.subject === "General Intelligence & Reasoning" ? "text-accentPurple" :
                         topic.subject === "English Language & Comprehension" ? "text-accentRose" : "text-accentAmber";

        html += `
            <div class="bg-bgCard border border-white/5 rounded-xl p-4 shadow hover:border-white/10 transition duration-300 flex flex-col gap-3">
                <div class="flex justify-between items-start">
                    <div>
                        <span class="text-[9px] font-bold uppercase ${subClass}">${topic.subject}</span>
                        <h3 class="text-xs font-bold text-white mt-0.5">${isHighWeightTopic(topic.topic) ? '<i class="fa-solid fa-star text-accentAmber mr-1.5 animate-pulse" title="High-Weight Core Topic (SSC Obsession)"></i>' : ''}${topic.topic}</h3>
                    </div>
                    <span class="bg-white/5 border border-white/5 px-2 py-0.5 text-[9px] font-bold text-gray-400 uppercase rounded">${topic.category || 'Core'}</span>
                </div>
                
                <div class="grid grid-cols-2 gap-2 text-[10px] bg-white/2px p-2.5 rounded-lg border border-white/5">
                    <div><span class="text-gray-500 block">Total Chapters</span><span class="font-bold text-gray-200">${topicTotal}</span></div>
                    <div><span class="text-gray-500 block">Mastered</span><span class="font-bold text-accentGreen">${masteredCount}/${topicTotal}</span></div>
                    <div><span class="text-gray-500 block">Practiced</span><span class="font-bold text-accentPurple">${practicedCount}/${topicTotal}</span></div>
                    <div><span class="text-gray-500 block">Learned</span><span class="font-bold text-accentCyan">${learnedCount}/${topicTotal}</span></div>
                </div>

                <div class="space-y-1 mt-1">
                    <div class="flex justify-between items-center text-[10px] font-bold">
                        <span class="text-gray-400">Readiness Score</span>
                        <span class="${subClass}">${cardScore}%</span>
                    </div>
                    <div class="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                        <div class="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full" style="width: ${cardScore}%;"></div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// 8. INTERACTIVE SVG MIND MAP VIEWER ENGINE
// Zoom, Pan & Drag canvas states
let mmZoom = 0.8;
let mmPanX = 100;
let mmPanY = 80;
let mmIsDragging = false;
let mmDragStart = { x: 0, y: 0 };

function renderMindMap(filteredData = SYLLABUS_DATA) {
    const containerG = document.getElementById("mindmap-g");
    containerG.innerHTML = "";

    if (filteredData.length === 0) {
        containerG.innerHTML = `<text x="50" y="50" fill="var(--text-sub)" font-size="12">No nodes found...</text>`;
        return;
    }

    // Build hierarchical radial/horizontal tree map
    const root = { id: "root", name: "SSC CGL", x: 60, y: 250, type: "root", children: [] };
    const subjectsMap = {};

    filteredData.forEach(topic => {
        if (!subjectsMap[topic.subject]) {
            subjectsMap[topic.subject] = { id: "sub-" + topic.subject.replace(/\s+/g, '-'), name: topic.subject, type: "subject", children: [] };
            root.children.push(subjectsMap[topic.subject]);
        }
        const topicNode = { id: "topic-" + topic.id, name: topic.topic, type: "topic", subtopics: topic.subtopics };
        subjectsMap[topic.subject].children.push(topicNode);
    });

    const totalSubjects = root.children.length;
    let currentTopicY = 20;
    const verticalGap = 40;

    root.children.forEach((sub, subIdx) => {
        sub.x = 260;
        sub.y = 80 + (subIdx * (400 / Math.max(totalSubjects - 1, 1)));
        if (totalSubjects === 1) sub.y = 250;

        sub.children.forEach(topicNode => {
            topicNode.x = 480;
            topicNode.y = currentTopicY + (verticalGap * 0.8);
            currentTopicY += verticalGap;
        });
        currentTopicY += 15;
    });

    // Draw Links
    let linksHtml = "";
    root.children.forEach(sub => {
        let isSubComp = true;
        sub.children.forEach(t => {
            t.subtopics.forEach(s => {
                const p = appState.syllabusProgress[s.id];
                if (!p || (!p.practiced && !p.mastered)) isSubComp = false;
            });
        });

        linksHtml += drawBezierLink(root.x, root.y, sub.x, sub.y, isSubComp);

        sub.children.forEach(topicNode => {
            let isTopicComp = true;
            topicNode.subtopics.forEach(s => {
                const p = appState.syllabusProgress[s.id];
                if (!p || (!p.practiced && !p.mastered)) isTopicComp = false;
            });

            linksHtml += drawBezierLink(sub.x, sub.y, topicNode.x, topicNode.y, isTopicComp);
        });
    });

    // Draw Nodes
    let nodesHtml = renderSvgNode(root);

    root.children.forEach(sub => {
        let done = 0, tot = 0;
        sub.children.forEach(t => {
            t.subtopics.forEach(s => {
                tot++;
                const p = appState.syllabusProgress[s.id];
                if (p && (p.practiced || p.mastered)) done++;
            });
        });
        const completionClass = done === tot && tot > 0 ? "mastered-node" : done > 0 ? "practiced-node" : "";

        nodesHtml += renderSvgNode(sub, completionClass, `${done}/${tot}`);

        sub.children.forEach(topicNode => {
            let tDone = 0, tTot = topicNode.subtopics.length;
            let hasTopicAlert = false;
            topicNode.subtopics.forEach(s => {
                const p = appState.syllabusProgress[s.id];
                if (p && (p.practiced || p.mastered)) tDone++;
                if (appState.weakAlerts && appState.weakAlerts[s.id]) hasTopicAlert = true;
            });
            let tCompClass = tDone === tTot && tTot > 0 ? "mastered-node" : tDone > 0 ? "practiced-node" : "";
            if (hasTopicAlert) tCompClass += " alert-node";

            nodesHtml += renderSvgNode(topicNode, tCompClass, `${tDone}/${tTot}`);
        });
    });

    containerG.innerHTML = linksHtml + nodesHtml;
    updateMindMapTransform();
    initMindMapInteraction();
}

function drawBezierLink(x1, y1, x2, y2, isCompleted) {
    const cp1 = x1 + (x2 - x1) / 2;
    const cp2 = cp1;
    const strokeClass = isCompleted ? "mm-link completed-branch" : "mm-link";
    return `<path d="M ${x1} ${y1} C ${cp1} ${y1}, ${cp2} ${y2}, ${x2} ${y2}" class="${strokeClass}" />`;
}

function renderSvgNode(node, statusClass = "", progressText = "") {
    const extraClass = node.type + " " + statusClass;
    let label = node.name;
    if (node.type === "topic" && isHighWeightTopic(node.name)) {
        label = "★ " + label;
    }
    if (label.length > 20) {
        label = label.substring(0, 18) + "...";
    }

    let textOffsetX = 20;
    let textAnchor = "start";
    if (node.type === "root") {
        textOffsetX = -20;
        textAnchor = "end";
    }

    return `
        <g class="mm-node ${extraClass} select-none cursor-pointer" transform="translate(${node.x}, ${node.y})" data-id="${node.id}" data-type="${node.type}">
            <circle cx="0" cy="0" />
            <text x="${textOffsetX}" y="4" text-anchor="${textAnchor}" class="font-heading">${label} ${progressText ? `(${progressText})` : ''}</text>
        </g>
    `;
}

function updateMindMapTransform() {
    const containerG = document.getElementById("mindmap-g");
    containerG.setAttribute("transform", `translate(${mmPanX}, ${mmPanY}) scale(${mmZoom})`);
}

function initMindMapInteraction() {
    const svg = document.getElementById("mindmap-svg");
    const container = document.getElementById("mindmap-container");

    const btnReset = document.getElementById("btn-mm-reset");
    const btnZoomIn = document.getElementById("btn-mm-zoomin");
    const btnZoomOut = document.getElementById("btn-mm-zoomout");

    btnReset.onclick = () => {
        mmZoom = 0.8; mmPanX = 100; mmPanY = 80;
        updateMindMapTransform();
    };
    btnZoomIn.onclick = () => { mmZoom += 0.1; updateMindMapTransform(); };
    btnZoomOut.onclick = () => { mmZoom = Math.max(0.3, mmZoom - 0.1); updateMindMapTransform(); };

    // Canvas Panning dragging
    container.onmousedown = (e) => {
        if (e.target.tagName === "circle" || e.target.tagName === "text") return;
        mmIsDragging = true;
        mmDragStart.x = e.clientX - mmPanX;
        mmDragStart.y = e.clientY - mmPanY;
    };

    window.onmousemove = (e) => {
        if (!mmIsDragging) return;
        mmPanX = e.clientX - mmDragStart.x;
        mmPanY = e.clientY - mmDragStart.y;
        updateMindMapTransform();
    };

    window.onmouseup = () => { mmIsDragging = false; };

    // Scroll zoom
    container.onwheel = (e) => {
        e.preventDefault();
        if (e.deltaY < 0) mmZoom += 0.05;
        else mmZoom = Math.max(0.3, mmZoom - 0.05);
        updateMindMapTransform();
    };

    // Node click redirects to accordion Tree view
    svg.querySelectorAll(".mm-node").forEach(node => {
        node.onclick = (e) => {
            e.stopPropagation();
            const nodeId = node.getAttribute("data-id");
            const nodeType = node.getAttribute("data-type");

            if (nodeType === "topic") {
                const topicId = nodeId.replace("topic-", "");
                
                // Toggle mode select
                document.getElementById("view-mode-select").value = "tree";
                document.getElementById("view-tree").classList.remove("hidden");
                document.getElementById("view-mindmap").classList.add("hidden");

                renderSyllabus();

                setTimeout(() => {
                    const treeRow = document.getElementById(`tree-topic-${topicId}`);
                    if (treeRow) {
                        const content = treeRow.querySelector(".tree-topic-content");
                        const icon = treeRow.querySelector(".fa-chevron-right");
                        
                        content.classList.remove("hidden");
                        if (icon) icon.classList.add("rotate-90");
                        
                        treeRow.scrollIntoView({ behavior: "smooth", block: "center" });
                        
                        // Brief glow outline highlight
                        treeRow.classList.add("ring-2", "ring-accentCyan", "shadow-lg");
                        setTimeout(() => {
                            treeRow.classList.remove("ring-2", "ring-accentCyan", "shadow-lg");
                        }, 2000);
                    }
                }, 100);
            }
        };
    });
}
