<template>
  <div class="absolute inset-0 w-full h-full overflow-hidden bg-black">
    <video
      ref="videoRef"
      autoplay
      loop
      muted
      playsinline
      class="absolute inset-0 w-full h-full object-cover pointer-events-none"
    >
      <source :src="bgVideo" type="video/mp4" />
    </video>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import bgVideo from '@/assets/videos/CD-Background 1.mp4';

const videoRef = ref<HTMLVideoElement | null>(null);

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.playbackRate = 1.0;
  }
});
</script>

<style scoped>
video {
  /* Ensure no gray bars or weird scaling */
  min-width: 100%;
  min-height: 100%;
}
</style>
