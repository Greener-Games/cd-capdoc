import { defineStore } from 'pinia';
import { ViewState, CategoryType, Project, CategoryItem } from '../types';
import { CAPABILITY_DATA, MARKET_DATA, REGION_DATA, ALL_PROJECTS } from '../constants';
import { fetchHygraphData } from '../services/hygraph';

const DEFAULT_ACCENT = '#1e293b';

export const useAppStore = defineStore('app', {
  state: () => ({
    view: ViewState.LANDING,
    prevView: ViewState.LANDING,
    filterType: CategoryType.CAPABILITY,
    activeCategoryId: 'brand',
    selectedProjectId: null as string | null,
    hoveredColor: DEFAULT_ACCENT,
    scrollProgress: 0,
    searchQuery: '',
    favouriteIds: [] as string[],
    curatedTitle: 'Curated Collection',
    useLocalData: true,
    fetchedProjects: [] as Project[],
    fetchedMarkets: [] as CategoryItem[],
    fetchedRegions: [] as CategoryItem[],
    fetchedCapabilities: [] as CategoryItem[],
    isFetchingData: false,
    hasFooterAnimated: false,
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
    currentProjects(state): Project[] {
      if (state.view === ViewState.FAVOURITES) {
        return this.flattenedAllProjects.filter(p => state.favouriteIds.includes(p.id));
      }
      return this.currentCategoryData.projects;
    },
    selectedProject(state): Project | null {
      if (!state.selectedProjectId) return null;
      return this.flattenedAllProjects.find(p => p.id === state.selectedProjectId) || null;
    },
    currentOrbColor(state): string {
      return state.view === ViewState.DETAIL
        ? (this.selectedProject?.accentColor || DEFAULT_ACCENT)
        : state.hoveredColor;
    },
    isLastChapter(state): boolean {
      if (!this.selectedProject) return false;
      const index = this.currentProjects.findIndex(p => p.id === this.selectedProject!.id);
      return index !== -1 && index === this.currentProjects.length - 1;
    }
  },
  actions: {
    setView(view: ViewState) {
      this.prevView = this.view;
      this.view = view;
    },
    setFilter(type: CategoryType, id: string) {
      this.filterType = type;
      this.activeCategoryId = id;
    },
    setSelectedProject(project: Project | null) {
      this.selectedProjectId = project ? project.id : null;
    },
    setHoveredColor(color: string | null) {
      this.hoveredColor = color || this.selectedProject?.accentColor || DEFAULT_ACCENT;
    },
    setScrollProgress(progress: number) {
      this.scrollProgress = progress;
    },
    toggleFavourite(id: string) {
      if (this.favouriteIds.includes(id)) {
        this.favouriteIds = this.favouriteIds.filter(fid => fid !== id);
      } else {
        this.favouriteIds.push(id);
      }
    },
    goHome() {
      this.setView(ViewState.LANDING);
      this.setSelectedProject(null);
      this.setHoveredColor(DEFAULT_ACCENT);
      this.searchQuery = '';
      this.scrollProgress = 0;
    },
    nextChapter() {
      if (!this.selectedProject) return;
      const currentIndex = this.currentProjects.findIndex(p => p.id === this.selectedProject!.id);
      if (currentIndex !== -1 && currentIndex < this.currentProjects.length - 1) {
        this.setSelectedProject(this.currentProjects[currentIndex + 1]);
      } else {
        this.backToTimeline();
      }
    },
    backToTimeline() {
      if (this.view === ViewState.DEVELOPER) {
        this.setView(ViewState.DEVELOPER);
      } else {
        this.setView(this.view === ViewState.FAVOURITES ? ViewState.FAVOURITES : ViewState.TIMELINE);
      }
    },
    backToSelector() {
      this.setView(ViewState.SELECTOR);
      this.searchQuery = '';
      this.scrollProgress = 0;
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
    setHasFooterAnimated(value: boolean) {
      this.hasFooterAnimated = value;
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