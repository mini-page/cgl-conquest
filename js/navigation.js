// === NAVIGATION & THEMING MODULE ===
let navExpanded = true;
let lastShiftTime = 0;

function openShortcutsHelpModal() {
    const modal = document.getElementById("modal-shortcuts-help");
    if (modal) {
        modal.classList.add("active");
        modal.classList.remove("opacity-0", "pointer-events-none");
    }
}

function closeShortcutsHelpModal() {
    const modal = document.getElementById("modal-shortcuts-help");
    if (modal) {
        modal.classList.remove("active");
        modal.classList.add("opacity-0", "pointer-events-none");
    }
}


function expandNav() {
    if (navExpanded) return;
    navExpanded = true;
    const mobileFloatingNav = document.getElementById("mobile-floating-nav");
    if (mobileFloatingNav) mobileFloatingNav.classList.remove("nav-shrunk");
}

function shrinkNav() {
    if (!navExpanded) return;
    navExpanded = false;
    const mobileFloatingNav = document.getElementById("mobile-floating-nav");
    if (mobileFloatingNav) mobileFloatingNav.classList.add("nav-shrunk");
}

// Header Scroll Shrink (Floating Island Dock UI)
function initHeaderScroll() {
    let lastScrollY = window.scrollY;
    const mobileFloatingNav = document.getElementById("mobile-floating-nav");
    const navTrigger = document.getElementById("floating-nav-trigger");
    
    // Set initial active state of floating bottom bar
    if (mobileFloatingNav) {
        mobileFloatingNav.classList.remove("translate-y-28", "opacity-0");
        mobileFloatingNav.classList.add("translate-y-0", "opacity-100");

        // Double tap or double click to scroll to top when shrunk
        mobileFloatingNav.addEventListener("dblclick", () => {
            if (mobileFloatingNav.classList.contains("nav-shrunk")) {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
        
        let lastTap = 0;
        mobileFloatingNav.addEventListener("touchstart", (e) => {
            if (!mobileFloatingNav.classList.contains("nav-shrunk")) return;
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 300 && tapLength > 0) {
                window.scrollTo({ top: 0, behavior: "smooth" });
                e.preventDefault();
            }
            lastTap = currentTime;
        });
    }
    
    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 40 && currentScrollY > lastScrollY) {
            // Scrolling down: shrink floating bottom nav
            shrinkNav();
        } else if (currentScrollY < lastScrollY || currentScrollY <= 40) {
            // Scrolling up or near top: expand floating bottom nav
            expandNav();
        }
        lastScrollY = currentScrollY;
    });

    if (navTrigger) {
        navTrigger.addEventListener("click", (e) => {
            e.stopPropagation();
            expandNav();
        });
        navTrigger.addEventListener("touchstart", (e) => {
            e.stopPropagation();
            expandNav();
        });
    }
}


// Reusable programmatic navigation controller
function navigateToPage(target, updateHash = true) {
    const navItems = document.querySelectorAll(".nav-item, .mobile-nav-item");
    const pages = document.querySelectorAll(".content-page");
    const mobileMenu = document.getElementById("mobile-menu");
    
    if (window.drillIsPlaying) {
        const pauseBtn = document.getElementById("btn-drill-pause");
        if (pauseBtn) {
            const span = pauseBtn.querySelector("span");
            if (span && span.innerText.trim() === "Pause") {
                pauseBtn.click();
            }
        }
        if (window.startIdleTimer) {
            window.startIdleTimer();
        }
    }
    
    navItems.forEach(ni => ni.classList.remove("active-nav"));
    pages.forEach(p => p.classList.add("hidden"));
    
    // Highlight both desktop and mobile items matching target
    document.querySelectorAll(`[data-target="${target}"]`).forEach(ni => ni.classList.add("active-nav"));
    
    const targetPage = document.getElementById(target);
    if (targetPage) {
        targetPage.classList.remove("hidden");
    }
    
    // Dynamically update the global sticky top bar header page title and icon
    const globalPageTitle = document.getElementById("global-page-title");
    const globalPageIcon = document.getElementById("global-page-icon");
    if (globalPageTitle) {
        let friendlyName = "Dashboard";
        let iconClass = '<i class="fa-solid fa-chart-line text-accentCyan"></i>';
        
        if (target === "page-syllabus") {
            friendlyName = "Syllabus";
            iconClass = '<i class="fa-solid fa-list-check text-accentGreen"></i>';
        } else if (target === "page-plan") {
            friendlyName = "Plan";
            iconClass = '<i class="fa-solid fa-calendar-days text-accentAmber"></i>';
        } else if (target === "page-mocks") {
            friendlyName = "Analysis";
            iconClass = '<i class="fa-solid fa-square-poll-vertical text-accentCyan"></i>';
        } else if (target === "page-toolkit") {
            friendlyName = "Study";
            iconClass = '<i class="fa-solid fa-toolbox text-accentPurple"></i>';
        } else if (target === "page-speed") {
            friendlyName = "Drills";
            iconClass = '<i class="fa-solid fa-bolt text-accentRose"></i>';
        }
        
        globalPageTitle.innerText = friendlyName;
        if (globalPageIcon) globalPageIcon.innerHTML = iconClass;
    }
    
    // Close mobile menu dropdown
    if (mobileMenu) {
        mobileMenu.classList.add("hidden");
    }
    
    // Trigger specific page renders
    if (target === "page-syllabus") {
        renderSyllabus();
    } else if (target === "page-plan") {
        renderStudyPlan();
    } else if (target === "page-mocks") {
        renderMockAnalytics();
    } else if (target === "page-toolkit") {
        const activeTkTab = document.querySelector(".toolkit-tab-btn.active-nav-tab");
        const activePanelId = activeTkTab ? activeTkTab.getAttribute("data-target") : "tk-quant";
        if (typeof renderToolkitSubTab === "function") {
            renderToolkitSubTab(activePanelId);
        } else {
            renderToolkit();
        }
    } else if (target === "page-speed") {
        resetDrillSession();
        setTimeout(triggerMathTypesetting, 50);
    }
    
    if (updateHash) {
        window.location.hash = target;
    }
}
window.navigateToPage = navigateToPage;

