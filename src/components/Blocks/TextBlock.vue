<template>
  <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
    <div class="md:col-span-4">
      <h3 v-if="title" class="text-[10px] uppercase text-white/50 mb-6 font-medium">
        {{ title }}
      </h3>
    </div>
    <div class="md:col-span-8">
      <p class="text-sm md:text-base text-white/80 font-light whitespace-pre-line">
        {{ content }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  content: string;
}>();
</script>
