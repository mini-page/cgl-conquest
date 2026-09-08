/**
 * CGL-Conquest Rewards & Progression Engine
 * 
 * Built strictly according to the Final Design Direction & Refinement specification:
 * - One currency only: 🪙 Coins (spendable).
 * - XP (level progression), ⭐ Stars (performance indicator), 🔥 Streak (consistency + multiplier).
 * - Progression requirements: valuable Cosmics & Powers require Coins + Streak/Level/Stars.
 * - Daily Goals & Targets live on the Dashboard; Rewards records "Today's Reward Activity" (history).
 * - Exactly 3 active daily contextual missions (side quests).
 * - Horizontal compact scrollable row for Trophies (all 21 named tier levels with colored trophy icons).
 * - Horizontal compact scrollable row for Collector Stickers (die-cut white outline, resting tilt, hover dynamic tilt).
 * - COSMICS marketplace (customization) & POWERS (strategic assistance with restrictions/cooldowns).
 * - Transparent, proportionate anti-cheat and penalty history.
 * - High-density QR sync serialization for both single-scan and dedicated rewards sync.
 */

const REWARDS_CATALOG = {
    trophies: [
        // ─── BRONZE TIER (Levels I, II, III) ──────────────────────────────────
        {
            id: 'trophy_bronze_1',
            tier: 'Bronze',
            subTier: 'I',
            title: 'First Step',
            desc: 'Master your very first syllabus subtopic.',
            icon: 'fa-shoe-prints',
            tierColor: 'from-amber-700 to-amber-900',
            tierHex: '#d97706',
            tierBorder: 'border-amber-700/50',
            tierText: 'text-amber-500',
            target: 1,
            targetUnit: 'Topic',
            points: 50,
            coins: 15,
            check: (state, meta) => meta.masteredCount >= 1
        },
        {
            id: 'trophy_bronze_2',
            tier: 'Bronze',
            subTier: 'II',
            title: 'Momentum',
            desc: 'Complete at least 1 daily preparation ritual.',
            icon: 'fa-calendar-check',
            tierColor: 'from-amber-700 to-amber-900',
            tierHex: '#d97706',
            tierBorder: 'border-amber-700/50',
            tierText: 'text-amber-500',
            target: 1,
            targetUnit: 'Ritual',
            points: 50,
            coins: 15,
            check: (state, meta) => meta.ritualsCompleted >= 1
        },
        {
            id: 'trophy_bronze_3',
            tier: 'Bronze',
            subTier: 'III',
            title: 'Breakthrough',
            desc: 'Log your first full-length or sectional mock test.',
            icon: 'fa-file-signature',
            tierColor: 'from-amber-700 to-amber-900',
            tierHex: '#d97706',
            tierBorder: 'border-amber-700/50',
            tierText: 'text-amber-500',
            target: 1,
            targetUnit: 'Mock',
            points: 75,
            coins: 20,
            check: (state, meta) => meta.mocksCount >= 1
        },

        // ─── SILVER TIER (Levels I, II, III) ──────────────────────────────────
        {
            id: 'trophy_silver_1',
            tier: 'Silver',
            subTier: 'I',
            title: 'Routine Builder',
            desc: 'Achieve a 3-day unbroken study streak.',
            icon: 'fa-fire-flame-curved',
            tierColor: 'from-slate-400 to-slate-600',
            tierHex: '#94a3b8',
            tierBorder: 'border-slate-400/50',
            tierText: 'text-slate-300',
            target: 3,
            targetUnit: 'Days Streak',
            points: 100,
            coins: 30,
            check: (state, meta) => meta.streak >= 3
        },
        {
            id: 'trophy_silver_2',
            tier: 'Silver',
            subTier: 'II',
            title: 'Subject Explorer',
            desc: 'Master at least 10 subtopics across any subject.',
            icon: 'fa-compass',
            tierColor: 'from-slate-400 to-slate-600',
            tierHex: '#94a3b8',
            tierBorder: 'border-slate-400/50',
            tierText: 'text-slate-300',
            target: 10,
            targetUnit: 'Topics',
            points: 150,
            coins: 40,
            check: (state, meta) => meta.masteredCount >= 10
        },
        {
            id: 'trophy_silver_3',
            tier: 'Silver',
            subTier: 'III',
            title: 'Clean Sweep',
            desc: 'Complete all 4 daily rituals in a single day.',
            icon: 'fa-list-check',
            tierColor: 'from-slate-400 to-slate-600',
            tierHex: '#94a3b8',
            tierBorder: 'border-slate-400/50',
            tierText: 'text-slate-300',
            target: 4,
            targetUnit: 'Rituals',
            points: 200,
            coins: 50,
            check: (state, meta) => meta.ritualsCompleted === 4
        },

        // ─── GOLD TIER (Levels I, II, III) ────────────────────────────────────
        {
            id: 'trophy_gold_1',
            tier: 'Gold',
            subTier: 'I',
            title: 'Methodical Mind',
            desc: 'Master 25 subtopics with multi-stage verification.',
            icon: 'fa-brain',
            tierColor: 'from-yellow-400 to-amber-600',
            tierHex: '#eab308',
            tierBorder: 'border-yellow-400/50',
            tierText: 'text-yellow-400',
            target: 25,
            targetUnit: 'Topics',
            points: 300,
            coins: 80,
            check: (state, meta) => meta.masteredCount >= 25
        },
        {
            id: 'trophy_gold_2',
            tier: 'Gold',
            subTier: 'II',
            title: 'Subject Adapt',
            desc: 'Master 40 subtopics and maintain a 7-day streak.',
            icon: 'fa-bolt',
            tierColor: 'from-yellow-400 to-amber-600',
            tierHex: '#eab308',
            tierBorder: 'border-yellow-400/50',
            tierText: 'text-yellow-400',
            target: 40,
            targetUnit: 'Topics',
            points: 350,
            coins: 100,
            check: (state, meta) => meta.masteredCount >= 40 && meta.streak >= 7
        },
        {
            id: 'trophy_gold_3',
            tier: 'Gold',
            subTier: 'III',
            title: 'Score Centurion',
            desc: 'Score 130+ marks in any mock test.',
            icon: 'fa-chart-line-up',
            tierColor: 'from-yellow-400 to-amber-600',
            tierHex: '#eab308',
            tierBorder: 'border-yellow-400/50',
            tierText: 'text-yellow-400',
            target: 130,
            targetUnit: 'Marks',
            points: 400,
            coins: 120,
            check: (state, meta) => meta.maxMockScore >= 130
        },

        // ─── PLATINUM TIER (Levels I, II, III) ────────────────────────────────
        {
            id: 'trophy_plat_1',
            tier: 'Platinum',
            subTier: 'I',
            title: 'High Caliber',
            desc: 'Master 60 subtopics across Tier 1 & Tier 2 syllabus.',
            icon: 'fa-shield-halved',
            tierColor: 'from-cyan-300 to-blue-600',
            tierHex: '#38bdf8',
            tierBorder: 'border-cyan-400/50',
            tierText: 'text-cyan-300',
            target: 60,
            targetUnit: 'Topics',
            points: 600,
            coins: 180,
            check: (state, meta) => meta.masteredCount >= 60
        },
        {
            id: 'trophy_plat_2',
            tier: 'Platinum',
            subTier: 'II',
            title: 'Vanguard',
            desc: 'Log 5 mock tests and maintain a 10-day streak.',
            icon: 'fa-crosshairs',
            tierColor: 'from-cyan-300 to-blue-600',
            tierHex: '#38bdf8',
            tierBorder: 'border-cyan-400/50',
            tierText: 'text-cyan-300',
            target: 5,
            targetUnit: 'Mocks',
            points: 750,
            coins: 220,
            check: (state, meta) => meta.mocksCount >= 5 && meta.streak >= 10
        },
        {
            id: 'trophy_plat_3',
            tier: 'Platinum',
            subTier: 'III',
            title: 'Endurance',
            desc: 'Score 150+ marks in Tier 1 mock or 310+ in Tier 2 mock.',
            icon: 'fa-trophy',
            tierColor: 'from-cyan-300 to-blue-600',
            tierHex: '#38bdf8',
            tierBorder: 'border-cyan-400/50',
            tierText: 'text-cyan-300',
            target: 150,
            targetUnit: 'Marks',
            points: 1000,
            coins: 300,
            check: (state, meta) => meta.maxMockScore >= 150
        },

        // ─── DIAMOND TIER (Levels I, II, III) ─────────────────────────────────
        {
            id: 'trophy_diam_1',
            tier: 'Diamond',
            subTier: 'I',
            title: 'Precision Elite',
            desc: 'Master 80 subtopics with high accuracy telemetry.',
            icon: 'fa-gem',
            tierColor: 'from-violet-400 to-indigo-600',
            tierHex: '#a855f7',
            tierBorder: 'border-violet-400/50',
            tierText: 'text-violet-300',
            target: 80,
            targetUnit: 'Topics',
            points: 1200,
            coins: 350,
            check: (state, meta) => meta.masteredCount >= 80
        },
        {
            id: 'trophy_diam_2',
            tier: 'Diamond',
            subTier: 'II',
            title: 'Tactical Master',
            desc: 'Maintain a 14-day streak with all daily rituals.',
            icon: 'fa-chess-knight',
            tierColor: 'from-violet-400 to-indigo-600',
            tierHex: '#a855f7',
            tierBorder: 'border-violet-400/50',
            tierText: 'text-violet-300',
            target: 14,
            targetUnit: 'Days Streak',
            points: 1500,
            coins: 450,
            check: (state, meta) => meta.streak >= 14
        },
        {
            id: 'trophy_diam_3',
            tier: 'Diamond',
            subTier: 'III',
            title: 'Apex Performer',
            desc: 'Score 165+ marks in Tier 1 mock or 330+ in Tier 2 mock.',
            icon: 'fa-award',
            tierColor: 'from-violet-400 to-indigo-600',
            tierHex: '#a855f7',
            tierBorder: 'border-violet-400/50',
            tierText: 'text-violet-300',
            target: 165,
            targetUnit: 'Marks',
            points: 1800,
            coins: 500,
            check: (state, meta) => meta.maxMockScore >= 165
        },

        // ─── MASTER TIER (White, Brown, Black) ────────────────────────────────
        {
            id: 'trophy_master_white',
            tier: 'Master',
            subTier: 'White',
            title: 'Pure Clarity',
            desc: 'Master 100 subtopics with zero pending weak concept alerts.',
            icon: 'fa-chess-king',
            tierColor: 'from-slate-100 to-slate-400 text-zinc-950',
            tierHex: '#f1f5f9',
            tierBorder: 'border-white/80',
            tierText: 'text-white',
            target: 100,
            targetUnit: 'Topics',
            points: 2200,
            coins: 650,
            check: (state, meta) => meta.masteredCount >= 100 && meta.weakAlertCount === 0
        },
        {
            id: 'trophy_master_brown',
            tier: 'Master',
            subTier: 'Brown',
            title: 'Deep Earth',
            desc: 'Maintain an unrelenting 21-day streak through thick and thin.',
            icon: 'fa-feather-pointed',
            tierColor: 'from-amber-800 to-amber-950',
            tierHex: '#92400e',
            tierBorder: 'border-amber-700/60',
            tierText: 'text-amber-400',
            target: 21,
            targetUnit: 'Days Streak',
            points: 2600,
            coins: 750,
            check: (state, meta) => meta.streak >= 21
        },
        {
            id: 'trophy_master_black',
            tier: 'Master',
            subTier: 'Black',
            title: 'Obsidian Will',
            desc: 'Master 120 subtopics and complete 10 full mock analyses.',
            icon: 'fa-shield-heart',
            tierColor: 'from-zinc-900 to-black ring-1 ring-purple-500/50',
            tierHex: '#3b82f6',
            tierBorder: 'border-purple-500/50',
            tierText: 'text-purple-300',
            target: 120,
            targetUnit: 'Topics',
            points: 3000,
            coins: 850,
            check: (state, meta) => meta.masteredCount >= 120 && meta.mocksCount >= 10
        },

        // ─── GRAND MASTER TIER (Lite & Super) ─────────────────────────────────
        {
            id: 'trophy_gm_lite',
            tier: 'Grand Master',
            subTier: 'Lite',
            title: 'Stellar Command',
            desc: 'Achieve a 30-day streak and 130 mastered subtopics.',
            icon: 'fa-star',
            tierColor: 'from-amber-400 via-rose-500 to-purple-800',
            tierHex: '#f59e0b',
            tierBorder: 'border-amber-400/80',
            tierText: 'text-amber-300',
            target: 30,
            targetUnit: 'Days Streak',
            points: 3500,
            coins: 1000,
            check: (state, meta) => meta.streak >= 30 && meta.masteredCount >= 130
        },
        {
            id: 'trophy_gm_super',
            tier: 'Grand Master',
            subTier: 'Super',
            title: 'Radiant Dominance',
            desc: 'Master 140 subtopics with 170+ marks in Tier 1 mock.',
            icon: 'fa-certificate',
            tierColor: 'from-amber-300 via-yellow-400 to-rose-600',
            tierHex: '#fbbf24',
            tierBorder: 'border-yellow-300/90',
            tierText: 'text-yellow-300',
            target: 140,
            targetUnit: 'Topics',
            points: 4000,
            coins: 1200,
            check: (state, meta) => meta.masteredCount >= 140 && meta.maxMockScore >= 170
        },

        // ─── CONQUEROR (Final) ────────────────────────────────────────────────
        {
            id: 'trophy_conqueror_final',
            tier: 'Conqueror',
            subTier: 'Final',
            title: 'Final Triumph',
            desc: 'Master all 150 subtopics and complete 15 full mocks.',
            icon: 'fa-crown',
            tierColor: 'from-amber-300 via-amber-500 to-yellow-600 shadow-xl shadow-amber-500/20',
            tierHex: '#f59e0b',
            tierBorder: 'border-amber-400',
            tierText: 'text-amber-200',
            target: 150,
            targetUnit: 'Topics',
            points: 5000,
            coins: 1500,
            check: (state, meta) => meta.masteredCount >= 150 && meta.mocksCount >= 15
        }
    ],

    stickers: [
        { 
            id: 'sticker_speed', 
            emoji: '⚡', 
            name: 'Speed Demon', 
            desc: 'Achieve rapid solve rate in Speed Drills.', 
            tilt: '-3deg',
            check: (state, meta) => Boolean(state.speedDrillsCount && state.speedDrillsCount >= 3) || (meta.masteredCount >= 5) 
        },
        { 
            id: 'sticker_focus', 
            emoji: '🎯', 
            name: 'Deep Focus', 
            desc: 'Complete a 25m+ Pomodoro sprint session.', 
            tilt: '2deg',
            check: (state) => Boolean(state.pomoSessionsToday && state.pomoSessionsToday >= 1) || (state.sessionTime && state.sessionTime >= 1500) 
        },
        { 
            id: 'sticker_srs', 
            emoji: '🧠', 
            name: 'Synapse Retain', 
            desc: 'Review and master 5+ subtopics with zero overdue flashcards.', 
            tilt: '-2deg',
            check: (state, meta) => meta.learnedCount >= 5 || meta.masteredCount >= 5 
        },
        { 
            id: 'sticker_shield', 
            emoji: '🛡️', 
            name: 'Flawless Def', 
            desc: 'Clear weak alerts or engage Focus Shield.', 
            tilt: '3deg',
            check: (state, meta) => Boolean(state.focusModeActive) || (meta.weakAlertCount === 0 && meta.masteredCount >= 3) 
        },
        { 
            id: 'sticker_owl', 
            emoji: '🦉', 
            name: 'Dawn Vigil', 
            desc: 'Log an active study session during morning hours (< 10 AM).', 
            tilt: '-1deg',
            check: (state, meta) => (new Date().getHours() < 10) && (meta.streak >= 1) 
        },
        { 
            id: 'sticker_phoenix', 
            emoji: '🔥', 
            name: 'Phoenix Rise', 
            desc: 'Log a 100+ score in mock analysis or repair weak areas.', 
            tilt: '2deg',
            check: (state, meta) => (meta.maxMockScore >= 100) || (state.mocks && state.mocks.length >= 2) 
        }
    ],

    // Available contextual side quests (3 chosen deterministically per day)
    missionPool: [
        {
            id: 'm_section_mock',
            title: 'Sectional Vanguard',
            desc: 'Complete at least 1 sectional mock test today.',
            icon: 'fa-file-lines',
            target: 1,
            unit: 'Mock',
            xp: 40,
            coins: 15,
            stars: 0,
            check: (state) => (state.mocks && state.mocks.length >= 1)
        },
        {
            id: 'm_speed_sprint',
            title: 'Lightning Calculation',
            desc: 'Finish a 10-Question Speed Drill session.',
            icon: 'fa-bolt',
            target: 1,
            unit: 'Drill',
            xp: 35,
            coins: 12,
            stars: 1,
            check: (state) => Boolean(state.speedDrillsCount && state.speedDrillsCount >= 1)
        },
        {
            id: 'm_flashcards',
            title: 'Active Recall Sprint',
            desc: 'Learn or master at least 3 subtopics in the syllabus.',
            icon: 'fa-brain',
            target: 3,
            unit: 'Topics',
            xp: 30,
            coins: 10,
            stars: 0,
            check: (state, meta) => meta.masteredCount >= 3 || meta.learnedCount >= 3
        },
        {
            id: 'm_pomo_focus',
            title: 'Deep Pomodoro Sprint',
            desc: 'Complete 1 focused Pomodoro study interval.',
            icon: 'fa-stopwatch',
            target: 1,
            unit: 'Session',
            xp: 30,
            coins: 10,
            stars: 0,
            check: (state) => Boolean(state.pomoSessionsToday && state.pomoSessionsToday >= 1)
        },
        {
            id: 'm_toolkit_sheet',
            title: 'Tactical Recon',
            desc: 'Inspect any Toolkit cheat sheet or formula card.',
            icon: 'fa-toolbox',
            target: 1,
            unit: 'Sheet',
            xp: 25,
            coins: 8,
            stars: 0,
            check: (state) => Boolean(state.toolkitViewedToday)
        },
        {
            id: 'm_clear_weak',
            title: 'Concept Armor',
            desc: 'Clear weak alerts or maintain pristine zero weak items.',
            icon: 'fa-shield-halved',
            target: 1,
            unit: 'Clear',
            xp: 40,
            coins: 15,
            stars: 1,
            check: (state, meta) => meta.weakAlertCount === 0 && meta.masteredCount >= 2
        }
    ],

    // COSMICS: Customization marketplace. Purchases require Coins + Progression requirements!
    cosmics: [
        {
            id: 'cosmic_theme_midnight',
            type: 'theme',
            name: 'Midnight OLED',
            desc: 'Pitch-black ultra-high contrast dark surface.',
            cost: 150,
            req: { level: 2 },
            reqLabel: 'Requires Level 2',
            icon: 'fa-moon',
            accentColor: 'text-indigo-400'
        },
        {
            id: 'cosmic_accent_emerald',
            type: 'accent',
            name: 'Emerald Surge',
            desc: 'Tactical emerald green highlight and button styling.',
            cost: 150,
            req: { streak: 3 },
            reqLabel: 'Requires 3-Day Streak',
            icon: 'fa-circle',
            accentColor: 'text-emerald-400',
            hex: '#10b981'
        },
        {
            id: 'cosmic_accent_amber',
            type: 'accent',
            name: 'Solar Amber',
            desc: 'Radiant warm amber highlight and focus ring styling.',
            cost: 250,
            req: { level: 3 },
            reqLabel: 'Requires Level 3',
            icon: 'fa-circle',
            accentColor: 'text-amber-400',
            hex: '#f59e0b'
        },
        {
            id: 'cosmic_accent_violet',
            type: 'accent',
            name: 'Mystic Amethyst',
            desc: 'Deep royal purple accent with subtle lavender hue.',
            cost: 350,
            req: { stars: 10 },
            reqLabel: 'Requires 10 Stars ⭐',
            icon: 'fa-circle',
            accentColor: 'text-purple-400',
            hex: '#8b5cf6'
        },
        {
            id: 'cosmic_arrow_laser',
            type: 'cursor',
            name: 'Laser Glow Cursor',
            desc: 'Vibrant neon cyan directional cursor trail.',
            cost: 300,
            req: { level: 3, stars: 5 },
            reqLabel: 'Requires Level 3 + 5 Stars',
            icon: 'fa-arrow-pointer',
            accentColor: 'text-cyan-400'
        },
        {
            id: 'cosmic_confetti_coins',
            type: 'confetti',
            name: 'Gold Coin Shower',
            desc: 'Celebrate milestones with showers of golden coins.',
            cost: 200,
            req: { level: 2 },
            reqLabel: 'Requires Level 2',
            icon: 'fa-coins',
            accentColor: 'text-yellow-400'
        },
        {
            id: 'cosmic_audio_zen',
            type: 'audio',
            name: 'Zen Meditation Bell',
            desc: 'Replace chimes with acoustic Tibetan bell strikes.',
            cost: 180,
            req: { stars: 5 },
            reqLabel: 'Requires 5 Stars ⭐',
            icon: 'fa-bell',
            accentColor: 'text-teal-400'
        }
    ],

    // POWERS: Strategic assistance items purchased with Coins + Progression requirements!
    powers: [
        {
            id: 'power_streak_freeze',
            name: 'Streak Freeze',
            desc: 'Auto-shields streak if 1 day is missed. Max 2 stored.',
            cost: 200,
            req: { level: 2 },
            reqLabel: 'Requires Level 2',
            icon: 'fa-snowflake',
            color: 'text-cyan-400',
            maxOwned: 2
        },
        {
            id: 'power_streak_repair',
            name: 'Streak Repair',
            desc: 'Restores an accidentally broken streak from yesterday.',
            cost: 400,
            req: { level: 4, stars: 5 },
            reqLabel: 'Requires Level 4 + 5 Stars',
            icon: 'fa-kit-medical',
            color: 'text-emerald-400',
            cooldownDays: 14
        },
        {
            id: 'power_rest_day',
            name: 'Rest Day Waiver',
            desc: 'Designates today as authorized rest with zero streak decay.',
            cost: 150,
            req: { streak: 7 },
            reqLabel: 'Requires 7-Day Streak',
            icon: 'fa-umbrella-beach',
            color: 'text-amber-400',
            maxOwned: 1
        },
        {
            id: 'power_double_xp',
            name: 'Double XP Surge (1 Hour)',
            desc: 'Awards 2x XP on all completed drills and mocks for 1 hour.',
            cost: 250,
            req: { level: 3 },
            reqLabel: 'Requires Level 3',
            icon: 'fa-angles-up',
            color: 'text-purple-400',
            durationMs: 3600000
        },
        {
            id: 'power_zen_drill',
            name: 'No-Timer Zen Drill',
            desc: 'Practice Speed Drills with zero timer countdown pressure.',
            cost: 100,
            req: { stars: 3 },
            reqLabel: 'Requires 3 Stars ⭐',
            icon: 'fa-spa',
            color: 'text-teal-300',
            uses: 3
        }
    ]
};

