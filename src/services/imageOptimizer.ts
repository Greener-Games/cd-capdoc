/**
 * Utility to handle Hygraph image transformations.
 * Supports Modern (cdn.hygraph.com) and Legacy (*.graphassets.com) systems.
 */

export type ImageSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'full';

interface TransformOptions {
  width?: number;
  height?: number;
  fit?: 'clip' | 'crop' | 'scale' | 'max';
  format?: 'webp' | 'jpg' | 'png';
  quality?: number;
}

const SIZE_MAP: Record<ImageSize, TransformOptions> = {
  thumbnail: { width: 200, height: 200, fit: 'crop', quality: 80 },
  small: { width: 600, fit: 'max', quality: 85 },
  medium: { width: 1200, fit: 'max', quality: 85 },
  large: { width: 1920, fit: 'max', quality: 90 },
  full: { quality: 95 }
};

export class ImageOptimizer {
  /**
   * Transforms a Hygraph asset URL using the appropriate syntax for the domain.
   */
  static getOptimizedUrl(url: string, size: ImageSize = 'medium'): string {
    if (!url) return '';
    
    // Always constrain the requested size by the current viewport to avoid over-fetching
    const constrainedSize = this.getConstrainedSize(size);
    const options = SIZE_MAP[constrainedSize];
    
    // 1. Handle Modern CDN System (*.cdn.hygraph.com)
    if (url.includes('cdn.hygraph.com')) {
      if (url.includes('?')) return url;

      const params = new URLSearchParams();
      params.append('format', 'webp');
      if (options.width) params.append('width', options.width.toString());
      if (options.height) params.append('height', options.height.toString());
      if (options.fit) params.append('fit', options.fit);
      if (options.quality) params.append('quality', options.quality.toString());

      return `${url}?${params.toString()}`;
    }

    // 2. Handle Legacy System (*.graphassets.com)
    if (url.includes('graphassets.com')) {
      if (url.includes('resize=') || url.includes('output=')) return url;

      const urlObj = new URL(url);
      const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
      
      // Split path into segments: e.g. "/[ENV_ID]/[HANDLE]" -> ["ENV_ID", "HANDLE"]
      const segments = urlObj.pathname.split('/').filter(Boolean);
      
      if (segments.length === 0) return url;

      // The last segment is ALWAYS the file handle
      const handle = segments.pop();
      // Any segments before the handle (like ENV_ID) must be preserved in order
      const envPrefix = segments.length > 0 ? `/${segments.join('/')}` : '';

      const transforms: string[] = [];
      transforms.push('output=format:webp');

      if (options.width || options.height) {
        const resizeParts: string[] = [];
        if (options.width) resizeParts.push(`width:${options.width}`);
        if (options.height) resizeParts.push(`height:${options.height}`);
        if (options.fit) resizeParts.push(`fit:${options.fit}`);
        transforms.push(`resize=${resizeParts.join(',')}`);
      }

      if (options.quality) {
        transforms.push(`quality=value:${options.quality}`);
      }

      const transformString = transforms.join('/');
      
      // Result: https://[domain].graphassets.com/[ENV_ID]/[transforms]/[handle]
      return `${baseUrl}${envPrefix}/${transformString}/${handle}`;
    }

    return url;
  }

  /**
   * Returns recommended size based on viewport width
   */
  static getResponsiveSize(): ImageSize {
    const width = window.innerWidth;
    if (width < 640) return 'small';
    if (width < 1280) return 'medium';
    return 'large';
  }

  /**
   * Ensures the requested size doesn't exceed what the current screen can actually display.
   */
  static getConstrainedSize(requestedSize: ImageSize): ImageSize {
    const viewportSize = this.getResponsiveSize();
    
    const sizePriority: ImageSize[] = ['thumbnail', 'small', 'medium', 'large', 'full'];
    const requestedIdx = sizePriority.indexOf(requestedSize);
    const viewportIdx = sizePriority.indexOf(viewportSize);

    if (requestedSize !== 'thumbnail' && requestedIdx > viewportIdx) {
      return viewportSize;
    }

    return requestedSize;
  }
}
