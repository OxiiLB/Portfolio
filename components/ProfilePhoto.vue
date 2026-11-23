<script setup lang="ts">
// Portrait in a rounded frame with a soft gradient edge.
defineProps<{ src: string; alt: string; width: number; height: number }>();
</script>

<template>
  <figure class="photo">
    <CutPanel :cut="22" edge="linear-gradient(150deg, color-mix(in srgb, var(--m2) 60%, transparent), color-mix(in srgb, var(--ink) 10%, transparent) 50%, color-mix(in srgb, var(--m3) 40%, transparent))">
      <div class="frame">
        <img :src="src" :alt="alt" :width="width" :height="height" fetchpriority="high" />
      </div>
    </CutPanel>
  </figure>
</template>

<style scoped>
.photo { margin: 0; }
.frame { position: relative; aspect-ratio: 579 / 600; max-width: 100%; overflow: hidden; }
.frame::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(180deg, transparent 65%, color-mix(in srgb, var(--m1) 35%, transparent));
}
img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
.photo:hover img { transform: scale(1.03); }
</style>
