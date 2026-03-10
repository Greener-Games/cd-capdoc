import { createRouter, createWebHistory } from 'vue-router';
import { useDataStore } from '../store';

// Lazy load views for better bundle splitting
const HomeView = () => import('../views/HomeView.vue');
const CategorySelectionPage = () => import('../views/CategorySelectionPage.vue');
const ProjectPage = () => import('../views/ProjectPage.vue');
const DetailView = () => import('../views/DetailView.vue');
const CuratorPage = () => import('../views/CuratorPage.vue');
const AboutView = () => import('../views/AboutView.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
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
    name: 'ProjectList',
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
    path: '/curator/project/:projectId',
    name: 'CuratorExplore',
    component: DetailView
  },
  {
    path: '/curator/selection',
    name: 'Curated',
    component: ProjectPage
  },
  {
    path: '/curator/selection/:projectId',
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
  await dataStore.init();

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
