<template>
  <div class="relative flex flex-col w-full h-full overflow-hidden pt-safe-top pb-safe-bottom z-10">
    <div class="px-12 md:px-24 mb-16 flex flex-col items-start z-10">
      <div class="h-[80px] mb-8">
        <h2
          :key="filterType"
          class="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none animate-in fade-in slide-in-from-bottom-2 duration-400 fill-mode-both"
        >
          {{ filterType === CategoryType.CAPABILITY ? 'Our Capabilities' :
             filterType === CategoryType.MARKET ? 'Market sectors' : 'Global regions' }}
        </h2>
      </div>

      <div class="flex items-center">
        <!-- Styled Pills -->
        <div class="flex items-center space-x-2 pointer-events-auto">
          <button
            @click="setFilter(CategoryType.CAPABILITY)"
            class="relative px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer border border-white/20"
            :class="[
              filterType === CategoryType.CAPABILITY
                ? 'bg-white text-black border-transparent'
                : 'bg-transparent text-white hover:bg-white/10'
            ]"
          >
            <span>Capabilities</span>
          </button>

          <!-- Dummy Buttons for UI match -->
          <button
            class="relative px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer border border-white/20 bg-transparent text-white/50 hover:bg-white/10 hover:text-white"
          >
            <span>Market</span>
          </button>

          <button
            class="relative px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer border border-white/20 bg-transparent text-white/50 hover:bg-white/10 hover:text-white"
          >
            <span>Region</span>
          </button>

          <button
            class="relative px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer border border-white/20 bg-transparent text-white/50 hover:bg-white/10 hover:text-white"
          >
            <span>About Us</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Draggable/Scrollable Container -->
    <DragScroll
      class="flex items-center space-x-6 px-12 md:px-24 h-[45vh]"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../store';
import { CategoryType } from '../types';
import { CAPABILITY_DATA, MARKET_DATA, REGION_DATA } from '../constants';
import DragScroll from '../components/DragScroll.vue';
import SelectionCard from '../components/SelectionCard.vue';

const store = useAppStore();
const router = useRouter();

const filterType = ref<CategoryType>(store.filterType || CategoryType.CAPABILITY);

const currentData = computed(() => {
  return filterType.value === CategoryType.CAPABILITY ? CAPABILITY_DATA :
         filterType.value === CategoryType.MARKET ? MARKET_DATA : REGION_DATA;
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
