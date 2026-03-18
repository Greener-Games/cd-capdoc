
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
   * Helper to extract dimensions and info from any Hygraph transformation URL style
   */
  private static getRequestInfo(url: string): string {
    try {
      let width = '';
      let height = '';
      let format = '';

      if (url.includes('?')) {
        // Modern Query-based
        const params = new URL(url).searchParams;
        width = params.get('width') || '';
        height = params.get('height') || '';
        format = params.get('format') || '';
      } else {
        // Legacy Path-based
        const resizeMatch = url.match(/resize=([^/]+)/);
        if (resizeMatch) {
          width = resizeMatch[1].match(/width:(\d+)/)?.[1] || '';
          height = resizeMatch[1].match(/height:(\d+)/)?.[1] || '';
        }
        format = url.match(/output=format:([^/]+)/)?.[1] || '';
      }
      
      let info = '';
      if (width && height) info += `${width}x${height}`;
      else if (width) info += `w:${width}`;
      else if (height) info += `h:${height}`;
      else info += 'original';

      if (format) {
        info += ` [${format}]`;
      }

      return info;
    } catch {
      return 'original';
    }
  }

  /**
   * Returns a local Blob URL for a cached image, or fetches/caches it if missing.
   */
  static async getImageUrl(url: string): Promise<string> {
    if (!url) return '';

    // If we already have a session-active Blob URL for this, return it instantly
    if (this.blobGuiRegistry.has(url)) {
      return this.blobGuiRegistry.get(url)!;
    }

    const requestInfo = this.getRequestInfo(url);

    try {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(url);

      if (cachedResponse) {
        const isStale = await this.isStale(url);
        if (!isStale) {
          const blob = await cachedResponse.blob();
          const blobUrl = URL.createObjectURL(blob);
          this.blobGuiRegistry.set(url, blobUrl);
          
          console.log(
            `%c[Cache] Hit: ${url.split('/').pop()?.split('?')[0]} | ${requestInfo} | ${this.formatSize(blob.size)}`, 
            'color: #ccff00'
          );
          
          return blobUrl;
        }
        console.log(`%c[Cache] Stale: ${url.split('/').pop()?.split('?')[0]}`, 'color: #ffa500');
      }

      // Fetch and cache
      const response = await fetch(url);
      if (response.ok) {
        const responseClone = response.clone();
        await cache.put(url, response.clone());
        await this.updateMetadata(url);
        
        const blob = await responseClone.blob();
        const blobUrl = URL.createObjectURL(blob);
        this.blobGuiRegistry.set(url, blobUrl);

        console.log(
          `%c[Network] Fetch: ${url.split('/').pop()?.split('?')[0]} | ${requestInfo} | ${this.formatSize(blob.size)}`, 
          'color: #0044ff'
        );

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
