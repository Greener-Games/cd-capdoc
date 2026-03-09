import { createRouter, createWebHistory } from 'vue-router';
import { useDataStore } from '../store';

import HomeView from '../views/HomeView.vue';
import CategorySelectionPage from '../views/CategorySelectionPage.vue';
import ProjectPage from '../views/ProjectPage.vue';
import DetailView from '../views/DetailView.vue';
import CuratorPage from '../views/CuratorPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/navigation',
    redirect: '/navigation/capabilities'
  },
  {
    path: '/navigation/:type',
    name: 'CategorySelect',
    component: CategorySelectionPage
  },
  {
    path: '/navigation/:type/:id',
    name: 'Timeline',
    component: ProjectPage
  },
  {
    path: '/navigation/:type/:id/:projectId',
    name: 'Detail',
    component: DetailView
  },
  {
    path: '/project/:projectId',
    name: 'ProjectDirect',
    component: DetailView
  },
  {
    path: '/curator',
    name: 'Curator',
    component: CuratorPage
  },
  {
    path: '/curator/present',
    name: 'Curated',
    component: ProjectPage
  },
  {
    path: '/curator/present/:projectId',
    name: 'CuratedDetail',
    component: DetailView
  },
  // Legacy Redirects
  { path: '/select', redirect: '/navigation/capabilities' },
  { path: '/timeline/:type/:id', redirect: (to: any) => `/navigation/${to.params.type.toLowerCase() === 'capability' ? 'capabilities' : to.params.type.toLowerCase() === 'market' ? 'markets' : 'regions'}/${to.params.id}` },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Update store selectedProject based on route parameters
router.beforeEach(async (to) => {
  const dataStore = useDataStore();

  // Ensure data is loaded
  if (dataStore.loadedProjects.length === 0) {
    await dataStore.init();
  }

  // Handle Project Selection from route params
  const projectId = to.params.projectId as string;
  if (projectId) {
    dataStore.setSelectedProject(projectId);
  } else {
    dataStore.setSelectedProject(null);
  }

  return true;
});

export default router;
