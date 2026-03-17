<template>
  <div 
    v-reveal 
    class="relative w-full h-[640px] overflow-hidden transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) opacity-0 translate-y-10 reveal:opacity-100 reveal:translate-y-0"
  >
    <!-- Skeleton State -->
    <div v-if="isActuallyLoading" class="absolute inset-0 z-30 skeleton-shimmer flex items-center justify-center">
      <div class="w-12 h-12 rounded-full border-2 border-white/10 border-t-white/40 animate-spin"></div>
    </div>

    <div
        v-if="displayUrl || url"
        class="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        :class="isActuallyLoading ? 'opacity-0' : 'opacity-100'"
        :style="{ backgroundImage: `url(${displayUrl || url})` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { ImageCacheService } from '@/services/imageCache';
import { useDataStore } from '@/store/data';

const dataStore = useDataStore();

const props = defineProps<{
  url: string;
  alt?: string;
  loading?: boolean;
}>();

const isActuallyLoading = computed(() => props.loading || dataStore.isPageLoading);
const displayUrl = ref('');

watch(() => props.url, async (newUrl) => {
  if (newUrl) {
    displayUrl.value = await ImageCacheService.getImageUrl(newUrl);
  } else {
    displayUrl.value = '';
  }
}, { immediate: true });
</script>
