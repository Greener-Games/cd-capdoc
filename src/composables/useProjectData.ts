import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useDataStore } from '../store/data';
import { useCuratedStore } from '../store/curated';
import { useCategoryFilter } from './useCategoryFilter';
import { Project, CategoryItem, CategoryType } from '../types';

export function useProjectData() {
  const route = useRoute();
  const dataStore = useDataStore();
  const curatedStore = useCuratedStore();
  const { filterType } = useCategoryFilter();

  // Search state
  const searchQuery = ref('');

  const currentCategoryData = computed<CategoryItem | null>(() => {
    if (!route) return null;
    
    const catId = route.params.id as string;
    if (!catId) return null;
    
    let dataSet: CategoryItem[];

    if (filterType.value === CategoryType.CAPABILITY) {
      dataSet = dataStore.loadedCapabilities;
    } else if (filterType.value === CategoryType.MARKET) {
      dataSet = dataStore.loadedMarkets;
    } else {
      dataSet = dataStore.loadedRegions;
    }

    return dataSet.find(d => d.id === catId) || null;
  });

  const currentProjects = computed<Project[]>(() => {
    if (!route) return [];

    // Curated Mode
    if (route.name === 'Curated' || route.name === 'CuratedDetail') {
      return dataStore.loadedProjects.filter(p => curatedStore.curatedIds.includes(p.id));
    }

    // Explore Mode (Curator context)
    if (route.name === 'CuratorExplore') {
      return dataStore.loadedProjects;
    }

    // Category Mode (Project List or Detail under navigation)
    const currentCat = currentCategoryData.value;
    if (currentCat) {
      return currentCat.projectIds
        .map(id => dataStore.loadedProjects.find(p => p.id === id))
        .filter((p): p is Project => !!p);
    }

    // Fallback for contextless direct links
    if (dataStore.selectedProjectId) {
      const allCategories = [
        ...dataStore.loadedCapabilities,
        ...dataStore.loadedMarkets,
        ...dataStore.loadedRegions
      ];
      const foundCat = allCategories.find(cat => cat.projectIds.includes(dataStore.selectedProjectId!));
      if (foundCat) {
        return foundCat.projectIds
          .map(id => dataStore.loadedProjects.find(p => p.id === id))
          .filter((p): p is Project => !!p);
      }
    }

    return [];
  });

  // Filtering (Search) logic
  const filteredProjects = computed(() => {
    // For search, we usually want all projects if in library, otherwise current context
    const isLibrary = route?.name === 'Curator';
    const projectsToSearch = isLibrary ? dataStore.loadedProjects : currentProjects.value;
    
    if (!searchQuery.value.trim()) {
      return projectsToSearch;
    }
    const query = searchQuery.value.toLowerCase();
    return projectsToSearch.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query)
    );
  });

  const clearSearch = () => {
    searchQuery.value = '';
  };

  return {
    currentCategoryData,
    currentProjects,
    searchQuery,
    filteredProjects,
    clearSearch
  };
}
