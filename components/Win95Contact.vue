<script setup lang="ts">
import interact from "interactjs";
import { useActiveComponentStore } from "~/stores/activeComponent";

const activeStore = useActiveComponentStore();

const myId = "component-" + Math.random().toString(36).substr(2, 9);

const defaultZIndex = 20;

const emit = defineEmits(["close"]);

const name = ref("");
const email = ref("");
const message = ref("");
const isSending = ref(false);

const close = () => emit("close");

const handleSubmit = async () => {
  isSending.value = true;
  try {
    await $fetch("/api/contact", {
      method: "POST",
      body: { name, email, message },
    });
    alert("Message envoyé!");
    close();
  } catch (error) {
    alert("Erreur d'envoi");
  } finally {
    isSending.value = false;
  }
};

const windowRef = ref<HTMLElement | null>(null);

const zIndex = computed(() => {
  return activeStore.activeId === myId ? 9999 : defaultZIndex;
});

const bringToFront = () => {
  activeStore.setActive(myId);
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
      class="windows-95-window animate-popup shadow-lg z-20 fixed top-1/2 left-1/2 w-full max-w-[95vw] max-h-[90vh] p-2 transform -translate-x-1/2 -translate-y-1/2 sm:max-w-[500px] sm:max-h-[600px]"
    >
      <div
        class="windows-title-bar bg-win-blue text-white px-2 py-1 flex justify-between items-center cursor-move select-none"
      >
        <div class="flex items-center gap-2">
          <span class="text-lg">✉️</span>
          <h2 class="font-pixel text-sm neon-text">CONTACT.EXE</h2>
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

      <div class="windows-content bg-vaporwave-bg p-4">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="form-group">
            <label class="block mb-1 font-pixel text-sm">Nom:</label>
            <input
              type="text"
              v-model="name"
              class="border-2 border-t-blue-600 border-l-blue-600 border-b-blue-300 border-r-blue-300 bg-pink-50 p-1 font-pixel text-black text-sm focus:outline-dotted w-full"
              required
            />
          </div>

          <div class="form-group">
            <label class="block mb-1 font-pixel text-sm">Email:</label>
            <input
              type="email"
              v-model="email"
              class="border-2 border-t-blue-600 border-l-blue-600 border-b-blue-300 border-r-blue-300 bg-pink-50 p-1 font-pixel text-black text-sm focus:outline-dotted w-full"
              required
            />
          </div>

          <div class="form-group">
            <label class="block mb-1 font-pixel text-sm">Message:</label>
            <textarea
              v-model="message"
              class="border-2 border-t-blue-600 border-l-blue-600 border-b-blue-300 border-r-blue-300 bg-pink-50 p-1 font-pixel text-black text-sm focus:outline-dotted w-full h-32 resize-none"
              required
            ></textarea>
          </div>

          <div class="flex justify-end gap-2">
            <button
              type="submit"
              class="flex items-center justify-center border-2 border-t-pink-300 border-l-pink-300 border-b-pink-600 border-r-pink-600 bg-pink-400 hover:bg-pink-500 bg-win-blue text-white px-4 py-1 relative active:top-px"
              :class="{ 'windows-button-pressed': isSending }"
            >
              <span class="neon-text">Envoyer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
