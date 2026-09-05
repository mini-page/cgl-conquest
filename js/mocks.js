// === MOCK ANALYTICS MODULE ===
// 10. MOCK TEST SCORE LOGS AND GRAPH
let selectedWeakTopicIds = [];
let editingMockId = null;
let mockEntryType = 'full'; // 'full' | 'sectional'
let mockSelectedSection = 'quant'; // 'quant' | 'reasoning' | 'english' | 'ga' | 'computer'
let mockTypeFilter = 'all'; // 'all' | 'full' | 'sectional'
let mockTimeFilter = 'all'; // 'all' | 'last5' | 'last10'

const SECTION_METADATA = {
    quant: { name: "Quantitative Aptitude", shortName: "Quant", icon: "fa-calculator", defaultMax1: 50, defaultMax2: 90 },
    reasoning: { name: "Reasoning & Intelligence", shortName: "Reasoning", icon: "fa-brain", defaultMax1: 50, defaultMax2: 90 },
    english: { name: "English Comprehension", shortName: "English", icon: "fa-pen-to-square", defaultMax1: 50, defaultMax2: 135 },
    ga: { name: "General Awareness", shortName: "Gen Awareness", icon: "fa-earth-americas", defaultMax1: 50, defaultMax2: 75 },
    computer: { name: "Computer Knowledge", shortName: "Computer", icon: "fa-laptop-code", defaultMax1: 60, defaultMax2: 60 }
};

// Robust date parsing & formatting (supports both DD-MM-YYYY and YYYY-MM-DD)
function parseDateSafe(str) {
    if (!str) return new Date(0);
    if (str instanceof Date) return str;
    const s = String(str).trim();
    // Match DD-MM-YYYY or DD/MM/YYYY
    const dmyMatch = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
    if (dmyMatch) {
        const day = parseInt(dmyMatch[1], 10);
        const month = parseInt(dmyMatch[2], 10) - 1;
        const year = parseInt(dmyMatch[3], 10);
        return new Date(year, month, day);
    }
    // Match YYYY-MM-DD or YYYY/MM/DD
    const ymdMatch = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
    if (ymdMatch) {
        const year = parseInt(ymdMatch[1], 10);
        const month = parseInt(ymdMatch[2], 10) - 1;
        const day = parseInt(ymdMatch[3], 10);
        return new Date(year, month, day);
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? new Date(0) : d;
}

function formatDateDMY(d = new Date()) {
    if (!d) return "";
    if (typeof d === 'string') d = parseDateSafe(d);
    if (isNaN(d.getTime())) return "";
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}
window.parseDateSafe = parseDateSafe;
window.formatDateDMY = formatDateDMY;

function setMockEntryType(type) {
    mockEntryType = type;
    const btnFull = document.getElementById("mock-type-full-btn");
    const btnSec = document.getElementById("mock-type-sectional-btn");
    const secSelector = document.getElementById("wrapper-sectional-subject-selector");
    const fullScoreWrap = document.getElementById("wrapper-full-score-display");
    const secScoreWrap = document.getElementById("wrapper-sectional-score-input");
    const mockSectionsWrap = document.getElementById("wrapper-mock-sections");
    const nameInput = document.getElementById("mock-name");

    if (btnFull && btnSec) {
        if (type === 'full') {
            btnFull.className = "flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition duration-200 text-white bg-gradient-to-r from-cyan-600 to-teal-600 shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 cursor-pointer";
            btnSec.className = "flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition duration-200 text-gray-400 hover:text-white bg-transparent flex items-center justify-center gap-1.5 cursor-pointer";
        } else {
            btnSec.className = "flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition duration-200 text-white bg-gradient-to-r from-cyan-600 to-teal-600 shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 cursor-pointer";
            btnFull.className = "flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition duration-200 text-gray-400 hover:text-white bg-transparent flex items-center justify-center gap-1.5 cursor-pointer";
        }
    }

    if (secSelector) {
        if (type === 'sectional') secSelector.classList.remove("hidden");
        else secSelector.classList.add("hidden");
    }
    if (fullScoreWrap && secScoreWrap) {
        if (type === 'full') {
            fullScoreWrap.classList.remove("hidden");
            secScoreWrap.classList.add("hidden");
        } else {
            fullScoreWrap.classList.add("hidden");
            secScoreWrap.classList.remove("hidden");
        }
    }
    if (mockSectionsWrap) {
        if (type === 'full') mockSectionsWrap.classList.remove("hidden");
        else mockSectionsWrap.classList.add("hidden");
    }
    if (nameInput) {
        if (type === 'sectional') {
            const secMeta = SECTION_METADATA[mockSelectedSection] || SECTION_METADATA.quant;
            nameInput.placeholder = `e.g. 15-min ${secMeta.shortName} Speed Drill`;
        } else {
            nameInput.placeholder = "e.g. PYQ Test 02";
        }
    }

    const typeInput = document.getElementById("mock-entry-type");
    if (typeInput) typeInput.value = type;

    if (type === 'sectional') {
        const secMaxInput = document.getElementById("mock-sectional-max");
        if (secMaxInput) {
            const isTier2 = appState.examTier === 2;
            const meta = SECTION_METADATA[mockSelectedSection] || SECTION_METADATA.quant;
            secMaxInput.value = isTier2 ? meta.defaultMax2 : meta.defaultMax1;
        }
    }
}
window.setMockEntryType = setMockEntryType;

function selectSectionalSubject(sec) {
    mockSelectedSection = sec;
    const input = document.getElementById("mock-selected-section");
    if (input) input.value = sec;

    document.querySelectorAll(".sec-subj-btn").forEach(btn => {
        if (btn.getAttribute("data-sec") === sec) {
            btn.className = "sec-subj-btn py-1.5 px-2 rounded-xl text-[11px] font-black border transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-sm";
        } else {
            btn.className = "sec-subj-btn py-1.5 px-2 rounded-xl text-[11px] font-bold border border-white/10 bg-slate-950/80 text-gray-400 hover:text-white transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer";
        }
    });

    const secMaxInput = document.getElementById("mock-sectional-max");
    const isTier2 = appState.examTier === 2;
    const meta = SECTION_METADATA[sec] || SECTION_METADATA.quant;
    if (secMaxInput) {
        secMaxInput.value = isTier2 ? meta.defaultMax2 : meta.defaultMax1;
    }

    const nameInput = document.getElementById("mock-name");
    if (nameInput && (!nameInput.value || nameInput.value.includes("Speed Drill"))) {
        nameInput.placeholder = `e.g. 15-min ${meta.shortName} Speed Drill`;
    }
}
window.selectSectionalSubject = selectSectionalSubject;

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
        const subtopics = topic.subtopics || [topic];
        subtopics.forEach(sub => {
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
            mockDateInput.value = formatDateDMY(new Date());
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
        renderWeakDropdownOptions("");
        
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
    const sComp = document.getElementById("score-computer");
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
                const maxTotal = (appState.examTier === 2) ? 390 : 200;
                displayScore.innerText = `${sum.toFixed(2)} / ${maxTotal}`;
            }
        };
        [sQuant, sReason, sEnglish, sGa, sComp].forEach(el => {
            if (el) el.addEventListener("input", updateSum);
        });
    }

    updateMockFormLimits();

    const mockForm = document.getElementById("form-mock");
    if (mockForm) {
        mockForm.onsubmit = (e) => {
            e.preventDefault();
            const isEdit = !!editingMockId;
            const isSectional = mockEntryType === 'sectional';
            
            const name = document.getElementById("mock-name").value.trim();
            const date = document.getElementById("mock-date").value;
            const accuracy = parseFloat(document.getElementById("mock-accuracy").value) || null;
            const rank = document.getElementById("mock-rank").value.trim() || "N/A";
            const notes = document.getElementById("mock-notes").value.trim();
            const weakTopicIdsVal = document.getElementById("mock-weak-topics-list").value;
            const weakTopicIds = weakTopicIdsVal ? JSON.parse(weakTopicIdsVal) : [];

            let score = 0;
            let sectionMax = (appState.examTier === 2) ? 390 : 200;
            let breakdown = {};

            if (isSectional) {
                const secScoreInput = document.getElementById("mock-sectional-score");
                const secMaxInput = document.getElementById("mock-sectional-max");
                score = parseFloat(secScoreInput ? secScoreInput.value : "0");
                sectionMax = parseFloat(secMaxInput ? secMaxInput.value : "50") || 50;

                if (isNaN(score) || score < 0 || score > sectionMax) {
                    const msg = `Please enter a valid section score between 0 and ${sectionMax}.`;
                    if (window.showToast) window.showToast(msg, "warning");
                    else alert(msg);
                    return;
                }

                breakdown = { [mockSelectedSection]: score };
            } else {
                score = parseFloat(document.getElementById("mock-score").value) || 0;
                const maxTotal = (appState.examTier === 2) ? 390 : 200;
                sectionMax = maxTotal;

                if (isNaN(score) || score < 0 || score > maxTotal) {
                    const msg = `Please enter a valid total score between 0 and ${maxTotal}.`;
                    if (window.showToast) window.showToast(msg, "warning");
                    else alert(msg);
                    return;
                }

                const qScore = parseFloat(document.getElementById("score-quant").value) || 0;
                const rScore = parseFloat(document.getElementById("score-reasoning").value) || 0;
                const eScore = parseFloat(document.getElementById("score-english").value) || 0;
                const gaScore = parseFloat(document.getElementById("score-ga").value) || 0;
                const compScore = parseFloat(document.getElementById("score-computer")?.value) || 0;
                breakdown = { quant: qScore, reasoning: rScore, english: eScore, ga: gaScore };
                if (appState.examTier === 2 && compScore > 0) breakdown.computer = compScore;
            }

            const mockRecord = {
                id: editingMockId || ("mock-" + Date.now()),
                mockType: isSectional ? "sectional" : "full",
                section: isSectional ? mockSelectedSection : null,
                sectionMax: isSectional ? sectionMax : null,
                name: name || (isSectional ? `${SECTION_METADATA[mockSelectedSection]?.shortName || 'Section'} Drill` : "Mock Test"),
                date,
                score,
                accuracy,
                rank,
                breakdown,
                notes,
                weakTopicIds,
                weakTopicId: weakTopicIds[0] || ""
            };

            if (editingMockId) {
                const mockIndex = appState.mocks.findIndex(m => m.id === editingMockId);
                if (mockIndex !== -1) {
                    appState.mocks[mockIndex] = mockRecord;
                }
                editingMockId = null;
            } else {
                appState.mocks.push(mockRecord);
            }

            appState.mocks.sort((a,b) => parseDateSafe(a.date) - parseDateSafe(b.date));
            
            appState.weakAlerts = {};
            appState.mocks.forEach(m => {
                const ids = m.weakTopicIds || (m.weakTopicId ? [m.weakTopicId] : []);
                ids.forEach(id => {
                    if (id) appState.weakAlerts[id] = true;
                });
            });

            saveStateToStorage();
            mockForm.reset();

            const formHeader = document.getElementById("mock-form-header");
            if (formHeader) formHeader.innerHTML = `<i class="fa-solid fa-pen-ruler mr-1.5 text-cyan-400"></i> Log Test Score`;
            const submitBtn = document.getElementById("mock-submit-btn");
            if (submitBtn) submitBtn.innerHTML = `<i class="fa-solid fa-circle-plus mr-1"></i> Save Record`;
            const cancelBtn = document.getElementById("mock-cancel-edit-btn");
            if (cancelBtn) cancelBtn.classList.add("hidden");
            
            setMockEntryType('full');
            const displayScore = document.getElementById("mock-score-display");
            if (displayScore) {
                const maxTotal = (appState.examTier === 2) ? 390 : 200;
                displayScore.innerText = `0.00 / ${maxTotal}`;
            }
            
            selectedWeakTopicIds = [];
            renderSelectedWeakTags();
            if (searchInput) searchInput.value = "";
            
            if (mockDateInput) {
                mockDateInput.value = formatDateDMY(new Date());
            }
            
            renderAll();
            renderMockAnalytics();
            const successMsg = isEdit ? "Record updated successfully!" : (isSectional ? "Sectional test logged successfully!" : "Full mock logged successfully!");
            speakText(successMsg);
            if (window.showToast) window.showToast(successMsg, "success");
        };
    }

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

    if (noteForm) {
        noteForm.onsubmit = (e) => {
            e.preventDefault();
            
            const title = document.getElementById("note-title").value;
            const category = document.getElementById("note-category").value;
            const subject = document.getElementById("note-subject").value;
            const content = noteContentInput ? noteContentInput.value : "";

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
}


function updateMockFormLimits() {
    const isTier2 = appState.examTier === 2;
    const maxScores = isTier2 ? { q: 90, r: 90, e: 135, ga: 75, comp: 60, total: 390 } : { q: 50, r: 50, e: 50, ga: 50, comp: 60, total: 200 };
    
    const sQuant = document.getElementById("score-quant");
    const sReason = document.getElementById("score-reasoning");
    const sEnglish = document.getElementById("score-english");
    const sGa = document.getElementById("score-ga");
    const sComp = document.getElementById("score-computer");
    const wrapComp = document.getElementById("wrapper-score-computer");
    const secBtnComp = document.getElementById("sec-subj-btn-comp");
    const grid = document.getElementById("mock-sections-grid");
    
    if (sQuant) sQuant.max = maxScores.q;
    if (sReason) sReason.max = maxScores.r;
    if (sEnglish) sEnglish.max = maxScores.e;
    if (sGa) sGa.max = maxScores.ga;
    if (sComp) sComp.max = maxScores.comp;
    
    if (wrapComp) {
        if (isTier2) wrapComp.classList.remove("hidden");
        else wrapComp.classList.add("hidden");
    }
    if (secBtnComp) {
        if (isTier2) secBtnComp.classList.remove("hidden");
        else secBtnComp.classList.add("hidden");
    }
    if (grid) {
        grid.className = isTier2 ? "grid grid-cols-5 gap-2" : "grid grid-cols-4 gap-2";
    }
    
    const labels = {
        "score-quant": isTier2 ? `Math (${maxScores.q})` : `Quant (${maxScores.q})`,
        "score-reasoning": `Reason (${maxScores.r})`,
        "score-english": `English (${maxScores.e})`,
        "score-ga": `Gen Aw. (${maxScores.ga})`,
        "score-computer": `Comp (${maxScores.comp})`
    };
    
    Object.keys(labels).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const label = el.previousElementSibling;
            if (label && label.tagName === "LABEL") {
                label.innerText = labels[id];
            }
        }
    });
    
    const displayScore = document.getElementById("mock-score-display");
    const totalScoreInput = document.getElementById("mock-score");
    if (displayScore && totalScoreInput) {
        const sum = parseFloat(totalScoreInput.value) || 0;
        displayScore.innerText = `${sum.toFixed(2)} / ${maxScores.total}`;
    }

    const secMaxInput = document.getElementById("mock-sectional-max");
    if (secMaxInput && mockSelectedSection) {
        const meta = SECTION_METADATA[mockSelectedSection] || SECTION_METADATA.quant;
        secMaxInput.value = isTier2 ? meta.defaultMax2 : meta.defaultMax1;
    }
}
window.updateMockFormLimits = updateMockFormLimits;

