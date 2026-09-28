import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { page, html, file, LANGS, PAGES, DIST, visibleText } from './lib/dist.mjs';

const ABS = 'https://www.comparte.it';
const ITALIAN = /\b(della|degli|delle|nelle|nella|sono|anche|questo|nostro|nostra|lavoriamo|formiamo|dichiarazione|codice fiscale|sosteniamo|iscriviti|perché|chi siamo|anni|bonifico|scuola|comunità|occhiali|medicine|grazie)\b/i;
// "onlus" come da brief: /onlus/i, applicato dopo aver tolto gli URL social "comparteonlus" (ammessi, minuscoli)
const ONLUS = /onlus/i;
const stripAllowedOnlusUrls = (text) => text.replace(/comparteonlus/gi, '');
// Mollie/carta/onlus/"in arrivo" sono contenuti vietati o superati nei llms.txt: le modalità di
// donazione sono solo 5x1000 e bonifico, niente pagamento con carta né sezioni "in costruzione".
const FORBIDDEN_LLMS = /mollie|carta di credito|pagamento con carta|tarjeta|credit card|in arrivo|in costruzione|próximamente|coming soon/i;
// Percorso del llms.txt nel dist per ciascuna lingua
const LLMS_PATH = { it: 'llms.txt', es: 'es/llms.txt', en: 'en/llms.txt' };
// La prima riga "> " di ogni llms.txt deve citare Cuba/Havana/Belén nella lingua giusta
const LLMS_SUMMARY_CHECKS = {
  it: [/Havana/, /Belén/],
  es: [/La Habana/, /Belén/],
  en: [/Havana/, /Belén/],
};
const LLMS_HEADING = { it: /^## Pagine$/m, es: /^## Páginas$/m, en: /^## Pages$/m };

for (const lang of LANGS) {
  for (const [key, path] of Object.entries(PAGES[lang])) {
    test(`${lang}/${key}: canonical e hreflang reciproci`, () => {
      const p = page(path);
      assert.equal(p.querySelector('link[rel="canonical"]').getAttribute('href'), ABS + path);
      const alts = Object.fromEntries(p.querySelectorAll('link[rel="alternate"][hreflang]').map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')]));
      for (const l of LANGS) assert.equal(alts[l], ABS + PAGES[l][key], `hreflang ${l}`);
      assert.equal(alts['x-default'], ABS + PAGES.it[key]);
    });

    test(`${lang}/${key}: og:image assoluto sotto /og/, og:type e twitter:card corretti`, () => {
      const p = page(path);
      const ogImage = p.querySelector('meta[property="og:image"]')?.getAttribute('content');
      assert.ok(ogImage && ogImage.startsWith(`${ABS}/og/`), `og:image mancante o non assoluto per ${path}: ${ogImage}`);
      // Le pagine Cuba hanno la foto dedicata /og/cuba.jpg, tutte le altre ereditano /og/home.jpg
      const expectedFile = key === 'cuba' ? '/og/cuba.jpg' : '/og/home.jpg';
      assert.ok(ogImage.endsWith(expectedFile), `og:image per ${path} dovrebbe finire con ${expectedFile}, è "${ogImage}"`);
      assert.equal(p.querySelector('meta[property="og:type"]')?.getAttribute('content'), 'website', `og:type mancante o errato per ${path}`);
      assert.equal(p.querySelector('meta[name="twitter:card"]')?.getAttribute('content'), 'summary_large_image', `twitter:card mancante o errato per ${path}`);
    });

    test(`${lang}/${key}: JSON-LD valido`, () => {
      const blocks = page(path).querySelectorAll('script[type="application/ld+json"]');
      assert.ok(blocks.length >= 1);
      blocks.forEach((b) => assert.doesNotThrow(() => JSON.parse(b.text)));
    });

    if (lang !== 'it') {
      test(`${lang}/${key}: nessuna parola italiana nel testo visibile`, () => {
        const m = visibleText(html(path)).match(ITALIAN);
        assert.equal(m, null, `"${m && m[0]}"`);
      });
    }
  }
}

test('JSON-LD home: NGO con CF e DonateAction con IBAN, niente Onlus', () => {
  const all = page('/').querySelectorAll('script[type="application/ld+json"]').map((b) => JSON.parse(b.text));
  const s = JSON.stringify(all);
  assert.match(s, /"@type":"NGO"/);
  assert.match(s, /97977810585/);
  assert.match(s, /IT27J0501803200000016738783/);
  // Case-insensitive: "Onlus", "ONLUS" ecc. sono tutte vietate, non solo la grafia esatta
  assert.doesNotMatch(stripAllowedOnlusUrls(s), ONLUS);
});

test('sitemap generata senza pagine grazie', () => {
  const idx = new URL('sitemap-index.xml', DIST);
  assert.ok(existsSync(idx));
  const sm = readFileSync(new URL('sitemap-0.xml', DIST), 'utf8');
  assert.match(sm, /https:\/\/www\.comparte\.it\/cuba\//);
  assert.doesNotMatch(sm, /grazie|gracias|thank-you/);
});

test('robots, CNAME, llms.txt e 404 presenti', () => {
  assert.match(readFileSync(new URL('CNAME', DIST), 'utf8'), /^www\.comparte\.it\s*$/);
  assert.match(readFileSync(new URL('robots.txt', DIST), 'utf8'), /sitemap-index\.xml/);
  const llms = readFileSync(new URL('llms.txt', DIST), 'utf8');
  assert.match(llms, /Cuba/);
  assert.doesNotMatch(stripAllowedOnlusUrls(llms), ONLUS);
  assert.ok(existsSync(new URL('404.html', DIST)));
  assert.ok(existsSync(new URL('sitemap.xml', DIST)), 'manca dist/sitemap.xml');
  const sitemapAlias = readFileSync(new URL('sitemap.xml', DIST), 'utf8');
  assert.match(sitemapAlias, /<sitemapindex/, 'dist/sitemap.xml non è un sitemapindex');
  assert.match(sitemapAlias, /https:\/\/www\.comparte\.it\/sitemap-0\.xml/, 'dist/sitemap.xml non punta a sitemap-0.xml');
});

test('vecchi ancoraggi ES/EN (bd7b449) restano risolvibili nelle nuove home', () => {
  const OLD_IDS = {
    es: ['cinco-x-mil', 'impacto', 'boletin', 'quienes-somos', 'proyectos', 'por-que-educacion'],
    en: ['five-x-thousand', 'impact', 'newsletter', 'about', 'projects', 'why-education'],
  };
  for (const [lang, ids] of Object.entries(OLD_IDS)) {
    const p = page(PAGES[lang].home);
    for (const id of ids) assert.ok(p.querySelector(`#${id}`), `manca #${id} nella home ${lang}`);
  }
});

test('vecchi URL immagine pubblici (bd7b449) restano risolvibili', () => {
  assert.ok(existsSync(new URL('assets/img/hero/hero.jpg', DIST)), 'manca dist/assets/img/hero/hero.jpg');
  assert.ok(existsSync(new URL('assets/logo/comparte_logo_black.png', DIST)), 'manca dist/assets/logo/comparte_logo_black.png');
});

test('llms.txt tradotti (es, en): presenti, con Cuba, senza onlus', () => {
  for (const lang of ['es', 'en']) {
    const llms = readFileSync(new URL(`${lang}/llms.txt`, DIST), 'utf8');
    assert.match(llms, /Cuba/);
    assert.doesNotMatch(stripAllowedOnlusUrls(llms), ONLUS);
  }
});

test('llms.txt (it, es, en): niente Mollie, carta di credito, o sezioni "in arrivo"', () => {
  for (const path of Object.values(LLMS_PATH)) {
    const llms = readFileSync(new URL(path, DIST), 'utf8');
    assert.doesNotMatch(llms, FORBIDDEN_LLMS, `${path} contiene testo vietato`);
  }
});

for (const lang of LANGS) {
  test(`llms.txt ${lang}: prima riga "> " cita Cuba/Havana/Belén nella lingua giusta`, () => {
    const llms = readFileSync(new URL(LLMS_PATH[lang], DIST), 'utf8');
    const summaryLine = llms.split('\n').find((l) => l.startsWith('> '));
    assert.ok(summaryLine, `manca una riga "> " in ${LLMS_PATH[lang]}`);
    for (const re of LLMS_SUMMARY_CHECKS[lang]) assert.match(summaryLine, re);
  });

  test(`llms.txt ${lang}: sezione pagine presente`, () => {
    const llms = readFileSync(new URL(LLMS_PATH[lang], DIST), 'utf8');
    assert.match(llms, LLMS_HEADING[lang]);
  });
}
