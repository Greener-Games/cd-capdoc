<template>
  <div class="w-full structure-gap" :class="[forcePadding ? 'px-safe-side' : '']">
    <!-- Top area for buttons or pills (e.g., Back button) -->
    <div v-if="$slots['controls']" class="flex items-center">
      <slot name="controls"></slot>
    </div>

    <!-- Title area -->
    <div class="w-full relative shrink-0" v-if="$slots['title'] || $slots['title-right']">
      <Transition name="fade-delayed" mode="out-in">
        <div
            :key="titleKey"
            class="w-full flex items-center justify-between gap-8"
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

    <!-- Bottom area for metadata or extra info -->
    <div v-if="$slots['bottom']" class="w-full">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  titleKey?: string | number;
  forcePadding?: boolean;
}>();
</script>