# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install            # also runs `nuxt prepare` (generates .nuxt/ types)
npm run dev            # http://localhost:3000
npm run build          # production Node server build (.output/)
npm run preview        # serve the production build
npx vue-tsc --noEmit   # type-check (no npm script for it)
```

There is no test suite and no linter configured. Copy `.env.example` to `.env` and set `ANTHROPIC_API_KEY` to enable the assistant; without it the site works and `/api/ask` returns a 503 "not switched on yet" message.

## Architecture

Single-page Nuxt 3 portfolio (`pages/index.vue` composes the section components in order) plus one server endpoint: a RAG assistant that answers visitor questions about Romain.

### Content: one source of truth

- `data/profile.ts` holds all profile content (headline tokens, links, projects, services, values, process, about…). Translatable fields are written as `{ en, fr }`; `getProfile(locale)` resolves them into a flat object. Components read it through the `useProfile()` composable (reactive to the current i18n locale).
- The same profile data is **also indexed by the assistant** (`passagesFromProfile` in `server/utils/knowledge.ts`), so anything added there must stay factual. When adding a new field to the profile that the assistant should know about, also add it to `passagesFromProfile`.
- `server/knowledge/<locale>/*.md` holds assistant-only facts. Each `## Heading` becomes one passage; HTML comments are stripped. New files are picked up automatically (bundled via Nitro `serverAssets`, read from `assets:knowledge` storage with keys like `fr:about.md`).
- UI strings (buttons, section titles, meta) live in `i18n/locales/{en,fr}.json`, not in profile data.
- `TODO(Romain)` marks placeholder content still to be replaced.

### i18n

`@nuxtjs/i18n` with `prefix_except_default`: English at `/`, French at `/fr`. Locales are defined in both `nuxt.config.ts` and `LOCALES` in `data/profile.ts`; keep them in sync. The client sends its locale to `/api/ask`, which picks localized error messages and the per-locale knowledge index.

### Assistant pipeline (`server/api/ask.post.ts`)

1. Validate the question (≤500 chars), apply an in-memory per-IP rate limit (8/min, 40/hour).
2. `reserve()` from `server/utils/usage.ts` books the worst-case cost of one answer against a monthly USD budget and a daily question cap (runtime config `assistantMonthlyBudgetUsd`/`assistantDailyQuestions`, overridable via `NUXT_ASSISTANT_*` env vars). Read-modify-write is serialized with a promise lock; counters persist in Nitro storage `assistant-usage` (`.data/assistant-usage` on disk; must be swapped for a shared KV store on serverless hosts).
3. `retrieve()` runs BM25 over the locale's passages (top 4), querying with the current question plus the previous user turn so follow-ups keep context. The index is cached per locale in production and rebuilt on every request in dev.
4. Calls `claude-haiku-5-5` via `messages.stream` with a short history (last 4 messages, each trimmed to 600 chars), and streams **NDJSON** back: `{type:"meta"}`, `{type:"text"}` deltas, then `{type:"sources"}` or `{type:"error"}`. `components/AskAssistant.vue` is the client consumer of this protocol.
5. `release()` replaces the reservation with the real cost computed from token usage (`PRICE`, `MAX_OUTPUT_TOKENS`, `WORST_CASE_USD` in `usage.ts`). If the model or limits change, update those constants so the budget guard stays correct.

### Styling

Hand-written CSS only (no framework). Design tokens are CSS custom properties in `assets/css/main.css`: light theme is the default `:root`; an older dark theme remains under `:root[data-theme="dark"]` (the README's "dark only" note is outdated). Section backgrounds use `band-*` and `wave-top`/`wave-bottom` utility classes applied from `pages/index.vue`. Component styles are `<style scoped>`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. When the answer is under a Markdown heading, `graphify section "<heading>"` prints that section's text, so the .md need not be opened. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
