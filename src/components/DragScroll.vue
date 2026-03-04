<template>
  <div
      ref="containerRef"
      @pointerdown="handlePointerDown"
      @pointerleave="handlePointerLeave"
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerUp"
      @pointermove="handlePointerMove"
      @click.capture="handleClick"
      @wheel="handleWheel"
      :class="[
      isCurrentlyDragging ? 'cursor-grabbing' : 'cursor-grab',
      'overflow-visible select-none touch-none w-full h-full'
    ]"
  >
    <!-- Added h-full here to pass the height down to your cards -->
    <div
        ref="trackRef"
        :class="[
        'flex w-max h-full',
        !isDragging ? 'transition-transform duration-75 ease-out' : '',
        contentClass
      ]"
    >
      <slot :is-dragging="isCurrentlyDragging" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue';

const props = defineProps<{
  enableWheelScroll?: boolean;
  contentClass?: string | string[] | Record<string, boolean>;
}>();

const emit = defineEmits<{
  (e: 'scroll', payload: { progress: number, x: number }): void
}>();

const containerRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);

const isDragging = ref(false);
const isCurrentlyDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);
const dragThreshold = 5;

let resizeObserver: ResizeObserver | null = null;

const updateTransform = (newX: number) => {
  if (!containerRef.value || !trackRef.value) return;

  const maxScroll = -(trackRef.value.scrollWidth - containerRef.value.clientWidth);

  // Clamp the translation so it doesn't scroll past the ends
  const clampedX = Math.max(maxScroll, Math.min(0, newX));

  scrollLeft.value = clampedX;
  trackRef.value.style.transform = `translateX(${clampedX}px)`;

  // Calculate and emit the progress (0 to 1)
  const progress = maxScroll < 0 ? clampedX / maxScroll : 0;
  emit('scroll', { progress, x: clampedX });
};

// Check if we need to adjust the scroll bounds when the container or track resizes
const handleResize = () => {
  // We just re-pass our current scrollLeft. updateTransform will clamp it
  // into the newly calculated maxScroll boundaries!
  updateTransform(scrollLeft.value);
};

onMounted(() => {
  if (containerRef.value && trackRef.value) {
    // Watch both the container and track for size changes
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.value);
    resizeObserver.observe(trackRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

const handlePointerDown = (e: PointerEvent) => {
  if (!containerRef.value || !trackRef.value) return;

  isDragging.value = true;
  startX.value = e.pageX;

  const transform = window.getComputedStyle(trackRef.value).transform;
  let currentX = 0;
  if (transform !== 'none') {
    currentX = new DOMMatrix(transform).m41;
  }
  scrollLeft.value = currentX;
};

const handlePointerLeave = () => {
  if (!isCurrentlyDragging.value) {
    isDragging.value = false;
  }
};

const handlePointerUp = (e: PointerEvent) => {
  if (containerRef.value && containerRef.value.hasPointerCapture(e.pointerId)) {
    containerRef.value.releasePointerCapture(e.pointerId);
  }
  isDragging.value = false;
  setTimeout(() => {
    isCurrentlyDragging.value = false;
  }, 50);
};

const handleClick = (e: MouseEvent) => {
  // If we are dragging, completely swallow the click event in the capture phase
  // so it never reaches the cards
  if (isCurrentlyDragging.value) {
    e.preventDefault();
    e.stopPropagation();
  }
};

const handlePointerMove = (e: PointerEvent) => {
  if (!isDragging.value || !containerRef.value || !trackRef.value) return;

  const currentX = e.pageX;
  const deltaX = currentX - startX.value;

  // Check if we passed the threshold to start actually dragging
  if (!isCurrentlyDragging.value && Math.abs(deltaX) > dragThreshold) {
    isCurrentlyDragging.value = true;
    // Capture pointer ONLY after drag threshold is met!
    containerRef.value.setPointerCapture(e.pointerId);
  }

  if (isCurrentlyDragging.value) {
    e.preventDefault();

    // Apply the delta to our tracked scroll value
    scrollLeft.value += deltaX;
    updateTransform(scrollLeft.value);

    // Reset startX to currentX so the next move event calculates a fresh delta!
    startX.value = currentX;
  }
};

const handleWheel = (e: WheelEvent) => {
  if (props.enableWheelScroll && trackRef.value) {
    e.preventDefault();
    const transform = window.getComputedStyle(trackRef.value).transform;
    let currentX = transform !== 'none' ? new DOMMatrix(transform).m41 : 0;

    updateTransform(currentX - e.deltaY);
  }
};

const resetScroll = () => {
  updateTransform(0);
};

defineExpose({
  resetScroll
});
</script>