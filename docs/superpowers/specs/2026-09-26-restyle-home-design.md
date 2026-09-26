# Restyle home Comparte — design

**Data:** 2026-09-26 · **Stato:** in revisione da Andrea · **Tier:** 1–2 (sito statico, nessun dato personale salvato da noi)

## Obiettivo

Rendere la home di www.comparte.it più chiara e più efficace nel far destinare il 5×1000 e
donare, con un racconto più forte sul perché l'educazione conta.

Successo:
1. Chi arriva capisce in 5 secondi chi siamo e come aiutare (5×1000 visibile sopra la piega).
2. Esiste un percorso completo per donare: bonifico (IBAN copiabile) e carta (Mollie).
3. Ci si può iscrivere alla newsletter.
4. Sezione nuova "Perché l'educazione", con fonti.
5. El Bloqueo presentato come progetto di Comparte.
6. Lighthouse mobile non peggiora rispetto al baseline (Perf ≥ 90, A11y ≥ 95, SEO 100).

## Decisioni prese (Andrea, 2026-09-26)

| Tema | Scelta |
|---|---|
| Approccio | **1 — riordino della pagina statica esistente** (nessun framework, nessuna build) |
| Priorità | 5×1000 prima, poi donazioni, poi newsletter |
| Tono | Caldo e diretto: "tu", frasi brevi, niente gergo ONG, luoghi e persone concreti, dati con fonte |
| Lingue | IT prima; ES/EN dopo approvazione IT, stessa struttura |
| Font | **Plus Jakarta Sans** (titoli e testo), sostituisce Fraunces + Instrument Sans |
| Carta | **Mollie** Payment Link (UE), importo libero, donazione singola — integrazione affidata a Codex |
| Newsletter | **Mailchimp**, form incorporato con doppio opt-in — integrazione affidata a Codex |
| Qualifica | Comparte è **iscritta al RUNTS** (ETS): via "ONLUS" da testi, meta, JSON-LD |
| El Bloqueo | **Progetto sostenuto** da Comparte (non di Comparte): box "Progetti che sosteniamo" in coda alla sezione Progetti, link a https://elbloqueo.it/ |
| Contenuti educazione | Dai social @comparteonlus + fonti pubbliche (UNESCO/UIS) |

Assunzione (non confermata esplicitamente, correggibile qui): approccio 1 e ordine sezioni sotto.

## Architettura informativa — home IT

| # | Sezione | `id` | Stato | Contenuto |
|---|---|---|---|---|
| 1 | Hero | `hero` | riscritta | Titolo, una frase, CTA primaria "Dona il 5×1000", secondaria "Altri modi per donare" |
| 2 | Perché l'educazione | `perche-educazione` | **nuova** | Vedi § Contenuti |
| 3 | Chi siamo | `chi-siamo` | accorciata | Storia 2018, Comparte Cinema, direttivo compatto (3 righe) |
| 4 | Progetti | `progetti` | estesa | Comunidad, Universidad, Educación + box **Progetti che sosteniamo: El Bloqueo** |
| 5 | Impatto | `impatto` | rivista | Numeri, ognuno con fonte in chiaro |
| 6 | 5×1000 | `cinque-x-mille` | rifatta | Box dedicato: CF grande + copia, 3 passi, link rendiconto `/trasparenza/` |
| 7 | Dona | `dona` | **nuova** | Due schede: Bonifico · Carta. Nota su donazione mensile (bonifico periodico) e detraibilità |
| 8 | Galleria · Partner · Stampa | invariati | spostati | Prova di credibilità dopo le CTA |
| 9 | FAQ | `faq` | rivista | Aggiunta domanda su carta/Mollie; testi al tono nuovo |
| 10 | Newsletter | `newsletter` | **nuova** | Form Mailchimp: email + consenso privacy |
| 11 | Footer | — | aggiornato | Link Trasparenza, El Bloqueo, social, privacy |

Nav: Perché l'educazione · Progetti · Impatto · Trasparenza · [Dona] (CTA porta a `#cinque-x-mille`
nel periodo apr–ott, altrimenti `#dona`; per ora fissa a `#cinque-x-mille`).

## Contenuti nuovi

### Perché l'educazione (bozza temi, testi finali in implementazione)
- L'educazione è un diritto ancora da conquistare in molte zone rurali del Petén.
- "L'educazione è l'unico ingrediente in grado di innescare uno sviluppo sostenibile" (frase
  già nostra, dai post 2022).
