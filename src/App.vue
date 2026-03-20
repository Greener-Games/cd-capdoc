<template>
  <div class="relative w-screen h-screen overflow-hidden bg-black selection:bg-white selection:text-black">

    <!-- Full Bleed Background with Tailwind Transitions -->
    <div
        class="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000 ease-in-out"
        :class="showBackground ? 'opacity-100' : 'opacity-0'"
    >
      <BackgroundVideo />
      
      <!-- Frosted Glass Overlay -->
      <div class="absolute inset-0 z-1 backdrop-blur-[100px] bg-black/40 opacity-50">
        <div class="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style="background-image: url('https://grainy-gradients.vercel.app/noise.svg')"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-overlay-radial)_100%)] pointer-events-none"></div>
      </div>
    </div>

    <main class="relative z-10 w-full h-full">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Dev Tools -->
    <DevBreakpointHelper />

    <!-- Landing Page White Border Effect - ONLY visible on Landing -->
    <div
        class="landing-hole pointer-events-none"
        :class="view === ViewState.LANDING ? 'landing-hole-active' : 'landing-hole-inactive'"
    ></div>

    <!-- Global Navigation -->
    <GlobalNav />

    <!-- Global Footer -->
    <PageFooter v-if="showFooter" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useDataStore } from './store';
import { ViewState } from './types';
import { useAppView } from './composables/useAppView';
import BackgroundVideo from './components/Common/BackgroundVideo.vue';
import GlobalNav from './components/Navigation/GlobalNav.vue';
import PageFooter from './components/Navigation/PageFooter.vue';
import DevBreakpointHelper from './components/Common/DevBreakpointHelper.vue';

const dataStore = useDataStore();
const { view } = useAppView();

onMounted(() => {
  dataStore.init();
});

const showBackground = computed(() => {
  // Only show on Home (Landing) page
  return view.value === ViewState.LANDING;
});

const showFooter = computed(() => {
  return [ViewState.LANDING, ViewState.SELECTOR, ViewState.PROJECT_LIST].includes(view.value);
});
</script>

<style scoped>
</style>
