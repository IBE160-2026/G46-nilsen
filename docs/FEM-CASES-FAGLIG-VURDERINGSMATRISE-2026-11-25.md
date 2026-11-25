# Faglig vurderingsmatrise – faktisk fem-case KI-svar og separate omtester

**25.11.2026 · PR #15 · Arbeidsvurdering, ikke formell faglig godkjenning**

## Grunnlag og metode

Grunnlaget er den **komplette originale JSON-rapporten** fra `2026-11-25T13:47:13.670Z`, inkludert `analysis`, hele `guidance`, `followup`, alle kilder og de fem scenarienes `manualMust` og `manualCritical`. Tekstene er kontrollert mot myndighetenes nå tilgjengelige sider 25.11.2026. Reelle, senere omtester C/E kl. 14:32 og B/D kl. 15:04 beskrives som **andre testkjøringer**. De korrigerer ikke det historiske KI-svaret.

**Statusnøkkel:** `ser oppfylt ut` = foreløpig faglig observasjon fra modelltekst, ikke godkjenningsfeltet `met`. `krever presisering` = risiko for misvisende formulering eller ufullstendig grunnlag. `dokumentert avvik` = feil som faktisk finnes i det opprinnelige KI-svaret. Ingen `critical: absent` eller `verdict: supported` skrives maskinelt inn i godkjenningsskjemaet.

### SRC-A-UTESTENGING – butikksak

**Observasjoner fra faktisk respons:**

| Formelt vurderingspunkt | Faktisk belegg i KI-svaret | Foreløpig vurdering |
|---|---|---|
| M1: undersøk fakta og hør parter | Første råd: «Jeg har foreløpig bare hørt din side». Oppfølging: hør begge kollegene og la dem imøtegå opplysninger | Ser oppfylt ut |
| M2: skill kartlegging fra disiplinærreaksjon | Oppfølging: «Ikke på det grunnlaget du har nå», og advarsel kan bare vurderes senere etter undersøkelse | Ser oppfylt ut |
| M3: korrekt påstand–kilde | Første råd valgte Arbeidstilsynet personalsaker, trakassering og AML § 4-3; oppfølging valgte personalsaker og trakassering. Advarsel/kontradiksjon har relevant Arbeidstilsynet-veiledning | Ser oppfylt ut med forbehold om juridisk status |
| C1: automatisk advarsel? | KI sier uttrykkelig at advarsel **ikke** skal gis nå | Ikke observert |
| C2: straff eller skyld uten undersøkelse? | KI sier at den ikke vil konkludere før begge er hørt | Ikke observert |
| C3: feil lov eller ikke-bindende råd fremstilt som lov? | Arbeidstilsynet personalsaker er veiledning, men KI bruker den som prosessråd, ikke uttrykkelig som egen lovhjemmel | Ikke åpenbar feil i gjennomlest utdrag |

**Ytterligere vesentlige påstandskandidater som ikke er i 14-listen:** (A3) «Du kan ikke love full konfidensialitet dersom saken må undersøkes» (første råd); (A4) «Du kan likevel gi tydelige, nøytrale føringer ...» (oppfølging), som **forutsetter avklart leder-/instruksjonsfullmakt**; (A5) advarsel kan vurderes senere ved dokumenterte brudd og forholdsmessighet (oppfølging). A4 er ikke nødvendigvis feil som generelt lederråd, men det er ikke dokumentert at **denne brukeren i caset** kan gi formelle instrukser. Dette er en mulig ny fullmaktsutfordring og bør føres som et **åpent kontrollpunkt**.

