/**
 * SearchBar Component
 * Search input field with debounce, icon indicators, clear button,
 * keyboard shortcuts, and responsive dark glassmorphic styling.
 */

export class SearchBar {
    /**
     * @param {Object} options
     * @param {string} [options.id] - Element ID
     * @param {string} [options.placeholder='Search...'] - Placeholder text
     * @param {string} [options.hotkey='/'] - Optional hotkey (e.g. '/' or 'k')
     * @param {number} [options.debounceMs=200] - Debounce delay in milliseconds
     * @param {Function} [options.onSearch] - Callback (query) => void
     * @param {Function} [options.onClear] - Callback () => void
     */
    constructor(options = {}) {
        this.id = options.id || `search-${Math.random().toString(36).slice(2, 9)}`;
        this.placeholder = options.placeholder || 'Search...';
        this.hotkey = options.hotkey || '/';
        this.debounceMs = options.debounceMs || 200;
        this.onSearch = options.onSearch || null;
        this.onClear = options.onClear || null;
        this._debounceTimer = null;
        this.element = this._createDOM();
    }

    _createDOM() {
        const wrapper = document.createElement('div');
        wrapper.className = 'relative flex items-center w-full';

        // Search icon
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/70 text-xs pointer-events-none transition-colors';

        // Input
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.id = this.id;
        this.input.placeholder = this.placeholder;
        this.input.className = 'w-full bg-slate-950/90 border border-white/10 hover:border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 rounded-xl pl-9 pr-14 py-2 text-xs text-white placeholder-gray-500 outline-none transition shadow-inner';

        // Right side indicators (Clear button + Hotkey Badge)
        const rightContainer = document.createElement('div');
        rightContainer.className = 'absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5';

        // Clear button
        this.btnClear = document.createElement('button');
        this.btnClear.type = 'button';
        this.btnClear.className = 'w-5 h-5 rounded-md text-gray-500 hover:text-white flex items-center justify-center text-[10px] transition hidden cursor-pointer';
        this.btnClear.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        this.btnClear.title = 'Clear search';
        this.btnClear.addEventListener('click', () => {
            this.clear();
            this.input.focus();
        });

        // Hotkey badge
        if (this.hotkey) {
            this.hotkeyBadge = document.createElement('kbd');
            this.hotkeyBadge.className = 'px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-gray-400 font-bold';
            this.hotkeyBadge.textContent = this.hotkey.toUpperCase();
            rightContainer.appendChild(this.hotkeyBadge);
        }

        rightContainer.appendChild(this.btnClear);

        wrapper.appendChild(icon);
        wrapper.appendChild(this.input);
        wrapper.appendChild(rightContainer);

        // Input listeners
        this.input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                this.btnClear.classList.remove('hidden');
                if (this.hotkeyBadge) this.hotkeyBadge.classList.add('hidden');
            } else {
                this.btnClear.classList.add('hidden');
                if (this.hotkeyBadge) this.hotkeyBadge.classList.remove('hidden');
            }

            clearTimeout(this._debounceTimer);
            this._debounceTimer = setTimeout(() => {
                if (this.onSearch) this.onSearch(query);
            }, this.debounceMs);
        });

        // Global shortcut listener if hotkey defined
        if (this.hotkey) {
            window.addEventListener('keydown', (e) => {
                const target = e.target;
                const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
                if (!isTyping && e.key === this.hotkey) {
                    e.preventDefault();
                    this.input.focus();
                    this.input.select();
                }
            });
        }

        return wrapper;
    }

    getValue() {
        return this.input.value.trim();
    }

    setValue(val) {
        this.input.value = val;
        this.input.dispatchEvent(new Event('input'));
    }

    clear() {
        this.input.value = '';
        this.btnClear.classList.add('hidden');
        if (this.hotkeyBadge) this.hotkeyBadge.classList.remove('hidden');
        if (this.onClear) this.onClear();
        if (this.onSearch) this.onSearch('');
    }
}

if (typeof window !== 'undefined') {
    window.SearchBar = SearchBar;
}
