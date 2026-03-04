<template>
  <div class="relative flex-shrink-0">
    <!-- Connection Line -->
    <div
      v-if="!isLast"
      class="absolute top-1/2 left-[100%] w-32 h-[1px] bg-gradient-to-r from-white/20 to-transparent -translate-y-1/2"
    ></div>

    <div
      class="group w-80 cursor-pointer animate-in fade-in slide-in-from-right-24 duration-[800ms] fill-mode-both"
      :style="{ animationDelay: `${index * 100}ms` }"
      @mouseenter="store.setHoveredColor(color)"
      @mouseleave="store.setHoveredColor(null)"
      @click="handleClick"
    >
      <!-- Timeline Node -->
      <div class="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div class="w-[1px] h-8 bg-white/20 mb-2 group-hover:bg-white/40 transition-colors"></div>
        <div
          class="w-3 h-3 rounded-full border-2 border-white/20 group-hover:scale-150 group-hover:border-white transition-all duration-300"
          :style="{ backgroundColor: color }"
        ></div>
      </div>

      <!-- Content Card -->
      <div class="mt-4 glass-panel p-6 opacity-60 group-hover:opacity-100 group-hover:bg-white/10 transition-all duration-500 transform group-hover:-translate-y-4">
        <span class="text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block" :style="{ color: color }">
          Curated Step {{ String(index + 1).padStart(2, '0') }}
        </span>
        <h3 class="text-2xl font-light text-white mb-3 tracking-wide">{{ title }}</h3>
        <p class="text-sm text-white/50 leading-relaxed font-light">
          {{ description }}
        </p>

        <!-- Image Reveal -->
        <div class="h-0 group-hover:h-48 overflow-hidden transition-all duration-500 mt-6 rounded-lg opacity-0 group-hover:opacity-100">
          <img
            :src="image"
            :alt="title"
            class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../store';

const props = defineProps<{
  id: string;
  title: string;
  description: string;
  image: string;
  color: string;
  index: number;
  isLast: boolean;
  isDragging: boolean;
}>();

const emit = defineEmits(['select']);

const store = useAppStore();

const handleClick = () => {
  if (!props.isDragging) {
    emit('select', props.id);
  }
};
</script>
