
const CACHE_NAME = 'cd-image-cache-v1';
const EXPIRATION_DAYS = 7;

interface CacheMetadata {
  timestamp: number;
  url: string;
}

export class ImageCacheService {
  private static blobGuiRegistry = new Map<string, string>();

  /**
   * Helper to format bytes to a readable size
   */
  private static formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = 2;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Identifies the core asset ID/handle from a Hygraph URL to group different sizes together.
   */
  private static getBaseAssetInfo(url: string): { base: string, width: number, name: string } {
    try {
      let width = 0;
      let base = url;
      let name = url.split('/').pop()?.split('?')[0] || 'unknown';

      if (url.includes('cdn.hygraph.com')) {
        const urlObj = new URL(url);
        width = parseInt(urlObj.searchParams.get('width') || '0');
        base = urlObj.origin + urlObj.pathname;
      } else if (url.includes('graphassets.com')) {
        const urlObj = new URL(url);
        const segments = urlObj.pathname.split('/').filter(Boolean);
        const handle = segments.pop() || '';
        const resizeMatch = url.match(/resize=width:(\d+)/);
        width = resizeMatch ? parseInt(resizeMatch[1]) : 0;
        base = `${urlObj.origin}/${segments[0]}/${handle}`;
      }
      
      return { base, width, name };
    } catch {
      return { base: url, width: 0, name: 'unknown' };
    }
  }

  /**
   * Returns a local Blob URL for a cached image, or fetches/caches it if missing.
   * SMART: If a larger version of this same image exists in cache, it uses that instead.
   */
  static async getImageUrl(url: string): Promise<string> {
    if (!url) return '';

    if (this.blobGuiRegistry.has(url)) {
      return this.blobGuiRegistry.get(url)!;
    }

    const { base, width: requestedWidth, name } = this.getBaseAssetInfo(url);

    try {
      const cache = await caches.open(CACHE_NAME);
      
      // 1. Check for exact match first
      const exactMatch = await cache.match(url);
      if (exactMatch && !(await this.isStale(url))) {
        const blob = await exactMatch.blob();
        console.log(`%c[Cache] Hit: ${name} | ${requestedWidth}px | ${this.formatSize(blob.size)}`, 'color: #ccff00');
        return this.createBlobUrl(url, blob);
      }

      // 2. SMART CACHE CHECK: Look for siblings (same asset, different size)
      const keys = await cache.keys();
      for (const request of keys) {
        const cachedUrl = request.url;
        const { base: cachedBase, width: cachedWidth } = this.getBaseAssetInfo(cachedUrl);
        
        if (base === cachedBase && cachedWidth >= requestedWidth && requestedWidth > 0) {
          const cachedResponse = await cache.match(request);
          if (cachedResponse && !(await this.isStale(cachedUrl))) {
            const blob = await cachedResponse.blob();
            console.log(
              `%c[Cache] Smart Reuse: ${name} | Using ${cachedWidth}px for ${requestedWidth}px request | ${this.formatSize(blob.size)}`, 
              'color: #00ffcc'
            );
            return this.createBlobUrl(url, blob);
          }
        }
      }

      // 3. Fetch and cache if no suitable version found
      const response = await fetch(url);
      if (response.ok) {
        const responseClone = response.clone();
        await cache.put(url, response.clone());
        await this.updateMetadata(url);
        
        const blob = await responseClone.blob();
        console.log(
          `%c[Network] Fetch: ${name} | ${requestedWidth}px | ${this.formatSize(blob.size)}`, 
          'color: #0044ff'
        );

        return this.createBlobUrl(url, blob);
      }
      
      return url;
    } catch (e) {
      console.error('Cache API error:', e);
      return url;
    }
  }

  private static createBlobUrl(originalUrl: string, blob: Blob): string {
    const blobUrl = URL.createObjectURL(blob);
    this.blobGuiRegistry.set(originalUrl, blobUrl);
    return blobUrl;
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
