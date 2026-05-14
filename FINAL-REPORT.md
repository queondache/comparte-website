# FINAL-REPORT.md

**Sessione:** 2026-05-14
**Repo:** github.com/queondache/comparte-website
**Sito:** https://www.comparte.it
**Tag baseline IT:** `it-final` (commit `7b1a884`)
**HEAD main:** `9225750` (deployed, GitHub Pages built)

---

## Cosa è stato fatto

In una sessione: ottimizzazione SEO+GEO completa del sito di Comparte Onlus, da monolingua IT con JSON-LD minimale a sito trilingue IT/ES/EN con foundation entity layer Schema.org `@graph` 17 nodi, FAQPage in 3 lingue, `llms.txt` per LLM crawlers, pagina `/trasparenza/` con claim "Oltre il 90% va nei progetti", performance ottimizzata (chi-siamo.jpg da 2.92MB a 215KB WebP, 11 immagini galleria WebP con lazy loading), accessibilità WCAG (contrast variant + heading order), hreflang matrix completa, sitemap multilingue, language switcher trilingue. Hotfix prerequisito (3 issue P1 in prod: spirale 404 case-mismatch, /es/ 404 latente, canonical trailing slash) merged via PR #1. Deploy live e funzionante.

---

## Numeri finali

### Lighthouse mobile (post-deploy localhost throttling Slow 4G + 4× CPU)

| Pagina | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| IT `/` | **97** | 96 | 100 | 100 |
| ES `/es/` | **100** | 96 | 96 | 100 |
| EN `/en/` | **91** | 96 | 96 | 100 |

Baseline pre-sessione (IT solo, mobile): SEO 100, A11y 93, BP 96. Performance non misurato.
Delta: A11y +3, BP +4, Performance ora misurato 91-100, ES/EN nuovi a parità SEO/A11y.

### Hreflang reciprocity
**18/18 OK** validato post-deploy. 6 URL canonical, ognuno con 4 hreflang reciproci (it/es/en/x-default).

### JSON-LD
**9/9 blocks parse senza errori**. 17 nodi `@graph` foundation (NGO + 3 Person + 3 Project + 8 Partner Wikidata + DonateAction + WebSite + foundingEvent Cinema), 3 FAQPage (5 Q&A × 3 lingue), 3 WebPage/AboutPage (trasparenza × 3 lingue).

### Wikidata sameAs validati
6 partner: USAC Q607331, LUMSA Q1454044, Scholas Occurrentes Q16913085, INAB Q5559151, MARN Q6017176, European Schoolnet Q17012677. zeroCO2 e 1Caffè senza Wikidata → sameAs sito ufficiale.

### Costo (Anthropic API, claude-sonnet-4-5)
- Humanizer trasparenza IT (10 call): $0.22
- Build /es/ + /en/ index/trasparenza/llms (6 call streaming): $0.66
- **Totale: ~$0.88**

