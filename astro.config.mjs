import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pesterev.tech',
  integrations: [mdx(), sitemap()],
  build: {
    inlineStylesheets: 'always',
  },
});
