---
name: vibe-check
description: "Executes an objective sanity and alignment check on current proposed changes, code architecture, and agent reasoning. Prevents tunnel vision, catches scope creep, and ensures user expectations are met."
---

# Vibe Check — Alignment & Sanity Verification

`vibe-check` is an intentional pause mechanism that evaluates whether an agent's work aligns with the user's intent, the codebase aesthetic, performance standards, and real-world developer experience.

---

## When to Run a Vibe Check
- Before proposing or executing large multi-file refactors.
- When an agent has executed 5+ consecutive tool calls without validating against the user's original prompt.
- When fixing an elusive bug and the proposed solution introduces more than 3 new state flags or variables.
- Prior to declaring a complex feature complete.

---

## The 5-Pillar Vibe Audit

### 1. Intent Alignment
- *Did the user ask for this abstraction, or did I invent it?*
- *Is this solution answering the exact question or solving an adjacent distraction?*
- *Did I respect all user hard constraints (e.g., active tab accent `#2563eb`, confetti protection, theme variables)?*

### 2. Cognitive Load & Simplicity
- *Could a new junior developer understand this file in under 3 minutes?*
- *Are names self-describing (`updateMasterTimerUI`, `filterRewardsTrophies`) without unnecessary cleverness?*
- *Is the UI responsive, fluid, and predictable?*

### 3. Blast Radius & Regressions
- *What else touches this state or DOM selector?*
- *Did I run impact analysis and unit tests before and after?*
- *Are edge cases (e.g. empty states, zero points, rapid double-clicks, Escape with input focus) handled cleanly?*

### 4. Code Aesthetics & Cleanliness
- *Is formatting consistent with existing project conventions?*
- *Are there left-over `console.log` statements, debugging comments, or commented-out dead blocks?*
- *Is CSS clean, scoped, or following the project's Tailwind/CSS variables pattern?*

### 5. Exit Criteria Verdict
- **VIBE PASS**: Code is surgical, tests pass, requirements fully satisfied, zero regressions.
- **VIBE REJECT**: Over-complicated, deviates from instructions, or fails automated checks. Pivot immediately to a simpler approach.
