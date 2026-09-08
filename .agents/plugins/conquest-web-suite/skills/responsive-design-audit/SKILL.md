---
name: responsive-design-audit
description: Audits and enforces responsive layouts, mobile-first ergonomics, breakpoint consistency (360px-1280px), touch target sizes, and drawer/modal scaling across mobile, tablet, and desktop viewports.
---

# Responsive Design & Mobile Ergonomics Audit Guide

## Breakpoint Matrix
- **Mobile Compact** (`< 380px`): Minimum readable font size `10px`, icon buttons `36x36px` minimum tap target, single-column stacked grids.
- **Mobile Standard** (`380px - 639px`): 2-column grids for statistics/cards, floating navigation island docked at bottom, max drawer height `85vh` with internal scroll.
- **Tablet / Phablet** (`640px - 1023px`): 3-column card layouts, side-by-side metric tiles, elevated command modals max-w-lg.
- **Desktop / Widescreen** (`>= 1024px`): Full navigation bar, max container width `max-w-7xl` with centered auto-margins, multi-column analytics panels.

## Mobile Ergonomics Checklist
1. **Touch Targets**: All interactive elements (buttons, pills, icons) must have a tap target of at least `36x36px` (preferably `44x44px`) with adequate padding.
2. **Dominant Hand Mode**: Provide adaptive left/right hand anchoring for floating docks (`setMobileNavHand('left'|'right')`).
3. **Viewport Clamping**: Ensure popovers, tooltips, and floating menus never overflow horizontal or vertical viewport edges:
   - Tooltips: Clamp `left` between `10px` and `window.innerWidth - tooltipWidth - 10px`.
   - Modals: Always set `max-h-[92vh]` and `overflow-y-auto` to accommodate mobile software keyboards.
4. **Scroll Lock**: Lock body scroll (`overflow-hidden`) whenever a full-screen overlay or modal is active, and release it on dismissal.
