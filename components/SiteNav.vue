<script setup lang="ts">
const { t, locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
</script>

<template>
  <header class="nav">
    <div class="in bar">
      <a class="mark" href="#top" :aria-label="t('nav.home')">
        <span class="c1">rom</span><span class="c2">ain</span><span class="c3">.ai</span>
      </a>
      <nav :aria-label="t('nav.sections')">
        <a href="#links">{{ t("nav.links") }}</a>
        <a href="#ask">{{ t("nav.ask") }}</a>
        <a href="#projects">{{ t("nav.projects") }}</a>
        <a href="#services">{{ t("nav.services") }}</a>
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
  background: color-mix(in srgb, var(--bg) 62%, transparent);
  backdrop-filter: blur(14px) saturate(1.3);
}
.nav::after { content: ""; position: absolute; inset: auto 0 0; height: 1px; background: linear-gradient(90deg, transparent, var(--line) 20%, var(--line) 80%, transparent); }
.bar { display: flex; align-items: center; gap: 20px; height: 62px; }
.mark { display: flex; gap: 2px; font-weight: 700; font-size: 17px; text-decoration: none; letter-spacing: -0.01em; }
.mark span { padding: 1px 4px; border-radius: 4px; color: var(--tok-ink); }
nav { display: flex; gap: 24px; margin-left: auto; font-size: 15px; }
nav a { text-decoration: none; color: var(--soft); transition: color 0.15s; }
nav a:hover { color: var(--ink); }

/* EN / FR switch: a sliding magma knob behind the active language. */
.lang {
  position: relative; display: grid; grid-template-columns: 1fr 1fr;
  background: rgba(238, 234, 246, 0.06); padding: 3px;
  clip-path: polygon(7px 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%, 0 7px);
}
.lang a {
  position: relative; z-index: 1; min-width: 34px; padding: 5px 8px; text-align: center; text-decoration: none;
  font-family: var(--f-mono); font-size: 12px; font-weight: 600; color: var(--soft); transition: color 0.2s;
}
.lang a:hover { color: var(--ink); }
.lang a.on { color: #160A14; }
.knob {
  position: absolute; z-index: 0; top: 3px; bottom: 3px; left: 3px; width: calc(50% - 3px);
  background: var(--grad); transition: transform 0.25s cubic-bezier(0.3, 0.8, 0.3, 1);
}
.knob.right { transform: translateX(100%); }

.hire {
  font-family: var(--f-mono); font-size: 12.5px; font-weight: 600; text-decoration: none; color: var(--ink);
  background: rgba(238, 234, 246, 0.08); padding: 7px 12px; white-space: nowrap;
  clip-path: polygon(7px 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%, 0 7px);
}
.hire:hover { background: rgba(238, 234, 246, 0.14); }
@media (max-width: 720px) {
  nav { display: none; }
  .lang { margin-left: auto; }
}
</style>
