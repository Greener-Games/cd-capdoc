import { useDataStore } from '../store/data';
import { ImageCacheService } from '../services/imageCache';

export function useImagePreloader() {
  const dataStore = useDataStore();

  /**
   * Blocks the page loading state until all images are ready.
   * Useful for detail pages where you want a clean transition.
   */
  const preloadImages = async (urls: string[]) => {
    dataStore.isPageLoading = true;
    try {
      await ImageCacheService.preloadImages(urls);
    } finally {
      setTimeout(() => {
        dataStore.isPageLoading = false;
      }, 100);
    }
  };

  /**
   * Fetches images into the cache without blocking the UI state.
   * Ideal for lists like the Curator Page.
   */
  const prefetchImages = (urls: string[]) => {
    // We don't await this, just trigger the background fetch/cache
    ImageCacheService.preloadImages(urls).catch(err => {
      console.warn('[Prefetch] Error prefetching background images:', err);
    });
  };

  return {
    preloadImages,
    prefetchImages
  };
}
