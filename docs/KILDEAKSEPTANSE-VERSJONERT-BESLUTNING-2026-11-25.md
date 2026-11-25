# Versjonert akseptansegrunnlag – kilde- og samtalekvalitet 25.11.2026

**Beslutning pr. 25.11.2026: Ingen formell faglig akseptanse eller produksjonsklarering. Dette er en sporbar beslutningsprotokoll for PR #15.**

## Hvorfor én historisk fem-case-test ikke kan få 5/5 godkjent

Den opprinnelige ekte KI-kjøringen `2026-11-25T13:47:13.670Z` er et reelt testbevis. To observerte feil ble etterpå dokumentert som **`M4=not_met`**:

- `SRC-C-VETERINAER`: Åpningsreplikken forutsatte at begge deltok i samme møte, selv om møtesammensetningen ikke var avklart.
- `SRC-E-ORDINAER`: En foreslått ledereplikk forutsatte formell beslutningsmyndighet som caset ikke oppga.

Disse historiske funnene skal **aldri** markeres `met` i det gamle skjemaet, selv om etterfølgende kodeendringer og omtester er bedre. Derfor er `check-source-acceptance-review.mjs` (som krever `REVIEWED_OK` i alle fem saker fra **samme** kjøring) uegnet som eneste sluttkriterium for dette historiske testsettet.

## Kjøringene som må vurderes separat

| Testløp | Ekte KI-dato | Caser | Status som faktisk er dokumentert | Hva som ikke er bevist |
|---|---|---|---|---|
| Opprinnelig `source-acceptance` | 25.11.2026 kl. 13:47 UTC | A/B/C/D/E | 5/5 maskinelt OK i den opprinnelige kontrollen, senere dokumentert M4-avvik i C/E | Fullstendig kildeordlyd, lovversjoner, menneskelig godkjenning |
| `source-recheck` C/E | 25.11.2026 kl. 14:32 UTC | C/E | 2/2 uten maskinelle signaler etter retting av falskt C-varsel; tekstlig gjennomlesning viser bedre møteform/fullmaktsavklaring | At alle fremtidige KI-svar er riktige eller at profesjonsetisk kildebruk er endelig signert |
| `source-recheck` B/D | 25.11.2026 kl. 15:04 UTC | B/D | 2/2 uten maskinelle signaler; ny NAV-diagnoseside, spesifikk forskrift og høydearbeidsveiledning faktisk vist i svarene | Alle juridiske påstander dokumentert og signert; senere presisering av pliktsubjekt og «hen» bevist av ny ekte modellkjøring |

**A er ikke prøvd på nytt** etter de siste kilde- og promptendringene; det opprinnelige svaret var foreløpig faglig rimelig. Det kan vurderes som et eldre akseptansebevis med tydelig versjons-/datoforbehold, men ingen automatisk formell godkjenning.

## Kildebevis fra originalkjøringen – nyttig korreksjon

Full original-JSON ble lest på nytt etter de 14 kandidatrekkene var generert. Den viser at:

- B4, diagnosepåstand: den eksakte `https://www.nav.no/sykmeldt` var faktisk med som `provider_url` i **oppfølgingen** (bedre enn generell NAV-side som kladden hadde valgt).
- D3, risikovurdering av arbeid i høyden: `AT_WORK_EQUIPMENT_REGULATION` var faktisk med som `model_selected` i **første svar** (spesifikk forskrift § 17-1), selv om kladden hadde valgt generell risikovurdering.

Disse påstandskandidatene kan korrigeres i en **ny** lokal kopi ved hjelp av `scripts/refine-source-claim-draft.mjs`. Kildeproveniens er ikke kildeinnholdsverifisering. Den gamle lokale kladden og originalrapporten overskrives aldri.

## Minimum før PR #15 kan vurderes for merge og pilot

1. **Menneskelig vurdering av de faktiske modelltekstene**, med konkret `manualMust` og `manualCritical` per case og kjøring. Ikke gjenbruk M4-status fra gammel C/E som om den gjaldt den nye responsen.
2. **Kontroller alle materielle rettspåstander, ikke bare de 14 automatisk uttrekkede.** Kildene må finnes i **riktig svarfase** og kontrolleres mot nøyaktig ordlyd. Den opprinnelige kildegjennomgangen dokumenterer også minst fire mulige ytterligere kandidater.
3. **Riktig lov-/avtaleperiode og pliktsubjekt.** For B: se NAVs oppfølging, diagnosegrenser og § 4-6, uten å anta én sammenhengende sykmeldingsperiode. For D: byggherreforskriften §§ 7, 13, 18 og 19, og forskrift om utførelse av arbeid § 17-1. Skill byggherre, koordinator, arbeidsgiver og sikkerhetsansvarlig.
4. **Bruk et eksplisitt, versjonert beslutningsnotat** som peker på hvilken respons som ble godkjent, av hvem, når og mot hvilken originalkilde. Ikke manipuler opprinnelige testfiler og ikke bygg en falsk `5/5 REVIEWED_OK` av forskjellige svar uten å oppgi proveniensen.
5. **Kontrollert pilotverifisering** i egen utviklings-/pilotmiljø etter faglig akseptanse, med brukertest av kildevisning, avklaringer og kildepresisjon. Pilotgodkjenning og produksjonsdeploy må være separate beslutninger.

## Spesifikke gjenstående avvik/forbehold

