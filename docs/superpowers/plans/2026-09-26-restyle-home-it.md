# Restyle home IT — piano di implementazione

> **Per chi esegue:** sottoskill richiesta: superpowers:subagent-driven-development (dentro l'orchestratore). I passi usano checkbox (`- [ ]`).

**Obiettivo:** riordinare e riscrivere la home italiana di comparte.it secondo la spec. Aggiungere le sezioni "Perché l'educazione", "Dona" e "Newsletter", il box "Progetti che sosteniamo" per El Bloqueo, il font Plus Jakarta Sans. Togliere "ONLUS".

**Architettura:** sito statico, nessuna build. Tutto il lavoro sta in `index.html`, `assets/css/style.css` e `assets/js/main.js`, più `trasparenza/index.html` e `llms.txt` per la denominazione. L'oracolo è uno script Python solo stdlib che controlla struttura, contenuti e metadati della home.

**Stack:** HTML5, CSS con custom properties, JS vanilla, Python 3 stdlib (oracolo). Via `npx`, senza aggiungerli al repo: `lighthouse` e `http-server`. Sono dipendenze dichiarate, eseguite solo in verifica.

**Spec:** `docs/superpowers/specs/2026-09-26-restyle-home-design.md`

## Vincoli globali

- Solo IT in questa fase: `es/` ed `en/` restano invariati.
- Font: Plus Jakarta Sans 400/500/700 da Google Fonts, `display=swap`. Fraunces e Instrument Sans vanno rimossi dappertutto.
- Palette invariata: `--arancione #E8621A`, `--arancione-text #C44E0E`, `--rosa`, `--blu #1A4A6B`, `--crema #F5EFE0`, `--testo #1C1612`, `--testo-muted #6B5040`.
- Tono: si dà del "tu" al lettore, frasi brevi, niente gergo da ONG ("beneficiari", "empowerment", "sinergie"). Ogni numero ha una fonte visibile.
- La parola "ONLUS"/"Onlus" non compare più nei file IT toccati. La denominazione è il segnaposto letterale `{{DENOMINAZIONE}}` (APERTO-01) e il brand "Comparte" resta invariato.
- El Bloqueo è sempre "progetto che sosteniamo", mai "nostro progetto" o "progetto di Comparte". Niente `Project` El Bloqueo nel JSON-LD di Comparte.
- Mollie e Mailchimp **non** vengono collegati: il bottone ha `data-mollie-link=""`, il form ha `data-mailchimp-action=""`, e tutti e due mostrano lo stato "in arrivo".
- Nessuna libreria JS o CSS nuova. Nessuno script di terze parti caricato al primo accesso.
- Accessibilità: contrasto ≥ 4.5:1, focus visibile, target ≥ 44px, `prefers-reduced-motion`, nessuna emoji usata come icona strutturale.
- Lighthouse mobile IT: Perf ≥ 90, A11y ≥ 95, SEO 100.
- Commenti nel codice in italiano, nomi di variabili in inglese.

## Punti da controllare in review

1. **JS disattivato:** CF e IBAN restano leggibili e selezionabili come testo. Il bottone "copia" è solo un aiuto in più.
2. **`navigator.clipboard` assente o negato** (http, Safari vecchio): il bottone non lancia errori in console, seleziona il testo e mostra "Seleziona e copia".
3. **Bottone carta in stato "in arrivo":** non è un link, non porta a `#` e non apre niente. Un lettore di schermo legge "Pagamento con carta in arrivo".
4. **Invio del form newsletter in stato "in arrivo":** non manda dati da nessuna parte, il pulsante è disabilitato con il motivo scritto accanto.
5. **Viewport 375px:** nessuno scroll orizzontale. IBAN e CF vanno a capo o stanno nella larghezza.

Ogni punto ha un check nell'oracolo (`scripts/check_home.py`) o un passo di verifica nel Task 8.

---

### Task 1: Oracolo `scripts/check_home.py`

**File:**
- Crea: `scripts/check_home.py`

**Interfacce:**
- Produce: `python3 scripts/check_home.py [path]` (default `index.html`). Exit 0 se tutti i check passano, 1 altrimenti. Stampa una riga `PASS|FAIL <nome check>` per ogni check. Tutti i task successivi lo usano come test.

- [ ] **Passo 1: scrivi l'oracolo**

```python
#!/usr/bin/env python3
"""Oracolo della home IT: controlla struttura, contenuti e metadati richiesti dalla spec."""
import json
import re
import sys
from html.parser import HTMLParser

PATH = sys.argv[1] if len(sys.argv) > 1 else "index.html"
SECTION_ORDER = [
    "hero", "perche-educazione", "chi-siamo", "progetti", "impatto",
    "cinque-x-mille", "dona", "galleria", "partner", "press", "faq", "newsletter",
]


class Collector(HTMLParser):
    """Raccoglie section, img, script JSON-LD e testo visibile."""

    def __init__(self):
        super().__init__()
        self.sections, self.imgs, self.jsonld, self.text = [], [], [], []
        self.links, self.elements = [], []
        self._in_jsonld = False
        self._skip = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self.elements.append((tag, a))
        if tag == "section" and "id" in a:
            self.sections.append(a["id"])
        if tag == "img":
            self.imgs.append(a)
        if tag == "a":
            self.links.append(a)
        if tag == "script" and a.get("type") == "application/ld+json":
            self._in_jsonld = True
            self.jsonld.append("")
        elif tag in ("script", "style"):
            self._skip += 1

    def handle_endtag(self, tag):
        if tag == "script" and self._in_jsonld:
            self._in_jsonld = False
        elif tag in ("script", "style") and self._skip:
            self._skip -= 1

    def handle_data(self, data):
        if self._in_jsonld:
            self.jsonld[-1] += data
        elif not self._skip:
            self.text.append(data)


html = open(PATH, encoding="utf-8").read()
c = Collector()
c.feed(html)
text = " ".join(" ".join(c.text).split())
results = []


def check(name, ok):
    results.append((name, bool(ok)))


def has_el(tag, **attrs):
    return any(t == tag and all(a.get(k) == v for k, v in attrs.items()) for t, a in c.elements)


# Struttura
check("ordine sezioni", c.sections == SECTION_ORDER)
check("direttivo dentro chi-siamo (niente section propria)", "direttivo" not in c.sections)
# Font
check("font Plus Jakarta Sans caricato", "family=Plus+Jakarta+Sans" in html)
check("Fraunces/Instrument rimossi", "Fraunces" not in html and "Instrument+Sans" not in html)
# Denominazione e tono
check("nessuna 'ONLUS' nel file", not re.search(r"onlus", html, re.I))
check("segnaposto denominazione presente", "{{DENOMINAZIONE}}" in html)
check("niente gergo ONG", not re.search(r"\b(beneficiari|empowerment|sinergi)", text, re.I))
# El Bloqueo
check("link elbloqueo.it", any(l.get("href", "").startswith("https://elbloqueo.it") for l in c.links))
check("El Bloqueo come progetto sostenuto", re.search(r"progett\w* che sosteniamo", text, re.I))
check("El Bloqueo non 'nostro progetto'", not re.search(r"(nostro progetto|progetto di comparte)[^.]{0,40}bloqueo", text, re.I))
# 5x1000 e dona
check("CF presente come testo", "97977810585" in text)
check("IBAN presente come testo", "IT27J0501803200000016738783" in text)
check("bottone copia CF", has_el("button", **{"data-copy": "97977810585"}))
check("bottone copia IBAN", has_el("button", **{"data-copy": "IT27J0501803200000016738783"}))
check("bottone carta in attesa Mollie", has_el("button", **{"data-mollie-link": ""}))
check("form newsletter in attesa Mailchimp", has_el("form", **{"data-mailchimp-action": ""}))
check("campo email con label", has_el("input", type="email", id="nl-email") and has_el("label", **{"for": "nl-email"}))
check("consenso privacy obbligatorio", any(t == "input" and a.get("id") == "nl-consent" and "required" in a for t, a in c.elements))
# Perché l'educazione: almeno 2 fonti esterne
m = re.search(r'<section id="perche-educazione".*?</section>', html, re.S)
check("educazione: >=2 fonti esterne", m and len(re.findall(r'href="https?://', m.group(0))) >= 2)
# Accessibilità / performance
check("img con width e height", all("width" in i and "height" in i for i in c.imgs if i.get("src")))
check("nessuna emoji bandiera/check strutturale", not re.search("[\U0001F1E6-\U0001F1FF]|✓", html))
check("reduced-motion nel CSS", "prefers-reduced-motion" in open("assets/css/style.css", encoding="utf-8").read())
# JSON-LD
parsed = []
for block in c.jsonld:
    try:
        parsed.append(json.loads(block))
    except json.JSONDecodeError:
        parsed.append(None)
check("JSON-LD tutti parse OK", c.jsonld and None not in parsed)
def walk(node):
    """Restituisce tutti i dict annidati in un blocco JSON-LD."""
    if isinstance(node, dict):
        yield node
        for v in node.values():
            yield from walk(v)
    elif isinstance(node, list):
        for v in node:
            yield from walk(v)


check("JSON-LD senza Project El Bloqueo", not any(
    d.get("@type") == "Project" and "bloqueo" in json.dumps(d).lower() for p in parsed for d in walk(p)))

failed = 0
for name, ok in results:
    print(("PASS " if ok else "FAIL ") + name)
    failed += not ok
print(f"\n{len(results) - failed}/{len(results)} check passati")
sys.exit(1 if failed else 0)
```

- [ ] **Passo 2: eseguilo sulla home attuale e verifica che sia ROSSO**

Esegui: `python3 scripts/check_home.py`
Atteso: exit 1. FAIL almeno su "ordine sezioni", "font Plus Jakarta Sans caricato", "nessuna 'ONLUS' nel file", "bottone copia IBAN". Salva l'output raw nel report: è la prova del rosso.

- [ ] **Passo 3: commit**

```bash
git add scripts/check_home.py
git commit -m "test: oracolo struttura home IT"
```

### Task 2: Font, token e pulizia icone

**File:**
- Modifica: `index.html:327-331` (link font), `index.html:402` (bandiere), `index.html:592` (✓)
- Modifica: `assets/css/style.css` (token `--font-display`/`--font-body`, stili collegati, blocco reduced-motion)

**Interfacce:**
- Produce: `--font-display` e `--font-body` valgono entrambi `'Plus Jakarta Sans', system-ui, sans-serif`. Classe utility `.visually-hidden`.

- [ ] **Passo 1:** sostituisci i 3 `<link>` font (preload, stylesheet, noscript) con lo stesso URL `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700&display=swap`.
- [ ] **Passo 2:** in `style.css` metti i token a `'Plus Jakarta Sans', system-ui, sans-serif`. Rivedi i titoli, che prima usavano uno stile serif:
  - `letter-spacing: -0.02em` su h1/h2;
  - peso 700 su h1, 500 su h2/h3;
  - togli i `font-style: italic` e le proprietà `font-variation-settings`/`opsz` legate a Fraunces.
- [ ] **Passo 3:** togli le emoji: bandiere 🇮🇹 🇬🇹 → testo "Roma · Petén"; "✓ Copiato!" → icona SVG check inline (`aria-hidden="true"`) + testo "Copiato".
- [ ] **Passo 4:** se manca, aggiungi in fondo a `style.css`:

```css
/* Rispetta la preferenza di movimento ridotto */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
```

- [ ] **Passo 5:** `python3 scripts/check_home.py`. Atteso: PASS su font, Fraunces rimosso, emoji, reduced-motion. Gli altri restano FAIL.
- [ ] **Passo 6:** commit `style: font Plus Jakarta Sans e pulizia icone emoji`.

### Task 3: Riordino sezioni, hero e nav

**File:**
- Modifica: `index.html:340-800` (nav, hero, spostamento blocchi, footer)
- Modifica: `assets/css/style.css` (stili nav/hero se servono)

**Interfacce:**
- Consuma: token del Task 2.
- Produce: sezioni vuote ma presenti, nell'ordine dell'oracolo, con `id` esatti: `perche-educazione` (aggiunta), `dona` (aggiunta), `newsletter` (aggiunta). Ognuna ha la struttura `<section id="X" aria-labelledby="X-title"><div class="container"><h2 id="X-title">…</h2></div></section>`. I Task 4–7 riempiono solo l'interno del loro `.container`.

- [ ] **Passo 1:** sposta `galleria`, `partner` e `press` dopo `cinque-x-mille`, poi `faq`. Il `<section id="direttivo">` diventa `<div id="direttivo" class="direttivo">` in fondo a `#chi-siamo`, con i 3 membri su 3 righe compatte (nome, ruolo, una riga).
- [ ] **Passo 2:** crea le 3 sezioni nuove vuote nelle posizioni dell'oracolo:
  - `perche-educazione` dopo `hero`;
  - `dona` dopo `cinque-x-mille`;
  - `newsletter` dopo `faq`.
  Titoli provvisori: "Perché l'educazione", "Altri modi per donare", "Resta in contatto".
- [ ] **Passo 3:** nav: link a `#perche-educazione` "Perché l'educazione", `#progetti` "Progetti", `#impatto` "Impatto", `/trasparenza/` "Trasparenza". La CTA "Dona" porta a `#cinque-x-mille`.
- [ ] **Passo 4:** hero:
  - h1 "L'educazione cambia tutto" (resta);
  - sottotitolo "Formiamo docenti, studenti e comunità nel Petén, in Guatemala, dal 2018. Con il tuo 5×1000 continuiamo.";
  - CTA primaria "Dona il 5×1000" → `#cinque-x-mille`;
  - CTA secondaria "Altri modi per donare" → `#dona`.
- [ ] **Passo 5:** footer: aggiungi i link "Trasparenza" → `/trasparenza/` ed "El Bloqueo" → `https://elbloqueo.it/`. Aggiorna le ancore dei link che puntavano a `#direttivo`.
- [ ] **Passo 5b:** aggiungi `width` e `height` reali (da `sips -g pixelWidth -g pixelHeight <file>`) a ogni `<img>` statico della home.
- [ ] **Passo 6:** `python3 scripts/check_home.py`. Atteso: PASS su "ordine sezioni", "direttivo dentro chi-siamo", "img con width e height".
- [ ] **Passo 7:** commit `refactor: nuovo ordine sezioni home IT`.

### Task 4: Sezione "Perché l'educazione"

**File:**
- Modifica: `index.html` dentro `#perche-educazione .container`
- Modifica: `assets/css/style.css` (blocco `.edu-*`)

**Interfacce:**
- Consuma: la section vuota del Task 3.

- [ ] **Passo 1: ricerca delle fonti.** Trova 2 o 3 dati di contesto su educazione in Guatemala/Petén (per esempio completamento della secondaria, alfabetizzazione rurale o indigena), solo da fonte primaria: UNESCO UIS (`uis.unesco.org`), World Bank, INE Guatemala, MINEDUC. Per ogni dato annota URL, anno e cifra. **Se un dato non ha URL verificato (pagina aperta e cifra trovata), non entra.**
- [ ] **Passo 2: struttura.**
  - Occhiello "Perché l'educazione", h2 "Un diritto che nel Petén va ancora conquistato".
  - Un paragrafo di apertura con la citazione "L'educazione è l'unico ingrediente in grado di innescare uno sviluppo sostenibile" in `<blockquote>`.
  - Tre schede "competenze":
    - (1) Docenti formati: il Ciclo de Conversatorios con CUDEP-USAC, 10 incontri su valutazione, classi eterogenee, apprendimento cooperativo, pensiero computazionale, con Scholas Occurrentes e Hospitalidad Digital;
    - (2) Ragazzi e clima: educazione climatica 13–17 anni;
    - (3) Comunità: formazione agricola.
  - Riga di dati con fonte linkata sotto ogni cifra (`<a href>` visibile, `rel="noopener"`).
- [ ] **Passo 3:** testi in tono caldo e diretto, max 60 parole per scheda, niente gergo. Icone solo SVG inline con `aria-hidden="true"`.
- [ ] **Passo 4:** `python3 scripts/check_home.py`. Atteso: PASS "educazione: >=2 fonti esterne" e "niente gergo ONG".
- [ ] **Passo 5:** commit `feat: sezione perché l'educazione`.

### Task 5: Progetti e box "Progetti che sosteniamo"

**File:**
- Modifica: `index.html` dentro `#progetti`
- Modifica: `assets/css/style.css` (blocco `.supported-*`)

- [ ] **Passo 1:** rivedi i testi delle 3 card (Comunidad, Universidad, Educación) nel tono nuovo. I fatti e i numeri esistenti restano uguali.
- [ ] **Passo 2:** in coda alla sezione aggiungi:

```html
<aside class="supported" aria-labelledby="supported-title">
  <p class="eyebrow">Progetti che sosteniamo</p>
  <h3 id="supported-title">El Bloqueo</h3>
  <p>Un sito indipendente, in italiano, spagnolo e inglese, che racconta il blocco statunitense contro Cuba con fonti verificabili e un atlante della solidarietà cubana nel mondo. Lo sosteniamo perché la nostra storia è cominciata proprio con il cinema cubano: le proiezioni di Comparte Cinema con l'ICAIC.</p>
  <a class="btn-ghost" href="https://elbloqueo.it/" target="_blank" rel="noopener">Leggi El Bloqueo <span aria-hidden="true">↗</span><span class="visually-hidden">(si apre in una nuova scheda)</span></a>
</aside>
```

- [ ] **Passo 3:** stile: box visivamente distinto dalle 3 card (bordo, non riempimento pieno), per far capire che non è un progetto di Comparte.
- [ ] **Passo 4:** `python3 scripts/check_home.py`. Atteso: PASS sui 3 check El Bloqueo.
- [ ] **Passo 5:** commit `feat: box progetti che sosteniamo (El Bloqueo)`.

### Task 6: Box 5×1000 e sezione Dona, con copia generica

**File:**
- Modifica: `index.html` dentro `#cinque-x-mille` e `#dona`
- Modifica: `assets/js/main.js:10-20` (sostituisce la logica `cf-copy`)
- Modifica: `assets/css/style.css` (blocchi `.x1000-*`, `.dona-*`)

**Interfacce:**
- Produce: qualsiasi `<button data-copy="VALORE">` copia `VALORE`. Lo stato viene esposto con la classe `.copied` e con un `<span class="copy-status" aria-live="polite">` dentro il bottone.

- [ ] **Passo 1: JS.** Sostituisci il blocco `cf-copy` in `main.js` con:

```js
// Bottoni "copia": data-copy contiene il valore; fallback a selezione del testo se clipboard non disponibile
document.querySelectorAll('button[data-copy]').forEach((btn) => {
  const status = btn.querySelector('.copy-status');
  const target = document.getElementById(btn.getAttribute('aria-controls'));

  const say = (msg) => { if (status) status.textContent = msg; };

  btn.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard) throw new Error('clipboard non disponibile');
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.classList.add('copied');
      say('Copiato');
      setTimeout(() => { btn.classList.remove('copied'); say(''); }, 2500);
    } catch (err) {
      console.warn('[copia] fallback a selezione manuale:', err);
      if (target) {
        const range = document.createRange();
        range.selectNodeContents(target);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      say('Seleziona e copia');
    }
  });
});
```

- [ ] **Passo 2: 5×1000.**
  - CF grande in `<span id="cf-value">97977810585</span>` e bottone `<button type="button" data-copy="97977810585" aria-controls="cf-value">Copia il codice fiscale <span class="copy-status" aria-live="polite"></span></button>`.
  - 3 passi numerati, con la dicitura del riquadro ETS: "Sostegno degli enti del Terzo settore iscritti nel RUNTS…". Resta da riconfermare: annotalo nel report come dipendente da APERTO-01.
  - Riga "Non ti costa nulla e non riduce il tuo rimborso".
  - Link "Come usiamo il 5×1000" → `/trasparenza/`.
  - Togli dal box il vecchio IBAN, che si sposta in `#dona`.
- [ ] **Passo 3: Dona.** Due schede affiancate su desktop e impilate sotto 768px:
  - **Bonifico:** "Banca Etica", IBAN in `<span id="iban-value">IT27J0501803200000016738783</span>` con `overflow-wrap:anywhere`, bottone `data-copy="IT27J0501803200000016738783" aria-controls="iban-value"`, intestatario `{{DENOMINAZIONE}}`, causale suggerita "Donazione liberale". Sotto: "Vuoi donare ogni mese? Imposta un bonifico periodico dalla tua banca con questi dati."
  - **Carta:**

```html
<button type="button" class="btn-primary" data-mollie-link="" aria-disabled="true" aria-describedby="card-soon">Dona con carta</button>
<p id="card-soon" class="helper">Pagamento con carta in arrivo, tramite Mollie (provider europeo). Nel frattempo puoi usare il bonifico.</p>
```

  CSS: `[data-mollie-link=""]` con opacità 0.5 e `cursor: not-allowed`. JS: nessun handler finché l'attributo è vuoto (lo aggiunge Codex).
  - Nota detraibilità in `<p class="helper">`: "Le donazioni a {{DENOMINAZIONE}} sono deducibili o detraibili secondo le regole per gli enti del Terzo settore. Conserva la ricevuta del bonifico."
- [ ] **Passo 4:** `python3 scripts/check_home.py`. Atteso: PASS su CF, IBAN, bottoni copia, bottone carta.
- [ ] **Passo 5:** test manuale con `npx http-server -p 8080 -s`: clic su "copia" → classe `copied`. In console: `Object.defineProperty(navigator,'clipboard',{value:undefined})`, poi clic → testo selezionato, nessun errore rosso.
- [ ] **Passo 6:** commit `feat: box 5x1000 e sezione dona con copia generica`.

### Task 7: Newsletter e FAQ

**File:**
- Modifica: `index.html` dentro `#newsletter` e `#faq`, JSON-LD `FAQPage` nel `<head>`
- Modifica: `assets/css/style.css` (blocco `.nl-*`)

- [ ] **Passo 1: form.**

```html
<form class="nl-form" data-mailchimp-action="" method="post" novalidate>
  <label for="nl-email">La tua email</label>
  <input id="nl-email" name="EMAIL" type="email" autocomplete="email" required placeholder="nome@esempio.it">
  <label class="nl-consent"><input id="nl-consent" name="consent" type="checkbox" required> Accetto di ricevere la newsletter e ho letto l'<a href="/trasparenza/#privacy">informativa privacy</a>.</label>
  <button type="submit" disabled aria-describedby="nl-soon">Iscriviti</button>
  <p id="nl-soon" class="helper">Iscrizioni in arrivo. Intanto seguici su <a href="https://www.instagram.com/comparteonlus/" rel="noopener">Instagram</a>.</p>
</form>
```

  Sopra il form: h2 "Resta in contatto" e una riga "Poche email all'anno: cosa facciamo, dove vanno i fondi, quando serve il tuo 5×1000."
  Nota: l'ancora `#privacy` su `/trasparenza/` non esiste. Nel report segnalalo come blocco legale per Codex, senza scrivere l'informativa.
- [ ] **Passo 2: FAQ.** Riscrivi le domande nel tono nuovo e sostituisci "ONLUS" con `{{DENOMINAZIONE}}`. Aggiungi "Posso donare con carta?": "Presto sì, tramite Mollie, un provider europeo. I dati della tua carta non passano mai dal nostro sito. Intanto puoi usare il bonifico." Allinea HTML e JSON-LD `FAQPage` alle stesse domande e risposte.
- [ ] **Passo 3:** `python3 scripts/check_home.py`. Atteso: PASS su form, label, consenso, JSON-LD parse.
- [ ] **Passo 4:** commit `feat: newsletter in attesa Mailchimp e FAQ riviste`.

### Task 8: Denominazione, metadati, JSON-LD e passata finale sul tono

**File:**
- Modifica: `index.html` (`<title>`, meta description, OG/Twitter, JSON-LD `@graph`)
- Modifica: `trasparenza/index.html` (ONLUS → `{{DENOMINAZIONE}}`)
- Modifica: `llms.txt` (ONLUS → `{{DENOMINAZIONE}}`, sezioni nuove, El Bloqueo come progetto sostenuto)

- [ ] **Passo 1:** title "Comparte – Dona il 5×1000 all'educazione in Guatemala | CF 97977810585". Meta description, OG e Twitter coerenti, senza "ONLUS". Correggi `og:image` e `twitter:image` con URL assoluti `https://www.comparte.it/assets/img/hero/hero.jpg`.
- [ ] **Passo 2:** JSON-LD `@graph`:
  - `name` = `{{DENOMINAZIONE}}`, `alternateName` "Comparte";
  - `DonateAction` con descrizione IBAN aggiornata;
  - niente `Project` El Bloqueo.
  Controlla il parse con l'oracolo.
- [ ] **Passo 3:** sostituisci "ONLUS/Onlus" in `trasparenza/index.html` e in `llms.txt`. Verifica con `grep -ci onlus index.html trasparenza/index.html llms.txt`: atteso 0 in tutti e tre.
- [ ] **Passo 4:** rileggi tutta la home: tono, "tu", frasi brevi, niente gergo, ogni numero con fonte.
- [ ] **Passo 5:** verifica finale, con output raw nel report:
  - `python3 scripts/check_home.py` → exit 0, tutti PASS;
  - `npx http-server -p 8080 -s &`, poi `npx lighthouse http://localhost:8080/ --form-factor=mobile --only-categories=performance,accessibility,seo --quiet --chrome-flags="--headless" --output=json --output-path=./.lh.json` e stampa dei punteggi. Atteso: Perf ≥ 90, A11y ≥ 95, SEO 100. Poi `rm .lh.json`;
  - screenshot a 375, 768 e 1440 px. A 375 px: `document.documentElement.scrollWidth <= 375`;
  - con JS disattivato, CF e IBAN visibili come testo.
- [ ] **Passo 6:** commit `chore: denominazione ETS segnaposto, metadati e tono`.

---

## Esecuzione

- Branch: `restyle-home-it`, da `main`.
- Parallelismo: i Task 1–8 toccano quasi tutti `index.html`, quindi sono **sequenziali**. Si può anticipare solo la ricerca delle fonti del Task 4 (passo 1, sola lettura).
- Dopo ogni task: `verificatore` su hash e oracolo.
- A fine lavoro: PR verso `main`, verificatore finale e gate pre-merge. È tier 1–2 (statico, nessun dato personale salvato), ma i **testi sono prodotto**: la PR resta in attesa della rilettura di Andrea prima del merge.
