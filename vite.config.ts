import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: './frontend',
  base: '/',
  publicDir: 'public',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend/src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://seo-tag-inspector-backend2.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
