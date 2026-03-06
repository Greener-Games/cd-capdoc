<template>
  <div class="absolute inset-0 z-20 overflow-y-auto scrollbar-none pointer-events-auto bg-black/90 backdrop-blur-3xl">
    <div class="max-w-7xl mx-auto px-8 py-24">

      <!-- Top Toggle -->
      <div class="flex items-center space-x-2 mb-8">
        <button
          @click="activeMode = 'explore'"
          class="px-6 py-2 rounded-full text-[11px] font-bold uppercase transition-colors"
          :class="activeMode === 'explore' ? 'bg-[#1a1a1a] text-white/50 border border-white/10' : 'bg-transparent text-white/50 hover:text-white'"
        >
          Explore
        </button>
        <button
          @click="activeMode = 'build'"
          class="px-6 py-2 rounded-full text-[11px] font-bold uppercase transition-colors"
          :class="activeMode === 'build' ? 'bg-white text-black' : 'bg-[#1a1a1a] text-white/50 border border-white/10 hover:text-white'"
        >
          Build
        </button>
      </div>

      <div class="flex items-center justify-between mb-16">
        <div>
          <h2 class="text-5xl font-light text-white mb-2">Project Library</h2>
        </div>

        <div class="flex items-center space-x-6">
          <button
            @click="handleBack"
            class="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Search Input -->
      <div class="relative mb-16 group">
        <div class="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search class="w-6 h-6 text-white/40 group-focus-within:text-white transition-colors" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by keyword, project name, or capability..."
          class="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-20 pr-8 text-xl text-white placeholder-white/20 focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all font-light"
          autofocus
        />
        <div class="absolute inset-y-0 right-6 flex items-center">
          <div class="text-[10px] font-bold uppercase text-white/20">
            {{ filteredProjects.length }} Results
          </div>
        </div>
      </div>

      <!-- Grid Results -->
      <div v-if="filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProjectCard
          v-for="(project, index) in filteredProjects"
          :key="project.id"
          :project="project"
          :index="index"
          @select="handleSelectProject"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-32">
        <div class="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6 text-white/20">
          <Search class="w-8 h-8" />
        </div>
        <h3 class="text-xl font-light text-white mb-2">No projects found</h3>
        <p class="text-white/40 font-light">
          Try adjusting your search terms or browse the timeline
        </p>
      </div>
      <!-- Bottom Fixed Curated Journey Bar (only in Build Mode) -->
      <div v-if="activeMode === 'build' && favouriteIds.length > 0" class="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <div class="bg-white rounded-full p-2 flex items-center shadow-2xl space-x-6 min-w-[600px] border border-white/10">
          <div class="bg-[#ccff00] text-black w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ml-2">
            {{ favouriteIds.length }}
          </div>

          <div class="flex-grow flex items-center space-x-2">
            <input
              v-model="curatedTitle"
              type="text"
              class="bg-transparent text-black text-sm font-bold uppercase focus:outline-none w-full placeholder-black/40"
              placeholder="MY PRESENTATION"
            />
            <Edit3 class="w-4 h-4 text-black shrink-0" />
          </div>

          <button
            @click="handleLaunchCurated"
            class="bg-[#ccff00] hover:bg-[#b3e600] text-black px-6 py-3 rounded-full text-[11px] font-bold uppercase transition-colors shrink-0"
          >
            Present Projects
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../store';
import { Search, X, Play, Plus, Edit3 } from 'lucide-vue-next';
import ProjectCard from '../components/ProjectCard.vue';
import { Project, ViewState } from '../types';

const store = useAppStore();
const router = useRouter();

const activeMode = ref<'explore' | 'build'>('explore');

const searchQuery = computed({
  get: () => store.searchQuery,
  set: (val) => store.searchQuery = val
});

const curatedTitle = computed({
  get: () => store.curatedTitle,
  set: (val) => store.curatedTitle = val
});

const favouriteIds = computed(() => store.favouriteIds);

const filteredProjects = computed(() => {
  if (!searchQuery.value.trim()) {
    return store.flattenedAllProjects;
  }
  const query = searchQuery.value.toLowerCase();
  return store.flattenedAllProjects.filter(p =>
    p.title.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query) ||
    p.id.toLowerCase().includes(query)
  );
});

const handleBack = () => {
  store.setView(store.prevView);

  if (store.prevView === ViewState.LANDING) {
    router.push('/');
  } else if (store.prevView === ViewState.SELECTOR) {
    router.push('/select');
  } else if (store.prevView === ViewState.TIMELINE) {
    router.push(`/timeline/${store.filterType}/${store.activeCategoryId}`);
  } else if (store.prevView === ViewState.DETAIL) {
    router.push(`/project/${store.selectedProject?.id}`);
  } else if (store.prevView === ViewState.FAVOURITES) {
    router.push('/favourites');
  } else {
    router.push('/');
  }
};

const handleLaunchCurated = () => {
  store.setView(ViewState.FAVOURITES);
  router.push('/favourites');
};

const handleSelectProject = (project: Project) => {
  store.setSelectedProject(project);
  router.push(`/project/${project.id}`);
};
</script>