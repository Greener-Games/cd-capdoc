import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { templateCompilerOptions } from '@tresjs/core'
import svgLoader from 'vite-svg-loader';
import { vite as vidstack } from 'vidstack/plugins';

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
        vidstack()
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});
