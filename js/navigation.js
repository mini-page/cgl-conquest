// === NAVIGATION & THEMING MODULE ===
let navExpanded = true;
let lastShiftTime = 0;
let lastQTime = 0;
let lastSTime = 0;

function openShortcutsHelpModal() {
    const modal = document.getElementById("modal-shortcuts-help");
    if (modal) {
        if (typeof window.playSound === 'function') {
            window.playSound('checkbox');
        }

        // Close Pomodoro drawer if open so they do not collide
        const pomoDrawer = document.getElementById("pomo-drawer");
        if (pomoDrawer) {
            pomoDrawer.classList.add("opacity-0", "pointer-events-none", "-translate-y-2");
            pomoDrawer.classList.remove("opacity-100", "pointer-events-auto", "translate-y-0");
        }

        modal.classList.add("active");
        modal.classList.remove("opacity-0", "pointer-events-none", "-translate-y-2");
        modal.classList.add("opacity-100", "pointer-events-auto", "translate-y-0");
        modal.style.display = "flex";

        if (typeof updateSoundToggleUI === 'function') updateSoundToggleUI();
        if (typeof updateFocusModeUI === 'function') updateFocusModeUI();
        if (window.nudgeSystem && typeof window.nudgeSystem.refreshNudges === 'function') {
            window.nudgeSystem.refreshNudges();
        }

        // If rewards tab or nudge tab is active, re-render
        const tabRewards = document.getElementById('ac-tab-rewards');
        if (tabRewards && tabRewards.classList.contains('bg-blue-600') && typeof renderRewardsHub === 'function') {
            renderRewardsHub();
        }
        const tabNudge = document.getElementById('ac-tab-nudge');
        if (tabNudge && tabNudge.classList.contains('bg-blue-600') && typeof renderNudgeHub === 'function') {
            renderNudgeHub();
        }

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
        if (typeof window.playSound === 'function') {
            window.playSound('click', { pitch: 0.85 });
        }
        modal.classList.remove("active", "opacity-100", "pointer-events-auto", "translate-y-0");
        modal.classList.add("opacity-0", "pointer-events-none", "-translate-y-2");
        modal.style.display = "";
        // Clear search on close
        const s = document.getElementById("shortcuts-search");
        if (s) { s.value = ""; filterShortcuts(""); }
    }
}

function toggleShortcutsHelpModal() {
    const modal = document.getElementById("modal-shortcuts-help");
    if (modal && modal.classList.contains("active")) {
        closeShortcutsHelpModal();
    } else {
        openShortcutsHelpModal();
    }
}
window.toggleShortcutsHelpModal = toggleShortcutsHelpModal;
window.openShortcutsHelpModal = openShortcutsHelpModal;
window.closeShortcutsHelpModal = closeShortcutsHelpModal;

// Keyword aliases so single-letter/shorthand queries find the right rows
const _SC_ALIASES = [
    { keys: ["t", "theme", "dark", "light"],                    hint: "dark / light theme" },
    { keys: ["v", "voice", "speech", "mute", "sound"],          hint: "voice announcements" },
    { keys: ["n", "notif", "toast", "bell"],                    hint: "toast notifications" },
    { keys: ["p", "pomo", "pomodoro", "timer"],                 hint: "pomodoro timer" },
    { keys: ["c", "conquest", "challenge", "fire"],             hint: "conquest challenge" },
    { keys: ["u", "scroll", "top"],                             hint: "scroll to top" },
    { keys: ["q", "qq", "qr", "sync"],                          hint: "show my device qr" },
    { keys: ["s", "ss", "scan", "pair"],                        hint: "scan / pair device" },
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
    if (typeof window.playSound === 'function') {
        window.playSound('click');
    }
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
            if (typeof window.toggleThemeMode === 'function') window.toggleThemeMode();
            break;
        }
        case 'toggle-voice': {
            if (typeof window.toggleSpeechMode === 'function') window.toggleSpeechMode();
            break;
        }
        case 'toggle-notifications': {
            if (typeof window.toggleToastMode === 'function') window.toggleToastMode();
            break;
        }
        case 'toggle-audio': {
            if (typeof window.toggleSoundMode === 'function') window.toggleSoundMode();
            break;
        }
        case 'toggle-focus': {
            if (typeof window.toggleFocusMode === 'function') window.toggleFocusMode();
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

        // ── Quick Command Triggers ──
        case 'cmd-palette': {
            if (typeof window.openCommandPalette === 'function') {
                window.openCommandPalette();
            }
            break;
        }
        case 'exam-target': {
            if (typeof window.openExamTargetModal === 'function') {
                window.openExamTargetModal();
            }
            break;
        }

        // ── Device Sync ──
        case 'qr:show': {
            if (typeof window.openQrSyncModal === 'function') {
                window.openQrSyncModal('show');
            }
            break;
        }
        case 'qr:scan': {
            if (typeof window.openQrSyncModal === 'function') {
                window.openQrSyncModal('scan');
            }
            break;
        }
    }
}
window.handleShortcutAction = handleShortcutAction;

