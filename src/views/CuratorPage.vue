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
          <button @click="clearSearch" class="text-white hover:opacity-70 transition-opacity">
            <X class="w-4 h-4 text-white"/>
          </button>
        </div>
      </div>
    </template>

    <!-- Scrollable Content Area -->
    <div class="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-none pb-8 scroll-smooth">
      <div v-if="filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full isolate">
        <CuratorCard
            v-for="(project, index) in filteredProjects"
            :key="project.id"
            :project="project"
            :index="index"
            :mode="activeMode"
            :is-selected="isCurated(project.id)"
            card-class="w-full"
            @select="handleSelectProject"
        />
      </div>

      <div v-else class="text-center py-32 w-full">
        <div class="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6 text-white/20">
          <Search class="w-8 h-8" />
        </div>
        <h3 class="text-xl font-light text-white mb-2">No projects found</h3>
        <p class="text-white/40 font-light">
          Try adjusting your search terms or browse the library
        </p>
      </div>
    </div>

    <!-- FIXED SECTION START -->
    <div
        v-if="activeMode === 'build' && curatedIds.length > 0"
        class="fixed bottom-10 left-1/2 -translate-x-1/2 z-100 isolate drop-shadow-2xl"
    >
      <div class="bg-white rounded-full p-2 flex items-center shadow-2xl space-x-6 min-w-150 border border-white/10">

        <div class="bg-accent text-black w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ml-2">
          {{ curatedIds.length }}
        </div>

        <!-- Input Container with explicit isolation -->
        <div class="grow flex items-center space-x-2 relative isolate">
          <input
              v-model="curatedTitle"
              type="text"
              class="font-bienvenue relative z-20 w-full bg-transparent text-black text-sm font-bold uppercase focus:outline-none placeholder-black/40 selection:bg-zinc-900 selection:text-white"
              placeholder="MY PRESENTATION"
          />
          <Edit3 class="w-4 h-4 text-black shrink-0 relative z-20" />
        </div>

        <button
            @click="handleLaunchCurated"
            class="bg-accent hover:bg-accent-hover text-black px-6 py-3 rounded-full text-button font-bold shrink-0"
        >
          Present Projects
        </button>
      </div>
    </div>
    <!-- FIXED SECTION END -->

  </BaseLayout>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import {useDataStore, useCuratedStore} from '../store';
import {Edit3, Search, X} from 'lucide-vue-next';
import CuratorCard from '../components/Cards/CuratorCard.vue';
import RoundedButton from '../components/Common/RoundedButton.vue';
import BaseLayout from "@/components/Layouts/BaseLayout.vue";
import {Project} from '../types';
import Magnifying from "@/assets/icons/Magnifying.svg";
import Icon from "@/components/Common/Icon.vue";
import { useAppNavigation } from '../composables/useAppNavigation';
import { useProjectData } from '../composables/useProjectData';

const dataStore = useDataStore();
const curatedStore = useCuratedStore();
const { goToProject, launchCuratedPresentation } = useAppNavigation();

const activeMode = ref<'explore' | 'build'>('explore');

const { searchQuery, filteredProjects, clearSearch } = useProjectData();

onMounted(() => {
  curatedStore.resetCurator();
  clearSearch();
});

watch(activeMode, () => {
  curatedStore.resetCurator();
  clearSearch();
});

const pills = [
  {label: 'Explore', mode: 'explore'},
  {label: 'Build', mode: 'build'}
] as const;

const curatedTitle = computed({
  get: () => curatedStore.curatedTitle,
  set: (val) => curatedStore.curatedTitle = val
});

const curatedIds = computed(() => curatedStore.curatedIds);

const handleLaunchCurated = () => {
  launchCuratedPresentation();
};

const handleSelectProject = (project: Project) => {
  if (activeMode.value === 'build') {
    curatedStore.toggleCurated(project.id);
  } else {
    curatedStore.resetCurator();
    goToProject(project.id, { isExplore: true });
  }
};

const isCurated = (id: string) => curatedStore.curatedIds.includes(id);
</script>
