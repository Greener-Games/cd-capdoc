import { defineStore } from 'pinia';
import { CategoryType, Project, CategoryItem, ViewState } from '../types';
import { CAPABILITY_DATA, MARKET_DATA, REGION_DATA, FLAT_PROJECTS } from '../constants';
import { fetchHygraphData } from '../services/hygraph';
import { useViewStore } from './view';
import { useCuratedStore } from './curated';

export const useDataStore = defineStore('data', {
  state: () => ({
    useLocalData: false,
    fetchedProjects: [] as Project[],
    fetchedMarkets: [] as CategoryItem[],
    fetchedRegions: [] as CategoryItem[],
    fetchedCapabilities: [] as CategoryItem[],

    // Loaded lists that components should read from
    loadedProjects: [] as Project[],
    loadedMarkets: [] as CategoryItem[],
    loadedRegions: [] as CategoryItem[],
    loadedCapabilities: [] as CategoryItem[],

    selectedProjectId: null as string | null,
    isFetchingData: false,
  }),
  getters: {
    selectedProject(state): Project | null {
      if (!state.selectedProjectId) return null;
      return state.loadedProjects.find(p => p.id === state.selectedProjectId) || null;
    },
    
    currentCategoryData(state): CategoryItem | null {
      const viewStore = useViewStore();
      if (!viewStore.activeCategoryId) return null;
      
      let dataSet: CategoryItem[];

      if (viewStore.filterType === CategoryType.CAPABILITY) {
        dataSet = state.loadedCapabilities;
      } else if (viewStore.filterType === CategoryType.MARKET) {
        dataSet = state.loadedMarkets;
      } else {
        dataSet = state.loadedRegions;
      }

      return dataSet.find(d => d.id === viewStore.activeCategoryId) || null;
    },

    currentProjects(state): Project[] {
      const viewStore = useViewStore();
      const curatedStore = useCuratedStore();

      if (viewStore.view === ViewState.CURATED) {
        return state.loadedProjects.filter(p => curatedStore.curatedIds.includes(p.id));
      }

      const currentCat = this.currentCategoryData;
      if (!currentCat) return [];

      return currentCat.projectIds
        .map(id => state.loadedProjects.find(p => p.id === id))
        .filter((p): p is Project => !!p);
    }
  },
  actions: {
    updateLoadedData() {
      if (this.useLocalData) {
        this.loadedCapabilities = CAPABILITY_DATA;
        this.loadedMarkets = MARKET_DATA;
        this.loadedRegions = REGION_DATA;
        this.loadedProjects = FLAT_PROJECTS;
      } else {
        this.loadedCapabilities = this.fetchedCapabilities;
        this.loadedMarkets = this.fetchedMarkets;
        this.loadedRegions = this.fetchedRegions;
        this.loadedProjects = this.fetchedProjects;
      }
    },
    
    setSelectedProject(project: Project | null) {
      this.selectedProjectId = project ? project.id : null;
    },

    setFilter(type: CategoryType, id: string) {
      const viewStore = useViewStore();
      viewStore.setFilter(type, id);
    },

    async fetchHygraphData() {
      if (this.isFetchingData) return;
      this.isFetchingData = true;
      try {
        const data = await fetchHygraphData();
        if (data) {
          this.fetchedProjects = data.projects;
          this.fetchedMarkets = data.markets;
          this.fetchedRegions = data.regions;
          this.fetchedCapabilities = data.capabilities;

          if (!this.useLocalData) {
            this.updateLoadedData();
          }
        }
      } finally {
        this.isFetchingData = false;
      }
    },

    async setUseLocalData(useLocal: boolean) {
      const viewStore = useViewStore();
      this.useLocalData = useLocal;
      if (!useLocal && this.fetchedProjects.length === 0) {
        await this.fetchHygraphData();
      }

      this.updateLoadedData();

      // Make sure activeCategoryId exists in the new dataset, otherwise reset it
      const currentData = this.currentCategoryData;
      if (currentData) {
         viewStore.activeCategoryId = currentData.id;
      } else {
         const dataSet = viewStore.filterType === CategoryType.CAPABILITY ? this.loadedCapabilities
            : viewStore.filterType === CategoryType.MARKET ? this.loadedMarkets
            : this.loadedRegions;

         const nextData = dataSet[0];
         if (nextData) {
            viewStore.activeCategoryId = nextData.id;
         }
      }
    },

    nextChapter() {
      if (!this.selectedProject) return;

      const projects = this.currentProjects;
      const currentIndex = projects.findIndex(p => p.id === this.selectedProject!.id);

      if (currentIndex !== -1 && currentIndex < projects.length - 1) {
        this.setSelectedProject(projects[currentIndex + 1]);
      }
    },

    prevChapter() {
      if (!this.selectedProject) return;

      const projects = this.currentProjects;
      const currentIndex = projects.findIndex(p => p.id === this.selectedProject!.id);

      if (currentIndex > 0) {
        this.setSelectedProject(projects[currentIndex - 1]);
      }
    },

    init() {
      this.updateLoadedData();
      if (!this.useLocalData) {
        this.fetchHygraphData();
      }
    }
  }
});
