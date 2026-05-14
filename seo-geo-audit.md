# seo-geo-audit.md

**Data audit:** 2026-05-14
**Target:** https://www.comparte.it (IT, root)
**Strumenti:** chrome-devtools-mcp (Lighthouse + perf trace), Wikidata API, ispezione statica
**Scope:** solo IT (ES + EN inesistenti — issue P1 separato)

---

## 0. Score Lighthouse — baseline

| Categoria | Mobile | Desktop |
|---|---|---|
| **SEO** | 100 | 100 |
| **Accessibility** | 93 | 95 |
| **Best Practices** | 96 | 96 |
| **Agentic Browsing** | 100 | 100 |

## 0.1 Core Web Vitals — baseline (prod live)

| Metrica | Mobile (Slow 4G + 4× CPU) | Desktop (Fast 4G) | Soglia "good" |
|---|---|---|---|
| **LCP** | 1.77 s | 0.50 s | < 2.5 s ✅ |
| **CLS** | 0.00 | 0.00 | < 0.1 ✅ |
| **TTFB** | 172 ms | 62 ms | < 800 ms ✅ |
| **Render delay** | 1.60 s | 0.31 s | minimizzare |

CrUX (real users): n/a — sito sotto soglia volume per dati pubblici Google. Lab-only.
Verdetto CWV: **passabile oggi**, ma render-delay mobile = 90% del LCP è fragile (ogni font o immagine in più rompe).

---

## 1. Findings priorizzati

### P1 — Critical (bloccanti, fix immediato)

#### P1.1 — `comparte_spirale.png` 404 in produzione
- **Evidenza:** `errors-in-console` Lighthouse → "Failed to load resource: 404 — /assets/logo/comparte_spirale.png"
- **Causa:** filesystem locale macOS case-insensitive, file è `Comparte_Spirale.png` (C maiuscola) ma HTML referenzia `comparte_spirale.png` (linea 78). GitHub Pages case-sensitive → 404 prod.
- **Fix:** rinomina file `Comparte_Spirale.png` → `comparte_spirale.png` via `git mv -f`. Verificare anche `Comparte_logo_black.png` consistency.
- **Effort:** 5 min.

#### P1.2 — `/es/` referenziato ma 404
- **Evidenza:** sitemap.xml linea 12-19 dichiara `https://www.comparte.it/es/`, hreflang linea 16 idem, footer link `/es/` (linee 69, 414, 432). Cartella `/es/` non esiste.
- **Impatto:** Google indicizza un 404, hreflang inversi mancano → soft penalty. Click footer ES rompe UX.
- **Fix immediato (Fase 0):** rimuovi entry `/es/` da `sitemap.xml`, rimuovi hreflang `es` da `<head>`, aggiungi `aria-disabled` o nascondi footer link finché Fase 2 #0 non completa.
- **Effort:** 10 min.

