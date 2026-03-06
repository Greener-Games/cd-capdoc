import { createRouter, createWebHistory } from 'vue-router';
import { useViewStore, useDataStore } from '../store';
import { ViewState } from '../types';

import HomeView from '../views/HomeView.vue';
import SelectionMenu from '../views/SelectionMenu.vue';
import ProjectSelection from '../views/ProjectSelection.vue';
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
    component: SelectionMenu,
    beforeEnter: () => {
      const viewStore = useViewStore();
      viewStore.setView(ViewState.SELECTOR);
    }
  },
  {
    path: '/timeline/:type/:id',
    name: 'Timeline',
    component: ProjectSelection,
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
    path: '/favourites',
    name: 'Favourites',
    component: ProjectSelection,
    beforeEnter: () => {
      const viewStore = useViewStore();
      viewStore.setView(ViewState.FAVOURITES);
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

  if (to.name === 'Timeline') {
    const type = to.params.type as any;
    const id = to.params.id as string;
    dataStore.setFilter(type, id);
  }

  if (to.name === 'Detail') {
    const id = to.params.id as string;
    const project = dataStore.flattenedAllProjects.find(p => p.id === id) || null;
    dataStore.setSelectedProject(project);
  }

  return true;
});

export default router;