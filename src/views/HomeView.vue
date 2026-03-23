<template>
  <div class="relative w-full h-full text-white overflow-hidden pt-safe-top pb-safe-bottom px-safe-side z-10">

    <!-- Inner container that matches the exact content area after padding -->
    <div class="relative w-full h-full">
      <!-- Main Content -->
      <div class="z-10 pointer-events-none mt-8 md:mt-16">
        <h1 class="text-display text-[70px] xl:text-[120px] animate-in fade-in slide-in-from-left-10 duration-1000 fill-mode-both">
          Complex<br />
          to Clarity
        </h1>
      </div>

      <!-- Center Enter Button -->
      <div class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <button
            @click.stop="handleEnter"
            class="text-heading font-bienvenue w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full border border-white flex items-center justify-center font-bold cursor-pointer pointer-events-auto
            transition-all duration-500 animate-in fade-in zoom-in-50 duration-1000 delay-400 fill-mode-both hover:bg-white hover:text-black"
        >
          Enter
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useAppNavigation } from '../composables/useAppNavigation';

const { goToCategorySelect } = useAppNavigation();

const handleEnter = () => {
  goToCategorySelect('capabilities');
};
</script>