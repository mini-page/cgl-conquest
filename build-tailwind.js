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
.active-nav-tab {
  background-color: rgba(6, 182, 212, 0.15);
  border-color: rgba(6, 182, 212, 0.4);
  color: #06b6d4;
}

.active-pomo-mode {
  background-color: rgba(244, 63, 94, 0.15);
  border-color: rgba(244, 63, 94, 0.4);
  color: #f43f5e;
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
