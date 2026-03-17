<template>
  <BaseLayout :titleKey="filterType">
    <template #header-controls>
      <!-- Styled Pills -->
      <div class="flex items-center space-x-2 pointer-events-auto">
        <RoundedButton
            v-for="pill in pills"
            :key="pill.label"
            :label="pill.label"
            :active="pill.routePath === route.path"
            @click="handlePillClick(pill)"
        />
      </div>
    </template>

    <template #title>
      {{
        filterType === CategoryType.CAPABILITY ? 'Our Capabilities' :
            filterType === CategoryType.MARKET ? 'Market sectors' : 'Global regions'
      }}
    </template>

    <!-- Draggable/Scrollable Container -->
    <DragScroll
        ref="dragScrollRef"
        class="w-full grow min-h-0"
        content-class="items-stretch h-full"
        v-slot="{ isDragging }"
    >
      <TransitionGroup 
        name="card-list" 
        tag="div" 
        class="flex flex-row space-x-grid h-full"
        appear
      >
        <SelectionCard
            v-for="(item, index) in displayedData"
            :key="`${filterType}-${item.id}`"
            :item="item"
            :index="index"
            :is-dragging="isDragging"
            @select="handleSelect"
        />
      </TransitionGroup>
    </DragScroll>
  </BaseLayout>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useDataStore} from '../store';
import {CategoryType} from '../types';
import DragScroll from '../components/Common/DragScroll.vue';
import SelectionCard from '../components/Cards/SelectionCard.vue';
import BaseLayout from "@/components/Layouts/BaseLayout.vue";
import RoundedButton from "@/components/Common/RoundedButton.vue";
import { useCategoryFilter } from '../composables/useCategoryFilter';
import { useOrbState } from '../composables/useOrbState';
import { useAppNavigation } from '../composables/useAppNavigation';

const dataStore = useDataStore();
const route = useRoute();
const router = useRouter();
const { filterType } = useCategoryFilter();
const { setHoveredColor } = useOrbState();
const { goToCategorySelect, goToProjectList } = useAppNavigation();

const dragScrollRef = ref<InstanceType<typeof DragScroll> | null>(null);

watch(filterType, () => {
  dragScrollRef.value?.resetScroll();
});

// Pill Configuration
const pills = [
  {label: 'Capabilities', type: 'capabilities', routePath: '/navigation/capabilities'},
  {label: 'Market', type: 'markets', routePath: '/navigation/markets'},
  {label: 'Region', type: 'regions', routePath: '/navigation/regions'},
  {label: 'About Us', routePath: '/about'}
];

const handlePillClick = (pill: typeof pills[0]) => {
  if (pill.type) {
    goToCategorySelect(pill.type);
  } else {
    router.push(pill.routePath);
  }
  setHoveredColor(null);
};

const currentData = computed(() => {
  return filterType.value === CategoryType.CAPABILITY ? dataStore.loadedCapabilities :
      filterType.value === CategoryType.MARKET ? dataStore.loadedMarkets : dataStore.loadedRegions;
});

// Staged data for smooth out-in staggering
const displayedData = ref([...currentData.value]);

watch(currentData, (newData) => {
  // Calculate delay based on current count to ensure they all finish leaving
  // 20ms stagger per item + 600ms base transition + 100ms safety buffer
  const exitDelay = (displayedData.value.length * 20) + 600 + 200;
  
  displayedData.value = [];
  
  setTimeout(() => {
    displayedData.value = newData;
  }, exitDelay);
}, { deep: true });

const handleSelect = (id: string) => {
  const typeParam = route.params.type as string;
  goToProjectList(typeParam, id);
};
</script>
