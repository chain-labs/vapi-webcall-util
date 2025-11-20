import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        call: resolve(__dirname, 'call.html'),
      },
    },
  },
  // Automatically load environment variables prefixed with VITE_
  envPrefix: 'VITE_',
});
