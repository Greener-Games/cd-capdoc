<template>
    <div
        @click="handleEnter"
        class="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group/bg"
    >
      <div class="text-center z-10 pointer-events-none">
        <h1 class="text-h1 mb-6 text-white text-shadow-glow animate-in fade-in zoom-in-50 duration-[800ms] fill-mode-both">
        Complex to clarity
      </h1>

      <p class="text-subtitle mb-16 max-w-xl mx-auto px-4 text-shadow animate-in fade-in slide-in-from-bottom-10 duration-[800ms] delay-[600ms] fill-mode-both">
        Creative Design
      </p>

        <div class="flex flex-col items-center space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-[1000ms] delay-[800ms] fill-mode-both">
        <span class="text-white/40 text-sm font-light tracking-[0.3em] uppercase animate-pulse">
          Click anywhere to begin
        </span>
          <ArrowRight class="w-5 h-5 text-white/20 group-hover/bg:translate-x-2 transition-transform duration-500" />
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ArrowRight, Terminal } from 'lucide-vue-next';

const router = useRouter();

const handleEnter = () => {
  router.push('/select');
};
</script>