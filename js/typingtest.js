// ============================================================
// Typing Test — integrates into unified-drill-card
// Dataset: 1000+ curated SSC CGL / competitive exam words
// ============================================================
(function () {
    'use strict';

    // ── Active guard ────────────────────────────────────────
    window.typingTestActive = false;

    // ════════════════════════════════════════════════════════
    // CURATED DATASET  (public domain / educational sources)
    // Sources: Merriam-Webster misspelled list, Oxford 3000/5000
    //          GRE high-frequency, SAT vocab, SSC CGL/CHSL/CPO
    //          Banking, UPSC, government terminology, editorials
    // ════════════════════════════════════════════════════════
    const WORD_DATA = {

        // ── WORDS mode ──────────────────────────────────────
        words: [
            // A — commonly misspelled / SSC vocab
            "aberrant","abeyance","abhorrent","abjure","abscond","abstemious",
            "abundance","accelerate","accessible","accommodate","accomplice",
            "accountable","accumulate","acquaintance","acquiesce","acquit",
            "adamant","adherence","adjacent","administer","admissible",
            "adolescent","adverse","affidavit","aggravate","aggression",
            "aggrieve","alacrity","allegiance","alleviate","allude","ambiguous",
            "amendment","amicable","amnesty","analogous","anarchy","annotate",
            "annihilate","anonymous","antagonize","antiquated","apparatus",
            "apprehend","approximate","arbitrary","arduous","articulate",
            "ascertain","assiduously","assessment","assiduous","audacious",
            "auspicious","autonomous","auxiliary","avenge","avarice",
            // B
            "bankruptcy","benevolent","bureaucracy","bilateral","benchmark",
            "beneficiary","belligerent","bequeath","blasphemy","brazenness",
            // C
            "catastrophe","categorical","cautious","census","ceremony",
            "circumspect","clemency","coalition","coercion","coherent",
            "collaborate","commemorate","commission","commitment","committee",
            "competence","complacent","complement","compliance","conscience",
            "conscientious","consecutive","consensus","consolidate","conspire",
            "constituency","contemptuous","contentious","contradict","conviction",
            "corruption","counterfeit","curriculum","cynicism",
            // D
            "declaration","deliberately","democracy","denomination","deferential",
            "deficiency","delinquent","despondent","detention","deteriorate",
            "devastation","dilapidated","diligently","diplomacy","discipline",
            "discrepancy","discrimination","disparity","disposition","disseminate",
            "distortion","documentation","dominance","duration",
            // E
            "eccentric","economy","egregious","elaborately","eligible",
            "eloquent","embarrassment","embezzlement","eminent","empathy",
            "emphasis","enumerate","entrepreneur","ephemeral","equivocal",
            "essential","exaggerate","examination","excellence","exemplary",
            "exhaustive","exhibition","exonerate","expenditure","exploitation",
            // F
            "facilitate","feasibility","fervent","fiduciary","flourishing",
            "formidable","fraudulent","fundamental","fiscal",
            // G
            "governance","grievance","guarantee","government","gratuitous",
            "gregarious","gullible",
            // H
            "harassment","hierarchy","hypothesis","heinous","hemorrhage",
            "hesitant","horizontal",
            // I
            "ignorance","illegitimate","impartial","impeccable","implication",
            "impunity","inadvertent","indispensable","indigenous","inevitable",
            "inferences","infrastructure","innuendo","integrity","intelligible",
            "irrelevant","jurisdiction",
            // J
            "jeopardize","journalism","judiciary","jurisdiction","justification",
            // K
            "knowledge",
            // L
            "laudable","legislation","legitimate","lucrative","litigant",
            "lingering",
            // M
            "maintenance","malicious","mandatory","manipulation","menace",
            "millennium","miscellaneous","misdemeanor","monopoly","municipal",
            // N
            "negotiation","negligence","nuisance","notorious",
            // O
            "obsequious","occasionally","omnipotent","ominous","opposition",
            "ordinance","ostracize",
            // P
            "parliament","perseverance","plausible","prejudice","preliminary",
            "prerogative","prohibition","proliferation","propaganda","proprietor",
            "prosecution","protocol","provocation","provisional",
            // Q
            "questionnaire","quintessential",
            // R
            "ratification","recklessness","reconcile","referendum","relevance",
            "remuneration","reputation","resilience","retaliation","revelation",
            "rhetoric","rigorous",
            // S
            "sabotage","scrutiny","separate","sovereignty","stringent",
            "subordinate","subsidy","supersede","surveillance","susceptible",
            "sustainable","systematic",
            // T
            "transparency","tyranny","threshold","tribunal",
            // U
            "unanimous","undermining","unforeseen","unilateral","unjustifiable",
            "unprecedented","usurpation",
            // V
            "vacuum","vandalism","vigilance","vulnerable","vindictive",
            // W — Z
            "warranted","widespread","zealous",

            // ── GRE / SAT high-frequency (public domain) ──
            "accolade","acrimony","adulterate","adumbrate","affable",
            "amalgam","ameliorate","amiable","amorphous","anachronism",
            "apathy","approbation","arcane","ardor","arid","ascetic",
            "assuage","atrophy","austere","axiomatic",
            "bellicose","bombastic","burgeon",
            "cacophony","capricious","censure","chicanery","circuitous",
            "cogent","commensurate","construe","convoluted","credulity",
            "culpable","debilitating","decorum","deference","denigrate",
            "desultory","didactic","diffident","dilatory","discern",
            "disparate","dogmatic","dubious",
            "ebullience","effrontery","elusive","enervate","enigmatic",
            "equanimity","erroneous","esoteric","ethereal","evasion",
            "exacerbate","exemplify","exhausting","exorbitant","expedient",
            "explicit","exuberance",
            "fallacious","fastidious","flagrant","fortuitous","frugality",
            "garrulous","gratuitous","guile",
            "hackneyed","hamper","harangue","hegemony","hubris",
            "idiosyncrasy","ignominious","impertinent","implacable","implicate",
            "impudence","incisive","incongruous","indelible","indolent",
            "indulgent","ineffable","ingenious","inimical","inquisitive",
            "insidious","insipid","intrepid","invincible","ironic",
            "lament","languid","laud","loquacious","lucid",
            "magnanimous","malevolent","meticulous","mitigate","mundane",
            "nefarious","nostalgia","nonchalant",
            "obdurate","oblivion","obstinate","obtuse","opaque","ostentatious",
            "panacea","paradox","parochial","partisan","pedantic","perfidious",
            "perfunctory","perspicacious","pertinent","philanthropy","placid",
            "poignant","pragmatic","precipitate","presumptuous","prodigal",
            "profligate","profound","prudent",
            "querulous","quixotic",
            "reticent","sagacious","sanctimonious","sardonic","skeptical",
            "solicit","somnolent","spurious","stagnant","steadfast",
            "stoic","stubborn","submissive","superficial","surpass",
            "taciturn","tenacious","tirade","trite","turbulent",
            "ubiquitous","unequivocal","verbose","veracious","volatile",
            "waver","whimsical",

            // ── Banking / Finance / Economy ──
            "amortization","arbitrage","collateral","commodity","compliance",
            "consortium","covenant","depreciation","derivative","divestiture",
            "dividend","embezzle","equilibrium","foreclosure","hedge",
            "hypothecation","inflation","insolvency","leverage","liquidity",
            "maturity","monetization","moratorium","mortgage","nationalization",
            "privatization","recession","refinancing","remittance","securitization",
            "speculation","stagflation","subvention","solvency","underwriting",
            "valuation","volatility","withholding",

            // ── Government / Legal / Constitutional ──
            "abdication","acquiescence","adjudication","affirmative","allegation",
            "annexation","arbitration","autonomy","benevolence","bureaucrat",
            "cabinet","censorship","centralization","charter","codification",
            "colonial","compulsion","confederation","contempt","delegated",
            "dissolution","dominion","emolument","extradition","federation",
            "felony","franchise","gubernatorial","habeas","immunity",
            "impeachment","incarceration","indemnity","injunction","inquisition",
            "intestate","judicial","legislative","misappropriation","municipal",
            "ordinance","perjury","preambulate","promulgate","ratify",
            "reprimand","sanction","sedition","sovereignty","statute",
            "subpoena","suffrage","testimony","treason","verdict",

            // ── Academic / Editorial / Newspaper vocab ──
            "absolutism","academia","accreditation","advocacy","affluence",
            "aggrandizement","alienation","ambivalence","annexation","aphorism",
            "archeology","assimilation","authoritarian","capitulation","catalyst",
            "chronological","circumvent","civilization","coexistence","coherence",
            "colonialism","compromise","connotation","contemporary","correlation",
            "cosmopolitan","credibility","critique","culmination","deforestation",
            "deliberation","demographic","denomination","deterioration","diaspora",
            "discourse","dissension","dissidence","diversification","dogmatism",
            "dominion","egalitarian","elitism","empirical","endorsement",
            "enumeration","environmental","epidemic","erosion","estimation",
            "evaluation","exclusion","exploitation","extremism","facilitation",
            "federation","fundamentalism","globalization","hierarchy","ideology",
            "illiteracy","imbalance","implementation","incitement","independence",
            "indoctrination","inequality","institutionalized","insurgency",
            "intellectual","intervention","intuition","invasive","liberalization",
            "marginalization","migration","militarism","mobilization","modernization",
            "nationalism","neutrality","nonviolence","objectivity","oppression",
            "orientation","orthodoxy","paradoxical","perception","polarization",
            "pragmatism","privilege","progressivism","propaganda","protectionism",
            "radicalism","rationalism","reconciliation","reformation","regionalism",
            "rehabilitation","relativism","secularism","segregation","socialism",
            "solidarity","specialization","subjectivism","suppression","symbolism",
            "systemic","terrorism","tolerance","totalitarianism","traditionalism",
            "tribalism","universalism","urbanization","utilitarianism",

            // ── Commonly misspelled (Merriam-Webster public list) ──
            "absence","accidentally","acquire","address","amateur","argument",
            "believe","calendar","camouflage","Caribbean","cemetery",
            "changeable","colleague","completely","conscientious","correlation",
            "definitely","dilemma","embarrass","exercise","fiery",
            "foreign","forgo","forty","fulfill","gauge",
            "handkerchief","idiosyncrasy","immediately","independent","indispensable",
            "intelligence","interruption","irresistible","jewelry","liaison",
            "license","likable","management","misspell","necessary",
            "noticeable","occasion","offense","official","parameter",
            "pastime","perseverance","personnel","possession","prejudice",
            "privilege","pronunciation","publicly","questionnaire","receive",
            "recommend","referred","religious","remembrance","resistance",
            "responsible","rhythm","schedule","secretarial","sentence",
            "separate","sergeant","similar","speech","studying",
            "summary","supersede","temperature","tendency","tolerance",
            "tomorrow","tragedy","twelfth","tyranny","unanimous",
            "unnecessary","until","vacuum","vegetable","vicious",
            "weather","weird","whether","written",
        ],

        // ── SENTENCES mode ──────────────────────────────────
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
            "the incumbent government prioritized infrastructure development in rural constituencies",
            "meticulous planning and coordinated implementation led to the project completion on schedule",
            "sedition laws have historically been used to suppress legitimate political dissent",
            "the forensic audit revealed systematic misappropriation of public funds over several years",
            "the candidates must demonstrate proficiency in quantitative aptitude and logical reasoning",
            "vocabulary and comprehension skills are assessed in the english language section",
            "general awareness encompasses current affairs economics history and static general knowledge",
            "the supreme court upheld the constitutional validity of the reservation policy",
            "monetary policy decisions by the central bank influence interest rates and inflation",
            "the commissioner directed immediate remedial action against the errant officials",
            "diplomatic channels were activated to resolve the bilateral boundary disagreement",
            "the welfare scheme was restructured to ensure equitable distribution among beneficiaries",
        ],

        // ── NUMBERS mode ────────────────────────────────────
        numbers: [
            "144","256","625","1024","2048","3375","4096","6561","8000","9801",
            "10000","12321","14400","15625","17689","19600","20736","22500",
            "24649","26244","27000","28900","32400","36100","38416","40000",
            "1 2 3","4 5 6","7 8 9","12 15 18","16 20 24","21 28 35",
            "3 4 5","5 12 13","7 24 25","8 15 17","9 40 41","11 60 61",
            "20 21 29","12 35 37","13 84 85","28 45 53","33 56 65",
            "1/2","1/3","1/4","1/5","1/6","1/7","1/8","1/9","1/10","1/11",
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
    let ttMode     = 'words';
    let ttTime     = 30;
    let ttWords    = [];
    let ttWordIdx  = 0;
    let ttLetIdx   = 0;
    let ttCorrect  = 0;    // correct chars
    let ttErrors   = 0;
    let ttTotal    = 0;
    let ttStarted  = false;
    let ttFinished = false;
    let ttTimer    = null;
    let ttRemain   = 30;

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
        if (ttMode === 'sentences') return shuffle(bank).slice(0, 15);
        // repeat until 100 tokens, shuffle each pass to avoid runs
        let out = [];
        while (out.length < 100) out = out.concat(shuffle(bank));
        return out.slice(0, 100);
    }

    // ════════════════════════════════════════════════════════
    // DOM INJECTION — typed inside existing drill-card
    // ════════════════════════════════════════════════════════
    const INJECT_ID = 'tt-injected-root';

    function injectUI() {
        // Remove stale
        const old = document.getElementById(INJECT_ID);
        if (old) old.remove();

        // Slot: drill-interactive-area → replace inner content
        const area = document.getElementById('drill-interactive-area');
        if (!area) return;

        area.innerHTML = `
        <div id="${INJECT_ID}" class="flex flex-col gap-4">

          <!-- Mode + Time controls row -->
          <div class="flex flex-wrap items-center justify-between gap-2 pt-2">
            <div class="flex items-center gap-1 bg-white/5 border border-white/5 rounded-xl p-0.5">
              <button class="tt-mode-btn tt-mode-active" data-tt-mode="words">
                <i class="fa-solid fa-font mr-1"></i>Words
              </button>
              <button class="tt-mode-btn" data-tt-mode="sentences">
                <i class="fa-solid fa-align-left mr-1"></i>Sentences
              </button>
              <button class="tt-mode-btn" data-tt-mode="numbers">
                <i class="fa-solid fa-hashtag mr-1"></i>Numbers
              </button>
            </div>
            <div class="flex items-center gap-1 bg-white/5 border border-white/5 rounded-xl p-0.5">
              <button class="tt-time-btn" data-tt-time="15">15s</button>
              <button class="tt-time-btn tt-time-active" data-tt-time="30">30s</button>
              <button class="tt-time-btn" data-tt-time="60">60s</button>
              <button class="tt-time-btn" data-tt-time="120">120s</button>
            </div>
          </div>

          <!-- Live timer value (big) -->
          <div class="flex items-center justify-center gap-8 font-mono text-[11px] font-bold text-gray-500 uppercase tracking-widest">
            <span><span id="tt-wpm" class="text-accentCyan text-base font-extrabold">—</span> WPM</span>
            <span class="text-xl font-extrabold text-accentAmber" id="tt-timer-val">${ttTime}</span>
            <span><span id="tt-acc" class="text-accentGreen text-base font-extrabold">—</span> ACC</span>
          </div>

          <!-- Word display arena -->
          <div id="tt-arena" class="relative cursor-text select-none overflow-hidden min-h-[140px] flex items-center">
            <div id="tt-words-display" class="tt-words-wrap font-mono text-xl sm:text-2xl leading-loose tracking-wide w-full"></div>

            <!-- Idle overlay -->
            <div id="tt-idle-overlay" class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bgCard/80 backdrop-blur-sm rounded-xl">
              <i class="fa-solid fa-keyboard text-3xl text-accentAmber opacity-50"></i>
              <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">Start typing to begin</p>
              <p class="text-[10px] text-gray-600">Press <kbd class="bg-white/10 px-1.5 py-0.5 rounded border border-white/10 text-white font-mono">Enter</kbd> to restart</p>
            </div>

            <!-- Results overlay -->
            <div id="tt-result-overlay" class="hidden absolute inset-0 flex flex-col items-center justify-center gap-5 bg-bgCard/96 backdrop-blur-sm rounded-xl">
              <div class="flex gap-10 text-center">
                <div>
                  <p class="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">WPM</p>
                  <p id="tt-res-wpm" class="text-4xl font-heading font-extrabold text-accentCyan">—</p>
                </div>
                <div>
                  <p class="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Accuracy</p>
                  <p id="tt-res-acc" class="text-4xl font-heading font-extrabold text-accentGreen">—</p>
                </div>
                <div>
                  <p class="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Words</p>
                  <p id="tt-res-correct" class="text-4xl font-heading font-extrabold text-white">—</p>
                </div>
              </div>
              <p class="text-[10px] text-gray-500">Press <kbd class="bg-white/10 px-1.5 py-0.5 rounded border border-white/10 text-white font-mono">Enter</kbd> to restart &nbsp;|&nbsp; <kbd class="bg-white/10 px-1.5 py-0.5 rounded border border-white/10 text-white font-mono">X</kbd> to exit</p>
            </div>
          </div>
        </div>`;

        wireInjectControls();
        renderWords();
        // Swap drill-score / drill-feedback to show WPM/ACC
        updateScoreBar();
    }

    function removeUI() {
        const root = document.getElementById(INJECT_ID);
        if (root) root.remove();
        // Restore original drill area content
        const area = document.getElementById('drill-interactive-area');
        if (area) area.innerHTML = `
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
    // RENDER
    // ════════════════════════════════════════════════════════
    function renderWords() {
        const display = document.getElementById('tt-words-display');
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
            display.appendChild(wSpan);
        });
    }

    function getLetter(wi, li) {
        const wSpan = document.querySelector(`#tt-words-display .tt-word[data-wi="${wi}"]`);
        return wSpan ? wSpan.querySelectorAll('.tt-letter')[li] || null : null;
    }
    function getWordEl(wi) {
        return document.querySelector(`#tt-words-display .tt-word[data-wi="${wi}"]`);
    }

    function updateCursor() {
        document.querySelectorAll('#tt-words-display .tt-letter.current').forEach(e => e.classList.remove('current'));
        document.querySelectorAll('#tt-words-display .tt-word.active-word').forEach(e => e.classList.remove('active-word'));
        const wEl = getWordEl(ttWordIdx);
        if (wEl) {
            wEl.classList.add('active-word');
            const letters = wEl.querySelectorAll('.tt-letter');
            const target  = letters[ttLetIdx] || letters[letters.length - 1];
            if (target) target.classList.add('current');
            wEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    // ════════════════════════════════════════════════════════
    // STATS
    // ════════════════════════════════════════════════════════
    function updateLiveStats() {
        const elapsed = ttTime - ttRemain;
        const mins    = elapsed / 60;
        const wpm     = mins > 0 ? Math.round(ttCorrect / 5 / mins) : 0;
        const acc     = ttTotal > 0 ? Math.round((ttCorrect / ttTotal) * 100) : 100;
        const wpmEl   = document.getElementById('tt-wpm');
        const accEl   = document.getElementById('tt-acc');
        if (wpmEl) wpmEl.textContent = wpm;
        if (accEl) accEl.textContent = acc + '%';
        // Reuse drill timer bar as countdown progress
        const fill = document.getElementById('drill-timer-fill');
        if (fill) fill.style.width = ((ttRemain / ttTime) * 100) + '%';
        updateScoreBar(wpm, acc);
    }

    function updateScoreBar(wpm, acc) {
        const scoreEl    = document.getElementById('drill-score');
        const feedbackEl = document.getElementById('drill-feedback');
        if (scoreEl)    scoreEl.textContent    = wpm != null ? `WPM: ${wpm}` : 'WPM: —';
        if (feedbackEl) feedbackEl.textContent = acc != null ? `ACC: ${acc}%` : 'ACC: —';
    }

    // ════════════════════════════════════════════════════════
    // TIMER
    // ════════════════════════════════════════════════════════
    function startTimer() {
        ttRemain = ttTime;
        const tv = document.getElementById('tt-timer-val');
        if (tv) tv.textContent = ttRemain;
        ttTimer = setInterval(() => {
            ttRemain--;
            const tvEl = document.getElementById('tt-timer-val');
            if (tvEl) tvEl.textContent = ttRemain;
            updateLiveStats();
            if (ttRemain <= 0) finishTest();
        }, 1000);
    }

    // ════════════════════════════════════════════════════════
    // FINISH
    // ════════════════════════════════════════════════════════
    function finishTest() {
        ttFinished = true;
        clearInterval(ttTimer);
        const elapsed = ttTime;
        const wpm = Math.round(ttCorrect / 5 / (elapsed / 60));
        const acc = ttTotal > 0 ? Math.round((ttCorrect / ttTotal) * 100) : 100;
        const ro  = document.getElementById('tt-result-overlay');
        if (ro) {
            document.getElementById('tt-res-wpm').textContent     = wpm;
            document.getElementById('tt-res-acc').textContent     = acc + '%';
            document.getElementById('tt-res-correct').textContent = Math.floor(ttCorrect / 5);
            ro.classList.add('visible');
            ro.style.display = 'flex';
        }
        // Restore start button appearance
        const pauseBtn = document.getElementById('btn-drill-pause');
        if (pauseBtn) {
            pauseBtn.querySelector('i').className = 'fa-solid fa-play';
            pauseBtn.querySelector('span').textContent = 'Start';
        }
        updateScoreBar(wpm, acc);
    }

    // ════════════════════════════════════════════════════════
    // RESET
    // ════════════════════════════════════════════════════════
    function resetTest() {
        clearInterval(ttTimer);
        ttWordIdx  = 0; ttLetIdx = 0;
        ttCorrect  = 0; ttErrors = 0; ttTotal = 0;
        ttStarted  = false; ttFinished = false;
        ttRemain   = ttTime;

        // Re-inject UI fresh (clears result overlay etc.)
        injectUI();
        // Restore start button
        const pauseBtn = document.getElementById('btn-drill-pause');
        if (pauseBtn) {
            pauseBtn.querySelector('i').className = 'fa-solid fa-play';
            pauseBtn.querySelector('span').textContent = 'Start';
        }
        // Reset timer bar
        const fill = document.getElementById('drill-timer-fill');
        if (fill) { fill.style.width = '100%'; fill.style.backgroundColor = ''; }
        const tv = document.getElementById('tt-timer-val');
        if (tv) tv.textContent = ttTime;
        updateScoreBar();
        ttWords = buildWordList();
        renderWords();
    }

    // ════════════════════════════════════════════════════════
    // KEYPRESS HANDLER
    // ════════════════════════════════════════════════════════
    function handleKey(e) {
        if (!window.typingTestActive) return;
        // Don't steal from command palette
        if (document.getElementById('cmd-palette-overlay')?.classList.contains('active')) return;

        const key = e.key;

        // Enter = restart
        if (key === 'Enter') { e.preventDefault(); resetTest(); return; }

        // X = stop (exit typing test mode via existing stop button)
        if ((key === 'x' || key === 'X') && !ttStarted) return;

        // Ignore nav/modifier keys
        if (key.length > 1 && key !== 'Backspace' && key !== ' ') return;

        if (ttFinished) return;

        // First keystroke starts the test
        if (!ttStarted && key.length === 1) {
            ttStarted = true;
            const io = document.getElementById('tt-idle-overlay');
            if (io) io.style.display = 'none';
            // Update start button
            const pauseBtn = document.getElementById('btn-drill-pause');
            if (pauseBtn) {
                pauseBtn.querySelector('i').className = 'fa-solid fa-pause';
                pauseBtn.querySelector('span').textContent = 'Pause';
            }
            startTimer();
        }

        if (key === ' ') {
            e.preventDefault();
            if (!ttStarted || ttLetIdx === 0) return;
            // Advance word
            const wEl = getWordEl(ttWordIdx);
            if (wEl) {
                const letters = wEl.querySelectorAll('.tt-letter');
                letters.forEach((l, i) => {
                    if (i >= ttLetIdx && !l.classList.contains('correct') && !l.classList.contains('incorrect'))
                        l.classList.add('incorrect');
                });
                const allOk = [...letters].every(l => l.classList.contains('correct'));
                if (!allOk) wEl.classList.add('wrong-word');
            }
            ttWordIdx++;
            ttLetIdx = 0;
            if (ttWordIdx >= ttWords.length) { finishTest(); return; }
            updateCursor();
            updateLiveStats();
            return;
        }

        if (key === 'Backspace') {
            if (ttLetIdx > 0) {
                ttLetIdx--;
                const lEl = getLetter(ttWordIdx, ttLetIdx);
                if (lEl) lEl.classList.remove('correct', 'incorrect', 'current');
            }
            updateCursor();
            return;
        }

        if (key.length === 1) {
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
    }

    // ════════════════════════════════════════════════════════
    // WIRE INJECTED CONTROLS
    // ════════════════════════════════════════════════════════
    function wireInjectControls() {
        document.querySelectorAll('.tt-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (ttMode === btn.dataset.ttMode) return;
                document.querySelectorAll('.tt-mode-btn').forEach(b => b.classList.remove('tt-mode-active'));
                btn.classList.add('tt-mode-active');
                ttMode = btn.dataset.ttMode;
                ttWords = buildWordList();
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
        // Arena click → focus (not strictly needed since we intercept keydown globally)
        const arena = document.getElementById('tt-arena');
        if (arena) arena.addEventListener('click', () => {
            if (!ttFinished) document.body.focus();
        });
    }

    // ════════════════════════════════════════════════════════
    // HOOK INTO EXISTING DRILL CARD BUTTONS
    // ════════════════════════════════════════════════════════
    function hookDrillButtons() {
        // Start / Pause button — repurposed for typing test
        const pauseBtn = document.getElementById('btn-drill-pause');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                if (!window.typingTestActive) return;
                if (ttFinished) { resetTest(); return; }
                if (!ttStarted) {
                    // Manual start
                    ttStarted = true;
                    const io = document.getElementById('tt-idle-overlay');
                    if (io) io.style.display = 'none';
                    pauseBtn.querySelector('i').className = 'fa-solid fa-pause';
                    pauseBtn.querySelector('span').textContent = 'Pause';
                    ttWords = buildWordList();
                    renderWords();
                    startTimer();
                } else {
                    // Pause
                    clearInterval(ttTimer);
                    ttStarted = false;
                    pauseBtn.querySelector('i').className = 'fa-solid fa-play';
                    pauseBtn.querySelector('span').textContent = 'Resume';
                }
            });
        }

        // Stop button — reset typing test
        const stopBtn = document.getElementById('btn-drill-stop');
        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                if (!window.typingTestActive) return;
                resetTest();
            });
        }
    }

    // ════════════════════════════════════════════════════════
    // TAB SWITCH HANDLER
    // ════════════════════════════════════════════════════════
    function hookSpeedTab() {
        document.addEventListener('click', e => {
            const btn = e.target.closest('.speed-tab-btn');
            if (!btn) return;
            const mode = btn.dataset.mode;

            if (mode === 'typingTest') {
                window.typingTestActive = true;
                // Swap difficulty selector for typing test label
                const levelSel = document.getElementById('select-maths-level');
                if (levelSel) {
                    levelSel.style.display = 'none';
                    const parent = levelSel.parentElement;
                    if (!parent.querySelector('#tt-label-badge')) {
                        const badge = document.createElement('span');
                        badge.id = 'tt-label-badge';
                        badge.className = 'text-[11px] font-extrabold text-accentAmber uppercase tracking-widest flex items-center gap-1.5';
                        badge.innerHTML = '<i class="fa-solid fa-keyboard"></i> Typing Test';
                        parent.insertBefore(badge, levelSel.nextSibling);
                    } else {
                        parent.querySelector('#tt-label-badge').style.display = '';
                    }
                }
                // Show stop button
                const stopBtn = document.getElementById('btn-drill-stop');
                if (stopBtn) stopBtn.classList.remove('hidden');
                // Init
                ttWords = buildWordList();
                injectUI();
                // Reselect correct mode/time pills after inject
                document.querySelector(`.tt-mode-btn[data-tt-mode="${ttMode}"]`)?.classList.add('tt-mode-active');
                document.querySelector(`.tt-time-btn[data-tt-time="${ttTime}"]`)?.classList.add('tt-time-active');

            } else {
                // Leaving typing test
                if (window.typingTestActive) {
                    window.typingTestActive = false;
                    clearInterval(ttTimer);
                    ttStarted = false; ttFinished = false;
                    // Restore difficulty selector
                    const levelSel = document.getElementById('select-maths-level');
                    if (levelSel) levelSel.style.display = '';
                    const badge = document.getElementById('tt-label-badge');
                    if (badge) badge.style.display = 'none';
                    // Hide stop button
                    const stopBtn = document.getElementById('btn-drill-stop');
                    if (stopBtn) stopBtn.classList.add('hidden');
                    // Restore start button
                    const pauseBtn = document.getElementById('btn-drill-pause');
                    if (pauseBtn) {
                        pauseBtn.querySelector('i').className = 'fa-solid fa-play';
                        pauseBtn.querySelector('span').textContent = 'Start';
                    }
                    // Restore timer bar
                    const fill = document.getElementById('drill-timer-fill');
                    if (fill) fill.style.width = '100%';
                    removeUI();
                    // Let speed.js re-render its question
                    if (typeof window.resetDrillSession === 'function') window.resetDrillSession();
                }
            }
        });
    }

    // ════════════════════════════════════════════════════════
    // GLOBAL KEYDOWN (capture phase — before speed.js)
    // ════════════════════════════════════════════════════════
    document.addEventListener('keydown', e => {
        if (!window.typingTestActive) return;
        if (document.getElementById('cmd-palette-overlay')?.classList.contains('active')) return;
        // Block Space from triggering drill pause in speed.js
        if (e.key === ' ') e.stopImmediatePropagation();
        handleKey(e);
    }, true); // capture phase

    // ════════════════════════════════════════════════════════
    // INIT
    // ════════════════════════════════════════════════════════
    function init() {
        hookDrillButtons();
        hookSpeedTab();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.ttReset = () => { if (window.typingTestActive) resetTest(); };

})();
