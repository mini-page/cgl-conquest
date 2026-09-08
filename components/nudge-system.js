/**
 * CGL-Conquest Smart Nudge & Notification Engine
 * 
 * Generates proactive, high-yield contextual study nudges and alerts.
 * Features priority tiers (low, normal, important, critical), actionable one-tap cards,
 * snooze controls, unread badges, and Pomodoro Focus Mode suppression.
 */

class NudgeSystem {
    constructor() {
        this.nudges = [];
        this.snoozedIds = new Set();
        this._initialized = false;
    }

    /**
     * Scan app state and generate fresh contextual nudges
     */
    refreshNudges() {
        const state = (typeof window !== 'undefined' && window.appState) ? window.appState : null;
        if (!state) return [];

        const generated = [];
        const now = Date.now();

        // 1. Spaced Repetition (SRS) Overdue Nudge
        if (state.srsRecords) {
            let overdueCount = 0;
            const oneDayMs = 24 * 60 * 60 * 1000;
            const intervals = { 1: 1 * oneDayMs, 2: 3 * oneDayMs, 3: 7 * oneDayMs };

            Object.entries(state.srsRecords).forEach(([id, rec]) => {
                const maxAge = intervals[rec.level] || intervals[1];
                if (now - rec.lastReviewed > maxAge) {
                    overdueCount++;
                }
            });

            if (overdueCount > 0) {
                generated.push({
                    id: 'nudge_srs_overdue',
                    priority: overdueCount > 5 ? 'critical' : 'important',
                    icon: 'fa-brain',
                    iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                    title: `${overdueCount} Topics Overdue for Revision`,
                    message: 'Spaced intervals are ready. Quick review now locks memories into long-term retention before decay.',
                    actionLabel: 'Review SRS',
                    actionCommand: 'nav:study',
                    timestamp: now
                });
            }
        }

        // 2. Daily Rituals Completion Nudge
        if (state.dailyRituals) {
            const rituals = state.dailyRituals;
            const completedCount = Object.values(rituals).filter(Boolean).length;
            if (completedCount < 4) {
                generated.push({
                    id: 'nudge_daily_rituals',
                    priority: completedCount === 0 ? 'important' : 'normal',
                    icon: 'fa-calendar-check',
                    iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                    title: `Daily Rituals: ${completedCount}/4 Completed`,
                    message: 'Complete your Speed Drill, Vocab, Current Affairs, and Computer modules to secure full streak credit.',
                    actionLabel: 'Complete Rituals',
                    actionCommand: 'nav:dashboard',
                    timestamp: now
                });
            }
        }

        // 3. Weak Alert Diagnostic Nudge
        if (state.weakAlerts) {
            const weakKeys = Object.keys(state.weakAlerts);
            if (weakKeys.length > 0) {
                generated.push({
                    id: 'nudge_weak_alerts',
                    priority: 'important',
                    icon: 'fa-triangle-exclamation',
                    iconColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
                    title: `${weakKeys.length} High-Error Concepts Flagged`,
                    message: 'Targeted error revision yields the highest marginal mock score jump.',
                    actionLabel: 'Inspect Weak Areas',
                    actionCommand: 'nav:syllabus',
                    timestamp: now
                });
            }
        }

        // 4. Mock Test Routine Nudge
        const mocks = Array.isArray(state.mocks) ? state.mocks : [];
        if (mocks.length === 0) {
            generated.push({
                id: 'nudge_first_mock',
                priority: 'normal',
                icon: 'fa-file-signature',
                iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
                title: 'Benchmark Diagnostic Needed',
                message: 'Take your first baseline mock test to calibrate exam speed, accuracy, and percentile trajectory.',
                actionLabel: 'Take Mock Test',
                actionCommand: 'nav:mocks',
                timestamp: now
            });
        }

        // 5. Pomodoro Focus Call-to-Action
        if (!state.pomoActive && !state.focusModeActive) {
            generated.push({
                id: 'nudge_focus_session',
                priority: 'low',
                icon: 'fa-stopwatch-20',
                iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                title: 'Ready for a Deep Study Sprint?',
                message: 'Silence distractions and trigger 25m Focus Mode with zen sound acoustics.',
                actionLabel: 'Launch Pomodoro',
                actionCommand: 'toggle:pomo',
                timestamp: now
            });
        }

        // Filter out currently snoozed nudges
        this.nudges = generated.filter(n => !this.snoozedIds.has(n.id));
        this._updateBadge();
        return this.nudges;
    }

    /**
     * Snooze a specific nudge
     */
    snooze(nudgeId, durationMs = 3600000) { // Default 1 hour
        this.snoozedIds.add(nudgeId);
        setTimeout(() => {
            this.snoozedIds.delete(nudgeId);
            this.refreshNudges();
        }, durationMs);

        this.refreshNudges();
        if (typeof window.showToast === 'function') {
            window.showToast('Nudge snoozed for 1 hour', 'info');
        }
        if (typeof window.playSound === 'function') {
            window.playSound('checkbox');
        }
    }

    /**
     * Dismiss a nudge for the current session
     */
    dismiss(nudgeId) {
        this.snoozedIds.add(nudgeId);
        this.refreshNudges();
    }

    /**
     * Execute actionable command associated with nudge
     */
    executeAction(nudgeId) {
        const item = this.nudges.find(n => n.id === nudgeId);
        if (!item) return;

        if (typeof window.playSound === 'function') {
            window.playSound('checkbox');
        }

        // Dismiss the nudge upon action
        this.dismiss(nudgeId);

        // Execute command
        if (item.actionCommand.startsWith('nav:')) {
            const pageId = item.actionCommand.split(':')[1];
            if (typeof window.navigateToPage === 'function') {
                window.navigateToPage(pageId);
            }
        } else if (item.actionCommand === 'toggle:pomo') {
            const btnPomo = document.getElementById('btn-pomo-drawer') || document.getElementById('pomo-toggle');
            if (btnPomo) btnPomo.click();
        }

        // Play audio feedback for executing nudge
        if (typeof window.playSound === 'function') {
            window.playSound('nudge');
        }
    }

    _updateBadge() {
        const count = this.nudges.length;
        const badge = document.getElementById('action-center-nudge-badge');
        if (badge) {
            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    }
}

// Global Singleton Instance
if (typeof window !== 'undefined') {
    window.NudgeSystem = NudgeSystem;
    if (!window.nudgeSystem) {
        window.nudgeSystem = new NudgeSystem();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NudgeSystem };
}