let mockMetricMode = 'score'; // 'score' | 'percent' | 'accuracy' | 'subjects'
let mockShowSma = true;

function setMockMetricMode(mode) {
    mockMetricMode = mode;
    document.querySelectorAll(".mock-metric-pill").forEach(btn => {
        if (btn.getAttribute("data-metric") === mode) {
            btn.className = "mock-metric-pill px-2.5 py-1 rounded-lg text-white bg-cyan-600 font-bold cursor-pointer transition shadow-sm";
        } else {
            btn.className = "mock-metric-pill px-2.5 py-1 rounded-lg text-gray-400 hover:text-white bg-transparent cursor-pointer transition";
        }
    });
    renderMockAnalytics();
}
window.setMockMetricMode = setMockMetricMode;

function toggleMockSma() {
    mockShowSma = !mockShowSma;
    const btn = document.getElementById("mock-toggle-sma-btn");
    if (btn) {
        if (mockShowSma) {
            btn.className = "px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold border border-amber-500/40 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition cursor-pointer flex items-center gap-1 shadow-sm";
            btn.innerHTML = `<i class="fa-solid fa-wave-square text-[9px]"></i><span>3-Test Trend: ON</span>`;
        } else {
            btn.className = "px-2.5 py-1.5 rounded-xl text-[10px] font-bold border border-white/10 bg-transparent text-gray-400 hover:text-white transition cursor-pointer flex items-center gap-1";
            btn.innerHTML = `<i class="fa-solid fa-wave-square text-[9px]"></i><span>3-Test Trend: OFF</span>`;
        }
    }
    renderMockAnalytics();
}
window.toggleMockSma = toggleMockSma;

// Mock chart and table filters: Type ('all', 'full', 'sectional') & Time ('all', 'last5', 'last10')
function setMockTypeFilter(type) {
    mockTypeFilter = type;
    document.querySelectorAll(".mock-type-filter-pill").forEach(btn => {
        if (btn.getAttribute("data-type") === type) {
            btn.className = "mock-type-filter-pill px-2.5 py-1 rounded-lg text-white bg-cyan-600 font-bold cursor-pointer transition shadow-sm";
        } else {
            btn.className = "mock-type-filter-pill px-2.5 py-1 rounded-lg text-gray-400 hover:text-white bg-transparent cursor-pointer transition";
        }
    });
    renderMockAnalytics();
}
window.setMockTypeFilter = setMockTypeFilter;

function setMockTimeFilter(time) {
    mockTimeFilter = time;
    document.querySelectorAll(".mock-filter-pill").forEach(btn => {
        if (btn.getAttribute("data-filter") === time) {
            btn.className = "mock-filter-pill px-2 py-1 rounded-lg text-white bg-cyan-600 font-bold cursor-pointer transition shadow-sm";
        } else {
            btn.className = "mock-filter-pill px-2 py-1 rounded-lg text-gray-400 hover:text-white bg-transparent cursor-pointer transition";
        }
    });
    renderMockAnalytics();
}
window.setMockTimeFilter = setMockTimeFilter;
window.setMockFilter = setMockTimeFilter; // Alias for backward compatibility

