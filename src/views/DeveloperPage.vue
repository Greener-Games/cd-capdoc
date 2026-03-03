<template>
  <div class="absolute inset-0 z-20 overflow-y-auto scrollbar-none pointer-events-auto bg-black/90 backdrop-blur-3xl">
    <div class="max-w-7xl mx-auto px-8 py-24">
      <div class="flex items-center justify-between mb-16">
        <div>
          <h2 class="text-4xl font-light text-white mb-2">Library Search</h2>
          <p class="text-white/40 text-sm font-light">
            Search across all capabilities, markets, and regions
          </p>
        </div>

        <div class="flex items-center space-x-6">
          <button
            v-if="favouriteIds.length > 0"
            @click="handleLaunchCurated"
            class="flex items-center space-x-3 bg-white text-black px-6 py-3 rounded-full hover:bg-white/90 transition-colors group cursor-pointer"
          >
            <Play class="w-4 h-4" />
            <span class="text-[11px] font-bold tracking-widest uppercase">
              Launch Curated ({{ favouriteIds.length }})
            </span>
          </button>

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
          <div class="text-[10px] font-bold tracking-[0.2em] uppercase text-white/20">
            {{ filteredProjects.length }} Results
          </div>
        </div>
      </div>

      <!-- Curated Collection Title -->
      <div v-if="favouriteIds.length > 0" class="mb-16">
        <div class="glass-panel p-8 relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
          <div class="relative z-10 flex items-center justify-between">
            <div class="flex-grow max-w-2xl">
              <div class="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-4 flex items-center space-x-2">
                <Heart class="w-3 h-3 text-red-500 fill-red-500" />
                <span>Curated Journey Title</span>
              </div>
              <div class="flex items-center space-x-4">
                <input
                  v-model="curatedTitle"
                  type="text"
                  class="bg-transparent border-b border-white/20 text-3xl font-light text-white pb-2 focus:outline-none focus:border-white w-full transition-colors"
                  placeholder="Name your curated journey..."
                />
                <Edit3 class="w-5 h-5 text-white/20" />
              </div>
            </div>
            <div class="text-right">
              <div class="text-3xl font-light text-white mb-2">{{ favouriteIds.length }}</div>
              <div class="text-[10px] font-bold tracking-widest uppercase text-white/40">Projects</div>
            </div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../store';
import { Search, X, Play, Heart, Edit3 } from 'lucide-vue-next';
import ProjectCard from '../components/ProjectCard.vue';
import { Project, ViewState } from '../types';

const store = useAppStore();
const router = useRouter();

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