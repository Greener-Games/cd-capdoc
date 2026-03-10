<template>
  <div class="relative w-full h-[70vh] overflow-hidden">
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
