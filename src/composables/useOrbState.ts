import { ref, computed } from 'vue';
import { ViewState } from '../types';
import { useDataStore } from '../store/data';
import { useAppView } from './useAppView';

const DEFAULT_ACCENT = '#1e293b';
const hoveredColor = ref<string>(DEFAULT_ACCENT);

export function useOrbState() {
  const dataStore = useDataStore();
  const { view } = useAppView();

  const setHoveredColor = (color: string | null, fallback?: string) => {
    hoveredColor.value = color || fallback || DEFAULT_ACCENT;
  };

  const currentOrbColor = computed(() => {
    // If in Detail view, project accent color takes precedence
    if (view.value === ViewState.DETAIL && dataStore.selectedProject?.accentColor) {
      return dataStore.selectedProject.accentColor;
    }
    return hoveredColor.value;
  });

  return {
    hoveredColor,
    currentOrbColor,
    setHoveredColor,
    DEFAULT_ACCENT
  };
}
