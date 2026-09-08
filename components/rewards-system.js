/**
 * CGL-Conquest Rewards & Gamification Engine
 * 
 * Inspired by Google 9-dot launcher style action center grid.
 * Provides 6-tier trophies, collectible stickers, coins/points economy, and cosmetic unlocks.
 * Features automated rule-based evaluation, anti-cheat guards, and celebratory audio/confetti triggers.
 */

const REWARDS_CATALOG = {
    trophies: [
        // Bronze Tier
        {
            id: 'trophy_bronze_first_step',
            tier: 'Bronze',
            tierColor: 'from-amber-700 to-amber-900',
            tierBorder: 'border-amber-700/50',
            tierText: 'text-amber-500',
            icon: 'fa-shoe-prints',
            title: 'First Step',
            desc: 'Master your very first syllabus subtopic.',
            points: 50,
            coins: 15,
            check: (state, meta) => meta.masteredCount >= 1
        },
        {
            id: 'trophy_bronze_ritual',
            tier: 'Bronze',
            tierColor: 'from-amber-700 to-amber-900',
            tierBorder: 'border-amber-700/50',
            tierText: 'text-amber-500',
            icon: 'fa-calendar-check',
            title: 'Ritual Initiate',
            desc: 'Complete at least one daily preparation ritual.',
            points: 50,
            coins: 15,
            check: (state, meta) => meta.ritualsCompleted >= 1
        },
        {
            id: 'trophy_bronze_mock',
            tier: 'Bronze',
            tierColor: 'from-amber-700 to-amber-900',
            tierBorder: 'border-amber-700/50',
            tierText: 'text-amber-500',
            icon: 'fa-file-signature',
            title: 'Mock Rookie',
            desc: 'Log your first full-length or sectional mock test.',
            points: 75,
            coins: 20,
            check: (state) => (state.mocks && state.mocks.length >= 1)
        },

        // Silver Tier
        {
            id: 'trophy_silver_explorer',
            tier: 'Silver',
            tierColor: 'from-slate-400 to-slate-600',
            tierBorder: 'border-slate-400/50',
            tierText: 'text-slate-300',
            icon: 'fa-compass',
            title: 'Syllabus Explorer',
            desc: 'Master at least 10 subtopics across any subject.',
            points: 150,
            coins: 40,
            check: (state, meta) => meta.masteredCount >= 10
        },
        {
            id: 'trophy_silver_streak',
            tier: 'Silver',
            tierColor: 'from-slate-400 to-slate-600',
            tierBorder: 'border-slate-400/50',
            tierText: 'text-slate-300',
            icon: 'fa-fire-flame-curved',
            title: 'Momentum Builder',
            desc: 'Achieve a 3-day unbroken study streak.',
            points: 150,
            coins: 40,
            check: (state) => (state.streak >= 3)
        },
        {
            id: 'trophy_silver_rituals_all',
            tier: 'Silver',
            tierColor: 'from-slate-400 to-slate-600',
            tierBorder: 'border-slate-400/50',
            tierText: 'text-slate-300',
            icon: 'fa-list-check',
            title: 'Clean Sweep',
            desc: 'Complete all 4 daily rituals in a single day.',
            points: 200,
            coins: 50,
            check: (state, meta) => meta.ritualsCompleted === 4
        },

        // Gold Tier
        {
            id: 'trophy_gold_adept',
            tier: 'Gold',
            tierColor: 'from-yellow-400 to-amber-600',
            tierBorder: 'border-yellow-400/50',
            tierText: 'text-yellow-400',
            icon: 'fa-brain',
            title: 'Subject Adept',
            desc: 'Master 30 subtopics with 3-stage validation.',
            points: 350,
            coins: 100,
            check: (state, meta) => meta.masteredCount >= 30
        },
        {
            id: 'trophy_gold_scorer',
            tier: 'Gold',
            tierColor: 'from-yellow-400 to-amber-600',
            tierBorder: 'border-yellow-400/50',
            tierText: 'text-yellow-400',
            icon: 'fa-chart-line-up',
            title: 'High Caliber',
            desc: 'Score 130+ marks in any mock test.',
            points: 400,
            coins: 120,
            check: (state, meta) => meta.maxMockScore >= 130
        },
        {
            id: 'trophy_gold_streak',
            tier: 'Gold',
            tierColor: 'from-yellow-400 to-amber-600',
            tierBorder: 'border-yellow-400/50',
            tierText: 'text-yellow-400',
            icon: 'fa-bolt',
            title: 'Unstoppable Week',
            desc: 'Maintain a pristine 7-day study streak.',
            points: 500,
            coins: 150,
            check: (state) => (state.streak >= 7)
        },

        // Platinum Tier
        {
            id: 'trophy_plat_veteran',
            tier: 'Platinum',
            tierColor: 'from-cyan-300 to-blue-600',
            tierBorder: 'border-cyan-400/50',
            tierText: 'text-cyan-300',
            icon: 'fa-shield-halved',
            title: 'Mastery Veteran',
            desc: 'Reach 60 mastered topics across Tier 1 & Tier 2.',
            points: 800,
            coins: 250,
            check: (state, meta) => meta.masteredCount >= 60
        },
        {
            id: 'trophy_plat_centurion',
            tier: 'Platinum',
            tierColor: 'from-cyan-300 to-blue-600',
            tierBorder: 'border-cyan-400/50',
            tierText: 'text-cyan-300',
            icon: 'fa-trophy',
            title: 'Centurion',
            desc: 'Score 150+ in a Tier 1 mock or 310+ in Tier 2 mock.',
            points: 1000,
            coins: 300,
            check: (state, meta) => meta.maxMockScore >= 150
        },

        // Master Tier
        {
            id: 'trophy_master_commander',
            tier: 'Master',
            tierColor: 'from-purple-500 to-indigo-700',
            tierBorder: 'border-purple-400/50',
            tierText: 'text-purple-300',
            icon: 'fa-chess-king',
            title: 'Syllabus Commander',
            desc: 'Master 100 subtopics with zero weak alerts pending.',
            points: 2000,
            coins: 600,
            check: (state, meta) => meta.masteredCount >= 100 && meta.weakAlertCount === 0
        },
        {
            id: 'trophy_master_elite',
            tier: 'Master',
            tierColor: 'from-purple-500 to-indigo-700',
            tierBorder: 'border-purple-400/50',
            tierText: 'text-purple-300',
            icon: 'fa-medal',
            title: 'Elite Marksman',
            desc: 'Score 165+ marks in Tier 1 mock or 335+ in Tier 2 mock.',
            points: 2500,
            coins: 750,
            check: (state, meta) => meta.maxMockScore >= 165
        },

        // Legendary Tier
        {
            id: 'trophy_legend_conqueror',
            tier: 'Legendary',
            tierColor: 'from-amber-400 via-rose-500 to-indigo-600',
            tierBorder: 'border-amber-300/80',
            tierText: 'text-amber-300',
            icon: 'fa-crown',
            title: 'CGL Conqueror',
            desc: 'Master 140+ subtopics and complete at least 15 mock tests.',
            points: 5000,
            coins: 1500,
            check: (state, meta) => meta.masteredCount >= 140 && (state.mocks && state.mocks.length >= 15)
        }
    ],

    stickers: [
        { id: 'sticker_speed', emoji: '⚡', name: 'Speed Demon', desc: 'Achieved rapid solve rate in Speed Drills.' },
        { id: 'sticker_focus', emoji: '🎯', name: 'Deep Focus', desc: 'Completed a 50m Pomodoro deep work sprint.' },
        { id: 'sticker_srs', emoji: '🧠', name: 'Synapse Retain', desc: 'Zero overdue reviews in Spaced Repetition.' },
        { id: 'sticker_shield', emoji: '🛡️', name: 'Flawless Def', desc: 'Identified and repaired 5 weak concepts.' },
        { id: 'sticker_owl', emoji: '🦉', name: 'Dawn Vigil', desc: 'Active study session logged before 8:00 AM.' },
        { id: 'sticker_phoenix', emoji: '🔥', name: 'Phoenix Rise', desc: 'Turned a failed mock test score into +20 gain.' }
    ],

    cosmetics: [
        {
            type: 'title',
            id: 'title_aspirant',
            name: 'Aspirant',
            cost: 0,
            unlockedByDefault: true,
            desc: 'The determined beginner standing at the threshold.'
        },
        {
            type: 'title',
            id: 'title_strategist',
            name: 'Strategist',
            cost: 100,
            desc: 'Calculates every question with high-yield discipline.'
        },
        {
            type: 'title',
            id: 'title_inspector',
            name: 'Executive Officer',
            cost: 250,
            desc: 'Commanding high percentiles and precise execution.'
        },
        {
            type: 'title',
            id: 'title_undersec',
            name: 'Section Leader',
            cost: 500,
            desc: 'Elite candidate operating at top administrative tier.'
        },
        {
            type: 'title',
            id: 'title_bureaucrat',
            name: 'Apex Conqueror',
            cost: 1000,
            desc: 'Legendary mastery of all quantitative, logical and general arts.'
        },
        {
            type: 'accent',
            id: 'accent_blue',
            name: 'Royal Cobalt',
            cssClass: 'theme-accent-blue',
            hex: '#2563eb',
            cost: 0,
            unlockedByDefault: true,
            desc: 'Default crisp conquest blue styling.'
        },
        {
            type: 'accent',
            id: 'accent_emerald',
            name: 'Emerald Surge',
            cssClass: 'theme-accent-emerald',
            hex: '#10b981',
            cost: 150,
            desc: 'Tactical emerald green highlight styling.'
        },
        {
            type: 'accent',
            id: 'accent_amber',
            name: 'Solar Amber',
            cssClass: 'theme-accent-amber',
            hex: '#f59e0b',
            cost: 250,
            desc: 'Radiant warm amber highlight styling.'
        },
        {
            type: 'accent',
            id: 'accent_violet',
            name: 'Mystic Amethyst',
            cssClass: 'theme-accent-violet',
            hex: '#8b5cf6',
            cost: 350,
            desc: 'Deep royal purple highlight styling.'
        }
    ]
};