function testSoundPreview(type = 'reward') {
    if (typeof window.playSound === 'function') {
        window.playSound(type);
    }
    if (typeof window.showToast === 'function') {
        const soundNames = {
            'click': 'Tactile Button Click 🎵',
            'reward': 'Reward Coin Chime 🪙',
            'achievement': 'Harmonic Achievement Fanfare 🏆',
            'bell': 'Mindful Meditation Bell 🔔',
            'notification': 'Contextual Nudge Alert 🔔',
            'success.soft': 'Soft Confirmation Chord ✨'
        };
        window.showToast(`Sound Preview: ${soundNames[type] || type}`, 'info');
    }
}
window.testSoundPreview = testSoundPreview;

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
    if (typeof window.playSound === "function") window.playSound("click");
    
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
            const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                gsap.fromTo(targetPage, { opacity: 0 }, { opacity: 1, duration: 0.15 });
            } else {
                gsap.fromTo(targetPage, { opacity: 0, y: 12, scale: 0.995 }, { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "power2.out" });
            }
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
    if (target === "page-dashboard") {
        if (typeof renderAll === "function") renderAll();
    } else if (target === "page-syllabus") {
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

        // Double shift key press listener (450ms detection window with debounce)
        if (e.key === "Shift" || e.code === "ShiftLeft" || e.code === "ShiftRight") {
            if (e.repeat) return;
            const tag = document.activeElement ? document.activeElement.tagName : "";
            // Do not hijack shift if actively typing in normal content inputs (allow if shortcuts search is focused)
            if ((tag === "INPUT" || tag === "TEXTAREA" || (document.activeElement && document.activeElement.isContentEditable)) && document.activeElement.id !== "shortcuts-search") {
                return;
            }
            const now = Date.now();
            if (now - lastShiftTime < 500 && now - lastShiftTime > 40) {
                // Double Shift confirmed!
                lastShiftTime = 0;
                toggleShortcutsHelpModal();
                e.preventDefault();
                return;
            }
            lastShiftTime = now;
            return;
        } else {
            // Any other intervening key press clears the double-shift sequence
            lastShiftTime = 0;
        }

        // ── UNIVERSAL MODAL / DIALOG ESCAPE KEY DISMISSAL ─────────
        if (e.key === "Escape" || e.key === "Esc") {
            let dismissed = false;

            // 1. App Custom Alert Dialog
            const alertModal = document.getElementById("app-custom-dialog-modal");
            if (alertModal && !alertModal.classList.contains("opacity-0") && !alertModal.classList.contains("hidden")) {
                const confirmBtn = document.getElementById("custom-dialog-confirm-btn");
                if (confirmBtn) confirmBtn.click();
                else {
                    alertModal.classList.add("opacity-0", "pointer-events-none");
                    alertModal.classList.remove("opacity-100", "pointer-events-auto");
                }
                dismissed = true;
            }

            // 2. Exam Target Modal
            const examModal = document.getElementById("exam-target-modal");
            if (!dismissed && examModal && !examModal.classList.contains("opacity-0") && !examModal.classList.contains("pointer-events-none")) {
                if (typeof window.closeExamTargetModal === "function") window.closeExamTargetModal();
                dismissed = true;
            }

            // 3. Mock Test Inspector Detail Modal
            const mockModal = document.getElementById("modal-mock-detail");
            if (!dismissed && mockModal && !mockModal.classList.contains("hidden") && !mockModal.classList.contains("opacity-0")) {
                if (typeof window.closeMockDetailModal === "function") window.closeMockDetailModal();
                dismissed = true;
            }

            // 4. Study Day Detail Modal
            const dayModal = document.getElementById("modal-day-detail");
            if (!dismissed && dayModal && !dayModal.classList.contains("opacity-0") && !dayModal.classList.contains("pointer-events-none")) {
                dayModal.classList.add("opacity-0", "pointer-events-none");
                dayModal.classList.remove("active", "opacity-100", "pointer-events-auto");
                dismissed = true;
            }

            // 5. Study Content Viewer
            const studyViewer = document.getElementById("modal-study-viewer");
            if (!dismissed && studyViewer && !studyViewer.classList.contains("opacity-0") && !studyViewer.classList.contains("pointer-events-none")) {
                if (typeof window.closeStudyViewer === "function") window.closeStudyViewer();
                dismissed = true;
            }

            // 6. Action Center Popover
            const scModal = document.getElementById("modal-shortcuts-help");
            if (!dismissed && scModal && !scModal.classList.contains("opacity-0") && !scModal.classList.contains("pointer-events-none")) {
                closeShortcutsHelpModal();
                dismissed = true;
            }

            // 7. Pomodoro Drawer Popover
            const pomoDrawer = document.getElementById("pomo-drawer");
            if (!dismissed && pomoDrawer && !pomoDrawer.classList.contains("opacity-0") && !pomoDrawer.classList.contains("pointer-events-none")) {
                if (typeof window.hidePomoPopover === "function") window.hidePomoPopover();
                dismissed = true;
            }

            // 8. Fullscreen Page Frame
            const fsPage = document.getElementById("fullscreen-page");
            if (!dismissed && fsPage && !fsPage.classList.contains("hidden") && !fsPage.classList.contains("opacity-0")) {
                fsPage.classList.add("opacity-0", "pointer-events-none", "hidden");
                dismissed = true;
            }

            // 9. QR Sync Modal
            if (!dismissed && window._qrSyncModalInstance && window._qrSyncModalInstance.isOpen) {
                window._qrSyncModalInstance.close();
                dismissed = true;
            }

            // 10. Any other active modal
            if (!dismissed) {
                const anyModal = document.querySelector(".modal.active, .modal:not(.opacity-0):not(.pointer-events-none), [role='dialog']:not(.opacity-0):not(.pointer-events-none)");
                if (anyModal && anyModal.id !== "mobile-floating-nav") {
                    anyModal.classList.add("opacity-0", "pointer-events-none");
                    anyModal.classList.remove("active", "opacity-100", "pointer-events-auto");
                    dismissed = true;
                }
            }

            if (dismissed) {
                if (document.activeElement && typeof document.activeElement.blur === "function") {
                    document.activeElement.blur();
                }
                document.body.classList.remove("overflow-hidden");
                e.preventDefault();
                return;
            }
        }

        // Skip shortcuts if user is typing in form inputs/textarea/select
        const tag = document.activeElement ? document.activeElement.tagName : "";
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (document.activeElement && document.activeElement.isContentEditable)) {
            return;
        }

        // Close modals on 'X' or 'x' when not in inputs
        if ((e.key === "x" || e.key === "X") && !e.ctrlKey && !e.altKey && !e.metaKey) {
            const scModal = document.getElementById("modal-shortcuts-help");
            const examModal = document.getElementById("exam-target-modal");
            const pomoDrawer = document.getElementById("pomo-drawer");

            if (examModal && !examModal.classList.contains("opacity-0") && !examModal.classList.contains("pointer-events-none")) {
                if (typeof window.closeExamTargetModal === "function") window.closeExamTargetModal();
                e.preventDefault();
                return;
            }
            if (scModal && !scModal.classList.contains("opacity-0") && !scModal.classList.contains("pointer-events-none")) {
                closeShortcutsHelpModal();
                e.preventDefault();
                return;
            }
            if (pomoDrawer && !pomoDrawer.classList.contains("opacity-0") && !pomoDrawer.classList.contains("pointer-events-none")) {
                if (typeof window.hidePomoPopover === "function") window.hidePomoPopover();
                e.preventDefault();
                return;
            }
        }

        // Close QR Sync modal if open on Escape or X
        if (window._qrSyncModalInstance && window._qrSyncModalInstance.isOpen) {
            if (e.key === "Escape" || e.key === "x" || e.key === "X") {
                window._qrSyncModalInstance.close();
                e.preventDefault();
                return;
            }
        }

        // Rapid double-press: Q + Q -> Open "Show My QR"
        if ((e.key === "q" || e.key === "Q") && !e.ctrlKey && !e.altKey && !e.metaKey) {
            const now = Date.now();
            if (now - lastQTime < 380) {
                if (typeof window.openQrSyncModal === "function") {
                    window.openQrSyncModal('show');
                }
                lastQTime = 0;
                e.preventDefault();
                return;
            }
            lastQTime = now;
        }

        // Rapid double-press: S + S -> Open "Scan / Paste"
        if ((e.key === "s" || e.key === "S") && !e.ctrlKey && !e.altKey && !e.metaKey) {
            const now = Date.now();
            if (now - lastSTime < 380) {
                if (typeof window.openQrSyncModal === "function") {
                    window.openQrSyncModal('scan');
                }
                lastSTime = 0;
                e.preventDefault();
                return;
            }
            lastSTime = now;
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
    const knob = document.getElementById("theme-toggle-knob");
    const text = document.getElementById("theme-toggle-text");
    if (theme === "light") {
        if (text) {
            text.textContent = "Light";
            text.className = "text-[9px] font-extrabold uppercase tracking-wider text-amber-500 pointer-events-none select-none order-2 pr-1";
        }
        if (knob) {
            knob.className = "w-4 h-4 rounded-full bg-white flex items-center justify-center text-zinc-950 transition-all duration-300 pointer-events-none shadow-md order-1";
            knob.innerHTML = '<i class="fa-solid fa-sun text-amber-500 text-[8px]"></i>';
        }
        btn.classList.add("bg-amber-500/20", "border-amber-400/50");
        btn.classList.remove("bg-cyan-500/20", "border-cyan-400/40", "bg-white/5", "border-white/10");
        btn.title = "Switch to Dark Mode [T]";
    } else {
        if (text) {
            text.textContent = "Dark";
            text.className = "text-[9px] font-extrabold uppercase tracking-wider text-cyan-300 pointer-events-none select-none order-1 pl-1";
        }
        if (knob) {
            knob.className = "w-4 h-4 rounded-full bg-white flex items-center justify-center text-zinc-950 transition-all duration-300 pointer-events-none shadow-md order-2";
            knob.innerHTML = '<i class="fa-solid fa-moon text-slate-900 text-[8px]"></i>';
        }
        btn.classList.add("bg-cyan-500/20", "border-cyan-400/40");
        btn.classList.remove("bg-amber-500/20", "border-amber-400/50", "bg-white/5", "border-white/10");
        btn.title = "Switch to Light Mode [T]";
    }
}

