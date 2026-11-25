# Manuell kildeakseptanse – vurderingsprotokoll

**21.11.2026 · PR #15 · Status: testprotokoll, ikke ferdig faglig kontroll**

## Formål

En grønn GitHub Quality Gate viser at koden, kilderutingen, API-kontraktene og testdoblene oppfører seg som forutsatt. Den viser **ikke** at KI-rådenes lovpåstander er riktige eller at en lenket kilde støtter den aktuelle setningen.

En reell akseptansesak skal derfor gjennom fire uavhengige vurderinger:

1. **Teknisk funksjon:** Analyse → første råd → oppfølgingsspørsmål, med sporbar kildeproveniens.
2. **Samtalefaglig kvalitet:** De konkrete `manualMust`-punktene oppfylles, uten å anta faktum eller diagnostisere.
3. **Kritiske feil:** Hver `manualCritical`-risiko undersøkes uttrykkelig, inkludert feil lovhjemmel, sektor og tariffområde.
4. **Påstandsvis dokumentasjon:** Hvert kategoriske utsagn om rett, plikt, frist, sats eller avtale må sammenholdes med **ordlyden** i en originalkilde som er synlig i **samme svar**. Noter kildeutdrag, versjon/dato og virkeområde.

## Gjennomføring

Den opt-in kjøringen med ekte KI bruker fem syntetiske saker i `tests/AI-SOURCE-ACCEPTANCE-CASES.json`; den krever en lokal API-nøkkel, flagget `--run-live` og en eksplisitt kostnadsbekreftelse. **Den lokale prøven ble rapportert gjennomført 25.11.2026 (5/5 uten maskinelle avvik); formell manuell godkjenning er fortsatt ikke utført.** Ikke legg API-nøkler i Git, CI eller dokumentasjon.

En faktisk kjøring av `npm run test-ai:source-acceptance -- --run-live`, med `SOURCE_ACCEPTANCE_LIVE=I_ACCEPT_API_COSTS` satt lokalt, produserer tre filer i Git-ignorert `test-results/`:

- `source-acceptance-<tid>.json`: faktiske genererte svar og maskinelle testfunn.
- `source-acceptance-<tid>.md`: lesbar gjennomgang og faglig fasit for kontrolløren.
- `source-acceptance-manual-review-<tid>.json`: et **åpent, uutfylt** vurderingsskjema for de samme fem sakene.

Behold originalen fra KI-kjøringen uendret. Utfyll bare vurderingsskjemaet. Én kilde-URL som først kom i oppfølgingssvaret kan ikke brukes til å legitimere et annet kildeutvalg som manglet i første svar.

## Skjemaets felter

- `reviewer` og `reviewedAt`: hvem som vurderte saken (kontrollørkode er nok), og hvilken dag.
- `must[]`: for hvert uforanderlig, casetilpasset kriterium: `status: "met" | "not_met"` og en faglig begrunnelse i `reason`.
- `critical[]`: for hver definert alvorlig feil: `status: "absent" | "present"` og en konkret undersøkelse i `reason`.
- `claimInventoryComplete`: settes først etter at hele første råd og oppfølging er gjennomlest og samtlige materielle rettsutsagn kartlagt.
- `claims[]`: én post per relevant rettsutsagn med følgende felter:

| Felt | Krav |
|---|---|
| `answerPart` | `"first"` eller `"followup"` |
| `claimText` | Nøyaktig tekst fra det respektive genererte KI-svaret |
| `sourceUrl` | Eksakt kilde-URL som ble vist i det **samme** svaret |
| `sourceExcerpt` | Konkret utdrag som kontrolløren selv fant i originalkilden |
| `sourceCheckedAt` | Dato for kontroll av kildens faktiske ordlyd (ÅÅÅÅ-MM-DD) |
| `periodVerified` + `periodEvidence` | Bekreft gyldighet og skriv hva som knytter dokumentet til riktig tidsperiode |
| `employerScopeVerified` + `scopeEvidence` | Bekreft virkeområde og dokumenter arbeids-/tariffmessig tilknytning |
| `verdict` | `"supported"`, `"unsupported"` eller `"unclear"` |
| `reason` | Begrunn hvorfor det angitte utdraget støtter eller ikke støtter akkurat denne påstanden |