class RewardsSystem {
    constructor() {
        this.catalog = REWARDS_CATALOG;
    }

    /**
     * Compute current state telemetry metrics for eligibility
     */
    getTelemetry() {
        const state = (typeof window !== 'undefined' && window.appState) ? window.appState : {};
        const progress = state.syllabusProgress || {};
        
        let masteredCount = 0;
        let practicedCount = 0;
        let learnedCount = 0;

        Object.values(progress).forEach(p => {
            if (p.mastered) masteredCount++;
            if (p.practiced) practicedCount++;
            if (p.learned) learnedCount++;
        });

        let ritualsCompleted = 0;
        if (state.dailyRituals) {
            Object.values(state.dailyRituals).forEach(v => {
                if (v === true) ritualsCompleted++;
            });
        }

        let maxMockScore = 0;
        if (Array.isArray(state.mocks)) {
            state.mocks.forEach(m => {
                const s = parseFloat(m.score);
                if (!isNaN(s) && s > maxMockScore) maxMockScore = s;
            });
        }

        const weakAlertCount = state.weakAlerts ? Object.keys(state.weakAlerts).length : 0;

        return {
            masteredCount,
            practicedCount,
            learnedCount,
            ritualsCompleted,
            maxMockScore,
            weakAlertCount,
            streak: state.streak || 0,
            mocksCount: (state.mocks || []).length
        };
    }

