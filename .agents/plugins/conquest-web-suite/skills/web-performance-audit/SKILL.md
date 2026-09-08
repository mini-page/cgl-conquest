---
name: web-performance-audit
description: Comprehensive web performance auditing and optimization skill for frontend web applications. Use when optimizing load times, rendering performance, memory leaks, CSS/JS bundling, SVG charts, and interactive canvas physics.
---

# Web Performance Audit & Optimization Guide

## Core Principles
1. **Asset Budget & Payload Minimization**:
   - Keep production CSS under 120 KB minified (`build-tailwind.js` generates `style.css`).
   - Remove unused selectors and enforce utility class consolidation.
   - Defer and lazy-load third-party scripts (e.g. QR code generators, math typesetting engines).

2. **Render Loop & Animation Optimization**:
   - For continuous animations (progress rings, timers, counters), prefer CSS hardware-accelerated transforms (`transform`, `opacity`) and `requestAnimationFrame` over repetitive DOM style recalculations.
   - Kill inactive GSAP tweens before initiating new transitions to prevent memory retention:
     `gsap.killTweensOf([element1, element2]);`
   - When updating SVG progress rings, use `stroke-dashoffset` with cached circumference rather than recalculating in loops.

3. **Canvas Performance**:
   - For temporary effects like confetti bursts or particle explosions, allocate a canvas element dynamically, run the particle simulation, and remove the canvas from the DOM once all particles fade out (`opacity <= 0`).

4. **LocalStorage Telemetry Optimization**:
   - Batch write operations to `localStorage` (e.g. debounced or once every N seconds instead of per second in stopwatch intervals).
   - Sanitize state trees before stringification to avoid circular references and payload bloat.
