/**
 * QrSyncModal Component
 * Universal two-way peer device synchronization via high-density QR code.
 * Works seamlessly across mobile & laptop, offline/file:// protocol and HTTPS.
 */

(function () {
    // Compact serialization dictionary for ultra-dense QR codes
    function extractCompactPayload(state) {
        // Compress syllabusProgress: only active topics encoded as numeric stages (1=L, 2=P, 3=M)
        const compactSyllabus = {};
        if (state && state.syllabusProgress) {
            Object.entries(state.syllabusProgress).forEach(([id, f]) => {
                if (!f) return;
                let stage = 0;
                if (f.mastered) stage = 3;
                else if (f.practiced) stage = 2;
                else if (f.learned) stage = 1;
                if (stage > 0) {
                    compactSyllabus[id] = stage;
                }
            });
        }

        return {
            v: 1, // sync protocol version
            t: Date.now(),
            sp: compactSyllabus,
            m: Array.isArray(state.mocks) ? state.mocks : [],
            n: Array.isArray(state.notes) ? state.notes : (Array.isArray(state.customNotes) ? state.customNotes : []),
            w: state.weakAlerts || {},
            srs: state.srsRecords || {},
            cd: Number(state.currentDay) || 1,
            dc: Number(state.dayCounter) || 1,
            ed: state.examDate || '2026-08-15',
            en: state.examName || 'Conquest',
            et: Number(state.examTier) || 1,
            st: Number(state.streak) || 1,
            la: state.lastActiveDate || '',
            dr: state.dailyRituals || { drill: false, vocab: false, ca: false, computer: false },
            th: state.theme || 'dark',
            mh: state.mobileNavHand || 'center',
            spk: state.speechEnabled !== false,
            tst: state.toastEnabled !== false,
            snd: state.soundEnabled !== false,
            foc: Boolean(state.focusModeActive),
            rew: state.rewards ? {
                c: Number(state.rewards.coins) || 0,
                p: Number(state.rewards.points) || 0,
                s: Number(state.rewards.stars) || 0,
                u: Array.isArray(state.rewards.unlockedCosmics) ? state.rewards.unlockedCosmics : (Array.isArray(state.rewards.unlocked) ? state.rewards.unlocked : ['title_aspirant', 'accent_blue']),
                ct: Array.isArray(state.rewards.claimedTrophies) ? state.rewards.claimedTrophies : [],
                stk: Array.isArray(state.rewards.unlockedStickers) ? state.rewards.unlockedStickers : [],
                eqs: state.rewards.equippedSticker || '',
                eq: state.rewards.equipped || { title: 'Aspirant', themeAccent: 'accent_blue' },
                pw: state.rewards.powers || {},
                act: Array.isArray(state.rewards.todayActivity) ? state.rewards.todayActivity.slice(0, 10) : [],
                pen: Array.isArray(state.rewards.penalties) ? state.rewards.penalties.slice(0, 5) : []
            } : undefined
        };
    }

    function extractRewardsOnlyPayload(state) {
        return {
            v: 2,
            type: 'rewards_only',
            t: Date.now(),
            st: Number(state.streak) || 0,
            c: Number(state.rewards?.coins) || 0,
            p: Number(state.rewards?.points) || 0,
            s: Number(state.rewards?.stars) || 0,
            u: Array.isArray(state.rewards?.unlockedCosmics) ? state.rewards.unlockedCosmics : (Array.isArray(state.rewards?.unlocked) ? state.rewards.unlocked : ['title_aspirant', 'accent_blue']),
            ct: Array.isArray(state.rewards?.claimedTrophies) ? state.rewards.claimedTrophies : [],
            stk: Array.isArray(state.rewards?.unlockedStickers) ? state.rewards.unlockedStickers : [],
            eqs: state.rewards?.equippedSticker || '',
            eq: state.rewards?.equipped || { title: 'Aspirant', themeAccent: 'accent_blue' },
            pw: state.rewards?.powers || {},
            act: Array.isArray(state.rewards?.todayActivity) ? state.rewards.todayActivity.slice(0, 10) : [],
            pen: Array.isArray(state.rewards?.penalties) ? state.rewards.penalties.slice(0, 5) : []
        };
    }

    function expandCompactPayload(raw) {
        if (!raw || typeof raw !== 'object') return raw;

        if (raw.v === 2 && raw.type === 'rewards_only') {
            return {
                _isRewardsOnlySync: true,
                streak: Number(raw.st) || 0,
                rewards: {
                    coins: Number(raw.c) || 0,
                    points: Number(raw.p) || 0,
                    stars: Number(raw.s) || 0,
                    unlockedCosmics: Array.isArray(raw.u) ? raw.u : ['title_aspirant', 'accent_blue'],
                    unlocked: Array.isArray(raw.u) ? raw.u : ['title_aspirant', 'accent_blue'],
                    claimedTrophies: Array.isArray(raw.ct) ? raw.ct : [],
                    unlockedStickers: Array.isArray(raw.stk) ? raw.stk : [],
                    equippedSticker: raw.eqs || '',
                    equipped: raw.eq || { title: 'Aspirant', themeAccent: 'accent_blue' },
                    powers: raw.pw || {},
                    todayActivity: Array.isArray(raw.act) ? raw.act : [],
                    penalties: Array.isArray(raw.pen) ? raw.pen : []
                }
            };
        }

        if (raw.v === 1) {
            const expandedSyllabus = {};
            // Initialize from SYLLABUS_DATA if present
            if (typeof SYLLABUS_DATA !== 'undefined' && Array.isArray(SYLLABUS_DATA)) {
                SYLLABUS_DATA.forEach(topic => {
                    (topic.subtopics || []).forEach(sub => {
                        expandedSyllabus[sub.id] = { learned: false, practiced: false, mastered: false };
                    });
                });
            }

            if (raw.sp && typeof raw.sp === 'object') {
                Object.entries(raw.sp).forEach(([id, val]) => {
                    if (typeof val === 'number') {
                        expandedSyllabus[id] = {
                            learned: val >= 1,
                            practiced: val >= 2,
                            mastered: val >= 3
                        };
                    } else if (typeof val === 'object' && val !== null) {
                        expandedSyllabus[id] = {
                            learned: Boolean(val.learned),
                            practiced: Boolean(val.practiced),
                            mastered: Boolean(val.mastered)
                        };
                    }
                });
            }

            return {
                syllabusProgress: expandedSyllabus,
                mocks: Array.isArray(raw.m) ? raw.m : [],
                notes: Array.isArray(raw.n) ? raw.n : [],
                weakAlerts: raw.w && typeof raw.w === 'object' ? raw.w : {},
                srsRecords: raw.srs && typeof raw.srs === 'object' ? raw.srs : {},
                currentDay: Number(raw.cd) || 1,
                dayCounter: Number(raw.dc) || Number(raw.cd) || 1,
                examDate: raw.ed || '2026-08-15',
                examName: raw.en || 'Conquest',
                examTier: Number(raw.et) || 1,
                streak: Number(raw.st) || 1,
                lastActiveDate: raw.la || '',
                dailyRituals: raw.dr && typeof raw.dr === 'object' ? raw.dr : { drill: false, vocab: false, ca: false, computer: false },
                theme: raw.th || 'dark',
                mobileNavHand: raw.mh || 'center',
                speechEnabled: raw.spk !== false,
                toastEnabled: raw.tst !== false,
                soundEnabled: raw.snd !== undefined ? (raw.snd !== false) : true,
                focusModeActive: Boolean(raw.foc),
                rewards: raw.rew ? {
                    coins: Number(raw.rew.c) || 0,
                    points: Number(raw.rew.p) || 0,
                    stars: Number(raw.rew.s) || 0,
                    unlockedCosmics: Array.isArray(raw.rew.u) ? raw.rew.u : ['title_aspirant', 'accent_blue'],
                    unlocked: Array.isArray(raw.rew.u) ? raw.rew.u : ['title_aspirant', 'accent_blue'],
                    claimedTrophies: Array.isArray(raw.rew.ct) ? raw.rew.ct : [],
                    unlockedStickers: Array.isArray(raw.rew.stk) ? raw.rew.stk : [],
                    equippedSticker: raw.rew.eqs || '',
                    equipped: raw.rew.eq || { title: 'Aspirant', themeAccent: 'accent_blue' },
                    powers: raw.rew.pw || {},
                    todayActivity: Array.isArray(raw.rew.act) ? raw.rew.act : [],
                    penalties: Array.isArray(raw.rew.pen) ? raw.rew.pen : []
                } : {
                    coins: 0,
                    points: 0,
                    stars: 0,
                    unlockedCosmics: ['title_aspirant', 'accent_blue'],
                    unlocked: ['title_aspirant', 'accent_blue'],
                    claimedTrophies: [],
                    unlockedStickers: [],
                    equippedSticker: '',
                    equipped: { title: 'Aspirant', themeAccent: 'accent_blue' },
                    powers: {},
                    todayActivity: [],
                    penalties: []
                }
            };
        }
        return raw;
    }

    class QrSyncModal {
        constructor(options = {}) {
            this.getState = options.getState || (() => ({}));
            this.onApplyState = options.onApplyState || (() => {});
            this.onToast = options.onToast || ((msg) => alert(msg));
            this.isOpen = false;
            this.isFullscreen = false;
            this.activeTab = 'scan';
            this.videoStream = null;
            this.animFrameId = null;
            this.currentPayload = '';
            this.scannedState = null;
            this.syncMode = 'full'; // 'full' or 'rewards'

            this._ensureDependencies();
            this._buildDOM();
        }

        _ensureDependencies() {
            // qrcode-generator CDN
            if (typeof window.qrcode === 'undefined' && !document.getElementById('script-qrcode-gen-cdn')) {
                const s = document.createElement('script');
                s.id = 'script-qrcode-gen-cdn';
                s.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';
                document.head.appendChild(s);
            }
            // jsQR CDN for camera decoding
            if (typeof window.jsQR === 'undefined' && !document.getElementById('script-jsqr-cdn')) {
                const s = document.createElement('script');
                s.id = 'script-jsqr-cdn';
                s.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
                document.head.appendChild(s);
            }
        }

        async _compress(str) {
            const b64 = 'B64:' + btoa(unescape(encodeURIComponent(str)));
            if (b64.length <= 1800) {
                return b64;
            }

            if ('CompressionStream' in window) {
                try {
                    const stream = new Blob([str]).stream().pipeThrough(new CompressionStream('gzip'));
                    const response = new Response(stream);
                    const blob = await response.blob();
                    const buffer = await blob.arrayBuffer();
                    const bytes = new Uint8Array(buffer);
                    let binary = '';
                    for (let i = 0; i < bytes.byteLength; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    return 'GZ:' + btoa(binary);
                } catch (e) {
                    console.warn('Gzip stream failed, falling back to base64', e);
                }
            }
            return b64;
        }

        async _decompress(payload) {
            if (!payload || typeof payload !== 'string') return null;
            const trimmed = payload.trim();
            if (trimmed.startsWith('GZ:')) {
                if ('DecompressionStream' in window) {
                    try {
                        const base64 = trimmed.slice(3);
                        const binary = atob(base64);
                        const bytes = new Uint8Array(binary.length);
                        for (let i = 0; i < binary.length; i++) {
                            bytes[i] = binary.charCodeAt(i);
                        }
                        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
                        const response = new Response(stream);
                        return await response.text();
                    } catch (e) {
                        console.error('GZ decompress error:', e);
                        throw new Error('Could not decompress gzip sync data');
                    }
                } else {
                    throw new Error('Browser lacks Gzip support for this code. Paste plain text code instead.');
                }
            } else if (trimmed.startsWith('B64:')) {
                try {
                    return decodeURIComponent(escape(atob(trimmed.slice(4))));
                } catch (e) {
                    return atob(trimmed.slice(4));
                }
            } else if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
                return trimmed;
            }
            try {
                return decodeURIComponent(escape(atob(trimmed)));
            } catch (e) {
                return trimmed;
            }
        }

        _buildDOM() {
            this.overlay = document.createElement('div');
            this.overlay.id = 'modal-qr-sync';
            this.overlay.className = 'fixed inset-0 z-[999999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 opacity-0 pointer-events-none transition-all duration-200 hidden select-none';

            this.card = document.createElement('div');
            this.card.className = 'bg-slate-900 text-gray-100 border border-blue-500/30 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto scrollbar-none transform scale-95 transition-all duration-300';

            this.card.innerHTML = `
                <!-- Modal Top Header -->
                <div id="qr-modal-header" class="flex items-center justify-between border-b border-white/10 pb-3 transition-all duration-200">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center text-xs shadow-inner">
                            <i class="fa-solid fa-qrcode"></i>
                        </div>
                        <div>
                            <h3 class="font-heading font-black text-sm text-white uppercase tracking-wider">Conquest Sync</h3>
                            <p class="text-[10px] text-gray-400">P2P Encrypted Full System Sync</p>
                        </div>
                    </div>

                    <!-- Top Action Controls -->
                    <div class="flex items-center gap-1.5">
                        <button type="button" id="btn-qr-fullscreen" class="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center justify-center text-xs transition cursor-pointer" title="Toggle Fullscreen (F)">
                            <i class="fa-solid fa-expand"></i>
                        </button>
                        <button type="button" id="btn-qr-close" class="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center justify-center text-xs transition cursor-pointer" title="Close (Esc)">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>

                <!-- Tab Switcher Pill (Always accent blue bg-blue-600) -->
                <div id="qr-tab-switcher-wrap" class="flex items-center gap-1 p-1 bg-slate-950/80 border border-white/10 rounded-2xl shadow-inner max-w-xs mx-auto w-full transition-all duration-200">
                    <button type="button" id="tab-qr-scan" class="flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition duration-200 text-white bg-blue-600 shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-camera text-xs"></i>
                        <span>Scan / Paste</span>
                    </button>
                    <button type="button" id="tab-qr-show" class="flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition duration-200 text-gray-400 hover:text-white bg-transparent flex items-center justify-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-qrcode text-xs"></i>
                        <span>Show My QR</span>
                    </button>
                </div>

                <!-- Main Center Stage Viewport (Occupies 70-80% in Fullscreen) -->
                <div id="qr-main-viewport" class="flex-1 flex flex-col items-center justify-center min-h-0 w-full transition-all duration-300">
                    <!-- TAB 1: SCAN QR PANEL -->
                    <div id="panel-qr-scan" class="space-y-3 w-full flex flex-col items-center justify-center">
                        <div class="relative bg-black rounded-2xl overflow-hidden aspect-square max-w-[260px] w-full mx-auto border border-blue-500/30 shadow-2xl flex items-center justify-center transition-all duration-300">
                            <video id="qr-scanner-video" playsinline class="w-full h-full object-cover"></video>
                            <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
                                <div class="w-48 h-48 sm:w-56 sm:h-56 border-2 border-dashed border-blue-400/80 rounded-3xl shadow-[0_0_35px_rgba(37,99,235,0.4)] animate-pulse"></div>
                            </div>
                            <div id="qr-camera-prompt" class="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-2 p-4 text-center">
                                <i class="fa-solid fa-video text-2xl text-blue-400"></i>
                                <span id="qr-camera-status" class="text-xs font-bold text-gray-300">Point camera at QR code</span>
                                <button type="button" id="btn-start-camera" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-lg shadow-blue-500/25 transition cursor-pointer">Start Camera</button>
                            </div>
                        </div>

                        <div class="w-full max-w-[280px] flex items-center justify-between gap-2">
                            <label class="flex-1 px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-blue-500/30 text-xs font-bold text-gray-300 hover:text-white shadow-inner transition flex items-center justify-center gap-1.5 cursor-pointer text-center">
                                <i class="fa-solid fa-file-image text-blue-400"></i>
                                <span>Upload QR Image</span>
                                <input type="file" id="input-qr-file" accept="image/*" class="hidden">
                            </label>
                        </div>

                        <!-- Direct Code Paste Fallback -->
                        <div class="w-full max-w-[320px] pt-2 border-t border-white/10 space-y-1.5">
                            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block text-center">Or Paste Sync Code Manually</label>
                            <div class="flex gap-2">
                                <input type="text" id="input-manual-code" placeholder="Paste GZ: or B64: code here..." class="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 font-mono">
                                <button type="button" id="btn-apply-manual-code" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl transition shadow cursor-pointer">
                                    Load
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- TAB 2: SHOW QR PANEL -->
                    <div id="panel-qr-show" class="hidden space-y-3 w-full flex flex-col items-center justify-center">
                        <div class="bg-white p-3 rounded-2xl max-w-[260px] w-full mx-auto shadow-2xl flex items-center justify-center aspect-square transition-all duration-300" id="qr-code-canvas-container">
                            <span class="text-xs text-gray-500 font-mono">Generating QR...</span>
                        </div>
                        <p id="qr-sync-mode-desc" class="text-center text-[10px] text-gray-400 font-medium max-w-xs">Scan with any mobile device to replicate entire progress and rewards instantly.</p>
                        
                        <!-- Floating Action Toolbar Dock (Responsive Pill) -->
                        <div id="qr-actions-toolbar" class="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center gap-2 max-w-full transition-all duration-300">
                            <button type="button" id="btn-copy-sync-code" class="px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-blue-500/30 text-xs font-bold text-gray-300 hover:text-white shadow-inner transition flex items-center justify-center gap-1.5 cursor-pointer" title="Copy raw sync code string">
                                <i class="fa-solid fa-copy text-blue-400"></i>
                                <span>Copy Code</span>
                            </button>
                            <button type="button" id="btn-copy-qr-image" class="px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-blue-500/30 text-xs font-bold text-gray-300 hover:text-white shadow-inner transition flex items-center justify-center gap-1.5 cursor-pointer" title="Copy clean QR image to clipboard">
                                <i class="fa-solid fa-image text-cyan-300"></i>
                                <span>Copy Image</span>
                            </button>
                            <button type="button" id="btn-download-qr" class="px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-blue-500/30 text-xs font-bold text-gray-300 hover:text-white shadow-inner transition flex items-center justify-center gap-1.5 cursor-pointer" title="Download QR as PNG image file">
                                <i class="fa-solid fa-download text-emerald-400"></i>
                                <span>Save PNG</span>
                            </button>
                            <button type="button" id="btn-share-qr" class="px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-blue-500/30 text-xs font-bold text-gray-300 hover:text-white shadow-inner transition flex items-center justify-center gap-1.5 cursor-pointer" title="Share via System Share API">
                                <i class="fa-solid fa-share-nodes text-indigo-400"></i>
                                <span>Share</span>
                            </button>
                            <button type="button" id="btn-refresh-qr" class="px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-blue-500/30 text-xs font-bold text-gray-300 hover:text-white shadow-inner transition flex items-center justify-center gap-1.5 cursor-pointer" title="Regenerate QR with latest application state">
                                <i class="fa-solid fa-rotate text-amber-400"></i>
                                <span>Refresh</span>
                            </button>
                            <button type="button" id="btn-qr-exit-dock" class="hidden px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-300 hover:text-rose-200 transition items-center justify-center gap-1.5 cursor-pointer" title="Exit QR Workspace">
                                <i class="fa-solid fa-door-open text-rose-400"></i>
                                <span>Exit</span>
                            </button>
                        </div>
                    </div>
                </div>


                <!-- CONFIRMATION SUMMARY CARD -->
                <div id="panel-qr-confirm" class="hidden bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
                    <div class="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase">
                        <i class="fa-solid fa-circle-check"></i>
                        <span>Sync Payload Verified</span>
                    </div>
                    <div id="qr-confirm-stats" class="grid grid-cols-2 gap-2 text-xs font-mono"></div>
                    <p class="text-[10px] text-amber-300 font-medium">⚠️ Merging will synchronize all data with the incoming payload.</p>
                    <div class="flex gap-2 pt-1">
                        <button type="button" id="btn-qr-apply" class="flex-[2] py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase shadow-lg shadow-emerald-500/20 transition cursor-pointer">
                            Confirm & Sync
                        </button>
                        <button type="button" id="btn-qr-reject" class="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold uppercase transition cursor-pointer">
                            Cancel
                        </button>
                    </div>
                </div>
            `;

            this.overlay.appendChild(this.card);
            document.body.appendChild(this.overlay);

            this._bindEvents();
        }

        _bindEvents() {
            this.card.querySelector('#btn-qr-close').onclick = () => this.close();
            const btnFs = this.card.querySelector('#btn-qr-fullscreen');
            if (btnFs) {
                btnFs.onclick = () => this.toggleFullscreen();
            }

            this.overlay.onclick = (e) => {
                if (e.target === this.overlay) this.close();
            };

            // Keyboard navigation: Escape exits fullscreen then closes, F toggles fullscreen, X closes
            this._keyHandler = (e) => {
                if (!this.isOpen) return;
                const tag = document.activeElement ? document.activeElement.tagName : '';
                const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || (document.activeElement && document.activeElement.isContentEditable);

                if (e.key === 'Escape') {
                    if (this.isFullscreen) {
                        this.toggleFullscreen(false);
                    } else {
                        this.close();
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                if (!isInput && (e.key === 'f' || e.key === 'F')) {
                    this.toggleFullscreen();
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                if (!isInput && (e.key === 'x' || e.key === 'X')) {
                    this.close();
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
            };
            window.addEventListener('keydown', this._keyHandler, true);

            document.addEventListener('fullscreenchange', () => {
                if (!document.fullscreenElement && this.isFullscreen) {
                    this.toggleFullscreen(false);
                }
            });

            const tabScan = this.card.querySelector('#tab-qr-scan');
            const tabShow = this.card.querySelector('#tab-qr-show');

            tabScan.onclick = () => this.setTab('scan');
            tabShow.onclick = () => this.setTab('show');

            this.card.querySelector('#btn-start-camera').onclick = () => this._startCamera();

            // Image file upload scanner
            const fileInput = this.card.querySelector('#input-qr-file');
            fileInput.onchange = (e) => this._handleImageUpload(e);

            // Manual paste code
            this.card.querySelector('#btn-apply-manual-code').onclick = () => {
                const code = this.card.querySelector('#input-manual-code').value.trim();
                if (code) {
                    this._onCodeDetected(code);
                } else {
                    this.onToast('Please paste a sync code first', 'warning');
                }
            };

            // Copy sync code
            this.card.querySelector('#btn-copy-sync-code').onclick = async () => {
                if (this.currentPayload) {
                    if (typeof window.playSound === 'function') window.playSound('success.soft');
                    try {
                        await navigator.clipboard.writeText(this.currentPayload);
                        this.onToast('Sync code copied to clipboard!', 'success');
                    } catch (e) {
                        const ta = document.createElement('textarea');
                        ta.value = this.currentPayload;
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand('copy');
                        document.body.removeChild(ta);
                        this.onToast('Sync code copied to clipboard!', 'success');
                    }
                }
            };

            // Copy QR image to clipboard (or fallback download)
            const btnCopyQrImage = this.card.querySelector('#btn-copy-qr-image');
            if (btnCopyQrImage) {
                btnCopyQrImage.onclick = () => {
                    if (typeof window.playSound === 'function') window.playSound('success.soft');
                    this._copyQrImageToClipboard();
                };
            }

            // Download QR as PNG
            const btnDownloadQr = this.card.querySelector('#btn-download-qr');
            if (btnDownloadQr) {
                btnDownloadQr.onclick = () => {
                    if (typeof window.playSound === 'function') window.playSound('reward');
                    this._downloadQrImage();
                };
            }

            // Share QR code
            const btnShareQr = this.card.querySelector('#btn-share-qr');
            if (btnShareQr) {
                btnShareQr.onclick = () => {
                    if (typeof window.playSound === 'function') window.playSound('checkbox');
                    this._shareQr();
                };
            }

            // Refresh QR payload
            const btnRefreshQr = this.card.querySelector('#btn-refresh-qr');
            if (btnRefreshQr) {
                btnRefreshQr.onclick = () => {
                    if (typeof window.playSound === 'function') window.playSound('checkbox');
                    this._refreshQr();
                };
            }

            // Confirm Sync
            this.card.querySelector('#btn-qr-apply').onclick = () => {
                if (this.scannedState) {
                    if (typeof window.playSound === 'function') window.playSound('success.strong');
                    this.onApplyState(this.scannedState);
                    this.onToast('Device synchronization complete!', 'success');
                    this.close();
                }
            };

            // Reject Sync
            this.card.querySelector('#btn-qr-reject').onclick = () => {
                this.scannedState = null;
                this.card.querySelector('#panel-qr-confirm').classList.add('hidden');
                this.card.querySelector('#panel-qr-scan').classList.remove('hidden');
                this._startCamera();
            };

            // Exit dock button in fullscreen
            const exitDockBtn = this.card.querySelector('#btn-qr-exit-dock');
            if (exitDockBtn) {
                exitDockBtn.onclick = () => {
                    if (typeof window.playSound === 'function') window.playSound('checkbox');
                    this.close();
                };
            }
        }

        toggleFullscreen(force) {
            this.isFullscreen = typeof force === 'boolean' ? force : !this.isFullscreen;
            const fsBtn = this.card.querySelector('#btn-qr-fullscreen');
            const qrContainer = this.card.querySelector('#qr-code-canvas-container');
            const scanContainer = this.card.querySelector('#panel-qr-scan > div:first-child');
            const exitDockBtn = this.card.querySelector('#btn-qr-exit-dock');
            const actionsToolbar = this.card.querySelector('#qr-actions-toolbar');

            if (this.isFullscreen) {
                this.overlay.classList.add('!p-0');
                this.card.classList.add('!max-w-none', '!w-screen', '!h-screen', '!max-h-none', '!rounded-none', '!border-0', 'sm:!p-6', '!p-4', 'flex', 'flex-col', 'justify-between');
                if (fsBtn) {
                    fsBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
                    fsBtn.title = 'Exit Fullscreen (F / Esc)';
                }
                if (qrContainer) {
                    qrContainer.classList.remove('max-w-[260px]');
                    qrContainer.classList.add('!max-w-none', '!w-[min(68vh,82vw,520px)]', '!h-[min(68vh,82vw,520px)]', '!p-4', 'sm:!p-6', 'shadow-[0_0_60px_rgba(37,99,235,0.3)]');
                }
                if (scanContainer) {
                    scanContainer.classList.remove('max-w-[260px]');
                    scanContainer.classList.add('!max-w-none', '!w-[min(66vh,82vw,480px)]', '!h-[min(66vh,82vw,480px)]', 'shadow-[0_0_60px_rgba(37,99,235,0.3)]');
                }
                if (exitDockBtn) {
                    exitDockBtn.classList.remove('hidden');
                    exitDockBtn.classList.add('flex');
                }
                if (actionsToolbar) {
                    actionsToolbar.classList.add('bg-slate-950/90', 'backdrop-blur-xl', 'border', 'border-white/10', 'rounded-full', 'px-3', 'py-1.5', 'shadow-2xl', 'max-w-fit', 'mx-auto');
                }
                try {
                    if (document.fullscreenEnabled && !document.fullscreenElement && this.overlay.requestFullscreen) {
                        this.overlay.requestFullscreen().catch(() => {});
                    }
                } catch (e) {}
            } else {
                this.overlay.classList.remove('!p-0');
                this.card.classList.remove('!max-w-none', '!w-screen', '!h-screen', '!max-h-none', '!rounded-none', '!border-0', 'sm:!p-6', '!p-4', 'flex', 'flex-col', 'justify-between');
                if (fsBtn) {
                    fsBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
                    fsBtn.title = 'Toggle Fullscreen (F)';
                }
                if (qrContainer) {
                    qrContainer.classList.remove('!max-w-none', '!w-[min(68vh,82vw,520px)]', '!h-[min(68vh,82vw,520px)]', '!p-4', 'sm:!p-6', 'shadow-[0_0_60px_rgba(37,99,235,0.3)]');
                    qrContainer.classList.add('max-w-[260px]');
                }
                if (scanContainer) {
                    scanContainer.classList.remove('!max-w-none', '!w-[min(66vh,82vw,480px)]', '!h-[min(66vh,82vw,480px)]', 'shadow-[0_0_60px_rgba(37,99,235,0.3)]');
                    scanContainer.classList.add('max-w-[260px]');
                }
                if (exitDockBtn) {
                    exitDockBtn.classList.add('hidden');
                    exitDockBtn.classList.remove('flex');
                }
                if (actionsToolbar) {
                    actionsToolbar.classList.remove('bg-slate-950/90', 'backdrop-blur-xl', 'border', 'border-white/10', 'rounded-full', 'px-3', 'py-1.5', 'shadow-2xl', 'max-w-fit', 'mx-auto');
                }
                try {
                    if (document.fullscreenElement && document.exitFullscreen) {
                        document.exitFullscreen().catch(() => {});
                    }
                } catch (e) {}
            }
        }

        setTab(tab) {
            this.activeTab = tab;
            if (typeof window.playSound === 'function') window.playSound('checkbox');
            const tabScan = this.card.querySelector('#tab-qr-scan');
            const tabShow = this.card.querySelector('#tab-qr-show');
            const panelScan = this.card.querySelector('#panel-qr-scan');
            const panelShow = this.card.querySelector('#panel-qr-show');

            const activeClass = 'flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition duration-200 text-white bg-blue-600 shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer';
            const inactiveClass = 'flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition duration-200 text-gray-400 hover:text-white bg-transparent flex items-center justify-center gap-1.5 cursor-pointer';

            if (tab === 'scan') {
                tabScan.className = activeClass;
                tabShow.className = inactiveClass;
                panelScan.classList.remove('hidden');
                panelShow.classList.add('hidden');
                this._startCamera();
            } else {
                tabShow.className = activeClass;
                tabScan.className = inactiveClass;
                panelShow.classList.remove('hidden');
                panelScan.classList.add('hidden');
                this._stopCamera();
                this._renderQR();
            }
        }

        async _renderQR() {
            const container = this.card.querySelector('#qr-code-canvas-container');
            container.innerHTML = '<span class="text-xs text-gray-500 font-mono">Generating QR...</span>';

            const rawState = this.getState();
            const compactObj = extractCompactPayload(rawState);
            const json = JSON.stringify(compactObj);
            const payload = await this._compress(json);
            this.currentPayload = payload;

            container.innerHTML = '';

            // 1. Try qrcode-generator (supports up to version 40)
            if (typeof window.qrcode === 'function') {
                try {
                    const qr = window.qrcode(0, 'L');
                    qr.addData(payload);
                    qr.make();
                    container.innerHTML = qr.createImgTag(5, 10);
                    const img = container.querySelector('img');
                    if (img) {
                        img.className = 'w-full h-full object-contain rounded-xl';
                    }
                    return;
                } catch (e) {
                    console.warn('qrcode-generator failed, trying fallback', e);
                }
            }

            // 2. Try QRCode (davidshimjs qrcode.min.js)
            if (typeof window.QRCode === 'function') {
                try {
                    new window.QRCode(container, {
                        text: payload,
                        width: 240,
                        height: 240,
                        colorDark: '#0f172a',
                        colorLight: '#ffffff',
                        correctLevel: window.QRCode.CorrectLevel ? window.QRCode.CorrectLevel.L : 1
                    });
                    return;
                } catch (e) {
                    console.warn('QRCode fallback failed', e);
                }
            }

            // 3. Fallback: Quick Google Chart API QR or manual code box
            const encoded = encodeURIComponent(payload);
            if (encoded.length < 2000) {
                const img = document.createElement('img');
                img.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encoded}`;
                img.className = 'w-full h-full object-contain rounded-xl';
                container.appendChild(img);
            } else {
                container.innerHTML = `<textarea readonly class="w-full h-44 text-[9px] font-mono bg-slate-100 text-slate-900 p-2 rounded">${payload}</textarea>`;
            }
        }

        async _copyQrImageToClipboard() {
            const container = this.card.querySelector('#qr-code-canvas-container');
            if (!container) return;

            const img = container.querySelector('img');
            const canvas = container.querySelector('canvas');

            try {
                let blob = null;
                if (canvas) {
                    blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                } else if (img) {
                    const offscreen = document.createElement('canvas');
                    const ctx = offscreen.getContext('2d');
                    if (!img.complete) {
                        await new Promise((res, rej) => {
                            img.onload = res;
                            img.onerror = rej;
                        });
                    }
                    const w = img.naturalWidth || img.width || 280;
                    const h = img.naturalHeight || img.height || 280;
                    offscreen.width = w;
                    offscreen.height = h;
                    // Pure clean background
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, w, h);
                    ctx.drawImage(img, 0, 0, w, h);
                    blob = await new Promise(resolve => offscreen.toBlob(resolve, 'image/png'));
                }

                if (!blob) {
                    this.onToast('Generating QR image, please try again in a moment', 'warning');
                    return;
                }

                // 1. Try modern async Clipboard API
                if (navigator.clipboard && window.ClipboardItem) {
                    try {
                        const item = new ClipboardItem({ 'image/png': blob });
                        await navigator.clipboard.write([item]);
                        this.onToast('QR image copied to clipboard!', 'success');
                        return;
                    } catch (clipErr) {
                        console.warn('Direct clipboard.write image failed, falling back to download:', clipErr);
                    }
                }

                // 2. Fallback: PNG file download
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cgl-conquest-sync-qr.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                this.onToast('QR image saved to downloads!', 'success');
            } catch (err) {
                console.error('Failed to copy/download QR image', err);
                this.onToast('Could not copy QR image', 'error');
            }
        }

        async _downloadQrImage() {
            const container = this.card.querySelector('#qr-code-canvas-container');
            if (!container) return;
            const img = container.querySelector('img');
            const canvas = container.querySelector('canvas');
            try {
                let blob = null;
                if (canvas) {
                    blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                } else if (img) {
                    const offscreen = document.createElement('canvas');
                    const ctx = offscreen.getContext('2d');
                    if (!img.complete) {
                        await new Promise((res, rej) => {
                            img.onload = res;
                            img.onerror = rej;
                        });
                    }
                    const w = img.naturalWidth || img.width || 320;
                    const h = img.naturalHeight || img.height || 320;
                    offscreen.width = w;
                    offscreen.height = h;
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, w, h);
                    ctx.drawImage(img, 0, 0, w, h);
                    blob = await new Promise(resolve => offscreen.toBlob(resolve, 'image/png'));
                }
                if (!blob) {
                    this.onToast('Generating QR image, please wait...', 'warning');
                    return;
                }
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `cgl-conquest-sync-qr-${new Date().toISOString().slice(0, 10)}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                this.onToast('QR image saved to downloads!', 'success');
            } catch (err) {
                console.error('Download QR failed', err);
                this.onToast('Failed to download QR image', 'error');
            }
        }

        async _shareQr() {
            if (!this.currentPayload) {
                this.onToast('Generating sync payload...', 'warning');
                return;
            }
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'CGL Conquest Sync Data',
                        text: this.currentPayload
                    });
                    this.onToast('Sync payload shared!', 'success');
                    return;
                } catch (e) {
                    if (e.name === 'AbortError') return;
                }
            }
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(this.currentPayload);
                this.onToast('Share unavailable. Sync code copied to clipboard!', 'info');
            } catch (e) {
                this.onToast('Please copy code manually', 'warning');
            }
        }

        async _refreshQr() {
            this.onToast('Refreshing QR sync payload...', 'info');
            await this._renderQR();
            this.onToast('QR code updated with latest state!', 'success');
        }

        async _startCamera() {
            const video = this.card.querySelector('#qr-scanner-video');
            const prompt = this.card.querySelector('#qr-camera-prompt');
            const statusLabel = this.card.querySelector('#qr-camera-status');

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                prompt.classList.remove('hidden');
                if (statusLabel) statusLabel.textContent = 'Camera requires HTTPS/Localhost. Paste code below.';
                return;
            }

            try {
                this.videoStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
                video.srcObject = this.videoStream;
                await video.play();
                prompt.classList.add('hidden');
                this._scanVideoLoop();
            } catch (e) {
                prompt.classList.remove('hidden');
                if (statusLabel) statusLabel.textContent = 'Camera permission denied. Use paste or image below.';
            }
        }

        _stopCamera() {
            if (this.videoStream) {
                this.videoStream.getTracks().forEach(track => track.stop());
                this.videoStream = null;
            }
            if (this.animFrameId) {
                cancelAnimationFrame(this.animFrameId);
                this.animFrameId = null;
            }
        }

        async _scanVideoLoop() {
            const video = this.card.querySelector('#qr-scanner-video');
            if (!this.isOpen || this.activeTab !== 'scan' || video.readyState < video.HAVE_CURRENT_DATA) {
                if (this.isOpen && this.activeTab === 'scan') {
                    this.animFrameId = requestAnimationFrame(() => this._scanVideoLoop());
                }
                return;
            }

            // 1. Try native BarcodeDetector
            if ('BarcodeDetector' in window) {
                try {
                    const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
                    const barcodes = await detector.detect(video);
                    if (barcodes.length > 0) {
                        this._onCodeDetected(barcodes[0].rawValue);
                        return;
                    }
                } catch (e) {}
            }

            // 2. Fallback to jsQR
            if (window.jsQR) {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = window.jsQR(imgData.data, imgData.width, imgData.height);
                if (code && code.data) {
                    this._onCodeDetected(code.data);
                    return;
                }
            }

            this.animFrameId = requestAnimationFrame(() => this._scanVideoLoop());
        }

        async _handleImageUpload(e) {
            const file = e.target.files[0];
            if (!file) return;

            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                if ('BarcodeDetector' in window) {
                    try {
                        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
                        const barcodes = await detector.detect(canvas);
                        if (barcodes.length > 0) {
                            this._onCodeDetected(barcodes[0].rawValue);
                            return;
                        }
                    } catch (err) {}
                }

                if (window.jsQR) {
                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = window.jsQR(imgData.data, imgData.width, imgData.height);
                    if (code && code.data) {
                        this._onCodeDetected(code.data);
                        return;
                    }
                }

                this.onToast('Could not find a valid QR code in this image. Try pasting the code manually.', 'error');
            };
        }

        async _onCodeDetected(rawString) {
            this._stopCamera();
            try {
                const json = await this._decompress(rawString);
                const parsed = JSON.parse(json);
                const expanded = expandCompactPayload(parsed);

                if (!expanded || (typeof expanded !== 'object')) {
                    throw new Error('Invalid state structure');
                }

                this.scannedState = expanded;
                this._showConfirmation(expanded);
            } catch (e) {
                console.error('Failed to parse QR sync code', e);
                this.onToast('Invalid or corrupted QR sync code', 'error');
                this._startCamera();
            }
        }

        _showConfirmation(state) {
            this.card.querySelector('#panel-qr-scan').classList.add('hidden');
            this.card.querySelector('#panel-qr-show').classList.add('hidden');
            const confirmPanel = this.card.querySelector('#panel-qr-confirm');
            confirmPanel.classList.remove('hidden');

            const statsContainer = this.card.querySelector('#qr-confirm-stats');
            const warnText = confirmPanel.querySelector('p.text-amber-300');

            if (state._isRewardsOnlySync) {
                const rew = state.rewards || {};
                statsContainer.innerHTML = `
                    <div class="p-2 bg-black/40 rounded-xl border border-white/5">
                        <span class="text-[9px] text-gray-400 uppercase block">Mode</span>
                        <span class="font-extrabold text-blue-400">Rewards Modular Sync</span>
                    </div>
                    <div class="p-2 bg-black/40 rounded-xl border border-white/5">
                        <span class="text-[9px] text-gray-400 uppercase block">Coins & Stars</span>
                        <span class="font-extrabold text-amber-400">🪙 ${rew.coins || 0} • ⭐ ${rew.stars || 0}</span>
                    </div>
                    <div class="p-2 bg-black/40 rounded-xl border border-white/5">
                        <span class="text-[9px] text-gray-400 uppercase block">Trophies Claimed</span>
                        <span class="font-extrabold text-purple-400">${(rew.claimedTrophies || []).length} Trophies</span>
                    </div>
                    <div class="p-2 bg-black/40 rounded-xl border border-white/5">
                        <span class="text-[9px] text-gray-400 uppercase block">Current Streak</span>
                        <span class="font-extrabold text-rose-400">🔥 ${state.streak || 0} Days</span>
                    </div>
                `;
                if (warnText) {
                    warnText.textContent = '✨ Merging will update your Coins, Trophies, Powers & Streak while preserving your syllabus progress.';
                }
                return;
            }

            if (warnText) {
                warnText.textContent = '⚠️ Merging will synchronize all data with the incoming payload.';
            }

            const mocksCount = (state.mocks || []).length;
            const notesCount = (state.notes || state.customNotes || []).length;
            const examName = state.examName || state.targetExamName || 'Conquest';
            let masteredCount = 0;
            let activeCount = 0;
            if (state.syllabusProgress) {
                Object.values(state.syllabusProgress).forEach(f => {
                    if (f && f.mastered) masteredCount++;
                    if (f && (f.learned || f.practiced || f.mastered)) activeCount++;
                });
            }

            statsContainer.innerHTML = `
                <div class="p-2 bg-black/40 rounded-xl border border-white/5">
                    <span class="text-[9px] text-gray-400 uppercase block">Mastered Topics</span>
                    <span class="font-extrabold text-amber-400">${masteredCount} (${activeCount} active)</span>
                </div>
                <div class="p-2 bg-black/40 rounded-xl border border-white/5">
                    <span class="text-[9px] text-gray-400 uppercase block">Tests Logged</span>
                    <span class="font-extrabold text-cyan-400">${mocksCount} Tests</span>
                </div>
                <div class="p-2 bg-black/40 rounded-xl border border-white/5">
                    <span class="text-[9px] text-gray-400 uppercase block">Saved Notes</span>
                    <span class="font-extrabold text-purple-400">${notesCount} Notes</span>
                </div>
                <div class="p-2 bg-black/40 rounded-xl border border-white/5">
                    <span class="text-[9px] text-gray-400 uppercase block">Plan Day / Target</span>
                    <span class="font-extrabold text-rose-400">Day ${state.currentDay || 1} • ${examName}</span>
                </div>
            `;
        }

        open(initialTab = 'scan') {
            this.isOpen = true;
            this.overlay.classList.remove('hidden');
            void this.overlay.offsetWidth;
            this.overlay.classList.remove('opacity-0', 'pointer-events-none');
            this.card.classList.remove('scale-95');
            this.card.classList.add('scale-100');

            this.setTab(initialTab);
        }

        close() {
            if (this.isFullscreen) {
                this.toggleFullscreen(false);
            }
            this.isOpen = false;
            this._stopCamera();
            this.overlay.classList.add('opacity-0', 'pointer-events-none');
            this.card.classList.remove('scale-100');
            this.card.classList.add('scale-95');

            setTimeout(() => {
                if (!this.isOpen) {
                    this.overlay.classList.add('hidden');
                    this.card.querySelector('#panel-qr-confirm').classList.add('hidden');
                }
            }, 200);
        }
    }

    if (typeof window !== 'undefined') {
        window.QrSyncModal = QrSyncModal;
        window.extractCompactPayload = extractCompactPayload;
        window.extractRewardsOnlyPayload = extractRewardsOnlyPayload;
        window.expandCompactPayload = expandCompactPayload;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { QrSyncModal, extractCompactPayload, extractRewardsOnlyPayload, expandCompactPayload };
    }
})();