#### P1.3 — JSON-LD minimale (no entity richness, no @graph)
- **Evidenza:** linee 35-47 → solo `NGO` base, `sameAs: []` vuoto, no `Project`, no `Person`, no `DonateAction`, no `FAQPage`, no fondatori, no contattabilità (`contactPoint`), no `PostalAddress`.
- **Impatto SEO+GEO:** Google e LLM non disambiguano entità, no rich snippet, no knowledge panel, no citation in Perplexity/Claude/ChatGPT su query "ONG Comparte" / "5x1000 Guatemala".
- **Fix:** `@graph` completo (Fase 2 #12). Wikidata IDs già validati (sez. 4).
- **Effort:** Fase 2.

#### P1.4 — `llms.txt` assente
- **Evidenza:** `https://www.comparte.it/llms.txt` → 404.
- **Impatto GEO:** LLM con browsing privilegiano `llms.txt` per fact-grounding. Senza, citazioni LLM fragili e potenzialmente errate.
- **Fix:** Fase 2 #14 in 3 lingue.
- **Effort:** Fase 2.

#### P1.5 — Color contrast WCAG fail (5+ elementi)
- **Evidenza:** `color-contrast` audit — 5+ nodi falliti.
  - `.lang-switch` (testo opacity 0.6 su crema #F5EFE0) — ratio < 4.5
  - `.hero-tag` (bianco su arancione #E8621A) — ratio ~3.4 (fail per testo small)
  - `.btn-primary` (bianco su arancione) — borderline 3.4 (fail per testo non-large)
  - `<em>` arancione #E8621A su crema #F5EFE0 (h2 chi-siamo, impatto, ecc.) — ratio ~3.1
- **Fix:** scurire arancione text-only varianti a `#C44E0E` (ratio 4.6), oppure aumentare opacity lang-switch a 0.85, oppure ingrandire hero-tag a 14px+700 weight. Identità visiva rimane (arancione resta colore brand su backgrounds non-text).
- **Effort:** 30 min CSS.

#### P1.6 — Heading order non sequenziale
- **Evidenza:** `heading-order` audit — `footer-col h4` segue `<h2>` di press senza `<h3>` intermedio. Salto H2→H4 = WCAG 2.4.6.
- **Fix:** rendi `footer-col h4` → `h3` (mantieni stile via class), oppure aggiungi visually-hidden `<h3>Sitemap</h3>` in apertura footer.
- **Effort:** 10 min.

#### P1.7 — `chi-siamo.jpg` = 2.92 MB
- **Evidenza:** `assets/img/hero/chi-siamo.jpg` 2'924'928 bytes. Servita da CSS `.chisiamo-img` (visibile desktop, hidden mobile via `display:none`). `display:none` blocca download su molti browser ma comportamento non garantito (Chromium scarica eager fino a render).
- **Impatto:** ~3 MB su desktop → costo bandwidth + delay paint sezione Chi Siamo.
- **Fix:** comprimi a webp ≤ 250 KB (qualità 80, max 1200px), aggiungi `<source>` srcset.
- **Effort:** 15 min (manuale via cwebp), Fase 2 #16.

#### P1.8 — Canonical/sitemap mismatch trailing slash
- **Evidenza:** `<link rel="canonical" href="https://www.comparte.it">` (no slash), sitemap `<loc>https://www.comparte.it/</loc>` (con slash).
- **Impatto:** Google considera URL distinti potenzialmente. Diluisce link equity.
- **Fix:** uniforma a CON slash ovunque (`https://www.comparte.it/`).
- **Effort:** 5 min.

---

### P2 — High (alto impatto, prossimo sprint)

#### P2.1 — Google Fonts via `@import` render-blocking
- **Evidenza:** `style.css` linea 10 `@import url('...fonts.googleapis.com')`. Anti-pattern: `@import` aspetta che CSS sia parsato prima di richiedere il font. Preconnect c'è in HTML ma il vero request è ritardato.
- **Fix:** sposta `<link rel="preload" as="style" href="...">` + `<link rel="stylesheet">` in HTML head, rimuovi `@import` da CSS. Aggiungi `font-display: swap` (manca, default Google).
- **Effort:** 15 min.

#### P2.2 — Hero image niente `fetchpriority="high"` né preload
- **Evidenza:** hero.jpg è LCP candidate ma nessun hint priorità. LCP discovery delay 113 ms desktop.
- **Fix:** `<img src="..." fetchpriority="high" loading="eager">` (già eager) + opzionale `<link rel="preload" as="image" href="/assets/img/hero/hero.jpg">`.
- **Effort:** 5 min.

#### P2.3 — Cache headers GitHub Pages subottimali
- **Evidenza:** Lighthouse insight Cache → 130 KB wasted (immagini, CSS, JS). GH Pages serve `cache-control: max-age=600`.
- **Fix:** non controllabile direttamente su GH Pages. Workaround: cache-busting via query string nel `<link>`/`<script>` tags (già di fatto presenti via filename), o spostare a Cloudflare Pages se priorità alta. Oggi: accetta limite.
- **Effort:** N/A (limite piattaforma) — segnala in changelog.

#### P2.4 — Galleria images non ottimizzate
- **Evidenza:** 11 file in `assets/img/galleria/`, totali ~2.6 MB. 02.jpg=567 KB, 07.jpg=526 KB, 01.jpg=300 KB, 10.jpg=270 KB. Tutte JPG, no WebP, no responsive srcset.
- **Fix:** convert webp + 2 size buckets (thumb 320w, main 1280w), `srcset`+`sizes`. Risparmio stimato: 60-70% peso.
- **Effort:** Fase 2 #16 (~1h script bash + cwebp).

#### P2.5 — Schema NGO `sameAs` vuoto
- **Evidenza:** `"sameAs": []` linea 45.
- **Impatto:** entity disambiguation Google + LLM ridotta. Knowledge graph orfano.
- **Fix:** popola con Instagram, Facebook, LinkedIn (già nel footer), Wikidata (se Comparte ha entry — verificare; oggi probabilmente no, candidata da creare in followup).
- **Effort:** 10 min.

#### P2.6 — `og:locale` solo `it_IT`, manca alternate
- **Evidenza:** linea 26.
- **Fix Fase 2:** aggiungi `og:locale:alternate` per `es_ES` ed `en_US` quando lingue create.
- **Effort:** 5 min in Fase 2.

#### P2.7 — Sitemap manca URL future
- **Evidenza:** sitemap solo `/` e `/es/`. Mancheranno: `/en/`, `/trasparenza`, `/es/transparencia`, `/en/transparency`, anchor critici (#cinque-x-mille, #faq).
- **Fix:** Fase 2 #17 sitemap multilingue completo.
- **Effort:** Fase 2.

---

### P3 — Nice-to-have (cleanup, polish)

| ID | Issue | Fix | Effort |
|---|---|---|---|
| P3.1 | `.DS_Store` in `assets/img/` e sotto-folder | gitignore + `git rm` | 5 min |
| P3.2 | JS senza `defer` (4 KB ma migliora critical path) | `<script src="..." defer>` | 1 min |
| P3.3 | Twitter Card manca `site` e `creator` | aggiungi `@comparteonlus` se esiste handle | 5 min |
| P3.4 | `og:image` manca `width`/`height`/`alt` | aggiungi 1200×630 + alt | 5 min |
| P3.5 | Manca `<meta name="theme-color">` | `#E8621A` per browser UI mobile | 1 min |
| P3.6 | Manca `<meta name="robots" content="index,follow,max-image-preview:large">` | aggiungi (max-image-preview:large = sgnificato per Discover) | 1 min |
| P3.7 | CSP/HSTS/COOP/X-Frame headers | non controllabili GH Pages — meta CSP minima possibile | 15 min |
| P3.8 | Footer manca schema `PostalAddress` (è in JSON-LD ma assente) | parte di P1.3 (@graph) | incluso |
| P3.9 | `assets/img/Overall/` 80 MB di untracked unused | `git rm`/move out, dichiarare in .gitignore | 10 min |
| P3.10 | press date format inconsistente ("Febbraio 2021" vs "Alumni Stories") | normalizza | 5 min |
| P3.11 | Press card senza schema `Article`/`NewsArticle` (non urgente, link esterni) | opzionale `mentions` in NGO | salta |

---

## 2. Gap GEO (LLM citation readiness)

Verifica fact-grounding per query target tipo: *"dove devolvere il 5x1000 per Guatemala"*, *"ONG italiane che fanno educazione in America Latina"*.

| Segnale GEO | Stato | Gap |
|---|---|---|
| `llms.txt` root | ❌ assente | P1.4 — Fase 2 #14 |
| `llms.txt` per lingua | ❌ | Fase 2 #14 |
| Statistiche citabili con fonte | ⚠️ presenti senza fonte | "1.500+ formate", "27 studenti", "46+ comunità", "180.000 alberi" — mai una `<cite>`, link, o anno esplicito → LLM scartano per low-confidence |
| Riepiloghi semantici per sezione | ❌ assenti | Aggiungi 1-2 frasi fattuali in apertura ogni `<section>` (Fase 2) |
| Q&A diretto (FAQPage) | ❌ assente | Fase 2 #13 — formato Q&A è ottimizzato sia per Google PAA sia per LLM extraction |
| Entità collegate (Wikidata sameAs) | ❌ NGO sameAs vuoto, Project/Person/Partner mancano | Fase 2 #12 |
| Pagina trasparenza (numeri verificabili) | ❌ assente | Fase 2 #15 |
| Date esplicite (`datePublished`, `dateModified`) | ❌ assenti | parte schema Fase 2 |
| Chi siamo con `foundingLocation`, `founder`, `numberOfEmployees` | ⚠️ solo `foundingDate` | Fase 2 #12 |
| Multilingue (audience EN globale per LLM) | ❌ solo IT live | Fase 2 #0.7 |
| Ancore deep-link stabili (`#5x1000`, `#partner`, `#impact`) | ✅ presenti | mantieni nello sitemap |

---

## 3. Mappa completa elementi `<head>` IT — diagnosi rapida

| Elemento | Stato | Note |
|---|---|---|
| `<title>` | ✅ ok, 78 char (limit 60 — taglia) | "Comparte Onlus – Dona il 5x1000 all'educazione in Guatemala \| CF 97977810585" |
| `<meta description>` | ✅ ok 175 char (limit 155 — taglia 20 char) | |
| `<meta charset>`, `<meta viewport>` | ✅ | |
| `<link rel="canonical">` | ⚠️ missing trailing slash | P1.8 |
| `<link rel="alternate" hreflang>` | ⚠️ punta a /es/ 404 | P1.2 |
| Open Graph completi | ✅ presenti | mancano `image:width`, `image:height`, `image:alt` (P3.4) |
| Twitter Card | ✅ presenti | mancano `site`/`creator` (P3.3) |
| JSON-LD | ⚠️ minimale | P1.3 |
| Preconnect fonts | ✅ presenti | ma `@import` annulla beneficio (P2.1) |
| Favicon (32, 16, apple-touch) | ✅ | |
| `theme-color` | ❌ | P3.5 |
| `robots` meta | ❌ default ok ma raccomando explicit con `max-image-preview:large` | P3.6 |
| `author`/`publisher` meta | ❌ minore | salta |
| `<html lang>` | ✅ `it` | |

---

## 4. Wikidata IDs validati (per Fase 2 #12)

Validati via `wbsearchentities` API + cross-check Wikipedia IT/ES:

| Entità | Wikidata Q | sameAs aggiuntivo | Type |
|---|---|---|---|
| Universidad de San Carlos de Guatemala (USAC) | **Q607331** | https://www.usac.edu.gt | EducationalOrganization |
| Libera Università Maria SS. Assunta (LUMSA) | **Q1454044** | https://www.lumsa.it | EducationalOrganization |
| Scholas Occurrentes | **Q16913085** | https://www.scholasoccurrentes.org | NGO |
| Instituto Nacional de Bosques (Guatemala) | **Q5559151** | https://www.inab.gob.gt | GovernmentOrganization |
| MARN Guatemala | **Q6017176** | https://www.marn.gob.gt | GovernmentOrganization |
| European Schoolnet | **Q17012677** | https://www.eun.org | NGO |
| zeroCO2 | ❌ no Wikidata | https://zeroco2.eu | Organization |
| 1Caffè | ❌ no Wikidata | https://1caffe.org | Organization (donation platform) |

CUDEP = location di USAC nel dipartimento Petén, va in `Project.location` di Comparte Universidad (no Q-number stand-alone trovato; va testuale come "Centro Universitario de Petén — CUDEP").
Universidad Católica de Valencia = collab puntuale Comparte Universidad, cita testuale in Project.collaborator senza sameAs (no Q-number prioritario; verificare in Fase 2 se serve).

---

## 5. Stima effort totale per fase

| Fase | Tempo stimato |
|---|---|
| Fase 0 fix immediati (P1.1, P1.2, P1.5, P1.6, P1.8) | ~1h |
| Fase 1 (keyword + style rules + FAQ brief) | ~3h |
| Fase 2 (implementazione completa, branch separato) | ~12-16h |
| Fase 3 (validazione + changelog) | ~2h |
| **Totale** | **~18-22h di lavoro Claude** |

---

## 6. Raccomandazioni prima di Fase 1

**Hotfix opzionali Fase 0 → main subito** (Andrea decide):
- P1.1 rinomina `Comparte_Spirale.png` → `comparte_spirale.png` (sito ha hero broken oggi)
- P1.2 rimuovi `/es/` da sitemap + hreflang + disabilita link footer (sito linka 404 oggi)
- P1.8 fix canonical trailing slash

Tutti gli altri fix vanno su branch `seo-geo-optimization` (Fase 2).

**Domande aperte per Fase 1:**
1. Procedo con hotfix P1.1+P1.2+P1.8 su `main` adesso, o aspetto e li bundlo nel branch?
2. Per Fase 1 keyword strategy: vuoi anche raccolta volume reale via Google Keyword Planner / Ahrefs (richiede credenziali esterne) o stima qualitativa basata su SERP IT/ES/EN?
3. Pagina `/trasparenza` — chi cura i contenuti reali (numeri, anno, breakdown spese)? Io produco scaffold neutro o aspetti tu fornisca dati?

**Approva Fase 0 → procedo Fase 1.**
