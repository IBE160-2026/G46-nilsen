# Påstandsvis kildegjennomgang – 14 kandidater, 25.11.2026

**Status: uavhengig gjennomgang mot offentlig tilgjengelige original-/myndighetskilder, ikke signert juridisk eller faglig akseptanse.**

## Metode og avgrensning

De 14 kandidatene nedenfor er hentet fra eksakt ordlyd og kilde-ID-er i `scripts/prepare-source-claim-draft.mjs`. Den lokale kjøringen har bekreftet at hver påstand finnes i sin respektive gamle KI-respons og at kilde-ID-en ble vist i **samme svar**. **Dette dokumentet verifiserer ikke at den lokalt genererte `-claim-draft.json` er komplett.** Den fulle analyse-/veiledningsteksten og relevante avtale- og rettsperioder må fortsatt kontrolleres.

Jeg undersøkte aktuelle offentlige myndighetssider 25.11.2026. Tabellen vurderer om innholdet **i hovedtrekk** støttes, og varsler presisjonsfeil. Den godkjenner **ikke** kilder i evalueringsfilen: `sourceExcerpt`, `sourceCheckedAt`, `periodVerified`, `employerScopeVerified`, `verdict`, `reviewer`, `claimInventoryComplete` og de øvrige faglige kriteriene står uendret.

### Oversikt over 14 påstander

