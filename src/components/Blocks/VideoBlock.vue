<template>
  <div class="relative w-full h-[50vh] md:h-[70vh] overflow-hidden flex items-center justify-center">
    <!-- Vidstack Player -->
    <media-player
        ref="player"
        class="w-full h-full group/player border-none outline-none ring-0"
        :src="url"
        :poster="poster"
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
        <media-poster
            v-if="poster"
            class="vds-poster transition-opacity duration-1000 ease-out z-20"
            :src="poster"
            alt="Video Poster"
        />
      </media-provider>

      <!-- Custom Play Overlay -->
      <div 
          class="custom-overlay absolute inset-0 z-30 flex items-center justify-center bg-black/20 transition-all duration-700 pointer-events-none"
      >
        <!-- Play Button (Only visible when player NOT started and NOT currently trying to play/loading) -->
        <button 
            v-if="!isLoading"
            @click="handlePlayClick"
            class="play-button group/btn relative w-24 h-24 flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full pointer-events-auto cursor-pointer transition-all duration-500 hover:scale-110 hover:bg-white/20"
        >
          <div class="absolute inset-0 rounded-full bg-white/10 animate-ping opacity-20 group-hover/btn:hidden"></div>
          <Play class="w-8 h-8 text-white fill-white ml-1 transition-transform group-hover/btn:scale-110" />
        </button>
      </div>

      <!-- Default Vidstack Video Layout (Includes its own buffering indicator) -->
      <media-video-layout />
    </media-player>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Play } from 'lucide-vue-next';

const props = withDefaults(defineProps<{
  url: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}>(), {
  autoplay: false,
  loop: true,
  muted: true
});

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
  --video-bg: transparent; /* Changed from black to transparent */
  --video-controls-bg: rgba(0, 0, 0, 0.4);
}

/* Ensure no borders or outlines on the player component itself */
media-player,
media-player :deep(.vds-media),
media-player :deep(.vds-video) {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

/* Hide Poster when started */
media-player[data-started] .vds-poster {
  opacity: 0 !important;
  pointer-events: none;
}

/* Hide Custom Overlay when started */
media-player[data-started] .custom-overlay {
  opacity: 0 !important;
  pointer-events: none;
}

media-player :deep(.vds-video) {
  object-fit: cover; /* This makes the video fill its area perfectly without black bars */
  width: 100%;
  height: 100%;
}

/* Hide default controls until started */
media-player:not([data-started]) :deep(.vds-controls) {
  opacity: 0;
  visibility: hidden;
}

/* 
  Ensure Vidstack's built-in buffering indicator is themed correctly 
  and is the only one visible.
*/
media-player :deep(.vds-buffering-indicator) {
  --vds-buffering-indicator-color: #ffffff;
}
</style>