function renderMockAnalytics() {
    const tbody = document.getElementById("mock-table-body");
    const isTier2 = appState.examTier === 2;
    const maxTotal = isTier2 ? 390 : 200;
    const cutoffScore = isTier2 ? 290 : 140;

    // Header pills elements
    const headerCountEl = document.getElementById("header-mocks-count");
    const headerAvgEl = document.getElementById("header-avg-score");
    const headerMaxEl = document.getElementById("header-max-score");
    const headerAccEl = document.getElementById("header-avg-accuracy");
    const headerCutoffEl = document.getElementById("header-cutoff-target");
    const headerGapEl = document.getElementById("header-readiness-gap");
    const diagnosticTextEl = document.getElementById("diagnostic-text");

    // Tier cutoff pill
    if (headerCutoffEl) {
        headerCutoffEl.innerText = `${cutoffScore} / ${maxTotal}`;
    }

    if (appState.mocks.length === 0) {
        if (headerCountEl) headerCountEl.innerText = "0";
        if (headerAvgEl) headerAvgEl.innerText = "0.0";
        if (headerMaxEl) headerMaxEl.innerText = "0.0";
        if (headerAccEl) headerAccEl.innerText = "0%";
        if (headerGapEl) {
            headerGapEl.innerText = "Awaiting Tests";
            headerGapEl.className = "text-indigo-300 font-extrabold";
        }

        const avgEl = document.getElementById("metric-avg-score");
        const maxEl = document.getElementById("metric-max-score");
        const accEl = document.getElementById("metric-avg-accuracy");
        if (avgEl) avgEl.innerText = "0.0";
        if (maxEl) maxEl.innerText = "0.0";
        if (accEl) accEl.innerText = "0%";

        if (diagnosticTextEl) {
            diagnosticTextEl.innerText = "Log Full Mocks or 15-min Sectional drills to unlock automated trajectory diagnostics and score gap predictions.";
        }

        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-10 text-center">
                        <div class="flex flex-col items-center gap-3">
                            <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                <i class="fa-solid fa-clipboard-list text-cyan-400 text-lg"></i>
                            </div>
                            <p class="text-xs font-bold text-white uppercase tracking-wider">No Tests Logged Yet</p>
                            <p class="text-[10px] text-gray-500">Use the form on the left to log your first full mock or sectional mini test.</p>
                        </div>
                    </td>
                </tr>
            `;
        }

        renderSvgMockChart([]);
        renderMockInspectorHud(null, []);
        renderTrajectoryDiagnostics([], [], []);
        renderSectionalBenchmarks();
        renderRevisionRadar();
        return;
    }

    // Sort chronologically
    const allSorted = [...appState.mocks].sort((a, b) => parseDateSafe(a.date) - parseDateSafe(b.date));
    const fullMocks = allSorted.filter(m => (m.mockType || 'full') === 'full');
    const secMocks = allSorted.filter(m => m.mockType === 'sectional');

    // Aggregate accuracy across all tests with logged accuracy
    const loggedAccuracies = allSorted.filter(m => m.accuracy != null && !isNaN(m.accuracy));
    let avgAccuracy = 0;
    if (loggedAccuracies.length > 0) {
        const sumAcc = loggedAccuracies.reduce((acc, m) => acc + parseFloat(m.accuracy), 0);
        avgAccuracy = Math.round(sumAcc / loggedAccuracies.length);
    }

    // 1. Hydrate Header Count Pill: show both Full and Sectional numbers cleanly
    if (headerCountEl) {
        if (fullMocks.length > 0 && secMocks.length > 0) {
            headerCountEl.innerHTML = `${allSorted.length} <span class="text-[10px] text-cyan-300 font-normal">(${fullMocks.length}F + ${secMocks.length}S)</span>`;
        } else if (secMocks.length > 0) {
            headerCountEl.innerHTML = `${secMocks.length} <span class="text-[10px] text-emerald-300 font-normal">Sectional</span>`;
        } else {
            headerCountEl.innerText = fullMocks.length.toString();
        }
    }

    // 2. Hydrate Header Avg & Max Scores: preserve full mock stats from being diluted by 15-min tests!
    if (fullMocks.length > 0) {
        const fullTotal = fullMocks.reduce((acc, m) => acc + parseFloat(m.score || 0), 0);
        const fullAvg = fullTotal / fullMocks.length;
        const fullMax = fullMocks.reduce((max, m) => Math.max(max, parseFloat(m.score || 0)), 0);

        if (headerAvgEl) headerAvgEl.innerText = fullAvg.toFixed(1);
        if (headerMaxEl) headerMaxEl.innerText = fullMax.toFixed(1);

        const gap = fullAvg - cutoffScore;
        if (headerGapEl) {
            if (gap >= 0) {
                headerGapEl.innerText = `Cutoff Cleared (+${gap.toFixed(1)})`;
                headerGapEl.className = "text-emerald-400 font-extrabold";
            } else {
                headerGapEl.innerText = `Deficit: ${gap.toFixed(1)} pts`;
                headerGapEl.className = "text-rose-400 font-extrabold";
            }
        }

        const avgCardEl = document.getElementById("metric-avg-score");
        const maxCardEl = document.getElementById("metric-max-score");
        if (avgCardEl) avgCardEl.innerText = fullAvg.toFixed(1);
        if (maxCardEl) maxCardEl.innerText = fullMax.toFixed(1);
    } else if (secMocks.length > 0) {
        // Only sectionals logged so far
        const avgSecPct = Math.round(secMocks.reduce((acc, m) => acc + ((m.score / (m.sectionMax || 50)) * 100), 0) / secMocks.length);
        const topSec = secMocks.reduce((max, m) => Math.max(max, parseFloat(m.score || 0)), 0);

        if (headerAvgEl) headerAvgEl.innerText = `${avgSecPct}%`;
        if (headerMaxEl) headerMaxEl.innerText = topSec.toFixed(1);
        if (headerGapEl) {
            headerGapEl.innerText = `${secMocks.length} Drills Done`;
            headerGapEl.className = "text-teal-300 font-extrabold";
        }

        const avgCardEl = document.getElementById("metric-avg-score");
        const maxCardEl = document.getElementById("metric-max-score");
        if (avgCardEl) avgCardEl.innerText = `${avgSecPct}%`;
        if (maxCardEl) maxCardEl.innerText = topSec.toFixed(1);
    }

    if (headerAccEl) headerAccEl.innerText = `${avgAccuracy}%`;
    const accCardEl = document.getElementById("metric-avg-accuracy");
    if (accCardEl) accCardEl.innerText = `${avgAccuracy}%`;

    // 3. Filter for active Trendline & Table view
    let targetSet = allSorted;
    if (mockTypeFilter === 'full') targetSet = fullMocks;
    else if (mockTypeFilter === 'sectional') targetSet = secMocks;

    let displayMocks = targetSet;
    if (mockTimeFilter === 'last5') displayMocks = targetSet.slice(-5);
    else if (mockTimeFilter === 'last10') displayMocks = targetSet.slice(-10);

    // 4. Smart Trajectory Diagnostics Banner
    if (diagnosticTextEl) {
        if (mockTypeFilter === 'sectional') {
            if (secMocks.length === 0) {
                diagnosticTextEl.innerHTML = "No sectional drills logged yet. Switch to <strong class='text-cyan-300'>Sectional / Mini</strong> mode on the left to record 15-minute speed drills!";
            } else {
                const latest = secMocks[secMocks.length - 1];
                const meta = SECTION_METADATA[latest.section || 'quant'] || SECTION_METADATA.quant;
                const pct = Math.round((latest.score / (latest.sectionMax || 50)) * 100);
                diagnosticTextEl.innerHTML = `⚡ <strong class="text-emerald-400">Sectional Drill Velocity:</strong> Latest test in <strong class="text-white">${meta.shortName}</strong> scored <strong class="text-cyan-300">${latest.score}/${latest.sectionMax || 50} (${pct}%)</strong>. Consistent mini mocks build lightning question-selection speed.`;
            }
        } else if (mockTypeFilter === 'full') {
            if (fullMocks.length === 0) {
                diagnosticTextEl.innerHTML = "No full-length mock tests logged yet. Log a full mock test to generate exam cutoff predictions.";
            } else if (fullMocks.length === 1) {
                const single = fullMocks[0];
                const diff = single.score - cutoffScore;
                diagnosticTextEl.innerHTML = `Baseline logged at <strong class="text-white">${single.score} marks</strong> (${diff >= 0 ? '+' + diff.toFixed(1) + ' above' : Math.abs(diff).toFixed(1) + ' pts below'} cutoff). Log 2+ mocks to chart trajectory.`;
            } else {
                const latest = fullMocks[fullMocks.length - 1];
                const prev = fullMocks[fullMocks.length - 2];
                const delta = latest.score - prev.score;
                const diff = latest.score - cutoffScore;
                if (latest.score >= cutoffScore) {
                    diagnosticTextEl.innerHTML = `🚀 <strong class="text-emerald-400">Peak Readiness Zone:</strong> Latest mock scored <strong class="text-white">${latest.score} marks</strong> (+${diff.toFixed(1)} over cutoff). Sustained stamina confirmed.`;
                } else if (delta > 0) {
                    diagnosticTextEl.innerHTML = `📈 <strong class="text-cyan-300">Positive Momentum:</strong> Scored <strong class="text-emerald-400">+${delta.toFixed(1)} pts</strong> over previous test. Within <strong class="text-amber-300">${Math.abs(diff).toFixed(1)} pts</strong> of qualifying threshold.`;
                } else {
                    diagnosticTextEl.innerHTML = `⚠️ <strong class="text-rose-400">Variance Alert:</strong> Score dipped by <strong class="text-rose-400">${Math.abs(delta).toFixed(1)} pts</strong>. Review mistake notes and practice targeted speed drills to rebound.`;
                }
            }
        } else {
            // 'all'
            diagnosticTextEl.innerHTML = `🎯 <strong class="text-cyan-300">Holistic Performance:</strong> Tracking <strong class="text-white">${fullMocks.length} Full Mock${fullMocks.length === 1 ? '' : 's'}</strong> and <strong class="text-emerald-300">${secMocks.length} Sectional Drill${secMocks.length === 1 ? '' : 's'}</strong>. Sectional scores automatically strengthen your subject benchmarks below!`;
        }
    }

    // 5. Render SVG Chart with displayMocks
    renderSvgMockChart(displayMocks);

    // 6. Mock History Table (Newest first)
    if (tbody) {
        if (displayMocks.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-8 text-center text-xs text-gray-500">
                        No records match the active filter (${mockTypeFilter === 'sectional' ? 'Sectional Mocks' : 'Full Mocks'}).
                    </td>
                </tr>
            `;
        } else {
            const reversed = [...displayMocks].reverse();
            let tableHtml = "";
            reversed.forEach(m => {
                const isSec = m.mockType === 'sectional';
                const secMeta = isSec ? (SECTION_METADATA[m.section || 'quant'] || SECTION_METADATA.quant) : null;
                const scoreLimit = isSec ? (m.sectionMax || 50) : maxTotal;
                const scorePct = Math.round((m.score / scoreLimit) * 100);
                const scoreColor = scorePct >= 70 ? "text-emerald-400" : (scorePct >= 50 ? "text-cyan-400" : "text-amber-400");

                let breakdownBadge = "";
                if (isSec) {
                    breakdownBadge = `
                        <span class="inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-inner">
                            <i class="fa-solid ${secMeta.icon} text-[8px]"></i>
                            <span>${secMeta.shortName}</span>
                        </span>
                    `;
                } else {
                    const bd = m.breakdown || {};
                    const hasBd = (bd.quant > 0 || bd.reasoning > 0 || bd.english > 0 || bd.ga > 0);
                    breakdownBadge = hasBd ? `
                        <div class="inline-flex items-center gap-1 text-[10px] font-mono bg-slate-900 border border-white/10 px-2 py-0.5 rounded-lg text-gray-300 shadow-inner">
                            <span class="text-cyan-400 font-bold" title="Quant">${bd.quant||0}</span>
                            <span class="text-gray-600">/</span>
                            <span class="text-indigo-400 font-bold" title="Reasoning">${bd.reasoning||0}</span>
                            <span class="text-gray-600">/</span>
                            <span class="text-emerald-400 font-bold" title="English">${bd.english||0}</span>
                            <span class="text-gray-600">/</span>
                            <span class="text-amber-400 font-bold" title="GA">${bd.ga||0}</span>
                        </div>
                    ` : `<span class="bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 px-1.5 py-0.5 rounded text-[9px] font-black uppercase">FULL</span>`;
                }

                tableHtml += `
                    <tr onclick="window.openMockDetailModal('${m.id}')" class="hover:bg-white/5 cursor-pointer transition group" title="Click to inspect test telemetry, mistakes & weak topics">
                        <td class="px-3 py-2.5 text-gray-400 text-[11px] whitespace-nowrap">
                            <div class="flex items-center gap-1.5">
                                <i class="fa-regular fa-calendar text-gray-500 text-[10px]"></i>
                                <span>${formatDateReadable(m.date)}</span>
                            </div>
                        </td>
                        <td class="px-3 py-2.5">
                            <div class="flex items-center gap-1.5">
                                ${isSec ? `<span class="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">SEC</span>` : `<span class="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">FULL</span>`}
                                <span class="font-bold text-white text-xs leading-snug truncate max-w-[160px] sm:max-w-xs">${escapeHTML(m.name)}</span>
                            </div>
                            <div class="flex items-center gap-2 mt-0.5 text-[10px]">
                                <span class="text-gray-400"><strong class="text-gray-500 font-bold uppercase">Rank:</strong> ${escapeHTML(m.rank || 'N/A')}</span>
                                ${m.accuracy != null ? `<span class="bg-purple-500/15 border border-purple-500/30 text-purple-300 px-1.5 py-0.2 rounded font-bold text-[9px]">${m.accuracy}% Acc</span>` : ''}
                            </div>
                        </td>
                        <td class="px-3 py-2.5 whitespace-nowrap">
                            <span class="font-heading font-black text-sm ${scoreColor}">${m.score}</span>
                            <span class="text-[9px] text-gray-500 font-bold"> / ${scoreLimit}</span>
                        </td>
                        <td class="px-3 py-2.5 text-center whitespace-nowrap">
                            ${breakdownBadge}
                        </td>
                        <td class="px-3 py-2.5 text-right whitespace-nowrap">
                            <div class="flex items-center justify-end gap-1.5" onclick="event.stopPropagation()">
                                <button class="w-7 h-7 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 transition flex items-center justify-center cursor-pointer text-xs" title="View Full Telemetry & Mistakes" onclick="window.openMockDetailModal('${m.id}')">
                                    <i class="fa-solid fa-eye"></i>
                                </button>
                                <button class="w-7 h-7 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 transition flex items-center justify-center cursor-pointer text-xs" title="Edit Test Record" onclick="window.editMock('${m.id}')">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button class="w-7 h-7 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition flex items-center justify-center cursor-pointer text-xs" title="Delete Test Record" onclick="window.deleteMock('${m.id}')">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = tableHtml;
        }
    }

    renderMockInspectorHud(displayMocks[displayMocks.length - 1], displayMocks);
    renderTrajectoryDiagnostics(allSorted, fullMocks, secMocks);
    renderSectionalBenchmarks();
    renderRevisionRadar();
}

async function deleteMock(mockId) {
    let confirmed = false;
    if (window.showConfirm) {
        confirmed = await window.showConfirm("Delete Test Record", "Are you sure you want to delete this test record?");
    } else {
        confirmed = confirm("Delete this test record?");
    }
    if (!confirmed) return;

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
    if (window.showToast) window.showToast("Test record deleted successfully", "error");
}

function editMock(mockId) {
    const mock = appState.mocks.find(m => m.id === mockId);
    if (!mock) return;

    editingMockId = mockId;
    const isSectional = mock.mockType === 'sectional';

    // Update Form Title and Button text
    const formHeader = document.getElementById("mock-form-header");
    if (formHeader) {
        formHeader.innerHTML = `<span class="text-cyan-400"><i class="fa-solid fa-pen-to-square mr-1"></i> Edit ${isSectional ? 'Sectional' : 'Mock'}: ${escapeHTML(mock.name)}</span>`;
    }
    const submitBtn = document.getElementById("mock-submit-btn");
    if (submitBtn) {
        submitBtn.innerHTML = `<i class="fa-solid fa-floppy-disk mr-1"></i> Update Record`;
    }

    // Show Cancel button next to Save button
    const cancelBtn = document.getElementById("mock-cancel-edit-btn");
    if (cancelBtn) cancelBtn.classList.remove("hidden");

    // Activate entry mode
    setMockEntryType(isSectional ? 'sectional' : 'full');

    // Fill in common form values
    document.getElementById("mock-name").value = mock.name;
    document.getElementById("mock-date").value = formatDateDMY(mock.date);
    document.getElementById("mock-accuracy").value = mock.accuracy || "";
    document.getElementById("mock-rank").value = mock.rank === "N/A" ? "" : mock.rank;
    document.getElementById("mock-notes").value = mock.notes || "";

    if (isSectional) {
        selectSectionalSubject(mock.section || 'quant');
        const secScoreInput = document.getElementById("mock-sectional-score");
        const secMaxInput = document.getElementById("mock-sectional-max");
        if (secScoreInput) secScoreInput.value = mock.score;
        if (secMaxInput) secMaxInput.value = mock.sectionMax || 50;
    } else {
        const bd = mock.breakdown || {};
        document.getElementById("score-quant").value = bd.quant || "";
        document.getElementById("score-reasoning").value = bd.reasoning || "";
        document.getElementById("score-english").value = bd.english || "";
        document.getElementById("score-ga").value = bd.ga || "";
        const compEl = document.getElementById("score-computer");
        if (compEl) compEl.value = bd.computer || "";

        // Trigger calculated score refresh
        const totalScoreInput = document.getElementById("mock-score");
        if (totalScoreInput) totalScoreInput.value = mock.score;
        const displayScore = document.getElementById("mock-score-display");
        if (displayScore) {
            const maxTotal = (appState.examTier === 2) ? 390 : 200;
            displayScore.innerText = `${mock.score.toFixed(2)} / ${maxTotal}`;
        }
    }

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
        formHeader.innerHTML = `<i class="fa-solid fa-pen-ruler mr-1.5 text-cyan-400"></i> Log Test Score`;
    }
    const submitBtn = document.getElementById("mock-submit-btn");
    if (submitBtn) {
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-plus mr-1"></i> Save Record`;
    }

    // Hide Cancel button
    const cancelBtn = document.getElementById("mock-cancel-edit-btn");
    if (cancelBtn) cancelBtn.classList.add("hidden");

    // Reset form
    const mockForm = document.getElementById("form-mock");
    if (mockForm) mockForm.reset();

    setMockEntryType('full');

    // Reset custom widget
    selectedWeakTopicIds = [];
    renderSelectedWeakTags();
    const searchInput = document.getElementById("mock-weak-search");
    if (searchInput) searchInput.value = "";

    // Reset date to today
    const mockDateInput = document.getElementById("mock-date");
    if (mockDateInput) {
        mockDateInput.value = formatDateDMY(new Date());
    }
    
    const displayScore = document.getElementById("mock-score-display");
    if (displayScore) {
        const maxTotal = (appState.examTier === 2) ? 390 : 200;
        displayScore.innerText = `0.00 / ${maxTotal}`;
    }
}

// Bind to window scope explicitly
window.editMock = editMock;
window.cancelMockEdit = cancelMockEdit;
window.deleteMock = deleteMock;

// --- Smooth Catmull-Rom / Cubic Bezier Path Interpolation Helper ---
function getSmoothSvgPath(pts) {
    if (!pts || pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    if (pts.length === 2) return `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} L ${pts[1].x.toFixed(1)} ${pts[1].y.toFixed(1)}`;

    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i === 0 ? 0 : i - 1];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2 >= pts.length ? pts.length - 1 : i + 2];

        const tension = 0.18;
        const cp1x = p1.x + (p2.x - p0.x) * tension;
        const cp1y = p1.y + (p2.y - p0.y) * tension;
        const cp2x = p2.x - (p3.x - p1.x) * tension;
        const cp2y = p2.y - (p3.y - p1.y) * tension;

        d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
}

// --- Deep Telemetry & Inspection Modal ---
let activeMockModalId = null;

function openMockDetailModal(mockId) {
    const modal = document.getElementById("modal-mock-detail");
    const card = document.getElementById("modal-mock-detail-card");
    if (!modal || !card) return;

    const mock = appState.mocks.find(m => m.id === mockId);
    if (!mock) return;

    activeMockModalId = mock.id;

    const isTier2 = appState.examTier === 2;
    const fullMax = isTier2 ? 390 : 200;
    const cutoffScore = isTier2 ? 290 : 140;
    const isSec = mock.mockType === 'sectional';
    const scoreLimit = isSec ? (mock.sectionMax || 50) : fullMax;
    const pct = Math.round((mock.score / scoreLimit) * 100);
    const secMeta = isSec ? (SECTION_METADATA[mock.section || 'quant'] || SECTION_METADATA.quant) : null;

    // Cutoff comparison
    const targetVal = isSec ? Math.round(scoreLimit * 0.8) : cutoffScore;
    const cutoffDiff = mock.score - targetVal;
    const isAhead = cutoffDiff >= 0;

    // Chronologically sorted list for momentum & navigation
    const sortedAll = [...appState.mocks].sort((a, b) => parseDateSafe(a.date) - parseDateSafe(b.date));
    const currentIndex = sortedAll.findIndex(m => m.id === mock.id);
    const totalCount = sortedAll.length;
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex >= 0 && currentIndex < totalCount - 1;

    let momentumHtml = '<span class="text-gray-400 font-medium">Baseline Test</span>';
    if (currentIndex > 0) {
        const prev = sortedAll[currentIndex - 1];
        const delta = mock.score - prev.score;
        if (delta > 0) {
            momentumHtml = `<span class="text-emerald-400 font-extrabold flex items-center gap-1"><i class="fa-solid fa-arrow-trend-up text-xs"></i> +${delta.toFixed(1)} pts</span>`;
        } else if (delta < 0) {
            momentumHtml = `<span class="text-rose-400 font-extrabold flex items-center gap-1"><i class="fa-solid fa-arrow-trend-down text-xs"></i> ${delta.toFixed(1)} pts</span>`;
        } else {
            momentumHtml = `<span class="text-gray-400 font-bold">±0.0 (Even)</span>`;
        }
    }

    // Is Personal Best
    const allSameType = sortedAll.filter(m => (m.mockType || 'full') === (mock.mockType || 'full'));
    const isPb = allSameType.length > 0 && mock.score === Math.max(...allSameType.map(m => parseFloat(m.score) || 0));

    // Sectional breakdown
    const bd = mock.breakdown || {};
    let breakdownHtml = "";
    if (isSec) {
        breakdownHtml = `
            <div class="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-3.5 space-y-2">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm border border-cyan-500/30">
                            <i class="fa-solid ${secMeta ? secMeta.icon : 'fa-bolt'}"></i>
                        </div>
                        <div>
                            <span class="text-xs font-bold text-white uppercase">${secMeta ? secMeta.fullName : 'Sectional Drill'}</span>
                            <span class="block text-[10px] text-gray-400">15-minute speed drill</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="font-heading font-black text-base text-cyan-300">${mock.score} <span class="text-gray-500 text-xs font-normal">/ ${scoreLimit}</span></span>
                    </div>
                </div>
                <div class="space-y-1">
                    <div class="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                        <div class="bg-cyan-400 h-full rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                    </div>
                    <div class="flex justify-between items-center text-[9px] font-mono">
                        <span class="text-gray-400">Attainment</span>
                        <span class="text-cyan-300 font-bold">${pct}%</span>
                    </div>
                </div>
            </div>
        `;
    } else {
        const sectionsData = [
            { 
                label: "Quantitative Aptitude", 
                key: "quant", 
                score: bd.quant || 0, 
                max: isTier2 ? 90 : 50,
                borderColor: "border-cyan-500/30",
                textColor: "text-cyan-400",
                barBg: "bg-cyan-400",
                icon: "fa-calculator"
            },
            { 
                label: "Reasoning & Intelligence", 
                key: "reasoning", 
                score: bd.reasoning || 0, 
                max: isTier2 ? 90 : 50,
                borderColor: "border-purple-500/30",
                textColor: "text-purple-400",
                barBg: "bg-purple-400",
                icon: "fa-brain"
            },
            { 
                label: "English Comprehension", 
                key: "english", 
                score: bd.english || 0, 
                max: isTier2 ? 135 : 50,
                borderColor: "border-emerald-500/30",
                textColor: "text-emerald-400",
                barBg: "bg-emerald-400",
                icon: "fa-pen-to-square"
            },
            { 
                label: "General Awareness", 
                key: "ga", 
                score: bd.ga || 0, 
                max: isTier2 ? 75 : 50,
                borderColor: "border-amber-500/30",
                textColor: "text-amber-400",
                barBg: "bg-amber-400",
                icon: "fa-earth-americas"
            },
            ...(isTier2 ? [{ 
                label: "Computer Knowledge", 
                key: "computer", 
                score: bd.computer || 0, 
                max: 60,
                borderColor: "border-blue-500/30",
                textColor: "text-blue-400",
                barBg: "bg-blue-400",
                icon: "fa-laptop-code"
            }] : [])
        ];

        breakdownHtml = `
            <div class="space-y-2">
                <span class="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">Sectional Breakdown</span>
                <div class="grid grid-cols-2 gap-2">
                    ${sectionsData.map(s => {
                        const secPct = Math.min(100, Math.round((s.score / s.max) * 100));
                        return `
                            <div class="bg-slate-950/80 border ${s.borderColor} rounded-xl p-2.5 space-y-1.5 hover:border-opacity-60 transition">
                                <div class="flex items-center justify-between gap-1.5">
                                    <div class="flex items-center gap-1.5 min-w-0">
                                        <i class="fa-solid ${s.icon} ${s.textColor} text-[10px] shrink-0"></i>
                                        <span class="text-[10px] font-bold text-gray-200 truncate">${s.label}</span>
                                    </div>
                                    <span class="font-heading font-black text-xs text-white shrink-0">${s.score} <span class="text-gray-500 text-[9px] font-normal">/ ${s.max}</span></span>
                                </div>
                                <div class="space-y-0.5">
                                    <div class="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-white/5">
                                        <div class="${s.barBg} h-full rounded-full transition-all duration-500" style="width: ${secPct}%"></div>
                                    </div>
                                    <div class="flex justify-between items-center text-[8.5px] text-gray-400 font-mono">
                                        <span>Attainment</span>
                                        <span class="${s.textColor} font-bold">${secPct}%</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // Flagged weak topics inside one contained block
    const weakIds = mock.weakTopicIds || (mock.weakTopicId ? [mock.weakTopicId] : []);
    let weakTopicsHtml = "";
    if (weakIds.length > 0) {
        weakTopicsHtml = `
            <div class="bg-slate-950/80 border border-rose-500/20 rounded-2xl p-3 space-y-2">
                <div class="flex items-center justify-between">
                    <span class="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                        <i class="fa-solid fa-triangle-exclamation text-xs"></i> Flagged Weak Topics (${weakIds.length})
                    </span>
                    <span class="text-[9px] text-gray-500 font-mono">1-click jump to syllabus</span>
                </div>
                <div class="space-y-2 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                    ${weakIds.map(id => {
                        const details = getSubtopicDetails(id);
                        const name = details ? details.name : id;
                        const subj = details ? details.subject : 'General';
                        return `
                            <div class="bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/30 rounded-xl p-2.5 space-y-1 transition">
                                <div class="flex items-center justify-between gap-2">
                                    <span class="text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                        ${escapeHTML(subj)}
                                    </span>
                                    <button type="button" onclick="closeMockDetailModal(); window.jumpToSyllabusTopic('${id}')" class="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95">
                                        <span>Revise</span>
                                        <i class="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
                                    </button>
                                </div>
                                <div class="text-xs font-bold text-white leading-snug break-words">
                                    ${escapeHTML(name)}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // Mistake Notes
    let notesHtml = "";
    if (mock.notes && mock.notes.trim()) {
        notesHtml = `
            <div class="space-y-1.5 pt-1 border-t border-white/10">
                <span class="text-[10px] font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                    <i class="fa-solid fa-clipboard-question text-xs"></i> Mistakes Analysis & Notes
                </span>
                <div class="bg-slate-950/90 border border-white/10 rounded-xl p-3 text-xs text-gray-300 leading-relaxed max-h-32 overflow-y-auto scrollbar-thin whitespace-pre-wrap font-sans">
                    ${escapeHTML(mock.notes)}
                </div>
            </div>
        `;
    }

    // Score attainment bar
    const progressWidth = Math.min(100, Math.round((mock.score / targetVal) * 100));

    card.innerHTML = `
        <!-- Modal Header with Interactive Navigation -->
        <div class="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
            <div class="space-y-1 min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase ${isSec ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}">
                        ${isSec ? `Sectional (${secMeta ? secMeta.shortName : 'Drill'})` : 'Full Mock'}
                    </span>
                    <span class="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                        <i class="fa-regular fa-calendar text-[9px] text-cyan-400"></i> ${formatDateReadable(mock.date)}
                    </span>
                    ${isPb ? '<span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-sm flex items-center gap-1">👑 Personal Best</span>' : ''}
                </div>
                <h3 class="font-heading font-black text-lg text-white truncate leading-snug">${escapeHTML(mock.name)}</h3>
            </div>

            <!-- Header Nav Controls (Paging Only) -->
            ${totalCount > 1 ? `
                <div class="flex items-center gap-1.5 shrink-0">
                    <button type="button" ${hasPrev ? `onclick="window.navigateMockModal(-1)"` : 'disabled'} class="w-8 h-8 rounded-xl ${hasPrev ? 'bg-white/10 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-400 cursor-pointer border border-white/10 active:scale-95' : 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed opacity-40'} flex items-center justify-center transition text-xs" title="Previous Test (Left Arrow or A)">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <span class="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-gray-300 select-none">
                        ${currentIndex >= 0 ? currentIndex + 1 : 1} / ${totalCount}
                    </span>
                    <button type="button" ${hasNext ? `onclick="window.navigateMockModal(1)"` : 'disabled'} class="w-8 h-8 rounded-xl ${hasNext ? 'bg-white/10 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-400 cursor-pointer border border-white/10 active:scale-95' : 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed opacity-40'} flex items-center justify-center transition text-xs" title="Next Test (Right Arrow or D)">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            ` : ''}
        </div>

        <!-- 3 KPI Telemetry Cards (Evenly Distributed) -->
        <div class="grid grid-cols-3 gap-2.5">
            <div class="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-3 text-center">
                <span class="text-[9px] font-extrabold uppercase text-gray-400 block mb-1">Score</span>
                <span class="font-heading font-black text-xl text-cyan-400">${mock.score}</span>
                <span class="text-[9px] text-gray-500 block">/ ${scoreLimit} (${pct}%)</span>
            </div>
            <div class="bg-slate-950/80 border border-white/10 rounded-2xl p-3 text-center">
                <span class="text-[9px] font-extrabold uppercase text-gray-400 block mb-1">Target Cutoff</span>
                <span class="font-heading font-black text-sm ${isAhead ? 'text-emerald-400' : 'text-rose-400'} block">
                    ${isAhead ? `+${cutoffDiff.toFixed(1)} Pts` : `${cutoffDiff.toFixed(1)} Pts`}
                </span>
                <span class="text-[9px] text-gray-500 block">${isAhead ? 'Qualified' : 'Deficit'}</span>
            </div>
            <div class="bg-slate-950/80 border border-white/10 rounded-2xl p-3 text-center">
                <span class="text-[9px] font-extrabold uppercase text-gray-400 block mb-1">Accuracy</span>
                <span class="font-heading font-black text-xl text-purple-300">${mock.accuracy != null ? mock.accuracy + '%' : 'N/A'}</span>
                <span class="text-[9px] text-gray-500 block">Precision</span>
            </div>
        </div>

        <!-- Progress to Cutoff -->
        <div class="space-y-1 bg-slate-950/60 p-3 rounded-2xl border border-white/5">
            <div class="flex justify-between items-center text-[10px] font-bold">
                <span class="text-gray-400">Target Threshold Progress (${targetVal} pts cutoff)</span>
                <span class="${isAhead ? 'text-emerald-400' : 'text-amber-400'}">${progressWidth}% of Target</span>
            </div>
            <div class="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                <div class="${isAhead ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-cyan-500'} h-full rounded-full transition-all duration-500" style="width: ${progressWidth}%"></div>
            </div>
        </div>

        <!-- Sectional breakdown -->
        ${breakdownHtml}

        <!-- Weak topics -->
        ${weakTopicsHtml}

        <!-- Mistake review -->
        ${notesHtml}

        <!-- Footer Actions -->
        <div class="pt-2 border-t border-white/10">
            <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                    <button type="button" onclick="closeMockDetailModal(); window.editMock('${mock.id}')" class="px-3 py-2 rounded-xl text-xs font-bold text-cyan-300 hover:text-white bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95">
                        <i class="fa-solid fa-pen-to-square"></i>
                        <span>Edit Test</span>
                    </button>
                    <button type="button" onclick="closeMockDetailModal(); window.deleteMock('${mock.id}')" class="px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition cursor-pointer flex items-center gap-1.5 active:scale-95">
                        <i class="fa-solid fa-trash-can"></i>
                        <span>Delete</span>
                    </button>
                </div>
                <button type="button" onclick="closeMockDetailModal()" class="px-5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider text-gray-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 transition cursor-pointer active:scale-95">
                    Close
                </button>
            </div>
        </div>
    `;

    modal.classList.remove("hidden");
    requestAnimationFrame(() => {
        modal.classList.remove("opacity-0", "pointer-events-none");
        modal.classList.add("opacity-100", "pointer-events-auto");
        card.classList.remove("scale-95");
        card.classList.add("scale-100");
    });
}
window.openMockDetailModal = openMockDetailModal;

function navigateMockModal(direction) {
    if (!activeMockModalId) return;
    const sortedAll = [...appState.mocks].sort((a, b) => parseDateSafe(a.date) - parseDateSafe(b.date));
    const idx = sortedAll.findIndex(m => m.id === activeMockModalId);
    if (idx === -1) return;
    const targetIdx = idx + direction;
    if (targetIdx >= 0 && targetIdx < sortedAll.length) {
        openMockDetailModal(sortedAll[targetIdx].id);
    }
}
window.navigateMockModal = navigateMockModal;

function closeMockDetailModal() {
    activeMockModalId = null;
    const modal = document.getElementById("modal-mock-detail");
    const card = document.getElementById("modal-mock-detail-card");
    if (!modal) return;

    if (card) {
        card.classList.remove("scale-100");
        card.classList.add("scale-95");
    }
    modal.classList.remove("opacity-100", "pointer-events-auto");
    modal.classList.add("opacity-0", "pointer-events-none");
    setTimeout(() => {
        modal.classList.add("hidden");
    }, 200);
}
window.closeMockDetailModal = closeMockDetailModal;

// Safe stub for any legacy calls
function renderMockInspectorHud(mock, mocksList = []) {
    const hud = document.getElementById("mock-inspector-hud");
    if (!hud) return;
    hud.innerHTML = "";
}
window.renderMockInspectorHud = renderMockInspectorHud;

// Modal dismissal & keyboard navigation listener
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal-mock-detail");
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeMockDetailModal();
        });
    }
});

