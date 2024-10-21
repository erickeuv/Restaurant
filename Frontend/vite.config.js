import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    entries: ['index.html'],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // Esto puede ayudar a manejar dependencias mixtas CJS/ESM
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://restaurant-jy3w.onrender.com', // URL de tu backend en Render
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
