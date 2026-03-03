<template>
  <div class="relative flex flex-col w-full h-full overflow-hidden pt-32 z-10">
    <div class="px-12 md:px-24 mb-16 flex flex-col items-start z-10">
      <div class="flex items-center mb-8">
        <button
          @click="handleBack"
          class="flex items-center space-x-2 bg-white/5 backdrop-blur-md rounded-full px-6 py-2 border border-white/10 pointer-events-auto text-[9px] font-black tracking-[0.2em] uppercase text-white/40 hover:text-white transition-all duration-500 cursor-pointer"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>Back to Categories</span>
        </button>
      </div>

      <div class="min-h-[100px]">
        <div class="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40 mb-2">
          Exploring
        </div>
        <h2 class="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none text-white animate-in fade-in slide-in-from-bottom-2 duration-400 fill-mode-both">
          {{ store.currentCategoryData?.title || 'Timeline' }}
        </h2>
      </div>
    </div>

    <!-- Draggable/Scrollable Container -->
    <DragScroll
      class="flex items-center space-x-6 px-12 md:px-24 h-[55vh]"
      @scroll="handleScroll"
      :enable-wheel-scroll="true"
      v-slot="{ isDragging }"
    >
      <div
        v-for="(project, index) in currentProjects"
        :key="project.id"
        :style="{ animationDelay: `${index * 50}ms` }"
        @click="!isDragging && handleProjectSelect(project)"
        @mouseenter="store.setHoveredColor(project.accentColor)"
        @mouseleave="store.setHoveredColor(null)"
        class="group relative flex-shrink-0 w-[80vw] sm:w-[35vw] md:w-[22vw] h-full overflow-hidden rounded-[2.5rem] border border-white/5 transition-all duration-700 bg-zinc-950/40 animate-in fade-in zoom-in-90 slide-in-from-right-12 duration-[600ms] fill-mode-both"
      >
        <div class="absolute inset-0 z-0">
          <img
            :src="project.imageUrl"
            :alt="project.title"
            class="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-70 transition-all duration-1000 ease-out pointer-events-none"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
        </div>

        <div class="relative z-10 h-full p-10 flex flex-col justify-end text-left pointer-events-none">
          <div class="flex items-center space-x-4 mb-6">
            <span class="text-[10px] font-black tracking-widest text-white/30 group-hover:text-white transition-colors">
              Phase {{ String(index + 1).padStart(2, '0') }}
            </span>
            <div class="w-6 h-[1px] bg-white/10 group-hover:w-10 group-hover:bg-white transition-all duration-700" />
          </div>
          <h2 class="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-3 leading-tight group-hover:translate-x-1 transition-transform duration-700 text-white">
            {{ project.title }}
          </h2>
          <p class="text-[9px] font-bold tracking-widest uppercase opacity-30 group-hover:opacity-100 transition-opacity duration-700 text-white">
            {{ project.description }}
          </p>
        </div>

        <div
          class="absolute bottom-0 left-0 w-full h-1 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
          :style="{ backgroundColor: project.accentColor }"
        />
      </div>

      <div class="min-w-[15vw] flex-shrink-0 h-1" />
    </DragScroll>

    <div class="absolute bottom-12 left-12 md:left-24 right-12 md:right-24 flex items-center justify-between pointer-events-none opacity-20 hidden md:flex z-10">
      <div class="text-[9px] font-black tracking-[0.4em] uppercase">
        Explore sequential strategic assets
      </div>
      <div class="flex space-x-6">
        <div class="w-1 h-1 rounded-full bg-white animate-pulse" />
        <div class="w-1 h-1 rounded-full bg-white opacity-50" />
        <div class="w-1 h-1 rounded-full bg-white opacity-20" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../store';
import { ArrowLeft } from 'lucide-vue-next';
import { Project } from '../types';
import DragScroll from '../components/DragScroll.vue';

const store = useAppStore();
const router = useRouter();

const currentProjects = computed(() => store.currentProjects);

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  const maxScroll = target.scrollWidth - target.clientWidth;
  const progress = maxScroll > 0 ? target.scrollLeft / maxScroll : 0;
  store.setScrollProgress(progress);
};

const handleProjectSelect = (project: Project) => {
  store.setSelectedProject(project);
  router.push(`/project/${project.id}`);
};

const handleBack = () => {
  store.backToSelector();
  router.push('/select');
};
</script>

<style scoped>
</style>
