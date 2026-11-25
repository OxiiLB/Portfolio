<script setup lang="ts">
const profile = useProfile();
const { t, locale } = useI18n();

interface ChatTurn {
  role: "user" | "assistant";
  text: string;
  tokens: string[];
  sources: string[];
  error?: boolean;
}

const turns = ref<ChatTurn[]>([]);
const question = ref("");
const busy = ref(false);
const colorTokens = ref(true);
const lastTokenCount = ref(0);
const docCount = ref<number | null>(null);
const thread = ref<HTMLElement | null>(null);

/** Counters and the colour switch appear once a first answer has fully come back. */
const answered = ref(false);

/** Leading whitespace of a token, rendered outside its highlight. */
function lead(tok: string): string {
  return tok.match(/^\s*/)?.[0] ?? "";
}

/** Matcha tint at rest, pastel on hover, cycling through the six token colors. */
function tokStyle(i: number) {
  const n = (i % 6) + 1;
  return { "--tok": `var(--t${n})`, "--tok-pop": `var(--p${n})` };
}

/** Rough, display-only split that looks like sub-word tokens. */
function splitTokens(text: string): string[] {
  const out: string[] = [];
  for (const w of text.match(/\s*\S+|\s+$/g) ?? []) {
    if (w.trim().length > 8) {
      const cut = Math.ceil(w.length / 2);
      out.push(w.slice(0, cut), w.slice(cut));
    } else out.push(w);
  }
  return out;
}

function scrollDown() {
  nextTick(() => {
    if (thread.value) thread.value.scrollTop = thread.value.scrollHeight;
  });
}

async function ask(q: string) {
  q = q.trim();
  if (!q || busy.value) return;
  question.value = "";
  busy.value = true;

  const history = turns.value
    .filter((t) => !t.error && t.text)
    .slice(-6)
    .map((t) => ({ role: t.role, content: t.text }));

  turns.value.push({ role: "user", text: q, tokens: [], sources: [] });
  const answer = reactive<ChatTurn>({ role: "assistant", text: "", tokens: [], sources: [] });
  turns.value.push(answer);
  scrollDown();

  let pending = "";
  const flush = (final = false) => {
    // Emit complete words only, so tokens don't flicker mid-word.
    const idx = final ? pending.length : pending.search(/\s\S*$/);
    if (idx <= 0) return;
    const chunk = pending.slice(0, idx);
    pending = pending.slice(idx);
    answer.tokens.push(...splitTokens(chunk));
    lastTokenCount.value = answer.tokens.length;
    scrollDown();
  };

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: q, history, locale: locale.value }),
    });
    if (!res.ok || !res.body) {
      const msg = await res.json().catch(() => null);
      throw new Error(msg?.message ?? t("ask.unavailable"));
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let nl: number;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line) continue;
        const ev = JSON.parse(line);
        if (ev.type === "meta") docCount.value = ev.documents;
        else if (ev.type === "sources") answer.sources = ev.sources;
        else if (ev.type === "text") {
          answer.text += ev.text;
          pending += ev.text;
          flush();
        } else if (ev.type === "error") throw new Error(ev.message);
      }
    }
    flush(true);
  } catch (e) {
    flush(true);
    answer.error = true;
    lastTokenCount.value = 0;
    answer.tokens = splitTokens(
      `${(e as Error).message} ${t("ask.emailFallback", { email: profile.value.email })}`,
    );
  } finally {
    if (!answer.error && answer.tokens.length) answered.value = true;
    busy.value = false;
    scrollDown();
  }
}
</script>

