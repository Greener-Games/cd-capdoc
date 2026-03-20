<template>
  <BaseCard
      :id="item.id"
      :title="item.title"
      :image="item.image"
      :color="item.accentColor"
      :index="index"
      :is-dragging="isDragging"
      image-size="small"
      aspect-ratio-class="aspect-[20/13]"
      @select="$emit('select', $event)"
  >
    <template #default="{ formattedTitle }">
      <div class="flex flex-col justify-start text-left pointer-events-none h-8 md:h-16 xl:h-22 2xl:h-28 shrink-0 min-w-0 w-full">
        <h2 class="text-heading hover-reveal w-full line-clamp-2 md:line-clamp-3">
          {{ formattedTitle }}
        </h2>
      </div>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from './BaseCard.vue';
import { CategoryItem } from '../../types';

withDefaults(defineProps<{
  item: CategoryItem;
  index: number;
  isDragging?: boolean;
}>(), {
  isDragging: false
});

defineEmits<{
  (e: 'select', id: string): void
}>();
</script>
