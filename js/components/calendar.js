// Custom Reusable Modern Calendar Component (DD-MM-YYYY Support)
(function() {
    // Inject self-contained modern styles once
    if (!document.getElementById("custom-calendar-styles")) {
        const style = document.createElement("style");
        style.id = "custom-calendar-styles";
        style.textContent = `
            .custom-calendar-dropdown {
                background: rgba(9, 14, 26, 0.96);
                backdrop-filter: blur(24px);
                -webkit-backdrop-filter: blur(24px);
                border: 1px solid rgba(6, 182, 212, 0.35);
                box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 20px rgba(6, 182, 212, 0.15);
                border-radius: 1.25rem;
                padding: 1rem;
                width: 290px;
                user-select: none;
                animation: calFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes calFadeIn {
                from { opacity: 0; transform: translateY(-6px) scale(0.97); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .cal-nav-btn {
                width: 28px;
                height: 28px;
                border-radius: 0.6rem;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #94a3b8;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.15s ease;
            }
            .cal-nav-btn:hover {
                background: rgba(6, 182, 212, 0.2);
                border-color: rgba(6, 182, 212, 0.4);
                color: #22d3ee;
                transform: scale(1.05);
            }
            .cal-select {
                background: rgba(15, 23, 42, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.12);
                color: #f1f5f9;
                font-size: 11px;
                font-weight: 700;
                padding: 3px 6px;
                border-radius: 0.5rem;
                outline: none;
                cursor: pointer;
                transition: border-color 0.15s ease;
            }
            .cal-select:hover, .cal-select:focus {
                border-color: rgba(6, 182, 212, 0.6);
            }
            .cal-day-cell {
                width: 34px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 0.6rem;
                font-size: 11px;
                font-weight: 600;
                color: #cbd5e1;
                cursor: pointer;
                border: 1px solid transparent;
                transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .cal-day-cell:hover:not(.empty):not(.selected) {
                background: rgba(6, 182, 212, 0.18);
                border-color: rgba(6, 182, 212, 0.4);
                color: #38bdf8;
                transform: scale(1.08);
            }
            .cal-day-cell.today:not(.selected) {
                border-color: rgba(52, 211, 153, 0.6);
                color: #34d399;
                font-weight: 800;
                box-shadow: inset 0 0 6px rgba(52, 211, 153, 0.2);
            }
            .cal-day-cell.selected {
                background: linear-gradient(135deg, #06b6d4, #0d9488) !important;
                color: #020617 !important;
                font-weight: 900 !important;
                box-shadow: 0 4px 14px rgba(6, 182, 212, 0.45);
                transform: scale(1.06);
            }
        `;
        document.head.appendChild(style);
    }
})();

function parseDateInputSafe(str) {
    if (!str) return new Date();
    if (str instanceof Date) return isNaN(str.getTime()) ? new Date() : str;
    const clean = String(str).trim();
    
    // Check DD-MM-YYYY or DD/MM/YYYY or DD.MM.YYYY
    const dmy = clean.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
    if (dmy) {
        const d = parseInt(dmy[1], 10);
        const m = parseInt(dmy[2], 10) - 1;
        const y = parseInt(dmy[3], 10);
        const dt = new Date(y, m, d);
        if (!isNaN(dt.getTime())) return dt;
    }

    // Check YYYY-MM-DD or YYYY/MM/DD
    const ymd = clean.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
    if (ymd) {
        const y = parseInt(ymd[1], 10);
        const m = parseInt(ymd[2], 10) - 1;
        const d = parseInt(ymd[3], 10);
        const dt = new Date(y, m, d);
        if (!isNaN(dt.getTime())) return dt;
    }

    const fallback = new Date(clean);
    return isNaN(fallback.getTime()) ? new Date() : fallback;
}

function formatDateToDMY(date) {
    if (!date || isNaN(date.getTime())) return "";
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}

class CustomCalendar {
    constructor(inputElement, onSelectCallback) {
        this.input = inputElement;
        this.onSelect = onSelectCallback;
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.dropdown = null;
        this.onKeyDown = this.handleKeyDown.bind(this);

        // Normalize initial input value to DD-MM-YYYY if present
        if (this.input.value) {
            const parsed = parseDateInputSafe(this.input.value);
            this.selectedDate = parsed;
            this.currentDate = new Date(parsed);
            this.input.value = formatDateToDMY(parsed);
        }

        this.init();
    }

