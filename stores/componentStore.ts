import { defineStore } from 'pinia';

export const useComponentStore = defineStore('componentStore', {
  state: () => ({
    activeComponents: {} as Record<string, boolean>
  }),
  actions: {
    toggleComponent(component: string) {
      this.activeComponents[component] = !this.activeComponents[component];
    },
    showComponent(component: string) {
      this.activeComponents[component] = true;
    },
    hideComponent(component: string) {
      this.activeComponents[component] = false;
    },
    resetComponents() {
      this.activeComponents = {};
    }
  }
});