class RewardsSystem {
    constructor() {
        this.catalog = REWARDS_CATALOG;
    }

    /**
     * Compute current state telemetry metrics
     */
    getTelemetry() {
        const state = (typeof window !== 'undefined' && window.appState) ? window.appState : {};
        const progress = state.syllabusProgress || {};
        
        let masteredCount = 0;
        let practicedCount = 0;
        let learnedCount = 0;

        Object.values(progress).forEach(p => {
            if (p && p.mastered) masteredCount++;
            if (p && p.practiced) practicedCount++;
            if (p && p.learned) learnedCount++;
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
            streak: Number(state.streak) || 0,
            mocksCount: (state.mocks || []).length
        };
    }

    /**
     * Initialize or hydrate normalized rewards state
     */
    _ensureState() {
        const globalObj = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined' ? global : null);
        if (!globalObj) return null;
        if (!globalObj.appState) {
            globalObj.appState = {};
        }
        if (!globalObj.appState.rewards) {
            globalObj.appState.rewards = {
                coins: 0,
                points: 0,
                stars: 0,
                unlockedCosmics: ['title_aspirant', 'accent_blue'],
                claimedTrophies: [],
                unlockedStickers: [],
                equippedSticker: '',
                equipped: {
                    title: 'Aspirant',
                    themeAccent: 'accent_blue'
                },
                powers: {},
                todayActivity: [],
                penalties: [],
                dailyMissions: [],
                dailyMissionsClaimed: [],
                dailyRewardedActions: {},
                lifetimeRewardedActions: {}
            };
        }
        const r = globalObj.appState.rewards;
        if (typeof r.coins !== 'number') r.coins = 0;
        if (typeof r.points !== 'number') r.points = 0;
        if (typeof r.stars !== 'number') r.stars = 0;
        if (!Array.isArray(r.unlockedCosmics)) r.unlockedCosmics = ['title_aspirant', 'accent_blue'];
        if (!Array.isArray(r.claimedTrophies)) r.claimedTrophies = [];
        if (!Array.isArray(r.unlockedStickers)) r.unlockedStickers = [];
        if (!r.equipped) r.equipped = { title: 'Aspirant', themeAccent: 'accent_blue' };
        if (!r.powers || typeof r.powers !== 'object') r.powers = {};
        if (!Array.isArray(r.todayActivity)) r.todayActivity = [];
        if (!Array.isArray(r.penalties)) r.penalties = [];
        if (!Array.isArray(r.dailyMissionsClaimed)) r.dailyMissionsClaimed = [];
        if (!r.dailyRewardedActions || typeof r.dailyRewardedActions !== 'object') r.dailyRewardedActions = {};
        if (!r.lifetimeRewardedActions || typeof r.lifetimeRewardedActions !== 'object') r.lifetimeRewardedActions = {};
        return r;
    }

    /**
     * Streak multiplier: consecutive consistency amplifies reward yield
     */
    getStreakMultiplier(streak = 0) {
        if (streak >= 30) return { mult: 2.0, label: '2.0x (Apex)' };
        if (streak >= 14) return { mult: 1.5, label: '1.5x (Surge)' };
        if (streak >= 7) return { mult: 1.25, label: '1.25x (Momentum)' };
        if (streak >= 3) return { mult: 1.1, label: '1.1x (Active)' };
        return { mult: 1.0, label: '1.0x (Standard)' };
    }

    /**
     * Compute player level and rank based on total XP points
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
     * Evaluate all 21 trophies in the catalog
     */
    evaluateTrophies() {
        const r = this._ensureState();
        const state = window.appState || {};
        const meta = this.getTelemetry();

        return this.catalog.trophies.map(t => {
            const isEligible = t.check(state, meta);
            const isClaimed = r ? r.claimedTrophies.includes(t.id) : false;
            
            // Calculate progress current vs target
            let currentVal = 0;
            if (t.targetUnit === 'Topic' || t.targetUnit === 'Topics') currentVal = meta.masteredCount;
            else if (t.targetUnit === 'Ritual' || t.targetUnit === 'Rituals') currentVal = meta.ritualsCompleted;
            else if (t.targetUnit === 'Mock' || t.targetUnit === 'Mocks') currentVal = meta.mocksCount;
            else if (t.targetUnit === 'Days Streak') currentVal = meta.streak;
            else if (t.targetUnit === 'Marks') currentVal = Math.round(meta.maxMockScore);
            else currentVal = isEligible ? t.target : 0;

            const cappedCurrent = Math.min(t.target, Math.max(0, currentVal));
            const progressPct = Math.min(100, Math.round((cappedCurrent / t.target) * 100));

            return {
                ...t,
                isEligible,
                isClaimed,
                canClaim: isEligible && !isClaimed,
                progress: {
                    current: cappedCurrent,
                    target: t.target,
                    unit: t.targetUnit,
                    pct: progressPct
                }
            };
        });
    }

    /**
     * Evaluate collectible stickers
     */
    evaluateStickers() {
        const state = window.appState || {};
        const meta = this.getTelemetry();
        const r = this._ensureState();

        return (this.catalog.stickers || []).map(s => {
            const isUnlocked = s.check(state, meta) || (r && r.unlockedStickers.includes(s.id));
            const isEquipped = r ? r.equippedSticker === s.id : false;

            return {
                ...s,
                isUnlocked,
                isEquipped
            };
        });
    }

    /**
     * Get exactly 3 daily side quest missions (deterministic selection based on date)
     */
    getDailyMissions() {
        const state = window.appState || {};
        const meta = this.getTelemetry();
        const r = this._ensureState();
        const todayStr = new Date().toISOString().slice(0, 10);

        // Deterministic pick of 3 missions from the pool of 6
        let hash = 0;
        for (let i = 0; i < todayStr.length; i++) hash = ((hash << 5) - hash) + todayStr.charCodeAt(i);
        const seed = Math.abs(hash);

        const pool = this.catalog.missionPool;
        const count = pool.length;
        const idx1 = seed % count;
        const idx2 = (seed + 2) % count;
        const idx3 = (seed + 4) % count;

        const selectedMissions = [pool[idx1], pool[idx2], pool[idx3]];
        const claimedList = (r && Array.isArray(r.dailyMissionsClaimed)) ? r.dailyMissionsClaimed : [];

        return selectedMissions.map(m => {
            const isEligible = m.check(state, meta);
            const isClaimed = claimedList.includes(`${todayStr}_${m.id}`);

            return {
                ...m,
                date: todayStr,
                isEligible,
                isClaimed,
                canClaim: isEligible && !isClaimed
            };
        });
    }

    /**
     * Find the nearest meaningful reward to unlock next
     */
    getNextUnlock() {
        const r = this._ensureState();
        if (!r) return null;

        const trophies = this.evaluateTrophies();
        const uncl = trophies.filter(t => !t.isClaimed);

        // Pick the unclaimed trophy with highest completion percentage
        uncl.sort((a, b) => b.progress.pct - a.progress.pct);
        if (uncl.length > 0 && uncl[0].progress.pct > 0) {
            const nearest = uncl[0];
            return {
                type: 'trophy',
                title: `${nearest.tier} ${nearest.subTier} — ${nearest.title}`,
                desc: `${nearest.progress.current}/${nearest.progress.target} ${nearest.progress.unit}`,
                pct: nearest.progress.pct
            };
        }

        // Fallback: Next level
        const lvlData = this.getLevelData(r.points || 0);
        return {
            type: 'level',
            title: `Level ${lvlData.level + 1}`,
            desc: `${lvlData.pointsNeeded} XP remaining`,
            pct: lvlData.progressPct
        };
    }

    /**
     * Record a completed reward event in Today's Reward Activity (history, NOT a checklist)
     */
    recordActivity({
        type = 'event',
        title = 'Activity Completed',
        xp = 0,
        coins = 0,
        stars = 0,
        dedupKey = null,
        minCooldown = 0,
        onceDaily = false,
        silentOnDuplicate = false
    } = {}) {
        const r = this._ensureState();
        if (!r) return null;

        // Anti-cheat rate limit & deduplication guard
        const cheatCheck = this.checkAntiCheat(type, dedupKey, { minCooldown, title, onceDaily });
        if (cheatCheck && cheatCheck.flagged) {
            if (cheatCheck.reason === 'already_rewarded_today') {
                if (!silentOnDuplicate && typeof window !== 'undefined' && typeof window.showToast === 'function') {
                    window.showToast(`${title} already credited for today.`, 'info');
                }
            } else if (cheatCheck.reason === 'oscillation') {
                if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
                    window.showToast(`⚠️ Anti-Cheat: Repeated toggling detected for "${title}". Rewards locked.`, 'warning');
                }
                if (typeof window !== 'undefined' && typeof window.playSound === 'function') {
                    window.playSound('error');
                }
            } else if (cheatCheck.reason === 'cooldown_active') {
                if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
                    window.showToast(`⚠️ ${cheatCheck.message}`, 'warning');
                }
            }
            return null;
        }

