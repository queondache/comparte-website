> Aggiornamento 27/09/2026: moduli 26059 IT, 26060 ES e 26062 EN salvati; email e pagine personalizzate. Questo documento conserva le bozze di copy. Stato verificato e limiti in [infomaniak-activation.md](infomaniak-activation.md).

# Moduli Comparte — testi pronti per Infomaniak

Bozza operativa del 27 settembre 2026. Non ancora salvata nel provider. Nessuna informativa legale è redatta in questo file. I link di conferma e disiscrizione devono essere quelli generati da Infomaniak: non sostituirli con URL inventati.

## Configurazione comune

- Tre gruppi separati: `Comparte IT`, `Comparte ES`, `Comparte EN`.
- Tre moduli con lingua corrispondente; solo email obbligatoria, senza nome, telefono o indirizzo.
- Doppio opt-in obbligatorio; nessun contatto considerato confermato prima del clic sul link.
- Consenso non preselezionato e link all'informativa nella lingua del modulo. Attivazione pubblica subordinata al testo legale fornito da Andrea.
- Esportazione HTML da ispezionare: action e nomi dei campi reali, antispam previsto dal provider, nessuna risorsa o script esterno al caricamento. Non rimuovere protezioni per superare l'oracolo.

## IT

Nome interno: `Comparte newsletter IT`. Gruppo: `Comparte IT`.

| Elemento | Testo |
| --- | --- |
| Titolo | Resta in contatto |
| Introduzione | Poche email all'anno sui progetti, sull'uso dei fondi e su come puoi partecipare. |
| Etichetta email | La tua email |
| Pulsante | Iscriviti |
| Dopo l'invio | Controlla la tua email. Per completare l'iscrizione, apri il messaggio di Comparte e conferma. Se non lo trovi, controlla anche lo spam. |
| Oggetto conferma | Conferma la tua iscrizione a Comparte |
| Corpo conferma | Hai chiesto di ricevere le notizie di Comparte. Conferma la tua iscrizione con il pulsante qui sotto. Se non hai fatto tu questa richiesta, ignora questa email. |
| Pulsante conferma | Conferma l'iscrizione |
| Conferma riuscita | Iscrizione confermata. Riceverai le prossime notizie di Comparte. Puoi disiscriverti dal link presente in ogni email. |
| Disiscrizione riuscita | Ti sei disiscritto. Non riceverai più questa newsletter. |

Informativa: `https://www.comparte.it/trasparenza/#privacy`.

## ES

Nombre interno: `Comparte newsletter ES`. Grupo: `Comparte ES`.

| Elemento | Texto |
| --- | --- |
| Título | Mantente en contacto |
| Introducción | Pocos correos al año sobre los proyectos, el uso de los fondos y cómo puedes participar. |
| Etiqueta del correo | Tu correo electrónico |
| Botón | Suscríbete |
| Después del envío | Revisa tu correo. Para completar la suscripción, abre el mensaje de Comparte y confirma. Si no lo encuentras, revisa también la carpeta de spam. |
| Asunto de confirmación | Confirma tu suscripción a Comparte |
| Mensaje de confirmación | Has solicitado recibir las noticias de Comparte. Confirma tu suscripción con el botón de abajo. Si no has hecho esta solicitud, ignora este correo. |
| Botón de confirmación | Confirmar mi suscripción |
| Confirmación completada | Tu suscripción está confirmada. Recibirás las próximas noticias de Comparte. Puedes darte de baja con el enlace de cada correo. |
| Baja completada | Te has dado de baja. Ya no recibirás este boletín. |

Privacidad: `https://www.comparte.it/es/transparencia/#privacidad`.

## EN

Internal name: `Comparte newsletter EN`. Group: `Comparte EN`.

| Element | Copy |
| --- | --- |
| Title | Stay in touch |
| Introduction | A few emails a year about the projects, how funds are used, and how you can take part. |
| Email label | Your email |
| Button | Subscribe |
| After submission | Check your email. To complete your subscription, open the message from Comparte and confirm. If you cannot find it, check your spam folder too. |
| Confirmation subject | Confirm your Comparte subscription |
| Confirmation message | You asked to receive news from Comparte. Confirm your subscription using the button below. If you did not make this request, ignore this email. |
| Confirmation button | Confirm my subscription |
| Confirmation complete | Your subscription is confirmed. You will receive the next updates from Comparte. You can unsubscribe using the link in every email. |
| Unsubscribe complete | You have unsubscribed. You will no longer receive this newsletter. |

Privacy notice: `https://www.comparte.it/en/transparency/#privacy`.

## Verifica prima di collegare il sito

1. Verificare che ogni gruppo e modulo sia realmente salvato e persistente dopo una nuova apertura.
2. Conservare l'HTML esportato e derivare da quello il contratto dell'oracolo. Non usare il vecchio contratto Mailchimp per dichiarare funzionante Infomaniak.
3. Verificare l'email di conferma e le pagine finali nelle tre lingue. La preview non sostituisce un'iscrizione di prova.
4. Con un indirizzo di test autorizzato da Andrea, verificare stato prima e dopo la conferma e la disiscrizione.
5. Salvare comandi e output raw, screenshot e limiti residui nella PR. Mollie resta bloccato sul Payment Link mancante; nessun merge.
