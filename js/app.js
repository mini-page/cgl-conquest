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
    
    if (window.gsap) {
        gsap.fromTo(toast, { y: 25, x: 20, opacity: 0, scale: 0.9 }, { y: 0, x: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)" });
        setTimeout(() => {
            gsap.to(toast, { y: 15, opacity: 0, scale: 0.9, duration: 0.25, ease: "power2.in", onComplete: () => {
                toast.remove();
                if (container.children.length === 0) container.remove();
            }});
        }, 3200);
    } else {
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
        }, 3200);
    }
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

// Universal Custom Alert Modal with detailsHtml, custom icons & backdrop transitions
window.showCustomAlert = (options) => {
    if (typeof options === 'string') {
        options = { title: 'Conquest Alert', message: options };
    }
    const {
        title = 'Conquest Alert',
        message = '',
        detailsHtml = '',
        icon = null,
        type = 'info', // 'info' | 'success' | 'warning' | 'error'
        buttonText = 'OK',
        onConfirm = null
    } = options || {};

    return new Promise((resolve) => {
        const modal = document.getElementById("app-custom-dialog-modal");
        if (modal) {
            const iconBgEl = document.getElementById("custom-dialog-icon-bg");
            const iconEl = document.getElementById("custom-dialog-icon");
            const titleEl = document.getElementById("custom-dialog-title");
            const msgEl = document.getElementById("custom-dialog-message");
            const detailsEl = document.getElementById("custom-dialog-details");
            const confirmBtn = document.getElementById("custom-dialog-confirm-btn");

            if (titleEl) titleEl.innerText = title;
            if (msgEl) msgEl.innerText = message;

            if (detailsEl) {
                if (detailsHtml) {
                    detailsEl.innerHTML = detailsHtml;
                    detailsEl.classList.remove("hidden");
                } else {
                    detailsEl.innerHTML = "";
                    detailsEl.classList.add("hidden");
                }
            }

            let iconClass = icon;
            let bgBorderClass = "bg-cyan-500/15 text-cyan-400 border-cyan-500/30 shadow-cyan-500/10";
            let btnGradientClass = "from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-500/20";

            if (type === "success") {
                if (!iconClass) iconClass = "fa-trophy";
                bgBorderClass = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10";
                btnGradientClass = "from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20";
            } else if (type === "warning") {
                if (!iconClass) iconClass = "fa-triangle-exclamation";
                bgBorderClass = "bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-amber-500/10";
                btnGradientClass = "from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 shadow-amber-500/20";
            } else if (type === "error") {
                if (!iconClass) iconClass = "fa-circle-xmark";
                bgBorderClass = "bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-rose-500/10";
                btnGradientClass = "from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-rose-500/20";
            } else {
                if (!iconClass) iconClass = "fa-bolt";
            }

            if (iconBgEl) iconBgEl.className = `w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-2xl border shadow-lg ${bgBorderClass}`;
            if (iconEl) iconEl.className = `fa-solid ${iconClass}`;

            if (confirmBtn) {
                confirmBtn.className = `w-full bg-gradient-to-r ${btnGradientClass} text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer`;
                confirmBtn.innerText = buttonText;
            }

            const closeModal = () => {
                modal.classList.remove("opacity-100", "pointer-events-auto");
                modal.classList.add("opacity-0", "pointer-events-none");
                const card = modal.firstElementChild;
                if (card) {
                    card.classList.remove("scale-100");
                    card.classList.add("scale-95");
                }
                document.removeEventListener("keydown", handleKeydown);
                if (onConfirm) onConfirm();
                resolve();
            };

            const handleKeydown = (e) => {
                if (e.key === "Escape" || e.key === "Enter") {
                    e.preventDefault();
                    closeModal();
                }
            };

            if (confirmBtn) confirmBtn.onclick = closeModal;

            modal.onclick = (e) => {
                if (e.target === modal) closeModal();
            };

            modal.classList.remove("hidden", "opacity-0", "pointer-events-none");
            modal.classList.add("opacity-100", "pointer-events-auto");
            const card = modal.firstElementChild;
            if (card) {
                card.classList.remove("scale-95");
                card.classList.add("scale-100");
            }

            document.addEventListener("keydown", handleKeydown);
            if (confirmBtn) confirmBtn.focus();
            return;
        }

        // Dynamic overlay fallback
        const overlay = document.createElement("div");
        overlay.className = "fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-200";
        overlay.innerHTML = `
            <div class="bg-slate-900 border border-white/20 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center transform scale-100 transition-transform duration-200">
                <div class="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 mx-auto flex items-center justify-center text-xl text-cyan-400">
                    <i class="fa-solid fa-bolt"></i>
                </div>
                <div class="space-y-1">
                    <h3 class="font-heading font-extrabold text-sm text-white uppercase tracking-wider">${title}</h3>
                    <p class="text-xs text-gray-300 leading-relaxed">${message}</p>
                </div>
                ${detailsHtml ? `<div class="text-xs bg-white/5 border border-white/10 rounded-2xl p-3 text-left">${detailsHtml}</div>` : ''}
                <div class="pt-2">
                    <button type="button" id="custom-alert-ok" class="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg transition cursor-pointer">
                        ${buttonText}
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector("#custom-alert-ok").onclick = () => {
            overlay.remove();
            if (onConfirm) onConfirm();
            resolve();
        };
    });
};

window.showAlert = window.showCustomAlert;

// Override browser window.alert globally so no native alerts appear
window.alert = (message) => {
    window.showCustomAlert({
        title: "Conquest Alert",
        message: String(message),
        icon: "fa-bolt",
        type: "info",
        buttonText: "OK"
    });
};