    /**
     * Ensure rewards state is initialized in appState
     */
    _ensureState() {
        if (typeof window === 'undefined' || !window.appState) return null;
        if (!window.appState.rewards) {
            window.appState.rewards = {
                coins: 0,
                points: 0,
                unlocked: ['title_aspirant', 'accent_blue'],
                claimedTrophies: [],
                equipped: {
                    title: 'Aspirant',
                    themeAccent: 'accent_blue'
                }
            };
        }
        const r = window.appState.rewards;
        if (!Array.isArray(r.unlocked)) r.unlocked = ['title_aspirant', 'accent_blue'];
        if (!Array.isArray(r.claimedTrophies)) r.claimedTrophies = [];
        if (!r.equipped) r.equipped = { title: 'Aspirant', themeAccent: 'accent_blue' };
        if (typeof r.coins !== 'number') r.coins = 0;
        if (typeof r.points !== 'number') r.points = 0;
        return r;
    }

    /**
     * Compute player level and rank based on total points
     */
    getLevelData(points = 0) {
        const tiers = [
            { level: 1, title: 'Novice Aspirant', min: 0, max: 100, icon: 'fa-seedling', color: 'text-gray-300' },
            { level: 2, title: 'Disciplined Cadet', min: 100, max: 250, icon: 'fa-shield', color: 'text-amber-500' },
            { level: 3, title: 'Tactical Strategist', min: 250, max: 550, icon: 'fa-compass', color: 'text-slate-300' },
            { level: 4, title: 'Elite Combatant', min: 550, max: 1100, icon: 'fa-bolt', color: 'text-yellow-400' },
            { level: 5, title: 'Vanguard Commander', min: 1100, max: 2000, icon: 'fa-medal', color: 'text-cyan-300' },
            { level: 6, title: 'Executive Marshal', min: 2000, max: 3500, icon: 'fa-chess-king', color: 'text-purple-300' },
            { level: 7, title: 'Apex Conqueror', min: 3500, max: 7000, icon: 'fa-crown', color: 'text-amber-400' }
        ];

        let curTier = tiers[0];
        for (let i = tiers.length - 1; i >= 0; i--) {
            if (points >= tiers[i].min) {
                curTier = tiers[i];
                break;
            }
        }

        const levelSpan = curTier.max - curTier.min;
        const ptsInLevel = Math.max(0, points - curTier.min);
        const progressPct = Math.min(100, Math.round((ptsInLevel / levelSpan) * 100));

        return {
            level: curTier.level,
            rankTitle: curTier.title,
            icon: curTier.icon,
            color: curTier.color,
            currentPoints: points,
            currentLevelMin: curTier.min,
            nextLevelMax: curTier.max,
            pointsNeeded: Math.max(0, curTier.max - points),
            progressPct
        };
    }