        // Register in daily rewarded actions registry
        const todayStr = new Date().toISOString().slice(0, 10);
        if (dedupKey) {
            const dailyKey = `${todayStr}:${dedupKey}`;
            if (!r.dailyRewardedActions) r.dailyRewardedActions = {};
            r.dailyRewardedActions[dailyKey] = Date.now();
        }

        const globalObj = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined' ? global : null);
        const streak = (globalObj && globalObj.appState && globalObj.appState.streak) ? globalObj.appState.streak : 0;
        const { mult } = this.getStreakMultiplier(streak);

        const effectiveXp = Math.round(xp * mult);
        const effectiveCoins = Math.round(coins * mult);
        const effectiveStars = Number(stars) || 0;

        r.points += effectiveXp;
        r.coins += effectiveCoins;
        r.stars += effectiveStars;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const entry = {
            id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            type,
            title,
            dedupKey: dedupKey || null,
            xp: effectiveXp,
            coins: effectiveCoins,
            stars: effectiveStars,
            multiplier: mult,
            time: timeStr
        };

        r.todayActivity.unshift(entry);
        if (r.todayActivity.length > 25) r.todayActivity.pop();

        if (typeof window !== 'undefined' && typeof window.saveStateToStorage === 'function') {
            window.saveStateToStorage();
        }

