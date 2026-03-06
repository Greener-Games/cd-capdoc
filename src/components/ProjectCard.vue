<template>
  <div
    class="group relative h-[350px] sm:h-[450px] shrink-0 transition-all duration-700 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both flex flex-col cursor-pointer overflow-hidden rounded-[1.5rem]"
    :style="{ animationDelay: `${index * 50}ms` }"
    @click="handleClick"
    @mouseenter="store.setHoveredColor(project.accentColor)"
    @mouseleave="store.setHoveredColor(null)"
  >
    <div class="absolute inset-0 z-0">
      <img
        :src="project.imageUrl"
        :alt="project.title"
        class="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 pointer-events-none"
      />
    </div>

    <!-- Bottom info section inside a rounded box -->
    <div
      class="absolute bottom-4 left-4 right-4 z-20 p-5 backdrop-blur-md rounded-2xl flex flex-col pointer-events-auto shadow-lg transition-colors duration-300"
      :class="isFavourite ? 'bg-[#DFFF00]' : 'bg-[#121212]/80'"
    >
      <div class="flex justify-between items-start w-full gap-4">

        <!-- Services -->
        <p
          class="text-xs tracking-wider uppercase font-medium leading-relaxed font-mono mt-1 transition-colors duration-300"
          :class="isFavourite ? 'text-black' : 'text-[#a0a0a0]'"
        >
          {{ project.services?.join(', ') || project.id }}
        </p>

        <!-- Toggle Button -->
        <button
          v-if="mode === 'build'"
          @click.stop="store.toggleFavourite(project.id)"
          class="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 pointer-events-auto bg-white"
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
            <!-- Horizontal line (always visible) -->
            <line x1="5" y1="12" x2="19" y2="12" />
            <!-- Vertical line (animates out when favourite) -->
            <line x1="12" y1="5" x2="12" y2="19"
                  class="transition-all duration-300 ease-in-out origin-center"
                  :class="isFavourite ? 'opacity-0 scale-y-0 -translate-y-2' : 'opacity-100 scale-y-100 translate-y-0'" />
          </svg>
        </button>
      </div>

      <!-- Title -->
      <h2
        class="font-medium text-xl leading-tight line-clamp-2 mt-4 uppercase tracking-wide transition-colors duration-300"
        :class="isFavourite ? 'text-black' : 'text-white'"
      >
        {{ project.title }}
      </h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Project } from '../types';
import { useAppStore } from '../store';

const props = withDefaults(defineProps<{
  project: Project;
  index: number;
  mode?: 'explore' | 'build';
}>(), {
  mode: 'build' // Default to build so toggle button is visible by default or we can keep it backward compatible
});

const emit = defineEmits(['select']);
const store = useAppStore();

const isFavourite = computed(() => store.favouriteIds.includes(props.project.id));

const handleClick = () => {
  emit('select', props.project);
};
</script>
