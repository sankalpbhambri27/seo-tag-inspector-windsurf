import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: './frontend',
  base: './',  // Changed from '/' to './' for better path resolution
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
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
    assetsInlineLimit: 0,  // Ensure all assets are emitted as files
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
      }
    },
    modulePreload: { polyfill: true },
    target: 'esnext',
    minify: 'esbuild',
  },
  esbuild: {
    jsxInject: `import React from 'react'`
  }
});