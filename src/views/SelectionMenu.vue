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
              class="absolute inset-0 bg-white rounded-full z-0"
              v-motion
              :initial="{ opacity: 0, scale: 0.8 }"
              :enter="{ opacity: 1, scale: 1 }"
            ></div>
            <span class="relative z-10">
              {{ type === CategoryType.CAPABILITY ? 'Capability' : type === CategoryType.MARKET ? 'Market' : 'Region' }}
            </span>
          </button>
        </div>
      </div>

      <div class="h-[100px]">
        <h2
          v-motion
          :key="filterType"
          :initial="{ opacity: 0, y: 10 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
          class="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none"
        >
          {{ filterType === CategoryType.CAPABILITY ? 'Capabilities' :
             filterType === CategoryType.MARKET ? 'Market sectors' : 'Global regions' }}

          {{isCurrentlyDragging }}
        </h2>
      </div>
    </div>

    <!-- Draggable/Scrollable Container -->
    <div
      ref="containerRef"
      @mousedown="handleMouseDown"
      @mouseleave="handleMouseLeave"
      @mouseup="handleMouseUp"
      @mousemove="handleMouseMove"
      class="flex items-center space-x-6 px-12 md:px-24 overflow-x-auto scrollbar-none h-[55vh] select-none"
      :class="isCurrentlyDragging ? 'cursor-grabbing' : 'cursor-grab'"
    >
      <div
        v-for="(item, index) in currentData"
        :key="`${filterType}-${item.id}`"
        v-motion
        :initial="{ opacity: 0, scale: 0.9, x: 50 }"
        :enter="{ opacity: 1, scale: 1, x: 0, transition: { delay: index * 50, duration: 600 } }"
        @click="!isCurrentlyDragging && handleSelect(item.id)"
        @mouseenter="store.setHoveredColor(item.color || item.accentColor)"
        @mouseleave="store.setHoveredColor(null)"
        class="group relative flex-shrink-0 w-[80vw] sm:w-[35vw] md:w-[22vw] h-full overflow-hidden rounded-[2.5rem] border border-white/5 transition-all duration-700 bg-zinc-950/40"
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

      <div class="min-w-[15vw] flex-shrink-0 h-1" />
    </div>

    <div class="absolute bottom-12 left-12 md:left-24 right-12 md:right-24 flex items-center justify-between pointer-events-none opacity-20 hidden md:flex">
      <div class="text-[9px] font-black tracking-[0.4em] uppercase">
        Explore sequential strategic assets
      </div>
      <div class="flex space-x-6">
        <div class="w-1 h-1 rounded-full bg-white animate-pulse" />
        <div class="w-1 h-1 rounded-full bg-white opacity-50" />
        <div class="w-1 h-1 rounded-full bg-white opacity-20" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../store';
import { CategoryType } from '../types';
import { CAPABILITY_DATA, MARKET_DATA, REGION_DATA } from '../constants';

const store = useAppStore();
const router = useRouter();

const filterType = ref<CategoryType>(store.filterType || CategoryType.CAPABILITY);
const containerRef = ref<HTMLDivElement | null>(null);

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

// Drag to scroll logic
const isDragging = ref(false);
const isCurrentlyDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);
const dragThreshold = 5; // Minimum pixels to move before it's a drag

const handleMouseDown = (e: MouseEvent) => {
  if (!containerRef.value) return;
  isDragging.value = true;
  // Don't set isCurrentlyDragging here yet
  startX.value = e.pageX - containerRef.value.offsetLeft;
  scrollLeft.value = containerRef.value.scrollLeft;
};

const handleMouseLeave = () => {
  isDragging.value = false;
  isCurrentlyDragging.value = false;
};

const handleMouseUp = () => {
  isDragging.value = false;
  // Use a timeout to ensure the click handler (which runs after mouseup)
  // can still see the correct state of isCurrentlyDragging
  setTimeout(() => {
    isCurrentlyDragging.value = false;
  }, 50);
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !containerRef.value) return;

  const x = e.pageX - containerRef.value.offsetLeft;
  const walk = (x - startX.value);

  // Only trigger drag state if we've moved past the threshold
  if (Math.abs(walk) > dragThreshold) {
    isCurrentlyDragging.value = true;
  }

  if (isCurrentlyDragging.value) {
    e.preventDefault();
    containerRef.value.scrollLeft = scrollLeft.value - (walk * 2);
  }
};
</script>

<style scoped>
</style>
