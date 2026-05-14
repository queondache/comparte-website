# tasks.md

Sincronizzato con TaskList nativo della sessione (TaskCreate/TaskUpdate). Vista persistente cross-sessione qui sotto.

## Fase 0 — Diagnosi (in corso)

- [ ] #1  Setup file contesto progetto (in_progress)
- [ ] #2  Audit tecnico SEO IT
- [ ] #3  Core Web Vitals via chrome-devtools-mcp (mobile + desktop, prod)
- [ ] #4  Wikidata IDs validation via API
- [ ] #5  GEO gap analysis
- [ ] #6  Scrivi seo-geo-audit.md priorizzato P1/P2/P3

## Fase 1 — Strategy (attende approvazione)

- [ ] #7  Keyword strategy IT/ES/EN + FAQ 5+5+5
- [ ] #20 Studio humanizer + translation-style-rules.md

## Fase 2 — Implementazione (branch seo-geo-optimization)

Ordine RENUMBER (post step 7):
- [x] #12 JSON-LD @graph completo
- [x] #16 Performance fix
- [x] #26 Accessibilità WCAG fix
- [x] #11 Sezione Direttivo + #25 Cinema relocato
- [x] #13 Sezione FAQ + FAQPage schema (IT done; ES/EN dopo freeze)
- [x] #14 llms.txt IT (ES/EN dopo freeze)
- [x] #15 Pagina /trasparenza scaffold
- [ ] #9  **FREEZE IT** — aspetta GO Andrea (verifica visiva localhost)
- [ ] #8  Crea /es/ (HTML + JSON-LD + FAQ + llms.txt ES, humanizer opzione B)
- [ ] #10 Crea /en/ (idem, humanizer EN)
- [ ] #21 Humanizer pipeline call (claude-sonnet-4-5, batch 500-800 token, log)
- [ ] #22 Pipeline traduzione per file
- [ ] #18 Language switcher header (POST /en/, 3 link vivi)
- [ ] #17 Sitemap multilingue + hreflang matrix completa

## Fase 3 — Validazione

- [ ] #19 Validazione finale (Rich Results, Lighthouse pre/post × 3, hreflang validator, llms.txt parse, changelog)

## Sessione futura (NON in scope ora)

- [ ] #24 content-calendar-5x1000 — piano editoriale marzo-luglio (social + landing + email). Base: `keyword-strategy.md` § 7. Skill: /content-strategy + /social-content + /copywriting + /marketing-psychology. Output in `content/`.

## Annessi Fase 2

- [ ] #25 Curatela foto Comparte Cinema storica per sezione "Da dove veniamo"
  - Step A (in Fase 2): crea cartella `assets/img/cinema/`, copia `assets/img/galleria/08.jpg` → `assets/img/cinema/cinema-origins.jpg`, referenzia da lì in sezione "Da dove veniamo" per semantica path coerente
  - Step B (post-Fase 2): sostituire `cinema-origins.jpg` con foto curata da `Overall/1/` quando Andrea fornisce selezione

## Gate

- Fase 0 → Fase 1: approvazione Andrea su seo-geo-audit.md
- Fase 1 → Fase 2: approvazione Andrea su keyword strategy + translation-style-rules.md
- Fase 2 → Fase 3: completamento implementazione branch
- Fase 3 → merge main: approvazione Andrea su seo-geo-changelog.md
