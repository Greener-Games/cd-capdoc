import { defineStore } from 'pinia';
import { ViewState, CategoryType } from '../types';
import { useDataStore } from './data';

const DEFAULT_ACCENT = '#1e293b';

export const useViewStore = defineStore('view', {
  state: () => ({
    view: ViewState.LANDING,
    prevView: ViewState.LANDING,
    filterType: CategoryType.CAPABILITY,
    activeCategoryId: null as string | null,
    hoveredColor: DEFAULT_ACCENT,
    scrollProgress: 0,
    hasFooterAnimated: false,
  }),
  getters: {
    currentOrbColor(): string {
      const dataStore = useDataStore();
      return this.view === ViewState.DETAIL
        ? (dataStore.selectedProject?.accentColor || this.hoveredColor)
        : this.hoveredColor;
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
    setHoveredColor(color: string | null, fallback?: string) {
      this.hoveredColor = color || fallback || DEFAULT_ACCENT;
    },
    setScrollProgress(progress: number) {
      this.scrollProgress = progress;
    },
    setHasFooterAnimated(value: boolean) {
      this.hasFooterAnimated = value;
    },
    goHome() {
      const dataStore = useDataStore();
      this.setView(ViewState.LANDING);
      this.setHoveredColor(DEFAULT_ACCENT);
      this.scrollProgress = 0;
      this.activeCategoryId = null;
      dataStore.setSelectedProject(null);
    },
    backToSelector() {
      this.setView(ViewState.SELECTOR);
      this.scrollProgress = 0;
      this.activeCategoryId = null;
    }
  }
});
