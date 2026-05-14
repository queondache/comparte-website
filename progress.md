# progress.md

## 2026-05-14 — Sessione SEO/GEO Fase 0

### Stato pre-sessione
- Sito IT live su www.comparte.it (GitHub Pages)
- /es/ e /en/ inesistenti (sitemap già le citava → 404 latente)
- JSON-LD minimale (NGO base, sameAs vuoto)
- llms.txt assente
- chi-siamo.jpg = 2.92 MB (issue performance noto)
- Branch main pulito, untracked: assets/img/Overall/ (folder non in uso nel codice)

### Lavoro in corso
- Fase 0 audit IT
- Setup file contesto progetto (CLAUDE.md, progress.md, tasks.md, lessons.md)
- Branch `seo-geo-optimization` da creare prima Fase 2

### Decisioni assunte (sessione)
- A1: /es/ rimossa da sitemap.xml fino a creazione effettiva
- A2: 8 partner canonici da HTML, CUDEP+Católica Valencia in Project schema non Organization
- A3: 3 persone direttivo autorizzate, no foto
- A4: Wikidata IDs validati via API, omettere se ambiguo
- A5: Fonti claim "Comparte Onlus — dati interni 2024" + futura pagina /trasparenza
- A6: CWV su prod live mobile + desktop
- A8: Branch + commit autonomi su seo-geo-optimization, PR su approvazione
- A9: IBAN pubblico in llms.txt come testo, DonateAction punta a #cinque-x-mille
- A10: Tutti 8 partner in @graph (INAB+MARN come GovernmentOrganization, 1Caffè donation platform)

### Update scope (sessione)
- Sito trilingue IT/ES/EN
- /en/ aggiunta
- Pipeline traduzione humanizer obbligatoria (Step 1-4)

### Fase 0 — completata (2026-05-14)

**Score baseline:**
- Lighthouse Mobile: SEO 100, A11y 93, BP 96, Agentic 100
- Lighthouse Desktop: SEO 100, A11y 95, BP 96, Agentic 100
- CWV Mobile (Slow 4G + 4× CPU): LCP 1.77s, CLS 0.00, TTFB 172ms
- CWV Desktop (Fast 4G): LCP 0.50s, CLS 0.00, TTFB 62ms

**Issue critici scoperti:**
- P1.1 `comparte_spirale.png` 404 in prod (case mismatch, file = `Comparte_Spirale.png`)
- P1.2 `/es/` referenziato da sitemap+hreflang+footer ma 404
- P1.3 JSON-LD minimale (NGO base, sameAs vuoto, no Project/Person/DonateAction/FAQ)
- P1.4 llms.txt assente
- P1.5 Color contrast WCAG fail (5+ elementi: lang-switch, hero-tag, btn-primary, em arancione)
- P1.6 Heading order: footer H4 dopo H2 senza H3 intermedio
- P1.7 chi-siamo.jpg 2.92MB
- P1.8 Canonical/sitemap trailing slash mismatch

**Wikidata IDs validati:** USAC Q607331, LUMSA Q1454044, Scholas Q16913085, INAB Q5559151, MARN Q6017176, European Schoolnet Q17012677. zeroCO2 e 1Caffè no Wikidata → sameAs sito ufficiale.

**Output:** `seo-geo-audit.md` con findings P1/P2/P3 + effort + raccomandazioni hotfix immediati.

### Hotfix Fase 0 — DONE (PR #1)

Branch `hotfix/prod-404` aperto su https://github.com/queondache/comparte-website/pull/1.
- P1.1 rename `Comparte_Spirale.png` → `comparte_spirale.png`
- P1.2 rimossi tutti riferimenti `/es/` (sitemap, hreflang head, link nav+footer×2)
- P1.8 trailing slash uniforme `https://www.comparte.it/` su canonical+og:url+schema url

3 file changed (+7/-19). Attende merge Andrea.

### Fase 1 — DONE

**Output prodotti:**
- `translation-style-rules.md` — checklist 29 pattern AI-tipici Wikipedia adattati a IT/ES/EN per voce Comparte. Suddivisi in regole globali (G1-G4), IT (IT-1 a IT-5), ES (ES-1 a ES-5 con focus españolismi peninsulari da evitare), EN (EN-1 a EN-4 con cliché NGO da evitare). Checklist finale + gate humanizer.
- `keyword-strategy.md` — cluster IT/ES/EN, mappa competitor (AMKA + COOPI sono i veri concorrenti IT in Petén), title+meta riscritti per IT/ES/EN per `/` e `/trasparenza`, FAQ briefs 5+5+5 con audience differenziate (IT donor, ES LATAM partner/volontariato, EN istituzionale globale + foreign donor SEPA), calendario stagionale 5x1000.

