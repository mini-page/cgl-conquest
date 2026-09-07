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
     * Check which trophies are unlocked, claimable, or locked
     */
    evaluateTrophies() {
        const r = this._ensureState();
        const state = window.appState || {};
        const meta = this.getTelemetry();

        return this.catalog.trophies.map(t => {
            const isEligible = t.check(state, meta);
            const isClaimed = r ? r.claimedTrophies.includes(t.id) : false;
            return {
                ...t,
                isEligible,
                isClaimed,
                canClaim: isEligible && !isClaimed
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

export { RewardsSystem, REWARDS_CATALOG };
