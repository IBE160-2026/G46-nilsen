# Kildedekning, sporbarhet og kildevalg – revisjon 20.11.2026

**Status:** Arbeidsrapport for PR #15 (oppfølging til den sammenslåtte PR #14). Ikke en attest på at en språkmodell har lest og kontrollert hver lenket side.  
**Avgrensning:** 14 navngitte fagsektorer og «Annet», overordnede arbeidsgiverkilder, praksis for utvalgte svar og sporbare webkilder.  
**Kildebanker:** `data/SOURCEBANK.json` (59 generelle kilder), `data/OCCUPATION-LEGAL-SOURCES.json` (99 registeroppføringer, hvorav noen brukes i flere sektorer) og `data/AGREEMENT-SOURCE-MAP.json`. Antall er et øyeblikksbilde av arbeidsgrenen.

## 1. Hvorfor har Samtalestøtte kilder?

Samtalestøtte gir menneskelig, situasjonsnær samtalestøtte; det er ikke et automatisk juridisk vedtakssystem. Et kildegrunnlag er nødvendig når rådene hviler på etterprøvbare rettsregler, offentlige plikter, profesjonskrav, tariffbetingelser eller spesialisert fagkunnskap. Kildene skal fungere som kvalitetssikring og som brukerens kontrollpunkt – ikke som pynt eller bevis på at en språkmodell har forstått innholdet.

Kildevalg foregår på tre atskilte nivåer:

1. **Kildebank:** Registrert tittel, URL, autoritet, temaord, yrke/sektor, rettslig status og kontrolltidspunkt.
2. **Kandidater til KI:** Utvalgt etter sakens ordlyd, yrkeskontekst, arbeidsgivertype og risiko. En registrert kilde er ikke automatisk kandidat i enhver sak.
3. **Synlig kildegrunnlag:** Kilde-ID-er valgt fra godkjente kandidater og nettlenker som faktisk kan finnes i providerens søkemetadata/URL-annotasjoner. En henvisning fra kildebanken dokumenterer at den er tilgjengelig og valgt, **ikke nødvendigvis at fulltekst ble åpnet eller kontrollert**.

Kilder fra Lovdata er primærrettskilder. Myndighetsveiledninger forklarer praksis, men er ikke selve loven. Tariffavtaler forutsetter riktig avtaleområde. Profesjonsetiske rammeverk, forskning og Akan kan begrunne en fremgangsmåte, men er ikke lovpålagte krav uten selvstendig hjemmel. Brede regelverksindekser er bare oppslagsinnganger og må ikke brukes alene som bevis for én presis plikt.

## 2. Sektorgjennomgang

Tallene under teller **sektortilknyttede** registeroppføringer (en kilde kan telle i flere sektorer). De inkluderer **ikke** de felles lovene, myndighetsveiledningene, forskningen og tariffavtalene som legges til separat når saken krever det.

| Sektor | Antall | Utvalgte autoriteter / kilder | Hva må prøves, og hva er avgrensningen? |
|---|---:|---|---|
| Utdanning og oppvekst | 9 | Lovdata, Udir – opplæringslov, barnehage og skolemiljø | Skille mellom skole/barnehage, elevansvar og en vanlig personalsamtale |
| Helse og omsorg | 7 | Helsedirektoratet, Helsetilsynet, lov om helsepersonell | Autorisasjon, journal og pasientsikkerhet for relevant personell; ikke tilordne autorisasjon til alle støtteyrker |
| Offentlig forvaltning og juss | 5 | Lovdata, Nasjonalarkivet, Advokattilsynet, Finanstilsynet | Habilitet, innsyn og journalføring, og skille stat/kommune fra private virksomheter |
| Forsvar, politi og beredskap | 11 | Forsvaret, Politiet, Kriminalomsorgen, DSB, NSM, Lovdata | Særregler per profesjon, og IKT-rammeverk bare ved reell datasikkerhet |
| Produksjon og industri | 5 | Arbeidstilsynet, DSB, Mattilsynet | Maskiner, opplæring og matproduksjon; ingen fiktiv spesiallov for hver produksjonsstilling |
| Bygg, anlegg og tekniske fag | 7 | Arbeidstilsynet, DSB, byggherreforskriften | Arbeidsgivers ansvar kontra byggherrens plikter; SHA og arbeidsutstyr når relevant |
| Fiskeri, havbruk og sjø | 15 | Fiskeridirektoratet, Sjøfartsdirektoratet, Lovdata, Mattilsynet, Veterinærinstituttet | Unngå å blande skip, akvakultur og fiskehelse; fartøyskompetanse er ikke generelt havbruksregelverk |
| Transport og logistikk | 8 | Vegvesenet, Jernbanetilsynet, Politiet, Arbeidstilsynet | Skille sjåfør-/jernbanekrav, løyve og arbeids-/hviletid |
| Handel, service, hotell og servering | 5 | Arbeidstilsynet, Mattilsynet, Lovdata | Mattrygghet, renhold, frisørhygiene eller servering bare når situasjon/yrke tilsier det |
| Kontor, økonomi, finans og IT | 8 | Finanstilsynet, NSM | Hvitvasking/revisorregler bare for rett rolle; NSMs IKT-prinsipper er anbefalinger, ikke lov |
| Veterinær, dyrehelse og dyr | 12 | Lovdata, DMP, Mattilsynet, Veterinærinstituttet, Den norske veterinærforening | Autorisasjon/journal/legemidler, dyrevelferd, faglig evidens og kollegial yrkesetikk er ulike behov |
| Offshore, energi og kraft | 6 | Havindustritilsynet, DSB | Bemanning, hviletid, sikkerhet og elektriske kvalifikasjoner må matches til arbeidsområde |
| Landbruk, skogbruk og natur | 9 | Landbruksdirektoratet, Mattilsynet, Lovdata, Arbeidstilsynet, Veterinærinstituttet | Plantevern, dyrehold og reindrift er forskjellige hjemmelsområder |
| Luftfart | 5 | Luftfartstilsynet, Lovdata | Sertifikat, sikkerhet og flygende arbeidstids-/hviletidskrav må skille flygende fra bakkepersonell |
| Annet | 0 | Felles arbeidslivs- og samtalekilder ved konkret behov | Ikke anta sektorlov eller tariffdekning |

