import { defineStore } from 'pinia';
import { CategoryType, Project, CategoryItem, ViewState } from '../types';
import { CAPABILITY_DATA, MARKET_DATA, REGION_DATA, FLAT_PROJECTS } from '../constants';
import { fetchHygraphData } from '../services/hygraph';
import { useCuratedStore } from './curated';
import { useCategoryFilter } from '../composables/useCategoryFilter';
import { useRoute } from 'vue-router';

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
    fetchingPromise: null as Promise<any> | null,
  }),
  getters: {
    selectedProject(state): Project | null {
      if (!state.selectedProjectId) return null;
      return state.loadedProjects.find(p => p.id === state.selectedProjectId) || null;
    },
    
    currentCategoryData(state): CategoryItem | null {
      const route = useRoute();
      const { filterType } = useCategoryFilter();
      
      const catId = route.params.id as string;
      if (!catId) return null;
      
      let dataSet: CategoryItem[];

      if (filterType.value === CategoryType.CAPABILITY) {
        dataSet = state.loadedCapabilities;
      } else if (filterType.value === CategoryType.MARKET) {
        dataSet = state.loadedMarkets;
      } else {
        dataSet = state.loadedRegions;
      }

      return dataSet.find(d => d.id === catId) || null;
    },

    currentProjects(state): Project[] {
      const curatedStore = useCuratedStore();
      const route = useRoute();

      if (!route) return [];

      // Check if we are in curated mode based on route name
      const isCuratedMode = route.name === 'Curated' || route.name === 'CuratedDetail';

      if (isCuratedMode) {
        return state.loadedProjects.filter(p => curatedStore.curatedIds.includes(p.id));
      }

      // If we have an active category from route
      const currentCat = this.currentCategoryData;
      if (currentCat) {
        return currentCat.projectIds
          .map(id => state.loadedProjects.find(p => p.id === id))
          .filter((p): p is Project => !!p);
      }

      // Fallback for contextless direct links: Find the first category this project belongs to
      if (state.selectedProjectId) {
        const allCategories = [...state.loadedCapabilities, ...state.loadedMarkets, ...state.loadedRegions];
        const foundCat = allCategories.find(cat => cat.projectIds.includes(state.selectedProjectId!));
        if (foundCat) {
          return foundCat.projectIds
            .map(id => state.loadedProjects.find(p => p.id === id))
            .filter((p): p is Project => !!p);
        }
      }

      return [];
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
    
    setSelectedProject(projectOrId: Project | string | null) {
      if (!projectOrId) {
        this.selectedProjectId = null;
      } else if (typeof projectOrId === 'string') {
        this.selectedProjectId = projectOrId;
      } else {
        this.selectedProjectId = projectOrId.id;
      }
    },

    async fetchHygraphData() {
      if (this.fetchingPromise) return this.fetchingPromise;

      this.isFetchingData = true;
      this.fetchingPromise = (async () => {
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
      if (!useLocal && this.fetchedProjects.length === 0) {
        await this.fetchHygraphData();
      }
      this.updateLoadedData();
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

    async init() {
      if (this.useLocalData) {
        this.updateLoadedData();
        return;
      }
      
      if (this.fetchedProjects.length === 0) {
        await this.fetchHygraphData();
      } else {
        this.updateLoadedData();
      }
    }
  }
});
