# Reell KI-omtest – B sykefravær og D byggeplass/SHA – 25.11.2026

**Status: to reelle KI-svarløp uten rapporterte maskinelle avvik. Uavhengig kildesammenligning gjennomført, men INGEN formell påstandsvis sign-off.**

## Testgrunnlag

- Lokal isolert to-case-rapport, tidspunkt `2026-11-25T15:04:56.984Z`.
- `SRC-B-STAT-FRAVAER`: statlig saksbehandler, flere dokumenterte sykefraværsperioder, ingen oppgitt diagnose. Brukeren spør om oppfølgingsplikter og diagnose.
- `SRC-D-BYGG-SHA`: oppdatert SHA-plan mangler etter endret arbeid, høydearbeid skal begynne. Brukeren spør om hvem som har ansvar og hvordan arbeidet skal håndteres.
- Begge hadde `legal_claim_review.needsManualReview:true` og `claimToSourceChecked:false`; dette er riktig. Begge svarløp hadde synlige kuraterte myndighetskilder og null forbudte sektorkilder. Rapporten inneholder ingen maskinelle kontrollpunkter.
- Ekte modellkall ble utført i lokal testserver, ikke Render. Denne rapporten er ikke en produksjonstest.

## B – sykefravær (foreløpig positiv)

**Råd:** Arbeidsevne fremfor diagnose, rolle-/fullmaktsavklaring, dokumentasjon av tiltak og videre oppfølging. Oppfølgingsplan normalt innen fire uker og dialogmøte 1 innen sju uker når betingelsene foreligger.

**Kilder vist i faktisk svar:** Første råd viser `NAV_SAMTALESTOTTE_ARBEIDSGIVER`, `AT_TILRETTELEGGING`, `NAV_SYKMELDT_DIAGNOSE` og `AML_4_6_TILRETTELEGGING`. Oppfølging viser `NAV_SYKEFRAVAER_OPPFOLGING`, `NAV_SYKMELDT_DIAGNOSE`, `AT_TILRETTELEGGING` og `AML_4_6_TILRETTELEGGING`. Kilden `NAV_SYKMELDT_DIAGNOSE` ble altså faktisk inkludert i begge svar denne gangen.

**Originalkildekontroll:**

