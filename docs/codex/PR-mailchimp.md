# Draft: Mailchimp — preparazione e ancore privacy

Commit implementazione: `a6739db4c7bc719df9372ba6cd167cf7487627aa`.
Base: `feat/mollie-payment-link` (`10353a2446de2032fe11739b9cd17dce53b972f4`). Branch: `feat/mailchimp-form`.
PR dipendente da Mollie: usare quest’ultimo branch come base finché Andrea non lo integra.

**TASK 2 FERMO AL PASSO 1. NON PRONTA PER IL MERGE.** Mancano action, honeypot, conferma doppio opt-in e tag lingua/eventuale assenza. Mancano anche i testi privacy approvati. Nessun account, login, invio di email o iscrizione eseguiti.

Form predisposti con validazione HTML nativa, post in nuova scheda e noopener; input e submit disabilitati. Honeypot senza nome inventato, nascosto con CSS dedicato. Nessuno script esterno aggiunto. Ancore privacy locali nelle tre lingue; consenso ES corretto a #privacidad. Solo segnaposto: nessuna informativa scritta.

Il check in attesa viene sostituito dal check collegato, che resta FAIL finché i dati mancano. Il nuovo check ancora privacy è rosso su main e verde qui. Il FAIL Mollie è ereditato dal branch base. Nessun altro gate indebolito; nessun dato fittizio per ottenere verde.

## Screenshot finali, Chromium locale

