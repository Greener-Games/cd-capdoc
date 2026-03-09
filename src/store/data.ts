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

    // Loaded lists that components should read from
    loadedProjects: [] as Project[],
    loadedMarkets: [] as CategoryItem[],
    loadedRegions: [] as CategoryItem[],
    loadedCapabilities: [] as CategoryItem[],

    isFetchingData: false,
  }),
  getters: {
    currentCategoryData(state): CategoryItem {
      let dataSet: CategoryItem[];

      if (state.filterType === CategoryType.CAPABILITY) {
        dataSet = state.loadedCapabilities;
      } else if (state.filterType === CategoryType.MARKET) {
        dataSet = state.loadedMarkets;
      } else {
        dataSet = state.loadedRegions;
      }

      return dataSet.find(d => d.id === state.activeCategoryId) || dataSet[0];
    },
  },
  actions: {
    updateLoadedData() {
      if (this.useLocalData) {
        this.loadedCapabilities = CAPABILITY_DATA;
        this.loadedMarkets = MARKET_DATA;
        this.loadedRegions = REGION_DATA;

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
        this.loadedProjects = all;
      } else {
        this.loadedCapabilities = this.fetchedCapabilities;
        this.loadedMarkets = this.fetchedMarkets;
        this.loadedRegions = this.fetchedRegions;
        this.loadedProjects = this.fetchedProjects;
      }
    },
    pushToProjectStore() {
      const projectStore = useProjectStore();
      const currentCat = this.currentCategoryData;
      projectStore.setLoadedData(
        this.loadedProjects,
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

          if (!this.useLocalData) {
            this.updateLoadedData();
            this.pushToProjectStore();
          }
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

      this.updateLoadedData();

      // Make sure activeCategoryId exists in the new dataset, otherwise reset it
      const currentData = this.currentCategoryData;
      if (currentData) {
         this.activeCategoryId = currentData.id;
      } else {
         const dataSet = this.filterType === CategoryType.CAPABILITY ? this.loadedCapabilities
            : this.filterType === CategoryType.MARKET ? this.loadedMarkets
            : this.loadedRegions;

         const nextData = dataSet[0];
         if (nextData) {
            this.activeCategoryId = nextData.id;
         }
      }
      this.pushToProjectStore();
    },
    init() {
      // populate the initial state explicitly using updateLoadedData
      this.updateLoadedData();
    }
  }
});
