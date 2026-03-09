<template>
  <div class="relative w-full h-full text-white overflow-hidden pt-safe-top pb-safe-bottom px-safe-side z-10">

    <!-- Inner container that matches the exact content area after padding -->
    <div class="relative w-full h-full">
      <!-- Main Content -->
      <div class="z-10 pointer-events-none mt-8 md:mt-16">
        <h1 class="font-gamechanger text-[80px] md:text-[120px] font-normal text-white leading-none animate-in fade-in slide-in-from-left-10 duration-1000 fill-mode-both">
          Complex<br />
          to Clarity
        </h1>
      </div>

      <!-- Center Enter Button -->
      <div class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <button
            @click.stop="handleEnter"
            class="font-bienvenue text-xl w-32 h-32 rounded-full border border-white flex items-center justify-center font-bold cursor-pointer pointer-events-auto
            uppercase transition-all duration-500  animate-in fade-in zoom-in-50 duration-1000 delay-400 fill-mode-both"
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