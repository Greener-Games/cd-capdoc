<template>
  <div class="absolute inset-0 z-10">
    <div
      ref="scrollContainer"
      class="absolute inset-0 overflow-x-auto overflow-y-hidden no-scrollbar cursor-grab active:cursor-grabbing"
      @scroll="handleScroll"
      @wheel="handleWheel"
      @mousedown="startDragging"
      @mouseup="stopDragging"
      @mouseleave="stopDragging"
      @mousemove="onDrag"
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
            class="group w-80 cursor-pointer"
            @mouseenter="store.setHoveredColor(project.accentColor)"
            @mouseleave="store.setHoveredColor(null)"
            @click="handleProjectSelect(project)"
            v-motion
            :initial="{ opacity: 0, x: 100 }"
            :enter="{ opacity: 1, x: 0, transition: { duration: 800, delay: index * 100 } }"
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
                Phase {{ String(index + 1).padStart(2, '0') }}
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
    </div>

    <!-- Navigation Overlay -->
    <div class="fixed bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none z-50">
      <button
        @click="handleBack"
        class="text-caption text-white/40 hover:text-white pointer-events-auto flex items-center space-x-2 transition-colors cursor-pointer"
        v-motion
        :initial="{ opacity: 0, x: -20 }"
        :enter="{ opacity: 1, x: 0 }"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        <span>Back to Categories</span>
      </button>

      <div
        class="text-right pointer-events-auto group"
        v-motion
        :initial="{ opacity: 0, x: 20 }"
        :enter="{ opacity: 1, x: 0 }"
      >
        <div class="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40 mb-2">
          Exploring
        </div>
        <div class="text-3xl font-light tracking-wide text-white group-hover:text-shadow-glow transition-all">
          {{ store.currentCategoryData.title }}
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
import { Project } from '../types';

const store = useAppStore();
const router = useRouter();

const scrollContainer = ref<HTMLElement | null>(null);
const currentProjects = computed(() => store.currentProjects);

const isDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  const maxScroll = target.scrollWidth - target.clientWidth;
  const progress = target.scrollLeft / maxScroll;
  store.setScrollProgress(progress);
};

const handleWheel = (e: WheelEvent) => {
  if (scrollContainer.value) {
    e.preventDefault();
    scrollContainer.value.scrollLeft += e.deltaY;
  }
};

const startDragging = (e: MouseEvent) => {
  isDragging.value = true;
  startX.value = e.pageX - (scrollContainer.value?.offsetLeft || 0);
  scrollLeft.value = scrollContainer.value?.scrollLeft || 0;
};

const stopDragging = () => {
  isDragging.value = false;
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || !scrollContainer.value) return;
  e.preventDefault();
  const x = e.pageX - scrollContainer.value.offsetLeft;
  const walk = (x - startX.value) * 2;
  scrollContainer.value.scrollLeft = scrollLeft.value - walk;
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