    /**
     * Check which trophies are unlocked, claimable, or locked with progress
     */
    evaluateTrophies() {
        const r = this._ensureState();
        const state = window.appState || {};
        const meta = this.getTelemetry();

        const targetsMap = {
            'trophy_bronze_first_step': { target: 1, current: meta.masteredCount, label: 'Topics' },
            'trophy_bronze_ritual': { target: 1, current: meta.ritualsCompleted, label: 'Ritual' },
            'trophy_bronze_mock': { target: 1, current: meta.mocksCount, label: 'Mock' },
            'trophy_silver_explorer': { target: 10, current: meta.masteredCount, label: 'Topics' },
            'trophy_silver_streak': { target: 3, current: meta.streak, label: 'Days' },
            'trophy_silver_rituals_all': { target: 4, current: meta.ritualsCompleted, label: 'Rituals' },
            'trophy_gold_adept': { target: 30, current: meta.masteredCount, label: 'Topics' },
            'trophy_gold_scorer': { target: 130, current: Math.round(meta.maxMockScore), label: 'Marks' },
            'trophy_gold_streak': { target: 7, current: meta.streak, label: 'Days' },
            'trophy_plat_veteran': { target: 60, current: meta.masteredCount, label: 'Topics' },
            'trophy_plat_centurion': { target: 150, current: Math.round(meta.maxMockScore), label: 'Marks' },
            'trophy_master_commander': { target: 100, current: meta.masteredCount, label: 'Topics' },
            'trophy_master_elite': { target: 165, current: Math.round(meta.maxMockScore), label: 'Marks' },
            'trophy_legend_conqueror': { target: 140, current: meta.masteredCount, label: 'Topics' }
        };

        return this.catalog.trophies.map(t => {
            const isEligible = t.check(state, meta);
            const isClaimed = r ? r.claimedTrophies.includes(t.id) : false;
            const targetInfo = targetsMap[t.id] || { target: 1, current: isEligible ? 1 : 0, label: '' };
            const currentVal = Math.min(targetInfo.target, targetInfo.current || 0);
            const progressPct = Math.min(100, Math.round((currentVal / targetInfo.target) * 100));

            return {
                ...t,
                isEligible,
                isClaimed,
                canClaim: isEligible && !isClaimed,
                progress: {
                    current: currentVal,
                    target: targetInfo.target,
                    label: targetInfo.label,
                    pct: progressPct
                }
            };
        });
    }

    /**
     * Evaluate collectible stickers unlock eligibility
     */
    evaluateStickers() {
        const state = window.appState || {};
        const meta = this.getTelemetry();

        return (this.catalog.stickers || []).map(s => {
            let isUnlocked = false;
            let conditionHint = '';

            if (s.id === 'sticker_speed') {
                isUnlocked = Boolean(state.speedDrillsCount && state.speedDrillsCount >= 3) || (meta.masteredCount >= 5);
                conditionHint = 'Complete 3+ Speed Drills';
            } else if (s.id === 'sticker_focus') {
                isUnlocked = Boolean(state.pomoSessionsToday && state.pomoSessionsToday >= 1) || (state.sessionTime && state.sessionTime >= 1500);
                conditionHint = 'Complete a Pomodoro Focus session';
            } else if (s.id === 'sticker_srs') {
                isUnlocked = meta.learnedCount >= 5 || meta.masteredCount >= 5;
                conditionHint = 'Learn or master 5+ subtopics';
            } else if (s.id === 'sticker_shield') {
                isUnlocked = Boolean(state.focusModeActive) || (meta.weakAlertCount === 0 && meta.masteredCount >= 3);
                conditionHint = 'Enable Focus Shield or clear weak alerts';
            } else if (s.id === 'sticker_owl') {
                const hour = new Date().getHours();
                isUnlocked = hour < 10 && meta.streak >= 1;
                conditionHint = 'Study during morning hours (< 10 AM)';
            } else if (s.id === 'sticker_phoenix') {
                isUnlocked = (meta.maxMockScore >= 100) || (state.mocks && state.mocks.length >= 2);
                conditionHint = 'Score 100+ in any mock test';
            }

            return {
                ...s,
                isUnlocked,
                conditionHint
            };
        });
    }

