<template>
  <div
      class="relative flex flex-col items-start w-full h-full pt-safe-top z-10 gap-4 xl:gap-8"
      :class="[
          disablePaddingBottom ? 'pb-0' : 'pb-safe-bottom-footer',
          disablePaddingSide ? 'px-0' : 'px-safe-side'
      ]"
  >
    <!-- Top area for buttons or pills -->
    <div v-if="$slots['header-controls']" class="flex items-center" :class="[disablePaddingSide ? 'px-safe-side' : '']">
      <slot name="header-controls"></slot>
    </div>

    <!-- Title area -->
    <div class="w-full relative shrink-0" v-if="$slots['title'] || $slots['title-right']">
      <Transition name="fade-delayed" mode="out-in">
        <div
            :key="titleKey"
            class="w-full flex items-center justify-between gap-8"
            :class="[disablePaddingSide ? 'px-safe-side' : '']"
        >
          <h2 v-if="$slots['title']" class="text-display shrink-0">
            <slot name="title"></slot>
          </h2>

          <div class="grow flex justify-end">
            <slot name="title-right"></slot>
          </div>
        </div>
      </Transition>
    </div>

    <div v-if="$slots['header-bottom']" class="w-full" :class="[disablePaddingSide ? 'px-safe-side' : '']">
      <slot name="header-bottom"></slot>
    </div>

    <!-- Main content area -->
    <div class="relative flex-1 w-full min-h-0">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';

defineProps<{
  titleKey?: string | number;
  disablePaddingBottom?: boolean;
  disablePaddingSide?: boolean;
}>();

const slots = useSlots();
</script>
