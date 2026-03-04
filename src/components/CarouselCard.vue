<template>
  <div
    :style="{ animationDelay: `${index * 50}ms` }"
    @click="handleClick"
    @mouseenter="store.setHoveredColor(color)"
    @mouseleave="store.setHoveredColor(null)"
    class="group relative flex-shrink-0 w-[80vw] sm:w-[35vw] md:w-[22vw] h-full overflow-hidden rounded-[2.5rem] border border-white/5 transition-all duration-700 bg-zinc-950/40 animate-in fade-in zoom-in-90 slide-in-from-right-12 duration-[600ms] fill-mode-both"
  >
    <div class="absolute inset-0 z-0">
      <img
        :src="image"
        :alt="title"
        class="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-70 transition-all duration-1000 ease-out pointer-events-none"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
    </div>

    <div class="relative z-10 h-full p-10 flex flex-col justify-end text-left pointer-events-none">
      <div class="flex items-center space-x-4 mb-6">
        <span class="text-[10px] font-black tracking-widest text-white/30 group-hover:text-white transition-colors">
          {{ prefix }}{{ String(index + 1).padStart(2, '0') }}
        </span>
        <div class="w-6 h-[1px] bg-white/10 group-hover:w-10 group-hover:bg-white transition-all duration-700" />
      </div>
      <h2 class="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-3 leading-tight group-hover:translate-x-1 transition-transform duration-700 text-white">
        {{ title }}
      </h2>
      <p class="text-[9px] font-bold tracking-widest uppercase opacity-30 group-hover:opacity-100 transition-opacity duration-700 text-white">
        {{ subtitle }}
      </p>
    </div>

    <div
      class="absolute bottom-0 left-0 w-full h-1 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
      :style="{ backgroundColor: color }"
    />
  </div>
</template>

<script setup lang="ts">
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

const handleClick = () => {
  if (!props.isDragging) {
    emit('select', props.id);
  }
};
</script>
