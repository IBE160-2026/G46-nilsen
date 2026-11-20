# Streng sensorkontroll – faktisk brukerreise og 36 krav

**Dato:** 20.11.2026  
**Arbeidsgren:** `docs/ibe160-helhetlig-revisjon-20261118` – draft PR #12  
**Scope:** Samtalestøtte som studentprototype; LIVE/tale er egen pilot og er **ikke** med her.

## Hva vi ville kontrollere

De tidligere testene verifiserte flere av brukerreisens API-er enkeltvis, men hadde ikke kjørt den **samme samtalen gjennom de faktiske DOM-kontrollene i Chrome**. Dette er en faglig viktig forskjell: gode endepunkter er ikke tilstrekkelig hvis bruker ikke kan komme frem til dem, data ikke følger med, feil skjules eller historikken ikke oppdateres.

Ny test: **`tests/test-sensor-journey-browser.cjs`**, kjørt som en egen obligatorisk Chrome-handling i `.github/workflows/quality-gate.yml`. Den starter **den reelle frontendkoden** fra `index.html`/`app.js` mot **lokal Express-sensordemo**. Alle teksteksempler er fiktive, deterministiske og uten identifiserende personopplysninger. Ingen levende KI-leverandør, live Supabase, produksjonslogin eller bedriftsdata kontaktes.

### Én sammenhengende scenarioflyt

1. Åpner den ekte appen i Chrome og bekrefter at fiktiv demoidentitet er lastet. Navigerer **via faktiske tema- og undertemaknapper** til fravær/oppfølging.
2. Prøver først en fiktiv tekst med **«Knut Hansen»** og krever blokkering fra den faktiske personverngatewayen **før noen analyse-/veiledningsforespørsel blir sendt**. Skriver deretter en anonym situasjon i det ekte tekstfeltet, sender skjemaet og bekrefter **begge** demo-API-ene `/api/analyze-situation` og `/api/generate-guidance`, samt rådskort med forslag til åpning og spørsmål. Avviser at UI har falt tilbake til reserveveiledning etter feil.
3. Skriver oppfølgingsspørsmål i det faktiske skjemaet. Bekrefter begge samtaleboblene og at assistentsvaret gjelder spørsmålet; verifiserer kontekst og lagring i samme samtale.
4. Bruker **«Skriv ut råd»**. Fanget utskriftsdokument kontrolleres for situasjon, hovedråd og **«Videre råd»**, inkludert oppfølgingsspørsmålet. Printdialog/driver eller fysisk papir er **ikke** testet.
5. Klikker **«Øv på samtalen»**, starter øvelsen, sender en lederreplikk via faktisk skjema og venter på svar fra simulatoren. Avslutter og verifiserer refleksjons-/tilbakemeldingsvisningen.
6. Leser **faktisk innhold** i demoens serverhistorikk: Én samtale med riktig situasjon, analyse, veiledning, brukerens oppfølgingsreplikk, simulatorreplikker og refleksjon.
7. Laster hele nettlesersiden på nytt, åpner historikk via hovedmenyen, gjenåpner saken, og verifiserer at situasjon og dialog er gjenopprettet i appen.
8. Sletter via faktisk historikk-knapp etter bekreftelse. Krever at **serverens historikk er tom** og at kontoeksporten ikke inneholder den slettede saken. Bekrefter ingen ufangede JavaScript-feil ved gjenåpning/sletting.

**Personvernbevis i denne reisen:** Brukergrensesnittet skal merke feltet ugyldig og avvise navn **uten å kontakte** `/api/analyze-situation` eller `/api/generate-guidance`. Deretter skal anonym tekst fungere i samme skjema. Dette er en syntetisk negativ test, ikke dokumentasjon på feilfri navnegjenkjenning i alle språk.

**Valideringsmetode:** Faktisk headless Chrome/DevTools + ekte DOM + faktisk lokal demo-HTTP-server med syntetisk innlogging. Dette er **sterkere enn et statisk søk**, men **ikke** bevis for en ekte KI-leverandør, ekte Supabase Auth, mobil enhet, produksjonsdata eller fysisk utskrift.

## Streng kravstatus – samtlige 36 krav

