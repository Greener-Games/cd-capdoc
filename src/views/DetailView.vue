<template>
  <BaseLayout v-if="project" :disable-padding-bottom="true">
    <template #header-controls>
      <RoundedButton @click="handleBack" icon-only>
        <template #icon>
          <Icon :icon="Arrow" size="md" class="scale-x-[-1] text-white" />
        </template>
      </RoundedButton>
    </template>

    <template #title>
      <span class="max-w-4xl block">{{ project.title }}</span>
    </template>

    <!-- Use the new slot for the highlights -->
    <template #header-bottom>
      <div class="animate-in fade-in slide-in-from-bottom-10 duration-[800ms] fill-mode-both mb-8">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
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
    </template>

    <!-- Main Scrollable Content Area -->
    <!-- Removed absolute inset-0 and pt-64 as BaseLayout flex handles it now -->
    <div class="w-full h-full overflow-y-auto scrollbar-none pointer-events-auto pb-32" @scroll="handleScroll">
      <div class="relative">
        <!-- Fixed Progress indicator -->
        <div class="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-4 z-50 mix-blend-difference">
          <div class="w-px h-24 bg-white/10">
            <div
                class="w-full bg-white transition-all duration-300"
                :style="{ height: `${scrollProgress * 100}%` }"
            ></div>
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
              <div v-else-if="block.type === 'text'">
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
      </div>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useViewStore, useDataStore, useCuratedStore, useProjectStore } from '../store';
import { ViewState } from '../types';
import BaseLayout from "@/Layouts/BaseLayout.vue";
import Arrow from "@/assets/icons/Arrow.svg";
import RoundedButton from "@/components/Common/RoundedButton.vue";
import Icon from "@/components/Common/Icon.vue";

const viewStore = useViewStore();
const dataStore = useDataStore();
const curatedStore = useCuratedStore();
const projectStore = useProjectStore();
const router = useRouter();

const project = computed(() => projectStore.selectedProject);
const isLastChapter = computed(() => projectStore.isLastChapter);
const isCurated = computed(() => curatedStore.curatedIds.includes(project.value?.id || ''));

const scrollProgress = ref(0);

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  const maxScroll = target.scrollHeight - target.clientHeight;
  scrollProgress.value = target.scrollTop / maxScroll;
};

const handleBack = () => {
  projectStore.setSelectedProject(null);

  if (viewStore.prevView === ViewState.CURATED || viewStore.view === ViewState.CURATED) {
    viewStore.setView(ViewState.CURATED);
    router.push('/curated');
  } else if (viewStore.view === 'CURATOR') {
    router.push('/curator');
  } else {
    router.push(`/timeline/${viewStore.filterType}/${viewStore.activeCategoryId}`);
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