# translation-style-rules.md

**Fonte:** `~/.claude/skills/humanizer/SKILL.md` v2.5.1 (Wikipedia "Signs of AI writing").
**Adattamento:** voce Comparte (istituzionale ma viva, no motivazionale americano, no slogan ONG generici).
**Ambito:** ogni testo IT/ES/EN destinato a sito, llms.txt, FAQ, meta description deve passare questa checklist PRIMA di humanizer.py.

---

## REGOLE GLOBALI (tutte le lingue)

### G1 — Voce Comparte
- Mai "viaggio", "percorso", "cammino" come metafora narrativa.
- Mai motivazionale americano ("changing lives", "empowering communities", "uplifting").
- "Comunità contadine" / "comunidades campesinas" / "rural communities" sempre. Mai "villaggi", "tribù", "indigeni" generici (usa "popolazioni indigene del Petén" se rilevante).
- Numeri concreti > aggettivi enfatici. "1.500 persone formate dal 2018" > "innumerevoli persone".
- Citare la fonte quando si fa una claim ("fonte: Comparte Onlus, dati interni 2024" o link esterno).

### G2 — Punteggiatura
- **Em-dash —** vietata nel corpo del testo. Usa virgola, punto, parentesi. Eccezione: titoli/header dove serve respiro visivo (max 1 per pagina).
- Virgolette dritte `"..."` non curve `"..."`.
- Niente **boldface** decorativo. Bold solo per CF, IBAN, dati legali.
- Headings sentence case (`## Chi siamo`), non Title Case (`## Chi Siamo`).
- Niente emoji nei testi narrativi. Footer/UI accettabili (bandiere lingue, social icon).

### G3 — Strutture vietate
- Negative parallelism: "Non si tratta di X, ma di Y" / "It's not just X, it's Y" / "No es solo X, sino Y" → riformula come affermazione diretta.
- Rule of three forzato: "X, Y e Z" quando 2 elementi bastano → taglia.
- "From X to Y" senza scala reale → riformula.
- Domande retoriche come gancio ("Cosa serve davvero al Petén?") → afferma.
- Signposting ("In questa sezione vedremo...") → entra direttamente.

### G4 — Filler vietati
| Vietato | Sostituisci con |
|---|---|
| "vale la pena sottolineare che" | togli, dilo direttamente |
| "in conclusione" / "in conclusion" / "en conclusión" | togli, ultimo paragrafo basta |
| "al giorno d'oggi" / "in today's world" / "hoy en día" | togli o specifica anno |
| "rappresenta una pietra miliare" / "marks a pivotal moment" / "marca un hito" | dì cosa fa, non quanto è importante |

---

## ITALIANO — pattern AI-tipici da rimuovere

### IT-1 — Lessico AI tipico
| Vietato | Sostituisci con |
|---|---|
| tessuto sociale | comunità, abitanti, persone |
| panorama / scenario (astratto) | situazione, contesto, ambito |
| imprescindibile | necessario, indispensabile |
| cruciale / fondamentale / vitale (overuse) | importante, decisivo, oppure togli |
| approfondire / esplorare (verbo metaforico) | studiare, leggere, vedere |
| narrativa / storytelling | racconto, storia |
| testimonianza enduring di | testimonia, dimostra |
| sinergia | collaborazione, lavoro insieme |
| in primis | innanzitutto, prima di tutto |
| de facto / de iure (in testo non legale) | di fatto, di diritto |
| trasformare / trasformazione (overuse) | cambiare, cambio |
| impatto (overuse generico) | risultato, effetto, conseguenza |

### IT-2 — Avverbi sovrabbondanti
"Letteralmente, assolutamente, davvero, veramente, sostanzialmente, fondamentalmente" → tagliare al 90%. Se l'aggettivo è forte non serve l'avverbio.

### IT-3 — Strutture italiane AI-tipiche
- "Non solo X ma anche Y" → "X. E Y."
- "Si tratta di X" come apertura → "X è..."
- "Il fatto che X sia Y" → "X è Y"
- "Per quanto riguarda X..." → "Su X..." o entra diretto
- "Ad oggi, ..." → togli o specifica data

