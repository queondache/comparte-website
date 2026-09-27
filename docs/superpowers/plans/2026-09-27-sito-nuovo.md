# Sito nuovo Comparte — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sostituire il sito statico di www.comparte.it con un sito Astro nuovo (direzione "manifesto"), in IT/ES/EN, con home a 7 blocchi, pagine `/dona/`, `/cuba/`, `/trasparenza/`, `/grazie/`.

**Architecture:** Progetto Astro 7 statico nella radice del repo, sul branch `sito-nuovo` (worktree `~/Dev/worktrees/comparte-sito-nuovo`). Tutti i testi stanno in `src/i18n/{it,es,en}.json` con le stesse chiavi; ogni pagina è un file sottile per lingua che passa `lang` a un componente-pagina condiviso. I test girano con `node --test` sul `dist/` costruito.

**Tech Stack:** Astro 7.3, `@astrojs/sitemap` 3.7, `@fontsource-variable/plus-jakarta-sans` (font self-hosted), `node-html-parser` (solo nei test), Node 22+ (`node --test`), GitHub Actions `withastro/action` + `actions/deploy-pages`.

**Spec:** `docs/superpowers/specs/2026-09-27-sito-nuovo-design.md`

## Global Constraints

- Nome pubblico solo "Comparte". Mai "Onlus" nei testi, nei meta o nel JSON-LD (eccezione: gli URL dei social `comparteonlus`, che restano come sono).
- Forma giuridica "Associazione". El Bloqueo è un progetto che Comparte **sostiene**, mai "di Comparte".
- Codice fiscale `97977810585`. IBAN `IT27J0501803200000016738783` (Banca Etica), intestato "Comparte". P.IVA `16847801004`. Sede: Via G. G. Porro 8, 00197 Roma. Email `info@comparte.it`.
- Nessun pagamento con carta, nessun riferimento a Mollie. Fondo unico: nessuna causale separata per Cuba.
- Tono: IT "tu", ES "tú", EN "you", frasi brevi. In ES ed EN nessuna parola italiana.
- In IT il 5×1000 viene prima del bonifico; in ES/EN il bonifico prima, il 5×1000 è un riquadro secondario "per chi paga le tasse in Italia".
- Nessuno script di terze parti né font esterni al caricamento. JS lato client solo vanilla e inline (bottoni Copia, menu mobile).
- Colori: Blu `#1A4A6B`, Arancio `#E8621A`, Rosa `#D4547A`, Crema `#F5EFE0`, Inchiostro `#1C1612`, Accento su blu `#FFB27A`. Testo inchiostro su arancio, rosa, crema; bianco o accento su blu e inchiostro. Mai testo arancio su crema (4.12:1, fallisce).
- Scala tipografica: `--fs-display` 56→120 px/800, `--fs-h2` 40→72 px/800, `--fs-stat` 72→160 px/800, `--fs-h3` 22→28 px/700, `--fs-body` 18 px/400/1.6, `--fs-small` 14 px.
- Bottoni: pillola, altezza minima 48 px, focus visibile. Niente ombre, niente card con bordino.
- URL: IT senza prefisso (`/`, `/dona/`, `/cuba/`, `/trasparenza/`, `/grazie/`), ES `/es/…` (`/es/dona/`, `/es/cuba/`, `/es/transparencia/`, `/es/gracias/`), EN `/en/…` (`/en/donate/`, `/en/cuba/`, `/en/transparency/`, `/en/thank-you/`). Ancore home stabili: `#hero`, `#perche-educazione`, `#progetti`, `#cuba`, `#impatto`, `#chi-siamo`, `#cinque-x-mille`, `#dona`, `#faq`, `#newsletter`.
- Lighthouse mobile ≥ 95 in tutte e quattro le categorie, su ogni pagina.
- Commenti nel codice in italiano, nomi in inglese.
- Foto: `IMG_0152` solo ritagliata sul tavolo, senza la scritta sulla maglietta. `IMG_0180` **non si usa** (APERTO-03: volti di bambini).
- Nessun merge su `main` e nessuna modifica alle impostazioni di GitHub Pages senza OK esplicito di Andrea.

## Review Focus

1. Chi apre un vecchio link (`/#dona`, `/#cinque-x-mille`, `/en/transparency/`, `/es/transparencia/`) deve arrivare nel punto giusto: test sulle ancore e sulle pagine esistenti in Task 5.
2. Il bottone "Copia" senza API clipboard (http, browser vecchi) non deve rompersi: il testo resta selezionabile e il bottone mostra "Seleziona e copia". Test sul markup in Task 3.
3. Menu mobile a 375 px usabile da tastiera, e senza JS il menu resta leggibile: test sul markup (`<details>`) in Task 3.
4. Numeri enormi (`--fs-stat` 160 px) non devono creare scroll orizzontale a 375 px: controllo `scrollWidth` in Task 7.
5. Form newsletter vuoto (manca l'`action` Mailchimp): nessun `<form>` rotto in pagina, nessuna richiesta a domini Mailchimp. Test in Task 3.

---

## File Structure

```
package.json                     script: dev, build, test
astro.config.mjs                 site, sitemap con i18n, trailingSlash always
public/CNAME                     www.comparte.it
public/robots.txt
public/llms.txt                  portato dal vecchio, senza "Onlus", con Cuba
public/favicon-*.png, apple-touch-icon.png   spostati dalla radice
src/data/site.json               dati legali e config (CF, IBAN, mailchimp)
src/i18n/it.json es.json en.json tutti i testi, stesse chiavi
src/i18n/index.ts                t(lang), routes, altLinks(pageKey)
src/styles/tokens.css            colori e scala tipografica
src/styles/global.css            reset, blocchi, bottoni, griglia
src/layouts/Base.astro           <head>, hreflang, JSON-LD, header, footer
src/components/Header.astro      logo, menu (<details> su mobile), lingua, bottone Dona
src/components/Footer.astro
src/components/Block.astro       <section> a tutta larghezza con colore
src/components/Stat.astro        numero grande + frase + fonte
src/components/CopyField.astro   valore + bottone Copia
src/components/DonateBlock.astro 5×1000 + bonifico, ordine per lingua
src/components/Newsletter.astro
src/components/Faq.astro
src/pages-shared/HomePage.astro  i 7 blocchi + chi ci conosce + faq + newsletter
src/pages-shared/DonaPage.astro
src/pages-shared/CubaPage.astro
src/pages-shared/ThanksPage.astro
src/pages-shared/TransparencyPage.astro  contenuto portato dal vecchio
src/content/trasparenza/{it,es,en}.html  <main> dei vecchi file, verbatim
src/pages/index.astro dona/index.astro cuba/index.astro trasparenza/index.astro grazie/index.astro 404.astro
src/pages/es/… src/pages/en/…    file sottili per lingua
src/assets/photos/               hero.jpg, chi-siamo.jpg, galleria/01-11.webp, cuba-consegna.jpg
scripts/crop-cuba.mjs            ritaglio di IMG_0152
tests/lib/dist.mjs               helper sul dist
tests/*.test.mjs
.github/workflows/ci.yml         build + test su PR
.github/workflows/deploy.yml     deploy Pages su push a main (attivo solo dopo il cambio impostazioni)
```

Vecchi file da rimuovere dalla radice nel Task 1: `index.html`, `es/`, `en/`, `trasparenza/`, `grazie/` (se presente), `assets/css`, `assets/js`, `sitemap.xml`, `llms.txt` (portato in `public/`), `scripts/check_home.py`, `.nojekyll` (non serve più: il deploy passa dall'Action). Le immagini di `assets/img` e `assets/logo` si spostano in `src/assets/` o `public/`.

---

### Task 1: Scheletro Astro, token, layout base, test harness

**Files:**
- Create: `package.json`, `astro.config.mjs`, `src/styles/tokens.css`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/pages/index.astro`, `public/CNAME`, `public/robots.txt`, `tests/lib/dist.mjs`, `tests/base.test.mjs`, `tests/contrast.test.mjs`, `.github/workflows/ci.yml`
- Delete: vecchi file elencati sopra (con `git rm`), salvo `assets/img` e `assets/logo` che si spostano.

**Interfaces:**
- Produces: `Base.astro` con props `{ lang: 'it'|'es'|'en', pageKey: 'home'|'dona'|'cuba'|'trasparenza'|'grazie', title: string, description: string, noindex?: boolean }`; `tests/lib/dist.mjs` con `page(path)`, `html(path)`, `PAGES`, `LANGS`.

- [ ] **Step 1: Estrai il contenuto della trasparenza prima di cancellare i vecchi file**

```bash
cd ~/Dev/worktrees/comparte-sito-nuovo
mkdir -p src/content/trasparenza
python3 - <<'EOF'
import re
for lang, path in [('it','trasparenza/index.html'),('es','es/transparencia/index.html'),('en','en/transparency/index.html')]:
    s = open(path).read()
    m = re.search(r'<main[^>]*>(.*?)</main>', s, re.S)
    assert m, f'manca <main> in {path}'
    body = m.group(1).replace('Comparte Onlus', 'Comparte').replace('Onlus', '')
    open(f'src/content/trasparenza/{lang}.html', 'w').write(body.strip() + '\n')
    print(lang, len(body))
EOF
```
Expected: tre righe con lunghezze > 1000.

- [ ] **Step 2: Sposta immagini e asset, rimuovi il vecchio sito**

```bash
mkdir -p src/assets/photos/galleria public
git mv assets/img/hero/hero.jpg src/assets/photos/hero.jpg
git mv assets/img/hero/chi-siamo.jpg src/assets/photos/chi-siamo.jpg
git mv assets/img/cinema/cinema-origins.webp src/assets/photos/cinema.webp
for f in assets/img/galleria/*.webp; do git mv "$f" src/assets/photos/galleria/; done
git mv assets/logo public/logo
git mv favicon-16x16.png favicon-32x32.png apple-touch-icon.png public/
git mv llms.txt public/llms.txt
git mv CNAME public/CNAME
git mv robots.txt public/robots.txt
git rm -rq index.html es en trasparenza assets sitemap.xml scripts/check_home.py .nojekyll
ls grazie 2>/dev/null && git rm -rq grazie
git status --short | head -40
```

- [ ] **Step 3: Crea `package.json` e installa** (dipendenze dichiarate nel piano, approvate con la spec)

```json
{
  "name": "comparte-website",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "astro build && node --test tests/"
  },
  "dependencies": {
    "astro": "^7.3.5",
    "@astrojs/sitemap": "^3.7.4",
    "@fontsource-variable/plus-jakarta-sans": "^5.2.0"
  },
  "devDependencies": {
    "node-html-parser": "^7.0.1"
  },
  "engines": { "node": ">=22" }
}
```

Run: `npm install` → exit 0, `package-lock.json` creato. Aggiungi `.gitignore` con `node_modules/`, `dist/`, `.astro/`.

- [ ] **Step 4: Scrivi il test harness e i test base (rossi)**

`tests/lib/dist.mjs`:
```js
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
```

`tests/base.test.mjs`:
```js
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
```

`tests/contrast.test.mjs`:
```js
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
```

- [ ] **Step 5: Esegui e verifica il rosso**

Run: `node --test tests/`
Expected: FAIL — "pagina mancante nel dist: /" e "token mancante: --ink". Salva l'output raw in `docs/evidence/T1-red.txt`.

- [ ] **Step 6: Implementa config, token, CSS base, layout e home minima**

`astro.config.mjs`:
```js
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
      i18n: { defaultLocale: 'it', locales: { it: 'it', es: 'es', en: 'en' } },
      // Le pagine di ringraziamento e la 404 restano fuori
      filter: (url) => !/\/(grazie|gracias|thank-you|404)\//.test(url),
    }),
  ],
});
```

`src/styles/tokens.css`:
```css
/* Token del design "manifesto": colori e scala tipografica unica */
:root {
  --blue: #1A4A6B;
  --orange: #E8621A;
  --pink: #D4547A;
  --cream: #F5EFE0;
  --ink: #1C1612;
  --white: #FFFFFF;
  --accent: #FFB27A;

  --font: 'Plus Jakarta Sans Variable', system-ui, sans-serif;
  --fs-display: clamp(56px, 4.4vw + 40px, 120px);
  --fs-h2: clamp(40px, 3vw + 29px, 72px);
  --fs-stat: clamp(72px, 8.2vw + 41px, 160px);
  --fs-h3: clamp(22px, 0.6vw + 20px, 28px);
  --fs-body: 18px;
  --fs-small: 14px;

  --gutter: clamp(20px, 4vw, 64px);
  --block-pad: clamp(64px, 8vw, 160px);
  --max: 1320px;
}
```

`src/styles/global.css`:
```css
@import '@fontsource-variable/plus-jakarta-sans';
@import './tokens.css';

*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; font-family: var(--font); font-size: var(--fs-body); line-height: 1.6; color: var(--ink); background: var(--cream); overflow-x: clip; }
img { display: block; max-width: 100%; height: auto; }
a { color: inherit; }
:focus-visible { outline: 3px solid currentColor; outline-offset: 3px; }
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

/* Blocchi a tutta larghezza */
.block { padding: var(--block-pad) var(--gutter); }
.block > .inner { max-width: var(--max); margin: 0 auto; }
.block--blue { background: var(--blue); color: var(--white); }
.block--orange { background: var(--orange); color: var(--ink); }
.block--pink { background: var(--pink); color: var(--ink); }
.block--cream { background: var(--cream); color: var(--ink); }
.block--ink { background: var(--ink); color: var(--white); }

.eyebrow { font-size: var(--fs-small); font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin: 0 0 24px; }
.display { font-size: var(--fs-display); font-weight: 800; line-height: .95; letter-spacing: -.035em; margin: 0; overflow-wrap: anywhere; }
h2, .h2 { font-size: var(--fs-h2); font-weight: 800; line-height: 1; letter-spacing: -.03em; margin: 0 0 32px; overflow-wrap: anywhere; }
h3, .h3 { font-size: var(--fs-h3); font-weight: 700; line-height: 1.2; margin: 0 0 12px; }
.lead { font-size: clamp(20px, 1vw + 16px, 26px); max-width: 38ch; }
.prose { max-width: 62ch; }
.accent { color: var(--accent); }

/* Bottoni a pillola */
.btn { display: inline-flex; align-items: center; min-height: 48px; padding: 12px 28px; border-radius: 999px; font-weight: 700; text-decoration: none; border: 2px solid currentColor; }
.btn--solid-orange { background: var(--orange); color: var(--ink); border-color: var(--orange); }
.btn--solid-ink { background: var(--ink); color: var(--white); border-color: var(--ink); }
.btns { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 40px; }

.grid-3 { display: grid; gap: 40px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); }

