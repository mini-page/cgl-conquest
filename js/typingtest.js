// ============================================================
// Typing Test — SSC CGL themed, monkeytype-inspired
// Modes: words | sentences | numbers   Times: 15 | 30 | 60 | 120
// ============================================================
(function () {
    'use strict';

    // ── Word banks ──────────────────────────────────────────
    const WORD_BANKS = {
        words: [
            // Quant & reasoning vocab
            "percentage","ratio","profit","loss","interest","compound","simple",
            "average","median","mode","probability","permutation","combination",
            "geometry","triangle","quadrilateral","polygon","circle","radius",
            "diameter","hypotenuse","perpendicular","parallel","tangent","sector",
            "discount","markup","principal","amount","installment","divisible",
            "remainder","quotient","factor","multiple","prime","composite",
            "velocity","distance","speed","upstream","downstream","relative",
            "mensuration","volume","surface","cylinder","sphere","cone","cuboid",
            "algebra","identity","equation","polynomial","variable","constant",
            // English vocab
            "synonym","antonym","metaphor","simile","clause","phrase","preposition",
            "conjunction","pronoun","adjective","adverb","passive","active","tense",
            "comprehension","vocabulary","grammar","idiom","proverb","homonym",
            // GK themes
            "parliament","legislature","judiciary","executive","constitution",
            "amendment","republic","democracy","sovereignty","federation",
            "geography","latitude","longitude","peninsula","plateau","delta",
            "tributary","monsoon","irrigation","agriculture","industry",
            "economy","inflation","deflation","fiscal","monetary","budget",
            "history","dynasty","emperor","viceroy","freedom","independence",
            "movement","revolution","partition","election","governance",
            // Computer
            "software","hardware","network","internet","browser","protocol",
            "database","algorithm","encryption","firewall","bandwidth","server",
        ],
        sentences: [
            "the profit percentage is calculated on the cost price",
            "speed distance and time are interrelated quantities in motion",
            "the hypotenuse is the longest side of a right angled triangle",
            "compound interest grows faster than simple interest over time",
            "the median of a data set divides it into two equal halves",
            "upstream speed equals boat speed minus stream speed",
            "democracy means government of the people by the people",
            "the constitution of india came into effect on january twenty six",
            "gross domestic product measures the economic output of a nation",
            "the pythagorean theorem states that square of hypotenuse equals sum of squares",
            "latitude lines run parallel to the equator on the globe",
            "the parliament of india consists of the lok sabha and rajya sabha",
            "a firewall protects a computer network from unauthorized access",
            "photosynthesis is the process by which plants make food using sunlight",
            "the mughal empire was founded by babur in the year fifteen twenty six",
            "the ratio of circumference to diameter of a circle is called pi",
            "an idiom is a phrase whose meaning cannot be deduced from its words",
            "the right to equality is guaranteed under article fourteen of the constitution",
            "inflation refers to the general rise in the price level of goods",
            "the tropic of cancer passes through the middle of india",
        ],
        numbers: [
            // Mix of digits, operations and number-reading practice
            "144","256","625","1024","2048","3375","4096","6561","8000","9801",
            "12","15","18","24","36","48","60","72","84","96",
            "1/2","1/3","1/4","1/5","1/6","1/7","1/8","1/9","1/10",
            "25%","50%","75%","33%","66%","12.5%","37.5%","62.5%",
            "3 4 5","5 12 13","7 24 25","8 15 17","9 40 41","11 60 61",
            "2+3=5","6x7=42","9x9=81","12x12=144","15x15=225","25x25=625",
        ],
    };

    // ── State ───────────────────────────────────────────────
    let ttMode     = 'words';
    let ttTime     = 30;
    let ttWords    = [];       // array of word strings for current test
    let ttWordIdx  = 0;        // which word user is on
    let ttLetIdx   = 0;        // which letter within that word
    let ttCorrect  = 0;
    let ttErrors   = 0;
    let ttTotal    = 0;
    let ttStarted  = false;
    let ttFinished = false;
    let ttTimer    = null;
    let ttRemain   = 30;

    // ── DOM refs ────────────────────────────────────────────
    const $ = id => document.getElementById(id);

    // ── Shuffle helper ──────────────────────────────────────
    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // ── Build a random word list ────────────────────────────
    function buildWordList() {
        const bank = WORD_BANKS[ttMode] || WORD_BANKS.words;
        const shuffled = shuffle(bank);
        // For sentences mode keep them as-is (already sentences)
        // For words/numbers repeat until we have ~80 tokens
        if (ttMode === 'sentences') {
            return shuffled.slice(0, 12); // 12 sentences is plenty
        }
        // Repeat + shuffle to get ~80 words
        let out = [];
        while (out.length < 80) out = out.concat(shuffle(bank));
        return out.slice(0, 80);
    }

    // ── Render word spans ───────────────────────────────────
    function renderWords() {
        const display = $('tt-words-display');
        if (!display) return;
        display.innerHTML = '';
        ttWords.forEach((word, wi) => {
            const wSpan = document.createElement('span');
            wSpan.className = 'tt-word' + (wi === 0 ? ' active-word' : '');
            wSpan.dataset.wi = wi;
            [...word].forEach((ch, li) => {
                const lSpan = document.createElement('span');
                lSpan.className = 'tt-letter' + (wi === 0 && li === 0 ? ' current' : '');
                lSpan.textContent = ch;
                lSpan.dataset.li = li;
                wSpan.appendChild(lSpan);
            });
            // Add a trailing space span for easier visual spacing
            display.appendChild(wSpan);
        });
    }

    // ── Get letter span ─────────────────────────────────────
    function getLetter(wi, li) {
        const wSpan = document.querySelector(`#tt-words-display .tt-word[data-wi="${wi}"]`);
        if (!wSpan) return null;
        return wSpan.querySelectorAll('.tt-letter')[li] || null;
    }
    function getWord(wi) {
        return document.querySelector(`#tt-words-display .tt-word[data-wi="${wi}"]`);
    }

    // ── Update cursor position ──────────────────────────────
    function updateCursor(prevWi, prevLi) {
        // Remove old current classes
        document.querySelectorAll('#tt-words-display .tt-letter.current').forEach(el => el.classList.remove('current'));
        document.querySelectorAll('#tt-words-display .tt-word.active-word').forEach(el => el.classList.remove('active-word'));

        const wSpan = getWord(ttWordIdx);
        if (wSpan) {
            wSpan.classList.add('active-word');
            const letters = wSpan.querySelectorAll('.tt-letter');
            const target = letters[ttLetIdx] || letters[letters.length - 1];
            if (target) target.classList.add('current');

            // Scroll word into view
            wSpan.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    // ── Update live stats ───────────────────────────────────
    function updateLiveStats() {
        const elapsed = ttTime - ttRemain;
        const mins = elapsed / 60;
        const wpm = mins > 0 ? Math.round(ttCorrect / 5 / mins) : 0;
        const acc = ttTotal > 0 ? Math.round((ttCorrect / ttTotal) * 100) : 100;
        const wpmEl = $('tt-wpm');
        const accEl = $('tt-acc');
        if (wpmEl) wpmEl.textContent = wpm;
        if (accEl) accEl.textContent = acc + '%';

        // Progress bar
        const bar = $('tt-progress-bar');
        if (bar) bar.style.width = ((ttTime - ttRemain) / ttTime * 100) + '%';
    }

    // ── Start timer ─────────────────────────────────────────
    function startTimer() {
        ttRemain = ttTime;
        const timerVal = $('tt-timer-val');
        if (timerVal) timerVal.textContent = ttRemain;

        ttTimer = setInterval(() => {
            ttRemain--;
            if (timerVal) timerVal.textContent = ttRemain;
            updateLiveStats();
            if (ttRemain <= 0) finishTest();
        }, 1000);
    }

    // ── Finish & show results ───────────────────────────────
    function finishTest() {
        ttFinished = true;
        clearInterval(ttTimer);

        const elapsed = ttTime; // full time always used
        const wpm = Math.round(ttCorrect / 5 / (elapsed / 60));
        const acc = ttTotal > 0 ? Math.round((ttCorrect / ttTotal) * 100) : 100;

        const ro = $('tt-result-overlay');
        if (ro) {
            $('tt-res-wpm').textContent     = wpm;
            $('tt-res-acc').textContent     = acc + '%';
            $('tt-res-correct').textContent = Math.floor(ttCorrect / 5);
            ro.classList.add('visible');
            ro.style.display = 'flex';
        }
    }

    // ── Reset / init ────────────────────────────────────────
    function resetTest() {
        clearInterval(ttTimer);
        ttWordIdx  = 0;
        ttLetIdx   = 0;
        ttCorrect  = 0;
        ttErrors   = 0;
        ttTotal    = 0;
        ttStarted  = false;
        ttFinished = false;
        ttRemain   = ttTime;

        // Reset stats display
        const wpmEl = $('tt-wpm'); if (wpmEl) wpmEl.textContent = '—';
        const accEl = $('tt-acc'); if (accEl) accEl.textContent = '—';
        const tvEl  = $('tt-timer-val'); if (tvEl) tvEl.textContent = ttTime;
        const bar   = $('tt-progress-bar'); if (bar) bar.style.width = '0%';

        // Hide result overlay
        const ro = $('tt-result-overlay');
        if (ro) { ro.classList.remove('visible'); ro.style.display = 'none'; }

        // Show idle overlay
        const io = $('tt-idle-overlay');
        if (io) io.style.display = 'flex';

        // Build & render words
        ttWords = buildWordList();
        renderWords();

        // Reset arena scroll
        const arena = $('tt-arena');
        if (arena) arena.scrollTop = 0;
    }

    // ── Handle keypress ─────────────────────────────────────
    function handleKey(e) {
        if (ttFinished) return;

        const key = e.key;

        // Enter = restart anywhere
        if (key === 'Enter') { resetTest(); return; }

        // Ignore modifier keys
        if (key.length > 1 && key !== 'Backspace' && key !== ' ') return;

        // Start test on first real key
        if (!ttStarted && (key.length === 1 || key === 'Backspace')) {
            ttStarted = true;
            const io = $('tt-idle-overlay');
            if (io) io.style.display = 'none';
            startTimer();
        }

        if (key === ' ' || key === 'Tab') {
            e.preventDefault();
            // Space = advance to next word
            if (ttLetIdx > 0) {
                // Mark remaining letters in current word as incorrect if not typed
                const wSpan = getWord(ttWordIdx);
                if (wSpan) {
                    const letters = wSpan.querySelectorAll('.tt-letter');
                    letters.forEach((l, i) => {
                        if (i >= ttLetIdx && !l.classList.contains('correct') && !l.classList.contains('incorrect')) {
                            l.classList.add('incorrect');
                        }
                    });
                    // Check if word is complete and correct
                    const allCorrect = [...letters].every(l => l.classList.contains('correct'));
                    if (!allCorrect) wSpan.classList.add('wrong-word');
                }
                ttWordIdx++;
                ttLetIdx = 0;
                if (ttWordIdx >= ttWords.length) { finishTest(); return; }
                updateCursor();
                updateLiveStats();
            }
            return;
        }

        if (key === 'Backspace') {
            if (ttLetIdx > 0) {
                ttLetIdx--;
                const lEl = getLetter(ttWordIdx, ttLetIdx);
                if (lEl) { lEl.classList.remove('correct', 'incorrect', 'current'); }
            }
            updateCursor();
            return;
        }

        // Normal character
        if (key.length === 1) {
            const expected = ttWords[ttWordIdx]?.[ttLetIdx];
            if (expected === undefined) return; // beyond word length

            const lEl = getLetter(ttWordIdx, ttLetIdx);
            ttTotal++;
            if (key === expected) {
                ttCorrect++;
                if (lEl) { lEl.classList.remove('incorrect'); lEl.classList.add('correct'); }
            } else {
                ttErrors++;
                if (lEl) { lEl.classList.remove('correct'); lEl.classList.add('incorrect'); }
            }
            ttLetIdx++;
            updateCursor();
            updateLiveStats();
        }
    }

    // ── Wire up hidden input ────────────────────────────────
    function attachInput() {
        const input = $('tt-hidden-input');
        const arena = $('tt-arena');
        if (!input || !arena) return;

        // Click arena → focus input
        arena.addEventListener('click', () => {
            if (!ttFinished) input.focus();
        });

        // Intercept keydown on document while panel visible
        document.addEventListener('keydown', e => {
            const panel = $('typing-test-panel');
            if (!panel || panel.classList.contains('hidden')) return;
            // Don't steal from palette
            if (document.getElementById('cmd-palette-overlay')?.classList.contains('active')) return;
            handleKey(e);
        });
    }

    // ── Mode / time button wiring ───────────────────────────
    function wireControls() {
        document.querySelectorAll('.tt-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tt-mode-btn').forEach(b => b.classList.remove('tt-mode-active'));
                btn.classList.add('tt-mode-active');
                ttMode = btn.dataset.ttMode;
                resetTest();
            });
        });

        document.querySelectorAll('.tt-time-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tt-time-btn').forEach(b => b.classList.remove('tt-time-active'));
                btn.classList.add('tt-time-active');
                ttTime = parseInt(btn.dataset.ttTime, 10);
                resetTest();
            });
        });

        const restartBtn = $('tt-restart-btn');
        if (restartBtn) restartBtn.addEventListener('click', resetTest);
    }

    // ── Hook into speed tab system ──────────────────────────
    function hookSpeedTab() {
        // Listen for the typing test tab click via the existing speed tab system
        document.addEventListener('click', e => {
            const btn = e.target.closest('.speed-tab-btn');
            if (!btn) return;
            const mode = btn.dataset.mode;
            const ttPanel = $('typing-test-panel');
            const drillCard = $('unified-drill-card');

            if (mode === 'typingTest') {
                // Show typing panel, hide drill card
                if (drillCard) drillCard.style.display = 'none';
                if (ttPanel)  ttPanel.classList.remove('hidden');
                // Init on first show
                if (!ttStarted && ttWords.length === 0) resetTest();
            } else {
                // Hide typing panel, show drill card
                if (ttPanel)  ttPanel.classList.add('hidden');
                if (drillCard) drillCard.style.display = '';
                // Pause typing if running
                clearInterval(ttTimer);
                ttStarted = false;
            }
        });
    }

    // ── Init on DOM ready ───────────────────────────────────
    function init() {
        wireControls();
        attachInput();
        hookSpeedTab();
        // Don't resetTest yet — wait until user clicks the tab
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.ttReset = resetTest; // expose for external use
})();
