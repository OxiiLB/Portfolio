<script setup lang="ts">
import { useComponentStore } from "~/stores/componentStore";

const showStartMenu = ref(false);

const toggleStartMenu = () => {
  showStartMenu.value = !showStartMenu.value;
};

const componentStore = useComponentStore();

const toggleComponent = (component: string) => {
  componentStore.toggleComponent(component);
  toggleStartMenu();
};
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
        <span class="text-black font-bold text-sm sm:text-base">Démarrer</span>
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
        <div class="text-neon-cyan text-sm sm:text-base">
          {{ new Date().toLocaleTimeString() }}
        </div>
      </div>
    </div>
    <div
      v-if="showStartMenu"
      class="bg-secondary-500 w-48 sm:w-36 h-48 fixed bottom-14 sm:bottom-12 left-2 border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 shadow-lg"
    >
      <div class="p-2">
        <p class="text-xl font-bold mb-2">Programmes</p>
        <ul>
          <li
          >
          <button
            class="hover:bg-win-blue hover:text-white px-2 py-1 cursor-pointer text-sm sm:text-base"
            @click="toggleComponent('cv')"
          >
          CV.exe
          </button>
          </li>
          <li>
            <button
              class="hover:bg-win-blue hover:text-white px-2 py-1 cursor-pointer text-sm sm:text-base"
              @click="toggleComponent('contact')"
            >
              Contact.exe
            </button>
          </li>
          <li
            class="hover:bg-win-blue hover:text-white px-2 py-1 cursor-pointer text-sm sm:text-base"
          >
            About.exe
          </li>
          <li
            class="hover:bg-win-blue hover:text-white px-2 py-1 cursor-pointer text-sm sm:text-base"
          >
            Project.exe
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<style>
.font-pixel {
  font-family: "VT323", monospace;
}

.windows-95-bar {
  background: linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff);
  animation: gradientShift 10s infinite;
}

.text-shadow-neon {
  text-shadow: 0 0 5px #ff00ff, 0 0 10px #00ffff;
}

.text-neon-pink {
  color: #ff00ff;
  text-shadow: 0 0 8px #ff00ff;
}

.text-neon-cyan {
  color: #00ffff;
  text-shadow: 0 0 8px #00ffff;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
