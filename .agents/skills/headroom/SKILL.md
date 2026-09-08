---
name: headroom
description: "Context window headroom optimization and token hygiene for AI coding agents. Keeps context windows lean, prunes noisy command outputs, minimizes tool payload bloat, and preserves high model reasoning attention."
---

# Headroom — Context Window & Token Optimization

`headroom` maximizes an agent's available context window and reasoning precision by eliminating redundant tokens, suppressing noisy tool outputs, and applying token-conscious workflows.

---

## Why Headroom Matters
As context windows fill with large build logs, full-file dumps, and repetitive command outputs:
1. **Attention Degradation**: Critical instructions and architectural constraints get lost in the noise ("needle in a haystack" loss).
2. **Speed & Latency**: Large contexts slow down inference and generation times significantly.
3. **Cost Efficiency**: Context caching and token consumption are optimized.

---

## Headroom Rules for Agents

### 1. Targeted File Viewing
- **NEVER** dump a 2,000-line file when you only need lines 120–160. Always specify `StartLine` and `EndLine`.
- Use ripgrep (`grep_search`) or `find_by_name` with `MatchPerLine: true` and appropriate pattern filters rather than scanning directories manually.

### 2. Surgical Diffs over Full-File Rewrites
- Use `replace_file_content` for surgical updates.
- Only use `write_to_file` when generating new files or when an entire file is intentionally replaced.

### 3. Log & Output Truncation
- When running builds, tests, or linters, pipe or cap output where practical (e.g., `git log -n 5`, `head -n 20`).
- If a command fails, inspect only the error stack trace, not thousands of lines of successful compilation logs.

### 4. Background Task Polling Discipline
- Never run a tight loop checking task status or executing empty commands. Let reactive notifications wake you up.
- Avoid redundant status checks that clutter conversation history.

### 5. Memory Pruning & Subagent Delegation
- For heavy multi-file exploration, invoke specialized subagents (e.g., `research`) so the parent context remains pristine and uncluttered.
- Synthesize findings into compact, structured summaries before continuing implementation.
