# Sito nuovo Comparte — design

**Data:** 2026-09-27 · **Stato:** in revisione da Andrea · **Tier:** 2 (sito pubblico, nessun dato personale salvato da noi)
**Sostituisce:** `2026-09-26-restyle-home-design.md` (quel restyle era un riordino della pagina esistente: l'approccio era un'assunzione mai confermata da Andrea).

## Obiettivo

Rifare da zero www.comparte.it con un design nuovo e riconoscibile, in IT, ES ed EN, che:
1. faccia capire in 5 secondi chi siamo e come aiutare;
2. porti al 5×1000 (IT) e alla donazione con IBAN (tutte le lingue);
3. dia spazio a Cuba: chi arriva da El Bloqueo trova subito cosa facciamo all'Havana e come donare;
4. metta in grande i dati importanti, con fonte.

Successo misurabile:
- Lighthouse mobile ≥ 95 in Performance, Accessibilità, Best practice e SEO, su ogni pagina;
- nessun URL pubblico attuale restituisce 404 dopo il passaggio;
- ES ed EN senza residui di italiano (test automatico);
- zero script di terze parti al caricamento.

## Decisioni di Andrea (2026-09-27)

| Tema | Scelta |
|---|---|
| Approccio | Sito nuovo da zero, non riordino |
| Direzione visiva | **B · Manifesto**: blocchi di colore pieni a tutta larghezza, tipografia enorme |
| Base tecnica | **Astro 7**, come elbloqueo |
| Titolo apertura | «L'educazione cambia tutto» (Petén in primo piano) |
| Cuba | Blocco in home con bottone **«El Bloqueo»** → `/cuba/` e sotto **«Dona ora»** → sezione "Come donare" |
| Fondi | **Fondo unico**: una sola sezione "Come donare", nessuna causale separata per Cuba |
| Carta | **Nessuna** per ora: Mollie ha rifiutato Comparte. Solo IBAN in chiaro. Alternativa da cercare dopo |
| Newsletter | Mailchimp (form di Codex, da riportare) |

Restano valide dalle sessioni precedenti: nome solo "Comparte"; forma giuridica "Associazione", generica; El Bloqueo è un progetto che Comparte **sostiene**, mai "di Comparte"; font Plus Jakarta Sans; tono caldo con il "tu"; in IT il 5×1000 prima della donazione, in ES/EN la donazione prima e il 5×1000 come riquadro secondario.

## Fatti su Cuba (forniti da Andrea)

- Dove: L'Havana. Asilo per anziani di Belén e scuole primarie della città e della provincia.
- Cosa: occhiali da vista e medicine (formulazione generica, voluta).
- Da quando: da oltre 4 anni.
- Foto: `IMG_0152` (consegna di medicine) e `IMG_0180` (bambini a scuola). Vedi APERTO-02 e APERTO-03.

Nei testi non entrano numeri, nomi di scuole o partner che Andrea non ha confermato.

## Pagine

Ogni pagina esiste in 3 lingue, con la stessa struttura e i testi presi da un file per lingua.

| Pagina | IT | ES | EN |
|---|---|---|---|
| Home | `/` | `/es/` | `/en/` |
| Dona | `/dona/` | `/es/dona/` | `/en/donate/` |
| Cuba | `/cuba/` | `/es/cuba/` | `/en/cuba/` |
| Trasparenza | `/trasparenza/` | `/es/transparencia/` | `/en/transparency/` |
| Grazie (newsletter) | `/grazie/` | `/es/gracias/` | `/en/thank-you/` |

Gli URL esistenti (home, trasparenza, ancore `#cinque-x-mille`, `#dona`, `#newsletter`, `#faq`) restano validi: le ancore principali restano nella home con lo stesso id.

## Home — 7 blocchi

Colori: **Blu** `#1A4A6B` · **Arancio** `#E8621A` · **Rosa** `#D4547A` · **Crema** `#F5EFE0` · **Inchiostro** `#1C1612`.

| # | Blocco | id | Colore | Contenuto |
|---|---|---|---|---|
| 1 | Apertura | `hero` | Blu | Titolo, sottotitolo, 2 bottoni, foto a tutta larghezza |
| 2 | I numeri del Petén | `perche-educazione` | Arancio + Rosa | 3 dati Banca Mondiale in grande, con fonte |
| 3 | Cosa facciamo | `progetti` | Crema | 3 progetti in Guatemala |
| 4 | Cuba | `cuba` | Blu | Aiuti all'Havana, bottoni «El Bloqueo» e «Dona ora» |
| 5 | Impatto | `impatto` | Inchiostro | I nostri numeri grandi |
| 6 | Chi siamo | `chi-siamo` | Crema | Storia breve, foto, direttivo in una riga |
| 7 | Come donare | `cinque-x-mille` + `dona` | Arancio | 5×1000 con CF, IBAN, link a `/dona/` |

