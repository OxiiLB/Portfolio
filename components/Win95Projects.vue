<script setup lang="ts">
import interact from "interactjs";
import { useActiveComponentStore } from "~/stores/activeComponent";
import { gql } from "nuxt-graphql-request/utils";

interface Repository {
  name: string;
  description: string;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
}

interface PinnedItemsData {
  user: {
    pinnedItems: {
      nodes: Repository[];
    };
  };
}

const { $graphql } = useNuxtApp();

const activeStore = useActiveComponentStore();

const defaultZIndex = 20;

const emit = defineEmits(["close"]);

const close = () => emit("close");

const windowRef = ref<HTMLElement | null>(null);

const zIndex = computed(() => {
  return activeStore.activeId === "projects" ? 40 : defaultZIndex;
});

const bringToFront = () => {
  activeStore.setActive("projects");
};

const query = gql`
  query {
    user(login: "OxiiLB") {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
          }
        }
      }
    }
  }
`;

const { data: pinnedItems } = await useAsyncData<PinnedItemsData>(
  "pinnedItems",
  async () => {
    const data: PinnedItemsData = await $graphql.default.request(query);
    return data;
  }
);
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
        <Icon name="tabler:pinned" class="w-6 h-6" />
        <h2 class="font-pixel text-sm neon-text">PROJECTS.EXE</h2>
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
      <div class="text-black font-pixel leading-relaxed">
        <ul class="grid grid-cols-2 gap-4">
          <li
            v-for="repo in pinnedItems?.user?.pinnedItems?.nodes || []"
            :key="repo.name"
            class="border p-4 rounded shadow-sm bg-secondary-300"
          >
            <a :href="repo.url" target="_blank" class="underline font-bold">
              {{ repo.name }}
            </a>
            <p class="mt-2 line-clamp-2">
              {{ repo.description || "No description available." }}
            </p>
            <p class="mt-2">
              ⭐ {{ repo.stargazerCount }} | Forks: {{ repo.forkCount }}
            </p>
            <p v-if="repo.primaryLanguage" class="mt-2">
              <span
                :style="{
                  color: repo.primaryLanguage.color,
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
                }"
              >
                {{ repo.primaryLanguage.name }}
              </span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
