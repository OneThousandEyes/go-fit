import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const SITE_URL = 'https://deluminor.github.io';
const BASE_PATH = process.env.ASTRO_BASE ?? '/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },
});
