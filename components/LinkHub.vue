<script setup lang="ts">
const profile = useProfile();
const { t } = useI18n();

const copied = ref<"copy" | "copied" | "selected">("copy");
const addr = ref<HTMLElement | null>(null);
const maxWeight = computed(() => Math.max(profile.value.emailWeight, ...profile.value.links.map((l) => l.weight)));
const pct = (w: number) => `${(w / maxWeight.value) * 100}%`;

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
      <SectionHead layer="L1" name="find_me" :title="t('links.title')" :sub="t('links.sub')" />
      <div class="dist">
        <div class="axis"><span>{{ t("links.axis") }}</span><span>{{ t("links.softmax", { n: profile.links.length + 1 }) }}</span></div>
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
          <span class="bar"><i :style="{ width: pct(l.weight) }"></i></span>
          <span class="p">{{ l.weight.toFixed(2) }}</span>
          <span class="go" aria-hidden="true">↗</span>
        </a>
        <div class="row mail" :style="{ '--hue': 'var(--t6)' }">
          <span class="sw">@</span>
          <span class="name">
            <b><a :href="`mailto:${profile.email}`">{{ t("links.email") }}</a></b>
            <span ref="addr" class="addr">{{ profile.email }}</span>
          </span>
          <span class="bar"><i :style="{ width: pct(profile.emailWeight) }"></i></span>
          <span class="p">{{ profile.emailWeight.toFixed(2) }}</span>
          <button class="go copy" type="button" @click="copyEmail">{{ t(`links.${copied}`) }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dist { display: grid; gap: 4px; }
.axis { display: flex; justify-content: space-between; font-family: var(--f-mono); font-size: 11.5px; color: var(--faint); padding: 0 14px 8px; }
.row {
  display: grid; grid-template-columns: 44px minmax(0, 1.1fr) minmax(0, 1fr) 48px 64px; align-items: center; gap: 18px;
  padding: 14px; text-decoration: none; position: relative;
  transition: background-color 0.2s;
}
.row::before { content: ""; position: absolute; left: 0; top: 10px; bottom: 10px; width: 2px; background: var(--hue); opacity: 0; transition: opacity 0.2s; }
.row:hover { background: linear-gradient(90deg, color-mix(in srgb, var(--hue) 10%, transparent), transparent 70%); }
.row:hover::before { opacity: 1; }
.sw { width: 44px; height: 44px; display: grid; place-items: center; font: 600 13px var(--f-mono); color: var(--tok-ink); background: var(--hue); clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px); }
.name { display: grid; min-width: 0; }
.name b { font-size: 20px; font-weight: 650; letter-spacing: -0.015em; line-height: 1.2; }
.name b a { text-decoration: none; }
.name span { color: var(--soft); font-size: 14px; overflow-wrap: anywhere; }
.addr { font-family: var(--f-mono); font-size: 13px !important; }
.bar { height: 8px; background: rgba(238, 234, 246, 0.06); position: relative; overflow: hidden; }
.bar i { position: absolute; inset: 0 auto 0 0; background: var(--hue); opacity: 0.75; transition: opacity 0.2s, filter 0.2s; }
.row:hover .bar i { opacity: 1; filter: drop-shadow(0 0 6px var(--hue)); }
.p { font-family: var(--f-mono); font-size: 13px; color: var(--soft); text-align: right; font-variant-numeric: tabular-nums; }
.go { font-family: var(--f-mono); color: var(--soft); text-align: right; }
.row:hover .go { color: var(--ink); }
.copy { border: 0; background: rgba(238, 234, 246, 0.08); padding: 6px 8px; font-size: 12px; text-align: center; }
.copy:hover { background: rgba(238, 234, 246, 0.16); color: var(--ink); }
@media (max-width: 720px) {
  .row { grid-template-columns: 40px minmax(0, 1fr) auto; grid-template-areas: "sw name go" "sw bar p"; gap: 6px 14px; }
  .sw { grid-area: sw; width: 40px; height: 40px; align-self: start; }
  .name { grid-area: name; }
  .bar { grid-area: bar; height: 5px; }
  .p { grid-area: p; font-size: 12px; }
  .go { grid-area: go; }
  .axis span:last-child { display: none; }
}
</style>
