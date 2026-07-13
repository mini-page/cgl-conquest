// Modular Study Documentation & Search System
let studyCatalog = null;
let activeSubjectId = null;
let searchIndex = [];
let currentReadingSubtopic = null;
let progressStore = JSON.parse(localStorage.getItem("studyProgress") || "{}");

// Setup DOM content listeners
document.addEventListener("DOMContentLoaded", () => {
    initStudyPage();
    setupGlobalSearch();
    
    // Bind modal actions
    const starBtn = document.getElementById("btn-viewer-star");
    if (starBtn) starBtn.onclick = () => toggleViewerProgress("starred");
    
    const learnedBtn = document.getElementById("btn-viewer-learned");
    if (learnedBtn) learnedBtn.onclick = () => toggleViewerProgress("learned");
    
    const bookmarkBtn = document.getElementById("btn-viewer-bookmark");
    if (bookmarkBtn) bookmarkBtn.onclick = () => toggleViewerProgress("bookmarked");
    
    const closeBtn = document.getElementById("btn-viewer-close");
    if (closeBtn) closeBtn.onclick = closeStudyViewer;
    
    const prevBtn = document.getElementById("btn-viewer-prev");
    if (prevBtn) prevBtn.onclick = () => navigateViewer(-1);
    
    const nextBtn = document.getElementById("btn-viewer-next");
    if (nextBtn) nextBtn.onclick = () => navigateViewer(1);
    
    // Bind back grid buttons
    const backBtn = document.getElementById("btn-study-back-grid");
    if (backBtn) backBtn.onclick = backToSubjects;
    
    const backCustomBtn = document.getElementById("btn-study-custom-back");
    if (backCustomBtn) backCustomBtn.onclick = backToSubjects;
    
    // Setup modal outside clicks
    const modalViewer = document.getElementById("modal-study-viewer");
    if (modalViewer) {
        modalViewer.onclick = (e) => {
            if (e.target === modalViewer) {
                closeStudyViewer();
            }
        };
    }
});

// Helper to load chapter scripts dynamically (CORS-free for file:// protocol)
function loadChapterScript(filePath) {
    return new Promise((resolve, reject) => {
        const parts = filePath.split("/");
        const filename = parts[parts.length - 1];
        const subtopicId = filename.replace(".js", "");
        
        if (window.studyChapters && window.studyChapters[subtopicId]) {
            resolve();
            return;
        }
        
        const script = document.createElement("script");
        script.src = filePath;
        script.onload = () => {
            resolve();
            script.remove();
        };
        script.onerror = () => {
            reject(new Error("Failed to load script: " + filePath));
            script.remove();
        };
        document.head.appendChild(script);
    });
}

// Initialize dynamic subjects and index files
async function initStudyPage() {
    try {
        if (typeof window.studySubjects === "undefined") {
            throw new Error("Syllabus catalog window.studySubjects is undefined.");
        }
        
        studyCatalog = window.studySubjects;
        renderSubjectGrid(studyCatalog.subjects);
        
        // Build full-text search index asynchronously in background
        buildSearchIndex(studyCatalog.subjects);
    } catch (err) {
        console.error("Study Page Initialization Error:", err);
        const grid = document.getElementById("study-subject-grid");
        if (grid) {
            grid.innerHTML = `<div class="col-span-full text-center text-xs text-accentRose py-8"><i class="fa-solid fa-triangle-exclamation mr-1.5"></i> Error initializing Study catalog: ${err.message}</div>`;
        }
    }
}

// Background builder for global search index
async function buildSearchIndex(subjects) {
    searchIndex = [];
    const promises = [];
    
    subjects.forEach(subject => {
        subject.topics.forEach(topic => {
            topic.subtopics.forEach(subtopic => {
                promises.push(
                    loadChapterScript(subtopic.file)
                        .then(() => {
                            const text = window.studyChapters[subtopic.id] || "";
                            const meta = parseFrontmatter(text);
                            searchIndex.push({
                                subtopicId: subtopic.id,
                                subtopicName: subtopic.name,
                                subjectName: subject.name,
                                subjectId: subject.id,
                                topicName: topic.name,
                                topicId: topic.id,
                                file: subtopic.file,
                                difficulty: meta.difficulty || "medium",
                                roi: meta.roi || "high",
                                tags: meta.tags || [],
                                content: text
                            });
                        })
                        .catch(err => console.warn("Error indexing " + subtopic.id + ":", err))
                );
            });
        });
    });
    
    await Promise.all(promises);
    console.log(`Global Study Search Indexing Complete: ${searchIndex.length} subtopics loaded.`);
}

