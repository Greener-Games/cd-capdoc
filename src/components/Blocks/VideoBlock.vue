<template>
  <div class="relative w-[100vw] h-[70vh] left-1/2 -translate-x-1/2 overflow-hidden bg-black flex items-center justify-center">
    <video
        class="w-full h-full object-cover"
        autoplay loop muted playsinline
        :poster="poster"
    >
      <source :src="url" type="video/mp4" />
    </video>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  url: string;
  poster?: string;
}>();
</script>
