# Romain Giraud · Portfolio

Nuxt 3 site (dark only, English at / and French at /fr): token-style hero with attention-weight hover, an embedding-map background, link hub, AI projects, services, and a RAG assistant that answers questions about Romain.

## Setup

```bash
npm install
cp .env.example .env   # then paste your Anthropic API key
npm run dev            # http://localhost:3000
```

Without `ANTHROPIC_API_KEY` the site works, and the assistant replies that it isn't switched on yet.

## Editing content

- **`data/profile.ts`**: headline, links, projects, services, suggested questions. Shown on the page **and** indexed by the assistant.
- **`server/knowledge/*.md`**: extra facts for the assistant only (bio, how missions work, FAQ). Each `## Heading` becomes one searchable passage. Add a file and it is picked up automatically.

Search for `TODO(Romain)` to find everything that still holds placeholder content.

## How the assistant works

`server/api/ask.post.ts` → `server/utils/knowledge.ts`

1. Profile data and markdown are split into short passages.
2. The visitor's question is matched against them with BM25 keyword search (top 4 passages).
3. Claude (`claude-opus-5-5`, low effort) answers using only those passages and streams the reply back as NDJSON; the passages used are shown as sources.
4. Requests are rate limited per IP (8/minute, 40/hour) in memory.

Deploy on any Node host (Vercel, Netlify, a VPS) with `npm run build` and the `ANTHROPIC_API_KEY` environment variable set.
