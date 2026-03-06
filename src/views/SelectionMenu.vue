<template>
  <BaseLayout :titleKey="filterType">
    <template #header-controls>
      <!-- Styled Pills -->
      <div class="flex items-center space-x-2 pointer-events-auto">
        <RoundedButton
            v-for="pill in pills"
            :key="pill.label"
            :label="pill.label"
            :active="pill.type && filterType === pill.type"
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
import {useRouter} from 'vue-router';
import {useViewStore, useDataStore} from '../store';
import {CategoryType} from '../types';
import {CAPABILITY_DATA, MARKET_DATA, REGION_DATA} from '../constants';
import DragScroll from '../components/DragScroll.vue';
import SelectionCard from '../components/SelectionCard.vue';
import BaseLayout from "@/Layouts/BaseLayout.vue";
import RoundedButton from "@/components/RoundedButton.vue";

const viewStore = useViewStore();
const dataStore = useDataStore();
const router = useRouter();

const filterType = ref<CategoryType>(dataStore.filterType || CategoryType.CAPABILITY);
const dragScrollRef = ref<InstanceType<typeof DragScroll> | null>(null);

watch(filterType, () => {
  dragScrollRef.value?.resetScroll();
});

// Pill Configuration
const pills = [
  {label: 'Capabilities', type: CategoryType.CAPABILITY},
  {label: 'Market', type: CategoryType.MARKET},
  {label: 'Region', type: CategoryType.REGION},
  {label: 'About Us', route: '/about'}
];

const handlePillClick = (pill: typeof pills[0]) => {
  if (pill.route) {
    router.push(pill.route);
  } else if (pill.type) {
    setFilter(pill.type);
  }
};

const currentData = computed(() => {
  return filterType.value === CategoryType.CAPABILITY ? CAPABILITY_DATA :
      filterType.value === CategoryType.MARKET ? MARKET_DATA : REGION_DATA;
});

const setFilter = (type: CategoryType) => {
  filterType.value = type;
  viewStore.setHoveredColor(null);
};

const handleSelect = (id: string) => {
  dataStore.setFilter(filterType.value, id);
  router.push(`/timeline/${filterType.value}/${id}`);
};
</script>

<style scoped>
</style>