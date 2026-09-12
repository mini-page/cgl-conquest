/**
 * Tailwind CSS Build Script
 * Generates a production-ready CSS file from tailwind.config.js
 * Usage: node build-tailwind.js [--watch]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const isWatch = process.argv.includes('--watch');

// CSS input template with all custom styles
const cssInput = `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-app: #090d16;
  --bg-card: rgba(15, 23, 42, 0.75);
  --bg-card-solid: #0f172a;
  --bg-surface: rgba(2, 6, 23, 0.55);
  --bg-surface-elevated: rgba(15, 23, 42, 0.94);
  --border-main: rgba(255, 255, 255, 0.1);
  --border-hover: rgba(255, 255, 255, 0.2);
  --border-focus: #2563eb;
  --text-main: #f8fafc;
  --text-sub: #94a3b8;
  --text-muted: #64748b;
  --accent-primary: #2563eb;
  --accent-primary-hover: #1d4ed8;
  --accent-primary-subtle: rgba(37, 99, 235, 0.15);
  --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.35);
  --shadow-elevated: 0 25px 60px rgba(0, 0, 0, 0.5);
}

* {
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.1) transparent;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-app);
  color: var(--text-main);
}

/* Light theme overrides */
.light, .light-theme, body.light, body.light-theme, html.light, html.light-theme {
  --bg-app: #f8fafc;
  --bg-card: rgba(255, 255, 255, 0.88);
  --bg-card-solid: #ffffff;
  --bg-surface: rgba(241, 245, 249, 0.85);
  --bg-surface-elevated: rgba(255, 255, 255, 0.98);
  --border-main: #e2e8f0;
  --border-hover: #cbd5e1;
  --border-focus: #2563eb;
  --text-main: #0f172a;
  --text-sub: #475569;
  --text-muted: #94a3b8;
  --accent-primary: #2563eb;
  --accent-primary-hover: #1d4ed8;
  --accent-primary-subtle: rgba(37, 99, 235, 0.1);
  --shadow-glass: 0 8px 30px rgba(0, 0, 0, 0.06);
  --shadow-elevated: 0 20px 45px rgba(0, 0, 0, 0.12);
  background-color: var(--bg-app) !important;
  color: var(--text-main) !important;
}

/* Light mode elements, inputs, modals, surfaces and text */
.light input:not([type="checkbox"]):not([type="radio"]):not([type="range"]),
.light-theme input:not([type="checkbox"]):not([type="radio"]):not([type="range"]),
.light select, .light-theme select,
.light textarea, .light-theme textarea {
  background-color: #ffffff !important;
  color: #0f172a !important;
  border-color: #cbd5e1 !important;
}

.light input::placeholder, .light-theme input::placeholder,
.light textarea::placeholder, .light-theme textarea::placeholder {
  color: #94a3b8 !important;
}

.light .modal > div, .light-theme .modal > div,
.light #exam-target-modal > div, .light-theme #exam-target-modal > div,
.light #app-custom-dialog-modal > div, .light-theme #app-custom-dialog-modal > div,
.light #modal-mock-detail-card, .light-theme #modal-mock-detail-card,
.light #modal-shortcuts-help, .light-theme #modal-shortcuts-help,
.light #modal-day-detail > div, .light-theme #modal-day-detail > div,
.light #modal-study-viewer > div, .light-theme #modal-study-viewer > div,
.light #modal-qr-sync > div, .light-theme #modal-qr-sync > div,
.light #modal-wipe-confirm > div, .light-theme #modal-wipe-confirm > div,
.light #modal-wipe-card, .light-theme #modal-wipe-card {
  background-color: rgba(255, 255, 255, 0.98) !important;
  color: #0f172a !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15) !important;
}

.light .ac-row, .light-theme .ac-row,
.light .ac-toggle-row, .light-theme .ac-toggle-row,
.light .ac-info-row, .light-theme .ac-info-row {
  color: #0f172a !important;
}

.light .ac-row:hover, .light-theme .ac-row:hover,
.light .ac-toggle-row:hover, .light-theme .ac-toggle-row:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.light .sc-kbd, .light-theme .sc-kbd {
  color: #334155 !important;
  background-color: rgba(0, 0, 0, 0.06) !important;
  border-color: rgba(0, 0, 0, 0.12) !important;
}

