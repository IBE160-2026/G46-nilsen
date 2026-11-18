# Kravsporingskontroll – Samtalestøtte

**Dato:** 18.11.2026  
**Referansegren:** `main`, commit `2ae505adc22a9ea86ef89e5cf045f4ec5f68d0cf`  
**Arbeidsgren:** `docs/ibe160-helhetlig-revisjon-20261118`  
**Formål:** et ærlig kontrollark for å lukke gap mellom PRD, arkitektur, epics/stories, implementasjon og tester.

> **Les før bruk:** «Ja/Nei» nedenfor betyr **utelukkende at eksakt krav-ID finnes/ikke finnes som tekst** i det aktuelle dokumentet. «Nei» betyr ikke nødvendigvis at funksjonaliteten mangler. Kolonnen «tekniske spor/testkandidater» viser konkrete steder som bør undersøkes; den er **ikke et nytt verifisert testresultat**. PRD-status er gjengitt fra dokumentet, ikke godkjent på nytt av denne revisjonen.

## Historisk før-revisjonskontroll av kravsporing

**Denne tabellen er et frosset utgangsbilde fra `main` 12.11.2026 og skal ikke brukes som dagens status.** Ved første gjennomgang hadde PRD 23 ordinære FR-krav, seks AI-krav og fem ordinære NFR-krav (**34 ID-er**), mens `FR-15A` og `NFR-QA-01` lå i sene tillegg. Arkitekturen brukte 0/34 eksakte ID-er og epics 26/34 i dette *før-bildet*. Dette betydde manglende tekstuell sporbarhet, ikke nødvendigvis manglende funksjon.

**Etter dokumentasjonsrevisjonen 18.11:** De to tilleggskravene er flyttet inn i hovedkravene, slik at gjeldende `PRD.md` har **36 unike kravoverskrifter**. Maskinell sammenligning viser **36/36 eksakte ID-treff i Architecture, 36/36 i Epics/Stories og 36/36 i `docs/ai/TESTBEVIS-OG-DEKNING-2026-11-18.md`**. Dette er en fullstendig *referansekobling*, **ikke** 36/36 beståtte tester. Den detaljerte matrisen nedenfor viser fortsatt det historiske utgangspunktet.

