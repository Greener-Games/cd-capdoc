<template>
  <div
    class="skeleton-shimmer"
    :class="[
      rounded ? 'rounded' : '',
    ]"
  >
    <div v-if="showSpinner" class="flex items-center justify-center h-full">
      <div
        class="rounded-full border-2 border-white/10 border-t-white/40 animate-spin"
        :class="spinnerClass"
      ></div>
    </div>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
/**
 * A reusable skeleton loader component with a shimmer effect.
 * Uses the global .skeleton-shimmer styles defined in main.css.
 */
interface Props {
  /** Whether the corners should be rounded (default: true) */
  rounded?: boolean;
  /** Whether to show a central spinner (useful for media containers) */
  showSpinner?: boolean;
  /** Custom classes for the spinner if showSpinner is true (e.g., 'w-12 h-12') */
  spinnerClass?: string;
}

withDefaults(defineProps<Props>(), {
  rounded: true,
  showSpinner: false,
  spinnerClass: 'w-10 h-10'
});
</script>

<style scoped>
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.skeleton-shimmer {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
}

.skeleton-shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.08),
    transparent
  );
  animation: shimmer 2s infinite;
}
</style>
