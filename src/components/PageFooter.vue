<template>
  <div class="absolute layout-footer  pb-4 flex justify-between items-end z-10 pointer-events-none text-[10px] font-bold tracking-[0.2em] uppercase text-white/60">
    <!-- Dynamic part: always animates (with delay on initial load if desired, but here we just keep the animation logic as it's unmounted/remounted) -->
    <div
        class="animate-in fade-in slide-in-from-bottom-5 duration-[1000ms] fill-mode-both"
        :class="[!hasFooterAnimated ? 'delay-[800ms]' : 'delay-0']"
        :key="`${count}-${label}`"
    >
      {{ count }} {{ label }}
    </div>

    <!-- Static parts: only animate on first load -->
    <div
        class="absolute left-1/2 -translate-x-1/2 text-center text-white/40"
        :class="[!hasFooterAnimated ? 'animate-in fade-in slide-in-from-bottom-5 duration-[1000ms] delay-[800ms] fill-mode-both' : '']"
    >
      COMPLEX → CLARITY
    </div>

    <div
        class="normal-case tracking-normal font-normal text-white/40"
        :class="[!hasFooterAnimated ? 'animate-in fade-in slide-in-from-bottom-5 duration-[1000ms] delay-[800ms] fill-mode-both' : '']"
    >
      © 2026 Creative Design. Proud to be part of AtkinsRéalis Group Inc
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from 'vue';
import {useAppStore} from '../store';

const props = defineProps<{
  count: number | string
  label: string
}>()

const store = useAppStore();
const hasFooterAnimated = computed(() => store.hasFooterAnimated);

onMounted(() => {
  if (!hasFooterAnimated.value) {
    // 800ms delay + 1000ms duration
    setTimeout(() => {
      store.setHasFooterAnimated(true);
    }, 1800);
  }
});
</script>