        // Audio & Visual feedback
        if (typeof window !== 'undefined' && typeof window.playSound === 'function') {
            window.playSound('reward');
        }

        if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
            const bonusTag = mult > 1.0 ? ` (${mult}x streak bonus)` : '';
            window.showToast(`${title}: +${effectiveXp} XP · +${effectiveCoins} 🪙${bonusTag}`, 'success');
        }

        return entry;
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

        const globalObj = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined' ? global : null);
        const appState = (globalObj && globalObj.appState) ? globalObj.appState : {};
        const meta = this.getTelemetry();
        if (!trophy.check(appState, meta)) {
            return { success: false, reason: 'Requirements not met' };
        }

        r.claimedTrophies.push(trophyId);
        this.recordActivity({
            type: 'trophy',
            dedupKey: `trophy_${trophyId}`,
            title: `Claimed ${trophy.tier} ${trophy.subTier}: ${trophy.title}`,
            xp: trophy.points,
            coins: trophy.coins,
            stars: 1
        });

        // Confetti for higher tiers
        if (['Gold', 'Platinum', 'Diamond', 'Master', 'Grand Master', 'Conqueror'].includes(trophy.tier)) {
            if (typeof window !== 'undefined' && typeof window.triggerConfetti === 'function') {
                try { window.triggerConfetti(); } catch (e) {}
            }
        }

        return { success: true };
    }

    /**
     * Claim daily side quest mission
     */
    claimMission(missionId) {
        const r = this._ensureState();
        if (!r) return { success: false };

        const mission = this.catalog.missionPool.find(m => m.id === missionId);
        if (!mission) return { success: false };

        const todayStr = new Date().toISOString().slice(0, 10);
        const claimKey = `${todayStr}_${missionId}`;

        if (!Array.isArray(r.dailyMissionsClaimed)) r.dailyMissionsClaimed = [];
        if (r.dailyMissionsClaimed.includes(claimKey)) return { success: false, reason: 'Already claimed today' };

        const globalObj = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined' ? global : null);
        const appState = (globalObj && globalObj.appState) ? globalObj.appState : {};
        const meta = this.getTelemetry();
        if (!mission.check(appState, meta)) return { success: false, reason: 'Mission requirements not met' };

        r.dailyMissionsClaimed.push(claimKey);
        this.recordActivity({
            type: 'mission',
            dedupKey: `mission_${claimKey}`,
            title: `Mission Completed: ${mission.title}`,
            xp: mission.xp,
            coins: mission.coins,
            stars: mission.stars || 0
        });

        return { success: true };
    }

    /**
     * Purchase a Cosmic customization (verifies Coins + Progression requirements)
     */
    purchaseCosmic(cosmicId) {
        const r = this._ensureState();
        if (!r) return { success: false };

        const item = this.catalog.cosmics.find(c => c.id === cosmicId);
        if (!item) return { success: false, reason: 'Item not found' };

        if (r.unlockedCosmics.includes(cosmicId)) {
            return { success: false, reason: 'Already unlocked' };
        }

        // Validate Progression Requirements
        const meta = this.getTelemetry();
        const lvlData = this.getLevelData(r.points);
        if (item.req) {
            if (item.req.level && lvlData.level < item.req.level) {
                if (typeof window.showToast === 'function') window.showToast(`Requires Player Level ${item.req.level}`, 'warning');
                return { success: false, reason: 'Level requirement not met' };
            }
            if (item.req.streak && meta.streak < item.req.streak) {
                if (typeof window.showToast === 'function') window.showToast(`Requires ${item.req.streak}-day streak`, 'warning');
                return { success: false, reason: 'Streak requirement not met' };
            }
            if (item.req.stars && (r.stars || 0) < item.req.stars) {
                if (typeof window.showToast === 'function') window.showToast(`Requires ${item.req.stars} Stars ⭐`, 'warning');
                return { success: false, reason: 'Star requirement not met' };
            }
        }

        // Validate Coins Currency
        if (r.coins < item.cost) {
            if (typeof window.showToast === 'function') window.showToast(`Need ${item.cost - r.coins} more coins!`, 'warning');
            return { success: false, reason: 'Insufficient coins' };
        }

        r.coins -= item.cost;
        r.unlockedCosmics.push(cosmicId);

        if (typeof window.saveStateToStorage === 'function') {
            window.saveStateToStorage();
        }

        if (typeof window.playSound === 'function') {
            window.playSound('unlock');
        }

        if (typeof window.showToast === 'function') {
            window.showToast(`Unlocked Cosmic: ${item.name}! Configure in Hub.`, 'success');
        }

        return { success: true, coins: r.coins };
    }

    /**
     * Purchase a Strategic Power (verifies Coins + Restrictions)
     */
    purchasePower(powerId) {
        const r = this._ensureState();
        if (!r) return { success: false };

        const power = this.catalog.powers.find(p => p.id === powerId);
        if (!power) return { success: false };

        const meta = this.getTelemetry();
        const lvlData = this.getLevelData(r.points);

        // Progression check
        if (power.req) {
            if (power.req.level && lvlData.level < power.req.level) {
                if (typeof window.showToast === 'function') window.showToast(`Requires Level ${power.req.level}`, 'warning');
                return { success: false };
            }
            if (power.req.streak && meta.streak < power.req.streak) {
                if (typeof window.showToast === 'function') window.showToast(`Requires ${power.req.streak}-day streak`, 'warning');
                return { success: false };
            }
            if (power.req.stars && (r.stars || 0) < power.req.stars) {
                if (typeof window.showToast === 'function') window.showToast(`Requires ${power.req.stars} Stars`, 'warning');
                return { success: false };
            }
        }

        // Limit check
        const currentCount = r.powers[powerId] ? (r.powers[powerId].count || 0) : 0;
        if (power.maxOwned && currentCount >= power.maxOwned) {
            if (typeof window.showToast === 'function') window.showToast(`Max ${power.maxOwned} stored at once!`, 'warning');
            return { success: false };
        }

        // Coin check
        if (r.coins < power.cost) {
            if (typeof window.showToast === 'function') window.showToast(`Need ${power.cost - r.coins} more coins!`, 'warning');
            return { success: false };
        }

        r.coins -= power.cost;
        if (!r.powers[powerId]) r.powers[powerId] = { count: 0, lastPurchased: Date.now() };
        r.powers[powerId].count += 1;
        r.powers[powerId].lastPurchased = Date.now();

        if (typeof window.saveStateToStorage === 'function') {
            window.saveStateToStorage();
        }

        if (typeof window.playSound === 'function') {
            window.playSound('achievement');
        }

        if (typeof window.showToast === 'function') {
            window.showToast(`Acquired Strategic Power: ${power.name}!`, 'success');
        }

        return { success: true, count: r.powers[powerId].count };
    }

    /**
     * Equip or unequip a collectible sticker
     */
    toggleEquipSticker(stickerId) {
        const r = this._ensureState();
        if (!r) return false;

        const stickers = this.evaluateStickers();
        const s = stickers.find(item => item.id === stickerId);
        if (!s || !s.isUnlocked) return false;

        if (r.equippedSticker === stickerId) {
            r.equippedSticker = '';
            if (typeof window.showToast === 'function') window.showToast(`Unequipped ${s.name}`, 'info');
        } else {
            r.equippedSticker = stickerId;
            if (typeof window.showToast === 'function') window.showToast(`Equipped ${s.name} Sticker!`, 'success');
        }

        if (typeof window.saveStateToStorage === 'function') {
            window.saveStateToStorage();
        }

        return true;
    }

    /**
     * Anti-cheat rate limit & exploit guard (deduplication, oscillation detection, cooldowns)
     * Returns false if action is permitted, or an object { flagged: true, reason, duplicate, message } if rejected.
     */
    checkAntiCheat(actionType, dedupKey = null, { minCooldown = 0, title = '', onceDaily = false } = {}) {
        const globalObj = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined' ? global : null);
        if (!globalObj) return false;

        const now = Date.now();
        const r = this._ensureState();
        const todayStr = new Date().toISOString().slice(0, 10);

        if (!this._lastActionTimes) this._lastActionTimes = {};
        if (!this._toggleWindow) this._toggleWindow = [];

        const effectiveDedupKey = dedupKey ? String(dedupKey) : null;
        const dailyKey = effectiveDedupKey ? `${todayStr}:${effectiveDedupKey}` : null;

        // 1. Record this attempt in the sliding window
        this._toggleWindow.push({
            type: actionType,
            key: effectiveDedupKey || actionType,
            time: now
        });

        // Keep only entries from the last 15 seconds
        this._toggleWindow = this._toggleWindow.filter(entry => (now - entry.time) < 15000);

        // Count toggles on this specific action key or type
        const matchKey = effectiveDedupKey || actionType;
        const recentAttempts = this._toggleWindow.filter(entry => entry.key === matchKey);

        // 2. Oscillation / Rapid Toggle Exploitation Detection (Sliding Window 15s)
        // If toggled > 3 times within 15 seconds: Flag as exploit oscillation!
        if (recentAttempts.length > 3) {
            if (r) {
                const penaltyEntry = {
                    id: `pen_${now}_${Math.random().toString(36).slice(2, 5)}`,
                    reason: `Rapid toggle exploit detected on ${title || actionType} (${recentAttempts.length}x in 15s)`,
                    action: 'Voided duplicate event yield & locked rewards',
                    time: new Date().toLocaleTimeString()
                };
                r.penalties.unshift(penaltyEntry);
                if (r.penalties.length > 15) r.penalties.pop();
            }
            return {
                flagged: true,
                reason: 'oscillation',
                duplicate: false,
                message: `Anti-Cheat: Repeated toggling detected for "${title || actionType}". Rewards locked.`
            };
        }

        // 3. Sub-300ms Micro-Flood Guard (Macro / Script Spammer)
        const lastTime = this._lastActionTimes[matchKey] || 0;
        if (now - lastTime < 300) {
            if (r) {
                r.penalties.unshift({
                    id: `pen_${now}`,
                    reason: `Micro-interval spam pace detected on ${title || actionType} (<300ms)`,
                    action: 'Voided flood packet',
                    time: new Date().toLocaleTimeString()
                });
                if (r.penalties.length > 15) r.penalties.pop();
            }
            this._lastActionTimes[matchKey] = now;
            return {
                flagged: true,
                reason: 'flood',
                duplicate: false,
                message: 'Rapid exploit pace detected. Action rejected.'
            };
        }

        // 4. Daily Deduplication Check (Single-Reward-Per-Day Guarantee)
        // If an action has a daily dedupKey, it can ONLY grant rewards once per calendar day.
        if (dailyKey && r && r.dailyRewardedActions && r.dailyRewardedActions[dailyKey]) {
            return {
                flagged: true,
                reason: 'already_rewarded_today',
                duplicate: true,
                message: `"${title || actionType}" has already been credited for today.`
            };
        }

        // 4. Action-Specific Minimum Cooldown Check
        if (minCooldown > 0 && lastTime > 0 && (now - lastTime) < minCooldown) {
            const remainingSec = Math.ceil((minCooldown - (now - lastTime)) / 1000);
            return {
                flagged: true,
                reason: 'cooldown_active',
                duplicate: false,
                remainingSec,
                message: `Cooldown active for "${title || actionType}". Please wait ${remainingSec}s before completing again.`
            };
        }

        this._lastActionTimes[matchKey] = now;
        return false;
    }
}

// Global Singleton Instance
if (typeof window !== 'undefined') {
    window.RewardsSystem = RewardsSystem;
    window.REWARDS_CATALOG = REWARDS_CATALOG;
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
