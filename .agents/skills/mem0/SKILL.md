---
name: mem0
description: "Long-term and session memory management using the Mem0 framework. Allows AI agents to remember user preferences, project conventions, architectural decisions, and previous solutions across sessions."
---

# Mem0 — The AI Memory Layer

`mem0` provides persistent, self-updating memory for AI agents. It extracts facts, user preferences, and project-specific knowledge to ensure continuity across different conversations and tasks.

---

## Core Capabilities
- **Adaptive Memory**: Automatically extracts relevant facts from dialogue and stores them.
- **Semantic Search**: Queries memories using natural language embeddings.
- **Cross-Session Recall**: Restores user preferences (e.g., preferred coding style, favorite libraries, UI color preferences).

---

## Python API Usage

```python
from mem0 import Memory

# 1. Initialize local memory
m = Memory()

# 2. Add memories
m.add("User prefers dark mode and application accent blue (#2563eb)", user_id="umang")
m.add("In Flutter, default to Riverpod and feature-first architecture", user_id="umang")
m.add("Always keep window.triggerConfetti intact in js/dashboard.js", user_id="umang")

# 3. Search relevant memories
results = m.search("What are the UI styling rules?", user_id="umang")
for item in results:
    print(item["memory"])

# 4. Get all memories for user
all_memories = m.get_all(user_id="umang")
```

---

## Agent Guidelines for Mem0
1. **When User States a Hard Preference**: Record it with `m.add(...)`.
2. **Before Starting a Fresh Feature**: Query `m.search(...)` for relevant past user feedback or architectural decisions.
3. **When Conflicts Arise**: Prioritize newer memories or explicitly ask the user for confirmation.
