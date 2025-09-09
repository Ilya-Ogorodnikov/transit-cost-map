import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// Если деплоите на GitHub Pages, поменяйте base на '/<repo-name>/'
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? '/transit-cost-map/' : '/',
})