.light .custom-calendar-dropdown, .light-theme .custom-calendar-dropdown {
  background-color: rgba(255, 255, 255, 0.98) !important;
  color: #0f172a !important;
  border-color: rgba(0, 0, 0, 0.12) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15) !important;
}

.light .custom-calendar-header button, .light-theme .custom-calendar-header button,
.light .cal-nav-btn, .light-theme .cal-nav-btn {
  background: rgba(0, 0, 0, 0.05) !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
  color: #334155 !important;
}

.light .custom-calendar-day, .light-theme .custom-calendar-day,
.light .cal-day-cell, .light-theme .cal-day-cell {
  color: #334155 !important;
}

.light .custom-calendar-day:hover:not(.empty), .light-theme .custom-calendar-day:hover:not(.empty),
.light .cal-day-cell:hover:not(.empty):not(.selected), .light-theme .cal-day-cell:hover:not(.empty):not(.selected) {
  background: rgba(37, 99, 235, 0.1) !important;
  border-color: rgba(37, 99, 235, 0.3) !important;
  color: #2563eb !important;
}

.light .calendar-month-select, .light-theme .calendar-month-select,
.light .calendar-year-select, .light-theme .calendar-year-select,
.light .cal-select, .light-theme .cal-select {
  background: #ffffff !important;
  color: #2563eb !important;
  border-color: #cbd5e1 !important;
}

.light .calendar-month-select option, .light-theme .calendar-month-select option,
.light .calendar-year-select option, .light-theme .calendar-year-select option {
  background: #ffffff !important;
  color: #0f172a !important;
}

.light #custom-tooltip, .light-theme #custom-tooltip {
  background: rgba(255, 255, 255, 0.98) !important;
  color: #0f172a !important;
  border: 1px solid rgba(0, 0, 0, 0.16) !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.06) !important;
}

.light .dropdown-panel, .light-theme .dropdown-panel,
.light #mock-weak-dropdown-options, .light-theme #mock-weak-dropdown-options {
  background-color: rgba(255, 255, 255, 0.98) !important;
  color: #0f172a !important;
  border-color: rgba(0, 0, 0, 0.12) !important;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15) !important;
}

.light .dropdown-panel button, .light-theme .dropdown-panel button {
  color: #334155 !important;
}

.light .dropdown-panel button:hover, .light-theme .dropdown-panel button:hover {
  background-color: rgba(37, 99, 235, 0.08) !important;
  color: #2563eb !important;
}

.light #mobile-floating-nav, .light-theme #mobile-floating-nav {
  background-color: rgba(255, 255, 255, 0.92) !important;
  border-color: rgba(0, 0, 0, 0.12) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12) !important;
}

.light .nav-item, .light-theme .nav-item {
  color: #64748b !important;
}

.light .nav-item:hover, .light-theme .nav-item:hover {
  color: #0f172a !important;
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.light #pomo-capsule, .light-theme #pomo-capsule {
  background-color: rgba(255, 255, 255, 0.9) !important;
}

.light #pomo-capsule-time, .light-theme #pomo-capsule-time {
  color: #0f172a !important;
}

.light #pomo-drawer, .light-theme #pomo-drawer {
  background: rgba(255, 255, 255, 0.98) !important;
  border-color: rgba(0, 0, 0, 0.12) !important;
  color: #0f172a !important;
}

.light #pomo-drawer h3, .light-theme #pomo-drawer h3,
.light #pomo-time-display, .light-theme #pomo-time-display {
  color: #0f172a !important;
}

.light .bg-slate-900, .light-theme .bg-slate-900,
.light .bg-slate-900\\/80, .light-theme .bg-slate-900\\/80,
.light .bg-slate-900\\/90, .light-theme .bg-slate-900\\/90,
.light .bg-slate-900\\/95, .light-theme .bg-slate-900\\/95 {
  background-color: rgba(255, 255, 255, 0.92) !important;
  border-color: rgba(0, 0, 0, 0.08) !important;
}