// 4. NAVIGATION & THEME LOGIC
function initNavigation() {
    const navItems = document.querySelectorAll(".nav-item, .mobile-nav-item");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");

    // Desktop/Mobile Navigation Toggling
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const target = item.getAttribute("data-target");
            navigateToPage(target, true);
        });
    });

    // Hash change event listener for browser history support
    window.addEventListener("hashchange", () => {
        const hash = window.location.hash || "#page-dashboard";
        const target = hash.replace("#", "");
        navigateToPage(target, false);
    });

    // Highlight active page on startup based on current hash
    const initialHash = window.location.hash || "#page-dashboard";
    navigateToPage(initialHash.replace("#", ""), false);

    // Mobile Hamburger Menu Toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });
    }

    // Automatically lock body scroll when any modal is open
    const modalObserver = new MutationObserver(() => {
        const activeModal = document.querySelector('.modal.active, .modal:not(.opacity-0):not(.pointer-events-none)');
        if (activeModal) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    });
    document.querySelectorAll('.modal').forEach(modal => {
        modalObserver.observe(modal, { attributes: true, attributeFilter: ['class'] });
    });

    window.addEventListener("keydown", (e) => {
        // Intercept navigation keys if study viewer modal is active
        const studyModal = document.getElementById("modal-study-viewer");
        if (studyModal && studyModal.classList.contains("active")) {
            if (e.key === "Escape" || e.key === "x" || e.key === "X") {
                if (window.closeStudyViewer) window.closeStudyViewer();
                e.preventDefault();
                return;
            }
            if (e.key === "ArrowLeft") {
                if (window.navigateViewer) window.navigateViewer(-1);
                e.preventDefault();
                return;
            }
            if (e.key === "ArrowRight") {
                if (window.navigateViewer) window.navigateViewer(1);
                e.preventDefault();
                return;
            }
        }

        // Double shift key press listener
        if (e.key === "Shift") {
            if (e.repeat) return;
            const now = Date.now();
            if (now - lastShiftTime < 300) {
                openShortcutsHelpModal();
                e.preventDefault();
            }
            lastShiftTime = now;
            return;
        }

        // Skip shortcuts if user is typing in form inputs/textarea
        const tag = document.activeElement.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || document.activeElement.isContentEditable) {
            return;
        }

        // Keybinding: U/u to scroll smoothly to the top of the browser page
        if (e.key === "u" || e.key === "U") {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            e.preventDefault();
            return;
        }

        // Intercept keys 1-4 if speed drill simulator is actively playing to select choices faster
        if (window.drillIsPlaying) {
            if (e.key === "1" || e.key === "2" || e.key === "3" || e.key === "4") {
                const choiceIdx = parseInt(e.key) - 1;
                if (window.isDrillModalActive) {
                    const modalOpts = document.querySelectorAll("#modal-drill-options button");
                    if (modalOpts[choiceIdx] && !modalOpts[choiceIdx].disabled) {
                        modalOpts[choiceIdx].click();
                    }
                } else {
                    const inlineOpts = document.querySelectorAll("#drill-options button");
                    if (inlineOpts[choiceIdx] && !inlineOpts[choiceIdx].disabled) {
                        inlineOpts[choiceIdx].click();
                    }
                }
                e.preventDefault();
                return;
            }
        }

        // 1. Spacebar: Play / Pause / Resume / Start of the drills in any mode
        if (e.key === " " || e.key === "Spacebar") {
            const speedPage = document.getElementById("page-speed");
            if (speedPage && !speedPage.classList.contains("hidden")) {
                if (window.isDrillModalActive) {
                    const modalPauseBtn = document.getElementById("btn-drill-modal-pause");
                    if (modalPauseBtn) modalPauseBtn.click();
                } else {
                    const inlinePauseBtn = document.getElementById("btn-drill-pause");
                    if (inlinePauseBtn) inlinePauseBtn.click();
                }
                e.preventDefault();
                return;
            }
        }

        // 2. P key: Toggle Pomodoro timer popover
        if (e.key === "p" || e.key === "P") {
            const pomoCapsule = document.getElementById("pomo-capsule");
            if (pomoCapsule) {
                pomoCapsule.click();
                e.preventDefault();
                return;
            }
        }

        // 2b. C key: Toggle Conquest Challenge popover
        if (e.key === "c" || e.key === "C") {
            const conquestCapsule = document.getElementById("btn-conquest-capsule");
            if (conquestCapsule) {
                conquestCapsule.click();
                e.preventDefault();
                return;
            }
        }

        // 3. X key or Escape: Stop/Close/Exit in any mode
        if (e.key === "Escape" || e.key === "x" || e.key === "X") {
            // Close help shortcuts modal first if open
            const helpModal = document.getElementById("modal-shortcuts-help");
            if (helpModal && helpModal.classList.contains("active")) {
                closeShortcutsHelpModal();
                e.preventDefault();
                return;
            }
            const speedPage = document.getElementById("page-speed");
            if (speedPage && !speedPage.classList.contains("hidden")) {
                if (window.isDrillModalActive) {
                    const modalCloseBtn = document.getElementById("btn-drill-modal-close");
                    if (modalCloseBtn) modalCloseBtn.click();
                } else {
                    const inlineStopBtn = document.getElementById("btn-drill-stop");
                    if (inlineStopBtn) inlineStopBtn.click();
                }
                e.preventDefault();
                return;
            }
        }

        // 4. Difficulty selection overrides (E/M/A/D keys when Speed Page is visible)
        const speedPage = document.getElementById("page-speed");
        if (speedPage && !speedPage.classList.contains("hidden")) {
            const levelSelect = document.getElementById("select-maths-level");
            const modalSelect = document.getElementById("modal-select-maths-level");
            const triggerChange = (val) => {
                if (levelSelect) {
                    levelSelect.value = val;
                    levelSelect.dispatchEvent(new Event("change"));
                }
                if (modalSelect) {
                    modalSelect.value = val;
                    modalSelect.dispatchEvent(new Event("change"));
                }
            };

            if (e.key === "e" || e.key === "E") {
                triggerChange("easy");
                e.preventDefault();
                return;
            } else if (e.key === "m" || e.key === "M") {
                triggerChange("medium");
                e.preventDefault();
                return;
            } else if (e.key === "a" || e.key === "A") {
                triggerChange("advance");
                e.preventDefault();
                return;
            } else if (e.key === "d" || e.key === "D") {
                const current = levelSelect ? levelSelect.value : "medium";
                const nextMap = { easy: "medium", medium: "advance", advance: "easy" };
                triggerChange(nextMap[current] || "medium");
                e.preventDefault();
                return;
            }
        }

        if (window.drillIsPlaying) {
            if (["1", "2", "3", "4", "5", "6"].includes(e.key)) {
                return;
            }
        }

        if (e.key === "3") {
            const activePage = document.querySelector('.content-page:not(.hidden)');
            const activeId = activePage ? activePage.id : '';
            
            if (activeId !== 'page-syllabus') {
                const navBtn = document.querySelector(`.nav-item[data-target="page-syllabus"]`);
                if (navBtn) {
                    navBtn.click();
                }
                if (window.syllabusState) {
                    window.syllabusState.studyMode = true;
                    if (window.renderSyllabus) window.renderSyllabus();
                }
            } else {
                if (window.syllabusState) {
                    window.syllabusState.studyMode = !window.syllabusState.studyMode;
                    if (window.renderSyllabus) window.renderSyllabus();
                }
            }
            e.preventDefault();
            return;
        }

        let targetPage = "";
        if (e.key === "1") targetPage = "page-dashboard";
        else if (e.key === "2") targetPage = "page-syllabus";
        else if (e.key === "4") targetPage = "page-speed";
        else if (e.key === "5") targetPage = "page-plan";
        else if (e.key === "6") targetPage = "page-mocks";
        else if (e.key === "t" || e.key === "T") {
            const themeBtn = document.getElementById("theme-toggle");
            if (themeBtn) {
                themeBtn.click();
                e.preventDefault();
            }
            return;
        }
        else if (e.key === "v" || e.key === "V") {
            const speechBtn = document.getElementById("speech-toggle");
            if (speechBtn) {
                speechBtn.click();
                e.preventDefault();
            }
            return;
        }
        else if (e.key === "n" || e.key === "N") {
            const toastBtn = document.getElementById("toast-toggle");
            if (toastBtn) {
                toastBtn.click();
                e.preventDefault();
            }
            return;
        }

        if (targetPage) {
            const navBtn = document.querySelector(`.nav-item[data-target="${targetPage}"]`);
            if (navBtn) {
                navBtn.click();
                e.preventDefault();
            }
        }
    });
}

