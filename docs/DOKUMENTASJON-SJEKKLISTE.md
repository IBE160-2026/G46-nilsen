# Dokumentasjonssjekkliste – Samtalestøtte

**Formål:** holde dokumentasjonen synkron med faktisk kode og faktisk verifisert funksjonalitet frem mot innlevering.

## Arbeidsregel

Ved større endringer skal minst disse fire spørsmålene vurderes:

- Har funksjonen endret hva produktet **kan gjøre**?
- Har endringen gitt ny **læring/refleksjon** som bør dokumenteres?
- Har endringen påvirket **teststatus, personvern, kilder eller avgrensninger**?
- Må **AI-loggen** oppdateres fordi KI ble brukt til analyse, kode, testing, feilsøking eller produktvalg?

Planlagte funksjoner skal aldri beskrives som ferdige før de er implementert og verifisert.

## Status 01.11.2026

### Oppdatert

- [x] README: konkret sammenligning med norske beslektede tilbud
- [x] README: kurs/trening versus løpende støtte i behovsøyeblikket
- [x] README: direkte samtale omtalt som planlagt utprøving, ikke ferdig funksjon
- [x] AI-logg: mobil/PWA-arbeid
- [x] AI-logg: pilotfunn og KI-styrt regresjon
- [x] AI-logg: UI-regresjon og gjenbruk av historisk kode 01.11
- [x] AI-logg: produktdifferensiering og norsk sammenligning 01.11
- [x] Refleksjonsnotater: gjenbruk før redesign / context drift
- [x] Refleksjonsnotater: dokumentasjon som kvalitetskontroll
- [x] Refleksjonsnotater: utskrift som skjult DOM-avhengighet
- [x] Versjonshistorikk: arbeidsrunde 01.11
- [x] PWA/installasjon dokumentert som webapp, ikke Play Store/App Store-app
- [x] Yrkes-/regelverksarkitektur har eget dokument og er tydelig merket som videre arbeid/feature-flagget lag

### Må gjennomgås og synkroniseres

- [x] README: kjernefunksjonslisten nevner utskrift og videre råd
- [x] README: 20.11.5 kontrollert mot package/server/.env; pågående arbeidsrunde etter release er tydelig merket
- [x] README: historiske testtall ryddet og skilt tydelig fra dagens utvidede testpakke
- [x] product-brief.md: utskrift lagt inn som faktisk funksjon
- [x] product-brief.md: støtte i behovsøyeblikket og videre KI-dialog tydeliggjort
- [x] product-brief.md: direkte samtale tydelig merket som hypotese/videre arbeid
- [x] product-brief.md: produktdifferensiering nyansert mot norske sammenlignbare tilbud
- [ ] REFLEKSJONSRAPPORT-UTKAST.md: integrere 01.11-læring fra refleksjonsnotatene i hovedteksten
- [x] REFLEKSJONSRAPPORT-UTKAST.md: konkret sammenligning med norske tilbud lagt inn
- [x] REFLEKSJONSRAPPORT-UTKAST.md: tydelig skille mellom kurs/trening og løpende støttefunksjon
- [x] REFLEKSJONSRAPPORT-UTKAST.md: direkte samtale omtalt som testbar hypotese
- [ ] REFLEKSJONSRAPPORT-UTKAST.md: kontrollere ordantall og fjerne overlapp/gjentakelser før levering
- [x] BRUKERTEST-FUNN-OG-BACKLOG.md: nye funn om informasjonsmengde, sammenfolding og utskrift lagt inn
- [ ] BRUKERTEST-FUNN-OG-BACKLOG.md: skille tydelig mellom implementert, under arbeid og forkastet
- [x] PRD: utskrift/videre råd/PWA kontrollert; direkte samtale lagt inn som hypotese/videre arbeid
- [x] UX-dokumentasjon: progressivt rådshierarki og standardtilstand dokumentert
- [x] AI-INTEGRATION.md: videre dialog, yrkeslag/feature flagg og direkte samtale-hypotese synkronisert
- [x] AI-RESPONSE-CONTRACT.md: menneskelig åpningsstil og reaksjonsstruktur dokumentert
- [x] AI-TESTPLAN.md: nye verifiseringsbehov for rådshierarki, utskrift, videre råd og direkte samtale lagt inn
- [x] SOURCEBANK: maskinlesbar bank kontrollert til 62 kilder, samsvarer med SOURCEBANK v6-dokumentasjonen
- [x] CHANGELOG.md: arbeidsrunden 01.11 dokumentert eksplisitt som ikke-fullverifisert release
- [ ] VERSJONSHISTORIKK-v20.11.md: oppdatere når arbeidsrunden eventuelt får eget releasenummer

### Funksjoner som må omtales forsiktig

- [ ] Yrkes-/sektortilpasning: ikke kall den aktiv i produksjon før feature flagg/UI/runtime er verifisert
- [ ] Tariff-/avtalelogikk: ikke fremstilles som automatisk juridisk fasit
- [ ] Direkte samtale: planlagt utprøving, ikke ferdig funksjon
- [ ] Voice: videre arbeid, ikke del av nåværende produkt
- [ ] Full teststatus: ikke skriv at dagens kode har bestått full suite uten en faktisk ny fullkjøring
- [ ] «Unik»: unngå absolutte produktpåstander som ikke kan dokumenteres

## Dokumenter som skal være kilder til slutt-rapporten

1. `docs/REFLEKSJONSRAPPORT-UTKAST.md` – hovedrapport
2. `docs/REFLECTION-NOTES-v20.md` – råmateriale/læringspunkter
3. `docs/ai/AI-LOGG-SAMTALESTOTTE.md` – sporbar KI-bruk
4. `docs/BRUKERTEST-FUNN-OG-BACKLOG.md` – faktisk brukerinnsikt
5. `docs/VERSJONSHISTORIKK-v20.11.md` + `CHANGELOG.md` – kode-/releasebevis
6. `docs/ai/AI-TESTPLAN.md` + testfiler – testbevis
7. `docs/SOURCEBANK.md` + maskinlesbar kildebank – faglig kildegrunnlag
8. `docs/OCCUPATION-KNOWLEDGE-ARCHITECTURE.md` – yrkes-/regelverkslag og avgrensninger

## Før innlevering

- [ ] Kjør ny full lokal testpakke på endelig commit dersom mulig
- [ ] Dokumenter eksakt commit/release som ble testet
- [ ] Kontroller produksjonslenken
- [ ] Kontroller mobil/PWA på fysisk enhet
- [ ] Kontroller utskrift med hovedråd + videre råd
- [ ] Kontroller historikk og personvernflyt
- [ ] Oppdater README med endelig produksjonsversjon
- [ ] Oppdater AI-logg med siste utviklingsrunde
- [ ] Oppdater refleksjonsrapport med endelige brukertestfunn
- [ ] Fjern påstander om planlagte funksjoner som ikke ble levert
- [ ] Kontroller at rapporten skiller klart mellom egne vurderinger, KI-forslag, brukerfunn og dokumenterte fakta
