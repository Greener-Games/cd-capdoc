<template>
  <div
        v-reveal
        class="reveal-fx relative w-full h-[50vh] md:h-[70vh] overflow-hidden"
    >
    <!-- 1. Skeleton State (Z-50) -->
    <SkeletonLoader
        v-if="isActuallyLoading"
        class="absolute inset-0 z-50"
        show-spinner
        spinner-class="w-12 h-12"
        :rounded="false"
    />

    <!-- 2. Vidstack Player -->
    <media-player
        ref="player"
        class="absolute inset-0 w-full h-full group/player border-none outline-none ring-0 transition-opacity duration-700"
        :class="isActuallyLoading ? 'opacity-0' : 'opacity-100'"
        :src="url"
        view-type="video"
        cross-origin
        plays-inline
        :autoplay="autoplay"
        :loop="loop"
        :muted="muted"
        volume="0.5"
        @vds-play="onPlay"
        @vds-playing="onPlaying"
        @vds-waiting="onWaiting"
    >
      <media-provider class="w-full h-full">
        <!-- Poster Image inside Provider (Z-20) -->
        <img
            v-if="displayPoster || poster"
            :src="displayPoster || poster"
            alt="Video Poster"
            @load="onPosterLoad"
            class="vds-custom-poster absolute inset-0 w-full h-full object-cover z-20 transition-opacity duration-700 pointer-events-none"
        />
      </media-provider>

      <!-- Custom Play Overlay inside Player (Z-30) -->
      <div
          class="custom-overlay absolute inset-0 z-30 flex items-center justify-center bg-black/20 transition-all duration-700 pointer-events-none"
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

      <!-- Default Vidstack Video Layout (Z-40 via class) -->
      <media-video-layout thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"></media-video-layout>
    </media-player>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Play } from 'lucide-vue-next';
import { useDataStore } from '../../store/data';
import { ImageCacheService } from '@/services/imageCache';
import {ImageOptimizer} from "@/services/imageOptimizer.ts";
import SkeletonLoader from '@/components/Common/SkeletonLoader.vue';

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
      const optimizedUrl = ImageOptimizer.getOptimizedUrl(newPoster, 'full');
      const cachedUrl = await ImageCacheService.getImageUrl(optimizedUrl);
      displayPoster.value = cachedUrl;
    } catch (e) {
      displayPoster.value = newPoster;
    }
  } else {
    displayPoster.value = '';
    posterLoaded.value = true;
  }
}, { immediate: true });

const player = ref<any>(null);
const isLoading = ref(false);

const onPlay = () => {
  isLoading.value = true;
};

const onPlaying = () => {
  isLoading.value = false;
};

const onWaiting = () => {
  isLoading.value = true;
};

const handlePlayClick = async (e: Event) => {
  e.stopPropagation();
  if (player.value) {
    try {
      await player.value.play();
      isLoading.value = true;
    } catch (error) {
      console.warn('Media is not ready to play yet:', error);
      // You could also show a loading state here if you wanted
    }
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

/*
  CRITICAL: Hide custom poster and overlay when video starts.
*/
media-player[data-started] .vds-custom-poster,
media-player[data-started] .custom-overlay {
  opacity: 0 !important;
  pointer-events: none !important;
  visibility: hidden;
}

/*
  Removed the CSS that was hiding .vds-controls
  as the missing CSS imports in main.ts were likely the root cause.
*/

media-player :deep(.vds-buffering-indicator) {
  --vds-buffering-indicator-color: #ffffff;
}
</style>
