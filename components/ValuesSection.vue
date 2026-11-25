<script setup lang="ts">
const profile = useProfile();
const { t } = useI18n();
</script>

<template>
  <section id="values" class="block">
    <div class="in">
      <SectionHead :title="t('values.title')" :sub="t('values.sub')" />
      <!-- A plain two-column list: each value is a title and a sentence,
           separated by a thin rule rather than boxed in a card. -->
      <ul class="values">
        <li v-for="v in profile.values" :key="v.title">
          <h3>{{ v.title }}</h3>
          <p>{{ v.text }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.values { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 clamp(32px, 6vw, 80px); }
.values li { display: grid; gap: 10px; align-content: start; padding: 26px 0 30px; border-top: 1px solid color-mix(in srgb, var(--ink) 14%, transparent); }
h3 { margin: 0; font-size: clamp(21px, 2.2vw, 25px); line-height: 1.15; letter-spacing: -0.02em; font-weight: 700; text-wrap: balance; }
p { margin: 0; color: var(--soft); font-size: 16px; line-height: 1.65; max-width: 48ch; text-wrap: pretty; }
@media (max-width: 720px) { .values { grid-template-columns: 1fr; } }
</style>
