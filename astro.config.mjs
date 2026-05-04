import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

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
    tailwind({
      applyBaseStyles: false, // we use our own base styles in src/styles/global.css
    }),
  ],
  build: {
    assets: 'assets',
  },
});
