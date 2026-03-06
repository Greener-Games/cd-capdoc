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
    case 'sm': return 'w-4 h-4';
    case 'md': return 'w-5 h-5';
    case 'lg': return 'w-6 h-6';
    case 'xl': return 'w-8 h-8';
    case 'custom': return ''; // Applies no size classes so parent class wins
    case 'auto': return 'w-full h-full';
    default: return 'w-full h-full';
  }
});
</script>