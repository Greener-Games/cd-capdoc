<template>
  <BaseCard
      v-bind="props"
      aspect-ratio-class="aspect-[4/5]"
      @select="$emit('select', $event)"
  >
    <template #default="{ formattedTitle }">
      <div class="flex flex-col justify-start text-left pointer-events-none px-2 h-16 md:h-24 shrink-0 min-w-0 mt-4" style="width: 0; min-width: 100%;">
        <h2 class="text-heading transition-opacity duration-700 opacity-50 group-hover:opacity-100 w-full line-clamp-2 md:line-clamp-3 whitespace-normal">
          {{ formattedTitle }}
        </h2>
      </div>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import { withDefaults } from 'vue';
import BaseCard from './BaseCard.vue'; // Adjust path if needed

const props = withDefaults(defineProps<{
  id: string;
  title: string;
  image: string;
  color: string;
  index: number;
  isDragging: boolean;
  prefix?: string;
}>(), {
  prefix: ''
});

defineEmits(['select']);
</script>