import { defineStore } from 'pinia';
import { CategoryType, Project, CategoryItem } from '../types';
import { CAPABILITY_DATA, MARKET_DATA, REGION_DATA, ALL_PROJECTS } from '../constants';
import { fetchHygraphData } from '../services/hygraph';

export const useDataStore = defineStore('data', {
  state: () => ({
    filterType: CategoryType.CAPABILITY,
    activeCategoryId: 'brand',
    selectedProjectId: null as string | null,
    searchQuery: '',
    useLocalData: true,
    fetchedProjects: [] as Project[],
    fetchedMarkets: [] as CategoryItem[],
    fetchedRegions: [] as CategoryItem[],
    fetchedCapabilities: [] as CategoryItem[],
    isFetchingData: false,
  }),
  getters: {
    flattenedAllProjects(state): Project[] {
      if (!state.useLocalData && state.fetchedProjects.length > 0) {
        return state.fetchedProjects;
      }
      const all: Project[] = [];
      const seen = new Set<string>();
      Object.values(ALL_PROJECTS).forEach(categoryProjects => {
        categoryProjects.forEach(p => {
          if (!seen.has(p.id)) {
            all.push(p);
            seen.add(p.id);
          }
        });
      });
      return all;
    },
    currentCategoryData(state): CategoryItem {
      const isLocal = state.useLocalData;
      let dataSet: CategoryItem[];

      if (state.filterType === CategoryType.CAPABILITY) {
        dataSet = isLocal || state.fetchedCapabilities.length === 0 ? CAPABILITY_DATA : state.fetchedCapabilities;
      } else if (state.filterType === CategoryType.MARKET) {
        dataSet = isLocal || state.fetchedMarkets.length === 0 ? MARKET_DATA : state.fetchedMarkets;
      } else {
        dataSet = isLocal || state.fetchedRegions.length === 0 ? REGION_DATA : state.fetchedRegions;
      }

      return dataSet.find(d => d.id === state.activeCategoryId) || dataSet[0];
    },
    selectedProject(state): Project | null {
      if (!state.selectedProjectId) return null;
      return this.flattenedAllProjects.find(p => p.id === state.selectedProjectId) || null;
    }
  },
  actions: {
    setFilter(type: CategoryType, id: string) {
      this.filterType = type;
      this.activeCategoryId = id;
    },
    setSelectedProject(project: Project | null) {
      this.selectedProjectId = project ? project.id : null;
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
        }
      } finally {
        this.isFetchingData = false;
      }
    },
    async setUseLocalData(useLocal: boolean) {
      this.useLocalData = useLocal;
      if (!useLocal && this.fetchedProjects.length === 0) {
        await this.fetchHygraphData();
      }

      // Make sure activeCategoryId exists in the new dataset, otherwise reset it
      const currentData = this.currentCategoryData;
      if (currentData) {
         this.activeCategoryId = currentData.id;
      }
    }
  }
});
