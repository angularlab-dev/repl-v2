/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  publicDir: 'src/assets',
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    {
      name: 'cross-origin-isolation-for-preview',
      configurePreviewServer: (server) => {
        server.middlewares.use((_, res, next) => {
          res.setHeader('cross-origin-opener-policy', 'same-origin');
          res.setHeader('cross-origin-embedder-policy', 'require-corp');
          res.setHeader('cross-origin-resource-policy', 'cross-origin');
          next();
        });
      }
    },
    analog(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test.ts'],
    include: ['**/*.spec.ts'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
