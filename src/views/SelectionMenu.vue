<template>
  <div class="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
    <div
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
      class="mb-16"
    >
      <div class="glass-panel p-2 flex space-x-2">
        <button
          v-for="type in [CategoryType.CAPABILITY, CategoryType.MARKET, CategoryType.REGION]"
          :key="type"
          @click="setFilter(type)"
          class="px-8 py-3 rounded-full text-caption transition-all cursor-pointer relative"
          :class="[
            filterType === type
              ? 'text-white bg-white/10'
              : 'text-white/40 hover:text-white/80 hover:bg-white/5'
          ]"
        >
          {{ type === CategoryType.CAPABILITY ? 'Capabilities' : type === CategoryType.MARKET ? 'Markets' : 'Regions' }}
        </button>
      </div>
    </div>

    <div class="relative w-full max-w-6xl h-[60vh] flex items-center justify-center">
      <div
        v-for="(item, index) in currentData"
        :key="item.id"
        class="absolute transition-all duration-700 ease-in-out cursor-pointer group"
        :style="getCategoryStyle(index, currentData.length)"
        @mouseenter="store.setHoveredColor(item.accentColor)"
        @mouseleave="store.setHoveredColor(null)"
        @click="handleSelect(item.id)"
      >
        <div class="flex flex-col items-center space-y-4">
          <div
            class="w-48 h-48 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-sm transition-all duration-500 overflow-hidden relative"
            :class="[
              hoveredId === item.id
                ? 'bg-white/10 border-white/40 scale-110 shadow-[0_0_50px_rgba(255,255,255,0.1)]'
                : 'bg-black/20 hover:bg-white/5 hover:border-white/30'
            ]"
            @mouseenter="hoveredId = item.id"
            @mouseleave="hoveredId = null"
          >
            <!-- Background Image on Hover -->
            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 bg-cover bg-center mix-blend-overlay"
              :style="{ backgroundImage: `url(${item.projects[0]?.imageUrl})` }"
            ></div>

            <!-- Icon/Title Container -->
            <div class="relative z-10 flex flex-col items-center transform transition-transform duration-500 group-hover:-translate-y-2">
              <span
                class="text-4xl mb-3 font-light text-white/40 group-hover:text-white transition-colors duration-500"
                :style="{ color: hoveredId === item.id ? item.accentColor : '' }"
              >
                {{ index + 1 }}
              </span>
              <span class="text-[11px] font-bold tracking-[0.2em] uppercase text-white/60 group-hover:text-white transition-colors text-center px-4">
                {{ item.title }}
              </span>
            </div>

            <!-- Hover Reveal Stats -->
            <div class="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-[9px] font-black tracking-widest uppercase text-white/40">
              {{ item.projects.length }} Projects
            </div>
          </div>
        </div>
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

const filterType = ref(store.filterType);
const hoveredId = ref<string | null>(null);

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

const getCategoryStyle = (index: number, total: number) => {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const radius = 300;

  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * (radius * 0.4);

  return {
    transform: `translate(${x}px, ${y}px)`
  };
};
</script>