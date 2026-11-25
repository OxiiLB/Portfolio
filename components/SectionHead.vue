<script setup lang="ts">
defineProps<{ title: string; sub?: string }>();
</script>

<template>
  <div class="sh">
    <div class="txt">
      <h2>{{ title }}</h2>
      <p v-if="sub">{{ sub }}</p>
    </div>
    <slot />
  </div>
</template>

<style scoped>
/* Title with its subtitle underneath, read as one block. Anything in the slot
   (the project filters) sits at the right, aligned to the last line. */
.sh { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px 32px; flex-wrap: wrap; margin-bottom: 32px; }
.txt { display: grid; gap: 14px; max-width: 60ch; }
h2 { margin: 0; font-size: clamp(32px, 4.4vw, 52px); font-weight: 750; letter-spacing: -0.035em; line-height: 1; text-wrap: balance; }
p { margin: 0; color: var(--soft); font-size: clamp(16px, 1.4vw, 18px); line-height: 1.5; text-wrap: pretty; }
</style>