| Nr. | KI-svar / påstand (kort identifikasjon) | Valgt kilde-ID i samme svar | Kontroll mot offentlig tekst og nødvendige forbehold | Foreløpig status |
|---|---|---|---|---|
| A1 | Skriftlig advarsel som disiplinærreaksjon | `AT_PERSONALSAKER` | [Arbeidstilsynet: Personalsaker](https://www.arbeidstilsynet.no/arbeidsmiljo/organisatorisk-arbeidsmiljo/personalsaker/), avsnitt «Avklar tiltak», omtaler advarsel blant disiplinærreaksjoner. Veiledning er ikke i seg selv en lovhjemmel for å ilegge reaksjonen | Underbygget, med forbehold |
| A2 | Undersøke hendelser, høre begge, la dem imøtegå | `AT_PERSONALSAKER` | Samme side, avsnitt «Kontradiksjon» og prosessråd: alle relevante parter får forklare seg før konklusjon. Ikke tolke listen med veiledning som faste formkrav for alle enkeltsaker | Underbygget som god saksbehandling |
| B1 | Arbeidsmiljøloven § 4-6 gir grunnlag for tilrettelegging så langt mulig | `AML_4_6_TILRETTELEGGING` | [Arbeidsmiljøloven § 4-6 på Arbeidstilsynet](https://www.arbeidstilsynet.no/regelverk/lover/arbeidsmiljoloven--aml/), særlig første ledd om redusert arbeidsevne. Gjelder arbeidsgivers tiltak ved kvalifiserende redusert arbeidsevne; ikke alle gjentatte fraværsdager ubetinget | Underbygget med anvendelsesforbehold |
| B2 | Oppfølgingsplan innen fire uker, med unntak | `NAV_SYKEFRAVAER_OPPFOLGING` | [NAV arbeidsgiver: Slik følger du opp sykmeldte](https://www.nav.no/arbeidsgiver/oppfolging-sykmeldte), «Hvem gjør hva». NAV angir 4 uker og unntaket når plan er åpenbart unødvendig. Forutsetter faktisk relevant sykmeldingsperiode | Underbygget med vilkår |
| B3 | Dialogmøte 1 innen sju uker, behov ved delvis sykmelding | `NAV_SYKEFRAVAER_OPPFOLGING` | Samme NAV-side, «Dialogmøte 1». For helt sykmeldte er sju uker relevant utgangspunkt, mens ved delvis sykmelding skal behovet vurderes. Også mulig unntak ved åpenbart unødvendig møte | Underbygget med vilkår |
| B4 | «Du kan ikke kreve å få vite diagnosen.» | `NAV_SYKEFRAVAER_OPPFOLGING` | Arbeidsgiversiden beskriver at dialogmøtet skal gjelde funksjon, ikke diagnose. VIKTIG KORRIGERING etter kontroll av full original-JSON: [NAV: Har blitt sykmeldt](https://www.nav.no/sykmeldt) var faktisk **synlig som `provider_url` i samme oppfølgingssvar**, og støtter uttrykkelig diagnosegrensen. Den tidligere kladden valgte bare feil kandidat-ID for B4. Kilden var vist, men ikke `model_selected` kuratert kilde | **Direkte synlig NAV-belegg funnet; kladdens kobling må korrigeres** |
| B5 | Medvirkningsplikt, arbeidsrelatert informasjon, ikke medisinske detaljer | `NAV_SYKEFRAVAER_OPPFOLGING` | NAV arbeidsgiverside («Den ansatte» og «Dialogmøte 1») beskriver medvirkning, funksjon og oppgaver; [NAV sykmeldt](https://www.nav.no/sykmeldt) tydeliggjør skillet mot diagnose. Fraværssituasjonen er ennå ikke konkretisert til ett aktivt sykefraværsløp | Underbygget med presisering |
| D1 | SHA-plan oppdateres fortløpende ved relevante endringer | `AT_BUILDING_SITE_COORDINATION` | [Byggherreforskriften § 7](https://www.arbeidstilsynet.no/regelverk/forskrifter/byggherreforskriften/). **Byggherren** er pliktsubjektet for oppdatering, selv om arbeid i utførelse koordineres av andre | Underbygget; eksplisitt pliktsubjekt nødvendig |
| D2 | Endringer skal gjøres kjent for arbeidsgivere og ansatte | `AT_BUILDING_SITE_COORDINATION` | Samme forskrift § 7 pålegger **byggherren** å informere arbeidsgivere/enmannsbedrifter; § 19 pålegger **arbeidsgiveren** å informere ansatte/verneombud. Ikke skriv at byggherre har én felles, direkte varslingsplikt til samtlige ansatte | **Underbygget bare med skilt ansvar** |
| D3 | Arbeid i høyden risikovurderes før start og tiltak gjennomføres | `AT_RISIKOVURDERING` | [Arbeidstilsynet: Risikovurdering](https://www.arbeidstilsynet.no/hms/risikovurdering/) er generelt grunnlag. VIKTIG KORRIGERING: den opprinnelige KI-veiledningen viste også **`AT_WORK_EQUIPMENT_REGULATION` i SAMME første svar**, som inneholder forskrift om utførelse av arbeid § 17-1 om høydearbeid og § 17-6 om tiltak. Kladden pekte på en svakere kilde til D3 til tross for at presis forskrift var vist | **Direkte forskrift allerede synlig; kladdens kobling må korrigeres** |
| D4 | Arbeidsgiver skal involvere arbeidstakere i risikovurdering | `AT_RISIKOVURDERING` | Arbeidstilsynets «Risikovurdering», avsnitt «Arbeidstakerne skal medvirke», sier at vurdering gjennomføres i samarbeid med arbeidstakere og tillitsvalgte | Underbygget |
| D5 | Byggherres overordnede SHA-ansvar; koordinator følger opp koordinering | `AT_BUILDING_SITE_COORDINATION` | Byggherreforskriften §§ 5, 13, 14. Koordinator kan utpekes med skriftlige fullmakter, men det fritar ikke byggherren for ansvar. Skille koordinatorens oppfølging av konkrete tiltak fra byggherrens ansvar | Underbygget med rolleforbehold |
| D6 | Arbeidsgiver skal risikovurdere og gjennomføre sikkert arbeid | `AT_BUILDING_SITE_COORDINATION` | Byggherreforskriften § 18, arbeidsgiverens plikt til å følge SHA-plan og risikovurdere eget arbeid. Relevant arbeidsgiver også i byggherreprosjekter | Underbygget |
| D7 | «Hvis arbeidet allerede pågår og sikkerheten er uavklart, må det stanses forsvarlig etter rutinene.» | `AT_RISIKOVURDERING` | Generell risikovurdering støtter å unngå ukontrollert risiko, men ordet **«må»** er for absolutt hvis bare «uavklart» er kjent. [Arbeidsmiljøloven § 2-3](https://www.arbeidstilsynet.no/regelverk/lover/arbeidsmiljoloven--aml/) forutsetter fare for liv eller helse ved arbeidstakers avbruddsplikt; [verneombuds stansingsrett, § 6-3](https://www.arbeidstilsynet.no/regelverk/lover/arbeidsmiljoloven--aml/) har egne vilkår. Ved faktisk uforsvarlig arbeid må arbeidet sikres og om nødvendig stanses, men en generisk «all uavklart sikkerhet = ubetinget stansplikt» er ikke presis nok | **Krever kontekst-/rettslig presisering** |

## Viktige funn og anbefalt rettingsrekkefølge

**1. B4 – kilde til absolutt diagnoseutsagn.** Originalsvaret hadde allerede den direkte [NAV-siden for sykmeldte](https://www.nav.no/sykmeldt) som `provider_url` i **samme oppfølgingssvar**. Den opprinnelige 14-påstands-kladden valgte derimot bare `NAV_SYKEFRAVAER_OPPFOLGING`. Korriger vurderingskandidaten til faktisk vist NAV-sykmeldt-URL. Et `provider_url` er kildeproveniens, ikke bevis på at modellen kontrollerte innholdet.

**2. D3 – høyde-spesifikt grunnlag.** Den opprinnelige førsteveiledningen viste allerede forskrift om utførelse av arbeid med § 17-1 i **samme svar**. Den opprinnelige kladden valgte likevel den generelle `AT_RISIKOVURDERING` som D3-kandidat. Bytt til `AT_WORK_EQUIPMENT_REGULATION` ved kontroll av første svar. Den mer spesifikke høydearbeidsveiledningen ble dessuten synlig i oppfølgingssvaret, men kan ikke brukes som kilde for en annen svarfase.

**3. D7 – stans ved fare.** Ikke kvalifiser et absolutt «må stanses» ved bare ukjent/uavklart sikkerhet som en universell juridisk plikt. Avklar risiko, arbeidets faktiske tilstand og hvem som har myndighet, og henvis til riktig regel ved fare for liv eller helse. Sikkerhetsprioriteringen kan være fornuftig selv om juridisk form uttrykkes for kategorisk.

**4. D1/D2/D5 – pliktsubjekter.** Tydeliggjør byggherre/koordinator/arbeidsgiver og unngå at ansvar og informasjonsplikt blir fremstilt som om én aktør har alle oppgavene.

**5. A og øvrige B/D.** Foreløpig høy samsvar mellom råd og myndighetskilder, men dette er ikke bevis for at **alle** påstander i originalrapporten er kartlagt. Kontroller også `analysis`, `guidance` og `followup` fullt ut, relevante avtale-/tariffperioder, og om valgt kilde ble vist i riktig svar.

## Praktisk kvalitetsbeslutning

- **Ingen** av de 14 påstandene er automatisk merket `supported` i lokal JSON. Det ville vært en udokumentert formell godkjenning.
- To opprinnelige, historiske samtaleavvik i C og E beholdes som `M4=not_met`. Etterfølgende ekte omtest av C/E ble maskinelt 2/2 og ser ut til å ha rettet begge, men en gammel feil kan ikke viskes ut.
- Den formelle fem-case-godkjenningen står fortsatt åpen. Denne gjennomgangen er en **konkret dokumentert kildeundersøkelse**, ikke et utfylt signert `-claim-draft.json` eller ferdig juridisk kvalitetssikring.
- Ved ny KI-omtest må reelt kildeutvalg og KI-svar vurderes på nytt; en vellykket mock-test eller oppdatert prompt er ikke nok.

### Offentlige original-/myndighetskilder kontrollert 25.11.2026

1. [Arbeidstilsynet – Personalsaker](https://www.arbeidstilsynet.no/arbeidsmiljo/organisatorisk-arbeidsmiljo/personalsaker/)
2. [NAV – Slik følger du opp sykmeldte](https://www.nav.no/arbeidsgiver/oppfolging-sykmeldte)
3. [NAV – Har blitt sykmeldt](https://www.nav.no/sykmeldt)
4. [Arbeidstilsynet – Arbeidsmiljøloven](https://www.arbeidstilsynet.no/regelverk/lover/arbeidsmiljoloven--aml/)
5. [Arbeidstilsynet – Byggherreforskriften](https://www.arbeidstilsynet.no/regelverk/forskrifter/byggherreforskriften/)
6. [Arbeidstilsynet – Risikovurdering](https://www.arbeidstilsynet.no/hms/risikovurdering/)
7. [Arbeidstilsynet – Arbeid i høyden](https://www.arbeidstilsynet.no/risikofylt-arbeid/arbeid-i-hoyden/)
8. [Arbeidstilsynet – Arbeidstakers plikter](https://www.arbeidstilsynet.no/hms/roller-i-hms-arbeidet/arbeidstakers-plikter/)

**Ingen automatisk attest av rettsversjon:** Nettsider har dagens ordlyd og enkelte endringshistorikker. Denne stikkprøven dokumenterer ikke full historisk rettskildeversjon, sektor-/tariffavtale for faktisk virksomhet eller ansvarlig kontrollørs godkjenning.


## Forebyggende utbedringer etter kildegjennomgangen

Etter kontroll av de 14 kandidatene er disse konkrete endringene lagt til i **utviklingsgrenen**:

- `data/SOURCEBANK.json`: **NAV_SYKMELDT_DIAGNOSE** (NAVs direkte arbeidstakerveiledning med eksplisitt diagnosegrense) og **AT_ARBEID_I_HOYDEN** (Arbeidstilsynets spesifikke veiledning for risikofylt høydearbeid). Begge er målrettet mot relevante tema og fritekstsignaler.
- `server.js`, første råd **og** oppfølging: for absolutte diagnosebegrensninger må kilde som eksplisitt støtter den eksakte formuleringen velges. For arbeid i høyden må spesifikk myndighetskilde brukes. SHA-plikter skal skilles på byggherre, koordinator og arbeidsgiver. Forsiktighetsråd om å stanse/avvente arbeid må ikke automatisk omtales som en ubetinget lovplikt når farevilkårene er uavklart.
- `tests/test-sourcebank.cjs` og `tests/test-guidance-quality.cjs`: regresjoner sikrer at de to kildene finnes med riktige metadata, og at begge KI-prompter fortsatt inneholder de spesifikke kvalitetskravene.

**Hva er ikke bevist:** At den ekte KI-modellen faktisk *velger* de nye kildene i en fremtidig sak, eller at enhver ny påstand blir juridisk riktig, kan ikke fastslås med disse deterministiske testene. Ingen nye betalte modellkall er kjørt. Gammel `source-acceptance` med fem saker, `-claim-draft` og registrerte M4-avvik står uendret, og PR #15 er fortsatt utkast. Full faglig kildeakseptanse må vurderes uavhengig av koderettelsene.


## Presisering etter ny kontroll av original-JSON (25.11.2026)

For denne oppdateringen ble den fulle opprinnelige fem-case-rapporten fra brukerens faktiske lokale KI-kjøring kontrollert direkte, **ikke** bare Markdown-fremstillingen eller senere omtestrapporter. Dette avdekket to unøyaktigheter i arbeidskladdens automatiske valg av kilde-ID-er:

- **B4, oppfølgingssvar:** Originalsvaret viser `https://www.nav.no/sykmeldt` med `evidenceRole:"provider_url"`. NAV-siden har en eksplisitt begrensning i arbeidsgivers adgang til å kreve diagnose. Kladdens `NAV_SYKEFRAVAER_OPPFOLGING` er en svakere kandidat, men det betyr **ikke** at direkte kilde manglet i originalsvaret.
- **D3, første svar:** Originalsvaret viser `AT_WORK_EQUIPMENT_REGULATION` (forskrift om utførelse av arbeid, med § 17-1) med `evidenceRole:"model_selected"`. Den gamle kladdens `AT_RISIKOVURDERING` er relevant generelt, men mindre presis. Den særskilte Arbeidstilsynet-siden om arbeid i høyden var synlig først i **oppfølgingssvar**, ikke i første råd. Presis lovhjemmel fantes likevel i første råd.

**Endringene ovenfor er kun korreksjon av dokumenterte kildekandidater, ikke en retroaktiv juridisk eller menneskelig godkjenning.** Den allerede genererte lokale `-claim-draft.json` overskrives ikke. Fagkontrolløren må selv korrigere kildekoblingene til de URL-ene som var synlige i riktig svar, dokumentere originalkildens ordlyd og periodens/virksomhetens virkeområde. D2 (hvem informerer hvem) og D7 (stanspliktens terskel) må fortsatt vurderes særlig kritisk.

### Ytterligere kandidater ved fullstendighetskontroll

De 14 forhåndsregistrerte påstandene er **ikke bevist uttømmende**. Ved ny gjennomlesning av `guidance.reactions`, `guidance.legal_hr_note` og `followup.reply` kom disse relevante supplerende utsagnene frem:

- **A, oppfølging:** En advarsel kan eventuelt vurderes senere dersom dokumenterte forhold og forholdsmessighet tilsier det; Arbeidstilsynets personalsakveiledning omtaler forholdsmessighet. Dette bør tas med som et HR-/rettslig vurderingspunkt selv om det er formulert forsiktig.
- **A, første råd/reactions:** Lederen kan ikke love full konfidensialitet når flere parter må høres. Dette har en personvern-/saksbehandlingsdimensjon; undersøk minste nødvendige informasjonsdeling og hvilket grunnlag som gjelder i den konkrete saken.
- **B, oppfølging:** «Planen må oppdateres ved behov» er en selvstendig pliktlignende påstand; vurder mot arbeidsmiljøloven § 4-6 og NAV i dette svarløpet.
- **D, oppfølging:** Oppdateringsoppgaven skal avklares ut fra skriftlig delegasjon/rollebeskrivelser. For byggherreansvar og koordinatorens skriftlige avtale vises det til byggherreforskriften §§ 7 og 13. Ikke forveksle den formelle plikten med delegert praktisk utførelse.

Disse fire punktene er tilleggs**kandidater**, ikke automatisk avkreftede eller godkjente rettspåstander. Det må fortsatt tas standpunkt til om de skal legges inn i det lokale manuelle skjemaet.

## Sikker korrigering av eksisterende lokal kildekladd

Fordi `-claim-draft.json` allerede var opprettet før korrigeringen av B4/D3, er det lagt inn et særskilt verktøy som **kun bytter disse to valgte kildekandidatene når den opprinnelige ekte KI-rapporten bekrefter at de bedre URL-ene var synlige i riktig svar**:

```powershell
node .\scripts\refine-source-claim-draft.mjs '.\test-results\source-acceptance-2026-11-25T13-47-13-669Z.json' '.\test-results\source-acceptance-manual-review-2026-11-25T13-47-13-669Z-aligned-findings-claim-draft.json'
```

Verktøyet lager et **nytt** `-claim-draft-sources-refined.json` med tilhørende lesbar Markdown, overskriver aldri den gamle kladden, bevarer C/E-sakenes `M4=not_met`, og nekter å endre kildekandidater der kontrollør allerede har begynt å fylle inn belegg eller vurdering. På Windows kopieres et kort sammendrag automatisk med `Set-Clipboard`. Ingen KI- eller nettverkskall.

**Viktig:** Den nye filen er fremdeles bare en ufullstendig arbeidskladd. Eventuelle øvrige rettspåstander, faktisk originalkildesitat, rettsversjon, arbeidsgiverområde, kontrollør og formell beslutning må vurderes og dokumenteres separat; ingen `claimInventoryComplete` eller fagkriterier settes til godkjent.