### IT-4 — Frasi-cliché ONG italiane da NON usare
- "fare la differenza"
- "lasciare un segno"
- "costruire un futuro migliore"
- "credere nei sogni"
- "mettere al centro la persona"
- "dare voce a chi non ha voce"
- "investire nelle nuove generazioni"
- "porre le basi per..."

### IT-5 — Voce Comparte specifica
- "Petén" e "Guatemala" sempre con maiuscola.
- "5x1000" senza spazi (no "5 x 1000", no "5×1000" nel testo body — solo nel CTA grafico).
- "ONLUS" maiuscolo. "Onlus" accettabile in nome proprio "Comparte Onlus".
- Numeri italiani: punto migliaia, virgola decimali → "1.500 persone", "0,5%".
- Date: "marzo 2018" non "Marzo 2018" né "03/2018" nel testo narrativo.

---

## ESPAÑOL (LATAM neutro) — pattern AI-tipici da rimuovere

### ES-1 — Españolismi peninsulari VIETATI
| Vietato (peninsular) | Sostituisci (LATAM neutro) |
|---|---|
| disfrutar de | contar con, tener |
| a través de | mediante, por medio de, con |
| a lo largo de (tempo) | durante |
| en aras de | para, con el objetivo de |
| asimismo | también |
| por ende | por eso, por lo tanto |
| amén de | además de |
| coger | tomar, agarrar |
| ordenador | computadora |
| móvil (dispositivo) | celular |
| vosotros / os / vuestro | ustedes / les / su |
| vale (como ok) | está bien, de acuerdo |

### ES-2 — Lessico AI español
| Vietato | Sostituisci con |
|---|---|
| sumergirse en | entrar en, conocer |
| embarcarse en | empezar, comenzar |
| forjar / forjado | crear, construir |
| crisol de | mezcla de |
| panorama (abstracto) | situación, contexto |
| paradigma | modelo |
| sinergia | colaboración |
| holístico | completo, integral |
| robusto (no técnico) | sólido, fuerte |
| empoderar / empoderamiento | dar herramientas, autonomía |
| transformador (overuse) | que cambia, importante |
| crucial / fundamental / vital (overuse) | importante, necesario |
| testimonio perdurable de | demuestra, muestra |
| hito | momento, paso |
| desafío (overuse) | problema, dificultad, tarea |

### ES-3 — Strutture spagnole AI-tipiche
- "No solo X sino también Y" → "X. También Y."
- "Cabe destacar que..." → togli, dilo
- "En este sentido..." → togli
- "Por otro lado..." come connettivo → "También..."
- Future perfecto come hedging "habrá sido..." → presente o pasado simple
- Subjuntivo iperuso in subordinate: "es importante que sea X" → "X es importante"

### ES-4 — Frasi-cliché ONG español da NON usare
- "marcar la diferencia"
- "dejar huella"
- "construir un mundo mejor"
- "creer en los sueños"
- "dar voz a quienes no la tienen"
- "tender puentes"
- "sembrar futuro"

### ES-5 — Voce Comparte specifica ES
- "Comunidades campesinas" / "comunidades rurales del Petén" sempre.
- "Pueblos indígenas" o "comunidades indígenas" (NO "indígenas" come sostantivo a sé — è considerato impreciso/dispregiativo in alcuni contesti LATAM).
- "5x1000" mantieni come è + 1 frase di spiegazione: "mecanismo fiscal italiano que permite destinar el 0,5% del IRPF a una entidad sin ánimo de lucro sin costo adicional".
- Numeri LATAM neutro: punto migliaia, coma decimali (uguale a IT) → "1.500 personas", "0,5%".
- "Ítaló-guatemalteco" senza accento sulla seconda I quando aggettivo composto → "italo-guatemalteco" / "italo-guatemalteca".
- Mai "Latinoamérica" come blocco indistinto se il riferimento è Guatemala — sii specifico.

---

## ENGLISH — pattern AI-tipici da rimuovere

