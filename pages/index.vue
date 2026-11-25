<script setup lang="ts">
const profile = useProfile();
const { t, locale } = useI18n();

useSeoMeta({
  title: () => t("meta.title"),
  description: () => t("meta.description"),
  ogTitle: () => t("meta.title"),
  ogDescription: () => profile.value.lede,
  ogImage: () => profile.value.photo.src,
});
</script>

<template>
  <main id="top">
    <section class="band-dark wave-bottom">
    <div class="in hero">
      <ProfilePhoto
        class="portrait"
        :src="profile.photo.src"
        :alt="profile.photo.alt"
        :width="profile.photo.width"
        :height="profile.photo.height"
      />
      <span v-if="profile.availability" class="avail"><i></i>{{ profile.availability }}</span>
      <TokenHeadline :key="locale" class="headline" :tokens="profile.headline" :focus="profile.headlineFocus" />
      <p class="lede">{{ profile.lede }}</p>
      <div class="ctas">
        <a class="btn primary" href="#links">{{ t("hero.hire") }}</a>
        <a class="btn ghost" href="#projects">{{ t("hero.work") }}</a>
      </div>
    </div>
    </section>
    <!-- Order: who I am, proof (projects, live assistant, side projects), what I
         offer, then how to hire me at the very end.
         Backgrounds: dark matcha hero, then classic and matcha-latte sections in
         turn, joined by waves. About needs no top wave: the hero's bottom wave
         already covers that edge. Values needs no bottom wave: the footer's top
         wave covers it. The footer (SiteFooter) is the full-screen green ending
         with all the contact links (#links). -->
    <AboutSection class="band-latte wave-bottom" />
    <ProjectGrid />
    <AskAssistant />
    <SideProjects class="band-latte wave-top wave-bottom" />
    <ServiceList />
    <ProcessSection />
    <ValuesSection class="band-latte wave-top" />
  </main>
</template>

<style scoped>
.hero {
  padding-block: 56px 72px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.72fr);
  grid-template-areas:
    "avail portrait"
    "headline portrait"
    "lede portrait"
    "ctas portrait";
  grid-template-rows: auto auto auto 1fr;
  column-gap: clamp(24px, 4vw, 56px);
}
.portrait { grid-area: portrait; align-self: center; width: 100%; max-width: 460px; justify-self: end; }
.avail { grid-area: avail; justify-self: start; }
.headline { grid-area: headline; }
.lede { grid-area: lede; }
.ctas { grid-area: ctas; align-self: start; }

.avail {
  display: inline-flex; align-items: center; gap: 8px; font-family: var(--f-mono); font-size: 12.5px; color: var(--soft);
  background: color-mix(in srgb, var(--ink) 5%, transparent); padding: 6px 12px 6px 10px; border-radius: 999px;
}
.avail i { width: 8px; height: 8px; border-radius: 50%; background: var(--ok); box-shadow: 0 0 0 3px color-mix(in srgb, var(--ok) 25%, transparent), 0 0 12px var(--ok); }
.lede { font-size: clamp(19px, 2.2vw, 24px); font-weight: 350; max-width: 40ch; margin: 30px 0 0; text-wrap: pretty; color: color-mix(in srgb, var(--ink) 86%, transparent); }

@media (max-width: 860px) {
  .hero {
    grid-template-columns: 124px minmax(0, 1fr);
    grid-template-areas:
      "portrait avail"
      "headline headline"
      "lede lede"
      "ctas ctas";
    grid-template-rows: auto;
    column-gap: 16px;
    padding-top: 40px;
  }
  .portrait { margin-top: 0; }
  .headline :deep(.wrap) { margin-top: 40px; }
  .avail { align-self: center; white-space: nowrap; font-size: 11.5px; }
}
</style>
