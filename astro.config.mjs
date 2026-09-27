import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  site: 'https://nishchayoxford.github.io',
  base: '/cfd.github.io',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
