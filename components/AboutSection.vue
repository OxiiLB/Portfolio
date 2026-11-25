<script setup lang="ts">
const profile = useProfile();
const { t } = useI18n();
</script>

<template>
  <section id="about" class="block">
    <div class="in">
      <SectionHead :title="t('about.title')" :sub="t('about.sub')" />
      <div class="grid">
        <div class="story">
          <p v-for="(p, i) in profile.about.paragraphs" :key="i" :class="{ first: i === 0 }">{{ p }}</p>
        </div>
        <CutPanel :cut="20" class="card">
          <div class="facts">
            <span class="label">{{ t("about.facts") }}</span>
            <dl>
              <div v-for="f in profile.about.facts" :key="f.label">
                <dt>{{ f.label }}</dt>
                <dd>{{ f.value }}</dd>
              </div>
            </dl>
            <span class="label">{{ t("about.skills") }}</span>
            <ul class="skills">
              <li v-for="s in profile.skills" :key="s.label" class="tag">{{ s.label }}</li>
            </ul>
          </div>
        </CutPanel>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(260px, 1fr); gap: clamp(28px, 5vw, 64px); align-items: start; }
.story { display: grid; gap: 18px; max-width: 62ch; }
.story p { margin: 0; color: var(--soft); font-size: 17px; line-height: 1.7; text-wrap: pretty; }
.story p.first { color: var(--ink); font-size: clamp(19px, 2vw, 22px); line-height: 1.5; font-weight: 450; }
/* Follow the reader only when the whole card fits on screen. */
@media (min-height: 940px) { .card { position: sticky; top: 90px; } }
.facts { padding: 24px; display: grid; gap: 14px; }
.label { font-size: 14px; font-weight: 650; color: var(--ink); }
dl { margin: 0 0 8px; display: grid; }
dl div { display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 12px; padding: 10px 0; border-top: 1px solid var(--line); }
dl div:first-child { border-top: 0; padding-top: 0; }
dt { font-size: 14px; color: var(--soft); }
dd { margin: 0; font-weight: 550; }
.skills { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
@media (max-width: 860px) {
  .grid { grid-template-columns: 1fr; }
  .card { position: static; }
}
</style>