function updateThemeToggleUI(theme) {
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        const knob = themeBtn.querySelector("#theme-toggle-knob");
        if (knob) {
            if (theme === "light") {
                themeBtn.classList.remove("bg-white/5", "border-white/5");
                themeBtn.classList.add("bg-indigo-600/20", "border-indigo-600/40");
                knob.style.transform = "translateX(20px)";
                knob.innerHTML = '<i class="fa-solid fa-sun text-amber-500"></i>';
            } else {
                themeBtn.classList.remove("bg-indigo-600/20", "border-indigo-600/40");
                themeBtn.classList.add("bg-white/5", "border-white/5");
                knob.style.transform = "translateX(0px)";
                knob.innerHTML = '<i class="fa-solid fa-moon text-slate-900"></i>';
            }
        }
    }
}

function updateSpeechToggleUI() {
    const speechBtn = document.getElementById("speech-toggle");
    if (speechBtn) {
        const knob = speechBtn.querySelector("#speech-toggle-knob");
        if (knob) {
            if (appState.speechEnabled !== false) {
                speechBtn.classList.remove("bg-white/5", "border-white/5");
                speechBtn.classList.add("bg-emerald-600/20", "border-emerald-600/40");
                knob.style.transform = "translateX(20px)";
                knob.innerHTML = '<i class="fa-solid fa-volume-high text-emerald-500"></i>';
                speechBtn.title = "Mute Voice Announcements [V]";
            } else {
                speechBtn.classList.remove("bg-emerald-600/20", "border-emerald-600/40");
                speechBtn.classList.add("bg-white/5", "border-white/5");
                knob.style.transform = "translateX(0px)";
                knob.innerHTML = '<i class="fa-solid fa-volume-xmark text-slate-900"></i>';
                speechBtn.title = "Enable Voice Announcements [V]";
            }
        }
    }
}

