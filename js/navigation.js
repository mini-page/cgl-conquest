// === NAVIGATION & THEMING MODULE ===
let navExpanded = true;
let lastShiftTime = 0;

function openShortcutsHelpModal() {
    const modal = document.getElementById("modal-shortcuts-help");
    if (modal) {
        modal.classList.add("active");
        modal.classList.remove("opacity-0", "pointer-events-none");
        // Focus search and wire filter (once)
        const s = document.getElementById("shortcuts-search");
        if (s) {
            if (!s.dataset.wired) {
                s.dataset.wired = "1";
                s.addEventListener("input", () => filterShortcuts(s.value));
                s.addEventListener("keydown", e => { if (e.key === "Escape") { closeShortcutsHelpModal(); } });
            }
            setTimeout(() => s.focus(), 80);
        }
    }
}

function closeShortcutsHelpModal() {
    const modal = document.getElementById("modal-shortcuts-help");
    if (modal) {
        modal.classList.remove("active");
        modal.classList.add("opacity-0", "pointer-events-none");
        // Clear search on close
        const s = document.getElementById("shortcuts-search");
        if (s) { s.value = ""; filterShortcuts(""); }
    }
}

// Keyword aliases so single-letter/shorthand queries find the right rows
const _SC_ALIASES = [
    { keys: ["t", "theme", "dark", "light"],                    hint: "dark / light theme" },
    { keys: ["v", "voice", "speech", "mute", "sound"],          hint: "voice announcements" },
    { keys: ["n", "notif", "toast", "bell"],                    hint: "toast notifications" },
    { keys: ["p", "pomo", "pomodoro", "timer"],                 hint: "pomodoro timer" },
    { keys: ["c", "conquest", "challenge", "fire"],             hint: "conquest challenge" },
    { keys: ["u", "scroll", "top"],                             hint: "scroll to top" },
    { keys: ["1", "dashboard", "home"],                         hint: "dashboard" },
    { keys: ["2", "syllabus", "track"],                         hint: "syllabus" },
    { keys: ["3", "study", "toolkit"],                          hint: "study / toolkit" },
    { keys: ["4", "speed", "drill", "drills"],                  hint: "speed drills" },
    { keys: ["5", "plan"],                                      hint: "study plan" },
    { keys: ["6", "mock", "mocks", "analysis"],                 hint: "mock analysis" },
    { keys: ["space", "spacebar", "start", "pause", "resume"],  hint: "start" },
    { keys: ["esc", "escape", "exit", "stop", "close", "x"],    hint: "stop" },
    { keys: ["enter", "restart", "typing"],                     hint: "enter" },
    { keys: ["alt", "alt+space", "alt+x"],                      hint: "alt" },
    { keys: ["e", "easy"],                                      hint: "easy" },
    { keys: ["m", "medium", "med"],                             hint: "medium" },
    { keys: ["a", "advance", "adv", "advanced"],                hint: "adv" },
    { keys: ["d", "cycle", "difficulty"],                       hint: "cycle" },
];

function filterShortcuts(q) {
    const raw = q.trim().toLowerCase();
    const modal = document.getElementById("modal-shortcuts-help");
    if (!modal) return;

    // Expand single-key / shorthand queries via alias table
    let lq = raw;
    if (raw) {
        const alias = _SC_ALIASES.find(a => a.keys.includes(raw));
        if (alias) lq = alias.hint;
    }

    // Filter each actionable / info row
    modal.querySelectorAll(".ac-row, .ac-toggle-row, .ac-info-row").forEach(row => {
        const match = !lq || row.textContent.toLowerCase().includes(lq);
        row.style.display = match ? "" : "none";
    });

    // Show/hide each section container (identified by having a <p> label child)
    modal.querySelectorAll(".px-5").forEach(section => {
        const label = section.querySelector("p");
        if (!label) return; // not a section block
        if (!lq) { section.style.display = ""; return; }
        const anyVisible = Array.from(
            section.querySelectorAll(".ac-row, .ac-toggle-row, .ac-info-row")
        ).some(r => r.style.display !== "none");
        section.style.display = anyVisible ? "" : "none";
    });

    // Hide section dividers while a query is active
    modal.querySelectorAll(".border-t.mx-5").forEach(hr => {
        hr.style.display = lq ? "none" : "";
    });
}


