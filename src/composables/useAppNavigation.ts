import { useRouter, useRoute } from 'vue-router';
import { ViewState } from '../types';
import { useAppView } from './useAppView';
import { useDataStore } from '../store/data';
import { useOrbState } from './useOrbState';
import { useScroll } from './useScroll';

export function useAppNavigation() {
  const router = useRouter();
  const route = useRoute();
  const { view } = useAppView();
  const dataStore = useDataStore();
  const { setHoveredColor, DEFAULT_ACCENT } = useOrbState();
  const { setScrollProgress } = useScroll();

  const isCuratedContext = () => {
    return route.name === 'CuratedDetail' || route.name === 'Curated';
  };

  const isExploreContext = () => {
    return route.name === 'CuratorExplore';
  };

  const goToCategorySelect = (type: string = 'capabilities') => {
    router.push(`/navigation/${type}`);
  };

  const goToProjectList = (type: string, catId: string) => {
    router.push(`/navigation/${type}/${catId}`);
  };

  const goToProject = (projectId: string, options?: { type?: string, catId?: string, isExplore?: boolean }) => {
    if (isCuratedContext()) {
      router.push({
        path: `/curator/selection/${projectId}`,
        query: route.query
      });
    } else if (options?.isExplore || route.name === 'CuratorExplore') {
      router.push(`/curator/project/${projectId}`);
    } else {
      const type = options?.type || (route.params.type as string);
      const catId = options?.catId || (route.params.id as string);

      if (type && catId) {
        router.push(`/navigation/${type}/${catId}/${projectId}`);
      } else {
        router.push(`/project/${projectId}`);
      }
    }
  };

  const goBack = () => {
    if (isCuratedContext()) {
      if (route.name === 'CuratedDetail') {
        router.push({
          path: '/curator/selection',
          query: route.query
        });
      } else {
        router.push({
          path: '/curator',
          query: {
            ...route.query,
            mode: 'build'
          }
        });
      }
    } else if (route.name === 'CuratorExplore') {
      router.push('/curator');
    } else if (view.value === ViewState.DETAIL) {
      const type = route.params.type as string;
      const catId = route.params.id as string;
      if (type && catId) {
        router.push(`/navigation/${type}/${catId}`);
      } else {
        router.push('/navigation/capabilities');
      }
    } else if (view.value === ViewState.PROJECT_LIST) {
      const type = route.params.type as string;
      router.push(`/navigation/${type}`);
    } else if (view.value === ViewState.SELECTOR) {
      router.push('/');
    } else if (view.value === ViewState.CURATOR || view.value === ViewState.ABOUT) {
      router.push('/navigation/capabilities');
    }
  };

  const goHome = () => {
    setHoveredColor(DEFAULT_ACCENT);
    setScrollProgress(0);
    dataStore.setSelectedProject(null);
    router.push('/');
  };

  const backToSelector = () => {
    setScrollProgress(0);
    const type = route.params.type as string || 'capabilities';
    router.push(`/navigation/${type}`);
  };

  const launchCuratedPresentation = (ids?: string[], title?: string) => {
    const query: any = {};
    if (ids && ids.length > 0) query.ids = ids.join(',');
    if (title) query.title = title;

    router.push({
      path: '/curator/selection',
      query
    });
  };

  return {
    isCuratedContext,
    isExploreContext,
    goToCategorySelect,
    goToProjectList,
    goToProject,
    goBack,
    goHome,
    backToSelector,
    launchCuratedPresentation
  };
}
