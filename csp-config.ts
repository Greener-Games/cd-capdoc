/**
 * Content Security Policy (CSP) configuration
 * This file drives the CSP for both local development and production builds.
 * 
 * Integration:
 * - Local Dev: Imported in vite.config.ts and added to server.headers
 * - Production: Imported in vite.config.ts and injected as a <meta> tag into index.html
 */

const cspPolicy = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // 'unsafe-eval' often needed for Vue in dev, 'unsafe-inline' for Vite
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
  'img-src': ["'self'", 'data:', 'blob:', 'https://*.graphassets.com', 'https://*.hygraph.com', 'https://grainy-gradients.vercel.app', 'https://*.vimeocdn.com', 'https://cdn.jsdelivr.net'],
  'connect-src': ["'self'", 'https://*.hygraph.com', 'https://*.graphassets.com', 'https://vimeo.com', 'https://files.vidstack.io', 'https://cdn.jsdelivr.net'],
  'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'],
  'media-src': ["'self'", 'https://*.graphassets.com', 'https://vimeo.com', 'https://*.vimeocdn.com','https://files.vidstack.io'],
  'frame-src': ["'self'", 'https://player.vimeo.com', 'https://www.youtube.com', 'https://www.youtube-nocookie.com'],
  'worker-src': ["'self'", 'blob:'],
  'object-src': ["'none'"],
  'upgrade-insecure-requests': []
};

/**
 * Converts the policy object into a CSP string
 */
export const cspString = Object.entries(cspPolicy)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ");

export default cspPolicy;
