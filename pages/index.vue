<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { useComponentStore } from "~/stores/componentStore";
import { useActiveComponentStore } from "~/stores/activeComponent";
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

const activeComponentStore = useActiveComponentStore();

const isComponentVisible = (component: string) => {
  return componentStore.activeComponents[component] ?? false;
};

const toggleComponent = (component: string) => {
  componentStore.toggleComponent(component);
  activeComponentStore.setActive(component);
};

const desktopIcons = [
  {
    name: "CONTACT",
    component: "contact",
    icon: "material-symbols:mail-outline",
    position: { x: 20, y: 20 },
  },
  {
    name: "CV",
    component: "cv",
    icon: "material-symbols-light:attach-file-rounded",
    position: { x: 20, y: 100 },
  },
  {
    name: "ABOUT_ME",
    component: "about",
    icon: "ix:about",
    position: { x: 20, y: 180 },
  },
  {
    name: "PROJECTS",
    component: "projects",
    icon: "tabler:pinned",
    position: { x: 20, y: 260 },
  },
];
</script>

<template>
  <div
    class="bg-cover bg-center h-screen"
    style="background-image: url('/background.gif')"
  >
    <div
      v-for="(icon, index) in desktopIcons"
      :key="index"j
      class="absolute hidden md:flex flex-col items-center gap-1 w-20 cursor-pointer group select-none"
      :style="{ left: `${icon.position.x}px`, top: `${icon.position.y}px` }"
      @dblclick="toggleComponent(icon.component)"
    >
      <Icon
        :name="icon.icon"
        class="w-16 h-16 pixel-border bg-gray-300 transition-transform duration-500 ease-out scale-200 group-hover:scale-250 group-hover:bg-win-blue"
      />
      <span
        class="text-center text-white text-shadow-neon text-lg font-pixel px-1 bg-black/50"
      >
        {{ icon.name }}.EXE
      </span>
    </div>

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
