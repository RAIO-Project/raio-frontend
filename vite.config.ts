import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      global: 'window',
    },
    server: {
      port: 3000,
      proxy: {
        '/auth': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
        },
        '/users': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
        },
        '/streams': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
        },
        '/videos': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
        },
        '/donations': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
        },
        '/payment': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
        },
        '/ws': {
          target: env.VITE_WS_URL || 'http://localhost:8080',
          changeOrigin: true,
          ws: true,
        },
      },
    },
  }
})
