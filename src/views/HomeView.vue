<template>
    <div
        @click="handleEnter"
        class="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group/bg"
    >
      <div class="text-center z-10 pointer-events-none">
        <h1
          v-motion
          :initial="{ opacity: 0, scale: 0.5 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 800, type: 'spring', stiffness: 100 } }"
          class="text-h1 mb-6 text-white text-shadow-glow"
      >
        Complex to clarity
      </h1>

      <p
          v-motion
          :initial="{ opacity: 0, y: 40 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 600 } }"
          class="text-subtitle mb-16 max-w-xl mx-auto px-4 text-shadow"
      >
        Creative Design
      </p>

        <div
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 800, duration: 1000 } }"
            class="flex flex-col items-center space-y-4"
        >
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