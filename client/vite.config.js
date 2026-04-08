import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['.trycloudflare.com', 'turbo-across-sociology-breeds.trycloudflare.com'],
    host: '0.0.0.0',
    port: 5173
  }
})
