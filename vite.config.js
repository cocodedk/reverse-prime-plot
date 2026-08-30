import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import stylex from '@stylexjs/unplugin';

const entry = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig(({ mode }) => ({
  // The site is served from https://cocodedk.github.io/reverse-prime-plot/, so
  // every emitted URL — including the worker chunk — needs the repo subpath.
  base: '/reverse-prime-plot/',
  plugins:
    mode === 'test'
      ? []
      : [stylex.vite({ useCSSLayers: true }), react()],
  build: {
    rollupOptions: {
      // One entry per language: each carries its own lang/dir and meta tags,
      // and the app reads the locale off <html lang> at startup.
      input: { main: entry('./index.html'), fa: entry('./fa/index.html') },
    },
  },
}));
