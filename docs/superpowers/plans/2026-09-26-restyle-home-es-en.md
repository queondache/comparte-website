# Restyle home ES/EN — piano di implementazione (fase 2)

> **Per chi esegue:** sottoskill richiesta: superpowers:subagent-driven-development (dentro l'orchestratore). I passi usano checkbox (`- [ ]`).

**Obiettivo:** portare `es/` ed `en/` alla struttura della home IT già online (merge 2c3e01f), tradotta e adattata al pubblico estero. La donazione viene prima del 5×1000.

**Architettura:** sito statico, nessuna build. Il CSS è già condiviso (`assets/css/style.css`) e non cambia. `assets/js/main.js` diventa multilingua in base a `<html lang>`. L'oracolo `scripts/check_home.py` diventa parametrico con `--lang it|es|en`.

**Stack:** HTML, CSS, JS vanilla, Python 3 stdlib.

**Spec:** `docs/superpowers/specs/2026-09-26-restyle-home-design.md` (fase 2: "ES/EN dopo approvazione IT, stessa struttura") più le decisioni di Andrea del 2026-09-26 elencate sotto.

## Decisioni (Andrea, 2026-09-26)

- ES/EN: **prima la donazione**, poi il 5×1000. Nel hero e nella nav la CTA principale è "Dona" / "Donate" → `#dona` / `#donate`. Il 5×1000 è un box piccolo dentro la sezione dona ("¿Pagas impuestos en Italia?" / "Do you pay taxes in Italy?") con link a `https://www.comparte.it/#cinque-x-mille`.
- Denominazione "Comparte". Forma giuridica "Asociación" / "Association", formulazione generica. Mai "ONLUS".
- El Bloqueo: progetto sostenuto, mai "nostro". Link a `https://elbloqueo.it/es/` / `https://elbloqueo.it/en/`.
- Tono: ES con "tú" neutro latinoamericano (niente "vosotros"); EN con "you". Frasi brevi, niente gergo da ONG né marketing.
- Font, palette e CSS identici all'IT.

## Vincoli globali

- `index.html` (IT), `trasparenza/`, `llms.txt` IT e `assets/css/style.css` NON si toccano.
- Stessi dati della home IT: 3 dati World Bank con gli stessi link (49,29% 2024; 82,11% 2024; 9,7 2020); CF 97977810585; IBAN IT27J0501803200000016738783. Nessuna cifra nuova.
- Bottone carta `data-mollie-link=""` e form `data-mailchimp-action=""`, entrambi "in arrivo", come in IT.
- Canonical e hreflang reciproci invariati (it, es, en, x-default); `<html lang>` corretto.
- Niente entity HTML o encoding per aggirare i gate; non indebolire l'oracolo.
- Commenti nel codice in italiano, nomi in inglese.

## Ordine sezioni (id)

| # | IT (riferimento) | ES | EN |
|---|---|---|---|
| 1 | hero | hero | hero |
| 2 | perche-educazione | por-que-educacion | why-education |
| 3 | chi-siamo | quienes-somos | about |
| 4 | progetti | proyectos | projects |
| 5 | impatto | impacto | impact |
| 6 | cinque-x-mille | — (box dentro dona) | — (box dentro donate) |
| 7 | dona | dona | donate |
| 8 | galleria | galeria | gallery |
| 9 | partner | aliados | partners |
| 10 | press | prensa | press |
| 11 | faq | faq | faq |
| 12 | newsletter | boletin | newsletter |

Il box 5×1000 dentro dona/donate ha `id="cinco-x-mil"` (ES) / `id="five-x-thousand"` (EN).

## Punti da controllare in review

1. `main.js` su pagina ES/EN: i messaggi di copia sono in lingua ("Copiado" / "Seleccionado: cópialo"; "Copied" / "Selected: copy it"), niente italiano.
2. Il link al 5×1000 porta alla sezione IT giusta e non è la CTA principale.
3. Nessun testo italiano residuo nelle pagine ES/EN (per esempio "Copia il codice fiscale", "Iscriviti", "in arrivo").
4. Ancore interne della nav e del footer puntano a id esistenti nella stessa pagina.
5. La pagina di trasparenza ES/EN non ha più ONLUS e il suo og:image è assoluto.

---

### Task 7: Oracolo multilingua e JS i18n (contract-first, sequenziale)

**File:** `scripts/check_home.py`, `assets/js/main.js`.

**Interfacce prodotte:**
- `python3 scripts/check_home.py --lang it|es|en [path]` (default `it` e il path della lingua: `index.html`, `es/index.html`, `en/index.html`). Exit 0 se tutti i check passano.
- In `main.js`, i messaggi dei bottoni copia vengono da un dizionario sulla chiave `document.documentElement.lang`: `it` → Copiato / Seleziona e copia; `es` → Copiado / Seleccionado: cópialo; `en` → Copied / Selected: copy it. Default `it`.

- [ ] **Passo 1:** refactor di `check_home.py` con una tabella `LANGS` per lingua:
  - path;
  - ordine sezioni (tabella sopra);
  - regex del gergo per la lingua (IT attuale; ES `beneficiarios|empoderamiento|sinergia`; EN `beneficiaries|empower|synerg`);
  - regex "progetto sostenuto" (IT `progett\w* che sosteniamo`; ES `proyectos? que apoyamos`; EN `projects? we support`) e regex negativa "nostro" (ES `(nuestro proyecto|proyecto de comparte)[^.]{0,40}bloqueo`; EN `(our project|comparte's project)[^.]{0,40}bloqueo`);
  - prefisso del link El Bloqueo (IT `https://elbloqueo.it`; ES `https://elbloqueo.it/es/`; EN `https://elbloqueo.it/en/`);
  - sezione educazione (id per lingua);
  - per ES/EN: la CTA primaria del hero ha `href="#dona"` / `#donate`, esiste un link a `https://www.comparte.it/#cinque-x-mille` e esiste l'elemento con id del box 5×1000;
  - check `html lang` uguale alla lingua.
  Tutti gli altri check attuali restano identici per tutte le lingue (ONLUS con handle escluso, nessun `{{`, CF/IBAN testo e bottoni data-copy, Mollie, Mailchimp, label, consenso, img dim, emoji, reduced-motion, JSON-LD parse, niente Project El Bloqueo, section bilanciate, id univoci, un solo `aside.supported`, font esatto).
- [ ] **Passo 2 (prova di rosso):** `python3 scripts/check_home.py --lang it` → 27/27 exit 0, IT invariato. `--lang es` e `--lang en` sulle pagine attuali → exit 1 con molti FAIL. Output raw nel report.
- [ ] **Passo 3:** i18n in `main.js` come da interfaccia. Verifica con `node --check assets/js/main.js`.
- [ ] **Passo 4:** commit `test(T-7): oracolo multilingua e copia i18n`.

### Task 8: Home e trasparenza ES (parallelo a Task 9)

**File:** `es/index.html`, `es/transparencia/index.html`, `es/llms.txt`.

- [ ] **Passo 1:** ricostruisci `es/index.html` partendo dalla struttura di `index.html` IT, con gli id della tabella e la traduzione in spagnolo neutro con "tú". Mantieni i `<head>` specifici ES (canonical `/es/`, hreflang, og:locale `es_ES` o quello attuale).
  - hero e nav → `#dona`;
  - sezione `dona` con, in ordine: bonifico SEPA (IBAN + copia, intestatario "Comparte", BIC se presente nella pagina ES attuale), carta Mollie in arrivo, box `cinco-x-mil`;
  - FAQ e JSON-LD FAQPage in spagnolo, allineate tra loro;
  - JSON-LD `@graph` coerente con l'IT (name "Comparte", `inLanguage` "es").
- [ ] **Passo 2:** `es/transparencia/index.html`: ONLUS → "Comparte"; forma giuridica "Asociación"; og:image e twitter:image assoluti; grammatica corretta.
- [ ] **Passo 3:** `es/llms.txt` allineato alla home ES (sezioni nuove, El Bloqueo come proyecto que apoyamos, niente ONLUS).
- [ ] **Passo 4:** gate: `python3 scripts/check_home.py --lang es` → tutti PASS, exit 0; `grep -ci onlus` su es/** (escluso l'handle) → 0.
- [ ] **Passo 5:** commit per passo, `feat(T-8): …`.

### Task 9: Home e trasparenza EN (parallelo a Task 8)

Come il Task 8, ma in inglese:
- file `en/index.html`, `en/transparency/index.html`, `en/llms.txt`;
- id della tabella EN, CTA `#donate`, box `five-x-thousand`;
- forma giuridica "Association";
- El Bloqueo `https://elbloqueo.it/en/`, "projects we support";
- gate `--lang en`;
- commit `feat(T-9): …`.

## Esecuzione

- T-7 per primo (contract-first: tocca l'oracolo e `main.js`, condivisi).
- Poi T-8 ∥ T-9: glob disgiunti (`es/**` e `en/**`), prova di indipendenza scritta nel RUN.
- Review indipendente per ogni task. Una PR unica verso `main`, che resta in attesa della rilettura di Andrea (testi = prodotto).
- Verifica finale del controller: Lighthouse mobile su `/es/` e `/en/`, contrasti già garantiti dal CSS condiviso, screenshot a 375px.
