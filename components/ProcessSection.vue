<script setup lang="ts">
// The steps of a mission, in order. Numbers are real: they are the sequence.
const profile = useProfile();
const { t } = useI18n();
const colors = [1, 2, 4, 3, 5, 6];
</script>

<template>
  <section id="process" class="block">
    <div class="in">
      <SectionHead name="process" :title="t('process.title')" :sub="t('process.sub')" />
      <ol class="steps">
        <li v-for="(s, i) in profile.process" :key="s.title" class="step">
          <span class="n" :class="`c${colors[i % colors.length]}`">{{ String(i + 1).padStart(2, "0") }}</span>
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 28px; position: relative; }
/* A soft line running behind the step numbers. */
.steps::before {
  content: ""; position: absolute; top: 19px; left: 20px; right: 20px; height: 2px; border-radius: 2px;
  background: linear-gradient(90deg, var(--t1), var(--t2), var(--t4), var(--t3));
  opacity: 0.8;
}
.step { position: relative; display: grid; gap: 10px; align-content: start; }
.n {
  width: 40px; height: 40px; display: grid; place-items: center; border-radius: 12px;
  font-family: var(--f-mono); font-size: 13px; font-weight: 600; color: var(--tok-ink);
  box-shadow: 0 0 0 5px var(--bg);
}
h3 { margin: 8px 0 0; font-size: 20px; letter-spacing: -0.015em; font-weight: 700; }
p { margin: 0; color: var(--soft); font-size: 15.5px; line-height: 1.6; }
@media (max-width: 860px) {
  .steps { grid-template-columns: 1fr; gap: 22px; }
  .steps::before { top: 20px; bottom: 20px; left: 19px; right: auto; width: 2px; height: auto; background: linear-gradient(180deg, var(--t1), var(--t2), var(--t4), var(--t3)); }
  .step { grid-template-columns: 40px minmax(0, 1fr); column-gap: 18px; }
  .n { grid-row: span 2; }
  h3 { margin: 6px 0 0; }
}
</style>
