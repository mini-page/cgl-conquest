// === MOCK ANALYTICS MODULE ===
// 10. MOCK TEST SCORE LOGS AND GRAPH
let selectedWeakTopicIds = [];
let editingMockId = null;

function getSubtopicDetails(subtopicId) {
    for (const topic of SYLLABUS_DATA) {
        for (const sub of topic.subtopics) {
            if (sub.id === subtopicId) {
                return {
                    id: sub.id,
                    name: sub.name,
                    subject: topic.subject
                };
            }
        }
    }
    return null;
}

function renderSelectedWeakTags() {
    const tagsContainer = document.getElementById("mock-weak-tags-container");
    const listInput = document.getElementById("mock-weak-topics-list");
    if (!tagsContainer || !listInput) return;
    if (selectedWeakTopicIds.length === 0) {
        tagsContainer.innerHTML = "No topics selected (Optional)";
        tagsContainer.classList.add("text-gray-400");
        listInput.value = "";
        return;
    }
    tagsContainer.classList.remove("text-gray-400");
    let html = "";
    selectedWeakTopicIds.forEach(id => {
        const details = getSubtopicDetails(id);
        if (details) {
            html += `
                <span class="inline-flex items-center gap-1 text-[10px] bg-accentCyan/15 text-accentCyan border border-accentCyan/20 px-2 py-0.5 rounded-full font-semibold select-none">
                    <span>${details.name}</span>
                    <button type="button" class="hover:text-white font-extrabold text-[12px] ml-0.5 leading-none" onclick="removeWeakTopicTag('${id}')">&times;</button>
                </span>
            `;
        }
    });
    tagsContainer.innerHTML = html;
    listInput.value = JSON.stringify(selectedWeakTopicIds);
}

function renderWeakDropdownOptions(query = "") {
    const optionsPanel = document.getElementById("mock-weak-dropdown-options");
    if (!optionsPanel) return;
    const cleanQuery = query.toLowerCase().trim();
    let html = "";

    SYLLABUS_DATA.forEach(topic => {
        topic.subtopics.forEach(sub => {
            const text = `${topic.subject} - ${sub.name}`.toLowerCase();
            if (cleanQuery === "" || text.includes(cleanQuery)) {
                const isSelected = selectedWeakTopicIds.includes(sub.id);
                html += `
                    <div class="px-2.5 py-1.5 text-xs text-gray-300 hover:bg-white/5 cursor-pointer transition flex items-center justify-between" onclick="toggleWeakTopicSelect('${sub.id}')">
                        <span class="truncate pr-2"><strong class="text-[9px] text-gray-400 font-bold uppercase mr-1">${topic.subject}</strong> &bull; ${sub.name}</span>
                        ${isSelected ? '<i class="fa-solid fa-check text-accentCyan text-[10px]"></i>' : ''}
                    </div>
                `;
            }
        });
    });

    optionsPanel.innerHTML = html || `<div class="text-center text-xs text-gray-500 py-3">No matching topics found.</div>`;
}

