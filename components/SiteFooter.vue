<script setup lang="ts">
const profile = useProfile();
const { t, locale } = useI18n();
const year = new Date().getFullYear();

// File names must match public/ exactly (servers are case-sensitive).
const cvHref = computed(() =>
  locale.value === "fr" ? "/CV_Romain_GIRAUD_Prospection.pdf" : "/CV_Romain_GIRAUD_Outreach_EN.pdf",
);

// Copy the email address; if the clipboard is blocked, select it instead.
const copied = ref<"copy" | "copied" | "selected">("copy");
const addr = ref<HTMLElement | null>(null);
let resetTimer: ReturnType<typeof setTimeout> | undefined;
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.value.email);
    copied.value = "copied";
  } catch {
    if (addr.value) {
      const range = document.createRange();
      range.selectNodeContents(addr.value);
      const sel = getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    copied.value = "selected";
  }
  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => (copied.value = "copy"), 1600);
}
</script>

<template>
  <!-- The end of the page: one full-screen dark green block, like the hero.
       Left: the call to action. Right: every way to hire or reach Romain
       (this is the "Hire me" target, #links). Bottom: the copyright line. -->
  <footer id="links" class="band-dark wave-top">
    <div class="in shell">
      <div class="main">
        <div class="pitch">
          <div class="lbl"><i></i>output</div>
          <p class="big">
            <span class="tk c5">{{ t("footer.got") }}</span>&#32;<span class="tk c6">{{ t("footer.a") }}</span>&#32;<span class="tk c1">{{ t("footer.project") }}</span><span class="tk c2">?</span>
            {{ t("footer.talk") }}
          </p>
          <p class="sub">{{ t("links.sub") }}</p>
          <div class="ctas">
            <a class="btn primary" href="#ask">{{ t("footer.askFirst") }}</a>
            <a class="btn ghost" :href="cvHref" target="_blank" rel="noopener">{{ t("footer.cv") }}</a>
          </div>
        </div>

        <div class="contact">
          <h2 class="contact-title">{{ t("nav.hire") }}</h2>
          <ul class="list">
            <li v-for="l in profile.links" :key="l.key">
              <a class="row" :href="l.url" target="_blank" rel="noopener">
                <span class="name"><b>{{ l.label }}</b><span>{{ l.description }}</span></span>
                <span class="go" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="16" height="16"><path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" /></svg>
                </span>
              </a>
            </li>
            <li>
              <div class="row mail">
                <span class="name">
                  <b><a :href="`mailto:${profile.email}`">{{ t("links.email") }}</a></b>
                  <span ref="addr" class="addr">{{ profile.email }}</span>
                </span>
                <button class="copy" :class="{ done: copied !== 'copy' }" type="button" @click="copyEmail">
                  <svg v-if="copied === 'copy'" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
                    <path d="M5.5 5.5V3h7.5v7.5h-2.5" /><path d="M3 5.5h7.5V13H3z" />
                  </svg>
                  <svg v-else viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M3 8.5 6.5 12 13 4.5" /></svg>
                  <span aria-live="polite">{{ t(`links.${copied}`) }}</span>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="bottom">
        <span>© {{ year }} {{ profile.name }} · {{ profile.role }} · {{ profile.location }}</span>
        <a href="#top">↑ {{ t("footer.top") }}</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Full screen: at least the height of the viewport, content centred
   vertically, the copyright line pinned to the bottom. */
footer {
  position: relative;
  min-height: 100vh; min-height: 100svh;
  display: flex;
  padding-block: clamp(72px, 10vh, 120px) 28px;
}
.shell { flex: 1; width: 100%; display: grid; grid-template-rows: 1fr auto; gap: 48px; }
.main {
  display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  gap: clamp(40px, 7vw, 112px); align-items: center;
}

.lbl { display: flex; align-items: center; gap: 10px; font-family: var(--f-mono); font-size: 12px; color: var(--soft); margin-bottom: 20px; }
.lbl i { width: 28px; height: 3px; background: var(--grad); }
.big { font-size: clamp(40px, 6.4vw, 88px); font-weight: 800; letter-spacing: -0.04em; line-height: 1.05; margin: 0; text-wrap: balance; }
.tk { padding: 0.02em 0.08em 0.12em; border-radius: 0.14em; color: var(--tok-ink); }
.sub { margin: 24px 0 0; font-size: clamp(17px, 1.6vw, 20px); color: var(--soft); max-width: 40ch; }
.ctas { margin-top: 32px; }

/* Contact list: a quiet panel of rows, one per platform, then the email. */
.contact {
  padding: 26px 24px 18px; border-radius: 20px;
  background: color-mix(in srgb, #000 14%, transparent);
  box-shadow: inset 0 0 0 1px var(--line);
}
.contact-title { margin: 0 0 8px; font-size: 22px; font-weight: 750; letter-spacing: -0.02em; }
.list { list-style: none; margin: 0; padding: 0; }
.list li + li { border-top: 1px solid var(--line); }
.row {
  display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 14px;
  padding: 12px 10px; margin-inline: -10px; border-radius: 12px; text-decoration: none;
  transition: background-color 0.2s;
}
a.row:hover { background: color-mix(in srgb, var(--ink) 8%, transparent); }
.name { display: grid; min-width: 0; }
.name b { font-size: 18px; font-weight: 650; letter-spacing: -0.01em; line-height: 1.25; }
.name b a { text-decoration: none; }
.name span { color: var(--soft); font-size: 14px; overflow-wrap: anywhere; }
.addr { font-family: var(--f-mono); font-size: 13px !important; }

.go, .copy {
  height: 38px; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  color: var(--ink); background: color-mix(in srgb, var(--ink) 10%, transparent);
  border-radius: 10px;
  transition: background-color 0.2s, color 0.2s, transform 160ms cubic-bezier(0.23, 1, 0.32, 1);
}
svg { fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; flex: none; }
.go { width: 38px; }
.go svg { transition: transform 0.25s cubic-bezier(0.3, 0.8, 0.3, 1); }
a.row:hover .go, a.row:focus-visible .go { background: var(--m2); color: var(--on-accent); }
a.row:focus-visible .go svg { transform: translate(2px, -2px); }
@media (hover: hover) and (pointer: fine) {
  a.row:hover .go svg { transform: translate(2px, -2px); }
}
.copy { border: 0; padding: 0 14px; font-family: var(--f-mono); font-size: 12px; font-weight: 600; min-width: 92px; }
.copy:hover { background: var(--m2); color: var(--on-accent); }
.copy:active { transform: scale(0.97); } /* press feedback */
.copy.done { background: var(--ok); color: var(--tok-ink); }
.copy.done svg { animation: tick 0.3s ease-out; }
@keyframes tick { from { transform: scale(0.4); opacity: 0; } }

.bottom {
  display: flex; justify-content: space-between; gap: 12px 24px; flex-wrap: wrap;
  padding-top: 20px; border-top: 1px solid var(--line);
  font-family: var(--f-mono); font-size: 12.5px; color: var(--soft);
}
.bottom a { text-decoration: none; }
.bottom a:hover { color: var(--ink); }

@media (max-width: 960px) {
  .main { grid-template-columns: 1fr; align-items: start; }
}
@media (max-width: 480px) {
  .contact { padding: 20px 16px 12px; }
  .copy { min-width: 0; padding: 0 11px; }
  .copy span { display: none; }
}
</style>
