import { defineConfig } from 'vite'

export default defineConfig({
  base: '/FloodRisk/',
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    target: 'esnext'
  }
})