- Competenze, non solo scuola: docenti formati (Ciclo de Conversatorios CUDEP: valutazione,
  classi eterogenee, apprendimento cooperativo, pensiero computazionale), educazione climatica
  per ragazzi 13–17, formazione agricola.
- 2–3 dati di contesto con fonte primaria (UNESCO UIS / dati ufficiali Guatemala). Nessun
  dato senza link verificato; se non si trova una fonte, il dato non entra.

### El Bloqueo (box "Progetti che sosteniamo")
Progetto indipendente che Comparte sostiene (mai "di Comparte"): sito trilingue che spiega il bloqueo statunitense contro Cuba
con fonti verificabili e un atlante della solidarietà cubana (missioni mediche ed educative).
Collegamento con la nostra storia: Comparte Cinema nasce con l'ICAIC cubano. CTA "Leggi El Bloqueo ↗".
Tono descrittivo, non militante. JSON-LD: niente `Project` di Comparte; eventuale `sponsor`/`funder` inverso solo se corretto semanticamente, altrimenti nessuno.

### Dona
- **Bonifico:** Banca Etica, IBAN IT27J0501803200000016738783, intestato Comparte Onlus, bottone copia.
  Causale suggerita. Per donare ogni mese: istruzioni bonifico periodico dalla propria banca.
- **Carta:** bottone "Dona con carta" → Payment Link Mollie (nuova scheda). Importo libero.
- Nota detraibilità: testo attuale, da riverificare (vedi APERTO-01).

### Newsletter
Form Mailchimp embed (POST verso l'`action` del form), campo email con `label` visibile,
checkbox consenso con link privacy, honeypot anti-bot di Mailchimp. Nessun JS di terze parti
caricato finché l'utente non invia.

## Design system

- Font: Plus Jakarta Sans 400/500/700 da Google Fonts, `display=swap`, un solo file variabile.
- Palette attuale mantenuta (arancione, rosa, blu, crema): è riconoscibile e già WCAG-verificata.
- Regole ui-ux-pro-max applicate: una CTA primaria per schermata, contrasto ≥ 4.5:1, focus
  visibili, target ≥ 44px, `prefers-reduced-motion`, icone SVG (via le emoji 🇮🇹 🇬🇹 e ✓ strutturali),
  larghezza testo 60–75 caratteri, immagini con `width`/`height`.

## Cambi tecnici

- `index.html`: riordino e nuove sezioni; JSON-LD aggiornato (DonateAction con IBAN, FAQ nuova,
  denominazione ETS al posto di ONLUS).
- `assets/css/style.css`: token font, stili sezioni nuove, rimozione stili morti.
- `assets/js/main.js`: bottone copia generalizzato (CF + IBAN) con `data-copy`; nessuna libreria.
- Bottone carta e form newsletter: markup e stili pronti con attributi `data-mollie-link` e
  `data-mailchimp-action` vuoti e stato "in arrivo" (niente link rotti). Il collegamento reale
  lo fa Codex: vedi `docs/codex/2026-09-26-mollie-mailchimp.md`.
- `llms.txt`, `sitemap.xml`: aggiornati se cambiano contenuti chiave.
- ES/EN: fase 2, stessa struttura, dopo approvazione IT.

## Verifica

- Lighthouse mobile IT prima/dopo, output raw.
- Validazione HTML (nessun errore) e JSON-LD (parse OK).
- Controllo manuale a 375 / 768 / 1440 px, tastiera, dark mode del sistema (il sito è light-only: verificare che non si rompa).
- Link check interno ed esterno (inclusi elbloqueo.it, Mollie, Mailchimp quando presenti).
- `verificatore` indipendente prima del merge.

## Fuori scope

Donazioni ricorrenti con carta (richiedono server), pagina `/dona/` separata, migrazione a
framework, nuove foto, contenuti ES/EN nella fase 1.

## Aperti

- **[APERTO-01]** Denominazione legale esatta dopo l'iscrizione RUNTS (es. "Comparte ETS",
  "Comparte ODV", "Comparte APS"?) e sezione RUNTS. Blocca solo nome in testi/meta/JSON-LD e la
  dicitura 5×1000; il resto procede con segnaposto `{{DENOMINAZIONE}}` sostituito in un solo passo.
- Mollie e Mailchimp: fuori da questo lavoro, delegati a Codex (doc separato).
- Instagram fermo al 2022: confermato, nessun materiale più recente. Si usano post 2022 + fonti pubbliche.
