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
| B4 | «Du kan ikke kreve å få vite diagnosen.» | `NAV_SYKEFRAVAER_OPPFOLGING` | Den valgte [NAV-arbeidsgiversiden](https://www.nav.no/arbeidsgiver/oppfolging-sykmeldte) sier at diagnosen ikke skal være tema i dialogmøte; **eksplisitt forbud mot å kreve diagnose** er tydeligere formulert på [NAV: Har blitt sykmeldt](https://www.nav.no/sykmeldt). Sistnevnte er en *supplerende kontrollkilde*, ikke automatisk en kilde KI viste i samme svar. For eksakt kildekobling bør valgt kilde understøtte den absolutte setningen tydelig | **Kildepresisjon må forbedres / vurderes manuelt** |
| B5 | Medvirkningsplikt, arbeidsrelatert informasjon, ikke medisinske detaljer | `NAV_SYKEFRAVAER_OPPFOLGING` | NAV arbeidsgiverside («Den ansatte» og «Dialogmøte 1») beskriver medvirkning, funksjon og oppgaver; [NAV sykmeldt](https://www.nav.no/sykmeldt) tydeliggjør skillet mot diagnose. Fraværssituasjonen er ennå ikke konkretisert til ett aktivt sykefraværsløp | Underbygget med presisering |
| D1 | SHA-plan oppdateres fortløpende ved relevante endringer | `AT_BUILDING_SITE_COORDINATION` | [Byggherreforskriften § 7](https://www.arbeidstilsynet.no/regelverk/forskrifter/byggherreforskriften/). **Byggherren** er pliktsubjektet for oppdatering, selv om arbeid i utførelse koordineres av andre | Underbygget; eksplisitt pliktsubjekt nødvendig |
| D2 | Endringer skal gjøres kjent for arbeidsgivere og ansatte | `AT_BUILDING_SITE_COORDINATION` | Samme forskrift § 7 pålegger **byggherren** å informere arbeidsgivere/enmannsbedrifter; § 19 pålegger **arbeidsgiveren** å informere ansatte/verneombud. Ikke skriv at byggherre har én felles, direkte varslingsplikt til samtlige ansatte | **Underbygget bare med skilt ansvar** |
| D3 | Arbeid i høyden risikovurderes før start og tiltak gjennomføres | `AT_RISIKOVURDERING` | [Arbeidstilsynet: Risikovurdering](https://www.arbeidstilsynet.no/hms/risikovurdering/) støtter generell risikovurdering og tiltak. Den mer presise [Arbeid i høyden](https://www.arbeidstilsynet.no/risikofylt-arbeid/arbeid-i-hoyden/) støtter spesialkrav. Om høyde-spesifikk påstand skal stå, bør svarteksten knyttes til en synlig høyde-/forskriftskilde – ikke bare en generisk risikovurderingsside | **Kildespesifisitet bør styrkes** |
| D4 | Arbeidsgiver skal involvere arbeidstakere i risikovurdering | `AT_RISIKOVURDERING` | Arbeidstilsynets «Risikovurdering», avsnitt «Arbeidstakerne skal medvirke», sier at vurdering gjennomføres i samarbeid med arbeidstakere og tillitsvalgte | Underbygget |
| D5 | Byggherres overordnede SHA-ansvar; koordinator følger opp koordinering | `AT_BUILDING_SITE_COORDINATION` | Byggherreforskriften §§ 5, 13, 14. Koordinator kan utpekes med skriftlige fullmakter, men det fritar ikke byggherren for ansvar. Skille koordinatorens oppfølging av konkrete tiltak fra byggherrens ansvar | Underbygget med rolleforbehold |
| D6 | Arbeidsgiver skal risikovurdere og gjennomføre sikkert arbeid | `AT_BUILDING_SITE_COORDINATION` | Byggherreforskriften § 18, arbeidsgiverens plikt til å følge SHA-plan og risikovurdere eget arbeid. Relevant arbeidsgiver også i byggherreprosjekter | Underbygget |
| D7 | «Hvis arbeidet allerede pågår og sikkerheten er uavklart, må det stanses forsvarlig etter rutinene.» | `AT_RISIKOVURDERING` | Generell risikovurdering støtter å unngå ukontrollert risiko, men ordet **«må»** er for absolutt hvis bare «uavklart» er kjent. [Arbeidsmiljøloven § 2-3](https://www.arbeidstilsynet.no/regelverk/lover/arbeidsmiljoloven--aml/) forutsetter fare for liv eller helse ved arbeidstakers avbruddsplikt; [verneombuds stansingsrett, § 6-3](https://www.arbeidstilsynet.no/regelverk/lover/arbeidsmiljoloven--aml/) har egne vilkår. Ved faktisk uforsvarlig arbeid må arbeidet sikres og om nødvendig stanses, men en generisk «all uavklart sikkerhet = ubetinget stansplikt» er ikke presis nok | **Krever kontekst-/rettslig presisering** |

## Viktige funn og anbefalt rettingsrekkefølge

**1. B4 – kilde til absolutt diagnoseutsagn.** Innholdet er i samsvar med NAVs egne opplysninger, men den første KI-kildekoblingen peker på en veiledning der den eksakte absolutte formuleringen er mindre direkte. Ved fremtidig kildevalg bør [NAV-siden for sykmeldte](https://www.nav.no/sykmeldt) eller en annen eksplisitt offentlig kilde være med i **samme svar**; etterfølgende manuell kontroll kan ikke retroaktivt tilskrive KI-en en kilde den ikke viste.

**2. D3 – høyde-spesifikt grunnlag.** Generell HMS-risikovurdering er et godt utgangspunkt, men ved arbeid i høyden bør KI-en synliggjøre [Arbeidstilsynets spesialveiledning](https://www.arbeidstilsynet.no/risikofylt-arbeid/arbeid-i-hoyden/) eller riktig forskriftsbestemmelse i samme svar. Dette gjelder kildespesifisitet, ikke en påvist feil i selve risikorådet.

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