function updateSpeechToggleUI() {
    const btn = document.getElementById("speech-toggle");
    if (!btn) return;
    const knob = document.getElementById("speech-toggle-knob");
    const text = document.getElementById("speech-toggle-text");
    if (appState.speechEnabled) {
        if (text) {
            text.textContent = "Voice";
            text.className = "text-[9px] font-extrabold uppercase tracking-wider text-emerald-300 pointer-events-none select-none order-1 pl-1";
        }
        if (knob) {
            knob.className = "w-4 h-4 rounded-full bg-white flex items-center justify-center text-zinc-950 transition-all duration-300 pointer-events-none shadow-md order-2";
            knob.innerHTML = '<i class="fa-solid fa-volume-high text-emerald-600 text-[8px]"></i>';
        }
        btn.classList.add("bg-emerald-500/20", "border-emerald-400/50");
        btn.classList.remove("bg-white/5", "border-white/10");
        btn.title = "Disable Voice Announcements [V]";
    } else {
        if (text) {
            text.textContent = "Mute";
            text.className = "text-[9px] font-extrabold uppercase tracking-wider text-gray-400 pointer-events-none select-none order-2 pr-1";
        }
        if (knob) {
            knob.className = "w-4 h-4 rounded-full bg-white flex items-center justify-center text-zinc-950 transition-all duration-300 pointer-events-none shadow-md order-1";
            knob.innerHTML = '<i class="fa-solid fa-volume-xmark text-slate-700 text-[8px]"></i>';
        }
        btn.classList.remove("bg-emerald-500/20", "border-emerald-400/50");
        btn.classList.add("bg-white/5", "border-white/10");
        btn.title = "Enable Voice Announcements [V]";
    }
}

function updateToastToggleUI() {
    const btn = document.getElementById("toast-toggle");
    if (!btn) return;
    const knob = document.getElementById("toast-toggle-knob");
    const text = document.getElementById("toast-toggle-text");
    if (appState.toastEnabled) {
        if (text) {
            text.textContent = "Nudge";
            text.className = "text-[9px] font-extrabold uppercase tracking-wider text-amber-300 pointer-events-none select-none order-1 pl-1";
        }
        if (knob) {
            knob.className = "w-4 h-4 rounded-full bg-white flex items-center justify-center text-zinc-950 transition-all duration-300 pointer-events-none shadow-md order-2";
            knob.innerHTML = '<i class="fa-solid fa-bell text-amber-600 text-[8px]"></i>';
        }
        btn.classList.add("bg-amber-500/20", "border-amber-400/50");
        btn.classList.remove("bg-white/5", "border-white/10");
        btn.title = "Disable Toast Notifications [N]";
    } else {
        if (text) {
            text.textContent = "Silent";
            text.className = "text-[9px] font-extrabold uppercase tracking-wider text-gray-400 pointer-events-none select-none order-2 pr-1";
        }
        if (knob) {
            knob.className = "w-4 h-4 rounded-full bg-white flex items-center justify-center text-zinc-950 transition-all duration-300 pointer-events-none shadow-md order-1";
            knob.innerHTML = '<i class="fa-solid fa-bell-slash text-slate-700 text-[8px]"></i>';
        }
        btn.classList.remove("bg-amber-500/20", "border-amber-400/50");
        btn.classList.add("bg-white/5", "border-white/10");
        btn.title = "Enable Toast Notifications [N]";
    }
}

function toggleThemeMode() {
    appState.theme = appState.theme === "dark" ? "light" : "dark";
    if (typeof window.playSound === 'function') {
        window.playSound('click', { pitch: 1.15 });
    }
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
    
    // Re-render SVG Mindmap and Mock Analytics if visible to adjust colors
    const mindmap = document.getElementById("view-mindmap");
    if (mindmap && !mindmap.classList.contains("hidden") && typeof renderMindMap === "function") {
        renderMindMap();
    }
    if (typeof renderMockAnalytics === "function") {
        renderMockAnalytics();
    }
}