Merking: **D** = deterministisk/funksjonstest, **I-demo** = brukerreise i ekte Chrome mot lokal syntetisk server, **I-mock** = faktisk Express/Chrome med falske auth-/provider-/DB-svar, **I-SQL** = faktiske PostgreSQL-transaksjoner med syntetiske brukere, **L/M åpent** = faktisk live KI og/eller menneskelig/fysisk akseptanse mangler. «Testet» nedenfor betyr **innenfor angitt bevisnivå**, ikke produksjonsgodkjent.

| Krav | Testgrunnlag fra denne revisjonen | Sensorens gjenværende spørsmål |
|---|---|---|
| FR-01 – Situasjonsbeskrivelse | **I-demo**: tekstfelt → skjema → analyse og råd | Anonymisering og feilmelding i ekte miljø |
| FR-02 – Tema/undertema | **I-demo**, taksonomi **D** | Utdatert eller feil tema fra faktisk klassifiseringsmodell |
| FR-03 – Hovedveiledning | **I-demo**, kontrakt/golden **D** | Faglig vurdering av levende KI-svar |
| FR-04 – Oppfølgingsdialog | **I-demo** med lagret dialog | Samme kontekst hos leverandør og samtidige spørringer |
| FR-05 – Simulering | **I-demo** med turn → svar → refleksjon | Faglig respons og vanskelige reaksjoner fra levende KI |
| FR-06 – Personverngateway | **I-demo** fullnavn blokkert før API; **D/I-mock** på andre overflater | Ekte login/rolle og direkte omgåelsesforsøk i staging |
| FR-07 – Innlogging | Syntetisk demoinnlogging og HTTP-grensetester | **Ekte Supabase Auth/JWT** i separat testprosjekt |
| FR-08 – Engangsinvitasjoner | Serverkode/struktur eksisterer | Utløpt/brukt token i faktisk Auth-integrasjon |
| FR-09 – Historikk | **I-demo** lagre → reload → åpne → slett/eksport; **I-mock/I-SQL** kryssbruker | Ekte bruker-A/B med Supabase Auth + RLS |
| FR-10 – Rapportering av svar | UI/HTTP-kode og personverntester | E2E rapportlagring med syntetisk konto og tilgang |
| FR-11 – Roller | **I-mock** admin/user/editor; negativ HTTP-test | Faktisk Supabase-rolle, token og misbrukstest |
| FR-12 – Admin | Ekte Chrome med **I-mock**, API 401/403 | Bestående rolle-/innholdsoppdatering i staging |
| FR-13 – Modellvalg | **D/I-mock** konfigurasjon og negative responser | Faktisk gyldig modell/provider |
| FR-14 – Benchmark | **D**, lokal RPC + **I-SQL**; kostnadssperre aktiv | Betalte tester **ikke produksjonsgodkjent** |
| FR-15 – KI-testing | **D**, 66 golden-caser og 40 strenge | Uavhengig menneskelig og fersk live fasit |
| FR-15A – Kildepresisjon | **D** negativ kildetest og sektor/yrke | Faglig kildevalg per faktisk påstand |
| FR-16 – Kildebank | **D** kilde-/rangeringstester | Reelt kildegrunnlag/ferskhet i konkrete råd |
| FR-17 – Brukertesting | Kvalitative funn dokumentert | Større utvalg og observasjon av ekte sluttbruker |
| FR-18 – Web/kildeanalyse | **D/I-mock** struktur, kildebevaring | Leverandørdata, kostnad og faktisk kildebruk |
| FR-19 – Videre spørsmål | **I-demo** faktisk fritekst i samme sak | Foreslåtte spørsmål ved krevende/uventet input |
| FR-20 – Utskrift | **I-demo** generert HTML inkl. «Videre råd» | **Fysisk print-preview/papir** på mobil og PC |
| FR-21 – Navigasjon | **I-demo** tematisk flyt; 99 CSS/Chrome-paritetskontroller | Manuell mobil, skjermleser, tastatur |
| FR-22 – Yrke/sektor | **D** occupation/tariff/kildevalg | Faglig korrekte råd for stat/kommune/privat |
| FR-23 – Alternativ direkte tekstinngang | **Videre arbeid**, ikke produksjonsakseptert | Må ikke forveksles med separat LIVE/tale-pilot |
| AI-01 – Fakta/antakelser | Golden-kontroller og sikkerhetsinstruksjoner **D** | Menneskelig kvalitetstest på KI-svar |
| AI-02 – Ingen diagnoser | Personvern-/simulerings-/golden-kontroller **D** | Faglig live kontroll av sårbare scenarier |
| AI-03 – Ingen oppdiktet skyld/motiv | Negative golden- og språkstandardtester **D** | Uavhengig KI-vurdering |
| AI-04 – HR/juss-usikkerhet | Kildeprioritering/negative tester **D** | Ekspertkontroll av faktiske arbeidsrettslige råd |
| AI-05 – Kontekstisolasjon | **I-demo** gjenåpning/oppfølging, **I-mock/I-SQL** eierskap | Ekte konto-JWT og flere brukere i staging |
| AI-06 – Modelluavhengighet | Status- og modellkontrakt **I-mock/D** | To reelle providere med sammenliknbar fasit |
| NFR-01 – Sikkerhet | **I-mock/I-SQL** RLS/privilegier, HTTP 401/403, lokal rate/kostnad | Ekte Auth/PostgREST, trusselmodell og sikkerhetsreview |
| NFR-02 – Personvern | **D/I-mock**, **I-demo** sletting og tom eksport | Verifisert retensjon/sletting i ekte Supabase |
| NFR-03 – Brukervennlighet | **I-demo** full brukerreise, Chrome CSS/DOM | **Fysisk mobil** og skjermleser |
| NFR-04 – Feilhåndtering | Negative HTTP-/provider-/RPC-tester **D/I-mock** | Faktiske nettavbrudd, loading/timeout i UI |
| NFR-05 – Vedlikeholdbarhet | Dokumentert modularisering og CI | Betydelig teknisk gjeld i store filer / CSS-overstyringer |
| NFR-QA-01 – Quality Gate | CI: 52 npm-steg + Chrome-admin + **ny full brukerreise** + 99 CSS-scenarier + PostgreSQL/RLS | Må fortsatt kontrolleres på endelig commit/leveransegren |