### Veterinær – begrunnet eksempel

En veterinærs bekymring om **journalføring** tilsier kontroll av dyrehelsepersonelloven og Mattilsynets relevante veiledning. **Legemiddelrekvirering** kan kreve Direktoratet for medisinske produkter og Mattilsynet. **Faglig konflikt mellom veterinærer** kan støttes av Den norske veterinærforenings profesjonsetikk, men denne er ikke en lov for alle ansatte. **Sykdomsberedskap og dyrehelsetrender** kan støttes av Veterinærinstituttet; en nasjonal årsrapport er ikke bevis for den enkelte personalsaken.

Tre av de målrettede nye kildekoblingene i denne runden er:
- Arbeidstilsynets `AT_BUILDING_SITE_COORDINATION` for byggeplassens SHA-/byggherreansvar.
- Den norske veterinærforenings `DNV_VETERINARY_COLLEGIALITY` for veterinærkollegers saklige faglige uenighet.
- NSMs `NSM_IKT_GRUNNPRINSIPPER` for konkrete IKT-sikkerhetssaker. Dette er **ikke-bindende anbefalinger**.
Luftfartstilsynets arbeidstids- og hviletidsoversikt finnes allerede i registeret under `LUFTFART_FTL` og skal ikke dupliseres.

**Avgrenset stikkprøve av de tre nye nettadressene (20.11.2026):**
- [Arbeidstilsynet – byggherreforskriften](https://www.arbeidstilsynet.no/regelverk/forskrifter/byggherreforskriften/): tilgjengelig forskriftstekst; kapitlene skiller byggherrens, prosjekterendes og arbeidsgiverens plikter. Klassifisert som bindende forskrift.
- [DNV – veterinæren og kollegialitet](https://www.vetnett.no/5-3-veterinaeren-og-kollegialitet/category1568.html): punkt 5.3.3 gjelder saklig faglig uenighet mellom veterinærer. Klassifisert som yrkesetikk, ikke lov.
- [NSM – grunnprinsipper for IKT-sikkerhet](https://nsm.no/regelverk-og-hjelp/rad-og-anbefalinger/introduksjon/hva-er-nsms-grunnprinsipper-for-ikt-sikkerhet/): siden forklarer at prinsippene er anbefalinger, ikke i seg selv oppfyllelse av sikkerhetsloven. Klassifisert som ikke-bindende myndighetsveiledning.

Dette bekrefter relevant tekst på **tre åpne nettsider**, ikke juridisk kvalitetssikring av samtlige registeroppføringer og ikke at KI har besøkt sidene i en reell samtale.

## 3. Hvordan kildevalget prøves

`tests/test-sector-source-coverage.cjs` prøver hver av de 14 navngitte sektorene med:
- én **positiv**, konkret sektorhendelse som skal aktivere relevant kildesignal og forventet kilde-ID;
- én **negativ**, ordinær medarbeidersamtale som ikke skal gi sektorlovverk bare fordi yrke er valgt;
- kontroll mot kildelekkasje mellom sektorer;
- dokumentert mangfold av rettskilder, myndighetsveiledning og ikke-bindende fagkilder for veterinærsektoren.

Eksisterende 28 yrkes-/sektorgolden-caser og kilderangeringstester supplerer disse. Disse testene måler **deterministisk utvalg**, ikke juridisk korrekthet i et generert KI-svar.

`tests/test-source-normalization.cjs` kontrollerer at KI-genererte lenker i svartekst ikke blir løftet til «verifiserte kilder» uten søkemetadata eller leverandørens URL-annotasjoner. OpenAI Responses API må eksplisitt be om `web_search_call.action.sources` for å få søkekilden som felt. Supplerende kilder får tittel fra søkemetadata, nettstedets domene som avsender og type «nettkilde»; modellen kan ikke tildele bindende lovstatus, offentlig forfatter eller utgivelsesår bare ved å skrive det i svaret. En kilde kan bare tas med når normalisert URL gjenfinnes i leverandørens søkebevis. Dette er kildeproveniens, **ikke automatisk innholdsvalidering**.

## 4. Kritiske begrensninger før endelig godkjenning

1. **Aktiveringsbryter:** `OCCUPATION_CONTEXT_ENABLED` har standardverdien `false` i serverkoden. Den aktive Render-konfigurasjonen er ikke verifisert her. Hvis bryteren er av, brukes ikke full yrkesspesifikk kontekst selv om registrerte kilder vises under Hjelp.
2. **KI-versus kode:** Grønn CI og isolerte mocktester viser at ruting/kontrakter består. De erstatter ikke manuell eller godkjent, isolert test med **ekte KI**.
3. **Kildelesing:** En kuratert URL kan brukes som startkilde i prompten uten at modellens webverktøy faktisk har åpnet den. Appen må ikke hevde noe annet.
4. **Juridisk presisjon:** Konkrete paragrafpåstander krever sjekk mot korrekt paragraf og gjeldende lovtekst. Eksempel fra brukertest: omtale av AML § 4-3 med URL til § 4-6 skal få vurderingen «feil kildehenvisning» selv om hovedrådet virker rimelig.
5. **Tariff:** Riktig arbeidsgivertype alene er ikke alltid tilstrekkelig til å fastslå tariffdekning. Ikke presenter hypotetiske avtaler som bindende.
6. **Oppdatering:** Kilder merket `timeSensitive` må vedlikeholdes. `lastVerified` betyr kontrolltidspunkt for URL/metadatasett, ikke full juridisk ekspertkontroll.

## 5. Anbefalt akseptanseprøve med ekte KI

Bruk anonymiserte caser: (A) privat butikk/utestenging + oppfølging «Kan jeg gi skriftlig advarsel?», (B) statlig fravær og rettighetsavklaring, (C) veterinærkollegaer med faglig uenighet, (D) byggeplass med SHA-risiko, (E) ordinært samarbeid uten regelspørsmål.

For hver case må vi lagre forventet sektor, valgte kilde-ID-er, visningslenker, om faktisk nettsøk ble brukt, og en **manuell** vurdering av at lenket tekst støtter påstanden. A–D skal ikke gi tomt kildegrunnlag ved konkrete rettslige/faglige påstander. E skal ikke overfylles med irrelevante kilder.

**Publiseringsregel:** Ikke slå sammen PR #15 i `main` på bakgrunn av en pen kildeoversikt alene. Først grønn CI, deretter dokumentert ekte KI-prøve av kildepresisjon (og kontroll av riktig Render-innstilling). Visuell test på egen Render-adresse er bare en mock-demonstrasjon.


## 6. Fem anonymiserte akseptanseprøver – reelle KI-svar og kildekontroll

`tests/AI-SOURCE-ACCEPTANCE-CASES.json` inneholder fem syntetiske caser med faglig fasit, anbefalte kildesignaler og forbudte kilder: (A) privat butikk/utestenging og mulig advarsel, (B) statlig sykefravær, tilrettelegging og diagnosedeling, (C) veterinærkolleger og profesjonsetikk, (D) byggeplass/SHA-risiko og (E) ordinær kontorsamtale uten konkret kildebehov. Alle fem har oppfølgingsspørsmål.

**Deterministisk kontroll:** `npm run test-source-acceptance-contract` validerer sektorene, faktiske kilde-ID-er, casenes forventninger og den menneskelige fasiten. Denne testen kjører i CI og gjør **ingen KI-kall**.

**Ekte KI-test (manuell opt-in):** `tests/test-source-acceptance-live.js` kjører analyse, veiledning og oppfølgingsspørsmål for hver case mot en egen lokal Node-server, og skriver rapporter til `test-results/source-acceptance-*.md` og `.json`. Testen krever lokal `OPENAI_API_KEY`, flagget `--run-live` og eksplisitt `SOURCE_ACCEPTANCE_LIVE=I_ACCEPT_API_COSTS`. I PowerShell:

```powershell
$env:SOURCE_ACCEPTANCE_LIVE = 'I_ACCEPT_API_COSTS'
npm run test-ai:source-acceptance -- --run-live
```

Skriptet starter med `NODE_ENV=test`, syntetiske caser og falsk lokal Supabase-adresse; det er ikke koblet til Render eller produksjonsdatabase. `OCCUPATION_CONTEXT_ENABLED=true` settes bare for testprosessen. Ingen reelle personopplysninger skal brukes. Den betalte testen er **ikke** i automatisk CI og kan ikke hevdes gjennomført uten et faktisk resultat.

**Proveniens via HTTP:** Begge KI-svarløpene returnerer nå `source_provenance` med `webSearchPerformed` (om nettsøk faktisk er kjørt), `providerUrlCount` (unike leverandørdokumenterte nettlenker), `selectedCuratedSourceCount` (valgte bankkilder), `visibleEvidenceCount` (viste kilder) og `contentVerified: false`. Selv et reelt søkeresultat beviser **ikke** at nettsiden er lest eller støtter en konkret påstand. Automatisk rapport sjekker struktur, kildemengde og feil sektor; menneskelig kontroll må vurdere rett paragraf, virkeområde, kildeinnhold, tariff og faglig presisjon. Rapportens sjekkbokser skal signeres før godkjenning.

**Ende-til-ende regressjon uten KI-kostnader:** `npm run test-source-provenance-http` starter den faktiske Express-serveren og OpenAI SDK med lokal simulert provider. Den sender både første råd og oppfølging gjennom API-ene, forsøker å injisere en oppdiktet lovkilde og feil lovstatus/forfatter, og kontrollerer at kun en URL dokumentert av søkemetadata vises med riktig proveniens. Den kontrollerer også at OpenAI-kallet eksplisitt ber om kildemetadata. Denne testen ligger i vanlig `npm test`, har ingen ekte KI-kall, og kan ikke erstatte faglig kontroll av kildenes innhold.

**Utvidet fritekstvern (21.11):** KI kan produsere rå `https://`-lenker eller `www.`-adresser utenfor `source_ids`. Serveren fjerner derfor nå slike lenker fra alle brukerrettede felt i første råd (`opening`, spørsmål, reaksjoner, forberedelser, oppmerksomhet, juridisk/faglig merknad, neste steg) og fra både svar og foreslåtte oppfølgingsspørsmål. Strukturerte kilder beholdes urørt og kontrolleres fortsatt mot kildebank/nettsøk; dette **beviser ikke** at hvert juridisk utsagn er korrekt. Enhetstest og ekte Express/SDK-test med lokal simulert modell injiserer nå falske URL-er i samtlige felt.

**Kontroll av kildekandidater og virkeområde (21.11):** `npm run test-source-acceptance-routing` følger nå faktisk kildevelger, yrkeskontekst, topp-10-grense og kildesperre i både første råd og oppfølgingsspørsmål for alle fem akseptansesakene. Den kontrollerer at minst én av de relevante kandidatene tilbys modellen i hver faglig sak, at uttrykkelig utenforliggende sektorkilder ikke tilbys, og at ordinær arbeidsdeling ikke presses inn i juridisk kildebruk. Dette er en deterministisk **kandidatkontroll**, ikke bevis for hva en levende KI velger. [Kilde-til-påstand kontrollmatrise](KILDER-TIL-PASTAND-AKSEPTANSE-2026-11-21.md) dokumenterer hva de autoritative kildene faktisk kan underbygge, og hvilke slutninger som ikke kan tas ut fra dem. Den manuelle vurderingen av konkrete, genererte KI-svar gjenstår.

**Negasjoner og kildebehov (21.11):** Funn i både `source-retention` og `occupation-router`: tegnsetting forsvant før negasjonssjekken, slik at «ingen sikkerhetshendelse i går» kunne undertrykke et faktisk risikosignal i neste setning. Et generelt «ikke» kunne dessuten feiltolke «har ikke fulgt sikkerhetsrutinen» som fravær av risiko; tilsvarende kan manglende verneutstyr nettopp være en fare. Begge rutene bruker nå delt negasjonskontroll med setnings- og kontrastgrenser. `npm run test-source-negation-boundaries` tester trygg/risikofylt arbeidsdeling og eksplisitte negasjoner (8 cases + 2 gjentatte risikotermer) uten KI-kall. Tekstreglene er fortsatt heuristikker, ikke en semantisk garanti; kritiske råd krever konkret kilde- og situasjonsvurdering.

**Gjenstående før merge:** Grønn Quality Gate på siste commit, reell KI-kjøring med fem caser, manuell kildekontroll og separat kontroll av faktisk `OCCUPATION_CONTEXT_ENABLED` i riktig Render-miljø. Ingen Render-innstillinger endres automatisk.
