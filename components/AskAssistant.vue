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

const greetingTokens = computed(() => splitTokens(t("ask.greeting")));

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
    answer.tokens = splitTokens(
      `${(e as Error).message} ${t("ask.emailFallback", { email: profile.value.email })}`,
    );
  } finally {
    busy.value = false;
    scrollDown();
  }
}
</script>

<template>
  <section id="ask" class="block">
    <div class="in">
      <SectionHead
        layer="L2"
        name="retrieve + generate"
        :title="t('ask.title')"
        :sub="t('ask.sub')"
      />
      <CutPanel :cut="22" edge="linear-gradient(135deg, var(--m2), var(--m3) 30%, rgba(238,234,246,.08) 60%, rgba(238,234,246,.08) 85%, var(--m1))" fill="color-mix(in srgb, var(--surface) 92%, transparent)">
      <div class="chat" :class="{ nocolor: !colorTokens }">
        <div class="thread">
          <div class="chead">
            <span class="live"><i :class="{ on: busy }"></i>romain-rag{{ docCount ? ` · ${t('ask.indexed', { n: docCount })}` : "" }}</span>
            <span>{{ t("ask.powered") }}</span>
          </div>
          <div ref="thread" class="msgs" aria-live="polite">
            <div class="m-bot">
              <span v-for="(t, i) in greetingTokens" :key="i" class="t" :class="`c${(i % 6) + 1}`">{{ t }}</span>
            </div>
            <template v-for="(turn, n) in turns" :key="n">
              <div v-if="turn.role === 'user'" class="m-user">{{ turn.text }}</div>
              <div v-else class="m-bot" :class="{ err: turn.error }">
                <span v-if="!turn.tokens.length" class="typing" :aria-label="t('ask.thinking')">●●●</span>
                <span v-for="(t, i) in turn.tokens" :key="i" class="t" :class="`c${(i % 6) + 1}`">{{ t }}</span>
                <div v-if="turn.sources.length && !busy" class="srcs">
                  <span v-for="s in turn.sources" :key="s">{{ s }}</span>
                </div>
              </div>
            </template>
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
        </div>
        <aside class="side">
          <div class="sugg">
            <span class="label">{{ t("ask.try") }}</span>
            <button
              v-for="q in profile.suggestedQuestions"
              :key="q"
              type="button"
              :disabled="busy"
              @click="ask(q)"
            >{{ q }}</button>
          </div>
          <label class="tgl" for="tokcolor">
            <input id="tokcolor" v-model="colorTokens" type="checkbox" /> {{ t("ask.color") }}
          </label>
          <div class="stat">
            <div><span>{{ t("ask.lastAnswer") }}</span><b>{{ t("ask.tokens", { n: lastTokenCount }) }}</b></div>
            <div><span>{{ t("ask.sources") }}</span><b>{{ turns.at(-1)?.sources.length ?? 0 }}</b></div>
          </div>
        </aside>
      </div>
      </CutPanel>
    </div>
  </section>
</template>

<style scoped>
.chat { display: grid; grid-template-columns: minmax(0, 1fr) 280px; color: var(--ink); }
.thread { padding: 26px clamp(18px, 3vw, 32px); display: flex; flex-direction: column; gap: 16px; height: 520px; min-width: 0; }
.chead { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; font-family: var(--f-mono); font-size: 12px; color: var(--soft); }
.live { display: flex; align-items: center; gap: 7px; }
.live i { width: 7px; height: 7px; border-radius: 50%; background: var(--ok); }
.live i.on { animation: blink 0.8s infinite alternate; }
@keyframes blink { to { opacity: 0.25; } }
.msgs { display: flex; flex-direction: column; gap: 16px; flex: 1; overflow-y: auto; min-height: 0; padding-right: 4px; }
.m-user { align-self: flex-end; background: rgba(238, 234, 246, 0.07); clip-path: polygon(0 0, 100% 0, 100% 100%, 10px 100%, 0 calc(100% - 10px)); padding: 10px 14px; max-width: 80%; overflow-wrap: anywhere; }
.m-bot { max-width: 62ch; font-size: 17px; line-height: 1.6; overflow-wrap: anywhere; }
.m-bot .t { border-radius: 3px; padding: 0 1px; color: var(--tok-ink); transition: background-color 0.6s, color 0.6s; white-space: pre-wrap; }
.nocolor .m-bot .t, .m-bot.err .t { background: transparent !important; color: var(--ink); }
.m-bot.err { color: var(--soft); }
.typing { color: var(--soft); letter-spacing: 3px; animation: blink 0.8s infinite alternate; }
.srcs { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
.srcs span { font-family: var(--f-mono); font-size: 11.5px; background: rgba(238, 234, 246, 0.06); padding: 3px 8px; color: var(--soft); }
.srcs span::before { content: "↳ "; }
.ask { display: flex; gap: 8px; background: rgba(238, 234, 246, 0.05); padding: 6px; box-shadow: inset 0 -2px 0 rgba(238, 234, 246, 0.1); transition: box-shadow 0.2s; }
.ask:focus-within { box-shadow: inset 0 -2px 0 var(--m3); }
.ask input { flex: 1; min-width: 0; background: none; border: 0; color: var(--ink); font: inherit; font-size: 16px; padding: 8px 10px; }
.ask input::placeholder { color: var(--soft); }
.ask input:focus { outline: none; }
.ask button { border: 0; background: var(--grad); color: #160A14; font-weight: 600; padding: 8px 14px; }
button:disabled { opacity: 0.5; cursor: progress; }
.side { border-left: 1px solid var(--line); padding: 26px 22px; display: grid; gap: 18px; align-content: start; }
.side .label { color: var(--soft); }
.sugg { display: grid; gap: 8px; }
.sugg button { text-align: left; background: rgba(238, 234, 246, 0.05); border: 0; border-left: 2px solid transparent; padding: 10px 12px; font-size: 14.5px; color: var(--ink); }
.sugg button:hover:not(:disabled) { border-left-color: var(--m3); background: rgba(238, 234, 246, 0.09); }
.tgl { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--soft); }
.tgl input { accent-color: var(--m3); width: 16px; height: 16px; }
.stat { font-family: var(--f-mono); font-size: 12px; color: var(--soft); display: grid; gap: 6px; }
.stat div { display: flex; justify-content: space-between; border-top: 1px dashed var(--line); padding-top: 6px; }
.stat b { color: var(--ink); font-weight: 500; font-variant-numeric: tabular-nums; }
@media (max-width: 860px) {
  .chat { grid-template-columns: 1fr; }
  .side { border-left: 0; border-top: 1px solid var(--line); order: -1; padding-bottom: 18px; }
  .tgl, .stat { display: none; }
  .thread { height: 440px; }
}
</style>
