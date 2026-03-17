<template>
  <div
      :style="{ '--index': index }"
      @click="handleClick"
      @mouseenter="setHoveredColor(color)"
      @mouseleave="setHoveredColor(null)"
      :class="[
        'group relative shrink-0 transition-all duration-700 grid grid-rows-[minmax(0,1fr)_auto] cursor-pointer',
        cardClass
      ]"
  >
    <!-- Image/Media Container -->
    <div :class="['relative overflow-hidden border-none bg-zinc-950/40 isolate backface-hidden transform-gpu [clip-path:inset(0_round_1.5rem)] shrink-0', aspectRatioClass, imageContainerClass]">
      <img
          v-if="image"
          :src="image"
          :alt="title"
          loading="lazy"
          decoding="async"
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
import { computed } from 'vue';
import { useOrbState } from '@/composables/useOrbState.ts';

const props = withDefaults(defineProps<{
  id: string;
  title: string;
  image?: string;
  color?: string;
  index: number;
  isDragging?: boolean;
  cardClass?: string;
  aspectRatioClass?: string;
  imageContainerClass?: string;
  imageClass?: string;
  showHoverOverlay?: boolean;
  showBottomLine?: boolean;
}>(), {
  image: '',
  color: '',
  isDragging: false,
  cardClass: 'w-max h-full',
  aspectRatioClass: 'aspect-[4/5]',
  imageContainerClass: 'rounded-3xl h-full',
  imageClass: 'group-hover:scale-110',
  showHoverOverlay: true,
  showBottomLine: true,
});

const emit = defineEmits<{
  (e: 'select', id: string): void
}>();

const { setHoveredColor } = useOrbState();

const formattedTitle = computed(() => 
  props.title.toUpperCase().replace('&', 'AND')
);

const handleClick = () => {
  if (!props.isDragging) {
    emit('select', props.id);
  }
};
</script>
