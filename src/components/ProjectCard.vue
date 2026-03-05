<template>
  <div
      class="group relative h-[300px] sm:h-[400px] shrink-0 transition-all duration-700 animate-in fade-in zoom-in-90 slide-in-from-bottom-4 duration-600 fill-mode-both flex flex-col cursor-pointer"
      :style="{ animationDelay: `${index * 50}ms` }"
      @click="handleClick"
      @mouseenter="store.setHoveredColor(project.accentColor)"
      @mouseleave="store.setHoveredColor(null)"
  >
    <div class="absolute top-4 right-4 z-20 pointer-events-auto">
      <button
        @click.stop="store.toggleFavourite(project.id)"
        class="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors"
      >
        <Plus
          class="w-4 h-4 transition-colors"
          :class="isFavourite ? 'text-white' : 'text-white/40 group-hover:text-white/60'"
        />
      </button>
    </div>

    <div class="relative w-full grow overflow-hidden border border-white/5 bg-zinc-950/40 rounded-3xl mb-4">
      <img
          :src="project.imageUrl"
          :alt="project.title"
          class="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 pointer-events-none"
      />
      <div class="absolute inset-0 pointer-events-none transition-opacity duration-700 opacity-0 group-hover:opacity-100 bg-black/20" />

      <div
          class="absolute bottom-0 left-0 w-full h-1 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20"
          :style="{ backgroundColor: project.accentColor }"
      />
    </div>

    <!-- Title layout similar to SelectionCard -->
    <div class="flex flex-col justify-start text-left pointer-events-none px-2 h-20 w-full">
      <h2 class="font-bienvenue font-white text-3xl uppercase transition-opacity duration-700 opacity-50 group-hover:opacity-100">
        {{ formattedTitle }}
      </h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Plus } from 'lucide-vue-next';
import { Project } from '../types';
import { useAppStore } from '../store';

const props = defineProps<{
  project: Project;
  index: number;
}>();

const emit = defineEmits(['select']);
const store = useAppStore();

const isFavourite = computed(() => store.favouriteIds.includes(props.project.id));

const formattedTitle = computed(() => {
  return props.project.title.toUpperCase().replace('&', 'AND');
});

const handleClick = () => {
  emit('select', props.project);
};
</script>
