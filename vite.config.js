import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import stylex from '@stylexjs/unplugin';

const entry = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig(() => ({
  // The site is served from https://cocodedk.github.io/reverse-prime-plot/, so
  // every emitted URL — including the worker chunk — needs the repo subpath.
  base: '/reverse-prime-plot/',
  // The plugins run under vitest too. Without the StyleX transform, importing
  // any component throws "Unexpected 'stylex.create' call at runtime", which is
  // what previously made .jsx files untestable.
  plugins: [stylex.vite({ useCSSLayers: true }), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    // The StyleX plugin leaves file watchers open, so the Vite server never
    // closes on its own (react() alone exits clean). Tests pass and the exit
    // code is 0 either way; this just caps the dead wait at 1s instead of 10.
    teardownTimeout: 1000,
  },
  build: {
    rollupOptions: {
      // One entry per language: each carries its own lang/dir and meta tags,
      // and the app reads the locale off <html lang> at startup.
      input: {
        main: entry('./index.html'),
        fa: entry('./fa/index.html'),
        chains: entry('./chains/index.html'),
        faChains: entry('./fa/chains/index.html'),
      },
    },
  },
}));