// Custom parser to extract frontmatter YAML lines
function parseFrontmatter(text) {
    const cleanText = text.trim();
    const meta = { tags: [] };
    if (!cleanText.startsWith("---")) return meta;
    
    const parts = cleanText.split("---");
    if (parts.length < 3) return meta;
    
    const lines = parts[1].split("\n");
    let currentKey = null;
    
    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        
        if (trimmed.startsWith("-")) {
            // Element of an active array/list
            if (currentKey === "tags") {
                meta.tags.push(trimmed.slice(1).trim());
            }
        } else {
            const colonIdx = trimmed.indexOf(":");
            if (colonIdx > 0) {
                const key = trimmed.slice(0, colonIdx).trim();
                let val = trimmed.slice(colonIdx + 1).trim();
                currentKey = key;
                
                if (val.startsWith("[") && val.endsWith("]")) {
                    // Inline array representation e.g. [percentage, ratio]
                    const inner = val.slice(1, -1);
                    meta[key] = inner.split(",").map(t => t.trim().replace(/^['"]|['"]$/g, ""));
                } else if (!val.startsWith("-") && val !== "") {
                    // Standard key-value
                    val = val.replace(/^['"]|['"]$/g, "");
                    meta[key] = val;
                }
            }
        }
    });
    
    return meta;
}

// Display main list of subject directories
function renderSubjectGrid(subjects) {
    const grid = document.getElementById("study-subject-grid");
    if (!grid) return;
    grid.innerHTML = "";
    
    subjects.forEach(sub => {
        const card = document.createElement("div");
        card.className = "cursor-pointer bg-bgCard border border-white/5 hover:border-accentCyan/30 hover:shadow-cyan-950/10 hover:shadow-lg p-5 rounded-2xl flex flex-col items-center justify-center gap-4 transition duration-300 transform hover:-translate-y-1 select-none text-center min-h-[140px]";
        card.innerHTML = `
            <span class="w-12 h-12 rounded-xl bg-accentCyan/10 text-accentCyan flex items-center justify-center text-xl">
                <i class="fa-solid ${sub.icon || 'fa-toolbox'}"></i>
            </span>
            <h3 class="font-heading font-extrabold text-xs text-white uppercase tracking-wider">${sub.name}</h3>
        `;
        card.onclick = () => showSubjectDetail(sub.id);
        grid.appendChild(card);
    });
    
    // Append Custom Notes & Mistakes Card (Mistake Book)
    const notesCard = document.createElement("div");
    notesCard.className = "cursor-pointer bg-bgCard border border-white/5 hover:border-accentPurple/30 hover:shadow-purple-950/10 hover:shadow-lg p-5 rounded-2xl flex flex-col items-center justify-center gap-4 transition duration-300 transform hover:-translate-y-1 select-none text-center min-h-[140px]";
    notesCard.innerHTML = `
        <span class="w-12 h-12 rounded-xl bg-accentPurple/10 text-accentPurple flex items-center justify-center text-xl">
            <i class="fa-solid fa-pen-to-square"></i>
        </span>
        <h3 class="font-heading font-extrabold text-xs text-white uppercase tracking-wider">Custom Notes & Mistakes</h3>
    `;
    notesCard.onclick = () => showCustomNotes();
    grid.appendChild(notesCard);
}

// View state for Study Notes Tracker
let studyState = {
    view: 'tree',
    search: '',
    sortBy: 'name',
    sortDir: 1,
    difficulty: '',
    roi: '',
    activeSubject: null,
    chapter: null,
    openDropdown: null
};

// Display detailed topic hierarchy accordion for selected subject
function showSubjectDetail(subjectId) {
    if (!studyCatalog) return;
    const subject = studyCatalog.subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    activeSubjectId = subjectId;
    studyState.activeSubject = subjectId;
    studyState.chapter = null; // reset drilldown
    
    document.getElementById("study-subject-grid").classList.add("hidden");
    document.getElementById("study-custom-notes-area").classList.add("hidden");
    
    const detailArea = document.getElementById("study-topic-area");
    detailArea.classList.remove("hidden");
    
    const titleEl = document.getElementById("study-active-subject-title");
    if (titleEl) {
        titleEl.innerHTML = `<i class="fa-solid ${subject.icon || 'fa-toolbox'} text-accentCyan mr-1.5"></i> ${subject.name}`;
    }
    
    renderStudyTrackerAll();
}

function initStudyToolbar() {
    // Setup view select dropdown HTML
    const viewWrap = document.getElementById("study-view-dropdown-wrap");
    if (viewWrap) {
        const viewIcons = { tree: '🌲', explorer: '📂', compact: '📝', grid: '🎴', kanban: '📋', table: '📊' };
        const viewNames = { tree: 'Tree View', explorer: 'Explorer', compact: 'Compact', grid: 'Grid', kanban: 'Kanban', table: 'Table' };
        const activeIcon = viewIcons[studyState.view] || '🌲';
        const activeName = viewNames[studyState.view] || 'Tree View';
        
        viewWrap.innerHTML = `
        <div class="relative" data-study-dd-wrap="view">
            <button data-study-dd-btn="view" class="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm border bg-teal/10 border-teal/40 text-teal hover:border-teal/60 transition">
                <span>${activeIcon}</span><span class="font-medium">${activeName}</span><span class="text-[9px] opacity-60">▼</span>
            </button>
            <div data-study-dd-panel="view" class="hidden dropdown-panel absolute right-0 mt-2 w-64 bg-panel border border-line rounded-2xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto scrollbar-thin">
                ${Object.keys(viewNames).map(vId => `
                    <button class="w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-2 hover:bg-white/5 transition font-semibold ${studyState.view === vId ? 'text-accentCyan bg-white/[0.03]' : 'text-gray-300'}" onclick="setStudyView('${vId}')">
                        <span>${viewIcons[vId]}</span><span>${viewNames[vId]}</span>
                    </button>
                `).join('')}
            </div>
        </div>`;
    }

    // Setup sort select dropdown HTML
    const sortWrap = document.getElementById("study-sort-dropdown-wrap");
    if (sortWrap) {
        sortWrap.innerHTML = `
        <div class="relative" data-study-dd-wrap="sort">
            <button data-study-dd-btn="sort" class="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm border bg-panel2 border-line text-zinc-300 hover:border-teal/40 transition">
                <span>↕️</span><span class="font-medium">Sort Order</span><span class="text-[9px] opacity-60">▼</span>
            </button>
            <div data-study-dd-panel="sort" class="hidden dropdown-panel absolute right-0 mt-2 w-56 bg-panel border border-line rounded-2xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto scrollbar-thin">
                ${[
                    { id: 'name', label: 'Alphabetical (A-Z)' },
                    { id: 'difficulty', label: 'Difficulty Level' },
                    { id: 'roi', label: 'ROI (Return on Investment)' }
                ].map(opt => `
                    <button class="w-full text-left p-2.5 rounded-xl text-xs hover:bg-white/5 transition font-semibold ${studyState.sortBy === opt.id ? 'text-accentCyan bg-white/[0.03]' : 'text-zinc-300'}" onclick="setStudySort('${opt.id}')">
                        ${opt.label}
                    </button>
                `).join('')}
            </div>
        </div>`;
    }

    // Bind dropdown click toggle behaviors
    document.querySelectorAll('[data-study-dd-btn]').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const id = btn.dataset.studyDdBtn;
            const panel = document.querySelector(`[data-study-dd-panel="${id}"]`);
            const isHidden = panel.classList.contains('hidden');
            
            // Close other study dropdowns
            document.querySelectorAll('[data-study-dd-panel]').forEach(p => p.classList.add('hidden'));
            
            if (isHidden) {
                panel.classList.remove('hidden');
                studyState.openDropdown = id;
            } else {
                panel.classList.add('hidden');
                studyState.openDropdown = null;
            }
        };
    });

    // Handle outside clicks to close dropdowns
    document.removeEventListener('click', handleStudyClickOutside);
    document.addEventListener('click', handleStudyClickOutside);

    // Bind search
    const searchInput = document.getElementById("study-search");
    if (searchInput) {
        searchInput.value = studyState.search;
        searchInput.oninput = () => {
            studyState.search = searchInput.value.trim().toLowerCase();
            renderStudyTrackerAll();
        };
    }
}

