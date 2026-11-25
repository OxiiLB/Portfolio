<script setup lang="ts">
const profile = useProfile();
const { t, locale } = useI18n();

/** US dollar price without cents: "$350" in English, "350 $US" in French. */
const money = (n: number) =>
  new Intl.NumberFormat(locale.value === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

// One tab per service; the document assistant (first) is open by default.
const active = ref(0);
const offer = computed(() => profile.value.offers[active.value]!);
const tabs = ref<HTMLButtonElement[]>([]);

/** Arrow keys, Home and End move between tabs (WAI-ARIA tabs pattern). */
function onTabKey(e: KeyboardEvent) {
  const n = profile.value.offers.length;
  // Move from the tab that has focus (usually the open one).
  const focused = tabs.value.indexOf(e.target as HTMLButtonElement);
  const from = focused >= 0 ? focused : active.value;
  const next =
    e.key === "ArrowRight" ? (from + 1) % n
    : e.key === "ArrowLeft" ? (from - 1 + n) % n
    : e.key === "Home" ? 0
    : e.key === "End" ? n - 1
    : -1;
  if (next < 0) return;
  e.preventDefault();
  active.value = next;
  tabs.value[next]?.focus();
}
</script>

<template>
  <section id="services" class="block">
    <div class="in">
      <SectionHead
        :title="t('services.title')"
        :sub="t('services.sub')"
      />

      <!-- Pricing: one tab per service, each with three fixed packages
           (good / better / best). The Standard package is recommended and
           raised in the brand green; features a package lacks stay visible
           but muted, so each upgrade shows what it adds. Data: `offers` and
           `extras` in data/profile.ts. -->
      <div class="tabs" role="tablist" :aria-label="t('services.offers')" @keydown="onTabKey">
        <button
          v-for="(o, i) in profile.offers"
          :id="`offer-tab-${o.key}`"
          :key="o.key"
          ref="tabs"
          type="button"
          role="tab"
          :aria-selected="i === active"
          :aria-controls="`offer-panel-${o.key}`"
          :tabindex="i === active ? 0 : -1"
          @click="active = i"
        >{{ o.title }}</button>
      </div>

      <div
        :id="`offer-panel-${offer.key}`"
        class="panel"
        role="tabpanel"
        :aria-labelledby="`offer-tab-${offer.key}`"
      >
        <p class="intro">{{ offer.summary }}</p>
        <div class="tiers">
          <CutPanel
            v-for="p in offer.tiers"
            :key="`${offer.key}-${p.tier}`"
            :cut="20"
            class="tier"
            :class="{ rec: p.recommended }"
            :edge="p.recommended ? 'var(--band-dark)' : undefined"
            :fill="p.recommended ? 'var(--band-dark)' : undefined"
          >
            <article class="card" :class="{ 'band-dark': p.recommended }">
              <div class="top">
                <span class="tier-name">{{ p.tier }}</span>
                <span v-if="p.recommended" class="badge">{{ t("services.recommended") }}</span>
              </div>
              <h3>{{ p.name }}</h3>
              <p class="price">{{ money(p.price) }}</p>
              <p class="sum">{{ p.summary }}</p>
              <div class="terms">
                <span>
                  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="6" /><path d="M8 4.8V8l2.2 1.6" /></svg>
                  {{ t("services.delivery", { n: p.deliveryDays }) }}
                </span>
                <span>
                  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M13 6.5A5 5 0 0 0 3.6 5M3 9.5A5 5 0 0 0 12.4 11" /><path d="M3.4 2.6v2.6H6M12.6 13.4v-2.6H10" /></svg>
                  {{ t("services.revisions", p.revisions) }}
                </span>
              </div>
              <ul class="feats">
                <li v-for="f in p.features" :key="f.label" :class="{ off: !f.included }">
                  <svg v-if="f.included" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8.5 6.5 12 13 4.5" /></svg>
                  <svg v-else viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4.5 8h7" /></svg>
                  <span>{{ f.label }}<span v-if="!f.included" class="sr-only"> ({{ t("services.notIncluded") }})</span></span>
                </li>
              </ul>
              <a class="btn" :class="p.recommended ? 'primary' : 'ghost'" href="#links">{{ t("nav.hire") }}</a>
            </article>
          </CutPanel>
        </div>
        <p class="extras">
          <strong>{{ t("services.extras") }}</strong>
          <span>{{ t("services.extraExpress", { p: profile.extras.expressPercent }) }}</span>
          <span>{{ t("services.extraRevision", { price: money(profile.extras.revision) }) }}</span>
          <span>{{ t("services.extraMaintenance", { price: money(profile.extras.maintenancePerMonth) }) }}</span>
          <span v-if="offer.docsExtra">{{ t("services.extraDocs", { n: profile.extras.docs.count, price: money(profile.extras.docs.price) }) }}</span>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rates { margin: -8px 0 24px; font-size: 15.5px; color: var(--soft); }

/* Service tabs: a row of four, the open one underlined in the brand green. */
.tabs {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
  border-bottom: 1px solid var(--line); margin-bottom: 24px;
}
.tabs button {
  border: 0; background: none; padding: 14px 12px 12px; margin-bottom: -1px;
  font-size: 16px; font-weight: 600; color: var(--soft); text-align: center;
  border-bottom: 3px solid transparent; transition: color 0.15s, border-color 0.15s;
}
.tabs button:hover { color: var(--ink); }
.tabs button[aria-selected="true"] { color: var(--ink); border-bottom-color: var(--m2); }

.intro { margin: 0 0 22px; color: var(--soft); font-size: 16px; max-width: 60ch; }

/* Three packages side by side; the recommended one is raised. */
.tiers { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; align-items: stretch; padding-top: 14px; }
.tier.rec { transform: translateY(-14px); box-shadow: 0 22px 40px -24px color-mix(in srgb, var(--band-dark) 70%, transparent); }
.tier:not(.rec):hover { --edge: var(--m3); }
.card { height: 100%; display: flex; flex-direction: column; gap: 14px; padding: 28px 26px 26px; }
.top { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 26px; }
.tier-name { font-size: 14px; font-weight: 600; color: var(--soft); }
.badge {
  font-size: 12.5px; font-weight: 700; padding: 4px 10px; border-radius: 999px;
  background: var(--m2); color: var(--on-accent);
}
h3 { margin: 0; font-size: 22px; line-height: 1.15; letter-spacing: -0.02em; font-weight: 700; }
.price { margin: 0; font-size: clamp(40px, 4.4vw, 52px); font-weight: 800; letter-spacing: -0.04em; line-height: 1; font-variant-numeric: tabular-nums; }
.sum { margin: 0; color: var(--soft); font-size: 15px; line-height: 1.55; }
/* Delivery time and revisions: what you get for the price, at a glance. */
.terms {
  display: flex; flex-wrap: wrap; gap: 8px 18px; padding: 12px 0;
  border-block: 1px solid var(--line); font-size: 14px; font-weight: 600;
}
.terms span { display: inline-flex; align-items: center; gap: 7px; }
svg { flex: none; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.terms svg { color: var(--soft); }
.feats { margin: 2px 0 6px; padding: 0; list-style: none; display: grid; gap: 9px; font-size: 15px; line-height: 1.4; }
.feats li { display: flex; gap: 10px; align-items: flex-start; }
.feats li svg { margin-top: 2px; color: var(--m2); stroke-width: 2.2; }
/* Not included: still listed, but muted, so the upgrade path is visible. */
.feats li.off { color: var(--soft); }
.feats li.off svg { color: var(--soft); }
.btn { margin-top: auto; justify-content: center; }

/* Paid extras, under the packages. */
.extras {
  display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 20px;
  margin: 28px 0 0; font-size: 14.5px; color: var(--soft);
}
.extras strong { color: var(--ink); }

/* Desktop: keep the rows of the three packages aligned. */
@media (min-width: 961px) {
  .sum { min-height: 6.2em; }
}
@media (max-width: 960px) {
  .tiers { grid-template-columns: minmax(0, 520px); justify-content: center; gap: 22px; padding-top: 0; }
  .tier.rec { transform: none; }
}
@media (max-width: 720px) {
  .tabs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .tabs button { font-size: 15px; padding: 12px 8px 10px; }
}
</style>
