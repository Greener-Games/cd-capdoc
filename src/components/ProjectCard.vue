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

    <!-- Bottom info section over the image -->
    <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none z-10" />

    <div class="absolute bottom-0 left-0 w-full p-6 z-20 flex justify-between items-end">
      <div class="flex flex-col gap-1 pr-4 flex-1 pointer-events-auto">
        <p class="text-[10px] font-bold tracking-wider uppercase text-white/90">
          {{ project.services?.join(', ') || project.id }}
        </p>
        <h2 class="font-medium text-white text-lg leading-tight line-clamp-2">
          {{ project.title }}
        </h2>
      </div>

      <button
        @click.stop="store.toggleFavourite(project.id)"
        class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 pointer-events-auto shadow-lg"
        :class="isFavourite ? 'bg-[#15A15B]' : 'bg-white'"
      >
        <component
          :is="isFavourite ? Check : Plus"
          class="w-5 h-5 transition-colors duration-300"
          :class="isFavourite ? 'text-white' : 'text-black'"
          :stroke-width="1.5"
        />
      </button>
    </div>

    <div
      class="absolute bottom-0 left-0 w-full h-1 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-30"
      :style="{ backgroundColor: project.accentColor }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Plus, Check } from 'lucide-vue-next';
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
