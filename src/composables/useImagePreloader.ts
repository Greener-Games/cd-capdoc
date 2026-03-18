import { useDataStore } from '../store/data';
import { ImageCacheService } from '../services/imageCache';
import { ImageOptimizer, ImageSize } from '../services/imageOptimizer';

export type PreloadRequest = string | { url: string; size?: ImageSize };

export function useImagePreloader() {
  const dataStore = useDataStore();

  const getOptimizedUrls = (requests: PreloadRequest[], defaultSize: ImageSize): string[] => {
    return requests.map(request => {
      if (typeof request === 'string') {
        return ImageOptimizer.getOptimizedUrl(request, defaultSize);
      }
      return ImageOptimizer.getOptimizedUrl(request.url, request.size || defaultSize);
    });
  };

  /**
   * Blocks the page loading state until all images are ready.
   * Useful for detail pages where you want a clean transition.
   */
  const preloadImages = async (requests: PreloadRequest[], defaultSize: ImageSize = 'large') => {
    dataStore.isPageLoading = true;
    try {
      const optimizedUrls = getOptimizedUrls(requests, defaultSize);
      await ImageCacheService.preloadImages(optimizedUrls);
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
  const prefetchImages = (requests: PreloadRequest[], defaultSize: ImageSize = 'medium') => {
    const optimizedUrls = getOptimizedUrls(requests, defaultSize);
    // We don't await this, just trigger the background fetch/cache
    ImageCacheService.preloadImages(optimizedUrls).catch(err => {
      console.warn('[Prefetch] Error prefetching background images:', err);
    });
  };

  return {
    preloadImages,
    prefetchImages
  };
}
