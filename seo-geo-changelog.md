# seo-geo-changelog.md

**Branch:** `seo-geo-optimization` → main (PR draft)
**Sessione:** 2026-05-14
**Goal:** SEO + GEO optimization completa, sito trilingue IT/ES/EN.
**Tag baseline:** `it-final` (HEAD `7b1a884`).

---

## Risultati

### Lighthouse mobile (localhost, throttling Slow 4G + 4× CPU)

| Pagina | Performance | A11y | Best Practices | SEO |
|---|---|---|---|---|
| IT `/` | **97** | 96 | 100 | 100 |
| ES `/es/` | 79 | 96 | 96 | 100 |
| EN `/en/` | 79 | 96 | 96 | 100 |

Baseline pre-sessione (IT, mobile): SEO 100, A11y 93, BP 96. Performance non misurato.
Delta IT: A11y +3, BP +4, Perf misurato 97. ES/EN nuovi: parità SEO/A11y, Perf 79 (degrade vs IT da galleria 11 webp eager).

### Hreflang reciprocity
**18/18 OK.** 6 URL × 3 hreflang reciproci ciascuno, validato via script python.

### JSON-LD validation
Tutti i blocchi parsano. 2 blocks per home (FAQPage + @graph 17 nodi), 1 block per trasparenza (WebPage+AboutPage).
Wikidata sameAs validati per 6 partner: USAC Q607331, LUMSA Q1454044, Scholas Q16913085, INAB Q5559151, MARN Q6017176, European Schoolnet Q17012677.

---

## Cosa è cambiato

### Hotfix (PR #1, già merged in main)
- Rinomina `Comparte_Spirale.png` → `comparte_spirale.png` (case-sensitive GH Pages)
- Rimossi tutti i riferimenti a `/es/` (404 latente nella sitemap pre-sessione)
- Trailing slash uniforme `https://www.comparte.it/`

### Fase 2 (questa PR)

**Foundation entity layer**
- JSON-LD `@graph` 17 nodi: NGO esteso (taxID, vatID, address, founder, member, subjectOf foundingEvent Cinema), 3 Person, 3 Project (Comunidad/Universidad/Educación; Cinema NON Project), 8 Partner Org con Wikidata, DonateAction, WebSite

**Performance**
- chi-siamo.jpg 2.92 MB → 531 KB resize + WebP 215 KB
- 11 galleria JPG → WebP (-37%)
- Hero `<picture>` + `fetchpriority="high"`, chi-siamo `<picture>`
- Font: rimosso `@import` → `<link rel=preload as=style>` non-blocking + media swap pattern
- JS `defer`

**Accessibilità WCAG**
- Variabili `--arancione-text` (#C44E0E ratio 5.7+) per testo small su crema/white
- `--arancione` (#E8621A) preservato per backgrounds/bordi (large text protetto)
- Footer `<h4>` → `<h3>` per heading order valido

**Contenuto**
- Sezione Direttivo (3 card: Andrea Pesce, Irene Culcasi, Virgilio Galicia)
- Cinema relocato come "Da dove veniamo" dentro Chi Siamo (origin story, NON status:discontinued); foto `assets/img/cinema/cinema-origins.webp`
- FAQ 5 Q&A IT con FAQPage JSON-LD
- `llms.txt` IT (manifesto fattuale per LLM crawlers)
- Pagina `/trasparenza/` redesign con claim **"Oltre il 90% di quello che raccogliamo va nei progetti"** (90% in arancione gigante asimmetrico) + 5 sezioni (era 7) + placeholder pattern Andrea

**Trilingue**
- `/es/` build completo: index + transparencia + llms.txt
- `/en/` build completo: index + transparency + llms.txt
- Sezione 5×1000 sostituita con `#donaciones`/`#donations` (informational + soft CTA "share with Italian taxpayer")
- Hero CTA paritari (Donar+Colabora / Donate+Partner)
- FAQ 5 Q&A specifiche per audience LATAM e EN istituzionale
- Direttivo bio in 3 lingue (Vicepresidenta femminile ES, Vice President neutro EN, Liaison invariato)
- Hreflang matrix completa (it/es/en/x-default × 6 URL)
- Language switcher header trilingue (HTML puro, no JS) con `aria-current="page"`
- Sitemap multilingue 6 URL con xhtml:link alternate completi

---

## Pipeline traduzione (humanizer)

- Modello: `claude-sonnet-4-5` (sonnet 4.5)
- Stream API per output >16k token
- 6 chiamate totali (index×2, trasparenza×2, llms.txt×2) — costo $0.66
- Più 10 chiamate humanizer su trasparenza IT (rifinitura copy claim 90%) — costo $0.22
- Log completo in `translation-log.md`
- Regola appresa: skip humanizer per stringhe <5 parole (genera garbage)

---

## Vincoli operativi rispettati

- Identità visiva intoccabile (palette, font, asimmetria)
- Branch separato `seo-geo-optimization` con commit semantici atomici
- Branch policy: PR verso main resta draft, attende review esplicita Andrea
- Nomi propri mai tradotti, CF/IBAN/P.IVA invariati cross-lingua
- 5×1000 disponibile solo in IT (audience non eleggibile in ES/EN)

---

## Limiti noti

- **Lighthouse**: chrome-devtools MCP disconnesso a metà sessione → uso lighthouse CLI su localhost. Non eseguito Rich Results Test ufficiale Google (richiede pagine deployed). Da rieseguire post-merge sul dominio prod.
- **Performance ES/EN 79**: galleria 11 webp eager-loaded sul thumbnail container. Possibile fix: lazy load thumbs sotto fold + preload solo prima slide. Lasciato per ottimizzazione futura.
- **Pagina /trasparenza**: numeri reali e PDF documenti = placeholder pattern `[... — in pubblicazione]`. Andrea fornirà i dati in commit successivo.
- **Comparte Cinema foto**: usa `cinema-origins.webp` = copia di `galleria/08.webp`. Andrea può sostituire con foto curata da `Overall/1/` (materiale storico untracked) in step successivo.

---

## Commit list (branch seo-geo-optimization)

```
4ae58e4 feat(i18n): hreflang matrix + language switcher trilingue + sitemap multilingue
[ultimo]  fix(i18n): asset paths assoluti per /es/ e /en/
[i18n]    feat(i18n): build /es/ + /en/ trilingual fork
7b1a884 redesign /trasparenza: claim 90% + 5 sezioni + copy umano (TAG it-final)
d8127aa feat(content): pagina /trasparenza scaffold neutro
4814d49 feat(geo): llms.txt IT (manifesto fattuale per LLM crawlers)
54224fe feat(faq): sezione FAQ IT + FAQPage JSON-LD
884d8bf feat(content): sezione Direttivo + Cinema relocato come "Da dove veniamo"
82c83cc a11y(wcag): contrast variants + heading hierarchy fix
f8d2c3c perf(loading): non-blocking fonts + JS defer
[perf]    perf(images): WebP + chi-siamo resize + LCP fetchpriority
53f6732 feat(seo): JSON-LD @graph completo (foundation entity layer)
```

---

## Prossimi passi (sessione futura, fuori scope)

- Andrea fornisce numeri reali per /trasparenza (bilanci, rendiconto 5×1000) — semplice replace dei placeholder
- Foto Cinema curata da Overall/1/
- Content calendar 5×1000 marzo-luglio (task #24, skill suite content-strategy + social-content + copywriting)
- Eventuale ottimizzazione Performance ES/EN (galleria lazy + preload prima slide)
- Rich Results Test Google + monitoring Search Console post-deploy