.light .bg-slate-950, .light-theme .bg-slate-950,
.light .bg-slate-950\\/80, .light-theme .bg-slate-950\\/80,
.light .bg-slate-950\\/90, .light-theme .bg-slate-950\\/90,
.light .bg-slate-950\\/70, .light-theme .bg-slate-950\\/70,
.light .bg-slate-950\\/60, .light-theme .bg-slate-950\\/60 {
  background-color: rgba(241, 245, 249, 0.88) !important;
  border-color: rgba(0, 0, 0, 0.08) !important;
  color: #1e293b !important;
}

.light #mock-table-body, .light-theme #mock-table-body {
  color: #334155 !important;
}

.light #mock-table-body tr:hover, .light-theme #mock-table-body tr:hover {
  background-color: rgba(0, 0, 0, 0.03) !important;
}

.light thead, .light-theme thead {
  background-color: rgba(241, 245, 249, 0.95) !important;
  color: #475569 !important;
}

/* Light theme dashboard cards & grouped surfaces */
.light #card-daily-rituals, .light-theme #card-daily-rituals,
.light #card-prep-readiness, .light-theme #card-prep-readiness,
.light #card-today-missions, .light-theme #card-today-missions {
  background-color: rgba(255, 255, 255, 0.94) !important;
  border-color: rgba(226, 232, 240, 0.9) !important;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.06) !important;
}

.light #card-daily-rituals .ritual-checkbox span,
.light-theme #card-daily-rituals .ritual-checkbox span {
  color: #334155 !important;
}

.light #card-daily-rituals .ritual-checkbox:hover span,
.light-theme #card-daily-rituals .ritual-checkbox:hover span {
  color: #0f172a !important;
}

.light #card-daily-rituals .bg-white\\/5,
.light-theme #card-daily-rituals .bg-white\\/5 {
  background-color: #f8fafc !important;
  border-color: #e2e8f0 !important;
}

.light #card-daily-rituals .bg-white\\/5:hover,
.light-theme #card-daily-rituals .bg-white\\/5:hover {
  background-color: #f1f5f9 !important;
}

.light #card-prep-readiness h3,
.light-theme #card-prep-readiness h3,
.light #card-today-missions h2,
.light-theme #card-today-missions h2 {
  color: #0f172a !important;
}

.light #card-today-missions .bg-white\\/5,
.light-theme #card-today-missions .bg-white\\/5 {
  background-color: #f8fafc !important;
  border-color: #e2e8f0 !important;
}

.light #subject-progress-dashboard-container .bg-white\\/5,
.light-theme #subject-progress-dashboard-container .bg-white\\/5 {
  background-color: #e2e8f0 !important;
}

.light #subject-progress-dashboard-container .text-gray-400,
.light-theme #subject-progress-dashboard-container .text-gray-400 {
  color: #475569 !important;
}

/* Light theme Action Center Hubs (Rewards & Nudge) */
.light #modal-shortcuts-help, .light-theme #modal-shortcuts-help {
  background-color: rgba(255, 255, 255, 0.98) !important;
  border-color: rgba(226, 232, 240, 0.9) !important;
  color: #0f172a !important;
}

.light #modal-shortcuts-help h3, .light-theme #modal-shortcuts-help h3,
.light #modal-shortcuts-help h4, .light-theme #modal-shortcuts-help h4 {
  color: #0f172a !important;
}

.light #modal-shortcuts-help #shortcuts-search,
.light-theme #modal-shortcuts-help #shortcuts-search {
  background-color: #f8fafc !important;
  color: #0f172a !important;
  border-color: #cbd5e1 !important;
}

.light #modal-shortcuts-help #shortcuts-search::placeholder,
.light-theme #modal-shortcuts-help #shortcuts-search::placeholder {
  color: #94a3b8 !important;
}

@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Animations */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scrollbar styles */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
}

/* Custom utility overrides */
#mobile-floating-nav {
  transition: all 0.38s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
  will-change: transform, left, right;
}

#floating-nav-items {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

#floating-nav-trigger {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

