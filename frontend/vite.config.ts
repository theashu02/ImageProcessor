import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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
