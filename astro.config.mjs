import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Production: custom domain apicare.co.in
  // For preview deploys on GitHub Pages without custom domain,
  // temporarily change to:
  //   site: 'https://YOUR-GITHUB-USERNAME.github.io',
  //   base: '/apicare-web',
  site: 'https://www.apicare.co.in',
  base: '/',
  trailingSlash: 'ignore',
  integrations: [
    // sitemap-index.xml for Google / Bing. Checkout is a form, not content.
    sitemap({
      filter: (page) => !page.includes('/checkout'),
    }),
    tailwind({
      applyBaseStyles: false, // we use our own base styles in src/styles/global.css
    }),
  ],
  build: {
    assets: 'assets',
  },
});
