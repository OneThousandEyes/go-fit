import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_URL = 'https://onethousandeyes.github.io';
const BASE_PATH = process.env.ASTRO_BASE ?? '/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [sitemap()],
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@public': path.resolve(__dirname, 'public'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },
});