    /**
     * Claim reward from an eligible trophy
     */
    claimTrophy(trophyId) {
        const r = this._ensureState();
        if (!r) return { success: false, reason: 'State not ready' };

        const trophy = this.catalog.trophies.find(t => t.id === trophyId);
        if (!trophy) return { success: false, reason: 'Trophy not found' };

        if (r.claimedTrophies.includes(trophyId)) {
            return { success: false, reason: 'Already claimed' };
        }

        const meta = this.getTelemetry();
        if (!trophy.check(window.appState, meta)) {
            return { success: false, reason: 'Requirements not yet met' };
        }

        // Apply reward
        r.claimedTrophies.push(trophyId);
        r.coins += trophy.coins;
        r.points += trophy.points;

        if (typeof window.saveStateToStorage === 'function') {
            window.saveStateToStorage();
        }

        // Sound triggers
        if (typeof window.playSound === 'function') {
            if (trophy.tier === 'Master' || trophy.tier === 'Legendary') {
                window.playSound('achievement');
            } else {
                window.playSound('reward');
            }
        }

        // Confetti for high tiers (safe hook call)
        if (['Gold', 'Platinum', 'Master', 'Legendary'].includes(trophy.tier)) {
            if (typeof window.triggerConfetti === 'function') {
                try { window.triggerConfetti(); } catch (e) {}
            }
        }

        if (typeof window.showToast === 'function') {
            window.showToast(`Claimed ${trophy.title}! +${trophy.coins} Coins, +${trophy.points} Pts`, 'success');
        }

        return { success: true, coins: r.coins, points: r.points };
    }

    /**
     * Purchase and unlock a cosmetic title or theme accent
     */
    unlockCosmetic(itemId) {
        const r = this._ensureState();
        if (!r) return { success: false, reason: 'State not ready' };

        const item = this.catalog.cosmetics.find(c => c.id === itemId);
        if (!item) return { success: false, reason: 'Item not found' };

        if (r.unlocked.includes(itemId)) {
            return { success: false, reason: 'Already unlocked' };
        }

        if (r.coins < item.cost) {
            if (typeof window.playSound === 'function') window.playSound('warning');
            if (typeof window.showToast === 'function') window.showToast(`Need ${item.cost - r.coins} more coins!`, 'warning');
            return { success: false, reason: 'Insufficient coins' };
        }

        // Deduct and unlock
        r.coins -= item.cost;
        r.unlocked.push(itemId);

        // Auto equip upon purchase
        if (item.type === 'title') {
            r.equipped.title = item.name;
        } else if (item.type === 'accent') {
            r.equipped.themeAccent = item.id;
        }

        if (typeof window.saveStateToStorage === 'function') {
            window.saveStateToStorage();
        }

        if (typeof window.playSound === 'function') {
            window.playSound('unlock');
        }

        if (typeof window.showToast === 'function') {
            window.showToast(`Unlocked & Equipped: ${item.name}!`, 'success');
        }

        return { success: true, coins: r.coins };
    }

    /**
     * Equip an unlocked cosmetic
     */
    equipCosmetic(itemId) {
        const r = this._ensureState();
        if (!r) return false;

        const item = this.catalog.cosmetics.find(c => c.id === itemId);
        if (!item) return false;

        if (!r.unlocked.includes(itemId) && !item.unlockedByDefault) {
            return false;
        }

        if (item.type === 'title') {
            r.equipped.title = item.name;
        } else if (item.type === 'accent') {
            r.equipped.themeAccent = item.id;
        }

        if (typeof window.saveStateToStorage === 'function') {
            window.saveStateToStorage();
        }

        if (typeof window.playSound === 'function') {
            window.playSound('checkbox');
        }

        if (typeof window.showToast === 'function') {
            window.showToast(`Equipped: ${item.name}`, 'info');
        }

        return true;
    }
}

// Global Singleton Instance
if (typeof window !== 'undefined') {
    window.RewardsSystem = RewardsSystem;
    if (!window.rewardsSystem) {
        window.rewardsSystem = new RewardsSystem();
    }
    window.evaluateRewards = () => {
        if (window.rewardsSystem) {
            return window.rewardsSystem.evaluateTrophies();
        }
        return [];
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RewardsSystem, REWARDS_CATALOG };
}
