/**
 * CalendarPicker Component
 * Standalone popup calendar component with strict DD-MM-YYYY formatting,
 * month/year navigation, quick presets, and click-outside dismissal.
 */

export class CalendarPicker {
    /**
     * @param {Object} options
     * @param {HTMLInputElement|string} options.targetInput - Input element or selector
     * @param {string} [options.initialDate] - Initial date string in DD-MM-YYYY
     * @param {Function} [options.onSelect] - Callback (formattedDate, dateObj) => void
     */
    constructor(options = {}) {
        this.input = typeof options.targetInput === 'string'
            ? document.querySelector(options.targetInput)
            : options.targetInput;
        this.onSelect = options.onSelect || null;

        const initialStr = options.initialDate || (this.input ? this.input.value : '');
        this.selectedDate = this._parseDDMMYYYY(initialStr) || new Date();
        this.viewDate = new Date(this.selectedDate);
        this.isOpen = false;

        this._buildDOM();
        if (this.input) {
            this._bindInput();
        }
    }

    _parseDDMMYYYY(str) {
        if (!str || typeof str !== 'string') return null;
        const parts = str.trim().split('-');
        if (parts.length === 3) {
            const d = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10) - 1;
            const y = parseInt(parts[2], 10);
            if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
                return new Date(y, m, d);
            }
        }
        return null;
    }

    _formatDDMMYYYY(date) {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}-${m}-${y}`;
    }

    _buildDOM() {
        this.popup = document.createElement('div');
        this.popup.className = 'fixed z-[999999] bg-slate-900/95 border border-cyan-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl w-64 space-y-3 select-none opacity-0 pointer-events-none transition-all duration-150 hidden';

        // Header: Month/Year navigation
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between text-xs font-bold text-white';

        this.btnPrev = document.createElement('button');
        this.btnPrev.type = 'button';
        this.btnPrev.className = 'w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition';
        this.btnPrev.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        this.btnPrev.onclick = () => this._changeMonth(-1);

        this.monthYearLabel = document.createElement('span');
        this.monthYearLabel.className = 'font-black tracking-wide text-cyan-400';

        this.btnNext = document.createElement('button');
        this.btnNext.type = 'button';
        this.btnNext.className = 'w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition';
        this.btnNext.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        this.btnNext.onclick = () => this._changeMonth(1);

        header.appendChild(this.btnPrev);
        header.appendChild(this.monthYearLabel);
        header.appendChild(this.btnNext);
        this.popup.appendChild(header);

        // Day names header
        const daysRow = document.createElement('div');
        daysRow.className = 'grid grid-cols-7 gap-1 text-[9px] font-extrabold text-gray-500 text-center uppercase';
        ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(day => {
            const span = document.createElement('span');
            span.textContent = day;
            daysRow.appendChild(span);
        });
        this.popup.appendChild(daysRow);

        // Dates grid
        this.datesGrid = document.createElement('div');
        this.datesGrid.className = 'grid grid-cols-7 gap-1 text-xs';
        this.popup.appendChild(this.datesGrid);

        // Quick footer (Today / Clear)
        const footer = document.createElement('div');
        footer.className = 'flex items-center justify-between border-t border-white/10 pt-2 text-[10px] font-extrabold';

        const btnToday = document.createElement('button');
        btnToday.type = 'button';
        btnToday.className = 'text-cyan-400 hover:underline cursor-pointer';
        btnToday.textContent = 'Today';
        btnToday.onclick = () => this.selectDate(new Date());

        const btnYesterday = document.createElement('button');
        btnYesterday.type = 'button';
        btnYesterday.className = 'text-gray-400 hover:text-white cursor-pointer';
        btnYesterday.textContent = 'Yesterday';
        btnYesterday.onclick = () => {
            const d = new Date();
            d.setDate(d.getDate() - 1);
            this.selectDate(d);
        };

        footer.appendChild(btnToday);
        footer.appendChild(btnYesterday);
        this.popup.appendChild(footer);

        document.body.appendChild(this.popup);

        // Click outside listener
        this._outsideHandler = (e) => {
            if (this.isOpen && !this.popup.contains(e.target) && (!this.input || !this.input.contains(e.target))) {
                this.close();
            }
        };
    }

    _bindInput() {
        this.input.readOnly = true;
        this.input.style.cursor = 'pointer';
        this.input.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });
    }

    _renderGrid() {
        const year = this.viewDate.getFullYear();
        const month = this.viewDate.getMonth();

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        this.monthYearLabel.textContent = `${monthNames[month]} ${year}`;

        this.datesGrid.innerHTML = '';

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Padding blanks
        for (let i = 0; i < firstDay; i++) {
            const blank = document.createElement('span');
            blank.className = 'w-7 h-7';
            this.datesGrid.appendChild(blank);
        }

        const today = new Date();

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'w-7 h-7 rounded-lg text-center font-bold text-gray-300 hover:bg-white/10 hover:text-white transition flex items-center justify-center cursor-pointer';
            btn.textContent = day;

            const isSelected = this.selectedDate &&
                this.selectedDate.getDate() === day &&
                this.selectedDate.getMonth() === month &&
                this.selectedDate.getFullYear() === year;

            const isToday = today.getDate() === day &&
                today.getMonth() === month &&
                today.getFullYear() === year;

            if (isSelected) {
                btn.className = 'w-7 h-7 rounded-lg text-center font-black bg-cyan-600 text-white shadow-md cursor-pointer flex items-center justify-center';
            } else if (isToday) {
                btn.className = 'w-7 h-7 rounded-lg text-center font-black border border-cyan-400 text-cyan-400 hover:bg-cyan-950/40 cursor-pointer flex items-center justify-center';
            }

            btn.onclick = () => {
                this.selectDate(new Date(year, month, day));
            };

            this.datesGrid.appendChild(btn);
        }
    }

    _changeMonth(delta) {
        this.viewDate.setMonth(this.viewDate.getMonth() + delta);
        this._renderGrid();
    }

    selectDate(date) {
        this.selectedDate = date;
        const formatted = this._formatDDMMYYYY(date);
        if (this.input) {
            this.input.value = formatted;
            this.input.dispatchEvent(new Event('change'));
        }
        if (this.onSelect) {
            this.onSelect(formatted, date);
        }
        this.close();
    }

    open() {
        if (!this.input) return;
        const rect = this.input.getBoundingClientRect();
        const top = rect.bottom + 6;
        const left = Math.min(rect.left, window.innerWidth - 270);

        this.popup.style.top = `${top}px`;
        this.popup.style.left = `${Math.max(10, left)}px`;

        this.isOpen = true;
        this.popup.classList.remove('hidden');
        void this.popup.offsetWidth;
        this.popup.classList.remove('opacity-0', 'pointer-events-none');

        this.viewDate = new Date(this.selectedDate || new Date());
        this._renderGrid();

        window.addEventListener('click', this._outsideHandler);
    }

    close() {
        this.isOpen = false;
        this.popup.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            if (!this.isOpen) this.popup.classList.add('hidden');
        }, 150);
        window.removeEventListener('click', this._outsideHandler);
    }

    toggle() {
        if (this.isOpen) this.close();
        else this.open();
    }
}

if (typeof window !== 'undefined') {
    window.CalendarPicker = CalendarPicker;
}
