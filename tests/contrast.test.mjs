import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Legge i token veri: il test non può divergere dal CSS
const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
const token = (name) => {
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`token mancante: --${name}`);
  return m[1];
};
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// Coppie testo/fondo usate nei blocchi (spec, Design system)
const PAIRS = [
  ['ink', 'orange'], ['ink', 'pink'], ['ink', 'cream'],
  ['white', 'blue'], ['accent', 'blue'], ['white', 'ink'], ['accent', 'ink'],
];
for (const [fg, bg] of PAIRS) {
  test(`contrasto ${fg} su ${bg} ≥ 4.5`, () => {
    assert.ok(ratio(token(fg), token(bg)) >= 4.5, `${fg}/${bg} = ${ratio(token(fg), token(bg)).toFixed(2)}`);
  });
}
