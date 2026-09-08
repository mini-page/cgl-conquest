---
name: browser-use
description: "Autonomous web browsing and agentic web automation using Browser-Use. Enables AI agents to click, fill forms, navigate multi-page workflows, and scrape dynamic applications."
---

# Browser-Use — Autonomous Agent Web Automation

`browser-use` enables AI agents to control web browsers autonomously, performing complex multi-step user actions such as filling interactive forms, taking screenshots, extracting visual state, and testing UI flows.

---

## When to Use
- End-to-end user experience audits and multi-step UI verification.
- Automating workflows across external web services that do not provide public APIs.
- Capturing full-page screenshots, inspecting layout anomalies, and testing responsive viewports.

---

## Python Quickstart

```python
import asyncio
from browser_use import Agent
from langchain_openai import ChatOpenAI

async def main():
    agent = Agent(
        task="Navigate to http://localhost:8080, open the Pomodoro drawer, and start a 15-minute Sprint session.",
        llm=ChatOpenAI(model="gpt-4o"),
    )
    result = await agent.run()
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
```

---

## Integration with Antigravity
When paired with the built-in `puppeteer` MCP server (`agy mcp list`), agents have dual options:
1. **Interactive Headless Testing**: Use `mcp_puppeteer_*` for direct, synchronous DOM manipulation.
2. **High-Level Agentic Goals**: Use `browser-use` for multi-step autonomous navigation and exploration.