function handleStudyClickOutside(e) {
    if (studyState.openDropdown) {
        const wrap = document.querySelector(`[data-study-dd-wrap="${studyState.openDropdown}"]`);
        if (wrap && !wrap.contains(e.target)) {
            const panel = wrap.querySelector('[data-study-dd-panel]');
            if (panel) panel.classList.add('hidden');
            studyState.openDropdown = null;
        }
    }
}

function setStudyView(vId) {
    studyState.view = vId;
    renderStudyTrackerAll();
}

function setStudySort(sortId) {
    if (studyState.sortBy === sortId) {
        studyState.sortDir = -studyState.sortDir;
    } else {
        studyState.sortBy = sortId;
        studyState.sortDir = 1;
    }
    renderStudyTrackerAll();
}

function buildStudyFilterRow() {
    const filterRow = document.getElementById("study-filter-row");
    if (!filterRow) return;
    
    let html = "";
    
    // Add clear button if any filter is active
    if (studyState.difficulty || studyState.roi || studyState.chapter) {
        html += `
        <button class="px-2 py-1 rounded bg-accentRose/15 border border-accentRose/30 text-accentRose hover:bg-accentRose/20 text-[10px] font-bold uppercase transition" onclick="clearStudyFilters()">
            Clear Filters ×
        </button>`;
    }
    
    // Difficulty filters
    ['Easy', 'Moderate', 'Hard'].forEach(diff => {
        const active = studyState.difficulty === diff;
        html += `
        <button class="px-2.5 py-1 rounded-xl text-[10px] font-bold border transition ${active ? 'bg-accentCyan/10 border-accentCyan/40 text-accentCyan' : 'bg-panel border-line text-zinc-400 hover:border-accentCyan/30'}" onclick="toggleStudyDiffFilter('${diff}')">
            ${diff}
        </button>`;
    });
    
    // ROI filters
    ['High', 'Medium', 'Low'].forEach(roi => {
        const active = studyState.roi === roi;
        html += `
        <button class="px-2.5 py-1 rounded-xl text-[10px] font-bold border transition ${active ? 'bg-accentAmber/10 border-accentAmber/40 text-accentAmber' : 'bg-panel border-line text-zinc-400 hover:border-accentAmber/30'}" onclick="toggleStudyRoiFilter('${roi}')">
            ROI: ${roi}
        </button>`;
    });
    
    filterRow.innerHTML = html;
}

function clearStudyFilters() {
    studyState.difficulty = '';
    studyState.roi = '';
    studyState.chapter = null;
    renderStudyTrackerAll();
}

function toggleStudyDiffFilter(diff) {
    studyState.difficulty = (studyState.difficulty === diff) ? '' : diff;
    renderStudyTrackerAll();
}

function toggleStudyRoiFilter(roi) {
    studyState.roi = (studyState.roi === roi) ? '' : roi;
    renderStudyTrackerAll();
}