| ID | Krav | Status som påstått i PRD | ID i Epics | ID i Architecture | Tekniske spor/testkandidater – **ikke nyverifisert** |
|---|---|---|:---:|:---:|---|
| FR-01 | Situasjonsbeskrivelse | IMPLEMENTERT | Ja | **Nei** | `app.js`; vurder UI-flyt manuelt |
| FR-02 | Tema og undertema | IMPLEMENTERT | Ja | **Nei** | `src/client-data.js`; `tests/test-benchmark-taxonomy.cjs` |
| FR-03 | KI-basert hovedveiledning | IMPLEMENTERT | Ja | **Nei** | `server.js`, `src/server/ai-schemas.js`; `tests/test-guidance-quality.cjs` (statisk) |
| FR-04 | Oppfølgingsdialog | IMPLEMENTERT | Ja | **Nei** | `app.js`, `server.js`; vurder faktisk kontekstflyt |
| FR-05 | Samtaleøvelse (samtalesimulering) | IMPLEMENTERT | Ja | **Nei** | `app.js`, `server.js`; `tests/test-simulation.js` (hovedsakelig statisk) |
| FR-06 | Personverngateway | IMPLEMENTERT | Ja | **Nei** | `src/privacy-detector.js`, `server.js`; `tests/test-privacy.js`, `tests/test-server-privacy.cjs` |
| FR-07 | Autentisering | IMPLEMENTERT | Ja | **Nei** | `server.js`, `database/`; autentisering og sesjon må integrasjonstestes |
| FR-08 | Engangsinvitasjoner | IMPLEMENTERT | Ja | **Nei** | `scripts/create-invite.js`, `server.js`; ingen entydig FR-test identifisert |
| FR-09 | Historikk | IMPLEMENTERT | Ja | **Nei** | `app.js`, `server.js`; `tests/test-history-hotfix.cjs` (statisk) |
| FR-10 | Rapportering av KI-svar | IMPLEMENTERT | Ja | **Nei** | `app.js`, `server.js`; rapportflyt og persistering må verifiseres |
| FR-11 | Roller | IMPLEMENTERT | Ja | **Nei** | `server.js`, `database/`; RLS/rollegrenser må valideres |
| FR-12 | Admin | IMPLEMENTERT | Ja | **Nei** | `app.js`, `server.js`; administrasjon må valideres per rolle |
| FR-13 | Modellvalg | IMPLEMENTERT I PROTOTYPEFORM | Ja | **Nei** | `server.js`; modelleksponering og adgangskontroll må valideres |
| FR-14 | Modellbenchmark | IMPLEMENTERT I PROTOTYPE/TESTFORM | Ja | **Nei** | `data/BENCHMARK-CASES.json`; `tests/test-model-compare.js`, `tests/test-benchmark-taxonomy.cjs` |
| FR-15 | Automatisert KI-testing | IMPLEMENTERT | Ja | **Nei** | `tests/AI-GOLDEN-CASES.json`, `tests/test-ai-golden.js`, `tests/test-golden-schema.cjs` (faktisk fil har .cjs) |
| FR-16 | Faggrunnlag | IMPLEMENTERT | Ja | **Nei** | `data/SOURCEBANK.json`, `data/OCCUPATION-LEGAL-SOURCES.json`; `tests/test-source-policy.cjs` |
| FR-17 | Brukertesting | PILOT GJENNOMFØRT / VIDERE EVALUERING | Ja | **Nei** | `docs/BRUKERTEST-PLAN.md`, `docs/BRUKERTEST-FUNN-OG-BACKLOG.md`; kvalitativt bevis |
| FR-18 | Web- og kildeanalyse | DELVIS / PROTOTYPE | Ja | **Nei** | `server.js`, `data/SOURCEBANK.json`; kildevisning/verifisering må vurderes |
| AI-01 | Fakta og antakelser | IMPLEMENTERT SOM KI-REGEL | Ja | **Nei** | `server.js`, `docs/ai/AI-SYSTEMPROMPT.md`; golden-kriterier må knyttes eksplisitt |
| AI-02 | Ingen oppdiktede diagnoser | IMPLEMENTERT OG TESTET | Ja | **Nei** | `src/server/ai-schemas.js`, `server.js`; `tests/test-guidance-quality.cjs`, golden-caser |
| AI-03 | Ingen oppdiktet skyld eller motiv | IMPLEMENTERT SOM KI-REGEL | Ja | **Nei** | `server.js`, `docs/ai/AI-SYSTEMPROMPT.md`; golden-caser |
| AI-04 | HR og juridiske spørsmål | IMPLEMENTERT SOM KI-REGEL | **Nei** | **Nei** | `server.js`, `data/SOURCEBANK.json`; høy-risiko golden-caser og faglig manuell vurdering |
| AI-05 | Kontekst | IMPLEMENTERT | **Nei** | **Nei** | `app.js`, `server.js`; test faktisk fortsettelsesdialog uten kontekstlekkasje |
| AI-06 | Modelluavhengighet | IMPLEMENTERT I PROTOTYPEFORM | Ja | **Nei** | `server.js`, `tests/test-model-compare.js`; delvis/prototype |
| NFR-01 | Sikkerhet | IMPLEMENTERT PÅ PROTOTYPENIVÅ | Ja | **Nei** | `server.js`, `database/`; sikkerhetstester, RLS og produksjonskonfigurasjon |
| NFR-02 | Personvern | IMPLEMENTERT | Ja | **Nei** | `src/privacy-detector.js`, `server.js`; `tests/test-privacy.js`, `tests/test-privacy-surfaces.cjs` |
| NFR-03 | Brukervennlighet | IMPLEMENTERT MED VIDERE FORBEDRINGSMULIGHET | **Nei** | **Nei** | `docs/BRUKERTEST-FUNN-OG-BACKLOG.md`, `tests/test-pilot-ux.cjs`; fysisk UX-test |
| NFR-04 | Feilhåndtering | IMPLEMENTERT | Ja | **Nei** | `server.js`, `app.js`; API-timeout, nettutfall og feilbeskjeder krever scenariotester |
| NFR-05 | Vedlikeholdbarhet | IMPLEMENTERT SOM ARKITEKTURMÅL | Ja | **Nei** | `tests/test-repo-structure.cjs`, `package.json`, modulstruktur; CI-kjøring 12.11 feilet |
| FR-19 | Videre oppfølgingsflyt | ikke eksplisitt lokalisert | **Nei** | **Nei** | `app.js`; `tests/test-pilot-regression.cjs`, manuell flyttest |
| FR-20 | Utskrift av samtalestøtte | ikke eksplisitt lokalisert | **Nei** | **Nei** | `app.js`; utskrift av hovedråd/videre råd må testes i nettleser |
| FR-21 | Rolig standardnavigasjon | ikke eksplisitt lokalisert | **Nei** | **Nei** | `styles-responsive.css`, `app.js`; `tests/test-pilot-ux.cjs`, fysisk mobiltest |
| FR-22 | Yrke/bransje som valgfri kontekst | ikke eksplisitt lokalisert | **Nei** | **Nei** | `src/server/occupation-router.js`, `src/server/occupation-context.js`; `tests/test-occupation-router.cjs` |
| FR-23 | Direkte samtale som alternativ inngang | ikke eksplisitt lokalisert | **Nei** | **Nei** | KUN PILOT (`pilot-ux-v20.11`, `docs/pilot/LIVE-V1-PILOT-SPEC.md`); ikke produksjonsbevis |

