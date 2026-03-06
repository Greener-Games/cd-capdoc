<template>
  <BaseCard
      v-bind="props"
      class="w-[80vw] sm:w-[45vw] md:w-[30vw] lg:w-76"
      image-container-class="rounded-3xl mb-6"
      @select="$emit('select', $event)"
  >
    <template #default="{ formattedTitle }">
      <div class="flex flex-col justify-start text-left pointer-events-none px-2 h-45 w-full">
        <h2 class="font-bienvenue font-white text-3xl uppercase transition-opacity duration-700 opacity-50 group-hover:opacity-100 leading-none">
          {{ formattedTitle }}
        </h2>
      </div>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from './BaseCard.vue'; // Adjust path if needed

const props = withDefaults(defineProps<{
  id: string;
  title: string;
  subtitle: string;
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