function getFilteredStudySubtopics() {
    if (!studyCatalog || !studyState.activeSubject) return [];
    
    const subject = studyCatalog.subjects.find(s => s.id === studyState.activeSubject);
    if (!subject) return [];
    
    // Gather all subtopics under this subject
    let items = [];
    subject.topics.forEach(topic => {
        topic.subtopics.forEach(sub => {
            // Find its indexed details from searchIndex if available
            const indexed = searchIndex.find(idx => idx.subtopicId === sub.id) || {};
            items.push({
                id: sub.id,
                name: sub.name,
                file: sub.file,
                topicId: topic.id,
                topicName: topic.name,
                subjectId: subject.id,
                subjectName: subject.name,
                difficulty: indexed.difficulty || 'medium',
                roi: indexed.roi || 'high',
                tags: indexed.tags || []
            });
        });
    });
    
    // Filter by search query
    if (studyState.search) {
        const q = studyState.search;
        items = items.filter(it => 
            it.name.toLowerCase().includes(q) || 
            it.topicName.toLowerCase().includes(q) ||
            it.tags.some(t => t.toLowerCase().includes(q))
        );
    }
    
    // Filter by Difficulty
    if (studyState.difficulty) {
        items = items.filter(it => it.difficulty.toLowerCase() === studyState.difficulty.toLowerCase());
    }
    
    // Filter by ROI
    if (studyState.roi) {
        items = items.filter(it => it.roi.toLowerCase() === studyState.roi.toLowerCase());
    }
    
    // Filter by active chapter (for drill-down)
    if (studyState.chapter) {
        items = items.filter(it => it.topicId === studyState.chapter);
    }
    
    // Sort items
    items.sort((a, b) => {
        let valA = a.name;
        let valB = b.name;
        
        if (studyState.sortBy === 'difficulty') {
            const weights = { easy: 1, medium: 2, moderate: 2, hard: 3 };
            valA = weights[a.difficulty.toLowerCase()] || 2;
            valB = weights[b.difficulty.toLowerCase()] || 2;
        } else if (studyState.sortBy === 'roi') {
            const weights = { low: 1, medium: 2, high: 3 };
            valA = weights[a.roi.toLowerCase()] || 2;
            valB = weights[b.roi.toLowerCase()] || 2;
        }
        
        if (typeof valA === 'string') {
            return studyState.sortDir * valA.localeCompare(valB);
        }
        return studyState.sortDir * (valA - valB);
    });
    
    return items;
}

