import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ViewState } from '../types';

export function useAppView() {
  const route = useRoute();
  
  const view = computed(() => {
    if (!route) return ViewState.LANDING;
    
    switch (route.name) {
      case 'Home': return ViewState.LANDING;
      case 'CategorySelect': return ViewState.SELECTOR;
      case 'Timeline': return ViewState.TIMELINE;
      case 'Curated': return ViewState.CURATED;
      case 'Detail':
      case 'CuratedDetail':
      case 'ProjectDirect': return ViewState.DETAIL;
      case 'Curator': return ViewState.CURATOR;
      default: return ViewState.LANDING;
    }
  });

  // Since we are route-driven, prevView is harder to track without a watcher, 
  // but most of our logic only needs to know if we are currently in a certain context.
  // We can use route names for that.

  return {
    view
  };
}
