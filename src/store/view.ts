import { defineStore } from 'pinia';
import { ViewState } from '../types';

const DEFAULT_ACCENT = '#1e293b';

export const useViewStore = defineStore('view', {
  state: () => ({
    view: ViewState.LANDING,
    prevView: ViewState.LANDING,
    hoveredColor: DEFAULT_ACCENT,
    scrollProgress: 0,
    hasFooterAnimated: false,
  }),
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
      this.setView(ViewState.LANDING);
      this.setHoveredColor(DEFAULT_ACCENT);
      this.scrollProgress = 0;
    },
    backToSelector() {
      this.setView(ViewState.SELECTOR);
      this.scrollProgress = 0;
    }
  }
});
