<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { useComponentStore } from "~/stores/componentStore";
import { useHead } from "#app";

// Définition des composants en lazy loading
const Win95Input = defineAsyncComponent(
  () => import("~/components/Win95Contact.vue")
);
const PdfViewer = defineAsyncComponent(
  () => import("~/components/PdfViewer.vue")
);
const Win95AboutMe = defineAsyncComponent(
  () => import("~/components/Win95AboutMe.vue")
);
const Win95Projects = defineAsyncComponent(
  () => import("~/components/Win95Projects.vue")
);

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
    <Win95Projects
      class="z-20"
      v-if="isComponentVisible('projects')"
      @close="componentStore.hideComponent('projects')"
    />
    <!-- Contenu principal de la page -->
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
