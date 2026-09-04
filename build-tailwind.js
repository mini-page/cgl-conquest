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
  --bg-app: #0d0e12;
  --bg-card: #111827;
  --border-main: #1f2937;
  --text-main: #f9fafb;
  --text-sub: #9ca3af;
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
  --bg-card: #ffffff;
  --border-main: #e2e8f0;
  --text-main: #1e293b;
  --text-sub: #64748b;
  background-color: var(--bg-app) !important;
  color: var(--text-main) !important;
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

/* Shrunk State: Symmetrical Center Circular Pill for All Screen Sizes */
#mobile-floating-nav.nav-shrunk {
  left: 50% !important;
  right: auto !important;
  transform: translateX(-50%) translateY(0) scale(1) !important;
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
  z-index: 99999 !important;
  padding: 5px 11px !important;
  background: rgba(15, 23, 42, 0.94) !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border-radius: 8px !important;
  color: #f8fafc !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  letter-spacing: 0.02em !important;
  white-space: nowrap !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 12px rgba(6, 182, 212, 0.15) !important;
  opacity: 0 !important;
  transform: translateY(4px) scale(0.95) !important;
  transition: opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

#custom-tooltip.active {
  opacity: 1 !important;
  transform: translateY(0) scale(1) !important;
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
body.drill-active #app-header,
body.drill-active #mobile-floating-nav,
body.drill-active .drill-header-group {
  filter: blur(8px) opacity(0.25) !important;
  pointer-events: none !important;
  transition: filter 0.35s ease, opacity 0.35s ease !important;
}

body.quiz-focus-active #unified-drill-card,
body.drill-active #unified-drill-card {
  box-shadow: 0 0 50px rgba(6, 182, 212, 0.25), 0 25px 50px -12px rgba(0, 0, 0, 0.8) !important;
  border-color: rgba(6, 182, 212, 0.3) !important;
  transition: box-shadow 0.35s ease, border-color 0.35s ease !important;
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