Poi una fascia "Chi ci conosce" (partner, stampa, galleria), 3 FAQ, la newsletter (`#newsletter`) e il footer.

Menu: Cosa facciamo · Cuba · Chi siamo · Trasparenza · [Dona] (bottone, porta a `/dona/`). Selettore lingua IT/ES/EN.

## Testi IT

Tono: "tu", frasi brevi, niente gergo da ONG, luoghi e persone concreti. ES ed EN si traducono dal testo IT approvato, con lo stesso tono ("tú", "you").

### 1 · Apertura
- Occhiello: Dal 2018 nel Petén, in Guatemala
- Titolo: **L'educazione cambia tutto**
- Sottotitolo: Formiamo docenti, ragazzi e comunità nel Petén. E all'Havana portiamo occhiali e medicine a chi ne ha bisogno.
- Bottoni: **Dona il 5×1000** · Altri modi per donare

### 2 · I numeri del Petén
- Titolo: Nel Petén la scuola è ancora una conquista
- Dati (numero in grande, frase sotto, fonte in piccolo con link):
  - **49%** — dei ragazzi in Guatemala finisce la scuola media. *Banca Mondiale, 2024*
  - **82%** — degli adulti sa leggere e scrivere. Quasi uno su cinque no. *Banca Mondiale, 2024*
  - **9,7** — gli anni di scuola che un bambino può aspettarsi. *Banca Mondiale, 2020*
- Chiusa: Per questo lavoriamo accanto a chi insegna, studia e coltiva la terra.

### 3 · Cosa facciamo
- Titolo: Cosa facciamo nel Petén
- **Docenti** (Comparte Universidad): Seminari online con docenti europei per chi studia e insegna al CUDEP, il centro più isolato dell'università pubblica del Guatemala. Dal 2018, oltre 1.500 persone formate.
- **Ragazzi e clima** (Comparte Educación): Cinque moduli sulla crisi climatica per ragazze e ragazzi dai 13 ai 17 anni. La prima edizione, a Nuevo Horizonte con INAB e MARN, ha coinvolto 27 studenti.
- **Comunità** (Comparte Comunidad): Formazione agricola nelle comunità dove zeroCO2 pianta alberi. Terra, raccolti e pratiche utili ogni giorno.

### 4 · Cuba
- Occhiello: L'Havana, Cuba
- Titolo: **Occhiali e medicine, da oltre 4 anni**
- Testo: All'Havana sosteniamo l'asilo per anziani di Belén e le scuole primarie della città e della provincia. Portiamo occhiali da vista e medicine, dove il blocco rende difficile trovarli.
- Bottoni: **El Bloqueo** (→ `/cuba/`) · **Dona ora** (→ `#dona`)

### 5 · Impatto
- Titolo: Quello che abbiamo fatto finora
- **1.500+** persone formate · **46+** comunità rurali raggiunte · **27** studenti nel programma clima · **4+** anni di aiuti a Cuba

### 6 · Chi siamo
- Titolo: Nati a un pranzo, nel 2018
- Testo: Un gruppo di ragazzi italiani e guatemaltechi, seduti a tavola, si è chiesto cosa mancasse davvero alle comunità del Petén. La risposta: educazione di qualità e strumenti concreti. Da lì è nata Comparte, che in spagnolo vuol dire "condividi". Abbiamo cominciato con il cinema: tra il 2018 e il 2020 le proiezioni di Comparte Cinema, con l'ICAIC cubano, hanno raggiunto 7 comunità rurali.
- Direttivo: Andrea Pesce, presidente · Irene Culcasi, vicepresidente · Virgilio Galicia Gregorio, referente in Guatemala

### 7 · Come donare
- Titolo: **Una firma, un bonifico**
- 5×1000: Nella dichiarazione dei redditi firma il riquadro degli enti del Terzo settore e scrivi il nostro codice fiscale **97977810585** [Copia]. Non ti costa nulla.
- Bonifico: Banca Etica · **IT27J0501803200000016738783** [Copia] · Intestato a Comparte · Causale: Donazione liberale. Per donare ogni mese, imposta un bonifico periodico dalla tua banca.
- Nota: Le donazioni vanno a tutte le nostre attività, nel Petén e a Cuba. Sono deducibili o detraibili secondo le regole per gli enti del Terzo settore: conserva la ricevuta.
- Link: Tutti i modi per donare → `/dona/`

### Pagina /cuba/
1. Titolo: Occhiali e medicine all'Havana
2. Chi aiutiamo: l'asilo per anziani di Belén; le scuole primarie della città e della provincia.
3. Cosa portiamo: occhiali da vista e medicine.
4. Perché: due frasi sul blocco statunitense che rende difficile trovare medicine e materiali, con link a elbloqueo.it («El Bloqueo, un progetto che sosteniamo, lo spiega con fonti verificabili»).
5. Come donare: stesso blocco IBAN della home (fondo unico).
6. Foto: vedi APERTO-02 e APERTO-03.