### Repo
- 13 commit semantici sul ramo lavoro (mergiati in main via PR #2 con merge commit, storia preservata)
- 1 hotfix PR (#1) prerequisito mergiato
- 1 fix post-deploy direttamente su main (`9225750` trailing slash)
- Tag git: `it-final` su `7b1a884`
- Branch `seo-geo-optimization` cancellato remote post-merge

---

## Limiti noti — 3 cose che Andrea deve riempire

### 1. Numeri reali pagina /trasparenza/
**File da modificare:** `trasparenza/index.html`, `es/transparencia/index.html`, `en/transparency/index.html`.
Cerca i pattern `[... — in pubblicazione]` e `[Importo 5×1000 anno X — ...]`. Sono 3+3 placeholder per lingua. Quando hai i bilanci approvati (2023, 2024) e gli importi 5×1000 ricevuti, sostituisci a mano (5 minuti). Anche le percentuali esatte 90%+ e <10% nella sezione "Dove vanno i fondi" possono diventare numeri precisi (`92,4%` vs `90%+`) quando il bilancio chiude.

### 2. Foto Comparte Cinema
**File:** `assets/img/cinema/cinema-origins.webp`.
Oggi è una copia di `assets/img/galleria/08.webp` (proiezione comunità rurali). Hai materiale storico più rappresentativo in `assets/img/Overall/1/` (untracked, foto 2018-2019). Quando vuoi sostituire: scegli il file da Overall/1/, fai `cwebp -q 80 source.jpg -o assets/img/cinema/cinema-origins.webp`, commit + push. Path semantico già coerente, niente HTML da toccare.

### 3. Wikipedia/Wikidata + Google Business Profile
- **Wikipedia IT:** Comparte Onlus non ha pagina. Vale la pena crearla (anche stub 3 paragrafi + fonti press già linkate). Aiuta knowledge graph + sameAs nel JSON-LD esistente.
- **Wikidata:** crea entry Q-id per Comparte Onlus + per zeroCO2 (2 entità mancanti dalla mappa partner). Tempo: 30 min/entità. Ha effetto catalizzatore su entity disambiguation Google + LLM citation.
- **Google Business Profile:** se non esiste, crea per "Comparte Onlus" con sede Roma. NAP (Name/Address/Phone) coerenti con JSON-LD `address`. Anche Bing Places.

---

## Next steps off-site (in ordine di priorità)

1. **GSC + RRT submit** (vedi `action-items-andrea.md` — 10 minuti, sblocca crawling)
2. **Wikipedia IT pagina Comparte Onlus** (alto impatto entity recognition, ~2h)
3. **Wikidata entry Comparte + zeroCO2** (~1h totali)
4. **Backlink da partner istituzionali** — chiedi a LUMSA, Scholas Occurrentes, Universidad Católica de Valencia, USAC/CUDEP di linkare https://www.comparte.it/ dalle loro pagine progetti/partner. 4 backlink da .edu/.org alti = leva forte ranking. Email scopo + JSON-LD già pronto se vogliono fare schema reciproco.
5. **Google Business Profile Roma** — claim sede, foto, descrizione (~30 min)
6. **Bing Webmaster Tools** — submit sitemap (vedi action-items-andrea.md § 5, ~2 min)
7. **Submit a directory ONG italiane** — Job4Good, AOI ONG.it, Lombardi nel Mondo
8. **Profili Crunchbase/LinkedIn Page completi** — coerenti con NAP del JSON-LD
9. **Press outreach**: aggiorna le 4 testate già linkate (Millionaire, Tempo Stretto, ecc.) con un follow-up "novità 2025" per ottenere nuovo backlink
10. **Bilancio sociale PDF + open** — quando lo pubblichi su /trasparenza/, segnale di grado istituzionale che Google premia

---

## Come testare che funziona — checklist 30 giorni

Tra 30 giorni esatti (giorno **2026-06-13**), apri Google e controlla questi indicatori:

1. **Sito è cliccabile in SERP**
   - Cerca: `Comparte Onlus 5x1000` su Google IT → atteso: comparte.it primo o secondo risultato
   - Cerca: `5x1000 educazione Guatemala` → comparte.it dovrebbe apparire prima pagina (top 10)
   - Cerca: `ONG italiana Petén Guatemala` → top 5

2. **Knowledge panel inizia a comparire**
   - Cerca esatto: `Comparte Onlus` → guarda colonna destra: se appare un panel con logo, descrizione, indirizzo Roma → JSON-LD funziona. Se non appare ancora, va bene — di solito serve 2-3 mesi di crawl + backlink autorevoli prima.

3. **FAQ rich snippet attivo**
   - Cerca: `come donare 5x1000 a comparte` → se SERP mostra accordion con domande/risposte direttamente → FAQPage schema riconosciuto da Google.

4. **GSC dashboard**
   - https://search.google.com/search-console → dashboard
   - Atteso 30 giorni: ≥6 URL indicizzati, prime impression sulla query "5x1000 Comparte" o "Comparte Onlus", CTR > 0
   - Se URL indicizzati < 6 dopo 30 giorni: vai in **Pagine** sidebar e guarda i motivi di esclusione

5. **AI citation check (LLM grounding)**
   - Apri ChatGPT (o Claude.ai, o Perplexity) e chiedi:
     - *"Quali ONG italiane lavorano in Guatemala nel settore educazione?"*
     - *"Posso donare il 5x1000 per progetti di educazione in Guatemala? Quali codici fiscali esistono?"*
     - *"What Italian NGOs work in Petén, Guatemala?"*
   - Se Comparte Onlus appare nominato (anche senza link) → `llms.txt` funziona. Se compare con CF 97977810585 → fact-grounding perfetto.

6. **Lighthouse drift check**
   - Vai su https://pagespeed.web.dev/, inserisci `https://www.comparte.it/` → mobile
   - Atteso: scores ≥ baseline misurato in questa sessione (Perf ≥90, A11y ≥95, SEO 100). Se sotto, mi mandi screenshot e investigo.

Se almeno 4 dei 6 sono OK dopo 30 giorni: la fondazione SEO/GEO è solida. Si lavora poi sui next steps off-site (Wikipedia, Wikidata, backlink) per spingere ulteriormente.

---

## File chiave nel repo

| File | Scopo |
|---|---|
| `seo-geo-audit.md` | Output Fase 0 — audit completo IT con findings P1/P2/P3 |
| `keyword-strategy.md` | Output Fase 1 — cluster keyword IT/ES/EN, FAQ briefs, decisioni di stile |
| `translation-style-rules.md` | Regole humanizer adattate IT/ES/EN per voce Comparte |
| `translation-log.md` | Log iterazioni humanizer + traduzioni con costi |
| `seo-geo-changelog.md` | Riepilogo Fase 2 (commit + score + limiti) |
| `validation-prod.md` | Validazione post-deploy con link Rich Results Test pre-popolati |
| `action-items-andrea.md` | Step manuali GSC + RRT che richiedono auth Andrea |
| `FINAL-REPORT.md` | Questo file |

---

## Stato finale

✅ Sito trilingue IT/ES/EN live e funzionante
✅ JSON-LD foundation 17 nodi, hreflang matrix 18/18, Lighthouse mobile 91-100
✅ FAQ + llms.txt × 3 lingue per ranking PAA + GEO
✅ /trasparenza/ con claim 90% → segnale trust per donatori
✅ Repo pulito (1 branch `main`, tag `it-final`, branch lavoro cancellati post-merge)

🟡 Aspetta tu: 3 placeholder Andrea (vedi sopra) + GSC submit (action-items-andrea.md)

🟢 Prossima sessione: content-calendar-5×1000 marzo-luglio (task #24, fuori scope di questa sessione)