// Handle clickable action rows in the Action Center modal
function handleShortcutAction(action) {
    closeShortcutsHelpModal();
    setTimeout(() => {
        switch (action) {
            // ── Navigation ──
            case 'nav:page-dashboard':
            case 'nav:page-syllabus':
            case 'nav:page-speed':
            case 'nav:page-plan':
            case 'nav:page-mocks':
            case 'nav:page-toolkit': {
                const pageId = action.split(':')[1];
                const navBtn = document.querySelector(`.nav-item[data-target="${pageId}"]`);
                if (navBtn) navBtn.click();
                break;
            }
            case 'scroll-top':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            // ── Toggles ──
            case 'toggle-theme': {
                const btn = document.getElementById('theme-toggle');
                if (btn) btn.click();
                break;
            }
            case 'toggle-voice': {
                const btn = document.getElementById('speech-toggle');
                if (btn) btn.click();
                break;
            }
            case 'toggle-notifications': {
                const btn = document.getElementById('toast-toggle');
                if (btn) btn.click();
                break;
            }
            case 'toggle-pomodoro': {
                const btn = document.getElementById('pomo-capsule');
                if (btn) btn.click();
                break;
            }
            case 'toggle-conquest': {
                const btn = document.getElementById('btn-conquest-capsule');
                if (btn) btn.click();
                break;
            }
        }
    }, 120); // slight delay so modal fade-out plays first
}
window.handleShortcutAction = handleShortcutAction;

let currentNavAnimStyle = "magnetic"; // Permanent Animation Preset: Type 3 (Magnetic Drop)

function setNavAnimStyle(style) {
    currentNavAnimStyle = "magnetic";
    if (window.appState) window.appState.navAnimStyle = "magnetic";
    if (typeof saveStateToStorage === "function") saveStateToStorage();
}
window.setNavAnimStyle = setNavAnimStyle;

function expandNav() {
    if (navExpanded) return;
    navExpanded = true;
    const mobileFloatingNav = document.getElementById("mobile-floating-nav");
    const itemsContainer = document.getElementById("floating-nav-items");
    const triggerBtn = document.getElementById("floating-nav-trigger");

    if (mobileFloatingNav) {
        mobileFloatingNav.classList.remove("nav-shrunk");

        if (window.gsap) {
            gsap.killTweensOf([mobileFloatingNav, itemsContainer, triggerBtn, "#floating-nav-items .nav-item"]);
            const tl = gsap.timeline();

            // Preset 3: Magnetic Drop Expand (Permanent)
            if (triggerBtn) tl.to(triggerBtn, { scale: 0, opacity: 0, y: -10, duration: 0.12 }, 0);
            tl.fromTo(mobileFloatingNav, { scale: 0.6, y: 20 }, { scale: 1, y: 0, duration: 0.38, ease: "elastic.out(1, 0.6)" }, 0.02);
            tl.fromTo("#floating-nav-items .nav-item", { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.28, stagger: { amount: 0.1, from: "center" }, ease: "back.out(2)" }, 0.06);
        }
    }
}

function shrinkNav() {
    if (!navExpanded) return;
    navExpanded = false;
    const mobileFloatingNav = document.getElementById("mobile-floating-nav");
    const triggerBtn = document.getElementById("floating-nav-trigger");

    if (mobileFloatingNav) {
        if (window.gsap) {
            gsap.killTweensOf([mobileFloatingNav, triggerBtn, "#floating-nav-items .nav-item"]);

            const tl = gsap.timeline({
                onComplete: () => {
                    mobileFloatingNav.classList.add("nav-shrunk");
                }
            });

            // Preset 3: Magnetic Drop Shrink (Permanent)
            tl.to("#floating-nav-items .nav-item", { scale: 0.1, opacity: 0, duration: 0.14, stagger: { amount: 0.08, from: "center" }, ease: "power3.in" }, 0);
            tl.to(mobileFloatingNav, { scale: 0.5, y: 12, duration: 0.24, ease: "back.in(1.6)" }, 0.03);
            if (triggerBtn) tl.fromTo(triggerBtn, { scale: 0, y: 12 }, { scale: 1.15, y: 0, duration: 0.25, ease: "elastic.out(1, 0.5)" }, 0.09);
        } else {
            mobileFloatingNav.classList.add("nav-shrunk");
        }
    }
}

