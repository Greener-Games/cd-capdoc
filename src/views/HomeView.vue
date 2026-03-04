<template>
  <div class="absolute inset-0 w-full h-full text-white overflow-hidden">
    <!-- Main Content -->
    <div class="absolute top-16 left-16 z-10 pointer-events-none">
      <h1 class="text-[120px] leading-[0.9] font-normal tracking-tighter text-shadow-glow animate-in fade-in slide-in-from-left-10 duration-[1000ms] fill-mode-both">
        Complex<br />to Clarity
      </h1>
    </div>

    <!-- Center Enter Button -->
    <div class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      <button
        @click.stop="handleEnter"
        class="w-32 h-32 rounded-full border border-white/40 flex items-center justify-center text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-white/5 transition-all duration-500 cursor-pointer pointer-events-auto hover:scale-105 active:scale-95 animate-in fade-in zoom-in-50 duration-[1000ms] delay-[400ms] fill-mode-both"
      >
        Enter
      </button>
    </div>

    <!-- Bottom Footer -->
    <div class="absolute bottom-10 left-16 right-16 flex justify-between items-end z-10 pointer-events-none text-[10px] font-bold tracking-[0.2em] uppercase text-white/60 animate-in fade-in slide-in-from-bottom-5 duration-[1000ms] delay-[800ms] fill-mode-both">
      <div>6 PROJECTS</div>
      <div class="absolute left-1/2 -translate-x-1/2 text-center text-white/40">COMPLEX → CLARITY</div>
      <div class="normal-case tracking-normal font-normal text-white/40">© 2026 Creative Design. Proud to be part of AtkinsRéalis Group Inc</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const handleEnter = () => {
  router.push('/select');
};
</script>