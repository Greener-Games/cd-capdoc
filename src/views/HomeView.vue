<template>
  <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
    <div
      v-motion
      :initial="{ opacity: 0, scale: 0.9, y: 20 }"
      :enter="{ opacity: 1, scale: 1, y: 0, transition: { duration: 1000, delay: 200 } }"
      class="text-center z-10"
    >
      <div
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1, transition: { duration: 1000, delay: 500 } }"
        class="text-[10px] font-bold tracking-[0.4em] uppercase mb-8 text-white/50"
      >
        Welcome To
      </div>

      <h1 class="text-h1 mb-6 text-white text-shadow-glow">
        Ethereal
      </h1>

      <p class="text-subtitle mb-16 max-w-xl mx-auto px-4 text-shadow">
        An immersive exploration of our capabilities, markets, and regional impact.
      </p>

      <button
        @click="handleEnter"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 800 } }"
        class="pointer-events-auto btn-primary inline-flex items-center space-x-3 group"
      >
        <span>Begin Journey</span>
        <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>

    <!-- Developer Access -->
    <button
      @click="handleDevAccess"
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, transition: { delay: 1500 } }"
      class="absolute bottom-8 right-8 pointer-events-auto flex items-center space-x-2 text-white/20 hover:text-white/60 transition-colors cursor-pointer group"
    >
      <span class="text-[9px] font-black tracking-[0.2em] uppercase">Dev Access</span>
      <Terminal class="w-3.5 h-3.5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ArrowRight, Terminal } from 'lucide-vue-next';

const router = useRouter();

const handleEnter = () => {
  router.push('/select');
};

const handleDevAccess = () => {
  router.push('/developer');
};
</script>