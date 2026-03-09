import { defineStore } from 'pinia';

export const useCuratedStore = defineStore('curated', {
  state: () => ({
    curatedIds: [] as string[],
    curatedTitle: 'Curated Collection',
  }),
  actions: {
    toggleCurated(id: string) {
      if (this.curatedIds.includes(id)) {
        this.curatedIds = this.curatedIds.filter(fid => fid !== id);
      } else {
        this.curatedIds.push(id);
      }
    },
    resetCurator() {
      this.curatedIds = [];
      this.curatedTitle = 'Curated Collection';
    }
  }
});
