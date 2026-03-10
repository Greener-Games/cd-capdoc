<template>
  <div class="fixed layout-nav px-safe-side flex justify-between items-center z-[70] pointer-events-none">
    <div class="flex items-center space-x-12 pointer-events-auto">
      <div class="transition-colors duration-500" :class="view === ViewState.LANDING ? 'text-black' : 'text-white'">
        <span class="font-gamechanger text-2xl font-normal">Creative Design</span>
      </div>
    </div>

    <div class="flex items-center pointer-events-auto gap-8">
      <!-- AR Logo Button - Sliding via transform instead of margin -->
      <button
          @click="handleGoHome"
          class="transition-all duration-500 cursor-pointer animate-in fade-in slide-in-from-top-4 hover:opacity-80 flex items-center justify-center relative z-10"
          :class="[
            view === ViewState.LANDING ? 'text-black' : 'text-white',
            !showSearch ? 'translate-x-[84px]' : 'translate-x-0'
          ]"
      >
        <Icon :icon="ARLogo" size="custom" class="w-[174px] h-full" />
      </button>

      <!-- Fixed-width Search Button - Fades only, width never changes -->
      <div
          class="w-13 transition-opacity duration-500 ease-in-out"
          :class="[
            showSearch ? 'opacity-100' : 'opacity-0 pointer-events-none'
          ]"
      >
        <RoundedButton
            @click="handleOpenSearch"
            iconOnly
            :variant="view === ViewState.LANDING ? 'solid-black' : 'solid-white'"
            class="active:scale-95 hover:scale-105"
        >
          <template #icon>
            <Icon :icon="Magnifying" size="md" class="scale-x-[-1]" />
          </template>
        </RoundedButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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

const showSearch = computed(() => view.value !== ViewState.CURATOR);

const handleGoHome = () => {
  goHome();
};

const handleOpenSearch = () => {
  if (view.value !== ViewState.CURATOR) {
    router.push('/curator');
  }
};
</script>
