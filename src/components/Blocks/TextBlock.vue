<template>
  <div class="px-safe-side py-16">
    <!-- Optional Header Title for the block -->
    <div v-if="title || isActuallyLoading" class="mb-4">
      <div v-if="isActuallyLoading" class="w-32 h-4 skeleton-shimmer rounded"></div>
      <h3 v-else class="text-label">
        {{ title }}
      </h3>
    </div>

    <!-- Always Two Column Grid Mode (50/50) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-24">
      <div v-reveal class="transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) opacity-0 translate-y-8 reveal:opacity-100 reveal:translate-y-0">
        <div v-if="isActuallyLoading" class="space-y-3">
          <div class="w-full h-4 skeleton-shimmer rounded"></div>
          <div class="w-full h-4 skeleton-shimmer rounded"></div>
          <div class="w-3/4 h-4 skeleton-shimmer rounded"></div>
        </div>
        <div
            v-else-if="leftContent"
            class="rich-text-content"
            v-html="renderContent(leftContent)"
        ></div>
      </div>
      <div v-reveal class="transition-all duration-1000 delay-200 cubic-bezier(0.16, 1, 0.3, 1) opacity-0 translate-y-8 reveal:opacity-100 reveal:translate-y-0">
        <div v-if="isActuallyLoading" class="space-y-3">
          <div class="w-full h-4 skeleton-shimmer rounded"></div>
          <div class="w-full h-4 skeleton-shimmer rounded"></div>
          <div class="w-1/2 h-4 skeleton-shimmer rounded"></div>
        </div>
        <div
            v-else-if="rightContent"
            class="rich-text-content text-white"
            v-html="renderContent(rightContent)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RichTextContent } from '../../types';
import { useDataStore } from '../../store/data';

const dataStore = useDataStore();

const props = defineProps<{
  title?: string;
  leftContent?: string | RichTextContent;
  rightContent?: string | RichTextContent;
  loading?: boolean;
}>();

const isActuallyLoading = computed(() => props.loading || dataStore.isPageLoading);

const renderContent = (content: string | RichTextContent) => {
  if (typeof content === 'string') {
    return content.replace(/\n/g, '<br>');
  }

  if (content && content.html) {
    return content.html;
  }

  return '';
};
</script>

<style scoped>
</style>
