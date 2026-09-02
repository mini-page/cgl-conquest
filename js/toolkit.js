// Modular Study Documentation & Search System
let studyCatalog = null;
let activeSubjectId = null;
let searchIndex = [];
let currentReadingSubtopic = null;
let progressStore = {};
try {
    progressStore = JSON.parse(localStorage.getItem("studyProgress") || "{}");
} catch (e) {
    console.error("localStorage disabled/inaccessible for studyProgress:", e);
}

// Global UI State for Study Views
let studyState = {
    view: 'command', // Default to Mastery Command Hub
    sortBy: 'name',
    sortDir: 1,
    search: '',
    difficulty: '',
    roi: '',
    chapter: null,
    activeSubject: 'all',
    openDropdown: null
};

// Setup DOM content listeners
document.addEventListener("DOMContentLoaded", () => {
    initStudyPage();
    setupGlobalSearch();
    
    // Bind modal actions (legacy — modal is hidden but kept for compatibility)
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
    
    // Bind inline content viewer action buttons
    const contentStarBtn = document.getElementById("btn-content-star");
    if (contentStarBtn) contentStarBtn.onclick = () => toggleViewerProgress("starred");
    
    const contentLearnedBtn = document.getElementById("btn-content-learned");
    if (contentLearnedBtn) contentLearnedBtn.onclick = () => toggleViewerProgress("learned");
    
    const contentBookmarkBtn = document.getElementById("btn-content-bookmark");
    if (contentBookmarkBtn) contentBookmarkBtn.onclick = () => toggleViewerProgress("bookmarked");
    
    const contentPrevBtn = document.getElementById("btn-content-prev");
    if (contentPrevBtn) contentPrevBtn.onclick = () => navigateViewer(-1);
    
    const contentNextBtn = document.getElementById("btn-content-next");
    if (contentNextBtn) contentNextBtn.onclick = () => navigateViewer(1);
    
    const tocToggleBtn = document.getElementById("btn-viewer-toc-toggle");
    const tocSidebar = document.getElementById("viewer-toc-sidebar");
    if (tocToggleBtn && tocSidebar) {
        tocToggleBtn.onclick = () => {
            tocSidebar.classList.toggle("hidden");
            tocSidebar.classList.toggle("absolute");
            tocSidebar.classList.toggle("inset-y-0");
            tocSidebar.classList.toggle("left-0");
            tocSidebar.classList.toggle("shadow-2xl");
        };
    }
    
    // Bind back grid buttons
    const backBtn = document.getElementById("btn-study-back-grid");
    if (backBtn) backBtn.onclick = backToSubjects;
    
    const backCustomBtn = document.getElementById("btn-study-custom-back");
    if (backCustomBtn) backCustomBtn.onclick = backToSubjects;
    
    // Setup content viewer back button
    const contentBackBtn = document.getElementById("btn-content-back");
    if (contentBackBtn) contentBackBtn.onclick = closeStudyViewer;
    
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

const SUBJECT_ICONS = {
    quant: 'fa-calculator',
    mathematics: 'fa-subscript',
    english: 'fa-book-open-reader',
    reasoning: 'fa-brain',
    gk: 'fa-landmark',
    general_science: 'fa-flask',
    computer: 'fa-laptop-code'
};

const SUBJECT_COLORS = {
    quant: 'accentCyan',
    mathematics: 'accentPurple',
    english: 'accentAmber',
    reasoning: 'accentGreen',
    gk: 'accentRose',
    general_science: 'accentCyan',
    computer: 'accentPurple'
};

const DIRECT_MASTER_PAGES = [
    {
        id: "grammar_book",
        title: "English Grammar Master Book",
        page: "pages/grammar-book.html",
        icon: "fa-book-open-reader",
        color: "text-amber-400",
        bg: "from-amber-950/70 via-slate-900/80 to-amber-900/40",
        border: "border-amber-500/40 hover:border-amber-400",
        badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        badgeText: "Direct Master Page",
        desc: "Full interactive grammar book: 8 core pillars, common traps, rule search & PYQs."
    },
    {
        id: "geometry_atlas",
        title: "Geometry & Mensuration 3D Atlas",
        page: "pages/geometry-atlas.html",
        icon: "fa-draw-polygon",
        color: "text-cyan-400",
        bg: "from-cyan-950/70 via-slate-900/80 to-cyan-900/40",
        border: "border-cyan-500/40 hover:border-cyan-400",
        badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
        badgeText: "Direct Master Page",
        desc: "Interactive 3D geometry & mensuration shapes, formulas, theorems & calculators."
    },
    {
        id: "constitution_explorer",
        title: "Constitution & Polity Explorer",
        page: "pages/constitution-explorer.html",
        icon: "fa-building-columns",
        color: "text-purple-400",
        bg: "from-purple-950/70 via-slate-900/80 to-purple-900/40",
        border: "border-purple-500/40 hover:border-purple-400",
        badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        badgeText: "Direct Master Page",
        desc: "Interactive Constitution reader with articles, parts, schedules, amendments & search."
    },
    {
        id: "india_atlas",
        title: "India Maps & Rivers Atlas",
        page: "pages/india-atlas.html",
        icon: "fa-map-location-dot",
        color: "text-emerald-400",
        bg: "from-emerald-950/70 via-slate-900/80 to-emerald-900/40",
        border: "border-emerald-500/40 hover:border-emerald-400",
        badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        badgeText: "Direct Master Page",
        desc: "Interactive visual map: states, river basins, mountain ranges, parks & PYQs."
    },
    {
        id: "historical_calendar",
        title: "History Timeline & Events Calendar",
        page: "pages/historical-calendar.html",
        icon: "fa-calendar-days",
        color: "text-rose-400",
        bg: "from-rose-950/70 via-slate-900/80 to-rose-900/40",
        border: "border-rose-500/40 hover:border-rose-400",
        badge: "bg-rose-500/20 text-rose-300 border-rose-500/30",
        badgeText: "Direct Master Page",
        desc: "Chronological history events, important dates, revision drills & timeline."
    },
    {
        id: "computer_os",
        title: "SSC Tier-2 Computer OS Simulator",
        page: "pages/ssc-os-computer-tier2.html",
        icon: "fa-laptop-code",
        color: "text-blue-400",
        bg: "from-blue-950/70 via-slate-900/80 to-blue-900/40",
        border: "border-blue-500/40 hover:border-blue-400",
        badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        badgeText: "Direct Master Page",
        desc: "Interactive OS simulation: keyboard shortcuts, computer abbreviations & typing lab."
    },
    {
        id: "science_lab",
        title: "General Science Specimen Lab",
        page: "pages/science-lab.html",
        icon: "fa-flask-vial",
        color: "text-emerald-400",
        bg: "from-emerald-950/70 via-slate-900/80 to-cyan-900/40",
        border: "border-emerald-500/40 hover:border-emerald-400",
        badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        badgeText: "Direct Master Page",
        desc: "Interactive General Science specimen lab: Physics, Chemistry & Biology topics & experiments."
    },
    {
        id: "math_pager",
        title: "Math Pager (Quant Lab)",
        page: "pages/math-pager.html",
        icon: "fa-calculator",
        color: "text-cyan-400",
        bg: "from-cyan-950/70 via-slate-900/80 to-purple-900/40",
        border: "border-cyan-500/40 hover:border-cyan-400",
        badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
        badgeText: "Direct Master Page",
        desc: "Interactive SSC CGL & CHSL Quantitative Aptitude lab: Number System, Algebra, Geometry, Arithmetic & Calculators."
    }
];

let currentStudyViewMode = localStorage.getItem("study_view_mode") || "big";

function setStudyCardViewMode(mode) {
    currentStudyViewMode = mode;
    localStorage.setItem("study_view_mode", mode);
    
    // Update active button styles & slider position
    const modeLevels = { 'big': 1, 'compact': 2, 'folder': 3, 'list': 4 };
    const slider = document.getElementById('study-view-range');
    if (slider && modeLevels[mode]) {
        slider.value = modeLevels[mode];
    }
    
    document.querySelectorAll('.study-view-btn').forEach(btn => {
        if (btn.getAttribute('data-view') === mode) {
            btn.className = 'study-view-btn flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-sm transition cursor-pointer';
        } else {
            btn.className = 'study-view-btn flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition cursor-pointer';
        }
    });

    if (window.studyCatalog && window.studyCatalog.subjects) {
        const searchQuery = document.getElementById('study-global-search')?.value || '';
        renderSubjectGrid(window.studyCatalog.subjects, searchQuery);
    }
}

function onStudyViewSliderChange(val) {
    const valMap = { '1': 'big', '2': 'compact', '3': 'folder', '4': 'list' };
    if (valMap[val]) {
        setStudyCardViewMode(valMap[val]);
    }
}

function renderSubjectGrid(subjects, searchQuery = "") {
    const grid = document.getElementById("study-subject-grid");
    if (!grid) return;

    const q = (searchQuery || "").trim().toLowerCase();

    // Filter Direct Master Page Cards
    const filteredMasterPages = DIRECT_MASTER_PAGES.filter(p => {
        if (!q) return true;
        return p.title.toLowerCase().includes(q) ||
               p.desc.toLowerCase().includes(q) ||
               p.id.toLowerCase().includes(q);
    });

    // Filter Subjects for Section 2: keep ONLY "general_rules" (Fixed Rules) and "conquest_patterns" (Conquest Weightage) alongside All Subjects Hub
    const allowedSection2Ids = ["general_rules", "conquest_patterns"];
    const filteredSubjects = (subjects || []).filter(subj => {
        if (!allowedSection2Ids.includes(subj.id)) return false;

        if (!q) return true;
        return subj.name.toLowerCase().includes(q) ||
               (subj.description && subj.description.toLowerCase().includes(q)) ||
               (subj.topics && subj.topics.some(t => t.name.toLowerCase().includes(q)));
    });

    const showAllDeck = !q || "all subjects hub".includes(q) || "master deck".includes(q) || "all deck".includes(q);

    // Sync button state on render
    const modeLevels = { 'big': 1, 'compact': 2, 'folder': 3, 'list': 4 };
    const slider = document.getElementById('study-view-range');
    if (slider && modeLevels[currentStudyViewMode]) {
        slider.value = modeLevels[currentStudyViewMode];
    }
    document.querySelectorAll('.study-view-btn').forEach(btn => {
        if (btn.getAttribute('data-view') === currentStudyViewMode) {
            btn.className = 'study-view-btn flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-sm transition cursor-pointer';
        } else {
            btn.className = 'study-view-btn flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition cursor-pointer';
        }
    });

    let html = `<div class="space-y-6 animate-fadeIn">`;

    // VIEW MODE 1: BIG GRID MODE (3 Columns)
    if (currentStudyViewMode === 'big') {
        html += `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">`;
        
        // Master Pages
        filteredMasterPages.forEach(mp => {
            html += `
                <div class="group relative bg-gradient-to-br ${mp.bg} border ${mp.border} rounded-2xl p-5 shadow-2xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between" onclick="openFullscreenPage('${mp.page}', '${mp.id}')">
                    <div>
                        <div class="flex items-center gap-3.5 mb-3">
                            <span class="w-10 h-10 rounded-xl bg-white/10 border border-white/10 ${mp.color} flex items-center justify-center text-lg group-hover:scale-110 transition shrink-0">
                                <i class="fa-solid ${mp.icon}"></i>
                            </span>
                            <h4 class="font-heading font-black text-white text-base group-hover:text-cyan-300 transition leading-snug">${mp.title}</h4>
                        </div>
                        <p class="text-xs text-gray-300 leading-relaxed line-clamp-2">${mp.desc}</p>
                    </div>
                    <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-end">
                        <button class="px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-white/10 text-cyan-300 border border-white/20 group-hover:bg-cyan-500 group-hover:text-black transition">
                            Launch Page &rarr;
                        </button>
                    </div>
                </div>
            `;
        });

        // All Subjects Deck
        if (showAllDeck) {
            html += `
                <div class="bg-gradient-to-br from-cyan-950/60 to-slate-900/80 border border-cyan-500/40 hover:border-cyan-400 p-5 rounded-2xl shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between group" onclick="showSubjectDetail('all')">
                    <div>
                        <div class="flex items-center gap-3.5 mb-3">
                            <span class="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-lg group-hover:scale-110 transition shrink-0">
                                <i class="fa-solid fa-layer-group"></i>
                            </span>
                            <h4 class="font-heading font-black text-white text-base group-hover:text-cyan-300 transition">All Subjects Hub</h4>
                        </div>
                        <p class="text-xs text-gray-300 line-clamp-2 leading-relaxed">Full interactive mastery deck across Quant, English, Reasoning, GK & Atlases.</p>
                    </div>
                    <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-end text-xs text-cyan-400 font-extrabold">
                        <span class="px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-white/10 text-cyan-300 border border-white/20 group-hover:bg-cyan-500 group-hover:text-black transition">Explore All &rarr;</span>
                    </div>
                </div>
            `;
        }

        // Subject Decks
        filteredSubjects.forEach(subj => {
            const icon = subj.icon || SUBJECT_ICONS[subj.id] || 'fa-book';
            const color = SUBJECT_COLORS[subj.id] || 'accentCyan';
            html += `
                <div class="bg-bgCard/60 border border-white/10 hover:border-${color}/40 p-5 rounded-2xl shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between group" onclick="showSubjectDetail('${subj.id}')">
                    <div>
                        <div class="flex items-center gap-3.5 mb-3">
                            <span class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-${color} flex items-center justify-center text-lg group-hover:scale-110 transition shrink-0">
                                <i class="fa-solid ${icon}"></i>
                            </span>
                            <h4 class="font-heading font-black text-white text-base group-hover:text-${color} transition">${subj.name}</h4>
                        </div>
                        <p class="text-xs text-gray-400 line-clamp-2 leading-relaxed">${subj.description || 'Comprehensive exam rules, pyqs, and weightage cards.'}</p>
                    </div>
                    <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-end text-xs text-gray-400 font-bold group-hover:text-white transition">
                        <span class="px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-white/10 text-cyan-300 border border-white/20 group-hover:bg-cyan-500 group-hover:text-black transition">Browse Deck &rarr;</span>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
    }

    // VIEW MODE 2: COMPACT GRID MODE (4 Columns)
    else if (currentStudyViewMode === 'compact') {
        html += `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">`;

        // Master Pages
        filteredMasterPages.forEach(mp => {
            html += `
                <div class="group relative bg-gradient-to-br ${mp.bg} border ${mp.border} rounded-xl p-3.5 shadow-xl backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between" onclick="openFullscreenPage('${mp.page}', '${mp.id}')">
                    <div>
                        <div class="flex items-center gap-2.5 mb-2">
                            <span class="w-8 h-8 rounded-lg bg-white/10 border border-white/10 ${mp.color} flex items-center justify-center text-sm shrink-0">
                                <i class="fa-solid ${mp.icon}"></i>
                            </span>
                            <h4 class="font-heading font-extrabold text-white text-xs group-hover:text-cyan-300 transition line-clamp-1">${mp.title}</h4>
                        </div>
                        <p class="text-[11px] text-gray-300 line-clamp-2 leading-tight">${mp.desc}</p>
                    </div>
                    <div class="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-end">
                        <span class="text-[10px] font-extrabold uppercase text-cyan-400 group-hover:translate-x-0.5 transition">Launch &rarr;</span>
                    </div>
                </div>
            `;
        });

        // All Subjects Deck
        if (showAllDeck) {
            html += `
                <div class="bg-gradient-to-br from-cyan-950/60 to-slate-900/80 border border-cyan-500/40 p-3.5 rounded-xl shadow-lg backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between group" onclick="showSubjectDetail('all')">
                    <div>
                        <div class="flex items-center gap-2.5 mb-2">
                            <span class="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-sm shrink-0">
                                <i class="fa-solid fa-layer-group"></i>
                            </span>
                            <h4 class="font-heading font-extrabold text-white text-xs group-hover:text-cyan-300 transition truncate">All Subjects Hub</h4>
                        </div>
                        <p class="text-[11px] text-gray-300 line-clamp-2 leading-tight">Full interactive mastery deck across Quant, English, Reasoning & GK.</p>
                    </div>
                    <div class="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-end text-[10px] font-extrabold text-cyan-400">
                        <span>Explore &rarr;</span>
                    </div>
                </div>
            `;
        }

        // Subject Decks
        filteredSubjects.forEach(subj => {
            const icon = subj.icon || SUBJECT_ICONS[subj.id] || 'fa-book';
            const color = SUBJECT_COLORS[subj.id] || 'accentCyan';
            html += `
                <div class="bg-bgCard/60 border border-white/10 hover:border-${color}/40 p-3.5 rounded-xl shadow-lg backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between group" onclick="showSubjectDetail('${subj.id}')">
                    <div>
                        <div class="flex items-center gap-2.5 mb-2">
                            <span class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-${color} flex items-center justify-center text-sm shrink-0">
                                <i class="fa-solid ${icon}"></i>
                            </span>
                            <h4 class="font-heading font-extrabold text-white text-xs group-hover:text-${color} transition truncate">${subj.name}</h4>
                        </div>
                        <p class="text-[11px] text-gray-400 line-clamp-2 leading-tight">${subj.description || 'Exam rules and cards.'}</p>
                    </div>
                    <div class="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-end text-[10px] font-extrabold text-gray-400 group-hover:text-white transition">
                        <span>Browse &rarr;</span>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
    }

    // VIEW MODE 3: FOLDER MODE
    else if (currentStudyViewMode === 'folder') {
        html += `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">`;

        // Master Pages
        filteredMasterPages.forEach(mp => {
            html += `
                <div class="group relative cursor-pointer transition duration-300 hover:-translate-y-1" onclick="openFullscreenPage('${mp.page}', '${mp.id}')">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-t-xl bg-slate-800/90 border-t border-l border-r border-white/15 text-[10px] font-black uppercase text-cyan-300 tracking-wider">
                        <i class="fa-solid fa-folder-open text-xs"></i>
                        <span class="truncate max-w-[170px]">${mp.title}</span>
                    </div>
                    <div class="bg-gradient-to-br ${mp.bg} border ${mp.border} rounded-b-2xl rounded-tr-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col justify-between min-h-[135px]">
                        <div>
                            <div class="flex items-center gap-2.5 mb-2">
                                <span class="w-8 h-8 rounded-lg bg-white/10 border border-white/10 ${mp.color} flex items-center justify-center text-sm shrink-0">
                                    <i class="fa-solid ${mp.icon}"></i>
                                </span>
                                <h4 class="font-heading font-black text-white text-sm group-hover:text-cyan-300 transition leading-snug">${mp.title}</h4>
                            </div>
                            <p class="text-xs text-gray-300 leading-relaxed line-clamp-2">${mp.desc}</p>
                        </div>
                        <div class="mt-3 pt-2 border-t border-white/10 flex items-center justify-end">
                            <span class="px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-white/10 text-cyan-300 border border-white/20 group-hover:bg-cyan-500 group-hover:text-black transition">
                                Open Folder &rarr;
                            </span>
                        </div>
                    </div>
                </div>
            `;
        });

        // All Subjects Deck
        if (showAllDeck) {
            html += `
                <div class="group relative cursor-pointer transition duration-300 hover:-translate-y-1" onclick="showSubjectDetail('all')">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-t-xl bg-slate-800/90 border-t border-l border-r border-cyan-500/30 text-[10px] font-black uppercase text-cyan-300 tracking-wider">
                        <i class="fa-solid fa-folder-open text-xs"></i>
                        <span>All Subjects Hub</span>
                    </div>
                    <div class="bg-gradient-to-br from-cyan-950/60 to-slate-900/80 border border-cyan-500/40 rounded-b-2xl rounded-tr-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col justify-between min-h-[135px]">
                        <div>
                            <div class="flex items-center gap-2.5 mb-2">
                                <span class="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-sm shrink-0">
                                    <i class="fa-solid fa-layer-group"></i>
                                </span>
                                <h4 class="font-heading font-black text-white text-sm group-hover:text-cyan-300 transition">All Subjects Hub</h4>
                            </div>
                            <p class="text-xs text-gray-300 leading-relaxed line-clamp-2">Full interactive mastery deck across Quant, English, Reasoning & GK.</p>
                        </div>
                        <div class="mt-3 pt-2 border-t border-white/10 flex items-center justify-end">
                            <span class="px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-white/10 text-cyan-300 border border-white/20 group-hover:bg-cyan-500 group-hover:text-black transition">
                                Open Folder &rarr;
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }

        // Subject Decks
        filteredSubjects.forEach(subj => {
            const icon = subj.icon || SUBJECT_ICONS[subj.id] || 'fa-book';
            const color = SUBJECT_COLORS[subj.id] || 'accentCyan';
            html += `
                <div class="group relative cursor-pointer transition duration-300 hover:-translate-y-1" onclick="showSubjectDetail('${subj.id}')">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-t-xl bg-slate-800/90 border-t border-l border-r border-white/15 text-[10px] font-black uppercase text-gray-300 tracking-wider">
                        <i class="fa-solid fa-folder-open text-xs"></i>
                        <span class="truncate max-w-[170px]">${subj.name}</span>
                    </div>
                    <div class="bg-bgCard/60 border border-white/10 hover:border-${color}/40 rounded-b-2xl rounded-tr-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col justify-between min-h-[135px]">
                        <div>
                            <div class="flex items-center gap-2.5 mb-2">
                                <span class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-${color} flex items-center justify-center text-sm shrink-0">
                                    <i class="fa-solid ${icon}"></i>
                                </span>
                                <h4 class="font-heading font-black text-white text-sm group-hover:text-${color} transition">${subj.name}</h4>
                            </div>
                            <p class="text-xs text-gray-400 leading-relaxed line-clamp-2">${subj.description || 'Comprehensive exam rules and cards.'}</p>
                        </div>
                        <div class="mt-3 pt-2 border-t border-white/10 flex items-center justify-end">
                            <span class="px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-white/10 text-cyan-300 border border-white/20 group-hover:bg-cyan-500 group-hover:text-black transition">
                                Open Folder &rarr;
                            </span>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
    }

    // VIEW MODE 4: LIST MODE
    else if (currentStudyViewMode === 'list') {
        html += `<div class="space-y-2.5">`;

        // Master Pages
        filteredMasterPages.forEach(mp => {
            html += `
                <div class="group bg-gradient-to-r ${mp.bg} border ${mp.border} rounded-xl p-3.5 shadow-lg backdrop-blur-xl transition duration-200 hover:border-cyan-400 cursor-pointer flex items-center justify-between gap-4" onclick="openFullscreenPage('${mp.page}', '${mp.id}')">
                    <div class="flex items-center gap-3.5 min-w-0 flex-1">
                        <span class="w-10 h-10 rounded-xl bg-white/10 border border-white/10 ${mp.color} flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition">
                            <i class="fa-solid ${mp.icon}"></i>
                        </span>
                        <div class="min-w-0 flex-1">
                            <h4 class="font-heading font-black text-white text-sm group-hover:text-cyan-300 transition truncate">${mp.title}</h4>
                            <p class="text-xs text-gray-300 truncate">${mp.desc}</p>
                        </div>
                    </div>
                    <button class="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-white/10 text-cyan-300 border border-white/20 group-hover:bg-cyan-500 group-hover:text-black transition">
                        Launch &rarr;
                    </button>
                </div>
            `;
        });

        // All Subjects Deck
        if (showAllDeck) {
            html += `
                <div class="group bg-gradient-to-r from-cyan-950/60 to-slate-900/80 border border-cyan-500/40 rounded-xl p-3.5 shadow-lg backdrop-blur-xl transition duration-200 hover:border-cyan-400 cursor-pointer flex items-center justify-between gap-4" onclick="showSubjectDetail('all')">
                    <div class="flex items-center gap-3.5 min-w-0 flex-1">
                        <span class="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition">
                            <i class="fa-solid fa-layer-group"></i>
                        </span>
                        <div class="min-w-0 flex-1">
                            <h4 class="font-heading font-black text-white text-sm group-hover:text-cyan-300 transition truncate">All Subjects Hub</h4>
                            <p class="text-xs text-gray-300 truncate">Full interactive mastery deck across Quant, English, Reasoning & GK.</p>
                        </div>
                    </div>
                    <button class="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-white/10 text-cyan-300 border border-white/20 group-hover:bg-cyan-500 group-hover:text-black transition">
                        Explore &rarr;
                    </button>
                </div>
            `;
        }

        // Subject Decks
        filteredSubjects.forEach(subj => {
            const icon = subj.icon || SUBJECT_ICONS[subj.id] || 'fa-book';
            const color = SUBJECT_COLORS[subj.id] || 'accentCyan';
            html += `
                <div class="group bg-bgCard/60 border border-white/10 hover:border-${color}/40 rounded-xl p-3.5 shadow-lg backdrop-blur-xl transition duration-200 cursor-pointer flex items-center justify-between gap-4" onclick="showSubjectDetail('${subj.id}')">
                    <div class="flex items-center gap-3.5 min-w-0 flex-1">
                        <span class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-${color} flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition">
                            <i class="fa-solid ${icon}"></i>
                        </span>
                        <div class="min-w-0 flex-1">
                            <h4 class="font-heading font-black text-white text-sm group-hover:text-${color} transition truncate">${subj.name}</h4>
                            <p class="text-xs text-gray-400 truncate">${subj.description || 'Exam rules & decks.'}</p>
                        </div>
                    </div>
                    <button class="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-white/10 text-cyan-300 border border-white/20 group-hover:bg-cyan-500 group-hover:text-black transition">
                        Browse &rarr;
                    </button>
                </div>
            `;
        });

        html += `</div>`;
    }

    if (filteredMasterPages.length === 0 && filteredSubjects.length === 0) {
        html += `
            <div class="text-center py-12 space-y-3 bg-bgCard/30 border border-white/10 rounded-2xl">
                <i class="fa-solid fa-magnifying-glass text-gray-500 text-3xl"></i>
                <div class="text-sm font-extrabold text-white">No topics match "${q}"</div>
                <div class="text-xs text-gray-400">Try searching for terms like "Grammar", "Atlas", "Geometry", "Constitution", "History", or "Calendar".</div>
            </div>
        `;
    }

    html += `</div>`;
    grid.innerHTML = html;
}

function showSubjectDetail(subjectId) {
    studyState.activeSubject = subjectId;
    studyState.chapter = null;
    
    const subjectGrid = document.getElementById("study-subject-grid");
    const topicArea = document.getElementById("study-topic-area");
    const customArea = document.getElementById("study-custom-notes-area");
    
    if (subjectGrid) subjectGrid.classList.add("hidden");
    if (customArea) customArea.classList.add("hidden");
    if (topicArea) topicArea.classList.remove("hidden");
    
    const titleEl = document.getElementById("study-active-subject-title");
    if (titleEl) {
        if (subjectId === 'all') {
            titleEl.innerHTML = `<i class="fa-solid fa-layer-group text-accentCyan mr-2"></i> All Subjects - Mastery Command Deck`;
        } else {
            const subj = studyCatalog ? studyCatalog.subjects.find(s => s.id === subjectId) : null;
            const name = subj ? subj.name : subjectId;
            const icon = subj ? (subj.icon || 'fa-book') : 'fa-book';
            titleEl.innerHTML = `<i class="fa-solid ${icon} text-accentCyan mr-2"></i> ${name}`;
        }
    }
    
    const searchInput = document.getElementById("study-search");
    if (searchInput) searchInput.style.display = "";
    
    renderStudyTrackerAll();
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

// Background builder for global search index using pre-compiled STUDY_DATA
function buildSearchIndex(subjects) {
    searchIndex = [];
    
    subjects.forEach(subject => {
        subject.topics.forEach(topic => {
            const subtopics = topic.subtopics || [topic];
            subtopics.forEach(subtopic => {
                const data = window.STUDY_DATA ? window.STUDY_DATA[subtopic.id] : null;
                if (!data) return;
                searchIndex.push({
                    subtopicId: subtopic.id,
                    subtopicName: subtopic.name,
                    subjectName: subject.name,
                    subjectId: subject.id,
                    topicId: topic.id,
                    topicName: topic.name,
                    file: subtopic.file,
                    difficulty: data.difficulty || "medium",
                    roi: data.roi || "high",
                    tags: data.tags || [],
                    content: data.sections.map(s => s.html).join(' ')
                });
            });
        });
    });
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

function initStudyToolbar() {
    const viewWrap = document.getElementById("study-view-dropdown-wrap");
    if (viewWrap) {
        const viewIcons = { command: '⚡', grid: '🎴', explorer: '📂', kanban: '📋', table: '📊', tree: '🌲', compact: '📝' };
        const viewNames = { command: 'Mastery Command Hub', grid: 'Grid View', explorer: 'Explorer', kanban: 'Kanban', table: 'Table', tree: 'Tree View', compact: 'Compact' };
        const activeIcon = viewIcons[studyState.view] || '⚡';
        const activeName = viewNames[studyState.view] || 'Mastery Command Hub';
        
        viewWrap.innerHTML = `
        <div class="relative" data-study-dd-wrap="view">
            <button data-study-dd-btn="view" class="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm border bg-teal/10 border-teal/40 text-teal hover:border-teal/60 transition">
                <span>${activeIcon}</span><span class="font-medium">${activeName}</span><span class="text-[9px] opacity-60">▼</span>
            </button>
            <div data-study-dd-panel="view" class="hidden dropdown-panel absolute right-0 mt-2 w-64 bg-panel border border-line rounded-2xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto scrollbar-thin">
                ${Object.keys(viewNames).map(vId => `
                    <button class="w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-2 hover:bg-white/10 transition font-semibold ${studyState.view === vId ? 'text-accentCyan bg-white/[0.03]' : 'text-gray-300'}" onclick="setStudyView('${vId}')">
                        <span>${viewIcons[vId]}</span><span>${viewNames[vId]}</span>
                    </button>
                `).join('')}
            </div>
        </div>`;
    }

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
                    <button class="w-full text-left p-2.5 rounded-xl text-xs hover:bg-white/10 transition font-semibold ${studyState.sortBy === opt.id ? 'text-accentCyan bg-white/[0.03]' : 'text-zinc-300'}" onclick="setStudySort('${opt.id}')">
                        ${opt.label}
                    </button>
                `).join('')}
            </div>
        </div>`;
    }

    document.querySelectorAll('[data-study-dd-btn]').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const id = btn.dataset.studyDdBtn;
            const panel = document.querySelector(`[data-study-dd-panel="${id}"]`);
            const isHidden = panel.classList.contains('hidden');
            
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

    document.removeEventListener('click', handleStudyClickOutside);
    document.addEventListener('click', handleStudyClickOutside);

    const searchInput = document.getElementById("study-search");
    if (searchInput) {
        searchInput.value = studyState.search;
        searchInput.oninput = () => {
            studyState.search = searchInput.value.trim().toLowerCase();
            renderStudyTrackerAll();
        };
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
    
    if (studyState.difficulty || studyState.roi || studyState.chapter) {
        html += `
        <button class="px-2 py-1 rounded bg-accentRose/15 border border-accentRose/30 text-accentRose hover:bg-accentRose/20 text-[10px] font-bold uppercase transition" onclick="clearStudyFilters()">
            Clear Filters ×
        </button>`;
    }
    
    ['Easy', 'Moderate', 'Hard'].forEach(diff => {
        const active = studyState.difficulty === diff;
        html += `
        <button class="px-2.5 py-1 rounded-xl text-[10px] font-bold border transition ${active ? 'bg-accentCyan/10 border-accentCyan/40 text-accentCyan' : 'bg-panel border-line text-zinc-400 hover:border-accentCyan/30'}" onclick="toggleStudyDiffFilter('${diff}')">
            ${diff}
        </button>`;
    });
    
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
    if (!studyCatalog) return [];
    
    let subjectsToScan = studyCatalog.subjects;
    if (studyState.activeSubject && studyState.activeSubject !== 'all') {
        const found = studyCatalog.subjects.find(s => s.id === studyState.activeSubject);
        if (found) subjectsToScan = [found];
    }
    
    let items = [];
    subjectsToScan.forEach(subject => {
        subject.topics.forEach(topic => {
            const subtopics = topic.subtopics || [topic];
            subtopics.forEach(sub => {
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
    });
    
    if (studyState.search) {
        const q = studyState.search;
        items = items.filter(it => 
            it.name.toLowerCase().includes(q) || 
            it.topicName.toLowerCase().includes(q) ||
            it.tags.some(t => t.toLowerCase().includes(q))
        );
    }
    
    if (studyState.difficulty) {
        items = items.filter(it => it.difficulty.toLowerCase() === studyState.difficulty.toLowerCase());
    }
    
    if (studyState.roi) {
        items = items.filter(it => it.roi.toLowerCase() === studyState.roi.toLowerCase());
    }
    
    if (studyState.chapter) {
        items = items.filter(it => it.topicId === studyState.chapter);
    }
    
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

function renderStudyCommandHub(items) {
    const totalItems = items.length;
    const readCount = items.filter(sub => {
        const itemState = window.USER_STATE ? (window.USER_STATE.studySubtopics ? window.USER_STATE.studySubtopics[sub.id] : null) : null;
        return itemState && itemState.read;
    }).length;
    
    const pct = totalItems > 0 ? Math.round((readCount / totalItems) * 100) : 0;
    
    const pageItems = items.filter(sub => {
        const data = window.STUDY_DATA ? window.STUDY_DATA[sub.id] : null;
        return data && data.page;
    });

    let html = `
        <div class="space-y-6 animate-fadeIn">
            <!-- HERO READINESS & COMMAND PANEL -->
            <div class="relative overflow-hidden bg-gradient-to-r from-cyan-950/70 via-slate-900/90 to-purple-950/70 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-2xl">
                <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                    
                    <div class="space-y-2">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/35 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                            Mastery Command Hub
                        </div>
                        <h2 class="text-2xl md:text-3xl font-heading font-black text-white tracking-tight">SSC CGL 2026 Interactive Study Deck</h2>
                        <p class="text-xs text-gray-300 max-w-xl leading-relaxed">
                            Access interactive 3D visual atlases, master book pages, and quick formula flashcard drills tailored for Tier 1 &amp; Tier 2 exam conquest.
                        </p>
                    </div>

                    <div class="flex items-center gap-5 bg-white/5 border border-white/10 rounded-xl p-4 shrink-0 backdrop-blur-md">
                        <div class="relative w-16 h-16 flex items-center justify-center">
                            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path class="text-white/10" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                                <path class="text-cyan-400 stroke-current transition-all duration-1000 ease-out" stroke-dasharray="${pct}, 100" stroke-width="3.5" stroke-linecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                            </svg>
                            <span class="absolute text-sm font-extrabold text-white">${pct}%</span>
                        </div>
                        <div>
                            <div class="text-xs text-gray-400 font-semibold uppercase tracking-wider">Mastery Score</div>
                            <div class="text-base font-extrabold text-white">${readCount} / ${totalItems} Topics</div>
                            <div class="text-[10px] text-cyan-400 font-bold">${pageItems.length} Interactive Books &amp; Atlases</div>
                        </div>
                    </div>

                </div>
            </div>

            ${pageItems.length > 0 ? `
            <div class="space-y-3">
                <div class="flex items-center justify-between pb-1 border-b border-white/5">
                    <h3 class="text-xs font-extrabold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                        <i class="fa-solid fa-layer-group text-accentCyan"></i> Interactive Book &amp; Atlas Suite
                    </h3>
                    <span class="text-[10px] font-bold text-accentCyan bg-accentCyan/10 border border-accentCyan/20 px-2 py-0.5 rounded-full">${pageItems.length} Master Modules</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    ${pageItems.map(sub => {
                        const data = window.STUDY_DATA ? window.STUDY_DATA[sub.id] : null;
                        const subjectId = sub.subjectId || 'english';
                        const subjColor = SUBJECT_COLORS[subjectId] || 'accentCyan';
                        return `
                            <div class="group relative bg-gradient-to-b from-bgCard/90 to-bgCard/50 border border-cyan-500/35 hover:border-cyan-400 rounded-xl p-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer" onclick="renderStudyContent('${sub.id}')">
                                <div class="flex items-start justify-between gap-2 mb-3">
                                    <span class="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-base group-hover:scale-110 transition">
                                        <i class="fa-solid fa-book-open-reader"></i>
                                    </span>
                                    <span class="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-accentCyan/20 text-accentCyan border border-accentCyan/30">Master Page</span>
                                </div>
                                <div class="space-y-1 mb-4">
                                    <h4 class="text-sm font-extrabold text-white group-hover:text-cyan-300 transition leading-snug">${sub.name}</h4>
                                    <p class="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">Full-screen interactive master reader with rule search, vector overlays, and practice engine.</p>
                                </div>
                                <div class="flex items-center justify-between pt-2 border-t border-white/5">
                                    <span class="text-[9px] text-gray-500 font-bold uppercase">${data && data.difficulty ? data.difficulty : 'Master'}</span>
                                    <button class="px-3 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 group-hover:bg-cyan-500 group-hover:text-black transition">
                                        Launch Module &rarr;
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            ` : ''}

            <div class="space-y-4 pt-2">
                <div class="flex items-center justify-between pb-1 border-b border-white/5">
                    <h3 class="text-xs font-extrabold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                        <i class="fa-solid fa-grid-2 text-accentGreen"></i> All Syllabus Topics (${items.length})
                    </h3>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                    ${items.map(sub => {
                        const data = window.STUDY_DATA ? window.STUDY_DATA[sub.id] : null;
                        const isPage = !!(data && data.page);
                        const isRead = window.USER_STATE && window.USER_STATE.studySubtopics && window.USER_STATE.studySubtopics[sub.id] && window.USER_STATE.studySubtopics[sub.id].read;
                        const subjectId = sub.subjectId || 'quant';
                        const diffCls = difficultyClass(data ? data.difficulty : 'medium');

                        return `
                            <div class="bg-bgCard/50 hover:bg-bgCard/80 border ${isRead ? 'border-accentGreen/40 bg-accentGreen/5' : (isPage ? 'border-cyan-500/30' : 'border-white/10')} hover:border-accentCyan/40 rounded-xl p-3.5 shadow-md backdrop-blur-xl flex flex-col justify-between gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group" onclick="renderStudyContent('${sub.id}')">
                                <div class="flex items-start justify-between gap-2">
                                    <div class="flex items-center gap-2">
                                        <span class="w-7 h-7 rounded-lg ${isPage ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-300'} flex items-center justify-center text-xs">
                                            <i class="fa-solid ${isPage ? 'fa-file-lines' : 'fa-book-bookmark'}"></i>
                                        </span>
                                        <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">${subjectId}</span>
                                    </div>
                                    <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isRead ? 'bg-accentGreen/20 text-accentGreen border border-accentGreen/40' : 'bg-white/5 text-gray-600'}">
                                        <i class="fa-solid ${isRead ? 'fa-check' : 'fa-circle'}"></i>
                                    </span>
                                </div>

                                <div>
                                    <h5 class="text-xs font-bold text-white group-hover:text-accentCyan transition leading-snug line-clamp-2">${sub.name}</h5>
                                </div>

                                <div class="flex items-center justify-between pt-2 border-t border-white/5">
                                    <span class="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${diffCls}">${data ? (data.difficulty || 'medium') : 'medium'}</span>
                                    <span class="text-[9px] font-bold text-accentCyan group-hover:underline flex items-center gap-1">
                                        ${isPage ? 'Open Page' : 'Read Note'} &rarr;
                                    </span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;

    return html;
}

function renderStudyTree(items) {
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
                        <div class="flex items-center justify-between p-3.5 hover:bg-white/10 cursor-pointer transition select-none backdrop-blur-xl" onclick="renderStudyContent('${sub.id}')">
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
                            <span class="text-[9px] text-gray-500 font-extrabold uppercase bg-white/5 px-2 py-0.5 border border-white/10 rounded-full hover:text-white transition">Read →</span>
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
            <div class="divide-y divide-white/10 bg-bgCard/50 border border-white/10 rounded-2xl backdrop-blur-xl">
                ${items.map(sub => `
                    <div class="flex items-center justify-between p-3.5 hover:bg-white/10 cursor-pointer transition select-none backdrop-blur-xl" onclick="renderStudyContent('${sub.id}')">
                        <div class="flex items-center gap-3">
                            <span class="text-xs text-gray-300 font-semibold">${sub.name}</span>
                            <span class="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                sub.difficulty.toLowerCase() === 'easy' ? 'bg-accentGreen/10 text-accentGreen border border-accentGreen/20' :
                                sub.difficulty.toLowerCase() === 'hard' ? 'bg-accentRose/10 text-accentRose border border-accentRose/20' :
                                'bg-accentAmber/10 text-accentAmber border border-accentAmber/20'
                            }">${sub.difficulty}</span>
                        </div>
                        <span class="text-[9px] text-gray-500 font-extrabold uppercase bg-white/5 px-2 py-0.5 border border-white/10 rounded-full">Read →</span>
                    </div>
                `).join('')}
            </div>
        </div>`;
    }
    
    const topics = {};
    items.forEach(it => {
        topics[it.topicId] = { name: it.topicName, count: (topics[it.topicId]?.count || 0) + 1 };
    });
    
    return `
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        ${Object.keys(topics).map(tId => `
            <div class="cursor-pointer bg-bgCard/50 border border-white/10 hover:border-accentCyan/30 p-4 rounded-xl backdrop-blur-xl flex items-center gap-3 hover:bg-white/10 transition" onclick="setStudyExplorerChapter('${tId}')">
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
        const topic = subject && subject.topics ? subject.topics.find(t => t.id === studyState.chapter) : null;
        breadcrumbEl.innerHTML = `
            <span class="cursor-pointer hover:text-white" onclick="setStudyExplorerChapter(null)">${subject ? subject.name : 'Subjects'}</span>
            <span class="text-gray-600 mx-1.5">/</span>
            <span class="text-white font-bold">${topic ? topic.name : 'Topics'}</span>
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
            case 'command':
                html = renderStudyCommandHub(items);
                break;
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
    
    setTimeout(triggerMathTypesetting, 50);
}

function renderStudyCompact(items) {
    return `
    <div class="bg-bgCard/50 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
        <ul class="space-y-2.5">
            ${items.map(sub => `
                <li class="flex items-center justify-between text-xs border-b border-white/10 pb-2 last:border-0 last:pb-0">
                    <span class="cursor-pointer font-medium text-gray-300 hover:text-accentCyan transition" onclick="renderStudyContent('${sub.id}')">${sub.name}</span>
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
            <div class="bg-bgCard/50 border border-white/10 hover:border-accentCyan/30 rounded-xl p-4 shadow-md backdrop-blur-xl flex flex-col justify-between cursor-pointer hover:-translate-y-0.5 transition duration-200" onclick="renderStudyContent('${sub.id}')">
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
                <div class="flex justify-between items-center text-[10px] text-gray-500 pt-2 border-t border-white/10 mt-2">
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
            <div class="bg-bgCard/50 border border-white/10 rounded-2xl p-3 backdrop-blur-xl flex flex-col min-h-[300px]">
                <div class="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                    <h4 class="text-xs font-bold text-white uppercase tracking-wider">${col.name}</h4>
                    <span class="px-2 py-0.5 bg-white/5 border border-white/5 text-[9px] font-mono text-gray-400 rounded-full">${col.list.length}</span>
                </div>
                <div class="space-y-2 flex-grow overflow-y-auto scrollbar-thin">
                    ${col.list.length === 0 ? `
                        <div class="text-center text-[10px] text-gray-600 italic py-6">No notes here</div>
                    ` : col.list.map(sub => `
                        <div class="bg-bgCard/50 border border-white/10 hover:border-accentCyan/30 rounded-xl p-3 cursor-pointer hover:bg-white/10 backdrop-blur-xl transition" onclick="renderStudyContent('${sub.id}')">
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
    <div class="overflow-x-auto rounded-2xl border border-white/10 bg-bgCard/50 backdrop-blur-xl">
        <table class="w-full text-left divide-y divide-white/10 border-collapse">
            <thead>
                <tr class="bg-white/5 text-[9.5px] font-extrabold uppercase text-gray-400 tracking-wider">
                    <th class="px-4 py-3">Topic / Subtopic</th>
                    <th class="px-4 py-3">Chapter</th>
                    <th class="px-4 py-3">Difficulty</th>
                    <th class="px-4 py-3">ROI</th>
                    <th class="px-4 py-3 text-right">Action</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-white/10 text-xs">
                ${items.map(sub => `
                    <tr class="hover:bg-white/[0.02] transition">
                        <td class="px-4 py-2.5 font-bold text-white cursor-pointer hover:text-accentCyan" onclick="renderStudyContent('${sub.id}')">${sub.name}</td>
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
                            <button class="text-accentCyan hover:text-cyan-400 font-bold uppercase text-[9px] bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded" onclick="renderStudyContent('${sub.id}')">Read</button>
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

// Load and render all Quick Reference Tables from TOOLKIT_STATIC_DATA.tables
function showQuickRefTables() {
    // Show topic area, hide others
    document.getElementById("study-subject-grid").classList.add("hidden");
    document.getElementById("study-custom-notes-area").classList.add("hidden");

    const topicArea = document.getElementById("study-topic-area");
    topicArea.classList.remove("hidden");

    // Update header
    const titleEl = document.getElementById("study-active-subject-title");
    if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-table-list text-accentAmber mr-2"></i> Quick Reference Tables`;

    // Hook back button
    const backBtn = document.getElementById("btn-study-back-grid");
    if (backBtn) backBtn.onclick = backToSubjects;

    // Hide filter/search/breadcrumb UI — not needed for static tables
    const filterRow = document.getElementById("study-filter-row");
    if (filterRow) filterRow.innerHTML = "";
    const breadcrumb = document.getElementById("study-breadcrumb");
    if (breadcrumb) breadcrumb.classList.add("hidden");
    const sortWrap = document.getElementById("study-sort-dropdown-wrap");
    if (sortWrap) sortWrap.innerHTML = "";
    const viewWrap = document.getElementById("study-view-dropdown-wrap");
    if (viewWrap) viewWrap.innerHTML = "";
    const searchInput = document.getElementById("study-search");
    if (searchInput) searchInput.style.display = "none";

    const mount = document.getElementById("study-view-mount");
    if (!mount) return;

    // Read from pre-compiled inline data — no fetch() needed (file:// compatible)
    const tables = (typeof TOOLKIT_STATIC_DATA !== "undefined" && TOOLKIT_STATIC_DATA.tables)
        ? TOOLKIT_STATIC_DATA.tables
        : null;

    if (!tables || tables.length === 0) {
        mount.innerHTML = `<div class="text-center text-xs text-accentRose py-8"><i class="fa-solid fa-triangle-exclamation mr-1.5"></i>Reference tables not compiled yet. Run: <code class="bg-white/10 px-1 rounded">node compile_data.js</code></div>`;
        return;
    }

    const accentCycle = [
        { border: "border-accentCyan",   text: "text-accentCyan",   bg: "bg-accentCyan/10"   },
        { border: "border-accentAmber",  text: "text-accentAmber",  bg: "bg-accentAmber/10"  },
        { border: "border-accentGreen",  text: "text-accentGreen",  bg: "bg-accentGreen/10"  },
        { border: "border-accentPurple", text: "text-accentPurple", bg: "bg-accentPurple/10" },
        { border: "border-accentRose",   text: "text-accentRose",   bg: "bg-accentRose/10"   },
    ];

    let html = `<div class="space-y-5 pb-4">`;
    tables.forEach((item, idx) => {
        const col = accentCycle[idx % accentCycle.length];
        html += `
        <div class="bg-bgCard border border-white/5 rounded-2xl overflow-hidden shadow-md">
            <div class="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <span class="w-7 h-7 rounded-lg ${col.bg} ${col.border} border flex items-center justify-center text-xs ${col.text} font-extrabold">${idx + 1}</span>
                <h4 class="font-heading font-extrabold text-sm text-white">${item.title}</h4>
            </div>
            <div class="p-4 text-xs text-gray-300 overflow-x-auto">
                ${parseMarkdown(item.content)}
            </div>
        </div>`;
    });
    html += `</div>`;
    mount.innerHTML = html;

    // Style all rendered tables
    mount.querySelectorAll("table").forEach(table => {
        table.className = "w-full text-xs border-collapse min-w-[320px]";
        table.querySelectorAll("th").forEach(th => {
            th.className = "bg-white/5 text-accentCyan font-bold text-left px-3 py-2 border border-white/10 whitespace-nowrap";
        });
        table.querySelectorAll("td").forEach(td => {
            td.className = "px-3 py-1.5 border border-white/5 text-gray-200 whitespace-nowrap";
        });
        // Alternating row shading
        table.querySelectorAll("tr:nth-child(even)").forEach(tr => {
            tr.querySelectorAll("td").forEach(td => td.classList.add("bg-white/[0.02]"));
        });
    });

    // Highlight bold values (n², n³, answers) in amber
    mount.querySelectorAll("td strong").forEach(el => {
        el.className = "text-accentAmber font-bold";
    });

    setTimeout(triggerMathTypesetting, 100);
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

    // Restore study-search input in case it was hidden by Quick Ref Tables view
    const studySearch = document.getElementById("study-search");
    if (studySearch) studySearch.style.display = "";
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

// Render inline study content from pre-compiled STUDY_DATA
function renderStudyContent(subtopicId) {
    const data = window.STUDY_DATA ? window.STUDY_DATA[subtopicId] : null;
    if (!data) return;
    
    // Handle full-screen page subtopics (e.g., India Atlas)
    if (data.page) {
        openFullscreenPage(data.page, subtopicId);
        return;
    }
    
    const subtopic = findSubtopicById(subtopicId);
    if (!subtopic) return;
    
    currentReadingSubtopic = subtopic;
    
    const subjectGrid = document.getElementById("study-subject-grid");
    const topicArea = document.getElementById("study-topic-area");
    const contentViewer = document.getElementById("study-content-viewer");
    if (!contentViewer) return;
    
    if (subjectGrid) subjectGrid.classList.add("hidden");
    if (topicArea) topicArea.classList.add("hidden");
    contentViewer.classList.remove("hidden");
    contentViewer.classList.add("study-zone");
    contentViewer.setAttribute("data-subject", data.subject);
    
    const iconEl = document.getElementById("content-subject-icon");
    if (iconEl) {
        iconEl.innerHTML = `<i class="fa-solid ${data.subjectIcon || 'fa-book'} text-${data.subjectColor || 'accentCyan'}"></i>`;
    }
    
    const titleEl = document.getElementById("content-title");
    if (titleEl) titleEl.textContent = data.title;
    
    const cleanSubjectName = subtopic.subjectName.replace(/^[\p{Emoji}\s]+/u, "").trim();
    const pathParts = cleanSubjectName === subtopic.topicName
        ? cleanSubjectName
        : `${cleanSubjectName} → ${subtopic.topicName}`;
    const crumbEl = document.getElementById("content-breadcrumb");
    if (crumbEl) {
        crumbEl.textContent = pathParts;
        crumbEl.classList.remove("hidden");
    }
    
    const tagsEl = document.getElementById("content-tags");
    if (tagsEl) {
        tagsEl.innerHTML = data.tags.map(tag =>
            `<span class="tag-pill">${tag}</span>`
        ).join('');
    }
    
    const diffEl = document.getElementById("content-difficulty");
    if (diffEl) {
        diffEl.textContent = data.difficulty.toUpperCase();
        const diffClass = data.difficulty === 'easy'
            ? 'text-green-400 border-green-500/25 bg-green-500/10'
            : data.difficulty === 'hard'
            ? 'text-accentRose border-accentRose/25 bg-accentRose/10'
            : 'text-accentAmber border-accentAmber/25 bg-accentAmber/10';
        diffEl.className = `text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest ${diffClass}`;
    }
    
    const container = document.getElementById("content-document-body");
    if (!container) return;
    
    let html = '';
    data.sections.forEach((section, idx) => {
        const sectionIcons = {
            formula: 'fa-calculator',
            table: 'fa-table',
            tip: 'fa-lightbulb',
            example: 'fa-play',
            note: 'fa-info',
        };
        const icon = sectionIcons[section.type] || 'fa-file';
        const cardClass = section.type === 'tip' || section.type === 'note'
            ? 'fact-card note-card' : 'section-card';
        
        html += `<div class="${cardClass}">`;
        if (section.title) {
            html += `<h4 class="flex items-center gap-1.5">
                <i class="fa-solid ${icon}"></i>
                ${section.title}
            </h4>`;
        }
        html += `<div class="reader-content">${section.html}</div>`;
        html += `</div>`;
    });
    
    container.innerHTML = html;
    
    updateViewerActionButtons(subtopicId);
    setupScrollProgressTracker();
    
    const progressLabel = document.getElementById("content-progress-label");
    if (progressLabel) {
        const progress = progressStore[subtopicId] || {};
        if (progress.learned) progressLabel.textContent = 'Learned';
        else if (progress.starred || progress.bookmarked) progressLabel.textContent = 'In Progress';
        else progressLabel.textContent = '0% Read';
    }
    
    setTimeout(triggerMathTypesetting, 50);
    
    if (!progressStore[subtopicId]) progressStore[subtopicId] = {};
    progressStore[subtopicId].lastOpened = new Date().toISOString();
    saveProgress();
}

// Backward compat alias (also exported at bottom of file)

// Search utility to find nested subtopic object
function findSubtopicById(subtopicId) {
    if (!studyCatalog) return null;
    for (const subject of studyCatalog.subjects) {
        for (const topic of subject.topics) {
            const subtopics = topic.subtopics || [topic];
            for (const sub of subtopics) {
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
    
    const btnStar = document.getElementById("btn-content-star");
    const btnLearned = document.getElementById("btn-content-learned");
    const btnBookmark = document.getElementById("btn-content-bookmark");
    
    if (btnStar) {
        btnStar.className = progress.starred
            ? "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-accentAmber/30 bg-accentAmber/10 text-accentAmber transition"
            : "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/5 bg-white/5 text-gray-400 hover:text-white transition";
        btnStar.querySelector("i").className = progress.starred ? "fa-solid fa-star" : "fa-regular fa-star";
    }
    if (btnLearned) {
        btnLearned.className = progress.learned
            ? "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-accentGreen/30 bg-accentGreen/10 text-accentGreen transition"
            : "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/5 bg-white/5 text-gray-400 hover:text-white transition";
        btnLearned.querySelector("i").className = progress.learned ? "fa-solid fa-circle-check" : "fa-regular fa-circle-check";
    }
    if (btnBookmark) {
        btnBookmark.className = progress.bookmarked
            ? "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-accentCyan/30 bg-accentCyan/10 text-accentCyan transition"
            : "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/5 bg-white/5 text-gray-400 hover:text-white transition";
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
    
    // Refresh tracker state without changing view visibility
    activeSubjectId = currentReadingSubtopic.subjectId;
    studyState.activeSubject = currentReadingSubtopic.subjectId;
    renderStudyTrackerAll();
}

function saveProgress() {
    try {
        localStorage.setItem("studyProgress", JSON.stringify(progressStore));
    } catch (e) {
        console.error("Failed to save studyProgress to localStorage:", e);
    }
}

function closeStudyViewer() {
    const viewer = document.getElementById("study-content-viewer");
    const topicArea = document.getElementById("study-topic-area");
    const subjectGrid = document.getElementById("study-subject-grid");
    
    if (viewer) viewer.classList.add("hidden");
    if (topicArea) topicArea.classList.add("hidden");
    if (subjectGrid) subjectGrid.classList.remove("hidden");
    
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
    const container = document.getElementById("content-document-body");
    const pctLabel = document.getElementById("content-progress-pct");
    if (!container || !pctLabel) return;
    
    pctLabel.innerText = "0%";
    
    container.onscroll = () => {
        const total = container.scrollHeight - container.clientHeight;
        if (total <= 0) {
            pctLabel.innerText = "100%";
            return;
        }
        const pct = Math.min(100, Math.round((container.scrollTop / total) * 100));
        pctLabel.innerText = `${pct}%`;
    };
}

// Previous/Next Topic cycling
function navigateViewer(direction) {
    if (!currentReadingSubtopic || !studyCatalog) return;
    
    const flatIds = [];
    studyCatalog.subjects.forEach(subject => {
        subject.topics.forEach(topic => {
            const subtopics = topic.subtopics || [topic];
            subtopics.forEach(sub => {
                flatIds.push(sub.id);
            });
        });
    });
    
    const currIdx = flatIds.indexOf(currentReadingSubtopic.id);
    if (currIdx === -1) return;
    
    let targetIdx = currIdx + direction;
    if (targetIdx < 0) targetIdx = flatIds.length - 1;
    else if (targetIdx >= flatIds.length) targetIdx = 0;
    
    renderStudyContent(flatIds[targetIdx]);
}

// Set up Global Search listeners and display
function setupGlobalSearch() {
    const searchInput = document.getElementById("study-global-search");
    const searchResults = document.getElementById("study-search-results");
    const searchList = document.getElementById("study-search-list");
    
    if (!searchInput || !searchResults || !searchList) return;
    
    searchInput.oninput = () => {
        const query = searchInput.value.trim().toLowerCase();
        
        // Filter direct surface cards in real-time on the Study page
        if (studyCatalog && studyCatalog.subjects) {
            renderSubjectGrid(studyCatalog.subjects, query);
        }

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
                    renderStudyContent(match.subtopicId);
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
            <div class="bg-white/2px border-l-2 ${catBorder} border-t border-r border-b border-white/5 rounded-lg p-3 relative hover:bg-white/10 transition">
                <div class="flex justify-between items-start gap-2">
                    <h5 class="text-xs font-bold text-white">${escapeHTML(n.title)}</h5>
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
        if (window.showToast) window.showToast("Note deleted successfully", "error");
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

// Open full-screen page overlay (for atlas, maps, and special topic pages)
function openFullscreenPage(pagePath, subtopicId) {
    const overlay = document.getElementById("fullscreen-page");
    const iframe = document.getElementById("fullscreen-page-frame");
    if (!overlay || !iframe) return;
    
    currentReadingSubtopic = subtopicId ? findSubtopicById(subtopicId) : null;
    iframe.src = pagePath;
    overlay.classList.remove("hidden");
    overlay.classList.remove("opacity-0", "pointer-events-none");
    setTimeout(() => overlay.classList.add("opacity-100"), 10);
    document.body.style.overflow = "hidden";
}

// Close full-screen page overlay
function closeFullscreenPage() {
    const overlay = document.getElementById("fullscreen-page");
    if (!overlay) return;
    
    overlay.classList.add("opacity-0", "pointer-events-none");
    setTimeout(() => {
        overlay.classList.add("hidden");
        const iframe = document.getElementById("fullscreen-page-frame");
        if (iframe) iframe.src = "";
        document.body.style.overflow = "";
    }, 300);
    currentReadingSubtopic = null;
}

// Global keydown: 'b' closes any active viewer/overlay
document.addEventListener("keydown", (e) => {
    // Only intercept 'b' when NOT typing in an input field
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.target.isContentEditable) return;
    
    if (e.key === "b" || e.key === "B") {
        const fullscreen = document.getElementById("fullscreen-page");
        if (fullscreen && !fullscreen.classList.contains("hidden")) {
            closeFullscreenPage();
            e.preventDefault();
            return;
        }
        const contentViewer = document.getElementById("study-content-viewer");
        if (contentViewer && !contentViewer.classList.contains("hidden")) {
            if (window.closeStudyViewer) window.closeStudyViewer();
            e.preventDefault();
            return;
        }
    }
});

// Close button in fullscreen overlay
const fullscreenCloseBtn = document.getElementById("btn-fullscreen-close");
if (fullscreenCloseBtn) fullscreenCloseBtn.addEventListener("click", closeFullscreenPage);

// Listen for close requests from iframe (e.g., atlas page close button)
window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "closeFullscreen") closeFullscreenPage();
});



// Expose elements globally
window.renderToolkit = renderToolkit;
window.renderToolkitSubTab = renderToolkitSubTab;
window.deleteNote = deleteNote;
window.openStudyViewer = renderStudyContent;
window.renderStudyContent = renderStudyContent;
window.openFullscreenPage = openFullscreenPage;
window.closeFullscreenPage = closeFullscreenPage;
window.showQuickRefTables = showQuickRefTables;
window.initStudyPage = initStudyPage;
window.closeStudyViewer = closeStudyViewer;
window.navigateViewer = navigateViewer;