## Viktige metodefunn – ved første kontroll (før revisjonen)

1. **Arkitekturens historiske 0/34 eksakte ID-treff** viste sporbarhetsproblemet. Dette er nå fulgt opp i Architecture § 2.1 med AD-01–AD-10 og kobling til konkrete komponenter og feilmodi; hver funksjons faktiske testbevis må fortsatt kontrolleres.
2. **Epics-dokumentet hadde 26/34 eksakte ID-treff.** Ved første kontroll manglet: `AI-04`, `AI-05`, `NFR-03`, `FR-19`, `FR-20`, `FR-21`, `FR-22`, `FR-23`. Les innholdet før mapping: flere kan allerede ha funksjonelt overlappende stories.
3. **PRD hadde ekstra ID-mønstre og sene tillegg.** FR-15A og NFR-QA-01 er nå flyttet inn i den gjeldende ID-rekken, mens opprinnelige formuleringer og testtall er bevart i `docs/bmad/PRD-STATUS-OG-HISTORIKK.md`. Kildekrav og modulær CSS er koblet til FR-16/FR-22/AI-04 og NFR-05.
4. En fil som `tests/test-ui-regression.cjs` kan sjekke tekst/DOM-struktur uten at reell brukerflyt er kjørt. Skill **fil finnes**, **statisk assert**, **deterministisk runtime**, **live KI** og **manuelt fysisk testet**.
5. 66 golden-caser og 114 benchmark-caser er opptalt fra JSON-filene på `main`. Live resultat 40/40 er historisk dokumentert 09.11 i `docs/ai/AI-VERIFICATION-ROUND-2026-11-08.md`, men ikke kjørt på nytt her.
6. FR-23 og LIVE er **ikke produksjonskrav med oppfylt status**. LIVE er begrenset til pilotgren/-tjeneste inntil separat kvalitetssikring og eksplisitt beslutning.

## Krav til videre verifikasjon

