<template>
  <BaseLayout>
    <template #header-controls>
      <div class="flex items-center space-x-2 pointer-events-auto">
        <RoundedButton
            v-for="pill in pills"
            :key="pill.label"
            :label="pill.label"
            :active="activeMode === pill.mode"
            @click="activeMode = pill.mode"
        />
      </div>
      <div class="flex items-center ml-4">
        <RoundedButton @click="handleBack" icon-only>
          <template #icon>
            <X class="w-5 h-5 text-white" />
          </template>
        </RoundedButton>
      </div>
    </template>

    <template #title>
      Project Library
    </template>

    <!-- Search Input -->
    <div class="relative mb-16 group w-full">
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
    <div v-if="filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full isolate">
      <ProjectCard
        v-for="(project, index) in filteredProjects"
        :key="project.id"
        :project="project"
        :index="index"
        :mode="activeMode"
        :is-selected="isFavourite(project.id)"
        @select="handleSelectProject"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-32 w-full">
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
  </BaseLayout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useViewStore, useDataStore, useFavoriteStore } from '../store';
import { Search, X, Play, Plus, Edit3 } from 'lucide-vue-next';
import ProjectCard from '../components/ProjectCard.vue';
import RoundedButton from '../components/RoundedButton.vue';
import BaseLayout from "@/Layouts/BaseLayout.vue";
import { Project, ViewState } from '../types';

const viewStore = useViewStore();
const dataStore = useDataStore();
const favoriteStore = useFavoriteStore();
const router = useRouter();

const activeMode = ref<'explore' | 'build'>('explore');

onMounted(() => {
  favoriteStore.resetCurator();
});

watch(activeMode, () => {
  favoriteStore.resetCurator();
});

const pills = [
  { label: 'Explore', mode: 'explore' },
  { label: 'Build', mode: 'build' }
] as const;

const searchQuery = computed({
  get: () => dataStore.searchQuery,
  set: (val) => dataStore.searchQuery = val
});

const curatedTitle = computed({
  get: () => favoriteStore.curatedTitle,
  set: (val) => favoriteStore.curatedTitle = val
});

const favouriteIds = computed(() => favoriteStore.favouriteIds);

const filteredProjects = computed(() => {
  if (!searchQuery.value.trim()) {
    return dataStore.flattenedAllProjects;
  }
  const query = searchQuery.value.toLowerCase();
  return dataStore.flattenedAllProjects.filter(p =>
    p.title.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query) ||
    p.id.toLowerCase().includes(query)
  );
});

const handleBack = () => {
  favoriteStore.resetCurator();
  const prevView = viewStore.prevView;
  viewStore.setView(prevView);

  if (prevView === ViewState.LANDING) {
    router.push('/');
  } else if (prevView === ViewState.SELECTOR) {
    router.push('/select');
  } else if (prevView === ViewState.TIMELINE) {
    router.push(`/timeline/${dataStore.filterType}/${dataStore.activeCategoryId}`);
  } else if (prevView === ViewState.DETAIL) {
    router.push(`/project/${dataStore.selectedProject?.id}`);
  } else if (prevView === ViewState.FAVOURITES) {
    router.push('/favourites');
  } else {
    router.push('/');
  }
};

const handleLaunchCurated = () => {
  viewStore.setView(ViewState.FAVOURITES);
  router.push('/favourites');
};

const handleSelectProject = (project: Project) => {
  if (activeMode.value === 'build') {
    favoriteStore.toggleFavourite(project.id);
  } else {
    favoriteStore.resetCurator();
    dataStore.setSelectedProject(project);
    router.push(`/project/${project.id}`);
  }
};

const isFavourite = (id: string) => favoriteStore.favouriteIds.includes(id);
</script>