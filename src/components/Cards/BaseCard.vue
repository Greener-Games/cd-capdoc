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
      <!-- Image Skeleton State -->
      <div v-if="isActuallyLoading" class="absolute inset-0 z-30 skeleton-shimmer flex items-center justify-center h-full">
        <div class="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/40 animate-spin"></div>
      </div>

      <img
          v-if="displayImage || image"
          :src="displayImage || image"
          :alt="title"
          loading="lazy"
          decoding="async"
          @load="handleImageLoad"
          :class="['w-full h-full object-cover transition-all duration-1000 ease-out pointer-events-none', imageClass, isActuallyLoading ? 'opacity-0' : 'opacity-100']"
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

    <!-- Info Section Area -->
    <div class="mt-4 px-2 min-h-16 flex flex-col justify-start">
      <!-- Text Skeleton State -->
      <div v-if="isActuallyLoading" class="space-y-2 py-2">
        <div class="w-3/4 h-4 skeleton-shimmer rounded"></div>
        <div class="w-1/2 h-3 skeleton-shimmer rounded opacity-50"></div>
      </div>
      
      <!-- Actual Content -->
      <div :class="[isActuallyLoading ? 'opacity-0' : 'opacity-100', 'transition-opacity duration-500']">
        <slot :formatted-title="formattedTitle"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useOrbState } from '@/composables/useOrbState.ts';
import { ImageCacheService } from '@/services/imageCache';
import { useDataStore } from '@/store/data';

const dataStore = useDataStore();

const props = withDefaults(defineProps<{
  id: string;
  title: string;
  image?: string;
  color?: string;
  index: number;
  isDragging?: boolean;
  loading?: boolean; // Manual loading override
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
  loading: false,
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

// Determine if we should show skeleton
const imageLoaded = ref(false);
const isActuallyLoading = computed(() => 
  props.loading || 
  dataStore.isPageLoading || 
  (props.image && !imageLoaded.value)
);

const handleImageLoad = () => {
  imageLoaded.value = true;
};

// Reactive reference for the local cached URL
const displayImage = ref('');

// Watch the prop image and resolve the cached/blob version
watch(() => props.image, async (newImage) => {
  imageLoaded.value = false; // Reset loading state for new image
  if (newImage) {
    displayImage.value = await ImageCacheService.getImageUrl(newImage);
  } else {
    displayImage.value = '';
  }
}, { immediate: true });

const formattedTitle = computed(() => 
  props.title.toUpperCase().replace('&', 'AND')
);

const handleClick = () => {
  if (!props.isDragging) {
    emit('select', props.id);
  }
};
</script>
