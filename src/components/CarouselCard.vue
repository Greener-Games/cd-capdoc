<template>
  <div
    :style="{ animationDelay: `${index * 50}ms` }"
    @click="handleClick"
    @mouseenter="store.setHoveredColor(color)"
    @mouseleave="store.setHoveredColor(null)"
    class="group relative flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[45vw] h-full overflow-hidden transition-all duration-700 animate-in fade-in zoom-in-90 slide-in-from-right-12 duration-[600ms] fill-mode-both flex flex-col cursor-pointer"
  >
    <div class="relative w-full flex-grow rounded-[2.5rem] overflow-hidden border border-white/5 bg-zinc-950/40 mb-6">
      <img
        :src="image"
        :alt="title"
        class="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 pointer-events-none"
      />
      <div class="absolute inset-0 pointer-events-none transition-opacity duration-700 opacity-0 group-hover:opacity-100 bg-black/20" />

      <div
        class="absolute bottom-0 left-0 w-full h-1 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20"
        :style="{ backgroundColor: color }"
      />
    </div>

    <div class="flex flex-row justify-between items-start text-left pointer-events-none px-2 h-24 w-full">
      <div class="flex flex-col max-w-[70%]">
        <h2 class="text-xl md:text-2xl font-black tracking-tighter uppercase mb-2 leading-tight transition-transform duration-700 text-white">
          {{ formattedTitle }}
        </h2>
        <p class="text-[9px] font-bold tracking-widest uppercase text-white/50 transition-colors duration-700 group-hover:text-white line-clamp-2">
          {{ subtitle }}
        </p>
      </div>

      <div v-if="services && services.length > 0" class="hidden md:flex flex-col items-end text-right gap-1 max-w-[30%] pt-1">
        <span
          v-for="service in services"
          :key="service"
          class="text-[9px] font-bold tracking-widest uppercase text-white/40 transition-colors duration-700 group-hover:text-white/80"
        >
          {{ service }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '../store';

const props = withDefaults(defineProps<{
  id: string;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  index: number;
  isDragging: boolean;
  prefix?: string;
  services?: string[];
}>(), {
  prefix: '',
  services: () => []
});

const emit = defineEmits(['select']);

const store = useAppStore();

const formattedTitle = computed(() => {
  return props.title.toUpperCase().replace('&', 'AND');
});

const handleClick = () => {
  if (!props.isDragging) {
    emit('select', props.id);
  }
};
</script>
