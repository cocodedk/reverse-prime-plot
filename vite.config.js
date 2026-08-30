import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import stylex from '@stylexjs/unplugin';

export default defineConfig(({ mode }) => ({
  plugins:
    mode === 'test'
      ? []
      : [stylex.vite({ useCSSLayers: true }), react()],
}));
