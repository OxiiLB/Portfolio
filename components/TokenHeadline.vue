<script setup lang="ts">
import type { Token } from "~/data/profile";

const props = defineProps<{ tokens: Token[]; focus?: number }>();
const { t } = useI18n();
const view = ref<"tokens" | "plain">("tokens");
const plainText = computed(() =>
  lines.value.map((l) => l.map(({ t }) => t.text).join("").trim()).join(" "),
);

/** Tokens grouped by line, keeping each token's global index for attention. */
const lines = computed(() => {
  const out: { t: Token; i: number }[][] = [];
  props.tokens.forEach((t, i) => {
    const l = t.line ?? 0;
    (out[l] ??= []).push({ t, i });
  });
  return out.filter(Boolean);
});

const wrap = ref<HTMLElement | null>(null);
const tokenEls: HTMLElement[] = [];
const source = ref(props.focus ?? 0);
const hovering = ref(false);
const centres = ref<{ x: number; y: number }[]>([]);
const size = ref({ w: 0, h: 0 });

function setEl(el: unknown, i: number) {
  if (el instanceof HTMLElement) tokenEls[i] = el;
}

function weights(i: number): [number, number][] {
  const t = props.tokens[i];
  if (t?.attends?.length) return t.attends.filter(([j]) => j !== i && j < props.tokens.length);
  // Fallback when the headline changes: attend to the neighbours.
  return ([[i - 1, 0.5], [i + 1, 0.3], [0, 0.2]] as [number, number][]).filter(
    ([j]) => j >= 0 && j < props.tokens.length && j !== i,
  );
}

/** Attention weight of every token, seen from the current source token. */
const attn = computed(() => {
  const m = new Map(weights(source.value));
  return props.tokens.map((_, j) => (j === source.value ? 1 : (m.get(j) ?? 0)));
});

function measure() {
  if (!wrap.value) return;
  const box = wrap.value.getBoundingClientRect();
  size.value = { w: box.width, h: box.height };
  centres.value = props.tokens.map((_, i) => {
    const r = tokenEls[i]?.getBoundingClientRect();
    return r ? { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 } : { x: 0, y: 0 };
  });
}

// Threads between token centres. They run behind the tokens, so they show in the gaps.
const threads = computed(() => {
  const c = centres.value;
  const from = c[source.value];
  if (!from) return [];
  return weights(source.value).map(([j, wt]) => {
    const to = c[j];
    const mx = (from.x + to.x) / 2;
    const my = Math.min(from.y, to.y) - 30 - Math.abs(from.x - to.x) * 0.12;
    return { key: `${source.value}-${j}`, d: `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`, width: 2 + wt * 8, opacity: 0.4 + wt };
  });
});

function tokenStyle(i: number) {
  return {
    animationDelay: `${i * 0.06}s`,
    opacity: hovering.value ? 0.32 + 0.68 * Math.min(1, attn.value[i] * 1.8) : 1,
  };
}

let ro: ResizeObserver | null = null;
onMounted(async () => {
  await document.fonts?.ready;
  // Wait for the entrance animation so positions are final.
  setTimeout(measure, 700);
  ro = new ResizeObserver(measure);
  if (wrap.value) ro.observe(wrap.value);
});
onBeforeUnmount(() => ro?.disconnect());
</script>

