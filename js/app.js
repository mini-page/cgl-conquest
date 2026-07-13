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
    renderAll();
    startExamCountdown();
    initSpeedDrillsPage();
    
    // Compile LaTeX equations once CDNs are parsed
    setTimeout(triggerMathTypesetting, 300);
});
