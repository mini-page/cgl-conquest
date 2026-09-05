/**
 * ModalDialog Component
 * Universal accessible modal dialog controller with backdrop blur,
 * scale-in animations, keyboard Escape support, and scroll lock.
 */

export class ModalDialog {
    /**
     * @param {Object} options
     * @param {string} [options.id] - Modal container element ID
     * @param {string} [options.title='Modal Title'] - Dialog title
     * @param {string} [options.icon='fa-circle-info'] - FontAwesome icon class
     * @param {string} [options.maxWidth='max-w-lg'] - Modal width class
     * @param {string|HTMLElement} [options.content=''] - HTML content or DOM node
     * @param {Array<Object>} [options.actions=[]] - Action buttons [{label, class, onClick, primary}]
     * @param {Function} [options.onOpen] - Callback when opened
     * @param {Function} [options.onClose] - Callback when closed
     */
    constructor(options = {}) {
        this.id = options.id || `modal-${Math.random().toString(36).slice(2, 9)}`;
        this.title = options.title || '';
        this.icon = options.icon || '';
        this.maxWidth = options.maxWidth || 'max-w-lg';
        this.content = options.content || '';
        this.actions = options.actions || [];
        this.onOpen = options.onOpen || null;
        this.onClose = options.onClose || null;
        this.isOpen = false;

        this._buildDOM();
    }

    _buildDOM() {
        // Overlay container
        this.overlay = document.createElement('div');
        this.overlay.id = this.id;
        this.overlay.className = 'fixed inset-0 z-[99999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 opacity-0 pointer-events-none transition-all duration-200 hidden select-none';
        this.overlay.setAttribute('role', 'dialog');
        this.overlay.setAttribute('aria-modal', 'true');

        // Dialog Card
        this.card = document.createElement('div');
        this.card.className = `bg-slate-900 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 ${this.maxWidth} w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto scrollbar-none transform scale-95 transition-all duration-200`;

        // Header
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between border-b border-white/10 pb-3';

        const titleBox = document.createElement('div');
        titleBox.className = 'flex items-center gap-2.5';
        if (this.icon) {
            const iconWrap = document.createElement('div');
            iconWrap.className = 'w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xs shadow-inner';
            iconWrap.innerHTML = `<i class="${this.icon}"></i>`;
            titleBox.appendChild(iconWrap);
        }
        const heading = document.createElement('h3');
        heading.className = 'font-heading font-black text-sm text-white uppercase tracking-wider';
        heading.textContent = this.title;
        titleBox.appendChild(heading);
        header.appendChild(titleBox);

        // Close button
        const btnClose = document.createElement('button');
        btnClose.type = 'button';
        btnClose.className = 'w-7 h-7 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 flex items-center justify-center text-xs transition duration-150 cursor-pointer';
        btnClose.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        btnClose.setAttribute('aria-label', 'Close modal');
        btnClose.addEventListener('click', () => this.close());
        header.appendChild(btnClose);

        this.card.appendChild(header);

        // Body Content
        this.body = document.createElement('div');
        this.body.className = 'modal-body text-xs text-gray-300 space-y-3';
        if (typeof this.content === 'string') {
            this.body.innerHTML = this.content;
        } else if (this.content instanceof HTMLElement) {
            this.body.appendChild(this.content);
        }
        this.card.appendChild(this.body);

        // Footer Actions (if any)
        if (this.actions.length > 0) {
            const footer = document.createElement('div');
            footer.className = 'flex items-center justify-end gap-2 pt-2 border-t border-white/10';
            this.actions.forEach(action => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = action.class || (action.primary
                    ? 'px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-md transition cursor-pointer'
                    : 'px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-slate-950/80 border border-white/10 transition cursor-pointer');
                btn.innerHTML = action.label;
                btn.addEventListener('click', (e) => {
                    if (action.onClick) action.onClick(e, this);
                    if (action.closeOnClick !== false) this.close();
                });
                footer.appendChild(btn);
            });
            this.card.appendChild(footer);
        }

        this.overlay.appendChild(this.card);

        // Backdrop click to close
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        // Keydown handler
        this._keydownHandler = (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        };

        document.body.appendChild(this.overlay);
    }

    open() {
        this.isOpen = true;
        this.overlay.classList.remove('hidden');
        // Force reflow
        void this.overlay.offsetWidth;
        this.overlay.classList.remove('opacity-0', 'pointer-events-none');
        this.card.classList.remove('scale-95');
        this.card.classList.add('scale-100');

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', this._keydownHandler);

        if (this.onOpen) this.onOpen(this);
    }

    close() {
        this.isOpen = false;
        this.overlay.classList.add('opacity-0', 'pointer-events-none');
        this.card.classList.remove('scale-100');
        this.card.classList.add('scale-95');

        setTimeout(() => {
            if (!this.isOpen) {
                this.overlay.classList.add('hidden');
                document.body.style.overflow = '';
            }
        }, 200);

        window.removeEventListener('keydown', this._keydownHandler);
        if (this.onClose) this.onClose(this);
    }

    setContent(newContent) {
        if (typeof newContent === 'string') {
            this.body.innerHTML = newContent;
        } else if (newContent instanceof HTMLElement) {
            this.body.innerHTML = '';
            this.body.appendChild(newContent);
        }
    }

    destroy() {
        this.close();
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
    }
}

if (typeof window !== 'undefined') {
    window.ModalDialog = ModalDialog;
}
