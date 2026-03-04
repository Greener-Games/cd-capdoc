<template>
  <div class="relative flex flex-col w-full h-full overflow-hidden pt-safe-top pb-safe-bottom z-10">
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
      <CarouselCard
        v-for="(project, index) in currentProjects"
        :key="project.id"
        :id="project.id"
        :title="project.title"
        :subtitle="project.description"
        :image="project.imageUrl"
        :color="project.accentColor"
        :index="index"
        :is-dragging="isDragging"
        prefix="Phase "
        @select="() => handleProjectSelect(project)"
      />
    </DragScroll>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../store';
import { ArrowLeft } from 'lucide-vue-next';
import { Project } from '../types';
import DragScroll from '../components/DragScroll.vue';
import CarouselCard from '../components/CarouselCard.vue';

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
