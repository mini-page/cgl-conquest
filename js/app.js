// Central Application Startup Coordinator
function renderAll() {
    renderDashboardOverview();
    renderSubjectProgressBars();
    setTimeout(triggerMathTypesetting, 50);
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadApplicationData();
    loadStateFromStorage();
    initTheme();
    initNavigation();
    initHeaderScroll();
    initExamTargetEditor();
    initSessionTimer();
    initPomoTimer();
    initForms();
    initToolkitTabs();
    
    // Initial Render
    if (window.upgradeAllSelectDropdowns) window.upgradeAllSelectDropdowns();
    renderAll();
    startExamCountdown();
    initSpeedDrillsPage();
    
    // Compile LaTeX equations once CDNs are parsed
    setTimeout(triggerMathTypesetting, 300);
});

// Premium toast notification system
window.showToast = (message, type = 'info') => {
    if (window.appState && window.appState.toastEnabled === false) return;
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border text-xs font-semibold text-white pointer-events-auto transform translate-y-4 opacity-0 transition duration-300 ease-out select-none max-w-sm";
    
    let icon = "fa-info-circle text-accentCyan";
    let borderColor = "rgba(6, 182, 212, 0.25)";
    let bgStyle = "rgba(13, 16, 28, 0.9)";
    
    if (type === 'success') {
        icon = "fa-check-circle text-accentGreen";
        borderColor = "rgba(16, 185, 129, 0.25)";
    } else if (type === 'warning') {
        icon = "fa-exclamation-triangle text-accentAmber";
        borderColor = "rgba(245, 158, 11, 0.25)";
    } else if (type === 'error') {
        icon = "fa-times-circle text-accentRose";
        borderColor = "rgba(244, 63, 94, 0.25)";
    }
    
    if (document.body.classList.contains("light-theme")) {
        bgStyle = "rgba(255, 255, 255, 0.95)";
        borderColor = "rgba(0, 0, 0, 0.08)";
        toast.className += " text-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.08)]";
    }
    
    toast.style.background = bgStyle;
    toast.style.borderColor = borderColor;

    toast.innerHTML = `
        <i class="fa-solid ${icon} text-sm shrink-0"></i>
        <span class="flex-1 leading-snug">${message}</span>
    `;

    container.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.classList.remove("translate-y-4", "opacity-0");
    });

    setTimeout(() => {
        toast.classList.add("translate-y-2", "opacity-0");
        toast.addEventListener("transitionend", () => {
            toast.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        });
    }, 3500);
};
