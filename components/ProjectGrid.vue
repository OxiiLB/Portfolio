<script setup lang="ts">
import type { Project, ProjectCategory } from "~/data/profile";

const profile = useProfile();
const { t } = useI18n();

const filters: ("all" | ProjectCategory)[] = ["all", "rag", "automation", "vision", "web", "games"];

const active = ref<"all" | ProjectCategory>("all");
// Only show filters that match at least one project.
const usable = computed(() =>
  filters.filter((f) => f === "all" || profile.value.projects.some((p) => p.categories.includes(f))),
);
const shown = computed<Project[]>(() =>
  active.value === "all"
    ? profile.value.projects
    : profile.value.projects.filter((p) => p.categories.includes(active.value as ProjectCategory)),
);
</script>

<template>
  <section id="projects" class="block">
    <div class="in">
      <SectionHead :title="t('projects.title')">
        <div class="filters" role="group" :aria-label="t('projects.filter')">
          <button
            v-for="f in usable"
            :key="f"
            type="button"
            :aria-pressed="active === f"
            @click="active = f"
          >{{ t(`projects.${f}`) }}</button>
        </div>
      </SectionHead>
      <div class="projs">
        <CutPanel
          v-for="p in shown"
          :key="p.slug"
          :tag="p.url ? 'a' : 'article'"
          class="pj"
          v-bind="p.url ? { href: p.url, target: '_blank', rel: 'noopener' } : {}"
        >
          <div class="card">
          <!-- TODO(Romain): placeholder image, see `image` in data/profile.ts. -->
          <img
            class="shot"
            :src="p.image"
            :alt="t('projects.preview', { title: p.title })"
            width="1200"
            height="750"
            loading="lazy"
            decoding="async"
          />
          <div class="body">
            <div class="tags">
              <span v-for="tag in p.tags" :key="tag.label" class="tag">{{ tag.label }}</span>
            </div>
            <div class="ctx">{{ p.context }}</div>
            <h3>{{ p.title }}</h3>
            <p>{{ p.summary }}</p>
            <div v-if="p.result" class="res">
              <strong class="grad-text">{{ p.result.value }}</strong>
              <span>{{ p.result.label }}</span>
            </div>
            <div v-else-if="p.url" class="res"><span class="link">{{ t("projects.github") }}</span></div>
          </div>
          </div>
        </CutPanel>
      </div>
    </div>
  </section>
</template>

<style scoped>
.filters { display: flex; gap: 2px; flex-wrap: wrap; background: color-mix(in srgb, var(--ink) 5%, transparent); padding: 3px; border-radius: 999px; }
.filters button { border: 0; border-radius: 999px; background: none; padding: 6px 12px; font-size: 14px; font-weight: 500; color: var(--soft); }
.filters button:hover { color: var(--ink); }
.filters button[aria-pressed="true"] { background: var(--ink); color: var(--bg); }
/* Press feedback */
.filters button { transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1); }
.filters button:active { transform: scale(0.97); }
.projs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
/* With an odd number of cards, the first one spans the full width so no card sits alone. */
.projs > :first-child:nth-last-child(odd) { grid-column: 1 / -1; }
.pj { text-decoration: none; display: block; }
.pj:hover { --edge: linear-gradient(135deg, color-mix(in srgb, var(--m2) 70%, transparent), color-mix(in srgb, var(--ink) 10%, transparent) 70%); }
/* Each card: the preview on top, the text below. */
.card { height: 100%; display: grid; grid-template-rows: auto 1fr; }
.shot {
  display: block; width: 100%; height: auto; aspect-ratio: 16 / 10; object-fit: cover;
  background: var(--surface-2); border-bottom: 1px solid var(--line);
}
.body { padding: 22px 24px 24px; display: grid; gap: 14px; align-content: start; }
/* The full-width first card puts its preview beside the text, so its right half is never empty. */
.projs > :first-child:nth-last-child(odd) .card { grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); grid-template-rows: auto; }
.projs > :first-child:nth-last-child(odd) .shot { order: 2; height: 100%; aspect-ratio: auto; min-height: 300px; border-bottom: 0; border-left: 1px solid var(--line); }
.projs > :first-child:nth-last-child(odd) .body { align-content: center; padding: 32px; }
.tags { display: flex; gap: 6px; flex-wrap: wrap; }
.ctx { font-size: 13.5px; color: var(--soft); margin-bottom: -6px; }
h3 { margin: 0; font-size: clamp(22px, 2.4vw, 27px); line-height: 1.12; letter-spacing: -0.025em; font-weight: 700; text-wrap: balance; }
p { margin: 0; color: var(--soft); font-size: 15.5px; max-width: 46ch; }
.res { display: flex; align-items: baseline; gap: 12px; margin-top: 6px; }
.res strong { font-size: 40px; font-weight: 800; letter-spacing: -0.04em; line-height: 1; font-variant-numeric: tabular-nums; }
.res span { font-size: 14px; color: var(--soft); }
.res .link { color: var(--ink); }
@media (max-width: 720px) {
  .projs { grid-template-columns: 1fr; }
  .projs > :first-child:nth-last-child(odd) .card { grid-template-columns: 1fr; }
  .projs > :first-child:nth-last-child(odd) .shot { order: 0; height: auto; aspect-ratio: 16 / 10; min-height: 0; border-left: 0; border-bottom: 1px solid var(--line); }
  .projs > :first-child:nth-last-child(odd) .body { padding: 22px 24px 24px; }
}
</style>
