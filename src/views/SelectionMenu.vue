<template>
  <div class="relative flex flex-col w-full h-full overflow-hidden pt-32 z-10">
    <div class="px-12 md:px-24 mb-16 flex flex-col items-start z-10">
      <div class="flex items-center mb-8">
        <!-- Segmented Controller -->
        <div class="flex items-center space-x-2 bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10 pointer-events-auto">
          <button
            v-for="type in [CategoryType.CAPABILITY, CategoryType.MARKET, CategoryType.REGION]"
            :key="type"
            @click="setFilter(type)"
            class="relative px-6 py-2 rounded-full text-[9px] font-black tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer"
            :class="[
              filterType === type
                ? 'text-black'
                : 'text-white/40 hover:text-white'
            ]"
          >
            <div
              v-if="filterType === type"
              class="absolute inset-0 bg-white rounded-full z-0 animate-in fade-in zoom-in-75 duration-300 fill-mode-both"
            ></div>
            <span class="relative z-10">
              {{ type === CategoryType.CAPABILITY ? 'Capability' : type === CategoryType.MARKET ? 'Market' : 'Region' }}
            </span>
          </button>
        </div>
      </div>

      <div class="h-[100px]">
        <h2
          :key="filterType"
          class="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none animate-in fade-in slide-in-from-bottom-2 duration-400 fill-mode-both"
        >
          {{ filterType === CategoryType.CAPABILITY ? 'Capabilities' :
             filterType === CategoryType.MARKET ? 'Market sectors' : 'Global regions' }}
        </h2>
      </div>
    </div>

    <!-- Draggable/Scrollable Container -->
    <DragScroll
      class="flex items-center space-x-6 px-12 md:px-24 h-[55vh]"
      v-slot="{ isDragging }"
    >
      <CarouselCard
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

    <!-- Bottom Footer -->
    <PageFooter :count="currentData.length" :label="currentLabel" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../store';
import { CategoryType } from '../types';
import { CAPABILITY_DATA, MARKET_DATA, REGION_DATA } from '../constants';
import DragScroll from '../components/DragScroll.vue';
import CarouselCard from '../components/CarouselCard.vue';
import PageFooter from '../components/PageFooter.vue';

const store = useAppStore();
const router = useRouter();

const filterType = ref<CategoryType>(store.filterType || CategoryType.CAPABILITY);

const currentData = computed(() => {
  return filterType.value === CategoryType.CAPABILITY ? CAPABILITY_DATA :
         filterType.value === CategoryType.MARKET ? MARKET_DATA : REGION_DATA;
});

const currentLabel = computed(() => {
  return filterType.value === CategoryType.CAPABILITY ? 'CAPABILITIES' :
         filterType.value === CategoryType.MARKET ? 'MARKETS' : 'REGIONS';
});

const setFilter = (type: CategoryType) => {
  filterType.value = type;
  store.setHoveredColor(null);
};

const handleSelect = (id: string) => {
  store.setFilter(filterType.value, id);
  router.push(`/timeline/${filterType.value}/${id}`);
};
</script>

<style scoped>
</style>
