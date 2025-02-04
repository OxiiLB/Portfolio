import { defineStore } from 'pinia';

export const useActiveComponentStore = defineStore('activeComponent', {
  state: () => ({
    activeId: '',
  }),
  actions: {
    setActive(id: string) {
      this.activeId = id;
      console.log('activeId', this.activeId);
    }
  }
});
