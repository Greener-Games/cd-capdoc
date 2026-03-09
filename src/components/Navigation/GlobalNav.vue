<template>
  <div class="fixed layout-nav px-safe-side flex justify-between items-center z-[70] pointer-events-none">
    <div class="flex items-center space-x-12 pointer-events-auto">
      <div class="transition-colors duration-500" :class="view === ViewState.LANDING ? 'text-black' : 'text-white'">
        <span class="font-gamechanger text-2xl font-normal">Creative Design</span>
      </div>
    </div>

    <div class="flex items-center space-x-8 pointer-events-auto">
        <button
            @click="handleGoHome"
            class="transition-colors duration-500 cursor-pointer animate-in fade-in slide-in-from-top-4 hover:opacity-80 flex items-center justify-center"
            :class="view === ViewState.LANDING ? 'text-black' : 'text-white'"
        >
          <Icon :icon="ARLogo" size="custom" class="w-[174px] h-full" />
        </button>

      <RoundedButton
          v-show="view !== ViewState.CURATOR"
          @click="handleOpenSearch"
          iconOnly
          :variant="view === ViewState.LANDING ? 'solid-black' : 'solid-white'"
          class="animate-in fade-in zoom-in-90 duration-500 active:scale-95 hover:scale-105"
      >
        <template #icon>
          <Icon :icon="Magnifying" size="md" class="scale-x-[-1]" />
        </template>
      </RoundedButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ViewState } from '../../types';
import RoundedButton from "@/components/Common/RoundedButton.vue";
import Icon from '../Common/Icon.vue';
import Magnifying from '@/assets/icons/Magnifying.svg';
import ARLogo from '@/assets/Images/ARLogo.svg';
import { useAppView } from '../../composables/useAppView';
import { useAppNavigation } from '../../composables/useAppNavigation';

const router = useRouter();
const { view } = useAppView();
const { goHome } = useAppNavigation();

const handleGoHome = () => {
  goHome();
};

const handleOpenSearch = () => {
  if (view.value !== ViewState.CURATOR) {
    router.push('/curator');
  }
};
</script>
