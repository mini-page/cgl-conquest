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

    // Broadcast message to Screen Reader Live Region
    const srAnnouncer = document.getElementById("sr-announcer");
    if (srAnnouncer) srAnnouncer.innerText = message;

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

// Native Glassmorphic Custom Confirm Modal
window.showConfirm = (title, message) => {
    return new Promise((resolve) => {
        const overlay = document.createElement("div");
        overlay.className = "fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-200";
        
        overlay.innerHTML = `
            <div class="bg-slate-900 border border-white/20 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 transform scale-100 transition-transform duration-200">
                <div class="flex items-center gap-3 border-b border-white/10 pb-3">
                    <div class="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center text-base font-bold shadow-inner">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div>
                        <h3 class="font-heading font-extrabold text-sm text-white uppercase tracking-wider">${title || 'Confirmation'}</h3>
                        <span class="text-[10px] text-gray-400">Please confirm your action</span>
                    </div>
                </div>
                <p class="text-xs text-gray-300 leading-relaxed">${message}</p>
                <div class="flex gap-2.5 pt-2">
                    <button type="button" id="custom-confirm-yes" class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 border border-blue-400/30 transition cursor-pointer">
                        Confirm
                    </button>
                    <button type="button" id="custom-confirm-no" class="px-4 bg-white/10 hover:bg-white/20 text-gray-300 font-bold py-2.5 rounded-xl text-xs uppercase transition cursor-pointer">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        overlay.querySelector("#custom-confirm-yes").onclick = () => {
            overlay.remove();
            resolve(true);
        };
        overlay.querySelector("#custom-confirm-no").onclick = () => {
            overlay.remove();
            resolve(false);
        };
    });
};

// Native Glassmorphic Custom Alert Modal
window.showAlert = (title, message, type = 'info') => {
    return new Promise((resolve) => {
        const overlay = document.createElement("div");
        overlay.className = "fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-200";
        
        let icon = "fa-info-circle text-cyan-400";
        let iconBg = "bg-cyan-500/20 border-cyan-500/30";
        if (type === 'success') {
            icon = "fa-circle-check text-emerald-400";
            iconBg = "bg-emerald-500/20 border-emerald-500/30";
        } else if (type === 'warning') {
            icon = "fa-triangle-exclamation text-amber-400";
            iconBg = "bg-amber-500/20 border-amber-500/30";
        } else if (type === 'error') {
            icon = "fa-circle-xmark text-rose-400";
            iconBg = "bg-rose-500/20 border-rose-500/30";
        }

        overlay.innerHTML = `
            <div class="bg-slate-900 border border-white/20 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 transform scale-100 transition-transform duration-200">
                <div class="flex items-center gap-3 border-b border-white/10 pb-3">
                    <div class="w-9 h-9 rounded-2xl ${iconBg} border flex items-center justify-center text-base font-bold shadow-inner">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <div>
                        <h3 class="font-heading font-extrabold text-sm text-white uppercase tracking-wider">${title || 'Notice'}</h3>
                        <span class="text-[10px] text-gray-400">Conquest Alert</span>
                    </div>
                </div>
                <p class="text-xs text-gray-300 leading-relaxed">${message}</p>
                <div class="pt-2">
                    <button type="button" id="custom-alert-ok" class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 border border-blue-400/30 transition cursor-pointer">
                        OK
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.querySelector("#custom-alert-ok").onclick = () => {
            overlay.remove();
            resolve();
        };
    });
};
