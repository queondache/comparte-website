import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, html, LANGS, PAGES } from './lib/dist.mjs';

for (const lang of LANGS) {
  for (const [key, path] of Object.entries(PAGES[lang])) {
    test(`${lang}: ${key} esiste con lang corretto e un h1`, () => {
      const p = page(path);
      assert.equal(p.querySelector('html').getAttribute('lang'), lang);
      assert.equal(p.querySelectorAll('h1').length, 1);
    });
  }

  test(`${lang}: /cuba/ nomina Belén, ha IBAN e link a elbloqueo.it`, () => {
    const s = html(PAGES[lang].cuba);
    assert.match(s, /Belén/);
    assert.match(s, /IT27J0501803200000016738783/);
    assert.match(s, /href="https:\/\/elbloqueo\.it\//);
  });

  test(`${lang}: /dona/ ha 5×1000, IBAN e FAQ complete`, () => {
    const p = page(PAGES[lang].dona);
    assert.ok(p.querySelector('#cinque-x-mille'));
    assert.ok(p.querySelector('#dona'));
    assert.equal(p.querySelectorAll('.faq details').length, 6);
  });

  test(`${lang}: pagina grazie noindex`, () => {
    assert.match(html(PAGES[lang].grazie), /<meta name="robots" content="noindex"/);
  });

  test(`${lang}: trasparenza porta il contenuto vecchio`, () => {
    assert.ok(page(PAGES[lang].trasparenza).querySelector('main').text.length > 1000);
  });
}
