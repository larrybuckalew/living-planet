import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// GitHub Pages serves the app under /living-planet/; Verdent and local dev serve at root.
const usePagesBase = /^(true|1)$/i.test((process.env.GITHUB_PAGES ?? '').trim())
const base = usePagesBase ? '/living-planet/' : '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