function initForms() {
    const mockDateInput = document.getElementById("mock-date");
    if (mockDateInput) {
        if (!mockDateInput.value) {
            mockDateInput.value = new Date().toISOString().substring(0, 10);
        }
        if (window.initCustomCalendar) {
            window.initCustomCalendar(mockDateInput);
        }
    }

    const searchInput = document.getElementById("mock-weak-search");
    const optionsPanel = document.getElementById("mock-weak-dropdown-options");

    window.removeWeakTopicTag = (id) => {
        selectedWeakTopicIds = selectedWeakTopicIds.filter(x => x !== id);
        renderSelectedWeakTags();
        renderWeakDropdownOptions(searchInput ? searchInput.value : "");
    };

    window.toggleWeakTopicSelect = (id) => {
        if (selectedWeakTopicIds.includes(id)) {
            selectedWeakTopicIds = selectedWeakTopicIds.filter(x => x !== id);
        } else {
            selectedWeakTopicIds.push(id);
        }
        renderSelectedWeakTags();
        renderWeakDropdownOptions(searchInput ? searchInput.value : "");
    };

    if (searchInput && optionsPanel) {
        searchInput.addEventListener("focus", () => {
            optionsPanel.classList.remove("hidden");
            renderWeakDropdownOptions(searchInput.value);
        });

        let searchDebounce;
        searchInput.addEventListener("input", () => {
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(() => {
                optionsPanel.classList.remove("hidden");
                renderWeakDropdownOptions(searchInput.value);
            }, 200);
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            const widget = document.getElementById("custom-weak-topics-widget");
            if (widget && !widget.contains(e.target)) {
                optionsPanel.classList.add("hidden");
            }
        });
    }

    // Auto-sum sectional scores to fill total score
    const sQuant = document.getElementById("score-quant");
    const sReason = document.getElementById("score-reasoning");
    const sEnglish = document.getElementById("score-english");
    const sGa = document.getElementById("score-ga");
    const totalScoreInput = document.getElementById("mock-score");

    if (sQuant && sReason && sEnglish && sGa && totalScoreInput) {
        const updateSum = () => {
            const qVal = parseFloat(sQuant.value) || 0;
            const rVal = parseFloat(sReason.value) || 0;
            const eVal = parseFloat(sEnglish.value) || 0;
            const gVal = parseFloat(sGa.value) || 0;
            const sum = qVal + rVal + eVal + gVal;
            totalScoreInput.value = sum;
            const displayScore = document.getElementById("mock-score-display");
            if (displayScore) {
                displayScore.innerText = `${sum.toFixed(2)} / 200`;
            }
        };
        [sQuant, sReason, sEnglish, sGa].forEach(el => {
            el.addEventListener("input", updateSum);
        });
    }

    const mockForm = document.getElementById("form-mock");
    mockForm.onsubmit = (e) => {
        e.preventDefault();
        const isEdit = !!editingMockId;
        
        const name = document.getElementById("mock-name").value;
        const date = document.getElementById("mock-date").value;
        const score = parseFloat(document.getElementById("mock-score").value);
        const accuracy = parseFloat(document.getElementById("mock-accuracy").value) || null;
        const rank = document.getElementById("mock-rank").value || "N/A";
        
        const qScore = parseFloat(document.getElementById("score-quant").value) || 0;
        const rScore = parseFloat(document.getElementById("score-reasoning").value) || 0;
        const eScore = parseFloat(document.getElementById("score-english").value) || 0;
        const gaScore = parseFloat(document.getElementById("score-ga").value) || 0;
        
        const notes = document.getElementById("mock-notes").value;
        
        // Read multi-select weak topic IDs
        const weakTopicIdsVal = document.getElementById("mock-weak-topics-list").value;
        const weakTopicIds = weakTopicIdsVal ? JSON.parse(weakTopicIdsVal) : [];

        if (editingMockId) {
            const mockIndex = appState.mocks.findIndex(m => m.id === editingMockId);
            if (mockIndex !== -1) {
                appState.mocks[mockIndex] = {
                    id: editingMockId,
                    name, date, score, accuracy, rank,
                    breakdown: { quant: qScore, reasoning: rScore, english: eScore, ga: gaScore },
                    notes,
                    weakTopicIds,
                    weakTopicId: weakTopicIds[0] || ""
                };
            }
            editingMockId = null;
        } else {
            const newMock = {
                id: "mock-" + Date.now(),
                name, date, score, accuracy, rank,
                breakdown: { quant: qScore, reasoning: rScore, english: eScore, ga: gaScore },
                notes,
                weakTopicIds,
                weakTopicId: weakTopicIds[0] || "" // backward compatibility
            };
            appState.mocks.push(newMock);
        }

        appState.mocks.sort((a,b) => new Date(a.date) - new Date(b.date));
        
        // Recalculate weak alerts
        appState.weakAlerts = {};
        appState.mocks.forEach(m => {
            const ids = m.weakTopicIds || (m.weakTopicId ? [m.weakTopicId] : []);
            ids.forEach(id => {
                if (id) {
                    appState.weakAlerts[id] = true;
                }
            });
        });

        saveStateToStorage();
        mockForm.reset();

        // Restore Form Title and Button text
        const formHeader = document.getElementById("mock-form-header");
        if (formHeader) {
            formHeader.innerHTML = `<i class="fa-solid fa-pen-ruler mr-1.5 text-accentCyan"></i> Log Mock Test Score`;
        }
        const submitBtn = document.getElementById("mock-submit-btn");
        if (submitBtn) {
            submitBtn.innerHTML = `<i class="fa-solid fa-circle-plus mr-1"></i> Save Mock Record`;
        }
        const cancelBtn = document.getElementById("mock-cancel-edit-btn");
        if (cancelBtn) cancelBtn.classList.add("hidden");
        
        const displayScore = document.getElementById("mock-score-display");
        if (displayScore) displayScore.innerText = "0.00 / 200";
        
        // Reset custom widget
        selectedWeakTopicIds = [];
        renderSelectedWeakTags();
        if (searchInput) searchInput.value = "";
        
        // Reset date to today
        if (mockDateInput) {
            mockDateInput.value = new Date().toISOString().substring(0, 10);
        }
        
        renderAll();
        renderMockAnalytics();
        const successMsg = isEdit ? "Mock record updated successfully!" : "Mock score logged successfully!";
        speakText(successMsg);
        if (window.showToast) window.showToast(successMsg, "success");
    };

    // Note logs form inside Study toolkit Custom Notes tab
    const noteForm = document.getElementById("form-note");
    const noteContentInput = document.getElementById("note-content");
    const latexPreview = document.getElementById("latex-preview");

    if (noteContentInput && latexPreview) {
        noteContentInput.addEventListener("input", () => {
            const val = noteContentInput.value.trim();
            latexPreview.innerHTML = parseMarkdown(val) || "Type math formulas inside $...$ to preview render...";
            if (window.renderMathInElement && val) {
                window.renderMathInElement(latexPreview, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false}
                    ],
                    throwOnError: false
                });
            }
        });
    }

    noteForm.onsubmit = (e) => {
        e.preventDefault();
        
        const title = document.getElementById("note-title").value;
        const category = document.getElementById("note-category").value;
        const subject = document.getElementById("note-subject").value;
        const content = noteContentInput.value;

        const newNote = {
            id: "note-" + Date.now(),
            title, category, subject, content,
            date: new Date().toLocaleDateString()
        };

        appState.notes.push(newNote);
        saveStateToStorage();
        noteForm.reset();
        if (latexPreview) {
            latexPreview.innerText = "Type math formulas inside $...$ to preview render...";
        }
        
        renderToolkit();
        speakText("Note saved to toolkit.");
        if (window.showToast) window.showToast("Note saved to study toolkit", "success");
    };
}