- [NAV – Slik følger du opp sykmeldte](https://www.nav.no/arbeidsgiver/oppfolging-sykmeldte), «Oppfølgingsplan» og «Dialogmøte 1»: plan innen fire uker med unntak der unødvendig; dialogmøte 1 innen sju uker når relevant. Delvis sykmeldte innkalles ved behov etter kriterier NAV oppgir.
- [NAV – Har blitt sykmeldt](https://www.nav.no/sykmeldt), «Hvem gjør hva»: arbeidsgiver kan ikke kreve diagnose, men kan spørre om arbeidsoppgaver. Denne kilden støtter direkte KI-påstanden om diagnosegrensen og var synlig i oppfølgingen.
- [Arbeidsmiljøloven § 4-6](https://www.arbeidstilsynet.no/regelverk/lover/arbeidsmiljoloven--aml/) om tilrettelegging ved redusert arbeidsevne: plikt på vilkår, så langt mulig.

**Viktig begrensning:** Caset sier flere *perioder* med dokumentert fravær, ikke hvilken konkret aktiv sykmeldingsperiode og grad sykmelding som gjelder. Fire- og sjuukersfristene må ikke presenteres som allerede utløst i dette caset. Modellen sier «når vilkårene er oppfylt» og viser til unntak; det er en vesentlig forbedring. Ingen statlig tariffregel blir oppdiktet, og lederen tillegges ikke uavklart personalmyndighet.

**Foreløpig konklusjon:** Modellens innhold og valgte kilde-ID-er samsvarer i hovedsak med NAV/AML. Ingen åpenbare alvorlige avvik sett i denne omtesten; det erstatter ikke signert full gjennomgang av hvert felt.

## D – SHA på byggeplass (positiv, men rollepresisering anbefalt)

**Råd:** Utsett oppstart ved uavklart risiko, undersøk endringen i arbeidsprosedyren, risikovurder høydearbeidet, avklar fallsikring og andre tiltak, informér berørte og involver riktige ansvarlige. Ikke konkluder med at det *har skjedd* et regelbrudd ut fra usikre fakta.

**Kilder vist i første råd og oppfølging:** `AT_BUILDING_SITE_COORDINATION` (byggherreforskriften), `AT_WORK_EQUIPMENT_REGULATION` (forskrift om utførelse av arbeid), `AT_ARBEID_I_HOYDEN` (spesifikk veiledning), `AT_RISIKOVURDERING`, samt Arbeidstilsynets supplerende side om byggherreforskriften. Dette er vesentlig mer konkret enn første test, som manglet spesifikk kilde til arbeid i høyden.

**Originalkildekontroll:**

- [Byggherreforskriften § 7](https://www.arbeidstilsynet.no/regelverk/forskrifter/byggherreforskriften/): **byggherren** skal sørge for at SHA-plan finnes, holdes oppdatert og at arbeidsgivere/enmannsbedrifter informeres om relevante endringer.
- [Byggherreforskriften § 18](https://www.arbeidstilsynet.no/regelverk/forskrifter/byggherreforskriften/): **arbeidsgiver** skal informere byggherren når risikoforhold eller endringer tilsier behov for SHA-planendring; arbeidsgiver er også ansvarlig for egne risikovurderinger og tiltak.
- [Byggherreforskriften § 19](https://www.arbeidstilsynet.no/regelverk/forskrifter/byggherreforskriften/): **arbeidsgiver** skal informere egne ansatte og verneombud om relevante tiltak på en forståelig måte.
- [Forskrift om utførelse av arbeid § 17-1](https://www.arbeidstilsynet.no/regelverk/forskrifter/forskrift-om-utforelse-av-arbeid): arbeidsgiver må risikovurdere arbeid i høyden, inkludert fallfare, tilkomst, evakuering og lokale risikoforhold, slik at arbeidet kan utføres sikkert.

**Gjenstående språk-/rollepresisering:** Oppfølgingssvaret formulerer «gjennomfør eller oppdater risikovurdering/SJA, ... oppdater SHA-planen og gjør endringene kjent for de berørte». Som praktisk rekkefølge er det riktig, men kan leses som om **arbeidslederen selv** skal oppdatere byggherrens SHA-plan. Formuler heller «be byggherren eller den som har fått delegert oppgaven, sørge for oppdatering av SHA-planen; arbeidsgiveren risikovurderer eget arbeid, informerer byggherren om behov for endringer og informerer sine ansatte». Dette er en presisering av pliktsubjektet, ikke påvist oppfordring til farlig arbeid.

**Stans:** «Før arbeid i høyden starter, bør du holde oppstarten tilbake dersom risikoen fortsatt er uavklart» er et forsvarlig sikkerhetsråd. «Ved akutt fare bør arbeidet stanses etter virksomhetens rutiner» bør ikke leses som at *enhver* uavklart risiko automatisk gir en identisk juridisk stansplikt; ved fare for liv eller helse gjelder særskilte regler. Rådet om ikke å starte arbeid før nødvendige vurderinger er gjennomført er dermed situasjonstilpasset og relevant.

**Foreløpig konklusjon:** Innholdet er vesentlig mer kildespesifikt og rollebevisst enn den gamle modellen. Åpne presiseringen om hvem som formelt oppdaterer SHA-planen; ikke automatisk stempl hele svaret `REVIEWED_OK`.

## Andre kvalitetsobservasjoner

I D-svaret forekommer formuleringen «han eller hun» i en simulert reaksjon. Dersom prosjektets språkpolicy krever *hen* når kjønn er ukjent, bør språkvalget konsolideres i en egen regresjon. Dette endrer ikke det faglige resultatet om risikovurdering.

Målrettet `source-recheck`-rapport hadde tidligere en hardkodet innledning som ba om å kontrollere M4 i *veterinær-/kontorsak*, også ved test av B/D. Dette var en **rapporttekstfeil**, ikke modell- eller kildefeil. Teksten er nå gjort generell og henviser til de valgte casenes egne fagkriterier, med kontrakttest.

## Akseptanse-/leveransestatus

- Historiske feil i C/E forblir dokumentert i den opprinnelige 5-case-kjøringen.
- Ny ekte C/E-omtest hadde 2/2 uten maskinelle varsler etter korrigering av én falsk positiv.
- Ny ekte B/D-omtest hadde 2/2 uten maskinelle varsler, og vesentlig forbedret direkte kildebruk.
- Den originale fem-case-kildekontrollen er fortsatt **IKKE formelt godkjent**; fem-case-skjemaet mangler signert påstandsvis kontroll, kildeutdrag, rettsversjon og arbeidsgiver-/tariffvirkeområde.
- Ingen produksjonsdeploy, ingen automatisk manuelt godkjenning. PR #15 forblir utkast til faglig akseptanse er avklart.

Kildedato: 25.11.2026. Dette dokumentet er en kildekontrollert faglig **arbeidsvurdering**, ikke en erstatning for formell jurist-, HMS- eller virksomhetsgodkjenning.

## Kvalitetsjusteringer etter faglig gjennomlesning

To konkrete, avgrensede endringer i `server.js` er lagt på utviklingsgrenen, ikke produksjon:

1. **SHA-plikt må gis til riktig aktør.** Begge KI-svarløp er nå instruert til å unngå den uavklarte direkte kommandoen «oppdater SHA-planen» til en arbeidsleder uten dokumentert fullmakt. Oppdateringsplikten påligger byggherren etter byggherreforskriften § 7. Arbeidsgiverens plikter til å varsle byggherren og informere egne ansatte knyttes til §§ 18 og 19.
2. **Kjønnsnøytral språkføring.** Når kjønn ikke fremgår av sakens opplysninger, skal KI bruke «hen»/«hens» i beskrivelser av medarbeideres mulige reaksjoner, ikke «han eller hun». Dette retter en mindre språkfeil i ekte D-svar.

Enhetstestene kontrollerer at instruksjonene finnes og er aktive i både første veiledning og oppfølging. De **beviser ikke** at fremtidig ekte KI følger dem hver gang. Den reelle B/D-rapporten fra 15:04 ble ikke redigert eller omstemplet; eventuell ny modellprøve ville kreve separate, eksplisitt godkjente betalte API-kall. Gjenstående påstandsvis og menneskelig akseptanse er fortsatt åpen.
