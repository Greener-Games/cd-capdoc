
const CACHE_NAME = 'cd-image-cache-v1';
const EXPIRATION_DAYS = 7;

interface CacheMetadata {
  timestamp: number;
  url: string;
}

export class ImageCacheService {
  private static blobGuiRegistry = new Map<string, string>();

  /**
   * Returns a local Blob URL for a cached image, or fetches/caches it if missing.
   */
  static async getImageUrl(url: string): Promise<string> {
    if (!url) return '';

    // If we already have a session-active Blob URL for this, return it instantly
    if (this.blobGuiRegistry.has(url)) {
      return this.blobGuiRegistry.get(url)!;
    }

    try {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(url);

      if (cachedResponse) {
        const isStale = await this.isStale(url);
        if (!isStale) {
          const blob = await cachedResponse.blob();
          const blobUrl = URL.createObjectURL(blob);
          this.blobGuiRegistry.set(url, blobUrl);
          console.log(`%c[Cache] Hit (Blob): ${url.split('/').pop()}`, 'color: #ccff00');
          return blobUrl;
        }
        console.log(`%c[Cache] Stale: ${url.split('/').pop()}`, 'color: #ffa500');
      }

      // Fetch and cache
      console.log(`%c[Network] Fetching: ${url.split('/').pop()}`, 'color: #0044ff');
      const response = await fetch(url);
      if (response.ok) {
        const responseClone = response.clone();
        await cache.put(url, response.clone());
        await this.updateMetadata(url);
        
        const blob = await responseClone.blob();
        const blobUrl = URL.createObjectURL(blob);
        this.blobGuiRegistry.set(url, blobUrl);
        return blobUrl;
      }
      
      return url;
    } catch (e) {
      console.error('Cache API error:', e);
      return url; // Fallback
    }
  }

  /**
   * Preloads an array of images and returns when all are ready
   */
  static async preloadImages(urls: string[]): Promise<void[]> {
    const uniqueUrls = [...new Set(urls)].filter(Boolean);
    return Promise.all(uniqueUrls.map(url => this.getImageUrl(url).then(u => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = u;
      });
    })));
  }

  private static async isStale(url: string): Promise<boolean> {
    const metadata = localStorage.getItem(`cache_meta_${url}`);
    if (!metadata) return true;

    try {
      const { timestamp } = JSON.parse(metadata) as CacheMetadata;
      const now = Date.now();
      const diffDays = (now - timestamp) / (1000 * 60 * 60 * 24);
      return diffDays > EXPIRATION_DAYS;
    } catch {
      return true;
    }
  }

  private static async updateMetadata(url: string) {
    const metadata: CacheMetadata = {
      timestamp: Date.now(),
      url
    };
    localStorage.setItem(`cache_meta_${url}`, JSON.stringify(metadata));
  }
}
