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
    const meta = { tags: [] };
    if (!text.startsWith("---")) return meta;
    
    const parts = text.split("---");
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

// Display detailed topic hierarchy accordion for selected subject
function showSubjectDetail(subjectId) {
    if (!studyCatalog) return;
    const subject = studyCatalog.subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    activeSubjectId = subjectId;
    
    document.getElementById("study-subject-grid").classList.add("hidden");
    document.getElementById("study-custom-notes-area").classList.add("hidden");
    
    const detailArea = document.getElementById("study-topic-area");
    detailArea.classList.remove("hidden");
    
    const titleEl = document.getElementById("study-active-subject-title");
    if (titleEl) {
        titleEl.innerHTML = `<i class="fa-solid ${subject.icon} text-accentCyan mr-1.5"></i> ${subject.name}`;
    }
    
    const topicsList = document.getElementById("study-topics-list");
    if (topicsList) {
        topicsList.innerHTML = "";
        
        subject.topics.forEach((topic) => {
            const accordion = document.createElement("div");
            accordion.className = "border border-white/5 rounded-2xl overflow-hidden bg-white/2px transition duration-300";
            
            let subtopicsHtml = "";
            topic.subtopics.forEach(sub => {
                const progress = progressStore[sub.id] || {};
                const starIcon = progress.starred ? '<i class="fa-solid fa-star text-accentAmber mr-1.5" title="Important Reference"></i>' : '';
                const learnedIcon = progress.learned ? '<i class="fa-solid fa-circle-check text-accentGreen mr-1.5" title="Marked Learned"></i>' : '';
                const bookmarkIcon = progress.bookmarked ? '<i class="fa-solid fa-bookmark text-accentCyan mr-1.5" title="Bookmarked"></i>' : '';
                
                subtopicsHtml += `
                    <div class="flex items-center justify-between p-3.5 hover:bg-white/5 border-b border-white/5 last:border-b-0 cursor-pointer transition select-none" onclick="openStudyViewer('${sub.id}')">
                        <div class="flex items-center gap-2">
                            <span class="text-xs text-gray-300 font-semibold">${sub.name}</span>
                            <div class="flex items-center gap-0.5 text-[10px]">
                                ${starIcon}${learnedIcon}${bookmarkIcon}
                            </div>
                        </div>
                        <span class="text-[9px] text-gray-500 font-extrabold uppercase bg-white/2px px-2 py-0.5 border border-white/5 rounded-full">Study →</span>
                    </div>
                `;
            });
            
            accordion.innerHTML = `
                <div class="flex items-center justify-between p-4 bg-white/5 cursor-pointer font-heading font-extrabold text-xs text-white uppercase tracking-wider select-none border-b border-white/5 transition" onclick="toggleAccordion(this)">
                    <span>${topic.name}</span>
                    <i class="fa-solid fa-chevron-down transition duration-200"></i>
                </div>
                <div class="accordion-content transition-all duration-300 ease-in-out" style="max-height: 0px; overflow: hidden;">
                    ${subtopicsHtml}
                </div>
            `;
            
            topicsList.appendChild(accordion);
        });
    }
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
            
            // Slice off frontmatter block
            const bodyText = rawText.startsWith("---") ? rawText.split("---").slice(2).join("---").trim() : rawText;
            
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

// Typeset Math rendering
function triggerMathTypesetting() {
    if (window.renderMathInElement) {
        window.renderMathInElement(document.body, {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false}
            ],
            throwOnError: false
        });
    } else if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise().catch(err => console.log('MathJax error:', err));
    }
}

// Expose elements globally
window.renderToolkit = renderToolkit;
window.renderToolkitSubTab = renderToolkitSubTab;
window.deleteNote = deleteNote;
window.openStudyViewer = openStudyViewer;
window.initStudyPage = initStudyPage;
