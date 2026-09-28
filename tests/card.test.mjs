import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { page, LANGS, PAGES, DIST } from './lib/dist.mjs';

// Donazione con carta tramite link SumUp (provider europeo, importo libero)
const LINK = 'https://pay.sumup.com/b2c/QPE9G8BD';
const CTA = { it: 'Dona con carta', es: 'Dona con tarjeta', en: 'Donate by card' };
const LLMS = { it: 'llms.txt', es: 'es/llms.txt', en: 'en/llms.txt' };

for (const lang of LANGS) {
  for (const key of ['home', 'dona', 'cuba']) {
    test(`${lang}/${key}: bottone carta SumUp in nuova scheda`, () => {
      const links = page(PAGES[lang][key]).querySelectorAll(`a[href="${LINK}"]`);
      assert.equal(links.length, 1, 'serve esattamente un link SumUp');
      const a = links[0];
      assert.equal(a.getAttribute('target'), '_blank');
      assert.match(a.getAttribute('rel') ?? '', /\bnoopener\b/);
      assert.match(a.text, new RegExp(CTA[lang]));
      assert.ok(a.querySelector('.visually-hidden'), 'avviso "nuova scheda" per lettori di schermo');
    });
  }

  test(`${lang}: JSON-LD DonateAction punta al link carta`, () => {
    const all = page(PAGES[lang].home).querySelectorAll('script[type="application/ld+json"]').map((b) => JSON.parse(b.text));
    const donate = all.find((o) => o['@type'] === 'DonateAction');
    assert.equal(donate?.target?.urlTemplate, LINK);
  });

  test(`${lang}: llms.txt cita il link carta SumUp`, () => {
    assert.match(readFileSync(new URL(LLMS[lang], DIST), 'utf8'), /https:\/\/pay\.sumup\.com\/b2c\/QPE9G8BD/);
  });
}
