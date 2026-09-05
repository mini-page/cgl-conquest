/**
 * HeroHeader Component
 * Unified 2-Row Glassmorphic Hero Banner across all major views.
 *
 * Row 1: Section Icon Badge + Main Title + Optional Quick Actions
 * Row 2: Grouped Horizontal Metric Pills / Subtabs / Status Badges
 */

export class HeroHeader {
    /**
     * @param {Object} options
     * @param {string} options.title - View / Section title
     * @param {string} options.icon - FontAwesome icon class
     * @param {string} [options.themeColor='cyan'] - 'cyan', 'amber', 'purple', 'emerald'
     * @param {HTMLElement|string} [options.row1Actions] - Optional buttons in row 1
     * @param {HTMLElement|string} [options.row2Content] - Pills / tabs in row 2
     */
    constructor(options = {}) {
        this.title = options.title || 'Overview';
        this.icon = options.icon || 'fa-chart-line';
        this.themeColor = options.themeColor || 'cyan';
        this.row1Actions = options.row1Actions || null;
        this.row2Content = options.row2Content || null;
        this.element = this._createDOM();
    }

    _createDOM() {
        const wrapper = document.createElement('div');
        wrapper.className = 'hero-header-group bg-gradient-to-r from-cyan-950/70 via-slate-900/90 to-purple-950/70 border border-cyan-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-2xl relative space-y-3.5 mb-6 overflow-hidden';

        // Ambient glow background layers
        const glowLeft = document.createElement('div');
        glowLeft.className = 'absolute -left-12 -top-12 w-56 h-56 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none';
        const glowRight = document.createElement('div');
        glowRight.className = 'absolute -right-12 -bottom-12 w-56 h-56 bg-purple-500/15 rounded-full blur-3xl pointer-events-none';
        wrapper.appendChild(glowLeft);
        wrapper.appendChild(glowRight);

        // Content layer
        const inner = document.createElement('div');
        inner.className = 'relative z-10 space-y-3.5';

        // Row 1: Icon + Title + Quick Actions
        const row1 = document.createElement('div');
        row1.className = 'flex items-center justify-between flex-wrap gap-3';

        const titleGroup = document.createElement('div');
        titleGroup.className = 'flex items-center gap-3';

        const iconBadge = document.createElement('div');
        const iconThemeClass = {
            cyan: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400',
            amber: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
            purple: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
            emerald: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
        }[this.themeColor] || 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400';

        iconBadge.className = `w-10 h-10 rounded-2xl border flex items-center justify-center text-lg shadow-inner ${iconThemeClass}`;
        iconBadge.innerHTML = `<i class="${this.icon}"></i>`;
        titleGroup.appendChild(iconBadge);

        const heading = document.createElement('h2');
        heading.className = 'font-heading font-black text-2xl sm:text-3xl text-white tracking-tight';
        heading.textContent = this.title;
        titleGroup.appendChild(heading);

        row1.appendChild(titleGroup);

        if (this.row1Actions) {
            const actionsWrap = document.createElement('div');
            actionsWrap.className = 'flex items-center gap-2';
            if (typeof this.row1Actions === 'string') {
                actionsWrap.innerHTML = this.row1Actions;
            } else if (this.row1Actions instanceof HTMLElement) {
                actionsWrap.appendChild(this.row1Actions);
            }
            row1.appendChild(actionsWrap);
        }

        inner.appendChild(row1);

        // Row 2: Pills / Tab Stream
        if (this.row2Content) {
            this.row2Container = document.createElement('div');
            this.row2Container.className = 'hero-row-2 w-full';
            if (typeof this.row2Content === 'string') {
                this.row2Container.innerHTML = this.row2Content;
            } else if (this.row2Content instanceof HTMLElement) {
                this.row2Container.appendChild(this.row2Content);
            }
            inner.appendChild(this.row2Container);
        }

        wrapper.appendChild(inner);
        return wrapper;
    }

    setRow2Content(content) {
        if (!this.row2Container) {
            this.row2Container = document.createElement('div');
            this.row2Container.className = 'hero-row-2 w-full';
            this.element.querySelector('.relative.z-10').appendChild(this.row2Container);
        }
        if (typeof content === 'string') {
            this.row2Container.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            this.row2Container.innerHTML = '';
            this.row2Container.appendChild(content);
        }
    }
}

if (typeof window !== 'undefined') {
    window.HeroHeader = HeroHeader;
}
