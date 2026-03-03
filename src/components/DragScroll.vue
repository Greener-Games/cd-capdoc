<template>
  <div
    ref="containerRef"
    @mousedown="handleMouseDown"
    @mouseleave="handleMouseLeave"
    @mouseup="handleMouseUp"
    @mousemove="handleMouseMove"
    @wheel="handleWheel"
    :class="[
      isCurrentlyDragging ? 'cursor-grabbing' : 'cursor-grab',
      'overflow-x-auto scrollbar-none select-none'
    ]"
  >
    <slot :is-dragging="isCurrentlyDragging" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  enableWheelScroll?: boolean;
}>();

const containerRef = ref<HTMLElement | null>(null);

const isDragging = ref(false);
const isCurrentlyDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);
const dragThreshold = 5;

const handleMouseDown = (e: MouseEvent) => {
  if (!containerRef.value) return;
  isDragging.value = true;
  startX.value = e.pageX - containerRef.value.offsetLeft;
  scrollLeft.value = containerRef.value.scrollLeft;
};

const handleMouseLeave = () => {
  isDragging.value = false;
  isCurrentlyDragging.value = false;
};

const handleMouseUp = () => {
  isDragging.value = false;
  setTimeout(() => {
    isCurrentlyDragging.value = false;
  }, 50);
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !containerRef.value) return;

  const x = e.pageX - containerRef.value.offsetLeft;
  const walk = (x - startX.value) * 2; // Keep walk * 2 for faster scrolling

  if (Math.abs(walk) > dragThreshold) {
    isCurrentlyDragging.value = true;
  }

  if (isCurrentlyDragging.value) {
    e.preventDefault();
    containerRef.value.scrollLeft = scrollLeft.value - walk;
  }
};

const handleWheel = (e: WheelEvent) => {
  if (props.enableWheelScroll && containerRef.value) {
    e.preventDefault();
    containerRef.value.scrollLeft += e.deltaY;
  }
};
</script>