function updateToastToggleUI() {
    const toastBtn = document.getElementById("toast-toggle");
    if (toastBtn) {
        const knob = toastBtn.querySelector("#toast-toggle-knob");
        if (knob) {
            if (appState.toastEnabled !== false) {
                toastBtn.classList.remove("bg-white/5", "border-white/5");
                toastBtn.classList.add("bg-amber-600/20", "border-amber-600/40");
                knob.style.transform = "translateX(20px)";
                knob.innerHTML = '<i class="fa-solid fa-bell text-amber-500"></i>';
                toastBtn.title = "Disable Toast Notifications [N]";
            } else {
                toastBtn.classList.remove("bg-amber-600/20", "border-amber-600/40");
                toastBtn.classList.add("bg-white/5", "border-white/5");
                knob.style.transform = "translateX(0px)";
                knob.innerHTML = '<i class="fa-solid fa-bell-slash text-slate-900"></i>';
                toastBtn.title = "Enable Toast Notifications [N]";
            }
        }
    }
}

function toggleThemeMode() {
    appState.theme = appState.theme === "dark" ? "light" : "dark";
    updateMetaThemeColor(appState.theme);
    if (appState.theme === "light") {
        document.body.classList.add("light-theme");
        document.documentElement.classList.remove("dark");
    } else {
        document.body.classList.remove("light-theme");
        document.documentElement.classList.add("dark");
    }
    updateThemeToggleUI(appState.theme);
    saveStateToStorage();
    
    // Re-render SVG Mindmap if visible to adjust colors
    const mindmap = document.getElementById("view-mindmap");
    if (mindmap && !mindmap.classList.contains("hidden") && typeof renderMindMap === "function") {
        renderMindMap();
    }
}

