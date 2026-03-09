<template>
  <BaseLayout :disable-padding-bottom="true">
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
    </template>

    <template #title>
      Project Library
    </template>

    <template #title-right>
      <div class="group w-full max-w-100 flex items-center bg-white/10 rounded-full px-4 h-12 transition-all">

        <div class="flex items-center pointer-events-none mr-3">
          <Icon :icon="Magnifying" size="md" class="scale-x-[-1]"/>
        </div>

        <input
            v-model="searchQuery"
            type="text"
            placeholder="Search Library"
            class="flex-1 bg-transparent text-sm text-white placeholder-white focus:outline-none font-light"
            autofocus
        />

        <div v-if="searchQuery" class="flex items-center ml-2">
          <button @click="searchQuery = ''" class="text-white hover:opacity-70 transition-opacity">
            <X class="w-4 h-4 text-white"/>
          </button>
        </div>

      </div>
    </template>

    <!-- Scrollable Content Area -->
    <div class="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-none pb-8 scroll-smooth">
      <!-- Grid Results -->
      <div v-if="filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full isolate">
        <CuratorCard
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
    </div>

    <!-- Bottom Fixed Curated Journey Bar (only in Build Mode) -->
    <div v-if="activeMode === 'build' && favouriteIds.length > 0" class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] drop-shadow-2xl">
      <div class="bg-white rounded-full p-2 flex items-center shadow-2xl space-x-6 min-w-150 border border-white/10 backdrop-blur-md">
        <div class="bg-accent text-black w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ml-2">
          {{ favouriteIds.length }}
        </div>

        <div class="grow flex items-center space-x-2">
          <input
              v-model="curatedTitle"
              type="text"
              class="bg-transparent text-black text-sm font-bold uppercase focus:outline-none w-full placeholder-black/40 selection:bg-accent selection:text-black"
              placeholder="MY PRESENTATION"
          />
          <Edit3 class="w-4 h-4 text-black shrink-0" />
        </div>

        <button
            @click="handleLaunchCurated"
            class="bg-accent hover:bg-accent-hover text-black px-6 py-3 rounded-full text-[11px] font-bold uppercase transition-colors shrink-0"
        >
          Present Projects
        </button>
      </div>
    </div>

  </BaseLayout>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {useDataStore, useFavoriteStore, useViewStore, useProjectStore} from '../store';
import {Edit3, Search, X} from 'lucide-vue-next';
import CuratorCard from '../components/Cards/CuratorCard.vue';
import RoundedButton from '../components/Common/RoundedButton.vue';
import BaseLayout from "@/Layouts/BaseLayout.vue";
import {Project, ViewState} from '../types';
import Magnifying from "@/assets/icons/Magnifying.svg";
import Icon from "@/components/Common/Icon.vue";

const viewStore = useViewStore();
const dataStore = useDataStore();
const favoriteStore = useFavoriteStore();
const projectStore = useProjectStore();
const router = useRouter();

const activeMode = ref<'explore' | 'build'>('explore');

onMounted(() => {
  favoriteStore.resetCurator();
});

watch(activeMode, () => {
  favoriteStore.resetCurator();
});

const pills = [
  {label: 'Explore', mode: 'explore'},
  {label: 'Build', mode: 'build'}
] as const;

const searchQuery = computed({
  get: () => projectStore.searchQuery,
  set: (val) => projectStore.setSearchQuery(val)
});

const curatedTitle = computed({
  get: () => favoriteStore.curatedTitle,
  set: (val) => favoriteStore.curatedTitle = val
});

const favouriteIds = computed(() => favoriteStore.favouriteIds);

const filteredProjects = computed(() => {
  if (!searchQuery.value.trim()) {
    return projectStore.allProjects;
  }
  const query = searchQuery.value.toLowerCase();
  return projectStore.allProjects.filter(p =>
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
    router.push(`/project/${projectStore.selectedProject?.id}`);
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
    projectStore.setSelectedProject(project);
    router.push(`/project/${project.id}`);
  }
};

const isFavourite = (id: string) => favoriteStore.favouriteIds.includes(id);
</script>