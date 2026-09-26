# Mailchimp — Task 2 fermo al passo 1

Branch `feat/mailchimp-form`, basato su `feat/mollie-payment-link`. La futura PR deve avere quest’ultimo come base, finché la PR Mollie non sarà integrata da Andrea. Nessun account, login, script Mailchimp, API o invio di dati è necessario per questa preparazione.

## I quattro dati richiesti ad Andrea

Da Mailchimp → Audience → Signup forms → Embedded forms:

1. URL `action` pubblico, nel formato `https://<dc>.list-manage.com/subscribe/post?u=…&id=…`.
2. Nome del campo honeypot, nel formato `b_<u>_<id>`.
3. Conferma che il doppio opt-in è attivo.
4. Tag del campo lingua, se esiste; altrimenti confermare che non è previsto.

## Preparazione presente

Le tre home hanno `method="post"`, `target="_blank"`, `rel="noopener"`, campo `EMAIL`, consenso obbligatorio e validazione HTML nativa (rimosso `novalidate`). Il campo honeypot è predisposto, invisibile e fuori dall’ordine di tabulazione, senza un nome inventato. Email, consenso, honeypot e submit restano disabilitati; manca intenzionalmente l’action. Nessun input può essere compilato/inviato accidentalmente premendo Invio durante questa attesa.

Le ancore `/trasparenza/#privacy`, `/es/transparencia/#privacidad`, `/en/transparency/#privacy` esistono. Sono solo segnaposto e dichiarano che le iscrizioni non sono attive. Il consenso ES punta ora a `#privacidad`.

## Modifiche da applicare dopo i dati

1. Inserire l’action esatto nei tre form; eliminare `data-mailchimp-action=""`. Non inserire chiavi API. L’URL deve restare pubblico e in chiaro; nessun encoding per aggirare i controlli.
2. Dare al campo honeypot il nome ricevuto, mantenendo `type="text"`, `class="visually-hidden"`, `aria-hidden="true"`, `tabindex="-1"`, `autocomplete="off"` e `value=""`. Se esiste il tag lingua, aggiungere un input hidden con quel nome e valore `it`, `es` o `en`.
3. Dopo conferma del doppio opt-in e pubblicazione del testo privacy approvato da Andrea, rimuovere `disabled` dai campi e dal submit. Nessuno script di Mailchimp.
4. Sostituire `#nl-soon` con i testi sotto. Eseguire l’oracolo, la registrazione network e Lighthouse mobile sul commit finale. Al momento non esiste prova verde del collegamento.

Testi pronti:

| Lingua | Testo `#nl-soon` |
| --- | --- |
| IT | Riceverai un’email: conferma la tua iscrizione. Il modulo si apre in una nuova scheda. |
| ES | Recibirás un correo: confirma tu suscripción. El formulario se abre en una pestaña nueva. |
| EN | You will receive an email: confirm your subscription. The form opens in a new tab. |

## Privacy: serve il testo legale

Andrea deve fornire l’informativa approvata nelle tre lingue, con menzione di Mailchimp (Intuit, USA) e valutazione dei riferimenti DPF/SCC richiesti dal brief. Qui non viene scritta né attestata un’informativa legale. I segnaposto non equivalgono a un’informativa valida.

## Accettazione finale ancora aperta

- Il controllo `form Mailchimp collegato` deve passare solo con action reale, submit/campi abilitati e honeypot che corrisponde ai parametri u/id. `ancora privacy esistente` passa già nelle tre lingue. I controlli rossi su main e lo stato corrente sono in `evidence/mailchimp/`.
- Ripetere il log network dopo l’action reale: nessuna richiesta Mailchimp prima dell’invio. La prova registrata ora riguarda solo la preparazione disabilitata.
- Andrea esegue l’iscrizione di prova con la propria email: prima `pending`, dopo conferma `subscribed`.
- Misurare Lighthouse mobile prima/dopo l’attivazione e ottenere review indipendente sul commit finale. Non ancora eseguiti.
- Andrea rilegge e decide il merge. Nessun merge automatico.
