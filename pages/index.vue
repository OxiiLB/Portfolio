<script setup lang="ts">
import Win95Input from "~/components/Win95Contact.vue";
import { useComponentStore } from "~/stores/componentStore";

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
    <Win95Input
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
    <div
      class="flex-grow h-screen flex flex-col items-center justify-center gap-6 text-center px-4"
    >
      <h1
        class="text-5xl sm:text-6xl font-extrabold text-font drop-shadow-secondary z-10"
      >
        Welcome to my portfolio
      </h1>
      <h2
        class="text-xl sm:text-2xl font-extrabold text-font drop-shadow-secondary z-10"
      >
        Romain Giraud - Game & Web Developer
      </h2>
    </div>
  </div>
</template>
