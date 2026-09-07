/**
 * CGL-Conquest Global Synthesized Sound System
 * 
 * 100% Offline & Zero External Asset Dependencies.
 * Generates tactile, pleasant, acoustic-grade audio cues via Web Audio API.
 * Adheres strictly to browser autoplay policies, user mute preferences, and Pomodoro Focus Mode.
 */

class SoundManager {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.volume = 0.35; // Default master volume
        this.isMuted = false;
        this._hasInteracted = false;

        // Auto-unlock AudioContext on first user interaction
        if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
            const unlockAudio = () => {
                this.initContext();
                if (this.ctx && this.ctx.state === 'suspended') {
                    this.ctx.resume();
                }
                this._hasInteracted = true;
                window.removeEventListener('click', unlockAudio);
                window.removeEventListener('keydown', unlockAudio);
                window.removeEventListener('touchstart', unlockAudio);
            };
            window.addEventListener('click', unlockAudio, { once: true, passive: true });
            window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
            window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
        }
    }

    initContext() {
        if (this.ctx) return this.ctx;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
                this.masterGain.connect(this.ctx.destination);
            }
        } catch (e) {
            console.warn('[SoundSystem] AudioContext not supported or blocked:', e);
        }
        return this.ctx;
    }

    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        }
    }

    shouldPlay(soundName) {
        if (typeof window === 'undefined') return false;
        // Check global appState preferences
        if (window.appState) {
            if (window.appState.soundEnabled === false) return false;
            const isTimer = soundName === 'timer.complete' || soundName === 'timer' || soundName === 'bell';
            if (window.appState.focusModeActive && !isTimer) return false; // Focus mode suppresses sounds except timer completion bell
        }
        return !this.isMuted;
    }

    /**
     * Play a semantic sound cue
     * @param {string} soundName - e.g. 'checkbox', 'success.normal', 'achievement', 'reward', 'timer.complete'
     * @param {Object} options - Optional pitch/volume overrides
     */
    play(soundName, options = {}) {
        const soundKey = (soundName || '').toLowerCase().trim();
        if (!this.shouldPlay(soundKey)) return;
        const ctx = this.initContext();
        if (!ctx) return;

        if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }

        const now = ctx.currentTime;

        try {
            switch (soundKey) {
                case 'checkbox':
                case 'tick':
                case 'click':
                    this._playCheckbox(now, options);
                    break;

                case 'success.soft':
                    this._playSuccessSoft(now, options);
                    break;

                case 'success':
                case 'success.normal':
                    this._playSuccessNormal(now, options);
                    break;

                case 'success.strong':
                case 'celebration':
                    this._playSuccessStrong(now, options);
                    break;

                case 'achievement':
                    this._playAchievement(now, options);
                    break;

                case 'reward':
                case 'coin':
                    this._playRewardCoin(now, options);
                    break;

                case 'milestone':
                    this._playMilestone(now, options);
                    break;

                case 'unlock':
                    this._playUnlock(now, options);
                    break;

                case 'completion':
                    this._playCompletion(now, options);
                    break;

                case 'notification':
                case 'nudge':
                    this._playNotification(now, options);
                    break;

                case 'warning':
                    this._playWarning(now, options);
                    break;

                case 'error':
                    this._playError(now, options);
                    break;

                case 'timer.complete':
                case 'timer':
                case 'bell':
                    this._playTimerComplete(now, options);
                    break;

                default:
                    // Fallback pleasant click
                    this._playCheckbox(now, options);
                    break;
            }
        } catch (err) {
            console.warn(`[SoundSystem] Error generating sound '${soundName}':`, err);
        }
    }

    /* ─── SYNTHESIZERS ────────────────────────────────────── */

    // 1. Crisp, tactile UI checkbox pop (35ms)
    _playCheckbox(startTime, opt = {}) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const pitch = opt.pitch || 1.0;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400 * pitch, startTime);
        osc.frequency.exponentialRampToValueAtTime(450 * pitch, startTime + 0.035);

        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.035);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.04);
    }

    // 2. Soft, pleasant chord (180ms)
    _playSuccessSoft(startTime) {
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime + idx * 0.03);

            gain.gain.setValueAtTime(0.001, startTime + idx * 0.03);
            gain.gain.linearRampToValueAtTime(0.18, startTime + idx * 0.03 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.03 + 0.22);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(startTime + idx * 0.03);
            osc.stop(startTime + idx * 0.03 + 0.25);
        });
    }

    // 3. Upbeat two-tone completion chime (260ms)
    _playSuccessNormal(startTime) {
        const notes = [
            { f: 587.33, t: 0, d: 0.12 },     // D5
            { f: 880.00, t: 0.10, d: 0.20 }   // A5
        ];
        notes.forEach(n => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(n.f, startTime + n.t);

            gain.gain.setValueAtTime(0.001, startTime + n.t);
            gain.gain.linearRampToValueAtTime(0.25, startTime + n.t + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.t + n.d);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(startTime + n.t);
            osc.stop(startTime + n.t + n.d + 0.02);
        });
    }

    // 4. Rich three-tone celebration fanfare (450ms)
    _playSuccessStrong(startTime) {
        const notes = [
            { f: 523.25, t: 0, d: 0.12 },     // C5
            { f: 659.25, t: 0.09, d: 0.12 },  // E5
            { f: 783.99, t: 0.18, d: 0.14 },  // G5
            { f: 1046.50, t: 0.28, d: 0.35 }  // C6
        ];
        notes.forEach(n => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(n.f, startTime + n.t);

            gain.gain.setValueAtTime(0.001, startTime + n.t);
            gain.gain.linearRampToValueAtTime(0.3, startTime + n.t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.t + n.d);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(startTime + n.t);
            osc.stop(startTime + n.t + n.d + 0.02);
        });
    }

    // 5. Majestic ascending achievement fanfare (600ms)
    _playAchievement(startTime) {
        const arpeggio = [
            { f: 440.00, t: 0.00 }, // A4
            { f: 554.37, t: 0.08 }, // C#5
            { f: 659.25, t: 0.16 }, // E5
            { f: 880.00, t: 0.24 }, // A5
            { f: 1108.73, t: 0.34 } // C#6
        ];

        arpeggio.forEach(note => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, startTime + note.t);

            gain.gain.setValueAtTime(0.001, startTime + note.t);
            gain.gain.linearRampToValueAtTime(0.28, startTime + note.t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.t + 0.4);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(startTime + note.t);
            osc.stop(startTime + note.t + 0.45);
        });
    }

    // 6. Sparkling coin / reward pickup (280ms)
    _playRewardCoin(startTime) {
        const coins = [
            { f: 987.77, t: 0.00, d: 0.18 },  // B5
            { f: 1318.51, t: 0.08, d: 0.28 }  // E6
        ];

        coins.forEach(c => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(c.f, startTime + c.t);

            gain.gain.setValueAtTime(0.001, startTime + c.t);
            gain.gain.linearRampToValueAtTime(0.32, startTime + c.t + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + c.t + c.d);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(startTime + c.t);
            osc.stop(startTime + c.t + c.d + 0.02);
        });
    }

    // 7. Milestone resonant gong / brass wave (700ms)
    _playMilestone(startTime) {
        const oscBass = this.ctx.createOscillator();
        const gainBass = this.ctx.createGain();
        oscBass.type = 'sine';
        oscBass.frequency.setValueAtTime(130.81, startTime); // C3
        gainBass.gain.setValueAtTime(0.35, startTime);
        gainBass.gain.exponentialRampToValueAtTime(0.001, startTime + 0.7);
        oscBass.connect(gainBass);
        gainBass.connect(this.masterGain);
        oscBass.start(startTime);
        oscBass.stop(startTime + 0.75);

        const oscChime = this.ctx.createOscillator();
        const gainChime = this.ctx.createGain();
        oscChime.type = 'triangle';
        oscChime.frequency.setValueAtTime(783.99, startTime + 0.05); // G5
        gainChime.gain.setValueAtTime(0.28, startTime + 0.05);
        gainChime.gain.exponentialRampToValueAtTime(0.001, startTime + 0.65);
        oscChime.connect(gainChime);
        gainChime.connect(this.masterGain);
        oscChime.start(startTime + 0.05);
        oscChime.stop(startTime + 0.7);
    }

    // 8. Mechanical click + shimmering upward arpeggio (320ms)
    _playUnlock(startTime) {
        this._playCheckbox(startTime, { pitch: 1.2 });
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime + 0.05 + (i * 0.04));
            gain.gain.setValueAtTime(0.001, startTime + 0.05 + (i * 0.04));
            gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05 + (i * 0.04) + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05 + (i * 0.04) + 0.18);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(startTime + 0.05 + (i * 0.04));
            osc.stop(startTime + 0.05 + (i * 0.04) + 0.2);
        });
    }

    // 9. Satisfying deep positive cadence (400ms)
    _playCompletion(startTime) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(392.00, startTime); // G4
        osc.frequency.exponentialRampToValueAtTime(523.25, startTime + 0.15); // C5
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + 0.42);
    }

    // 10. Gentle double pip for notification / nudge (160ms)
    _playNotification(startTime) {
        [
            { f: 880, t: 0, d: 0.06 },     // A5
            { f: 1174.66, t: 0.09, d: 0.09 } // D6
        ].forEach(n => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(n.f, startTime + n.t);
            gain.gain.setValueAtTime(0.001, startTime + n.t);
            gain.gain.linearRampToValueAtTime(0.2, startTime + n.t + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.t + n.d);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(startTime + n.t);
            osc.stop(startTime + n.t + n.d + 0.02);
        });
    }

    // 11. Warning: muted descending pulse
    _playWarning(startTime) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, startTime);
        osc.frequency.linearRampToValueAtTime(370, startTime + 0.15);
        gain.gain.setValueAtTime(0.22, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + 0.25);
    }

    // 12. Error: subtle low buzzer drop
    _playError(startTime) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, startTime);
        osc.frequency.exponentialRampToValueAtTime(130, startTime + 0.2);
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + 0.28);
    }

    // 13. Timer complete: Penetrating resonant zen bell / double strike (1.6s)
    _playTimerComplete(startTime) {
        const fundamentals = [528, 1056]; // 528Hz Solfeggio frequency + octave harmonic
        fundamentals.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            const initialVol = idx === 0 ? 0.35 : 0.15;
            gain.gain.setValueAtTime(initialVol, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.4);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(startTime);
            osc.stop(startTime + 1.5);
        });

        // Second gentle resonance at +0.25s
        setTimeout(() => {
            if (!this.ctx) return;
            const now2 = this.ctx.currentTime;
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(792, now2);
            gain2.gain.setValueAtTime(0.2, now2);
            gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 1.2);
            osc2.connect(gain2);
            gain2.connect(this.masterGain);
            osc2.start(now2);
            osc2.stop(now2 + 1.3);
        }, 250);
    }
}

// Global Singleton Instance
if (typeof window !== 'undefined') {
    window.SoundManager = SoundManager;
    if (!window.soundManager) {
        window.soundManager = new SoundManager();
    }
    window.playSound = (name, opt) => {
        if (window.soundManager) {
            window.soundManager.play(name, opt);
        }
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SoundManager };
}
