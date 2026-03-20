<template>
  <div
    v-reveal
    class="reveal-fx relative w-full aspect-[12/5] overflow-hidden bg-black"
  >
    <!-- 1. The Video Player -->
    <media-player
      ref="player"
      class="absolute inset-0 w-full h-full ring-0"
      style="border: 0px"
      :src="formattedSrc"
      view-type="video"
      stream-type="on-demand"
      cross-origin
      plays-inline
      controls
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      :volume="0.5"
      @started="onVideoStarted"
      @playing="onVideoStarted"
      @play="onVideoPlay"
      @waiting="onVideoWaiting"
      @error="onVideoError"
    >
      <media-provider class="w-full h-full"></media-provider>
      <!-- Use the default layout with explicitly enabled features -->
      <media-video-layout></media-video-layout>
    </media-player>

    <!-- 2. Custom Overlay (Poster + Play Button/Loading) -->
    <Transition name="fade-overlay">
      <div
        v-if="!videoStarted"
        class="absolute inset-0 z-50 pointer-events-auto bg-black"
      >
        <!-- Poster Image -->
        <img
          v-if="poster"
          :src="poster"
          alt="Video Poster"
          class="absolute inset-0 w-full h-full object-cover"
        />
        
        <!-- Interactive Layer -->
        <div class="absolute inset-0 flex items-center justify-center bg-black/20">
          <!-- Play Button (Hidden when waiting) -->
          <button
            v-if="!isWaiting"
            @click="handlePlayClick"
            class="play-button group/btn relative w-24 h-24 flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full cursor-pointer transition-all duration-500 hover:scale-110 hover:bg-white/20"
            aria-label="Play Video"
          >
            <div class="absolute inset-0 rounded-full bg-white/10 animate-ping opacity-20 group-hover/btn:hidden"></div>
            <Play class="w-8 h-8 text-white fill-white ml-1 transition-transform group-hover/btn:scale-110" />
          </button>

          <!-- Loading Spinner (Shown when waiting) -->
          <div v-else class="relative w-24 h-24 flex items-center justify-center">
             <SkeletonLoader 
                show-spinner 
                spinner-class="w-12 h-12 text-white" 
                class="bg-transparent"
                :rounded="true"
             />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Play } from 'lucide-vue-next';
import SkeletonLoader from '@/components/Common/SkeletonLoader.vue';
import {MediaVideoLayoutElement} from 'vidstack/elements'
import 'vidstack/bundle';
import 'vidstack/player/styles/base.css';
import 'vidstack/player/styles/default/theme.css';
import 'vidstack/player/styles/default/layouts/video.css';

const props = defineProps<{
  url: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}>();

const player = ref<any>(null);
const videoStarted = ref(false);
const isWaiting = ref(false);

/**
 * Vidstack requires a specific format for unlisted Vimeo videos with hashes.
 */
const formattedSrc = computed(() => {
  if (!props.url) return '';
  
  // Check if it's a vimeo unlisted link with a hash pattern: vimeo.com/ID/HASH
  const vimeoUnlistedRegex = /vimeo\.com\/(\d+)\/([a-z0-9]+)/i;
  const match = props.url.match(vimeoUnlistedRegex);
  
  if (match) {
    const [, id, hash] = match;
    return `vimeo/${id}?hash=${hash}`;
  }
  
  return props.url;
});

const onVideoPlay = () => {
  isWaiting.value = true;
};

const onVideoWaiting = () => {
  isWaiting.value = true;
};

const onVideoStarted = () => {
  videoStarted.value = true;
  isWaiting.value = false;
};

const onVideoError = (event: any) => {
  console.error('Vidstack Player Error:', event);
  isWaiting.value = false;
  if (!videoStarted.value) {
    videoStarted.value = false;
  }
};

const handlePlayClick = async (e: Event) => {
  e.stopPropagation();
  if (player.value) {
    try {
      isWaiting.value = true;
      await player.value.play();
    } catch (error) {
      console.warn('Playback failed:', error);
      isWaiting.value = false;
    }
  }
};
</script>

<style scoped>
media-player {
  --video-brand: #ffffff;
  --media-primary-color: #ffffff;
  /* Ensure the background of the controls is visible */
  --video-controls-bg: rgba(0, 0, 0, 0.6);
}

media-player :deep(.vds-video) {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

/* 
  Force layout visibility in production. 
  Sometimes minification or CSP can hide these.
*/
media-player :deep(media-video-layout),
media-player :deep(.vds-layout) {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.8s ease;
}

.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}
</style>
