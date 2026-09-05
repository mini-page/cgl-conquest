/**
 * TriStateCheckbox Component
 * Reusable 3-stage progress checkbox for syllabus, tasks, and habit tracking.
 *
 * States:
 *   0: Unattempted / Empty (border-slate-700 bg-slate-950)
 *   1: Learned / Understood (Cyan #06b6d4)
 *   2: Practiced / Solved (Violet #8b5cf6)
 *   3: Mastered / Revision Complete (Amber #f59e0b)
 */

export class TriStateCheckbox {
    /**
     * @param {Object} options
     * @param {number} [options.initialState=0] - Initial state (0, 1, 2, 3)
     * @param {string} [options.id] - Unique identifier
     * @param {string} [options.label] - Optional accessible label
     * @param {Function} [options.onChange] - Callback (newState, previousState, id) => void
     * @param {string} [options.size='md'] - 'sm' (16px), 'md' (20px), 'lg' (24px)
     */
    constructor(options = {}) {
        this.id = options.id || `tri-${Math.random().toString(36).slice(2, 9)}`;
        this.state = options.initialState || 0;
        this.label = options.label || '';
        this.onChange = options.onChange || null;
        this.size = options.size || 'md';
        this.element = this._createDOM();
    }

    _createDOM() {
        const wrapper = document.createElement('button');
        wrapper.type = 'button';
        wrapper.id = this.id;
        wrapper.setAttribute('role', 'checkbox');
        wrapper.setAttribute('aria-label', this.label || 'Progress status');
        wrapper.tabIndex = 0;

        const sizeClasses = {
            sm: 'w-4 h-4 text-[10px] rounded',
            md: 'w-5 h-5 text-xs rounded-md',
            lg: 'w-6 h-6 text-sm rounded-lg'
        }[this.size] || 'w-5 h-5 text-xs rounded-md';

        wrapper.className = `tri-state-box inline-flex items-center justify-center font-black border transition-all duration-200 select-none cursor-pointer active:scale-90 ${sizeClasses}`;
        
        wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            this.cycle();
        });

        wrapper.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                this.cycle();
            }
        });

        this._renderState(wrapper);
        return wrapper;
    }

    _renderState(el = this.element) {
        const sizeClasses = {
            sm: 'w-4 h-4 text-[10px] rounded',
            md: 'w-5 h-5 text-xs rounded-md',
            lg: 'w-6 h-6 text-sm rounded-lg'
        }[this.size] || 'w-5 h-5 text-xs rounded-md';

        el.className = `tri-state-box inline-flex items-center justify-center font-black border transition-all duration-200 select-none cursor-pointer active:scale-90 ${sizeClasses}`;

        el.setAttribute('aria-checked', this.state > 0 ? 'true' : 'false');
        el.setAttribute('data-state', this.state);

        switch (this.state) {
            case 1: // Learned (Cyan)
                el.classList.add('bg-cyan-500', 'border-cyan-400', 'text-slate-950', 'shadow-md', 'shadow-cyan-500/40');
                el.innerHTML = '<i class="fa-solid fa-check"></i>';
                el.title = 'Status: Learned (1/3)';
                break;
            case 2: // Practiced (Violet)
                el.classList.add('bg-purple-600', 'border-purple-400', 'text-white', 'shadow-md', 'shadow-purple-500/40');
                el.innerHTML = '<i class="fa-solid fa-check-double"></i>';
                el.title = 'Status: Practiced (2/3)';
                break;
            case 3: // Mastered (Amber)
                el.classList.add('bg-amber-500', 'border-amber-400', 'text-slate-950', 'shadow-md', 'shadow-amber-500/50');
                el.innerHTML = '<i class="fa-solid fa-crown"></i>';
                el.title = 'Status: Mastered (3/3)';
                break;
            case 0:
            default: // Empty
                el.classList.add('bg-slate-950/80', 'border-white/20', 'hover:border-white/40', 'text-transparent');
                el.innerHTML = '';
                el.title = 'Status: Unstarted (0/3)';
                break;
        }
    }

    cycle() {
        const prev = this.state;
        this.state = (this.state + 1) % 4;
        this._renderState();
        if (this.onChange) {
            this.onChange(this.state, prev, this.id);
        }
    }

    setState(newState) {
        if (newState >= 0 && newState <= 3 && newState !== this.state) {
            const prev = this.state;
            this.state = newState;
            this._renderState();
            if (this.onChange) {
                this.onChange(this.state, prev, this.id);
            }
        }
    }

    getState() {
        return this.state;
    }
}

if (typeof window !== 'undefined') {
    window.TriStateCheckbox = TriStateCheckbox;
}
