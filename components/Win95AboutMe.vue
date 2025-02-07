<script setup lang="ts">
import interact from "interactjs";
import { useActiveComponentStore } from "~/stores/activeComponent";

const activeStore = useActiveComponentStore();

const defaultZIndex = 20;

const emit = defineEmits(["close"]);

const close = () => emit("close");

const windowRef = ref<HTMLElement | null>(null);

const zIndex = computed(() => {
  return activeStore.activeId === "about" ? 40 : defaultZIndex;
});

const bringToFront = () => {
  activeStore.setActive("about");
};

onMounted(() => {
  if (windowRef.value) {
    interact(windowRef.value).draggable({
      allowFrom: ".windows-title-bar",
      listeners: {
        move(event) {
          const target = event.target;
          const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute("data-x", x.toString());
          target.setAttribute("data-y", y.toString());
        },
      },
    });
  }
});
</script>

<template>
  <div>
    <div
      ref="windowRef"
      @mousedown="bringToFront"
      :style="{ zIndex: zIndex }"
      class="windows-95-window animate-popup shadow-lg z-20 fixed top-1/2 left-1/2 w-full max-w-[95vw] max-h-[90vh] p-2 transform -translate-x-1/2 -translate-y-1/2 sm:max-w-[500px]"
    >
      <div
        class="windows-title-bar bg-win-blue text-white px-2 py-1 flex justify-between items-center cursor-move select-none"
      >
        <div class="flex items-center gap-2">
          <Icon name="ix:about" class="w-6 h-6" />
          <h2 class="font-pixel text-sm neon-text">ABOUT_ME.EXE</h2>
        </div>
        <div class="flex gap-1">
          <button
            class="w-6 h-6 flex items-center justify-center border-2 border-t-pink-300 border-l-pink-300 border-b-pink-600 border-r-pink-600 bg-pink-400 hover:bg-pink-500"
            @click="close"
          >
            ×
          </button>
        </div>
      </div>
      <div class="windows-content bg-vaporwave-bg p-4 overflow-y-auto">
        <div class="text-black font-pixel text-sm leading-relaxed">
          <p>
            Hi! My name is Romain Giraud. I am a Epitech student in 3rd year, but also a game and web developer
            passionate about creating interactive experiences. I appreciate
            unconventional designs and enjoy combining creativity with
            functionality to build engaging websites and applications.
          </p>
          <h3 class="mt-4 mb-2 text-lg font-pixel">Skills:</h3>
          <ul class="list-disc list-inside">
            <li>C &amp; C++</li>
            <li>Vue.js and Nuxt</li>
            <li>AI &amp; Machine Learning</li>
            <li>Game engine creation</li>
          </ul>
          <h3 class="mt-4 mb-2 text-lg font-pixel">Experience:</h3>
          <!-- list of professional exp -->
          <ul class="list-disc list-inside">
            <li>
              <strong>Full-stack Developer:</strong> Worked in BestConsultant
              and Eclipsa company as a full-stack developer. Developed web
              applications using Vue.js, Nuxt, and Node.js. Experienced in
              front-end and back-end development.
            </li>
            <li>
              <strong>AI Developer:</strong> Conducted research on AI and
              machine learning algorithms. Developed AI models for various
              applications, including image recognition and natural language
              processing.
            </li>
          </ul>
          <h3 class="mt-4 mb-2 text-lg font-pixel">Passions:</h3>
          <p>
            Besides coding, I have a deep love for video games, cooking, and
            animals.
          </p>
          <ul class="list-disc list-inside">
            <li>
              <strong>Video Games:</strong> I enjoy exploring different game
              genres, from retro classics to modern masterpieces. Game design
              and mechanics fascinate me, and I love analyzing how games create
              immersive experiences.
            </li>
            <li>
              <strong>Cooking:</strong> Experimenting with new recipes and
              flavors is one of my favorite pastimes. I love trying different
              cuisines and perfecting my own creations.
            </li>
            <li>
              <strong>Animals:</strong> I have a soft spot for animals and
              appreciate their unique personalities. Whether it's spending time
              with pets or learning about wildlife, I always find joy in the
              animal world.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
