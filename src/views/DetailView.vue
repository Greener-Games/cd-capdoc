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

      <div class="max-w-4xl mx-auto px-8 pt-[20vh] pb-32">
        <div
          v-motion
          :initial="{ opacity: 0, y: 40 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
        >
          <div class="flex items-center space-x-6 mb-8">
            <span
              class="text-caption"
              :style="{ color: project.accentColor }"
            >
              {{ project.id }}
            </span>
            <div class="h-[1px] flex-grow bg-white/10"></div>

            <button
              @click="store.toggleFavourite(project.id)"
              class="group/btn flex items-center space-x-3 cursor-pointer"
            >
              <span class="text-[9px] font-black tracking-widest uppercase text-white/40 group-hover/btn:text-white transition-colors">
                {{ isFavourite ? 'Curated' : 'Add to Curated' }}
              </span>
              <div
                class="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all group-hover/btn:border-white/30"
                :class="isFavourite ? 'bg-white/10' : ''"
              >
                <Heart
                  class="w-3.5 h-3.5 transition-colors"
                  :class="isFavourite ? 'text-red-500 fill-red-500' : 'text-white/40 group-hover/btn:text-white'"
                />
              </div>
            </button>
          </div>

          <h1 class="text-h2 text-white mb-12 text-shadow-glow leading-tight">
            {{ project.title }}
          </h1>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
            <div class="md:col-span-4">
              <div class="glass-panel p-6 sticky top-32">
                <div class="text-[9px] font-bold tracking-[0.2em] uppercase text-white/40 mb-4">
                  Overview
                </div>
                <p class="text-sm text-white/70 leading-relaxed font-light">
                  {{ project.description }}
                </p>
              </div>
            </div>
            <div class="md:col-span-8">
              <p class="text-xl text-white/80 leading-loose font-light mb-12">
                {{ project.longDescription }}
              </p>
            </div>
          </div>
        </div>

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

        <!-- Navigation Actions -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 200 } }"
          class="flex items-center justify-between border-t border-white/10 pt-12"
        >
          <button
            @click="handleBack"
            class="group flex items-center space-x-4 text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <div class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/40 transition-colors">
              <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span class="text-caption">Back to Timeline</span>
          </button>

          <button
            @click="handleNext"
            class="group flex items-center space-x-4 text-white hover:text-white transition-colors cursor-pointer"
          >
            <span class="text-caption">{{ isLastChapter ? 'Complete Journey' : 'Next Chapter' }}</span>
            <div
              class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all group-hover:scale-110"
              :style="{ backgroundColor: project.accentColor }"
            >
              <ArrowRight class="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../store';
import { ArrowLeft, ArrowRight, Heart } from 'lucide-vue-next';

const store = useAppStore();
const router = useRouter();

const project = computed(() => store.selectedProject);
const isLastChapter = computed(() => store.isLastChapter);
const isFavourite = computed(() => store.favouriteIds.includes(project.value?.id || ''));

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

const handleBack = () => {
  store.backToTimeline();
  if (store.view === 'FAVOURITES') {
    router.push('/favourites');
  } else if (store.view === 'DEVELOPER') {
    router.push('/developer');
  } else {
    router.push(`/timeline/${store.filterType}/${store.activeCategoryId}`);
  }
};

const handleNext = () => {
  store.nextChapter();
  if (store.selectedProject && store.selectedProject.id !== project.value?.id) {
    router.push(`/project/${store.selectedProject.id}`);
    const container = document.querySelector('.overflow-y-auto');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    handleBack();
  }
};
</script>