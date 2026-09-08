# Graph Report - ssc_cgl_dashboard  (2026-09-07)

## Corpus Check
- 134 files · ~206,220 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 782 nodes · 1091 edges · 106 communities (46 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53

## God Nodes (most connected - your core abstractions)
1. `renderAll()` - 24 edges
2. `PROJECT MEMORIFY — SSC CGL Conquest Dashboard` - 24 edges
3. `renderStudyTrackerAll()` - 21 edges
4. `QrSyncModal` - 20 edges
5. `CalendarPicker` - 14 edges
6. `initTheme()` - 14 edges
7. `renderMockAnalytics()` - 14 edges
8. `20. QUICK REFERENCE CARD` - 14 edges
9. `MockElement` - 13 edges
10. `flags()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `renderAll()` --indirect_call--> `triggerMathTypesetting()`  [INFERRED]
  js/app.js → js/state.js
- `triggerMathTypesetting()` --indirect_call--> `renderAll()`  [INFERRED]
  js/state.js → js/dashboard.js
- `triggerMathTypesetting()` --indirect_call--> `showQuickRefTables()`  [INFERRED]
  js/state.js → js/toolkit.js
- `navigateToPage()` --indirect_call--> `triggerMathTypesetting()`  [INFERRED]
  js/navigation.js → js/state.js
- `renderStudyPlan()` --indirect_call--> `triggerMathTypesetting()`  [INFERRED]
  js/plan.js → js/state.js

## Import Cycles
- None detected.

## Communities (106 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (56): renderAll(), navigateToPage(), btnCompleteDay, completeActiveDay(), renderStudyPlan(), resetActiveDayTo(), updatePhaseTabs(), triggerMathTypesetting() (+48 more)

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (55): anyFilterActive(), applyFilterSelection(), bindCompact(), bindExplorer(), bindFilterRow(), bindGrid(), bindKanban(), bindTable() (+47 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (7): CalendarPicker, HeroHeader, PillGroup, SearchBar, toast, ToggleSwitch, TriStateCheckbox

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (17): assert, colors, cp, fs, localStorageMock, logTestFail(), logTestPass(), mockBody (+9 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (27): calculateOverallStats(), closeExamTargetModal(), formatTimeSeconds(), getSrsDueTopics(), initExamTargetEditor(), initPomoTimer(), hidePomoPopover(), showPomoPopover() (+19 more)

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (33): cancelMockEdit(), closeMockDetailModal(), deleteMock(), editMock(), exportMockReport(), formatDateDMY(), getSectionalAggregates(), getSmoothSvgPath() (+25 more)

### Community 6 - "Community 6"
Cohesion: 0.18
Nodes (21): closeShortcutsHelpModal(), expandNav(), filterShortcuts(), handleShortcutAction(), initHeaderScroll(), initNavigation(), initTheme(), openQrSyncModal() (+13 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (22): computer, dataDir, fs, geography, gkDir, grammar, history, laws (+14 more)

### Community 8 - "Community 8"
Cohesion: 0.19
Nodes (18): challengeQuestionTelemetry, checkDrillAnswer(), clearIdleTimer(), DRILL_MODE_LABELS, endChallengeRun(), generateChallengeQuestion(), generateDrillQuestion(), generateMathOptions() (+10 more)

### Community 9 - "Community 9"
Cohesion: 0.20
Nodes (3): expandCompactPayload(), extractCompactPayload(), QrSyncModal

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (12): appState, COMPUTER_TARGET_MAP, EMBEDDED_QUIZZES, escapeHTML(), FLASHCARDS, GK_STATIC_DATA, loadStateFromStorage(), parseMarkdown() (+4 more)

### Community 11 - "Community 11"
Cohesion: 0.14
Nodes (13): 11. 40-DAY PLAN STRUCTURE, 12. SPEED DRILL MODES (11 Total), 17. ANTI-PATTERNS & TECHNICAL DEBT, 18. FILE MOVEMENT GUIDELINES, 19. DEPENDENCY GRAPH (Simplified), 1. PROJECT IDENTITY, 2. FILE STRUCTURE & OWNERSHIP, 7. HTML PAGE SECTIONS (index.html) (+5 more)

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (14): 20. QUICK REFERENCE CARD, Boot: `DOMContentLoaded` → loadApplicationData → loadStateFromStorage → init* → renderAll, Build All: `npm run build` → builds CSS and data, Build CSS: `npm install && npm run build:css` → generates minified style.css, Build Data: `npm run build:data` → inlines JSON into state.js, Lookup: `SUBTOPIC_LOOKUP[id]` → O(1) access to subtopic data, Modals: `showModal(title, msg, type)` / `showConfirm(title, msg)` → Promise-based custom modals, Navigation: `initNavigation()` → page switching → page-specific render (+6 more)

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (11): Bind the repository first, Checklists, Example: Rename `validateUser` to `authenticateUser`, Extract Module, Refactoring with GitNexus, Rename Symbol, Risk Rules, Split Function/Service (+3 more)

### Community 14 - "Community 14"
Cohesion: 0.17
Nodes (11): Bind the repository first, Checklists, Example: Rename `validateUser` to `authenticateUser`, Extract Module, Refactoring with GitNexus, Rename Symbol, Risk Rules, Split Function/Service (+3 more)

### Community 15 - "Community 15"
Cohesion: 0.17
Nodes (11): description, devDependencies, tailwindcss, tailwindcss, name, scripts, build, build:css (+3 more)

### Community 16 - "Community 16"
Cohesion: 0.17
Nodes (12): 21.10 Custom Modals (PWA-consistent), 21.11 Performance Impact Summary, 21.1 Script Loading, 21.2 Service Worker, 21.3 Search Debouncing, 21.4 localStorage Safety, 21.5 Render Optimization, 21.6 O(1) Subtopic Lookup (+4 more)

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (10): Always Start Here, Control & data dependence (`pdg_query`), GitNexus Guide, Graph Schema, Paginating `list_repos`, Resources Reference, Shortest path between two symbols (`trace`), Skills (+2 more)

### Community 18 - "Community 18"
Cohesion: 0.18
Nodes (10): Always Start Here, Control & data dependence (`pdg_query`), GitNexus Guide, Graph Schema, Paginating `list_repos`, Resources Reference, Shortest path between two symbols (`trace`), Skills (+2 more)

### Community 19 - "Community 19"
Cohesion: 0.40
Nodes (3): CustomCalendar, formatDateToDMY(), parseDateInputSafe()

### Community 21 - "Community 21"
Cohesion: 0.20
Nodes (9): After Indexing, analyze — Build or refresh the index, clean — Delete the index, Commands, GitNexus CLI Commands, list — Show all indexed repos, status — Check index freshness, Troubleshooting (+1 more)

### Community 22 - "Community 22"
Cohesion: 0.20
Nodes (9): Bind the repository first, Checklist, Example: "What breaks if I change validateUser?", Impact Analysis with GitNexus, Risk Assessment, Tools, Understanding Output, When to Use (+1 more)

### Community 23 - "Community 23"
Cohesion: 0.20
Nodes (9): After Indexing, analyze — Build or refresh the index, clean — Delete the index, Commands, GitNexus CLI Commands, list — Show all indexed repos, status — Check index freshness, Troubleshooting (+1 more)

### Community 24 - "Community 24"
Cohesion: 0.20
Nodes (9): Bind the repository first, Checklist, Example: "What breaks if I change validateUser?", Impact Analysis with GitNexus, Risk Assessment, Tools, Understanding Output, When to Use (+1 more)

### Community 25 - "Community 25"
Cohesion: 0.22
Nodes (8): Bind the repository first, Checklist, Debugging Patterns, Debugging with GitNexus, Example: "Payment endpoint returns 500 intermittently", Tools, When to Use, Workflow

### Community 26 - "Community 26"
Cohesion: 0.22
Nodes (8): Bind the repository first, Checklist, Example: "How does payment processing work?", Exploring Codebases with GitNexus, Resources, Tools, When to Use, Workflow

### Community 27 - "Community 27"
Cohesion: 0.22
Nodes (8): Bind the repository first, Checklist, Debugging Patterns, Debugging with GitNexus, Example: "Payment endpoint returns 500 intermittently", Tools, When to Use, Workflow

### Community 28 - "Community 28"
Cohesion: 0.22
Nodes (8): Bind the repository first, Checklist, Example: "How does payment processing work?", Exploring Codebases with GitNexus, Resources, Tools, When to Use, Workflow

### Community 30 - "Community 30"
Cohesion: 0.39
Nodes (7): buildRegistry(), close(), execute(), filterCommands(), open(), render(), renderActiveOnly()

### Community 31 - "Community 31"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 32 - "Community 32"
Cohesion: 0.22
Nodes (9): 16.1 js/state.js (Foundation), 16.2 js/navigation.js, 16.3 js/dashboard.js, 16.4 js/syllabus.js, 16.5 js/plan.js, 16.6 js/mocks.js, 16.7 js/toolkit.js, 16.8 js/speed.js (+1 more)

### Community 33 - "Community 33"
Cohesion: 0.22
Nodes (9): 5.1 js/state.js (State & Database), 5.2 js/navigation.js (Navigation & Theming) — 505 lines, 5.3 js/dashboard.js (Dashboard & Timers) — 720 lines, 5.4 js/syllabus.js (Syllabus Console) — 1073+ lines, 5.5 js/plan.js (40-Day Study Plan) — 223 lines, 5.6 js/mocks.js (Mock Analytics) — 221 lines, 5.7 js/toolkit.js (Study Toolkit) — 1144 lines, 5.8 js/speed.js (Speed Drills & Challenge) — 1236 lines (+1 more)

### Community 35 - "Community 35"
Cohesion: 0.29
Nodes (6): Always Do, CLI, GitNexus — Code Intelligence, graphify, Never Do, Resources

### Community 36 - "Community 36"
Cohesion: 0.29
Nodes (6): { execSync }, fs, inputPath, isWatch, outputPath, path

### Community 37 - "Community 37"
Cohesion: 0.29
Nodes (6): Always Do, CLI, GitNexus — Code Intelligence, graphify, Never Do, Resources

### Community 38 - "Community 38"
Cohesion: 0.29
Nodes (6): 🚀 How to Run the Dashboard, Option 1: Direct File Open (Easiest), Option 2: Live Local Server (Recommended for dynamic resizing), 🎯 Premium Features Built for Your Success, SSC CGL 40-Day Rank-Maker Dashboard 🏆, 🧭 Syllabus Navigation Map

### Community 40 - "Community 40"
Cohesion: 0.33
Nodes (6): 6.1 js/state.js, 6.2 js/navigation.js, 6.3 js/syllabus.js, 6.4 js/speed.js, 6.5 js/toolkit.js, 6. ALL GLOBAL VARIABLES

### Community 41 - "Community 41"
Cohesion: 0.33
Nodes (6): 9.1 Boot Sequence, 9.2 Navigation Flow, 9.3 Speed Drill Flow, 9.4 Conquest Challenge Flow, 9.5 State Persistence Flow, 9. EXECUTION FLOWS (33 Total from GitNexus)

### Community 42 - "Community 42"
Cohesion: 0.40
Nodes (5): 14.1 CSS Architecture, 14.2 Theme Variables, 14.3 Accent Colors, 14.4 Key CSS Classes, 14. STYLING & THEMING

### Community 43 - "Community 43"
Cohesion: 0.40
Nodes (5): 22.1 XSS Prevention Standards, 22.2 Focus, Shortcut & UX Safety Rules, 22.3 Accessibility (WCAG 2.1 AA) Integration, 22.4 Service Worker & Offline Cache Integrity, 22. SECURITY & ACCESSIBILITY AUDIT HARDENING GUIDELINES (2026-08-17)

### Community 44 - "Community 44"
Cohesion: 0.40
Nodes (5): 3.1 Central State Object (`appState`), 3.2 Data Flow Architecture, 3.3 Inline Compiled Databases, 3.4 Study Content Loading, 3. GLOBAL STATE & DATA FLOW

### Community 45 - "Community 45"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

### Community 46 - "Community 46"
Cohesion: 0.50
Nodes (4): 10.1 Subject Weightage (Exam), 10.2 Topic Hierarchy, 10.3 Topic Count by Subject, 10. SYLLABUS DATA STRUCTURE

### Community 47 - "Community 47"
Cohesion: 0.50
Nodes (4): 15.1 Cohesion Scores (from GitNexus Clusters), 15.2 Highest Blast Radius Functions, 15.3 Highest Risk Changes, 15. COUPLING & COHESION ANALYSIS

### Community 49 - "Community 49"
Cohesion: 0.67
Nodes (3): 13.1 Syllabus Console Views (6), 13.2 Study Notes Views (6), 13. STUDY TOOLKIT VIEWS

### Community 50 - "Community 50"
Cohesion: 0.67
Nodes (3): 4.1 Import/Export Relationships, 4.2 Cross-Module Coupling Summary, 4. MODULE DEPENDENCY MAP

## Knowledge Gaps
- **270 isolated node(s):** `btnCompleteDay`, `DIRECT_MASTER_PAGES`, `fullscreenCloseBtn`, `progressStore`, `searchIndex` (+265 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 401 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `triggerMathTypesetting()` connect `Community 0` to `Community 10`, `Community 4`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `PROJECT MEMORIFY — SSC CGL Conquest Dashboard` connect `Community 11` to `Community 32`, `Community 33`, `Community 40`, `Community 41`, `Community 42`, `Community 43`, `Community 44`, `Community 12`, `Community 46`, `Community 47`, `Community 16`, `Community 49`, `Community 50`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `renderAll()` connect `Community 4` to `Community 0`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `btnCompleteDay`, `DIRECT_MASTER_PAGES`, `fullscreenCloseBtn` to the rest of the system?**
  _270 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05384615384615385 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.10213032581453634 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06561085972850679 - nodes in this community are weakly interconnected._