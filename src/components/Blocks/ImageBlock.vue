<template>
  <div
    v-reveal
    class="reveal-fx relative w-full aspect-12/5 overflow-hidden"
  >
    <!-- Skeleton State -->
    <SkeletonLoader
        v-if="isActuallyLoading"
        class="absolute inset-0 z-30 h-full"
        show-spinner
        spinner-class="w-12 h-12"
        :rounded="false"
    />

    <img
        v-if="displayUrl || url"
        :src="displayUrl || url"
        :alt="alt"
        loading="lazy"
        decoding="async"
        @load="onImageLoad"
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        :class="isActuallyLoading ? 'opacity-0' : 'opacity-100'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { ImageCacheService } from '@/services/imageCache';
import { useDataStore } from '@/store/data';
import { ImageOptimizer } from '@/services/imageOptimizer';
import SkeletonLoader from '@/components/Common/SkeletonLoader.vue';

const dataStore = useDataStore();

const props = defineProps<{
  url: string;
  alt?: string;
  loading?: boolean;
}>();

const imageLoaded = ref(false);
const isActuallyLoading = computed(() => 
  props.loading || 
  dataStore.isPageLoading || 
  (props.url && !imageLoaded.value)
);

const displayUrl = ref('');

const onImageLoad = () => {
  imageLoaded.value = true;
};

watch(() => props.url, async (newUrl) => {
  imageLoaded.value = false;
  if (newUrl) {
    const optimizedUrl = ImageOptimizer.getOptimizedUrl(newUrl, '2xl');
    displayUrl.value = await ImageCacheService.getImageUrl(optimizedUrl);
  } else {
    displayUrl.value = '';
  }
}, { immediate: true });
</script>
