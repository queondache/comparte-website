# action-items-andrea.md

**Tempo stimato totale:** ~10 minuti.
**Why:** Google Search Console API richiede gcloud auth attivo, non disponibile in questa sessione. Faccio te in 5 click.

---

## 1. Google Search Console — verifica proprietà (3 min)

Skip se hai già verificato `comparte.it` o `www.comparte.it` in passato.

1. Vai su https://search.google.com/search-console
2. Click su **Aggiungi proprietà** (in alto a sinistra dropdown)
3. Scegli **Prefisso URL** (non Dominio): inserisci `https://www.comparte.it/`
4. Verifica via **Tag HTML**: copia il `<meta name="google-site-verification" content="...">` che ti dà
5. Mandalo in chat — io lo aggiungo all'`<head>` di `index.html` IT (5 secondi)
6. Torna su GSC, click **Verifica**

Alternativa più veloce se hai già l'account zeroCO2 verificato sullo stesso dominio: aggiungi te come Owner della proprietà esistente.

---

## 2. Submit sitemap (30 secondi)

Dopo verifica:

1. Sidebar GSC → **Sitemap** (sotto sezione Indicizzazione)
2. Campo "Aggiungi una nuova sitemap": digita `sitemap.xml` (no `/`, niente dominio)
3. Click **Invia**

Atteso: status "Operazione riuscita", 6 URL rilevati.

---

## 3. Request indexing manuale (5 min, opzionale ma consigliato per accelerare)

Per ogni URL nella lista sotto:

1. Sidebar GSC → **Controllo URL** (in alto, barra di ricerca)
2. Incolla URL
3. Click **Richiedi indicizzazione**

URL prioritari (in ordine):
- `https://www.comparte.it/` (IT home, target principale 5×1000)
- `https://www.comparte.it/trasparenza/` (segnale forte trust per donatori)
- `https://www.comparte.it/es/` (ES home, audience LATAM)
- `https://www.comparte.it/en/` (EN home, audience istituzionale globale)
- `https://www.comparte.it/es/transparencia/`
- `https://www.comparte.it/en/transparency/`

Google rate-limita ~10 richieste/giorno per proprietà. Se ne servono di più, aspetta 24h.

---

## 4. Rich Results Test ufficiale (3 min)

Verifica live che Google riconosca lo structured data. Apri questi 6 link nel browser, uno per pagina:

- IT home: https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.comparte.it%2F
- ES home: https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.comparte.it%2Fes%2F
- EN home: https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.comparte.it%2Fen%2F
- IT trasparenza: https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.comparte.it%2Ftrasparenza%2F
- ES transparencia: https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.comparte.it%2Fes%2Ftransparencia%2F
- EN transparency: https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.comparte.it%2Fen%2Ftransparency%2F

**Atteso (per le 3 home):** *FAQPage* valida con 5 Question/Answer + *Organization* (NGO) valida.
**Atteso (per le 3 trasparenza):** *WebPage* valida con mainEntity collegata a Organization principale.

Se appare solo "Page can be indexed" senza riconoscere FAQPage/Organization → non è un errore: spesso Google impiega 1-2 ore dopo crawl per processare nuovi schema. Riprova dopo qualche ora.

Se compaiono **errori bloccanti rossi** → screenshot in chat, fix in 5 minuti.

---

## 5. Bonus — Bing Webmaster Tools (2 min, opzionale)

Bing serve anche DuckDuckGo + parte di ChatGPT search. Stesso processo:

1. https://www.bing.com/webmasters
2. Aggiungi sito `https://www.comparte.it/`
3. Importa proprietà da Google Search Console (UI permette import diretto, no nuova verifica)
4. Submit sitemap `https://www.comparte.it/sitemap.xml`

---

## Quando hai finito

Mi mandi in chat:
- ✅ Sitemap submitted
- ✅ Number di URL indicizzati richiesti (es. "tutti 6")
- ✅ Eventuali errori RRT (screenshot)

Aggiorno `FINAL-REPORT.md` con il delta + chiudiamo definitivamente.
