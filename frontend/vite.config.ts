import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url';
import path from 'path';

// Resolve __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [], // Ensure lodash/debounce is not listed here
    },
  },
  optimizeDeps: {
    include: ['lodash/debounce'], // Ensure lodash/debounce is included
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Adjust paths as needed
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      }
    }
  },
})
