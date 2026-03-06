<template>
  <BaseCard
      v-bind="props"
      class="w-[85vw] sm:w-[70vw] md:w-[45vw] overflow-hidden"
      image-container-class="rounded-3xl mb-6"
      @select="$emit('select', $event)"
  >
    <template #default="{ formattedTitle }">
      <!-- Added shrink-0 here so the text container never collapses -->
      <div class="flex flex-row justify-between items-start text-left pointer-events-none px-2 h-24 w-full shrink-0">
        <div class="flex flex-col max-w-[70%]">
          <h2 class="font-bienvenue font-white text-3xl uppercase transition-opacity duration-700 opacity-50 group-hover:opacity-100 leading-none">
            {{ formattedTitle }}
          </h2>
        </div>

        <div v-if="services && services.length > 0" class="hidden md:flex flex-col items-end text-right gap-1 max-w-[30%] pt-1">
          <span
              v-for="service in services"
              :key="service"
              class="text-[9px] font-bienvenue font-white uppercase transition-opacity duration-700 opacity-50 group-hover:opacity-100 leading-none"
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