/**
 * ToggleSwitch Component
 * Accessible sliding knob toggle switch for settings, feature flags,
 * themes, and filters with smooth translation and colored tracks.
 */

export class ToggleSwitch {
    /**
     * @param {Object} options
     * @param {string} [options.id] - Element ID
     * @param {string} [options.label] - Visible or accessible label
     * @param {boolean} [options.checked=false] - Initial state
     * @param {string} [options.activeColor='cyan'] - 'cyan', 'emerald', 'amber', 'purple'
     * @param {Function} [options.onChange] - Callback (isChecked, id) => void
     */
    constructor(options = {}) {
        this.id = options.id || `toggle-${Math.random().toString(36).slice(2, 9)}`;
        this.label = options.label || '';
        this.checked = Boolean(options.checked);
        this.activeColor = options.activeColor || 'cyan';
        this.onChange = options.onChange || null;
        this.element = this._createDOM();
    }

    _createDOM() {
        const wrapper = document.createElement('label');
        wrapper.className = 'inline-flex items-center gap-2.5 cursor-pointer select-none';

        if (this.label) {
            this.labelSpan = document.createElement('span');
            this.labelSpan.className = 'text-xs font-semibold text-gray-300';
            this.labelSpan.textContent = this.label;
            wrapper.appendChild(this.labelSpan);
        }

        // Switch Button Container
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.id = this.id;
        this.button.setAttribute('role', 'switch');
        this.button.setAttribute('aria-checked', this.checked ? 'true' : 'false');
        this.button.tabIndex = 0;

        // Sliding knob
        this.knob = document.createElement('span');
        this.knob.className = 'pointer-events-none w-4 h-4 rounded-full bg-white shadow-md block transition-transform duration-200 ease-out';

        this.button.appendChild(this.knob);
        wrapper.appendChild(this.button);

        this._renderState();

        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });

        this.button.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                this.toggle();
            }
        });

        return wrapper;
    }

    _renderState() {
        const colorTrackMap = {
            cyan: 'bg-cyan-500/25 border-cyan-400/50',
            emerald: 'bg-emerald-500/25 border-emerald-400/50',
            amber: 'bg-amber-500/25 border-amber-400/50',
            purple: 'bg-purple-500/25 border-purple-400/50'
        }[this.activeColor] || 'bg-cyan-500/25 border-cyan-400/50';

        const baseBtnClasses = 'w-11 h-6 rounded-full p-1 border transition-colors duration-200 flex items-center shrink-0 cursor-pointer shadow-inner';

        if (this.checked) {
            this.button.className = `${baseBtnClasses} ${colorTrackMap}`;
            this.knob.style.transform = 'translateX(20px)';
        } else {
            this.button.className = `${baseBtnClasses} bg-white/10 border-white/10`;
            this.knob.style.transform = 'translateX(0px)';
        }

        this.button.setAttribute('aria-checked', this.checked ? 'true' : 'false');
    }

    toggle() {
        this.checked = !this.checked;
        this._renderState();
        if (this.onChange) {
            this.onChange(this.checked, this.id);
        }
    }

    setChecked(val) {
        if (this.checked !== Boolean(val)) {
            this.checked = Boolean(val);
            this._renderState();
            if (this.onChange) {
                this.onChange(this.checked, this.id);
            }
        }
    }

    isChecked() {
        return this.checked;
    }
}

if (typeof window !== 'undefined') {
    window.ToggleSwitch = ToggleSwitch;
}