function renderStudyTree(items) {
    // Group items by topic
    const groups = {};
    items.forEach(it => {
        if (!groups[it.topicId]) {
            groups[it.topicId] = { name: it.topicName, list: [] };
        }
        groups[it.topicId].list.push(it);
    });
    
    return `
    <div class="space-y-3">
        ${Object.keys(groups).map(topicId => {
            const gp = groups[topicId];
            return `
            <div class="border border-white/5 rounded-2xl overflow-hidden bg-white/2px">
                <div class="flex items-center justify-between p-4 bg-white/5 cursor-pointer font-heading font-extrabold text-xs text-white uppercase tracking-wider select-none border-b border-white/5">
                    <span>${gp.name}</span>
                    <span class="text-[10px] text-gray-500 font-mono">${gp.list.length} Notes</span>
                </div>
                <div class="divide-y divide-white/5">
                    ${gp.list.map(sub => `
                        <div class="flex items-center justify-between p-3.5 hover:bg-white/5 cursor-pointer transition select-none" onclick="openStudyViewer('${sub.id}')">
                            <div class="flex items-center gap-3">
                                <span class="text-xs text-gray-300 font-semibold">${sub.name}</span>
                                <div class="flex gap-1.5">
                                    <span class="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                        sub.difficulty.toLowerCase() === 'easy' ? 'bg-accentGreen/10 text-accentGreen border border-accentGreen/20' :
                                        sub.difficulty.toLowerCase() === 'hard' ? 'bg-accentRose/10 text-accentRose border border-accentRose/20' :
                                        'bg-accentAmber/10 text-accentAmber border border-accentAmber/20'
                                    }">${sub.difficulty}</span>
                                    <span class="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-white/5 text-gray-400 border border-white/5">${sub.roi} ROI</span>
                                </div>
                            </div>
                            <span class="text-[9px] text-gray-500 font-extrabold uppercase bg-white/2px px-2 py-0.5 border border-white/5 rounded-full hover:text-white transition">Read →</span>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }).join('')}
    </div>`;
}

function renderStudyExplorer(items) {
    if (studyState.chapter) {
        return `
        <div class="space-y-4">
            <div class="divide-y divide-white/5 bg-white/2px border border-white/5 rounded-2xl">
                ${items.map(sub => `
                    <div class="flex items-center justify-between p-3.5 hover:bg-white/5 cursor-pointer transition select-none" onclick="openStudyViewer('${sub.id}')">
                        <div class="flex items-center gap-3">
                            <span class="text-xs text-gray-300 font-semibold">${sub.name}</span>
                            <span class="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                sub.difficulty.toLowerCase() === 'easy' ? 'bg-accentGreen/10 text-accentGreen border border-accentGreen/20' :
                                sub.difficulty.toLowerCase() === 'hard' ? 'bg-accentRose/10 text-accentRose border border-accentRose/20' :
                                'bg-accentAmber/10 text-accentAmber border border-accentAmber/20'
                            }">${sub.difficulty}</span>
                        </div>
                        <span class="text-[9px] text-gray-500 font-extrabold uppercase bg-white/2px px-2 py-0.5 border border-white/5 rounded-full">Read →</span>
                    </div>
                `).join('')}
            </div>
        </div>`;
    }
    
    // Show folders of topics
    const topics = {};
    items.forEach(it => {
        topics[it.topicId] = { name: it.topicName, count: (topics[it.topicId]?.count || 0) + 1 };
    });
    
    return `
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        ${Object.keys(topics).map(tId => `
            <div class="cursor-pointer bg-white/2px border border-white/5 hover:border-accentCyan/30 p-4 rounded-xl flex items-center gap-3 hover:bg-white/5 transition" onclick="setStudyExplorerChapter('${tId}')">
                <span class="text-2xl text-accentCyan">📂</span>
                <div class="truncate">
                    <h5 class="text-xs font-bold text-gray-200 truncate">${topics[tId].name}</h5>
                    <span class="text-[9px] text-gray-500 font-mono">${topics[tId].count} subtopics</span>
                </div>
            </div>
        `).join('')}
    </div>`;
}

function renderStudyExplorerBreadcrumb() {
    const breadcrumbEl = document.getElementById("study-breadcrumb");
    if (!breadcrumbEl) return;
    
    if (studyState.chapter) {
        const subject = studyCatalog.subjects.find(s => s.id === studyState.activeSubject);
        const topic = subject.topics.find(t => t.id === studyState.chapter);
        breadcrumbEl.innerHTML = `
            <span class="cursor-pointer hover:text-white" onclick="setStudyExplorerChapter(null)">${subject.name}</span>
            <span class="text-gray-600 mx-1.5">/</span>
            <span class="text-white font-bold">${topic.name}</span>
        `;
        breadcrumbEl.classList.remove("hidden");
    } else {
        breadcrumbEl.classList.add("hidden");
    }
}

function setStudyExplorerChapter(tId) {
    studyState.chapter = tId;
    renderStudyTrackerAll();
}

function renderStudyCompact(items) {
    return `
    <div class="bg-white/2px border border-white/5 rounded-2xl p-4">
        <ul class="space-y-2.5">
            ${items.map(sub => `
                <li class="flex items-center justify-between text-xs border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span class="cursor-pointer font-medium text-gray-300 hover:text-accentCyan transition" onclick="openStudyViewer('${sub.id}')">${sub.name}</span>
                    <span class="text-[9px] font-mono text-gray-500">${sub.topicName}</span>
                </li>
            `).join('')}
        </ul>
    </div>`;
}

function renderStudyGrid(items) {
    return `
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        ${items.map(sub => `
            <div class="bg-bgCard border border-white/5 hover:border-accentCyan/30 rounded-xl p-4 shadow-md flex flex-col justify-between cursor-pointer hover:-translate-y-0.5 transition duration-200" onclick="openStudyViewer('${sub.id}')">
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-[9px] text-gray-500 font-bold uppercase truncate max-w-[150px]">${sub.topicName}</span>
                        <span class="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                            sub.difficulty.toLowerCase() === 'easy' ? 'bg-accentGreen/10 text-accentGreen border border-accentGreen/20' :
                            sub.difficulty.toLowerCase() === 'hard' ? 'bg-accentRose/10 text-accentRose border border-accentRose/20' :
                            'bg-accentAmber/10 text-accentAmber border border-accentAmber/20'
                        }">${sub.difficulty}</span>
                    </div>
                    <h4 class="text-xs font-bold text-white leading-relaxed mb-3">${sub.name}</h4>
                </div>
                <div class="flex justify-between items-center text-[10px] text-gray-500 pt-2 border-t border-white/5 mt-2">
                    <span>ROI: <strong class="text-gray-400">${sub.roi.toUpperCase()}</strong></span>
                    <span class="text-accentCyan font-bold uppercase text-[9px]">Read Note →</span>
                </div>
            </div>
        `).join('')}
    </div>`;
}

