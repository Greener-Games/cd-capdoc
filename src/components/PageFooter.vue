<template>
  <div class="absolute bottom-10 left-16 right-16 flex justify-between items-end z-10 pointer-events-none text-[10px] font-bold tracking-[0.2em] uppercase text-white/60 animate-in fade-in slide-in-from-bottom-5 duration-[1000ms] delay-[800ms] fill-mode-both">
    <div>{{ count }} {{ label }}</div>
    <div class="absolute left-1/2 -translate-x-1/2 text-center text-white/40">COMPLEX → CLARITY</div>
    <div class="normal-case tracking-normal font-normal text-white/40">© 2026 Creative Design. Proud to be part of AtkinsRéalis Group Inc</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  count: number | string
  label: string
}>()
</script>