function setMobileNavHand(hand) {
    if (hand !== "left" && hand !== "right") return;
    if (typeof appState !== "undefined") {
        appState.mobileNavHand = hand;
    }
    if (window.appState) {
        window.appState.mobileNavHand = hand;
    }
    if (typeof saveStateToStorage === "function") saveStateToStorage();
    
    const nav = document.getElementById("mobile-floating-nav");
    if (nav && nav.classList.contains("nav-shrunk")) {
        nav.classList.remove("nav-hand-right", "nav-hand-left");
        if (window.innerWidth < 768) {
            nav.classList.add(hand === "left" ? "nav-hand-left" : "nav-hand-right");
        }
        
        if (window.gsap) {
            gsap.fromTo(nav, { scale: 0.75, rotation: hand === "left" ? -15 : 15 }, { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(1.8)" });
        }
    }
    
    updateHandSettingsUI();
    if (window.showToast) {
        window.showToast(`Mobile navigation set to ${hand === "left" ? "Left Hand" : "Right Hand"} mode`, "info");
    }
}

function updateHandSettingsUI() {
    if (!window.appState) return;
    const isLeft = window.appState.mobileNavHand === "left";

    const btnRight = document.getElementById("btn-hand-right");
    const btnLeft = document.getElementById("btn-hand-left");
    if (btnRight && btnLeft) {
        btnRight.className = `hand-btn px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${!isLeft ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-400/40' : 'bg-transparent text-gray-400 hover:text-white'}`;
        btnLeft.className = `hand-btn px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${isLeft ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-400/40' : 'bg-transparent text-gray-400 hover:text-white'}`;
    }

    const btnRightCmd = document.getElementById("btn-hand-right-cmd");
    const btnLeftCmd = document.getElementById("btn-hand-left-cmd");
    if (btnRightCmd && btnLeftCmd) {
        btnRightCmd.className = `px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${!isLeft ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`;
        btnLeftCmd.className = `px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${isLeft ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`;
    }
}
window.setMobileNavHand = setMobileNavHand;
window.updateHandSettingsUI = updateHandSettingsUI;

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
    const activeItems = document.querySelectorAll(`[data-target="${target}"]`);
    activeItems.forEach(ni => {
        ni.classList.add("active-nav");
        if (window.gsap) {
            gsap.fromTo(ni, { scale: 0.85 }, { scale: 1.12, duration: 0.35, ease: "back.out(2)" });
            const icon = ni.querySelector("i");
            if (icon) gsap.fromTo(icon, { scale: 0.7, rotation: -15 }, { scale: 1.1, rotation: 0, duration: 0.3, ease: "back.out(1.8)" });
        }
    });
    
    const targetPage = document.getElementById(target);
    if (targetPage) {
        targetPage.classList.remove("hidden");
        if (window.gsap) {
            gsap.fromTo(targetPage, { opacity: 0, y: 16, scale: 0.99 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" });
        }
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
        document.title = `Conquest • ${friendlyName}`;
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
        // Intercept navigation keys if study content viewer is active (inline)
        const contentViewer = document.getElementById("study-content-viewer");
        if (contentViewer && !contentViewer.classList.contains("hidden")) {
            if (e.key === "Escape") {
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

        // ── TYPING TEST INPUT LOCK ──────────────────────────────
        // Block ALL global shortcuts when typing test is capturing keys.
        // typingtest.js handles its own keydown in capture phase.
        if (window.typingTestActive) return;

        // Double shift key press listener
        if (e.key === "Shift") {
            if (e.repeat) return;
            const now = Date.now();
            if (now - lastShiftTime < 300) {
                // Toggle: open if closed, close if open
                const modal = document.getElementById("modal-shortcuts-help");
                if (modal && modal.classList.contains("active")) {
                    closeShortcutsHelpModal();
                } else {
                    openShortcutsHelpModal();
                }
                e.preventDefault();
            }
            lastShiftTime = now;
            return;
        }

        // Skip shortcuts if user is typing in form inputs/textarea/select
        const tag = document.activeElement ? document.activeElement.tagName : "";
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (document.activeElement && document.activeElement.isContentEditable)) {
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

        // 4. Difficulty selection overrides (E/M/A/D keys when Speed Page is visible and NO drill is actively running)
        const speedPage = document.getElementById("page-speed");
        if (speedPage && !speedPage.classList.contains("hidden") && !window.drillIsPlaying && !window.isChallengeActive) {
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

        // If drill is actively running: lock out C (Conquest), P (Pomodoro), and page navigation keys (1-6)
        if (window.drillIsPlaying || window.isChallengeActive) {
            const keyLower = e.key.toLowerCase();
            if (keyLower === "c" || keyLower === "p" || ["1", "2", "3", "4", "5", "6"].includes(e.key)) {
                return;
            }
        }

        let targetPage = "";
        if (e.key === "1") targetPage = "page-dashboard";
        else if (e.key === "2") targetPage = "page-syllabus";
        else if (e.key === "3") targetPage = "page-toolkit";
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
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    const knob = btn.querySelector("div");
    if (!knob) return;
    if (theme === "light") {
        knob.style.transform = "translateX(24px)";
        knob.innerHTML = '<i class="fa-solid fa-sun text-amber-500"></i>';
        btn.title = "Switch to Dark Mode [T]";
    } else {
        knob.style.transform = "translateX(0px)";
        knob.innerHTML = '<i class="fa-solid fa-moon text-slate-900"></i>';
        btn.title = "Switch to Light Mode [T]";
    }
}

function updateSpeechToggleUI() {
    const btn = document.getElementById("speech-toggle");
    if (!btn) return;
    const knob = btn.querySelector("div");
    if (!knob) return;
    if (appState.speechEnabled) {
        knob.style.transform = "translateX(24px)";
        knob.innerHTML = '<i class="fa-solid fa-volume-high text-accentGreen"></i>';
        btn.title = "Disable Voice Announcements [V]";
    } else {
        knob.style.transform = "translateX(0px)";
        knob.innerHTML = '<i class="fa-solid fa-volume-xmark text-slate-900"></i>';
        btn.title = "Enable Voice Announcements [V]";
    }
}

function updateToastToggleUI() {
    const btn = document.getElementById("toast-toggle");
    if (!btn) return;
    const knob = btn.querySelector("div");
    if (!knob) return;
    if (appState.toastEnabled) {
        knob.style.transform = "translateX(24px)";
        knob.innerHTML = '<i class="fa-solid fa-bell text-accentCyan"></i>';
        btn.title = "Disable Toast Notifications [N]";
    } else {
        knob.style.transform = "translateX(0px)";
        knob.innerHTML = '<i class="fa-solid fa-bell-slash text-slate-900"></i>';
        btn.title = "Enable Toast Notifications [N]";
    }
}

function toggleThemeMode() {
    appState.theme = appState.theme === "dark" ? "light" : "dark";
    updateMetaThemeColor(appState.theme);
    if (appState.theme === "light") {
        document.body.classList.add("light", "light-theme");
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
    } else {
        document.body.classList.remove("light", "light-theme");
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
    }
    updateThemeToggleUI(appState.theme);
    saveStateToStorage();
    if (window.showToast) {
        window.showToast(appState.theme === "light" ? "Light theme enabled" : "Dark theme enabled", "info");
    }
    
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
    if (window.showToast) {
        window.showToast(appState.speechEnabled ? "Voice announcements enabled 🔊" : "Voice announcements disabled 🔇", "info");
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
        document.body.classList.add("light", "light-theme");
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
    } else {
        document.body.classList.remove("light", "light-theme");
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
    }
    updateThemeToggleUI(appState.theme);
    updateSpeechToggleUI();
    updateToastToggleUI();
    
    const bindToggleEvents = (btn, handler) => {
        if (!btn) return;
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            handler();
        });
        btn.addEventListener("touchend", (e) => {
            e.preventDefault();
            e.stopPropagation();
            handler();
        });
    };

    bindToggleEvents(themeBtn, toggleThemeMode);
    bindToggleEvents(speechBtn, toggleSpeechMode);
    bindToggleEvents(toastBtn, toggleToastMode);

    // Bind touch events on toggle rows for mobile devices
    document.querySelectorAll(".ac-toggle-row").forEach(row => {
        row.style.cursor = "pointer";
        row.addEventListener("touchend", (e) => {
            if (e.target.closest("button")) return;
            const innerToggle = row.querySelector("#theme-toggle, #speech-toggle, #toast-toggle");
            if (innerToggle) {
                e.preventDefault();
                e.stopPropagation();
                innerToggle.click();
            }
        });
    });

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
                    if (typeof data !== "object" || data === null || Array.isArray(data) || !data.syllabusProgress) {
                        throw new Error("Invalid backup JSON structure.");
                    }

                    // Prevent prototype pollution or malicious keys
                    delete data.__proto__;
                    delete data.constructor;
                    delete data.prototype;

                    // Safely merge allowed appState fields
                    if (data.syllabusProgress && typeof data.syllabusProgress === "object") {
                        appState.syllabusProgress = data.syllabusProgress;
                    }
                    if (Array.isArray(data.mocks)) {
                        appState.mocks = data.mocks.map(m => ({
                            ...m,
                            name: String(m.name || "Mock"),
                            score: String(m.score || "0")
                        }));
                    }
                    if (Array.isArray(data.notes)) {
                        appState.notes = data.notes.map(n => ({
                            ...n,
                            title: String(n.title || "Note"),
                            content: String(n.content || "")
                        }));
                    }
                    if (data.examName) appState.examName = String(data.examName);
                    if (data.examDate) appState.examDate = String(data.examDate);
                    if (data.examTier) appState.examTier = Number(data.examTier) || 1;
                    if (data.dayCounter) appState.dayCounter = Number(data.dayCounter) || 1;

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

