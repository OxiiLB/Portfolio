<script setup lang="ts">
import { useComponentStore } from "~/stores/componentStore";
import { useActiveComponentStore } from "~/stores/activeComponent";

const showStartMenu = ref(false);

const toggleStartMenu = () => {
  showStartMenu.value = !showStartMenu.value;
};

const componentStore = useComponentStore();

const activeComponentStore = useActiveComponentStore();

const toggleComponent = (component: string) => {
  componentStore.toggleComponent(component);
  activeComponentStore.setActive(component);
  toggleStartMenu();
};

const currentTime = ref<string>("");

const updateCurrentTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  updateCurrentTime();
  const interval = setInterval(updateCurrentTime, 60000);
  onUnmounted(() => clearInterval(interval));
});
</script>

<template>
  <footer class="fixed bottom-0 left-0 w-full z-50 font-pixel">
    <div
      class="windows-95-bar inset-0 bg-win-blue flex justify-between items-center border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 px-2"
    >
      <button
        class="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1 border-2 border-t-gray-100 border-l-gray-100 border-b-gray-600 border-r-gray-600 active:border-reverse"
        @click="toggleStartMenu"
      >
        <img
          src="/Windows_Logo.png"
          alt="Microsoft Logo"
          class="w-4 h-4 sm:w-5 sm:h-5"
        />
        <span class="text-black font-bold text-sm sm:text-base">Start</span>
      </button>
      <div class="flex gap-1 sm:gap-3 text-neon-pink items-center">
        <span class="text-xl hidden sm:inline-block">💾</span>
        <p
          class="text-black text-xs sm:text-sm md:text-lg truncate max-w-[120px] sm:max-w-none"
        >
          © 1995-2025 PORTFOLIO_ROMAN.EXE v1.0.0
        </p>
      </div>
      <div class="flex items-center gap-1 sm:gap-2">
        <div
          class="border-2 border-t-gray-100 border-l-gray-100 border-b-gray-600 border-r-gray-600 bg-gray-300 px-1 active:border-reverse bg-win-blue text-neon-cyan hidden sm:flex"
        >
          <span class="relative top-px text-xs sm:text-sm">SYSTEM ACTIVE</span>
        </div>
        <div class="h-5 w-px bg-gray-400 mx-1 sm:mx-2"></div>
        <div
          class="border-2 border-t-gray-100 border-l-gray-100 border-b-gray-600 border-r-gray-600 bg-gray-300 px-1 active:border-reverse text-sm"
        >
          📶
        </div>
        <div data-allow-mismatch="text">{{ currentTime }}</div>
      </div>
    </div>
    <div
      v-if="showStartMenu"
      class="bg-secondary-500 w-48 sm:w-36 h-48 fixed bottom-14 sm:bottom-12 left-2 border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 shadow-lg"
    >
      <div class="p-2">
        <p class="text-xl font-bold mb-2">Programmes</p>
        <ul>
          <li>
            <button
              class="hover:bg-win-blue hover:text-white px-2 py-1 cursor-pointer text-sm sm:text-base"
              @click="toggleComponent('cv')"
            >
              CV.EXE
            </button>
          </li>
          <li>
            <button
              class="hover:bg-win-blue hover:text-white px-2 py-1 cursor-pointer text-sm sm:text-base"
              @click="toggleComponent('contact')"
            >
              CONTACT.EXE
            </button>
          </li>
          <li>
            <button
              class="hover:bg-win-blue hover:text-white px-2 py-1 cursor-pointer text-sm sm:text-base"
              @click="toggleComponent('about')"
            >
              ABOUT_ME.EXE
            </button>
          </li>
          <li
            class="hover:bg-win-blue hover:text-white px-2 py-1 cursor-pointer text-sm sm:text-base"
          >
            PROJECTS.EXE
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
