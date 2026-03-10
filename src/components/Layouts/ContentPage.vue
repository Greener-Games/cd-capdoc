<template>
  <BaseLayout :disable-padding-bottom="true" :disable-padding-side="true">
    <!-- Main Scrollable Content Area -->
    <div
        class="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-none pointer-events-auto pb-safe-bottom-footer"
        @scroll="handleScroll"
        ref="scrollContainer"
    >
      <!-- Replicated Header Logic inside scrollable area -->
      <div class="flex flex-col space-y-8 mb-16 px-safe-side">
        <!-- Back Button -->
        <div class="flex items-center">
          <RoundedButton @click="goBack" icon-only>
            <template #icon>
              <Icon :icon="Arrow" size="md" class="scale-x-[-1] text-white" />
            </template>
          </RoundedButton>
        </div>

        <!-- Title -->
        <div class="w-full animate-in fade-in slide-in-from-bottom-2 duration-400 fill-mode-both">
          <h2 class="font-gamechanger text-6xl uppercase text-white leading-none">
            <span class="max-w-4xl block">{{ title }}</span>
          </h2>
        </div>

        <!-- Info / Highlights -->
        <div class="animate-in fade-in slide-in-from-bottom-10 duration-800 fill-mode-both">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div class="md:col-span-6">
              <p class="text-base text-white font-normal">
                {{ description }}
              </p>
            </div>
            <div class="md:col-span-6 flex justify-end">
              <!-- Reusable Metadata component -->
              <div v-if="metadata" class="grid grid-cols-2 gap-x-16 gap-y-4 text-sm uppercase text-white/70 font-normal">
                <div v-if="metadata.left && metadata.left.length" class="flex flex-col space-y-0.5">
                  <span v-for="item in metadata.left" :key="item">{{ item }}</span>
                </div>
                <div v-if="metadata.right && metadata.right.length" class="flex flex-col space-y-0.5">
                  <span v-for="item in metadata.right" :key="item">{{ item }}</span>
                </div>
              </div>
              <slot v-else name="metadata"></slot>
            </div>
          </div>
        </div>
      </div>

      <div class="relative">
        <!-- Fixed Progress indicator -->
        <div v-if="showProgress" class="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-4 z-50 mix-blend-difference">
          <div class="w-px h-24 bg-white/10">
            <div
                class="w-full bg-white transition-all duration-300"
                :style="{ height: `${scrollProgress * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Dynamic Content Blocks -->
        <div v-if="blocks && blocks.length > 0" class="">
          <BlockRenderer :blocks="blocks" />
        </div>

        <!-- Main Slot for additional/fallback content -->
        <slot></slot>

        <!-- Bottom Navigation/Footer -->
        <div class="px-safe-side">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useScroll } from '../../composables/useScroll';
import { useAppNavigation } from '../../composables/useAppNavigation';
import BaseLayout from "./BaseLayout.vue";
import Arrow from "@/assets/icons/Arrow.svg";
import RoundedButton from "@/components/Common/RoundedButton.vue";
import Icon from "@/components/Common/Icon.vue";
import BlockRenderer from "@/components/Blocks/BlockRenderer.vue";
import { ContentBlock, PageMetadata } from '../../types';

withDefaults(defineProps<{
  title: string;
  description: string;
  blocks?: ContentBlock[];
  showProgress?: boolean;
  metadata?: PageMetadata;
}>(), {
  blocks: () => [],
  showProgress: true
});

const { goBack } = useAppNavigation();
const { scrollProgress, handleScroll } = useScroll();
const scrollContainer = ref<HTMLElement | null>(null);

defineExpose({
  scrollContainer
});
</script>