@media (prefers-reduced-motion: no-preference) {
  .stat-value { animation: rise .6s ease-out both; }
  @keyframes rise { from { opacity: 0; transform: translateY(12px); } }
}
```

`src/layouts/Base.astro` (versione minima; Task 5 aggiunge hreflang, canonical, JSON-LD; Task 3 header e footer):
```astro
---
import '../styles/global.css';
interface Props { lang: 'it' | 'es' | 'en'; pageKey: string; title: string; description: string; noindex?: boolean }
const { lang, title, description, noindex = false } = Astro.props;
---
<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    {noindex && <meta name="robots" content="noindex" />}
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <slot name="head" />
  </head>
  <body>
    <main id="main"><slot /></main>
  </body>
</html>
```

`src/pages/index.astro` (provvisoria, sostituita nel Task 3):
```astro
---
import Base from '../layouts/Base.astro';
---
<Base lang="it" pageKey="home" title="Comparte — L'educazione cambia tutto" description="Educazione nel Petén, in Guatemala, dal 2018.">
  <section class="block block--blue" id="hero"><div class="inner"><h1 class="display">L'educazione cambia tutto</h1></div></section>
</Base>
```

`.github/workflows/ci.yml`:
```yaml
name: CI
on:
  pull_request:
concurrency:
  group: ci-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true
