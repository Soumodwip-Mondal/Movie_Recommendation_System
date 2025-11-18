/* eslint-env node */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy API during dev to avoid CORS. Preserve '/api' because backend routes are prefixed with '/api'.
      '/api': {
        target: 'https://movie-recommendation-system-lu7n.onrender.com',
        changeOrigin: true,
        secure: false,
        // Do not rewrite; backend expects '/api/*'
      },
    },
  }
})
