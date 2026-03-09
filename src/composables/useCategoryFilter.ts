import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { CategoryType } from '../types';

export function useCategoryFilter() {
  const route = useRoute();
  
  const filterType = computed(() => {
    const type = route.params.type as string;
    if (type === 'markets') return CategoryType.MARKET;
    if (type === 'regions') return CategoryType.REGION;
    return CategoryType.CAPABILITY; // default
  });

  return {
    filterType
  };
}