permissions:
  contents: read
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm test
```

- [ ] **Step 7: Esegui i test**

Run: `npm test`
Expected: tutti PASS (3 base + 7 contrasto). Output raw in `docs/evidence/T1-green.txt`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(T1): scheletro Astro, token manifesto, test harness

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Dizionari delle tre lingue e dati del sito

**Files:**
- Create: `src/data/site.json`, `src/i18n/it.json`, `src/i18n/es.json`, `src/i18n/en.json`, `src/i18n/index.ts`, `tests/i18n.test.mjs`

**Interfaces:**
- Produces: `import { t, routes, altLinks, type Lang } from '../i18n'`; `t(lang)` restituisce il dizionario tipizzato come `typeof it`; `routes[lang][pageKey]` restituisce il path; `altLinks(pageKey)` restituisce `[{ lang, href }]` con URL assoluti; `site` da `src/data/site.json` con `{ cf, iban, bank, holder, vat, address, email, mailchimpAction, mailchimpHoneypot, social: { instagram, facebook, linkedin } }`.

- [ ] **Step 1: Scrivi i test (rossi)**

`tests/i18n.test.mjs`:
```js
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
```

Run: `node --test tests/i18n.test.mjs` → FAIL "ENOENT … it.json". Output in `docs/evidence/T2-red.txt`.

**Prova che il test sull'italiano morde**: dopo lo Step 3 metti temporaneamente `"test": "della"` in `es.json`, esegui e verifica FAIL `es: "della"`, poi rimuovilo. Output in `docs/evidence/T2-bite.txt`.

- [ ] **Step 2: Crea `src/data/site.json`**

```json
{
  "cf": "97977810585",
  "iban": "IT27J0501803200000016738783",
  "bank": "Banca Etica",
  "holder": "Comparte",
  "vat": "16847801004",
  "address": "Via G. G. Porro 8, 00197 Roma",
  "email": "info@comparte.it",
  "mailchimpAction": "",
  "mailchimpHoneypot": "",
  "social": {
    "instagram": "https://www.instagram.com/comparteonlus/",
    "facebook": "https://www.facebook.com/comparteonlus/",
    "linkedin": "https://it.linkedin.com/company/comparteonlus"
  }
}
```

- [ ] **Step 3: Crea i tre dizionari**

`src/i18n/it.json`:
```json
{
  "meta": {
    "homeTitle": "Comparte — L'educazione cambia tutto",
    "homeDescription": "Dal 2018 formiamo docenti, ragazzi e comunità nel Petén, in Guatemala. All'Havana portiamo occhiali e medicine. Dona il 5×1000: codice fiscale 97977810585.",
    "donaTitle": "Dona a Comparte — 5×1000 e bonifico",
    "donaDescription": "Come sostenere Comparte: 5×1000 con il codice fiscale 97977810585 o bonifico a Banca Etica.",
    "cubaTitle": "Comparte a Cuba — Occhiali e medicine all'Havana",
    "cubaDescription": "Da oltre 4 anni sosteniamo l'asilo per anziani di Belén e le scuole primarie dell'Havana con occhiali da vista e medicine.",
    "trasparenzaTitle": "Trasparenza — Comparte",
    "trasparenzaDescription": "Bilanci, rendiconti del 5×1000 e dati legali di Comparte.",
    "grazieTitle": "Grazie — Comparte",
    "grazieDescription": "Grazie per il tuo sostegno a Comparte."
  },
  "ui": {
    "skip": "Vai al contenuto",
    "menu": "Menu",
    "langLabel": "Lingua",
    "copy": "Copia",
    "copied": "Copiato",
    "copyFallback": "Seleziona e copia",
    "newTab": "(si apre in una nuova scheda)",
    "source": "Fonte"
  },
  "nav": { "progetti": "Cosa facciamo", "cuba": "Cuba", "chiSiamo": "Chi siamo", "trasparenza": "Trasparenza", "dona": "Dona" },
  "hero": {
    "eyebrow": "Dal 2018 nel Petén, in Guatemala",
    "title": "L'educazione cambia tutto",
    "subtitle": "Formiamo docenti, ragazzi e comunità nel Petén. E all'Havana portiamo occhiali e medicine a chi ne ha bisogno.",
    "ctaPrimary": "Dona il 5×1000",
    "ctaPrimaryHref": "#cinque-x-mille",
    "ctaSecondary": "Altri modi per donare",
    "ctaSecondaryHref": "#dona",
    "imgAlt": "Studenti del Centro Universitario de Petén, Guatemala"
  },
  "numbers": {
    "title": "Nel Petén la scuola è ancora una conquista",
    "items": [
      { "value": "49%", "text": "dei ragazzi in Guatemala finisce la scuola media.", "source": "Banca Mondiale, 2024", "url": "https://data.worldbank.org/indicator/SE.SEC.CMPT.LO.ZS?locations=GT" },
      { "value": "82%", "text": "degli adulti sa leggere e scrivere. Quasi uno su cinque no.", "source": "Banca Mondiale, 2024", "url": "https://data.worldbank.org/indicator/SE.ADT.LITR.ZS?locations=GT" },
      { "value": "9,7", "text": "gli anni di scuola che un bambino può aspettarsi.", "source": "Banca Mondiale, 2020", "url": "https://data.worldbank.org/indicator/HD.HCI.EYRS?locations=GT" }
    ],
    "outro": "Per questo lavoriamo accanto a chi insegna, studia e coltiva la terra."
  },
  "projects": {
    "title": "Cosa facciamo nel Petén",
    "items": [
      { "label": "Docenti", "name": "Comparte Universidad", "text": "Seminari online con docenti europei per chi studia e insegna al CUDEP, il centro più isolato dell'università pubblica del Guatemala. Dal 2018, oltre 1.500 persone formate." },
      { "label": "Ragazzi e clima", "name": "Comparte Educación", "text": "Cinque moduli sulla crisi climatica per ragazze e ragazzi dai 13 ai 17 anni. La prima edizione, a Nuevo Horizonte con INAB e MARN, ha coinvolto 27 studenti." },
      { "label": "Comunità", "name": "Comparte Comunidad", "text": "Formazione agricola nelle comunità dove zeroCO2 pianta alberi. Terra, raccolti e pratiche utili ogni giorno." }
    ]
  },
  "cuba": {
    "eyebrow": "L'Havana, Cuba",
    "title": "Occhiali e medicine, da oltre 4 anni",
    "text": "All'Havana sosteniamo l'asilo per anziani di Belén e le scuole primarie della città e della provincia. Portiamo occhiali da vista e medicine, dove il blocco rende difficile trovarli.",
    "ctaBloqueo": "El Bloqueo",
    "ctaDona": "Dona ora"
  },
  "impact": {
    "title": "Quello che abbiamo fatto finora",
    "items": [
      { "value": "1.500+", "label": "persone formate" },
      { "value": "46+", "label": "comunità rurali raggiunte" },
      { "value": "27", "label": "studenti nel programma clima" },
      { "value": "4+", "label": "anni di aiuti a Cuba" }
    ]
  },
  "about": {
    "title": "Nati a un pranzo, nel 2018",
    "text": "Un gruppo di ragazzi italiani e guatemaltechi, seduti a tavola, si è chiesto cosa mancasse davvero alle comunità del Petén. La risposta: educazione di qualità e strumenti concreti. Da lì è nata Comparte, che in spagnolo vuol dire \"condividi\". Abbiamo cominciato con il cinema: tra il 2018 e il 2020 le proiezioni di Comparte Cinema, con l'ICAIC cubano, hanno raggiunto 7 comunità rurali.",
    "board": "Andrea Pesce, presidente · Irene Culcasi, vicepresidente · Virgilio Galicia Gregorio, referente in Guatemala",
    "imgAlt": "Il gruppo di Comparte in Guatemala"
  },
  "donate": {
    "title": "Una firma, un bonifico",
    "fiveTitle": "5×1000",
    "fiveText": "Nella dichiarazione dei redditi firma il riquadro degli enti del Terzo settore e scrivi il nostro codice fiscale. Non ti costa nulla.",
    "cfLabel": "Codice fiscale",
    "bankTitle": "Bonifico",
    "ibanLabel": "IBAN",
    "holderLabel": "Intestato a",
    "reasonLabel": "Causale",
    "reason": "Donazione liberale",
    "monthly": "Per donare ogni mese, imposta un bonifico periodico dalla tua banca.",
    "note": "Le donazioni vanno a tutte le nostre attività, nel Petén e a Cuba. Sono deducibili o detraibili secondo le regole per gli enti del Terzo settore: conserva la ricevuta.",
    "allWays": "Tutti i modi per donare",
    "secondaryIntro": "Per chi paga le tasse in Italia"
  },
  "known": {
    "title": "Chi ci conosce",
    "partnersTitle": "Con chi lavoriamo",
    "pressTitle": "Parlano di noi",
    "partners": [
      { "name": "USAC", "desc": "Universidad de San Carlos de Guatemala" },
      { "name": "LUMSA", "desc": "Università di Roma" },
      { "name": "Scholas", "desc": "Fondazione Pontificia Scholas Occurrentes" },
      { "name": "INAB", "desc": "Instituto Nacional de Bosques, Guatemala" },
      { "name": "MARN", "desc": "Ministerio de Ambiente, Guatemala" },
      { "name": "zeroCO2", "desc": "Società benefit italo-guatemalteca" },
      { "name": "1Caffè", "desc": "Piattaforma italiana di raccolta fondi" },
      { "name": "European Schoolnet", "desc": "Bruxelles" }
    ],
    "press": [
      { "source": "Millionaire", "title": "«Prendiamo alberi da frutto e li doniamo alle popolazioni»", "date": "Febbraio 2021", "url": "https://www.millionaire.it/prendiamo-alberi-da-frutto-e-li-doniamo-alle-popolazioni/" },
      { "source": "Università di Bologna", "title": "Intervista con Andrea Pesce, fondatore di zeroCO2 e Comparte", "date": "Alumni Stories", "url": "https://site.unibo.it/alumni-association/it/alumni-stories/intervista-con-andrea-pesce" },
      { "source": "Tempo Stretto", "title": "Un filo che lega Italia e Guatemala: il sogno di un gruppo di giovani", "date": "Gennaio 2019", "url": "https://www.tempostretto.it/news/336348.html" },
      { "source": "zeroCO2 Magazine", "title": "Riforestazione ed educazione: un mese di Lime per Comparte", "date": "Agosto 2023", "url": "https://zeroco2.eco/it/magazine/persone/lime-per-comparte/" }
    ],
    "gallery": [
      "Comunità di Nuevo Horizonte, Petén",
      "Formazione agricola nelle comunità rurali",
      "Nuevo Horizonte, dove è iniziato tutto",
      "Il pranzo da cui è nata Comparte, 2018",
      "Consegna dei diplomi USAC, Comparte Universidad",
      "Seminario al Centro Universitario de Petén"
    ]
  },
  "faq": {
    "title": "Domande frequenti",
    "items": [
      { "q": "Come destino il 5×1000 a Comparte?", "a": "Nel modello 730, Redditi PF o CU firma il riquadro «Sostegno degli enti del Terzo settore iscritti nel RUNTS» e scrivi il codice fiscale 97977810585. Non costa nulla e non riduce il rimborso." },
      { "q": "Posso donare anche senza il 5×1000?", "a": "Sì, con un bonifico a Banca Etica, IBAN IT27J0501803200000016738783, intestato a Comparte. Conserva la ricevuta." },
      { "q": "Dove vanno i fondi del 5×1000?", "a": "Ai progetti attivi nel Petén: formazione universitaria con la USAC, educazione climatica a Nuevo Horizonte, formazione agricola con le comunità contadine. Il rendiconto è pubblicato ogni anno nella pagina Trasparenza." },
      { "q": "Cosa fate a Cuba?", "a": "Da oltre 4 anni portiamo occhiali da vista e medicine all'asilo per anziani di Belén e alle scuole primarie dell'Havana e della provincia." },
      { "q": "Cos'è Comparte?", "a": "Un'associazione nata nel 2018 tra Roma e il Petén. Formiamo docenti e studenti, portiamo educazione climatica nelle scuole e formazione agricola nelle comunità rurali del Guatemala." },
      { "q": "Comparte è collegata a zeroCO2?", "a": "Sì. Andrea Pesce ha fondato entrambe. zeroCO2 pianta alberi nelle comunità rurali del Petén, Comparte porta nelle stesse comunità formazione ed educazione. Sono indipendenti e collaborano sul campo." }
    ],
    "homeCount": 3
  },
  "newsletter": {
    "title": "Resta in contatto",
    "text": "Poche email all'anno: cosa facciamo, dove vanno i fondi, quando serve il tuo 5×1000.",
    "emailLabel": "La tua email",
    "consent": "Accetto di ricevere la newsletter e ho letto l'informativa privacy.",
    "submit": "Iscriviti",
    "fallback": "Intanto seguici su Instagram."
  },
  "footer": {
    "tagline": "Educazione nel Petén, salute all'Havana.",
    "contacts": "Contatti",
    "legal": "Associazione · C.F. 97977810585 · P.IVA 16847801004",
    "bloqueoNote": "El Bloqueo, un progetto che sosteniamo"
  },
  "donaPage": {
    "title": "Come donare",
    "intro": "Ogni euro va nel Petén e all'Havana. Scegli il modo che ti è più comodo.",
    "fiveSteps": [
      "Apri la dichiarazione dei redditi (730, Redditi PF o CU).",
      "Firma il riquadro «Sostegno degli enti del Terzo settore iscritti nel RUNTS».",
      "Scrivi il nostro codice fiscale sotto la firma."
    ],
    "report": "Come usiamo il 5×1000"
  },
  "cubaPage": {
    "title": "Occhiali e medicine all'Havana",
    "whoTitle": "Chi aiutiamo",
    "who": [
      "L'asilo per anziani di Belén, all'Havana.",
      "Le scuole primarie della città e della provincia."
    ],
    "whatTitle": "Cosa portiamo",
    "what": "Occhiali da vista e medicine. Da oltre 4 anni.",
    "whyTitle": "Perché serve",
    "why": "Il blocco statunitense rende difficile trovare a Cuba medicine e materiali di uso comune. Chi ne paga il prezzo sono soprattutto anziani e bambini.",
    "bloqueoText": "El Bloqueo, un progetto che sosteniamo, lo spiega con fonti verificabili.",
    "bloqueoCta": "Leggi El Bloqueo",
    "donateTitle": "Dona per Cuba e per il Petén",
    "photoAlt": "Consegna di medicine e materiali all'Havana"
  },
  "thanks": {
    "title": "Grazie",
    "text": "Il tuo sostegno arriva nel Petén e all'Havana. Se ti sei iscritto alla newsletter, controlla la tua email per confermare.",
    "back": "Torna alla home",
    "transparency": "Guarda come usiamo i fondi"
  }
}
```

`src/i18n/es.json` (stesse chiavi; in ES la donazione viene prima, quindi `ctaPrimary` porta a `#dona`):
```json
{
  "meta": {
    "homeTitle": "Comparte — La educación lo cambia todo",
    "homeDescription": "Desde 2018 formamos a docentes, jóvenes y comunidades en Petén, Guatemala. En La Habana llevamos lentes y medicamentos. Dona por transferencia bancaria.",
    "donaTitle": "Dona a Comparte — Transferencia bancaria",
    "donaDescription": "Cómo apoyar a Comparte: transferencia bancaria a Banca Etica y, si pagas impuestos en Italia, el 5×1000.",
    "cubaTitle": "Comparte en Cuba — Lentes y medicamentos en La Habana",
    "cubaDescription": "Desde hace más de 4 años apoyamos el hogar de ancianos de Belén y las escuelas primarias de La Habana con lentes graduados y medicamentos.",
    "trasparenzaTitle": "Transparencia — Comparte",
    "trasparenzaDescription": "Balances, informes del 5×1000 y datos legales de Comparte.",
    "grazieTitle": "Gracias — Comparte",
    "grazieDescription": "Gracias por tu apoyo a Comparte."
  },
  "ui": {
    "skip": "Ir al contenido",
    "menu": "Menú",
    "langLabel": "Idioma",
    "copy": "Copiar",
    "copied": "Copiado",
    "copyFallback": "Selecciona y copia",
    "newTab": "(se abre en una pestaña nueva)",
    "source": "Fuente"
  },
  "nav": { "progetti": "Qué hacemos", "cuba": "Cuba", "chiSiamo": "Quiénes somos", "trasparenza": "Transparencia", "dona": "Dona" },
  "hero": {
    "eyebrow": "Desde 2018 en Petén, Guatemala",
    "title": "La educación lo cambia todo",
    "subtitle": "Formamos a docentes, jóvenes y comunidades en Petén. Y en La Habana llevamos lentes y medicamentos a quien los necesita.",
    "ctaPrimary": "Dona ahora",
    "ctaPrimaryHref": "#dona",
    "ctaSecondary": "Qué hacemos",
    "ctaSecondaryHref": "#progetti",
    "imgAlt": "Estudiantes del Centro Universitario de Petén, Guatemala"
  },
  "numbers": {
    "title": "En Petén, estudiar todavía es una conquista",
    "items": [
      { "value": "49%", "text": "de los jóvenes en Guatemala termina la secundaria básica.", "source": "Banco Mundial, 2024", "url": "https://data.worldbank.org/indicator/SE.SEC.CMPT.LO.ZS?locations=GT" },
      { "value": "82%", "text": "de los adultos sabe leer y escribir. Casi uno de cada cinco, no.", "source": "Banco Mundial, 2024", "url": "https://data.worldbank.org/indicator/SE.ADT.LITR.ZS?locations=GT" },
      { "value": "9,7", "text": "los años de estudio que puede esperar un niño.", "source": "Banco Mundial, 2020", "url": "https://data.worldbank.org/indicator/HD.HCI.EYRS?locations=GT" }
    ],
    "outro": "Por eso trabajamos junto a quien enseña, estudia y cultiva la tierra."
  },
  "projects": {
    "title": "Qué hacemos en Petén",
    "items": [
      { "label": "Docentes", "name": "Comparte Universidad", "text": "Seminarios en línea con profesores europeos para quienes estudian y enseñan en el CUDEP, el centro más aislado de la universidad pública de Guatemala. Desde 2018, más de 1.500 personas formadas." },
      { "label": "Jóvenes y clima", "name": "Comparte Educación", "text": "Cinco módulos sobre la crisis climática para chicas y chicos de 13 a 17 años. La primera edición, en Nuevo Horizonte con INAB y MARN, reunió a 27 estudiantes." },
      { "label": "Comunidades", "name": "Comparte Comunidad", "text": "Formación agrícola en las comunidades donde zeroCO2 siembra árboles. Tierra, cosechas y prácticas útiles para cada día." }
    ]
  },
  "cuba": {
    "eyebrow": "La Habana, Cuba",
    "title": "Lentes y medicamentos, desde hace más de 4 años",
    "text": "En La Habana apoyamos el hogar de ancianos de Belén y las escuelas primarias de la ciudad y de la provincia. Llevamos lentes graduados y medicamentos, allí donde el bloqueo hace difícil conseguirlos.",
    "ctaBloqueo": "El Bloqueo",
    "ctaDona": "Dona ahora"
  },
  "impact": {
    "title": "Lo que hemos hecho hasta ahora",
    "items": [
      { "value": "1.500+", "label": "personas formadas" },
      { "value": "46+", "label": "comunidades rurales alcanzadas" },
      { "value": "27", "label": "estudiantes en el programa de clima" },
      { "value": "4+", "label": "años de ayuda a Cuba" }
    ]
  },
  "about": {
    "title": "Nacimos en un almuerzo, en 2018",
    "text": "Un grupo de jóvenes italianos y guatemaltecos, sentados a la mesa, se preguntó qué les faltaba de verdad a las comunidades de Petén. La respuesta: educación de calidad y herramientas concretas. Así nació Comparte. Empezamos con el cine: entre 2018 y 2020 las proyecciones de Comparte Cinema, con el ICAIC cubano, llegaron a 7 comunidades rurales.",
    "board": "Andrea Pesce, presidente · Irene Culcasi, vicepresidenta · Virgilio Galicia Gregorio, enlace en Guatemala",
    "imgAlt": "El equipo de Comparte en Guatemala"
  },
  "donate": {
    "title": "Cómo donar",
    "fiveTitle": "5×1000",
    "fiveText": "Si pagas impuestos en Italia, en tu declaración de la renta firma la casilla de las entidades del Tercer Sector y escribe nuestro código fiscal. No te cuesta nada.",
    "cfLabel": "Código fiscal",
    "bankTitle": "Transferencia bancaria",
    "ibanLabel": "IBAN",
    "holderLabel": "Titular",
    "reasonLabel": "Concepto",
    "reason": "Donación",
    "monthly": "Para donar cada mes, programa una transferencia periódica desde tu banco.",
    "note": "Las donaciones van a todas nuestras actividades, en Petén y en Cuba. Guarda el comprobante de la transferencia.",
    "allWays": "Todas las formas de donar",
    "secondaryIntro": "¿Pagas impuestos en Italia?"
  },
  "known": {
    "title": "Quién nos conoce",
    "partnersTitle": "Con quién trabajamos",
    "pressTitle": "Hablan de nosotros",
    "partners": [
      { "name": "USAC", "desc": "Universidad de San Carlos de Guatemala" },
      { "name": "LUMSA", "desc": "Universidad de Roma" },
      { "name": "Scholas", "desc": "Fundación Pontificia Scholas Occurrentes" },
      { "name": "INAB", "desc": "Instituto Nacional de Bosques, Guatemala" },
      { "name": "MARN", "desc": "Ministerio de Ambiente, Guatemala" },
      { "name": "zeroCO2", "desc": "Empresa de beneficio italo-guatemalteca" },
      { "name": "1Caffè", "desc": "Plataforma italiana de recaudación de fondos" },
      { "name": "European Schoolnet", "desc": "Bruselas" }
    ],
    "press": [
      { "source": "Millionaire", "title": "Artículo sobre los árboles frutales donados a las comunidades (en italiano)", "date": "Febrero 2021", "url": "https://www.millionaire.it/prendiamo-alberi-da-frutto-e-li-doniamo-alle-popolazioni/" },
      { "source": "Universidad de Bolonia", "title": "Entrevista a Andrea Pesce, fundador de zeroCO2 y Comparte (en italiano)", "date": "Alumni Stories", "url": "https://site.unibo.it/alumni-association/it/alumni-stories/intervista-con-andrea-pesce" },
      { "source": "Tempo Stretto", "title": "Un hilo que une Italia y Guatemala (en italiano)", "date": "Enero 2019", "url": "https://www.tempostretto.it/news/336348.html" },
      { "source": "zeroCO2 Magazine", "title": "Reforestación y educación: un mes de Lime para Comparte (en italiano)", "date": "Agosto 2023", "url": "https://zeroco2.eco/it/magazine/persone/lime-per-comparte/" }
    ],
    "gallery": [
      "Comunidad de Nuevo Horizonte, Petén",
      "Formación agrícola en las comunidades rurales",
      "Nuevo Horizonte, donde empezó todo",
      "El almuerzo donde nació Comparte, 2018",
      "Entrega de diplomas USAC, Comparte Universidad",
      "Seminario en el Centro Universitario de Petén"
    ]
  },
  "faq": {
    "title": "Preguntas frecuentes",
    "items": [
      { "q": "¿Cómo puedo donar?", "a": "Con una transferencia a Banca Etica, IBAN IT27J0501803200000016738783, a nombre de Comparte. Guarda el comprobante." },
      { "q": "¿Qué es el 5×1000?", "a": "Si pagas impuestos en Italia, puedes destinar el 5×1000 a Comparte en tu declaración con el código fiscal 97977810585. No te cuesta nada." },
      { "q": "¿Qué hacen en Cuba?", "a": "Desde hace más de 4 años llevamos lentes graduados y medicamentos al hogar de ancianos de Belén y a las escuelas primarias de La Habana y de la provincia." },
      { "q": "¿A dónde van los fondos del 5×1000?", "a": "A los proyectos activos en Petén: formación universitaria con la USAC, educación climática en Nuevo Horizonte y formación agrícola con las comunidades campesinas. El informe se publica cada año en la página Transparencia." },
      { "q": "¿Qué es Comparte?", "a": "Una asociación nacida en 2018 entre Roma y Petén. Formamos a docentes y estudiantes, llevamos educación climática a las escuelas y formación agrícola a las comunidades rurales de Guatemala." },
      { "q": "¿Comparte está vinculada a zeroCO2?", "a": "Sí. Andrea Pesce fundó ambas. zeroCO2 siembra árboles en las comunidades rurales de Petén y Comparte lleva a esas mismas comunidades formación y educación. Son independientes y colaboran en el terreno." }
    ],
    "homeCount": 3
  },
  "newsletter": {
    "title": "Mantente en contacto",
    "text": "Pocos correos al año: qué hacemos, a dónde van los fondos y cuándo más te necesitamos.",
    "emailLabel": "Tu correo",
    "consent": "Acepto recibir el boletín y he leído la política de privacidad.",
    "submit": "Suscríbete",
    "fallback": "Mientras tanto, síguenos en Instagram."
  },
  "footer": {
    "tagline": "Educación en Petén, salud en La Habana.",
    "contacts": "Contacto",
    "legal": "Asociación · Código fiscal 97977810585 · IVA 16847801004",
    "bloqueoNote": "El Bloqueo, un proyecto que apoyamos"
  },
  "donaPage": {
    "title": "Cómo donar",
    "intro": "Cada euro llega a Petén y a La Habana. Elige la forma que te resulte más cómoda.",
    "fiveSteps": [
      "Abre tu declaración de la renta italiana (730, Redditi PF o CU).",
      "Firma la casilla de las entidades del Tercer Sector inscritas en el RUNTS.",
      "Escribe nuestro código fiscal debajo de tu firma."
    ],
    "report": "Cómo usamos el 5×1000"
  },
  "cubaPage": {
    "title": "Lentes y medicamentos en La Habana",
    "whoTitle": "A quién ayudamos",
    "who": [
      "Al hogar de ancianos de Belén, en La Habana.",
      "A las escuelas primarias de la ciudad y de la provincia."
    ],
    "whatTitle": "Qué llevamos",
    "what": "Lentes graduados y medicamentos. Desde hace más de 4 años.",
    "whyTitle": "Por qué hace falta",
    "why": "El bloqueo estadounidense hace difícil conseguir en Cuba medicamentos y materiales de uso diario. Quienes más lo pagan son los ancianos y los niños.",
    "bloqueoText": "El Bloqueo, un proyecto que apoyamos, lo explica con fuentes verificables.",
    "bloqueoCta": "Lee El Bloqueo",
    "donateTitle": "Dona por Cuba y por Petén",
    "photoAlt": "Entrega de medicamentos y materiales en La Habana"
  },
  "thanks": {
    "title": "Gracias",
    "text": "Tu apoyo llega a Petén y a La Habana. Si te suscribiste al boletín, revisa tu correo para confirmar.",
    "back": "Volver al inicio",
    "transparency": "Mira cómo usamos los fondos"
  }
}
```

