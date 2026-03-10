<template>
  <ContentPage
      v-if="project"
      :title="project.title"
      :description="project.description"
      :blocks="project.contentBlocks"
      :metadata="projectMetadata"
      ref="contentPageRef"
  >
    <template #footer>
      <!-- Inline Bottom Navigation -->
      <div class="flex items-center justify-center space-x-8 pt-8 border-t border-white/10 px-safe-side">
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
    </template>
  </ContentPage>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDataStore } from '../store';
import { useScroll } from '../composables/useScroll';
import { useAppNavigation } from '../composables/useAppNavigation';
import { useProjectData } from '../composables/useProjectData';
import ContentPage from "@/components/Layouts/ContentPage.vue";
import Arrow from "@/assets/icons/Arrow.svg";
import RoundedButton from "@/components/Common/RoundedButton.vue";
import Icon from "@/components/Common/Icon.vue";
import { PageMetadata } from '../types';

const dataStore = useDataStore();
const route = useRoute();
const { goToProject } = useAppNavigation();
const { scrollProgress } = useScroll();
const { currentProjects } = useProjectData();
const contentPageRef = ref<any>(null);

const project = computed(() => dataStore.selectedProject);

const projectMetadata = computed<PageMetadata | undefined>(() => {
  if (!project.value) return undefined;
  
  const right: string[] = [];
  if (project.value.client) right.push(project.value.client);
  if (project.value.year) right.push(project.value.year);

  return {
    left: project.value.services || [],
    right: right
  };
});

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
  const container = contentPageRef.value?.scrollContainer;
  if (container) {
    container.scrollTo({ top: 0, behavior: 'auto' });
  }
});
</script>
