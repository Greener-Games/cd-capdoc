<template>
  <div class="relative w-full h-full text-white overflow-hidden pt-safe-top pb-safe-bottom px-safe-side z-10">

    <!-- Inner container that matches the exact content area after padding -->
    <div class="relative w-full h-full">
      <!-- Main Content -->
      <div class="z-10 pointer-events-none mt-8 md:mt-16">
        <h1 class="text-[80px] md:text-[120px] leading-[0.9] font-normal tracking-tighter text-white animate-in fade-in slide-in-from-left-10 duration-[1000ms] fill-mode-both">
          Complex<br />to Clarity
        </h1>
      </div>

      <!-- Center Enter Button -->
      <div class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <button
            @click.stop="handleEnter"
            class="w-32 h-32 rounded-full border border-white/40 flex items-center justify-center text-[11px] font-bold tracking-[0.2em] pl-[0.2em] uppercase hover:bg-white/5 transition-all duration-500 cursor-pointer pointer-events-auto hover:scale-105 active:scale-95 animate-in fade-in zoom-in-50 duration-[1000ms] delay-[400ms] fill-mode-both"
        >
          Enter
        </button>
      </div>
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