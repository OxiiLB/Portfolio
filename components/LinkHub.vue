<script setup lang="ts">
const profile = useProfile();
const { t } = useI18n();

const copied = ref<"copy" | "copied" | "selected">("copy");
const addr = ref<HTMLElement | null>(null);

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.value.email);
    copied.value = "copied";
  } catch {
    if (addr.value) {
      const range = document.createRange();
      range.selectNodeContents(addr.value);
      const sel = getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    copied.value = "selected";
  }
  setTimeout(() => (copied.value = "copy"), 1600);
}
</script>

<template>
  <section id="links" class="block">
    <div class="in">
      <SectionHead name="find_me" :title="t('links.title')" :sub="t('links.sub')" />
      <div class="hub">
        <a
          v-for="l in profile.links"
          :key="l.key"
          class="row"
          :href="l.url"
          target="_blank"
          rel="noopener"
          :style="{ '--hue': `var(--t${l.color})` }"
        >
          <span class="sw">{{ l.badge }}</span>
          <span class="name"><b>{{ l.label }}</b><span>{{ l.description }}</span></span>
          <span class="go" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="16" height="16"><path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" /></svg>
          </span>
        </a>
        <div class="row mail" :style="{ '--hue': 'var(--t6)' }">
          <span class="sw">@</span>
          <span class="name">
            <b><a :href="`mailto:${profile.email}`">{{ t("links.email") }}</a></b>
            <span ref="addr" class="addr">{{ profile.email }}</span>
          </span>
          <button class="copy" :class="{ done: copied !== 'copy' }" type="button" @click="copyEmail">
            <svg v-if="copied === 'copy'" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
              <path d="M5.5 5.5V3h7.5v7.5h-2.5" /><path d="M3 5.5h7.5V13H3z" />
            </svg>
            <svg v-else viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3 8.5 6.5 12 13 4.5" /></svg>
            <span aria-live="polite">{{ t(`links.${copied}`) }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Two columns of contact rows on wide screens, one on phones. */
.hub { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px 28px; }
.row {
  display: grid; grid-template-columns: 44px minmax(0, 1fr) auto; align-items: center; gap: 16px;
  padding: 14px; text-decoration: none; position: relative;
  transition: background-color 0.2s;
}
.row::before { content: ""; position: absolute; left: 0; top: 10px; bottom: 10px; width: 2px; background: var(--hue); opacity: 0; transition: opacity 0.2s; }
.row:hover { background: linear-gradient(90deg, color-mix(in srgb, var(--hue) 10%, transparent), transparent 80%); }
.row:hover::before { opacity: 1; }
.sw { width: 44px; height: 44px; display: grid; place-items: center; font: 600 13px var(--f-mono); color: var(--tok-ink); background: var(--hue); clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px); }
.name { display: grid; min-width: 0; }
.name b { font-size: 20px; font-weight: 650; letter-spacing: -0.015em; line-height: 1.2; }
.name b a { text-decoration: none; }
.name span { color: var(--soft); font-size: 14px; overflow-wrap: anywhere; }
.addr { font-family: var(--f-mono); font-size: 13px !important; }

/* Shared shape for the arrow and the copy button: a small cut-corner key. */
.go, .copy {
  height: 40px; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  color: var(--soft); background: rgba(238, 234, 246, 0.06);
  box-shadow: inset 0 0 0 1px rgba(238, 234, 246, 0.1);
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
  transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
}
svg { fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; flex: none; }
.go { width: 40px; }
.go svg { transition: transform 0.25s cubic-bezier(0.3, 0.8, 0.3, 1); }
.row:hover .go, .row:focus-visible .go { background: var(--hue); color: var(--tok-ink); box-shadow: none; }
.row:hover .go svg, .row:focus-visible .go svg { transform: translate(2px, -2px); }

.copy { border: 0; padding: 0 14px; font-family: var(--f-mono); font-size: 12px; font-weight: 600; min-width: 96px; }
.copy:hover { background: var(--hue); color: var(--tok-ink); box-shadow: none; }
.copy.done { background: var(--ok); color: var(--tok-ink); box-shadow: none; }
.copy.done svg { animation: tick 0.3s ease-out; }
@keyframes tick { from { transform: scale(0.4); opacity: 0; } }

@media (max-width: 860px) { .hub { grid-template-columns: 1fr; } }
@media (max-width: 480px) {
  .row { grid-template-columns: 40px minmax(0, 1fr) auto; gap: 12px; padding: 12px 8px; }
  .sw { width: 40px; height: 40px; }
  .name b { font-size: 18px; }
  .copy { min-width: 0; padding: 0 11px; }
  .copy span { display: none; }
}
</style>
