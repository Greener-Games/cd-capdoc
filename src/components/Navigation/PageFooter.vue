<template>
  <div 
    :class="[
      'z-10 pointer-events-none text-footer flex justify-between items-center px-safe-side',
      inline ? 'w-full py-8 mt-12' : 'absolute layout-footer h-(--footer-height)'
    ]"
  >
    <!-- Dynamic part (Left) -->
    <div class="flex-1 text-left">
      <Transition name="fade-delayed" mode="out-in">
        <div
            v-if="view !== ViewState.LANDING && !inline"
            class="fill-mode-both"
            :key="`${footerProps.count}-${footerProps.label}`"
        >
          {{ footerProps.count }} {{ footerProps.label }}
        </div>
      </Transition>
    </div>

    <!-- Center Tagline -->
    <div class="shrink-0 text-center">
      <Transition name="fade-delayed">
        <div v-if="view !== ViewState.LANDING && !inline">
          COMPLEX → CLARITY
        </div>
      </Transition>
    </div>

    <!-- Right Copyright -->
    <div class="flex-1 text-right">
      <Transition name="fade-delayed" appear>
        <div
            class="normal-case fill-mode-both"
            :class="[inline ? 'opacity-60' : '']"
        >
          © 2026 Creative Design. Proud to be part of AtkinsRéalis Group Inc
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useFooterState } from '../../composables/useFooterState';
import { useDataStore } from '../../store/data';
import { useAppView } from '../../composables/useAppView';
import { useProjectData } from '../../composables/useProjectData';
import { useCategoryFilter } from '../../composables/useCategoryFilter';
import { ViewState, CategoryType } from '../../types';

const props = withDefaults(defineProps<{
  inline?: boolean;
}>(), {
  inline: false
});

const dataStore = useDataStore();
const { view } = useAppView();
const { currentProjects } = useProjectData();
const { filterType } = useCategoryFilter();
const { hasFooterAnimated, setHasFooterAnimated } = useFooterState();

const footerProps = computed(() => {
  if (view.value === ViewState.LANDING) {
    return { count: dataStore.loadedProjects.length, label: 'PROJECTS' };
  }
  if (view.value === ViewState.SELECTOR) {
    if (filterType.value === CategoryType.CAPABILITY) {
      return { count: dataStore.loadedCapabilities.length, label: 'CAPABILITIES' };
    } else if (filterType.value === CategoryType.MARKET) {
      return { count: dataStore.loadedMarkets.length, label: 'MARKETS' };
    } else {
      return { count: dataStore.loadedRegions.length, label: 'REGIONS' };
    }
  }
  if (view.value === ViewState.PROJECT_LIST) {
    return { count: currentProjects.value.length, label: 'PROJECTS' };
  }
  return { count: 0, label: '' };
});

onMounted(() => {
  if (!hasFooterAnimated.value && !props.inline) {
    // Initial load animation trigger
    setTimeout(() => {
      setHasFooterAnimated(true);
    }, 1800);
  }
});
</script>
