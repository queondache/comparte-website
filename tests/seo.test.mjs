import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { page, html, file, LANGS, PAGES, DIST } from './lib/dist.mjs';

const ABS = 'https://www.comparte.it';
const ITALIAN = /\b(della|degli|delle|nelle|nella|sono|anche|questo|nostro|nostra|lavoriamo|formiamo|dichiarazione|codice fiscale|sosteniamo|iscriviti|perché|chi siamo|anni|bonifico|scuola|comunità|occhiali|medicine|grazie)\b/i;
// Parola "onlus" come termine a sé (non come sottostringa di URL tipo comparteonlus)
const ONLUS_WORD = /\bonlus\b/i;

for (const lang of LANGS) {
  for (const [key, path] of Object.entries(PAGES[lang])) {
    test(`${lang}/${key}: canonical e hreflang reciproci`, () => {
      const p = page(path);
      assert.equal(p.querySelector('link[rel="canonical"]').getAttribute('href'), ABS + path);
      const alts = Object.fromEntries(p.querySelectorAll('link[rel="alternate"][hreflang]').map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')]));
      for (const l of LANGS) assert.equal(alts[l], ABS + PAGES[l][key], `hreflang ${l}`);
      assert.equal(alts['x-default'], ABS + PAGES.it[key]);
    });

    test(`${lang}/${key}: JSON-LD valido`, () => {
      const blocks = page(path).querySelectorAll('script[type="application/ld+json"]');
      assert.ok(blocks.length >= 1);
      blocks.forEach((b) => assert.doesNotThrow(() => JSON.parse(b.text)));
    });

    if (lang !== 'it') {
      test(`${lang}/${key}: nessuna parola italiana nel testo visibile`, () => {
        const p = page(path);
        p.querySelectorAll('script, style').forEach((n) => n.remove());
        const m = p.text.match(ITALIAN);
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
  assert.doesNotMatch(s, /Onlus/); // gli URL social comparteonlus sono minuscoli e ammessi
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
  assert.doesNotMatch(llms, ONLUS_WORD);
  assert.ok(existsSync(new URL('404.html', DIST)));
});

test('llms.txt tradotti (es, en): presenti, con Cuba, senza onlus', () => {
  for (const lang of ['es', 'en']) {
    const llms = readFileSync(new URL(`${lang}/llms.txt`, DIST), 'utf8');
    assert.match(llms, /Cuba/);
    assert.doesNotMatch(llms, ONLUS_WORD);
  }
});
