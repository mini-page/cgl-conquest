// Custom Reusable Calendar Component
class CustomCalendar {
    constructor(inputElement, onSelectCallback) {
        this.input = inputElement;
        this.onSelect = onSelectCallback;
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.dropdown = null;

        // Parse initial input value if valid
        if (this.input.value) {
            const parsed = new Date(this.input.value);
            if (!isNaN(parsed)) {
                this.selectedDate = parsed;
                this.currentDate = new Date(parsed);
            }
        }

        this.init();
    }

    init() {
        // Prevent default mobile keyboard
        this.input.setAttribute("readonly", "true");
        this.input.style.cursor = "pointer";

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

    toggleDropdown() {
        if (this.dropdown) {
            this.destroyDropdown();
        } else {
            // Close other calendars if any
            const existing = document.querySelectorAll(".custom-calendar-dropdown");
            existing.forEach(el => el.remove());
            this.createDropdown();
        }
    }

    createDropdown() {
        this.dropdown = document.createElement("div");
        this.dropdown.className = "custom-calendar-dropdown fixed z-[99999]";
        
        // Position below input using viewport bounding rect
        const rect = this.input.getBoundingClientRect();
        
        this.dropdown.style.position = "fixed";
        this.dropdown.style.top = `${rect.bottom + 4}px`;
        this.dropdown.style.left = `${rect.left}px`;
        this.dropdown.style.zIndex = "99999";

        document.body.appendChild(this.dropdown);
        this.render();
    }

    destroyDropdown() {
        if (this.dropdown) {
            this.dropdown.remove();
            this.dropdown = null;
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

        // Build Month Select Options
        let monthOptions = "";
        monthNames.forEach((name, idx) => {
            monthOptions += `<option value="${idx}" ${idx === month ? 'selected' : ''}>${name.substring(0, 3)}</option>`;
        });
        const monthSelect = `<select class="calendar-month-select bg-transparent text-white font-bold text-xs outline-none cursor-pointer border border-transparent hover:border-white/10 rounded px-1">${monthOptions}</select>`;

        // Build Year Select Options (from 5 years ago to 10 years from now)
        let yearOptions = "";
        const currentYear = new Date().getFullYear();
        for (let y = currentYear - 5; y <= currentYear + 10; y++) {
            yearOptions += `<option value="${y}" ${y === year ? 'selected' : ''}>${y}</option>`;
        }
        const yearSelect = `<select class="calendar-year-select bg-transparent text-white font-bold text-xs outline-none cursor-pointer border border-transparent hover:border-white/10 rounded px-1 ml-1">${yearOptions}</select>`;

        // Header HTML
        let html = `
            <div class="custom-calendar-header flex items-center justify-between">
                <button type="button" class="calendar-prev-btn">&lt;</button>
                <div class="flex items-center text-xs font-bold">
                    ${monthSelect}
                    ${yearSelect}
                </div>
                <div class="flex items-center gap-1">
                    <button type="button" class="calendar-today-btn font-extrabold text-[9px] px-1 bg-white/5 border border-white/10 hover:bg-accentCyan/25 hover:text-accentCyan rounded transition" title="Go to Today" style="width: auto; height: 20px; text-transform: uppercase;">Today</button>
                    <button type="button" class="calendar-next-btn">&gt;</button>
                </div>
            </div>
            <div class="custom-calendar-grid">
                <div class="custom-calendar-day-name">Su</div>
                <div class="custom-calendar-day-name">Mo</div>
                <div class="custom-calendar-day-name">Tu</div>
                <div class="custom-calendar-day-name">We</div>
                <div class="custom-calendar-day-name">Th</div>
                <div class="custom-calendar-day-name">Fr</div>
                <div class="custom-calendar-day-name">Sa</div>
        `;

        // Calculate days
        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        // Empty cells for days before the 1st
        for (let i = 0; i < firstDayIndex; i++) {
            html += `<div class="custom-calendar-day empty"></div>`;
        }

        const today = new Date();

        // Calendar days
        for (let day = 1; day <= totalDays; day++) {
            const isSelected = this.selectedDate.getDate() === day &&
                               this.selectedDate.getMonth() === month &&
                               this.selectedDate.getFullYear() === year;

            const isToday = today.getDate() === day &&
                             today.getMonth() === month &&
                             today.getFullYear() === year;

            let classes = "custom-calendar-day";
            if (isSelected) classes += " selected";
            if (isToday) classes += " today";

            html += `<div class="${classes}" data-day="${day}">${day}</div>`;
        }

        html += `</div>`;
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
            this.currentDate.setMonth(parseInt(e.target.value));
            this.render();
        };

        this.dropdown.querySelector(".calendar-year-select").onchange = (e) => {
            e.stopPropagation();
            this.currentDate.setFullYear(parseInt(e.target.value));
            this.render();
        };

        this.dropdown.querySelector(".calendar-today-btn").onclick = (e) => {
            e.stopPropagation();
            this.selectedDate = new Date();
            this.currentDate = new Date();
            const formatted = this.selectedDate.toISOString().substring(0, 10);
            this.input.value = formatted;
            this.input.dispatchEvent(new Event("change"));
            if (this.onSelect) this.onSelect(formatted);
            this.destroyDropdown();
        };

        this.dropdown.querySelectorAll(".custom-calendar-day:not(.empty)").forEach(el => {
            el.onclick = (e) => {
                e.stopPropagation();
                const selectedDay = parseInt(el.getAttribute("data-day"));
                this.selectedDate = new Date(year, month, selectedDay);
                
                // Format YYYY-MM-DD
                const formatted = this.selectedDate.toISOString().substring(0, 10);
                this.input.value = formatted;
                this.input.dispatchEvent(new Event("change"));

                if (this.onSelect) this.onSelect(formatted);
                this.destroyDropdown();
            };
        });
    }
}

// Global initialization helper
window.initCustomCalendar = function(inputEl, onSelectCallback) {
    return new CustomCalendar(inputEl, onSelectCallback);
};