#mobile-floating-nav:not(.nav-shrunk) #floating-nav-trigger {
  opacity: 0 !important;
  pointer-events: none !important;
  position: absolute !important;
  transform: scale(0.4) !important;
}

/* Shrunk State: Symmetrical Center Circular Pill for All Screen Sizes (Center default, Left, Right) */
#mobile-floating-nav.nav-shrunk,
#mobile-floating-nav.nav-shrunk.nav-hand-center {
  left: 50% !important;
  right: auto !important;
  transform: translateX(-50%) translateY(0) scale(1) !important;
}

#mobile-floating-nav.nav-shrunk.nav-hand-left {
  left: 1.25rem !important;
  right: auto !important;
  transform: translateX(0) translateY(0) scale(1) !important;
}

#mobile-floating-nav.nav-shrunk.nav-hand-right {
  left: auto !important;
  right: 1.25rem !important;
  transform: translateX(0) translateY(0) scale(1) !important;
}

@keyframes modalShake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}
.modal-shake {
  animation: modalShake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both !important;
}

#mobile-floating-nav.nav-shrunk #floating-nav-trigger {
  opacity: 1 !important;
  pointer-events: auto !important;
  position: relative !important;
  transform: scale(1.1) !important;
  background-color: #2563eb !important;
  color: #ffffff !important;
  box-shadow: 0 4px 18px rgba(37, 99, 235, 0.65), 0 0 24px rgba(37, 99, 235, 0.4) !important;
  border-radius: 9999px !important;
}

#mobile-floating-nav.nav-shrunk #floating-nav-trigger i {
  color: #ffffff !important;
}

#mobile-floating-nav.nav-shrunk #floating-nav-items {
  opacity: 0 !important;
  pointer-events: none !important;
  position: absolute !important;
  transform: scale(0.6) !important;
}

.nav-item {
  transition: background-color 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

.nav-item:hover {
  transform: translateY(-2px) scale(1.08);
}

.nav-item.active-nav {
  background-color: #2563eb !important;
  color: #ffffff !important;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.55), 0 0 20px rgba(37, 99, 235, 0.3) !important;
  border-radius: 9999px !important;
  transform: scale(1.12);
}

.nav-item.active-nav i {
  color: #ffffff !important;
  transform: scale(1.1);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.active-nav-tab {
  background-color: rgba(37, 99, 235, 0.25) !important;
  border-color: rgba(37, 99, 235, 0.6) !important;
  color: #60a5fa !important;
  transition: all 0.2s ease-out !important;
}

.active-pomo-mode {
  background-color: rgba(244, 63, 94, 0.15);
  border-color: rgba(244, 63, 94, 0.4);
  color: #f43f5e;
}

/* Die-cut sticker styling: crisp white border outline, realistic resting tilt, and dynamic tilt on arrow hover */
.sticker-die-cut {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.9));
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.22s ease;
  will-change: transform;
}
.sticker-die-cut:hover {
  transform: scale(1.15) rotate(6deg) translateY(-2px);
  filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 3px rgba(255, 255, 255, 1));
}

/* Page Entrance Slide-In Animation */
.content-page:not(.hidden) {
  animation: pageSlideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes pageSlideIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Sleek Animated Global Hover Tooltip */
#custom-tooltip {
  position: fixed !important;
  pointer-events: none !important;
  z-index: 100000000 !important;
  padding: 6px 12px !important;
  background: rgba(15, 23, 42, 0.96) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  border-radius: 10px !important;
  color: #f8fafc !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  line-height: 1.45 !important;
  letter-spacing: 0.015em !important;
  max-width: 280px !important;
  text-align: center !important;
  word-wrap: break-word !important;
  white-space: normal !important;
  box-shadow: 0 12px 30px -5px rgba(0, 0, 0, 0.7), 0 0 16px rgba(6, 182, 212, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) !important;
  opacity: 0 !important;
  transform: translateY(4px) scale(0.95) !important;
  transition: opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

#custom-tooltip.active {
  opacity: 1 !important;
  transform: translateY(0) scale(1) !important;
}

#modal-shortcuts-help {
  z-index: 9999999 !important;
}

#modal-shortcuts-help.active {
  opacity: 1 !important;
  pointer-events: auto !important;
  transform: translateY(0) !important;
  display: flex !important;
}

