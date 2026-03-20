<template>
  <component
      :is="icon"
      class="inline-block shrink-0 fill-current text-current"
      :class="[sizeClass]"
      aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';

const props = withDefaults(defineProps<{
  icon: Component | string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto' | 'custom';
}>(), {
  size: 'auto'
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      // 10px -> 12px -> 14px -> 16px -> 18px
      return 'w-2.5 h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 2xl:w-4.5 2xl:h-4.5';
    case 'md':
      // 14px -> 16px -> 18px -> 20px -> 24px
      return 'w-3.5 h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6';
    case 'lg':
      // 16px -> 20px -> 24px -> 28px -> 32px
      return 'w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8';
    case 'xl':
      // 20px -> 24px -> 32px -> 40px -> 48px
      return 'w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12';
    case 'custom':
      return '';
    case 'auto':
    default:
      return 'w-full h-full';
  }
});
</script>