# Prompt da incollare in Codex

```text
Progetto: repo queondache/comparte-website (sito statico comparte.it, GitHub Pages).
Parti da main aggiornato.

Leggi ed esegui il brief: docs/codex/2026-09-26-mollie-mailchimp.md
Rispetta ogni vincolo del brief, in particolare:
- solo Mollie, niente provider USA;
- nessun login e nessun account;
- l'oracolo scripts/check_home.py va aggiornato con prova di rosso, mai aggirato;
- nessun merge automatico.

Dato da Andrea:
MOLLIE_PAYMENT_LINK = <INCOLLA QUI L'URL DEL PAYMENT LINK>

Mailchimp: non hai accesso all'account. Prepara tutto il Task 2 e poi fermati.
Chiedimi i 4 dati del passo 1 (URL action, honeypot, conferma doppio opt-in,
tag del campo lingua).

Ordine:
1. Task 1 (Mollie) → PR feat/mollie-payment-link.
2. Task 2 (Mailchimp) → PR feat/mailchimp-form, ferma al passo 1.

In ogni PR: hash, comandi con output raw, screenshot, cosa resta da fare a me.
```
