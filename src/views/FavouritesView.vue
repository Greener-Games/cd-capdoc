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
        <div
          v-for="(project, index) in currentProjects"
          :key="project.id"
          class="relative flex-shrink-0"
        >
          <!-- Connection Line -->
          <div
            v-if="index < currentProjects.length - 1"
            class="absolute top-1/2 left-[100%] w-32 h-[1px] bg-gradient-to-r from-white/20 to-transparent -translate-y-1/2"
          ></div>

          <div
            class="group w-80 cursor-pointer animate-in fade-in slide-in-from-right-24 duration-[800ms] fill-mode-both"
            :style="{ animationDelay: `${index * 100}ms` }"
            @mouseenter="store.setHoveredColor(project.accentColor)"
            @mouseleave="store.setHoveredColor(null)"
            @click="!isDragging && handleProjectSelect(project)"
          >
            <!-- Timeline Node -->
            <div class="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div class="w-[1px] h-8 bg-white/20 mb-2 group-hover:bg-white/40 transition-colors"></div>
              <div
                class="w-3 h-3 rounded-full border-2 border-white/20 group-hover:scale-150 group-hover:border-white transition-all duration-300"
                :style="{ backgroundColor: project.accentColor }"
              ></div>
            </div>

            <!-- Content Card -->
            <div class="mt-4 glass-panel p-6 opacity-60 group-hover:opacity-100 group-hover:bg-white/10 transition-all duration-500 transform group-hover:-translate-y-4">
              <span class="text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block" :style="{ color: project.accentColor }">
                Curated Step {{ String(index + 1).padStart(2, '0') }}
              </span>
              <h3 class="text-2xl font-light text-white mb-3 tracking-wide">{{ project.title }}</h3>
              <p class="text-sm text-white/50 leading-relaxed font-light">
                {{ project.description }}
              </p>

              <!-- Image Reveal -->
              <div class="h-0 group-hover:h-48 overflow-hidden transition-all duration-500 mt-6 rounded-lg opacity-0 group-hover:opacity-100">
                <img
                  :src="project.imageUrl"
                  :alt="project.title"
                  class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
            </div>
          </div>
        </div>
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