#modal-shortcuts-help > div {
  transform: none !important;
  opacity: 1 !important;
  box-shadow: none !important;
}

#sync-island-pill.island-visible {
  opacity: 1 !important;
  pointer-events: auto !important;
  transform: translateY(0) !important;
}

/* Command Palette Action Row Layout Classes */
.ac-toggle-row, .ac-row, .ac-info-row {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 0.5rem 0.75rem !important;
  border-radius: 0.75rem !important;
  font-size: 0.875rem !important;
  color: #e2e8f0 !important;
  transition: all 0.15s ease-out !important;
}

@media (min-width: 768px) {
  .ac-toggle-row.md\:hidden,
  .md\:hidden {
    display: none !important;
  }
}

.ac-row:hover, .ac-toggle-row:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.ac-label {
  display: flex !important;
  align-items: center !important;
  font-weight: 500 !important;
}

.ac-right {
  display: flex !important;
  align-items: center !important;
  gap: 0.625rem !important;
}

.sc-kbd {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 1.25rem !important;
  height: 1.25rem !important;
  padding: 0 0.375rem !important;
  font-family: ui-monospace, SFMono-Regular, monospace !important;
  font-size: 0.7rem !important;
  font-weight: 700 !important;
  color: #94a3b8 !important;
  background-color: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 0.375rem !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
}
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Speed Drill Game Mode Dropdown Trigger Button (Distinct styling from category tabs) */
#btn-drill-mode-dropdown {
  background: rgba(6, 182, 212, 0.12) !important;
  border: 1.5px solid rgba(6, 182, 212, 0.5) !important;
  box-shadow: 0 0 14px rgba(6, 182, 212, 0.18), inset 0 0 10px rgba(6, 182, 212, 0.08) !important;
  color: #ffffff !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
#btn-drill-mode-dropdown:hover,
#btn-drill-mode-dropdown[aria-expanded="true"] {
  background: rgba(6, 182, 212, 0.22) !important;
  border-color: #22d3ee !important;
  box-shadow: 0 0 22px rgba(6, 182, 212, 0.35), inset 0 0 14px rgba(6, 182, 212, 0.15) !important;
  transform: translateY(-1px);
}

/* Active Speed Drill Focus & Dimming Mode */
html.quiz-focus-active,
body.quiz-focus-active,
html.drill-active,
body.drill-active {
  overflow: hidden !important;
  height: 100vh !important;
  touch-action: none !important;
}

body.quiz-focus-active #app-header,
body.quiz-focus-active #mobile-floating-nav,
body.quiz-focus-active .drill-header-group,
body.quiz-focus-active #drill-left-rail,
body.quiz-focus-active #drill-right-rail,
body.quiz-focus-active #drill-heatmap-container,
body.quiz-focus-active #drill-timeline-container,
body.quiz-focus-active #drill-bottom-deck,
body.quiz-focus-active #drill-microtricks-card,
body.quiz-focus-active #drill-cheat-sheet-card,
body.quiz-focus-active #sync-island-pill,
body.quiz-focus-active #action-center-island-wrap,
body.drill-active #app-header,
body.drill-active #mobile-floating-nav,
body.drill-active .drill-header-group,
body.drill-active #drill-left-rail,
body.drill-active #drill-right-rail,
body.drill-active #drill-heatmap-container,
body.drill-active #drill-timeline-container,
body.drill-active #drill-bottom-deck,
body.drill-active #drill-microtricks-card,
body.drill-active #drill-cheat-sheet-card,
body.drill-active #sync-island-pill,
body.drill-active #action-center-island-wrap {
  filter: blur(14px) opacity(0.04) !important;
  pointer-events: none !important;
  user-select: none !important;
  transition: filter 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

body.quiz-focus-active #unified-drill-card,
body.drill-active #unified-drill-card {
  position: relative !important;
  z-index: 50 !important;
  box-shadow: 0 0 75px rgba(6, 182, 212, 0.35), 0 30px 60px -10px rgba(0, 0, 0, 0.95) !important;
  border-color: rgba(6, 182, 212, 0.45) !important;
  transform: scale(1.015) !important;
  transition: box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

