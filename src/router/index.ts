import { createRouter, createWebHistory } from 'vue-router';
import { useViewStore, useDataStore } from '../store';
import { ViewState } from '../types';

import HomeView from '../views/HomeView.vue';
import CategorySelectionPage from '../views/CategorySelectionPage.vue';
import ProjectPage from '../views/ProjectPage.vue';
import DetailView from '../views/DetailView.vue';
import CuratorPage from '../views/CuratorPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    beforeEnter: () => {
      const viewStore = useViewStore();
      viewStore.setView(ViewState.LANDING);
    }
  },
  {
    path: '/select',
    name: 'Select',
    component: CategorySelectionPage,
    beforeEnter: () => {
      const viewStore = useViewStore();
      viewStore.setView(ViewState.SELECTOR);
    }
  },
  {
    path: '/timeline/:type/:id',
    name: 'Timeline',
    component: ProjectPage,
    beforeEnter: () => {
      const viewStore = useViewStore();
      viewStore.setView(ViewState.TIMELINE);
    }
  },
  {
    path: '/project/:id',
    name: 'Detail',
    component: DetailView,
    beforeEnter: () => {
      const viewStore = useViewStore();
      viewStore.setView(ViewState.DETAIL);
    }
  },
  {
    path: '/curator',
    name: 'Curator',
    component: CuratorPage,
    beforeEnter: () => {
      const viewStore = useViewStore();
      viewStore.setView(ViewState.CURATOR);
    }
  },
  {
    path: '/curated',
    name: 'Curated',
    component: ProjectPage,
    beforeEnter: () => {
      const viewStore = useViewStore();
      viewStore.setView(ViewState.CURATED);
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Update store selectedProject or filter based on route parameters
router.beforeEach((to, from) => {
  const dataStore = useDataStore();
  const viewStore = useViewStore();

  if (to.name === 'Timeline') {
    const type = to.params.type as any;
    const id = to.params.id as string;
    dataStore.setFilter(type, id);
  } else if (to.name !== 'Detail') {
    // If we're not on timeline or detail, we should clear the active category
    // Detail view handles its own project selection, but we keep the category if we're coming from timeline
    if (to.name !== 'Detail') {
      viewStore.activeCategoryId = null;
    }
  }

  if (to.name === 'Detail') {
    const id = to.params.id as string;
    // ensure data is initialized before trying to find
    if (dataStore.loadedProjects.length === 0) {
      dataStore.init();
    }
    const project = dataStore.loadedProjects.find(p => p.id === id) || null;
    dataStore.setSelectedProject(project);
  } else {
    // Clear project selection if not on detail view
    dataStore.setSelectedProject(null);
  }

  return true;
});

export default router;