---
name: repomix
description: "Pack entire codebases or target directory subtrees into a single, compact, AI-friendly markdown/XML file using Repomix. Perfect for feeding multi-file context to LLMs."
---

# Repomix — Codebase Context Packager

`repomix` (formerly Repopack) packs your entire repository or targeted subsets into a single file with directory trees, file contents, token counts, and gitignore awareness.

---

## Quick Usage

### Full Repository Pack
```bash
npx repomix
```
*Creates `repomix-output.xml` or `repomix-output.md` containing the structured repository.*

### Target Specific Directories
```bash
npx repomix --include "components/**,js/**" --style markdown
```

### Exclude Large Or Generated Assets
```bash
npx repomix --ignore "dist/**,*.min.js,tests/fixtures/**"
```

---

## Best Practices
- **Token Budgeting**: Always check the token count reported by Repomix to ensure it fits within context limits.
- **Targeted Subsets**: Pack only the relevant subsystem (e.g. `components/` and `css/`) when working on a focused feature.
- **Format Choice**: Markdown format is best for conversational review; XML format is best for structured agent parsing.