/* Custom Calendar Component Styles */
.custom-calendar-dropdown {
  position: fixed !important;
  z-index: 999999 !important;
  background-color: rgba(15, 23, 42, 0.96) !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border-radius: 1rem !important;
  padding: 0.875rem !important;
  width: 280px !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 20px rgba(6, 182, 212, 0.15) !important;
  color: #f8fafc !important;
  font-family: inherit !important;
  user-select: none !important;
}

.custom-calendar-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  margin-bottom: 0.625rem !important;
  padding-bottom: 0.5rem !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.custom-calendar-header button {
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  color: #cbd5e1 !important;
  width: 1.625rem !important;
  height: 1.625rem !important;
  border-radius: 0.375rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-weight: 700 !important;
  font-size: 0.75rem !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
}

.custom-calendar-header button:hover {
  background: rgba(6, 182, 212, 0.25) !important;
  border-color: rgba(6, 182, 212, 0.5) !important;
  color: #06b6d4 !important;
}

.calendar-month-select, .calendar-year-select {
  background: rgba(15, 23, 42, 0.9) !important;
  color: #06b6d4 !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: 0.375rem !important;
  padding: 0.2rem 0.35rem !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  outline: none !important;
  cursor: pointer !important;
}

.calendar-month-select option, .calendar-year-select option {
  background: #0f172a !important;
  color: #f8fafc !important;
}

.custom-calendar-grid {
  display: grid !important;
  grid-template-columns: repeat(7, 1fr) !important;
  gap: 0.25rem !important;
  text-align: center !important;
}

.custom-calendar-day-name {
  font-size: 0.65rem !important;
  font-weight: 800 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  color: #94a3b8 !important;
  padding: 0.25rem 0 !important;
}

.custom-calendar-day {
  aspect-ratio: 1 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  color: #cbd5e1 !important;
  border-radius: 0.375rem !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
  border: 1px solid transparent !important;
}

.custom-calendar-day:hover:not(.empty) {
  background: rgba(6, 182, 212, 0.2) !important;
  border-color: rgba(6, 182, 212, 0.4) !important;
  color: #06b6d4 !important;
}

.custom-calendar-day.today {
  border-color: rgba(6, 182, 212, 0.5) !important;
  color: #38bdf8 !important;
  font-weight: 700 !important;
}

.custom-calendar-day.selected {
  background: #06b6d4 !important;
  color: #ffffff !important;
  font-weight: 800 !important;
  border-color: #06b6d4 !important;
  box-shadow: 0 2px 10px rgba(6, 182, 212, 0.4) !important;
}

.custom-calendar-day.empty {
  pointer-events: none !important;
  opacity: 0 !important;
}
`;

const inputPath = path.join(__dirname, 'tailwind-input.css');
const outputPath = path.join(__dirname, 'style.css');

// Write input CSS
fs.writeFileSync(inputPath, cssInput);

console.log('Building Tailwind CSS...');

try {
  // Build with tailwindcss CLI
  execSync(`npx tailwindcss -i "${inputPath}" -o "${outputPath}" --minify`, {
    cwd: __dirname,
    stdio: 'inherit'
  });
  
  // Clean up temp file
  fs.unlinkSync(inputPath);
  
  const stats = fs.statSync(outputPath);
  const sizeKB = (stats.size / 1024).toFixed(1);
  console.log(`✓ Built style.css (${sizeKB} KB)`);
} catch (error) {
  console.error('Build failed:', error.message);
  // Restore original style.css if build fails
  if (fs.existsSync(outputPath)) {
    console.log('Original style.css preserved');
  }
}

if (isWatch) {
  console.log('Watching for changes...');
  fs.watch(path.join(__dirname, 'index.html'), () => {
    console.log('Rebuilding...');
    try {
      execSync(`npx tailwindcss -i "${inputPath}" -o "${outputPath}" --minify`, {
        cwd: __dirname,
        stdio: 'inherit'
      });
      console.log('✓ Rebuilt');
    } catch (e) {
      console.error('Rebuild failed');
    }
  });
}
