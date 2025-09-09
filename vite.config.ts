import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// Если деплоите на GitHub Pages, поменяйте base на '/<repo-name>/'
export default defineConfig(({ mode }) =>({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? '/transit-cost-map/' : '/',
  css: {
    modules: {
      // В деве — говорящие имена, в проде — короткий base64-хэш
      generateScopedName:
        mode === 'production'
          ? '[hash:base64:6]'
          : '[name]__[local]__[hash:base64:5]',
    },
  },
}))