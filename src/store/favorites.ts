import { defineStore } from 'pinia';

export const useFavoriteStore = defineStore('favorites', {
  state: () => ({
    favouriteIds: [] as string[],
    curatedTitle: 'Curated Collection',
  }),
  actions: {
    toggleFavourite(id: string) {
      if (this.favouriteIds.includes(id)) {
        this.favouriteIds = this.favouriteIds.filter(fid => fid !== id);
      } else {
        this.favouriteIds.push(id);
      }
    },
    resetCurator() {
      this.favouriteIds = [];
      this.curatedTitle = 'Curated Collection';
    }
  }
});
