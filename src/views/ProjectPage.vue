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
        {{ dataStore.currentCategoryData?.title || 'Timeline' }}
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
          :id="project.id"
          :title="project.title"
          :subtitle="project.description"
          :image="project.imageUrl"
          :color="project.accentColor"
          :index="index"
          :is-dragging="isDragging"
          prefix="Phase "
          :services="project.services"
          @select="() => handleProjectSelect(project)"
      />
    </DragScroll>
  </BaseLayout>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {useDataStore, useCuratedStore} from '../store';
import {Project, ViewState} from '../types';
import { useAppView } from '../composables/useAppView';
import { useScrollState } from '../composables/useScrollState';
import { useAppNavigation } from '../composables/useAppNavigation';
import DragScroll from '../components/Common/DragScroll.vue';
import ProjectCard from '../components/Cards/ProjectCard.vue';
import BaseLayout from "@/Layouts/BaseLayout.vue";
import RoundedButton from "@/components/Common/RoundedButton.vue";
import Icon from '../components/Common/Icon.vue';
import Arrow from '@/assets/icons/Arrow.svg';

const dataStore = useDataStore();
const curatedStore = useCuratedStore();

const { view } = useAppView();
const { setScrollProgress } = useScrollState();
const { goBack, goToProject } = useAppNavigation();

const currentProjects = computed(() => dataStore.currentProjects);

const handleScroll = (payload: { progress: number }) => {
  setScrollProgress(payload.progress);
};

const handleProjectSelect = (project: Project) => {
  goToProject(project.id);
};
</script>