### EN-1 — Lessico AI inglese (full Wikipedia list applicato)
Full ban: actually, additionally, align with, crucial, delve, emphasizing, enduring, enhance, fostering, garner, highlight (verb), interplay, intricate/intricacies, key (adjective overuse), landscape (abstract), pivotal, showcase, tapestry, testament, underscore, valuable (overuse), vibrant.

Aggiunti per contesto NGO/Comparte:
| Vietato | Sostituisci con |
|---|---|
| harness | use |
| leverage | use, apply |
| robust | strong, reliable |
| comprehensive | full, complete |
| holistic | full, all-aspects |
| synergy | collaboration, joint work |
| ecosystem (non-tech) | network, group |
| journey | work, history, path |
| navigate (figurative) | handle, deal with |
| transformative | that changes, important |
| pivotal moment | turning point, key date |
| stakeholders | people involved, partners |
| empower / empowerment | give tools, give autonomy |
| amplify | increase, raise |
| unlock | open, allow |
| ripple effect | spread, knock-on |
| game-changer | major change |
| best-in-class | leading, top |
| world-class | top |
| state-of-the-art | current, modern |

### EN-2 — Frasi-cliché NGO inglese da NON usare
- "make a difference" / "making a difference"
- "change lives" / "changing lives"
- "give back"
- "lasting change"
- "transformative impact"
- "create a better world"
- "give voice to the voiceless"
- "build a brighter future"
- "lift up communities"
- "uplift"
- "pay it forward"
- "be the change"
- "stand together"
- "stronger together"
- "every donation counts" (cliché — usa numeri specifici)

### EN-3 — Hyphenated word pairs (overuse AI)
Per testo Comparte, lascia in 2 parole non-hyphenate dove il senso è chiaro: cross functional, high quality, data driven, decision making, well known, real time, long term. Solo composti tecnici precisi mantengono hyphen (es. "5x1000-eligible").

### EN-4 — Voce Comparte specifica EN
- "5x1000" lower-case x. Prima occorrenza nel documento: "5x1000 (an Italian tax allocation mechanism that lets taxpayers direct 0.5% of their income tax to a nonprofit at no extra cost)". Successive: solo "5x1000".
- Mai tradurre nomi propri: "Petén" (mai "Peten" anglicizzato), "USAC", "CUDEP", "Comparte Comunidad", "Nuevo Horizonte".
- "Italian Tax ID (Codice Fiscale)" come label, poi `97977810585` come dato.
- "Bank account (Italy)" come label, poi `Banca Etica IT27J0501803200000016738783`.
- Date: "March 2018" stile americano, no "18 March 2018" UK style (audience istituzionale globale, US prevale).
- Numeri: virgola migliaia, punto decimali → "1,500 people trained", "0.5% of income tax". (DIFFERENZA da IT/ES.)
- Mai "the company" per Comparte — è "Comparte Onlus" o "the nonprofit" o "the NGO".

---

## CHECKLIST FINALE PER OGNI TESTO TRADOTTO

Prima di passare a humanizer.py:

- [ ] Zero em-dash nel corpo
- [ ] Zero virgolette curve
- [ ] Zero boldface decorativi
- [ ] Zero negative parallelism
- [ ] Zero rule-of-three forzati
- [ ] Zero filler tabella G4
- [ ] Zero parole tabella lessico (IT-1 / ES-2 / EN-1)
- [ ] Zero frasi-cliché ONG (IT-4 / ES-4 / EN-2)
- [ ] Numeri formato corretto per lingua (IT/ES vs EN)
- [ ] Nomi propri mai tradotti
- [ ] CF/IBAN/ragione sociale italiana mai tradotti
- [ ] Spot test "lo direi così a voce?" su 1 paragrafo a campione

Pass-through `humanizer.py` → se ritorna match → riscrivere → ripeti.
Log iterazioni in `translation-log.md`.

---

## REFERENCE

- Wikipedia: Signs of AI writing — fonte principale humanizer skill
- Comparte CLAUDE.md — voce e regole progetto
- humanizer.py — gate finale automatico (Anthropic API + Haiku 4.5)