Dersom KI-svaret **ikke** har materielle lov-/tariffpåstander, skal dette bekreftes med `noMaterialClaims: true`, tom `claims` og fullført kartlegging. Dersom det automatiske varselet likevel slo ut, må `falsePositiveExplanation` konkret begrunne hvorfor treffet var et falskt positivt. Dette er et unntak, ikke en måte å hoppe over kildekontrollen.

**Det er ikke nok å krysse av `periodVerified: true` uten å beskrive hvilken periode som ble sjekket.** Tilsvarende må arbeidsgiver-/tariffdekning beskrives, ikke bare bekreftes med en boolsk verdi.

## Formell kontroll av utfylt skjema

Bruk de to filene fra **samme** KI-kjøring:

```bash
npm run check-source-acceptance-review -- test-results/source-acceptance-<tid>.json test-results/source-acceptance-manual-review-<tid>.json
```

Kommandoen gir følgende tilstander for hver sak:

- `PENDING_REVIEW`: manglende eller utilstrekkelig dokumentasjon; ingen faglig godkjenning.
- `REJECTED`: maskinelt avvik, et kritisk funn, et ikke oppfylt fagkrav eller en påstand som originalkilden ikke støtter sikkert.
- `REVIEWED_OK`: skjemaet er formelt komplett, kontrolløren har dokumentert positive vurderinger og ingen kritiske feil er registrert. **Dette er ikke en selvstendig maskinell attest på at kildeteksten eller konklusjonen er sann.**

Hele akseptansepakken får exit-kode 0 bare når alle fem saker er `REVIEWED_OK`. Faglig ansvarlig må likevel lese dokumentasjonen og vurdere om den er troverdig. Skjemaet kan kontrollere tilstedeværelse, sammenheng, presise svarhenvisninger og rapporterte funn; det kan ikke automatisk bevise at det siterte utdraget faktisk finnes på siden eller tolkes korrekt.

## Avvik og beslutning

**Et alvorlig avvik krever utbedring og ny kjøring av hele berørt svarløp**, ikke bare en omskriving av vurderingsskjemaet. Oppbevar både avviksversjonen og resultatet av omtesten utenfor Git. Ikke merge PR #15, og ikke slå på yrkestilpasning i produksjon, på grunnlag av en grønn mock-test alene.

## Testgrunnlag og ærlig avgrensning

`tests/test-source-acceptance-manual-review.cjs` kontrollerer kontrakten med **oppdiktede** data. Den må avvise manglende kildeutdrag, feil svarløp, andre kilde-URL-er, uklar historisk gyldighet, ikke bekreftet virkeområde, kritiske funn, manglende obligatoriske punkter, kildeavvik og vurderingsfiler fra feil testkjøring. At en syntetisk test får `REVIEWED_OK` betyr bare at kontrollreglene fungerer når feltene er utfylt, **ikke** at en menneskelig fagvurdering er utført.

## Foreløpig kontroll av faktisk lokal KI-prøve – 25.11.2026

Brukeren gjennomførte fem ekte modellscenarioer i lokal testprosess og delte den genererte, lesbare Markdown-rapporten (rapporttid 2026-11-25T13:47:13Z). Alle fem fikk «MASKINELT OK», null tekniske feil. Test-JSON med samtlige felter og det uutfylte manuelle vurderingsskjemaet ble **ikke** gjennomgått her. Ingen av sakene settes til `REVIEWED_OK` ved denne stikkprøven.

