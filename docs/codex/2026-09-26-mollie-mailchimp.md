# Brief Codex: carta con Mollie e newsletter con Mailchimp

**Repo:** `queondache/comparte-website` · **Sito:** https://www.comparte.it (GitHub Pages, HTML statico, `.nojekyll`, nessuna build)
**Committente:** Andrea Pesce · **Aggiornato:** 2026-09-26, dopo il merge dei restyle IT, ES ed EN (PR #3, #4, #5)

## Contesto

Comparte è un'associazione iscritta al RUNTS che fa educazione nel Petén, in Guatemala. Le home IT, ES ed EN sono già online e contengono i segnaposto da collegare.

| Pagina | Bottone carta (oggi inattivo) | Form newsletter (oggi inattivo) |
|---|---|---|
| `index.html` (IT) | `button[data-mollie-link=""]` in `#dona` | `form.nl-form[data-mailchimp-action=""]` in `#newsletter` |
| `es/index.html` | idem, in `#dona` | idem, in `#boletin` |
| `en/index.html` | idem, in `#donate` | idem, in `#newsletter` |

Accanto a ciascun elemento c'è un testo di aiuto "in arrivo" (`#card-soon`, `#nl-soon`) da aggiornare.

## Dati forniti da Andrea

- **Mollie Payment Link:** `MOLLIE_PAYMENT_LINK` → vedi la richiesta di Andrea (è l'unico valore da incollare). L'account Mollie esiste già.
- **Mailchimp:** Codex NON ha accesso all'account. Serve l'URL `action` del form embedded (vedi Task 2, passo 1).

## Vincoli non negoziabili

1. Pagamenti solo con Mollie (UE). Niente PayPal, Stripe o altri provider USA.
2. Sito statico: niente server, funzioni o chiavi API. Solo il Payment Link pubblico e l'URL `action` pubblico del form.
3. Nessuno script di terze parti al caricamento della pagina. I dati arrivano a Mailchimp solo quando l'utente invia il form.
4. Codex non crea account, non fa login e non accetta condizioni. Se gli serve qualcosa dietro login, si ferma e scrive ad Andrea cosa fare.
5. Nessun aumento di piani, crediti o spese.
6. **L'oracolo va aggiornato, non aggirato.** `scripts/check_home.py --lang it|es|en` oggi controlla che il bottone e il form siano in attesa (`data-mollie-link=""`, `data-mailchimp-action=""`). Codex sostituisce QUEI check con quelli del "collegato" (vedi sotto). Deve dimostrare che i nuovi check sono rossi sul `main` attuale e verdi dopo. Niente entity HTML, niente encoding, nessun altro check indebolito.
7. Lighthouse mobile non deve peggiorare. Riferimenti attuali: IT 95/96/100/100, ES 100/96/96/100, EN 96/96/100/100.
8. I testi rispettano il tono del sito: IT "tu", ES "tú", EN "you", frasi brevi.

## Task 1: Mollie (carta)

1. In tutte e 3 le home il bottone diventa un link:
   `<a class="btn-primary" href="MOLLIE_PAYMENT_LINK" target="_blank" rel="noopener">…</a>`, con testo "Dona con carta" / "Dona con tarjeta" / "Donate by card" e un `<span class="visually-hidden">` "(si apre in una nuova scheda)" nella lingua della pagina.
2. Il testo di aiuto `#card-soon` diventa: pagamento sicuro con Mollie, provider europeo; i dati della carta non passano dal nostro sito.
3. Crea 3 pagine di ringraziamento:
   - `grazie/index.html`, `es/gracias/index.html`, `en/thank-you/index.html`;
   - stesso header, footer e CSS del sito; `noindex`; canonical e hreflang reciproci fra le 3;
   - un messaggio breve e un link alla pagina di trasparenza nella stessa lingua.
   NON vanno aggiunte alla `sitemap.xml`. In Mollie il redirect del Payment Link si imposta su `https://www.comparte.it/grazie/`: Andrea lo fa dalla dashboard se non l'ha già fatto (scrivilo nel report).
4. FAQ "Posso donare con carta?" nelle 3 lingue: la risposta passa da "presto" a "sì, con Mollie". Aggiorna anche il JSON-LD `FAQPage`.
5. JSON-LD `DonateAction`: aggiungi `target` con `urlTemplate` = Payment Link.
6. Oracolo: sostituisci il check "bottone carta in attesa Mollie" con "link carta Mollie": un `<a>` con `href` che inizia con `https://payment-links.mollie.com/` e `rel` che contiene `noopener`. Poi aggiungi un check "pagina grazie presente", sulla lingua.

**Accettazione:**
- `python3 scripts/check_home.py --lang it|es|en` → tutti PASS;
- i nuovi check sono rossi su `main` prima del lavoro (output raw);
- il link apre la pagina Mollie (verificato con curl `-I` o nel browser, screenshot);
- le 3 pagine grazie rispondono 200 in locale.

## Task 2: Mailchimp (newsletter)

1. **Blocco da Andrea (fermati qui se manca):** servono da Mailchimp, Audience → Signup forms → Embedded forms:
   - l'URL `action` (`https://<dc>.list-manage.com/subscribe/post?u=…&id=…`);
   - il nome del campo honeypot (`b_<u>_<id>`);
   - la conferma che il **doppio opt-in** è attivo;
   - se la lista ha un campo lingua, il suo tag (per esempio `LANG` o `MMERGE…`).
   Scrivi ad Andrea la richiesta esatta, con questi 4 punti, e prepara il resto intanto.
2. Nei 3 form:
   - `action` = URL del form;
   - `method="post"`, `target="_blank"`, `rel="noopener"`, niente JS di Mailchimp;
   - campo `EMAIL` con la label che c'è già;
   - honeypot nascosto (`aria-hidden="true"`, `tabindex="-1"`);
   - campo lingua nascosto (`it`/`es`/`en`) se la lista lo prevede;
   - togli `disabled` dal submit e aggiorna il testo `#nl-soon` (arriva un'email di conferma).
3. **Privacy:** il consenso punta a `/trasparenza/#privacy`, che NON esiste. Non scrivere un'informativa privacy (è un testo legale). Crea in `trasparenza/index.html` (e nelle versioni ES/EN, `#privacidad` e `#privacy`) solo una sezione segnaposto chiaramente marcata, con l'`id` giusto, e segnala ad Andrea nel report che serve il testo legale, con la menzione di Mailchimp (Intuit, USA, DPF/SCC). Allinea gli href dei consensi ES/EN alla loro pagina di trasparenza.
4. Oracolo: sostituisci "form newsletter in attesa Mailchimp" con "form Mailchimp collegato" (`action` che corrisponde a `^https://[a-z0-9]+\.list-manage\.com/subscribe/post\?u=`, submit non disabilitato, honeypot presente). Aggiungi "ancora privacy esistente" (l'href del consenso punta a un id che esiste nella pagina di trasparenza della stessa lingua).

**Accettazione:**
- oracolo tutto PASS nelle 3 lingue, con prova di rosso;
- nessuna richiesta a domini Mailchimp al caricamento (network log raw);
- iscrizione di prova fatta da Andrea con la sua email: stato "pending", poi "subscribed" dopo la conferma (lo esegue e lo conferma Andrea).

## Consegna

- Una PR per task: `feat/mollie-payment-link` (può partire subito) e `feat/mailchimp-form` (prepara tutto e si ferma al passo 1 se manca l'URL).
- Nel corpo della PR: hash, comandi con output raw, screenshot, elenco di cosa resta ad Andrea.
- Verifica indipendente prima del merge. Pagamenti = area sensibile: **nessun merge automatico**, la PR attende Andrea.

## Lezioni dai lavori precedenti (leggere)

- I builder precedenti hanno aggirato i gate: handle `comparteonlus` scritto come `comparte%6Fnlu%73`, `ETS` scritto come `E&#84;S`, regex scritta in modo da passare sempre. Questi aggiramenti sono stati trovati in review e hanno fatto bocciare la consegna.
- GitHub Pages: `.nojekyll` deve restare nella radice del repo.
- Traduzioni: nessuna parola italiana nelle pagine ES/EN; hreflang identici a quelli delle home esistenti.
