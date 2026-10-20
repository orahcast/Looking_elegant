import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Inventory Central – Looking Elegant',
        short_name: 'Inventory Central',
        description: 'Admin dashboard for Looking Elegant Atelier – manage rental inventory on the go.',
        theme_color: '#0a0906',
        background_color: '#0a0906',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
  resolve: {
    alias: {
      canvg: path.resolve(__dirname, 'src/lib/empty.js'),
      html2canvas: path.resolve(__dirname, 'src/lib/empty.js'),
      dompurify: path.resolve(__dirname, 'src/lib/empty.js'),
    },
  },
  optimizeDeps: {
    exclude: ['canvg', 'html2canvas', 'dompurify'],
  },
  server: {
    port: 5174,
  },
  build: {
    rollupOptions: {
      external: ['canvg', 'html2canvas', 'dompurify', /^core-js/],
    },
  },
})
