# Draft: newsletter Infomaniak IT/ES/EN con caricamento esplicito

Commit implementazione: `c56dc71cd75a715984f5262ed7c728ac1e221c1e`. Branch `feat/mailchimp-form` (nome richiesto in origine, provider aggiornato a Infomaniak).
Base PR: `feat/mollie-payment-link` (`10353a2446de2032fe11739b9cd17dce53b972f4`). Nessun merge.

Le tre home avevano moduli disabilitati. Ora collegano moduli statici nelle rispettive lingue: il visitatore carica esplicitamente l'antispam, inserisce l'email e accetta l'informativa. Nessuno script Infomaniak al caricamento. Action, token pubblico, identificativi, honeypot e ALTCHA provengono dall'export reale; nessuna chiave API o backend. Le risposte del provider aprono nella pagina principale: il prototipo in iframe bloccava il redirect.

Moduli IT 26059, ES 26060, EN 26062, gruppi distinti e mittente Comparte. Email e pagine provider salvate con grafica Comparte. Testo privacy fornito da Andrea e revisione tracking autorizzata, tradotti nelle tre pagine di trasparenza. Nessun acquisto o cambiamento dei limiti di spesa; quota verificata 100 crediti mensili inclusi con kSuite.

**Bozza non pronta al merge:** restano conferma della ricezione della seconda prova e Lighthouse mobile. Il modulo IT definitivo è stato inviato con autorizzazione: risposta positiva e redirect alla pagina Comparte «Controlla la tua email» verificati in Chrome. La prova precedente ha verificato ricezione, conferma cliccata da Andrea e stato Attivo. Seconda prova autorizzata eseguita; consegna della nuova email non ancora confermata. Disiscrizione non collaudata.

L'oracolo nuovo fallisce su main e passa tutti i check newsletter sul branch. Totali: IT 34/35, ES 37/38, EN 37/38. Unico FAIL residuo per lingua: Payment Link Mollie assente, ereditato dalla base. Nessun altro check indebolito: label e consenso sono verificati nella pagina effettiva del modulo. `.nojekyll` conservato.

## Screenshot

