<template>
  <div class="relative w-screen h-screen overflow-hidden bg-black selection:bg-white selection:text-black">
    <!-- Full Bleed 3D Background -->
    <div class="fixed inset-0 z-0">
      <Canvas3D />
    </div>

    <!-- Frosted Glass Overlay -->
    <div class="fixed inset-0 z-1 pointer-events-none backdrop-blur-[100px] bg-black/40 opacity-50">
      <div class="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style="background-image: url('https://grainy-gradients.vercel.app/noise.svg')"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none"></div>
    </div>

    <main class="relative z-10 w-full h-full">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <DevToggle />

    <!-- Global Navigation -->
    <div class="fixed top-8 left-8 right-8 flex justify-between items-center z-50 pointer-events-none">
      <button
        @click="handleGoHome"
        class="text-caption opacity-50 pointer-events-auto hover:opacity-100 transition-opacity flex items-center space-x-2 cursor-pointer animate-in fade-in slide-in-from-top-4 duration-500"
      >
        <span>AtkinsRéalis</span>
      </button>

      <div class="flex items-center space-x-8 pointer-events-auto">
        <button
          v-if="view !== ViewState.DEVELOPER"
          @click="handleOpenSearch"
          class="relative flex items-center space-x-3 bg-white/5 border border-white/10 rounded-full px-6 py-2.5 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer group animate-in fade-in zoom-in-90 duration-500 active:scale-95 hover:scale-105"
        >
          <Search class="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
          <span class="text-[9px] font-black tracking-[0.2em] uppercase text-white/40 group-hover:text-white">Search Library</span>
        </button>

        <div v-if="view === ViewState.FAVOURITES" class="flex items-center space-x-3 text-[10px] font-black tracking-widest text-white/40 uppercase">
          <Heart class="w-3 h-3 text-red-500 fill-red-500" />
          <span>{{ favouriteIds.length }} Curated</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from './store';
import { ViewState } from './types';
import { Search, Heart } from 'lucide-vue-next';
import Canvas3D from './components/Canvas3D.vue';
import DevToggle from './components/DevToggle.vue';

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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>