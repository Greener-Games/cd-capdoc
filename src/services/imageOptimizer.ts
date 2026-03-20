/**
 * Utility to handle Hygraph image transformations.
 * Supports Modern (cdn.hygraph.com) and Legacy (*.graphassets.com) systems.
 */

export type ImageSize = 'xs' | 's' | 'm' | 'lg' | 'xl' | '2xl' | 'full';

interface TransformOptions {
  width?: number;
  height?: number;
  fit?: 'clip' | 'crop' | 'scale' | 'max';
  format?: 'jpg' | 'png';
  quality?: number;
}

/**
 * LOGICAL SIZES:
 * xs: 200px (Thumbnails)
 * s:  600px (Curator Cards)
 * m:  900px (Project/Selection Cards)
 * lg: 1200px (Large Tablet / Small Desktop)
 * xl: 1600px (Standard Desktop)
 * 2xl: 1920px (Full Width Components)
 * full: Original quality
 */
export const SIZE_MAP: Record<ImageSize, TransformOptions> = {
  xs: { width: 200, height: 200, fit: 'crop', quality: 80 },
  s: { width: 600, fit: 'max', quality: 90 },
  m: { width: 900, fit: 'max', quality: 90 },
  lg: { width: 1200, fit: 'max', quality: 90 },
  xl: { width: 1600, fit: 'max', quality: 90 },
  '2xl': { width: 1920, fit: 'max', quality: 95 },
  full: { quality: 100 },
};

export class ImageOptimizer {
  /**
   * Transforms a Hygraph asset URL using the appropriate syntax for the domain.
   */
  static getOptimizedUrl(url: string, size: ImageSize = 'm'): string {
    if (!url) return '';
    
    // 1. Be Smart: Don't request a size bigger than the actual screen
    const constrainedSize = this.getConstrainedSize(size);
    const options = SIZE_MAP[constrainedSize];
    
    // 2. Handle Modern CDN System (*.cdn.hygraph.com)
    if (url.includes('cdn.hygraph.com')) {
      if (url.includes('?')) return url;

      const params = new URLSearchParams();
      if (options.width) params.append('width', options.width.toString());
      if (options.height) params.append('height', options.height.toString());
      if (options.fit) params.append('fit', options.fit);
      if (options.quality) params.append('quality', options.quality.toString());

      return `${url}?${params.toString()}`;
    }

    // 3. Handle Legacy System (*.graphassets.com)
    if (url.includes('graphassets.com')) {
      if (url.includes('resize=') || url.includes('output=')) return url;

      const urlObj = new URL(url);
      const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
      const segments = urlObj.pathname.split('/').filter(Boolean);
      
      if (segments.length === 0) return url;

      const handle = segments.pop();
      const envPrefix = segments.length > 0 ? `/${segments.join('/')}` : '';

      const transforms: string[] = [];
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
      return `${baseUrl}${envPrefix}/${transformString}/${handle}`;
    }

    return url;
  }

  /**
   * Returns the maximum useful size based on current viewport width
   */
  static getViewportLimit(): ImageSize {
    const width = window.innerWidth * window.devicePixelRatio;
    if (width <= 200) return 'xs';
    if (width <= 600) return 's';
    if (width <= 900) return 'm';
    if (width <= 1200) return 'lg';
    if (width <= 1600) return 'xl';
    return '2xl';
  }

  /**
   * Ensures the requested size doesn't exceed what the current screen can actually display.
   */
  static getConstrainedSize(requestedSize: ImageSize): ImageSize {
    if (requestedSize === 'full' || requestedSize === 'xs') return requestedSize;

    const limit = this.getViewportLimit();
    const sizePriority: ImageSize[] = ['xs', 's', 'm', 'lg', 'xl', '2xl', 'full'];
    
    const requestedIdx = sizePriority.indexOf(requestedSize);
    const limitIdx = sizePriority.indexOf(limit);

    // If we are requesting a size larger than the screen's useful limit, 
    // step it down to the limit to save bandwidth.
    if (requestedIdx > limitIdx) {
      return limit;
    }

    return requestedSize;
  }
}