### Pagina /dona/
5×1000 (3 passi, CF da copiare, link al rendiconto), bonifico (IBAN da copiare, bonifico periodico), nota di deducibilità, FAQ complete. In ES/EN la donazione viene prima e il 5×1000 è un riquadro secondario per chi paga le tasse in Italia.

## Design system

- **Font**: Plus Jakarta Sans variabile, self-hosted in `woff2` (niente Google Fonts al caricamento), `font-display: swap`.
- **Scala unica** (fluida con `clamp`, da 375 a 1440 px):

  | Token | Mobile → desktop | Uso |
  |---|---|---|
  | `--fs-display` | 56 → 120 px, peso 800 | titolo apertura |
  | `--fs-h2` | 40 → 72 px, peso 800 | titoli di blocco |
  | `--fs-stat` | 72 → 160 px, peso 800 | numeri |
  | `--fs-h3` | 22 → 28 px, peso 700 | titoli interni |
  | `--fs-body` | 18 px, peso 400, interlinea 1.6 | testo |
  | `--fs-small` | 14 px | fonti, note |

- **Contrasto**: testo inchiostro su arancio, rosa e crema; bianco su blu e inchiostro. Ogni coppia ≥ 4.5:1, verificata da test.
- **Forme**: blocchi con angoli netti, bottoni a pillola alti almeno 48 px, niente ombre, niente card con bordino.
- **Movimento**: solo comparsa leggera dei numeri, spenta con `prefers-reduced-motion`.
- **Immagini**: AVIF/WebP generate da Astro, con `width`/`height`, lazy sotto la piega.

## Tecnica

- Astro 7, output statico, nessun framework JS lato client. JS minimo in vanilla per i bottoni "Copia" e il menu mobile.
- Testi in `src/i18n/{it,es,en}.json`, una sola pagina modello per tipo.
- SEO: `hreflang` reciproci, canonical, `sitemap.xml` generata, `llms.txt`, JSON-LD (`NGO`, `DonateAction` con IBAN, `FAQPage`) generati dai file di testo.
- Deploy: GitHub Action `withastro/action` → GitHub Pages, dominio `www.comparte.it` invariato (CNAME). `concurrency` con `cancel-in-progress`. Il repo è pubblico: i minuti sono gratuiti.
- Newsletter: si riporta il form Mailchimp preparato da Codex (`feat/mailchimp-form`): POST all'`action` quando arriva, niente JS di Mailchimp.
- Test (sostituiscono `scripts/check_home.py`), sul sito costruito:
  - ogni pagina e lingua esiste e risponde;
  - nessuna parola italiana in ES ed EN;
  - hreflang e canonical corretti;
  - JSON-LD valido;
  - CF e IBAN identici ovunque;
  - nessuno script esterno;
  - contrasto dei token colore;
  - redirect e ancore dei vecchi URL.
  Prova di rosso obbligatoria per ogni test.
- Lavoro sul branch `sito-nuovo`. `main` resta online finché Andrea non approva l'anteprima.

## Verifica

Anteprima locale a 375 / 768 / 1440 px con screenshot; Lighthouse mobile su ogni pagina (output raw); test a exit 0; `verificatore` indipendente prima della PR; merge solo dopo la rilettura di Andrea (testi = prodotto).

## Fuori scope

Pagamento con carta (manca il provider), donazioni ricorrenti online, CMS, blog, nuove foto oltre alle due fornite.

## Aperti

- **[APERTO-01]** Il 5×1000: la FAQ attuale dice che i fondi vanno "ai tre progetti attivi in Petén". Con il fondo unico, il 5×1000 può andare anche a Cuba? Finché non risponde Andrea, il testo resta com'è (solo Petén).
- **[APERTO-02]** Foto `IMG_0152`: sulla maglietta si legge uno slogan politico. Proposta: ritaglio sul tavolo con le medicine, senza la scritta. Altrimenti non si usa.
- **[APERTO-03]** Foto `IMG_0180`: si vedono in faccia dei bambini. Serve il consenso della scuola o dei genitori. Proposta: finché non c'è, si usa solo un'inquadratura senza volti riconoscibili (dalle spalle) o nessuna foto.
- **[APERTO-04]** Chiuso il 2026-09-27: Andrea ha confermato in chat che portiamo anche materiale didattico ("si anche materiale didattico"). Testi Cuba aggiornati: occhiali da vista, medicine e materiale didattico.
- **[APERTO-05]** Provider per la carta, non USA e che accetti Comparte: ricerca separata.
