<template>
  <div class="absolute layout-footer px-safe-side h-(--footer-height) items-center flex justify-between z-10 pointer-events-none text-[10px] font-bold uppercase text-white">
    <!-- Dynamic part -->
    <div
        class="flex-1 text-left font-bienvenue animate-in fade-in slide-in-from-bottom-5 duration-1000 fill-mode-both"
        :class="[!hasFooterAnimated ? 'delay-800' : 'delay-0']"
        :key="`${footerProps.count}-${footerProps.label}`"
    >
      {{ footerProps.count }} {{ footerProps.label }}
    </div>

    <!-- Static parts -->
    <div
        class="shrink-0 font-bienvenue text-center text-white"
        :class="[!hasFooterAnimated ? 'animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-800 fill-mode-both' : '']"
    >
      COMPLEX → CLARITY
    </div>

    <div
        class="flex-1 text-right font-bienvenue normal-case font-normal text-white"
        :class="[!hasFooterAnimated ? 'animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-800 fill-mode-both' : '']"
    >
      © 2026 Creative Design. Proud to be part of AtkinsRéalis Group Inc
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
  if (!hasFooterAnimated.value) {
    // 800ms delay + 1000ms duration
    setTimeout(() => {
      setHasFooterAnimated(true);
    }, 1800);
  }
});
</script>
