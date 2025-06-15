import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    root: '.',
    // Use VITE_BASE_URL environment variable if set, otherwise use '/'
    base: env.VITE_BASE_URL || '/',
    publicDir: 'public',
    plugins: [react()],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true,
      // Ensure assets are referenced with absolute paths
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          // This ensures consistent file names
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
    esbuild: {
      jsx: 'automatic',
    },
  };
});