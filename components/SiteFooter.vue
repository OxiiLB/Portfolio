<script setup lang="ts">
const profile = useProfile();
const { t, locale } = useI18n();
const year = new Date().getFullYear();

// File names must match public/ exactly (servers are case-sensitive).
const cvHref = computed(() =>
  locale.value === "fr" ? "/CV_Romain_GIRAUD_Prospection.pdf" : "/CV_Romain_GIRAUD_Outreach_EN.pdf",
);
</script>

<template>
  <footer class="band-matcha wave-top">
    <div class="in">
      <div class="lbl"><i></i>output</div>
      <p class="big">
        <span class="tk c5">{{ t("footer.got") }}</span>&#32;<span class="tk c6">{{ t("footer.a") }}</span>&#32;<span class="tk c1">{{ t("footer.project") }}</span><span class="tk c2">?</span>
        {{ t("footer.talk") }}
      </p>
      <div class="ctas">
        <a class="btn primary" href="#links">{{ t("footer.contact") }}</a>
        <a class="btn ghost" href="#ask">{{ t("footer.askFirst") }}</a>
        <a class="btn ghost" :href="cvHref" target="_blank" rel="noopener">{{ t("footer.cv") }}</a>
      </div>
      <div class="row">
        <span>© {{ year }} {{ profile.name }} · {{ profile.role }} · {{ profile.location }}</span>
        <nav :aria-label="t('footer.profiles')">
          <a v-for="l in profile.links" :key="l.key" :href="l.url" target="_blank" rel="noopener">{{ l.label }}</a>
        </nav>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer { position: relative; overflow: hidden; padding-block: 88px 40px; }
.lbl { display: flex; align-items: center; gap: 10px; font-family: var(--f-mono); font-size: 12px; color: var(--soft); margin-bottom: 18px; }
.lbl i { width: 28px; height: 3px; background: var(--grad); }
.big { font-size: clamp(36px, 6.4vw, 80px); font-weight: 800; letter-spacing: -0.04em; line-height: 1.05; margin: 0; text-wrap: balance; }
.tk { padding: 0.02em 0.08em 0.12em; border-radius: 0.14em; color: var(--tok-ink); }
.row { display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap; margin-top: 56px; font-family: var(--f-mono); font-size: 12.5px; color: var(--faint); }
nav { display: flex; gap: 16px; flex-wrap: wrap; }
a { text-decoration: none; }
.row a:hover { color: var(--ink); }
</style>
