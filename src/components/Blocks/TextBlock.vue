<template>
  <div class="px-safe-side py-12">
    <!-- Optional Header Title for the block -->
    <div v-if="title || isActuallyLoading" class="mb-4">
      <SkeletonLoader v-if="isActuallyLoading" class="w-32 h-4" />
      <h3 v-else class="text-label">
        {{ title }}
      </h3>
    </div>

    <!-- Always Two Column Grid Mode (50/50) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-24">
      <div v-reveal class="reveal-fx">
        <div v-if="isActuallyLoading" class="space-y-3">
          <SkeletonLoader class="w-full h-4" />
          <SkeletonLoader class="w-full h-4" />
          <SkeletonLoader class="w-3/4 h-4" />
        </div>
        <div
            v-else-if="leftContent"
            class="rich-text-content"
            v-html="renderContent(leftContent)"
        ></div>
      </div>
      <div v-reveal class="reveal-fx delay-100">
        <div v-if="isActuallyLoading" class="space-y-3">
          <SkeletonLoader class="w-full h-4" />
          <SkeletonLoader class="w-full h-4" />
          <SkeletonLoader class="w-1/2 h-4" />
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
import SkeletonLoader from '@/components/Common/SkeletonLoader.vue';

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
