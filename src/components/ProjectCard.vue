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
          @click.stop="store.toggleFavourite(project.id)"
          class="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 pointer-events-auto bg-white"
        >
          <component
            :is="isFavourite ? Minus : Plus"
            class="w-6 h-6 transition-colors duration-300 text-black"
            :stroke-width="2.5"
          />
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
import { Plus, Minus } from 'lucide-vue-next';
import { Project } from '../types';
import { useAppStore } from '../store';

const props = defineProps<{
  project: Project;
  index: number;
}>();

const emit = defineEmits(['select']);
const store = useAppStore();

const isFavourite = computed(() => store.favouriteIds.includes(props.project.id));

const handleClick = () => {
  emit('select', props.project);
};
</script>
