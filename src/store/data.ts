import { defineStore } from 'pinia';
import { Project, CategoryItem } from '../types';
import { projectRepository } from '../repositories/projectRepository';

export const useDataStore = defineStore('data', {
  state: () => ({
    useLocalData: false,
    
    // Loaded lists that components should read from
    loadedProjects: [] as Project[],
    loadedMarkets: [] as CategoryItem[],
    loadedRegions: [] as CategoryItem[],
    loadedCapabilities: [] as CategoryItem[],
    aboutPage: null as AboutPage | null,

    selectedProjectId: null as string | null,
    isFetchingData: false,
    isPageLoading: false,
    fetchingPromise: null as Promise<any> | null,
  }),
  getters: {
    selectedProject(state): Project | null {
      if (!state.selectedProjectId) return null;
      return state.loadedProjects.find(p => p.id === state.selectedProjectId) || null;
    }
  },
  actions: {
    setSelectedProject(projectOrId: Project | string | null) {
      if (!projectOrId) {
        this.selectedProjectId = null;
      } else if (typeof projectOrId === 'string') {
        this.selectedProjectId = projectOrId;
      } else {
        this.selectedProjectId = projectOrId.id;
      }
    },

    async fetchAndLoadData() {
      if (this.fetchingPromise) return this.fetchingPromise;

      this.isFetchingData = true;
      this.fetchingPromise = (async () => {
        try {
          const data = await projectRepository.getData(this.useLocalData);
          this.loadedProjects = data.projects;
          this.loadedMarkets = data.markets;
          this.loadedRegions = data.regions;
          this.loadedCapabilities = data.capabilities;
          this.aboutPage = data.aboutPage;
          return data;
        } finally {
          this.isFetchingData = false;
          this.fetchingPromise = null;
        }
      })();

      return this.fetchingPromise;
    },

    async setUseLocalData(useLocal: boolean) {
      this.useLocalData = useLocal;
      await this.fetchAndLoadData();
    },

    async init() {
      if (this.loadedProjects.length === 0) {
        await this.fetchAndLoadData();
      }
    }
  }
});
