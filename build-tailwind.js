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
.light {
  --bg-app: #f8fafc;
  --bg-card: #ffffff;
  --border-main: #e2e8f0;
  --text-main: #1e293b;
  --text-sub: #64748b;
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
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
  will-change: transform;
}

#floating-nav-items {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

#floating-nav-trigger {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

#mobile-floating-nav:not(.nav-shrunk) #floating-nav-trigger {
  opacity: 0 !important;
  pointer-events: none !important;
  position: absolute !important;
  transform: scale(0.4) !important;
}

#mobile-floating-nav.nav-shrunk #floating-nav-trigger {
  opacity: 1 !important;
  pointer-events: auto !important;
  position: relative !important;
  transform: scale(1) !important;
}

#mobile-floating-nav.nav-shrunk #floating-nav-items {
  opacity: 0 !important;
  pointer-events: none !important;
  position: absolute !important;
  transform: scale(0.7) !important;
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

/* Transition helpers */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
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
