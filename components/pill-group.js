/**
 * PillGroup Component
 * Horizontal scrollable, snap-aligned pill deck for KPI stats,
 * filters, view selectors, and quick-action triggers.
 */

export class PillGroup {
    /**
     * @param {Object} options
     * @param {string} [options.id] - Element ID
     * @param {Array<Object>} [options.items=[]] - Array of pill definitions:
     *   { id, label, icon, value, active, color, onClick }
     * @param {string} [options.mode='static'] - 'static' (stat cards) or 'selectable' (single select)
     * @param {Function} [options.onSelect] - Callback (selectedId, item) => void
     */
    constructor(options = {}) {
        this.id = options.id || `pills-${Math.random().toString(36).slice(2, 9)}`;
        this.items = options.items || [];
        this.mode = options.mode || 'static';
        this.onSelect = options.onSelect || null;
        this.selectedId = this.items.find(i => i.active)?.id || null;
        this.element = this._createDOM();
    }

    _createDOM() {
        const container = document.createElement('div');
        container.id = this.id;
        container.className = 'flex items-center gap-2.5 sm:gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory flex-nowrap py-1 select-none';

        this.items.forEach(item => {
            const pill = this._createPillElement(item);
            container.appendChild(pill);
        });

        return container;
    }

    _createPillElement(item) {
        const isClickable = this.mode === 'selectable' || typeof item.onClick === 'function';
        const el = document.createElement(isClickable ? 'button' : 'div');
        if (isClickable) el.type = 'button';

        el.id = `pill-${item.id}`;
        el.setAttribute('data-id', item.id);

        const colorTheme = item.color || 'cyan';
        const colorMap = {
            cyan: { border: 'border-cyan-500/30', text: 'text-cyan-400', activeBg: 'bg-cyan-600', activeText: 'text-white' },
            teal: { border: 'border-teal-500/30', text: 'text-teal-400', activeBg: 'bg-teal-600', activeText: 'text-white' },
            emerald: { border: 'border-emerald-500/30', text: 'text-emerald-400', activeBg: 'bg-emerald-600', activeText: 'text-white' },
            purple: { border: 'border-purple-500/30', text: 'text-purple-400', activeBg: 'bg-purple-600', activeText: 'text-white' },
            amber: { border: 'border-amber-500/30', text: 'text-amber-400', activeBg: 'bg-amber-600', activeText: 'text-white' },
            rose: { border: 'border-rose-500/30', text: 'text-rose-400', activeBg: 'bg-rose-600', activeText: 'text-white' },
            indigo: { border: 'border-indigo-500/30', text: 'text-indigo-400', activeBg: 'bg-indigo-600', activeText: 'text-white' }
        }[colorTheme] || { border: 'border-cyan-500/30', text: 'text-cyan-400', activeBg: 'bg-cyan-600', activeText: 'text-white' };

        const baseClasses = 'shrink-0 snap-start flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-inner backdrop-blur-md transition-all duration-200';
        const interactiveClasses = isClickable ? 'cursor-pointer hover:border-white/30 active:scale-95' : '';

        const isActive = this.mode === 'selectable' && this.selectedId === item.id;
        const stateClasses = isActive
            ? `${colorMap.activeBg} ${colorMap.activeText} border-transparent shadow-md`
            : `bg-slate-950/80 ${colorMap.border} text-white`;

        el.className = `${baseClasses} ${interactiveClasses} ${stateClasses}`;

        let innerHTML = '';
        if (item.icon) {
            innerHTML += `<i class="${item.icon} ${isActive ? 'text-white' : colorMap.text} text-xs transition"></i>`;
        }
        innerHTML += `<span class="pill-label">${item.label}</span>`;
        if (item.value !== undefined) {
            innerHTML += ` <strong class="pill-value ${isActive ? 'text-white' : colorMap.text} font-extrabold">${item.value}</strong>`;
        }

        el.innerHTML = innerHTML;

        if (isClickable) {
            el.addEventListener('click', () => {
                if (this.mode === 'selectable') {
                    this.setSelected(item.id);
                }
                if (item.onClick) item.onClick(item);
            });
        }

        return el;
    }

    setSelected(id) {
        this.selectedId = id;
        this.items.forEach(item => {
            const el = this.element.querySelector(`[data-id="${item.id}"]`);
            if (!el) return;

            const colorTheme = item.color || 'cyan';
            const colorMap = {
                cyan: { border: 'border-cyan-500/30', text: 'text-cyan-400', activeBg: 'bg-cyan-600', activeText: 'text-white' },
                teal: { border: 'border-teal-500/30', text: 'text-teal-400', activeBg: 'bg-teal-600', activeText: 'text-white' },
                emerald: { border: 'border-emerald-500/30', text: 'text-emerald-400', activeBg: 'bg-emerald-600', activeText: 'text-white' },
                purple: { border: 'border-purple-500/30', text: 'text-purple-400', activeBg: 'bg-purple-600', activeText: 'text-white' },
                amber: { border: 'border-amber-500/30', text: 'text-amber-400', activeBg: 'bg-amber-600', activeText: 'text-white' },
                rose: { border: 'border-rose-500/30', text: 'text-rose-400', activeBg: 'bg-rose-600', activeText: 'text-white' },
                indigo: { border: 'border-indigo-500/30', text: 'text-indigo-400', activeBg: 'bg-indigo-600', activeText: 'text-white' }
            }[colorTheme] || { border: 'border-cyan-500/30', text: 'text-cyan-400', activeBg: 'bg-cyan-600', activeText: 'text-white' };

            const icon = el.querySelector('i');
            const val = el.querySelector('.pill-value');

            if (item.id === id) {
                el.className = el.className
                    .replace(/bg-slate-950\/\d+/g, '')
                    .replace(/border-\S+/g, '')
                    .replace(/text-\S+/g, '');
                el.classList.add(colorMap.activeBg, colorMap.activeText, 'border-transparent', 'shadow-md');
                if (icon) icon.className = icon.className.replace(/text-\S+/g, 'text-white');
                if (val) val.className = val.className.replace(/text-\S+/g, 'text-white');
            } else {
                el.className = el.className
                    .replace(/bg-\S+-600/g, '')
                    .replace(/text-white/g, '');
                el.classList.add('bg-slate-950/80', colorMap.border, 'text-white');
                if (icon) icon.className = icon.className.replace(/text-white/g, colorMap.text);
                if (val) val.className = val.className.replace(/text-white/g, colorMap.text);
            }
        });

        if (this.onSelect) {
            const found = this.items.find(i => i.id === id);
            this.onSelect(id, found);
        }
    }

    updateValue(id, newValue) {
        const item = this.items.find(i => i.id === id);
        if (item) {
            item.value = newValue;
            const el = this.element.querySelector(`[data-id="${id}"] .pill-value`);
            if (el) el.textContent = newValue;
        }
    }
}

if (typeof window !== 'undefined') {
    window.PillGroup = PillGroup;
}
