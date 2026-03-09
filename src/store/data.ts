import { defineStore } from 'pinia';
import { CategoryType, Project, CategoryItem } from '../types';
import { CAPABILITY_DATA, MARKET_DATA, REGION_DATA, ALL_PROJECTS } from '../constants';
import { fetchHygraphData } from '../services/hygraph';
import { useProjectStore } from './project';

export const useDataStore = defineStore('data', {
  state: () => ({
    filterType: CategoryType.CAPABILITY,
    activeCategoryId: 'brand',
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
        dataSet = isLocal ? CAPABILITY_DATA : state.fetchedCapabilities;
      } else if (state.filterType === CategoryType.MARKET) {
        dataSet = isLocal ? MARKET_DATA : state.fetchedMarkets;
      } else {
        dataSet = isLocal ? REGION_DATA : state.fetchedRegions;
      }

      return dataSet.find(d => d.id === state.activeCategoryId) || dataSet[0];
    },
  },
  actions: {
    pushToProjectStore() {
      const projectStore = useProjectStore();
      const currentCat = this.currentCategoryData;
      projectStore.setLoadedData(
        this.flattenedAllProjects,
        currentCat ? currentCat.projects : []
      );
    },
    setFilter(type: CategoryType, id: string) {
      this.filterType = type;
      this.activeCategoryId = id;
      this.pushToProjectStore();
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
          this.pushToProjectStore();
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
      } else {
         const isLocalData = this.useLocalData;
         const dataSet = this.filterType === CategoryType.CAPABILITY
            ? (isLocalData ? CAPABILITY_DATA : this.fetchedCapabilities)
            : this.filterType === CategoryType.MARKET
               ? (isLocalData ? MARKET_DATA : this.fetchedMarkets)
               : (isLocalData ? REGION_DATA : this.fetchedRegions);

         const nextData = dataSet[0];
         if (nextData) {
            this.activeCategoryId = nextData.id;
         }
      }
      this.pushToProjectStore();
    }
  }
});
