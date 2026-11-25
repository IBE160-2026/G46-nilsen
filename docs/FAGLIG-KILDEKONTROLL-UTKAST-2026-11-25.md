# Faglig kontrollutkast – ekte KI, fem syntetiske saker (25.11.2026)

**Status: gjennomgått av KI-assistent mot synlige kildesider, IKKE formelt faglig signert.**
Kildedato: 25.11.2026. Datagrunnlag: faktisk lokal `source-acceptance-2026-11-25T13-47-13-669Z.json`, med alle fem `analysis`, `guidance` og `followup`-objekter. Dette er en grunnlagsrapport som kan brukes ved utfylling av den lokale `-aligned.json`. **Den er ikke og må ikke omtales som `REVIEWED_OK`.**

## Hovedkonklusjon

- **A – Utestenging:** Innholdet om kontradiksjon, nøytral kartlegging og disiplinærreaksjon støttes av Arbeidstilsynets veiledning. Etterprøv rettslig betydning per konkret sak før formelle reaksjoner.
- **B – Statlig sykefravær:** NAV bekrefter oppfølgingsplan innen fire uker (med unntak når åpenbart unødvendig), dialogmøte 1 innen sju uker (behovsvurdering ved delvis sykmelding), medvirkning og at diagnose ikke er et tema. Arbeidsmiljøloven § 4-6 gjelder tilrettelegging så langt det er mulig. Viktig: testbeskrivelsen fastslår **ikke** om aktuell sykmeldingsperiode pågår, så ingen generell konklusjon om at disse milepælene allerede har inntrådt.
- **C – Veterinær:** DNVs punkt 5.3.3 og 5.3.5 støtter saklig kollegial fagdebatt, uten at profesjonsetikk blir lov. **Ny M4 i dagens faglige fasit er IKKE oppfylt av den gamle modellkjøringen:** `opening` starter «Takk for at dere møter», men møtesammensetning var ukjent. Senere i svaret anbefales separate samtaler.
- **D – Byggeplass/SHA:** Byggherreforskriften §§ 7, 13, 14, 18 og 19 og Arbeidstilsynets arbeid-i-høyden-veiledning gir direkte grunnlag for risikovurdering, SHA-oppdatering, informasjonsplikt og rollefordeling. Merk at **byggherren** har oppdateringsansvaret etter § 7, mens **arbeidsgiveren** har særskilt risikovurderings- og informasjonsansvar etter §§ 18–19; skille aktørene eksplisitt. Den gamle automatiske varslingen lot disse rettslige pliktene passere uten manuelt kontrollvarsel.
- **E – Ordinær kontorsamtale:** Kildeløst praktisk råd er passende. **Ny M4 er IKKE oppfylt av den gamle modellkjøringen:** under reaksjonsforslag sier lederen «Før jeg bestemmer» selv om lederens formelle beslutningsmyndighet ikke er dokumentert.

**Prinsipp:** To avvik i gammel KI-generert tekst kan ikke omgjøres til bestått ved å endre vurderingskriteriene eller bare lage en ny prompt. Senere rettinger i `server.js` og grønne mock-tester viser bedre instruksjon og teknisk flyt, men **ikke** at den ekte modellen nå gir korrekt utfall. Når de andre kontrollene er ferdige, må berørte nye KI-resultater (minst C og E) granskes separat før akseptanse.

## Kontrollerbare utsagn og kildebelegg

