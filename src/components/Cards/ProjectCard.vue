<template>
  <BaseCard
      v-bind="props"
      aspect-ratio-class="aspect-[16/9]"
      image-container-class="rounded-3xl mb-4 h-[calc(100%-6rem)] md:h-[calc(100%-8rem)]"
      @select="$emit('select', $event)"
  >
    <template #default="{ formattedTitle }">
      <div class="flex flex-row justify-between items-start text-left pointer-events-none px-2 h-20 md:h-28 shrink-0 min-w-0" style="width: 0; min-width: 100%;">
        <div class="flex flex-col min-w-0 shrink max-w-[70%]">
          <h2 class="text-heading text-3xl transition-opacity duration-700 opacity-50 group-hover:opacity-100 line-clamp-2 md:line-clamp-3 whitespace-normal">
            {{ formattedTitle }}
          </h2>
        </div>

        <div v-if="services && services.length > 0" class="hidden md:flex flex-col items-end text-right gap-1 max-w-[30%] pt-1">
          <span
              v-for="service in services"
              :key="service"
              class="text-label text-[9px] transition-opacity duration-700 opacity-50 group-hover:opacity-100"
          >
            {{ service }}
          </span>
        </div>
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
  services?: string[];
}>(), {
  prefix: '',
  services: () => []
});

defineEmits(['select']);
</script>