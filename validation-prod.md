# validation-prod.md
**Data:** 2026-05-14, branch `main` deployed (commit `9225750`).
**Tool:** estrazione JSON-LD locale + link Rich Results Test pre-popolato per verifica Google ufficiale.

## Per pagina
### IT home
- URL: <https://www.comparte.it/>
- HTTP: 200 OK
- Canonical: `https://www.comparte.it/`
- JSON-LD blocks: 2
  - @type=`FAQPage` inLanguage=`it` → OK
  - @type=`@graph` inLanguage=`?` → OK
- **Rich Results Test (apri nel browser):** [https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.comparte.it%2F](https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.comparte.it%2F)

### ES home
- URL: <https://www.comparte.it/es/>
- HTTP: 200 OK
- Canonical: `https://www.comparte.it/es/`
- JSON-LD blocks: 2
  - @type=`FAQPage` inLanguage=`es` → OK
  - @type=`@graph` inLanguage=`?` → OK
- **Rich Results Test (apri nel browser):** [https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.comparte.it%2Fes%2F](https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.comparte.it%2Fes%2F)

### EN home
- URL: <https://www.comparte.it/en/>
- HTTP: 200 OK
- Canonical: `https://www.comparte.it/en/`
- JSON-LD blocks: 2
  - @type=`FAQPage` inLanguage=`en` → OK
  - @type=`@graph` inLanguage=`?` → OK
- **Rich Results Test (apri nel browser):** [https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.comparte.it%2Fen%2F](https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.comparte.it%2Fen%2F)

### IT trasparenza
- URL: <https://www.comparte.it/trasparenza/>
- HTTP: 200 OK
- Canonical: `https://www.comparte.it/trasparenza/`
- JSON-LD blocks: 1
  - @type=`['WebPage', 'AboutPage']` inLanguage=`it` → OK
- **Rich Results Test (apri nel browser):** [https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.comparte.it%2Ftrasparenza%2F](https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.comparte.it%2Ftrasparenza%2F)

### ES transparencia
- URL: <https://www.comparte.it/es/transparencia/>
- HTTP: 200 OK
- Canonical: `https://www.comparte.it/es/transparencia/`
- JSON-LD blocks: 1
  - @type=`['WebPage', 'AboutPage']` inLanguage=`es` → OK
- **Rich Results Test (apri nel browser):** [https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.comparte.it%2Fes%2Ftransparencia%2F](https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.comparte.it%2Fes%2Ftransparencia%2F)

### EN transparency
- URL: <https://www.comparte.it/en/transparency/>
- HTTP: 200 OK
- Canonical: `https://www.comparte.it/en/transparency/`
- JSON-LD blocks: 1
  - @type=`['WebPage', 'AboutPage']` inLanguage=`en` → OK
- **Rich Results Test (apri nel browser):** [https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.comparte.it%2Fen%2Ftransparency%2F](https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.comparte.it%2Fen%2Ftransparency%2F)


## Riassunto

- 6/6 pagine HTTP 200 ✅
- 6/6 canonical corretti (trailing slash uniformi post-fix `9225750`) ✅
- 9/9 JSON-LD blocks parse senza errori ✅
- Rich Results Test ufficiale Google: link pre-popolati sopra. Andrea apri ognuno per visualizzare lo screenshot ufficiale Google + confermare 0 errori bloccanti.

## Atteso al RRT Google

Per le 3 home: **FAQPage** valida (5 Question/Answer per lingua) + **NGO/Organization** valida (taxID, address, founder, member, sameAs Wikidata).
Per le 3 trasparenza: **WebPage**/**AboutPage** valida con mainEntity → #organization (riferimento cross-pagina al @graph principale).

RRT può segnalare warning su `inLanguage` non standard quando @type è `@graph` wrapper (innocuo).
