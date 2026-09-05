/**
 * ToastNotification Component
 * Singleton / instance-based toast notification system with slide animations,
 * icon themes, progress timeout bars, and auto-dismiss.
 */

export class ToastNotification {
    constructor(options = {}) {
        this.position = options.position || 'bottom-right'; // 'bottom-right', 'top-right', 'bottom-center'
        this.container = this._getOrCreateContainer();
    }

    _getOrCreateContainer() {
        let container = document.getElementById('toast-notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-notification-container';
            container.className = 'fixed z-[999999] pointer-events-none flex flex-col gap-2 p-4 bottom-4 right-4 sm:bottom-6 sm:right-6 max-w-sm w-full';
            document.body.appendChild(container);
        }
        return container;
    }

    /**
     * Show a toast message
     * @param {string} message - Text or HTML message
     * @param {'info'|'success'|'warning'|'error'} [type='info'] - Visual type
     * @param {number} [duration=3500] - Duration in ms before auto-dismiss
     */
    show(message, type = 'info', duration = 3500) {
        const toast = document.createElement('div');
        toast.className = 'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 border shadow-2xl backdrop-blur-xl text-xs font-bold text-white transform translate-y-3 opacity-0 transition-all duration-200';

        const config = {
            success: {
                border: 'border-emerald-500/40',
                icon: 'fa-solid fa-circle-check text-emerald-400',
                shadow: 'shadow-emerald-500/10'
            },
            warning: {
                border: 'border-amber-500/40',
                icon: 'fa-solid fa-triangle-exclamation text-amber-400',
                shadow: 'shadow-amber-500/10'
            },
            error: {
                border: 'border-rose-500/40',
                icon: 'fa-solid fa-circle-xmark text-rose-400',
                shadow: 'shadow-rose-500/10'
            },
            info: {
                border: 'border-cyan-500/40',
                icon: 'fa-solid fa-circle-info text-cyan-400',
                shadow: 'shadow-cyan-500/10'
            }
        }[type] || {
            border: 'border-cyan-500/40',
            icon: 'fa-solid fa-circle-info text-cyan-400',
            shadow: 'shadow-cyan-500/10'
        };

        toast.classList.add(config.border, config.shadow);

        toast.innerHTML = `
            <i class="${config.icon} text-base shrink-0"></i>
            <span class="flex-grow leading-tight">${message}</span>
            <button type="button" class="text-gray-500 hover:text-white transition shrink-0 ml-1 text-[11px] cursor-pointer">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        const btnClose = toast.querySelector('button');
        const dismiss = () => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 200);
        };

        btnClose.onclick = dismiss;

        this.container.appendChild(toast);

        // Reflow for transition
        void toast.offsetWidth;
        toast.classList.remove('translate-y-3', 'opacity-0');

        if (duration > 0) {
            setTimeout(dismiss, duration);
        }

        return toast;
    }

    success(msg, duration) { return this.show(msg, 'success', duration); }
    warning(msg, duration) { return this.show(msg, 'warning', duration); }
    error(msg, duration) { return this.show(msg, 'error', duration); }
    info(msg, duration) { return this.show(msg, 'info', duration); }
}

export const toast = new ToastNotification();

if (typeof window !== 'undefined') {
    window.ToastNotification = ToastNotification;
    window.toast = toast;
}
