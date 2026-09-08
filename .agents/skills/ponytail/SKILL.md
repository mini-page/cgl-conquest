---
name: ponytail
description: "Applies the 'lazy senior developer' engineering philosophy. Prevents over-engineering, avoids premature abstractions, enforces the simplest cut that heals, and favors battle-tested standard library solutions."
---

# Ponytail — The Minimalist Senior Engineer Doctrine

> *"The best code is the code you didn't have to write, test, maintain, or debug."*

`ponytail` enforces radical simplicity, surgical edits, and resistance against over-engineering in AI coding workflows.

---

## Core Tenets

### 1. The Simplest Cut That Heals
- Solve the immediate problem directly with the fewest moving parts.
- Do not introduce a design pattern, an abstract factory, or a custom event bus when a plain function or standard DOM listener suffices.
- Prefer 10 lines of readable procedural code over 60 lines of generic, future-proofed boilerplate.

### 2. Standard Library First
- Leverage platform-native capabilities:
  - **JavaScript/Browser**: Native `fetch()`, `crypto.randomUUID()`, `localStorage`, `dialog`, CSS variables, CSS grid/flexbox.
  - **Node.js**: Native `fs`, `path`, `http`, `events`, `crypto`.
  - **Python**: Built-in standard modules (`json`, `re`, `pathlib`, `sqlite3`, `dataclasses`) before pulling in heavyweight external packages.

### 3. YAGNI (You Aren't Gonna Need It)
- Never write code for hypothetical future requirements.
- Never write generic wrapper classes around single-call libraries.
- Never build plugin architectures unless multiple actual plugins exist and are running today.

### 4. Delete More Than You Add
- Clean up obsolete flags, dead code paths, and deprecated legacy fallbacks.
- Fewer lines of code means fewer bugs, lower cognitive load, and smaller context token footprints.

---

## The Ponytail Checklist

Before modifying or implementing any solution, answer:
1. **Can this be solved with zero new dependencies?** (If yes, do not add npm/pip packages).
2. **Can this be done by tweaking existing logic rather than adding a new abstraction layer?**
3. **Is the diff under 50 lines?** If it is over 150 lines, pause and ask: *What am I over-complicating?*
4. **Is every new variable and function actively read and called?**
5. **Does this break existing tests or contracts?**

---

## Example Contrasts

### Over-engineered (Anti-Pattern)
```typescript
// Excessive layers of indirection for simple key-value storage
interface StorageAdapter<T> {
  save(key: string, data: T): Promise<void>;
  retrieve(key: string): Promise<T | null>;
}
class LocalStorageAdapterFactory {
  static create<T>(schemaValidator: (x: any) => boolean): StorageAdapter<T> { ... }
}
```

### Ponytail Way
```javascript
// Simple, direct, robust, and readable
const loadState = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
const saveState = (key, val) => localStorage.setItem(key, JSON.stringify(val));
```
