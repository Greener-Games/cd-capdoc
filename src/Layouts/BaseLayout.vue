<template>
  <div
      class="relative flex flex-col items-start w-full h-full pt-safe-top px-safe-side z-10 space-y-8"
      :class="[disablePaddingBottom ? 'pb-0' : 'pb-safe-bottom-footer']"
  >
    <!-- Top area for buttons or pills -->
    <div class="flex items-center">
      <slot name="header-controls"></slot>
    </div>

    <!-- Title area -->
    <div :key="titleKey" class="w-full flex items-center justify-between gap-8 animate-in fade-in slide-in-from-bottom-2 duration-400 fill-mode-both">

      <h2 class="font-gamechanger text-6xl uppercase text-white leading-none shrink-0">
        <slot name="title"></slot>
      </h2>

      <div class="grow flex justify-end">
        <slot name="title-right"></slot>
      </div>

    </div>

    <!-- Main content area -->
    <div class="relative flex-1 w-full min-h-0">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  titleKey?: string | number;
  disablePaddingBottom?: boolean;
}>();
</script>