<template>
  <div
      :style="{ animationDelay: `${index * 50}ms` }"
      @click="handleClick"
      @mouseenter="viewStore.setHoveredColor(color)"
      @mouseleave="viewStore.setHoveredColor(null)"
      class="group relative shrink-0 h-full transition-all duration-700 animate-in fade-in zoom-in-90 slide-in-from-right-12 duration-600 fill-mode-both flex flex-col cursor-pointer"
  >
    <!-- We apply a dynamic class here to handle different border radius and margins -->
    <div :class="['relative w-full grow overflow-hidden border border-white/5 bg-zinc-950/40 isolate backface-hidden transform-gpu', imageContainerClass]">
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

    <!-- The slot allows children to put their specific text/layout here -->
    <slot :formatted-title="formattedTitle"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useViewStore } from '../store'; // Adjust path if needed

const props = withDefaults(defineProps<{
  id: string;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  index: number;
  isDragging: boolean;
  prefix?: string;
  imageContainerClass?: string; // Prop to customize the image wrapper
}>(), {
  prefix: '',
  imageContainerClass: 'rounded-3xl mb-4' // Default to SelectionCard styles
});

const emit = defineEmits(['select']);
const viewStore = useViewStore();

const formattedTitle = computed(() => {
  return props.title.toUpperCase().replace('&', 'AND');
});

const handleClick = () => {
  if (!props.isDragging) {
    emit('select', props.id);
  }
};
</script>