# Mollie — preparazione, attivazione bloccata

Andrea ha confermato il 26 settembre 2026 che Mollie deve ancora validare il sistema di pagamento. Non esiste ancora un Payment Link da collegare. Le home, le FAQ e il DonateAction restano fedeli allo stato corrente. Questa bozza non è pronta per il merge.

## Parti pronte

Le pagine `/grazie/`, `/es/gracias/` e `/en/thank-you/` usano header, footer e CSS delle home nella stessa lingua. Hanno noindex, canonical e hreflang reciproci; non sono nella sitemap. Non dichiarano che il pagamento sia riuscito: una pagina statica non può verificarlo.

L’oracolo sostituisce il controllo del bottone in attesa con quello del link Mollie collegato. Nessuna tolleranza per un URL mancante. Il relativo FAIL è atteso e blocca l’accettazione finché manca l’URL. I controlli delle pagine grazie sono rossi su main e verdi sulla preparazione.

## Modifica da applicare quando arriva il link pubblico

Sostituire il bottone carta nelle tre home con un link `.btn-primary`, `href` uguale al Payment Link fornito, `target="_blank"`, `rel="noopener"`, `aria-describedby="card-soon"`. Testo e span `.visually-hidden`:

| Lingua | Testo | Span |
| --- | --- | --- |
| IT | Dona con carta | (si apre in una nuova scheda) |
| ES | Dona con tarjeta | (se abre en una pestaña nueva) |
| EN | Donate by card | (opens in a new tab) |

Testo `#card-soon` pronto:

- IT: Pagamento sicuro con Mollie, un provider europeo. I dati della tua carta non passano dal nostro sito.
- ES: Pago seguro con Mollie, un proveedor europeo. Los datos de tu tarjeta no pasan por nuestro sitio.
- EN: Secure payment with Mollie, a European provider. Your card details do not pass through our site.

Risposta FAQ visibile e JSON-LD FAQPage, identica nei due punti:

- IT: Sì, puoi donare con carta tramite Mollie, un provider europeo. I dati della tua carta non passano dal nostro sito.
- ES: Sí, puedes donar con tarjeta mediante Mollie, un proveedor europeo. Los datos de tu tarjeta no pasan por nuestro sitio.
- EN: Yes, you can donate by card through Mollie, a European provider. Your card details do not pass through our site.

Aggiornare anche la descrizione ES che oggi dice «cuando esté disponible». Nei DonateAction IT/EN conservare il target 5×1000 aggiungendo un EntryPoint con `urlTemplate` uguale al link pubblico (array di target), senza attribuire il pagamento al 5×1000. Aggiungere un DonateAction per la carta in ES, che oggi non lo contiene. Tutti i nuovi valori devono usare il link reale in chiaro, senza encoding o entity.

## Verifiche ancora necessarie

1. Verificare l’URL pubblico con `curl -I` e screenshot; nessun pagamento di prova a carico di Codex.
2. Eseguire l’oracolo nelle tre lingue e conservare l’output tutto verde; confrontare con `evidence/mollie/main-red.txt`.
3. Misurare Lighthouse mobile sulle home prima e dopo il collegamento (riferimenti del brief: IT 95/96/100/100; ES 100/96/96/100; EN 96/96/100/100). Non ancora misurato.
4. Ottenere una review indipendente del commit finale. Questa preparazione non è una review indipendente.

## Cosa resta ad Andrea

- Dopo la validazione di Mollie, fornire il Payment Link pubblico.
- Impostare nella dashboard il redirect su `https://www.comparte.it/grazie/` quando la pagina sarà pubblicata.
- Rivedere e decidere il merge della PR finale; nessun merge automatico.
