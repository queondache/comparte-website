import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, html, LANGS, PAGES } from './lib/dist.mjs';

const IDS = ['hero', 'perche-educazione', 'progetti', 'cuba', 'impatto', 'chi-siamo', 'cinque-x-mille', 'dona', 'faq', 'newsletter'];

for (const lang of LANGS) {
  const path = PAGES[lang].home;

  test(`${lang}: blocchi della home nell'ordine della spec`, () => {
    const s = html(path);
    const pos = IDS.map((id) => s.indexOf(`id="${id}"`));
    pos.forEach((p, i) => assert.ok(p > 0, `manca #${IDS[i]}`));
    const core = pos.slice(0, 6);
    assert.deepEqual([...core].sort((a, b) => a - b), core, 'ordine dei primi 6 blocchi sbagliato');
  });

  test(`${lang}: ordine 5×1000 / bonifico per lingua`, () => {
    const s = html(path);
    const five = s.indexOf('id="cinque-x-mille"');
    const bank = s.indexOf('id="dona"');
    if (lang === 'it') assert.ok(five < bank, 'in IT il 5×1000 va prima');
    else assert.ok(bank < five, `in ${lang} il bonifico va prima`);
  });

  test(`${lang}: chi-siamo prima della donazione, faq dopo, newsletter per ultima`, () => {
    const s = html(path);
    const chiSiamo = s.indexOf('id="chi-siamo"');
    const five = s.indexOf('id="cinque-x-mille"');
    const bank = s.indexOf('id="dona"');
    const faq = s.indexOf('id="faq"');
    const newsletter = s.indexOf('id="newsletter"');
    assert.ok(chiSiamo < Math.min(five, bank), 'chi-siamo deve venire prima del blocco donazione');
    assert.ok(Math.max(five, bank) < faq, 'la faq deve venire dopo il blocco donazione');
    assert.ok(faq < newsletter, 'la newsletter deve essere l\'ultimo blocco');
  });

  test(`${lang}: tre numeri grandi con fonte linkata`, () => {
    const stats = page(path).querySelectorAll('#perche-educazione .stat');
    assert.equal(stats.length, 3);
    stats.forEach((st) => {
      assert.ok(st.querySelector('.stat-value').text.trim());
      assert.match(st.querySelector('a').getAttribute('href'), /^https:\/\/data\.worldbank\.org\//);
    });
  });

  test(`${lang}: blocco Cuba con El Bloqueo → pagina cuba e Dona ora → #dona`, () => {
    const links = page(path).querySelectorAll('#cuba a').map((a) => a.getAttribute('href'));
    assert.ok(links.includes(PAGES[lang].cuba), `link a ${PAGES[lang].cuba} mancante: ${links}`);
    assert.ok(links.includes('#dona'), 'Dona ora deve portare a #dona');
  });

  test(`${lang}: CF e IBAN presenti e copiabili senza JS`, () => {
    const p = page(path);
    const values = p.querySelectorAll('.copy-value').map((n) => n.text.trim());
    assert.ok(values.includes('97977810585'));
    p.querySelectorAll('.copy-btn').forEach((b) => assert.ok(b.getAttribute('data-copy'), 'bottone senza data-copy'));

    // IBAN: data-copy resta il valore grezzo; il valore visibile può essere raggruppato
    // a blocchi di 4 per la leggibilità, ma senza gli spazi deve coincidere con il grezzo.
    const rawIban = 'IT27J0501803200000016738783';
    const ibanBtn = p.querySelectorAll('.copy-btn').find((b) => b.getAttribute('data-copy') === rawIban);
    assert.ok(ibanBtn, 'bottone IBAN con data-copy grezzo mancante');
    const ibanValueNode = ibanBtn.parentNode.querySelector('.copy-value');
    assert.equal(ibanValueNode.text.trim().replace(/\s+/g, ''), rawIban, 'valore visibile IBAN senza spazi deve coincidere col grezzo');
  });

  test(`${lang}: menu mobile funziona senza JS (<details>) e desktop resta aperto senza JS`, () => {
    const p = page(path);
    assert.ok(p.querySelector('header details summary'), 'manca <details><summary> nel menu');
    const details = p.querySelector('header details');
    assert.ok(details.hasAttribute('open'), 'il <details> del menu deve arrivare già aperto (nav desktop senza JS)');
  });

  test(`${lang}: newsletter senza action → niente form e niente Mailchimp`, () => {
    const s = html(path);
    assert.doesNotMatch(s, /list-manage\.com|mailchimp/i);
    assert.equal(page(path).querySelector('#newsletter form'), null);
    assert.ok(page(path).querySelector('#newsletter a[href*="instagram.com"]'));
  });

  test(`${lang}: un solo h1`, () => {
    assert.equal(page(path).querySelectorAll('h1').length, 1);
  });
}
