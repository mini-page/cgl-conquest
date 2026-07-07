// === NAVIGATION & THEMING MODULE ===
let navExpanded = true;

function expandNav() {
    if (navExpanded) return;
    navExpanded = true;
    const navItems = document.getElementById("floating-nav-items");
    const navTrigger = document.getElementById("floating-nav-trigger");
    if (navItems && navTrigger) {
        navItems.classList.remove("hidden");
        navTrigger.classList.add("hidden");
    }
}

function shrinkNav() {
    if (!navExpanded) return;
    navExpanded = false;
    const navItems = document.getElementById("floating-nav-items");
    const navTrigger = document.getElementById("floating-nav-trigger");
    if (navItems && navTrigger) {
        navItems.classList.add("hidden");
        navTrigger.classList.remove("hidden");
    }
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


// 4. NAVIGATION & THEME LOGIC
function initNavigation() {
    const navItems = document.querySelectorAll(".nav-item, .mobile-nav-item");
    const pages = document.querySelectorAll(".content-page");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");

    // Desktop/Mobile Navigation Toggling
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const target = item.getAttribute("data-target");
            
            navItems.forEach(ni => ni.classList.remove("active-nav"));
            pages.forEach(p => p.classList.add("hidden"));
            
            // Highlight both desktop and mobile items matching target
            document.querySelectorAll(`[data-target="${target}"]`).forEach(ni => ni.classList.add("active-nav"));
            
            const targetPage = document.getElementById(target);
            if (targetPage) {
                targetPage.classList.remove("hidden");
            }
            
            // Dynamically update the header page title
            const headerPageTitle = document.getElementById("header-page-title");
            if (headerPageTitle) {
                let friendlyName = "Dashboard";
                if (target === "page-syllabus") friendlyName = "Syllabus Tracker";
                else if (target === "page-plan") friendlyName = "40-Day Plan";
                else if (target === "page-mocks") friendlyName = "Mock Analytics";
                else if (target === "page-toolkit") friendlyName = "Study Toolkit";
                else if (target === "page-speed") friendlyName = "Speed Drills";
                headerPageTitle.innerText = friendlyName;
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
                renderToolkit();
                if (typeof renderGKTab === "function") renderGKTab();
            } else if (target === "page-speed") {
                resetDrillSession();
                setTimeout(triggerMathTypesetting, 50);
            }
        });
    });

    // Mobile Hamburger Menu Toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });
    }
}

function initTheme() {
    const themeBtn = document.getElementById("theme-toggle");
    
    // Apply theme classes
    if (appState.theme === "light") {
        document.body.classList.add("light-theme");
        document.documentElement.classList.remove("dark");
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
        document.body.classList.remove("light-theme");
        document.documentElement.classList.add("dark");
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
    
    themeBtn.addEventListener("click", () => {
        appState.theme = appState.theme === "dark" ? "light" : "dark";
        if (appState.theme === "light") {
            document.body.classList.add("light-theme");
            document.documentElement.classList.remove("dark");
            themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            document.body.classList.remove("light-theme");
            document.documentElement.classList.add("dark");
            themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
        saveStateToStorage();
        
        // Re-render SVG Mindmap if visible to adjust colors
        if (!document.getElementById("view-mindmap").classList.contains("hidden")) {
            renderMindMap();
        }
    });
}
