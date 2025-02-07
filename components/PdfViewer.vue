<script setup lang="ts">
import { ref, onMounted } from "vue";
import interact from "interactjs";
import { defineAsyncComponent } from "vue";
import { useActiveComponentStore } from "~/stores/activeComponent";

const activeStore = useActiveComponentStore();

const defaultZIndex = 20;


const emit = defineEmits(["close"]);
const close = () => emit("close");

const pdfUrl = "/Romain_Giraud_CV.pdf";

const windowRef = ref<HTMLElement | null>(null);

const zIndex = computed(() => {
  return activeStore.activeId === "cv" ? 40 : defaultZIndex;
});

const bringToFront = () => {
  activeStore.setActive("cv");
};

onMounted(() => {
  if (windowRef.value) {
    interact(windowRef.value).draggable({
      allowFrom: ".windows-title-bar",
      listeners: {
        move(event) {
          const target = event.target;
          const x =
            (parseFloat(target.getAttribute("data-x") || "0") || 0) + event.dx;
          const y =
            (parseFloat(target.getAttribute("data-y") || "0") || 0) + event.dy;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute("data-x", x.toString());
          target.setAttribute("data-y", y.toString());
        },
      },
    });
  }
});

const VuePdfEmbed = defineAsyncComponent(() => import("vue-pdf-embed"));
</script>

<template>
  <div>
    <div
      ref="windowRef"
      @mousedown="bringToFront"
      :style="{ zIndex: zIndex }"
      class="windows-95-window animate-popup shadow-lg fixed top-1/2 left-1/2 w-full max-w-[95vw] max-h-[90vh] p-2 transform -translate-x-1/2 -translate-y-1/2 sm:max-w-[800px]"
    >
      <div
        class="windows-title-bar bg-win-blue text-white px-2 py-1 flex justify-between items-center cursor-move select-none"
      >
        <div class="flex items-center gap-2">
          <Icon name="material-symbols-light:attach-file-rounded" class="w-6 h-6" />
          <h2 class="font-pixel text-sm neon-text">CV.EXE</h2>
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

      <div class="windows-content bg-vaporwave-bg p-4 overflow-auto">
        <ClientOnly>
          <VuePdfEmbed :source="pdfUrl" class="border shadow-md w-full" />
        </ClientOnly>
      </div>
      <div>
        <a
          href="/Romain_Giraud_CV.pdf"
          download="Romain_Giraud_CV.pdf"
          class="block text-center text-white bg-win-blue p-2 mt-2"
        >
          Download
        </a>
      </div>
    </div>
  </div>
</template>

