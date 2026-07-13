try {
  // === SYLLABUS CONSOLE MODULE ===
  // Sourced and adapted from ssc-cgl-syllabus-console_1.html for full integration

  const SUBJECT_META = {
    'Quantitative Aptitude': { icon:'📐', color:'teal', weightagePct:28 },
    'General Intelligence & Reasoning': { icon:'🧠', color:'violet', weightagePct:25 },
    'English Language & Comprehension': { icon:'📖', color:'amber', weightagePct:22 },
    'General Awareness': { icon:'🌍', color:'rose', weightagePct:25 },
    'Computer Knowledge': { icon:'💻', color:'blue', weightagePct:10 }
  };

  function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  }

  const COLOR_MAP = {
    teal:{text:'text-teal',bg:'bg-teal',ring:'#2dd4bf',soft:'bg-teal/10',border:'border-teal/30'},
    violet:{text:'text-violet',bg:'bg-violet',ring:'#a78bfa',soft:'bg-violet/10',border:'border-violet/30'},
    amber:{text:'text-amber',bg:'bg-amber',ring:'#fbbf24',soft:'bg-amber/10',border:'border-amber/30'},
    rose:{text:'text-rose',bg:'bg-rose',ring:'#fb7185',soft:'bg-rose/10',border:'border-rose/30'},
    blue:{text:'text-blue-400',bg:'bg-blue-400',ring:'#60a5fa',soft:'bg-blue-400/10',border:'border-blue-400/30'},
  };

  function buildSubjects(raw) {
    const bySubject = {};
    raw.forEach(entry => {
      const meta = SUBJECT_META[entry.subject] || { icon:'📘', color:'blue', weightagePct:null };
      const subjId = slugify(entry.subject);
      if (!bySubject[subjId]) {
        bySubject[subjId] = {
          id: subjId,
          name: entry.subject,
          icon: meta.icon,
          color: meta.color,
          weightagePct: meta.weightagePct,
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
      icon: s.icon,
      color: s.color,
      weightagePct: s.weightagePct,
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

  function findStudyNoteForSyllabus(subtopicId) {
    const directMap = {
      'q-1-1': 'percentage_product_constancy',
      'q-1-2': 'percentage_product_constancy',
      'q-1-3': 'percentage_product_constancy',
      'q-2-2': 'profit_loss_successive_discounts',
      'q-3-3': 'simple_compound_interest',
      'q-4-1': 'algebraic_identities_roots',
      'q-5-1': 'geometry_centers_theorems',
      'q-5-2': 'geometry_centers_theorems',
      'q-6-1': 'mensuration_3d_surfaces_volumes',
      'q-7-1': 'time_speed_distance_boats',
      'q-7-2': 'time_speed_distance_boats',
      'q-8-1': 'time_work_equivalence',
      'q-9-1': 'trigonometric_values_amp_formulas_table',
      'q-10-1': 'coordinate_geometry',
      
      'r-1-1': 'alphabet_code_map_ejoty',
      'r-2-1': 'clock_hands_angle_equation',
      'r-3-1': 'calendar_odd_days_rules',
      'r-4-1': 'syllogism_truth_matrix',
      'r-5-1': 'direction_sense_shadows_triplets',
      'r-5-2': 'direction_sense_shadows_triplets',
      'r-6-1': 'dice_closed_open_rules',
      
      'e-1-1': 'subject-verb_agreement_core_cases',
      'e-2-1': 'conditional_clauses_structure',
      'e-3-1': 'active_passive_transformations',
      'e-4-1': 'direct_indirect_speech_rules',
      'e-5-1': 'plural_vs_singular_noun_traps',
      'e-6-1': 'pronoun_order_cases',
      'e-7-1': 'fixed_prepositions_combinations',
      
      'g-1-1': 'top_15_articles_to_memorize_first',
      'g-1-2': 'tier_1_constitutional_articles_must_know',
      'g-1-3': 'tier_2_articles_very_high_frequency',
      'g-1-4': 'tier_3_articles_frequently_asked',
      'g-1-5': 'constitution_articles_memory_roadmap',
      'g-1-6': 'daily_micro_trick_the_5-point_memory_chain',
      'g-2-1': 'rivers',
      'g-2-2': 'mountains',
      'g-2-3': 'dams',
      'g-2-4': 'passes',
      'g-3-1': 'crucial_battles_timelines',
      'g-4-1': 'units',
      'g-4-2': 'facts',
      
      'c-1-1': 'keyboard_shortcut_commands',
      'c-1-2': 'keyboard_shortcut_commands',
      'c-2-2': 'keyboard_shortcut_commands',
      'c-2-3': 'ms_excel_formulas_cell_referencing',
      'c-3-1': 'internet_protocols_network_port_mappings',
      'c-3-2': 'internet_protocols_network_port_mappings',
      'c-4-1': 'cybersecurity_malwares_safeguards',
      'c-4-2': 'cybersecurity_malwares_safeguards'
    };

    const directId = directMap[subtopicId];
    if (directId) return directId;

    let syllabusName = "";
    if (global.SYLLABUS_DATA) {
      for (const topic of global.SYLLABUS_DATA) {
        const sub = topic.subtopics.find(s => s.id === subtopicId);
        if (sub) {
          syllabusName = sub.name.toLowerCase();
          break;
        }
      }
    }

    if (!syllabusName || !window.studySubjects) return null;

    const words = syllabusName.split(/[^a-z0-9]+/);
    let bestId = null;
    let maxMatches = 0;

    for (const subject of window.studySubjects.subjects) {
      for (const topic of subject.topics) {
        for (const sub of topic.subtopics) {
          const subName = sub.name.toLowerCase();
          let matches = 0;
          words.forEach(w => {
            if (w.length > 2 && subName.includes(w)) matches++;
          });
          if (matches > maxMatches) {
            maxMatches = matches;
            bestId = sub.id;
          }
        }
      }
    }

    return bestId;
  }

  function tryOpenStudyNote(subtopicId) {
    const noteId = findStudyNoteForSyllabus(subtopicId);
    if (noteId && typeof window.openStudyViewer === 'function') {
      window.openStudyViewer(noteId);
    } else {
      alert("Study guide for this topic is currently being compiled! Keep practicing.");
    }
  }
  window.tryOpenStudyNote = tryOpenStudyNote;

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
  function toggleFlag(id, key) {
    const f = { ...flags(id) };
    f[key] = !f[key];
    if (key === 'mastered' && f.mastered) { f.learned = true; f.practiced = true; }
    if (key === 'practiced' && f.practiced) { f.learned = true; }
    if (key === 'learned' && !f.learned) { f.practiced = false; f.mastered = false; }
    if (key === 'practiced' && !f.practiced) { f.mastered = false; }
    appState.syllabusProgress[id] = f;
    save();
    renderAll();
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
    sortBy: 'default',
    sortDir: 1,
    kanbanSearch: '',
    explorerPath: [],
    gridPath: [],
    compactPath: new Set(),
    expandedGroups: new Set(),
    openDropdown: null,
    studyMode: false,
  };

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
    return `<button data-dd-option="${id}" data-value="${value}" class="view-btn w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left text-xs transition ${active?'active text-teal':''}">
      <span class="truncate">${label}</span>${active?'<span class="text-teal text-[10px]">✓</span>':''}
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
      <p class="px-2.5 pt-2 pb-1 text-[9px] font-mono uppercase tracking-wider text-zinc-500">${s.icon} ${s.name}</p>
      ${s.chapters.map(ch => optionRow('chapter', `${s.id}|${ch.name}`, ch.name, syllabusState.chapter===`${s.id}|${ch.name}`)).join('')}
    `).join('');
  }

  function sortPanelHTML() {
    const current = `${syllabusState.sortBy}:${syllabusState.sortDir}`;
    return SORT_OPTIONS.map(g => `
      <p class="px-2.5 pt-2 pb-1 text-[9px] font-mono uppercase tracking-wider text-zinc-500">${g.group}</p>
      ${g.opts.map(o => optionRow('sort', o.value, o.label, o.value===current)).join('')}
    `).join('');
  }

  function getDropdownDefs() {
    const subj = SUBJECTS.find(s=>s.id === syllabusState.subject);
    const chLabel = syllabusState.chapter ? syllabusState.chapter.split('|')[1] : 'All Chapters';
    const statusLabels = {new:'Not Started', learned:'Learned', practiced:'Practiced', mastered:'Mastered'};
    return [
      { id:'subject', icon:'📚', label: subj ? `${subj.icon} ${subj.name.split(' ')[0]}` : 'All Subjects', active: !!syllabusState.subject,
        panelHTML: simpleOptionsHTML('subject', [{value:'',label:'All Subjects'}, ...SUBJECTS.map(s=>({value:s.id,label:`${s.icon} ${s.name}`}))], syllabusState.subject) },
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
    return !!(syllabusState.subject || syllabusState.chapter || syllabusState.difficulty || syllabusState.weightage || syllabusState.status || syllabusState.highOnly);
  }

  function dropdownMarkup(d) {
    const open = syllabusState.openDropdown === d.id;
    return `
    <div class="relative" data-dd-wrap="${d.id}">
      <button data-dd-btn="${d.id}" class="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm border transition ${d.active ? 'bg-teal/10 border-teal/40 text-teal' : 'bg-panel2 border-line text-zinc-300 hover:border-teal/40'}">
        <span>${d.icon}</span><span class="font-medium max-w-[130px] truncate">${d.label}</span><span class="text-[9px] opacity-60">▾</span>
      </button>
      <div data-dd-panel="${d.id}" class="${open?'':'hidden'} dropdown-panel absolute left-0 mt-2 w-64 bg-panel border border-line rounded-2xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto scrollbar-thin">
        ${d.panelHTML}
      </div>
    </div>`;
  }

  function buildFilterRow() {
    const wrap = document.getElementById('filter-row');
    if (!wrap) return;
    const defs = getDropdownDefs();
    wrap.innerHTML = defs.map(dropdownMarkup).join('')
      + `<button data-toggle-high class="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs border transition ${syllabusState.highOnly ? 'bg-amber/10 border-amber/40 text-amber' : 'bg-panel2 border-line text-zinc-300 hover:border-amber/40'}">⭐ <span class="font-medium">High-weight only</span></button>`
      + (anyFilterActive() ? `<button data-clear-filters class="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs border border-rose/30 bg-rose/5 text-rose hover:bg-rose/10 transition">✕ Clear filters</button>` : '');
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
    
    const clear = wrap.querySelector('[data-clear-filters]');
    if (clear) clear.onclick = (e) => {
      e.stopPropagation();
      syllabusState.subject = '';
      syllabusState.chapter = '';
      syllabusState.difficulty = '';
      syllabusState.weightage = '';
      syllabusState.status = '';
      syllabusState.highOnly = false;
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
      <p class="px-2.5 pt-2 pb-1 text-[9px] font-mono uppercase tracking-wider text-zinc-500">${g.label}</p>
      ${g.views.map(v => `
        <button data-value="${v.id}" class="view-btn w-full flex flex-col px-3 py-2 rounded-xl text-left transition ${syllabusState.view === v.id ? 'active text-teal bg-teal/10' : ''}">
          <div class="flex items-center gap-1.5 text-xs font-semibold">
            <span>${v.icon}</span><span>${v.name}</span>
          </div>
          <span class="text-[9px] text-zinc-500 mt-0.5">${v.desc}</span>
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
        searchInput.addEventListener('input', e => {
          syllabusState.search = e.target.value.toLowerCase();
          renderAll();
        });
      }
    }
    
    // Sort Dropdown Box
    const sortWrap = document.getElementById('sort-dropdown-wrap');
    if (sortWrap) {
      sortWrap.innerHTML = `
      <div class="relative" data-dd-wrap="sort">
        <button data-dd-btn="sort" class="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm border bg-panel2 border-line text-zinc-300 hover:border-teal/40 transition">
          <span>↕️</span><span class="font-medium">Sort Order</span><span class="text-[9px] opacity-60">▾</span>
        </button>
        <div data-dd-panel="sort" class="hidden dropdown-panel absolute right-0 mt-2 w-56 bg-panel border border-line rounded-2xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto scrollbar-thin">
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
        <button data-dd-btn="view" class="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm border bg-teal/10 border-teal/40 text-teal hover:border-teal/60 transition">
          <span>${activeViewDef.icon}</span><span class="font-medium">${activeViewDef.name}</span><span class="text-[9px] opacity-60">▾</span>
        </button>
        <div data-dd-panel="view" class="hidden dropdown-panel absolute right-0 mt-2 w-64 bg-panel border border-line rounded-2xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto scrollbar-thin">
          ${viewPanelHTML()}
        </div>
      </div>`;
    }
    
    // Bind Study Mode Toggle Button
    const toggleBtn = document.getElementById('btn-toggle-study-mode');
    if (toggleBtn) {
      if (syllabusState.studyMode) {
        toggleBtn.className = "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm border transition bg-accentCyan/15 border-accentCyan/40 text-accentCyan hover:bg-accentCyan/20 shrink-0 font-bold";
        toggleBtn.innerHTML = `<i class="fa-solid fa-book-open"></i> <span>Study Mode: ON</span>`;
      } else {
        toggleBtn.className = "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm border transition bg-panel2 border-line text-zinc-400 hover:text-white shrink-0 font-bold";
        toggleBtn.innerHTML = `<i class="fa-solid fa-book-open"></i> <span>Study Mode: OFF</span>`;
      }
      
      toggleBtn.onclick = (e) => {
        e.stopPropagation();
        syllabusState.studyMode = !syllabusState.studyMode;
        initToolbar();
        renderAll();
      };
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

  // Circular SVG ring progress indicators
  function renderRingDeck() {
    const deck = document.getElementById('ring-deck');
    if (!deck) return;
    deck.innerHTML = SUBJECTS.map(s => {
      const c = COLOR_MAP[s.color] || COLOR_MAP.blue;
      const items = s.chapters.flatMap(ch=>ch.groups.flatMap(g=>g.items));
      const total = items.length, done = items.filter(i=>flags(i.id).mastered).length;
      const pct = total ? Math.round((done/total)*100) : 0;
      const r=22, circ=2*Math.PI*r, offset = circ - (pct/100)*circ;
      const active = syllabusState.subject === s.id;
      return `
      <button data-subj="${s.id}" class="subj-ring shrink-0 snap-start w-[190px] md:w-auto text-left ${active ? c.soft+' '+c.border : 'bg-panel border-line'} border rounded-2xl p-3 flex items-center gap-3 hover:border-${s.color==='blue'?'blue-400':s.color}/40 transition">
        <svg width="52" height="52" viewBox="0 0 52 52" class="shrink-0 -rotate-90">
          <circle class="ring-track" cx="26" cy="26" r="${r}" stroke-width="4"></circle>
          <circle class="ring-progress" cx="26" cy="26" r="${r}" stroke-width="4" stroke="${c.ring}" stroke-dasharray="${circ}" stroke-dashoffset="${offset}"></circle>
        </svg>
        <div class="min-w-0">
          <div class="text-[11px] font-mono ${c.text}">${pct}%</div>
          <div class="text-xs font-semibold text-zinc-200 truncate">${s.icon} ${s.name.split(' ')[0]}</div>
          <div class="text-[10px] text-zinc-500 font-mono">${done}/${total} mastered</div>
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
    const map={Easy:'text-teal bg-teal/10 border-teal/20', Moderate:'text-amber bg-amber/10 border-amber/20', Hard:'text-rose bg-rose/10 border-rose/20'};
    return `<span class="text-[10px] font-mono px-1.5 py-0.5 rounded border ${map[d]}">${d.toUpperCase()}</span>`;
  }

  function weightPill(w){ return `<span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-panel2 text-zinc-400 border border-line">${w.toUpperCase()} WEIGHT</span>`; }
  function effortLabel(e){ return `<span class="text-[10px] font-mono text-zinc-500">EFFORT: ${e.toUpperCase()}</span>`; }

  function miniTri(it) {
    if (syllabusState.studyMode) {
      return `<button class="text-accentCyan hover:text-cyan-400 font-bold uppercase text-[9px] bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded transition" onclick="tryOpenStudyNote('${it.id}')">Read</button>`;
    }
    const f = flags(it.id);
    return `<div class="flex items-center gap-1" title="L / P / M">
      <span data-tri="${it.id}" data-flag="learned" title="Learned" class="tri-box ${f.learned?'on':''}">${f.learned?'✓':''}</span>
      <span data-tri="${it.id}" data-flag="practiced" title="Practiced" class="tri-box p ${f.practiced?'on p':''}">${f.practiced?'✓':''}</span>
      <span data-tri="${it.id}" data-flag="mastered" title="Mastered" class="tri-box m ${f.mastered?'on m':''}">${f.mastered?'✓':''}</span>
    </div>`;
  }

  function triStateRow(it) {
    if (syllabusState.studyMode) {
      return `
      <div class="px-4 py-3 border-b border-line/60 last:border-0 hover:bg-white/[0.02] transition cursor-pointer" onclick="tryOpenStudyNote('${it.id}')">
        <p class="text-sm text-zinc-100 mb-1.5 font-medium hover:text-accentCyan transition">${it.name}</p>
        <div class="flex items-center flex-wrap gap-2 mb-1.5">${diffPill(it.difficulty)}${weightPill(it.weight)}${effortLabel(it.effort)}</div>
        <div class="flex justify-between items-center text-[10px] text-gray-500">
          <span class="text-accentCyan font-bold uppercase text-[9px]">Read Note →</span>
        </div>
      </div>`;
    }
    const f = flags(it.id);
    return `
    <div class="px-4 py-3 border-b border-line/60 last:border-0 hover:bg-white/[0.02] transition">
      <p class="text-sm text-zinc-100 mb-1.5 font-medium">${it.name}</p>
      <div class="flex items-center flex-wrap gap-2 mb-2.5">${diffPill(it.difficulty)}${weightPill(it.weight)}${effortLabel(it.effort)}</div>
      <div class="flex items-center gap-4">
        <label class="flex items-center gap-1.5 cursor-pointer select-none">
          <span data-tri="${it.id}" data-flag="learned" class="tri-box ${f.learned?'on':''}">${f.learned?'✓':''}</span><span class="text-xs text-zinc-400">Learned</span>
        </label>
        <label class="flex items-center gap-1.5 cursor-pointer select-none">
          <span data-tri="${it.id}" data-flag="practiced" class="tri-box p ${f.practiced?'on p':''}">${f.practiced?'✓':''}</span><span class="text-xs text-zinc-400">Practiced</span>
        </label>
        <label class="flex items-center gap-1.5 cursor-pointer select-none">
          <span data-tri="${it.id}" data-flag="mastered" class="tri-box m ${f.mastered?'on m':''}">${f.mastered?'✓':''}</span><span class="text-xs text-zinc-400">Mastered</span>
        </label>
      </div>
    </div>`;
  }

  function bindTriRows(root) {
    root.querySelectorAll('[data-tri]').forEach(el => el.onclick = (e) => {
      e.stopPropagation();
      toggleFlag(el.dataset.tri, el.dataset.flag);
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
      <div class="mb-3 bg-panel border border-line rounded-2xl overflow-hidden shadow">
        <button data-toggle-subj="${s.id}" class="w-full flex items-center gap-2 px-4 py-3 ${c.soft} border-b ${subjOpen?'border-line':'border-transparent'} text-left">
          <span class="text-lg">${s.icon}</span>
          <span class="font-heading font-semibold text-sm text-zinc-100">${s.name}</span>
          ${s.weightagePct ? `<span class="ml-auto text-[11px] font-mono ${c.text}">${pct}% &bull; ${s.weightagePct}% weight</span>` : `<span class="ml-auto text-[11px] font-mono ${c.text}">${pct}%</span>`}
          <span class="chev ${subjOpen?'open':''} text-zinc-500 text-xs ml-1">›</span>
        </button>
        ${subjOpen ? `<div class="p-4 space-y-5">
          ${s.chapters.map(ch => `
            <div>
              <p class="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">${ch.name}</p>
              <div class="space-y-2">
                ${ch.groups.map(g => {
                  const gs = groupStats(g);
                  const key = `G:${s.id}:${ch.name}:${g.name}`;
                  const gOpen = syllabusState.expandedGroups.has(key);
                  return `
                  <div class="bg-panel2/60 border border-line rounded-xl overflow-hidden">
                    <button data-toggle-group="${key}" class="w-full flex items-center gap-2 px-3.5 py-2.5 text-left hover:bg-white/[0.02] transition">
                      <span class="text-cyan-300/80 text-sm">📁</span>
                      ${g.high ? '<span class="text-amber text-xs">⭐</span>' : ''}
                      <span class="text-xs font-medium text-zinc-100 flex-1">${g.name}</span>
                      <span class="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-panel text-zinc-400">${gs.done}/${gs.total} Done</span>
                      <span class="chev ${gOpen?'open':''} text-zinc-500 text-xs">›</span>
                    </button>
                    ${gOpen ? `<div class="border-t border-line">${sortItems(g.items).map(triStateRow).join('')}</div>` : ''}
                  </div>`;
                }).join('')}
              </div>
            </div>`).join('')}
        </div>` : ''}
      </div>`;
    }).join('');
  }

  function bindTree(root) {
    root.querySelectorAll('[data-toggle-subj]').forEach(el => el.onclick = () => {
      const key = 'S:' + el.dataset.toggleSubj;
      if (syllabusState.expandedGroups.has(key)) {
        syllabusState.expandedGroups.delete(key);
      } else {
        syllabusState.expandedGroups.add(key);
      }
      renderAll();
    });
    root.querySelectorAll('[data-toggle-group]').forEach(el => el.onclick = () => {
      const key = el.dataset.toggleGroup;
      if (syllabusState.expandedGroups.has(key)) {
        syllabusState.expandedGroups.delete(key);
      } else {
        syllabusState.expandedGroups.add(key);
      }
      renderAll();
    });
    bindTriRows(root);
  }

  // Explorer View Rendering
  function renderExplorer(subjects) {
    const [subjId, chapName, groupName] = syllabusState.explorerPath;
    if (!subjId) {
      return `<div class="bg-panel border border-line rounded-2xl divide-y divide-line/60">` + subjects.map(s => {
        const {total,done} = subjectStats(s);
        return `<button data-open-s="${s.id}" class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition text-left">
          <span class="text-lg">${s.icon}</span><span class="text-xs font-medium text-zinc-100 flex-1">${s.name}</span>
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
      const skey = 's:' + s.id, sOpen = syllabusState.compactPath.has(skey);
      const {total,done} = subjectStats(s);
      return `
      <div>
        <button data-cp="${skey}" class="w-full flex items-center gap-2 px-3.5 py-2 hover:bg-white/[0.02] text-left">
          <span class="chev ${sOpen?'open':''} text-zinc-500 text-[10px] w-3">›</span>
          <span class="text-xs text-zinc-200 font-medium">${s.icon} ${s.name}</span>
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
                  if (syllabusState.studyMode) {
                    return `
                    <div class="flex items-center gap-2 py-1 cursor-pointer" onclick="tryOpenStudyNote('${it.id}')">
                      <span class="text-[9px] text-accentCyan font-bold">Read →</span>
                      <span class="text-[11px] text-zinc-300 hover:text-accentCyan transition">${it.name}</span>
                    </div>`;
                  }
                  return `
                  <div class="flex items-center gap-2 py-1">
                    <span data-toggle-all="${it.id}" title="Marks Learned + Practiced + Mastered together" class="tri-box m ${fullyDone(it.id)?'on m':''}">${fullyDone(it.id)?'✓':''}</span>
                    <span class="text-[11px] ${fullyDone(it.id)?'text-zinc-600 line-through':'text-zinc-400'}">${it.name}</span>
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
                <p class="text-xs text-zinc-300 truncate font-medium">${it.name}</p>
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

    if (syllabusState.studyMode) {
      const columns = [
        { id: 'easy', label: 'Easy Core', color: 'text-teal' },
        { id: 'medium', label: 'Moderate/Medium', color: 'text-violet' },
        { id: 'hard', label: 'Hard Advanced', color: 'text-amber' }
      ];
      const board = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">` + columns.map(col => {
        const colKey = col.id;
        const list = sortItems(items.filter(it => {
          const diff = it.difficulty.toLowerCase();
          return (colKey === 'medium' && (diff === 'medium' || diff === 'moderate')) || (diff === colKey);
        }));
        return `
        <div class="bg-panel border border-line rounded-2xl p-3 min-h-[250px] transition">
          <div class="flex items-center justify-between mb-3 px-1">
            <span class="text-[10px] font-mono uppercase tracking-wider ${col.color} font-bold">${col.label}</span>
            <span class="text-[10px] font-mono text-zinc-500">${list.length}</span>
          </div>
          <div class="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
            ${list.slice(0,60).map(it => `
              <div class="kanban-card bg-panel2 border border-line rounded-xl p-3 shadow-sm hover:border-teal/30 hover:bg-white/5 transition cursor-pointer" onclick="tryOpenStudyNote('${it.id}')">
                <p class="text-xs text-zinc-200 mb-1.5 leading-snug font-medium hover:text-accentCyan transition">${it.name}</p>
                <p class="text-[9px] text-zinc-500 font-mono mb-2">${it.topicName} &bull; ${it.subjectName.split(' ')[0]}</p>
                <div class="flex gap-1 justify-between items-center">
                  ${diffPill(it.difficulty)}
                  <span class="text-accentCyan uppercase font-bold text-[9px]">Read →</span>
                </div>
              </div>`).join('')}
            ${list.length===0 ? `<p class="text-[9px] text-zinc-600 font-mono text-center pt-1 select-none">no matches</p>` : ''}
          </div>
        </div>`;
      }).join('') + `</div>`;
      return board;
    }

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
              <p class="text-xs text-zinc-200 mb-1.5 leading-snug font-medium">${it.name}</p>
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
                <p class="text-zinc-200 font-medium">${it.name}</p>
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