`src/i18n/en.json`:
```json
{
  "meta": {
    "homeTitle": "Comparte — Education changes everything",
    "homeDescription": "Since 2018 we have trained teachers, young people and communities in Petén, Guatemala. In Havana we bring glasses and medicines. Donate by bank transfer.",
    "donaTitle": "Donate to Comparte — Bank transfer",
    "donaDescription": "How to support Comparte: bank transfer to Banca Etica and, if you pay taxes in Italy, the 5×1000.",
    "cubaTitle": "Comparte in Cuba — Glasses and medicines in Havana",
    "cubaDescription": "For more than 4 years we have supported the Belén home for the elderly and primary schools in Havana with prescription glasses and medicines.",
    "trasparenzaTitle": "Transparency — Comparte",
    "trasparenzaDescription": "Financial statements, 5×1000 reports and legal details of Comparte.",
    "grazieTitle": "Thank you — Comparte",
    "grazieDescription": "Thank you for supporting Comparte."
  },
  "ui": {
    "skip": "Skip to content",
    "menu": "Menu",
    "langLabel": "Language",
    "copy": "Copy",
    "copied": "Copied",
    "copyFallback": "Select and copy",
    "newTab": "(opens in a new tab)",
    "source": "Source"
  },
  "nav": { "progetti": "What we do", "cuba": "Cuba", "chiSiamo": "About us", "trasparenza": "Transparency", "dona": "Donate" },
  "hero": {
    "eyebrow": "In Petén, Guatemala, since 2018",
    "title": "Education changes everything",
    "subtitle": "We train teachers, young people and communities in Petén. And in Havana we bring glasses and medicines to people who need them.",
    "ctaPrimary": "Donate now",
    "ctaPrimaryHref": "#dona",
    "ctaSecondary": "What we do",
    "ctaSecondaryHref": "#progetti",
    "imgAlt": "Students at the Centro Universitario de Petén, Guatemala"
  },
  "numbers": {
    "title": "In Petén, getting an education is still a struggle",
    "items": [
      { "value": "49%", "text": "of young people in Guatemala finish lower secondary school.", "source": "World Bank, 2024", "url": "https://data.worldbank.org/indicator/SE.SEC.CMPT.LO.ZS?locations=GT" },
      { "value": "82%", "text": "of adults can read and write. Almost one in five cannot.", "source": "World Bank, 2024", "url": "https://data.worldbank.org/indicator/SE.ADT.LITR.ZS?locations=GT" },
      { "value": "9.7", "text": "years of school a child can expect.", "source": "World Bank, 2020", "url": "https://data.worldbank.org/indicator/HD.HCI.EYRS?locations=GT" }
    ],
    "outro": "That is why we work alongside people who teach, study and farm the land."
  },
  "projects": {
    "title": "What we do in Petén",
    "items": [
      { "label": "Teachers", "name": "Comparte Universidad", "text": "Online seminars with European lecturers for students and teachers at CUDEP, the most remote campus of Guatemala's public university. Since 2018, more than 1,500 people trained." },
      { "label": "Young people and climate", "name": "Comparte Educación", "text": "Five modules on the climate crisis for girls and boys aged 13 to 17. The first edition, in Nuevo Horizonte with INAB and MARN, involved 27 students." },
      { "label": "Communities", "name": "Comparte Comunidad", "text": "Farming training in the communities where zeroCO2 plants trees. Soil, harvests and practices that help every day." }
    ]
  },
  "cuba": {
    "eyebrow": "Havana, Cuba",
    "title": "Glasses and medicines, for more than 4 years",
    "text": "In Havana we support the Belén home for the elderly and primary schools in the city and the province. We bring prescription glasses and medicines where the embargo makes them hard to find.",
    "ctaBloqueo": "El Bloqueo",
    "ctaDona": "Donate now"
  },
  "impact": {
    "title": "What we have done so far",
    "items": [
      { "value": "1,500+", "label": "people trained" },
      { "value": "46+", "label": "rural communities reached" },
      { "value": "27", "label": "students in the climate programme" },
      { "value": "4+", "label": "years of aid to Cuba" }
    ]
  },
  "about": {
    "title": "Born over lunch, in 2018",
    "text": "A group of young Italians and Guatemalans, sitting at the table, asked themselves what the communities of Petén really lacked. The answer: good education and practical tools. That is how Comparte began; in Spanish the name means \"share\". We started with cinema: between 2018 and 2020 Comparte Cinema screenings, with Cuba's ICAIC, reached 7 rural communities.",
    "board": "Andrea Pesce, president · Irene Culcasi, vice president · Virgilio Galicia Gregorio, liaison in Guatemala",
    "imgAlt": "The Comparte team in Guatemala"
  },
  "donate": {
    "title": "How to donate",
    "fiveTitle": "5×1000",
    "fiveText": "If you pay taxes in Italy, sign the box for Third Sector organisations in your tax return and write our tax code. It costs you nothing.",
    "cfLabel": "Tax code",
    "bankTitle": "Bank transfer",
    "ibanLabel": "IBAN",
    "holderLabel": "Account holder",
    "reasonLabel": "Reference",
    "reason": "Donation",
    "monthly": "To give every month, set up a standing order with your bank.",
    "note": "Donations fund all our work, in Petén and in Cuba. Keep your transfer receipt.",
    "allWays": "All the ways to donate",
    "secondaryIntro": "Do you pay taxes in Italy?"
  },
  "known": {
    "title": "Who knows us",
    "partnersTitle": "Who we work with",
    "pressTitle": "In the press",
    "partners": [
      { "name": "USAC", "desc": "Universidad de San Carlos de Guatemala" },
      { "name": "LUMSA", "desc": "University of Rome" },
      { "name": "Scholas", "desc": "Pontifical Foundation Scholas Occurrentes" },
      { "name": "INAB", "desc": "National Forest Institute, Guatemala" },
      { "name": "MARN", "desc": "Ministry of Environment, Guatemala" },
      { "name": "zeroCO2", "desc": "Italian-Guatemalan benefit company" },
      { "name": "1Caffè", "desc": "Italian fundraising platform" },
      { "name": "European Schoolnet", "desc": "Brussels" }
    ],
    "press": [
      { "source": "Millionaire", "title": "Article on fruit trees donated to communities (in Italian)", "date": "February 2021", "url": "https://www.millionaire.it/prendiamo-alberi-da-frutto-e-li-doniamo-alle-popolazioni/" },
      { "source": "University of Bologna", "title": "Interview with Andrea Pesce, founder of zeroCO2 and Comparte (in Italian)", "date": "Alumni Stories", "url": "https://site.unibo.it/alumni-association/it/alumni-stories/intervista-con-andrea-pesce" },
      { "source": "Tempo Stretto", "title": "A thread linking Italy and Guatemala (in Italian)", "date": "January 2019", "url": "https://www.tempostretto.it/news/336348.html" },
      { "source": "zeroCO2 Magazine", "title": "Reforestation and education: a month of Lime for Comparte (in Italian)", "date": "August 2023", "url": "https://zeroco2.eco/it/magazine/persone/lime-per-comparte/" }
    ],
    "gallery": [
      "Nuevo Horizonte community, Petén",
      "Farming training in rural communities",
      "Nuevo Horizonte, where it all began",
      "The lunch where Comparte was born, 2018",
      "USAC graduation, Comparte Universidad",
      "Seminar at the Centro Universitario de Petén"
    ]
  },
  "faq": {
    "title": "Frequently asked questions",
    "items": [
      { "q": "How can I donate?", "a": "By bank transfer to Banca Etica, IBAN IT27J0501803200000016738783, account holder Comparte. Keep your receipt." },
      { "q": "What is the 5×1000?", "a": "If you pay taxes in Italy, you can give your 5×1000 to Comparte in your tax return with the tax code 97977810585. It costs you nothing." },
      { "q": "What do you do in Cuba?", "a": "For more than 4 years we have brought prescription glasses and medicines to the Belén home for the elderly and to primary schools in Havana and the province." },
      { "q": "Where does the 5×1000 go?", "a": "To our active projects in Petén: university training with USAC, climate education in Nuevo Horizonte and farming training with rural communities. The report is published every year on the Transparency page." },
      { "q": "What is Comparte?", "a": "An association founded in 2018 between Rome and Petén. We train teachers and students, bring climate education to schools and farming training to rural communities in Guatemala." },
      { "q": "Is Comparte linked to zeroCO2?", "a": "Yes. Andrea Pesce founded both. zeroCO2 plants trees in rural communities in Petén, and Comparte brings training and education to the same communities. They are independent and work together on the ground." }
    ],
    "homeCount": 3
  },
  "newsletter": {
    "title": "Stay in touch",
    "text": "A few emails a year: what we do, where the money goes and when we need you most.",
    "emailLabel": "Your email",
    "consent": "I agree to receive the newsletter and have read the privacy policy.",
    "submit": "Subscribe",
    "fallback": "In the meantime, follow us on Instagram."
  },
  "footer": {
    "tagline": "Education in Petén, health in Havana.",
    "contacts": "Contact",
    "legal": "Association · Tax code 97977810585 · VAT 16847801004",
    "bloqueoNote": "El Bloqueo, a project we support"
  },
  "donaPage": {
    "title": "How to donate",
    "intro": "Every euro goes to Petén and Havana. Choose the way that suits you.",
    "fiveSteps": [
      "Open your Italian tax return (730, Redditi PF or CU).",
      "Sign the box for Third Sector organisations listed in the RUNTS.",
      "Write our tax code under your signature."
    ],
    "report": "How we use the 5×1000"
  },
  "cubaPage": {
    "title": "Glasses and medicines in Havana",
    "whoTitle": "Who we help",
    "who": [
      "The Belén home for the elderly, in Havana.",
      "Primary schools in the city and the province."
    ],
    "whatTitle": "What we bring",
    "what": "Prescription glasses and medicines. For more than 4 years.",
    "whyTitle": "Why it matters",
    "why": "The US embargo makes it hard to find medicines and everyday supplies in Cuba. Older people and children pay the highest price.",
    "bloqueoText": "El Bloqueo, a project we support, explains it with verifiable sources.",
    "bloqueoCta": "Read El Bloqueo",
    "donateTitle": "Donate for Cuba and Petén",
    "photoAlt": "Delivery of medicines and supplies in Havana"
  },
  "thanks": {
    "title": "Thank you",
    "text": "Your support reaches Petén and Havana. If you signed up for the newsletter, check your inbox to confirm.",
    "back": "Back to home",
    "transparency": "See how we use the money"
  }
}
```

