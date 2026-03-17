<template>
  <div
        v-reveal
        class="relative w-full h-[50vh] md:h-[70vh] overflow-hidden transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) opacity-0 translate-y-10 reveal:opacity-100 reveal:translate-y-0"
    >
    <!-- 1. Skeleton State (Highest Z) -->
    <div v-if="isActuallyLoading" class="absolute inset-0 z-50 skeleton-shimmer flex items-center justify-center h-full">
      <div class="w-12 h-12 rounded-full border-2 border-white/10 border-t-white/40 animate-spin"></div>
    </div>

    <!-- 2. Poster Image (Standard img for maximum reliability) -->
    <img
        v-if="(displayPoster || poster) && !isStarted"
        :src="displayPoster || poster"
        alt="Video Poster"
        @load="onPosterLoad"
        class="absolute inset-0 w-full h-full object-cover z-20 transition-opacity duration-700"
        :class="isActuallyLoading ? 'opacity-0' : 'opacity-100'"
    />

    <!-- 3. Custom Play Overlay (Always above poster, hidden when started) -->
    <div
        v-if="!isStarted"
        class="custom-overlay absolute inset-0 z-30 flex items-center justify-center bg-black/20 transition-all duration-700 pointer-events-none"
        :class="isActuallyLoading ? 'opacity-0' : 'opacity-100'"
    >
      <button
          v-if="!isLoading"
          @click="handlePlayClick"
          class="play-button group/btn relative w-24 h-24 flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full pointer-events-auto cursor-pointer transition-all duration-500 hover:scale-110 hover:bg-white/20"
      >
        <div class="absolute inset-0 rounded-full bg-white/10 animate-ping opacity-20 group-hover/btn:hidden"></div>
        <Play class="w-8 h-8 text-white fill-white ml-1 transition-transform group-hover/btn:scale-110" />
      </button>
    </div>

    <!-- 4. Vidstack Player (Base Layer) -->
    <media-player
        ref="player"
        class="absolute inset-0 w-full h-full group/player border-none outline-none ring-0 transition-opacity duration-700"
        :src="url"
        cross-origin
        plays-inline
        :autoplay="autoplay"
        :loop="loop"
        :muted="muted"
        volume="0.5"
        @vds-play="onPlay"
        @vds-playing="onPlaying"
        @vds-waiting="onWaiting"
        @vds-started="onStarted"
    >
      <media-provider class="w-full h-full" />
      <media-video-layout />
    </media-player>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Play } from 'lucide-vue-next';
import { useDataStore } from '../../store/data';
import { ImageCacheService } from '@/services/imageCache';

const dataStore = useDataStore();

const props = withDefaults(defineProps<{
  url: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  loading?: boolean;
}>(), {
  autoplay: false,
  loop: true,
  muted: true,
  loading: false
});

const posterLoaded = ref(false);
const displayPoster = ref('');
const isStarted = ref(false);

const isActuallyLoading = computed(() => 
  props.loading || 
  dataStore.isPageLoading || 
  (props.poster && !posterLoaded.value)
);

const onPosterLoad = () => {
  posterLoaded.value = true;
};

// Preload and cache the poster
watch(() => props.poster, async (newPoster) => {
  if (newPoster) {
    posterLoaded.value = false;
    try {
      const cachedUrl = await ImageCacheService.getImageUrl(newPoster);
      displayPoster.value = cachedUrl;
      // The @load on <img> will handle posterLoaded = true
    } catch (e) {
      displayPoster.value = newPoster;
      // Fallback: if cache fails, we still wait for @load on the raw URL
    }
  } else {
    displayPoster.value = '';
    posterLoaded.value = true;
  }
}, { immediate: true });

const player = ref<any>(null);
const isLoading = ref(false);

const onPlay = () => {
  console.log("play")
  isLoading.value = true;
  isStarted.value = true; // Hide poster immediately when play is triggered
};

const onPlaying = () => {
  isLoading.value = false;
};

const onWaiting = () => {
  isLoading.value = true;
};

const onStarted = () => {
  isStarted.value = true;
};

const handlePlayClick = (e: Event) => {
  e.stopPropagation();
  if (player.value) {
    player.value.play();
    isLoading.value = true;
  }
};
</script>

<style scoped>
media-player {
  --video-brand: #ffffff;
  --video-bg: transparent;
  --video-controls-bg: rgba(0, 0, 0, 0.4);
}

media-player,
media-player :deep(.vds-media),
media-player :deep(.vds-video) {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

media-player :deep(.vds-video) {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

/* Hide default controls until started */
media-player:not([data-started]) :deep(.vds-controls) {
  opacity: 0;
  visibility: hidden;
}

media-player :deep(.vds-buffering-indicator) {
  --vds-buffering-indicator-color: #ffffff;
}
</style>
