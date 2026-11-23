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
3. Claude Haiku 5.5 (`claude-haiku-5-5`) answers using only those passages and streams the reply back as NDJSON; the passages used are shown as sources.
4. Requests are rate limited per IP (8/minute, 40/hour).

## Cost limits

The assistant can never spend more than **$2.50 a month (under €3)**. See `server/utils/usage.ts`.

- Before each call it reserves the worst-case cost of one answer (~$0.0005); after the call it records the real cost from the API's token usage.
- When the month's budget is used up, or after 200 questions in a day, it politely refuses and points visitors to your contact links.
- Change the limits on the host with `NUXT_ASSISTANT_MONTHLY_BUDGET_USD` and `NUXT_ASSISTANT_DAILY_QUESTIONS`.
- Counters are stored in `.data/assistant-usage` (works on a normal server). On serverless hosts (Netlify, Vercel, Cloudflare), point the `assistant-usage` storage in `nuxt.config.ts` to a shared store such as Upstash Redis or Cloudflare KV.
- Extra safety net: use a dedicated API key in its own Console workspace, with prepaid credits and auto-reload off.

Deploy on any Node host (Vercel, Netlify, a VPS) with `npm run build` and the `ANTHROPIC_API_KEY` environment variable set.