| Sak / svar | Faktisk påstand / observasjon fra modellsvaret | Offentlig kilde og relevant tekstgrunnlag | Foreløpig vurdering |
|---|---|---|---|
| A, oppfølging | «en skriftlig advarsel er en disiplinærreaksjon» | [Arbeidstilsynet – Personalsaker](https://www.arbeidstilsynet.no/arbeidsmiljo/organisatorisk-arbeidsmiljo/personalsaker/), under «Avklar tiltak»: disiplinærreaksjoner omfatter advarsel, oppsigelse og avskjed | Underbygget av myndighetsveiledning; ikke påstand om automatisk plikt til advarsel |
| A, oppfølging | Høre partene og gi reell mulighet til å imøtegå påstander | Samme kilde, «Kontradiksjon»: de involverte må kunne uttale seg og beskrive egen versjon; resultatet skal bygge på tilstrekkelig opplyst sak | Råd samsvarer; Arbeidstilsynet presiserer samtidig at veiledningen ikke skaper juridisk presedens |
| B, første råd | «arbeidsmiljøloven § 4-6 ... nødvendige tiltak så langt det er mulig» | [Arbeidstilsynet – Tilrettelegging](https://www.arbeidstilsynet.no/arbeidstid-og-organisering/tilrettelegging/) og [arbeidsmiljøloven § 4-6](https://lovdata.no/nav/lov/2005-06-17-62/kap4) | Rettslig hovedretning underbygget; eksakt lovtekst/gyldighet må bekreftes av ansvarlig kontrollør |
| B, oppfølging | Oppfølgingsplan normalt innen 4 uker, dialogmøte 1 innen 7 uker | [NAV – Slik følger du opp sykmeldte](https://www.nav.no/arbeidsgiver/oppfolging-sykmeldte), «Arbeidsgiveren», «Oppfølgingsplan» og «Dialogmøte 1» | Underbygget med NAVs vilkår og unntak; gjelder ved relevant sykmelding, ikke automatisk på grunnlag av tidligere korte fravær |
| B, oppfølging | «Du kan ikke kreve å få vite diagnosen» og diagnose ikke tema i dialogmøte | [NAV – Har blitt sykmeldt](https://www.nav.no/sykmeldt) og [NAV – Slik følger du opp sykmeldte](https://www.nav.no/arbeidsgiver/oppfolging-sykmeldte), «Gjennomføring av møtet» | Underbygget. Arbeidsgiver kan spørre om funksjon og arbeidsevne |
| B, oppfølging | Medarbeiderens medvirkningsplikt og informasjon om arbeidsoppgaver | [NAV – Slik følger du opp sykmeldte](https://www.nav.no/arbeidsgiver/oppfolging-sykmeldte), «Den ansatte» | Underbygget innenfor rammer om funksjon, ikke diagnose |
| C, begge svar | Faglig uenighet bør være saklig, verdig og kollegial; ikke lov | [DNV – 5.3 Veterinæren og kollegialitet](https://www.vetnett.no/5-3-veterinaeren-og-kollegialitet/category1568.html), punktene 5.3.3 og 5.3.5 | Underbygget som **profesjonsetikk**, ikke bindende lovtekst |
| D, første råd | «SHA-planen skal oppdateres fortløpende ...» | [Byggherreforskriften § 7](https://www.arbeidstilsynet.no/regelverk/forskrifter/byggherreforskriften/) | Underbygget, men rettslig pliktsubjekt er byggherren; gi eksplisitt rollemerking |
| D, første råd | Sikker vurdering før arbeid i høyden og arbeidstakermedvirkning | [Arbeidstilsynet – Arbeid i høyden](https://www.arbeidstilsynet.no/risikofylt-arbeid/arbeid-i-hoyden/) og byggherreforskriften § 18 | Underbygget; vurderingen må gjelde faktiske oppgaver og forhold |
| D, oppfølging | Byggherre har overordnet SHA-ansvar, koordinator følger opp, arbeidsgiver risikovurderer | [Byggherreforskriften §§ 7, 13, 14 og 18](https://www.arbeidstilsynet.no/regelverk/forskrifter/byggherreforskriften/) | Underbygget i hovedtrekk; konkrete fullmakter/avtaler må vurderes i prosjektet |
| D, første råd | Endringer og sikkerhetstiltak må gjøres kjent for de berørte | [Byggherreforskriften §§ 7 og 19](https://www.arbeidstilsynet.no/regelverk/forskrifter/byggherreforskriften/) | Byggherre informerer arbeidsgivere om planendringer; arbeidsgiver informerer ansatte om relevante tiltak. Skillet bør fremgå |
| E | Praktisk avklaring av referat og møteinnkalling | Ingen rettslig påstand og ingen kilde valgt | Fornuftig å unngå kildeinflasjon; fullmakt til endelig beslutning er imidlertid ikke avklart |

## Begrensninger og videre arbeid

1. **Ikke formelt kontrollskjema:** Her er kildekoblinger og forbehold dokumentert, men ikke attestert påstandsvis av fagansvarlig med sitatutdrag, datoversjon, konkret tariff-/arbeidsgiverscope og aksept av hele svaret. `source_provenance.contentVerified:false` i KI-rapporten gjelder fortsatt.
2. **Ikke opphev nye avvik:** For gammel kjøring må nye `manualMust`-punkt M4 for **C og E vurderes som ikke oppfylt**, ikke automatisk `met`. Eventuell ny modellakseptanse må skje mot ny modellrespons, ikke ved å omskrive gammelt vurderingsskjema.
3. **Kilde- og datobegrensning:** Offentlige nettsider ble hentet 25.11.2026. Lov-/tariffperioder, formell rettskildeversjon og sektorspesifikke unntak krever eksplisitt dokumentasjon i det lokale vurderingsskjemaet. Ikke erstatt ekte kontroll med `periodVerified:true` eller `employerScopeVerified:true` uten belegg.
4. **Skjemaet kan ikke kontrollere sannhet automatisk:** `check-source-acceptance-review` kontrollerer struktur og innrapportert faglig vurdering, ikke om sitater og juss faktisk er korrekte. La PR #15 være draft, og ikke deploy til produksjon på grunnlag av denne foreløpige analysen.

Dette notatet er avgrenset til fem syntetiske svarløp og kilder som faktisk var knyttet til svarene; øvrige yrker, tariffområder og praktiske brukertilfeller er ikke dermed godkjent.
