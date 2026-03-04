<template>
  <div class="relative flex flex-col items-start w-full h-full overflow-hidden pt-safe-top pb-safe-bottom-footer px-safe-side z-10 space-y-8">

    <!-- Top area for buttons or pills -->
    <div class="flex items-center">
      <slot name="header-controls"></slot>
    </div>

    <!-- Title area -->
    <h2 :key="titleKey"
  class="font-gamechanger text-6xl uppercase text-white animate-in fade-in slide-in-from-bottom-2 duration-400 fill-mode-both"
    >
      <slot name="title"></slot>
    </h2>

    <!-- Main content area (DragScroll) -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  titleKey?: string | number;
}>();
</script>