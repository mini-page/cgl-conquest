---
name: crawl4ai
description: "Asynchronous LLM-friendly web crawling, page extraction, and markdown conversion using Crawl4AI. Converts web pages into clean markdown ready for LLM consumption."
---

# Crawl4AI — Asynchronous Web Crawler for LLMs

`crawl4ai` provides high-speed, LLM-optimized web crawling, structured extraction, and clean Markdown generation.

---

## When to Use
- Extracting clean documentation, articles, or API references from web URLs without HTML noise.
- Crawling dynamic Single Page Applications (SPAs) that require JavaScript execution.
- Preparing web content for semantic search, RAG, or agent context.

---

## Python Usage Example

```python
import asyncio
from crawl4ai import AsyncWebCrawler

async def main():
    async with AsyncWebCrawler(verbose=True) as crawler:
        result = await crawler.arun(url="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API")
        # Access clean markdown
        print(result.markdown[:1000])

if __name__ == "__main__":
    asyncio.run(main())
```

---

## Key Features
- **Clean Markdown Extraction**: Automatically strips navigation menus, ads, footers, and scripts.
- **Deep Scraping & JS Execution**: Waits for dynamic elements, supports clicking buttons or scrolling.
- **Media & Link Filtering**: Extracts clean markdown tables, images, and hyperlinks.
- **Chunking & RAG Ready**: Splits large articles into token-bounded sections for vector embedding.
