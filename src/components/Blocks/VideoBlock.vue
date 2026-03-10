<template>
  <div class="relative w-full h-[70vh] overflow-hidden bg-black flex items-center justify-center">
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