**Opptelling:** FR = 24 (inkludert FR-15A), AI = 6, NFR = 6; totalt **36 dokumenterte krav**. Ingen status i tabellen antyder at 36/36 har full E2E/produksjonsakseptanse.

## Prioritering etter sensorrisiko

1. **P0 – Ferdig kjernereise i faktisk UI:** Har en konkret Chrome-test på reell frontend og deterministisk API-demo. Dersom den feiler, stopp og rett *årsaken*. Ikke endre golden-test eller UI for å skjule feil.
2. **P0 – Ekte Auth og RLS:** To testbrukere i isolert Supabase-testprosjekt, også ved reload, utløpt token, dele/slette andres historikk, endre rolle og egne/andres rapporter. Testoppgaver skal aldri bruke ekte brukerdata.
3. **P1 – Manuell UX:** Android/Chrome og desktop med egen testkonto: scroll/tema→råd→simulering; tekst i historikk; print-preview, fysisk PDF/utskrift; tilgjengelighet og små skjermer.
4. **P1 – KI/faglighet:** Uavhengig human-in-the-loop på kritiske personal-/lovverksscenarier, kontroller at kildene faktisk støtter påstandene og at KI markerer usikkerhet. Syntetiske golden-caser alene er ikke en fasit.
5. **P1 – Innlevering:** Kontroller faktisk Canvas-rubrikk, refleksjonsrapportens formkrav og siste sensorsti. Revider støttetekst som feilaktig fremstår som nyere eller bredere kvalitetstest enn den er. Ingen betalte tester før godkjent kostnadshåndtering.

## Leveransegrense

Dette arbeidet ligger **kun på draft PR #12**, ikke `main`. Ingen merge, Render-deploy, LIVE/tale-endring, live Supabase-mutasjon eller betalte KI-kall er utført. Etter endelig CI skal lenken til konkrete gjennomførte tester og siste commit føres inn i PR-kommentar og sensorsti. Det er ikke forsvarlig å kalle løsningen «fullt produksjonsklar» bare fordi CI er grønn.
