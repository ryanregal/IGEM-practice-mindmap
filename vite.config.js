import { defineConfig } from 'vite'

export default defineConfig({
  base: '/FloodRisk/',
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    target: 'esnext'
  }
})
