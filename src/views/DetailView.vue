<template>
  <div class="absolute inset-0 z-10 overflow-y-auto scrollbar-none pointer-events-auto">
    <div class="min-h-[150vh] relative">
      <!-- Fixed Progress indicator -->
      <div class="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-4 z-50 mix-blend-difference">
        <div class="w-[1px] h-24 bg-white/10">
          <div
            class="w-full bg-white transition-all duration-300"
            :style="{ height: `${scrollProgress * 100}%` }"
          ></div>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-8 pt-[15vh] pb-32">
        <div class="animate-in fade-in slide-in-from-bottom-10 duration-[800ms] fill-mode-both">
          <button
            @click="handleBack"
            class="group flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors mb-8 cursor-pointer"
          >
            <ArrowLeft class="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform" />
          </button>

          <h1 class="text-5xl md:text-7xl font-light text-white mb-16 max-w-4xl">
            {{ project.title }}
          </h1>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24 items-start">
            <div class="md:col-span-6">
              <p class="text-base text-white/80 font-light">
                {{ project.description }}
              </p>
            </div>
            <div class="md:col-span-6 flex justify-end">
              <div class="grid grid-cols-2 gap-x-16 gap-y-4 text-[10px] uppercase text-white/50">
                <template v-if="project.services && project.services.length">
                  <div class="flex flex-col space-y-2">
                    <span v-for="service in project.services" :key="service">{{ service }}</span>
                  </div>
                </template>
                <template v-if="project.client">
                  <div class="flex flex-col space-y-2">
                    <span>{{ project.client }}</span>
                    <span v-if="project.year">{{ project.year }}</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Dynamic Content Blocks -->
        <template v-if="project.contentBlocks && project.contentBlocks.length > 0">
          <div class="space-y-32 mb-32">
            <div v-for="block in project.contentBlocks" :key="block.id" class="w-full">
              <!-- Image Block -->
              <div v-if="block.type === 'image'" class="relative w-[100vw] h-[70vh] left-1/2 -translate-x-1/2 overflow-hidden">
                <div
                  class="absolute inset-0 bg-cover bg-center"
                  :style="{ backgroundImage: `url(${(block as any).url})` }"
                ></div>
              </div>

              <!-- Text Block -->
              <div v-else-if="block.type === 'text'" class="max-w-6xl mx-auto px-8">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
                  <div class="md:col-span-4">
                    <h3 v-if="(block as any).title" class="text-[10px] uppercase text-white/50 mb-6 font-medium">
                      {{ (block as any).title }}
                    </h3>
                  </div>
                  <div class="md:col-span-8">
                    <p class="text-sm md:text-base text-white/80 font-light whitespace-pre-line">
                      {{ (block as any).content }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Video Block -->
              <div v-else-if="block.type === 'video'" class="relative w-[100vw] h-[70vh] left-1/2 -translate-x-1/2 overflow-hidden bg-black flex items-center justify-center">
                <video
                  class="w-full h-full object-cover"
                  autoplay loop muted playsinline
                  :poster="(block as any).poster"
                >
                  <source :src="(block as any).url" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </template>

        <!-- Fallback Legacy View -->
        <template v-else>
          <!-- Parallax Image Area -->
          <div class="relative w-full h-[60vh] rounded-2xl overflow-hidden mb-24 group">
            <div
              class="absolute inset-[-10%] bg-cover bg-center transition-transform duration-1000 ease-out will-change-transform group-hover:scale-105"
              :style="{
                backgroundImage: `url(${project.imageUrl})`,
                transform: `translateY(${(scrollProgress - 0.5) * -50}px)`
              }"
            ></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          </div>

          <div class="max-w-4xl mx-auto">
            <p class="text-xl text-white/80 font-light mb-12">
              {{ project.longDescription }}
            </p>
          </div>
        </template>

        <!-- Navigation Actions -->
<!--
        <div class="flex items-center justify-between border-t border-white/10 pt-12 animate-in fade-in slide-in-from-bottom-5 duration-[800ms] delay-200 fill-mode-both">
          <button
            @click="handleBack"
            class="group flex items-center space-x-4 text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <div class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/40 transition-colors">
              <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span class="">Back to Timeline</span>
          </button>

          <div class="flex items-center space-x-6">
            <button
              @click.stop="toggleFavourite"
              class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-colors hover:bg-white/10 backdrop-blur-sm cursor-pointer"
              :class="{ 'bg-white/10': isFavourite }"
            >
              <Plus class="w-4 h-4 transition-colors" :class="isFavourite ? 'text-white' : 'text-white/40'" />
            </button>

            <button
              @click="handleNext"
              class="group flex items-center space-x-4 text-white hover:text-white transition-colors cursor-pointer"
            >
              <span class="">{{ isLastChapter ? 'Complete Journey' : 'Next Chapter' }}</span>
              <div
                class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all group-hover:scale-110"
                :style="{ backgroundColor: project.accentColor }"
              >
                <ArrowRight class="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
-->

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useViewStore, useDataStore, useFavoriteStore, useProjectStore } from '../store';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-vue-next';

const viewStore = useViewStore();
const dataStore = useDataStore();
const favoriteStore = useFavoriteStore();
const projectStore = useProjectStore();
const router = useRouter();

const project = computed(() => projectStore.selectedProject);
const isLastChapter = computed(() => projectStore.isLastChapter);
const isFavourite = computed(() => favoriteStore.favouriteIds.includes(project.value?.id || ''));

const scrollProgress = ref(0);

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  const maxScroll = target.scrollHeight - target.clientHeight;
  scrollProgress.value = target.scrollTop / maxScroll;
};

let observer: IntersectionObserver;

onMounted(() => {
  const container = document.querySelector('.overflow-y-auto');
  if (container) {
    container.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  const container = document.querySelector('.overflow-y-auto');
  if (container) {
    container.removeEventListener('scroll', handleScroll);
  }
});

const toggleFavourite = () => {
  if (project.value) {
    favoriteStore.toggleFavourite(project.value.id);
  }
};

const handleBack = () => {
  projectStore.setSelectedProject(null);

  if (viewStore.prevView === 'FAVOURITES' || viewStore.view === 'FAVOURITES') {
    viewStore.setView('FAVOURITES' as any);
    router.push('/favourites');
  } else if (viewStore.prevView === 'CURATOR' || viewStore.view === 'CURATOR') {
    viewStore.setView('CURATOR' as any);
    router.push('/curator');
  } else {
    viewStore.setView('TIMELINE' as any);
    router.push(`/timeline/${dataStore.filterType}/${dataStore.activeCategoryId}`);
  }
};

const handleNext = () => {
  projectStore.nextChapter();
  if (projectStore.selectedProject && projectStore.selectedProject.id !== project.value?.id) {
    router.push(`/project/${projectStore.selectedProject.id}`);
    const container = document.querySelector('.overflow-y-auto');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    handleBack();
  }
};
</script>