function renderStudyKanban(items) {
    const columns = {
        easy: { name: 'Easy Core', list: [] },
        moderate: { name: 'Moderate/Medium', list: [] },
        hard: { name: 'Hard Advanced', list: [] }
    };
    
    items.forEach(it => {
        const d = it.difficulty.toLowerCase();
        const colKey = d === 'moderate' || d === 'medium' ? 'moderate' : d === 'easy' ? 'easy' : 'hard';
        columns[colKey].list.push(it);
    });
    
    return `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${Object.keys(columns).map(colKey => {
            const col = columns[colKey];
            return `
            <div class="bg-white/2px border border-white/5 rounded-2xl p-3 flex flex-col min-h-[300px]">
                <div class="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                    <h4 class="text-xs font-bold text-white uppercase tracking-wider">${col.name}</h4>
                    <span class="px-2 py-0.5 bg-white/5 border border-white/5 text-[9px] font-mono text-gray-400 rounded-full">${col.list.length}</span>
                </div>
                <div class="space-y-2 flex-grow overflow-y-auto scrollbar-thin">
                    ${col.list.length === 0 ? `
                        <div class="text-center text-[10px] text-gray-600 italic py-6">No notes here</div>
                    ` : col.list.map(sub => `
                        <div class="bg-bgCard border border-white/5 hover:border-accentCyan/30 rounded-xl p-3 cursor-pointer hover:bg-white/5 transition" onclick="openStudyViewer('${sub.id}')">
                            <p class="text-xs font-bold text-gray-200 leading-normal mb-1.5">${sub.name}</p>
                            <div class="flex justify-between items-center text-[9px] text-gray-500">
                                <span class="truncate max-w-[120px]">${sub.topicName}</span>
                                <span class="text-accentCyan uppercase font-bold">Read →</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }).join('')}
    </div>`;
}

function renderStudyTable(items) {
    return `
    <div class="overflow-x-auto rounded-2xl border border-white/5 bg-white/2px">
        <table class="w-full text-left divide-y divide-white/5 border-collapse">
            <thead>
                <tr class="bg-white/5 text-[9.5px] font-extrabold uppercase text-gray-400 tracking-wider">
                    <th class="px-4 py-3">Topic / Subtopic</th>
                    <th class="px-4 py-3">Chapter</th>
                    <th class="px-4 py-3">Difficulty</th>
                    <th class="px-4 py-3">ROI</th>
                    <th class="px-4 py-3 text-right">Action</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-xs">
                ${items.map(sub => `
                    <tr class="hover:bg-white/[0.02] transition">
                        <td class="px-4 py-2.5 font-bold text-white cursor-pointer hover:text-accentCyan" onclick="openStudyViewer('${sub.id}')">${sub.name}</td>
                        <td class="px-4 py-2.5 text-gray-400">${sub.topicName}</td>
                        <td class="px-4 py-2.5">
                            <span class="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                sub.difficulty.toLowerCase() === 'easy' ? 'bg-accentGreen/10 text-accentGreen border border-accentGreen/20' :
                                sub.difficulty.toLowerCase() === 'hard' ? 'bg-accentRose/10 text-accentRose border border-accentRose/20' :
                                'bg-accentAmber/10 text-accentAmber border border-accentAmber/20'
                            }">${sub.difficulty}</span>
                        </td>
                        <td class="px-4 py-2.5 text-gray-400 font-mono text-[10px]">${sub.roi.toUpperCase()}</td>
                        <td class="px-4 py-2.5 text-right">
                            <button class="text-accentCyan hover:text-cyan-400 font-bold uppercase text-[9px] bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded" onclick="openStudyViewer('${sub.id}')">Read</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>`;
}

function renderStudyTrackerAll() {
    const mount = document.getElementById('study-view-mount');
    const emptyState = document.getElementById('study-empty-state');
    if (!mount) return;
    
    initStudyToolbar();
    buildStudyFilterRow();
    
    const items = getFilteredStudySubtopics();
    const hasItems = items.length > 0;
    
    if (emptyState) {
        if (!hasItems) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
    }
    
    let html = "";
    if (hasItems) {
        switch (studyState.view) {
            case 'explorer':
                html = renderStudyExplorer(items);
                renderStudyExplorerBreadcrumb();
                break;
            case 'compact':
                html = renderStudyCompact(items);
                break;
            case 'grid':
                html = renderStudyGrid(items);
                break;
            case 'kanban':
                html = renderStudyKanban(items);
                break;
            case 'table':
                html = renderStudyTable(items);
                break;
            default: // 'tree'
                html = renderStudyTree(items);
                break;
        }
    }
    
    mount.innerHTML = html;
    
    // Re-trigger Math typesetting
    setTimeout(triggerMathTypesetting, 50);
}

// Show Custom notes form
function showCustomNotes() {
    document.getElementById("study-subject-grid").classList.add("hidden");
    document.getElementById("study-topic-area").classList.add("hidden");
    document.getElementById("study-custom-notes-area").classList.remove("hidden");
    
    renderToolkit();
}

// Reset views back to subject cards grid
function backToSubjects() {
    const topicArea = document.getElementById("study-topic-area");
    if (topicArea) topicArea.classList.add("hidden");
    
    const customArea = document.getElementById("study-custom-notes-area");
    if (customArea) customArea.classList.add("hidden");
    
    const grid = document.getElementById("study-subject-grid");
    if (grid) grid.classList.remove("hidden");
    
    const searchResults = document.getElementById("study-search-results");
    if (searchResults) searchResults.classList.add("hidden");
    
    const searchInput = document.getElementById("study-global-search");
    if (searchInput) searchInput.value = "";
}

// Accordion toggle animation
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector("i");
    
    if (content.style.maxHeight === "0px" || !content.style.maxHeight) {
        content.style.maxHeight = content.scrollHeight + "px";
        icon.style.transform = "rotate(180deg)";
        header.classList.add("bg-white/10");
    } else {
        content.style.maxHeight = "0px";
        icon.style.transform = "rotate(0deg)";
        header.classList.remove("bg-white/10");
    }
}

// Open Fullscreen Learning Modal
async function openStudyViewer(subtopicId) {
    const subtopic = findSubtopicById(subtopicId);
    if (!subtopic) return;
    
    currentReadingSubtopic = subtopic;
    
    const modal = document.getElementById("modal-study-viewer");
    if (!modal) return;
    
    // Activate fullscreen styling
    modal.classList.add("active");
    modal.classList.remove("opacity-0", "pointer-events-none");
    
    document.getElementById("viewer-path-label").innerText = `${subtopic.subjectName} → ${subtopic.topicName}`;
    document.getElementById("viewer-title-label").innerText = subtopic.name;
    
    updateViewerActionButtons(subtopicId);
    
    const container = document.getElementById("viewer-document-body");
    if (container) {
        container.innerHTML = `<div class="text-center text-xs text-gray-500 py-12"><i class="fa-solid fa-spinner animate-spin mr-1.5 text-accentCyan"></i> Fetching chapter details...</div>`;
        try {
            // Load script file dynamically if not already present
            await loadChapterScript(subtopic.file);
            
            const rawText = window.studyChapters[subtopicId] || "";
            const cleanText = rawText.trim();
            
            // Slice off frontmatter block
            const bodyText = cleanText.startsWith("---") ? cleanText.split("---").slice(2).join("---").trim() : cleanText;
            
            // Render via speed.js compiler
            container.innerHTML = parseMarkdown(bodyText);
            
            // Build outlines table of contents sidebar
            buildTableOfContents(container);
            
            // Trigger math rendering
            triggerMathTypesetting();
        } catch (err) {
            container.innerHTML = `<div class="text-center text-xs text-accentRose py-12"><i class="fa-solid fa-triangle-exclamation mr-1.5"></i> Error displaying study content: ${err.message}</div>`;
        }
    }
    
    setupScrollProgressTracker();
    
    // Add opened timestamp
    if (!progressStore[subtopicId]) progressStore[subtopicId] = {};
    progressStore[subtopicId].lastOpened = new Date().toISOString();
    saveProgress();
}

// Search utility to find nested subtopic object
function findSubtopicById(subtopicId) {
    if (!studyCatalog) return null;
    for (const subject of studyCatalog.subjects) {
        for (const topic of subject.topics) {
            for (const sub of topic.subtopics) {
                if (sub.id === subtopicId) {
                    return {
                        ...sub,
                        subjectId: subject.id,
                        subjectName: subject.name,
                        topicId: topic.id,
                        topicName: topic.name
                    };
                }
            }
        }
    }
    return null;
}

// Update Active Star/Learned/Bookmark UI highlights
function updateViewerActionButtons(subtopicId) {
    const progress = progressStore[subtopicId] || {};
    
    const btnStar = document.getElementById("btn-viewer-star");
    const btnLearned = document.getElementById("btn-viewer-learned");
    const btnBookmark = document.getElementById("btn-viewer-bookmark");
    
    if (btnStar) {
        btnStar.className = progress.starred
            ? "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-accentAmber/30 bg-accentAmber/10 text-accentAmber transition"
            : "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/5 bg-white/5 text-gray-400 hover:text-white transition";
        btnStar.querySelector("i").className = progress.starred ? "fa-solid fa-star" : "fa-regular fa-star";
    }
    if (btnLearned) {
        btnLearned.className = progress.learned
            ? "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-accentGreen/30 bg-accentGreen/10 text-accentGreen transition"
            : "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/5 bg-white/5 text-gray-400 hover:text-white transition";
        btnLearned.querySelector("i").className = progress.learned ? "fa-solid fa-circle-check" : "fa-regular fa-circle-check";
    }
    if (btnBookmark) {
        btnBookmark.className = progress.bookmarked
            ? "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-accentCyan/30 bg-accentCyan/10 text-accentCyan transition"
            : "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/5 bg-white/5 text-gray-400 hover:text-white transition";
        btnBookmark.querySelector("i").className = progress.bookmarked ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark";
    }
}

// Toggle tracked bookmark values
function toggleViewerProgress(type) {
    if (!currentReadingSubtopic) return;
    const subtopicId = currentReadingSubtopic.id;
    if (!progressStore[subtopicId]) progressStore[subtopicId] = {};
    
    if (type === "starred") {
        progressStore[subtopicId].starred = !progressStore[subtopicId].starred;
    } else if (type === "learned") {
        progressStore[subtopicId].learned = !progressStore[subtopicId].learned;
    } else if (type === "bookmarked") {
        progressStore[subtopicId].bookmarked = !progressStore[subtopicId].bookmarked;
    }
    
    saveProgress();
    updateViewerActionButtons(subtopicId);
    
    // Refresh accordion UI progress indicators
    showSubjectDetail(currentReadingSubtopic.subjectId);
}

function saveProgress() {
    localStorage.setItem("studyProgress", JSON.stringify(progressStore));
}

function closeStudyViewer() {
    const modal = document.getElementById("modal-study-viewer");
    if (modal) {
        modal.classList.remove("active");
        modal.classList.add("opacity-0", "pointer-events-none");
    }
    currentReadingSubtopic = null;
}

// Scan headings to create sidebar anchors
function buildTableOfContents(container) {
    const sidebarNav = document.getElementById("viewer-toc-nav");
    if (!sidebarNav) return;
    sidebarNav.innerHTML = "";
    
    const headings = container.querySelectorAll("h2, h3, h4, h5");
    if (headings.length === 0) {
        sidebarNav.innerHTML = `<span class="text-[10px] text-gray-500 italic block">No subsections mapped</span>`;
        return;
    }
    
    headings.forEach((heading, idx) => {
        const headingId = `toc-heading-${idx}`;
        heading.id = headingId;
        
        const link = document.createElement("a");
        link.href = `#${headingId}`;
        link.className = "block text-[11px] py-1.5 text-gray-400 hover:text-accentCyan transition truncate border-l border-white/5 pl-3 -ml-px hover:border-accentCyan";
        
        const tagName = heading.tagName.toLowerCase();
        if (tagName === "h3") link.classList.add("pl-6");
        else if (tagName === "h4") link.classList.add("pl-9");
        else if (tagName === "h5") link.classList.add("pl-12");
        
        link.innerText = heading.innerText;
        link.onclick = (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: "smooth", block: "start" });
        };
        
        sidebarNav.appendChild(link);
    });
}

