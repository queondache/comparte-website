# Brief Codex — donazioni con carta (Mollie) e newsletter (Mailchimp)

**Repo:** `queondache/comparte-website` · **Sito:** https://www.comparte.it (GitHub Pages, statico, nessuna build)
**Committente:** Andrea Pesce · **Data:** 2026-09-26
**Spec di riferimento:** `docs/superpowers/specs/2026-09-26-restyle-home-design.md`

## Contesto

Comparte è un ente del Terzo settore iscritto al RUNTS che lavora sull'educazione nel Petén, in Guatemala.
La home viene rifatta da Claude Code in un lavoro separato. Quel lavoro prepara già:
- una sezione `#dona` con la scheda "Carta" e un bottone `data-mollie-link=""` in stato "in arrivo";
- una sezione `#newsletter` con un form `data-mailchimp-action=""` in stato "in arrivo".

A Codex spetta collegarli ai servizi reali. **Prima di iniziare**, aspetta che la PR del restyle IT
sia mergiata su `main` e parti da lì.

## Vincoli non negoziabili

1. **Pagamenti solo con un provider UE: Mollie.** Niente PayPal, niente Stripe, niente provider USA.
2. Il sito è statico su GitHub Pages: niente server, niente funzioni serverless, niente chiavi API nel codice.
   Si usano solo il **Payment Link** Mollie (URL pubblico) e l'**embedded form** Mailchimp (URL `action` pubblico).
3. Nessuno script di terze parti deve caricarsi al primo accesso alla pagina. Mailchimp riceve dati
   solo quando l'utente invia il form.
4. Codex non crea account, non fa login e non accetta condizioni al posto di Andrea. Se serve un
   account, si ferma e lascia le istruzioni ad Andrea (vedi § Cosa fa Andrea).
5. Non aumentare piani, crediti o spese su nessuna piattaforma.
6. Lighthouse mobile della home IT non deve peggiorare: Perf ≥ 90, A11y ≥ 95, SEO 100.

## Task 1 — Mollie Payment Link

**Obiettivo:** il bottone "Dona con carta" apre una pagina di pagamento Mollie con importo scelto dal donatore.

1. Andrea crea il Payment Link nella dashboard Mollie con queste impostazioni:
   - importo variabile, a scelta del donatore, con minimo 5 €;
   - descrizione "Donazione a Comparte";
   - redirect a `https://www.comparte.it/grazie/`.
2. Metti l'URL del link in `data-mollie-link` (home IT, poi ES/EN) e togli lo stato "in arrivo".
   Il link si apre in una nuova scheda con `rel="noopener"`.
3. Crea `grazie/index.html` (IT) e le versioni `es/gracias/` ed `en/thank-you/`:
   - messaggio di ringraziamento e link alla trasparenza;
   - `noindex`;
   - canonical e hreflang reciproci.
4. Aggiungi l'FAQ "Posso donare con carta?" (Mollie, provider europeo, dati della carta mai sul nostro sito)
   sia nell'HTML sia nel JSON-LD `FAQPage`.
5. Aggiorna il JSON-LD `DonateAction` con un `target` che punta al Payment Link.

**Accettazione:**
- clic sul bottone → la pagina Mollie si apre (verificato su URL reale, screenshot);
- nessun link rotto (link check con output raw);
- JSON-LD passa il parse senza errori.

## Task 2 — Mailchimp embedded form

**Obiettivo:** iscrizione alla newsletter con doppio opt-in, conforme GDPR.

1. Andrea, da Mailchimp → Audience → Signup forms → Embedded forms, ricava:
   - l'URL `action` (`https://<dc>.list-manage.com/subscribe/post?u=...&id=...`);
   - il nome del campo honeypot (`b_<u>_<id>`).
2. Metti `action` in `data-mailchimp-action` e scegli come inviare il form:
   - **(consigliato)** `method="post"` con `target="_blank"`: nessun JS di Mailchimp, conferma su pagina Mailchimp;
   - in alternativa, la variante JSONP `post-json` con messaggio inline e `aria-live="polite"`. Solo se non aggiunge librerie.
3. Il form ha:
   - campo `EMAIL` con `label` visibile, `type="email"` e `autocomplete="email"`;
   - checkbox di consenso obbligatoria con link alla privacy;
   - campo honeypot nascosto con `aria-hidden`;
   - campo lingua (merge field `LANG` = it/es/en) se la lista lo prevede.
4. Controlla che nella lista Mailchimp il **doppio opt-in sia attivo** (lo verifica Andrea, Codex lo scrive nel report).
5. Aggiungi le versioni ES/EN del form, con testi tradotti.
6. Informativa privacy: se il sito non ha una pagina privacy che nomini Mailchimp (Intuit, USA, SCC/DPF),
   **non** scriverla da zero. Segnalalo ad Andrea come blocco legale.

**Accettazione:**
- un invio di test con un'email di Andrea arriva nella lista in stato "pending", poi "subscribed" dopo la conferma;
- nessuna richiesta verso domini Mailchimp al caricamento della pagina (network log raw);
- validazione HTML senza errori.

## Cosa fa Andrea (Codex non può farlo)

- Aprire o verificare l'account **Mollie business** intestato all'ente (documenti RUNTS, IBAN Banca Etica) e creare il Payment Link.
- Recuperare da Mailchimp l'URL `action`, attivare il doppio opt-in e confermare l'email di test.
- Confermare il testo dell'informativa privacy su Mailchimp.

## Consegna

- Una PR per task: `feat/mollie-payment-link` e `feat/mailchimp-form`.
- Nel corpo della PR: hash del commit, comandi eseguiti con output raw, screenshot.
- Verifica indipendente (`verificatore`) prima del merge.
- Tier 2, perché tocca pagamenti: **nessun merge automatico**, attende Andrea.
