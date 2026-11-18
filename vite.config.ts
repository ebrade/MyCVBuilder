import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://ebrade.github.io/MyCVBuilder/ — local dev stays at `/`.
const base = process.env.GITHUB_PAGES === 'true' ? '/MyCVBuilder/' : '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
})
