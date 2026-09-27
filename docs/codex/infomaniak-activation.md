# Infomaniak — Comparte, stato del 27 settembre 2026

## Configurazione salvata

Organizzazione Comparte `2296076`, Newsletter `66099`, dominio `comparte.it`. Andrea ha eseguito i login. Nessun account, acquisto, piano, credito o limite di spesa modificato dall'agente. Quota verificata nel pannello: **100 crediti mensili inclusi con kSuite, zero crediti acquistati**. Non è un servizio di invio illimitato.

| Lingua | Modulo | Gruppo | Email e pagine di conferma |
| --- | --- | --- | --- |
| IT | 26059 | Comparte IT | Salvate con grafica Comparte |
| ES | 26060 | Comparte ES | Salvate con grafica Comparte |
| EN | 26062 | Comparte EN | Salvate con grafica Comparte |

Mittente `Comparte <no-reply@comparte.it>`. Conferma a doppio opt-in, token del provider conservato. Marchio tipografico Comparte, fondo crema, titolo blu, pulsante arancione; footer Infomaniak conservato. I PNG del logo risultavano neri nella verifica locale, quindi non sono stati usati nelle email.

Prove: [email IT](evidence/infomaniak/email-it-branded.png), [email ES](evidence/infomaniak/email-es-branded.png), [email EN](evidence/infomaniak/email-en-branded.png), [convalida ES](evidence/infomaniak/validation-es-branded.png), [convalida EN](evidence/infomaniak/validation-en-branded.png).

## Integrazione statica

Le home collegano `/newsletter/`, `/es/newsletter/` e `/en/newsletter/`. Queste pagine hanno una richiesta esplicita di caricamento: nessuna risorsa Infomaniak viene richiesta prima del clic. Il modulo mantiene action, identificativo pubblico, token pubblico di integrazione e due honeypot dell'export reale. Non sono chiavi API dell'account. Mantiene ALTCHA e gli script del provider, incluso jQuery caricato dal provider stesso. Nessun server applicativo, nessuna build.

Export originali: [IT](evidence/infomaniak/form-it-export.txt), [ES](evidence/infomaniak/form-es-export.txt), [EN](evidence/infomaniak/form-en-export.txt). La presentazione è adattata al sito; label email, consenso obbligatorio non preselezionato e link privacy sono aggiunti esplicitamente. I testi nascosti di successo sono tradotti. Il form è nella pagina principale, con `target="_self"`: il precedente iframe del prototipo impediva la visualizzazione della pagina di conferma. L'invio del percorso definitivo è ancora da collaudare; l'assenza dell'iframe risolve la causa strutturale ma non è una prova end-to-end.

Il consenso usa la denominazione legale fornita da Andrea nelle pagine newsletter. Il controllo storico che vieta ONLUS nelle home resta invariato. I controlli di label, consenso e ancora privacy seguono ora la pagina effettiva del modulo: nessun controllo eliminato.

## Privacy e tracking

Testo fornito da Andrea, inserito nelle tre pagine di trasparenza e tradotto. Andrea ha autorizzato a mantenere il tracking e a correggere il paragrafo Statistiche: descrive aperture, clic e dati tecnici associabili al destinatario, senza dichiararli soltanto aggregati. [Testo e revisione](privacy-newsletter-user-draft.md). Non è una certificazione legale.

La [documentazione Infomaniak sul tracking](https://www.infomaniak.com/fr/support/faq/1079/gerer-le-tracking-dune-newsletter-statistiques-douvertures-etc) descrive pixel, link tracciati, IP, posizione approssimativa e dispositivo. Il tracking si imposta per campagna: nessuna campagna è stata creata o inviata. Le [condizioni Newsletter, art. 7.1](https://welcome.infomaniak.com/api/components/cgu/latest?id=48&locale=en_GB) dichiarano hosting e conservazione in Svizzera; non provano l'assenza di altri soggetti nel trasporto delle email. Andrea ha accettato la dipendenza Amazon SES riscontrata nei record DNS.

## Verifiche e limiti

- Una sola prova precedente autorizzata: stato `Non confermato`, ricezione confermata da Andrea, suo clic e successivo stato `Attivo`. Nessun indirizzo personale nei file pubblicabili. Nessuna seconda email inviata automaticamente. Disiscrizione non collaudata.
- [Oracolo nuovo su main: rosso](evidence/infomaniak/main-red.txt). [Branch: 34/35 IT, 37/38 ES, 37/38 EN](evidence/infomaniak/prepared-raw.txt). Tutti i controlli newsletter verdi; unico errore residuo per lingua: link Mollie assente. Nessun verde globale dichiarato.
- [Richieste iniziali, tre home e tre pagine newsletter](evidence/infomaniak/network-initial-raw.json): zero richieste Infomaniak. Sulle home resta il CSS Google Fonts già esistente. [Richieste dopo attivazione ES](evidence/infomaniak/network-after-activation-es.json): script Infomaniak caricati dopo il clic. Log Resource Timing esposto da un harness locale, non un HAR completo.
- Moduli verificati a 390 pixel, nessun overflow. Email e consenso richiesti, consenso non preselezionato; invio con email vuota bloccato nel browser. [Modulo EN](evidence/infomaniak/site-en-form.png), [mobile ES](evidence/infomaniak/site-es-mobile.png). Messaggi nativi del browser seguono la lingua di Chrome; testi del sito e antispam seguono la pagina.
- `git diff --check` e `node --check assets/js/newsletter.js` passano. Lighthouse mobile non rieseguito: il confronto numerico con la baseline resta da fare. Nessun merge o pubblicazione.

## DNS già eseguiti

Con approvazione separata di Andrea, aggiunti in OVH due TXT di verifica e tre CNAME DKIM indicati da Infomaniak. Risposte autoritative corrispondenti; MX/SPF Google e record GitHub Pages conservati. DMARC `p=reject` non applicato. L'avviso di verifica non compare più nel percorso dei moduli e la prova email è arrivata; il badge esplicito del Manager non è stato ricontrollato. Output DNS conservato localmente in `evidence/infomaniak/dns-after-raw.txt`.

## Consegna ancora aperta

1. Seconda prova del modulo definitivo solo dopo autorizzazione di Andrea; verificare risposta e redirect, senza eliminare o modificare l'abbonato già confermato. La prova con un indirizzo già attivo può restituire “già iscritto”, non dimostra un nuovo doppio opt-in.
2. Verifica Lighthouse mobile prima del rilascio. Nessun merge automatico.
3. Aprire le PR richieste quando le operazioni GitHub saranno disponibili. Il comando `gh pr list --state open --json number,title,headRefName,url` è stato rifiutato dalla revisione automatica: `approval required by policy, but AskForApproval is set to Never`. Non aggirato.
4. Mollie resta bloccato fino alla disponibilità del Payment Link reale; Andrea imposta il redirect su `https://www.comparte.it/grazie/`.