- `D2`: Byggherren informerer utførende arbeidsgivere om SHA-planendringer (§ 7), mens arbeidsgiver informerer ansatte og verneombud om tiltak (§ 19); ikke skriv «alle berørte» som én uavgrenset plikt for samme rolle.
- `D7`: Ikke utled en generell lovplikt til å stanse ethvert påbegynt arbeid kun av at sikkerheten er «uavklart». Verneombudets stansingsrett (§ 6-3) og arbeidstakers avbruddsplikt (§ 2-3) har konkrete vilkår; praktisk sikkerhetsråd om å avvente risikofylt høydearbeid kan være riktig uansett.
- Ny C/E- og B/D-modelltekst er gjennomlest, men ingen lov- eller fagansvarlig har signert alle `must/critical/claim`-punkter. Eventuelle feil med `han eller hun` og utydelig SHA-pliktsubjekt ble etterpå møtt med nye promptinstruksjoner; denne rettingen er foreløpig bare deterministisk testet.

**Ingen vurdering her autoriserer å fjerne `draft` fra PR #15, slå sammen til `main`, slå på yrkesvalg i produksjon eller kalle kildeinnhold «automatisk verifisert».**

## Status etter kontroll av korrigert lokal kildekladd (25.11.2026)

Brukerens lokale utdata bekrefter at `scripts/refine-source-claim-draft.mjs`
fullførte uten nye KI-kall og opprettet:

`test-results/source-acceptance-manual-review-2026-11-25T13-47-13-669Z-aligned-findings-claim-draft-sources-refined.json`

Dette er nå **den mest presise lokale arbeidskladden** for den historiske
fem-case-testen; den er fortsatt ufullstendig og ikke signert. B4 peker til
NAVs `/sykmeldt`-side synlig i gammel oppfølging, D3 til forskriften om
utførelse av arbeid synlig i gammelt første råd. Tidligere kladder og
observerte C/E-feil er bevart.

### Faktisk kildeinnhold kontrollert i åpne myndighetssider

- [NAV, arbeidsgivers oppfølging](https://www.nav.no/arbeidsgiver/oppfolging-sykmeldte):
  Plan senest fire uker etter oppstart av sykmelding med unntak når åpenbart
  unødvendig; dialogmøte innen sju uker, og behovsvurdering ved delvis
  sykmelding. Frister kan ikke anvendes på tidligere uspesifiserte perioder
  uten dato/varighet.
- [NAV, sykmeldt](https://www.nav.no/sykmeldt): arbeidsgiver kan ikke kreve
  at arbeidstakeren oppgir diagnose, men kan spørre om hvilke arbeidsoppgaver
  vedkommende kan utføre. Dette er **samme URL** som ble vist i det
  historiske B-oppfølgingssvaret.
- [Byggherreforskriften](https://www.arbeidstilsynet.no/regelverk/forskrifter/byggherreforskriften/):
  § 7 gjelder byggherrens SHA-planansvar, § 18 arbeidsgiverens plikter
  under utførelsen, § 19 informasjon til egne arbeidstakere og verneombud.
  Formelle aktørroller må fremgå.
- [Arbeidstilsynet, arbeidsmiljøloven](https://www.arbeidstilsynet.no/regelverk/lover/arbeidsmiljoloven--aml/):
  Arbeidstakerens avbruddsplikt etter § 2-3 og verneombudets stansingsrett
  etter § 6-3 har risikoterskler. Det er ikke en generell automatisk
  lovregel om stans for enhver uavklart sikkerhetssituasjon.
- [Arbeidstilsynets forskrift om organisering, ledelse og medvirkning](https://www.arbeidstilsynet.no/regelverk/forskrifter/forskrift-om-organisering-ledelse-og-medvirkning/):
  kommentaren til arbeidstakers medvirkningsplikt skiller arbeidsevne og
  tilretteleggingsopplysninger fra medisinsk diagnose.

**Dette er konkret dokumentasjon av offentlig kildestøtte, ikke utfylling av
`reviewer`, `claimInventoryComplete`, `sourceExcerpt`, `periodVerified`,
`employerScopeVerified` eller `REVIEWED_OK` i det lokale skjemaet.**
Gjenstår særlig: full dekning av øvrige juridiske utsagn (ikke bare de 14
første kandidatene), kilde-/gyldighetsbevis per svar og manuell vurdering av
alle fagkriterier, inkludert avvik som må stå som `not_met` i den gamle
C/E-kjøringen. Rettede nye modellkjøringer har egen proveniens.


## Fullt case-for-case vurderingsgrunnlag

Se [FEM-CASES-FAGLIG-VURDERINGSMATRISE-2026-11-25.md](FEM-CASES-FAGLIG-VURDERINGSMATRISE-2026-11-25.md).

Dette er en samlet gjennomgang av **alle fem faktiske modellresponsene**
med hvert `manualMust`- og `manualCritical`-kriterium, direkte belegg fra
modellen og relevante originale myndighetskilder. Den peker også ut minst
åtte **supplerende kontrollpunkter** som ikke dekkes uttømmende av
14-påstands-kladden, inkludert uavklart instruksjonsmyndighet i A og
stans-/ansvarsformuleringer i D.

Vurderingene er eksplisitt merket *foreløpige*; ingen formelle statusfelt,
signaturer eller tidligere testresultater er endret. Opprinnelige C/E-feil
står fast. Dette er en dokumentert gjennomgang, ikke `REVIEWED_OK`.