| Sak | Foreløpig vurdering av synlig rapportutdrag | Kontrollpunkt |
|---|---|---|
| A: utestenging i butikk | Ingen åpenbar alvorlig feil: undersøkelse/kontradiksjon før advarsel; relevant Arbeidstilsynet-kilde | Varsel for kategorisering av advarsel som disiplinærreaksjon manglet |
| B: sykefravær i staten | NAVs 4- og 7-ukersfrister, skille mellom funksjonsevne og diagnose, og forbehold om aktuell sykmeldingsperiode ble funnet i NAVs veiledning | Juridiske plikter i oppfølging fikk feilaktig `needsManualReview:false` |
| C: veterinærers uenighet | DNVs profesjonsetiske retningslinjer om kollegialitet brukes som veiledning, ikke lov; ingen påstand om feilbehandling | Sjekk faglige unntak hvis senere opplysninger gir pasientsikkerhetsrisiko |
| D: SHA-arbeid | Arbeidstilsynets regelverk støtter kontinuerlig oppdatering av SHA-planen, risikovurdering og særskilte roller for byggherre og arbeidsgiver | Forpliktende SHA-/rolleutsagn i både første råd og oppfølging fikk feilaktig `needsManualReview:false` |
| E: ordinær arbeidsdeling | Råd om forventninger, oppgavefordeling og oppfølging uten irrelevante kilder | Ingen kilde eller juridisk varsel nødvendig i synlig utdrag |

Stikkprøvede originalkilder 25.11.2026:
- https://www.arbeidstilsynet.no/arbeidsmiljo/organisatorisk-arbeidsmiljo/personalsaker/
- https://www.nav.no/arbeidsgiver/oppfolging-sykmeldte
- https://www.nav.no/arbeidsgiver/samtalestotte-arbeidsgiver
- https://www.vetnett.no/5-3-veterinaeren-og-kollegialitet/category1568.html
- https://www.arbeidstilsynet.no/hms/hms-i-bygg-og-anlegg/byggherreforskriften/
- https://www.arbeidstilsynet.no/risikofylt-arbeid/arbeid-i-hoyden/

**Teknisk funn:** `src/server/legal-claim-review.js` gjenkjente ikke flere kategoriske plikter, frister skrevet med bokstaver, diagnosebegrensning og SHA-ansvarsformuleringer, selv om `claimToSourceChecked` korrekt sto som `false`. Varselmønstrene er utvidet, og `tests/test-legal-claim-review.cjs` har fått regresjoner med de anonymiserte formuleringene fra testen. Dette forbedrer signaldeteksjonen; det dokumenterer **ikke** automatisk juridisk korrekthet. Ingen betalt KI-omtest er foretatt etter endringen.

**Fortsatt åpent:** Hele KI-resultatet (inkl. alle førstegangsfeltene), påstandsvis kildeutdrag, korrekt historisk rettsversjon og arbeidsgiver-/tariffvirkeområde må kontrollføres i den lokale manuelle JSON-filen. Ikke merge PR #15 eller deploy til produksjon på grunnlag av denne delvise vurderingen.

## Utvidet gjennomgang av komplett JSON-resultat 25.11.2026

Den faktiske, anonymiserte JSON-rapporten fra den lokale kjøringen ble gjennomgått etter den opprinnelige Markdown-stikkprøven. Den inneholder `analysis`, hele `guidance` (inkl. spørsmål, reaksjoner, forberedelser og neste steg), `followup`, kildeopphav og varsler for alle fem sakene. `issues: []` i samtlige fem saker betyr bare at maskinell evaluator ikke fant kontraktbrudd. Det foreligger **ingen ferdig utfylt, formelt godkjent originalkildekartlegging**.

