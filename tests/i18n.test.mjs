import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const load = (l) => JSON.parse(readFileSync(new URL(`../src/i18n/${l}.json`, import.meta.url), 'utf8'));
const shape = (o) => (Array.isArray(o) ? [`[${o.length}]`, ...o.flatMap((x, i) => shape(x).map((k) => `${i}.${k}`))]
  : o && typeof o === 'object' ? Object.entries(o).flatMap(([k, v]) => [k, ...shape(v).map((s) => `${k}.${s}`)]) : []);

test('le tre lingue hanno le stesse chiavi e le stesse lunghezze di lista', () => {
  const it = shape(load('it')).sort();
  for (const l of ['es', 'en']) assert.deepEqual(shape(load(l)).sort(), it, `chiavi diverse in ${l}`);
});

test('nessun valore vuoto', () => {
  for (const l of ['it', 'es', 'en']) {
    const walk = (o, p) => Object.entries(o).forEach(([k, v]) => (typeof v === 'object' ? walk(v, `${p}.${k}`) : assert.ok(String(v).trim(), `${l}${p}.${k} vuoto`)));
    walk(load(l), '');
  }
});

// Parole italiane che non devono comparire in ES/EN (lista del controller precedente, estesa)
const ITALIAN = /\b(della|degli|delle|nelle|nella|sono|anche|questo|nostro|nostra|lavoriamo|formiamo|dichiarazione|codice fiscale|sosteniamo|iscriviti|in arrivo|perché|chi siamo|anni|bonifico|scuola|comunità|occhiali|medicine|grazie)\b/i;
test('nessuna parola italiana nei dizionari ES ed EN', () => {
  for (const l of ['es', 'en']) {
    const txt = JSON.stringify(load(l));
    const m = txt.match(ITALIAN);
    assert.equal(m, null, `${l}: "${m && m[0]}"`);
  }
});

test('nessuna "Onlus" e nessun riferimento a carta o Mollie', () => {
  for (const l of ['it', 'es', 'en']) {
    const txt = JSON.stringify(load(l));
    assert.doesNotMatch(txt, /onlus|mollie/i, l);
  }
});

test('El Bloqueo mai "di Comparte"', () => {
  for (const l of ['it', 'es', 'en']) {
    assert.doesNotMatch(JSON.stringify(load(l)), /El Bloqueo di Comparte|El Bloqueo de Comparte|Comparte's El Bloqueo/i, l);
  }
});

test('dati del sito corretti', () => {
  const s = JSON.parse(readFileSync(new URL('../src/data/site.json', import.meta.url), 'utf8'));
  assert.equal(s.cf, '97977810585');
  assert.equal(s.iban, 'IT27J0501803200000016738783');
});
