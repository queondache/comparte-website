// Helper comuni: leggono il sito costruito in dist/
import { readFileSync, existsSync } from 'node:fs';
import { parse } from 'node-html-parser';

export const DIST = new URL('../../dist/', import.meta.url);
export const LANGS = ['it', 'es', 'en'];
export const PAGES = {
  it: { home: '/', dona: '/dona/', cuba: '/cuba/', trasparenza: '/trasparenza/', grazie: '/grazie/' },
  es: { home: '/es/', dona: '/es/dona/', cuba: '/es/cuba/', trasparenza: '/es/transparencia/', grazie: '/es/gracias/' },
  en: { home: '/en/', dona: '/en/donate/', cuba: '/en/cuba/', trasparenza: '/en/transparency/', grazie: '/en/thank-you/' },
};

export function file(path) {
  const rel = path.replace(/^\//, '') + (path.endsWith('/') ? 'index.html' : '');
  return new URL(rel, DIST);
}
export function html(path) {
  const f = file(path);
  if (!existsSync(f)) throw new Error(`pagina mancante nel dist: ${path}`);
  return readFileSync(f, 'utf8');
}
export function page(path) {
  return parse(html(path));
}

// node-html-parser incolla i nodi di testo adiacenti senza spazio: un confine di parola (\b)
// a fine elemento (es. "</strong> anni") non scatta mai su `.text`, rendendo vacui i controlli
// lessicali basati su \b. Costruiamo qui il testo visibile "a mano": tolti script/style,
// ogni tag diventa uno spazio, poi decodifichiamo le entità HTML più comuni.
const ENTITIES = { amp: '&', '#39': "'", apos: "'", quot: '"', nbsp: ' ' };
export function visibleText(rawHtml) {
  return rawHtml
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#39|apos|amp|quot|nbsp);/g, (_, e) => ENTITIES[e]);
}
