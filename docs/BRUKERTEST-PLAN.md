# Brukertestplan – Samtalestøtte

**Status:** Pilot / liten brukertest  
**Dato:** 26.10.2026  
**Formål:** Vurdere brukervennlighet, praktisk nytte, opplevd kvalitet i KI-veiledningen, samtalesimulering og tydelighet i personverninformasjonen.

---

## 1. Testdesign

Alle testpersoner får **samme korte brukertest**. Dette gjør svarene enklere å sammenligne og reduserer risikoen for at ulike spørreskjema måler forskjellige ting.

Utvalget er lite og målrettet, ikke representativt. Det kan gjerne inneholde personer med ulik bakgrunn, for eksempel:

- en person som særlig kan legge merke til UX og navigasjon
- en vanlig bruker som vurderer helheten
- personer med relevant leder-, arbeidslivs- eller samtaleerfaring

Eventuell fagbakgrunn gjør ikke svarene til ekstern ekspertvalidering med mindre personens kompetanse og vurderingsgrunnlag faktisk er dokumentert. Slike svar behandles som kvalifiserte brukerinnspill.

---

## 2. Kort instruks til testperson

Testpersonen får beskjed om å:

1. åpne testlenken og logge inn med testtilgang
2. bruke en **oppdiktet eller tydelig anonymisert situasjon**
3. prøve hovedflyten uten veiledning fra utvikleren
4. teste samtalesimuleringen dersom det passer
5. fylle ut den korte brukertesten i løsningen
6. svare så ærlig som mulig, også når noe oppleves dårlig, uklart eller unyttig

Første åpning kan ta litt tid fordi Render-tjenesten kan måtte starte etter inaktivitet. Dette opplyses på forhånd slik at cold-start ikke feilaktig tolkes som at applikasjonen er ødelagt.

---

## 3. Felles spørsmål

Skjemaet bruker 1–5-skala og spør om:

1. hvor enkelt det var å forstå hvordan Samtalestøtte skulle brukes
2. hvor enkelt det var å finne fram og gjennomføre hovedflyten uten hjelp
3. hvor relevant og balansert KI-veiledningen opplevdes
4. hvor konkret og praktisk nyttig rådene var
5. hvor nyttig samtalesimuleringen var som trening
6. hvor tydelig personverninformasjonen var
7. hvor sannsynlig testpersonen ville vært til å bruke løsningen i en reell situasjon dersom vedkommende hadde leder- eller personalansvar
8. viktigste forbedring – fritekst
9. mest nyttig – valgfri fritekst

Testpersoner med relevant leder- eller fagbakgrunn inviteres i fritekstfeltet til å kommentere råd og samtaleteknikk spesielt.

---

## 4. Personvern i brukertesten

Selve svarene lagres i `survey_responses` uten navn, e-post eller `user_id`.

For å hindre at samme konto sender inn skjemaet flere ganger brukes en separat tabell, `survey_participation`, som kun lagrer:

- `user_id`
- tidspunkt for gjennomført test

Det finnes dermed en konto-relatert markering av **at** testen er gjennomført, men ikke en direkte databasekobling mellom denne markeringen og selve svarraden. Både svar og deltakelsesmarkering slettes automatisk etter inntil 365 dager.

Fritekst blir kontrollert for tydelige personopplysninger før innsending. Testpersonene instrueres uansett om å unngå virkelige navn og andre identifiserende opplysninger.

---

## 5. Hvordan resultatene skal tolkes

På grunn av lite og ikke-tilfeldig utvalg skal resultatene brukes **deskriptivt og kvalitativt**, ikke som statistisk dokumentasjon på at produktet fungerer for alle ledere.

Relevant analyse er:

- gjennomsnitt/fordeling på 1–5-spørsmålene
- gjentakende problemer i fritekst
- konkrete UX-hindre
- mønstre i hva brukerne opplever som nyttig
- faglige eller samtalemessige innvendinger som bør undersøkes videre
- forskjell mellom teknisk fungerende funksjon og faktisk opplevd nytte

Negative svar er særlig verdifulle fordi de kan avdekke problemer som automatiske tester ikke finner.

---

## 6. Metodiske begrensninger

