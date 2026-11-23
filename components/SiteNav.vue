<script setup lang="ts">
const { t, locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

// At the top of the page the bar blends into the dark matcha hero; once you scroll
// it switches to the light, blurred bar.
const atTop = ref(true);
function onScroll() {
  atTop.value = window.scrollY < 24;
}
onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));
</script>

<template>
  <header class="nav" :class="{ 'band-dark': atTop, top: atTop }">
    <div class="in bar">
      <a class="mark" href="#top" :aria-label="t('nav.home')">
        <span class="c1">giraud</span><span class="c2">labs</span><span class="c3">.com</span>
      </a>
      <nav :aria-label="t('nav.sections')">
        <a href="#about">{{ t("nav.about") }}</a>
        <a href="#projects">{{ t("nav.projects") }}</a>
        <a href="#side-projects">{{ t("nav.side") }}</a>
        <a href="#services">{{ t("nav.services") }}</a>
        <a href="#values">{{ t("nav.values") }}</a>
        <a href="#ask">{{ t("nav.ask") }}</a>
      </nav>
      <div class="lang" role="group" :aria-label="t('nav.language')">
        <NuxtLink
          v-for="l in locales"
          :key="l.code"
          :to="switchLocalePath(l.code)"
          :lang="l.language"
          :hreflang="l.language"
          :title="l.name"
          :aria-current="l.code === locale ? 'true' : undefined"
          :class="{ on: l.code === locale }"
        >{{ l.code.toUpperCase() }}</NuxtLink>
        <i class="knob" :class="{ right: locale === 'fr' }" aria-hidden="true"></i>
      </div>
      <a class="hire" href="#links">{{ t("nav.hire") }}</a>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: env(safe-area-inset-top, 0px);
  z-index: 8;
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(14px) saturate(1.3);
  transition: background-color 0.3s ease;
}
.nav.top { background: var(--band-dark); backdrop-filter: none; }
.nav.top::after { opacity: 0; }
.nav::after { content: ""; position: absolute; inset: auto 0 0; height: 1px; background: linear-gradient(90deg, transparent, var(--line) 20%, var(--line) 80%, transparent); }
.bar { display: flex; align-items: center; gap: 20px; height: 62px; }
.mark { display: flex; gap: 2px; font-weight: 700; font-size: 17px; text-decoration: none; letter-spacing: -0.01em; }
.mark span { padding: 1px 4px; border-radius: 4px; color: var(--tok-ink); }
nav { display: flex; gap: 22px; margin-left: auto; font-size: 15px; }
nav a { text-decoration: none; color: var(--soft); transition: color 0.15s; white-space: nowrap; }
nav a:hover { color: var(--ink); }

/* EN / FR switch: a sliding knob behind the active language. */
.lang {
  position: relative; display: grid; grid-template-columns: 1fr 1fr;
  background: color-mix(in srgb, var(--ink) 6%, transparent); padding: 3px;
  border-radius: 999px;
}
.lang a {
  position: relative; z-index: 1; min-width: 34px; padding: 5px 8px; text-align: center; text-decoration: none;
  font-family: var(--f-mono); font-size: 12px; font-weight: 600; color: var(--soft); transition: color 0.2s;
}
.lang a:hover { color: var(--ink); }
.lang a.on { color: var(--on-accent); }
.knob {
  position: absolute; z-index: 0; top: 3px; bottom: 3px; left: 3px; width: calc(50% - 3px);
  border-radius: 999px; background: var(--grad); transition: transform 0.25s cubic-bezier(0.3, 0.8, 0.3, 1);
}
.knob.right { transform: translateX(100%); }

.hire {
  font-family: var(--f-mono); font-size: 12.5px; font-weight: 600; text-decoration: none; color: var(--ink);
  background: color-mix(in srgb, var(--ink) 8%, transparent); padding: 7px 12px; white-space: nowrap;
  border-radius: 999px;
}
.hire:hover { background: color-mix(in srgb, var(--ink) 14%, transparent); }
/* Six section links need room: below this width, keep only the language switch and "Hire me". */
@media (max-width: 1080px) {
  nav { display: none; }
  .lang { margin-left: auto; }
}
</style>