![it newsletter](https://raw.githubusercontent.com/queondache/comparte-website/a6739db4c7bc719df9372ba6cd167cf7487627aa/docs/codex/evidence/mailchimp/it-newsletter.png)

![it privacy](https://raw.githubusercontent.com/queondache/comparte-website/a6739db4c7bc719df9372ba6cd167cf7487627aa/docs/codex/evidence/mailchimp/it-privacy.png)

![es newsletter](https://raw.githubusercontent.com/queondache/comparte-website/a6739db4c7bc719df9372ba6cd167cf7487627aa/docs/codex/evidence/mailchimp/es-newsletter.png)

![es privacy](https://raw.githubusercontent.com/queondache/comparte-website/a6739db4c7bc719df9372ba6cd167cf7487627aa/docs/codex/evidence/mailchimp/es-privacy.png)

![en newsletter](https://raw.githubusercontent.com/queondache/comparte-website/a6739db4c7bc719df9372ba6cd167cf7487627aa/docs/codex/evidence/mailchimp/en-newsletter.png)

![en privacy](https://raw.githubusercontent.com/queondache/comparte-website/a6739db4c7bc719df9372ba6cd167cf7487627aa/docs/codex/evidence/mailchimp/en-privacy.png)

## Comandi e output raw

### main-red.txt

```text
BASE bd7b449ec84fa50aa1817866272d6e41d30dd697
Updated oracle against unmodified main archive. Includes inherited Mollie checks.

$ python3 scripts/check_home.py --lang it
PASS html lang corretto
PASS ordine sezioni
PASS direttivo dentro chi-siamo (niente section propria)
PASS font Plus Jakarta Sans caricato
PASS Fraunces/Instrument rimossi
PASS nessuna 'ONLUS' nel file
PASS nessun segnaposto denominazione
PASS niente gergo ONG
PASS link elbloqueo.it
PASS El Bloqueo come progetto sostenuto
PASS El Bloqueo non 'nostro progetto'
PASS CF presente come testo
PASS IBAN presente come testo
PASS bottone copia CF
PASS bottone copia IBAN
FAIL link carta Mollie
FAIL pagina grazie presente
FAIL pagina grazie noindex e lingua corretta
FAIL pagina grazie canonical e hreflang reciproci
FAIL form Mailchimp collegato
FAIL ancora privacy esistente
PASS campo email con label
PASS consenso privacy obbligatorio
PASS educazione: >=2 fonti esterne
PASS img con width e height
PASS nessuna emoji bandiera/check strutturale
PASS reduced-motion nel CSS
PASS JSON-LD tutti parse OK
PASS JSON-LD senza Project El Bloqueo
PASS section bilanciate
PASS id univoci
PASS un solo box sosteniamo

26/32 check passati
EXIT 1

$ python3 scripts/check_home.py --lang es
PASS html lang corretto
PASS ordine sezioni
PASS direttivo dentro chi-siamo (niente section propria)
PASS font Plus Jakarta Sans caricato
PASS Fraunces/Instrument rimossi
PASS nessuna 'ONLUS' nel file
PASS nessun segnaposto denominazione
PASS niente gergo ONG
PASS link elbloqueo.it
PASS El Bloqueo come progetto sostenuto
PASS El Bloqueo non 'nostro progetto'
PASS CF presente come testo
PASS IBAN presente come testo
PASS bottone copia CF
PASS bottone copia IBAN
FAIL link carta Mollie
FAIL pagina grazie presente
FAIL pagina grazie noindex e lingua corretta
FAIL pagina grazie canonical e hreflang reciproci
FAIL form Mailchimp collegato
FAIL ancora privacy esistente
PASS campo email con label
PASS consenso privacy obbligatorio
PASS educazione: >=2 fonti esterne
PASS img con width e height
PASS nessuna emoji bandiera/check strutturale
PASS reduced-motion nel CSS
PASS JSON-LD tutti parse OK
PASS JSON-LD senza Project El Bloqueo
PASS section bilanciate
PASS id univoci
PASS un solo box sosteniamo
PASS CTA primaria hero verso donazione
PASS link al 5×1000 italiano
PASS box 5×1000 presente

29/35 check passati
EXIT 1

$ python3 scripts/check_home.py --lang en
PASS html lang corretto
PASS ordine sezioni
PASS direttivo dentro chi-siamo (niente section propria)
PASS font Plus Jakarta Sans caricato
PASS Fraunces/Instrument rimossi
PASS nessuna 'ONLUS' nel file
PASS nessun segnaposto denominazione
PASS niente gergo ONG
PASS link elbloqueo.it
PASS El Bloqueo come progetto sostenuto
PASS El Bloqueo non 'nostro progetto'
PASS CF presente come testo
PASS IBAN presente come testo
PASS bottone copia CF
PASS bottone copia IBAN
FAIL link carta Mollie
FAIL pagina grazie presente
FAIL pagina grazie noindex e lingua corretta
FAIL pagina grazie canonical e hreflang reciproci
FAIL form Mailchimp collegato
FAIL ancora privacy esistente
PASS campo email con label
PASS consenso privacy obbligatorio
PASS educazione: >=2 fonti esterne
PASS img con width e height
PASS nessuna emoji bandiera/check strutturale
PASS reduced-motion nel CSS
PASS JSON-LD tutti parse OK
PASS JSON-LD senza Project El Bloqueo
PASS section bilanciate
PASS id univoci
PASS un solo box sosteniamo
PASS CTA primaria hero verso donazione
PASS link al 5×1000 italiano
PASS box 5×1000 presente

29/35 check passati
EXIT 1

```

### prepared.txt

```text
$ python3 scripts/check_home.py --lang it
PASS html lang corretto
PASS ordine sezioni
PASS direttivo dentro chi-siamo (niente section propria)
PASS font Plus Jakarta Sans caricato
PASS Fraunces/Instrument rimossi
PASS nessuna 'ONLUS' nel file
PASS nessun segnaposto denominazione
PASS niente gergo ONG
PASS link elbloqueo.it
PASS El Bloqueo come progetto sostenuto
PASS El Bloqueo non 'nostro progetto'
PASS CF presente come testo
PASS IBAN presente come testo
PASS bottone copia CF
PASS bottone copia IBAN
FAIL link carta Mollie
PASS pagina grazie presente
PASS pagina grazie noindex e lingua corretta
PASS pagina grazie canonical e hreflang reciproci
FAIL form Mailchimp collegato
PASS ancora privacy esistente
PASS campo email con label
PASS consenso privacy obbligatorio
PASS educazione: >=2 fonti esterne
PASS img con width e height
PASS nessuna emoji bandiera/check strutturale
PASS reduced-motion nel CSS
PASS JSON-LD tutti parse OK
PASS JSON-LD senza Project El Bloqueo
PASS section bilanciate
PASS id univoci
PASS un solo box sosteniamo

30/32 check passati
EXIT 1

$ python3 scripts/check_home.py --lang es
PASS html lang corretto
PASS ordine sezioni
PASS direttivo dentro chi-siamo (niente section propria)
PASS font Plus Jakarta Sans caricato
PASS Fraunces/Instrument rimossi
PASS nessuna 'ONLUS' nel file
PASS nessun segnaposto denominazione
PASS niente gergo ONG
PASS link elbloqueo.it
PASS El Bloqueo come progetto sostenuto
PASS El Bloqueo non 'nostro progetto'
PASS CF presente come testo
PASS IBAN presente come testo
PASS bottone copia CF
PASS bottone copia IBAN
FAIL link carta Mollie
PASS pagina grazie presente
PASS pagina grazie noindex e lingua corretta
PASS pagina grazie canonical e hreflang reciproci
FAIL form Mailchimp collegato
PASS ancora privacy esistente
PASS campo email con label
PASS consenso privacy obbligatorio
PASS educazione: >=2 fonti esterne
PASS img con width e height
PASS nessuna emoji bandiera/check strutturale
PASS reduced-motion nel CSS
PASS JSON-LD tutti parse OK
PASS JSON-LD senza Project El Bloqueo
PASS section bilanciate
PASS id univoci
PASS un solo box sosteniamo
PASS CTA primaria hero verso donazione
PASS link al 5×1000 italiano
PASS box 5×1000 presente

33/35 check passati
EXIT 1

$ python3 scripts/check_home.py --lang en
PASS html lang corretto
PASS ordine sezioni
PASS direttivo dentro chi-siamo (niente section propria)
PASS font Plus Jakarta Sans caricato
PASS Fraunces/Instrument rimossi
PASS nessuna 'ONLUS' nel file
PASS nessun segnaposto denominazione
PASS niente gergo ONG
PASS link elbloqueo.it
PASS El Bloqueo come progetto sostenuto
PASS El Bloqueo non 'nostro progetto'
PASS CF presente come testo
PASS IBAN presente come testo
PASS bottone copia CF
PASS bottone copia IBAN
FAIL link carta Mollie
PASS pagina grazie presente
PASS pagina grazie noindex e lingua corretta
PASS pagina grazie canonical e hreflang reciproci
FAIL form Mailchimp collegato
PASS ancora privacy esistente
PASS campo email con label
PASS consenso privacy obbligatorio
PASS educazione: >=2 fonti esterne
PASS img con width e height
PASS nessuna emoji bandiera/check strutturale
PASS reduced-motion nel CSS
PASS JSON-LD tutti parse OK
PASS JSON-LD senza Project El Bloqueo
PASS section bilanciate
PASS id univoci
PASS un solo box sosteniamo
PASS CTA primaria hero verso donazione
PASS link al 5×1000 italiano
PASS box 5×1000 presente

33/35 check passati
EXIT 1

```

### static-checks.txt

```text
PASS .nojekyll presente
PASS pagine grazie fuori dalla sitemap
PASS index.html: nessuno script esterno
PASS index.html: id univoci
PASS index.html: email e consenso disabilitati
PASS index.html: submit disabilitato
PASS es/index.html: nessuno script esterno
PASS es/index.html: id univoci
PASS es/index.html: email e consenso disabilitati
PASS es/index.html: submit disabilitato
PASS en/index.html: nessuno script esterno
PASS en/index.html: id univoci
PASS en/index.html: email e consenso disabilitati
PASS en/index.html: submit disabilitato
PASS trasparenza/index.html: nessuno script esterno
PASS trasparenza/index.html: id univoci
PASS es/transparencia/index.html: nessuno script esterno
PASS es/transparencia/index.html: id univoci
PASS en/transparency/index.html: nessuno script esterno
PASS en/transparency/index.html: id univoci
$ git diff --check
EXIT 0

```

### screenshots-raw.txt

```text
{"route":"/#newsletter","output":"docs/codex/evidence/mailchimp/it-newsletter.png","title":"Comparte – Dona il 5×1000 all'educazione in Guatemala | CF 97977810585","section":"Resta in contatto\n\nPoche email all'anno: cosa facciamo, dove vanno i fondi, quando serve il tuo 5×1000.\n\nLa tua email\nAccetto di ricevere la newsletter e ho letto l'informativa privacy.\nIscriviti\n\nIscrizioni in arrivo. Intanto seguici su Instagram.","width":578,"scrollWidth":578}
{"route":"/trasparenza/#privacy","output":"docs/codex/evidence/mailchimp/it-privacy.png","title":"Trasparenza — Comparte | Bilanci, governance, 5×1000","section":"Informativa privacy\n\nSegnaposto: il testo legale per la newsletter deve ancora essere pubblicato. Le iscrizioni non sono attive.","width":504,"scrollWidth":504}
{"route":"/es/#boletin","output":"docs/codex/evidence/mailchimp/es-newsletter.png","title":"Comparte — Educación en Petén, Guatemala | Dona","section":"Mantente en contacto\n\nPocos correos al año: qué hacemos, a dónde van los fondos y cuándo puedes apoyar.\n\nTu correo electrónico\nAcepto recibir el boletín y he leído la política de privacidad.\nSuscríbete\n\nLas suscripciones estarán disponibles próximamente. Mientras tanto síguenos en Instagram.","width":619,"scrollWidth":619}
{"route":"/es/transparencia/#privacidad","output":"docs/codex/evidence/mailchimp/es-privacy.png","title":"Transparencia — Comparte | Documentos y gobernanza","section":"Política de privacidad\n\nSección pendiente: falta publicar el texto legal del boletín. Las suscripciones no están activas.","width":478,"scrollWidth":478}
{"route":"/en/#newsletter","output":"docs/codex/evidence/mailchimp/en-newsletter.png","title":"Comparte – Education in Guatemala | Donate","section":"Stay in touch\n\nA few emails a year: what we do, where funds go, and when the Italian 5×1000 matters.\n\nYour email\nI agree to receive the newsletter and have read the privacy notice.\nSubscribe\n\nSubscriptions are coming soon. Until then, follow us on Instagram.","width":594,"scrollWidth":594}
{"route":"/en/transparency/#privacy","output":"docs/codex/evidence/mailchimp/en-privacy.png","title":"Transparency — Comparte | Reports and governance","section":"Privacy notice\n\nPlaceholder: the legal text for the newsletter has not been published yet. Subscriptions are not active.","width":472,"scrollWidth":472}

```

Cattura finale riproducibile, server locale già avviato con `python3 -m http.server 8765 --bind 127.0.0.1`:

```sh
CHROMIUM_BINARY=/Users/andreapesce/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell node docs/codex/capture-preparation.mjs
```

Log network raw della preparazione disabilitata (da ripetere dopo action reale):

- [it: log Chromium originale](https://github.com/queondache/comparte-website/blob/a6739db4c7bc719df9372ba6cd167cf7487627aa/docs/codex/evidence/mailchimp/it-network.json)
- [es: log Chromium originale](https://github.com/queondache/comparte-website/blob/a6739db4c7bc719df9372ba6cd167cf7487627aa/docs/codex/evidence/mailchimp/es-network.json)
- [en: log Chromium originale](https://github.com/queondache/comparte-website/blob/a6739db4c7bc719df9372ba6cd167cf7487627aa/docs/codex/evidence/mailchimp/en-network.json)

[Comandi Chromium, output raw ed eventi URL](https://github.com/queondache/comparte-website/blob/a6739db4c7bc719df9372ba6cd167cf7487627aa/docs/codex/evidence/mailchimp/browser-raw.txt). Le catture CLI iniziali erano vuote; le immagini finali provengono dallo script CDP, dopo caricamento e scroll alla sezione.

```text
it: 87 URL events; Mailchimp URL events: 0
es: 87 URL events; Mailchimp URL events: 0
en: 43 URL events; Mailchimp URL events: 0
```

## Cosa resta ad Andrea

1. Da Audience → Signup forms → Embedded forms: URL action pubblico, nome honeypot, conferma doppio opt-in, tag lingua oppure conferma che non esiste.
2. Fornire il testo privacy approvato IT/ES/EN, con Mailchimp (Intuit, USA) e valutazione DPF/SCC come richiesto dal brief. I segnaposto non sono un’informativa.
3. Dopo il collegamento, iscrizione di prova con la propria email: verificare `pending`, confermare, verificare `subscribed`.
4. Rileggere e decidere il merge solo dopo completamento e review indipendente.

## Lavoro tecnico ancora da completare

Applicare i dati reali e i testi pronti in `docs/codex/mailchimp-activation.md`; abilitare il form dopo i testi privacy; dimostrare tutti i gate verdi, ripetere network log e misurare Lighthouse mobile. Nessuna misurazione Lighthouse né review indipendente effettuata in questa preparazione.

Pubblicazione PR non eseguita: la revisione automatica delle autorizzazioni ha rifiutato `gh pr list` con «approval required by policy, but AskForApproval is set to Never». Nessun push o merge effettuato.
