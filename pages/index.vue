<script setup lang="ts">

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
)

const buttons = ref([
  { label: "CONTACT", action: "contact" },
  { label: "ABOUT ME", action: "about" },
]);

const focusedIndex = ref(0);

const navigate = (direction: string) => {
  if (direction === "up") {
    focusedIndex.value =
      focusedIndex.value > 0
        ? focusedIndex.value - 1
        : buttons.value.length - 1;
  } else if (direction === "down") {
    focusedIndex.value =
      focusedIndex.value < buttons.value.length - 1
        ? focusedIndex.value + 1
        : 0;
  }
};

const selectButton = (index: number) => {
  const action = buttons.value[index].action;
  if (action === "contact") {
    navigateTo("/contact");
  } else if (action === "about") {
    console.log("Continuing game...");
  }
};

onMounted(() => {
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        navigate("up");
        break;
      case "ArrowDown":
        e.preventDefault();
        navigate("down");
        break;
      case "Enter":
        e.preventDefault();
        selectButton(focusedIndex.value);
        break;
    }
  });
});
</script>
<template>
  <div
    class="bg-cover bg-center h-screen"
    style="background-image: url('/background.gif')"
  >
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
      <div class="text-center">
        <div class="flex flex-col gap-4">
          <button
            v-for="(button, index) in buttons"
            :key="index"
            @click="selectButton(index)"
            @keydown.enter="selectButton(index)"
            :class="[
              'relative w-48 px-6 py-3 text-xl overflow-hidden',
              'border-2 rounded-lg font-bold font-retro transition-colors',
              focusedIndex === index
                ? 'border-electric-blue text-electric-blue'
                : 'border-primary-200 text-primary-200 hover:border-secondary-300',
            ]"
            role="button"
          >
            <div
              :class="[
                'absolute inset-0 bg-green-900/50',
                focusedIndex === index && 'animate-pulse',
              ]"
            ></div>
            <span class="relative z-10 block">
              {{ button.label }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