For hver ID må ansvarlig gå gjennom: (a) konkret observerbar akseptanse, (b) riktig nåstatus, (c) kodefil/funksjon, (d) testnavn og resultat/commit, (e) avvik eller manuell sjekk, (f) dato og miljø. Inntil dette er gjort er matrisen et **revisjonsgrunnlag**, ikke bevis på full dekning.

Se også `docs/REVISJON-IBE160-2026-11-18.md` og `docs/bmad/tilbakemelding-prd.md`.


## Utkast til observerbare akseptansekriterier

**Dette er revisjonsforslag, ikke nye produktløfter eller gjennomførte tester.** Kriteriene må sammenholdes med faktisk kode, produktets formål og eksisterende PRD. Ved manglende funksjon skal den merkes som avvik/delvis – vi skal ikke endre testen eller omdefinere kravet for å få et grønt tall.

| Krav | Observerbar akseptanse som bør testes/avklares |
|---|---|
| FR-01 | En anonymisert situasjon kan legges inn; starten av nytt løp gjenbruker ikke forrige situasjon; relevante verdier føres videre innenfor riktig samtale. |
| FR-02 | Alle 9 temaer og 48 gjeldende undertemaer kan velges; valgt tema er konsistent mellom klient, backend og kildevalg; ukjent tema gir kontrollert håndtering. |
| FR-03 | Anonymisert eksempel gir strukturert, forståelig hovedråd med praktisk samtaleåpning; ugyldig modellrespons håndteres, ikke stilletiende presenteres som gyldig. |
| FR-04 | Bruker kan spørre videre og få svar som bruker relevant gjeldende kontekst; ny samtale eller annen bruker får ikke med tidligere kontekst. |
| FR-05 | Øvelsen lar leder trene mot en separat medarbeiderrolle; KI skal ikke dikte opp personopplysninger som fakta; tilbakestilling starter ny øvelse. |
| FR-06 | Utvalgte navn, e-post, telefon og identifiserende data i både hovedfelt og oppfølging avvises/varsles før ekstern KI-kall; serverkontroll fungerer selv om klienten omgås. |
| FR-07 | Uautorisert bruker får ikke innlogget funksjon/data; autorisert innlogging etablerer riktig sesjon; utlogging/utløp opphever tilgangen. |
| FR-08 | Gyldig invitasjon kan brukes i tiltenkt flyt; ugyldig/utløpt/gjenbrukt invitasjon avvises; hemmelig token skal ikke lekke i respons/logg. |
| FR-09 | Bruker kan åpne og slette egne samtaler; slettet samtale vises ikke igjen etter oppdatering; forsøk på å hente en annens samtale avvises også på server-/RLS-nivå. |
| FR-10 | Rapportering oppretter forventet post og knytter hendelsen korrekt; personvernhensyn er ivaretatt; bruker får tydelig tilbakemelding om utfallet. |
| FR-11 | Bruker, redaktør og admin har nøyaktig tillatte rettigheter; serveren avviser handlinger over rollen uavhengig av skjult UI. |
| FR-12 | Innholds- og brukeradministrasjon følger rollegrensene; endringer persistenteres korrekt; ugyldig endring avvises. |
| FR-13 | Modellvalg godtar bare støttede modeller/providers; nøkler blir på serversiden; manglende provider gir forståelig feil, ikke skjult fall-back til uventet modell. |
| FR-14 | Samme anonymiserte testgrunnlag kan brukes på minst to konfigurerte modeller ved faktisk tilgjengelig konfigurasjon; kostnad/latens og resultat holdes atskilt fra faglig fasit. **Bare prototype hvis ikke full kjøreport finnes.** |
| FR-15 | Golden-bankens schema og temadekning valideres deterministisk; `npm test` krever ikke nøkkel; live-evaluering kjøres separat med bevart rapport, dato, modell og kodeversjon. |
| FR-16 | Råd viser kun verifiserbar/kuraterbar kilde der kilde kreves; relevans og virkeområde er dokumentert; ugyldig/forbudt profesjons- eller tariffkilde avvises i definert negativ case. |
| FR-17 | Gjennomført brukertest har anonymiserte observasjoner med antall testpersoner, metode, funn, beslutning og avgrensning; planlagt test er ikke ført som gjennomført. |
| FR-18 | Kontrollert web-/kildeanalyse skiller faktisk hentet kilde fra intern modellkunnskap; utilgjengelige kilder fører ikke til fabrikkert rettskilde; delvis status beholdes der det ikke er testet. |
| FR-19 | Ved oppfølging foreslås normalt 2–4 korte relevante spørsmål der funksjonen er aktiv; fritekst kan fortsatt brukes; relevans og mobilvisning kontrolleres manuelt. |
| FR-20 | Utskrift inneholder situasjon, relevante hovedråd og oppfølgingsråd, også når skjermseksjon er sammenfoldet; knapper/nav/personvernvarsel skal ikke skrives ut; sjekk fysisk print preview. |
| FR-21 | Sidebar er minimert som standard for ny bruker på desktop; manuelt valg bevares lokalt; verktøytips kan nås og er forståelige; mobilflyt kontrolleres separat. |
| FR-22 | Yrke er valgfritt; irrelevante yrker gir ikke profesjonsjuss; tvetydig yrke avklares; tariffområde gjettes ikke; negativ kildefasit fanger kildelekkasje. Bekreft feature flagg og faktisk miljø. |
| FR-23 | **IKKE oppfylt i main.** Direkte samtale/tale skal bare vurderes som eksperiment i isolert pilot. Test dialekt, transkripsjon, kommandoer, personvern, timeout og feil på mobil før produksjonsbeslutning. |
| AI-01 | Modellen skiller eksplisitt observasjoner fra antakelser ved usikre saker; test mot caser med mangelfullt faktagrunnlag. |
| AI-02 | Caser om helseplager/rus får ikke medisinsk diagnose eller fastslått avhengighet. |
| AI-03 | Mobbing/konflikt-caser får ikke automatiske påstander om skyld, hensikt eller motiv. |
| AI-04 | Komplekse juridiske/HR-saker har nøktern usikkerhet og anbefaler relevant faglig bistand, uten bastante rettslige konklusjoner uten grunnlag. |
| AI-05 | Oppfølgingsdialog tar med relevant kontekst og holder brukere/samtaler isolert; kontroller også lang samtale og reset. |
| AI-06 | Prototypens modell/providergrensesnitt kan bytte konfigurerbar provider uten at personvern-/responskontrakt faller bort; dokumenter begrensningene. |
| NFR-01 | Sjekk header/cookie/sesjon/rolle/rate limit/sekretthåndtering med faktiske serverforespørsler og relevante databaserettigheter; statiske tekstsøk er ikke nok. |
| NFR-02 | Personvernkontroll blokkerer definerte PII-kategorier før ekstern sending på server; lagring, sletting og retensjon dokumenteres for faktisk database. |
| NFR-03 | Minst to representative brukerreiser kan fullføres på relevant desktop/mobil uten blokkerende UI-feil; faktisk testutvalg og resultat rapporteres, ikke antas. |
| NFR-04 | Simuler API-timeout, avbrutt nett og uventet svar; brukeren får håndterbar feilmelding, pågående state ryddes og sensitivt råmateriale lekker ikke i feil. |
| NFR-05 | Full `npm test` og avhengighetskontroll er grønne på endelig commit, kodeendringer har avgrenset konsekvens og dokumentert regressjonskontroll. **Ikke oppfylt som siste-verifisert CI på main 12.11.** |

