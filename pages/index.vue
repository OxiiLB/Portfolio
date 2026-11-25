<script setup lang="ts">
const profile = useProfile();
const { t, locale } = useI18n();
/** Headline shown as tokens (default) or as plain text; the switch sits under the buttons. */
const headlineView = ref<"tokens" | "plain">("tokens");

const { siteUrl } = useRuntimeConfig().public;
const localePath = useLocalePath();
/** Absolute when NUXT_PUBLIC_SITE_URL is set; crawlers ignore relative og:image and og:url. */
const abs = (path: string) => `${siteUrl}${path}`;
const pageUrl = computed(() => abs(localePath("/")));

useSeoMeta({
  title: () => t("meta.title"),
  description: () => t("meta.description"),
  ogType: "website",
  ogSiteName: () => profile.value.name,
  ogUrl: () => pageUrl.value,
  ogTitle: () => t("meta.title"),
  ogDescription: () => t("meta.description"),
  ogImage: () => abs(profile.value.photo.src),
  ogImageWidth: () => profile.value.photo.width,
  ogImageHeight: () => profile.value.photo.height,
  ogImageAlt: () => profile.value.photo.alt,
  twitterCard: "summary",
});

// Structured data (schema.org) built from the same profile data as the page,
// so search engines can tie this site to Romain's other profiles (sameAs).
useHead(() => {
  const p = profile.value;
  const person = {
    "@type": "Person",
    "@id": abs("/#person"),
    name: p.name,
    jobTitle: p.role,
    description: p.lede,
    image: abs(p.photo.src),
    url: pageUrl.value,
    address: { "@type": "PostalAddress", addressCountry: "FR" },
    knowsAbout: p.services.map((s) => s.title),
    sameAs: p.links.map((l) => l.url),
  };
  const site = {
    "@type": "WebSite",
    "@id": abs("/#website"),
    name: p.name,
    url: abs("/"),
    inLanguage: locale.value === "fr" ? "fr-FR" : "en-US",
    about: { "@id": person["@id"] },
  };
  return {
    script: [
      {
        key: "ld-json",
        type: "application/ld+json",
        innerHTML: JSON.stringify({ "@context": "https://schema.org", "@graph": [person, site] }),
      },
    ],
  };
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
      <TokenHeadline :key="locale" class="headline" :tokens="profile.headline" :focus="profile.headlineFocus" :view="headlineView" />
      <p class="lede">{{ profile.lede }}</p>
      <div class="ctas">
        <a class="btn primary" href="#links">{{ t("hero.hire") }}</a>
        <a class="btn ghost" href="#projects">{{ t("hero.work") }}</a>
      </div>
      <div class="tokmeta">
        <span>{{ t("hero.tokens", { n: profile.headline.length }) }}</span>
        <span class="switch" role="group" :aria-label="t('hero.view')">
          <button type="button" :aria-pressed="headlineView === 'tokens'" @click="headlineView = 'tokens'">{{ t("hero.viewTokens") }}</button>
          <button type="button" :aria-pressed="headlineView === 'plain'" @click="headlineView = 'plain'">{{ t("hero.viewPlain") }}</button>
        </span>
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
    "ctas portrait"
    "tokmeta portrait";
  grid-template-rows: auto auto auto auto 1fr;
  column-gap: clamp(24px, 4vw, 56px);
}
.portrait { grid-area: portrait; align-self: center; width: 100%; max-width: 460px; justify-self: end; }
.avail { grid-area: avail; justify-self: start; }
.headline { grid-area: headline; }
.lede { grid-area: lede; }
.ctas { grid-area: ctas; align-self: start; }
.tokmeta { grid-area: tokmeta; align-self: start; }

/* Token count and the tokens / plain switch: a quiet extra under the buttons. */
.tokmeta { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 28px; font-size: 13px; color: var(--soft); }
.tokmeta > span:first-child { font-family: var(--f-mono); }
.switch { display: inline-flex; background: color-mix(in srgb, var(--ink) 6%, transparent); border-radius: 8px; overflow: hidden; }
.switch button { border: 0; background: none; padding: 5px 10px; font-size: 13px; color: var(--soft); }
.switch button[aria-pressed="true"] { background: var(--ink); color: var(--bg); }
/* Press feedback */
.switch button { transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1); }
.switch button:active { transform: scale(0.97); }

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
      "ctas ctas"
      "tokmeta tokmeta";
    grid-template-rows: auto;
    column-gap: 16px;
    padding-top: 40px;
  }
  .portrait { margin-top: 0; }
  .headline :deep(.wrap) { margin-top: 40px; }
  .avail { align-self: center; white-space: nowrap; font-size: 11.5px; }
}
</style>
