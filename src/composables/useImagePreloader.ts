import { useDataStore } from '../store/data';
import { ImageCacheService } from '../services/imageCache';

export function useImagePreloader() {
  const dataStore = useDataStore();

  const preloadImages = async (urls: string[]) => {
    dataStore.isPageLoading = true;
    try {
      await ImageCacheService.preloadImages(urls);
    } finally {
      // Small buffer to ensure browser has painted the images to GPU memory
      setTimeout(() => {
        dataStore.isPageLoading = false;
      }, 100);
    }
  };

  return {
    preloadImages
  };
}