    init() {
        this.input.setAttribute("readonly", "true");
        this.input.style.cursor = "pointer";
        this.input.setAttribute("placeholder", "DD-MM-YYYY");

        this.input.addEventListener("click", (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        document.addEventListener("click", (e) => {
            if (this.dropdown && !this.dropdown.contains(e.target) && e.target !== this.input) {
                this.destroyDropdown();
            }
        });
    }

    handleKeyDown(e) {
        if (e.key === "Escape") {
            this.destroyDropdown();
        }
    }

    toggleDropdown() {
        if (this.dropdown) {
            this.destroyDropdown();
        } else {
            // Close other open calendar popovers
            const existing = document.querySelectorAll(".custom-calendar-dropdown");
            existing.forEach(el => el.remove());
            this.createDropdown();
        }
    }

    createDropdown() {
        // Refresh selected date from input
        if (this.input.value) {
            const parsed = parseDateInputSafe(this.input.value);
            this.selectedDate = parsed;
            this.currentDate = new Date(parsed);
        }

        this.dropdown = document.createElement("div");
        this.dropdown.className = "custom-calendar-dropdown fixed z-[999999]";
        
        // Position below input using viewport bounding rect
        const rect = this.input.getBoundingClientRect();
        const calWidth = 290;
        const calHeight = 310;
        
        let top = rect.bottom + 6;
        let left = rect.left;
        
        // Overflow bottom check
        if (top + calHeight > window.innerHeight) {
            top = Math.max(10, rect.top - calHeight - 6);
        }
        // Overflow right check
        if (left + calWidth > window.innerWidth) {
            left = Math.max(10, window.innerWidth - calWidth - 12);
        }
        
        this.dropdown.style.position = "fixed";
        this.dropdown.style.top = `${top}px`;
        this.dropdown.style.left = `${left}px`;
        this.dropdown.style.zIndex = "999999";

        document.body.appendChild(this.dropdown);
        document.addEventListener("keydown", this.onKeyDown);
        this.render();
    }

    destroyDropdown() {
        if (this.dropdown) {
            this.dropdown.remove();
            this.dropdown = null;
            document.removeEventListener("keydown", this.onKeyDown);
        }
    }

    render() {
        if (!this.dropdown) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Month selector
        let monthOptions = "";
        monthNames.forEach((name, idx) => {
            monthOptions += `<option value="${idx}" ${idx === month ? 'selected' : ''}>${name.substring(0, 3)}</option>`;
        });
        const monthSelect = `<select class="calendar-month-select cal-select">${monthOptions}</select>`;

        // Year selector (±10 years range)
        let yearOptions = "";
        const currentYear = new Date().getFullYear();
        for (let y = currentYear - 6; y <= currentYear + 8; y++) {
            yearOptions += `<option value="${y}" ${y === year ? 'selected' : ''}>${y}</option>`;
        }
        const yearSelect = `<select class="calendar-year-select cal-select ml-1">${yearOptions}</select>`;

        const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const previewStr = `${String(this.selectedDate.getDate()).padStart(2, '0')} ${monthsShort[this.selectedDate.getMonth()]} ${this.selectedDate.getFullYear()}`;

        // Header HTML
        let html = `
            <div class="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
                <button type="button" class="cal-nav-btn calendar-prev-btn" title="Previous Month">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <div class="flex items-center">
                    ${monthSelect}
                    ${yearSelect}
                </div>
                <div class="flex items-center gap-1.5">
                    <button type="button" class="calendar-today-btn px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition cursor-pointer" title="Jump to Today">Today</button>
                    <button type="button" class="cal-nav-btn calendar-next-btn" title="Next Month">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>

            <!-- Day Headers -->
            <div class="grid grid-cols-7 gap-1 text-center mb-1.5">
                <div class="text-[10px] font-mono font-bold text-rose-400">Su</div>
                <div class="text-[10px] font-mono font-bold text-gray-400">Mo</div>
                <div class="text-[10px] font-mono font-bold text-gray-400">Tu</div>
                <div class="text-[10px] font-mono font-bold text-gray-400">We</div>
                <div class="text-[10px] font-mono font-bold text-gray-400">Th</div>
                <div class="text-[10px] font-mono font-bold text-gray-400">Fr</div>
                <div class="text-[10px] font-mono font-bold text-cyan-400">Sa</div>
            </div>

            <!-- Days Grid -->
            <div class="grid grid-cols-7 gap-1 text-center">
        `;

        // Calculate days layout
        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        // Empty cells for alignment
        for (let i = 0; i < firstDayIndex; i++) {
            html += `<div class="cal-day-cell empty pointer-events-none"></div>`;
        }

        const today = new Date();

        // Days loop
        for (let day = 1; day <= totalDays; day++) {
            const isSelected = this.selectedDate.getDate() === day &&
                               this.selectedDate.getMonth() === month &&
                               this.selectedDate.getFullYear() === year;

            const isToday = today.getDate() === day &&
                            today.getMonth() === month &&
                            today.getFullYear() === year;

            let classes = "cal-day-cell";
            if (isSelected) classes += " selected";
            if (isToday) classes += " today";

            html += `<div class="${classes}" data-day="${day}">${day}</div>`;
        }

        html += `
            </div>

            <!-- Footer: Preview & Clear -->
            <div class="flex items-center justify-between pt-2.5 mt-2.5 border-t border-white/10 text-[10px]">
                <span class="text-gray-400 font-mono"><i class="fa-regular fa-calendar-check text-cyan-400 mr-1"></i>${previewStr}</span>
                <button type="button" class="calendar-clear-btn text-gray-400 hover:text-rose-400 transition font-bold uppercase tracking-wider text-[9px] cursor-pointer">Clear</button>
            </div>
        `;

        this.dropdown.innerHTML = html;

        // Bind events
        this.dropdown.querySelector(".calendar-prev-btn").onclick = (e) => {
            e.stopPropagation();
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
        };

        this.dropdown.querySelector(".calendar-next-btn").onclick = (e) => {
            e.stopPropagation();
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
        };

        this.dropdown.querySelector(".calendar-month-select").onchange = (e) => {
            e.stopPropagation();
            this.currentDate.setMonth(parseInt(e.target.value, 10));
            this.render();
        };

        this.dropdown.querySelector(".calendar-year-select").onchange = (e) => {
            e.stopPropagation();
            this.currentDate.setFullYear(parseInt(e.target.value, 10));
            this.render();
        };

        this.dropdown.querySelector(".calendar-today-btn").onclick = (e) => {
            e.stopPropagation();
            const now = new Date();
            this.selectedDate = now;
            this.currentDate = new Date(now);
            const formatted = formatDateToDMY(now);
            this.input.value = formatted;
            this.input.dispatchEvent(new Event("change"));
            this.input.dispatchEvent(new Event("input"));
            if (this.onSelect) this.onSelect(formatted);
            this.destroyDropdown();
        };

        const clearBtn = this.dropdown.querySelector(".calendar-clear-btn");
        if (clearBtn) {
            clearBtn.onclick = (e) => {
                e.stopPropagation();
                this.input.value = "";
                this.input.dispatchEvent(new Event("change"));
                this.input.dispatchEvent(new Event("input"));
                if (this.onSelect) this.onSelect("");
                this.destroyDropdown();
            };
        }

        this.dropdown.querySelectorAll(".cal-day-cell:not(.empty)").forEach(el => {
            el.onclick = (e) => {
                e.stopPropagation();
                const selectedDay = parseInt(el.getAttribute("data-day"), 10);
                this.selectedDate = new Date(year, month, selectedDay);
                
                // Always format in DD-MM-YYYY
                const formatted = formatDateToDMY(this.selectedDate);
                this.input.value = formatted;
                this.input.dispatchEvent(new Event("change"));
                this.input.dispatchEvent(new Event("input"));

                if (this.onSelect) this.onSelect(formatted);
                this.destroyDropdown();
            };
        });
    }
}

// Global initialization helpers
window.initCustomCalendar = function(inputEl, onSelectCallback) {
    return new CustomCalendar(inputEl, onSelectCallback);
};
window.formatDateToDMY = formatDateToDMY;
window.parseDateInputSafe = parseDateInputSafe;