function toggleSpeechMode() {
    appState.speechEnabled = !appState.speechEnabled;
    saveStateToStorage();
    updateSpeechToggleUI();
    if (appState.speechEnabled) {
        speakText("Voice announcements enabled");
    }
}

function toggleToastMode() {
    appState.toastEnabled = !appState.toastEnabled;
    saveStateToStorage();
    updateToastToggleUI();
    if (window.showToast) {
        window.showToast(appState.toastEnabled ? "Toast notifications enabled" : "Toast notifications disabled", "info");
    }
}

function initTheme() {
    const themeBtn = document.getElementById("theme-toggle");
    const speechBtn = document.getElementById("speech-toggle");
    const toastBtn = document.getElementById("toast-toggle");
    
    // Bind help shortcuts close button
    const btnShortcutsClose = document.getElementById("btn-shortcuts-close");
    if (btnShortcutsClose) {
        btnShortcutsClose.onclick = () => closeShortcutsHelpModal();
    }

    // Bind help shortcuts island trigger button
    const btnShortcutsTrigger = document.getElementById("btn-shortcuts-island-trigger");
    if (btnShortcutsTrigger) {
        btnShortcutsTrigger.onclick = (e) => {
            e.stopPropagation();
            openShortcutsHelpModal();
        };
    }
    
    // Apply theme classes
    updateMetaThemeColor(appState.theme);
    if (appState.theme === "light") {
        document.body.classList.add("light-theme");
        document.documentElement.classList.remove("dark");
    } else {
        document.body.classList.remove("light-theme");
        document.documentElement.classList.add("dark");
    }
    updateThemeToggleUI(appState.theme);
    updateSpeechToggleUI();
    updateToastToggleUI();
    
    if (themeBtn) {
        themeBtn.addEventListener("click", toggleThemeMode);
    }
    if (speechBtn) {
        speechBtn.addEventListener("click", toggleSpeechMode);
    }
    if (toastBtn) {
        toastBtn.addEventListener("click", toggleToastMode);
    }

    // Bind Backup & Restore Data Management buttons
    const btnExport = document.getElementById("btn-export-backup");
    const btnRestore = document.getElementById("btn-restore-backup");
    const inputRestore = document.getElementById("input-restore-file");

    if (btnExport) {
        btnExport.onclick = () => {
            try {
                const backupData = JSON.stringify(appState, null, 2);
                const blob = new Blob([backupData], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                const dateStr = new Date().toISOString().substring(0, 10);
                a.download = `cgl_conquest_backup_${dateStr}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                if (window.showToast) window.showToast("Backup exported successfully!", "success");
            } catch (e) {
                console.error("Export backup error:", e);
                if (window.showToast) window.showToast("Failed to export backup JSON", "error");
            }
        };
    }

    if (btnRestore && inputRestore) {
        btnRestore.onclick = () => inputRestore.click();
        
        inputRestore.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const data = JSON.parse(evt.target.result);
                    if (typeof data !== "object" || data === null || !data.syllabusProgress) {
                        throw new Error("Invalid backup JSON structure.");
                    }
                    appState = { ...appState, ...data };
                    saveStateToStorage();
                    if (window.initTierToggler) window.initTierToggler();
                    if (window.updateMockFormLimits) window.updateMockFormLimits();
                    renderAll();
                    if (typeof renderMockAnalytics === "function") renderMockAnalytics();
                    if (window.showToast) window.showToast("Backup restored successfully!", "success");
                    closeShortcutsHelpModal();
                } catch (err) {
                    console.error("Backup restore error:", err);
                    if (window.showToast) window.showToast("Invalid backup JSON file", "error");
                    else alert("Failed to restore backup: Invalid JSON structure.");
                }
            };
            reader.readAsText(file);
        };
    }
}

// Meta Theme-Color updater to sync browser layout shell and tabs
function updateMetaThemeColor(theme) {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'theme-color');
        document.head.appendChild(meta);
    }
    // Deep dark background for dark mode (#0d0e12), subtle grey for light mode (#f3f4f6)
    meta.setAttribute('content', theme === 'light' ? '#f3f4f6' : '#0d0e12');
}

