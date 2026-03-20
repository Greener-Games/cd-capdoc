import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { templateCompilerOptions } from '@tresjs/core'
import svgLoader from 'vite-svg-loader';
import { vite as vidstack } from 'vidstack/plugins';
import { cspString } from './csp-config';

function cspPlugin(): Plugin {
  return {
    name: 'vite-plugin-csp',
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: {
            'http-equiv': 'Content-Security-Policy',
            content: cspString,
          },
          injectTo: 'head-prepend',
        },
      ];
    },
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
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
        cspPlugin(),
        vidstack(),
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});
