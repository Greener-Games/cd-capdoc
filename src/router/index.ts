import { createRouter, createWebHistory } from 'vue-router';
import { useAppStore } from '../store';
import { ViewState } from '../types';

import HomeView from '../views/HomeView.vue';
import SelectionMenu from '../views/SelectionMenu.vue';
import ProjectSelection from '../views/ProjectSelection.vue';
import DetailView from '../views/DetailView.vue';
import DeveloperPage from '../views/DeveloperPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    beforeEnter: () => {
      const store = useAppStore();
      store.setView(ViewState.LANDING);
    }
  },
  {
    path: '/select',
    name: 'Select',
    component: SelectionMenu,
    beforeEnter: () => {
      const store = useAppStore();
      store.setView(ViewState.SELECTOR);
    }
  },
  {
    path: '/timeline/:type/:id',
    name: 'Timeline',
    component: ProjectSelection,
    beforeEnter: () => {
      const store = useAppStore();
      store.setView(ViewState.TIMELINE);
    }
  },
  {
    path: '/project/:id',
    name: 'Detail',
    component: DetailView,
    beforeEnter: () => {
      const store = useAppStore();
      store.setView(ViewState.DETAIL);
    }
  },
  {
    path: '/developer',
    name: 'Developer',
    component: DeveloperPage,
    beforeEnter: () => {
      const store = useAppStore();
      store.setView(ViewState.DEVELOPER);
    }
  },
  {
    path: '/favourites',
    name: 'Favourites',
    component: ProjectSelection,
    beforeEnter: () => {
      const store = useAppStore();
      store.setView(ViewState.FAVOURITES);
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Update store selectedProject or filter based on route parameters
router.beforeEach((to, from) => {
  const store = useAppStore();

  if (to.name === 'Timeline') {
    const type = to.params.type as any;
    const id = to.params.id as string;
    store.setFilter(type, id);
  }

  if (to.name === 'Detail') {
    const id = to.params.id as string;
    const project = store.flattenedAllProjects.find(p => p.id === id) || null;
    store.setSelectedProject(project);
  }

  return true;
});

export default router;