Brukertesten har flere begrensninger:

- lite utvalg
- testpersonene rekrutteres av utvikleren
- sannsynlig bekvemmelighets-/målrettet utvalg
- mulig høflighets- og sosial ønskverdighetseffekt
- ikke alle vil teste samme tema eller samme KI-svar
- språkmodellen kan gi ulike svar mellom kjøringer
- Render cold-start kan påvirke førsteinntrykket
- en kort test kan ikke dokumentere langvarig faktisk bruk
- positive faglige vurderinger er ikke det samme som uavhengig ekspertvalidering

Testen brukes derfor som **pilotbrukertesting og forbedringsgrunnlag**, ikke som bevis på generell effekt eller faglig korrekthet.

---

## 7. Etter testperioden

Etter at svarene er samlet inn skal prosjektet:

1. gjennomgå skårer og fritekstsvar
2. skille mellom UX-feil, tekniske feil, KI-kvalitet og faglige/samtalemessige innvendinger
3. prioritere konkrete forbedringer
4. dokumentere hvilke funn som førte til endring – og hvilke som ikke gjorde det
5. kjøre relevante regresjonstester dersom produktet endres
6. beskrive resultatene og begrensningene nøkternt i refleksjonsrapporten

Målet er ikke å få gode skårer, men å finne ut hva som faktisk bør forbedres.


## Pilotfunn 27.10.2026 – første kvalitative tilbakemelding

Første mottatte pilottilbakemelding beskrev løsningen som ferdig og smidig, med lite å utsette på interaksjonsdesignet, men pekte på flere konkrete forbedringsområder:

- **Brukertest-status:** Etter innsending ble visningen raskt erstattet av «Du har allerede sendt inn brukertesten», noe som gjorde testeren usikker på om svaret var registrert. Kodegjennomgang viste at klienten åpnet skjemaet på nytt 250 ms etter vellykket POST. Dette er identifisert som UI/state-feil.
- **Reset mellom saker:** Tidligere situasjonstekst kunne følge med inn i nytt tema etter samtaleøvelse. Kodegjennomgang viste at `pendingSituationText` ikke ble nullstilt ved full reset.
- **Mobil:** Løsningen oppleves ikke ideell på mobil. Dette behandles som UX-/responsivitetsfunn, ikke som dokumentert funksjonsfeil.
- **Begrepskonsistens:** Testeren anbefalte mer konsekvent språk, særlig «simulering» versus «samtale/øvelse/råd» og «identifiserende opplysninger» versus «identifikatorer».
- **KI-språk:** Enkelte formuleringer ble opplevd som robotaktige eller lite naturlige i en reell samtale, eksempelvis uttrykket «det var ikke meningen å stemple deg». Dette følges opp som språk-/promptkvalitet.

Tilbakemeldingen behandles som ett kvalitativt pilotfunn. Den brukes ikke som statistisk dokumentasjon, men som grunnlag for feilretting og senere mønstervurdering når flere svar foreligger.


### Presisering av brukertestfunnet

Testeren beskrev at hun fylte ut deler av skjemaet, gikk ut for å kontrollere noe, kom tilbake, fylte ut resten og trykket Send. Etterpå fikk hun meldingen om at brukertesten allerede var sendt. Kodegjennomgang fant **ingen hendelse som sender skjemaet ved navigasjon bort/tilbake, `pageshow`, fokusendring eller visningsbytte**. Innsending skjer bare ved skjemaets `submit`-hendelse.

Det kan derfor ikke dokumenteres at skjemaet faktisk ble sendt før brukeren trykket Send. Den observerte usikkerheten kan forklares av den bekreftede UI-feilen der en vellykket innsending umiddelbart åpnet statusvisningen igjen. I tillegg manglet klienten sperre mot dobbel innsending mens første POST pågikk; dette er nå sikret med en eksplisitt `surveySubmitting`-guard og deaktivert Send-knapp under innsending.

Funnstatus:
- automatisk innsending ved navigasjon: **ikke funnet / ikke reprodusert i kode**
- misvisende «allerede sendt»-tilstand etter vellykket innsending: **bekreftet**
- mulig dobbelt-submit/race: **teknisk mulig før retting, nå sperret**