Nota: in IT `donate.secondaryIntro` non viene mostrato (il 5×1000 è primario), ma resta valorizzato per la parità delle chiavi.

- [ ] **Step 4: Crea `src/i18n/index.ts`**

```ts
// Accesso ai testi e alle rotte per lingua
import it from './it.json';
import es from './es.json';
import en from './en.json';
import siteData from '../data/site.json';

export type Lang = 'it' | 'es' | 'en';
export type PageKey = 'home' | 'dona' | 'cuba' | 'trasparenza' | 'grazie';
export type Dict = typeof it;

const dicts: Record<Lang, Dict> = { it, es: es as Dict, en: en as Dict };
export const LANGS: Lang[] = ['it', 'es', 'en'];
export const SITE_URL = 'https://www.comparte.it';
export const site = siteData;

export const routes: Record<Lang, Record<PageKey, string>> = {
  it: { home: '/', dona: '/dona/', cuba: '/cuba/', trasparenza: '/trasparenza/', grazie: '/grazie/' },
  es: { home: '/es/', dona: '/es/dona/', cuba: '/es/cuba/', trasparenza: '/es/transparencia/', grazie: '/es/gracias/' },
  en: { home: '/en/', dona: '/en/donate/', cuba: '/en/cuba/', trasparenza: '/en/transparency/', grazie: '/en/thank-you/' },
};

export const t = (lang: Lang): Dict => dicts[lang];

export const altLinks = (pageKey: PageKey) =>
  LANGS.map((lang) => ({ lang, href: SITE_URL + routes[lang][pageKey] }));
```

Aggiungi in `tsconfig.json` `{ "extends": "astro/tsconfigs/strict", "compilerOptions": { "resolveJsonModule": true } }`.

- [ ] **Step 5: Esegui i test**

Run: `node --test tests/i18n.test.mjs` → PASS. Esegui la prova del morso (Step 1) e salva gli output.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(T2): dizionari IT/ES/EN e dati del sito

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Componenti e home nelle tre lingue

**Files:**
- Create: `src/components/{Header,Footer,Block,Stat,CopyField,DonateBlock,Newsletter,Faq}.astro`, `src/pages-shared/HomePage.astro`, `src/pages/es/index.astro`, `src/pages/en/index.astro`, `tests/home.test.mjs`
- Modify: `src/pages/index.astro`, `src/layouts/Base.astro` (aggiunge Header, Footer, skip link)

**Interfaces:**
- Consumes: `t`, `routes`, `site`, `Lang` da `src/i18n`; `Base.astro`.
- Produces: `<HomePage lang={lang} />`; `<DonateBlock lang={lang} />` riusato nei Task 4; `<CopyField value label lang />`; `<Faq lang limit? />`; `<Newsletter lang />`.

- [ ] **Step 1: Scrivi i test (rossi)**

`tests/home.test.mjs`:
```js
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
    assert.ok(values.includes('IT27J0501803200000016738783'));
    p.querySelectorAll('.copy-btn').forEach((b) => assert.ok(b.getAttribute('data-copy'), 'bottone senza data-copy'));
  });

  test(`${lang}: menu mobile funziona senza JS (<details>)`, () => {
    assert.ok(page(path).querySelector('header details summary'), 'manca <details><summary> nel menu');
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
```

Run: `npm test` → FAIL (mancano `/es/`, `#perche-educazione` …). Output in `docs/evidence/T3-red.txt`.

- [ ] **Step 2: Componenti base**

`src/components/Block.astro`:
```astro
---
// Blocco a tutta larghezza con colore pieno
interface Props { id?: string; color: 'blue' | 'orange' | 'pink' | 'cream' | 'ink'; labelledby?: string }
const { id, color, labelledby } = Astro.props;
---
<section id={id} class={`block block--${color}`} aria-labelledby={labelledby}>
  <div class="inner"><slot /></div>
</section>
```

`src/components/Stat.astro`:
```astro
---
interface Props { value: string; text: string; source?: string; url?: string; sourceLabel?: string; newTab?: string }
const { value, text, source, url, sourceLabel, newTab } = Astro.props;
---
<div class="stat">
  <p class="stat-value">{value}</p>
  <p class="stat-text">{text}</p>
  {source && url && (
    <p class="stat-source">{sourceLabel}: <a href={url} target="_blank" rel="noopener">{source}<span class="visually-hidden"> {newTab}</span></a></p>
  )}
</div>
<style>
  .stat-value { font-size: var(--fs-stat); font-weight: 800; line-height: .9; letter-spacing: -.045em; margin: 0; }
  .stat-text { font-size: clamp(18px, .6vw + 16px, 22px); font-weight: 500; margin: 16px 0 8px; max-width: 26ch; }
  .stat-source { font-size: var(--fs-small); margin: 0; }
</style>
```

`src/components/CopyField.astro` (Review Focus 2: senza clipboard il valore resta selezionabile):
```astro
---
import { t, type Lang } from '../i18n';
interface Props { value: string; label: string; lang: Lang }
const { value, label, lang } = Astro.props;
const ui = t(lang).ui;
---
<div class="copy">
  <span class="copy-label">{label}</span>
  <span class="copy-value" translate="no">{value}</span>
  <button type="button" class="btn copy-btn" data-copy={value} data-done={ui.copied} data-fallback={ui.copyFallback}>{ui.copy}</button>
</div>
<style>
  .copy { display: grid; gap: 8px; justify-items: start; }
  .copy-label { font-size: var(--fs-small); font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
  .copy-value { font-size: clamp(22px, 2vw + 14px, 40px); font-weight: 800; letter-spacing: -.01em; overflow-wrap: anywhere; user-select: all; }
  .copy-btn { background: transparent; cursor: pointer; font: inherit; font-weight: 700; }
</style>
<script is:inline>
  // Copia negli appunti; se l'API non c'è, seleziona il testo e cambia etichetta
  document.querySelectorAll('.copy-btn:not([data-ready])').forEach((b) => {
    b.dataset.ready = '1';
    b.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.copy);
        b.textContent = b.dataset.done;
      } catch (err) {
        console.warn('Copia non riuscita, selezione manuale', err);
        const v = b.parentElement.querySelector('.copy-value');
        const r = document.createRange(); r.selectNodeContents(v);
        const s = getSelection(); s.removeAllRanges(); s.addRange(r);
        b.textContent = b.dataset.fallback;
      }
    });
  });
</script>
```

