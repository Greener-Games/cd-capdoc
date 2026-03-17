<template>
  <div class="px-safe-side py-16">
    <!-- Optional Header Title for the block -->
    <div v-if="title" class="mb-4">
      <h3 class="text-label">
        {{ title }}
      </h3>
    </div>

    <!-- Always Two Column Grid Mode (50/50) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-24">
      <div v-reveal class="transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) opacity-0 translate-y-8 reveal:opacity-100 reveal:translate-y-0">
        <div
            v-if="leftContent"
            class="rich-text-content"
            v-html="renderContent(leftContent)"
        ></div>
      </div>
      <div v-reveal class="transition-all duration-1000 delay-200 cubic-bezier(0.16, 1, 0.3, 1) opacity-0 translate-y-8 reveal:opacity-100 reveal:translate-y-0">
        <div
            v-if="rightContent"
            class="rich-text-content text-white"
            v-html="renderContent(rightContent)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RichTextContent } from '../../types';

defineProps<{
  title?: string;
  leftContent?: string | RichTextContent;
  rightContent?: string | RichTextContent;
}>();

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
