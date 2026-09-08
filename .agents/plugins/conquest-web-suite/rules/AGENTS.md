# Conquest Web Suite Architecture Rules

## Core Operational Invariants
- **Active Tab Accent**: Active tabs across Mock UI, QR Modal, Tier Switcher, and Trophy Filters MUST use `#2563eb` (`bg-blue-600`), NEVER multi-color gradients.
- **Theme Integrity**: Both light mode (`.light`, `.light-theme`) and dark mode (`.dark`) must render with high contrast using CSS variables (`--bg-primary`, `--bg-surface`, `--text-primary`, `--accent-primary`).
- **Universal Modal Dismissal**: All overlays, modals, and dialogs must support backdrop click, Escape key, and X button dismissals.
- **Confetti Safety**: Never remove or alter `window.triggerConfetti` in `js/dashboard.js`.
- **Test Integrity**: Always verify that `node tests/suite.js` executes with 100% passing tests after any frontend modifications.