// Hook scroll events inside document reader
function setupScrollProgressTracker() {
    const container = document.getElementById("viewer-document-body");
    const pctLabel = document.getElementById("viewer-progress-pct");
    if (!container || !pctLabel) return;
    
    pctLabel.innerText = "0% Read";
    
    container.onscroll = () => {
        const total = container.scrollHeight - container.clientHeight;
        if (total <= 0) {
            pctLabel.innerText = "100% Read";
            return;
        }
        const pct = Math.min(100, Math.round((container.scrollTop / total) * 100));
        pctLabel.innerText = `${pct}% Read`;
    };
}

// Previous/Next Topic cycling
function navigateViewer(direction) {
    if (!currentReadingSubtopic || !studyCatalog) return;
    
    const flatIds = [];
    studyCatalog.subjects.forEach(subject => {
        subject.topics.forEach(topic => {
            topic.subtopics.forEach(sub => {
                flatIds.push(sub.id);
            });
        });
    });
    
    const currIdx = flatIds.indexOf(currentReadingSubtopic.id);
    if (currIdx === -1) return;
    
    let targetIdx = currIdx + direction;
    if (targetIdx < 0) targetIdx = flatIds.length - 1;
    else if (targetIdx >= flatIds.length) targetIdx = 0;
    
    openStudyViewer(flatIds[targetIdx]);
}

