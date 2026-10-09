// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import site from './src/data/site.json' with { type: 'json' };

// Pages exclues du sitemap (noindex ou utilitaires)
const EXCLUDED = ['/mentions-legales/', '/merci/', '/404/'].map((p) => `${site.basePath}${p}`);

export default defineConfig({
  site: site.url,
  // Sous-dossier d'hébergement (GitHub Pages : /saute-mouton). Mettre "" pour un domaine propre.
  base: site.basePath || undefined,
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Prêt pour le néerlandais : ajouter 'nl' à locales + les traductions (voir README)
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDED.some((p) => new URL(page).pathname === p),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
