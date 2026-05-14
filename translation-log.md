# translation-log.md

Log iterazioni pipeline humanizer (`~/Dev/Marketing/Trend scraping/humanizer.py`) per testi prodotti durante Fase 2.

**Config (decisione Andrea):**
- Modello: `claude-sonnet-4-5`
- Batch: 500-800 token per call (per testi atomici brevi: una frase per call)
- Hard stop: >3 iterazioni → segnalare e migliorare prompt iniziale
- Override system prompt: `COMPARTE_VOICE` (no Andrea/zeroCO2 personality, focus ONLUS italo-guatemalteca)

---

## 2026-05-14 — Redesign /trasparenza/ (IT)

**Sorgente:** copy nuovo per redesign pagina trasparenza (claim 90% + 5 sezioni).
**Iterazioni:** 1 (sufficiente per tutti i testi).
**Costo stimato:** ~$0.22 (10 call × ~7000 token input con SKILL.md 27.7 KB + ~100 token output).

| Chiave | Char in | Char out | Changed | Pattern AI rimossi |
|---|---|---|---|---|
| hero_claim | 55 | 55 | no | 0 (già asciutto) |
| hero_sub | 99 | 78 | sì | "che possa continuare a" → ø (filler/copula avoidance) |
| fondi_intro | 72 | 72 | no | 0 |
| fondi_progetti_label | 16 | — | skipped | label troppo breve (3 parole) — humanizer ritorna garbage richiesta input. **Regola appresa:** skip humanizer per stringhe <5 parole. |
| fondi_progetti_desc | 140 | 140 | no | 0 |
| fondi_ops_label | 28 | — | skipped | come sopra |
| fondi_ops_desc | 84 | 84 | no | 0 |
| documenti_intro | 95 | 76 | sì | "Quando un documento è approvato, lo trovi qui" → "Qui trovi quelli approvati" (più diretto, meno verboso) |
| rendiconto_intro | 144 | 144 | no | 0 |
| cta_finale | 63 | 63 | no | 0 |

**Decisioni di stile applicate manualmente prima di humanizer (passaggio 0):**
- Rimosso "davvero" da hero_sub draft originale ("dove servono davvero" → "dove servono") — IT-2 avverbio sovrabbondante
- Tutto il copy già asciutto in input → humanizer passa attraverso, conferma qualità

**Regole apprese (per pipeline futura):**
1. Stringhe < 5 parole (label, badge) → skip humanizer, scrivere a mano applicando style rules
2. Testi già asciutti tendono a passare invariati (good signal: passaggio 0 manuale efficace)
3. Sonnet-4-5 con SKILL.md complete + COMPARTE_VOICE override produce edit conservative (asciuga, non riscrive)

---

## Future iterazioni

- /es/ build (step 10): traduzione italiana → spagnolo LATAM neutro, poi humanize ES
- /en/ build (step 11): traduzione → inglese istituzionale, poi humanize EN
- Eventuali nuovi micro-copy IT futuri (ad es. nuovi placeholder per bilanci pubblicati)
