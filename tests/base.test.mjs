import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, html } from './lib/dist.mjs';

test('home IT esiste con lang="it" e titolo', () => {
  const p = page('/');
  assert.equal(p.querySelector('html').getAttribute('lang'), 'it');
  assert.match(p.querySelector('title').text, /Comparte/);
});

test('nessuno script o font esterno nella home IT', () => {
  const s = html('/');
  assert.doesNotMatch(s, /<script[^>]+src="https?:\/\//);
  assert.doesNotMatch(s, /fonts\.googleapis|fonts\.gstatic/);
});

test('nessuna "Onlus" nel testo visibile', () => {
  const p = page('/');
  p.querySelectorAll('script').forEach((n) => n.remove());
  assert.doesNotMatch(p.text, /onlus/i);
});