**Insight competitivi:**
- IT: AMKA ODV è competitor diretto (Petén 2009+). Differenziare su educazione USAC/CUDEP, programma clima, partnership zeroCO2. Non competere head-on su "5x1000 Guatemala" generico.
- ES: spazio "ONG italiana Guatemala" è vacante in LATAM SERP — angolo unico per Comparte.
- EN: "Italian NGO Guatemala education" è vacante. Attenzione: USAC in EN = "University Studies Abroad Consortium" — disambigua subito.

### Decisioni di stile risolte (2026-05-14)

1. CTA `/es/` `/en/` BINARI: Donar+Colabora / Donate+Partner. Hero level. Nav menu accetta soft labels alternative.
2. 5x1000 in `/es/` `/en/` = informational FAQ only + CTA soft "share this" verso `/#cinque-x-mille`. No banner.
3. Comparte Cinema = origin story "Da dove veniamo" dentro Chi Siamo (NON dentro Progetti). JSON-LD come `foundingEvent`/description Organization, NON Project. Foto disponibile `galleria/08.jpg`.
4. Direttivo tradotto: nomi mai tradotti; ruoli sì (Vicepresidenta ES femm, Vice President EN neutro, Liaison invariato); bio 1 frase passa humanizer.
5. Calendario editoriale 5x1000 FUORI scope. Cartella `content/` creata con README placeholder. Task #24 in tasks.md per sessione futura.

Override decisioni in `keyword-strategy.md` § 8 (sostituite domande aperte).

### Setup pre-Fase 2 — DONE

- Cartella `content/` creata con `README.md` (scope + skill suite per sessione futura)
- Task #24 content-calendar-5x1000 aggiunto (sessione futura)
- Task #25 curatela foto Cinema aggiunto (annesso Fase 2)

### Ordine Fase 2 — RENUMBER (post step 7)

Step 1-7: ✅ JSON-LD, perf, a11y, Direttivo+Cinema, FAQ, llms.txt IT, /trasparenza scaffold

8. ~~Language switcher header~~ — **SALTATO** (link morti). Spostato a step 12 (post /en/).
9. **FREEZE IT** — tag git `it-frozen-v1`. **Non parte autonomamente: aspetta GO esplicito Andrea dopo verifica visiva localhost:8000.**
10. /es/ build completo (HTML + JSON-LD ES + FAQ ES + llms.txt ES). Humanizer pipeline opzione B = API reale.
11. /en/ build completo (idem, humanizer EN).
12. Language switcher header trilingue (3 link tutti vivi)
13. Sitemap.xml trilingue + hreflang matrix completa + xhtml:link alternate
14. Validation: Rich Results × 3, Lighthouse × 3 × mobile/desktop, hreflang validator, llms.txt manual
15. `seo-geo-changelog.md` completo + PR `seo-geo-optimization` → main in **draft** (attende review Andrea)

### Pipeline humanizer /es/ /en/ — config (decisione Andrea)

- **Model:** `claude-sonnet-4-5` (non Opus)
- **Batch:** ~500-800 token per call, non paragrafo per paragrafo
- **Log obbligatorio in `translation-log.md`:** file sorgente, n. iterazioni, n. pattern AI rimossi per call, costo stimato
- **Hard stop:** se sezione richiede >3 iterazioni humanizer per ripulirsi → ferma, segnala in log, migliora prompt traduzione iniziale invece di iterare all'infinito

### Stato attuale (post step 7)

- 8 commit su `seo-geo-optimization` (HEAD `d8127aa`)
- Server HTTP locale attivo: http://localhost:8000/ + http://localhost:8000/trasparenza/
- **Stand-by per verifica visiva Andrea** su: Direttivo, Cinema "Da dove veniamo", FAQ, WCAG arancione-text
- Su GO → tag `it-frozen-v1` + step 10 /es/
- Su aggiustamenti → chiudo prima, poi freeze
- /compact richiesto da Andrea prima di procedere step 9+ (azione utente)

Ogni step = 1 commit semantico minimo. Push autonomo branch OK.

### Vincoli operativi Fase 2

- **Soglia contesto < 70%** → `/compact` obbligatorio prima del prossimo step se sopra
- **Humanizer pipeline strict** per ogni testo ES/EN in produzione (Step 3 + spot check Step 4 obbligatori)
- **Identità visiva intoccabile**: #E8621A arancione, #D4547A rosa, #1A4A6B blu, #F5EFE0 crema, Fraunces + Instrument Sans
- **Stop & ping** su ambiguità reali che impattano contenuto editoriale o brand — non improvvisare

### Stato attuale
- PR #1 hotfix in mano ad Andrea per merge
- Tutto pronto per Fase 2: aspetto signal merge → `git checkout main && git pull && git checkout -b seo-geo-optimization` → step 1 (JSON-LD)
