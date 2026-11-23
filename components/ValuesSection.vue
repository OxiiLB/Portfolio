<script setup lang="ts">
const profile = useProfile();
const { t } = useI18n();
</script>

<template>
  <section id="values" class="block">
    <div class="in">
      <SectionHead name="values" :title="t('values.title')" :sub="t('values.sub')" />
      <div class="values">
        <CutPanel v-for="v in profile.values" :key="v.title" :cut="20" :style="{ '--rest': `var(--t${v.color})`, '--pop': `var(--p${v.color})` }">
          <article class="value">
            <span class="kw" :class="`c${v.color}`">{{ v.keyword }}</span>
            <h3>{{ v.title }}</h3>
            <p>{{ v.text }}</p>
          </article>
        </CutPanel>
      </div>
    </div>
  </section>
</template>

<style scoped>
.values { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.values > * { --hue: var(--rest); }
.values > *:hover { --hue: var(--pop); }
.value {
  height: 100%; padding: 26px; display: grid; gap: 12px; align-content: start;
  background: radial-gradient(26rem 12rem at 0% 0%, color-mix(in srgb, var(--hue) 22%, transparent), transparent 70%);
}
.kw { justify-self: start; font-family: var(--f-mono); font-size: 12px; font-weight: 600; padding: 3px 9px; border-radius: 7px; color: var(--tok-ink); }
h3 { margin: 4px 0 0; font-size: clamp(22px, 2.4vw, 26px); line-height: 1.15; letter-spacing: -0.02em; font-weight: 700; text-wrap: balance; }
p { margin: 0; color: var(--soft); font-size: 16px; line-height: 1.65; max-width: 48ch; }
@media (max-width: 720px) { .values { grid-template-columns: 1fr; } }
</style>
