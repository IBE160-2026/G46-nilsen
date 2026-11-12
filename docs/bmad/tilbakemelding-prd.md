# Tilbakemelding på PRD

| | |
|---|---|
| **Gruppe** | G46 – G46-nilsen |
| **PRD vurdert** | `docs/bmad/PRD.md` (ingen frontmatter; statuslinje: «Revidert PRD, sluttkontrollert mot faktisk leveransestatus 05.11.2026», sist endret 2026-11-09, commit 157c7e3) |
| **Dato** | 2026-11-12 |
| **Type** | Formativ tilbakemelding, ikke karakter |

## 1. Samlet inntrykk

PRD-en har en tydelig tese (domenespesifikt støtteverktøy, ikke en generell chatbot), ærlige grenser for hva KI-en ikke skal gjøre, og et skille mellom levert og planlagt. Risikoen er formen: dokumentet har vokst som lag på lag med tillegg og leses mer som en leveransestatus enn som krav som UX, arkitektur og stories kan hente fra. De fleste FR-ene sier hva som er bygget, ikke hvordan man ser at de er ferdige.

## 2. Dette fungerer godt

- **Tydelig tese og ærlige grenser.** §2: «Samtalestøtte skal derfor være et domenespesifikt støtteverktøy fremfor en generell chatbot», og §4 lister konkrete ikke-mål («fastslå motiv, skyld eller sannhet i konflikter»). Prinsippet «Anonymiser identitet, ikke nødvendig kontekst» (FR-06) er et reelt designvalg.
- **Ærlig statusmerking.** §7 skiller IMPLEMENTERT / DELVIS / VIDERE ARBEID, §14 sier hva som ikke er gjort, og FR-23 er merket «HYPOTESE – IKKE FERDIG FUNKSJON» med vurderingskriterier. Det gjør at ambisjon ikke utgis for leveranse.
- **Produktspesifikke KI-krav.** Kildeautoritet-tillegget («Akan og IA skal ikke fremstilles som lov», «arbeidsgivertype skal aldri defaultes eller gjettes») og FR-15A med sju nummererte akseptansekriterier er presise og kan bli testtilfeller direkte.

## 3. Oversikt per dimensjon

| Dimensjon | Vurdering | Kort begrunnelse |
|---|---|---|
| Beslutningsklarhet | god | Valg som 56 → 48 undertemaer, FR-23-kriterier og R-01–R-05 er synlige; ingen egen åpne-spørsmål-seksjon. |
| Substans | god | Innholdet er produktspesifikt, men NFR-ene er mest lister uten terskler. |
| Strategisk sammenheng | god | Tesen er klar, men §3 Produktmål er ikke målbare, og det finnes ingen suksessmål eller motmål. |
| Testbarhet | svak | Bare FR-01 og FR-15A har akseptansekriterier; resten bruker «relevant», «tydelig», «så langt som mulig». |
| Scope og avgrensning | god | §4, §14 og §16 er eksplisitte. Sekundære brukere (HR, redaktører) er ikke holdt utenfor v1. |
| Brukbarhet for neste fase | svak | Ingen glossar eller brukerreiser, ID-ene brytes av tilleggslagene, og samme funksjon har flere navn. |
| Formtilpasning | svak | Dokumentet er blitt en leveranserapport (spor, testtall, CI-kjøringer) som blander krav og bevis. |

## 4. Viktigste forbedringer

### 4.1 Gjør FR-ene til testbare krav
- **Alvorlighet:** høy
- **Hvor:** §8 FR-02–FR-14, FR-19–FR-23, f.eks. FR-09 «lese eller fortsette relevante samtaler», FR-04 «unødvendig repetisjon begrenses»
- **Problem og hvorfor det betyr noe:** Uten testbare konsekvenser kan ikke epics/stories få akseptansekriterier, og dere kan ikke vise at et krav er oppfylt. Testfilene finnes, men kravet de dekker er ikke formulert slik at testen følger av det.
- **Forslag:** Bruk samme form som i FR-15A. Eksempel: «FR-09: Innlogget bruker kan slette en samtale i egen historikk. *Konsekvenser:* (1) samtalen vises ikke i listen, heller ikke etter ny innlogging; (2) forespørsel om en annen brukers samtale-ID avvises; (3) sletting kan ikke angres.» Gjør det samme for FR-06: «Teksten ‹Ola Hansen, tlf 900 00 000› i situasjonsfeltet gir varsel i klient, og serveren sender den ikke uendret til KI.»

### 4.2 Samle kravene i én stabil struktur
- **Alvorlighet:** høy
- **Hvor:** §19 «Oppsummering» etterfulgt av «Tillegg», «Produksjonstillegg», «Pilotkrav 30.10.2026», FR-19–FR-23, FR-15A, «NFR – modulær frontend-styling» (uten ID)
- **Problem og hvorfor det betyr noe:** Krav etter §19 er skrevet som patcher med dato i overskriften. UX og stories vil gå glipp av dem, og dokumentet svarer ikke på «hva gjelder nå?». Flere krav har blandede ID-serier (FR, AI, NFR, T, R) og noen mangler ID.
- **Forslag:** Flytt FR-15A, FR-19–23 og tilleggene inn i §8/§10 med løpenummer og gi hvert krav ID. Flytt testtall, CI-kjøringsnummer, commit-hasher og «spor i repoet» ut i et eget vedlegg (f.eks. `docs/bmad/PRD-status.md`). PRD-en beholder da bare krav, og vedlegget er beviset.

