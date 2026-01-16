import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': {
        target: 'http://localhost:5093',
        changeOrigin: true,
      },
      '/dives': {
        target: 'http://localhost:5093',
        changeOrigin: true,
      },
      '/divesites': {
        target: 'http://localhost:5093',
        changeOrigin: true,
      },
      '/experiencelevels': {
        target: 'http://localhost:5093',
        changeOrigin: true,
      }
    }
  }
})
