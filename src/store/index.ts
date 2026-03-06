import { defineStore } from 'pinia';
import { ViewState, Project } from '../types';
import { useViewStore } from './view';
import { useDataStore } from './data';
import { useFavoriteStore } from './favorites';

export const useAppStore = defineStore('app', {
  getters: {
    // Bridges to the new modular stores
    currentProjects(): Project[] {
      const viewStore = useViewStore();
      const dataStore = useDataStore();
      const favoriteStore = useFavoriteStore();

      if (viewStore.view === ViewState.FAVOURITES) {
        return dataStore.flattenedAllProjects.filter(p => favoriteStore.favouriteIds.includes(p.id));
      }
      return dataStore.currentCategoryData.projects;
    },
    currentOrbColor(): string {
      const viewStore = useViewStore();
      const dataStore = useDataStore();
      return viewStore.view === ViewState.DETAIL
        ? (dataStore.selectedProject?.accentColor || viewStore.hoveredColor)
        : viewStore.hoveredColor;
    },
    isLastChapter(): boolean {
      const dataStore = useDataStore();
      if (!dataStore.selectedProject) return false;
      const projects = this.currentProjects;
      const index = projects.findIndex(p => p.id === dataStore.selectedProject!.id);
      return index !== -1 && index === projects.length - 1;
    }
  },
  actions: {
    // Navigation bridge
    goHome() {
      const viewStore = useViewStore();
      const dataStore = useDataStore();
      viewStore.goHome();
      dataStore.setSelectedProject(null);
      dataStore.searchQuery = '';
    },
    nextChapter() {
      const dataStore = useDataStore();
      if (!dataStore.selectedProject) return;
      
      const projects = this.currentProjects;
      const currentIndex = projects.findIndex(p => p.id === dataStore.selectedProject!.id);
      
      if (currentIndex !== -1 && currentIndex < projects.length - 1) {
        dataStore.setSelectedProject(projects[currentIndex + 1]);
      } else {
        this.backToTimeline();
      }
    },
    backToTimeline() {
      const viewStore = useViewStore();
      if (viewStore.view === ViewState.CURATOR) {
        viewStore.setView(ViewState.CURATOR);
      } else {
        viewStore.setView(viewStore.view === ViewState.FAVOURITES ? ViewState.FAVOURITES : ViewState.TIMELINE);
      }
    }
  }
});

export * from './view';
export * from './data';
export * from './favorites';