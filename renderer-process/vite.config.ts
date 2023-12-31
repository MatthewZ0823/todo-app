import postcss from './postcss.config.js';
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  css: {
    postcss
  },
  server: {
    port: 8080
  },
  cacheDir: "../node_modules/.vite",
  base: './'
})
