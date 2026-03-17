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
        content-class="items-stretch space-x-6 h-full"
        @scroll="handleScroll"
        :enable-wheel-scroll="true"
        v-slot="{ isDragging }"
    >
      <ProjectCard
          v-for="(project, index) in currentProjects"
          :key="project.id"
          :project="project"
          :index="index"
          :is-dragging="isDragging"
          @select="handleProjectSelect"
      />
    </DragScroll>
  </BaseLayout>
</template>

<script setup lang="ts">
import {useCuratedStore} from '../store';
import {Project, ViewState} from '../types';
import { useAppView } from '../composables/useAppView';
import { useScroll } from '../composables/useScroll';
import { useAppNavigation } from '../composables/useAppNavigation';
import { useProjectData } from '../composables/useProjectData';
import DragScroll from '../components/Common/DragScroll.vue';
import ProjectCard from '../components/Cards/ProjectCard.vue';
import BaseLayout from "@/components/Layouts/BaseLayout.vue";
import RoundedButton from "@/components/Common/RoundedButton.vue";
import Icon from '../components/Common/Icon.vue';
import Arrow from '@/assets/icons/Arrow.svg';

const curatedStore = useCuratedStore();

const { view } = useAppView();
const { handleScroll } = useScroll();
const { goBack, goToProject } = useAppNavigation();
const { currentProjects, currentCategoryData } = useProjectData();

const handleProjectSelect = (project: Project) => {
  goToProject(project.id);
};
</script>
