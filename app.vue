<script setup lang="ts">
// Sets <html lang>, hreflang alternates and og:locale for the current language.
const head = useLocaleHead();
useHead(() => ({
  htmlAttrs: { lang: head.value.htmlAttrs?.lang },
  link: [...(head.value.link ?? [])],
  meta: [...(head.value.meta ?? [])],
}));
</script>

<template>
  <LatentField />
  <SiteNav />
  <NuxtPage />
  <SiteFooter />
</template>
