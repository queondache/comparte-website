# CLAUDE.md — Sito Comparte Onlus

## Identità progetto

Sito istituzionale Comparte Onlus (CF 97977810585), ONLUS italo-guatemalteca attiva nel Petén dal 2018.
Stack: HTML statico + CSS + JS vanilla. Hosting: GitHub Pages (CNAME → www.comparte.it).
Branch principale: `main`. Branch lavoro SEO/GEO corrente: `seo-geo-optimization`.

## Obiettivo strategico (sessione corrente)

Aumentare raccolta 5x1000 5x via:
- (a) ranking organico Google IT/ES/EN
- (b) citazioni in risposte ChatGPT/Claude/Perplexity/Gemini su query "5x1000 ambiente/Guatemala/educazione", "ONG italiane in America Latina", "riforestazione + impatto sociale"

## Convenzioni progetto

- Lingue sito: IT (root) → ES (/es/) → EN (/en/). Trilingue completo.
- Identità visiva intoccabile senza richiesta esplicita: arancione #E8621A, rosa #D4547A, blu #1A4A6B, crema #F5EFE0, font Fraunces + Instrument Sans.
- Non toccare contenuto narrativo/visivo esistente senza chiedere.
- Codice fiscale 97977810585 sempre cristallino: 5x1000 page, footer, FAQ, JSON-LD.
- Ogni claim statistico DEVE avere fonte verificabile (anche solo "fonte: Comparte 2024" per dati interni).
- IBAN IT27J0501803200000016738783 pubblico, va in llms.txt come testo (non in schema).
- IT è canonico. ES + EN sono fork manuali → ogni cambio post-freeze va replicato.

## Pipeline traduzione (obbligatoria)

Ogni testo IT → EN/ES passa per humanizer (`~/Dev/Marketing/Trend scraping/humanizer.py`).
Se humanizer matcha pattern AI → riscrivere fino a clean.
Spot check manuale: "lo direi così a voce?" / "una persona di una ONLUS direbbe questo?".
Log iterazioni in `translation-log.md`. Regole estratte in `translation-style-rules.md`.

## Tono per lingua

- IT: italiano corrente, voce Comparte (non motivazionale americano).
- EN: istituzionale ma vivo, fattuale, no enthusiasm cliché.
- ES: latinoamericano neutro, no españolismi peninsulari ("disfrutar de", "a través de").

## Cosa NON tradurre

- "5x1000" (istituto fiscale italiano) → mantieni + 1 frase di spiegazione
- Nomi propri (Comparte, zeroCO2, Petén, USAC, CUDEP, LUMSA, Scholas Occurrentes, INAB, MARN, Nuevo Horizonte, comparte Comunidad/Universidad/Educación/Cinema)
- CF, IBAN, ragione sociale italiana

## Partner canonici (fonte: HTML attuale)

USAC, LUMSA, Scholas Occurrentes (Pontificia), INAB (GovernmentOrganization), MARN (GovernmentOrganization), zeroCO2, 1Caffè (donation platform), European Schoolnet.
CUDEP = location di Comparte Universidad. Universidad Católica de Valencia = collab Comparte Universidad. Nessuno dei due è partner generale.

## Direttivo

- Andrea Pesce — Presidente. Co-fondatore Comparte e CEO zeroCO2.
- Irene Culcasi — Vicepresidente. Pedagogista, ricercatrice service-learning.
- Virgilio Galicia Gregorio — Liaison Guatemala. Referente comunità indigene Petén.

## Branch policy (delegata da Andrea)

Branch `seo-geo-optimization` → commit semantici autonomi + push autonomi OK.
PR verso `main` SOLO dopo approvazione esplicita changelog finale.

## File di stato

- `progress.md` — log sessioni
- `tasks.md` — pianificazione fasi
- `lessons.md` — pattern/lezioni riusabili
- `seo-geo-audit.md` — output Fase 0
- `translation-style-rules.md` — Fase 1.5
- `translation-log.md` — Fase 2
- `seo-geo-changelog.md` — output Fase 3
