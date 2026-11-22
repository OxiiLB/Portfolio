<script setup lang="ts">
import type { Project } from "~/data/profile";

const profile = useProfile();
const { t } = useI18n();

const filters = [{ key: "all" }, { key: "rag" }, { key: "agent" }, { key: "vision" }, { key: "ml" }] as const;

const active = ref<(typeof filters)[number]["key"]>("all");
const usable = computed(() =>
  filters.filter((f) => f.key === "all" || profile.value.projects.some((p) => p.categories.includes(f.key))),
);
const shown = computed<Project[]>(() =>
  active.value === "all"
    ? profile.value.projects
    : profile.value.projects.filter((p) => p.categories.includes(active.value as Project["categories"][number])),
);
</script>

<template>
  <section id="projects" class="block">
    <div class="in">
      <SectionHead name="projects" :title="t('projects.title')">
        <div class="filters" role="group" :aria-label="t('projects.filter')">
          <button
            v-for="f in usable"
            :key="f.key"
            type="button"
            :aria-pressed="active === f.key"
            @click="active = f.key"
          >{{ t(`projects.${f.key}`) }}</button>
        </div>
      </SectionHead>
      <div class="projs">
        <CutPanel
          v-for="p in shown"
          :key="p.slug"
          :tag="p.url ? 'a' : 'article'"
          class="pj"
          v-bind="p.url ? { href: p.url, target: '_blank', rel: 'noopener' } : {}"
          :style="{ '--glow': `var(--t${p.tags[0]?.color ?? 1})` }"
        >
          <div class="body">
            <div class="tags">
              <span v-for="tag in p.tags" :key="tag.label" :class="`c${tag.color}`">{{ tag.label }}</span>
            </div>
            <h3>{{ p.title }}</h3>
            <p>{{ p.summary }}</p>
            <div v-if="p.result" class="res">
              <strong class="grad-text">{{ p.result.value }}</strong>
              <span>{{ p.result.label }}</span>
            </div>
            <div v-else-if="p.url" class="res"><span class="link">{{ t("projects.github") }}</span></div>
          </div>
        </CutPanel>
      </div>
    </div>
  </section>
</template>

<style scoped>
.filters { display: flex; gap: 2px; flex-wrap: wrap; background: rgba(238, 234, 246, 0.05); padding: 3px; }
.filters button { border: 0; background: none; padding: 6px 12px; font-family: var(--f-mono); font-size: 12.5px; color: var(--soft); }
.filters button:hover { color: var(--ink); }
.filters button[aria-pressed="true"] { background: var(--ink); color: var(--bg); }
.projs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.pj { text-decoration: none; display: block; }
.pj:hover { --edge: linear-gradient(135deg, var(--m3), var(--m2) 40%, rgba(238, 234, 246, 0.08) 75%); }
.body {
  height: 100%; padding: 24px 24px 22px; display: grid; gap: 14px; align-content: start;
  background: radial-gradient(28rem 14rem at 0% 0%, color-mix(in srgb, var(--glow) 13%, transparent), transparent 70%);
}
.tags { display: flex; gap: 6px; flex-wrap: wrap; }
.tags span { font-family: var(--f-mono); font-size: 11px; font-weight: 500; padding: 2px 7px; color: var(--tok-ink); }
h3 { margin: 0; font-size: clamp(22px, 2.4vw, 27px); line-height: 1.12; letter-spacing: -0.025em; font-weight: 700; text-wrap: balance; }
p { margin: 0; color: var(--soft); font-size: 15.5px; max-width: 46ch; }
.res { display: flex; align-items: baseline; gap: 12px; margin-top: 6px; }
.res strong { font-size: 40px; font-weight: 800; letter-spacing: -0.04em; line-height: 1; font-variant-numeric: tabular-nums; }
.res span { font-family: var(--f-mono); font-size: 12px; color: var(--soft); }
.res .link { color: var(--ink); }
@media (max-width: 720px) { .projs { grid-template-columns: 1fr; } }
</style>
