<template>
  <BaseLayout>
    <template #header-controls>
      <RoundedButton @click="goBack" icon-only>
        <template #icon>
          <Icon :icon="Arrow" size="md" class="scale-x-[-1] text-white" />
        </template>
      </RoundedButton>

    </template>

    <template #title>
      <template v-if="view === ViewState.CURATED">
        {{ curatedStore.curatedTitle || 'Curated' }}
      </template>
      <template v-else>
        {{ currentCategoryData?.title || 'Projects' }}
      </template>
    </template>

    <!-- Draggable/Scrollable Container -->
    <DragScroll
        class="w-full grow min-h-0"
        content-class="items-stretch h-full"
        @scroll="handleScroll"
        :enable-wheel-scroll="true"
        v-slot="{ isDragging }"
    >
      <TransitionGroup 
        name="card-list" 
        tag="div" 
        class="flex flex-row space-x-grid h-full"
        appear
      >
        <ProjectCard
            v-for="(project, index) in displayedProjects"
            :key="project.id"
            :project="project"
            :index="index"
            :is-dragging="isDragging"
            @select="handleProjectSelect"
        />
      </TransitionGroup>
    </DragScroll>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {useCuratedStore} from '../store';
import {Project, ViewState} from '../types';
import { useAppView } from '../composables/useAppView';
import { useScroll } from '../composables/useScroll';
import { useAppNavigation } from '../composables/useAppNavigation';
import DragScroll from '../components/Common/DragScroll.vue';
import ProjectCard from '../components/Cards/ProjectCard.vue';
import BaseLayout from "@/components/Layouts/BaseLayout.vue";
import RoundedButton from "@/components/Common/RoundedButton.vue";
import Icon from '../components/Common/Icon.vue';
import { useProjectData } from '../composables/useProjectData';
import { useImagePreloader } from '../composables/useImagePreloader';
import Arrow from '@/assets/icons/Arrow.svg';

const curatedStore = useCuratedStore();

const { view } = useAppView();
const { handleScroll } = useScroll();
const { goBack, goToProject } = useAppNavigation();
const { currentProjects, currentCategoryData } = useProjectData();
const { preloadImages } = useImagePreloader();

// Staged data for smooth out-in staggering
const displayedProjects = ref([...currentProjects.value]);

watch(currentProjects, async (newData) => {
  const currentCount = displayedProjects.value.length;
  displayedProjects.value = [];

  const images = newData.map(p => p.image);
  preloadImages(images);

  const exitDelay = (currentCount * 20) + 700;

  setTimeout(() => {
    displayedProjects.value = newData;
  }, exitDelay);
}, { deep: true, immediate: true });
const handleProjectSelect = (project: Project) => {
  goToProject(project.id);
};
</script>
