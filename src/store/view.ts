import { defineStore } from 'pinia';
import { ViewState } from '../types';
import { useProjectStore } from './project';

const DEFAULT_ACCENT = '#1e293b';

export const useViewStore = defineStore('view', {
  state: () => ({
    view: ViewState.LANDING,
    prevView: ViewState.LANDING,
    hoveredColor: DEFAULT_ACCENT,
    scrollProgress: 0,
    hasFooterAnimated: false,
  }),
  getters: {
    currentOrbColor(): string {
      const projectStore = useProjectStore();
      return this.view === ViewState.DETAIL
        ? (projectStore.selectedProject?.accentColor || this.hoveredColor)
        : this.hoveredColor;
    }
  },
  actions: {
    setView(view: ViewState) {
      this.prevView = this.view;
      this.view = view;
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
      const projectStore = useProjectStore();
      this.setView(ViewState.LANDING);
      this.setHoveredColor(DEFAULT_ACCENT);
      this.scrollProgress = 0;
      projectStore.setSelectedProject(null);
      projectStore.setSearchQuery('');
    },
    backToSelector() {
      this.setView(ViewState.SELECTOR);
      this.scrollProgress = 0;
    }
  }
});
