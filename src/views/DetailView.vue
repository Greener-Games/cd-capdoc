<template>
  <BaseLayout v-if="project" :disable-padding-bottom="true">
    <!-- Main Scrollable Content Area -->
    <div class="w-full h-full overflow-y-auto scrollbar-none pointer-events-auto pb-safe-bottom-footer" @scroll="handleScroll">
      <!-- Replicated Header Logic inside scrollable area -->
      <div class="flex flex-col space-y-8 mb-16">
        <!-- Back Button -->
        <div class="flex items-center">
          <RoundedButton @click="goBack" icon-only>
            <template #icon>
              <Icon :icon="Arrow" size="md" class="scale-x-[-1] text-white" />
            </template>
          </RoundedButton>
        </div>

        <!-- Title -->
        <div class="w-full animate-in fade-in slide-in-from-bottom-2 duration-400 fill-mode-both">
          <h2 class="font-gamechanger text-6xl uppercase text-white leading-none">
            <span class="max-w-4xl block">{{ project.title }}</span>
          </h2>
        </div>

        <!-- Project Info / Highlights -->
        <div class="animate-in fade-in slide-in-from-bottom-10 duration-[800ms] fill-mode-both">
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
      </div>

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
        <div v-if="project.contentBlocks && project.contentBlocks.length > 0" class="mb-8">
          <BlockRenderer :blocks="project.contentBlocks" />
        </div>

        <!-- Inline Bottom Navigation -->
        <div class="flex items-center justify-center space-x-8 pt-8 border-t border-white/10">
          <RoundedButton
              @click="handlePrev"
              icon-only
              :disabled="!hasPrev"
              :class="{ 'opacity-20 cursor-not-allowed pointer-events-none': !hasPrev }"
          >
            <template #icon>
              <Icon :icon="Arrow" size="md" class="scale-x-[-1]" />
            </template>
          </RoundedButton>

          <div class="text-white/40 font-bienvenue text-xs uppercase tracking-widest font-bold">
            <span class="text-white">{{ currentIndex + 1 }}</span>
            <span class="mx-2">of</span>
            <span>{{ currentProjects.length }}</span>
          </div>

          <RoundedButton
              @click="handleNext"
              icon-only
              :disabled="!hasNext"
              :class="{ 'opacity-20 cursor-not-allowed pointer-events-none': !hasNext }"
          >
            <template #icon>
              <Icon :icon="Arrow" size="md" />
            </template>
          </RoundedButton>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useDataStore } from '../store';
import { useScroll } from '../composables/useScroll';
import { useAppNavigation } from '../composables/useAppNavigation';
import { useProjectData } from '../composables/useProjectData';
import BaseLayout from "@/components/Layouts/BaseLayout.vue";
import Arrow from "@/assets/icons/Arrow.svg";
import RoundedButton from "@/components/Common/RoundedButton.vue";
import Icon from "@/components/Common/Icon.vue";
import BlockRenderer from "@/components/Blocks/BlockRenderer.vue";

const dataStore = useDataStore();
const route = useRoute();
const { goBack, goToProject } = useAppNavigation();
const { scrollProgress, handleScroll } = useScroll();
const { currentProjects } = useProjectData();

const project = computed(() => dataStore.selectedProject);

const currentIndex = computed(() => {
  if (!project.value) return -1;
  return currentProjects.value.findIndex(p => p.id === project.value!.id);
});

const hasNext = computed(() => currentIndex.value !== -1 && currentIndex.value < currentProjects.value.length - 1);
const hasPrev = computed(() => currentIndex.value > 0);

const handleNext = () => {
  if (hasNext.value) {
    const nextProject = currentProjects.value[currentIndex.value + 1];
    goToProject(nextProject.id);
  }
};

const handlePrev = () => {
  if (hasPrev.value) {
    const prevProject = currentProjects.value[currentIndex.value - 1];
    goToProject(prevProject.id);
  }
};

// Scroll to top when project ID changes in route
watch(() => route.params.projectId, () => {
  const container = document.querySelector('.overflow-y-auto');
  if (container) {
    container.scrollTo({ top: 0, behavior: 'auto' });
  }
});
</script>
