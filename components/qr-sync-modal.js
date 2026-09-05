/**
 * QrSyncModal Component
 * Universal two-way peer device synchronization via high-density QR code.
 * Works seamlessly across mobile & laptop, offline/file:// protocol and HTTPS.
 */

(function () {
    // Compact serialization dictionary for ultra-dense QR codes
    function extractCompactPayload(state) {
        return {
            v: 1, // sync protocol version
            t: Date.now(),
            sp: state.syllabusProgress || {},
            m: state.mocks || [],
            n: state.notes || state.customNotes || [],
            srs: state.srsRecords || {},
            cd: state.currentDay || 1,
            ed: state.examDate || '',
            en: state.examName || '',
            et: state.examTier || 1,
            st: state.streak || 1,
            dr: state.dailyRituals || {},
            th: state.theme || 'dark'
        };
    }

    function expandCompactPayload(raw) {
        if (raw && raw.v === 1) {
            return {
                syllabusProgress: raw.sp || {},
                mocks: raw.m || [],
                notes: raw.n || [],
                srsRecords: raw.srs || {},
                currentDay: raw.cd || 1,
                examDate: raw.ed || '2026-08-15',
                examName: raw.en || 'Conquest',
                examTier: raw.et || 1,
                streak: raw.st || 1,
                dailyRituals: raw.dr || {},
                theme: raw.th || 'dark'
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
            this.activeTab = 'scan';
            this.videoStream = null;
            this.animFrameId = null;
            this.currentPayload = '';
            this.scannedState = null;

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
            return 'B64:' + btoa(unescape(encodeURIComponent(str)));
        }

        async _decompress(payload) {
            if (!payload || typeof payload !== 'string') return null;
            const trimmed = payload.trim();
            if (trimmed.startsWith('GZ:') && 'DecompressionStream' in window) {
                const base64 = trimmed.slice(3);
                const binary = atob(base64);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) {
                    bytes[i] = binary.charCodeAt(i);
                }
                const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
                const response = new Response(stream);
                return await response.text();
            } else if (trimmed.startsWith('B64:')) {
                return decodeURIComponent(escape(atob(trimmed.slice(4))));
            }
            return trimmed;
        }

        _buildDOM() {
            this.overlay = document.createElement('div');
            this.overlay.id = 'modal-qr-sync';
            this.overlay.className = 'fixed inset-0 z-[999999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 opacity-0 pointer-events-none transition-all duration-200 hidden select-none';

            this.card = document.createElement('div');
            this.card.className = 'bg-slate-900 text-gray-100 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto scrollbar-none transform scale-95 transition-all duration-200';

            this.card.innerHTML = `
                <div class="flex items-center justify-between border-b border-white/10 pb-3">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xs shadow-inner">
                            <i class="fa-solid fa-qrcode"></i>
                        </div>
                        <div>
                            <h3 class="font-heading font-black text-sm text-white uppercase tracking-wider">Instant QR Device Sync</h3>
                            <p class="text-[10px] text-gray-400">Sync all data between phone & laptop instantly</p>
                        </div>
                    </div>
                    <button type="button" id="btn-qr-close" class="w-7 h-7 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 flex items-center justify-center text-xs transition cursor-pointer">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <!-- Tab Switcher -->
                <div class="flex items-center gap-1 p-1 bg-slate-950/80 border border-white/10 rounded-2xl shadow-inner">
                    <button type="button" id="tab-qr-scan" class="flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition duration-200 text-white bg-gradient-to-r from-cyan-600 to-teal-600 shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-camera text-xs"></i>
                        <span>Scan / Paste</span>
                    </button>
                    <button type="button" id="tab-qr-show" class="flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition duration-200 text-gray-400 hover:text-white bg-transparent flex items-center justify-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-qrcode text-xs"></i>
                        <span>Show My QR</span>
                    </button>
                </div>

                <!-- TAB 1: SCAN QR PANEL -->
                <div id="panel-qr-scan" class="space-y-3">
                    <div class="relative bg-black rounded-2xl overflow-hidden aspect-square max-w-[260px] mx-auto border border-cyan-500/30 shadow-inner flex items-center justify-center">
                        <video id="qr-scanner-video" playsinline class="w-full h-full object-cover"></video>
                        <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <div class="w-44 h-44 border-2 border-dashed border-cyan-400/80 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.3)] animate-pulse"></div>
                        </div>
                        <div id="qr-camera-prompt" class="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-2 p-4 text-center">
                            <i class="fa-solid fa-video text-2xl text-cyan-400"></i>
                            <span id="qr-camera-status" class="text-xs font-bold text-gray-300">Click to activate camera scanner</span>
                            <button type="button" id="btn-start-camera" class="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold shadow-md transition cursor-pointer">Start Camera</button>
                        </div>
                    </div>

                    <div class="flex items-center justify-between gap-2">
                        <label class="flex-1 px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-cyan-500/30 text-xs font-bold text-gray-300 hover:text-white shadow-inner transition flex items-center justify-center gap-1.5 cursor-pointer text-center">
                            <i class="fa-solid fa-file-image text-cyan-400"></i>
                            <span>Upload QR Image</span>
                            <input type="file" id="input-qr-file" accept="image/*" class="hidden">
                        </label>
                    </div>

                    <!-- Direct Code Paste Fallback -->
                    <div class="pt-2 border-t border-white/10 space-y-1.5">
                        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Or Paste Sync Code Manually</label>
                        <div class="flex gap-2">
                            <input type="text" id="input-manual-code" placeholder="Paste GZ: or B64: code here..." class="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono">
                            <button type="button" id="btn-apply-manual-code" class="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold rounded-xl transition shadow cursor-pointer">
                                Load
                            </button>
                        </div>
                    </div>
                </div>

                <!-- TAB 2: SHOW QR PANEL -->
                <div id="panel-qr-show" class="hidden space-y-3">
                    <div class="bg-white p-3 rounded-2xl max-w-[260px] mx-auto shadow-2xl flex items-center justify-center aspect-square" id="qr-code-canvas-container">
                        <span class="text-xs text-gray-500 font-mono">Generating QR...</span>
                    </div>
                    <p class="text-center text-[10px] text-gray-400">Scan this code with another device or copy the sync code below.</p>
                    <div class="flex gap-2">
                        <button type="button" id="btn-copy-sync-code" class="flex-1 px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-cyan-500/30 text-xs font-bold text-gray-300 hover:text-white shadow-inner transition flex items-center justify-center gap-1.5 cursor-pointer">
                            <i class="fa-solid fa-copy text-cyan-400"></i>
                            <span>Copy Sync Code</span>
                        </button>
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
            this.overlay.onclick = (e) => {
                if (e.target === this.overlay) this.close();
            };

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

            // Confirm Sync
            this.card.querySelector('#btn-qr-apply').onclick = () => {
                if (this.scannedState) {
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
        }

        setTab(tab) {
            this.activeTab = tab;
            const tabScan = this.card.querySelector('#tab-qr-scan');
            const tabShow = this.card.querySelector('#tab-qr-show');
            const panelScan = this.card.querySelector('#panel-qr-scan');
            const panelShow = this.card.querySelector('#panel-qr-show');

            if (tab === 'scan') {
                tabScan.className = 'flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition duration-200 text-white bg-gradient-to-r from-cyan-600 to-teal-600 shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 cursor-pointer';
                tabShow.className = 'flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition duration-200 text-gray-400 hover:text-white bg-transparent flex items-center justify-center gap-1.5 cursor-pointer';
                panelScan.classList.remove('hidden');
                panelShow.classList.add('hidden');
                this._startCamera();
            } else {
                tabShow.className = 'flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition duration-200 text-white bg-gradient-to-r from-cyan-600 to-teal-600 shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 cursor-pointer';
                tabScan.className = 'flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition duration-200 text-gray-400 hover:text-white bg-transparent flex items-center justify-center gap-1.5 cursor-pointer';
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
                    const qr = window.qrcode(0, 'M');
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
            const mocksCount = (state.mocks || []).length;
            const notesCount = (state.notes || state.customNotes || []).length;
            const streak = state.streak || 1;
            const examName = state.examName || state.targetExamName || 'Conquest';
            const syllabusCount = Object.keys(state.syllabusProgress || {}).length;

            statsContainer.innerHTML = `
                <div class="p-2 bg-black/40 rounded-xl border border-white/5">
                    <span class="text-[9px] text-gray-400 uppercase block">Syllabus Checked</span>
                    <span class="font-extrabold text-teal-400">${syllabusCount} Topics</span>
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
                    <span class="text-[9px] text-gray-400 uppercase block">Exam Target</span>
                    <span class="font-extrabold text-rose-400">${examName}</span>
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
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { QrSyncModal };
    }
})();
