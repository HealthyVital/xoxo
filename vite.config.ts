import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves the production build at
  // https://healthyvital.github.io/xoxo/, not at the domain root, so every
  // built asset path needs this prefix. Local `vite dev` stays at "/" so
  // http://localhost:5173/... URLs keep working normally. App.tsx reads this
  // back via import.meta.env.BASE_URL as the router's basename, so routing
  // matches whichever base is active.
  base: command === 'build' ? '/xoxo/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
}))
