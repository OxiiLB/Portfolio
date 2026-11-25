<script setup lang="ts">
const profile = useProfile();
const { t, locale } = useI18n();
const year = new Date().getFullYear();

// File names must match public/ exactly (servers are case-sensitive).
const cvHref = computed(() =>
  locale.value === "fr" ? "/CV_Romain_GIRAUD_Prospection.pdf" : "/CV_Romain_GIRAUD_Outreach_EN.pdf",
);

const hireLinks = computed(() => profile.value.links.filter((l) => l.group === "hire"));
const profileLinks = computed(() => profile.value.links.filter((l) => l.group === "profile"));

/** Opens the visitor's mail app with a subject already filled in. */
const mailHref = computed(() => `mailto:${profile.value.email}?subject=${encodeURIComponent(t("footer.mailSubject"))}`);

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
          <p class="big">
            <span class="tk c5">{{ t("footer.got") }}</span>&#32;<span class="tk c6">{{ t("footer.a") }}</span>&#32;<span class="nobr"><span class="tk c1">{{ t("footer.project") }}</span><span class="tk c2">?</span></span>
            {{ t("footer.talk") }}
          </p>
          <p class="sub">{{ t("links.sub") }}</p>
          <!-- The main action starts the conversation; the assistant is a quieter
               option for visitors who are not ready to write yet. -->
          <div class="ctas">
            <a class="btn primary" :href="mailHref">{{ t("footer.emailMe") }}</a>
            <a class="btn ghost" :href="cvHref" target="_blank" rel="noopener">{{ t("footer.cv") }}</a>
          </div>
          <a class="askfirst" href="#ask">{{ t("footer.askFirst") }}</a>
        </div>

        <div class="contact">
          <h2 class="contact-title">{{ t("nav.hire") }}</h2>
          <!-- Ways to hire, email first (the only direct channel), then the platforms. -->
          <ul class="list">
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
            <li v-for="l in hireLinks" :key="l.key">
              <a class="row" :href="l.url" target="_blank" rel="noopener">
                <span class="name"><b>{{ l.label }}</b><span>{{ l.description }}</span></span>
                <span class="go" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="16" height="16"><path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" /></svg>
                </span>
              </a>
            </li>
          </ul>
          <!-- Places to check Romain's background, not to book him. -->
          <h3 class="group-title">{{ t("footer.profiles") }}</h3>
          <ul class="list">
            <li v-for="l in profileLinks" :key="l.key">
              <a class="row" :href="l.url" target="_blank" rel="noopener">
                <span class="name"><b>{{ l.label }}</b><span>{{ l.description }}</span></span>
                <span class="go" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="16" height="16"><path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" /></svg>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="bottom">
        <span>© {{ year }} {{ profile.name }}</span>
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

/* Line height leaves room under the token chips so "Let's talk." doesn't touch them. */
.big { font-size: clamp(40px, 6.4vw, 88px); font-weight: 800; letter-spacing: -0.04em; line-height: 1.3; margin: 0; text-wrap: balance; }
/* Each chip is its own box with a tight line height, so chips on two lines never touch. */
/* The last word and its "?" stay on the same line. */
.nobr { white-space: nowrap; }
.tk { display: inline-block; line-height: 1.05; padding: 0.02em 0.08em 0.12em; border-radius: 0.14em; color: var(--tok-ink); }
.sub { margin: 24px 0 0; font-size: clamp(17px, 1.6vw, 20px); color: var(--soft); max-width: 40ch; }
.ctas { margin-top: 32px; }
.askfirst { display: inline-block; margin-top: 18px; font-size: 15px; color: var(--soft); text-underline-offset: 3px; }
.askfirst:hover { color: var(--ink); }

/* Contact list: a quiet panel of rows, one per platform, then the email. */
.contact {
  padding: 26px 24px 18px; border-radius: 20px;
  background: color-mix(in srgb, #000 14%, transparent);
  box-shadow: inset 0 0 0 1px var(--line);
}
.contact-title { margin: 0 0 8px; font-size: 22px; font-weight: 750; letter-spacing: -0.02em; }
.list { list-style: none; margin: 0; padding: 0; }
.group-title { margin: 22px 0 4px; padding-top: 18px; border-top: 1px solid var(--line); font-size: 15px; font-weight: 650; color: var(--soft); }
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
.copy { border: 0; padding: 0 14px; font-size: 13px; font-weight: 600; min-width: 92px; }
.copy:hover { background: var(--m2); color: var(--on-accent); }
.copy:active { transform: scale(0.97); } /* press feedback */
.copy.done { background: var(--ok); color: var(--tok-ink); }
.copy.done svg { animation: tick 0.3s ease-out; }
@keyframes tick { from { transform: scale(0.4); opacity: 0; } }

.bottom {
  display: flex; justify-content: space-between; gap: 12px 24px; flex-wrap: wrap;
  padding-top: 20px; border-top: 1px solid var(--line);
  font-size: 14px; color: var(--soft);
}
.bottom a { text-decoration: none; }
.bottom a:hover { color: var(--ink); }

@media (max-width: 960px) {
  .main { grid-template-columns: 1fr; align-items: start; }
}
@media (max-width: 480px) {
  .contact { padding: 20px 16px 12px; }
  .copy { min-width: 0; padding: 0 12px; }
  /* The two buttons share the row evenly (and stack evenly if a label is long). */
  .ctas .btn { flex: 1 1 auto; justify-content: center; text-align: center; white-space: nowrap; }
}
</style>