<template>
  <section id="ask" class="block">
    <div class="in">
      <SectionHead
        :title="t('ask.title')"
        :sub="t('ask.sub')"
      />
      <CutPanel :cut="22" edge="linear-gradient(135deg, color-mix(in srgb, var(--m2) 55%, transparent), color-mix(in srgb, var(--ink) 8%, transparent) 45%, color-mix(in srgb, var(--ink) 8%, transparent) 80%, color-mix(in srgb, var(--m3) 40%, transparent))" fill="color-mix(in srgb, var(--surface) 92%, transparent)">
      <!-- A chat window: status bar, bubbles (assistant on the left with Romain's
           photo, visitor on the right in green), suggestion chips, input. -->
      <div class="chat" :class="{ nocolor: !colorTokens }">
        <div class="chead">
          <span class="status"><i :class="{ on: busy }"></i>{{ busy ? t("ask.writing") : t("ask.online") }}</span>
          <span>{{ t("ask.powered") }}</span>
        </div>

        <div ref="thread" class="msgs" aria-live="polite">
          <div class="row bot first">
            <img class="av" :src="profile.photo.src" alt="" width="32" height="32" />
            <div class="stack">
              <span class="who">{{ t("ask.name") }}</span>
              <div class="bubble">{{ t("ask.greeting") }}</div>
            </div>
          </div>
          <template v-for="(turn, n) in turns" :key="n">
            <div v-if="turn.role === 'user'" class="row user">
              <div class="bubble">{{ turn.text }}</div>
            </div>
            <div v-else class="row bot">
              <img class="av" :src="profile.photo.src" alt="" width="32" height="32" />
              <div class="stack">
                <!-- Tokens are coloured only while this answer streams, then settle into plain text. -->
                <div class="bubble" :class="{ err: turn.error, streaming: busy && n === turns.length - 1 }">
                  <span v-if="!turn.tokens.length" class="typing" role="status" :aria-label="t('ask.thinking')"><i></i><i></i><i></i></span>
                  <template v-for="(tok, i) in turn.tokens" :key="i">{{ lead(tok) }}<span class="t" :style="tokStyle(i)">{{ tok.trimStart() }}</span></template>
                </div>
                <div v-if="turn.sources.length && !(busy && n === turns.length - 1)" class="srcs" :aria-label="t('ask.sources')">
                  <span v-for="s in turn.sources" :key="s">{{ s }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="composer">
          <div class="chips" role="group" :aria-label="t('ask.try')">
            <button
              v-for="q in profile.suggestedQuestions"
              :key="q"
              type="button"
              :disabled="busy"
              @click="ask(q)"
            >{{ q }}</button>
          </div>
          <form class="ask" @submit.prevent="ask(question)">
            <label for="ask-q" class="sr-only">{{ t("ask.label") }}</label>
            <input
              id="ask-q"
              v-model="question"
              autocomplete="off"
              maxlength="500"
              :placeholder="t('ask.placeholder')"
            />
            <button type="submit" :disabled="busy">{{ t("ask.send") }}</button>
          </form>
          <div v-if="answered" class="meta">
            <label class="tgl" for="tokcolor">
              <input id="tokcolor" v-model="colorTokens" type="checkbox" /> {{ t("ask.color") }}
            </label>
            <span class="stat">
              <span>{{ t("ask.lastAnswer") }} <b>{{ t("ask.tokens", { n: lastTokenCount }) }}</b></span>
              <span>{{ t("ask.sources") }} <b>{{ turns.at(-1)?.sources.length ?? 0 }}</b></span>
            </span>
          </div>
        </div>
      </div>
      </CutPanel>
    </div>
  </section>
</template>

<style scoped>
.chat { display: flex; flex-direction: column; height: 620px; color: var(--ink); }

/* Status bar */
.chead {
  display: flex; justify-content: space-between; align-items: center; gap: 12px;
  padding: 14px clamp(18px, 3vw, 28px); border-bottom: 1px solid var(--line);
  font-size: 13.5px; color: var(--soft);
}
.status { display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--ink); }
.status i { width: 8px; height: 8px; border-radius: 50%; background: var(--ok); box-shadow: 0 0 0 3px color-mix(in srgb, var(--ok) 22%, transparent); }
.status i.on { animation: blink 0.8s infinite alternate; }
@keyframes blink { to { opacity: 0.3; } }

/* Messages */
.msgs { flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; padding: 22px clamp(18px, 3vw, 28px); }
.row { display: flex; gap: 10px; align-items: flex-start; }
.row.user { justify-content: flex-end; }
/* The avatar sits level with the top of the bubble (below the name on the greeting). */
.av { width: 32px; height: 32px; margin-top: 4px; border-radius: 50%; object-fit: cover; flex: none; background: var(--surface-2); }
.row.first .av { margin-top: 26px; }
.stack { display: grid; gap: 6px; justify-items: start; max-width: min(62ch, 85%); min-width: 0; }
.who { font-size: 13px; font-weight: 650; color: var(--soft); padding-left: 4px; }
.bubble { padding: 11px 16px; font-size: 16px; line-height: 1.55; overflow-wrap: anywhere; }
.bot .bubble { background: color-mix(in srgb, var(--m2) 9%, var(--surface)); border-radius: 18px 18px 18px 6px; }
.user .bubble { background: var(--m2); color: var(--on-accent); border-radius: 18px 18px 6px 18px; max-width: min(52ch, 80%); }
.bubble.err { color: var(--soft); background: color-mix(in srgb, var(--ink) 5%, var(--surface)); }

