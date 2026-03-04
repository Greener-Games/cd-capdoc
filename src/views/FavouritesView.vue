<template>
  <div class="absolute inset-0 z-10">
    <DragScroll
      class="absolute inset-0 overflow-y-hidden"
      @scroll="handleScroll"
      :enable-wheel-scroll="true"
      v-slot="{ isDragging }"
    >
      <div
        class="h-full flex items-center px-[20vw] space-x-32"
        :style="{ width: `${currentProjects.length * 400 + 1000}px` }"
      >
        <CuratedCard
          v-for="(project, index) in currentProjects"
          :key="project.id"
          :id="project.id"
          :title="project.title"
          :description="project.description"
          :image="project.imageUrl"
          :color="project.accentColor"
          :index="index"
          :is-last="index === currentProjects.length - 1"
          :is-dragging="isDragging"
          @select="() => handleProjectSelect(project)"
        />
      </div>
    </DragScroll>

    <!-- Navigation Overlay -->
    <div class="fixed bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none z-50">
      <button
        @click="handleBack"
        class="text-caption text-white/40 hover:text-white pointer-events-auto flex items-center space-x-2 transition-colors cursor-pointer animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-both"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        <span>Back to Developer</span>
      </button>

      <div class="text-right pointer-events-auto group animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both">
        <div class="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40 mb-2">
          Exploring
        </div>
        <div class="flex items-center space-x-4">
          <input
            v-model="curatedTitle"
            type="text"
            class="bg-transparent border-b border-transparent hover:border-white/20 focus:border-white text-3xl font-light tracking-wide text-white group-hover:text-shadow-glow transition-all focus:outline-none text-right"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../store';
import { ArrowLeft } from 'lucide-vue-next';
import { Project, ViewState } from '../types';
import DragScroll from '../components/DragScroll.vue';
import CuratedCard from '../components/CuratedCard.vue';

const store = useAppStore();
const router = useRouter();

const currentProjects = computed(() => store.currentProjects);

const curatedTitle = computed({
  get: () => store.curatedTitle,
  set: (val) => store.curatedTitle = val
});

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  const maxScroll = target.scrollWidth - target.clientWidth;
  const progress = target.scrollLeft / maxScroll;
  store.setScrollProgress(progress);
};

const handleProjectSelect = (project: Project) => {
  store.setSelectedProject(project);
  router.push(`/project/${project.id}`);
};

const handleBack = () => {
  store.setView(ViewState.DEVELOPER);
  router.push('/developer');
};
</script>