![site-it-form.png](https://raw.githubusercontent.com/queondache/comparte-website/c56dc71cd75a715984f5262ed7c728ac1e221c1e/docs/codex/evidence/infomaniak/site-it-form.png)

![site-es-form.png](https://raw.githubusercontent.com/queondache/comparte-website/c56dc71cd75a715984f5262ed7c728ac1e221c1e/docs/codex/evidence/infomaniak/site-es-form.png)

![site-en-form.png](https://raw.githubusercontent.com/queondache/comparte-website/c56dc71cd75a715984f5262ed7c728ac1e221c1e/docs/codex/evidence/infomaniak/site-en-form.png)

![site-es-mobile.png](https://raw.githubusercontent.com/queondache/comparte-website/c56dc71cd75a715984f5262ed7c728ac1e221c1e/docs/codex/evidence/infomaniak/site-es-mobile.png)

![email-en-branded.png](https://raw.githubusercontent.com/queondache/comparte-website/c56dc71cd75a715984f5262ed7c728ac1e221c1e/docs/codex/evidence/infomaniak/email-en-branded.png)

## Comandi e output raw

### main-red.txt

```text
$ git rev-parse origin/main
bd7b449ec84fa50aa1817866272d6e41d30dd697
Working directory: /var/folders/kf/r5q8hsb118342zjbgj8kxb0h0000gn/T/comparte-main-oracle-xwhgw5sw
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
FAIL form Infomaniak collegato
FAIL newsletter: nessuno script esterno al caricamento
FAIL newsletter: antispam solo dopo attivazione
FAIL newsletter: lingua corretta
FAIL ancora privacy esistente
FAIL campo email con label
FAIL consenso privacy obbligatorio
PASS educazione: >=2 fonti esterne
PASS img con width e height
PASS nessuna emoji bandiera/check strutturale
PASS reduced-motion nel CSS
PASS JSON-LD tutti parse OK
PASS JSON-LD senza Project El Bloqueo
PASS section bilanciate
PASS id univoci
PASS un solo box sosteniamo

24/35 check passati


exit=1
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
FAIL form Infomaniak collegato
FAIL newsletter: nessuno script esterno al caricamento
FAIL newsletter: antispam solo dopo attivazione
FAIL newsletter: lingua corretta
FAIL ancora privacy esistente
FAIL campo email con label
FAIL consenso privacy obbligatorio
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

27/38 check passati


exit=1
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
FAIL form Infomaniak collegato
FAIL newsletter: nessuno script esterno al caricamento
FAIL newsletter: antispam solo dopo attivazione
FAIL newsletter: lingua corretta
FAIL ancora privacy esistente
FAIL campo email con label
FAIL consenso privacy obbligatorio
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

27/38 check passati


exit=1

```

### prepared-raw.txt

```text
$ git diff --check


exit=0
$ node --check assets/js/newsletter.js


exit=0
$ git ls-files .nojekyll
.nojekyll


exit=0
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
PASS form Infomaniak collegato
PASS newsletter: nessuno script esterno al caricamento
PASS newsletter: antispam solo dopo attivazione
PASS newsletter: lingua corretta
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

34/35 check passati


exit=1
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
PASS form Infomaniak collegato
PASS newsletter: nessuno script esterno al caricamento
PASS newsletter: antispam solo dopo attivazione
PASS newsletter: lingua corretta
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

37/38 check passati


exit=1
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
PASS form Infomaniak collegato
PASS newsletter: nessuno script esterno al caricamento
PASS newsletter: antispam solo dopo attivazione
PASS newsletter: lingua corretta
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

37/38 check passati


exit=1

```

### network-initial-raw.json

```text
[
{
  "path": "/",
  "viewport": 390,
  "scrollWidth": 578,
  "resources": [
    {
      "url": "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700&display=swap",
      "type": "link"
    },
    {
      "url": "http://localhost:8780/assets/css/style.css",
      "type": "link"
    },
    {
      "url": "http://localhost:8780/assets/img/hero/hero.webp",
      "type": "img"
    },
    {
      "url": "http://localhost:8780/assets/logo/comparte_logo_black.png",
      "type": "img"
    },
    {
      "url": "http://localhost:8780/assets/logo/comparte_spirale.png",
      "type": "img"
    },
    {
      "url": "http://localhost:8780/assets/js/main.js",
      "type": "script"
    },
    {
      "url": "http://localhost:8780/assets/img/galleria/01.webp",
      "type": "img"
    }
  ],
  "form": null
},
{
  "path": "/es/",
  "viewport": 390,
  "scrollWidth": 596,
  "resources": [
    {
      "url": "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700&display=swap",
      "type": "link"
    },
    {
      "url": "http://localhost:8780/assets/css/style.css",
      "type": "link"
    },
    {
      "url": "http://localhost:8780/assets/logo/comparte_logo_black.png",
      "type": "img"
    },
    {
      "url": "http://localhost:8780/assets/logo/comparte_spirale.png",
      "type": "img"
    },
    {
      "url": "http://localhost:8780/assets/js/main.js",
      "type": "script"
    },
    {
      "url": "http://localhost:8780/es/assets/img/hero/hero.webp",
      "type": "img"
    },
    {
      "url": "http://localhost:8780/assets/img/galleria/02.webp",
      "type": "img"
    },
    {
      "url": "http://localhost:8780/assets/img/galleria/03.webp",
      "type": "img"
    },
    {
      "url": "http://localhost:8780/assets/img/galleria/01.webp",
      "type": "img"
    },
    {
      "url": "http://localhost:8780/assets/img/galleria/04.webp",
      "type": "img"
    },
    {
      "url": "http://localhost:8780/assets/img/galleria/05.webp",
      "type": "img"
    },
    {
      "url": "http://localhost:8780/assets/img/galleria/06.webp",
      "type": "img"
    },
    {
      "url": "http://localhost:8780/assets/img/galleria/07.webp",
      "type": "img"
    },
    {
      "url": "http://localhost:8780/assets/img/galleria/08.webp",
      "type": "img"
    },
    {
      "url": "http://localhost:8780/assets/img/galleria/09.webp",
      "type": "img"
    },
    {
      "url": "http://localhost:8780/assets/img/galleria/11.webp",
      "type": "img"
    },
    {
      "url": "http://localhost:8780/assets/img/galleria/10.webp",
      "type": "img"
    }
  ],
  "form": null
},
{
  "path": "/en/",
  "viewport": 390,
  "scrollWidth": 568,
  "resources": [
    {
      "url": "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700&display=swap",
      "type": "link"
    },
    {
      "url": "http://localhost:8780/assets/css/style.css",
      "type": "link"
    },
    {
      "url": "http://localhost:8780/assets/logo/comparte_logo_black.png",
      "type": "img"
    },
    {
      "url": "http://localhost:8780/assets/logo/comparte_spirale.png",
      "type": "img"
    },
    {
      "url": "http://localhost:8780/assets/img/hero/hero.webp",
      "type": "img"
    },
    {
      "url": "http://localhost:8780/assets/js/main.js",
      "type": "script"
    }
  ],
  "form": null
},
{
  "path": "/newsletter/",
  "viewport": 390,
  "scrollWidth": 390,
  "resources": [
    {
      "url": "http://localhost:8780/assets/css/style.css",
      "type": "link"
    },
    {
      "url": "http://localhost:8780/assets/css/newsletter.css",
      "type": "link"
    },
    {
      "url": "http://localhost:8780/assets/js/newsletter.js",
      "type": "script"
    }
  ],
  "form": {
    "action": "https://newsletter.infomaniak.com/v3/api/1/newsletters/webforms/26059/submit",
    "target": "_self",
    "emailRequired": true,
    "consentRequired": true,
    "consentChecked": false,
    "emailMissing": true,
    "consentMissing": true
  }
},
{
  "path": "/es/newsletter/",
  "viewport": 390,
  "scrollWidth": 390,
  "resources": [
    {
      "url": "http://localhost:8780/assets/css/style.css",
      "type": "link"
    },
    {
      "url": "http://localhost:8780/assets/css/newsletter.css",
      "type": "link"
    },
    {
      "url": "http://localhost:8780/assets/js/newsletter.js",
      "type": "script"
    }
  ],
  "form": {
    "action": "https://newsletter.infomaniak.com/v3/api/1/newsletters/webforms/26060/submit",
    "target": "_self",
    "emailRequired": true,
    "consentRequired": true,
    "consentChecked": false,
    "emailMissing": true,
    "consentMissing": true
  }
},
{
  "path": "/en/newsletter/",
  "viewport": 390,
  "scrollWidth": 390,
  "resources": [
    {
      "url": "http://localhost:8780/assets/css/style.css",
      "type": "link"
    },
    {
      "url": "http://localhost:8780/assets/css/newsletter.css",
      "type": "link"
    },
    {
      "url": "http://localhost:8780/assets/js/newsletter.js",
      "type": "script"
    }
  ],
  "form": {
    "action": "https://newsletter.infomaniak.com/v3/api/1/newsletters/webforms/26062/submit",
    "target": "_self",
    "emailRequired": true,
    "consentRequired": true,
    "consentChecked": false,
    "emailMissing": true,
    "consentMissing": true
  }
}
]
```

### network-after-activation-es.json

```text
{
  "path": "/es/newsletter/",
  "viewport": 390,
  "scrollWidth": 390,
  "resources": [
    {
      "url": "http://localhost:8780/assets/css/newsletter.css",
      "type": "link"
    },
    {
      "url": "http://localhost:8780/assets/css/style.css",
      "type": "link"
    },
    {
      "url": "http://localhost:8780/assets/js/newsletter.js",
      "type": "script"
    },
    {
      "url": "https://newsletter.infomaniak.com/v3/static/mcaptcha/altcha.min.js?v=1790528400",
      "type": "script"
    },
    {
      "url": "https://newsletter.infomaniak.com/v3/static/mcaptcha/altcha-index.js?v=1790528400",
      "type": "script"
    },
    {
      "url": "https://newsletter.infomaniak.com/v3/static/webform_index.js?v=1790528400",
      "type": "script"
    },
    {
      "url": "https://newsletter.infomaniak.com/v3/static/jquery-1.12.4.min.js",
      "type": "script"
    }
  ],
  "form": {
    "action": "https://newsletter.infomaniak.com/v3/api/1/newsletters/webforms/26060/submit",
    "target": "_self",
    "emailRequired": true,
    "consentRequired": true,
    "consentChecked": false,
    "emailMissing": true,
    "consentMissing": true
  }
}
```

## Da completare

1. Andrea: verificare la ricezione della seconda email di prova autorizzata. Il modulo ha restituito «Controlla la tua email»; nessuna cancellazione dell’abbonato.
2. Codex: completare Lighthouse e review finale prima del rilascio. Risposta e redirect IT verificati; prova conservata in docs/codex/evidence/infomaniak/final-submit-it.txt e final-submit-it.png.
3. Andrea: fornire il Payment Link Mollie quando disponibile e impostarne il redirect; la newsletter non richiede altri dati Mailchimp.
4. Andrea: rivedere le PR e decidere il merge. Nessun merge automatico.

La revisione automatica ha rifiutato `gh pr list --state open --json number,title,headRefName,url`: `approval required by policy, but AskForApproval is set to Never`. Nessun login tentato e nessun aggiramento.
