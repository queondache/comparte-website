import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// IT senza prefisso, ES ed EN con prefisso: sono gli URL già pubblici
export default defineConfig({
  site: 'https://www.comparte.it',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [
    sitemap({
      // Niente opzione i18n: gli slug differiscono per lingua e l'hreflang di pagina
      // (vedi Base.astro) copre già la relazione fra le versioni linguistiche.
      // Le pagine di ringraziamento e la 404 restano fuori
      filter: (url) => !/\/(grazie|gracias|thank-you|404)\//.test(url),
    }),
  ],
});
