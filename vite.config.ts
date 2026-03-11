import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { templateCompilerOptions } from '@tresjs/core'
import svgLoader from 'vite-svg-loader';
import { vite as vidstack } from 'vidstack/plugins';
import { getCSPString } from './csp-config';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const csp = getCSPString();

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        headers: {
          'Content-Security-Policy': csp
        }
      },
      plugins: [
        vue({
          ...templateCompilerOptions,
          template: {
            compilerOptions: {
              ...templateCompilerOptions.template?.compilerOptions,
              isCustomElement: (tag) => tag.startsWith('media-') || templateCompilerOptions.template?.compilerOptions?.isCustomElement?.(tag)
            }
          }
        }),
        tailwindcss(),
        svgLoader({
          defaultImport: 'component',
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                  },
                },
              },
              'removeDimensions'
            ]
          }
        }),
        vidstack(),
        // Simple plugin to inject CSP meta tag into index.html
        {
          name: 'inject-csp-meta',
          transformIndexHtml(html) {
            return html.replace(
              '<head>',
              `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp}">`
            );
          }
        }
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});