function toggleSpeechMode() {
    appState.speechEnabled = !appState.speechEnabled;
    if (typeof window.playSound === 'function') {
        window.playSound('notification');
    }
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
    if (typeof window.playSound === 'function') {
        window.playSound('click');
    }
    saveStateToStorage();
    updateToastToggleUI();
    if (window.showToast) {
        window.showToast(appState.toastEnabled ? "Toast notifications enabled" : "Toast notifications disabled", "info");
    }
}

function toggleSoundMode() {
    appState.soundEnabled = appState.soundEnabled === false ? true : false;
    saveStateToStorage();
    updateSoundToggleUI();
    if (appState.soundEnabled && typeof window.playSound === 'function') {
        window.playSound('success.soft');
    }
    if (typeof window.showToast === 'function') {
        window.showToast(appState.soundEnabled ? "Synthesized UI Audio Enabled 🔊" : "Synthesized UI Audio Muted 🔇", "info");
    }
}

function updateSoundToggleUI() {
    const btn = document.getElementById("sound-toggle");
    if (!btn) return;
    const knob = document.getElementById("sound-toggle-knob");
    const text = document.getElementById("sound-toggle-text");
    if (appState.soundEnabled !== false) {
        if (text) {
            text.textContent = "Audio";
            text.className = "text-[9px] font-extrabold uppercase tracking-wider text-blue-300 pointer-events-none select-none order-1 pl-1";
        }
        if (knob) {
            knob.className = "w-4 h-4 rounded-full bg-white flex items-center justify-center text-zinc-950 transition-all duration-300 pointer-events-none shadow-md order-2";
            knob.innerHTML = '<i class="fa-solid fa-volume-high text-blue-600 text-[8px]"></i>';
        }
        btn.classList.add("bg-blue-500/20", "border-blue-400/50");
        btn.classList.remove("bg-white/5", "border-white/10");
        btn.title = "Disable UI Audio [M]";
    } else {
        if (text) {
            text.textContent = "Mute";
            text.className = "text-[9px] font-extrabold uppercase tracking-wider text-gray-400 pointer-events-none select-none order-2 pr-1";
        }
        if (knob) {
            knob.className = "w-4 h-4 rounded-full bg-white flex items-center justify-center text-zinc-950 transition-all duration-300 pointer-events-none shadow-md order-1";
            knob.innerHTML = '<i class="fa-solid fa-volume-xmark text-slate-700 text-[8px]"></i>';
        }
        btn.classList.remove("bg-blue-500/20", "border-blue-400/50");
        btn.classList.add("bg-white/5", "border-white/10");
        btn.title = "Enable UI Audio [M]";
    }
}

function toggleFocusMode() {
    appState.focusModeActive = !appState.focusModeActive;
    saveStateToStorage();
    updateFocusModeUI();
    const focusBtnText = document.getElementById('ac-nudge-focus-btn-text');
    if (focusBtnText) {
        focusBtnText.textContent = appState.focusModeActive ? 'Deactivate Focus' : 'Start Focus Sprint';
    }
    if (appState.focusModeActive) {
        if (typeof window.playSound === 'function') {
            window.playSound('bell');
        }
        if (typeof window.showToast === 'function') {
            window.showToast("🎯 Deep Focus Mode Active — sounds and distractions silenced", "info");
        }
    } else {
        if (typeof window.showToast === 'function') {
            window.showToast("Focus Mode Deactivated", "info");
        }
        if (typeof window.playSound === 'function') {
            window.playSound('checkbox');
        }
    }
}

function updateFocusModeUI() {
    const btn = document.getElementById("focus-toggle");
    if (!btn) return;
    const knob = document.getElementById("focus-toggle-knob");
    const text = document.getElementById("focus-toggle-text");
    if (appState.focusModeActive) {
        if (text) {
            text.textContent = "Active";
            text.className = "text-[9px] font-extrabold uppercase tracking-wider text-emerald-300 pointer-events-none select-none order-1 pl-1";
        }
        if (knob) {
            knob.className = "w-4 h-4 rounded-full bg-white flex items-center justify-center text-zinc-950 transition-all duration-300 pointer-events-none shadow-md order-2";
            knob.innerHTML = '<i class="fa-solid fa-crosshairs text-emerald-600 text-[8px]"></i>';
        }
        btn.classList.add("bg-emerald-500/20", "border-emerald-400/50");
        btn.classList.remove("bg-white/5", "border-white/10");
        btn.title = "Deactivate Focus Mode [F]";
    } else {
        if (text) {
            text.textContent = "Focus";
            text.className = "text-[9px] font-extrabold uppercase tracking-wider text-gray-400 pointer-events-none select-none order-2 pr-1";
        }
        if (knob) {
            knob.className = "w-4 h-4 rounded-full bg-white flex items-center justify-center text-zinc-950 transition-all duration-300 pointer-events-none shadow-md order-1";
            knob.innerHTML = '<i class="fa-solid fa-moon text-slate-700 text-[8px]"></i>';
        }
        btn.classList.remove("bg-emerald-500/20", "border-emerald-400/50");
        btn.classList.add("bg-white/5", "border-white/10");
        btn.title = "Activate Focus Mode [F]";
    }
}

function switchActionCenterHub(tab) {
    const tabHub = document.getElementById('ac-tab-hub');
    const tabRewards = document.getElementById('ac-tab-rewards');
    const tabNudge = document.getElementById('ac-tab-nudge');
    const panelHub = document.getElementById('ac-panel-hub');
    const panelRewards = document.getElementById('ac-panel-rewards');
    const panelNudge = document.getElementById('ac-panel-nudge');

    const activeCls = 'flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition duration-200 text-white bg-blue-600 shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer';
    const inactiveCls = 'flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition duration-200 text-gray-400 hover:text-white bg-transparent flex items-center justify-center gap-1.5 cursor-pointer';

    if (tab === 'rewards') {
        if (tabRewards) tabRewards.className = activeCls;
        if (tabHub) tabHub.className = inactiveCls;
        if (tabNudge) tabNudge.className = inactiveCls;
        if (panelRewards) panelRewards.classList.remove('hidden');
        if (panelHub) panelHub.classList.add('hidden');
        if (panelNudge) panelNudge.classList.add('hidden');
        renderRewardsHub();
    } else if (tab === 'nudge') {
        if (tabNudge) tabNudge.className = activeCls;
        if (tabHub) tabHub.className = inactiveCls;
        if (tabRewards) tabRewards.className = inactiveCls;
        if (panelNudge) panelNudge.classList.remove('hidden');
        if (panelHub) panelHub.classList.add('hidden');
        if (panelRewards) panelRewards.classList.add('hidden');
        renderNudgeHub();
    } else {
        if (tabHub) tabHub.className = activeCls;
        if (tabRewards) tabRewards.className = inactiveCls;
        if (tabNudge) tabNudge.className = inactiveCls;
        if (panelHub) panelHub.classList.remove('hidden');
        if (panelRewards) panelRewards.classList.add('hidden');
        if (panelNudge) panelNudge.classList.add('hidden');
    }

    if (typeof window.playSound === 'function') {
        window.playSound('checkbox');
    }
}

