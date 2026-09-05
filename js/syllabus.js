try {
  // === SYLLABUS CONSOLE MODULE ===
  // Sourced and adapted from ssc-cgl-syllabus-console_1.html for full integration

  const SUBJECT_META = {
    'Quantitative Aptitude': { shortName: 'Quantitative', icon:'📐', color:'crimson', weightagePct:28, description: 'Master Arithmetic, Algebra, Geometry, Trigonometry & Data Interpretation speed & accuracy.' },
    'General Intelligence & Reasoning': { shortName: 'Reasoning', icon:'🧠', color:'yellow', weightagePct:25, description: 'Build speed & accuracy across Verbal, Non-Verbal, Analytical & Logical Reasoning patterns.' },
    'English Language & Comprehension': { shortName: 'English', icon:'📖', color:'green', weightagePct:22, description: 'Strengthen Grammar rules, Vocabulary, Reading Comprehension, Cloze Tests & Error Spotting.' },
    'General Awareness': { shortName: 'GK/GS', icon:'🌍', color:'blue', weightagePct:25, description: 'High-yield coverage of History, Polity, Geography, Economics, General Science & Current Affairs.' },
    'Computer Knowledge': { shortName: 'Computer', icon:'💻', color:'gray', weightagePct:10, description: 'Fundamentals, Hardware, Software, Networking, Cyber Security & MS Office essential operations.' }
  };

  function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  }

  const COLOR_MAP = {
    crimson: {
      name: 'crimson',
      text: 'text-red-400',
      ring: '#f43f5e',
      border: 'border-red-500/50',
      glow: 'shadow-[0_0_24px_rgba(239,68,68,0.25)]',
      soft: 'bg-gradient-to-r from-red-950/90 via-rose-950/60 to-slate-900',
      idleCard: 'bg-gradient-to-br from-red-950/40 via-rose-950/20 to-slate-900/70 border-red-500/40 hover:border-red-400/80 shadow-[0_0_15px_rgba(239,68,68,0.12)]',
      activeCard: 'bg-gradient-to-r from-red-950/90 via-rose-950/60 to-slate-900 border-red-400 ring-1 ring-red-400 shadow-[0_0_25px_rgba(239,68,68,0.35)]',
      badge: 'bg-red-500/20 text-red-300 border border-red-500/30'
    },
    yellow: {
      name: 'yellow',
      text: 'text-yellow-400',
      ring: '#fbbf24',
      border: 'border-yellow-500/50',
      glow: 'shadow-[0_0_24px_rgba(234,179,8,0.25)]',
      soft: 'bg-gradient-to-r from-amber-950/90 via-yellow-950/60 to-slate-900',
      idleCard: 'bg-gradient-to-br from-amber-950/40 via-yellow-950/20 to-slate-900/70 border-yellow-500/40 hover:border-yellow-400/80 shadow-[0_0_15px_rgba(234,179,8,0.12)]',
      activeCard: 'bg-gradient-to-r from-amber-950/90 via-yellow-950/60 to-slate-900 border-yellow-400 ring-1 ring-yellow-400 shadow-[0_0_25px_rgba(234,179,8,0.35)]',
      badge: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
    },
    green: {
      name: 'green',
      text: 'text-emerald-400',
      ring: '#34d399',
      border: 'border-emerald-500/50',
      glow: 'shadow-[0_0_24px_rgba(16,185,129,0.25)]',
      soft: 'bg-gradient-to-r from-emerald-950/90 via-teal-950/60 to-slate-900',
      idleCard: 'bg-gradient-to-br from-emerald-950/40 via-teal-950/20 to-slate-900/70 border-emerald-500/40 hover:border-emerald-400/80 shadow-[0_0_15px_rgba(16,185,129,0.12)]',
      activeCard: 'bg-gradient-to-r from-emerald-950/90 via-teal-950/60 to-slate-900 border-emerald-400 ring-1 ring-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)]',
      badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
    },
    blue: {
      name: 'blue',
      text: 'text-blue-400',
      ring: '#60a5fa',
      border: 'border-blue-500/50',
      glow: 'shadow-[0_0_24px_rgba(59,130,246,0.25)]',
      soft: 'bg-gradient-to-r from-blue-950/90 via-indigo-950/60 to-slate-900',
      idleCard: 'bg-gradient-to-br from-blue-950/40 via-indigo-950/20 to-slate-900/70 border-blue-500/40 hover:border-blue-400/80 shadow-[0_0_15px_rgba(59,130,246,0.12)]',
      activeCard: 'bg-gradient-to-r from-blue-950/90 via-indigo-950/60 to-slate-900 border-blue-400 ring-1 ring-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.35)]',
      badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
    },
    gray: {
      name: 'gray',
      text: 'text-slate-300',
      ring: '#94a3b8',
      border: 'border-slate-500/50',
      glow: 'shadow-[0_0_24px_rgba(148,163,184,0.18)]',
      soft: 'bg-gradient-to-r from-slate-800/90 via-zinc-900/60 to-black',
      idleCard: 'bg-gradient-to-br from-slate-800/40 via-zinc-900/20 to-slate-950/70 border-slate-500/40 hover:border-slate-400/80 shadow-[0_0_15px_rgba(148,163,184,0.12)]',
      activeCard: 'bg-gradient-to-r from-slate-800/90 via-zinc-900/60 to-black border-slate-300 ring-1 ring-slate-300 shadow-[0_0_25px_rgba(148,163,184,0.25)]',
      badge: 'bg-slate-700/40 text-slate-200 border border-slate-500/40'
    },
    // Aliases
    teal: { text: 'text-red-400', ring: '#f43f5e', border: 'border-red-500/50', glow: 'shadow-[0_0_24px_rgba(239,68,68,0.25)]', soft: 'bg-gradient-to-r from-red-950/90 via-rose-950/60 to-slate-900' },
    violet: { text: 'text-yellow-400', ring: '#fbbf24', border: 'border-yellow-500/50', glow: 'shadow-[0_0_24px_rgba(234,179,8,0.25)]', soft: 'bg-gradient-to-r from-amber-950/90 via-yellow-950/60 to-slate-900' },
    amber: { text: 'text-emerald-400', ring: '#34d399', border: 'border-emerald-500/50', glow: 'shadow-[0_0_24px_rgba(16,185,129,0.25)]', soft: 'bg-gradient-to-r from-emerald-950/90 via-teal-950/60 to-slate-900' },
    rose: { text: 'text-blue-400', ring: '#60a5fa', border: 'border-blue-500/50', glow: 'shadow-[0_0_24px_rgba(59,130,246,0.25)]', soft: 'bg-gradient-to-r from-blue-950/90 via-indigo-950/60 to-slate-900' }
  };

  function buildSubjects(raw) {
    const bySubject = {};
    raw.forEach(entry => {
      const meta = SUBJECT_META[entry.subject] || { shortName: entry.subject.split(' ')[0], icon:'📘', color:'blue', weightagePct:null, description:'' };
      const subjId = slugify(entry.subject);
      if (!bySubject[subjId]) {
        bySubject[subjId] = {
          id: subjId,
          name: entry.subject,
          shortName: meta.shortName || entry.subject.split(' ')[0],
          icon: meta.icon,
          color: meta.color,
          weightagePct: meta.weightagePct,
          description: meta.description || '',
          chaptersMap: {}
        };
      }
      const subj = bySubject[subjId];
      if (!subj.chaptersMap[entry.category]) {
        subj.chaptersMap[entry.category] = [];
      }
      const items = entry.subtopics.map(st => ({
        id: st.id,
        name: st.name,
        difficulty: st.difficulty,
        weight: st.weightage,
        effort: st.effort,
        high: st.weightage === 'High',
        subjectId: subjId,
        subjectName: entry.subject,
        chapterName: entry.category,
        topicName: entry.topic,
      }));
      const groupHigh = items.some(it => it.high);
      subj.chaptersMap[entry.category].push({ name: entry.topic, high: groupHigh, items });
    });
    return Object.values(bySubject).map(s => ({
      id: s.id,
      name: s.name,
      shortName: s.shortName,
      icon: s.icon,
      color: s.color,
      weightagePct: s.weightagePct,
      description: s.description,
      chapters: Object.entries(s.chaptersMap).map(([name, groups]) => ({ name, groups })),
    }));
  }

  const SUBJECTS = buildSubjects(SYLLABUS_DATA);
  const ALL_ITEMS = SUBJECTS.flatMap(s => s.chapters.flatMap(c => c.groups.flatMap(g => g.items)));

  // Progress state integrations with global appState
  function flags(id) {
    if (!appState.syllabusProgress) {
      appState.syllabusProgress = {};
    }
    if (!appState.syllabusProgress[id]) {
      appState.syllabusProgress[id] = { learned: false, practiced: false, mastered: false };
    }
    return appState.syllabusProgress[id];
  }

  function setStage(id, stage) {
    const map = {
      new:{learned:false,practiced:false,mastered:false},
      learned:{learned:true,practiced:false,mastered:false},
      practiced:{learned:true,practiced:true,mastered:false},
      mastered:{learned:true,practiced:true,mastered:true},
    };
    appState.syllabusProgress[id] = map[stage] || map.new;
    save();
    renderAll();
  }

  // Global toggle stages
  function toggleFlag(id, key, targetEl) {
    const f = { ...flags(id) };
    f[key] = !f[key];
    if (key === 'mastered' && f.mastered) { f.learned = true; f.practiced = true; }
    if (key === 'practiced' && f.practiced) { f.learned = true; }
    if (key === 'learned' && !f.learned) { f.practiced = false; f.mastered = false; }
    if (key === 'practiced' && !f.practiced) { f.mastered = false; }
    appState.syllabusProgress[id] = f;
    save();

    // Trigger ranked confetti celebration feedback matching dashboard
    if (f[key] && window.triggerConfetti) {
      if (key === 'mastered') {
        window.triggerConfetti('high');
      } else if (key === 'practiced') {
        window.triggerConfetti('medium');
      } else if (key === 'learned') {
        window.triggerConfetti('low');
      }
    }

    if (targetEl) {
      updateTriRowDOM(id, targetEl);
    } else {
      renderAll();
    }
  }

  function updateTriRowDOM(id, targetEl) {
    const f = flags(id);
    const rowEl = targetEl.closest('.border-b, .px-4') || targetEl.parentElement;
    if (rowEl) {
      const container = rowEl.parentElement && rowEl.parentElement.classList.contains('flex-col') ? rowEl.parentElement : rowEl;
      ['learned', 'practiced', 'mastered'].forEach(flagKey => {
        const optionEl = container.querySelector(`[data-tri="${id}"][data-flag="${flagKey}"]`);
        if (optionEl) {
          const box = optionEl.querySelector('.tri-box');
          const lbl = optionEl.querySelector('span:last-child');
          if (box) {
            if (f[flagKey]) {
              box.classList.add('on');
              box.textContent = '✓';
            } else {
              box.classList.remove('on');
              box.textContent = '';
            }
          }
          if (lbl) {
            if (flagKey === 'learned') {
              lbl.className = `text-xs font-medium ${f.learned ? 'text-teal-400 font-semibold' : 'text-zinc-400 group-hover/tb:text-zinc-200'} transition`;
            } else if (flagKey === 'practiced') {
              lbl.className = `text-xs font-medium ${f.practiced ? 'text-violet-400 font-semibold' : 'text-zinc-400 group-hover/tb:text-zinc-200'} transition`;
            } else if (flagKey === 'mastered') {
              lbl.className = `text-xs font-medium ${f.mastered ? 'text-amber-400 font-semibold' : 'text-zinc-400 group-hover/tb:text-zinc-200'} transition`;
            }
          }
        }
      });
    }

    const groupCard = targetEl.closest('.border-line, .rounded-xl');
    if (groupCard) {
      const statsBadge = groupCard.querySelector('[data-gstats]');
      if (statsBadge) {
        const itemRows = groupCard.querySelectorAll('[data-tri]');
        const itemIds = new Set();
        itemRows.forEach(r => itemIds.add(r.dataset.tri));
        let doneCount = 0;
        itemIds.forEach(itemId => {
          if (flags(itemId).mastered) doneCount++;
        });
        statsBadge.textContent = `${doneCount}/${itemIds.size} Done`;
      }
    }

    renderRingDeck();
  }

  function save() {
    saveStateToStorage();
    if (typeof updateDashboardProgress === "function") {
      updateDashboardProgress();
    }
  }

  function itemStage(id) {
    const f = flags(id);
    if (f.mastered) return 'mastered';
    if (f.practiced) return 'practiced';
    if (f.learned) return 'learned';
    return 'new';
  }

  function fullyDone(id) {
    const f = flags(id);
    return f.learned && f.practiced && f.mastered;
  }

  function toggleAll(id) {
    setStage(id, fullyDone(id) ? 'new' : 'mastered');
  }

  // UI State
  let syllabusState = {
    view: 'tree',
    search: '',
    subject: '',
    chapter: '',
    difficulty: '',
    weightage: '',
    status: '',
    highOnly: false,
    weakOnly: false,
    sortBy: 'default',
    sortDir: 1,
    kanbanSearch: '',
    explorerPath: [],
    gridPath: [],
    compactPath: new Set(),
    expandedGroups: new Set(),
    openDropdown: null,
  };

  function mockWeakPill(id) {
    if (!appState.weakAlerts || !appState.weakAlerts[id]) return '';
    return `<button type="button" onclick="event.stopPropagation(); window.openMockRadarTopic('${id}')" class="inline-flex items-center gap-1.5 text-[9px] bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 hover:border-rose-400 px-2 py-0.5 rounded-full font-black uppercase tracking-wider cursor-pointer shadow-sm shadow-rose-500/10 transition group" title="Flagged in Mock Revision Radar — Click to inspect in Mock Analysis"><i class="fa-solid fa-triangle-exclamation text-rose-400 text-[8px] animate-pulse"></i><span>Weak in Mocks</span><i class="fa-solid fa-arrow-up-right-from-square text-[7px] opacity-60 group-hover:opacity-100"></i></button>`;
  }

  // Sorting Options
  const DIFF_ORDER = {Easy:0, Moderate:1, Hard:2};
  const WEIGHT_ORDER = {'High':0,'Medium':1,'Low':2};
  const STAGE_ORDER = {new:0, learned:1, practiced:2, mastered:3};

  const SORT_OPTIONS = [
    { group:'Default', opts:[{value:'default:1', label:'Syllabus Order'}] },
    { group:'Name', opts:[{value:'name:1', label:'A → Z'},{value:'name:-1', label:'Z → A'}] },
    { group:'Subject', opts:[{value:'subject:1', label:'A → Z'},{value:'subject:-1', label:'Z → A'}] },
    { group:'Difficulty', opts:[{value:'difficulty:1', label:'Easy → Hard'},{value:'difficulty:-1', label:'Hard → Easy'}] },
    { group:'Weight', opts:[{value:'weight:1', label:'High → Low'},{value:'weight:-1', label:'Low → High'}] },
    { group:'Progress', opts:[{value:'stage:-1', label:'Mastered first'},{value:'stage:1', label:'New first'}] },
  ];

  function sortItems(items) {
    if (!syllabusState.sortBy || syllabusState.sortBy === 'default') return items;
    const dir = syllabusState.sortDir;
    const arr = [...items];
    arr.sort((a,b) => {
      switch(syllabusState.sortBy) {
        case 'name': return a.name.localeCompare(b.name) * dir;
        case 'subject': return a.subjectName.localeCompare(b.subjectName) * dir;
        case 'difficulty': return (DIFF_ORDER[a.difficulty]-DIFF_ORDER[b.difficulty]) * dir;
        case 'weight': return (WEIGHT_ORDER[a.weight]-WEIGHT_ORDER[b.weight]) * dir;
        case 'stage': return (STAGE_ORDER[itemStage(a.id)]-STAGE_ORDER[itemStage(b.id)]) * dir;
        default: return 0;
      }
    });
    return arr;
  }

  function resetPaths() {
    syllabusState.explorerPath = [];
    syllabusState.gridPath = [];
    syllabusState.compactPath = new Set();
  }

  function optionRow(id, value, label, active) {
    return `<button data-dd-option="${id}" data-value="${value}" class="view-btn w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left text-xs font-medium transition cursor-pointer ${active ? 'active text-cyan-300 bg-cyan-500/20 font-semibold border border-cyan-500/30 shadow-sm' : 'text-zinc-300 hover:text-white hover:bg-white/10'}">
      <span class="truncate">${label}</span>${active ? '<span class="text-cyan-400 text-xs font-bold">✓</span>' : ''}
    </button>`;
  }

  function simpleOptionsHTML(id, opts, current) {
    return opts.map(o => optionRow(id, o.value, o.label, o.value === current)).join('');
  }

  function chapterPanelHTML() {
    if (syllabusState.subject) {
      const subj = SUBJECTS.find(s=>s.id === syllabusState.subject);
      const opts = [{value:'',label:'All Chapters'}, ...subj.chapters.map(ch=>({value:`${syllabusState.subject}|${ch.name}`, label:ch.name}))];
      return simpleOptionsHTML('chapter', opts, syllabusState.chapter);
    }
    return optionRow('chapter','','All Chapters', syllabusState.chapter==='') + SUBJECTS.map(s => `
      <p class="px-2.5 pt-2 pb-1 text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">${s.icon} ${s.name}</p>
      ${s.chapters.map(ch => optionRow('chapter', `${s.id}|${ch.name}`, ch.name, syllabusState.chapter===`${s.id}|${ch.name}`)).join('')}
    `).join('');
  }

  function sortPanelHTML() {
    const current = `${syllabusState.sortBy}:${syllabusState.sortDir}`;
    return SORT_OPTIONS.map(g => `
      <p class="px-2.5 pt-2 pb-1 text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">${g.group}</p>
      ${g.opts.map(o => optionRow('sort', o.value, o.label, o.value===current)).join('')}
    `).join('');
  }

  function getDropdownDefs() {
    const subj = SUBJECTS.find(s=>s.id === syllabusState.subject);
    const chLabel = syllabusState.chapter ? syllabusState.chapter.split('|')[1] : 'All Chapters';
    const statusLabels = {new:'Not Started', learned:'Learned', practiced:'Practiced', mastered:'Mastered'};
    return [
      { id:'subject', icon: subj ? subj.icon : '📚', label: subj ? (subj.shortName || subj.name) : 'All Subjects', active: !!syllabusState.subject,
        panelHTML: simpleOptionsHTML('subject', [{value:'',label:'All Subjects'}, ...SUBJECTS.map(s=>({value:s.id,label:`${s.icon} ${s.shortName || s.name}`}))], syllabusState.subject) },
      { id:'chapter', icon:'📂', label: chLabel, active: !!syllabusState.chapter, panelHTML: chapterPanelHTML() },
      { id:'difficulty', icon:'🎯', label: syllabusState.difficulty || 'All Difficulties', active: !!syllabusState.difficulty,
        panelHTML: simpleOptionsHTML('difficulty', [{value:'',label:'All Difficulties'},{value:'Easy',label:'Easy'},{value:'Moderate',label:'Moderate'},{value:'Hard',label:'Hard'}], syllabusState.difficulty) },
      { id:'weight', icon:'⚖️', label: syllabusState.weightage || 'All Weightages', active: !!syllabusState.weightage,
        panelHTML: simpleOptionsHTML('weight', [{value:'',label:'All Weightages'},{value:'High',label:'High Weight'},{value:'Medium',label:'Medium Weight'},{value:'Low',label:'Low Weight'}], syllabusState.weightage) },
      { id:'status', icon:'📌', label: statusLabels[syllabusState.status] || 'All Status', active: !!syllabusState.status,
        panelHTML: simpleOptionsHTML('status', [{value:'',label:'All Status'},{value:'new',label:'Not Started'},{value:'learned',label:'Learned'},{value:'practiced',label:'Practiced'},{value:'mastered',label:'Mastered'}], syllabusState.status) },
    ];
  }

  function anyFilterActive() {
    return !!(syllabusState.subject || syllabusState.chapter || syllabusState.difficulty || syllabusState.weightage || syllabusState.status || syllabusState.highOnly || syllabusState.weakOnly);
  }

  function dropdownMarkup(d) {
    const open = syllabusState.openDropdown === d.id;
    return `
    <div class="relative" data-dd-wrap="${d.id}">
      <button data-dd-btn="${d.id}" class="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm border transition cursor-pointer ${d.active ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-sm' : 'bg-panel2 border-line text-zinc-300 hover:text-white hover:border-white/30 hover:bg-white/5'}">
        <span>${d.icon}</span><span class="font-medium max-w-[130px] truncate">${d.label}</span><span class="text-[9px] opacity-60">▾</span>
      </button>
      <div data-dd-panel="${d.id}" class="${open?'':'hidden'} dropdown-panel absolute left-0 mt-2 w-64 bg-slate-900/95 border border-white/15 rounded-2xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto scrollbar-thin backdrop-blur-xl">
        ${d.panelHTML}
      </div>
    </div>`;
  }

  function buildFilterRow() {
    const wrap = document.getElementById('filter-row');
    if (!wrap) return;
    const defs = getDropdownDefs();
    const weakCount = Object.keys(appState.weakAlerts || {}).filter(k => appState.weakAlerts[k]).length;
    let weakMarkup = '';
    if (weakCount > 0) {
      weakMarkup = `<button data-toggle-weak class="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs border transition cursor-pointer ${syllabusState.weakOnly ? 'bg-rose-500/25 border-rose-500/50 text-rose-300 shadow-md shadow-rose-500/20' : 'bg-rose-500/10 border-rose-500/25 text-rose-400 hover:bg-rose-500/20'}"><i class="fa-solid fa-triangle-exclamation text-rose-400 text-[10px] animate-pulse"></i><span class="font-bold">${weakCount} Mock Weak</span></button>`;
    }
    wrap.innerHTML = defs.map(dropdownMarkup).join('')
      + `<button data-toggle-high class="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs border transition cursor-pointer ${syllabusState.highOnly ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm' : 'bg-panel2 border-line text-zinc-300 hover:text-white hover:border-white/30 hover:bg-white/5'}">⭐ <span class="font-medium">High-weight only</span></button>`
      + weakMarkup
      + (anyFilterActive() ? `<button data-clear-filters class="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition cursor-pointer">✕ Clear filters</button>` : '');
    bindFilterRow();
  }

  function bindFilterRow() {
    const wrap = document.getElementById('filter-row');
    if (!wrap) return;
    
    wrap.querySelectorAll('[data-dd-btn]').forEach(btn => btn.onclick = (e) => {
      e.stopPropagation();
      const id = btn.dataset.ddBtn;
      syllabusState.openDropdown = syllabusState.openDropdown === id ? null : id;
      refreshDropdownUI();
    });
    
    wrap.querySelectorAll('[data-dd-option]').forEach(opt => opt.onclick = (e) => {
      e.stopPropagation();
      applyFilterSelection(opt.dataset.ddOption, opt.dataset.value);
      syllabusState.openDropdown = null;
      resetPaths();
      renderAll();
    });
    
    const hi = wrap.querySelector('[data-toggle-high]');
    if (hi) hi.onclick = (e) => {
      e.stopPropagation();
      syllabusState.highOnly = !syllabusState.highOnly;
      renderAll();
    };

    const wBtn = wrap.querySelector('[data-toggle-weak]');
    if (wBtn) wBtn.onclick = (e) => {
      e.stopPropagation();
      syllabusState.weakOnly = !syllabusState.weakOnly;
      renderAll();
    };
    
    const clear = wrap.querySelector('[data-clear-filters]');
    if (clear) clear.onclick = (e) => {
      e.stopPropagation();
      syllabusState.subject = '';
      syllabusState.chapter = '';
      syllabusState.difficulty = '';
      syllabusState.weightage = '';
      syllabusState.status = '';
      syllabusState.highOnly = false;
      syllabusState.weakOnly = false;
      resetPaths();
      renderAll();
    };
  }

  function applyFilterSelection(id, value) {
    if (id === 'subject') {
      syllabusState.subject = value;
      syllabusState.chapter = '';
    } else if (id === 'chapter') {
      syllabusState.chapter = value;
      if (value) syllabusState.subject = value.split('|')[0];
    } else if (id === 'difficulty') {
      syllabusState.difficulty = value;
    } else if (id === 'weight') {
      syllabusState.weightage = value;
    } else if (id === 'status') {
      syllabusState.status = value;
    } else if (id === 'sort') {
      const [by, dir] = value.split(':');
      syllabusState.sortBy = by;
      syllabusState.sortDir = +dir;
    } else if (id === 'view') {
      syllabusState.view = value;
      initToolbar();
    }
  }

  // 6 Focused views and layouts mapping
  const VIEW_GROUPS = [
    { label:'Browse', views:[
      {id:'tree', icon:'🌲', name:'Tree Hierarchy', desc:'Full syllabus, collapsible'},
      {id:'explorer', icon:'📁', name:'Explorer', desc:'Folder-style drill down'},
      {id:'compact', icon:'▶', name:'Compact List', desc:'Ultra-minimal nested rows'},
      {id:'grid', icon:'⊞', name:'Grid / Cards', desc:'Visual overview, tap to track'},
    ]},
    { label:'Track', views:[
      {id:'kanban', icon:'🗃', name:'Kanban Board', desc:'Drag between stages'},
      {id:'table', icon:'📊', name:'Table Layout', desc:'Search, sort, tick inline'},
    ]},
  ];

  function viewPanelHTML() {
    return VIEW_GROUPS.map(g => `
      <p class="px-2.5 pt-2 pb-1 text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">${g.label}</p>
      ${g.views.map(v => `
        <button data-value="${v.id}" class="view-btn w-full flex flex-col px-3 py-2 rounded-xl text-left transition cursor-pointer ${syllabusState.view === v.id ? 'active text-cyan-300 bg-cyan-500/20 font-semibold border border-cyan-500/30 shadow-sm' : 'text-zinc-300 hover:text-white hover:bg-white/10'}">
          <div class="flex items-center gap-1.5 text-xs font-semibold">
            <span>${v.icon}</span><span>${v.name}</span>
          </div>
          <span class="text-[9px] text-zinc-400 mt-0.5">${v.desc}</span>
        </button>
      `).join('')}
    `).join('');
  }

  // Initialize Toolbar & Dynamic view widgets
  function initToolbar() {
    const searchInput = document.getElementById('syllabus-search');
    if (searchInput) {
      searchInput.value = syllabusState.search || '';
      if (!searchInput.dataset.bound) {
        searchInput.dataset.bound = "true";
        let debounceTimer;
        searchInput.addEventListener('input', e => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            syllabusState.search = e.target.value.toLowerCase();
            renderAll();
          }, 300);
        });
      }
    }
    
    // Sort Dropdown Box
    const sortWrap = document.getElementById('sort-dropdown-wrap');
    if (sortWrap) {
      sortWrap.innerHTML = `
      <div class="relative" data-dd-wrap="sort">
        <button data-dd-btn="sort" class="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm border bg-panel2 border-line text-zinc-300 hover:text-white hover:border-white/30 hover:bg-white/5 transition cursor-pointer">
          <span>↕️</span><span class="font-medium">Sort Order</span><span class="text-[9px] opacity-60">▾</span>
        </button>
        <div data-dd-panel="sort" class="hidden dropdown-panel absolute right-0 mt-2 w-56 bg-slate-900/95 border border-white/15 rounded-2xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto scrollbar-thin backdrop-blur-xl">
          ${sortPanelHTML()}
        </div>
      </div>`;
    }
    
    // View Selector Dropdown Box
    const viewWrap = document.getElementById('view-dropdown-wrap');
    if (viewWrap) {
      const activeViewDef = VIEW_GROUPS.flatMap(g=>g.views).find(v=>v.id===syllabusState.view) || {icon:'🌲', name:'Tree Hierarchy'};
      viewWrap.innerHTML = `
      <div class="relative" data-dd-wrap="view">
        <button data-dd-btn="view" class="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm border bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:border-cyan-400/60 transition cursor-pointer">
          <span>${activeViewDef.icon}</span><span class="font-medium">${activeViewDef.name}</span><span class="text-[9px] opacity-60">▾</span>
        </button>
        <div data-dd-panel="view" class="hidden dropdown-panel absolute right-0 mt-2 w-64 bg-slate-900/95 border border-white/15 rounded-2xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto scrollbar-thin backdrop-blur-xl">
          ${viewPanelHTML()}
        </div>
      </div>`;
    }
    
    // Bind events
    document.querySelectorAll('[data-dd-btn]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.dataset.ddBtn;
        syllabusState.openDropdown = syllabusState.openDropdown === id ? null : id;
        refreshDropdownUI();
      };
    });
    
    document.querySelectorAll('[data-dd-panel]').forEach(panel => {
      panel.onclick = (e) => {
        const option = e.target.closest('[data-value]');
        if (option) {
          e.stopPropagation();
          const wrapId = panel.dataset.ddPanel;
          if (wrapId === 'view') {
            applyFilterSelection('view', option.dataset.value);
          } else if (wrapId === 'sort') {
            applyFilterSelection('sort', option.dataset.value);
          }
          syllabusState.openDropdown = null;
          renderAll();
        }
      };
    });
  }

  function refreshDropdownUI() {
    document.querySelectorAll('[data-dd-panel]').forEach(panel => {
      if (syllabusState.openDropdown === panel.dataset.ddPanel) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });
    
    const viewWrap = document.getElementById('view-dropdown-wrap');
    if (viewWrap) {
      const activeViewDef = VIEW_GROUPS.flatMap(g=>g.views).find(v=>v.id===syllabusState.view) || {icon:'🌲', name:'Tree Hierarchy'};
      const btn = viewWrap.querySelector('[data-dd-btn]');
      if (btn) {
        btn.innerHTML = `<span>${activeViewDef.icon}</span><span class="font-medium">${activeViewDef.name}</span><span class="text-[9px] opacity-60">▾</span>`;
      }
    }
  }

  // Click outside helper for dropdown dismissal
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-dd-wrap]')) {
      syllabusState.openDropdown = null;
      refreshDropdownUI();
    }
  });

  function itemMatches(it) {
    if (syllabusState.subject && it.subjectId !== syllabusState.subject) return false;
    if (syllabusState.chapter && `${it.subjectId}|${it.chapterName}` !== syllabusState.chapter) return false;
    if (syllabusState.difficulty && it.difficulty !== syllabusState.difficulty) return false;
    if (syllabusState.weightage && it.weight !== syllabusState.weightage) return false;
    if (syllabusState.status && itemStage(it.id) !== syllabusState.status) return false;
    if (syllabusState.highOnly && !it.high) return false;
    if (syllabusState.weakOnly && (!appState.weakAlerts || !appState.weakAlerts[it.id])) return false;
    if (syllabusState.search) {
      const hay = (it.name+' '+it.topicName+' '+it.chapterName+' '+it.subjectName).toLowerCase();
      if (!hay.includes(syllabusState.search)) return false;
    }
    return true;
  }

  function getFilteredSubjects() {
    return SUBJECTS.map(s => {
      const chapters = s.chapters.map(c => {
        const groups = c.groups.map(g => ({ name:g.name, high:g.high, items: g.items.filter(itemMatches) })).filter(g => g.items.length > 0);
        return { name:c.name, groups };
      }).filter(c => c.groups.length > 0);
      return { ...s, chapters };
    }).filter(s => s.chapters.length > 0);
  }

  // Status Pills for subject selection with mini status ring, percentage, and mastered topics count
  function renderRingDeck() {
    const deck = document.getElementById('ring-deck');
    if (!deck) return;
    deck.innerHTML = SUBJECTS.map(s => {
      const c = COLOR_MAP[s.color] || COLOR_MAP.blue;
      const items = s.chapters.flatMap(ch=>ch.groups.flatMap(g=>g.items));
      const total = items.length, done = items.filter(i=>flags(i.id).mastered).length;
      const pct = total ? Math.round((done/total)*100) : 0;
      const r = 13.5, circ = 2 * Math.PI * r, offset = circ - (pct / 100) * circ;
      const active = syllabusState.subject === s.id;
      return `
      <button data-subj="${s.id}" class="subj-ring shrink-0 snap-start flex items-center gap-2.5 rounded-full ${active ? c.activeCard : c.idleCard} border transition-all duration-300 cursor-pointer shadow-md backdrop-blur-md pl-1.5 pr-4 sm:pl-2 sm:pr-4.5 py-1.5 select-none">
        <div class="relative shrink-0 w-[34px] h-[34px] flex items-center justify-center cursor-help rounded-full" data-tooltip="${s.shortName || s.name}: ${done}/${total} topics mastered (${pct}%)">
          <svg width="34" height="34" viewBox="0 0 34 34" class="-rotate-90">
            <circle class="ring-track" cx="17" cy="17" r="${r}" stroke-width="3.5" fill="none" stroke="rgba(255,255,255,0.12)"></circle>
            <circle class="ring-progress" cx="17" cy="17" r="${r}" stroke-width="3.5" fill="none" stroke="${c.ring}" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${offset}"></circle>
          </svg>
          <span class="absolute inset-0 flex items-center justify-center text-[9.5px] font-black text-white select-none">${pct}%</span>
        </div>
        <div class="flex items-center gap-1.5 min-w-0 pr-0.5">
          <span class="text-sm shrink-0">${s.icon}</span>
          <span class="text-xs sm:text-sm font-bold ${c.text} whitespace-nowrap">${s.shortName || s.name}</span>
        </div>
      </button>`;
    }).join('');
    
    deck.querySelectorAll('.subj-ring').forEach(btn => btn.onclick = () => {
      syllabusState.subject = syllabusState.subject === btn.dataset.subj ? '' : btn.dataset.subj;
      syllabusState.chapter = '';
      resetPaths();
      renderAll();
    });
  }

  function groupStats(g){ const total=g.items.length; const done=g.items.filter(i=>flags(i.id).mastered).length; return {total,done}; }
  function chapterStats(c){ const items=c.groups.flatMap(g=>g.items); const total=items.length; const done=items.filter(i=>flags(i.id).mastered).length; return {total,done}; }
  function subjectStats(s){ const items=s.chapters.flatMap(c=>c.groups.flatMap(g=>g.items)); const total=items.length; const done=items.filter(i=>flags(i.id).mastered).length; return {total,done}; }

  function stageBreakdown(items) {
    const b = { new:0, learned:0, practiced:0, mastered:0 };
    items.forEach(it => b[itemStage(it.id)]++);
    return b;
  }

  function segmentedBar(items) {
    const total = items.length || 1;
    const b = stageBreakdown(items);
    const seg = (n, cls) => n>0 ? `<div class="${cls} h-full" style="width:${(n/total)*100}%"></div>` : '';
    return `<div class="flex h-1.5 w-full rounded-full overflow-hidden bg-panel2">
      ${seg(b.mastered,'bg-amber')}${seg(b.practiced,'bg-violet')}${seg(b.learned,'bg-teal')}
    </div>`;
  }

  function diffPill(d) {
    if (!d) return '';
    const map = {
      Easy: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
      Moderate: 'text-amber bg-amber/10 border-amber/20',
      Hard: 'text-rose bg-rose/10 border-rose/20'
    };
    const cls = map[d] || 'text-zinc-400 bg-zinc-800/50 border-zinc-700/50';
    return `<span class="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border ${cls}">${d.toUpperCase()}</span>`;
  }

  function weightPill(w){
    if (!w) return '';
    return `<span class="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-800/60 text-zinc-300 border border-zinc-700/50">${w.toUpperCase()} WEIGHT</span>`;
  }

  function effortLabel(e){
    if (!e) return '';
    return `<span class="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-800/40 text-zinc-400 border border-zinc-700/40">EFFORT: ${e.toUpperCase()}</span>`;
  }

  function miniTri(it) {
    const f = flags(it.id);
    return `<div class="flex items-center gap-1" title="L / P / M">
      <span data-tri="${it.id}" data-flag="learned" title="Learned" class="tri-box learned ${f.learned?'on':''}">${f.learned?'✓':''}</span>
      <span data-tri="${it.id}" data-flag="practiced" title="Practiced" class="tri-box practiced p ${f.practiced?'on p':''}">${f.practiced?'✓':''}</span>
      <span data-tri="${it.id}" data-flag="mastered" title="Mastered" class="tri-box mastered m ${f.mastered?'on m':''}">${f.mastered?'✓':''}</span>
    </div>`;
  }

  function triStateRow(it) {
    const f = flags(it.id);
    return `
    <div class="px-4 py-3.5 border-b border-line/60 last:border-0 hover:bg-white/[0.02] transition flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div class="flex-1 min-w-0">
        <h4 class="text-xs sm:text-sm font-medium text-zinc-200 dark:text-zinc-200 text-zinc-800 mb-2 flex items-center flex-wrap gap-2">
          <span>${it.name}</span>
          ${mockWeakPill(it.id)}
        </h4>
        <div class="flex items-center flex-wrap gap-2">
          ${diffPill(it.difficulty)}
          ${weightPill(it.weight)}
          ${effortLabel(it.effort)}
        </div>
      </div>
      <div class="flex items-center gap-3 bg-[#0a1128]/95 border border-blue-900/60 shadow-inner rounded-xl px-3.5 py-2 shrink-0 self-start md:self-center">
        <div data-tri="${it.id}" data-flag="learned" class="flex items-center gap-2 cursor-pointer select-none group/tb">
          <span class="tri-box learned ${f.learned?'on':''}">${f.learned?'✓':''}</span>
          <span class="text-xs font-medium ${f.learned?'text-teal-400 font-semibold':'text-zinc-400 group-hover/tb:text-zinc-200'} transition">Learned</span>
        </div>
        <span class="text-blue-900/80 select-none">|</span>
        <div data-tri="${it.id}" data-flag="practiced" class="flex items-center gap-2 cursor-pointer select-none group/tb">
          <span class="tri-box practiced p ${f.practiced?'on p':''}">${f.practiced?'✓':''}</span>
          <span class="text-xs font-medium ${f.practiced?'text-violet-400 font-semibold':'text-zinc-400 group-hover/tb:text-zinc-200'} transition">Practiced</span>
        </div>
        <span class="text-blue-900/80 select-none">|</span>
        <div data-tri="${it.id}" data-flag="mastered" class="flex items-center gap-2 cursor-pointer select-none group/tb">
          <span class="tri-box mastered m ${f.mastered?'on m':''}">${f.mastered?'✓':''}</span>
          <span class="text-xs font-medium ${f.mastered?'text-amber-400 font-semibold':'text-zinc-400 group-hover/tb:text-zinc-200'} transition">Mastered</span>
        </div>
      </div>
    </div>`;
  }

  function bindTriRows(root) {
    root.querySelectorAll('[data-tri]').forEach(el => el.onclick = (e) => {
      e.stopPropagation();
      toggleFlag(el.dataset.tri, el.dataset.flag, el);
    });
    root.querySelectorAll('[data-toggle-all]').forEach(el => el.onclick = (e) => {
      e.stopPropagation();
      toggleAll(el.dataset.toggleAll);
    });
  }

  // Tree view rendering
  function renderTree(subjects) {
    return subjects.map(s => {
      const c = COLOR_MAP[s.color] || COLOR_MAP.blue;
      const {total,done} = subjectStats(s);
      const pct = total ? Math.round((done/total)*100) : 0;
      const subjOpen = syllabusState.expandedGroups.has('S:'+s.id) || syllabusState.subject === s.id;
      return `
      <div class="mb-3.5 bg-panel border ${c.border} ${c.glow} rounded-2xl overflow-hidden shadow transition duration-300">
        <button data-toggle-subj="${s.id}" class="w-full flex items-center gap-2.5 px-4 py-3.5 ${c.soft} border-b ${c.border} text-left transition cursor-pointer">
          <span class="text-lg sm:text-xl">${s.icon}</span>
          <span class="font-heading font-semibold text-sm sm:text-base text-zinc-100">${s.name}</span>
          ${s.weightagePct ? `<span class="ml-auto text-xs sm:text-sm font-mono font-bold ${c.text}">${pct}% &bull; ${s.weightagePct}% weight</span>` : `<span class="ml-auto text-xs sm:text-sm font-mono font-bold ${c.text}">${pct}%</span>`}
          <span class="chev ${subjOpen?'open':''} text-zinc-400 text-xs ml-1">›</span>
        </button>

        ${s.description ? `
        <div data-subj-desc="${s.id}" class="px-4 py-3 text-xs text-zinc-400 font-mono bg-panel/80 transition-all duration-200 ${subjOpen ? 'hidden opacity-0' : 'block opacity-100'}">
          ${s.description}
        </div>` : ''}

        <div data-subj-body="${s.id}" class="collapsible-content ${subjOpen?'open':''}">
          <div class="collapsible-inner p-4 space-y-5">
            ${s.chapters.map(ch => `
              <div>
                <p class="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">${ch.name}</p>
                <div class="space-y-2">
                  ${ch.groups.map(g => {
                    const gs = groupStats(g);
                    const key = `G:${s.id}:${ch.name}:${g.name}`;
                    const gOpen = syllabusState.expandedGroups.has(key);
                    return `
                    <div class="bg-panel2/60 border border-line rounded-xl overflow-hidden">
                      <button data-toggle-group="${key}" class="w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-white/[0.02] transition">
                        <span class="text-amber-400 text-base">📁</span>
                        ${g.high ? '<span class="text-amber text-xs">⭐</span>' : ''}
                        <span class="text-sm sm:text-base font-semibold text-zinc-100 flex-1">${g.name}</span>
                        <span data-gstats="${key}" class="text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-panel border border-line text-zinc-400">${gs.done}/${gs.total} Done</span>
                        <span class="chev ${gOpen?'open':''} text-zinc-500 text-xs">›</span>
                      </button>
                      <div data-group-body="${key}" class="collapsible-content ${gOpen?'open':''}">
                        <div class="collapsible-inner border-t border-line">${sortItems(g.items).map(triStateRow).join('')}</div>
                      </div>
                    </div>`;
                  }).join('')}
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
    }).join('');
  }

  function bindTree(root) {
    root.querySelectorAll('[data-toggle-subj]').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const sId = btn.dataset.toggleSubj;
        const key = 'S:' + sId;
        const body = root.querySelector(`[data-subj-body="${sId}"]`);
        const chev = btn.querySelector('.chev');
        const descEl = root.querySelector(`[data-subj-desc="${sId}"]`);
        if (syllabusState.expandedGroups.has(key)) {
          syllabusState.expandedGroups.delete(key);
          if (body) body.classList.remove('open');
          if (chev) chev.classList.remove('open');
          if (descEl) {
            descEl.classList.remove('hidden', 'opacity-0');
            descEl.classList.add('block', 'opacity-100');
          }
        } else {
          syllabusState.expandedGroups.add(key);
          if (body) body.classList.add('open');
          if (chev) chev.classList.add('open');
          if (descEl) {
            descEl.classList.remove('block', 'opacity-100');
            descEl.classList.add('hidden', 'opacity-0');
          }
        }
      };
    });

    root.querySelectorAll('[data-toggle-group]').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const key = btn.dataset.toggleGroup;
        const body = btn.parentElement ? btn.parentElement.querySelector(`.collapsible-content[data-group-body]`) : null;
        const chev = btn.querySelector('.chev');
        if (syllabusState.expandedGroups.has(key)) {
          syllabusState.expandedGroups.delete(key);
          if (body) body.classList.remove('open');
          if (chev) chev.classList.remove('open');
        } else {
          syllabusState.expandedGroups.add(key);
          if (body) body.classList.add('open');
          if (chev) chev.classList.add('open');
        }
      };
    });

    bindTriRows(root);
  }

  // Explorer View Rendering
  function renderExplorer(subjects) {
    const [subjId, chapName, groupName] = syllabusState.explorerPath;
    if (!subjId) {
      return `<div class="bg-panel border border-line rounded-2xl divide-y divide-line/60">` + subjects.map(s => {
        const c = COLOR_MAP[s.color] || COLOR_MAP.blue;
        const {total,done} = subjectStats(s);
        return `<button data-open-s="${s.id}" class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition text-left cursor-pointer">
          <span class="text-lg">${s.icon}</span><span class="text-xs font-semibold ${c.text} flex-1">${s.name}</span>
          <span class="text-[10px] font-mono px-2 py-1 rounded-lg bg-panel2 text-zinc-400">${done}/${total} Done</span>
          <span class="text-zinc-600 text-xs">›</span></button>`;
      }).join('') + `</div>`;
    }
    const subject = subjects.find(s=>s.id === subjId);
    if (!subject) {
      syllabusState.explorerPath = [];
      return renderExplorer(subjects);
    }
    if (!chapName) {
      return `<div class="bg-panel border border-line rounded-2xl divide-y divide-line/60">` + subject.chapters.map(ch => {
        const {total,done} = chapterStats(ch);
        return `<button data-open-c="${ch.name}" class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition text-left">
          <span class="text-cyan-300/80">📂</span><span class="text-xs font-medium text-zinc-100 flex-1">${ch.name}</span>
          <span class="text-[10px] font-mono px-2 py-1 rounded-lg bg-panel2 text-zinc-400">${done}/${total} Done</span>
          <span class="text-zinc-600 text-xs">›</span></button>`;
      }).join('') + `</div>`;
    }
    const chapter = subject.chapters.find(c=>c.name === chapName);
    if (!chapter) {
      syllabusState.explorerPath = [subjId];
      return renderExplorer(subjects);
    }
    if (!groupName) {
      return `<div class="bg-panel border border-line rounded-2xl divide-y divide-line/60">` + chapter.groups.map(g => {
        const gs = groupStats(g);
        return `<button data-open-g="${g.name}" class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition text-left">
          <span class="text-cyan-300/80">📁</span>${g.high?'<span class="text-amber text-xs">⭐</span>':''}
          <span class="text-xs font-medium text-zinc-100 flex-1">${g.name}</span>
          <span class="text-[10px] font-mono px-2 py-1 rounded-lg bg-panel2 text-zinc-400">${gs.done}/${gs.total} Done</span>
          <span class="text-zinc-600 text-xs">›</span></button>`;
      }).join('') + `</div>`;
    }
    const group = chapter.groups.find(g=>g.name === groupName);
    if (!group) {
      syllabusState.explorerPath = [subjId, chapName];
      return renderExplorer(subjects);
    }
    return `<div class="bg-panel border border-line rounded-2xl overflow-hidden">${sortItems(group.items).map(triStateRow).join('')}</div>`;
  }

  function bindExplorer(root) {
    root.querySelectorAll('[data-open-s]').forEach(el => el.onclick = () => {
      syllabusState.explorerPath = [el.dataset.openS];
      renderAll();
    });
    root.querySelectorAll('[data-open-c]').forEach(el => el.onclick = () => {
      syllabusState.explorerPath = [syllabusState.explorerPath[0], el.dataset.openC];
      renderAll();
    });
    root.querySelectorAll('[data-open-g]').forEach(el => el.onclick = () => {
      syllabusState.explorerPath = [syllabusState.explorerPath[0], syllabusState.explorerPath[1], el.dataset.openG];
      renderAll();
    });
    bindTriRows(root);
  }

  function renderExplorerBreadcrumb(subjects) {
    const [subjId, chapName, groupName] = syllabusState.explorerPath;
    const breadcrumbEl = document.getElementById('syllabus-breadcrumb');
    if (!breadcrumbEl) return;
    if (!subjId) {
      breadcrumbEl.classList.add('hidden');
      return;
    }
    breadcrumbEl.classList.remove('hidden');
    const subject = subjects.find(s=>s.id === subjId) || SUBJECTS.find(s=>s.id === subjId);
    let html = `<button data-c="0" class="hover:text-teal transition">All Subjects</button>`;
    html += ` <span class="text-line">/</span> <button data-c="1" class="hover:text-teal transition">${subject?subject.icon+' '+subject.name:''}</button>`;
    if (chapName) html += ` <span class="text-line">/</span> <button data-c="2" class="hover:text-teal transition">${chapName}</button>`;
    if (groupName) html += ` <span class="text-line">/</span> <span class="text-zinc-300">${groupName}</span>`;
    breadcrumbEl.innerHTML = html;
    
    breadcrumbEl.querySelectorAll('[data-c]').forEach(b => b.onclick = () => {
      const lvl = +b.dataset.c;
      syllabusState.explorerPath = lvl === 0 ? [] : lvl === 1 ? [subjId] : [subjId, chapName];
      renderAll();
    });
  }

  // Compact view rendering
  function renderCompact(subjects) {
    return `<div class="bg-panel border border-line rounded-2xl divide-y divide-line/60">` + subjects.map(s => {
      const c = COLOR_MAP[s.color] || COLOR_MAP.blue;
      const skey = 's:' + s.id, sOpen = syllabusState.compactPath.has(skey);
      const {total,done} = subjectStats(s);
      return `
      <div>
        <button data-cp="${skey}" class="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-white/[0.02] text-left cursor-pointer">
          <span class="chev ${sOpen?'open':''} text-zinc-500 text-[10px] w-3">›</span>
          <span class="text-xs ${c.text} font-semibold">${s.icon} ${s.name}</span>
          <span class="ml-auto text-[10px] font-mono text-zinc-500">${done}/${total}</span>
        </button>
        ${sOpen ? s.chapters.map(ch => {
          const ckey = `c:${s.id}:${ch.name}`, cOpen = syllabusState.compactPath.has(ckey);
          const cs = chapterStats(ch);
          return `
          <div class="pl-5">
            <button data-cp="${ckey}" class="w-full flex items-center gap-2 px-3.5 py-1.5 hover:bg-white/[0.02] text-left">
              <span class="chev ${cOpen?'open':''} text-zinc-600 text-[10px] w-3">›</span>
              <span class="text-[11px] text-zinc-400 font-medium">${ch.name}</span>
              <span class="ml-auto text-[10px] font-mono text-zinc-600">${cs.done}/${cs.total}</span>
            </button>
            ${cOpen ? ch.groups.map(g => {
              const gs = groupStats(g);
              const gkey = `g:${s.id}:${ch.name}:${g.name}`, gOpen = syllabusState.compactPath.has(gkey);
              return `
              <div class="pl-5">
                <button data-cp="${gkey}" class="w-full flex items-center gap-2 px-3.5 py-1.5 hover:bg-white/[0.02] text-left">
                  <span class="chev ${gOpen?'open':''} text-zinc-700 text-[10px] w-3">›</span>
                  <span class="text-[11px] text-zinc-500 font-medium">${g.high?'⭐ ':''}${g.name}</span>
                  <span class="ml-auto text-[10px] font-mono text-zinc-700">${gs.done}/${gs.total}</span>
                </button>
                ${gOpen ? `<div class="pl-8 pb-1">${sortItems(g.items).map(it => {
                  return `
                  <div class="flex items-center gap-2 py-1">
                    <span data-toggle-all="${it.id}" title="Marks Learned + Practiced + Mastered together" class="tri-box m ${fullyDone(it.id)?'on m':''}">${fullyDone(it.id)?'✓':''}</span>
                    <span class="text-[11px] ${fullyDone(it.id)?'text-zinc-600 line-through':'text-zinc-400'}">${it.name}</span>
                    ${mockWeakPill(it.id)}
                  </div>`;
                }).join('')}</div>` : ''}
              </div>`;
            }).join('') : ''}
          </div>`;
        }).join('') : ''}
      </div>`;
    }).join('') + `</div>`;
  }

  function bindCompact(root) {
    root.querySelectorAll('[data-cp]').forEach(el => el.onclick = () => {
      const k = el.dataset.cp;
      if (syllabusState.compactPath.has(k)) {
        syllabusState.compactPath.delete(k);
      } else {
        syllabusState.compactPath.add(k);
      }
      renderAll();
    });
    bindTriRows(root);
  }

  // Grid Cards View Rendering
  function renderGrid(subjects) {
    const [subjId] = syllabusState.gridPath;
    if (!subjId) {
      return `<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">` + subjects.map(s => {
        const c = COLOR_MAP[s.color] || COLOR_MAP.blue;
        const items = s.chapters.flatMap(ch=>ch.groups.flatMap(g=>g.items));
        const b = stageBreakdown(items);
        const total = items.length;
        const pct = total ? Math.round((b.mastered/total)*100) : 0;
        const highCount = s.chapters.flatMap(ch=>ch.groups).filter(g=>g.high).length;
        return `
        <button data-gs="${s.id}" class="text-left bg-panel border border-line border-l-4 border-l-${s.color==='blue'?'blue-400':s.color} rounded-2xl p-5 hover:border-${s.color==='blue'?'blue-400':s.color}/40 subject-glow-${s.color} transition">
          <div class="flex items-center justify-between mb-3"><span class="text-2xl">${s.icon}</span><span class="text-[11px] font-mono ${c.text}">${pct}% mastered</span></div>
          <h3 class="font-heading font-semibold text-zinc-100 mb-1 text-sm">${s.name}</h3>
          <p class="text-[10px] text-zinc-500 font-mono mb-3">${s.chapters.length} chapters &bull; ${total} items ${highCount ? `&bull; <span class="text-amber">⭐ ${highCount} high-weight</span>` : ''}</p>
          ${segmentedBar(items)}
          <div class="flex items-center gap-3 mt-2.5 text-[9px] font-mono text-zinc-500">
            <span class="text-amber">● ${b.mastered} mastered</span>
            <span class="text-violet">● ${b.practiced} revised</span>
            <span class="text-teal">● ${b.learned} learned</span>
          </div>
        </button>`;
      }).join('') + `</div>`;
    }
    
    const subject = subjects.find(s=>s.id === subjId);
    if (!subject) {
      syllabusState.gridPath = [];
      return renderGrid(subjects);
    }
    const c = COLOR_MAP[subject.color] || COLOR_MAP.blue;
    return `<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">` + subject.chapters.flatMap(ch => ch.groups).map(g => {
      const b = stageBreakdown(g.items);
      return `
      <div class="bg-panel border border-line rounded-2xl p-5 shadow">
        <div class="flex items-start justify-between mb-1">
          <h3 class="font-heading font-medium text-zinc-100 text-xs">${g.high?'⭐ ':''}${g.name}</h3>
        </div>
        <p class="text-[10px] text-zinc-500 font-mono mb-3">${g.items.length} items</p>
        ${segmentedBar(g.items)}
        <div class="space-y-2 mt-3 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
          ${sortItems(g.items).map(it => `
            <div class="flex items-center justify-between gap-2 border-b border-white/5 pb-1.5 last:border-0">
              <div class="min-w-0">
                <p class="text-xs text-zinc-300 truncate font-medium flex items-center gap-1.5" title="${it.name}"><span>${it.name}</span>${mockWeakPill(it.id)}</p>
                <div class="mt-0.5">${diffPill(it.difficulty)}</div>
              </div>
              ${miniTri(it)}
            </div>`).join('')}
        </div>
      </div>`;
    }).join('') + `</div>`;
  }

  // Grid Breadcrumbs
  function renderGridBreadcrumb(subjects) {
    const [subjId] = syllabusState.gridPath;
    const breadcrumbEl = document.getElementById('syllabus-breadcrumb');
    if (!breadcrumbEl) return;
    if (!subjId) return;
    breadcrumbEl.classList.remove('hidden');
    const subject = subjects.find(s=>s.id === subjId) || SUBJECTS.find(s=>s.id === subjId);
    breadcrumbEl.innerHTML = `<button data-gc="0" class="hover:text-teal transition">All Subjects</button> <span class="text-line">/</span> <span class="text-zinc-300">${subject?subject.icon+' '+subject.name:''}</span>`;
    breadcrumbEl.querySelector('[data-gc]').onclick = () => {
      syllabusState.gridPath = [];
      renderAll();
    };
  }

  function bindGrid(root) {
    root.querySelectorAll('[data-gs]').forEach(el => el.onclick = () => {
      syllabusState.gridPath = [el.dataset.gs];
      renderAll();
    });
    bindTriRows(root);
  }

  // Kanban View Rendering
  const KANBAN_STAGES = [
    {id:'new', label:'Not Started', color:'text-zinc-400'},
    {id:'learned', label:'Learning', color:'text-teal'},
    {id:'practiced', label:'Revision', color:'text-violet'},
    {id:'mastered', label:'Mastered', color:'text-amber'},
  ];

  function renderKanban(subjects) {
    let items = subjects.flatMap(s => s.chapters.flatMap(c => c.groups.flatMap(g => g.items)));

    const board = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">` + KANBAN_STAGES.map(st => {
      const list = sortItems(items.filter(it => itemStage(it.id) === st.id));
      return `
      <div data-kcol="${st.id}" class="kanban-col bg-panel border border-line rounded-2xl p-3 min-h-[250px] transition">
        <div class="flex items-center justify-between mb-3 px-1">
          <span class="text-[10px] font-mono uppercase tracking-wider ${st.color} font-bold">${st.label}</span>
          <span class="text-[10px] font-mono text-zinc-500">${list.length}</span>
        </div>
        <div class="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
          ${list.slice(0,60).map(it => `
            <div draggable="true" data-kitem="${it.id}" class="kanban-card bg-panel2 border border-line rounded-xl p-3 shadow-sm hover:border-teal/30 transition">
              <p class="text-xs text-zinc-200 mb-1.5 leading-snug font-medium flex items-center flex-wrap gap-1.5"><span>${it.name}</span>${mockWeakPill(it.id)}</p>
              <p class="text-[9px] text-zinc-500 font-mono mb-2">${it.topicName} &bull; ${it.subjectName.split(' ')[0]}</p>
              <div class="flex gap-1">${diffPill(it.difficulty)}</div>
            </div>`).join('')}
          ${list.length>60 ? `<p class="text-[9px] text-zinc-500 font-mono text-center pt-1">+${list.length-60} more</p>` : ''}
          ${list.length===0 ? `<p class="text-[9px] text-zinc-600 font-mono text-center pt-1 select-none">no matches</p>` : ''}
        </div>
      </div>`;
    }).join('') + `</div>
    <p class="text-[10px] text-zinc-500 font-mono text-center mt-4"><i class="fa-solid fa-circle-info mr-1 text-teal"></i> drag a card between columns to update its stage</p>`;
    return board;
  }

  function bindKanban(root) {
    let draggedId = null;
    root.querySelectorAll('[data-kitem]').forEach(card => {
      card.addEventListener('dragstart', () => {
        draggedId = card.dataset.kitem;
        card.classList.add('dragging');
      });
      card.addEventListener('dragend', () => card.classList.remove('dragging'));
    });
    root.querySelectorAll('[data-kcol]').forEach(col => {
      col.addEventListener('dragover', e => {
        e.preventDefault();
        col.classList.add('drag-over');
      });
      col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
      col.addEventListener('drop', e => {
        e.preventDefault();
        col.classList.remove('drag-over');
        if (draggedId) {
          setStage(draggedId, col.dataset.kcol);
        }
      });
    });
  }

  // Table View Rendering
  const TABLE_COLS = [
    {sortKey:'name', label:'Item'},
    {sortKey:'subject', label:'Subject'},
    {sortKey:'difficulty', label:'Difficulty'},
    {sortKey:'weight', label:'Weight'},
    {sortKey:'stage', label:'Stage'},
  ];

  function renderTable(subjects) {
    let rows = subjects.flatMap(s => s.chapters.flatMap(c => c.groups.flatMap(g => g.items)));
    rows = sortItems(rows).map(r => ({...r, stage: itemStage(r.id)}));
    
    const stageDot = {new:'bg-zinc-500', learned:'bg-teal', practiced:'bg-violet', mastered:'bg-amber'};
    const stageText = {new:'text-zinc-500', learned:'text-teal', practiced:'text-violet', mastered:'text-amber'};
    
    return `
    <div class="bg-panel border border-line rounded-2xl overflow-auto max-h-[70vh] shadow">
      <table class="w-full text-xs min-w-[720px]">
        <thead class="sticky-head"><tr class="text-left text-[10px] font-mono uppercase tracking-wider text-zinc-500 border-b border-line">
          ${TABLE_COLS.map(col => `<th data-sort="${col.sortKey}" class="px-4 py-3 font-semibold cursor-pointer hover:text-teal select-none whitespace-nowrap">${col.label} ${syllabusState.sortBy===col.sortKey ? (syllabusState.sortDir===1?'↑':'↓') : ''}</th>`).join('')}
          <th class="px-4 py-3 font-semibold text-right whitespace-nowrap">Track</th>
        </tr></thead>
        <tbody>
          ${rows.map(it => `
            <tr class="zebra border-b border-line/60 last:border-0 hover:bg-white/[0.03] transition">
              <td class="px-4 py-2.5">
                <p class="text-zinc-200 font-medium flex items-center flex-wrap gap-1.5"><span>${it.name}</span>${mockWeakPill(it.id)}</p>
                <p class="text-[9.5px] text-zinc-500 font-mono mt-0.5">${it.chapterName} &bull; ${it.topicName}</p>
              </td>
              <td class="px-4 py-2.5 text-zinc-400 text-xs whitespace-nowrap">${it.subjectName.split(' ').slice(0,2).join(' ')}</td>
              <td class="px-4 py-2.5">${diffPill(it.difficulty)}</td>
              <td class="px-4 py-2.5 text-xs text-zinc-400 whitespace-nowrap">${it.weight} Weight</td>
              <td class="px-4 py-2.5">
                <span class="inline-flex items-center gap-1.5 text-xs font-mono ${stageText[it.stage]} font-semibold"><span class="w-1.5 h-1.5 rounded-full ${stageDot[it.stage]}"></span>${it.stage.toUpperCase()}</span>
              </td>
              <td class="px-4 py-2.5"><div class="flex justify-end">${miniTri(it)}</div></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  }

  function bindTable(root) {
    root.querySelectorAll('[data-sort]').forEach(th => th.onclick = () => {
      const key = th.dataset.sort;
      syllabusState.sortDir = (syllabusState.sortBy === key) ? -syllabusState.sortDir : 1;
      syllabusState.sortBy = key;
      renderAll();
    });
    bindTriRows(root);
  }

  // Master Render loop
  function renderAll() {
    const mount = document.getElementById('view-mount');
    const breadcrumbEl = document.getElementById('syllabus-breadcrumb');
    if (!mount || !breadcrumbEl) return;
    
    renderRingDeck();
    refreshDropdownUI();
    
    const activeElement = document.activeElement;
    const preserve = (activeElement && mount.contains(activeElement) && activeElement.tagName === 'INPUT')
      ? { id: activeElement.id, start: activeElement.selectionStart, end: activeElement.selectionEnd } : null;
      
    const subjects = getFilteredSubjects();
    const total = ALL_ITEMS.length, done = ALL_ITEMS.filter(i=>flags(i.id).mastered).length;
    const totalEl = document.getElementById('stat-total');
    const doneEl = document.getElementById('stat-done');
    if (totalEl) totalEl.textContent = `${total} items`;
    if (doneEl) doneEl.textContent = `${done} mastered`;
    
    const emptyEl = document.getElementById('empty-state');
    const has = subjects.length > 0;
    emptyEl.classList.toggle('hidden', has);
    mount.classList.toggle('hidden', !has);
    breadcrumbEl.classList.add('hidden');
    
    if (!has) {
      mount.innerHTML = '';
      return;
    }
    
    let html = '';
    switch(syllabusState.view) {
      case 'tree': html = renderTree(subjects); break;
      case 'explorer': html = renderExplorer(subjects); renderExplorerBreadcrumb(subjects); break;
      case 'compact': html = renderCompact(subjects); break;
      case 'grid': html = renderGrid(subjects); renderGridBreadcrumb(subjects); break;
      case 'kanban': html = renderKanban(subjects); break;
      case 'table': html = renderTable(subjects); break;
    }
    
    mount.innerHTML = html;
    mount.classList.remove('fade-in');
    void mount.offsetWidth;
    mount.classList.add('fade-in');
    
    if (syllabusState.view === 'tree') bindTree(mount);
    if (syllabusState.view === 'explorer') bindExplorer(mount);
    if (syllabusState.view === 'compact') bindCompact(mount);
    if (syllabusState.view === 'grid') bindGrid(mount);
    if (syllabusState.view === 'kanban') bindKanban(mount);
    if (syllabusState.view === 'table') bindTable(mount);
    
    buildFilterRow();
    
    if (preserve) {
      const el = document.getElementById(preserve.id);
      if (el) {
        el.focus();
        try { el.setSelectionRange(preserve.start, preserve.end); } catch(e){}
      }
    }
  }

  function showVisualError(err) {
    console.error("Syllabus Console error:", err);
    const mount = document.getElementById('view-mount') || document.body;
    if (mount) {
      mount.innerHTML = `
      <div class="p-6 bg-rose/10 border border-rose/30 rounded-2xl text-rose text-xs font-mono max-w-2xl mx-auto my-8">
        <p class="font-bold text-sm mb-2 text-rose-400">⚠️ Error loading Syllabus Console:</p>
        <p class="font-semibold">${err.message}</p>
        <pre class="mt-3 text-[10px] opacity-75 overflow-auto max-h-60 bg-black/40 p-3 rounded-lg border border-line">${err.stack}</pre>
      </div>`;
      mount.classList.remove('hidden');
    }
  }

  // Expose renderSyllabus globally for navigation triggers
  window.renderSyllabus = function() {
    try {
      initToolbar();
      renderAll();
    } catch (err) {
      showVisualError(err);
    }
  };
  window.syllabusState = syllabusState;

  window.jumpToSyllabusTopic = function(topicId) {
    if (window.navigateToPage) window.navigateToPage('page-syllabus');
    
    // Find subject ID for this topic
    let targetSubjId = '';
    for (const s of SUBJECTS) {
      for (const ch of s.chapters) {
        for (const g of ch.groups) {
          if (g.items.some(it => it.id === topicId)) {
            targetSubjId = s.id;
            break;
          }
        }
        if (targetSubjId) break;
      }
      if (targetSubjId) break;
    }

    if (targetSubjId) {
      syllabusState.subject = targetSubjId;
    }
    syllabusState.chapter = '';
    syllabusState.search = '';
    syllabusState.weakOnly = false;
    syllabusState.highOnly = false;
    syllabusState.difficulty = '';
    syllabusState.weightage = '';
    syllabusState.status = '';
    resetPaths();
    renderAll();

    setTimeout(() => {
      const el = document.querySelector(`[data-tri="${topicId}"]`);
      if (el) {
        const row = el.closest('.border-b, tr, .p-3, .p-4') || el;
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        row.classList.add('ring-2', 'ring-rose-500', 'bg-rose-500/15');
        setTimeout(() => {
          row.classList.remove('ring-2', 'ring-rose-500', 'bg-rose-500/15');
        }, 3000);
      }
    }, 300);
  };

  window.openMockRadarTopic = function(topicId) {
    if (window.navigateToPage) window.navigateToPage('page-mocks');
    setTimeout(() => {
      const radar = document.getElementById('weak-topics-radar');
      if (radar) {
        radar.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  };

  // Initial triggers
  document.addEventListener("DOMContentLoaded", () => {
    try {
      initToolbar();
      renderAll();
    } catch (err) {
      showVisualError(err);
    }
  });
  if (document.readyState === "interactive" || document.readyState === "complete") {
    try {
      initToolbar();
      renderAll();
    } catch (err) {
      showVisualError(err);
    }
  }
} catch (err) {
  console.error("Syllabus Console parse-time error:", err);
  alert("Syllabus Console load error: " + err.message + "\n" + err.stack);
  document.write(`<div class="p-6 bg-rose/10 border border-rose/30 rounded-2xl text-rose font-mono">
    <p class="font-bold">⚠️ Syllabus Console Load Error:</p>
    <p>${err.message}</p>
    <pre class="mt-2 text-xs">${err.stack}</pre>
  </div>`);
}
