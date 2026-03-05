<template>
  <BaseLayout>
    <template #header-controls>
      <RoundedButton @click="handleBack" icon-only>
        <template #icon>
          <Icon :icon="Arrow" size="md" class="scale-x-[-1] text-white" />
        </template>
      </RoundedButton>

    </template>

    <template #title>
      {{ store.currentCategoryData?.title || 'Timeline' }}
    </template>

    <!-- Draggable/Scrollable Container -->
    <DragScroll
        class="w-full grow min-h-0"
        content-class="items-stretch space-x-6 h-full"
        @scroll="handleScroll"
        :enable-wheel-scroll="true"
        v-slot="{ isDragging }"
    >
      <CarouselCard
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
import {useRouter} from 'vue-router';
import {useAppStore} from '../store';
import {Project} from '../types';
import DragScroll from '../components/DragScroll.vue';
import CarouselCard from '../components/CarouselCard.vue';
import BaseLayout from "@/Layouts/BaseLayout.vue";
import RoundedButton from "@/components/RoundedButton.vue";
import Icon from '../components/Icon.vue';
import Arrow from '@/assets/icons/Arrow.svg';

const store = useAppStore();
const router = useRouter();

const currentProjects = computed(() => store.currentProjects);

const handleScroll = (payload: { progress: number }) => {
  store.setScrollProgress(payload.progress);
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

<style scoped>
</style>