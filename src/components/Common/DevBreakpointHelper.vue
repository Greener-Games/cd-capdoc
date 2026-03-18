<template>
  <div
    v-if="isDev"
    class="fixed bottom-4 left-4 z-[9999] flex items-center space-x-2 rounded-full bg-black/80 px-3 py-1 font-mono text-[10px] font-bold text-white backdrop-blur-md border border-white/10 pointer-events-none select-none"
  >
    <div class="flex items-center space-x-1">
      <span class="text-accent">W:</span>
      <span>{{ width }}px</span>
    </div>
    <div class="h-3 w-[1px] bg-white/20"></div>
    <div class="flex items-center space-x-1">
      <span class="text-accent">BP:</span>
      <span class="sm:hidden text-white/60">xs</span>
      <span class="hidden sm:inline md:hidden">sm</span>
      <span class="hidden md:inline lg:hidden">md</span>
      <span class="hidden lg:inline xl:hidden">lg</span>
      <span class="hidden xl:inline 2xl:hidden">xl</span>
      <span class="hidden 2xl:inline">2xl</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isDev = import.meta.env.DEV;
const width = ref(window.innerWidth);

const updateWidth = () => {
  width.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});
</script>

<style scoped>
/* Ensure our helper is themed correctly if needed, but keeping it simple for now */
.text-accent {
  color: #ccff00;
}
</style>
