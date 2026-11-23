<script setup lang="ts">
// Personal projects and associations: the part of Romain outside school and client work.
const profile = useProfile();
const { t } = useI18n();
</script>

<template>
  <section id="side-projects" class="block">
    <div class="in">
      <SectionHead name="off_the_clock" :title="t('side.title')" :sub="t('side.sub')" />
      <div class="grid">
        <CutPanel
          v-for="p in profile.sideProjects"
          :key="p.slug"
          :cut="18"
          class="item"
          :style="{ '--rest': `var(--t${p.color})`, '--pop': `var(--p${p.color})` }"
        >
          <article class="body">
            <div class="top">
              <span class="kind" :class="`c${p.color}`">{{ t(`side.kinds.${p.kind}`) }}</span>
              <span class="ctx">{{ p.context }}</span>
            </div>
            <h3>{{ p.title }}</h3>
            <p>{{ p.summary }}</p>
            <a v-if="p.link" class="link" :href="p.link.url" target="_blank" rel="noopener">{{ p.link.label }} ↗</a>
          </article>
        </CutPanel>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Six-column grid: three items on the first row, the last two share the next row evenly. */
.grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 16px; }
.item { grid-column: span 2; }
.item:nth-child(3n + 1):nth-last-child(2),
.item:nth-child(3n + 2):nth-last-child(1) { grid-column: span 3; }
.item:nth-child(3n + 1):nth-last-child(1) { grid-column: 1 / -1; }
.item { --hue: var(--rest); }
.item:hover { --hue: var(--pop); }
.body {
  height: 100%; padding: 22px; display: grid; gap: 10px; align-content: start;
  background: linear-gradient(160deg, color-mix(in srgb, var(--hue) 14%, transparent), transparent 55%);
}
.top { display: grid; justify-items: start; gap: 8px; }
.kind { font-family: var(--f-mono); font-size: 11.5px; font-weight: 600; padding: 3px 9px; border-radius: 7px; color: var(--tok-ink); }
.ctx { font-family: var(--f-mono); font-size: 12px; color: var(--faint); }
h3 { margin: 6px 0 0; font-size: 21px; line-height: 1.2; letter-spacing: -0.02em; font-weight: 700; text-wrap: balance; }
p { margin: 0; color: var(--soft); font-size: 15px; line-height: 1.6; }
.link { justify-self: start; margin-top: 4px; font-family: var(--f-mono); font-size: 12.5px; font-weight: 600; color: var(--ink); text-decoration: none; padding: 6px 10px; border-radius: 8px; background: color-mix(in srgb, var(--hue) 35%, transparent); }
.link:hover { background: var(--hue); color: var(--tok-ink); }
@media (max-width: 900px) {
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .item, .item:nth-child(3n + 1):nth-last-child(2), .item:nth-child(3n + 2):nth-last-child(1), .item:nth-child(3n + 1):nth-last-child(1) { grid-column: auto; }
  .item:last-child:nth-child(odd) { grid-column: 1 / -1; }
}
@media (max-width: 560px) {
  .grid { grid-template-columns: 1fr; }
  .item:last-child:nth-child(odd) { grid-column: auto; }
}
</style>