// Set up Global Search listeners and display
function setupGlobalSearch() {
    const searchInput = document.getElementById("study-global-search");
    const searchResults = document.getElementById("study-search-results");
    const searchList = document.getElementById("study-search-list");
    
    if (!searchInput || !searchResults || !searchList) return;
    
    searchInput.oninput = () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length < 2) {
            searchResults.classList.add("hidden");
            return;
        }
        
        // Scan searchable background index
        const matches = searchIndex.filter(item => {
            return item.subtopicName.toLowerCase().includes(query) ||
                   item.topicName.toLowerCase().includes(query) ||
                   item.subjectName.toLowerCase().includes(query) ||
                   item.tags.some(t => t.toLowerCase().includes(query)) ||
                   item.content.toLowerCase().includes(query);
        });
        
        searchList.innerHTML = "";
        
        if (matches.length === 0) {
            searchList.innerHTML = `<div class="text-xs text-gray-500 italic py-3 text-center">No match found</div>`;
        } else {
            matches.slice(0, 8).forEach(match => {
                const item = document.createElement("div");
                item.className = "p-2.5 rounded-xl border border-white/5 hover:border-accentCyan/30 bg-white/2px hover:bg-accentCyan/5 cursor-pointer transition select-none flex flex-col gap-1";
                item.innerHTML = `
                    <div class="flex items-center justify-between">
                        <span class="text-[9px] text-accentCyan font-bold uppercase tracking-wider">${match.subjectName} &bull; ${match.topicName}</span>
                        <span class="text-[8px] px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-gray-400 uppercase tracking-widest font-extrabold">${match.roi} ROI</span>
                    </div>
                    <span class="text-xs text-white font-bold">${match.subtopicName}</span>
                `;
                item.onclick = () => {
                    searchResults.classList.add("hidden");
                    searchInput.value = "";
                    openStudyViewer(match.subtopicId);
                };
                searchList.appendChild(item);
            });
        }
        
        searchResults.classList.remove("hidden");
    };
    
    // Hide panel on blur/click away
    document.addEventListener("click", (e) => {
        if (!searchResults.contains(e.target) && e.target !== searchInput) {
            searchResults.classList.add("hidden");
        }
    });
}

// Render Mistake Book / Custom Notes List (preserves notes functionality completely)
function renderToolkit() {
    const container = document.getElementById("notes-container");
    if (!container) return;
    
    const activeBtn = document.querySelector(".note-filter-btn.active-nav-tab");
    const category = activeBtn ? activeBtn.getAttribute("data-category") : "all";
    
    if (typeof appState === "undefined" || !appState.notes) {
        container.innerHTML = `<div class="text-center text-xs text-gray-500 py-6">Notes store unavailable.</div>`;
        return;
    }
    
    const filtered = category === "all" ? 
                     appState.notes : 
                     appState.notes.filter(n => n.category === category);
                     
    if (filtered.length === 0) {
        container.innerHTML = `<div class="text-center text-xs text-gray-500 py-6">No custom notes found. Create one using the form above!</div>`;
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
    setTimeout(triggerMathTypesetting, 50);
}

function deleteNote(id) {
    if (confirm("Are you sure you want to delete this custom note?")) {
        appState.notes = appState.notes.filter(n => n.id !== id);
        saveStateToStorage();
        renderToolkit();
    }
}

// Define tab dispatcher logic mapping back to our Subjects menu
function renderToolkitSubTab(targetPanelId) {
    if (targetPanelId === "tk-custom") {
        showCustomNotes();
    } else {
        backToSubjects();
    }
    setTimeout(triggerMathTypesetting, 50);
}



// Expose elements globally
window.renderToolkit = renderToolkit;
window.renderToolkitSubTab = renderToolkitSubTab;
window.deleteNote = deleteNote;
window.openStudyViewer = openStudyViewer;
window.initStudyPage = initStudyPage;
window.closeStudyViewer = closeStudyViewer;
window.navigateViewer = navigateViewer;
