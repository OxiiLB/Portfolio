<script setup lang="ts">
// Chamfered panel with a 1px edge. Pass `edge` (any CSS background) and `fill`.
withDefaults(defineProps<{ tag?: string; cut?: number; edge?: string; fill?: string }>(), {
  tag: "div",
  cut: 16,
});
</script>

<template>
  <component
    :is="tag"
    class="cut-edge"
    :style="{ '--c': `${cut}px`, ...(edge ? { '--edge': edge } : {}), ...(fill ? { '--fill': fill } : {}) }"
  >
    <div class="cut-inner"><slot /></div>
  </component>
</template>
