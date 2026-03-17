<template>
  <ContentPage
      v-if="dataStore.aboutPage"
      :title="dataStore.aboutPage.title"
      :description="dataStore.aboutPage.description"
      :blocks="dataStore.aboutPage.contentBlocks || []"
      :metadata="metadata"
  />
  <div v-else-if="!dataStore.isFetchingData" class="w-full h-full flex items-center justify-center">
    <p class="text-muted">No about page content found.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ContentPage from "@/components/Layouts/ContentPage.vue";
import { useDataStore } from '../store/data';

const dataStore = useDataStore();

const metadata = computed(() => {
  if (!dataStore.aboutPage) return { left: [], right: [] };
  
  return {
    left: dataStore.aboutPage.services || [],
    right: [dataStore.aboutPage.client, dataStore.aboutPage.year].filter(Boolean) as string[]
  };
});
</script>
