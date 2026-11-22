<script setup lang="ts">
const profile = useProfile();
const { t } = useI18n();
</script>

<template>
  <section id="services" class="block">
    <div class="in">
      <SectionHead
        layer="L4"
        name="services"
        :title="t('services.title')"
        :sub="t('services.sub')"
      />
      <div class="svc">
        <div v-for="s in profile.services" :key="s.title" class="sv" :style="{ '--hue': `var(--t${s.color})` }">
          <span class="beam" aria-hidden="true"></span>
          <h3>{{ s.title }}</h3>
          <p>{{ s.summary }}</p>
          <ul>
            <li v-for="d in s.deliverables" :key="d">{{ d }}</li>
          </ul>
          <div class="dur">{{ s.duration }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.svc { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 40px; }
.sv { display: grid; gap: 12px; align-content: start; }
.beam { display: block; height: 3px; background: linear-gradient(90deg, var(--hue), transparent 80%); margin-bottom: 8px; }
h3 { margin: 0; font-size: 24px; letter-spacing: -0.02em; font-weight: 700; }
p { margin: 0; color: var(--soft); }
ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 7px; font-size: 15px; }
li { display: flex; gap: 10px; }
li::before { content: ""; flex: none; width: 6px; height: 6px; margin-top: 0.6em; background: var(--hue); }
.dur { font-family: var(--f-mono); font-size: 12px; color: var(--faint); margin-top: 6px; }
@media (max-width: 820px) { .svc { grid-template-columns: 1fr; gap: 32px; } }
</style>
