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
      <div
        v-for="(item, index) in currentData"
        :key="`${filterType}-${item.id}`"
        :style="{ animationDelay: `${index * 50}ms` }"
        @click="!isDragging && handleSelect(item.id)"
        @mouseenter="store.setHoveredColor(item.color || item.accentColor)"
        @mouseleave="store.setHoveredColor(null)"
        class="group relative flex-shrink-0 w-[80vw] sm:w-[35vw] md:w-[22vw] h-full overflow-hidden rounded-[2.5rem] border border-white/5 transition-all duration-700 bg-zinc-950/40 animate-in fade-in zoom-in-90 slide-in-from-right-12 duration-[600ms] fill-mode-both"
      >
        <div class="absolute inset-0 z-0">
          <img
            :src="item.image"
            :alt="item.title"
            class="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-70 transition-all duration-1000 ease-out pointer-events-none"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
        </div>

        <div class="relative z-10 h-full p-10 flex flex-col justify-end text-left pointer-events-none">
          <div class="flex items-center space-x-4 mb-6">
            <span class="text-[10px] font-black tracking-widest text-white/30 group-hover:text-white transition-colors">
              {{ index + 1 < 10 ? `0${index + 1}` : index + 1 }}
            </span>
            <div class="w-6 h-[1px] bg-white/10 group-hover:w-10 group-hover:bg-white transition-all duration-700" />
          </div>
          <h2 class="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-3 leading-tight group-hover:translate-x-1 transition-transform duration-700">
            {{ item.title }}
          </h2>
          <p class="text-[9px] font-bold tracking-widest uppercase opacity-30 group-hover:opacity-100 transition-opacity duration-700">
            {{ item.subtitle }}
          </p>
        </div>

        <div
          class="absolute bottom-0 left-0 w-full h-1 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
          :style="{ backgroundColor: item.color || item.accentColor }"
        />
      </div>
    </DragScroll>

    <!-- Bottom Footer -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../store';
import { CategoryType } from '../types';
import { CAPABILITY_DATA, MARKET_DATA, REGION_DATA } from '../constants';
import DragScroll from '../components/DragScroll.vue';

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