`src/components/DonateBlock.astro` (ordine per lingua; id stabili `cinque-x-mille` e `dona`):
```astro
---
import CopyField from './CopyField.astro';
import { t, routes, site, type Lang } from '../i18n';
interface Props { lang: Lang; showAllWays?: boolean; steps?: string[] }
const { lang, showAllWays = true, steps } = Astro.props;
const d = t(lang).donate;
const five = { id: 'cinque-x-mille' };
const bankFirst = lang !== 'it';
---
<div class="donate">
  <h2 id="donate-title">{d.title}</h2>
  <div class={`donate-grid ${bankFirst ? 'bank-first' : ''}`}>
    {bankFirst ? null : (
      <div id={five.id} class="donate-card">
        <h3>{d.fiveTitle}</h3>
        <p>{d.fiveText}</p>
        {steps && <ol>{steps.map((s) => <li>{s}</li>)}</ol>}
        <CopyField value={site.cf} label={d.cfLabel} lang={lang} />
      </div>
    )}
    <div id="dona" class="donate-card">
      <h3>{d.bankTitle}</h3>
      <p>{site.bank}</p>
      <CopyField value={site.iban} label={d.ibanLabel} lang={lang} />
      <p><strong>{d.holderLabel}:</strong> {site.holder} · <strong>{d.reasonLabel}:</strong> {d.reason}</p>
      <p>{d.monthly}</p>
    </div>
    {bankFirst && (
      <div id={five.id} class="donate-card donate-card--secondary">
        <p class="eyebrow">{d.secondaryIntro}</p>
        <h3>{d.fiveTitle}</h3>
        <p>{d.fiveText}</p>
        {steps && <ol>{steps.map((s) => <li>{s}</li>)}</ol>}
        <CopyField value={site.cf} label={d.cfLabel} lang={lang} />
      </div>
    )}
  </div>
  <p class="prose donate-note">{d.note}</p>
  {showAllWays && <p><a class="btn btn--solid-ink" href={routes[lang].dona}>{d.allWays}</a></p>}
</div>
<style>
  .donate-grid { display: grid; gap: 48px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr)); margin-bottom: 40px; }
  .donate-card { display: grid; gap: 16px; align-content: start; }
  .donate-card--secondary { border-top: 3px solid var(--ink); padding-top: 24px; }
  .donate-card p, .donate-card ol { margin: 0; }
</style>
```

`src/components/Faq.astro`:
```astro
---
import { t, type Lang } from '../i18n';
interface Props { lang: Lang; limit?: number }
const { lang, limit } = Astro.props;
const f = t(lang).faq;
const items = limit ? f.items.slice(0, limit) : f.items;
---
<h2 id="faq-title">{f.title}</h2>
<div class="faq">
  {items.map((it) => (
    <details>
      <summary>{it.q}</summary>
      <p>{it.a}</p>
    </details>
  ))}
</div>
<style>
  .faq details { border-top: 2px solid currentColor; padding: 20px 0; }
  .faq summary { font-size: var(--fs-h3); font-weight: 700; cursor: pointer; min-height: 48px; }
  .faq p { max-width: 62ch; margin: 12px 0 0; }
</style>
```

`src/components/Newsletter.astro` (form solo se c'è l'action; consenso punta all'ancora privacy della trasparenza nella stessa lingua):
```astro
---
import { t, routes, site, type Lang } from '../i18n';
interface Props { lang: Lang }
const { lang } = Astro.props;
const n = t(lang).newsletter;
const ui = t(lang).ui;
const privacyId = lang === 'es' ? 'privacidad' : 'privacy';
---
<h2 id="newsletter-title">{n.title}</h2>
<p class="prose">{n.text}</p>
{site.mailchimpAction ? (
  <form action={site.mailchimpAction} method="post" target="_blank" class="nl-form">
    <label for="nl-email">{n.emailLabel}</label>
    <input id="nl-email" type="email" name="EMAIL" autocomplete="email" required />
    <label class="nl-consent"><input type="checkbox" required /> <a href={`${routes[lang].trasparenza}#${privacyId}`}>{n.consent}</a></label>
    <div aria-hidden="true" style="position:absolute;left:-5000px"><input type="text" name={site.mailchimpHoneypot} tabindex="-1" value="" /></div>
    <button class="btn btn--solid-ink" type="submit">{n.submit}</button>
  </form>
) : (
  <p><a href={site.social.instagram} target="_blank" rel="noopener">{n.fallback}<span class="visually-hidden"> {ui.newTab}</span></a></p>
)}
```

`src/components/Header.astro` (menu mobile con `<details>`, Review Focus 3):
```astro
---
import { t, routes, LANGS, type Lang, type PageKey } from '../i18n';
interface Props { lang: Lang; pageKey: PageKey }
const { lang, pageKey } = Astro.props;
const d = t(lang);
const home = routes[lang].home;
const links = [
  { href: `${home}#progetti`, label: d.nav.progetti },
  { href: routes[lang].cuba, label: d.nav.cuba },
  { href: `${home}#chi-siamo`, label: d.nav.chiSiamo },
  { href: routes[lang].trasparenza, label: d.nav.trasparenza },
];
---
<header class="site-header">
  <a class="skip" href="#main">{d.ui.skip}</a>
  <a class="logo" href={home}><img src="/logo/comparte_logo_black.png" alt="Comparte" width="670" height="839" /></a>
  <details class="nav">
    <summary>{d.ui.menu}</summary>
    <nav aria-label={d.ui.menu}>
      <ul>{links.map((l) => <li><a href={l.href}>{l.label}</a></li>)}</ul>
      <ul class="langs" aria-label={d.ui.langLabel}>
        {LANGS.map((l) => (
          <li><a href={routes[l][pageKey]} lang={l} hreflang={l} aria-current={l === lang ? 'page' : undefined}>{l.toUpperCase()}</a></li>
        ))}
      </ul>
    </nav>
  </details>
  <a class="btn btn--solid-orange header-cta" href={routes[lang].dona}>{d.nav.dona}</a>
</header>
<style>
  .site-header { display: flex; align-items: center; gap: 16px; padding: 16px var(--gutter); background: var(--cream); position: sticky; top: 0; z-index: 10; }
  .logo img { width: 40px; height: auto; }
  .skip { position: absolute; left: -9999px; }
  .skip:focus { left: 16px; top: 16px; background: var(--ink); color: var(--white); padding: 8px 16px; }
  .nav { margin-left: auto; }
  .nav summary { min-height: 48px; display: flex; align-items: center; font-weight: 700; cursor: pointer; }
  .nav nav { position: absolute; left: 0; right: 0; top: 100%; background: var(--cream); padding: 24px var(--gutter); }
  .nav ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 16px; font-size: var(--fs-h3); font-weight: 700; }
  .nav a { text-decoration: none; }
  .langs { grid-auto-flow: column; justify-content: start; margin-top: 24px !important; font-size: var(--fs-body) !important; }
  .langs [aria-current] { text-decoration: underline; }
  @media (min-width: 960px) {
    .nav summary { display: none; }
    .nav nav { position: static; display: flex; gap: 40px; padding: 0; background: none; }
    .nav ul { grid-auto-flow: column; font-size: var(--fs-body); gap: 28px; }
    .langs { margin-top: 0 !important; gap: 12px !important; }
  }
</style>
<script is:inline>
  // Su desktop il menu resta sempre aperto
  const nav = document.querySelector('.site-header details');
  const mq = matchMedia('(min-width: 960px)');
  const sync = () => { if (nav) nav.open = mq.matches; };
  sync(); mq.addEventListener('change', sync);
</script>
```

`src/components/Footer.astro`:
```astro
---
import { t, routes, site, type Lang } from '../i18n';
interface Props { lang: Lang }
const { lang } = Astro.props;
const d = t(lang);
---
<footer class="block block--ink site-footer">
  <div class="inner footer-grid">
    <div>
      <p class="h3">Comparte</p>
      <p>{d.footer.tagline}</p>
      <p><a href="https://elbloqueo.it/" target="_blank" rel="noopener">{d.footer.bloqueoNote}<span class="visually-hidden"> {d.ui.newTab}</span></a></p>
    </div>
    <div>
      <p class="h3">{d.footer.contacts}</p>
      <p><a href={`mailto:${site.email}`}>{site.email}</a><br />{site.address}</p>
      <p><a href={site.social.instagram} target="_blank" rel="noopener">Instagram</a> · <a href={site.social.facebook} target="_blank" rel="noopener">Facebook</a> · <a href={site.social.linkedin} target="_blank" rel="noopener">LinkedIn</a></p>
    </div>
    <div>
      <p><a href={routes[lang].trasparenza}>{d.nav.trasparenza}</a></p>
      <p class="small">{d.footer.legal}</p>
    </div>
  </div>
</footer>
<style>
  .footer-grid { display: grid; gap: 40px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); }
  .site-footer .small { font-size: var(--fs-small); }
</style>
```

Aggiorna `Base.astro`: importa `Header` e `Footer`, mettili prima e dopo `<main id="main">`, passando `lang` e `pageKey`.

- [ ] **Step 3: `HomePage.astro` e i tre file di pagina**

`src/pages-shared/HomePage.astro`:
```astro
---
import { Image } from 'astro:assets';
import Base from '../layouts/Base.astro';
import Block from '../components/Block.astro';
import Stat from '../components/Stat.astro';
import DonateBlock from '../components/DonateBlock.astro';
import Faq from '../components/Faq.astro';
import Newsletter from '../components/Newsletter.astro';
import { t, routes, type Lang } from '../i18n';
import hero from '../assets/photos/hero.jpg';
import about from '../assets/photos/chi-siamo.jpg';

interface Props { lang: Lang }
const { lang } = Astro.props;
const d = t(lang);
const gallery = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/galleria/0[1-6].webp', { eager: true });
const galleryImgs = Object.values(gallery).map((m) => m.default);
---
<Base lang={lang} pageKey="home" title={d.meta.homeTitle} description={d.meta.homeDescription}>
  <Block id="hero" color="blue" labelledby="hero-title">
    <p class="eyebrow">{d.hero.eyebrow}</p>
    <h1 id="hero-title" class="display">{d.hero.title}</h1>
    <p class="lead">{d.hero.subtitle}</p>
    <div class="btns">
      <a class="btn btn--solid-orange" href={d.hero.ctaPrimaryHref}>{d.hero.ctaPrimary}</a>
      <a class="btn" href={d.hero.ctaSecondaryHref}>{d.hero.ctaSecondary}</a>
    </div>
    <Image src={hero} alt={d.hero.imgAlt} widths={[640, 1024, 1600]} sizes="(min-width: 1320px) 1320px, 100vw" class="hero-img" loading="eager" fetchpriority="high" />
  </Block>

  <section id="perche-educazione" aria-labelledby="numbers-title">
    <div class="block block--cream"><div class="inner"><h2 id="numbers-title">{d.numbers.title}</h2></div></div>
    <div class="stats-row">
      {d.numbers.items.map((it, i) => (
        <div class={`block ${i === 1 ? 'block--pink' : 'block--orange'}`}>
          <Stat value={it.value} text={it.text} source={it.source} url={it.url} sourceLabel={d.ui.source} newTab={d.ui.newTab} />
        </div>
      ))}
    </div>
    <div class="block block--cream"><div class="inner"><p class="lead">{d.numbers.outro}</p></div></div>
  </section>

  <Block id="progetti" color="cream" labelledby="projects-title">
    <h2 id="projects-title">{d.projects.title}</h2>
    <div class="grid-3">
      {d.projects.items.map((p) => (
        <article>
          <p class="eyebrow">{p.name}</p>
          <h3>{p.label}</h3>
          <p>{p.text}</p>
        </article>
      ))}
    </div>
  </Block>

  <Block id="cuba" color="blue" labelledby="cuba-title">
    <p class="eyebrow accent">{d.cuba.eyebrow}</p>
    <h2 id="cuba-title">{d.cuba.title}</h2>
    <p class="lead">{d.cuba.text}</p>
    <div class="btns">
      <a class="btn btn--solid-orange" href={routes[lang].cuba}>{d.cuba.ctaBloqueo}</a>
      <a class="btn" href="#dona">{d.cuba.ctaDona}</a>
    </div>
  </Block>

  <Block id="impatto" color="ink" labelledby="impact-title">
    <h2 id="impact-title">{d.impact.title}</h2>
    <div class="grid-4">
      {d.impact.items.map((it) => (
        <div class="impact"><p class="impact-value accent">{it.value}</p><p>{it.label}</p></div>
      ))}
    </div>
  </Block>

  <Block id="chi-siamo" color="cream" labelledby="about-title">
    <div class="about">
      <div>
        <h2 id="about-title">{d.about.title}</h2>
        <p class="prose">{d.about.text}</p>
        <p class="small">{d.about.board}</p>
      </div>
      <Image src={about} alt={d.about.imgAlt} widths={[480, 800, 1200]} sizes="(min-width: 960px) 50vw, 100vw" loading="lazy" />
    </div>
  </Block>

  <Block color="orange" labelledby="donate-title">
    <DonateBlock lang={lang} />
  </Block>

  <Block id="chi-ci-conosce" color="cream" labelledby="known-title">
    <h2 id="known-title">{d.known.title}</h2>
    <h3>{d.known.partnersTitle}</h3>
    <ul class="partners">{d.known.partners.map((p) => <li><strong>{p.name}</strong> <span>{p.desc}</span></li>)}</ul>
    <h3>{d.known.pressTitle}</h3>
    <ul class="press">{d.known.press.map((p) => (
      <li><a href={p.url} target="_blank" rel="noopener"><span class="eyebrow">{p.source} · {p.date}</span><span class="h3">{p.title}</span><span class="visually-hidden"> {d.ui.newTab}</span></a></li>
    ))}</ul>
    <div class="gallery">
      {galleryImgs.map((img, i) => (
        <figure><Image src={img} alt={d.known.gallery[i]} widths={[400, 800]} sizes="(min-width: 960px) 33vw, 50vw" loading="lazy" /><figcaption>{d.known.gallery[i]}</figcaption></figure>
      ))}
    </div>
  </Block>

  <Block id="faq" color="cream" labelledby="faq-title">
    <Faq lang={lang} limit={d.faq.homeCount} />
  </Block>

  <Block id="newsletter" color="pink" labelledby="newsletter-title">
    <Newsletter lang={lang} />
  </Block>
