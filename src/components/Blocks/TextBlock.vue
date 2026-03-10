<template>
  <div class="px-safe-side py-16">
    <!-- Optional Header Title for the block -->
    <div v-if="title" class="mb-4">
      <h3 class="text-[10px] uppercase text-white/70 font-medium">
        {{ title }}
      </h3>
    </div>

    <!-- Always Two Column Grid Mode (50/50) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-24">
      <div class="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div
            v-if="leftContent"
            class="rich-text text-sm md:text-base text-white/70 font-normal"
            v-html="renderContent(leftContent)"
        ></div>
      </div>
      <div class="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <div
            v-if="rightContent"
            class="rich-text text-sm md:text-base text-white font-normal"
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
@reference "../../assets/main.css";

.rich-text :deep(p) {
  @apply mb-2 last:mb-0;
}

.rich-text :deep(strong) {
  @apply font-bold text-white;
}

.rich-text :deep(em) {
  @apply italic;
}

.rich-text :deep(ul) {
  @apply list-disc ml-6 my-4 space-y-2;
}

.rich-text :deep(ol) {
  @apply list-decimal ml-6 my-4 space-y-2;
}

.rich-text :deep(li) {
  @apply pl-1;
}

.rich-text :deep(a) {
  @apply text-white underline decoration-white/70 hover:decoration-white transition-all;
}

.rich-text :deep(h1) { @apply text-3xl font-bold mb-6; }
.rich-text :deep(h2) { @apply text-2xl font-bold mb-4; }
.rich-text :deep(h3) { @apply text-xl font-bold mb-3; }

.rich-text :deep(code) {
  @apply bg-white/70 rounded px-1.5 py-0.5 font-mono text-sm;
}
</style>
