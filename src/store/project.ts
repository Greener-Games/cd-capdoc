import { defineStore } from 'pinia';
import { Project, ViewState } from '../types';
import { useViewStore } from './view';
import { useFavoriteStore } from './favorites';

export const useProjectStore = defineStore('project', {
  state: () => ({
    selectedProjectId: null as string | null,
    searchQuery: '',
    // "Loaded" list of all projects, regardless of dev/remote origin
    allProjects: [] as Project[],
    // "Loaded" categories, populated when data swaps
    currentCategoryProjects: [] as Project[],
  }),
  getters: {
    selectedProject(state): Project | null {
      if (!state.selectedProjectId) return null;
      return state.allProjects.find(p => p.id === state.selectedProjectId) || null;
    },
    currentProjects(state): Project[] {
      const viewStore = useViewStore();
      const favoriteStore = useFavoriteStore();

      if (viewStore.view === ViewState.FAVOURITES) {
        return state.allProjects.filter(p => favoriteStore.favouriteIds.includes(p.id));
      }

      return state.currentCategoryProjects;
    },
    isLastChapter(): boolean {
      if (!this.selectedProject) return false;
      const projects = this.currentProjects;
      const index = projects.findIndex(p => p.id === this.selectedProject!.id);
      return index !== -1 && index === projects.length - 1;
    }
  },
  actions: {
    setSelectedProject(project: Project | null) {
      this.selectedProjectId = project ? project.id : null;
    },
    setSearchQuery(query: string) {
      this.searchQuery = query;
    },
    setLoadedData(allProjects: Project[], categoryProjects: Project[]) {
      this.allProjects = allProjects;
      this.currentCategoryProjects = categoryProjects;
    },
    nextChapter() {
      if (!this.selectedProject) return;

      const projects = this.currentProjects;
      const currentIndex = projects.findIndex(p => p.id === this.selectedProject!.id);

      if (currentIndex !== -1 && currentIndex < projects.length - 1) {
        this.setSelectedProject(projects[currentIndex + 1]);
      } else {
        const viewStore = useViewStore();
        if (viewStore.view === ViewState.CURATOR) {
          viewStore.setView(ViewState.CURATOR);
        } else {
          viewStore.setView(viewStore.view === ViewState.FAVOURITES ? ViewState.FAVOURITES : ViewState.TIMELINE);
        }
      }
    }
  }
});