</Base>
<style>
  .hero-img { margin-top: 64px; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
  .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); }
  .grid-4 { display: grid; gap: 40px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); }
  .impact-value { font-size: var(--fs-stat); font-weight: 800; line-height: .9; letter-spacing: -.045em; margin: 0 0 12px; }
  .about { display: grid; gap: 48px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr)); align-items: center; }
  .small { font-size: var(--fs-small); }
  .partners, .press { list-style: none; padding: 0; margin: 0 0 56px; display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); }
  .partners span { display: block; font-size: var(--fs-small); }
  .press a { display: grid; gap: 8px; text-decoration: none; border-top: 3px solid var(--ink); padding-top: 16px; }
  .gallery { display: grid; gap: 8px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); }
  .gallery figure { margin: 0; }
  .gallery img { aspect-ratio: 4 / 3; object-fit: cover; width: 100%; }
  .gallery figcaption { font-size: var(--fs-small); padding: 8px 0; }
</style>
```

Nota sull'ordine: il test vuole `cinque-x-mille` e `dona` dopo `chi-siamo` e `faq`/`newsletter` dopo. `DonateBlock` è dentro un `Block` senza id: gli id `cinque-x-mille` e `dona` stanno sulle schede interne.

`src/pages/index.astro`:
```astro
---
import HomePage from '../pages-shared/HomePage.astro';
---
<HomePage lang="it" />
```
`src/pages/es/index.astro` e `src/pages/en/index.astro`: uguali, con `lang="es"` / `lang="en"` e import `../../pages-shared/HomePage.astro`.

- [ ] **Step 4: Esegui i test**

Run: `npm test` → tutti PASS. Output in `docs/evidence/T3-green.txt`.

- [ ] **Step 5: Controllo visivo**

Run: `npm run preview` e apri `http://localhost:4321/`, `/es/`, `/en/` a 375, 768 e 1440 px. Screenshot in `docs/evidence/T3-*.png`. Verifica a occhio: numeri enormi, blocchi pieni, nessuno scroll orizzontale.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(T3): home manifesto a 7 blocchi in IT/ES/EN

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Pagine Dona, Cuba, Trasparenza, Grazie e foto di Cuba

**Files:**
- Create: `scripts/crop-cuba.mjs`, `src/assets/photos/cuba-consegna.jpg` (generato), `src/pages-shared/{DonaPage,CubaPage,TransparencyPage,ThanksPage}.astro`, `src/pages/{dona,cuba,trasparenza,grazie}/index.astro`, `src/pages/es/{dona,cuba,transparencia,gracias}/index.astro`, `src/pages/en/{donate,cuba,transparency,thank-you}/index.astro`, `tests/pages.test.mjs`

**Interfaces:**
- Consumes: `DonateBlock`, `Faq`, `Block`, `Base`, `t`, `routes`.
- Produces: tutte le pagine di `PAGES` in `tests/lib/dist.mjs`.

- [ ] **Step 1: Scrivi i test (rossi)**

`tests/pages.test.mjs`:
```js
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
```

Run: `npm test` → FAIL "pagina mancante nel dist: /dona/". Output in `docs/evidence/T4-red.txt`.

- [ ] **Step 2: Ritaglia la foto di Cuba (APERTO-02: via la scritta sulla maglietta)**

`scripts/crop-cuba.mjs`:
```js
// Ritaglia IMG_0152 sul tavolo con le medicine, sotto la scritta sulla maglietta
import sharp from 'sharp';
const [src, out] = process.argv.slice(2);
const img = sharp(src).rotate(); // applica l'orientamento EXIF
const { width, height } = await img.metadata().then((m) => (m.orientation >= 5 ? { width: m.height, height: m.width } : m));
const top = Math.round(height * 0.64);
await img.extract({ left: 0, top, width, height: height - top }).resize({ width: 2000 }).jpeg({ quality: 82 }).toFile(out);
console.log('ritaglio', width, 'x', height - top, '→', out);
```

```bash
sips -s format jpeg /Users/andreapesce/Downloads/IMG_0152.HEIC --out /tmp/IMG_0152.jpg
node scripts/crop-cuba.mjs /tmp/IMG_0152.jpg src/assets/photos/cuba-consegna.jpg
```
Poi **apri `src/assets/photos/cuba-consegna.jpg` e controlla a occhio** che la scritta sulla maglietta non si veda. Se si vede, alza `0.64` a `0.70` e ripeti. `IMG_0180` non si usa.

- [ ] **Step 3: Pagine condivise**

`src/pages-shared/DonaPage.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import Block from '../components/Block.astro';
import DonateBlock from '../components/DonateBlock.astro';
import Faq from '../components/Faq.astro';
import { t, routes, type Lang } from '../i18n';
interface Props { lang: Lang }
const { lang } = Astro.props;
const d = t(lang);
---
<Base lang={lang} pageKey="dona" title={d.meta.donaTitle} description={d.meta.donaDescription}>
  <Block color="blue" labelledby="dona-h1">
    <h1 id="dona-h1" class="display">{d.donaPage.title}</h1>
    <p class="lead">{d.donaPage.intro}</p>
  </Block>
  <Block color="orange" labelledby="donate-title">
    <DonateBlock lang={lang} showAllWays={false} steps={d.donaPage.fiveSteps} />
    <p><a href={routes[lang].trasparenza}>{d.donaPage.report}</a></p>
  </Block>
  <Block id="faq" color="cream" labelledby="faq-title">
    <Faq lang={lang} />
  </Block>
</Base>
```

`src/pages-shared/CubaPage.astro`:
```astro
---
import { Image } from 'astro:assets';
import Base from '../layouts/Base.astro';
import Block from '../components/Block.astro';
import DonateBlock from '../components/DonateBlock.astro';
import { t, type Lang } from '../i18n';
import photo from '../assets/photos/cuba-consegna.jpg';
interface Props { lang: Lang }
const { lang } = Astro.props;
const d = t(lang);
const c = d.cubaPage;
---
<Base lang={lang} pageKey="cuba" title={d.meta.cubaTitle} description={d.meta.cubaDescription}>
  <Block color="blue" labelledby="cuba-h1">
    <p class="eyebrow accent">{d.cuba.eyebrow}</p>
    <h1 id="cuba-h1" class="display">{c.title}</h1>
    <Image src={photo} alt={c.photoAlt} widths={[640, 1200, 2000]} sizes="100vw" class="cuba-img" loading="eager" fetchpriority="high" />
  </Block>
  <Block color="cream">
    <div class="grid-3">
      <div><h2 class="h3">{c.whoTitle}</h2><ul>{c.who.map((w) => <li>{w}</li>)}</ul></div>
      <div><h2 class="h3">{c.whatTitle}</h2><p>{c.what}</p></div>
      <div><h2 class="h3">{c.whyTitle}</h2><p>{c.why}</p></div>
    </div>
  </Block>
  <Block color="ink">
    <p class="lead">{c.bloqueoText}</p>
    <p><a class="btn btn--solid-orange" href="https://elbloqueo.it/" target="_blank" rel="noopener">{c.bloqueoCta}<span class="visually-hidden"> {d.ui.newTab}</span></a></p>
  </Block>
  <Block color="orange" labelledby="donate-title">
    <DonateBlock lang={lang} />
  </Block>
</Base>
<style>
  .cuba-img { margin-top: 48px; width: 100%; aspect-ratio: 3 / 1; object-fit: cover; }
</style>
```

`src/pages-shared/ThanksPage.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import Block from '../components/Block.astro';
import { t, routes, type Lang } from '../i18n';
interface Props { lang: Lang }
const { lang } = Astro.props;
const d = t(lang);
---
<Base lang={lang} pageKey="grazie" title={d.meta.grazieTitle} description={d.meta.grazieDescription} noindex>
  <Block color="blue" labelledby="thanks-h1">
    <h1 id="thanks-h1" class="display">{d.thanks.title}</h1>
    <p class="lead">{d.thanks.text}</p>
    <div class="btns">
      <a class="btn btn--solid-orange" href={routes[lang].home}>{d.thanks.back}</a>
      <a class="btn" href={routes[lang].trasparenza}>{d.thanks.transparency}</a>
    </div>
  </Block>
</Base>
```

`src/pages-shared/TransparencyPage.astro` (contenuto vecchio verbatim; l'h1 del vecchio `<main>` resta l'unico h1):
```astro
---
import Base from '../layouts/Base.astro';
import { t, type Lang } from '../i18n';
import itHtml from '../content/trasparenza/it.html?raw';
import esHtml from '../content/trasparenza/es.html?raw';
import enHtml from '../content/trasparenza/en.html?raw';
interface Props { lang: Lang }
const { lang } = Astro.props;
const d = t(lang);
const body = { it: itHtml, es: esHtml, en: enHtml }[lang];
---
<Base lang={lang} pageKey="trasparenza" title={d.meta.trasparenzaTitle} description={d.meta.trasparenzaDescription}>
  <div class="block block--cream"><div class="inner prose transparency" set:html={body} /></div>
</Base>
<style is:global>
  .transparency h1 { font-size: var(--fs-h2); font-weight: 800; line-height: 1; letter-spacing: -.03em; }
  .transparency h2 { font-size: var(--fs-h3); }
  .transparency table { width: 100%; border-collapse: collapse; }
  .transparency td, .transparency th { border-top: 1px solid var(--ink); padding: 8px 4px; text-align: left; }
</style>
```
Se il `<main>` vecchio non contiene un `<h1>`, il test "un h1" fallisce: in quel caso aggiungi `<h1 class="display">{d.nav.trasparenza}</h1>` prima del contenuto e, nel file `.html`, trasforma l'eventuale titolo principale in `<h2>`. Se il test ITALIAN del Task 5 trova italiano in `es.html`/`en.html`, traduci quelle frasi nel file.

- [ ] **Step 4: File di pagina per lingua** (12 file, tutti sottili). Esempio IT, gli altri identici cambiando componente, `lang` e profondità dell'import:

