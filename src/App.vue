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

    <!-- Landing Page White Border Effect -->
    <div
      class="fixed inset-[12px] md:inset-[24px] z-[60] pointer-events-none rounded-[2rem] border-[40px] border-[#E8E8E8] shadow-[0_0_0_100vmax_#E8E8E8] transition-opacity duration-[800ms]"
      :class="view === ViewState.LANDING ? 'opacity-100' : 'opacity-0'"
    ></div>

    <!-- Global Navigation -->
    <GlobalNav />

    <!-- Global Footer -->
    <PageFooter
      v-if="showFooter"
      :count="footerProps.count"
      :label="footerProps.label"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from './store';
import { ViewState } from './types';
import Canvas3D from './components/Canvas3D.vue';
import DevToggle from './components/DevToggle.vue';
import GlobalNav from './components/GlobalNav.vue';
import PageFooter from './components/PageFooter.vue';
import { CategoryType } from './types';
import { CAPABILITY_DATA, MARKET_DATA, REGION_DATA } from './constants';

const router = useRouter();
const store = useAppStore();

const view = computed(() => store.view);

const showFooter = computed(() => {
  return [ViewState.LANDING, ViewState.SELECTOR, ViewState.TIMELINE].includes(view.value);
});

const footerProps = computed(() => {
  if (view.value === ViewState.LANDING) {
    return { count: store.flattenedAllProjects.length, label: 'PROJECTS' };
  }
  if (view.value === ViewState.SELECTOR) {
    if (store.filterType === CategoryType.CAPABILITY) {
      return { count: store.fetchedCapabilities.length || CAPABILITY_DATA.length, label: 'CAPABILITIES' };
    } else if (store.filterType === CategoryType.MARKET) {
      return { count: store.fetchedMarkets.length || MARKET_DATA.length, label: 'MARKETS' };
    } else {
      return { count: store.fetchedRegions.length || REGION_DATA.length, label: 'REGIONS' };
    }
  }
  if (view.value === ViewState.TIMELINE) {
    return { count: store.currentProjects.length, label: 'PROJECTS' };
  }
  return { count: 0, label: '' };
});
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
