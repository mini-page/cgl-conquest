// ============================================================
// Typing Test — integrated into unified-drill-card
// State machine: IDLE → RUNNING → PAUSED → FINISHED
// Properly hooks speed.js's onclick system; cleans up on tab switch
// ============================================================
(function () {
    'use strict';

    // ════════════════════════════════════════════════════════
    // GLOBAL FLAGS (read by navigation.js to block shortcuts)
    // ════════════════════════════════════════════════════════
    window.typingTestActive   = false; // true while typing tab is selected
    window.inputCaptureLocked = false; // true only while RUNNING (keys go to typing test)

    // ════════════════════════════════════════════════════════
    // CURATED SSC CGL / COMPETITIVE EXAM WORD DATASET
    // Sources: Merriam-Webster misspelled list (public domain),
    //          Oxford 3000/5000, GRE high-frequency, SAT vocab,
    //          SSC CGL/CHSL/CPO, Banking, UPSC, editorial vocab
    // ════════════════════════════════════════════════════════
    const WORD_DATA = {
        words: [
            // — Commonly misspelled (Merriam-Webster public list) —
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
            // — SSC CGL / CHSL / CPO vocabulary —
            "abdicate","abridge","abscond","abstain","abundance","accelerate",
            "accessible","accomplice","accountable","accumulate","acquaintance",
            "acquiesce","acquit","adamant","adherence","adjacent","administer",
            "admissible","adolescent","adverse","affidavit","aggravate",
            "aggression","aggrieve","alacrity","allegiance","alleviate",
            "allude","ambiguous","amendment","amicable","amnesty","analogous",
            "anarchy","annotate","annihilate","anonymous","antagonize",
            "antiquated","apparatus","apprehend","approximate","arbitrary",
            "arduous","articulate","ascertain","assessment","assiduous",
            "audacious","auspicious","autonomous","avarice",
            "bankruptcy","benevolent","bureaucracy","bilateral","benchmark",
            "beneficiary","belligerent","bequeath","blasphemy","brazenness",
            "catastrophe","categorical","cautious","circumspect","clemency",
            "coalition","coercion","coherent","collaborate","commemorate",
            "commission","commitment","committee","competence","complacent",
            "complement","compliance","conscience","consecutive","consolidate",
            "conspire","constituency","contemptuous","contentious","contradict",
            "conviction","corruption","counterfeit","cynicism",
            "declaration","deliberately","democracy","denomination","deferential",
            "deficiency","delinquent","despondent","detention","deteriorate",
            "devastation","dilapidated","diligently","diplomacy","discipline",
            "discrepancy","discrimination","disparity","disposition","disseminate",
            "distortion","documentation","dominance","duration",
            "eccentric","economy","egregious","elaborately","eligible",
            "eloquent","embarrassment","embezzlement","eminent","empathy",
            "emphasis","enumerate","entrepreneur","ephemeral","equivocal",
            "essential","exaggerate","exonerate","expenditure","exploitation",
            "facilitate","feasibility","fervent","fiduciary","flourishing",
            "formidable","fraudulent","fundamental","fiscal",
            "governance","grievance","guarantee","government","gratuitous",
            "gregarious","gullible",
            "harassment","hierarchy","hypothesis","heinous","hesitant",
            "ignorance","illegitimate","impartial","impeccable","implication",
            "impunity","inadvertent","indispensable","indigenous","inevitable",
            "infrastructure","innuendo","integrity","intelligible","irrelevant",
            "jeopardize","journalism","judiciary","justification",
            "laudable","legislation","legitimate","lucrative","litigant",
            "malicious","mandatory","manipulation","menace","miscellaneous",
            "misdemeanor","monopoly","municipal",
            "negotiation","negligence","nuisance","notorious",
            "obsequious","omnipotent","ominous","opposition","ordinance",
            "parliament","perseverance","plausible","prejudice","preliminary",
            "prerogative","prohibition","proliferation","propaganda","proprietor",
            "prosecution","protocol","provocation","provisional",
            "questionnaire","quintessential",
            "ratification","recklessness","reconcile","referendum","relevance",
            "remuneration","reputation","resilience","retaliation","revelation",
            "rhetoric","rigorous",
            "sabotage","scrutiny","sovereignty","stringent","subordinate",
            "subsidy","surveillance","susceptible","sustainable","systematic",
            "transparency","tribunal","tyranny",
            "unanimous","undermining","unforeseen","unilateral","unprecedented",
            "vandalism","vigilance","vulnerable","vindictive","warranted",
            "widespread","zealous",
            // — GRE high-frequency (public domain) —
            "aberrant","abeyance","abhorrent","abjure","abstemious",
            "accolade","acrimony","adulterate","adumbrate","affable",
            "amalgam","ameliorate","amiable","amorphous","anachronism",
            "apathy","approbation","arcane","ardor","arid","ascetic",
            "assuage","atrophy","austere","axiomatic",
            "bellicose","bombastic","burgeon",
            "cacophony","capricious","censure","chicanery","circuitous",
            "cogent","commensurate","convoluted","credulity","culpable",
            "decorum","deference","denigrate","desultory","didactic",
            "diffident","dilatory","discern","disparate","dogmatic","dubious",
            "ebullience","effrontery","elusive","enervate","enigmatic",
            "equanimity","erroneous","esoteric","ethereal","evasion",
            "exacerbate","exorbitant","expedient","exuberance",
            "fallacious","fastidious","flagrant","fortuitous","frugality",
            "garrulous","guile","hackneyed","hamper","harangue","hegemony","hubris",
            "idiosyncrasy","ignominious","impertinent","implacable","impudence",
            "incisive","incongruous","indelible","indolent","ineffable",
            "ingenious","inimical","insidious","insipid","intrepid",
            "lament","languid","laud","loquacious","lucid",
            "magnanimous","malevolent","meticulous","mitigate","mundane",
            "nefarious","nostalgia","nonchalant",
            "obdurate","oblivion","obstinate","ostentatious",
            "panacea","paradox","parochial","partisan","pedantic","perfidious",
            "perfunctory","perspicacious","pertinent","philanthropy","placid",
            "poignant","pragmatic","precipitate","presumptuous","prodigal",
            "profligate","profound","prudent",
            "querulous","quixotic",
            "reticent","sagacious","sanctimonious","sardonic","skeptical",
            "solicit","somnolent","spurious","stagnant","steadfast",
            "stoic","submissive","superficial","taciturn","tenacious",
            "tirade","trite","turbulent","ubiquitous","unequivocal",
            "verbose","veracious","volatile","waver","whimsical",
            // — Banking / Finance / Economy —
            "amortization","arbitrage","collateral","commodity","consortium",
            "covenant","depreciation","derivative","divestiture","dividend",
            "embezzle","equilibrium","foreclosure","hypothecation","inflation",
            "insolvency","leverage","liquidity","maturity","monetization",
            "moratorium","mortgage","nationalization","privatization","recession",
            "refinancing","remittance","securitization","speculation","stagflation",
            "subvention","solvency","underwriting","valuation","withholding",
            // — Government / Legal / Constitutional —
            "abdication","adjudication","affirmative","allegation","annexation",
            "arbitration","benevolence","bureaucrat","centralization","charter",
            "codification","compulsion","confederation","contempt","dissolution",
            "emolument","extradition","federation","felony","franchise",
            "gubernatorial","habeas","immunity","impeachment","incarceration",
            "indemnity","injunction","intestate","misappropriation","ordinance",
            "perjury","promulgate","ratify","reprimand","sanction","sedition",
            "statute","subpoena","suffrage","testimony","treason","verdict",
            // — Academic / Editorial —
            "absolutism","accreditation","advocacy","affluence","alienation",
            "ambivalence","archeology","assimilation","authoritarian","capitulation",
            "catalyst","chronological","circumvent","civilization","coexistence",
            "colonialism","compromise","connotation","contemporary","correlation",
            "cosmopolitan","credibility","critique","culmination","deforestation",
            "deliberation","demographic","diaspora","discourse","dissension",
            "diversification","dogmatism","egalitarian","elitism","empirical",
            "endorsement","enumeration","epidemic","erosion","evaluation",
            "exclusion","exploitation","extremism","globalization","ideology",
            "illiteracy","imbalance","implementation","incitement","indoctrination",
            "inequality","insurgency","intervention","liberalization",
            "marginalization","migration","militarism","mobilization","modernization",
            "nationalism","neutrality","objectivity","oppression","polarization",
            "pragmatism","progressivism","protectionism","radicalism","rationalism",
            "reconciliation","reformation","regionalism","rehabilitation",
            "secularism","segregation","solidarity","suppression","symbolism",
            "terrorism","tolerance","totalitarianism","traditionalism","tribalism",
            "universalism","urbanization","utilitarianism",
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
            "documentation of historical records is vital for archival and research purposes",
            "meticulous planning and coordinated implementation led to the project completion on schedule",
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
            "1 2 3","4 5 6","7 8 9","12 15 18","16 20 24","21 28 35",
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
    // States: 'idle' | 'running' | 'paused' | 'finished'
    let state     = 'idle';
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

    // ════════════════════════════════════════════════════════
    // INJECT UI into drill-interactive-area
    // We inject ONCE when tab is selected; clear when leaving.
    // ════════════════════════════════════════════════════════
    const INJECT_ID = 'tt-root';

    function injectUI() {
        const area = document.getElementById('drill-interactive-area');
        if (!area) return;

        // Clear previous
        const old = document.getElementById(INJECT_ID);
        if (old) old.remove();

        area.innerHTML = `
        <div id="${INJECT_ID}">

          <!-- Mode + Time row -->
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div class="flex items-center gap-0.5 bg-white/5 border border-white/5 rounded-xl p-0.5">
              <button class="tt-mode-btn ${ttMode==='words'?'tt-mode-active':''}" data-tt-mode="words">
                <i class="fa-solid fa-font mr-1 text-[10px]"></i>Words
              </button>
              <button class="tt-mode-btn ${ttMode==='sentences'?'tt-mode-active':''}" data-tt-mode="sentences">
                <i class="fa-solid fa-align-left mr-1 text-[10px]"></i>Sentences
              </button>
              <button class="tt-mode-btn ${ttMode==='numbers'?'tt-mode-active':''}" data-tt-mode="numbers">
                <i class="fa-solid fa-hashtag mr-1 text-[10px]"></i>Numbers
              </button>
            </div>
            <div class="flex items-center gap-0.5 bg-white/5 border border-white/5 rounded-xl p-0.5">
              <button class="tt-time-btn ${ttTime===15?'tt-time-active':''}" data-tt-time="15">15s</button>
              <button class="tt-time-btn ${ttTime===30?'tt-time-active':''}" data-tt-time="30">30s</button>
              <button class="tt-time-btn ${ttTime===60?'tt-time-active':''}" data-tt-time="60">60s</button>
              <button class="tt-time-btn ${ttTime===120?'tt-time-active':''}" data-tt-time="120">120s</button>
            </div>
          </div>

          <!-- Live stats strip -->
          <div class="flex items-center justify-center gap-8 font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
            <span><span id="tt-wpm" class="text-accentCyan text-sm font-extrabold">—</span> WPM</span>
            <span class="text-lg font-extrabold text-accentAmber" id="tt-timer-val">${ttTime}</span>
            <span><span id="tt-acc" class="text-accentGreen text-sm font-extrabold">—</span> ACC</span>
          </div>

          <!-- Fixed-height viewport — shows ~3 lines, programmatic scroll -->
          <div class="tt-viewport" id="tt-viewport">
            <!-- Word display (scrolled via marginTop) -->
            <div id="tt-words-display" class="tt-words-wrap font-mono text-lg sm:text-xl leading-loose tracking-wide"></div>

            <!-- IDLE overlay -->
            <div id="tt-idle-overlay" class="tt-overlay">
              <i class="fa-solid fa-keyboard text-2xl text-accentAmber opacity-60"></i>
              <p class="text-xs text-gray-300 font-bold uppercase tracking-widest">Start typing to begin</p>
              <p class="text-[10px] text-gray-500">or click <strong>Start</strong> · <kbd class="bg-white/10 px-1 py-0.5 rounded border border-white/10 text-white font-mono text-[9px]">Enter</kbd> to restart</p>
            </div>

            <!-- RESULTS overlay (hidden until finished) -->
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
              <p class="text-[10px] text-gray-500 mt-1">
                <kbd class="bg-white/10 px-1 py-0.5 rounded border border-white/10 text-white font-mono text-[9px]">Enter</kbd> restart ·
                <kbd class="bg-white/10 px-1 py-0.5 rounded border border-white/10 text-white font-mono text-[9px]">X</kbd> close
              </p>
            </div>
          </div>

        </div>`;

        // Wire mode/time buttons
        document.querySelectorAll('.tt-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (ttMode === btn.dataset.ttMode) return;
                ttMode = btn.dataset.ttMode;
                initTest(); // rebuild words + reset
            });
        });
        document.querySelectorAll('.tt-time-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                ttTime = parseInt(btn.dataset.ttTime, 10);
                initTest();
            });
        });

        // Click anywhere in viewport while idle → focus (let keydown capture)
        const vp = document.getElementById('tt-viewport');
        if (vp) vp.addEventListener('click', () => {
            if (state === 'idle' || state === 'running') document.body.focus();
        });
    }

    // Restore original drill-interactive-area HTML exactly as it was
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
    // CURSOR + SCROLL
    // Keep current word always in top-half of the 200px viewport.
    // We shift tt-words-display up via negative marginTop.
    // ════════════════════════════════════════════════════════
    function updateCursor() {
        // Remove old marks
        document.querySelectorAll('#tt-words-display .tt-letter.current').forEach(e => e.classList.remove('current'));

        const wEl = getWordEl(ttWordIdx);
        if (!wEl) return;

        // Mark current letter
        const letters = wEl.querySelectorAll('.tt-letter');
        const target  = letters[ttLetIdx] || letters[letters.length - 1];
        if (target) target.classList.add('current');

        // Scroll: shift words-display up so current word sits at top of viewport
        const display  = document.getElementById('tt-words-display');
        const viewport = document.getElementById('tt-viewport');
        if (!display || !viewport) return;

        const vpTop    = viewport.getBoundingClientRect().top;
        const wordTop  = wEl.getBoundingClientRect().top;
        const lineH    = wEl.getBoundingClientRect().height;
        const currentMargin = parseInt(display.style.marginTop || '0', 10);
        const offset   = wordTop - vpTop;

        // If word is below 60px from viewport top, scroll up by one line
        if (offset > lineH * 1.1) {
            display.style.marginTop = (currentMargin - offset + lineH * 0.5) + 'px';
        }
    }

    function getWordEl(wi) {
        return document.querySelector(`#tt-words-display .tt-word[data-wi="${wi}"]`);
    }
    function getLetter(wi, li) {
        const w = getWordEl(wi);
        return w ? w.querySelectorAll('.tt-letter')[li] || null : null;
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
        // Reuse drill timer bar as countdown
        const fill = document.getElementById('drill-timer-fill');
        if (fill) fill.style.width = ((ttRemain / ttTime) * 100) + '%';
        // Update score/feedback slots in drill card footer
        syncScoreBar(wpm, acc);
    }

    function syncScoreBar(wpm, acc) {
        const s = document.getElementById('drill-score');
        const f = document.getElementById('drill-feedback');
        if (s) s.textContent = wpm != null ? `WPM: ${wpm}` : 'WPM: —';
        if (f) f.textContent = acc != null ? `ACC: ${acc}%` : 'ACC: —';
    }

    // ════════════════════════════════════════════════════════
    // TIMER BAR COLOR
    // ════════════════════════════════════════════════════════
    function updateTimerBarColor() {
        const fill = document.getElementById('drill-timer-fill');
        if (!fill) return;
        const pct = ttRemain / ttTime;
        if (pct > 0.5)       fill.style.backgroundColor = '';          // cyan (default)
        else if (pct > 0.2)  fill.style.backgroundColor = '#f59e0b';   // amber
        else                 fill.style.backgroundColor = '#f43f5e';   // red
    }

    // ════════════════════════════════════════════════════════
    // BUTTON LABEL HELPER
    // ════════════════════════════════════════════════════════
    function setPauseBtn(icon, label) {
        const btn = document.getElementById('btn-drill-pause');
        if (!btn) return;
        btn.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${label}</span>`;
    }

    // ════════════════════════════════════════════════════════
    // STATE TRANSITIONS
    // ════════════════════════════════════════════════════════

    // IDLE: reset everything, show idle overlay, words rendered but not started
    function initTest() {
        clearInterval(ttTimer);
        state     = 'idle';
        ttWordIdx = 0; ttLetIdx = 0;
        ttCorrect = 0; ttErrors = 0; ttTotal  = 0;
        ttRemain  = ttTime;
        window.inputCaptureLocked = false;

        ttWords = buildWordList();

        // Re-inject UI (cleanest way to reset all overlays & pills)
        injectUI();
        renderWords();
        updateCursor();

        // Reset drill timer bar
        const fill = document.getElementById('drill-timer-fill');
        if (fill) { fill.style.width = '100%'; fill.style.backgroundColor = ''; }
        const tv = document.getElementById('tt-timer-val');
        if (tv) tv.textContent = ttTime;

        setPauseBtn('fa-play', 'Start');
        // Show stop button (to allow closing at any time)
        const stopBtn = document.getElementById('btn-drill-stop');
        if (stopBtn) stopBtn.classList.remove('hidden');

        syncScoreBar(null, null);
    }

    // RUNNING: start or resume timer, hide idle overlay, lock keys
    function startRunning() {
        if (state === 'finished') return;
        state = 'running';
        window.inputCaptureLocked = true;

        // Hide idle overlay
        const io = document.getElementById('tt-idle-overlay');
        if (io) io.classList.add('hidden');
        // Hide result overlay in case of restart
        const ro = document.getElementById('tt-result-overlay');
        if (ro) { ro.classList.add('hidden'); ro.style.display = ''; }
        // Hide paused overlay
        const po = document.getElementById('drill-paused-overlay');
        if (po) po.classList.add('hidden');
        // Remove blur from area
        const area = document.getElementById('drill-interactive-area');
        if (area) area.classList.remove('blur-md');

        setPauseBtn('fa-pause', 'Pause');

        // Start countdown
        clearInterval(ttTimer);
        ttTimer = setInterval(() => {
            ttRemain = Math.max(0, ttRemain - 1);
            const tv = document.getElementById('tt-timer-val');
            if (tv) tv.textContent = ttRemain;
            updateLiveStats();
            updateTimerBarColor();
            if (ttRemain <= 0) finishTest();
        }, 1000);
    }

    // PAUSED: freeze timer, show paused overlay, unlock keys
    function pauseTest() {
        if (state !== 'running') return;
        state = 'paused';
        window.inputCaptureLocked = false;
        clearInterval(ttTimer);

        const po = document.getElementById('drill-paused-overlay');
        if (po) po.classList.remove('hidden');
        const area = document.getElementById('drill-interactive-area');
        if (area) area.classList.add('blur-md');

        setPauseBtn('fa-play', 'Resume');
    }

    // FINISHED: show results overlay, unlock keys, reset buttons
    function finishTest() {
        if (state === 'finished') return;
        state = 'finished';
        window.inputCaptureLocked = false;
        clearInterval(ttTimer);

        const { wpm, acc } = computeStats();
        const wordsTyped = Math.floor(ttCorrect / 5);

        const ro = document.getElementById('tt-result-overlay');
        if (ro) {
            document.getElementById('tt-res-wpm').textContent     = wpm;
            document.getElementById('tt-res-acc').textContent     = acc + '%';
            document.getElementById('tt-res-correct').textContent = wordsTyped;
            ro.classList.remove('hidden');
            ro.style.display = 'flex';
        }
        // Hide paused overlay if somehow showing
        const po = document.getElementById('drill-paused-overlay');
        if (po) po.classList.add('hidden');

        setPauseBtn('fa-rotate-right', 'Restart');
        syncScoreBar(wpm, acc);

        const fill = document.getElementById('drill-timer-fill');
        if (fill) fill.style.backgroundColor = '#f43f5e';
    }

    // TEARDOWN: called when leaving the typing test tab
    function teardown() {
        clearInterval(ttTimer);
        state = 'idle';
        window.typingTestActive   = false;
        window.inputCaptureLocked = false;

        // Restore level select
        const levelSel = document.getElementById('select-maths-level');
        if (levelSel) levelSel.style.display = '';
        // Remove typing label badge
        const badge = document.getElementById('tt-label-badge');
        if (badge) badge.remove();
        // Hide stop button (speed.js manages this)
        const stopBtn = document.getElementById('btn-drill-stop');
        if (stopBtn) stopBtn.classList.add('hidden');
        // Restore pause button
        setPauseBtn('fa-play', 'Start');
        // Remove blur
        const area = document.getElementById('drill-interactive-area');
        if (area) area.classList.remove('blur-md');
        // Hide pause overlay
        const po = document.getElementById('drill-paused-overlay');
        if (po) po.classList.add('hidden');
        // Reset timer bar
        const fill = document.getElementById('drill-timer-fill');
        if (fill) { fill.style.width = '100%'; fill.style.backgroundColor = ''; }
        // Restore original drill area HTML (speed.js expects drill-question-label etc.)
        restoreArea();
    }

    // ════════════════════════════════════════════════════════
    // KEYDOWN HANDLER — capture phase (runs before navigation.js)
    // ════════════════════════════════════════════════════════
    document.addEventListener('keydown', function (e) {
        if (!window.typingTestActive) return;

        // Always allow Ctrl+K (command palette)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') return;
        // Allow Escape to pause/close (handled below)

        const key = e.key;

        if (key === 'Escape') {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (state === 'running') pauseTest();
            else if (state === 'paused') startRunning();
            return;
        }

        if (key === 'Enter') {
            e.preventDefault();
            e.stopImmediatePropagation();
            initTest();
            return;
        }

        // Only process typing keys when running
        if (state !== 'running') return;

        // Block space from triggering drill pause in navigation.js / speed.js
        if (key === ' ' || key === 'Spacebar') {
            e.preventDefault();
            e.stopImmediatePropagation();
            advanceWord();
            return;
        }

        if (key === 'Backspace') {
            e.preventDefault();
            e.stopImmediatePropagation();
            handleBackspace();
            return;
        }

        if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.stopImmediatePropagation();
            // First real key auto-starts
            if (state === 'idle') { startRunning(); }
            handleChar(key);
        }
    }, true); // CAPTURE phase — runs before speed.js / navigation.js bubble handlers

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
        if (ttLetIdx === 0) return; // must type at least one char before advancing
        const wEl = getWordEl(ttWordIdx);
        if (wEl) {
            // Mark any untyped letters as skipped-incorrect
            const letters = wEl.querySelectorAll('.tt-letter');
            let allCorrect = true;
            letters.forEach((l, i) => {
                if (i >= ttLetIdx) {
                    if (!l.classList.contains('correct')) {
                        l.classList.add('incorrect');
                        allCorrect = false;
                    }
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
    // HOOK INTO DRILL BUTTONS (set on the same onclick as speed.js,
    // but only intercepted when typingTestActive)
    // ════════════════════════════════════════════════════════
    function hookDrillButtons() {
        const pauseBtn = document.getElementById('btn-drill-pause');
        const stopBtn  = document.getElementById('btn-drill-stop');
        const resumeBtn = document.getElementById('btn-drill-resume');

        if (pauseBtn) {
            const origOnclick = pauseBtn.onclick;
            pauseBtn.addEventListener('click', (e) => {
                if (!window.typingTestActive) return; // let speed.js handle
                e.stopImmediatePropagation();
                if (state === 'idle')    { ttWords = buildWordList(); renderWords(); startRunning(); }
                else if (state === 'running')  pauseTest();
                else if (state === 'paused')   startRunning();
                else if (state === 'finished') initTest();
            }, true); // capture — runs before speed.js's onclick
        }

        if (stopBtn) {
            stopBtn.addEventListener('click', (e) => {
                if (!window.typingTestActive) return;
                e.stopImmediatePropagation();
                if (state === 'running' || state === 'paused') {
                    finishTest();
                } else if (state === 'finished') {
                    // Already showing results — just reset
                    initTest();
                }
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
    // TAB SWITCH — intercept BEFORE speed.js's onclick
    // ════════════════════════════════════════════════════════
    function hookSpeedTabs() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.speed-tab-btn');
            if (!btn) return;

            const mode = btn.dataset.mode;

            if (mode === 'typingTest') {
                // ENTERING typing test mode
                // Stop any running speed drill first
                if (window.drillIsPlaying) {
                    window.drillIsPlaying = false;
                    if (window.resetDrillSession) window.resetDrillSession();
                }

                window.typingTestActive = true;

                // Swap difficulty selector with typing badge
                const levelSel = document.getElementById('select-maths-level');
                if (levelSel) levelSel.style.display = 'none';
                const levelParent = levelSel?.parentElement;
                if (levelParent && !document.getElementById('tt-label-badge')) {
                    const badge = document.createElement('span');
                    badge.id = 'tt-label-badge';
                    badge.className = 'text-[11px] font-extrabold text-accentAmber uppercase tracking-widest flex items-center gap-1.5 select-none';
                    badge.innerHTML = '<i class="fa-solid fa-keyboard"></i> Typing Test';
                    levelParent.appendChild(badge);
                } else if (document.getElementById('tt-label-badge')) {
                    document.getElementById('tt-label-badge').style.display = '';
                }

                // Initialize test (injects UI, renders words)
                initTest();

                // Stop propagation so speed.js doesn't also handle this click
                e.stopImmediatePropagation();

            } else if (window.typingTestActive) {
                // LEAVING typing test — clean up first, then let speed.js handle
                teardown();
                // Don't stop propagation: let speed.js onclick fire normally
            }
        }, true); // capture — runs before speed.js bubble onclick
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

    // Public API
    window.typingTestTeardown = teardown;
    window.typingTestInit     = initTest;

})();
