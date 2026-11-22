<script setup lang="ts">
// Fixed background: a slowly drifting 2D "embedding map" (think UMAP plot),
// one labelled cluster per skill, colored with the token hues.
import { getProfile } from "~/data/profile";
const clusters = getProfile("en").latentClusters;

const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const el = canvas.value!;
  const ctx = el.getContext("2d")!;
  const css = getComputedStyle(document.documentElement);
  const hues = [1, 2, 3, 4, 5, 6].map((i) => css.getPropertyValue(`--t${i}`).trim());
  const labelColor = css.getPropertyValue("--faint").trim();
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Cluster centres as fractions of the viewport, kept off the main text column where possible.
  const centres = [
    [0.82, 0.2], [0.93, 0.55], [0.7, 0.82], [0.12, 0.88], [0.05, 0.42], [0.55, 0.12],
  ];

  interface Pt { cx: number; cy: number; dx: number; dy: number; r: number; a: number; hue: string; ph: number; sp: number }
  let pts: Pt[] = [];
  let w = 0, h = 0, dpr = 1;

  function rand(seed: number) {
    // Deterministic so the map looks the same on every visit.
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  }
  function gauss(seed: number) {
    return (rand(seed) + rand(seed + 1) + rand(seed + 2) - 1.5) / 1.5;
  }

  function setup() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    el.width = w * dpr;
    el.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const perCluster = w < 640 ? 14 : 30;
    const spread = Math.min(w, h) * (w < 640 ? 0.09 : 0.075);
    pts = [];
    centres.forEach(([fx, fy], c) => {
      for (let i = 0; i < perCluster; i++) {
        const s = c * 1000 + i * 7;
        pts.push({
          cx: fx * w, cy: fy * h,
          dx: gauss(s) * spread * 1.4, dy: gauss(s + 3) * spread,
          r: 0.8 + rand(s + 5) * 1.8,
          a: 0.18 + rand(s + 6) * 0.45,
          hue: hues[c % hues.length],
          ph: rand(s + 8) * Math.PI * 2,
          sp: 0.15 + rand(s + 9) * 0.35,
        });
      }
    });
  }

  function draw(t: number) {
    ctx.clearRect(0, 0, w, h);
    const sec = t / 1000;
    for (const p of pts) {
      const x = p.cx + p.dx + Math.sin(sec * p.sp + p.ph) * 6;
      const y = p.cy + p.dy + Math.cos(sec * p.sp * 0.8 + p.ph) * 5;
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.hue;
      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    // Cluster labels, like annotations on a projection plot.
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = labelColor;
    ctx.font = "11px 'JetBrains Mono', monospace";
    centres.forEach(([fx, fy], c) => {
      const label = clusters[c];
      if (label) ctx.fillText(`· ${label}`, fx * w + 14, fy * h - Math.min(w, h) * 0.09);
    });
    ctx.globalAlpha = 1;
  }

  let raf = 0;
  let last = 0;
  function loop(t: number) {
    raf = requestAnimationFrame(loop);
    if (t - last < 33) return; // ~30 fps is plenty for a slow drift
    last = t;
    draw(t);
  }

  setup();
  if (reduce) draw(0);
  else raf = requestAnimationFrame(loop);

  const onResize = () => { setup(); if (reduce) draw(0); };
  const onVisibility = () => {
    cancelAnimationFrame(raf);
    if (!document.hidden && !reduce) raf = requestAnimationFrame(loop);
  };
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisibility);
  onBeforeUnmount(() => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibility);
  });
});
</script>

<template>
  <canvas ref="canvas" class="field" aria-hidden="true"></canvas>
</template>

<style scoped>
.field { position: fixed; inset: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; }
</style>