/* Token highlight: a band behind most of the letters (about 3/4 of the line), not a full
   block, with a small gap between pieces so neighbours never touch. */
.bubble .t {
  /* Slightly deeper than the token tint so the palest shades still show on the bubble. */
  --band: color-mix(in srgb, var(--tok) 72%, var(--m3));
  color: var(--tok-ink); white-space: pre-wrap;
  margin-left: 1px; border-radius: 2px;
  background-image: linear-gradient(var(--band), var(--band));
  background-repeat: no-repeat; background-size: 100% 0%; background-position: 0 92%;
  -webkit-box-decoration-break: clone; box-decoration-break: clone;
  /* When the answer finishes, the bands sink to the baseline and disappear. */
  transition: background-size 420ms cubic-bezier(0.23, 1, 0.32, 1);
}
.bubble.streaming .t { background-size: 100% 74%; background-position: 0 72%; transition: none; }
.bubble.streaming .t:hover { --band: var(--tok-pop); }
.nocolor .bubble .t, .bubble.err .t { background: transparent !important; color: inherit; }

/* Typing dots */
.typing { display: inline-flex; gap: 4px; padding: 6px 0; }
.typing i { width: 7px; height: 7px; border-radius: 50%; background: var(--soft); animation: dot 1s infinite ease-in-out; }
.typing i:nth-child(2) { animation-delay: 0.15s; }
.typing i:nth-child(3) { animation-delay: 0.3s; }
@keyframes dot { 0%, 60%, 100% { opacity: 0.3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }

/* Sources used for an answer, under its bubble */
.srcs { display: flex; gap: 6px; flex-wrap: wrap; padding-left: 4px; }
.srcs span { font-family: var(--f-mono); font-size: 11.5px; background: color-mix(in srgb, var(--ink) 6%, transparent); padding: 3px 8px; border-radius: 6px; color: var(--soft); }
.srcs span::before { content: "↳ "; }

/* Composer: suggestion chips, input, then counters once there is an answer */
.composer { display: grid; gap: 10px; padding: 12px clamp(18px, 3vw, 28px) 18px; border-top: 1px solid var(--line); }
.chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chips button {
  border: 1px solid color-mix(in srgb, var(--m2) 22%, transparent); background: var(--surface);
  border-radius: 999px; padding: 7px 14px; font-size: 14px; color: var(--ink); white-space: nowrap;
}
.chips button:hover:not(:disabled) { background: color-mix(in srgb, var(--m2) 8%, var(--surface)); border-color: color-mix(in srgb, var(--m2) 40%, transparent); }
.ask { border-radius: 14px; display: flex; gap: 8px; background: color-mix(in srgb, var(--ink) 5%, transparent); padding: 6px; box-shadow: inset 0 -2px 0 color-mix(in srgb, var(--ink) 10%, transparent); transition: box-shadow 0.2s; }
.ask:focus-within { box-shadow: inset 0 -2px 0 var(--m3); }
.ask input { flex: 1; min-width: 0; background: none; border: 0; color: var(--ink); font: inherit; font-size: 16px; padding: 8px 10px; }
.ask input::placeholder { color: var(--soft); }
.ask input:focus { outline: none; }
.ask button { border: 0; border-radius: 10px; background: var(--grad); color: var(--on-accent); font-weight: 600; padding: 8px 16px; }
button:disabled { opacity: 0.5; cursor: progress; }
/* Press feedback */
.ask button, .chips button { transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1), background-color 0.2s, border-color 0.2s; }
.ask button:active:not(:disabled), .chips button:active:not(:disabled) { transform: scale(0.97); }
.meta { display: flex; justify-content: space-between; align-items: center; gap: 8px 20px; flex-wrap: wrap; font-size: 13px; color: var(--soft); }
.tgl { display: flex; align-items: center; gap: 8px; }
.tgl input { accent-color: var(--m3); width: 15px; height: 15px; }
.stat { display: flex; gap: 18px; }
.stat b { font-family: var(--f-mono); font-weight: 500; color: var(--ink); font-variant-numeric: tabular-nums; }

@media (prefers-reduced-motion: reduce) {
  .bubble .t { transition: none; }
}
@media (max-width: 860px) {
  .chat { height: 580px; }
  /* One row of chips that scrolls sideways, so the conversation keeps its room. */
  .chips { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin-inline: calc(-1 * clamp(18px, 3vw, 28px)); padding-inline: clamp(18px, 3vw, 28px); }
  .chips::-webkit-scrollbar { display: none; }
  .stack { max-width: 88%; }
}
</style>
