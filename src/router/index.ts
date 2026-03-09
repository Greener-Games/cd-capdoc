import { createRouter, createWebHistory } from 'vue-router';
import { useViewStore, useDataStore, useProjectStore } from '../store';
import { ViewState } from '../types';

import HomeView from '../views/HomeView.vue';
import SelectionPage from '../views/SelectionPage.vue';
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
    component: SelectionPage,
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
    path: '/favourites',
    name: 'Favourites',
    component: ProjectPage,
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
  const projectStore = useProjectStore();

  if (to.name === 'Timeline') {
    const type = to.params.type as any;
    const id = to.params.id as string;
    dataStore.setFilter(type, id);
  }

  if (to.name === 'Detail') {
    const id = to.params.id as string;
    // ensure data is initialized before trying to find
    if (projectStore.allProjects.length === 0) {
      dataStore.init();
      dataStore.pushToProjectStore();
    }
    const project = projectStore.allProjects.find(p => p.id === id) || null;
    projectStore.setSelectedProject(project);
  }

  return true;
});

export default router;