let currentTrophyFilter = 'all';

function filterRewardsTrophies(filter) {
    currentTrophyFilter = filter || 'all';
    const filterButtons = document.querySelectorAll('.ac-trophy-filter-btn');
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === currentTrophyFilter) {
            btn.className = 'ac-trophy-filter-btn px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-600 text-white cursor-pointer';
        } else {
            btn.className = 'ac-trophy-filter-btn px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-white/5 text-gray-400 hover:text-white transition cursor-pointer flex items-center gap-1';
        }
    });
    renderRewardsHub();
}
window.filterRewardsTrophies = filterRewardsTrophies;

function renderRewardsHub() {
    const rewards = (window.appState && window.appState.rewards) ? window.appState.rewards : { coins: 0, points: 0, unlocked: [], equipped: { title: 'Aspirant' } };
    
    // Update header summary
    const titleEl = document.getElementById('ac-rewards-title');
    const coinsEl = document.getElementById('ac-rewards-coins');
    const pointsEl = document.getElementById('ac-rewards-points');
    if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-crown text-amber-400 text-xs"></i><span>${window.escapeHTML ? window.escapeHTML(rewards.equipped?.title || 'Aspirant') : (rewards.equipped?.title || 'Aspirant')}</span>`;
    if (coinsEl) coinsEl.textContent = rewards.coins || 0;
    if (pointsEl) pointsEl.textContent = rewards.points || 0;

    // Update player level and XP progression
    if (window.rewardsSystem && typeof window.rewardsSystem.getLevelData === 'function') {
        const lvlData = window.rewardsSystem.getLevelData(rewards.points || 0);
        const levelTextEl = document.getElementById('ac-rewards-level-text');
        const xpTextEl = document.getElementById('ac-rewards-xp-text');
        const xpBarEl = document.getElementById('ac-rewards-xp-bar');
        if (levelTextEl) levelTextEl.innerHTML = `<i class="fa-solid ${lvlData.icon} text-[8px] mr-1"></i> Level ${lvlData.level} • ${lvlData.rankTitle}`;
        if (xpTextEl) xpTextEl.textContent = `${lvlData.currentPoints} / ${lvlData.nextLevelMax} XP`;
        if (xpBarEl) xpBarEl.style.width = `${lvlData.progressPct}%`;
    }

    // Render Trophies in 9-dot launcher style (3-col grid)
    const trophiesContainer = document.getElementById('ac-trophies-grid');
    if (trophiesContainer && window.rewardsSystem) {
        const list = window.rewardsSystem.evaluateTrophies();

        // Compute counts
        const claimableCount = list.filter(t => t.canClaim).length;
        const claimedCount = list.filter(t => t.isClaimed).length;
        const totalCount = list.length;

        const ratioEl = document.getElementById('ac-trophy-ratio');
        if (ratioEl) ratioEl.textContent = `${claimedCount} / ${totalCount} Claimed`;

        const badgeEl = document.getElementById('ac-claimable-badge');
        if (badgeEl) {
            if (claimableCount > 0) {
                badgeEl.textContent = claimableCount;
                badgeEl.classList.remove('hidden');
            } else {
                badgeEl.classList.add('hidden');
            }
        }

        // Filter list
        let filteredList = list;
        if (currentTrophyFilter === 'claimable') {
            filteredList = list.filter(t => t.canClaim);
        } else if (currentTrophyFilter === 'in-progress') {
            filteredList = list.filter(t => !t.isClaimed && !t.canClaim);
        } else if (currentTrophyFilter === 'claimed') {
            filteredList = list.filter(t => t.isClaimed);
        }

        if (filteredList.length === 0) {
            trophiesContainer.innerHTML = `
                <div class="col-span-3 py-6 text-center text-gray-500 text-[10px]">
                    <i class="fa-solid fa-filter text-base mb-1 block text-gray-600"></i>
                    No trophies matching "${currentTrophyFilter}".
                </div>
            `;
        } else {
            trophiesContainer.innerHTML = filteredList.map(t => {
                const isClaimed = t.isClaimed;
                const canClaim = t.canClaim;
                const progress = t.progress || { current: isClaimed ? 1 : 0, target: 1, pct: isClaimed ? 100 : 0 };
                const cardBg = isClaimed 
                    ? 'bg-slate-950/70 border-emerald-500/30' 
                    : (canClaim ? 'bg-blue-950/40 border-amber-400/60 ring-1 ring-amber-400/40' : 'bg-slate-950/50 border-white/10 opacity-75');

                const tooltipContent = `${t.title} [${t.tier}] — ${t.desc} (Goal: ${progress.current}/${progress.target} ${progress.label || ''} • Reward: +${t.coins}🪙, +${t.points}⭐)`;

                return `
                    <div class="relative group p-2.5 rounded-2xl border ${cardBg} transition-all duration-200 hover:scale-[1.02] flex flex-col items-center text-center justify-between min-h-[118px] cursor-pointer" data-tooltip="${window.escapeHTML ? window.escapeHTML(tooltipContent) : tooltipContent}" data-tooltip-pos="top">
                        <div class="w-8 h-8 rounded-xl bg-gradient-to-br ${t.tierColor} flex items-center justify-center text-white text-xs shadow-md mb-1">
                            <i class="fa-solid ${t.icon}"></i>
                        </div>
                        <div class="space-y-0.5 w-full pointer-events-none">
                            <span class="text-[9px] font-black uppercase tracking-wider ${t.tierText} block">${t.tier}</span>
                            <h5 class="text-[11px] font-bold text-white truncate w-full">${window.escapeHTML ? window.escapeHTML(t.title) : t.title}</h5>
                        </div>

                        <!-- Visual Progress Bar for Locked / In Progress -->
                        ${(!isClaimed && !canClaim) ? `
                            <div class="w-full pt-1 pointer-events-none">
                                <div class="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                    <div class="bg-cyan-400 h-full rounded-full transition-all duration-300" style="width: ${progress.pct}%;"></div>
                                </div>
                                <span class="text-[8px] text-gray-400 font-bold block mt-0.5">${progress.current}/${progress.target}</span>
                            </div>
                        ` : ''}

                        <div class="mt-1.5 w-full">
                            ${isClaimed 
                                ? `<span class="text-[9px] font-bold text-emerald-400 flex items-center justify-center gap-1"><i class="fa-solid fa-check text-[8px]"></i> Claimed</span>`
                                : (canClaim 
                                    ? `<button type="button" onclick="claimTrophyReward('${t.id}')" class="w-full py-1 px-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[9px] font-black uppercase shadow-md transition cursor-pointer animate-pulse">Claim +${t.coins}🪙</button>`
                                    : `<span class="text-[8px] text-gray-500 font-semibold"><i class="fa-solid fa-lock text-[8px] mr-0.5"></i> Locked</span>`
                                  )
                            }
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // Render Collectible Stickers with dynamic unlock state
    const stickersContainer = document.getElementById('ac-stickers-grid');
    if (stickersContainer && window.rewardsSystem) {
        const stickers = typeof window.rewardsSystem.evaluateStickers === 'function' 
            ? window.rewardsSystem.evaluateStickers() 
            : (window.rewardsSystem.catalog.stickers || []);
        stickersContainer.innerHTML = stickers.map(s => {
            const isUnlocked = Boolean(s.isUnlocked);
            const stickerTip = `${s.name} Sticker — ${s.desc} [${isUnlocked ? 'Unlocked ✨' : (s.conditionHint || 'Locked')}]`;
            return `
                <div class="p-2 rounded-2xl ${isUnlocked ? 'bg-cyan-950/30 border-cyan-500/30 shadow-inner' : 'bg-slate-950/60 border-white/5 opacity-55 grayscale'} flex flex-col items-center text-center gap-1 hover:border-cyan-400/40 transition group cursor-pointer" data-tooltip="${window.escapeHTML ? window.escapeHTML(stickerTip) : stickerTip}" data-tooltip-pos="top">
                    <span class="text-xl group-hover:scale-110 transition transform pointer-events-none">${s.emoji}</span>
                    <span class="text-[9px] font-bold ${isUnlocked ? 'text-cyan-300' : 'text-gray-400'} truncate w-full pointer-events-none">${window.escapeHTML ? window.escapeHTML(s.name) : s.name}</span>
                    <span class="text-[7px] font-black uppercase tracking-wider ${isUnlocked ? 'text-emerald-400' : 'text-gray-500'} pointer-events-none">${isUnlocked ? 'Unlocked' : 'Locked'}</span>
                </div>
            `;
        }).join('');
    }

    // Render Cosmetic Shop
    const cosmeticsContainer = document.getElementById('ac-cosmetics-grid');
    if (cosmeticsContainer && window.rewardsSystem) {
        const cosmetics = window.rewardsSystem.catalog.cosmetics || [];
        const unlockedList = rewards.unlocked || [];
        const equippedTitle = rewards.equipped?.title || 'Aspirant';
        const equippedAccent = rewards.equipped?.themeAccent || 'accent_blue';

        cosmeticsContainer.innerHTML = cosmetics.map(c => {
            const isUnlocked = unlockedList.includes(c.id) || c.unlockedByDefault;
            const isEquipped = (c.type === 'title' && equippedTitle === c.name) || (c.type === 'accent' && equippedAccent === c.id);
            const cosmeticTip = `${c.name} [${c.type.toUpperCase()}] — ${c.desc} (${c.cost > 0 ? c.cost + '🪙' : 'Default'})`;

            return `
                <div class="p-2.5 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-between gap-2 cursor-pointer hover:border-white/20 transition" data-tooltip="${window.escapeHTML ? window.escapeHTML(cosmeticTip) : cosmeticTip}" data-tooltip-pos="top">
                    <div class="space-y-0.5 pointer-events-none">
                        <div class="flex items-center gap-1.5">
                            <span class="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${c.type === 'title' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}">${c.type}</span>
                            <span class="text-xs font-bold text-white">${window.escapeHTML ? window.escapeHTML(c.name) : c.name}</span>
                        </div>
                        <p class="text-[10px] text-gray-400">${window.escapeHTML ? window.escapeHTML(c.desc) : c.desc}</p>
                    </div>
                    <div class="shrink-0">
                        ${isEquipped
                            ? `<span class="px-2 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase">Equipped</span>`
                            : (isUnlocked
                                ? `<button type="button" onclick="equipCosmeticItem('${c.id}')" class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase transition cursor-pointer">Equip</button>`
                                : `<button type="button" onclick="unlockCosmeticItem('${c.id}')" class="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[10px] font-black uppercase shadow transition cursor-pointer flex items-center gap-1"><span>${c.cost}</span><span>🪙</span></button>`
                              )
                        }
                    </div>
                </div>
            `;
        }).join('');
    }
}

function claimTrophyReward(id) {
    if (window.rewardsSystem) {
        window.rewardsSystem.claimTrophy(id);
        renderRewardsHub();
    }
}

function equipCosmeticItem(id) {
    if (window.rewardsSystem) {
        window.rewardsSystem.equipCosmetic(id);
        renderRewardsHub();
    }
}

function unlockCosmeticItem(id) {
    if (window.rewardsSystem) {
        window.rewardsSystem.unlockCosmetic(id);
        renderRewardsHub();
    }
}

function renderNudgeHub() {
    const feed = document.getElementById('ac-nudge-feed');
    const focusBtnText = document.getElementById('ac-nudge-focus-btn-text');
    if (focusBtnText) {
        focusBtnText.textContent = appState.focusModeActive ? 'Deactivate Focus' : 'Start Focus Sprint';
    }

    if (!feed) return;
    if (!window.nudgeSystem) {
        feed.innerHTML = '<p class="text-xs text-gray-500 text-center py-4">Nudge engine loading...</p>';
        return;
    }

    const nudges = window.nudgeSystem.refreshNudges();
    if (nudges.length === 0) {
        feed.innerHTML = `
            <div class="p-6 text-center space-y-2 bg-slate-950/40 rounded-2xl border border-white/5">
                <i class="fa-solid fa-circle-check text-2xl text-emerald-400"></i>
                <h5 class="text-xs font-bold text-white">All Clear!</h5>
                <p class="text-[10px] text-gray-400">No overdue reviews, pending rituals, or alerts. You are operating at peak efficiency.</p>
            </div>
        `;
        return;
    }

    feed.innerHTML = nudges.map(n => {
        const priorityColors = {
            critical: 'border-rose-500/40 bg-rose-950/20 text-rose-400',
            important: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
            normal: 'border-blue-500/40 bg-blue-950/20 text-blue-400',
            low: 'border-white/10 bg-slate-950/40 text-gray-400'
        };
        const badgeColor = priorityColors[n.priority] || priorityColors.normal;

        return `
            <div class="p-3 rounded-2xl border ${badgeColor} space-y-2 transition-all duration-200">
                <div class="flex items-start justify-between gap-2">
                    <div class="flex items-center gap-2">
                        <div class="w-7 h-7 rounded-lg ${n.iconColor || 'bg-white/10 text-white'} flex items-center justify-center text-xs shrink-0">
                            <i class="fa-solid ${n.icon}"></i>
                        </div>
                        <div>
                            <span class="text-[8px] font-black uppercase tracking-widest block opacity-75">${n.priority}</span>
                            <h5 class="text-xs font-bold text-white">${window.escapeHTML ? window.escapeHTML(n.title) : n.title}</h5>
                        </div>
                    </div>
                    <button type="button" onclick="window.nudgeSystem.snooze('${n.id}'); renderNudgeHub();" class="text-gray-400 hover:text-gray-200 text-[10px] p-1 transition cursor-pointer" title="Snooze for 1 hour">
                        <i class="fa-solid fa-clock text-xs"></i>
                    </button>
                </div>
                <p class="text-[11px] text-gray-300 pl-9">${window.escapeHTML ? window.escapeHTML(n.message) : n.message}</p>
                <div class="pl-9 pt-1 flex items-center gap-2">
                    <button type="button" onclick="window.nudgeSystem.executeAction('${n.id}')" class="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase shadow-md transition cursor-pointer">
                        ${window.escapeHTML ? window.escapeHTML(n.actionLabel) : n.actionLabel}
                    </button>
                    <button type="button" onclick="window.nudgeSystem.dismiss('${n.id}'); renderNudgeHub();" class="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] font-bold uppercase transition cursor-pointer">
                        Dismiss
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function initTheme() {
    const themeBtn = document.getElementById("theme-toggle");
    const speechBtn = document.getElementById("speech-toggle");
    const toastBtn = document.getElementById("toast-toggle");
    const soundBtn = document.getElementById("sound-toggle");
    const focusBtn = document.getElementById("focus-toggle");
    
    // Bind help shortcuts close button
    const btnShortcutsClose = document.getElementById("btn-shortcuts-close");
    if (btnShortcutsClose) {
        btnShortcutsClose.onclick = () => closeShortcutsHelpModal();
    }

    // Bind help shortcuts island trigger button & Sync Island persistence
    const btnShortcutsTrigger = document.getElementById("btn-shortcuts-island-trigger");
    const syncIslandPill = document.getElementById("sync-island-pill");
    const actionCenterWrap = document.getElementById("action-center-island-wrap");

    if (btnShortcutsTrigger && syncIslandPill && actionCenterWrap) {
        let syncIslandTimer = null;
        let pressTimer = null;
        let isLongPress = false;

        function showSyncIsland() {
            if (syncIslandTimer) {
                clearTimeout(syncIslandTimer);
                syncIslandTimer = null;
            }
            syncIslandPill.classList.add("island-visible");
        }

        function scheduleHideSyncIsland(delay = 2000) {
            if (syncIslandTimer) clearTimeout(syncIslandTimer);
            syncIslandTimer = setTimeout(() => {
                syncIslandPill.classList.remove("island-visible");
                syncIslandTimer = null;
            }, delay);
        }

        // Desktop hover on trigger/wrapper: reveal island
        actionCenterWrap.addEventListener("mouseenter", () => {
            showSyncIsland();
        });
        actionCenterWrap.addEventListener("mouseleave", () => {
            scheduleHideSyncIsland(2000);
        });

        // Hovering over the island itself cancels autohide!
        syncIslandPill.addEventListener("mouseenter", () => {
            showSyncIsland();
        });
        syncIslandPill.addEventListener("mouseleave", () => {
            scheduleHideSyncIsland(2000);
        });

        // Mobile touch & long-press handling
        btnShortcutsTrigger.addEventListener("touchstart", () => {
            isLongPress = false;
            pressTimer = setTimeout(() => {
                isLongPress = true;
                showSyncIsland();
                scheduleHideSyncIsland(3000);
                if (navigator.vibrate) {
                    try { navigator.vibrate(45); } catch (_) {}
                }
            }, 450);
        }, { passive: true });

        btnShortcutsTrigger.addEventListener("touchend", (e) => {
            if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
            if (isLongPress) {
                e.preventDefault();
                e.stopPropagation();
            }
        });

        btnShortcutsTrigger.addEventListener("touchmove", () => {
            if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
        });

        btnShortcutsTrigger.onclick = (e) => {
            if (isLongPress) {
                isLongPress = false;
                return;
            }
            e.stopPropagation();
            toggleShortcutsHelpModal();
        };

        // Close Action Center popover & Sync Island when clicking outside
        document.addEventListener("click", (e) => {
            const path = e.composedPath ? e.composedPath() : [];
            const clickedInsideIsland = syncIslandPill.contains(e.target) || path.includes(syncIslandPill);
            const clickedInsideWrap = actionCenterWrap.contains(e.target) || path.includes(actionCenterWrap);

            if (!clickedInsideIsland && !clickedInsideWrap) {
                syncIslandPill.classList.remove("island-visible");
                if (syncIslandTimer) clearTimeout(syncIslandTimer);
            }

            const modal = document.getElementById("modal-shortcuts-help");
            if (modal && modal.classList.contains("active")) {
                const clickedInsideModal = modal.contains(e.target) || path.includes(modal);
                const clickedTrigger = btnShortcutsTrigger.contains(e.target) || path.includes(btnShortcutsTrigger);
                if (!clickedInsideModal && !clickedTrigger) {
                    closeShortcutsHelpModal();
                }
            }
        });
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
    updateSoundToggleUI();
    updateFocusModeUI();
    if (typeof updateHandSettingsUI === "function") updateHandSettingsUI();
    
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
    bindToggleEvents(soundBtn, toggleSoundMode);
    bindToggleEvents(focusBtn, toggleFocusMode);

    // Bind touch events on toggle rows for mobile devices
    document.querySelectorAll(".ac-toggle-row").forEach(row => {
        row.style.cursor = "pointer";
        row.addEventListener("touchend", (e) => {
            if (e.target.closest("button")) return;
            const innerToggle = row.querySelector("#theme-toggle, #speech-toggle, #toast-toggle, #sound-toggle, #focus-toggle");
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

window.toggleThemeMode = toggleThemeMode;
window.toggleSpeechMode = toggleSpeechMode;
window.toggleToastMode = toggleToastMode;
window.updateThemeToggleUI = updateThemeToggleUI;
window.updateSpeechToggleUI = updateSpeechToggleUI;
window.updateToastToggleUI = updateToastToggleUI;
window.updateSoundToggleUI = updateSoundToggleUI;
window.updateFocusModeUI = updateFocusModeUI;
window.toggleSoundMode = toggleSoundMode;
window.toggleFocusMode = toggleFocusMode;
window.switchActionCenterHub = switchActionCenterHub;
window.renderRewardsHub = renderRewardsHub;
window.renderNudgeHub = renderNudgeHub;
window.navigateTab = navigateToPage;

// // Dual-Way QR Device Sync Handler
let qrModalInstance = null;
function openQrSyncModal(initialTab = 'scan') {
    const drawer = document.getElementById("action-center-drawer");
    if (drawer && typeof window.closeActionCenter === "function") {
        window.closeActionCenter();
    }

    if (!qrModalInstance && window.QrSyncModal) {
        qrModalInstance = new window.QrSyncModal({
            getState: () => appState,
            onApplyState: (newState) => {
                delete newState.__proto__;
                delete newState.constructor;
                delete newState.prototype;

                // In-place mutation of appState to preserve all module closures
                Object.assign(appState, newState);
                window.appState = appState;
                saveStateToStorage();

                // 1. Tier toggler & form limits
                if (typeof window.initTierToggler === "function") window.initTierToggler();
                if (typeof window.updateMockFormLimits === "function") window.updateMockFormLimits();

                // 2. Global application re-renders
                if (typeof renderAll === "function") renderAll();
                if (typeof window.renderDashboardOverview === "function") window.renderDashboardOverview();
                if (typeof window.renderSubjectProgressBars === "function") window.renderSubjectProgressBars();
                if (typeof window.renderTodayMissions === "function") window.renderTodayMissions();
                if (typeof window.loadRituals === "function") window.loadRituals();
                if (typeof window.updateTodayGoalsRatio === "function") window.updateTodayGoalsRatio();
                if (typeof window.updateStreakData === "function") window.updateStreakData();

                // 3. Syllabus re-render & Deck Pills
                if (typeof window.renderSyllabus === "function") window.renderSyllabus();
                if (typeof window.renderRingDeck === "function") window.renderRingDeck();

                // 4. Study Plan (40-Day Roadmap)
                if (typeof renderStudyPlan === "function") renderStudyPlan();
                if (typeof window.renderStudyPlan === "function") window.renderStudyPlan();

                // 5. Mock Analytics
                if (typeof renderMockAnalytics === "function") renderMockAnalytics();
                if (typeof window.renderMockAnalytics === "function") window.renderMockAnalytics();

                // 6. Toolkit / Notes
                if (typeof renderToolkit === "function") renderToolkit();
                if (typeof window.renderToolkit === "function") window.renderToolkit();

                // 7. Exam target countdown & banners
                if (typeof updateCountdown === "function") updateCountdown();
                if (typeof window.startExamCountdown === "function") window.startExamCountdown();
                if (typeof renderSrsBanner === "function") renderSrsBanner();
                if (typeof window.renderSrsBanner === "function") window.renderSrsBanner();

                // 8. Theme and navigation ergonomics
                if (typeof window.updateHandSettingsUI === "function") window.updateHandSettingsUI();
                if (typeof window.initTheme === "function") window.initTheme();
            },
            onToast: (msg, type) => {
                if (window.showToast) window.showToast(msg, type);
                else alert(msg);
            }
        });
    }

    if (qrModalInstance) {
        window._qrSyncModalInstance = qrModalInstance;
        qrModalInstance.open(initialTab);
    } else {
        console.warn("QrSyncModal component not loaded yet.");
    }
}
window.openQrSyncModal = openQrSyncModal;
window.closeQrSyncModal = () => { if (qrModalInstance) qrModalInstance.close(); };

// Universal Modal Dismissal on Backdrop Click & Close Buttons
function initUniversalModalDismissal() {
    document.addEventListener("click", (e) => {
        // 1. Any close button with .modal-close-btn, [data-modal-close], or #btn-fullscreen-close
        const closeBtn = e.target.closest(".modal-close-btn, [data-modal-close], #btn-fullscreen-close");
        if (closeBtn) {
            const modal = closeBtn.closest(".modal, [role='dialog'], .fixed.inset-0, #fullscreen-page");
            if (modal) {
                modal.classList.add("opacity-0", "pointer-events-none");
                modal.classList.remove("opacity-100", "pointer-events-auto", "active");
                if (modal.id === "fullscreen-page" || modal.id === "modal-mock-detail") {
                    modal.classList.add("hidden");
                }
                const card = modal.querySelector(".scale-100");
                if (card) {
                    card.classList.remove("scale-100");
                    card.classList.add("scale-95");
                }
                document.body.classList.remove("overflow-hidden");
            }
        }

        // 2. Direct backdrop clicks on full-screen fixed overlays
        const targetModal = e.target;
        if (targetModal && targetModal.classList && targetModal.classList.contains("fixed") && targetModal.classList.contains("inset-0")) {
            if (targetModal.id === "exam-target-modal") {
                if (typeof window.closeExamTargetModal === "function") window.closeExamTargetModal();
            } else if (targetModal.id === "modal-day-detail") {
                targetModal.classList.add("opacity-0", "pointer-events-none");
                targetModal.classList.remove("active", "opacity-100", "pointer-events-auto");
                const card = targetModal.firstElementChild;
                if (card) { card.classList.remove("scale-100"); card.classList.add("scale-95"); }
                document.body.classList.remove("overflow-hidden");
            } else if (targetModal.id === "modal-study-viewer") {
                if (typeof window.closeStudyViewer === "function") window.closeStudyViewer();
            } else if (targetModal.id === "modal-mock-detail") {
                if (typeof window.closeMockDetailModal === "function") window.closeMockDetailModal();
            } else if (targetModal.id === "fullscreen-page") {
                targetModal.classList.add("opacity-0", "pointer-events-none", "hidden");
                targetModal.classList.remove("opacity-100", "pointer-events-auto");
            }
        }
    });
}

if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initUniversalModalDismissal);
    } else {
        initUniversalModalDismissal();
    }
}
