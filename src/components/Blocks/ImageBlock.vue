<template>
  <div 
    v-reveal 
    class="relative w-full h-[70vh] overflow-hidden transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) opacity-0 translate-y-10 reveal:opacity-100 reveal:translate-y-0"
  >
    <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${url})` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  url: string;
  alt?: string;
}>();
</script>
