# Draft: Mollie — pagine grazie e gate di attivazione

Base: main `bd7b449ec84fa50aa1817866272d6e41d30dd697`.
Commit implementazione: `a38f440c3c5e6f112499b4add4c7389f40560bae`.
Branch: `feat/mollie-payment-link`; base PR: `main`.

**BLOCCATA, NON PRONTA PER IL MERGE.** Mollie attende validazione; Andrea non ha ancora il Payment Link. Nessun pagamento attivato, nessuna modifica a FAQ/DonateAction che ne dichiari la disponibilità. Nessun merge.

Tre pagine grazie con header/footer/CSS del sito, noindex e hreflang reciproci. Nessuna aggiunta alla sitemap, `.nojekyll` presente. Il vecchio check carta in attesa è sostituito da quello sul link reale, che resta FAIL. Gli altri check esistenti non sono indeboliti. Le home sono invariate.

## Screenshot locali (390 × 844)

![it pagina grazie](https://raw.githubusercontent.com/queondache/comparte-website/a38f440c3c5e6f112499b4add4c7389f40560bae/docs/codex/evidence/mollie/it-thanks.png)

![es pagina grazie](https://raw.githubusercontent.com/queondache/comparte-website/a38f440c3c5e6f112499b4add4c7389f40560bae/docs/codex/evidence/mollie/es-thanks.png)

![en pagina grazie](https://raw.githubusercontent.com/queondache/comparte-website/a38f440c3c5e6f112499b4add4c7389f40560bae/docs/codex/evidence/mollie/en-thanks.png)

## Comandi e output raw

### main-red.txt

```text
BASE bd7b449ec84fa50aa1817866272d6e41d30dd697
Updated oracle against an unmodified git archive of main.

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
PASS form newsletter in attesa Mailchimp
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

27/31 check passati
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
PASS form newsletter in attesa Mailchimp
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

30/34 check passati
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
PASS form newsletter in attesa Mailchimp
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

30/34 check passati
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
PASS form newsletter in attesa Mailchimp
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

30/31 check passati
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
PASS form newsletter in attesa Mailchimp
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

33/34 check passati
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
PASS form newsletter in attesa Mailchimp
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

33/34 check passati
EXIT 1

```

### http-screenshots.txt

```text
$ curl -I http://127.0.0.1:8765/grazie/
HTTP/1.0 200 OK
Server: SimpleHTTP/0.6 Python/3.9.6
Date: Sat, 26 Sep 2026 18:20:08 GMT
Content-type: text/html
Content-Length: 5240
Last-Modified: Sat, 26 Sep 2026 18:20:08 GMT

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed

  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
  0  5240    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
EXIT 0

$ /Users/andreapesce/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell --headless --disable-gpu --no-sandbox --window-size=390,844 --hide-scrollbars --timeout=15000 --screenshot=/Users/andreapesce/Dev/Sito comparte/docs/codex/evidence/mollie/it-thanks.png http://127.0.0.1:8765/grazie/
[0926/202008.667714:WARNING:net/dns/dns_config_service_posix.cc:197] Failed to read DnsConfig.
[0926/202008.731088:WARNING:net/dns/dns_config_service_posix.cc:197] Failed to read DnsConfig.
[0926/202008.803193:ERROR:ui/display/mac/cv_display_link_mac.mm:195] CVDisplayLinkCreateWithCGDisplay failed. CVReturn: -6670
[0926/202008.832970:ERROR:ui/display/mac/cv_display_link_mac.mm:195] CVDisplayLinkCreateWithCGDisplay failed. CVReturn: -6670
[0926/202008.866940:ERROR:ui/display/mac/cv_display_link_mac.mm:195] CVDisplayLinkCreateWithCGDisplay failed. CVReturn: -6670
41923 bytes written to file /Users/andreapesce/Dev/Sito comparte/docs/codex/evidence/mollie/it-thanks.png
EXIT 0

$ curl -I http://127.0.0.1:8765/es/gracias/
HTTP/1.0 200 OK
Server: SimpleHTTP/0.6 Python/3.9.6
Date: Sat, 26 Sep 2026 18:20:09 GMT
Content-type: text/html
Content-Length: 5292
Last-Modified: Sat, 26 Sep 2026 18:20:08 GMT

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed

  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
  0  5292    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
EXIT 0

$ /Users/andreapesce/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell --headless --disable-gpu --no-sandbox --window-size=390,844 --hide-scrollbars --timeout=15000 --screenshot=/Users/andreapesce/Dev/Sito comparte/docs/codex/evidence/mollie/es-thanks.png http://127.0.0.1:8765/es/gracias/
[0926/202009.462038:WARNING:net/dns/dns_config_service_posix.cc:197] Failed to read DnsConfig.
[0926/202009.477158:WARNING:net/dns/dns_config_service_posix.cc:197] Failed to read DnsConfig.
[0926/202009.513737:ERROR:ui/display/mac/cv_display_link_mac.mm:195] CVDisplayLinkCreateWithCGDisplay failed. CVReturn: -6670
[0926/202009.514188:ERROR:ui/display/mac/cv_display_link_mac.mm:195] CVDisplayLinkCreateWithCGDisplay failed. CVReturn: -6670
[0926/202009.525173:ERROR:ui/display/mac/cv_display_link_mac.mm:195] CVDisplayLinkCreateWithCGDisplay failed. CVReturn: -6670
43615 bytes written to file /Users/andreapesce/Dev/Sito comparte/docs/codex/evidence/mollie/es-thanks.png
EXIT 0

$ curl -I http://127.0.0.1:8765/en/thank-you/
HTTP/1.0 200 OK
Server: SimpleHTTP/0.6 Python/3.9.6
Date: Sat, 26 Sep 2026 18:20:09 GMT
Content-type: text/html
Content-Length: 5229
Last-Modified: Sat, 26 Sep 2026 18:20:08 GMT

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed

  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
  0  5229    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
EXIT 0

$ /Users/andreapesce/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell --headless --disable-gpu --no-sandbox --window-size=390,844 --hide-scrollbars --timeout=15000 --screenshot=/Users/andreapesce/Dev/Sito comparte/docs/codex/evidence/mollie/en-thanks.png http://127.0.0.1:8765/en/thank-you/
[0926/202009.965815:WARNING:net/dns/dns_config_service_posix.cc:197] Failed to read DnsConfig.
[0926/202009.982404:WARNING:net/dns/dns_config_service_posix.cc:197] Failed to read DnsConfig.
[0926/202010.018511:ERROR:ui/display/mac/cv_display_link_mac.mm:195] CVDisplayLinkCreateWithCGDisplay failed. CVReturn: -6670
[0926/202010.018966:ERROR:ui/display/mac/cv_display_link_mac.mm:195] CVDisplayLinkCreateWithCGDisplay failed. CVReturn: -6670
[0926/202010.033663:ERROR:ui/display/mac/cv_display_link_mac.mm:195] CVDisplayLinkCreateWithCGDisplay failed. CVReturn: -6670
39311 bytes written to file /Users/andreapesce/Dev/Sito comparte/docs/codex/evidence/mollie/en-thanks.png
EXIT 0

Final EN language navigation correction:
$ /Users/andreapesce/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell --headless --disable-gpu --no-sandbox --window-size=390,844 --hide-scrollbars --timeout=15000 --screenshot=/Users/andreapesce/Dev/Sito comparte/docs/codex/evidence/mollie/en-thanks.png http://127.0.0.1:8765/en/thank-you/
[0926/202042.492872:WARNING:net/dns/dns_config_service_posix.cc:197] Failed to read DnsConfig.
[0926/202042.543154:WARNING:net/dns/dns_config_service_posix.cc:197] Failed to read DnsConfig.
[0926/202042.631766:ERROR:ui/display/mac/cv_display_link_mac.mm:195] CVDisplayLinkCreateWithCGDisplay failed. CVReturn: -6670
[0926/202042.695893:ERROR:ui/display/mac/cv_display_link_mac.mm:195] CVDisplayLinkCreateWithCGDisplay failed. CVReturn: -6670
[0926/202042.745818:ERROR:ui/display/mac/cv_display_link_mac.mm:195] CVDisplayLinkCreateWithCGDisplay failed. CVReturn: -6670
39402 bytes written to file /Users/andreapesce/Dev/Sito comparte/docs/codex/evidence/mollie/en-thanks.png
EXIT 0

```

## Da completare

1. Andrea: dopo validazione, fornire il Payment Link; impostare il redirect `https://www.comparte.it/grazie/` dopo pubblicazione.
2. Codex: applicare i testi e i cambi previsti in `docs/codex/mollie-activation.md`, verificare URL e screenshot Mollie, mostrare tutti i check verdi.
3. Codex: misurare Lighthouse mobile prima/dopo e ottenere review indipendente del commit finale. Non ancora eseguiti.
4. Andrea: rileggere e decidere il merge. Questa bozza non va mergiata.

Pubblicazione PR non eseguita: la revisione automatica delle autorizzazioni ha rifiutato `gh pr list` con «approval required by policy, but AskForApproval is set to Never». Nessun login tentato.
