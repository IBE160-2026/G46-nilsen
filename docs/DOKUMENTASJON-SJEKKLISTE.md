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

- [ ] README: kjernefunksjonslisten må eksplisitt nevne utskrift og videre råd
- [ ] README: kontrollere at versjonsnummer/dato fortsatt beskriver riktig produksjonsrelease
- [ ] README: kontrollere alle historiske testtall mot hvilken versjon de faktisk gjelder
- [ ] product-brief.md: legge inn utskrift som faktisk funksjon
- [ ] product-brief.md: beskrive videre KI-dialog og støtte i behovsøyeblikket tydeligere
- [ ] product-brief.md: direkte samtale kun som hypotese/videre arbeid
- [ ] product-brief.md: kontrollere produktdifferensiering mot den nye norske sammenligningen
- [ ] REFLEKSJONSRAPPORT-UTKAST.md: integrere 01.11-læring fra refleksjonsnotatene i hovedteksten
- [ ] REFLEKSJONSRAPPORT-UTKAST.md: ta inn konkret sammenligning med norske tilbud
- [ ] REFLEKSJONSRAPPORT-UTKAST.md: tydelig skille kurs/trening fra løpende støttefunksjon
- [ ] REFLEKSJONSRAPPORT-UTKAST.md: omtale direkte samtale som testbar hypotese, ikke ferdig produktfordel
- [ ] REFLEKSJONSRAPPORT-UTKAST.md: kontrollere ordantall og fjerne overlapp/gjentakelser før levering
- [ ] BRUKERTEST-FUNN-OG-BACKLOG.md: legge inn nye funn om informasjonsmengde, sammenfolding og utskrift
- [ ] BRUKERTEST-FUNN-OG-BACKLOG.md: skille tydelig mellom implementert, under arbeid og forkastet
- [ ] PRD: kontrollere at utskrift, videre råd, PWA og eventuell direkte samtale har riktig status
- [ ] UX-dokumentasjon: beskrive dagens rådshierarki og hvorfor første deler vises åpne
- [ ] AI-INTEGRATION.md: kontrollere at dagens kildebruk, videre dialog og yrkeslag er korrekt beskrevet
- [ ] AI-RESPONSE-CONTRACT.md: kontrollere samsvar med menneskelig åpningsstil og reaksjonsstruktur
- [ ] AI-TESTPLAN.md: legge til/oppdatere tester for rådshierarki, utskrift og videre råd der dette er hensiktsmessig
- [ ] SOURCEBANK.md: kontrollere at alle kilder som omtales som runtime-kilder faktisk finnes i maskinlesbar bank
- [ ] CHANGELOG.md: samle 30.10–01.11-endringer uten å late som arbeidsrunden er en fullverifisert release
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
