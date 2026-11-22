<script setup lang="ts">
// Sections read like layers of a forward pass: L1 find_me → L2 ask → …
defineProps<{ layer: string; name: string; title: string; sub?: string }>();
</script>

<template>
  <div class="sh">
    <div class="lbl"><i></i>{{ layer }} · {{ name }}</div>
    <div class="row">
      <h2>{{ title }}</h2>
      <p v-if="sub">{{ sub }}</p>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.sh { display: grid; gap: 12px; margin-bottom: 28px; }
.lbl { display: flex; align-items: center; gap: 10px; font-family: var(--f-mono); font-size: 12px; letter-spacing: 0.04em; color: var(--soft); }
.lbl i { width: 28px; height: 3px; background: var(--grad); }
.row { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px 32px; flex-wrap: wrap; }
h2 { margin: 0; font-size: clamp(32px, 4.4vw, 52px); font-weight: 750; letter-spacing: -0.035em; line-height: 1; text-wrap: balance; }
p { margin: 0; color: var(--soft); max-width: 44ch; }
</style>
