import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        form: resolve(__dirname, 'form.html'),
      },
    },
  },
  // Automatically load environment variables prefixed with VITE_
  envPrefix: 'VITE_',
});
