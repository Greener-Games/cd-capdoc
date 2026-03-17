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
      return 'w-2.5 h-2.5 lg:w-4 lg:h-4'; // 8px -> 16px
    case 'md':
      return 'w-3 h-3 lg:w-5 lg:h-5'; // 10px -> 20px
    case 'lg':
      return 'w-4 h-4 lg:w-6 lg:h-6'; // 12px -> 24px
    case 'xl':
      return 'w-4 h-4 lg:w-8 lg:h-8'; // 16px -> 32px
    case 'custom':
      return '';
    case 'auto':
    default:
      return 'w-full h-full';
  }
});
</script>