| Case | Samtalefaglig vurdering av hele svarløpet | Gjenstående kontroll |
|---|---|---|
| SRC-A | Skiller tydelig mellom ansattes opplevelse og fakta; oppfordrer til konkrete hendelser, begge parters versjoner og begrenset informasjonsdeling. Første råd/oppfølging bruker relevante Arbeidstilsynet-kilder og AML § 4-3. | «Skriftlig advarsel er en disiplinærreaksjon» bør gjenkjennes som rettslig/HR-påstand. Enkel kilde-URL fra provider er ikke uavhengig faktasjekk. |
| SRC-B | Tilrettelegging uten diagnosepress; aktuell sykmeldingsperiode er uttrykkelig uavklart. NAV bekrefter normalt oppfølgingsplan innen fire uker og dialogmøte 1 innen sju uker, med forbehold. | Originalrapporten manglet kontrollvarsel for oppfølgingsplikt, 4-/7-ukersfrister og diagnose. Varseldetektor er nå forbedret, men ny betalt kjøring er ikke utført. |
| SRC-C | Skiller profesjonsetisk kollegialitet fra lov, antar ikke feilbehandling og anbefaler separate samtaler i videre råd. DNV-kildene er relevante. | Første `opening` starter «Takk for at dere møter», selv om møtesammensetning er ukjent og første runde kan være separat. Nye instruksjoner skal ikke automatisk anta felles møte. |
| SRC-D | Prioriterer å avvente/stans risikofylt arbeid ved uavklart sikkerhet; skiller byggherre, koordinator og arbeidsgiver. Byggherreforskriften er relevant. | Bindende SHA-/ansvarsutsagn var ikke merket for manuell kontroll i originalkjøringen. Kontrollér eksakt forskriftsgrunnlag, roller og konkrete sikkerhetstiltak før formell godkjenning. |
| SRC-E | Gir konkrete råd uten irrelevant lov-/kildeinflasjon. Avklarer arbeidsdeling, forventninger og oppfølging. | Analyse sier at beslutningsmyndighet er uavklart, men en foreslått `leader_response` sier «Før jeg bestemmer». Nye instruksjoner skal skille arbeidslederrollen fra formelle fullmakter. |

**Supplerende prosessfunn:** Fire av fem `analysis`-objekter har `needs_clarification:true`. Den tekniske akseptanserunneren sender likevel `followups:{}` til veilednings- og oppfølgingsrutene. Kjøringen tester derfor KI-robusthet ved uavklart informasjon, **ikke** hele den interaktive brukerreisen med faktisk besvarte avklaringsspørsmål. Dette skal ikke omtales som en komplett sluttbrukerakseptanse.

**Utbedring på utviklingsgrenen:** `server.js` har fått særskilt promptvern mot ubegrunnet fellesmøte og ubegrunnet personal-/beslutningsfullmakt, og `test-guidance-quality` bekrefter at vernene fortsatt finnes i prompten. `tests/AI-SOURCE-ACCEPTANCE-CASES.json` har nye menneskelige vurderingskriterier for SRC-C og SRC-E. Disse automatiske kontrakttestene **beviser ikke** at neste ekte modellrespons følger instruksjonen. PR #15 skal fortsette som draft inntil reell modell-/menneskekontroll etter rettingene.

Autoritative kilder som ble brukt til ekstern stikkprøve: [NAV: oppfølging av sykmeldte](https://www.nav.no/arbeidsgiver/oppfolging-sykmeldte), [NAV: sykmeldt](https://www.nav.no/sykmeldt), [Arbeidstilsynet: personalsaker](https://www.arbeidstilsynet.no/arbeidsmiljo/organisatorisk-arbeidsmiljo/personalsaker/), [Arbeidstilsynet: byggherreforskriften](https://www.arbeidstilsynet.no/regelverk/forskrifter/byggherreforskriften/), [DNV: veterinæren og kollegialitet](https://www.vetnett.no/5-3-veterinaeren-og-kollegialitet/category1568.html). Ingen kilde ble automatisk knyttet til hver setning med faktisk bekreftet utdrag; formell vurderingsprotokoll er fortsatt åpen.
