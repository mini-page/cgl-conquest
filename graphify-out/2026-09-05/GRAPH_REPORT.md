# Graph Report - CGL-conquest  (2026-09-05)

## Corpus Check
- 102 files · ~303,896 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 613 nodes · 844 edges · 97 communities (39 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8c8088a4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- syllabus.js
- toolkit.js
- compile_data.js
- state.js
- dashboard.js
- navigation.js
- speed.js
- mocks.js
- package.json
- CustomDropdown
- manifest.json
- CustomCalendar
- build-tailwind.js
- CustomTooltip
- opencode.json
- graphify.js
- cmdpalette.js
- plan.js
- 22. SECURITY & ACCESSIBILITY AUDIT HARDENING GUIDELINES (2026-08-17)
- suite.js
- sw.js
- PROJECT MEMORIFY — SSC CGL Conquest Dashboard
- 20. QUICK REFERENCE CARD
- 21. PERFORMANCE OPTIMIZATIONS (Applied 2026-07-13)
- GitNexus Guide
- Refactoring with GitNexus
- Commands
- Impact Analysis with GitNexus
- 16. BLAST RADIUS MAP
- 5. ALL FUNCTIONS BY MODULE
- Debugging with GitNexus
- Exploring Codebases with GitNexus
- GitNexus — Code Intelligence
- GitNexus — Code Intelligence
- SSC CGL 40-Day Rank-Maker Dashboard 🏆
- 6. ALL GLOBAL VARIABLES
- 9. EXECUTION FLOWS (33 Total from GitNexus)
- 14. STYLING & THEMING
- 3. GLOBAL STATE & DATA FLOW
- 10. SYLLABUS DATA STRUCTURE
- 15. COUPLING & COHESION ANALYSIS
- 13. STUDY TOOLKIT VIEWS
- 4. MODULE DEPENDENCY MAP
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `renderAll()` - 24 edges
2. `PROJECT MEMORIFY — SSC CGL Conquest Dashboard` - 24 edges
3. `renderStudyTrackerAll()` - 21 edges
4. `renderMockAnalytics()` - 14 edges
5. `20. QUICK REFERENCE CARD` - 14 edges
6. `MockElement` - 13 edges
7. `flags()` - 12 edges
8. `21. PERFORMANCE OPTIMIZATIONS (Applied 2026-07-13)` - 12 edges
9. `CustomDropdown` - 10 edges
10. `initTheme()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `renderAll()` --indirect_call--> `triggerMathTypesetting()`  [INFERRED]
  js/app.js → js/state.js
- `renderAll()` --indirect_call--> `triggerMathTypesetting()`  [INFERRED]
  js/dashboard.js → js/state.js
- `navigateToPage()` --indirect_call--> `triggerMathTypesetting()`  [INFERRED]
  js/navigation.js → js/state.js
- `renderStudyPlan()` --indirect_call--> `triggerMathTypesetting()`  [INFERRED]
  js/plan.js → js/state.js
- `showQuickRefTables()` --indirect_call--> `triggerMathTypesetting()`  [INFERRED]
  js/toolkit.js → js/state.js

## Import Cycles
- None detected.

## Communities (97 total, 6 thin omitted)

### Community 0 - "syllabus.js"
Cohesion: 0.10
Nodes (55): anyFilterActive(), applyFilterSelection(), bindCompact(), bindExplorer(), bindFilterRow(), bindGrid(), bindKanban(), bindTable() (+47 more)

### Community 1 - "toolkit.js"
Cohesion: 0.06
Nodes (50): renderAll(), triggerMathTypesetting(), backToSubjects(), buildSearchIndex(), buildStudyFilterRow(), clearStudyFilters(), closeStudyViewer(), deleteNote() (+42 more)

### Community 3 - "compile_data.js"
Cohesion: 0.09
Nodes (22): computer, dataDir, fs, geography, gkDir, grammar, history, laws (+14 more)

### Community 4 - "state.js"
Cohesion: 0.14
Nodes (12): appState, COMPUTER_TARGET_MAP, EMBEDDED_QUIZZES, escapeHTML(), FLASHCARDS, GK_STATIC_DATA, loadStateFromStorage(), parseMarkdown() (+4 more)

### Community 5 - "dashboard.js"
Cohesion: 0.13
Nodes (27): calculateOverallStats(), closeExamTargetModal(), formatTimeSeconds(), initExamTargetEditor(), initPomoTimer(), hidePomoPopover(), showPomoPopover(), togglePomoPopover() (+19 more)

### Community 6 - "navigation.js"
Cohesion: 0.19
Nodes (20): closeShortcutsHelpModal(), expandNav(), filterShortcuts(), handleShortcutAction(), initHeaderScroll(), initNavigation(), initTheme(), navigateToPage() (+12 more)

### Community 7 - "speed.js"
Cohesion: 0.21
Nodes (17): checkDrillAnswer(), clearIdleTimer(), DRILL_MODE_LABELS, endChallengeRun(), generateChallengeQuestion(), generateDrillQuestion(), generateMathOptions(), generateProceduralMathQuestion() (+9 more)

### Community 8 - "mocks.js"
Cohesion: 0.13
Nodes (30): cancelMockEdit(), deleteMock(), editMock(), exportMockReport(), formatDateDMY(), getSectionalAggregates(), getSmoothSvgPath(), getSubtopicDetails() (+22 more)

### Community 9 - "package.json"
Cohesion: 0.17
Nodes (11): description, devDependencies, tailwindcss, tailwindcss, name, scripts, build, build:css (+3 more)

### Community 11 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 12 - "CustomCalendar"
Cohesion: 0.40
Nodes (3): CustomCalendar, formatDateToDMY(), parseDateInputSafe()

### Community 13 - "build-tailwind.js"
Cohesion: 0.29
Nodes (6): { execSync }, fs, inputPath, isWatch, outputPath, path

### Community 15 - "opencode.json"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

### Community 17 - "cmdpalette.js"
Cohesion: 0.39
Nodes (7): buildRegistry(), close(), execute(), filterCommands(), open(), render(), renderActiveOnly()

### Community 18 - "plan.js"
Cohesion: 0.48
Nodes (5): btnCompleteDay, completeActiveDay(), renderStudyPlan(), resetActiveDayTo(), updatePhaseTabs()

### Community 19 - "22. SECURITY & ACCESSIBILITY AUDIT HARDENING GUIDELINES (2026-08-17)"
Cohesion: 0.40
Nodes (5): 22.1 XSS Prevention Standards, 22.2 Focus, Shortcut & UX Safety Rules, 22.3 Accessibility (WCAG 2.1 AA) Integration, 22.4 Service Worker & Offline Cache Integrity, 22. SECURITY & ACCESSIBILITY AUDIT HARDENING GUIDELINES (2026-08-17)

### Community 21 - "suite.js"
Cohesion: 0.06
Nodes (16): assert, colors, fs, localStorageMock, logTestFail(), logTestPass(), mockBody, MockClassList (+8 more)

### Community 73 - "PROJECT MEMORIFY — SSC CGL Conquest Dashboard"
Cohesion: 0.14
Nodes (13): 11. 40-DAY PLAN STRUCTURE, 12. SPEED DRILL MODES (11 Total), 17. ANTI-PATTERNS & TECHNICAL DEBT, 18. FILE MOVEMENT GUIDELINES, 19. DEPENDENCY GRAPH (Simplified), 1. PROJECT IDENTITY, 2. FILE STRUCTURE & OWNERSHIP, 7. HTML PAGE SECTIONS (index.html) (+5 more)

### Community 74 - "20. QUICK REFERENCE CARD"
Cohesion: 0.14
Nodes (14): 20. QUICK REFERENCE CARD, Boot: `DOMContentLoaded` → loadApplicationData → loadStateFromStorage → init* → renderAll, Build All: `npm run build` → builds CSS and data, Build CSS: `npm install && npm run build:css` → generates minified style.css, Build Data: `npm run build:data` → inlines JSON into state.js, Lookup: `SUBTOPIC_LOOKUP[id]` → O(1) access to subtopic data, Modals: `showModal(title, msg, type)` / `showConfirm(title, msg)` → Promise-based custom modals, Navigation: `initNavigation()` → page switching → page-specific render (+6 more)

### Community 75 - "21. PERFORMANCE OPTIMIZATIONS (Applied 2026-07-13)"
Cohesion: 0.17
Nodes (12): 21.10 Custom Modals (PWA-consistent), 21.11 Performance Impact Summary, 21.1 Script Loading, 21.2 Service Worker, 21.3 Search Debouncing, 21.4 localStorage Safety, 21.5 Render Optimization, 21.6 O(1) Subtopic Lookup (+4 more)

### Community 76 - "GitNexus Guide"
Cohesion: 0.18
Nodes (10): Always Start Here, Control & data dependence (`pdg_query`), GitNexus Guide, Graph Schema, Paginating `list_repos`, Resources Reference, Shortest path between two symbols (`trace`), Skills (+2 more)

### Community 77 - "Refactoring with GitNexus"
Cohesion: 0.18
Nodes (10): Checklists, Example: Rename `validateUser` to `authenticateUser`, Extract Module, Refactoring with GitNexus, Rename Symbol, Risk Rules, Split Function/Service, Tools (+2 more)

### Community 78 - "Commands"
Cohesion: 0.20
Nodes (9): After Indexing, analyze — Build or refresh the index, clean — Delete the index, Commands, GitNexus CLI Commands, list — Show all indexed repos, status — Check index freshness, Troubleshooting (+1 more)

### Community 79 - "Impact Analysis with GitNexus"
Cohesion: 0.22
Nodes (8): Checklist, Example: "What breaks if I change validateUser?", Impact Analysis with GitNexus, Risk Assessment, Tools, Understanding Output, When to Use, Workflow

### Community 80 - "16. BLAST RADIUS MAP"
Cohesion: 0.22
Nodes (9): 16.1 js/state.js (Foundation), 16.2 js/navigation.js, 16.3 js/dashboard.js, 16.4 js/syllabus.js, 16.5 js/plan.js, 16.6 js/mocks.js, 16.7 js/toolkit.js, 16.8 js/speed.js (+1 more)

### Community 81 - "5. ALL FUNCTIONS BY MODULE"
Cohesion: 0.22
Nodes (9): 5.1 js/state.js (State & Database), 5.2 js/navigation.js (Navigation & Theming) — 505 lines, 5.3 js/dashboard.js (Dashboard & Timers) — 720 lines, 5.4 js/syllabus.js (Syllabus Console) — 1073+ lines, 5.5 js/plan.js (40-Day Study Plan) — 223 lines, 5.6 js/mocks.js (Mock Analytics) — 221 lines, 5.7 js/toolkit.js (Study Toolkit) — 1144 lines, 5.8 js/speed.js (Speed Drills & Challenge) — 1236 lines (+1 more)

### Community 82 - "Debugging with GitNexus"
Cohesion: 0.25
Nodes (7): Checklist, Debugging Patterns, Debugging with GitNexus, Example: "Payment endpoint returns 500 intermittently", Tools, When to Use, Workflow

### Community 83 - "Exploring Codebases with GitNexus"
Cohesion: 0.25
Nodes (7): Checklist, Example: "How does payment processing work?", Exploring Codebases with GitNexus, Resources, Tools, When to Use, Workflow

### Community 84 - "GitNexus — Code Intelligence"
Cohesion: 0.29
Nodes (6): Always Do, CLI, GitNexus — Code Intelligence, graphify, Never Do, Resources

### Community 85 - "GitNexus — Code Intelligence"
Cohesion: 0.29
Nodes (6): Always Do, CLI, GitNexus — Code Intelligence, graphify, Never Do, Resources

### Community 87 - "SSC CGL 40-Day Rank-Maker Dashboard 🏆"
Cohesion: 0.29
Nodes (6): 🚀 How to Run the Dashboard, Option 1: Direct File Open (Easiest), Option 2: Live Local Server (Recommended for dynamic resizing), 🎯 Premium Features Built for Your Success, SSC CGL 40-Day Rank-Maker Dashboard 🏆, 🧭 Syllabus Navigation Map

### Community 88 - "6. ALL GLOBAL VARIABLES"
Cohesion: 0.33
Nodes (6): 6.1 js/state.js, 6.2 js/navigation.js, 6.3 js/syllabus.js, 6.4 js/speed.js, 6.5 js/toolkit.js, 6. ALL GLOBAL VARIABLES

### Community 89 - "9. EXECUTION FLOWS (33 Total from GitNexus)"
Cohesion: 0.33
Nodes (6): 9.1 Boot Sequence, 9.2 Navigation Flow, 9.3 Speed Drill Flow, 9.4 Conquest Challenge Flow, 9.5 State Persistence Flow, 9. EXECUTION FLOWS (33 Total from GitNexus)

### Community 90 - "14. STYLING & THEMING"
Cohesion: 0.40
Nodes (5): 14.1 CSS Architecture, 14.2 Theme Variables, 14.3 Accent Colors, 14.4 Key CSS Classes, 14. STYLING & THEMING

### Community 91 - "3. GLOBAL STATE & DATA FLOW"
Cohesion: 0.40
Nodes (5): 3.1 Central State Object (`appState`), 3.2 Data Flow Architecture, 3.3 Inline Compiled Databases, 3.4 Study Content Loading, 3. GLOBAL STATE & DATA FLOW

### Community 92 - "10. SYLLABUS DATA STRUCTURE"
Cohesion: 0.50
Nodes (4): 10.1 Subject Weightage (Exam), 10.2 Topic Hierarchy, 10.3 Topic Count by Subject, 10. SYLLABUS DATA STRUCTURE

### Community 93 - "15. COUPLING & COHESION ANALYSIS"
Cohesion: 0.50
Nodes (4): 15.1 Cohesion Scores (from GitNexus Clusters), 15.2 Highest Blast Radius Functions, 15.3 Highest Risk Changes, 15. COUPLING & COHESION ANALYSIS

### Community 94 - "13. STUDY TOOLKIT VIEWS"
Cohesion: 0.67
Nodes (3): 13.1 Syllabus Console Views (6), 13.2 Study Notes Views (6), 13. STUDY TOOLKIT VIEWS

### Community 95 - "4. MODULE DEPENDENCY MAP"
Cohesion: 0.67
Nodes (3): 4.1 Import/Export Relationships, 4.2 Cross-Module Coupling Summary, 4. MODULE DEPENDENCY MAP

## Knowledge Gaps
- **218 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `fs`, `path`, `{ execSync }` (+213 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 329 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `triggerMathTypesetting()` connect `toolkit.js` to `plan.js`, `state.js`, `dashboard.js`, `navigation.js`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `PROJECT MEMORIFY — SSC CGL Conquest Dashboard` connect `PROJECT MEMORIFY — SSC CGL Conquest Dashboard` to `20. QUICK REFERENCE CARD`, `21. PERFORMANCE OPTIMIZATIONS (Applied 2026-07-13)`, `16. BLAST RADIUS MAP`, `5. ALL FUNCTIONS BY MODULE`, `22. SECURITY & ACCESSIBILITY AUDIT HARDENING GUIDELINES (2026-08-17)`, `6. ALL GLOBAL VARIABLES`, `9. EXECUTION FLOWS (33 Total from GitNexus)`, `14. STYLING & THEMING`, `3. GLOBAL STATE & DATA FLOW`, `10. SYLLABUS DATA STRUCTURE`, `15. COUPLING & COHESION ANALYSIS`, `13. STUDY TOOLKIT VIEWS`, `4. MODULE DEPENDENCY MAP`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `renderAll()` connect `dashboard.js` to `toolkit.js`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `fs` to the rest of the system?**
  _218 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `syllabus.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10087719298245613 - nodes in this community are weakly interconnected._
- **Should `toolkit.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06428571428571428 - nodes in this community are weakly interconnected._
- **Should `compile_data.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._