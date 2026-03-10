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
        content-class="items-stretch space-x-6 h-full"
        v-slot="{ isDragging }"
    >
      <SelectionCard
          v-for="(item, index) in currentData"
          :key="`${filterType}-${item.id}`"
          :id="item.id"
          :title="item.title"
          :subtitle="item.subtitle"
          :image="item.image"
          :color="item.color || item.accentColor"
          :index="index"
          :is-dragging="isDragging"
          @select="handleSelect"
      />
    </DragScroll>
  </BaseLayout>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
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
    // Direct link or handle specifically
    window.location.href = pill.routePath;
  }
  setHoveredColor(null);
};

const currentData = computed(() => {
  return filterType.value === CategoryType.CAPABILITY ? dataStore.loadedCapabilities :
      filterType.value === CategoryType.MARKET ? dataStore.loadedMarkets : dataStore.loadedRegions;
});

const handleSelect = (id: string) => {
  const typeParam = route.params.type as string;
  goToProjectList(typeParam, id);
};
</script>
