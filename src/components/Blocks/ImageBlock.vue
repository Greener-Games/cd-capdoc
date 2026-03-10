<template>
  <div class="relative w-[100vw] h-[70vh] left-1/2 -translate-x-1/2 overflow-hidden">
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