function renderMockAnalytics() {
    const tbody = document.getElementById("mock-table-body");
    
    if (appState.mocks.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-xs text-gray-500 py-6">No mocks taken yet. Log your first mock!</td></tr>`;
        renderSvgMockChart([]);
        return;
    }

    let html = "";
    appState.mocks.forEach(m => {
        const accuracyText = m.accuracy ? m.accuracy + "%" : "N/A";
        const bd = m.breakdown;
        const breakupText = (bd.quant || bd.reasoning || bd.english || bd.ga) ? 
                            `${bd.quant}/${bd.reasoning}/${bd.english}/${bd.ga}` : "N/A";

        html += `
            <tr class="hover:bg-white/2px transition">
                <td class="px-3 py-2 text-gray-400">${m.date}</td>
                <td class="px-3 py-2"><strong class="text-white">${m.name}</strong><br><span class="text-[9px] text-gray-500 font-bold uppercase">Rank: ${m.rank}</span></td>
                <td class="px-3 py-2 font-heading font-extrabold text-accentCyan">${m.score}</td>
                <td class="px-3 py-2 text-center text-gray-400">${breakupText}</td>
                <td class="px-3 py-2 text-right">
                    <div class="flex items-center justify-end gap-2.5">
                        <button class="text-gray-500 hover:text-accentCyan transition" title="Edit Mock" onclick="editMock('${m.id}')">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="text-gray-500 hover:text-accentRose transition" title="Delete Mock" onclick="deleteMock('${m.id}')">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;

    const totalScore = appState.mocks.reduce((acc, m) => acc + parseFloat(m.score), 0);
    const maxScore = appState.mocks.reduce((max, m) => Math.max(max, parseFloat(m.score)), 0);
    const avgScore = (totalScore / appState.mocks.length).toFixed(1);

    const loggedAccuracies = appState.mocks.filter(m => m.accuracy !== null);
    let avgAccuracy = 0;
    if (loggedAccuracies.length > 0) {
        const sumAcc = loggedAccuracies.reduce((acc, m) => acc + parseFloat(m.accuracy), 0);
        avgAccuracy = Math.round(sumAcc / loggedAccuracies.length);
    }

    document.getElementById("metric-avg-score").innerText = avgScore;
    document.getElementById("metric-max-score").innerText = maxScore.toFixed(1);
    document.getElementById("metric-avg-accuracy").innerText = avgAccuracy + "%";

    renderSvgMockChart(appState.mocks);
    renderSectionalBenchmarks();
    renderRevisionRadar();
}

function deleteMock(mockId) {
    if (confirm("Delete this mock record?")) {
        appState.mocks = appState.mocks.filter(m => m.id !== mockId);
        
        // Recalculate weak alerts from remaining mocks
        appState.weakAlerts = {};
        appState.mocks.forEach(m => {
            const ids = m.weakTopicIds || (m.weakTopicId ? [m.weakTopicId] : []);
            ids.forEach(id => {
                if (id) {
                    appState.weakAlerts[id] = true;
                }
            });
        });

        saveStateToStorage();
        renderAll();
        renderMockAnalytics();
        if (window.showToast) window.showToast("Mock record deleted successfully", "error");
    }
}

function editMock(mockId) {
    const mock = appState.mocks.find(m => m.id === mockId);
    if (!mock) return;

    editingMockId = mockId;

    // Update Form Title and Button text
    const formHeader = document.getElementById("mock-form-header");
    if (formHeader) {
        formHeader.innerHTML = `<span class="text-accentCyan"><i class="fa-solid fa-pen-to-square mr-1"></i> Edit Mock: ${mock.name}</span>`;
    }
    const submitBtn = document.getElementById("mock-submit-btn");
    if (submitBtn) {
        submitBtn.innerHTML = `<i class="fa-solid fa-floppy-disk mr-1"></i> Update Mock Record`;
    }

    // Show Cancel button next to Save button
    const cancelBtn = document.getElementById("mock-cancel-edit-btn");
    if (cancelBtn) cancelBtn.classList.remove("hidden");

    // Fill in form values
    document.getElementById("mock-name").value = mock.name;
    document.getElementById("mock-date").value = mock.date;
    document.getElementById("mock-accuracy").value = mock.accuracy || "";
    document.getElementById("mock-rank").value = mock.rank === "N/A" ? "" : mock.rank;

    const bd = mock.breakdown || {};
    document.getElementById("score-quant").value = bd.quant || "";
    document.getElementById("score-reasoning").value = bd.reasoning || "";
    document.getElementById("score-english").value = bd.english || "";
    document.getElementById("score-ga").value = bd.ga || "";

    // Trigger calculated score refresh
    const totalScoreInput = document.getElementById("mock-score");
    if (totalScoreInput) totalScoreInput.value = mock.score;
    const displayScore = document.getElementById("mock-score-display");
    if (displayScore) displayScore.innerText = `${mock.score.toFixed(2)} / 200`;

    // Set custom weak topics dropdown selection
    selectedWeakTopicIds = mock.weakTopicIds || (mock.weakTopicId ? [mock.weakTopicId] : []);
    renderSelectedWeakTags();
    
    // Scroll to form smoothly
    const mockForm = document.getElementById("form-mock");
    if (mockForm) mockForm.scrollIntoView({ behavior: "smooth" });
}

function cancelMockEdit() {
    editingMockId = null;

    // Restore Form Title and Button text
    const formHeader = document.getElementById("mock-form-header");
    if (formHeader) {
        formHeader.innerHTML = `<i class="fa-solid fa-pen-ruler mr-1.5 text-accentCyan"></i> Log Mock Test Score`;
    }
    const submitBtn = document.getElementById("mock-submit-btn");
    if (submitBtn) {
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-plus mr-1"></i> Save Mock Record`;
    }

    // Hide Cancel button
    const cancelBtn = document.getElementById("mock-cancel-edit-btn");
    if (cancelBtn) cancelBtn.classList.add("hidden");

    // Reset form
    const mockForm = document.getElementById("form-mock");
    if (mockForm) mockForm.reset();

    // Reset custom widget
    selectedWeakTopicIds = [];
    renderSelectedWeakTags();
    const searchInput = document.getElementById("mock-weak-search");
    if (searchInput) searchInput.value = "";

    // Reset date to today
    const mockDateInput = document.getElementById("mock-date");
    if (mockDateInput) {
        mockDateInput.value = new Date().toISOString().substring(0, 10);
    }
    
    const displayScore = document.getElementById("mock-score-display");
    if (displayScore) displayScore.innerText = "0.00 / 200";
}

// Bind to window scope explicitly
window.editMock = editMock;
window.cancelMockEdit = cancelMockEdit;

function renderSvgMockChart(mocksList) {
    const svg = document.getElementById("analytics-svg-chart");
    const width = svg.clientWidth || 400;
    const height = 200;
    const padding = 35;

    svg.innerHTML = `
        <defs>
            <linearGradient id="chart-glow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.0"/>
            </linearGradient>
        </defs>
    `;
    
    // Draw Y-axis grid markers
    const gridScores = [50, 100, 150, 200];
    gridScores.forEach(score => {
        const y = height - padding - ((score / 200) * (height - 2 * padding));
        svg.innerHTML += `
            <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
            <text x="${padding - 5}" y="${y + 4}" fill="#6b7280" font-size="8" font-family="monospace" text-anchor="end">${score}</text>
        `;
    });

    // Draw safety cutoff target line (140)
    const targetY = height - padding - ((140 / 200) * (height - 2 * padding));
    svg.innerHTML += `
        <line x1="${padding}" y1="${targetY}" x2="${width - padding}" y2="${targetY}" stroke="rgba(16,185,129,0.3)" stroke-width="1.5" stroke-dasharray="3,3" />
        <text x="${width - padding - 5}" y="${targetY - 5}" fill="#10b981" font-size="7" font-weight="bold" text-anchor="end">Target Cutoff (140)</text>
    `;

    if (mocksList.length === 0) {
        svg.innerHTML += `<text x="${width/2}" y="${height/2}" fill="#6b7280" text-anchor="middle" font-size="10">Log mock tests to render progress metrics</text>`;
        return;
    }

    const points = [];
    const count = mocksList.length;
    
    mocksList.forEach((mock, idx) => {
        const x = padding + (idx * ((width - 2 * padding) / Math.max(count - 1, 1)));
        const y = height - padding - ((mock.score / 200) * (height - 2 * padding));
        points.push({ x, y, score: mock.score, name: mock.name });
    });

    if (count > 1) {
        let pathD = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            pathD += ` L ${points[i].x} ${points[i].y}`;
        }
        // Shaded gradient path
        let areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
        svg.innerHTML += `<path d="${areaD}" fill="url(#chart-glow)" />`;
        // Stroke path
        svg.innerHTML += `<path d="${pathD}" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round" />`;
    }

    points.forEach(pt => {
        const mock = mocksList.find(m => m.name === pt.name && m.score === pt.score);
        let tooltipText = `${pt.name}\nDate: ${mock ? mock.date : 'N/A'}\nScore: ${pt.score}/200`;
        if (mock && mock.accuracy) {
            tooltipText += `\nAccuracy: ${mock.accuracy}%`;
        }
        if (mock && mock.breakdown) {
            const bd = mock.breakdown;
            if (bd.quant || bd.reasoning || bd.english || bd.ga) {
                tooltipText += `\nSectional: Q:${bd.quant} | R:${bd.reasoning} | E:${bd.english} | G:${bd.ga}`;
            }
        }

        const escapedText = tooltipText.replace(/"/g, '&quot;');

        svg.innerHTML += `
            <g style="cursor:pointer;">
                <circle cx="${pt.x}" cy="${pt.y}" r="5" fill="#151526" stroke="#06b6d4" stroke-width="2" class="chart-point" data-tooltip="${escapedText}" />
                <text x="${pt.x}" y="${pt.y - 8}" fill="#06b6d4" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">${pt.score}</text>
            </g>
        `;
    });

    // Attach custom tooltip event delegation listeners
    if (!svg.dataset.listenerAttached) {
        svg.dataset.listenerAttached = "true";
        
        svg.addEventListener("mouseover", (e) => {
            if (e.target && e.target.classList.contains("chart-point")) {
                const content = e.target.getAttribute("data-tooltip");
                if (content && window.chartTooltip) {
                    window.chartTooltip.show(content, e.pageX, e.pageY);
                }
            }
        });
        
        svg.addEventListener("mousemove", (e) => {
            if (e.target && e.target.classList.contains("chart-point")) {
                const content = e.target.getAttribute("data-tooltip");
                if (content && window.chartTooltip) {
                    window.chartTooltip.show(content, e.pageX, e.pageY);
                }
            }
        });
        
        svg.addEventListener("mouseout", (e) => {
            if (e.target && e.target.classList.contains("chart-point")) {
                if (window.chartTooltip) {
                    window.chartTooltip.hide();
                }
            }
        });
    }
}

function renderSectionalBenchmarks() {
    const container = document.getElementById("sectional-bars-container");
    if (!container) return;

    if (appState.mocks.length === 0) {
        container.innerHTML = `<div class="text-center text-xs text-gray-500 py-4">Log mock tests to see sectional performance.</div>`;
        return;
    }

    const sections = {
        quant: { name: "Quantitative Aptitude", icon: "fa-calculator", sum: 0, count: 0 },
        reasoning: { name: "General Intelligence & Reasoning", icon: "fa-brain", sum: 0, count: 0 },
        english: { name: "English Language & Comprehension", icon: "fa-pen-to-square", sum: 0, count: 0 },
        ga: { name: "General Awareness", icon: "fa-earth-americas", sum: 0, count: 0 }
    };

    appState.mocks.forEach(m => {
        if (m.breakdown) {
            for (const key in sections) {
                const score = parseFloat(m.breakdown[key]);
                if (!isNaN(score) && score > 0) {
                    sections[key].sum += score;
                    sections[key].count += 1;
                }
            }
        }
    });

    let html = "";
    for (const key in sections) {
        const sec = sections[key];
        const avg = sec.count > 0 ? (sec.sum / sec.count) : 0;
        const pct = Math.round((avg / 50) * 100);

        let colorClass = "text-accentRose";
        let bgClass = "bg-accentRose";
        if (pct >= 80) {
            colorClass = "text-accentGreen";
            bgClass = "bg-accentGreen";
        } else if (pct >= 60) {
            colorClass = "text-accentAmber";
            bgClass = "bg-accentAmber";
        }

        html += `
            <div class="space-y-1">
                <div class="flex justify-between text-xs font-semibold">
                    <span class="text-gray-300 flex items-center gap-1.5">
                        <i class="fa-solid ${sec.icon} text-gray-400 w-4 text-center"></i> ${sec.name}
                    </span>
                    <span class="font-heading font-extrabold ${colorClass}">${avg.toFixed(1)}/50 (${pct}%)</span>
                </div>
                <div class="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                    <div class="${bgClass} h-full rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}

function renderRevisionRadar() {
    const container = document.getElementById("weak-topics-radar");
    if (!container) return;

    const counts = {};
    appState.mocks.forEach(m => {
        const ids = m.weakTopicIds || (m.weakTopicId ? [m.weakTopicId] : []);
        ids.forEach(id => {
            if (id) {
                counts[id] = (counts[id] || 0) + 1;
            }
        });
    });

    const weakIds = Object.keys(counts);

    if (weakIds.length === 0) {
        container.innerHTML = `
            <div class="text-center text-xs text-gray-500 py-6 border border-dashed border-white/5 rounded-xl">
                <i class="fa-solid fa-square-check text-accentGreen text-lg mb-1.5 block"></i>
                No weak topics flagged in mock tests!
            </div>`;
        return;
    }

    let html = "";
    weakIds.forEach(id => {
        let details = null;
        for (const topic of SYLLABUS_DATA) {
            for (const sub of topic.subtopics) {
                if (sub.id === id) {
                    details = {
                        id: sub.id,
                        name: sub.name,
                        subject: topic.subject
                    };
                    break;
                }
            }
        }

        if (details) {
            const count = counts[id];
            const studySubtopicId = window.findStudyNoteForSyllabus ? window.findStudyNoteForSyllabus(id) : id;
            
            html += `
                <div class="bg-white/2px border border-white/5 hover:border-accentCyan/30 rounded-xl p-3 flex justify-between items-center gap-3 transition">
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-1.5 mb-0.5">
                            <span class="text-[9px] font-bold uppercase tracking-wider text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">${details.subject}</span>
                            <span class="text-[9px] font-bold uppercase tracking-wider text-accentRose bg-accentRose/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <i class="fa-solid fa-flag"></i> Flagged ${count}x
                            </span>
                        </div>
                        <h4 class="text-xs font-semibold text-white truncate">${details.name}</h4>
                    </div>
                    <button onclick="window.openStudyViewer('${studySubtopicId}')" class="shrink-0 bg-accentCyan/10 hover:bg-accentCyan/20 text-accentCyan border border-accentCyan/25 hover:border-accentCyan/40 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition">
                        <i class="fa-solid fa-book-open mr-1"></i> Revise
                    </button>
                </div>
            `;
        }
    });

    container.innerHTML = html || `<div class="text-center text-xs text-gray-500 py-4">No weak topics resolved.</div>`;
}