<template>
  <div>
    <div ref="wrap" class="wrap" :class="{ plain: view === 'plain' }">
      <svg class="threads" :width="size.w" :height="size.h" aria-hidden="true">
        <path
          v-for="t in threads"
          :key="t.key"
          class="thread"
          :d="t.d"
          :stroke-width="t.width"
          :stroke-opacity="Math.min(t.opacity, 1)"
        />
      </svg>
      <h1 class="toks" :aria-label="plainText" @mouseleave="hovering = false">
        <span v-for="(line, l) in lines" :key="l" class="line" aria-hidden="true">
          <span
            v-for="{ t, i } in line"
            :key="i"
            :ref="(el) => setEl(el, i)"
            class="tk"
            :class="[`c${t.color}`, { src: i === source, word: t.text.startsWith(' ') }]"
            :style="tokenStyle(i)"
            @mouseenter="source = i; hovering = true"
          >{{ t.text.trim() }}<small>{{ t.id }}</small><em
              v-if="attn[i] > 0 && i !== source"
              class="w"
            >{{ attn[i].toFixed(2) }}</em></span>
        </span>
      </h1>
    </div>
    <div class="meta">
      <span>{{ t("hero.tokens", { n: tokens.length }) }}</span>
      <span class="switch" role="group" :aria-label="t('hero.view')">
        <button type="button" :aria-pressed="view === 'tokens'" @click="view = 'tokens'">{{ t("hero.viewTokens") }}</button>
        <button type="button" :aria-pressed="view === 'plain'" @click="view = 'plain'">{{ t("hero.viewPlain") }}</button>
      </span>
    </div>
  </div>
</template>

<style scoped>
.wrap { position: relative; margin-top: 44px; }
.threads { position: absolute; inset: 0; overflow: visible; pointer-events: none; z-index: 0; transition: opacity 0.4s; }
.thread {
  fill: none; stroke: var(--m3); stroke-linecap: round;
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--m2) 60%, transparent));
  stroke-dasharray: 900; stroke-dashoffset: 900; animation: draw 0.8s ease-out forwards;
}
@keyframes draw { to { stroke-dashoffset: 0; } }
.toks {
  position: relative; z-index: 1; margin: 0;
  display: grid; justify-items: start; row-gap: 0.18em;
  font-size: clamp(32px, 4.8vw, 64px); font-weight: 800; line-height: 1.02; letter-spacing: -0.035em;
}
/* One line per phrase. Pieces of the same word sit almost touching;
   a real space between words gets a clear gap. */
.line { display: flex; flex-wrap: wrap; row-gap: 0.18em; }
.tk + .tk { margin-left: 0.05em; }
.tk.word + .tk.word, .tk + .tk.word { margin-left: 0.3em; }
.tk {
  position: relative; padding: 0.02em 0.08em 0.14em; border-radius: 0.14em; color: var(--tok-ink); cursor: default;
  transition: background-color 0.5s, color 0.5s, transform 0.2s, box-shadow 0.3s, opacity 0.35s;
  animation: pop 0.5s backwards cubic-bezier(0.2, 0.9, 0.3, 1.3);
}
.tk.src { box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--m2); }
.tk small {
  position: absolute; left: 0.3em; bottom: -0.02em;
  font: 500 10.5px/1 var(--f-mono); letter-spacing: 0;
  color: color-mix(in srgb, var(--tok-ink) 60%, transparent); transition: opacity 0.4s;
}
.w {
  position: absolute; z-index: 3; top: -9px; right: -6px; font: 600 11px/1 var(--f-mono); font-style: normal; letter-spacing: 0;
  color: var(--on-accent); background: var(--grad); padding: 3px 5px; border-radius: 4px;
  animation: fade 0.3s both;
}
@keyframes fade { from { opacity: 0; transform: translateY(4px); } }
.tk:hover { transform: translateY(-4px); }
@keyframes pop { from { transform: translateY(0.25em) scale(0.96); } }
.plain .tk { background: transparent; color: var(--ink); box-shadow: none; opacity: 1 !important; }
.plain .tk + .tk { margin-left: 0; }
.plain .tk.word + .tk.word, .plain .tk + .tk.word { margin-left: 0.24em; }
.plain .tk small, .plain .w { opacity: 0; }
.plain .threads { opacity: 0; }
.meta { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin-top: 22px; font-family: var(--f-mono); font-size: 12.5px; color: var(--soft); }
.switch { display: inline-flex; background: color-mix(in srgb, var(--ink) 6%, transparent); border-radius: 8px; overflow: hidden; }
.switch button { border: 0; background: none; padding: 5px 10px; font-family: var(--f-mono); font-size: 12px; color: var(--soft); }
.switch button[aria-pressed="true"] { background: var(--ink); color: var(--bg); }
@media (max-width: 560px) { .w { font-size: 9.5px; top: -7px; } .tk small { font-size: 9px; } }
</style>
