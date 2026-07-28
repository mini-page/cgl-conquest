// ============================================================
// Typing Test — unified-drill-card integration
// Tweaks: tab highlight, no badge, controls↔stats swap,
//         larger text, line-by-line scroll, Enter=start,
//         Alt+Space=pause, Alt+X=close
// ============================================================
(function () {
    'use strict';

    window.typingTestActive   = false;
    window.inputCaptureLocked = false;

    // ════════════════════════════════════════════════════════
    // DATASET (SSC CGL / GRE / Banking / Govt / Editorial)
    // ════════════════════════════════════════════════════════
    const WORD_DATA = {
        words: [
            "absence","accidentally","accommodate","acknowledgment","acquire",
            "address","amateur","argument","assassination","auxiliary",
            "believe","calendar","camouflage","cemetery","changeable",
            "colleague","completely","conscientious","consensus","curriculum",
            "definitely","dilemma","embarrass","exercise","fiery","foreign",
            "fulfill","gauge","handkerchief","immediately","independent",
            "indispensable","intelligence","interruption","irresistible",
            "jewelry","liaison","license","maintenance","millennium",
            "misspell","necessary","noticeable","occasionally","offense",
            "parameter","pastime","perseverance","personnel","possession",
            "prejudice","privilege","pronunciation","publicly","questionnaire",
            "receive","recommend","referred","remembrance","resistance",
            "responsible","rhythm","schedule","separate","sergeant",
            "supersede","temperature","threshold","tyranny","unanimous",
            "unnecessary","vacuum","vegetable","vicious","weather","weird",
            "abdicate","abridge","abscond","abstain","abundance","accelerate",
            "accessible","accomplice","accountable","accumulate","acquaintance",
            "acquiesce","acquit","adamant","adherence","adjacent","administer",
            "admissible","adolescent","adverse","affidavit","aggravate",
            "aggression","alacrity","allegiance","alleviate","ambiguous",
            "amendment","amicable","amnesty","analogous","anarchy","annihilate",
            "anonymous","antagonize","antiquated","apparatus","apprehend",
            "approximate","arbitrary","arduous","articulate","ascertain",
            "assessment","assiduous","audacious","auspicious","autonomous",
            "avarice","bankruptcy","benevolent","bureaucracy","bilateral",
            "benchmark","beneficiary","belligerent","bequeath","blasphemy",
            "catastrophe","categorical","cautious","circumspect","clemency",
            "coalition","coercion","coherent","collaborate","commemorate",
            "commission","commitment","committee","competence","complacent",
            "compliance","conscience","consecutive","consolidate","conspire",
            "constituency","contemptuous","contentious","contradict","conviction",
            "corruption","counterfeit","cynicism","declaration","deliberately",
            "democracy","denomination","deferential","deficiency","delinquent",
            "despondent","detention","deteriorate","devastation","dilapidated",
            "diligently","diplomacy","discipline","discrepancy","discrimination",
            "disparity","disposition","disseminate","distortion","documentation",
            "dominance","duration","eccentric","economy","egregious","eligible",
            "eloquent","embarrassment","embezzlement","eminent","empathy",
            "emphasis","enumerate","entrepreneur","ephemeral","equivocal",
            "essential","exaggerate","exonerate","expenditure","exploitation",
            "facilitate","feasibility","fervent","fiduciary","flourishing",
            "formidable","fraudulent","fundamental","fiscal","governance",
            "grievance","guarantee","government","gratuitous","gregarious",
            "gullible","harassment","hierarchy","hypothesis","heinous",
            "ignorance","illegitimate","impartial","impeccable","implication",
            "impunity","inadvertent","indigenous","inevitable","infrastructure",
            "innuendo","integrity","intelligible","irrelevant","jeopardize",
            "journalism","judiciary","justification","laudable","legislation",
            "legitimate","lucrative","litigant","malicious","mandatory",
            "manipulation","menace","miscellaneous","misdemeanor","monopoly",
            "municipal","negotiation","negligence","nuisance","notorious",
            "obsequious","omnipotent","ominous","opposition","ordinance",
            "parliament","plausible","preliminary","prerogative","prohibition",
            "proliferation","propaganda","proprietor","prosecution","protocol",
            "provocation","provisional","questionnaire","quintessential",
            "ratification","recklessness","reconcile","referendum","relevance",
            "remuneration","reputation","resilience","retaliation","revelation",
            "rhetoric","rigorous","sabotage","scrutiny","sovereignty","stringent",
            "subordinate","subsidy","surveillance","susceptible","sustainable",
            "systematic","transparency","tribunal","unanimous","undermining",
            "unforeseen","unilateral","unprecedented","vandalism","vigilance",
            "vulnerable","vindictive","warranted","widespread","zealous",
            "aberrant","abeyance","abhorrent","abstemious","accolade","acrimony",
            "adulterate","affable","amalgam","ameliorate","amiable","amorphous",
            "anachronism","apathy","approbation","arcane","ardor","arid",
            "ascetic","assuage","atrophy","austere","axiomatic","bellicose",
            "bombastic","burgeon","cacophony","capricious","censure","chicanery",
            "circuitous","cogent","commensurate","convoluted","credulity",
            "culpable","decorum","deference","denigrate","desultory","didactic",
            "diffident","dilatory","discern","disparate","dogmatic","dubious",
            "ebullience","effrontery","elusive","enervate","enigmatic",
            "equanimity","erroneous","esoteric","ethereal","exacerbate",
            "exorbitant","expedient","exuberance","fallacious","fastidious",
            "flagrant","fortuitous","frugality","garrulous","guile","hackneyed",
            "harangue","hegemony","hubris","idiosyncrasy","ignominious",
            "impertinent","implacable","impudence","incisive","incongruous",
            "indelible","indolent","ineffable","ingenious","inimical","insidious",
            "insipid","intrepid","lament","languid","laud","loquacious","lucid",
            "magnanimous","malevolent","meticulous","mitigate","mundane",
            "nefarious","nostalgia","nonchalant","obdurate","obstinate",
            "ostentatious","panacea","paradox","parochial","partisan","pedantic",
            "perfidious","perfunctory","perspicacious","pertinent","philanthropy",
            "placid","poignant","pragmatic","presumptuous","prodigal","profligate",
            "profound","prudent","querulous","quixotic","reticent","sagacious",
            "sanctimonious","sardonic","skeptical","somnolent","spurious",
            "stagnant","steadfast","stoic","superficial","taciturn","tenacious",
            "tirade","trite","turbulent","ubiquitous","verbose","veracious",
            "volatile","waver","whimsical",
            "amortization","arbitrage","collateral","commodity","consortium",
            "covenant","depreciation","derivative","divestiture","dividend",
            "embezzle","equilibrium","foreclosure","hypothecation","inflation",
            "insolvency","leverage","liquidity","maturity","monetization",
            "moratorium","mortgage","nationalization","privatization","recession",
            "refinancing","remittance","securitization","speculation","stagflation",
            "subvention","solvency","underwriting","valuation","withholding",
            "abdication","adjudication","affirmative","allegation","annexation",
            "arbitration","centralization","charter","codification","compulsion",
            "confederation","contempt","dissolution","emolument","extradition",
            "federation","felony","franchise","immunity","impeachment",
            "incarceration","indemnity","injunction","intestate","misappropriation",
            "perjury","promulgate","ratify","reprimand","sanction","sedition",
            "statute","subpoena","suffrage","testimony","treason","verdict",
        ],
        sentences: [
            "the committee submitted its recommendation to the parliament yesterday",
            "the judiciary is the guardian of the constitution and fundamental rights",
            "the entrepreneur showed remarkable perseverance in the face of adversity",
            "agriculture contributes significantly to the national economy and employment",
            "bureaucracy often hampers the efficient delivery of government services",
            "the amendment was ratified after a unanimous vote in the legislature",
            "transparency and accountability are essential pillars of good governance",
            "the arbitrary detention of civilians is a violation of international law",
            "fiscal discipline is crucial for maintaining a stable macroeconomic environment",
            "the sovereignty of a nation is inviolable under international conventions",
            "corruption erodes public trust and undermines democratic institutions",
            "the defendant was acquitted due to insufficient evidence presented by the prosecution",
            "indigenous communities deserve equitable access to educational opportunities",
            "the referendum sought to gauge public opinion on constitutional reform",
            "inflation and unemployment are interrelated economic variables in monetary theory",
            "the proliferation of misinformation poses a serious threat to democracy",
            "perseverance and discipline are indispensable qualities for competitive examination success",
            "the government announced a comprehensive subsidy scheme for marginal farmers",
            "the tribunal adjudicated the dispute between the two conflicting municipal bodies",
            "remuneration packages in the public sector are governed by pay commission guidelines",
            "the coalition government struggled to maintain consensus on economic policy",
            "deforestation and urban encroachment are accelerating the loss of biodiversity",
            "the bilateral trade agreement was signed after months of rigorous negotiation",
            "resilience and adaptability are critical attributes for administrative officers",
            "the parliamentary committee recommended stringent measures against financial fraud",
            "surveillance technologies must be regulated to protect civil liberties",
            "the ordinance was promulgated to address the immediate legislative vacuum",
            "meticulous planning and coordinated implementation led to successful project completion",
            "sedition laws have historically been used to suppress legitimate political dissent",
            "vocabulary and comprehension skills are assessed in the english language section",
            "general awareness encompasses current affairs economics history and general knowledge",
            "the supreme court upheld the constitutional validity of the reservation policy",
            "monetary policy decisions by the central bank influence interest rates and inflation",
            "the welfare scheme was restructured to ensure equitable distribution among beneficiaries",
            "the candidates must demonstrate proficiency in quantitative aptitude and logical reasoning",
            "diplomatic channels were activated to resolve the bilateral boundary disagreement",
        ],
        numbers: [
            "144","256","625","1024","2048","3375","4096","6561","8000","9801",
            "10000","12321","14400","15625","17689","19600","20736","22500",
            "3 4 5","5 12 13","7 24 25","8 15 17","9 40 41","11 60 61",
            "20 21 29","12 35 37","13 84 85","28 45 53","33 56 65",
            "1/2","1/3","1/4","1/5","1/6","1/7","1/8","1/9","1/10",
            "2/3","3/4","3/5","4/5","5/6","5/8","7/8","5/9","7/9",
            "25%","50%","75%","33.33%","66.66%","12.5%","37.5%","62.5%",
            "87.5%","16.66%","83.33%","11.11%","22.22%","44.44%","55.55%",
            "6x7","8x9","12x11","13x14","15x16","17x18","19x20","21x22",
            "2^5","3^4","4^3","5^3","2^8","3^5","2^10",
        ],
    };

    // ════════════════════════════════════════════════════════
    // STATE
    // ════════════════════════════════════════════════════════
    let state     = 'idle'; // 'idle' | 'running' | 'paused' | 'finished'
    let ttMode    = 'words';
    let ttTime    = 30;
    let ttWords   = [];
    let ttWordIdx = 0;
    let ttLetIdx  = 0;
    let ttCorrect = 0;
    let ttErrors  = 0;
    let ttTotal   = 0;
    let ttRemain  = 30;
    let ttTimer   = null;

    // ════════════════════════════════════════════════════════
    // HELPERS
    // ════════════════════════════════════════════════════════
    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    function buildWordList() {
        const bank = WORD_DATA[ttMode] || WORD_DATA.words;
        if (ttMode === 'sentences') return shuffle(bank).slice(0, 12);
        let out = [];
        while (out.length < 100) out = out.concat(shuffle(bank));
        return out.slice(0, 100);
    }
    function getWordEl(wi) {
        return document.querySelector(`#tt-words-display .tt-word[data-wi="${wi}"]`);
    }
    function getLetter(wi, li) {
        const w = getWordEl(wi);
        return w ? w.querySelectorAll('.tt-letter')[li] || null : null;
    }

    // ════════════════════════════════════════════════════════
    // INJECT UI — into drill-interactive-area
    // ════════════════════════════════════════════════════════
    function injectUI() {
        const area = document.getElementById('drill-interactive-area');
        if (!area) return;
        const old = document.getElementById('tt-root');
        if (old) old.remove();

        area.innerHTML = `
        <div id="tt-root">

          <!-- ── IDLE controls: mode + time pills (visible only in IDLE) -->
          <div id="tt-controls-row" class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div class="flex items-center gap-0.5 bg-white/5 border border-white/5 rounded-xl p-0.5">
              <button class="tt-mode-btn ${ttMode==='words'?'tt-mode-active':''}" data-tt-mode="words">
                <i class="fa-solid fa-font mr-1 opacity-70"></i>Words
              </button>
              <button class="tt-mode-btn ${ttMode==='sentences'?'tt-mode-active':''}" data-tt-mode="sentences">
                <i class="fa-solid fa-align-left mr-1 opacity-70"></i>Sentences
              </button>
              <button class="tt-mode-btn ${ttMode==='numbers'?'tt-mode-active':''}" data-tt-mode="numbers">
                <i class="fa-solid fa-hashtag mr-1 opacity-70"></i>Numbers
              </button>
            </div>
            <div class="flex items-center gap-0.5 bg-white/5 border border-white/5 rounded-xl p-0.5">
              <button class="tt-time-btn ${ttTime===15?'tt-time-active':''}" data-tt-time="15">15s</button>
              <button class="tt-time-btn ${ttTime===30?'tt-time-active':''}" data-tt-time="30">30s</button>
              <button class="tt-time-btn ${ttTime===60?'tt-time-active':''}" data-tt-time="60">60s</button>
              <button class="tt-time-btn ${ttTime===120?'tt-time-active':''}" data-tt-time="120">120s</button>
            </div>
          </div>

          <!-- ── RUNNING stats: WPM · timer · ACC (hidden in IDLE) -->
          <div id="tt-stats-row" class="hidden flex items-center justify-center gap-8 font-mono text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">
            <span><span id="tt-wpm" class="text-accentCyan text-base font-extrabold">0</span> WPM</span>
            <span class="text-xl font-extrabold text-accentAmber" id="tt-timer-val">${ttTime}</span>
            <span><span id="tt-acc" class="text-accentGreen text-base font-extrabold">100%</span> ACC</span>
          </div>

          <!-- ── Fixed viewport — 3 lines visible, scrolls line-by-line -->
          <div class="tt-viewport" id="tt-viewport">
            <div id="tt-words-display" class="tt-words-wrap"></div>

            <!-- IDLE overlay -->
            <div id="tt-idle-overlay" class="tt-overlay">
              <i class="fa-solid fa-keyboard text-2xl text-accentAmber opacity-50 mb-1"></i>
              <p class="text-xs text-gray-300 font-bold uppercase tracking-widest">Start typing or press Enter</p>
              <p class="text-[10px] text-gray-500 mt-0.5">
                <kbd class="tt-kbd">Alt+Space</kbd> pause &nbsp;·&nbsp;
                <kbd class="tt-kbd">Alt+X</kbd> stop
              </p>
            </div>

            <!-- RESULT overlay -->
            <div id="tt-result-overlay" class="tt-overlay hidden">
              <div class="flex gap-8 text-center">
                <div>
                  <p class="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">WPM</p>
                  <p id="tt-res-wpm" class="text-4xl font-heading font-extrabold text-accentCyan">—</p>
                </div>
                <div>
                  <p class="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Accuracy</p>
                  <p id="tt-res-acc" class="text-4xl font-heading font-extrabold text-accentGreen">—</p>
                </div>
                <div>
                  <p class="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Words</p>
                  <p id="tt-res-correct" class="text-4xl font-heading font-extrabold text-white">—</p>
                </div>
              </div>
              <p class="text-[10px] text-gray-500 mt-2">
                <kbd class="tt-kbd">Enter</kbd> restart &nbsp;·&nbsp;
                <kbd class="tt-kbd">Alt+X</kbd> close
              </p>
            </div>
          </div>

        </div>`;

        // Wire mode/time pills
        document.querySelectorAll('.tt-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (ttMode === btn.dataset.ttMode) return;
                ttMode = btn.dataset.ttMode;
                initTest();
            });
        });
        document.querySelectorAll('.tt-time-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                ttTime = parseInt(btn.dataset.ttTime, 10);
                initTest();
            });
        });
    }

    // Restore original drill area (so speed.js works after tab switch)
    function restoreArea() {
        const area = document.getElementById('drill-interactive-area');
        if (!area) return;
        area.innerHTML = `
        <div class="text-center space-y-6 py-6">
          <h2 id="drill-question-label" class="text-3xl font-heading font-extrabold text-white leading-tight">Select a mode &amp; press Start</h2>
          <div id="drill-options" class="grid grid-cols-2 gap-3 max-w-md mx-auto"></div>
          <div class="pt-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-6 justify-center text-xs font-bold text-gray-500 uppercase tracking-widest">
            <div id="drill-score">Score: 0 / 0</div>
            <div class="hidden sm:block w-px h-3 bg-white/10"></div>
            <div id="drill-feedback">Streak: 0 🔥</div>
          </div>
        </div>`;
    }

    // ════════════════════════════════════════════════════════
    // RENDER WORDS
    // ════════════════════════════════════════════════════════
    function renderWords() {
        const display = document.getElementById('tt-words-display');
        if (!display) return;
        display.style.marginTop = '0px';
        display.innerHTML = '';
        ttWords.forEach((word, wi) => {
            const wSpan = document.createElement('span');
            wSpan.className = 'tt-word';
            wSpan.dataset.wi = wi;
            [...word].forEach((ch, li) => {
                const lSpan = document.createElement('span');
                lSpan.className = 'tt-letter' + (wi === 0 && li === 0 ? ' current' : '');
                lSpan.textContent = ch;
                wSpan.appendChild(lSpan);
            });
            display.appendChild(wSpan);
        });
    }

    // ════════════════════════════════════════════════════════
    // CURSOR & LINE SCROLL
    // Line-by-line: shift words-display up by -offsetTop of current word.
    // CSS transition makes it smooth.
    // ════════════════════════════════════════════════════════
    function updateCursor() {
        document.querySelectorAll('#tt-words-display .tt-letter.current')
            .forEach(e => e.classList.remove('current'));

        const wEl = getWordEl(ttWordIdx);
        if (!wEl) return;

        const letters = wEl.querySelectorAll('.tt-letter');
        const target  = letters[ttLetIdx] || letters[letters.length - 1];
        if (target) target.classList.add('current');

        scrollToLine(wEl);
    }

    function scrollToLine(wEl) {
        const display = document.getElementById('tt-words-display');
        if (!display || !wEl) return;
        // wEl.offsetTop is relative to display (its offsetParent via tt-viewport)
        // Shift display up so current word sits at top of the 220px viewport
        const lineTop = wEl.offsetTop;
        display.style.marginTop = (-lineTop) + 'px';
    }

    // ════════════════════════════════════════════════════════
    // STATS
    // ════════════════════════════════════════════════════════
    function computeStats() {
        const elapsed = ttTime - ttRemain;
        const mins    = elapsed / 60;
        const wpm     = mins > 0 ? Math.round(ttCorrect / 5 / mins) : 0;
        const acc     = ttTotal > 0 ? Math.round((ttCorrect / ttTotal) * 100) : 100;
        return { wpm, acc };
    }

    function updateLiveStats() {
        const { wpm, acc } = computeStats();
        const wpmEl = document.getElementById('tt-wpm');
        const accEl = document.getElementById('tt-acc');
        if (wpmEl) wpmEl.textContent = wpm;
        if (accEl) accEl.textContent = acc + '%';
        // Repurpose drill timer fill as countdown
        const fill = document.getElementById('drill-timer-fill');
        if (fill) {
            const pct = (ttRemain / ttTime) * 100;
            fill.style.width = pct + '%';
            fill.style.backgroundColor = pct > 50 ? '' : pct > 20 ? '#f59e0b' : '#f43f5e';
        }
    }

    // ── Swap controls ↔ stats rows ──────────────────────────
    function showControls() {
        document.getElementById('tt-controls-row')?.classList.remove('hidden');
        document.getElementById('tt-stats-row')?.classList.add('hidden');
    }
    function showStats() {
        document.getElementById('tt-controls-row')?.classList.add('hidden');
        document.getElementById('tt-stats-row')?.classList.remove('hidden');
        // Sync timer val
        const tv = document.getElementById('tt-timer-val');
        if (tv) tv.textContent = ttRemain;
    }

    // ════════════════════════════════════════════════════════
    // BUTTON LABEL
    // ════════════════════════════════════════════════════════
    function setPauseBtn(icon, label) {
        const btn = document.getElementById('btn-drill-pause');
        if (btn) btn.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${label}</span>`;
    }

    // ════════════════════════════════════════════════════════
    // STATE TRANSITIONS
    // ════════════════════════════════════════════════════════

    // IDLE — fresh start
    function initTest() {
        clearInterval(ttTimer);
        state     = 'idle';
        ttWordIdx = 0; ttLetIdx = 0;
        ttCorrect = 0; ttErrors = 0; ttTotal  = 0;
        ttRemain  = ttTime;
        window.inputCaptureLocked = false;

        ttWords = buildWordList();
        injectUI();       // rebuild controls/stats/viewport HTML
        renderWords();
        updateCursor();

        // Reset timer bar
        const fill = document.getElementById('drill-timer-fill');
        if (fill) { fill.style.width = '100%'; fill.style.backgroundColor = ''; }

        // Show controls row (IDLE state)
        showControls();

        // Show idle overlay, hide result overlay
        document.getElementById('tt-idle-overlay')?.classList.remove('hidden');
        const ro = document.getElementById('tt-result-overlay');
        if (ro) { ro.classList.add('hidden'); ro.style.display = ''; }

        // Restore drill-paused-overlay if it was open
        document.getElementById('drill-paused-overlay')?.classList.add('hidden');
        document.getElementById('drill-interactive-area')?.classList.remove('blur-md');

        setPauseBtn('fa-play', 'Start');
        document.getElementById('btn-drill-stop')?.classList.remove('hidden');
    }

    // RUNNING — start or resume
    function startRunning() {
        if (state === 'finished') return;
        state = 'running';
        window.inputCaptureLocked = true;

        // Hide idle/result overlays
        document.getElementById('tt-idle-overlay')?.classList.add('hidden');
        const ro = document.getElementById('tt-result-overlay');
        if (ro) { ro.classList.add('hidden'); ro.style.display = ''; }
        // Hide paused overlay
        document.getElementById('drill-paused-overlay')?.classList.add('hidden');
        document.getElementById('drill-interactive-area')?.classList.remove('blur-md');

        // Swap to stats row
        showStats();

        setPauseBtn('fa-pause', 'Pause');

        clearInterval(ttTimer);
        ttTimer = setInterval(() => {
            ttRemain = Math.max(0, ttRemain - 1);
            const tv = document.getElementById('tt-timer-val');
            if (tv) tv.textContent = ttRemain;
            updateLiveStats();
            if (ttRemain <= 0) finishTest();
        }, 1000);
    }

    // PAUSED — freeze timer, show blur overlay
    function pauseTest() {
        if (state !== 'running') return;
        state = 'paused';
        window.inputCaptureLocked = false;
        clearInterval(ttTimer);

        document.getElementById('drill-paused-overlay')?.classList.remove('hidden');
        document.getElementById('drill-interactive-area')?.classList.add('blur-md');
        setPauseBtn('fa-play', 'Resume');
    }

    // FINISHED — show results
    function finishTest() {
        if (state === 'finished') return;
        state = 'finished';
        window.inputCaptureLocked = false;
        clearInterval(ttTimer);

        const { wpm, acc } = computeStats();
        const words = Math.floor(ttCorrect / 5);

        const ro = document.getElementById('tt-result-overlay');
        if (ro) {
            document.getElementById('tt-res-wpm').textContent     = wpm;
            document.getElementById('tt-res-acc').textContent     = acc + '%';
            document.getElementById('tt-res-correct').textContent = words;
            ro.classList.remove('hidden');
            ro.style.display = 'flex';
        }
        // Hide paused overlay
        document.getElementById('drill-paused-overlay')?.classList.add('hidden');
        document.getElementById('drill-interactive-area')?.classList.remove('blur-md');

        // Stats stay visible (already showing)
        setPauseBtn('fa-rotate-right', 'Restart');

        const fill = document.getElementById('drill-timer-fill');
        if (fill) fill.style.backgroundColor = '#f43f5e';
    }

    // TEARDOWN — leaving typing test tab entirely
    function teardown() {
        clearInterval(ttTimer);
        state = 'idle';
        window.typingTestActive   = false;
        window.inputCaptureLocked = false;

        // Restore level select
        const levelSel = document.getElementById('select-maths-level');
        if (levelSel) levelSel.style.display = '';

        // Remove active class from typing test tab
        document.querySelector('.speed-tab-btn[data-mode="typingTest"]')
            ?.classList.remove('active-nav-tab');

        // Hide stop button, reset pause btn
        document.getElementById('btn-drill-stop')?.classList.add('hidden');
        setPauseBtn('fa-play', 'Start');

        // Clean up drill-paused overlay and blur
        document.getElementById('drill-paused-overlay')?.classList.add('hidden');
        document.getElementById('drill-interactive-area')?.classList.remove('blur-md');

        // Reset timer bar
        const fill = document.getElementById('drill-timer-fill');
        if (fill) { fill.style.width = '100%'; fill.style.backgroundColor = ''; }

        restoreArea(); // speed.js needs drill-question-label etc.
    }

    // ════════════════════════════════════════════════════════
    // TYPING LOGIC
    // ════════════════════════════════════════════════════════
    function handleChar(key) {
        const expected = ttWords[ttWordIdx]?.[ttLetIdx];
        if (expected === undefined) return;
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

    function handleBackspace() {
        if (ttLetIdx > 0) {
            ttLetIdx--;
            const lEl = getLetter(ttWordIdx, ttLetIdx);
            if (lEl) lEl.classList.remove('correct', 'incorrect', 'current');
        }
        updateCursor();
    }

    function advanceWord() {
        if (ttLetIdx === 0) return;
        const wEl = getWordEl(ttWordIdx);
        if (wEl) {
            const letters = wEl.querySelectorAll('.tt-letter');
            let allCorrect = true;
            letters.forEach((l, i) => {
                if (i >= ttLetIdx && !l.classList.contains('correct')) {
                    l.classList.add('incorrect'); allCorrect = false;
                } else if (!l.classList.contains('correct')) {
                    allCorrect = false;
                }
            });
            if (!allCorrect) wEl.classList.add('wrong-word');
        }
        ttWordIdx++;
        ttLetIdx = 0;
        if (ttWordIdx >= ttWords.length) { finishTest(); return; }
        updateCursor();
        updateLiveStats();
    }

    // ════════════════════════════════════════════════════════
    // KEYDOWN — capture phase (before navigation.js / speed.js)
    // ════════════════════════════════════════════════════════
    document.addEventListener('keydown', function (e) {
        if (!window.typingTestActive) return;

        // Always pass Ctrl+K to command palette
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') return;

        const key     = e.key;
        const isAlt   = e.altKey;
        const isCtrl  = e.ctrlKey || e.metaKey;

        // ── Alt+Space → pause / resume ──────────────────────
        if (isAlt && (key === ' ' || key === 'Spacebar')) {
            e.preventDefault(); e.stopImmediatePropagation();
            if (state === 'running')           pauseTest();
            else if (state === 'paused')       startRunning();
            else if (state === 'idle')         { ttWords = buildWordList(); renderWords(); startRunning(); }
            return;
        }

        // ── Alt+X → stop / close ────────────────────────────
        if (isAlt && (key === 'x' || key === 'X')) {
            e.preventDefault(); e.stopImmediatePropagation();
            if (state === 'running' || state === 'paused') finishTest();
            else if (state === 'finished')     initTest();
            return;
        }

        // ── Escape → pause / resume (convenience) ──────────
        if (key === 'Escape') {
            e.preventDefault(); e.stopImmediatePropagation();
            if (state === 'running')     pauseTest();
            else if (state === 'paused') startRunning();
            return;
        }

        // ── Enter → start / resume / restart ────────────────
        if (key === 'Enter') {
            e.preventDefault(); e.stopImmediatePropagation();
            if (state === 'idle')        { ttWords = buildWordList(); renderWords(); startRunning(); }
            else if (state === 'paused') startRunning();
            else if (state === 'finished') initTest();
            // state === 'running' → ignore Enter (prevent accidental restart)
            return;
        }

        // ── Only handle typing keys while RUNNING ───────────
        if (state !== 'running') return;

        if (key === ' ' || key === 'Spacebar') {
            e.preventDefault(); e.stopImmediatePropagation();
            advanceWord();
            return;
        }
        if (key === 'Backspace') {
            e.preventDefault(); e.stopImmediatePropagation();
            handleBackspace();
            return;
        }
        if (key === 'Tab') {
            e.preventDefault(); e.stopImmediatePropagation();
            advanceWord();
            return;
        }
        if (key.length === 1 && !isCtrl && !isAlt) {
            e.stopImmediatePropagation();
            handleChar(key);
        }
    }, true); // capture phase

    // ════════════════════════════════════════════════════════
    // HOOK DRILL BUTTONS (capture phase — before speed.js onclick)
    // ════════════════════════════════════════════════════════
    function hookDrillButtons() {
        const pauseBtn  = document.getElementById('btn-drill-pause');
        const stopBtn   = document.getElementById('btn-drill-stop');
        const resumeBtn = document.getElementById('btn-drill-resume');

        if (pauseBtn) {
            pauseBtn.addEventListener('click', (e) => {
                if (!window.typingTestActive) return;
                e.stopImmediatePropagation();
                if (state === 'idle')     { ttWords = buildWordList(); renderWords(); startRunning(); }
                else if (state === 'running')  pauseTest();
                else if (state === 'paused')   startRunning();
                else if (state === 'finished') initTest();
            }, true);
        }

        if (stopBtn) {
            stopBtn.addEventListener('click', (e) => {
                if (!window.typingTestActive) return;
                e.stopImmediatePropagation();
                if (state === 'running' || state === 'paused') finishTest();
                else if (state === 'finished') initTest();
            }, true);
        }

        if (resumeBtn) {
            resumeBtn.addEventListener('click', (e) => {
                if (!window.typingTestActive) return;
                e.stopImmediatePropagation();
                startRunning();
            }, true);
        }
    }

    // ════════════════════════════════════════════════════════
    // TAB SWITCH — capture phase, before speed.js bubble onclick
    // ════════════════════════════════════════════════════════
    function hookSpeedTabs() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.speed-tab-btn');
            if (!btn) return;
            const mode = btn.dataset.mode;

            if (mode === 'typingTest') {
                // Stop any running drill
                if (window.drillIsPlaying) {
                    window.drillIsPlaying = false;
                    if (window.resetDrillSession) window.resetDrillSession();
                }

                // ── Tab highlight (same as other drill tabs) ──────
                document.querySelectorAll('.speed-tab-btn')
                    .forEach(t => t.classList.remove('active-nav-tab'));
                btn.classList.add('active-nav-tab');

                window.typingTestActive = true;

                // Hide level select — no badge replacement needed
                const levelSel = document.getElementById('select-maths-level');
                if (levelSel) levelSel.style.display = 'none';

                // Init typing test
                initTest();

                // Prevent speed.js from also handling this click
                e.stopImmediatePropagation();

            } else if (window.typingTestActive) {
                // LEAVING typing test — clean up, then let speed.js handle
                teardown();
                // Don't stop propagation — speed.js needs to process this click
            }
        }, true);
    }

    // ════════════════════════════════════════════════════════
    // INIT
    // ════════════════════════════════════════════════════════
    function init() {
        hookDrillButtons();
        hookSpeedTabs();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.typingTestTeardown = teardown;
    window.typingTestInit     = initTest;

})();
