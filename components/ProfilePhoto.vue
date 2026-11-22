<script setup lang="ts">
// Portrait in a cut-corner frame with a magma edge.
defineProps<{ src: string; alt: string; width: number; height: number }>();
</script>

<template>
  <figure class="photo">
    <CutPanel :cut="28" edge="linear-gradient(150deg, var(--m3), var(--m2) 35%, rgba(238,234,246,.1) 70%, var(--m1))">
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
