---
name: modern-ui-ux-design
description: Design system rules, glassmorphism aesthetics, color contrast, micro-interactions, audio feedback, and gamification feedback loops for high-end web applications.
---

# Modern UI/UX Design System Guide

## Aesthetic Principles
1. **Glassmorphism**:
   - Dark mode: Semi-transparent frosted cards using `bg-slate-900/60`, `border-white/10`, `backdrop-blur-xl`, and subtle inner shadows.
   - Light mode: `bg-white/80`, `border-slate-200/80`, `backdrop-blur-xl`, with soft neutral shadows.
   - Avoid harsh neon gradients or opaque stark rectangles.

2. **Active Tab Accent Rule**:
   - Active navigation items, tier togglers, modal tabs, and selected filters MUST use the standard brand accent `#2563eb` (`bg-blue-600`), never multi-color rainbow gradients.

3. **Gamification & Engagement Loops**:
   - **Progress Visibility**: Always show numeric progress bars (e.g. `7/10 Topics`, `70%`) instead of static "Locked" labels.
   - **Multi-sensory Feedback**: Combine visual flair (confetti, badge pulses) with synthesized Web Audio chimes (`reward`, `achievement`, `bell`, `notification`).
   - **Contextual Action Center**: Keep action centers non-intrusive, sticky during actions, and dismissible via standard escape/outside clicks.

4. **Universal Modal Dismissal Contract**:
   - Any modal or dialog MUST close via:
     - Backdrop click (`e.target === modalOverlay`)
     - `Escape` key (globally intercepted even when an input inside the modal has focus)
     - `X` key (when outside text inputs)
     - Close button (`.modal-close-btn`, `[data-modal-close]`, or `&times;`)
