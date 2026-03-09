<template>
  <div
      :style="{ animationDelay: `${index * 50}ms` }"
      @click="handleClick"
      @mouseenter="setHoveredColor(color)"
      @mouseleave="setHoveredColor(null)"
      :class="[
        'group relative shrink-0 transition-all duration-700 animate-in fade-in fill-mode-both flex flex-col cursor-pointer',
        animationClass
      ]"
  >

    <!-- We apply a dynamic class here to handle different border radius and margins -->
    <div :class="['relative w-full grow overflow-hidden border border-white/5 bg-zinc-950/40 isolate backface-hidden transform-gpu [clip-path:inset(0_round_1.5rem)]', imageContainerClass]">
      <img
          v-if="image"
          :src="image"
          :alt="title"
          :class="['w-full h-full object-cover transition-all duration-1000 ease-out pointer-events-none', imageClass]"
      />
      <div v-if="showHoverOverlay" class="absolute inset-0 pointer-events-none transition-opacity duration-700 opacity-0 group-hover:opacity-100 bg-black/20"/>

      <div
          v-if="showBottomLine"
          class="absolute bottom-0 left-0 w-full h-1 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20"
          :style="{ backgroundColor: color }"
      />

      <!-- Overlay slot for custom elements over the image -->
      <slot name="image-overlay"></slot>
    </div>

    <!-- The slot allows children to put their specific text/layout here -->
    <slot :formatted-title="formattedTitle"></slot>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import { useOrbState } from '../../composables/useOrbState';

const props = withDefaults(defineProps<{
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  color?: string;
  index: number;
  isDragging?: boolean;
  prefix?: string;
  imageContainerClass?: string; // Prop to customize the image wrapper
  animationClass?: string;
  imageClass?: string;
  showHoverOverlay?: boolean;
  showBottomLine?: boolean;
}>(), {
  subtitle: '',
  image: '',
  color: '',
  isDragging: false,
  prefix: '',
  imageContainerClass: 'rounded-3xl mb-4', // Default to SelectionCard styles
  animationClass: 'zoom-in-90 slide-in-from-right-12 duration-600 h-full',
  imageClass: 'group-hover:scale-110',
  showHoverOverlay: true,
  showBottomLine: true,
});

const emit = defineEmits(['select']);
const { setHoveredColor } = useOrbState();

const formattedTitle = computed(() => {
  return props.title.toUpperCase().replace('&', 'AND');
});

const handleClick = () => {
  if (!props.isDragging) {
    emit('select', props.id);
  }
};
</script>