document.addEventListener("keydown", (e) => {
    const modal = document.getElementById("modal-mock-detail");
    if (!modal || modal.classList.contains("hidden") || !activeMockModalId) return;

    // Do not capture keys if typing in form inputs
    const targetTag = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : "";
    if (targetTag === "INPUT" || targetTag === "TEXTAREA" || targetTag === "SELECT") return;

    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        navigateMockModal(-1);
    } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        navigateMockModal(1);
    } else if (e.key === "Escape" || e.key === "x" || e.key === "X") {
        e.preventDefault();
        closeMockDetailModal();
    }
});

// --- Trajectory Forecasting & Diagnostics Stub (Removed banner from UI) ---
function renderTrajectoryDiagnostics() {
    // Diagnostic banner removed per user design request
}
window.renderTrajectoryDiagnostics = renderTrajectoryDiagnostics;

// --- Feature-Rich SVG Performance Graph Engine ---
function renderSvgMockChart(mocksList) {
    const svg = document.getElementById("analytics-svg-chart");
    if (!svg) return;

    const width = 760;
    const height = 220;
    const padL = 55;
    const padR = 35;
    const padT = 25;
    const padB = 35;
    const plotW = width - padL - padR; // 670
    const plotH = height - padT - padB; // 160
    const zeroY = height - padB; // 185

    const isTier2 = appState.examTier === 2;
    const fullMax = isTier2 ? 390 : 200;
    const fullCutoff = isTier2 ? 290 : 140;

    let chartMax = fullMax;
    let chartMin = 0;
    let cutoff = fullCutoff;
    let gridScores = [];

    if (mockMetricMode === 'percent' || mockMetricMode === 'subjects') {
        chartMax = 100;
        chartMin = 0;
        cutoff = isTier2 ? 74 : 70;
        gridScores = [25, 50, 75, 100];
    } else if (mockMetricMode === 'accuracy') {
        chartMin = 40;
        chartMax = 100;
        cutoff = 85;
        gridScores = [50, 65, 80, 100];
    } else {
        // 'score'
        if (mockTypeFilter === 'sectional') {
            const highestSec = (mocksList && mocksList.length > 0)
                ? Math.max(50, ...mocksList.map(m => m.sectionMax || 50))
                : 50;
            chartMax = highestSec;
            chartMin = 0;
            cutoff = Math.round(highestSec * 0.8);
            gridScores = [
                Math.round(highestSec * 0.25),
                Math.round(highestSec * 0.5),
                Math.round(highestSec * 0.75),
                highestSec
            ];
        } else {
            chartMax = fullMax;
            chartMin = 0;
            cutoff = fullCutoff;
            gridScores = isTier2 ? [100, 200, 300, 390] : [50, 100, 150, 200];
        }
    }

    const yScale = (v) => {
        const clamped = Math.max(chartMin, Math.min(chartMax, v));
        const ratio = (clamped - chartMin) / (chartMax - chartMin);
        return zeroY - (ratio * plotH);
    };

    let defsHtml = `
        <defs>
            <linearGradient id="chart-fill-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.32"/>
                <stop offset="70%" stop-color="#06b6d4" stop-opacity="0.06"/>
                <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.0"/>
            </linearGradient>
            <linearGradient id="qualified-zone-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.18"/>
                <stop offset="100%" stop-color="#10b981" stop-opacity="0.02"/>
            </linearGradient>
            <filter id="svg-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
    `;

    // 1. Qualified Target Zone Shading
    let zoneHtml = "";
    if (cutoff && cutoff <= chartMax && cutoff >= chartMin) {
        const cutoffY = yScale(cutoff);
        zoneHtml = `
            <rect x="${padL}" y="${padT}" width="${plotW}" height="${Math.max(0, cutoffY - padT)}" fill="url(#qualified-zone-grad)" rx="6" />
            <line x1="${padL}" y1="${cutoffY}" x2="${padL + plotW}" y2="${cutoffY}" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,4" />
            <text x="${padL + plotW - 6}" y="${cutoffY - 5}" fill="#34d399" font-size="8.5" font-family="monospace" font-weight="bold" text-anchor="end">
                Target Cutoff (${mockMetricMode === 'percent' || mockMetricMode === 'subjects' || mockMetricMode === 'accuracy' ? cutoff + '%' : cutoff + ' pts'})
            </text>
        `;
    }

    // 2. Y-Axis Grid Lines & Labels
    let gridHtml = "";
    gridScores.forEach(val => {
        const y = yScale(val);
        const labelText = (mockMetricMode === 'percent' || mockMetricMode === 'accuracy' || mockMetricMode === 'subjects') ? `${val}%` : val;
        gridHtml += `
            <line x1="${padL}" y1="${y}" x2="${padL + plotW}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-width="1" stroke-dasharray="2,2" />
            <text x="${padL - 8}" y="${y + 3}" fill="#94a3b8" font-size="8.5" font-family="monospace" font-weight="bold" text-anchor="end">${labelText}</text>
        `;
    });

    if (!mocksList || mocksList.length === 0) {
        svg.innerHTML = `
            ${defsHtml}
            ${gridHtml}
            <g>
                <text x="${width/2}" y="${height/2 - 5}" fill="#94a3b8" text-anchor="middle" font-size="12" font-weight="700">No mock records to chart</text>
                <text x="${width/2}" y="${height/2 + 15}" fill="#64748b" text-anchor="middle" font-size="9.5">Log tests using the form on the left</text>
            </g>
        `;
        return;
    }

    const count = mocksList.length;
    const points = [];

    mocksList.forEach((mock, idx) => {
        const x = count === 1 ? (padL + plotW / 2) : padL + (idx * (plotW / Math.max(count - 1, 1)));
        const isSec = mock.mockType === 'sectional';
        const scoreLimit = isSec ? (mock.sectionMax || 50) : fullMax;
        const pct = Math.min(100, Math.round((mock.score / scoreLimit) * 100));

        let plotVal = mock.score;
        if (mockMetricMode === 'percent') {
            plotVal = pct;
        } else if (mockMetricMode === 'accuracy') {
            plotVal = mock.accuracy != null ? parseFloat(mock.accuracy) : 0;
        }

        const y = yScale(plotVal);
        points.push({ x, y, plotVal, score: mock.score, pct, accuracy: mock.accuracy, isSec, scoreLimit, mock });
    });

    let curvesHtml = "";
    let nodesHtml = "";

    if (mockMetricMode === 'subjects') {
        // 4D Subject Curves (Quant, Reasoning, English, GA)
        const subColors = {
            quant: { stroke: "#f43f5e", name: "Quant", max: isTier2 ? 90 : 50 },
            reasoning: { stroke: "#fbbf24", name: "Reasoning", max: isTier2 ? 90 : 50 },
            english: { stroke: "#10b981", name: "English", max: isTier2 ? 135 : 50 },
            ga: { stroke: "#06b6d4", name: "GA", max: isTier2 ? 75 : 50 }
        };

        for (const subKey in subColors) {
            const meta = subColors[subKey];
            const subPts = [];
            points.forEach(pt => {
                const bd = pt.mock.breakdown || {};
                let subScore = 0;
                if (pt.mock.mockType === 'sectional') {
                    if ((pt.mock.section || 'quant') === subKey) {
                        subScore = (pt.mock.score / (pt.mock.sectionMax || meta.max)) * 100;
                    } else {
                        return; // Skip sectionals of other subjects
                    }
                } else {
                    subScore = bd[subKey] ? (bd[subKey] / meta.max) * 100 : 0;
                }
                const sy = yScale(subScore);
                subPts.push({ x: pt.x, y: sy, score: subScore });
            });

            if (subPts.length > 1) {
                const pathD = getSmoothSvgPath(subPts);
                curvesHtml += `<path d="${pathD}" fill="none" stroke="${meta.stroke}" stroke-width="2" stroke-linecap="round" opacity="0.85" />`;
            }
            subPts.forEach(pt => {
                nodesHtml += `<circle cx="${pt.x}" cy="${pt.y}" r="3" fill="#0f172a" stroke="${meta.stroke}" stroke-width="1.5" />`;
            });
        }

        // Legend for subjects
        curvesHtml += `
            <g transform="translate(${padL + 10}, ${padT + 12})">
                <circle cx="0" cy="0" r="4" fill="#f43f5e" /><text x="8" y="3" fill="#cbd5e1" font-size="8" font-weight="bold">Quant</text>
                <circle cx="55" cy="0" r="4" fill="#fbbf24" /><text x="63" y="3" fill="#cbd5e1" font-size="8" font-weight="bold">Reasoning</text>
                <circle cx="125" cy="0" r="4" fill="#10b981" /><text x="133" y="3" fill="#cbd5e1" font-size="8" font-weight="bold">English</text>
                <circle cx="180" cy="0" r="4" fill="#06b6d4" /><text x="188" y="3" fill="#cbd5e1" font-size="8" font-weight="bold">GA</text>
            </g>
        `;
    } else {
        // Standard Curve with Area Fill
        if (count > 1) {
            const pathD = getSmoothSvgPath(points);
            const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${zeroY} L ${points[0].x.toFixed(1)} ${zeroY} Z`;
            curvesHtml += `<path d="${areaD}" fill="url(#chart-fill-grad)" />`;
            curvesHtml += `<path d="${pathD}" fill="none" stroke="#22d3ee" stroke-width="2.5" stroke-linecap="round" filter="url(#svg-glow-filter)" />`;

            // 3-Test Moving Average Trendline (SMA)
            if (mockShowSma && count >= 3) {
                const smaPoints = points.map((pt, i) => {
                    const startIdx = Math.max(0, i - 2);
                    const slice = points.slice(startIdx, i + 1);
                    const avgVal = slice.reduce((acc, p) => acc + p.plotVal, 0) / slice.length;
                    return { x: pt.x, y: yScale(avgVal) };
                });
                const smaPathD = getSmoothSvgPath(smaPoints);
                curvesHtml += `
                    <path d="${smaPathD}" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,3" opacity="0.9" />
                `;
            }
        }

        // Find Personal Best index
        const allVals = points.map(p => p.plotVal);
        const maxVal = Math.max(...allVals);
        const pbIdx = allVals.indexOf(maxVal);

        // Nodes without transform/scale glitches
        points.forEach((pt, idx) => {
            const isPb = idx === pbIdx && count > 1;
            const isAbove = pt.plotVal >= cutoff;
            const pointColor = isAbove ? "#34d399" : (pt.isSec ? "#10b981" : "#22d3ee");
            const nodeLabel = (mockMetricMode === 'percent' || mockMetricMode === 'accuracy') ? `${Math.round(pt.plotVal)}%` : `${pt.plotVal}`;

            nodesHtml += `
                <g class="chart-point-node cursor-pointer" data-idx="${idx}" onclick="window.openMockDetailModal('${pt.mock.id}')" title="Click to inspect test telemetry, mistakes & weak topics">
                    <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="4.5" fill="#0f172a" stroke="${pointColor}" stroke-width="2" />
                    <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="1.5" fill="${pointColor}" />
                    <text x="${pt.x.toFixed(1)}" y="${(pt.y - 8).toFixed(1)}" fill="${pointColor}" font-size="8" font-family="monospace" font-weight="bold" text-anchor="middle">${nodeLabel}</text>
                    ${isPb ? `
                        <g transform="translate(${pt.x.toFixed(1)}, ${(pt.y - 18).toFixed(1)})">
                            <rect x="-18" y="-9" width="36" height="11" rx="3.5" fill="#f59e0b" opacity="0.95" />
                            <text x="0" y="-1" fill="#0f172a" font-size="7" font-weight="900" text-anchor="middle">👑 PB</text>
                        </g>
                    ` : ''}
                </g>
            `;
        });
    }

    // Interactive scrubber crosshair layer
    const scrubberGroup = `
        <g id="chart-scrubber-overlay" style="display:none; pointer-events:none;">
            <line id="scrubber-line" x1="0" y1="${padT}" x2="0" y2="${zeroY}" stroke="rgba(34, 211, 238, 0.4)" stroke-width="1.5" stroke-dasharray="3,3" />
            <circle id="scrubber-beacon-outer" cx="0" cy="0" r="9" fill="none" stroke="#22d3ee" stroke-width="1.5" opacity="0.75" />
            <circle id="scrubber-beacon-inner" cx="0" cy="0" r="4.5" fill="#22d3ee" stroke="#ffffff" stroke-width="1.5" />
        </g>
    `;

    // Full interactive overlay rect for smooth mouse scrubbing
    const trackerRect = `
        <rect id="chart-mouse-tracker" x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="transparent" style="cursor: pointer;" />
    `;

    svg.innerHTML = `
        ${defsHtml}
        ${zoneHtml}
        ${gridHtml}
        ${curvesHtml}
        ${nodesHtml}
        ${scrubberGroup}
        ${trackerRect}
    `;

    // Interactive scrubbing handlers
    const tracker = document.getElementById("chart-mouse-tracker");
    const overlay = document.getElementById("chart-scrubber-overlay");
    const sLine = document.getElementById("scrubber-line");
    const sOuter = document.getElementById("scrubber-beacon-outer");
    const sInner = document.getElementById("scrubber-beacon-inner");

    if (tracker && overlay && points.length > 0) {
        const handleScrub = (clientX) => {
            const rect = svg.getBoundingClientRect();
            const svgX = ((clientX - rect.left) / rect.width) * width;

            // Find nearest point
            let nearestPt = points[0];
            let minDist = Math.abs(points[0].x - svgX);
            for (let i = 1; i < points.length; i++) {
                const dist = Math.abs(points[i].x - svgX);
                if (dist < minDist) {
                    minDist = dist;
                    nearestPt = points[i];
                }
            }

            // Position crosshair & beacon
            overlay.style.display = "block";
            if (sLine) {
                sLine.setAttribute("x1", nearestPt.x.toFixed(1));
                sLine.setAttribute("x2", nearestPt.x.toFixed(1));
            }
            if (sOuter) {
                sOuter.setAttribute("cx", nearestPt.x.toFixed(1));
                sOuter.setAttribute("cy", nearestPt.y.toFixed(1));
            }
            if (sInner) {
                sInner.setAttribute("cx", nearestPt.x.toFixed(1));
                sInner.setAttribute("cy", nearestPt.y.toFixed(1));
            }
        };

        tracker.addEventListener("mousemove", (e) => {
            handleScrub(e.clientX);
        });

        tracker.addEventListener("mouseleave", () => {
            if (overlay) overlay.style.display = "none";
        });

        tracker.addEventListener("click", (e) => {
            const rect = svg.getBoundingClientRect();
            const svgX = ((e.clientX - rect.left) / rect.width) * width;
            let nearestPt = points[0];
            let minDist = Math.abs(points[0].x - svgX);
            for (let i = 1; i < points.length; i++) {
                const dist = Math.abs(points[i].x - svgX);
                if (dist < minDist) {
                    minDist = dist;
                    nearestPt = points[i];
                }
            }
            if (nearestPt && nearestPt.mock) {
                window.openMockDetailModal(nearestPt.mock.id);
            }
        });

        tracker.addEventListener("touchstart", (e) => {
            if (e.touches && e.touches[0]) handleScrub(e.touches[0].clientX);
        }, { passive: true });

        tracker.addEventListener("touchmove", (e) => {
            if (e.touches && e.touches[0]) handleScrub(e.touches[0].clientX);
        }, { passive: true });

        tracker.addEventListener("touchend", () => {
            if (overlay) overlay.style.display = "none";
        });
    }
}
window.renderSvgMockChart = renderSvgMockChart;

// --- Sectional Aggregates for Benchmarks ---
function getSectionalAggregates() {
    const isTier2 = appState.examTier === 2;
    const defs = isTier2 ? {
        quant: { name: "Quantitative Aptitude", icon: "fa-calculator", maxSec: 90, target: 75 },
        reasoning: { name: "General Intelligence & Reasoning", icon: "fa-brain", maxSec: 90, target: 75 },
        english: { name: "English Language & Comprehension", icon: "fa-pen-to-square", maxSec: 135, target: 110 },
        ga: { name: "General Awareness", icon: "fa-earth-americas", maxSec: 75, target: 45 },
        computer: { name: "Computer Knowledge", icon: "fa-laptop-code", maxSec: 60, target: 36 }
    } : {
        quant: { name: "Quantitative Aptitude", icon: "fa-calculator", maxSec: 50, target: 40 },
        reasoning: { name: "General Intelligence & Reasoning", icon: "fa-brain", maxSec: 50, target: 42 },
        english: { name: "English Language & Comprehension", icon: "fa-pen-to-square", maxSec: 50, target: 40 },
        ga: { name: "General Awareness", icon: "fa-earth-americas", maxSec: 50, target: 30 }
    };

    const result = {};
    for (const k in defs) {
        result[k] = {
            ...defs[k],
            sum: 0,
            count: 0,
            fullCount: 0,
            secCount: 0,
            avg: 0,
            pct: 0,
            targetPct: Math.round((defs[k].target / defs[k].maxSec) * 100),
            targetGap: 0
        };
    }

    (appState.mocks || []).forEach(m => {
        if (m.mockType === 'sectional') {
            const secKey = m.section || m.sectionalSubject || 'quant';
            if (result[secKey]) {
                const score = parseFloat(m.score);
                if (!isNaN(score)) {
                    result[secKey].sum += score;
                    result[secKey].count += 1;
                    result[secKey].secCount += 1;
                }
            }
        } else if (m.breakdown) {
            for (const k in defs) {
                const score = parseFloat(m.breakdown[k]);
                if (!isNaN(score) && score > 0) {
                    result[k].sum += score;
                    result[k].count += 1;
                    result[k].fullCount += 1;
                }
            }
        }
    });

    for (const k in result) {
        const item = result[k];
        if (item.count > 0) {
            item.avg = item.sum / item.count;
            item.pct = Math.min(100, Math.round((item.avg / item.maxSec) * 100));
            item.targetGap = item.avg - item.target;
        } else {
            item.avg = 0;
            item.pct = 0;
            item.targetGap = -item.target;
        }
    }

    return result;
}
window.getSectionalAggregates = getSectionalAggregates;

function renderSectionalBenchmarks() {
    const container = document.getElementById("sectional-bars-container");
    if (!container) return;

    if (appState.mocks.length === 0) {
        container.innerHTML = `
            <div class="text-center text-xs text-gray-500 py-6 border border-dashed border-white/5 rounded-2xl">
                <i class="fa-solid fa-chart-simple text-gray-600 text-lg mb-1.5 block"></i>
                Log mock tests or sectional drills to activate benchmark target gaps.
            </div>`;
        return;
    }

    const sections = getSectionalAggregates();
    let html = "";
    for (const key in sections) {
        const sec = sections[key];
        const avg = sec.avg;
        const pct = sec.pct;
        const targetGap = sec.targetGap;
        const targetPct = sec.targetPct;

        let colorClass = "text-rose-400";
        let barBgClass = "bg-gradient-to-r from-rose-600 to-rose-400";
        let statusBadge = "";

        if (avg === 0) {
            statusBadge = `<span class="text-[9px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">No Data</span>`;
        } else if (targetGap >= 0) {
            colorClass = "text-emerald-400";
            barBgClass = "bg-gradient-to-r from-teal-500 to-emerald-400";
            statusBadge = `<span class="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1"><i class="fa-solid fa-check"></i> +${targetGap.toFixed(1)} Ahead</span>`;
        } else {
            colorClass = pct >= 60 ? "text-amber-400" : "text-rose-400";
            barBgClass = pct >= 60 ? "bg-gradient-to-r from-amber-500 to-yellow-400" : "bg-gradient-to-r from-rose-600 to-rose-400";
            statusBadge = `<span class="text-[9px] font-extrabold ${pct >= 60 ? 'text-amber-400 bg-amber-500/15 border-amber-500/30' : 'text-rose-400 bg-rose-500/15 border-rose-500/30'} border px-2 py-0.5 rounded-full">${Math.abs(targetGap).toFixed(1)} pts to Target</span>`;
        }

        let attemptsDetail = `${sec.count} tests`;
        if (sec.fullCount > 0 && sec.secCount > 0) {
            attemptsDetail = `${sec.count} tests (${sec.fullCount} Full, ${sec.secCount} Sec)`;
        } else if (sec.secCount > 0) {
            attemptsDetail = `${sec.secCount} Sectional Drills`;
        } else if (sec.fullCount > 0) {
            attemptsDetail = `${sec.fullCount} Full Mocks`;
        }

        html += `
            <div class="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-white/5 hover:border-white/10 transition">
                <div class="flex items-center justify-between text-xs">
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px] text-gray-400">
                            <i class="fa-solid ${sec.icon}"></i>
                        </div>
                        <span class="text-white font-bold">${sec.name}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        ${statusBadge}
                        <span class="font-heading font-black ${colorClass}">${avg.toFixed(1)} <span class="text-gray-500 font-bold text-[10px]">/ ${sec.maxSec}</span></span>
                    </div>
                </div>
                <div class="relative w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-white/5 shadow-inner">
                    <div class="${barBgClass} h-full rounded-full transition-all duration-700 shadow-sm" style="width: ${pct}%"></div>
                    <!-- Target benchmark needle marker -->
                    <div class="absolute top-0 bottom-0 w-0.5 bg-white/40 z-10" style="left: ${targetPct}%" title="Target: ${sec.target}/${sec.maxSec}"></div>
                </div>
                <div class="flex justify-between items-center text-[9px] text-gray-500 font-mono">
                    <span>${attemptsDetail} &bull; Avg: ${avg.toFixed(1)}</span>
                    <span class="text-gray-400 font-bold">Cutoff Target: ${sec.target}/${sec.maxSec} (${targetPct}%)</span>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}

function renderRevisionRadar() {
    const container = document.getElementById("weak-topics-radar");
    const badgeEl = document.getElementById("radar-count-badge");
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

    if (badgeEl) {
        badgeEl.innerText = `${weakIds.length} Topic${weakIds.length === 1 ? '' : 's'}`;
        if (weakIds.length === 0) {
            badgeEl.className = "px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400";
        } else {
            badgeEl.className = "px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-rose-500/15 border border-rose-500/30 text-rose-400";
        }
    }

    if (weakIds.length === 0) {
        container.innerHTML = `
            <div class="text-center text-xs text-gray-400 py-8 border border-dashed border-emerald-500/20 bg-emerald-950/10 rounded-2xl flex flex-col items-center gap-2">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-base">
                    <i class="fa-solid fa-square-check"></i>
                </div>
                <span class="font-bold text-white text-xs">No Weak Topics Flagged!</span>
                <span class="text-[10px] text-gray-500">All tests operating within safe parameters or resolved.</span>
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
            if (details) break;
        }

        if (details) {
            const count = counts[id];
            const studySubtopicId = window.findStudyNoteForSyllabus ? window.findStudyNoteForSyllabus(id) : id;
            
            // Query syllabus mastery status from appState.flags
            const flags = (appState.flags && appState.flags[id]) || {};
            const isLearned = !!flags.learned;
            const isPracticed = !!flags.practiced;
            const isMastered = !!flags.mastered;

            let syllabusPill = '';
            if (isMastered) {
                syllabusPill = `<span class="text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1"><i class="fa-solid fa-crown text-[8px]"></i> Mastered</span>`;
            } else if (isPracticed) {
                syllabusPill = `<span class="text-[9px] font-black uppercase tracking-wider text-blue-400 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded-md flex items-center gap-1"><i class="fa-solid fa-dumbbell text-[8px]"></i> Practiced</span>`;
            } else if (isLearned) {
                syllabusPill = `<span class="text-[9px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md flex items-center gap-1"><i class="fa-solid fa-book-open-reader text-[8px]"></i> Learned</span>`;
            } else {
                syllabusPill = `<span class="text-[9px] font-black uppercase tracking-wider text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md flex items-center gap-1"><i class="fa-regular fa-circle text-[8px]"></i> Untracked</span>`;
            }

            html += `
                <div class="bg-slate-950/80 border border-white/10 hover:border-cyan-500/30 rounded-xl p-3 flex items-center justify-between gap-3 transition shadow-inner">
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-1.5 flex-wrap mb-1">
                            <span class="text-[9px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/50 border border-cyan-500/30 px-2 py-0.5 rounded-md">${escapeHTML(details.subject)}</span>
                            <span class="text-[9px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <i class="fa-solid fa-flag text-[8px]"></i> Flagged ${count}x
                            </span>
                            ${syllabusPill}
                        </div>
                        <h4 class="text-xs font-bold text-white truncate">${escapeHTML(details.name)}</h4>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0">
                        <button type="button" onclick="window.jumpToSyllabusTopic('${id}')" class="px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 hover:border-purple-400 transition cursor-pointer flex items-center gap-1" title="Jump to Syllabus Topic">
                            <i class="fa-solid fa-list-check"></i>
                            <span class="hidden sm:inline">Syllabus</span>
                        </button>
                        <button type="button" onclick="window.renderStudyContent('${studySubtopicId}')" class="px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition cursor-pointer flex items-center gap-1" title="Open Study Notes">
                            <i class="fa-solid fa-book-open"></i>
                            <span class="hidden sm:inline">Revise</span>
                        </button>
                        <button type="button" onclick="window.drillWeakTopic('${id}', '${escapeHTML(details.name)}')" class="px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 hover:border-amber-400 transition cursor-pointer flex items-center gap-1" title="Practice in Speed Drills">
                            <i class="fa-solid fa-bolt"></i>
                            <span class="hidden sm:inline">Drill</span>
                        </button>
                        <button type="button" onclick="window.resolveWeakTopic('${id}')" class="px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 hover:border-emerald-400 transition cursor-pointer flex items-center gap-1" title="Mark as Mastered / Resolved">
                            <i class="fa-solid fa-check"></i>
                        </button>
                    </div>
                </div>
            `;
        }
    });

    container.innerHTML = html || `<div class="text-center text-xs text-gray-500 py-4">No weak topics resolved.</div>`;
}

// Action Center Handlers
function resolveWeakTopic(subtopicId) {
    if (appState.weakAlerts && appState.weakAlerts[subtopicId]) {
        delete appState.weakAlerts[subtopicId];
    }
    appState.mocks.forEach(m => {
        if (m.weakTopicIds) {
            m.weakTopicIds = m.weakTopicIds.filter(x => x !== subtopicId);
        }
        if (m.weakTopicId === subtopicId) {
            m.weakTopicId = "";
        }
    });
    saveStateToStorage();
    renderAll();
    renderMockAnalytics();
    if (window.showToast) {
        window.showToast("Weak topic resolved and cleared from radar!", "success");
    }
}
window.resolveWeakTopic = resolveWeakTopic;

function drillWeakTopic(subtopicId, topicName) {
    if (window.navigateToPage) {
        window.navigateToPage('page-speed');
    }
    if (window.showToast) {
        window.showToast(`Switched to Speed Drills for ${topicName || 'targeted practice'}!`, "info");
    }
}
window.drillWeakTopic = drillWeakTopic;

function exportMockReport() {
    if (!appState.mocks || appState.mocks.length === 0) {
        if (window.showToast) {
            window.showToast("No test records available to export.", "warning");
        } else {
            alert("No test records available to export.");
        }
        return;
    }

    const isTier2 = appState.examTier === 2;
    const tierName = isTier2 ? "Tier 2 (390 Marks)" : "Tier 1 (200 Marks)";
    const maxTotal = isTier2 ? 390 : 200;
    const cutoff = isTier2 ? 290 : 140;

    const fullMocks = appState.mocks.filter(m => (m.mockType || 'full') === 'full');
    const secMocks = appState.mocks.filter(m => m.mockType === 'sectional');

    const totalFullScore = fullMocks.reduce((acc, m) => acc + parseFloat(m.score || 0), 0);
    const maxFullScore = fullMocks.reduce((max, m) => Math.max(max, parseFloat(m.score || 0)), 0);
    const avgFullScore = fullMocks.length > 0 ? (totalFullScore / fullMocks.length).toFixed(1) : "0.0";

    const loggedAccuracies = appState.mocks.filter(m => m.accuracy != null);
    let avgAccuracy = "N/A";
    if (loggedAccuracies.length > 0) {
        const sumAcc = loggedAccuracies.reduce((acc, m) => acc + parseFloat(m.accuracy), 0);
        avgAccuracy = `${Math.round(sumAcc / loggedAccuracies.length)}%`;
    }

    let report = `# SSC CGL Conquest — Test Analytics Report\n`;
    report += `Generated: ${new Date().toLocaleString()}\n`;
    report += `Exam Target: ${tierName}\n\n`;
    report += `## Summary Metrics\n`;
    report += `- Total Tests Logged: ${appState.mocks.length} (${fullMocks.length} Full Mocks + ${secMocks.length} Sectional Drills)\n`;
    if (fullMocks.length > 0) {
        report += `- Average Full Mock Score: ${avgFullScore} / ${maxTotal}\n`;
        report += `- Highest Full Mock Score: ${maxFullScore.toFixed(1)} / ${maxTotal}\n`;
        report += `- Full Mock Target: ${cutoff} / ${maxTotal} (${parseFloat(avgFullScore) >= cutoff ? 'CLEARED (+' + (parseFloat(avgFullScore) - cutoff).toFixed(1) + ')' : 'GAP: -' + (cutoff - parseFloat(avgFullScore)).toFixed(1) + ' pts'})\n`;
    }
    if (secMocks.length > 0) {
        report += `- Total Sectional Drills: ${secMocks.length}\n`;
    }
    report += `- Overall Accuracy: ${avgAccuracy}\n\n`;

    report += `## Test History\n`;
    const sorted = [...appState.mocks].sort((a, b) => parseDateSafe(b.date) - parseDateSafe(a.date));
    sorted.forEach((m, idx) => {
        const isSec = m.mockType === 'sectional';
        const secMeta = isSec ? (SECTION_METADATA[m.section || 'quant'] || SECTION_METADATA.quant) : null;
        const typeTag = isSec ? `[SEC: ${secMeta.shortName}]` : `[FULL]`;
        const scoreMax = isSec ? (m.sectionMax || 50) : maxTotal;
        const bd = m.breakdown || {};
        report += `${idx + 1}. ${m.date} | ${typeTag} ${m.name} | Score: ${m.score}/${scoreMax} | Rank: ${m.rank || 'N/A'}`;
        if (m.accuracy != null) report += ` | Acc: ${m.accuracy}%`;
        if (!isSec && (bd.quant || bd.reasoning || bd.english || bd.ga)) {
            report += ` | (Q:${bd.quant||0} R:${bd.reasoning||0} E:${bd.english||0} G:${bd.ga||0})`;
        }
        if (m.notes) report += `\n   Notes: ${m.notes}`;
        report += `\n`;
    });

    const weakIds = Object.keys(appState.weakAlerts || {}).filter(k => appState.weakAlerts[k]);
    if (weakIds.length > 0) {
        report += `\n## Flagged Weak Topics (${weakIds.length})\n`;
        weakIds.forEach(id => {
            let topicDetails = null;
            for (const topic of SYLLABUS_DATA) {
                for (const sub of topic.subtopics) {
                    if (sub.id === id) {
                        topicDetails = { subject: topic.subject, name: sub.name };
                        break;
                    }
                }
            }
            if (topicDetails) {
                report += `- [${topicDetails.subject}] ${topicDetails.name}\n`;
            } else {
                report += `- Topic ID: ${id}\n`;
            }
        });
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(report).then(() => {
            if (window.showToast) {
                window.showToast("Analysis report copied to clipboard!", "success");
            }
            if (window.showCustomAlert) {
                window.showCustomAlert({
                    title: "Test Analytics Exported",
                    message: "A full summary report has been compiled and copied to your clipboard.",
                    detailsHtml: `
                        <div class="space-y-1.5 font-mono text-[11px] text-gray-300">
                            <div><strong class="text-cyan-400">Total Tests:</strong> ${appState.mocks.length} (${fullMocks.length} Full + ${secMocks.length} Sec)</div>
                            ${fullMocks.length > 0 ? `<div><strong class="text-teal-400">Avg Full Mock:</strong> ${avgFullScore} / ${maxTotal}</div>` : ''}
                            <div><strong class="text-purple-400">Avg Accuracy:</strong> ${avgAccuracy}</div>
                            <div><strong class="text-amber-400">Weak Topics:</strong> ${weakIds.length} flagged</div>
                        </div>
                    `,
                    type: "success",
                    icon: "fa-solid fa-clipboard-check"
                });
            }
        }).catch(() => {
            alert(report);
        });
    } else {
        alert(report);
    }
}
window.exportMockReport = exportMockReport;
