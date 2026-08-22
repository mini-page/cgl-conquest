// ============================================================
// Command Palette — Double-Shift trigger
// Search: Navigation, Actions, Study Topics, Mocks
// ============================================================

(function () {
    'use strict';

    // ── State ──────────────────────────────────────────────
    let isOpen = false;
    let allCommands = [];
    let filtered = [];
    let selectedIdx = 0;
    let lastShiftTime = 0;

    // ── Category icons & colours ───────────────────────────
    const CAT_META = {
        nav:    { icon: 'fa-compass',        label: 'Navigation',    color: 'text-accentCyan'   },
        action: { icon: 'fa-bolt',           label: 'Actions',       color: 'text-accentAmber'  },
        topic:  { icon: 'fa-book-open',      label: 'Study Topics',  color: 'text-accentGreen'  },
        mock:   { icon: 'fa-square-poll-vertical', label: 'Mocks',   color: 'text-accentPurple' },
    };

    // ── Static command registry ────────────────────────────
    const STATIC_COMMANDS = [
        // Navigation
        { id: 'nav-dash',    cat: 'nav',    label: 'Dashboard',              hint: '1',  icon: 'fa-chart-line',
          run: () => navigateToPage('page-dashboard') },
        { id: 'nav-track',   cat: 'nav',    label: 'Syllabus Tracker',       hint: '2',  icon: 'fa-list-check',
          run: () => navigateToPage('page-syllabus') },
        { id: 'nav-study',   cat: 'nav',    label: 'Study Notes',            hint: '3',  icon: 'fa-toolbox',
          run: () => navigateToPage('page-toolkit') },
        { id: 'nav-drills',  cat: 'nav',    label: 'Speed Drills',           hint: '4',  icon: 'fa-bolt',
          run: () => navigateToPage('page-speed') },
        { id: 'nav-plan',    cat: 'nav',    label: 'Day Plan',               hint: '5',  icon: 'fa-calendar-days',
          run: () => navigateToPage('page-plan') },
        { id: 'nav-mocks',   cat: 'nav',    label: 'Mock Analysis',          hint: '6',  icon: 'fa-square-poll-vertical',
          run: () => navigateToPage('page-mocks') },
        { id: 'nav-qref',    cat: 'nav',    label: 'Quick Reference Tables', hint: '',   icon: 'fa-table-list',
          run: () => { navigateToPage('page-toolkit'); setTimeout(() => window.showQuickRefTables && window.showQuickRefTables(), 300); } },
        { id: 'nav-notes',   cat: 'nav',    label: 'Custom Notes & Mistakes',hint: '',   icon: 'fa-pen-to-square',
          run: () => { navigateToPage('page-toolkit'); setTimeout(() => window.showCustomNotes && window.showCustomNotes(), 300); } },

        // Actions — Drills
        { id: 'act-sq',      cat: 'action', label: 'Start Squares Drill',    hint: '',   icon: 'fa-superscript',
          run: () => _startDrill('squares') },
        { id: 'act-cube',    cat: 'action', label: 'Start Cubes Drill',      hint: '',   icon: 'fa-cube',
          run: () => _startDrill('cubes') },
        { id: 'act-trig',    cat: 'action', label: 'Start Trig Reflex Drill',hint: '',   icon: 'fa-circle-dot',
          run: () => _startDrill('trigReflex') },
        { id: 'act-tables',  cat: 'action', label: 'Start Tables Drill',     hint: '',   icon: 'fa-table-cells',
          run: () => _startDrill('tables') },
        { id: 'act-fp',      cat: 'action', label: 'Start Fractions % Drill',hint: '',   icon: 'fa-percent',
          run: () => _startDrill('fracPerc') },
        { id: 'act-lcm',     cat: 'action', label: 'Start LCM/HCF Drill',   hint: '',   icon: 'fa-divide',
          run: () => _startDrill('lcmhcf') },
        { id: 'act-triplet', cat: 'action', label: 'Start Triplets Drill',   hint: '',   icon: 'fa-shapes',
          run: () => _startDrill('triplets') },
        // Actions — General
        { id: 'act-mock',    cat: 'action', label: 'Add New Mock',           hint: '',   icon: 'fa-plus',
          run: () => { navigateToPage('page-mocks'); setTimeout(() => { const btn = document.getElementById('btn-add-mock'); if (btn) btn.click(); }, 300); } },
        { id: 'act-backup',  cat: 'action', label: 'Export Backup',          hint: '',   icon: 'fa-download',
          run: () => { const btn = document.getElementById('btn-export-backup'); if (btn) btn.click(); else window.showToast && window.showToast('Open Settings to export backup', 'info'); } },
        { id: 'act-t1',      cat: 'action', label: 'Switch to Tier 1 Target',hint: '',   icon: 'fa-layer-group',
          run: () => { const btn = document.querySelector('[data-tier="1"]'); if (btn) btn.click(); } },
        { id: 'act-t2',      cat: 'action', label: 'Switch to Tier 2 Target',hint: '',   icon: 'fa-layer-group',
          run: () => { const btn = document.querySelector('[data-tier="2"]'); if (btn) btn.click(); } },
    ];

    // ── Helper: navigate to drills page & select mode ──────
    function _startDrill(mode) {
        navigateToPage('page-speed');
        setTimeout(() => {
            const tab = document.querySelector(`.drill-tab-btn[data-mode="${mode}"]`);
            if (tab) tab.click();
        }, 300);
    }

    // ── Build full registry (static + dynamic) ─────────────
    function buildRegistry() {
        allCommands = [...STATIC_COMMANDS];

        // Study Topics from SYLLABUS_DATA
        if (typeof SYLLABUS_DATA !== 'undefined') {
            const seen = new Set();
            SYLLABUS_DATA.forEach(entry => {
                if (!entry.subtopics) return;
                entry.subtopics.forEach(sub => {
                    if (seen.has(sub.id)) return;
                    seen.add(sub.id);
                    allCommands.push({
                        id: 'topic-' + sub.id,
                        cat: 'topic',
                        label: sub.name.replace(/^★\s*/, ''),
                        hint: entry.subject,
                        sublabel: entry.topic,
                        icon: 'fa-bookmark',
                        run: () => {
                            navigateToPage('page-syllabus');
                            setTimeout(() => {
                                // scroll syllabus to that topic id
                                const el = document.getElementById(sub.id) || document.querySelector(`[data-subtopic-id="${sub.id}"]`);
                                if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('ring-2', 'ring-accentCyan'); setTimeout(() => el.classList.remove('ring-2', 'ring-accentCyan'), 1500); }
                            }, 400);
                        }
                    });
                });
            });
        }

        // Mocks from appState
        if (typeof appState !== 'undefined' && Array.isArray(appState.mocks)) {
            appState.mocks.slice().reverse().forEach((m, i) => {
                const score = m.totalMarks != null ? `${m.totalMarks}/${m.totalPossible || '—'}` : '—';
                allCommands.push({
                    id: 'mock-' + m.id,
                    cat: 'mock',
                    label: m.name || `Mock #${appState.mocks.length - i}`,
                    hint: m.date || '',
                    sublabel: `Score: ${score}`,
                    icon: 'fa-file-lines',
                    run: () => navigateToPage('page-mocks'),
                });
            });
        }
    }

    // ── Filter ─────────────────────────────────────────────
    function filterCommands(q) {
        const query = q.trim().toLowerCase();
        if (!query) {
            // show all static + first 5 mocks when empty
            filtered = allCommands.filter(c => c.cat !== 'topic' && c.cat !== 'mock')
                .concat(allCommands.filter(c => c.cat === 'mock').slice(0, 5));
        } else {
            filtered = allCommands.filter(c => {
                const searchStr = [c.label, c.hint || '', c.sublabel || ''].join(' ').toLowerCase();
                return searchStr.includes(query);
            });
        }
        selectedIdx = 0;
    }

    // ── Render ─────────────────────────────────────────────
    function render() {
        const list = document.getElementById('cmd-palette-list');
        if (!list) return;

        if (filtered.length === 0) {
            list.innerHTML = `<div class="cmd-empty"><i class="fa-solid fa-magnifying-glass opacity-30 mr-2"></i>No results found</div>`;
            return;
        }

        let html = '';
        let lastCat = null;

        filtered.forEach((cmd, idx) => {
            if (cmd.cat !== lastCat) {
                lastCat = cmd.cat;
                const m = CAT_META[cmd.cat] || {};
                html += `<div class="cmd-category-header"><i class="fa-solid ${m.icon || 'fa-circle'} ${m.color || ''} mr-1.5 text-[10px]"></i>${m.label || cmd.cat}</div>`;
            }

            const isActive = idx === selectedIdx;
            const safeLabel = window.escapeHTML ? window.escapeHTML(cmd.label) : cmd.label;
            const hintBadge = cmd.hint ? `<span class="cmd-hint">${window.escapeHTML ? window.escapeHTML(cmd.hint) : cmd.hint}</span>` : '';
            const sublabel  = cmd.sublabel ? `<span class="cmd-sublabel">${window.escapeHTML ? window.escapeHTML(cmd.sublabel) : cmd.sublabel}</span>` : '';
            const catColor  = (CAT_META[cmd.cat] || {}).color || 'text-gray-400';

            html += `
            <button class="cmd-item ${isActive ? 'cmd-item-active' : ''}" data-idx="${idx}">
                <span class="cmd-item-icon ${catColor}"><i class="fa-solid ${cmd.icon || 'fa-circle'}"></i></span>
                <span class="cmd-item-body">
                    <span class="cmd-item-label">${safeLabel}</span>
                    ${sublabel}
                </span>
                ${hintBadge}
            </button>`;
        });

        list.innerHTML = html;

        // Scroll active item into view
        const activeEl = list.querySelector('.cmd-item-active');
        if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });

        // Click handlers
        list.querySelectorAll('.cmd-item').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                selectedIdx = parseInt(btn.dataset.idx, 10);
                renderActiveOnly();
            });
            btn.addEventListener('click', () => {
                execute(parseInt(btn.dataset.idx, 10));
            });
        });
    }

    function renderActiveOnly() {
        document.querySelectorAll('#cmd-palette-list .cmd-item').forEach((btn, i) => {
            btn.classList.toggle('cmd-item-active', i === selectedIdx);
        });
    }

    // ── Execute ────────────────────────────────────────────
    function execute(idx) {
        const cmd = filtered[idx];
        if (!cmd) return;
        close();
        requestAnimationFrame(() => cmd.run());
    }

    // ── Open / Close ───────────────────────────────────────
    function open() {
        if (isOpen) return;
        isOpen = true;
        buildRegistry();

        const input = document.getElementById('cmd-palette-input');
        const overlay = document.getElementById('cmd-palette-overlay');
        const palette = document.getElementById('cmd-palette');

        if (!overlay || !palette || !input) return;

        input.value = '';
        filterCommands('');
        render();

        overlay.classList.add('active');
        palette.classList.add('active');

        // Focus after animation frame
        requestAnimationFrame(() => { input.focus(); input.select(); });
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;
        const overlay = document.getElementById('cmd-palette-overlay');
        const palette = document.getElementById('cmd-palette');
        if (overlay) overlay.classList.remove('active');
        if (palette) palette.classList.remove('active');
    }

    // ── Keyboard: Double-Shift ─────────────────────────────
    document.addEventListener('keydown', e => {
        // Close on Escape
        if (e.key === 'Escape' && isOpen) { close(); return; }

        // Also support Ctrl+K / Cmd+K as alternative
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            isOpen ? close() : open();
            return;
        }

        // Double-Shift detection (only when not typing in editable fields)
        if (e.key === 'Shift') {
            const tag = document.activeElement ? document.activeElement.tagName : '';
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (document.activeElement && document.activeElement.isContentEditable)) {
                return;
            }
            const now = Date.now();
            if (now - lastShiftTime < 350) {
                e.preventDefault();
                isOpen ? close() : open();
                lastShiftTime = 0;
            } else {
                lastShiftTime = now;
            }
            return;
        }

        if (!isOpen) return;

        // Arrow navigation
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIdx = Math.min(selectedIdx + 1, filtered.length - 1);
            renderActiveOnly();
            document.querySelectorAll('#cmd-palette-list .cmd-item')[selectedIdx]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIdx = Math.max(selectedIdx - 1, 0);
            renderActiveOnly();
            document.querySelectorAll('#cmd-palette-list .cmd-item')[selectedIdx]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            execute(selectedIdx);
        }
    });

    // ── Input search ───────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        const input   = document.getElementById('cmd-palette-input');
        const overlay = document.getElementById('cmd-palette-overlay');
        const closeBtn = document.getElementById('cmd-palette-close');

        if (input) {
            input.addEventListener('input', () => {
                filterCommands(input.value);
                render();
            });
        }

        // Click backdrop to close
        if (overlay) {
            overlay.addEventListener('click', e => {
                if (e.target === overlay) close();
            });
        }

        // Close button
        if (closeBtn) {
            closeBtn.addEventListener('click', close);
        }
    });

    // Expose globally
    window.openCommandPalette = open;
    window.closeCommandPalette = close;

})();
