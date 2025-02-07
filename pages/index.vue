<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { useComponentStore } from "~/stores/componentStore";
import { useHead } from "#app";

useHead(
  {
    title: "Home",
    meta: [
      {
        name: "description",
        content:
          "Romain Giraud - Game & Web Developer. Welcome to my portfolio.",
      },
    ],
  },
  { key: "head" }
);

const componentStore = useComponentStore();

const isComponentVisible = (component: string) => {
  return componentStore.activeComponents[component] ?? false;
};
</script>

<template>
  <div
    class="bg-cover bg-center h-screen"
    style="background-image: url('/background.gif')"
  >
    <Win95Contact
      class="z-20"
      v-if="isComponentVisible('contact')"
      @close="componentStore.hideComponent('contact')"
    />
    <PdfViewer
      class="z-20"
      v-if="isComponentVisible('cv')"
      @close="componentStore.hideComponent('cv')"
    />
    <Win95AboutMe
      class="z-20"
      v-if="isComponentVisible('about')"
      @close="componentStore.hideComponent('about')"
    />
    <Win95Projects
      class="z-20"
      v-if="isComponentVisible('projects')"
      @close="componentStore.hideComponent('projects')"
    />
    <div
      class="flex-grow h-screen flex flex-col items-center justify-center gap-6 text-center px-4"
    >
      <h1
        class="text-5xl sm:text-6xl font-extrabold text-font drop-shadow-secondary"
      >
        Welcome to my portfolio
      </h1>
      <h2
        class="text-xl sm:text-2xl font-extrabold text-font drop-shadow-secondary"
      >
        Romain Giraud - Game & Web Developer
      </h2>
    </div>
  </div>
</template>