### 4.3 Legg til målbare suksessmål med motmål
- **Alvorlighet:** medium
- **Hvor:** §3 «gi konkret og situasjonstilpasset KI-støtte», §12 punkt 1–18
- **Problem og hvorfor det betyr noe:** Produktmålene sier ikke hvordan dere ser at produktet virker for lederen. §12 sjekker at funksjoner finnes, ikke at de gir verdi.
- **Forslag:** To–tre mål knyttet til FR-er, f.eks. «SM-1: alle 9 hovedtemaer har minst én golden-case uten kritisk avvik i siste kjøring (validerer FR-15)», «SM-2: i piloten fullfører X av Y deltakere hovedflyten uten hjelp (FR-01–04)». Motmål: «SM-C1: andel svar med bastante juridiske konklusjoner skal ikke økes for å få høyere ‹nyttescore›».

### 4.4 Innfør glossar og minst to brukerreiser
- **Alvorlighet:** medium
- **Hvor:** §8 FR-03 «KI-basert hovedveiledning», FR-05 «Samtaleøvelse (samtalesimulering)», FR-20 «Utskrift av samtalestøtte», §5 «Primærbruker»
- **Problem og hvorfor det betyr noe:** «Samtalestøtte» er både produktnavn og en funksjon, og simulatoren heter samtaleøvelse, samtalesimulering og simulator. Arkitektur og stories vil gi dem ulike navn i kode og UI. Brukerreiser mangler, så UX må gjette rekkefølgen.
- **Forslag:** Definer 8–10 termer (Situasjon, Tema/Undertema, Hovedveiledning, Oppfølgingsdialog, Samtaleøvelse, Personverngateway, Faggrunnlag, Rolle). Skriv to reiser med en konkret leder, f.eks. «Mia skal ha en samtale om gjentatt fravær i morgen …», og la FR-ene henvise til dem («realizes UJ-1»).

### 4.5 Gjør KI-kontroll, kostnad og testmodus til krav
- **Alvorlighet:** medium
- **Hvor:** NFR-01 «rate limiting», FR-12 «kostnadsinformasjon», T-07 «KI-testene gjør faktiske modellkall»
- **Problem og hvorfor det betyr noe:** Hva som skjer ved usikre svar, hva en økt får koste, og at appen kan kjøres uten nøkler, står i dokumentasjonen men ikke som krav. Dermed kan det falle ut ved endringer.
- **Forslag:** Eksempel: «Appen kan startes i demomodus med deterministiske svar uten API-nøkkel; `npm test` gjør ingen eksterne KI-kall.» «Når svaret mangler faglig grunnlag, skal det si det eksplisitt og anbefale HR/jurist (AI-04).» Sett en konkret grense for rate limiting og beskriv hva brukeren ser ved feil eller budsjettstopp.

## 5. Mekaniske funn

- **ID-brudd:** FR-15A og FR-19–23 står etter §19; «NFR – modulær frontend-styling», «Kildekrav – profesjonsavgrensning» og «Tillegg 08.11.2026» har ingen ID. NFR-QA-01 følger ikke NFR-01–05-mønsteret.
- **Tall som ikke stemmer:** personvern oppgis som 33/33 og 56/56 (FR-06) og 73/73 (T-01, §13); golden-bank som 9, 21, 26 og 66 caser (T-07). Det er forklart som historikk, men er forvirrende i et kravdokument.
- **Datering:** statuslinjen sier «sluttkontrollert 05.11.2026», men innholdet omtaler 08.–09.11.
- **Glossar:** se 4.4. Ingen `[ASSUMPTION]`-tagger eller antakelsesindeks; ingen UJ- eller SM-ID-er å henvise til.
- Jeg fant ingen nøkler eller personopplysninger i PRD-en.

## 6. Før dere går videre

**Må avklares før UX/arkitektur/epics:** hvilke FR-er som er kjerne i v1 og hvilke som er utvidelser (yrkeskontekst, web/kildeanalyse, benchmark, FR-23); om sekundære brukere (HR, redaktør) hører til v1; og de målbare suksesskriteriene i 4.3.

**Kan vente:** lokal RAG/intern KI, tale i samtaleøvelse og native-løsninger (allerede plassert i §16).

**Oppfølging av briefen-tilbakemeldingen:** *delvis.* Statusmerkingen og §16 skiller mellom levert og planlagt, og taksonomien er oppdatert til 48 undertemaer. Dere har ikke delt scope i «kjerne» og «utvidelser», suksesskriteriene er ikke omskrevet til målbare «brukeren kan …»-form, og rekkefølgen prototype → BMAD er ikke omtalt i PRD-en («utviklet iterativt» i §19 er for vagt).

## 7. Refleksjonsspørsmål

1. PRD-en er skrevet etter at mye av koden fantes. Hva i kravene kom fra brukerbehov, og hva er beskrivelse av det KI-assistenten allerede hadde bygget? Hvordan kan dere se forskjellen?
2. Dere godtok «IMPLEMENTERT» på mange krav. Hvem har kontrollert at testene faktisk dekker kravteksten, og hva ville dere endret for at en ny gruppe kunne gjøre den kontrollen på ti minutter?

_Vurdert mot kvalitetsrubrikken i bmad-prd. Dette er veiledning, ikke sensur._
