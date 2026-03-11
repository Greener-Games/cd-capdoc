/**
 * Content Security Policy (CSP) configuration
 * This file drives the CSP for both local development and production builds.
 * 
 * Integration:
 * - Local Dev: Imported in vite.config.ts and added to server.headers
 * - Production: Imported in vite.config.ts and injected as a <meta> tag into index.html
 */

const policy = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // 'unsafe-eval' often needed for Vue in dev, 'unsafe-inline' for Vite
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': ["'self'", 'data:', 'https://*.graphassets.com', 'https://*.hygraph.com', 'https://grainy-gradients.vercel.app'],
  'connect-src': ["'self'", 'https://*.hygraph.com', 'https://*.graphassets.com'],
  'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
  'media-src': ["'self'", 'https://*.graphassets.com', 'https://vimeo.com', 'https://*.vimeocdn.com'],
  'frame-src': ["'self'", 'https://player.vimeo.com', 'https://www.youtube.com', 'https://www.youtube-nocookie.com'],
  'worker-src': ["'self'", 'blob:'],
  'object-src': ["'none'"],
  'upgrade-insecure-requests': []
};

/**
 * Converts the policy object into a CSP string
 */
export const getCSPString = () => {
  return Object.entries(policy)
    .map(([directive, sources]) => {
      if (sources.length === 0) return directive;
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
};

export default policy;
