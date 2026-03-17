<template>
  <TransitionGroup 
    name="card-list" 
    tag="div" 
    class="space-y-5"
  >
    <div v-for="block in blocks" :key="block.id" class="w-full">
      <component
          :is="getBlockComponent(block.type)"
          v-bind="block"
      />
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { ContentBlock } from '../../types';
import ImageBlock from './ImageBlock.vue';
import TextBlock from './TextBlock.vue';
import VideoBlock from './VideoBlock.vue';

defineProps<{
  blocks: ContentBlock[];
}>();

const getBlockComponent = (type: string) => {
  switch (type) {
    case 'image': return ImageBlock;
    case 'text': return TextBlock;
    case 'video': return VideoBlock;
    default: return null;
  }
};
</script>
