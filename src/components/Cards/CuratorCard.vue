<template>
  <BaseCard
      :id="project.id"
      :title="project.title"
      :image="project.image"
      :color="project.accentColor"
      :index="index"
      :is-dragging="isDragging"
      card-class="w-full"
      image-size="small"
      aspect-ratio-class="aspect-square"
      image-container-class="rounded-[1.5rem] w-full h-full"
      image-class="group-hover:scale-110 will-change-transform"
      :show-bottom-line="false"
      :show-hover-overlay="false"
      @select="handleClick"
  >

    <template #image-overlay>
      <div
          class="absolute bottom-2 left-2 right-2 h-30 z-20 p-3 backdrop-blur-md rounded-2xl flex flex-row gap-4 items-start pointer-events-auto shadow-lg transition-colors duration-300"
          :class="isCurated ? 'bg-accent' : 'bg-card-dark/80'"
      >
        <div class="flex flex-col h-full flex-1 min-w-0">
          <p
              class="text-label mt-1 transition-colors duration-300 line-clamp-2"
              :class="isCurated ? 'text-black' : 'text-muted'"
          >
            {{ project.services?.join(', ') || project.id }}
          </p>

          <h2
              class="text-heading text-lg line-clamp-2 transition-colors duration-300 mt-auto"
              :class="isCurated ? 'text-black' : 'text-white'"
          >
            {{ project.title }}
          </h2>
        </div>

        <div class="w-11 aspect-square shrink-0">
          <button
              @click.stop="curatedStore.toggleCurated(project.id)"
              :aria-label="isCurated ? 'Remove from curation' : 'Add to curation'"
              class="w-full h-full rounded-xl flex items-center justify-center transition-all duration-300 bg-white hover:scale-105 active:scale-95"
              :class="[
                mode === 'build'
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-90 pointer-events-none'
              ]"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-6 h-6 text-black"
            >
              <line x1="5" y1="12" x2="19" y2="12"/>
              <line x1="12" y1="5" x2="12" y2="19"
                    class="transition-all duration-300 ease-in-out"
                    :class="isCurated ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'"/>
            </svg>
          </button>
        </div>
      </div>
    </template>

  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseCard from './BaseCard.vue';
import { Project } from '../../types';
import { useCuratedStore } from '../../store/curated';

const props = withDefaults(defineProps<{
  project: Project;
  index: number;
  isDragging?: boolean;
  mode?: 'explore' | 'build';
  isSelected?: boolean;
}>(), {
  isDragging: false,
  mode: 'build',
  isSelected: undefined
});

const emit = defineEmits<{
  (e: 'select', project: Project): void
}>();

const curatedStore = useCuratedStore();

const isCurated = computed(() => {
  if (props.mode === 'explore') return false;
  if (props.isSelected !== undefined) return props.isSelected;
  return curatedStore.curatedIds.includes(props.project.id);
});

const handleClick = () => {
  emit('select', props.project);
};
</script>
