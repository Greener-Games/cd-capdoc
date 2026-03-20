<template>
  <BaseCard
      :id="project.id"
      :title="project.title"
      :image="project.image"
      :color="project.accentColor"
      :index="index"
      :is-dragging="isDragging"
      image-size="medium"
      aspect-ratio-class="aspect-[97/51]"
      @select="handleClick"
  >
    <template #default="{ formattedTitle }">
      <div class="flex flex-row justify-between items-start text-left pointer-events-none h-8 md:h-20 xl:h-24 shrink-0 min-w-0 mt-1 lg:mt-2 pr-4" style="width: 0; min-width: 100%;">
        <div class="flex flex-col min-w-0 shrink max-w-[70%]">
          <h2 class="text-heading xl:text-xl 2xl:text-2xl hover-reveal line-clamp-2 md:line-clamp-3 whitespace-normal">
            {{ formattedTitle }}
          </h2>
        </div>

        <div v-if="project.services?.length" class="hidden lg:flex flex-col items-end text-right gap-1 max-w-[30%] pt-1">
          <span
              v-for="service in project.services"
              :key="service"
              class="text-label hover-reveal"
          >
            {{ service }}
          </span>
        </div>
      </div>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from './BaseCard.vue';
import { Project } from '../../types';

const props = withDefaults(defineProps<{
  project: Project;
  index: number;
  isDragging?: boolean;
}>(), {
  isDragging: false
});

const emit = defineEmits<{
  (e: 'select', project: Project): void
}>();

const handleClick = () => {
  emit('select', props.project);
};
</script>
