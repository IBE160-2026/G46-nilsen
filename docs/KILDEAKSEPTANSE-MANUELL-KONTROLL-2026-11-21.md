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

Den opt-in kjøringen med ekte KI bruker fem syntetiske saker i `tests/AI-SOURCE-ACCEPTANCE-CASES.json`; den krever en lokal API-nøkkel, flagget `--run-live` og en eksplisitt kostnadsbekreftelse. **Dette er ennå ikke utført som del av PR #15.** Ikke legg API-nøkler i Git, CI eller dokumentasjon.

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
