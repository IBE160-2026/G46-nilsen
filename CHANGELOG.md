# Endringslogg – Samtalestøtte

Denne loggen oppsummerer utviklingen av prosjektet Samtalestøtte. Git-historikken er rekonstruert i etterkant basert på lagrede versjoner av prosjektet.

## v1
Første prototype av løsningen.

## v2
Oppdatert grensesnitt og lagt til logo.

## v2-built
Videreutviklet grunnprototype.

## v2-compact
Mer kompakt layout og grensesnitt.

## v2-complete
Samlet og mer komplett prototype.

## v2-exact-photo
Oppdatert hovedbilde.

## v2-petrol-logo
Ny petrolfarget logo og visuell profil.

## v2-petrol-refined
Finjustert petrolfarget design.

## v2-petrol-responsive
Forbedret responsivt design.

## v2-sidebar-topbar
Forbedret sidepanel og toppmeny.

## v2-sokefelt
Lagt til og forbedret temasøk.

## v3-topic-images-scripted
Lagt til temabilder og mer temabasert innholdslogikk.

## v3-visual-topic-pages
Mer visuelle temasider.

## v4-safety-rules
Lagt til sikkerhetsregler for KI-bruk.

## v5-live-suggestions
Lagt til dynamiske forslag.

## v5-useful-under-uncertainty
Forbedret støtte når informasjonen er ufullstendig eller usikker.

## v6-ai-testgrunnlag
Lagt til testgrunnlag og testscenarier for KI-svar.

## v7-two-step-relevance
Forbedret relevansvurdering i to steg.

## v8-samtalepartner
Videreutviklet KI-en fra regelstyrt støtte til mer dialogbasert samtalepartner.

## v9-quick-answers
Lagt til raske svaralternativer for avklaringsspørsmål.

## v10-continuing-dialog
Lagt til mulighet for videre dialog i samme kontekst.

## v10-clean-context
Rettet kontekst mellom nye samtaler slik at informasjon ikke bæres over feilaktig.

## v11-real-ai-stage1
Koblet løsningen til OpenAI API for ekte KI-basert situasjonsforståelse.

## v12-privacy-ux-search
Forbedret personvernkontroll, brukeropplevelse og temasøk.

## v13-privacy-context
Bedre navnegjenkjenning og mer relevante avklaringsspørsmål.

## v14-one-field-privacy-fix
Forenklet løsningen til ett tekstfelt og lagt til automatisk personvernretting.

## v15-ai-diagnostics
Lagt til feildiagnostikk for KI-integrasjonen.

## v16-full-ai-guidance
Koblet ekte KI til hele samtalestøtten, inkludert forslag til åpning, spørsmål, reaksjoner, håndtering og videre oppfølging.

## v17.1
- Forbedret personvernkontroll og navnedeteksjon.
- Endret hovedknappen til «Få råd» og flyttet den nærmere tekstfeltet.
- Byttet ikon til forstørrelsesglass.
- Kortet ned situasjonsforståelsen for å redusere unødvendig tekst.
- Lagt til utvidbar fagbank med myndighetskilder, fagfellevurdert forskning og ledelsesteori.
- Lagt til støtte for faglig grunnlag ved kritiske eller sensitive råd.
- Fjernet synlig «prototype»-tekst fra brukergrensesnittet.
- Forbedret visuell respons når KI arbeider.
- Planlagt at tom avklaringsseksjon skal hoppes over når ingen avklaringer er nødvendige.

## v17.2 – Automatisert KI-testing
- Lagt til automatisk testkjøring av KI-svar.
- Lagt til hurtigtest og full testpakke.
- Testresultater lagres som Markdown og JSON.
- Lagt til automatisk vurdering med statusene OK, BØR SJEKKES og KRITISK AVVIK.

## v17.3 – Stresstest av personalsaker
- Utvidet testgrunnlaget med kompliserte personalsaker.
- Lagt til caser om blant annet rus, prestasjon, motivasjon, oppsigelse, konflikt, sikkerhet, sykefravær og karriere.
- Lagt til 37 stresstest-caser med ulikt risikonivå.

## v17.4 – Forbedret vurdering av påstander
- Forbedret testlogikken for ubekreftede påstander.
- Skiller mellom å gjengi eller avvise en påstand og å presentere den som faktum.
- Reduserte falske kritiske avvik ved blant annet rusmistanke og antakelser om motivasjon.

## v17.5 – Forbedret testmotor
- Lagt til egen status for TEKNISK FEIL.
- Tekniske API- og serverfeil skilles fra faglige KI-avvik.
- Lagt til automatisk nytt forsøk ved enkelte midlertidige feil.
- Forbedret kontroll av diagnoser, negasjoner og usikre antakelser.
- Lagt til egen retest av tidligere problemcaser.

## v17.6 – Justert tematesting og full stresstest
- Gjort tematesten mer fleksibel for faglig plausible temakombinasjoner.
- Beholder kontroll mot klart feil kategorisering uten å kreve én bestemt kombinasjon.
- Retest av fem tidligere problemcaser: 5 av 5 OK.
- Full stresstest gjennomført med 37 kompliserte personalsaker.
- Sluttresultat: 37 av 37 OK, 0 BØR SJEKKES, 0 KRITISKE AVVIK og 0 TEKNISKE FEIL.

## v17.7 – Forbedret KI-flyt
- Hopper over «Kort avklaring» når KI-en ikke trenger oppfølgingsspørsmål.
- Bruker samme tenker-indikator ved første analyse, etter avklaringssvar og i videre dialog.
- Skjuler tom avklaringsseksjon når den ikke er relevant.
- Forbedret flyten slik at brukeren ikke sendes tilbake til «Slik forstår jeg det» etter at råd er generert.
- Forbedret synlighet av KI-arbeid etter oppfølgingssvar.

## v17.8 – Forbedret personvernkontroll for navn
- Forbedret oppdagelse av personnavn i fritekst.
- Små bokstaver i navn, for eksempel «knut», skal kunne oppdages.
- Vanlige rolleord som «personen», «medarbeideren» og «lederen» skal ikke feilaktig tolkes som navn.
- Tvetydige ord og navn, for eksempel «per», vurderes i kontekst for å redusere falske treff.
- Lagt til automatiske personverntester for navnegjenkjenning.
- Testsettet besto 9 av 9 kontroller.

## v17.9 – Forbedret UX og samtaleflyt
- Hovedsiden kan foreslå både hovedtema og undertema fra brukerens første beskrivelse.
- Brukeren kan gå videre uten å måtte beskrive samme situasjon på nytt.
- Tekst fra hovedsiden tas med videre som utgangspunkt i situasjonsfeltet.
- Avklaringsspørsmål kan støtte flervalg når flere alternativer kan være riktige.
- Flervalg gjøres med markerbare knapper som kan slås av og på.
- Forbedret automatisk scroll/fokus til tenker-indikatoren når KI-en arbeider etter avklaringssvar.
- «Slik forstår jeg det» er gjort mer kompakt og bruker mer av tilgjengelig bredde.