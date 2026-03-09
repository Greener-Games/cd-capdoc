import { defineStore } from 'pinia';
import { CategoryType, Project, CategoryItem } from '../types';
import { CAPABILITY_DATA, MARKET_DATA, REGION_DATA, ALL_PROJECTS } from '../constants';
import { fetchHygraphData } from '../services/hygraph';
import { useProjectStore } from './project';
import { useViewStore } from './view';

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

    isFetchingData: false,
  }),
  getters: {
    currentCategoryData(state): CategoryItem {
      const viewStore = useViewStore();
      let dataSet: CategoryItem[];

      if (viewStore.filterType === CategoryType.CAPABILITY) {
        dataSet = state.loadedCapabilities;
      } else if (viewStore.filterType === CategoryType.MARKET) {
        dataSet = state.loadedMarkets;
      } else {
        dataSet = state.loadedRegions;
      }

      return dataSet.find(d => d.id === viewStore.activeCategoryId) || dataSet[0];
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
      const viewStore = useViewStore();
      viewStore.setFilter(type, id);
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
      this.pushToProjectStore();
    },
    init() {
      // populate the initial state explicitly using updateLoadedData
      this.updateLoadedData();

      // If we are using remote data by default, trigger the fetch
      if (!this.useLocalData) {
        this.fetchHygraphData();
      }
    }
  }
});