## Brukerreiser – forslag til å gjøre UX-kravene kontrollerbare

**UJ-01 – Forberede en vanskelig fraværssamtale (produksjonskjerne):** En leder velger relevant fraværstema, beskriver en *anonymisert* situasjon, får konkrete åpninger/spørsmål, stiller et oppfølgingsspørsmål, øver i simulatoren og velger å lagre/åpne egen historikk. For hvert steg noteres både forventet skjermatferd og testbevis. Ingen ekte medarbeideropplysninger benyttes.

**UJ-02 – Sektorspesifikk kildebruk (utvidelse):** En leder vurderer et yrkesrelevant spørsmål, velger yrke/arbeidsgivertype bare dersom relevant, får KI-råd med riktig avgrenset kilde og kontrollerer at en tilsynelatende lik men irrelevant kilde **ikke** foreslås. Den samme casen kjøres med irrelevant yrke for å avdekke overaktivering. Funksjonen vurderes mot faktisk feature flagg.

**UJ-03 – LIVE tale (kun framtidig/pilot, ikke sensorkjerne):** En pilotbruker sier en anonymisert setning på norsk dialekt, retter en feiltranskripsjon, prøver stemmekommando og kontrollerer at ingen tekst sendes uten personvernsjekk. Feil dokumenteres uten å oppgradere produksjonsstatus.

