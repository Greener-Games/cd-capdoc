<template>
  <BaseCard
      class="h-85"
      :id="project.id"
      :title="project.title"
      :image="project.imageUrl"
      :color="project.accentColor"
      :index="index"
      animation-class="slide-in-from-bottom-4 duration-500"
      image-container-class="rounded-[1.5rem]"
      image-class="group-hover:scale-105 will-change-transform"
      :show-bottom-line="false"
      :show-hover-overlay="false"
      @select="handleClick"
  >
    <template #image-overlay>
      <!-- Bottom info section inside a rounded box -->
      <div
          class="absolute bottom-1.25 left-1.25 right-1.25 h-30 z-20 p-3 backdrop-blur-md rounded-2xl flex flex-row gap-4 items-start pointer-events-auto shadow-lg transition-colors duration-300"
          :class="isCurated ? 'bg-accent' : 'bg-card-dark/80'"
      >
        <!-- Column 1: Services and Title -->
        <div class="flex flex-col h-full flex-1 min-w-0">
          <!-- Services -->
          <p
              class="text-xs uppercase font-normal mt-1 transition-colors duration-300 line-clamp-2"
              :class="isCurated ? 'text-black' : 'text-muted'"
          >
            {{ project.services?.join(', ') || project.id }}
          </p>

          <!-- Title -->
          <h2
              class="font-normal text-lg line-clamp-2 uppercase transition-colors duration-300 mt-auto leading-none"
              :class="isCurated ? 'text-black' : 'text-white'"
          >
            {{ project.title }}
          </h2>
        </div>

        <!-- Column 2: Toggle Button -->
        <div class="w-11 aspect-square shrink-0">
          <button
              v-if="mode === 'build'"
              @click.stop="curatedStore.toggleCurated(project.id)"
              class="w-full h-full rounded-xl flex items-center justify-center transition-all duration-300 pointer-events-auto bg-white"
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
import {computed} from 'vue';
import BaseCard from './BaseCard.vue';
import {Project} from '../../types';
import {useCuratedStore, useViewStore} from '../../store';

const props = withDefaults(defineProps<{
  project: Project;
  index: number;
  mode?: 'explore' | 'build';
  isSelected?: boolean;
}>(), {
  mode: 'build',
  isSelected: undefined
});

const emit = defineEmits(['select']);
const viewStore = useViewStore();
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
