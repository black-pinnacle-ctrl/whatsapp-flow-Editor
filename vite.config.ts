import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-pinbot': {
        target: 'https://partnersV1.pinbot.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-pinbot/, ''),
      },
      '/api-whatsapp-mmg': {
        target: 'https://mmg.whatsapp.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-whatsapp-mmg/, ''),
        secure: false,
      },
    },
  },
})
