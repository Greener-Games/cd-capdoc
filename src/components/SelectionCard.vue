<template>
  <div
    :style="{ animationDelay: `${index * 50}ms` }"
    @click="handleClick"
    @mouseenter="store.setHoveredColor(color)"
    @mouseleave="store.setHoveredColor(null)"
    class="group relative flex-shrink-0 w-[80vw] sm:w-[45vw] md:w-[30vw] lg:w-[340px] h-full transition-all duration-700 animate-in fade-in zoom-in-90 slide-in-from-right-12 duration-[600ms] fill-mode-both flex flex-col cursor-pointer"
  >
    <div class="relative w-full flex-grow rounded-3xl overflow-hidden border border-white/5 bg-zinc-950/40 mb-4">
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

    <div class="flex flex-col justify-start text-left pointer-events-none h-20">
      <h2 class="text-lg md:text-xl font-medium tracking-wide uppercase leading-tight transition-colors duration-700 text-zinc-400 group-hover:text-white">
        {{ formattedTitle }}
      </h2>
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
}>(), {
  prefix: ''
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