## Kort begrepsliste – felles språk i PRD, UX og kode

- **Samtalestøtte:** hele produktet; **hovedveiledning:** første strukturerte KI-råd.
- **Situasjon:** lederens anonymiserte beskrivelse; **tema/undertema:** strukturerte emnevalg som styrer kontekst.
- **Oppfølgingsdialog:** videre spørsmål/svar innenfor en sak, ikke en ny hovedsak.
- **Samtaleøvelse/simulator:** fiktiv samtalepartner for trening, ikke en faktisk medarbeider.
- **Personverngateway:** klient- og serverkontroll før overføring til ekstern KI.
- **SOURCEBANK:** kuratert kildegrunnlag; **RAG:** en mulig framtidig hentegenereringsarkitektur, ikke dagens ferdige lokal-RAG.
- **Golden/fasitcase:** et definert evalueringsscenario, ikke uavhengig juridisk eller HR-fasit.
- **Pilot:** isolert utprøving; **produksjon:** versjon fra `main`/produksjonstjenesten.

## Mål og motmål – til avklaring før kanonisk PRD

- **SM-1 (maskinelt):** alle 9 hovedtemaer skal ha minst to gyldige golden-caser. Verifiser direkte fra `tests/AI-GOLDEN-CASES.json` og dokumenter faktisk antall per tema.
- **SM-2 (funksjonelt):** UJ-01 skal kunne gjennomføres uten API-nøkkel i sensordemo og med reell KI i separat test. Disse bevisene må rapporteres separat.
- **SM-3 (faglig sikkerhet):** på definerte høyrisikocaser skal det ikke være kritiske brudd på diagnose-, skyld- eller kildekrav. Dokumenter modell, dato, testsett og vurderingsmetode.
- **SM-4 (brukervennlighet):** mål om at representative pilotbrukere kan fullføre UJ-01 på mobil uten hjelp. **Terskel og datagrunnlag må settes før vurderingen**, ikke konstrueres i etterkant.
- **Motmål C-1:** kortere eller mer bastante svar må aldri belønnes dersom de øker risiko for feilaktige juridiske råd.
- **Motmål C-2:** flere kilder skal ikke regnes som kvalitet dersom kildevirkeområdet blir feil.
- **Motmål C-3:** grønn automatisk test skal ikke erstatte nødvendig menneskelig vurdering av reelle KI-svar.

**Gjennomført i dokumentasjonsrunden:** Gjeldende PRD er konsolidert, og de 36 kravene har fått observerbare presiseringer. Architecture, Epics/Stories og testbevisregisteret har nå 36/36 eksakte ID-koblinger. **Gjenstår:** funksjonell verifikasjon av akseptansene på endelig commit, full CI inkl. audit, API/RLS- og manuelle testscenarier samt endelig menneskelig gjennomgang. Ikke rapporter denne matrisen som godkjent produkttest.