```astro
---
// src/pages/dona/index.astro
import DonaPage from '../../pages-shared/DonaPage.astro';
---
<DonaPage lang="it" />
```

| File | Componente | lang |
|---|---|---|
| `src/pages/dona/index.astro` | DonaPage | it |
| `src/pages/cuba/index.astro` | CubaPage | it |
| `src/pages/trasparenza/index.astro` | TransparencyPage | it |
| `src/pages/grazie/index.astro` | ThanksPage | it |
| `src/pages/es/dona/index.astro` | DonaPage | es |
| `src/pages/es/cuba/index.astro` | CubaPage | es |
| `src/pages/es/transparencia/index.astro` | TransparencyPage | es |
| `src/pages/es/gracias/index.astro` | ThanksPage | es |
| `src/pages/en/donate/index.astro` | DonaPage | en |
| `src/pages/en/cuba/index.astro` | CubaPage | en |
| `src/pages/en/transparency/index.astro` | TransparencyPage | en |
| `src/pages/en/thank-you/index.astro` | ThanksPage | en |

I file sotto `es/` ed `en/` importano da `../../../pages-shared/…`.

- [ ] **Step 5: Test e controllo visivo**

Run: `npm test` → PASS. Screenshot di `/cuba/` e `/dona/` a 375 e 1440 px in `docs/evidence/T4-*.png`.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(T4): pagine dona, cuba, trasparenza, grazie in IT/ES/EN

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: SEO — hreflang, canonical, JSON-LD, sitemap, llms.txt, 404, lingua sul sito costruito

**Files:**
- Modify: `src/layouts/Base.astro`, `public/llms.txt`
- Create: `src/lib/jsonld.ts`, `src/pages/404.astro`, `tests/seo.test.mjs`

**Interfaces:**
- Consumes: `altLinks(pageKey)`, `routes`, `site`, `t`.
- Produces: `buildJsonLd(lang, pageKey): object[]`.

- [ ] **Step 1: Scrivi i test (rossi)**

`tests/seo.test.mjs`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { page, html, file, LANGS, PAGES, DIST } from './lib/dist.mjs';

const ABS = 'https://www.comparte.it';
const ITALIAN = /\b(della|degli|delle|nelle|nella|sono|anche|questo|nostro|nostra|lavoriamo|formiamo|dichiarazione|codice fiscale|sosteniamo|iscriviti|perché|chi siamo|anni|bonifico|scuola|comunità|occhiali|medicine|grazie)\b/i;

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
  assert.doesNotMatch(llms, /onlus/i);
  assert.ok(existsSync(new URL('404.html', DIST)));
});
```

Run: `npm test` → FAIL (manca canonical). Output in `docs/evidence/T5-red.txt`.

- [ ] **Step 2: `src/lib/jsonld.ts`**

```ts
// Dati strutturati generati dagli stessi testi della pagina
import { t, routes, site, SITE_URL, type Lang, type PageKey } from '../i18n';

export function buildJsonLd(lang: Lang, pageKey: PageKey): object[] {
  const d = t(lang);
  const org = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    '@id': `${SITE_URL}/#org`,
    name: 'Comparte',
    url: SITE_URL + '/',
    logo: `${SITE_URL}/logo/comparte_logo_black.png`,
    foundingDate: '2018',
    taxID: site.cf,
    vatID: `IT${site.vat}`,
    email: site.email,
    address: { '@type': 'PostalAddress', streetAddress: 'Via G. G. Porro 8', postalCode: '00197', addressLocality: 'Roma', addressCountry: 'IT' },
    areaServed: [{ '@type': 'Place', name: 'Petén, Guatemala' }, { '@type': 'Place', name: 'La Habana, Cuba' }],
    sameAs: [site.social.instagram, site.social.facebook, site.social.linkedin],
  };
  const out: object[] = [org];
  if (pageKey === 'home' || pageKey === 'dona' || pageKey === 'cuba') {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'DonateAction',
      recipient: { '@id': `${SITE_URL}/#org` },
      description: `${d.donate.bankTitle}: ${site.bank}, IBAN ${site.iban}`,
      url: SITE_URL + routes[lang].dona,
    });
  }
  if (pageKey === 'home' || pageKey === 'dona') {
    const items = pageKey === 'home' ? d.faq.items.slice(0, d.faq.homeCount) : d.faq.items;
    out.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: lang,
      mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
    });
  }
  return out;
}
```

- [ ] **Step 3: Aggiorna `Base.astro` nell'`<head>`**

```astro
---
import { altLinks, routes, SITE_URL, type PageKey } from '../i18n';
import { buildJsonLd } from '../lib/jsonld';
// … props come prima, pageKey tipizzato PageKey
const canonical = SITE_URL + routes[lang][pageKey];
const alts = altLinks(pageKey);
const jsonld = buildJsonLd(lang, pageKey);
---
<link rel="canonical" href={canonical} />
{alts.map((a) => <link rel="alternate" hreflang={a.lang} href={a.href} />)}
<link rel="alternate" hreflang="x-default" href={SITE_URL + routes.it[pageKey]} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:locale" content={{ it: 'it_IT', es: 'es_ES', en: 'en_GB' }[lang]} />
{jsonld.map((j) => <script type="application/ld+json" set:html={JSON.stringify(j)} />)}
```

- [ ] **Step 4: `public/robots.txt`, `public/llms.txt`, `src/pages/404.astro`**

`public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://www.comparte.it/sitemap-index.xml
```

In `public/llms.txt`: sostituisci la prima citazione con
`> Associazione italiana del Terzo settore, attiva dal 2018 nel Petén, in Guatemala, con tre programmi di formazione (universitaria con USAC/CUDEP, climatica per ragazzi 13-17 anni, agricola con le comunità rurali). Da oltre 4 anni sostiene all'Havana, Cuba, l'asilo per anziani di Belén e le scuole primarie della città e della provincia con occhiali da vista e medicine. Il 5×1000 si dona con il codice fiscale 97977810585.`
e togli ogni "Onlus" dal file (`sed -i '' 's/ Onlus//g' public/llms.txt`), poi aggiungi in fondo la sezione `## Pagine` con gli URL di `routes` nelle 3 lingue.

`src/pages/404.astro`:
```astro
---
import Base from '../layouts/Base.astro';
---
<Base lang="it" pageKey="home" title="Pagina non trovata — Comparte" description="La pagina che cerchi non esiste." noindex>
  <section class="block block--blue"><div class="inner">
    <h1 class="display">404</h1>
    <p class="lead">Questa pagina non c'è. <a href="/">Torna alla home</a> · <a href="/es/">Inicio</a> · <a href="/en/">Home</a></p>
  </div></section>
</Base>
```
(Il test sulla 404 controlla solo che esista; `pageKey="home"` le dà un canonical sulla home, accettabile perché è `noindex`.)

- [ ] **Step 5: Test**

Run: `npm test` → PASS. Se il test italiano fallisce su `/es/transparencia/` o `/en/transparency/`, traduci le frasi in `src/content/trasparenza/{es,en}.html` e ripeti. Output in `docs/evidence/T5-green.txt`.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(T5): SEO, JSON-LD, sitemap, llms.txt, 404

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Workflow di deploy (preparato, non attivo)

**Files:**
- Create: `.github/workflows/deploy.yml`, `docs/cutover.md`

- [ ] **Step 1: Verifica le versioni correnti delle action**

Run:
```bash
gh api repos/withastro/action/releases/latest -q .tag_name
gh api repos/actions/deploy-pages/releases/latest -q .tag_name
```
Usa la major restituita (es. `v4` → `@v4`) nel file sotto.

- [ ] **Step 2: `.github/workflows/deploy.yml`**

```yaml
name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:
concurrency:
  group: pages
  cancel-in-progress: true
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm test
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```
(Si usa `npm test` + `upload-pages-artifact` invece di `withastro/action` per far girare i test prima del deploy: un test rosso blocca la pubblicazione.)

- [ ] **Step 3: `docs/cutover.md`** — procedura del passaggio, eseguibile **solo con OK di Andrea**:

```markdown
# Passaggio al sito nuovo

1. Andrea approva l'anteprima (screenshot e `npm run preview`) e la PR `sito-nuovo`.
2. Cambio impostazione Pages da "branch" a "GitHub Actions":
   gh api -X POST repos/queondache/comparte-website/pages -f build_type=workflow   # se non esiste
   gh api -X PUT  repos/queondache/comparte-website/pages -f build_type=workflow   # se esiste (oggi: legacy, main /)
3. Merge della PR su main → parte "Deploy".
4. Verifica live: curl -sI https://www.comparte.it/ /es/ /en/ /cuba/ /dona/ /trasparenza/ /en/transparency/ /es/transparencia/ → 200.
5. Ritorno indietro, se serve: gh api -X PUT repos/queondache/comparte-website/pages -f build_type=legacy -f 'source[branch]=main' -f 'source[path]=/' e revert del merge.
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "ci(T6): workflow di deploy Pages e procedura di passaggio

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Qualità finale — Lighthouse, scroll orizzontale, verifica, PR

**Files:**
- Create: `scripts/check-overflow.mjs`, `docs/evidence/lighthouse/*.json`

- [ ] **Step 1: Controllo scroll orizzontale a 375 px (Review Focus 4)**

`scripts/check-overflow.mjs` (usa Playwright da `npx`, non entra nelle dipendenze):
```js
// Nessuna pagina deve essere più larga del viewport a 375 px
import { chromium } from 'playwright';
const base = process.argv[2] ?? 'http://localhost:4321';
const paths = ['/', '/dona/', '/cuba/', '/trasparenza/', '/grazie/', '/es/', '/es/dona/', '/es/cuba/', '/es/transparencia/', '/es/gracias/', '/en/', '/en/donate/', '/en/cuba/', '/en/transparency/', '/en/thank-you/'];
const browser = await chromium.launch();
const pageObj = await browser.newPage({ viewport: { width: 375, height: 812 } });
let bad = 0;
for (const p of paths) {
  await pageObj.goto(base + p);
  const w = await pageObj.evaluate(() => document.documentElement.scrollWidth);
  console.log(w > 375 ? 'KO' : 'OK', p, w);
  if (w > 375) bad++;
}
await browser.close();
process.exit(bad ? 1 : 0);
```
Run: `npm run build && npm run preview &` poi `npx -y -p playwright node scripts/check-overflow.mjs` → exit 0.

- [ ] **Step 2: Lighthouse mobile su tutte le pagine**

```bash
for p in / /dona/ /cuba/ /trasparenza/ /es/ /es/cuba/ /en/ /en/cuba/; do
  n=$(echo "$p" | tr '/' '_'); npx -y lighthouse "http://localhost:4321$p" --form-factor=mobile --quiet --chrome-flags=--headless --output=json --output-path="docs/evidence/lighthouse/$n.json"
  node -e "const r=require('./docs/evidence/lighthouse/$n.json').categories;console.log('$p',Object.values(r).map(c=>Math.round(c.score*100)).join('/'))"
done
```
Expected: ogni riga ≥ 95/95/95/95. Se no, correggi (di solito immagini o contrasto) e ripeti.

- [ ] **Step 3: Suite completa**

Run: `npm test` → exit 0. Output raw in `docs/evidence/T7-final.txt`.

- [ ] **Step 4: Verificatore indipendente**

Lancia il subagent `verificatore` su un modello diverso dal builder, sull'hash esatto del branch: spec + piano + `npm test` + check-overflow + Lighthouse rieseguiti da lui. Serve il verdetto `OK` con l'output raw.

- [ ] **Step 5: Push e PR (nessun merge)**

```bash
git push -u origin sito-nuovo
gh pr create --base main --head sito-nuovo --title "Sito nuovo Comparte (Astro, manifesto, Cuba)" --body-file docs/evidence/pr-body.md
```
Il corpo PR contiene: hash, output dei test, Lighthouse, screenshot, link a `docs/cutover.md`, e l'elenco di cosa resta ad Andrea (rilettura testi, OK al passaggio, APERTO-01/03/04/05, dati Mailchimp in `src/data/site.json`). Chiude con la riga `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
