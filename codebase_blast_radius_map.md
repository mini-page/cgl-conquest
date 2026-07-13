# Codebase Blast Radius Map — GitNexus

This document maps the architectural "blast radius" (the propagation of breaks or regressions) across the scripts in the **CGL Conquest** dashboard project. The values and relations are derived from the GitNexus graph index (**442 symbols, 994 relationships**).

---

## 1. High-Level Dependency Graph

The project is structured as a single-page application (SPA). All page views are loaded globally on startup by `js/app.js`, referencing shared configurations in `js/state.js` and `study/subjects.js`.

```mermaid
graph TD
    %% Base Data Layers
    subgraph Core Data Layers [Critical Risk]
        state["js/state.js<br>(Global appState & Mocks)"]
        subjs["study/subjects.js<br>(Study Syllabus Catalog)"]
    end

    %% Routing / Shell Orchestration
    subgraph App Shell [High Risk]
        app["js/app.js / app.js<br>(Initialization)"]
        nav["js/navigation.js<br>(Tabs, Theme, Shortcuts)"]
    end

    %% Modules / Tabs
    subgraph Page Views [Low Risk]
        dash["js/dashboard.js<br>(Stats & Pomodoro)"]
        syll["js/syllabus.js<br>(Syllabus & Kanban)"]
        plan["js/plan.js<br>(Roadmap Checklist)"]
        tk["js/toolkit.js<br>(Study Note Viewer)"]
        speed["js/speed.js<br>(Math/Vocab Drills)"]
        mocks["js/mocks.js<br>(Test Analytics)"]
    end

    %% Relations
    state --> app
    state --> dash
    state --> syll
    state --> plan
    state --> mocks

    subjs --> syll
    subjs --> tk

    app --> nav
    app --> dash
    app --> syll
    app --> plan
    app --> tk
    app --> speed
    app --> mocks

    nav --> syll
    nav --> plan
    nav --> tk
    nav --> speed

    syll --> tk
    plan --> tk
```

---

## 2. Blast Radius Matrix by File

| Target File | Risk Level | Direct Downstream Callers (d=1) | What Breaks if Changed (The Blast Radius) |
| :--- | :---: | :--- | :--- |
| **`js/state.js`** | <span style="color:#ef4444">**CRITICAL**</span> | `js/app.js`<br>`js/dashboard.js`<br>`js/syllabus.js`<br>`js/plan.js`<br>`js/mocks.js` | Modifying the schema of `appState`, `SYLLABUS_DATA`, or `PLAN_DATA` will cause startup crashes or render failures across all tabs. |
| **`study/subjects.js`** | <span style="color:#f97316">**HIGH**</span> | `js/syllabus.js`<br>`js/toolkit.js` | Defines the mapping layout for study notes. If corrupted, syllabus items will fail to open learning modals, and note navigation (Prev/Next) will fail. |
| **`js/navigation.js`** | <span style="color:#f97316">**HIGH**</span> | `js/app.js` | Manages page routing, keyboard shortcut triggers, theme toggling, and scroll locking. Buggy edits here can freeze the screen layout or block user navigation. |
| **`js/app.js`** | <span style="color:#f97316">**HIGH**</span> | None (DOM Entrypoint) | Binds the `DOMContentLoaded` startup pipeline. Any runtime exception halts script executions, leaving the screen completely blank on load. |
| **`js/toolkit.js`** | <span style="color:#eab308">**MEDIUM**</span> | `js/syllabus.js`<br>`js/plan.js` | Manages the study notes viewer modal. Issues here will prevent users from opening markdown notes from the syllabus/timeline. |
| **`js/syllabus.js`** | <span style="color:#3b82f6">**LOW**</span> | `js/navigation.js` | Renders trees, compact lists, tables, grid cards, and Kanban columns. Errors only affect the Syllabus view. |
| **`js/dashboard.js`** | <span style="color:#3b82f6">**LOW**</span> | `js/app.js` | Renders overview metrics, countdown timers, and Pomodoro controls. Errors only affect the Dashboard screen. |
| **`js/plan.js`** | <span style="color:#3b82f6">**LOW**</span> | `js/navigation.js` | Handles the study plan timeline checklist. Errors are scoped to the Study Plan tab. |
| **`js/speed.js`** | <span style="color:#3b82f6">**LOW**</span> | `js/app.js` | Manages practice quizzes and speed math drills. Errors are scoped to the Drills tab. |
| **`js/mocks.js`** | <span style="color:#3b82f6">**LOW**</span> | `js/app.js` | Processes mock exam analytics and SVG charts. Errors are scoped to the Mock Analytics tab. |

---

## 3. Key Inter-file Execution Flows

### 1. Unified Study Note Display Flow
When a user clicks on a topic to study inside the Syllabus or Study Plan:
1. `tryOpenStudyNote(subtopicId)` inside `js/syllabus.js` is triggered.
2. It invokes `openStudyViewer(subtopicId)` which is globally exposed by `js/toolkit.js`.
3. `js/toolkit.js` parses the file from the `study/` directory and renders it into `#modal-study-viewer`.

> [!IMPORTANT]
> **Impact Warning:** If `window.openStudyViewer` is renamed or missing, clicking syllabus tiles will throw a Javascript TypeError, breaking user study flows.

### 2. Page Navigation & Keybinding Interception
1. Global keyboard keypresses are handled by the `keydown` event listener in `js/navigation.js`.
2. It checks page target mappings or overlays like `#modal-study-viewer`'s active state.
3. It calls the respective renderers (`renderSyllabus`, `renderStudyPlan`, etc.) dynamically.

> [!WARNING]
> **Impact Warning:** Changing `initNavigation` or keyboard callbacks can cause the application to ignore user input or loop keys endlessly.
