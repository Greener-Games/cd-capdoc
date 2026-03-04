<template>
  <div v-if="view !== ViewState.LANDING" class="fixed top-12 left-12 right-12 flex justify-between items-center z-50 pointer-events-none md:top-24 md:left-24 md:right-24">
    <div class="flex items-center space-x-12">
      <div class="flex flex-col items-start gap-1">
        <span class="text-caption font-bold tracking-widest text-white">Creative Design</span>
        <button
          @click="handleGoHome"
          class="text-caption opacity-50 pointer-events-auto hover:opacity-100 transition-opacity cursor-pointer animate-in fade-in slide-in-from-top-4 duration-500"
        >
          <span>AtkinsRéalis</span>
        </button>
      </div>
    </div>

    <div class="flex items-center space-x-8 pointer-events-auto">
      <button
        @click="handleOpenSearch"
        class="relative flex items-center justify-center w-12 h-12 bg-white rounded-full transition-all cursor-pointer group animate-in fade-in zoom-in-90 duration-500 active:scale-95 hover:scale-105 shadow-lg"
      >
        <Search class="w-5 h-5 text-black" />
      </button>

      <div v-if="view === ViewState.FAVOURITES" class="flex items-center space-x-3 text-[10px] font-black tracking-widest text-white/40 uppercase">
        <Heart class="w-3 h-3 text-red-500 fill-red-500" />
        <span>{{ favouriteIds.length }} Curated</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../store';
import { ViewState } from '../types';
import { Search, Heart } from 'lucide-vue-next';

const router = useRouter();
const store = useAppStore();

const view = computed(() => store.view);
const favouriteIds = computed(() => store.favouriteIds);

const handleGoHome = () => {
  store.goHome();
  router.push('/');
};

const handleOpenSearch = () => {
  if (view.value !== ViewState.DEVELOPER) {
    store.setView(ViewState.DEVELOPER);
    router.push('/developer');
  }
};
</script>