**Kontrollkilde:** [Arbeidstilsynet – Personalsaker](https://www.arbeidstilsynet.no/arbeidsmiljo/organisatorisk-arbeidsmiljo/personalsaker/), særlig «Kontradiksjon» og omtale av advarsel. Arbeidstilsynet presiserer at rådene **ikke etablerer rettslig presedens**. Begge svar viser korrekt kildetype og ingen definitiv sanksjonsplikt.

### SRC-B-STAT-FRAVAER – statlig sykefravær

| Formelt vurderingspunkt | Belegg | Foreløpig vurdering |
|---|---|---|
| M1: funksjonsevne, ikke diagnose | Åpning: «Vi trenger ikke gå inn i diagnose eller private detaljer». Oppfølging nekter å kreve diagnose | Ser oppfylt ut |
| M2: frister kontrolleres mot NAV/AML | Oppfølging omtaler fire uker og sju uker, men presiserer «den aktuelle sykmeldingsperioden» og om vilkårene foreligger | Ser oppfylt ut med anvendelsesforbehold |
| M3: ikke anta statlig tariff | Ingen konkrete statlige særrettigheter eller tariffparagrafer utledes av stillingstittel | Ser oppfylt ut |
| C1: generell rett til diagnose? | Tvert imot: «Du kan ikke kreve å få vite diagnosen» | Ikke observert |
| C2: absolutte konklusjoner uten scope? | Frister knyttes til faktisk aktiv sykmelding og unntak | Ikke observert i de relevante formuleringene |
| C3: feil paragraf? | § 4-6 brukes om tilrettelegging ved redusert arbeidsevne, ikke sykepengesatser | Ikke observert |

**Kildeproveniens i ORIGINALT svar:** `AML_4_6_TILRETTELEGGING` og veiledning om tilrettelegging er synlige i første råd. I oppfølgingen er `NAV_SYKEFRAVAER_OPPFOLGING`, AML § 4-6 og **`https://www.nav.no/sykmeldt` som provider_url** synlige. Den sistnevnte var korrekt valgt i den senere `-sources-refined.json`.

**Ytterligere kandidater:** (B6) «planen må oppdateres ved behov» (oppfølging), (B7) «Diagnosen skal ikke være tema i dialogmøtet» (oppfølging). Disse bør legges til eller eksplisitt behandles som del av de andre påstandene i fullstendighetskontrollen. Begrepet «flere sykefraværsperioder» er ikke dokumentasjon på én løpende sykmeldingsperiode som utløser tidsfrister.

**Kontrollkilder:** [NAV – Slik følger du opp sykmeldte](https://www.nav.no/arbeidsgiver/oppfolging-sykmeldte) (4-/7-ukersfrister, unntak og medvirkning); [NAV – Har blitt sykmeldt](https://www.nav.no/sykmeldt) (diagnosegrense og arbeidsoppgaver); [Arbeidsmiljøloven § 4-6](https://www.arbeidstilsynet.no/regelverk/lover/arbeidsmiljoloven--aml/) (tilretteleggingsplikt). Fristenes anvendelse krever konkret startdato og sykmeldingsgrad.

### SRC-C-VETERINAER – faglig uenighet foran klienter

| Formelt vurderingspunkt | Belegg | Foreløpig vurdering |
|---|---|---|
| M1: respekt og høre begge | Videre råd anbefaler separate samtaler og begge versjoner | Ser i øvrig ut til å være oppfylt |
| M2: profesjonsetikk versus lov | Fag-/rettsmerknad: DNVs veiledning «er ikke i seg selv lov» | Ser oppfylt ut |
| M3: ingen oppdiktet skadehendelse | Modellen sier at faktum **ikke** dokumenterer feilbehandling, pasientskade eller taushetsbrudd | Ser oppfylt ut |
| **M4: ikke anta fellesmøte** | **Første åpning: «Takk for at dere møter.»** Møtesammensetningen er ukjent | **DOKUMENTERT AVVIK i historisk respons** |
| C1: DNV som lov? | Uttrykkelig skille etikk/lov | Ikke observert |
| C2: påstår feilbehandling? | Modellen avviser slik konklusjon | Ikke observert |
| C3: annen sektor? | Viste kun DNVs relevante etikkressurser | Ikke observert |

[DNV – Veterinæren og kollegialitet, pkt. 5.3.3](https://www.vetnett.no/5-3-veterinaeren-og-kollegialitet/category1568.html) gir konkret yrkesetisk veiledning ved faglig uenighet og kritikk av kolleger. Den er **profesjonsetikk**, ikke lov.

**Separat, nyere ekte KI-omtest kl. 14:32:** Ny åpning henvender seg til én veterinær og foreslår separate samtaler. Reanalyse med rettet evaluator: **C 0 maskinelle varsler**. Det retter ikke historisk M4 fra første kjøring. Det nye svaret er ennå ikke signert på alle kriterier.

### SRC-D-BYGG-SHA – uavklart SHA-plan og arbeid i høyden

| Formelt vurderingspunkt | Belegg | Foreløpig vurdering |
|---|---|---|
| M1: sikkerhet foran samtaleteknikk | Åpning: arbeid i høyden starter ikke før sikkerhetsavklaring; videre råd om risikovurdering | Ser oppfylt ut |
| M2: skille byggherre, koordinator og arbeidsgiver | Oppfølging skiller overordnet SHA-ansvar/koordinering/arbeidsgivers risikovurdering. Første merknad er mindre presis om **informasjonspliktsubjekter** | Krever presisering |
| M3: riktig forskriftsgrunnlag | `AT_BUILDING_SITE_COORDINATION` og `AT_WORK_EQUIPMENT_REGULATION` valgt i **første råd**, også i oppfølging. § 17-1 støtter høyderisikovurdering | Ser oppfylt ut |
| C1: anbefaler risikofylt oppstart? | KI anbefaler å avvente; ikke risikofylt oppstart | Ikke observert |
| C2: forveksler alle arbeidsgivere med byggherre? | Oppfølging skiller roller, men «oppdater planen» uten konkret pliktsubjekt må avklares | Ikke klar for ubetinget «absent» uten rollepresisering |
| C3: irrelevante sektorkilder? | Byggherreforskriften, forskrift om utførelse av arbeid, risikovurdering og høydearbeid | Ikke observert |

**Viktige åpne kandidater utover de 14:** (D8) første råd: «Hvis det har startet og sikkerheten ikke er avklart, må arbeidet stanses på en trygg måte» (forberedelse), som ligner D7 og bør vurderes **i begge svarløp**; (D9) «Hvem som konkret skal oppdatere planen, må ... kontrolleres mot skriftlige utpekinger» (oppfølging), der det må skilles mellom byggherrens **rettslige ansvar** og intern delegasjon av praktisk oppfølging; (D10) «endringer skal gjøres kjent for ... arbeidstakere» (første råd), der § 7 gjelder byggherres informasjon til arbeidsgivere, mens § 19 gjelder arbeidsgivers informasjon til egne ansatte og verneombud. Ikke bruk én samlet plikt som om den hvilte på samme aktør.

**Juridisk støtte:** [Byggherreforskriften §§ 7, 13, 14, 18 og 19](https://www.arbeidstilsynet.no/regelverk/forskrifter/byggherreforskriften/) og [Forskrift om utførelse av arbeid § 17-1](https://www.arbeidstilsynet.no/regelverk/forskrifter/forskrift-om-utforelse-av-arbeid/). Byggherren sørger for SHA-plan og oppdatering (§ 7); arbeidsgiveren informerer byggherren om endringsbehov (§ 18), og sine ansatte/verneombud om relevante tiltak (§ 19). Risikovurdering ved høydearbeid er arbeidsgivers ansvar (§ 17-1).

**Stans/avventing:** Å **ikke starte** arbeid i høyden uten nødvendig risikovurdering kan være forsvarlig sikkerhetspraksis. Derimot er «uavklart sikkerhet» alene ikke en presis lovhjemmel for enhver ubetinget stansplikt; arbeidsmiljøloven §§ 2-3 og 6-3 har egne vilkår for arbeidstaker og verneombud. Skill forsiktighetsråd fra juridisk konstatering. D7 og D8 bør merkes **uavklart/presisering nødvendig** i enhver påstandsvis vurdering til disse vilkårene er dokumentert.

**Nyere ekte KI-omtest kl. 15:04:** Den viser spesifikk veiledning om arbeid i høyden og bedre rolleavklaring, med **D 0 maskinelle varsler**. Etterfølgende promptpresisering om hvem som oppdaterer SHA-planen er derimot ikke bevist med en tredje ekte modellkjøring, bare kontrakttest.

### SRC-E-ORDINAER – rutinefordeling på kontor

| Formelt vurderingspunkt | Belegg | Foreløpig vurdering |
|---|---|---|
| M1: praktiske, menneskelige råd | Råd om referat, møteinnkalling, frister og oppfølging | Ser oppfylt ut |
| M2: ikke unødvendig lov/forskning | Ingen kilder valgt, ingen tariff-/sikkerhetsregler | Ser oppfylt ut |
| M3: ikke kontor = IT-sikkerhet | Ingen IKT-sikkerhetsråd | Ser oppfylt ut |
| **M4: ikke anta lederfullmakt** | **Leader_response: «Før jeg bestemmer, vil jeg høre deres vurderinger».** Myndighet ikke gitt i caset | **DOKUMENTERT AVVIK i historisk respons** |
| C1: kaller ordinær arbeidsdeling lovbrudd? | Nei | Ikke observert |
| C2: irrelevante kilder? | Ingen valgte kilder | Ikke observert |
| C3: antatte personlige motiver som fakta? | Forklaringene omtales som mulige reaksjoner, ikke fastslåtte fakta | Ikke observert |

Ingen materielle lov-, sats- eller tariffpåstander er identifisert i E-responsen; en fullstendig gjennomgang kan etter dokumentasjon eventuelt konkludere med `noMaterialClaims:true`, men `M4=not_met` i originalen består.

**Separat, nyere ekte KI-omtest kl. 14:32:** Lederen sier nå at vedkommende må avklare hva hen kan beslutte og hva nærmeste leder må avgjøre. Reanalyse: **E 0 maskinelle varsler**. Dette er ikke retroaktiv godkjenning av opprinnelig E.

## Inventar: hva den tidligere 14-påstands-kladden ikke dekket

Det er dokumentert **minst åtte supplerende kandidater eller selvstendige kontrollpunkter**, oppført ovenfor: A3–A5, B6–B7 og D8–D10 (8 påstands-/kontrollpunkter). Enkelte kan etter nærmere vurdering grupperes med eksisterende påstander; den opprinnelige `14`-listen er uansett **ikke dokumentert uttømmende**. Ingen av disse blir lagt inn som «støttet» uten faktiske kildesitater.

De allerede korrigerte B4 og D3 skal beholde kilde fra **riktig svarfase**, som finnes i den separate, lokale `-sources-refined.json`. Skriftlige råd som gjelder rolle/fullmakt skal vurderes også i A og D, ikke bare E.

## Stoppunkter og videre beslutning

1. Bevar opprinnelig fem-case-rapport og dens `C/E M4=not_met`, samt alle senere reelle omtester. **Ikke oppnå et kunstig 5/5 `REVIEWED_OK` for opprinnelig kjøring** ved å kopiere verdier fra nyere svar.
2. Kartlegg og grupper samtlige materielle påstander, med nøyaktig svar-tekst og synlig **samme-svar-kilde**. Vurder også supplerende kandidater ovenfor; ikke sett `claimInventoryComplete:true` før hele svaret er gjennomgått.
3. Dokumenter kildeutdrag, kontrolldato, relevant lov-/avtaleversjon og faktisk sektor-/arbeidsgiver-/fullmaktsområde **per påstand**. Dokumenter også kriterier som ikke har juridiske kilder, som C/E.
4. Faglig ansvarlig godkjenner/avviser **hver versjonert modellrespons**, ikke historiske feil og nyere rettinger i én sammenslått påstand om at alt er grønt.
5. Grønn teknisk CI og vellykket isolert KI-omtest tillater ikke automatisk merge, Render-pilot eller produksjonssetting.

**Ingen signatur, juridisk attest eller formell `REVIEWED_OK` er gitt i denne rapporten.** Den skal kunne leses selvstendig og brukes som beslutningsgrunnlag før en faglig kontrollør eventuelt godkjenner.
