<template>
  <div
    class="group cursor-pointer relative animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
    :style="{ animationDelay: `${index * 50}ms` }"
    @mouseenter="store.setHoveredColor(project.accentColor)"
    @mouseleave="store.setHoveredColor(null)"
    @click="handleClick"
  >
    <div class="absolute -top-3 -right-3 z-20 pointer-events-auto">
      <button
        @click.stop="store.toggleFavourite(project.id)"
        class="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors"
      >
        <Heart
          class="w-4 h-4 transition-colors"
          :class="isFavourite ? 'text-red-500 fill-red-500' : 'text-white/40 group-hover:text-white/60'"
        />
      </button>
    </div>

    <div class="glass-panel overflow-hidden h-full flex flex-col group-hover:bg-white/10 transition-colors duration-500">
      <div class="h-48 relative overflow-hidden">
        <div class="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
        <img
          :src="project.imageUrl"
          :alt="project.title"
          class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
        />
        <div
          class="absolute bottom-0 left-0 w-full h-1"
          :style="{ backgroundColor: project.accentColor }"
        ></div>
      </div>

      <div class="p-6 flex-grow flex flex-col">
        <div class="text-[9px] font-bold  uppercase text-white/40 mb-2">
          {{ project.id }}
        </div>
        <h3 class="text-xl font-light text-white mb-2">{{ project.title }}</h3>
        <p class="text-xs text-white/50 line-clamp-2 flex-grow">
          {{ project.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Heart } from 'lucide-vue-next';
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