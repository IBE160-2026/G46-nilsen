# Testdrevet integrasjon – historikk med to fiktive brukere

**Dato:** 18.11.2026  
**Gren:** `docs/ibe160-helhetlig-revisjon-20261118`, ikke `main`.  
**Krav:** FR-07, FR-09, FR-11, FR-12, NFR-01 og NFR-QA-01.  
**Testfil:** `tests/test-auth-history-two-users-http.cjs`.

## Testmiljø og avgrensning

Testen starter den faktiske produksjonsrutingen i `server.js` som separat lokal prosess med `NODE_ENV=production`, `TEST_AUTH_BYPASS=0` og *dummy-nøkler*. En lokal Node HTTP-server etterligner de konkrete kallene til Supabase Auth og PostgREST for **to oppdiktede identiteter** (Alice og Bob) og en fiktiv administratorkonto. Fake-databasen implementerer enkel eierskapsfiltrering på `user_id`.

Ingen produksjonsnøkler, personopplysninger eller faktiske Supabase-forespørsler brukes. Dette er en **API-integrasjonstest av serverens tokenbehandling, brukerrettigheter og oppførsel**, ikke et bevis for at ekte PostgreSQL Row Level Security eller autentisering virker for to kontoer. Et slikt bevis krever et separat testprosjekt med faktisk Supabase Auth og RLS.

## Forventet brukerflyt og observasjoner

| Scenario | Forventet resultat | Verifisert ved grønn kjøring |
|---|---|---|
| Alice og Bob identifiseres med forskjellige sesjonskapsler | Riktig profil fra lokal Auth-mock | Ja |
| Hver bruker oppretter én samtale | Unik ID og brukerbundet lagring | Ja |
| Alice og Bob henter historikk | Bare egne samtaler i responsen | Ja – med RLS etterlignet i den lokale tjenesten |
| Bob sletter Alices ID | 404 NOT_FOUND, Alices rad uendret | Ja |
| Bob prøver å oppdatere Alices ID | 404 NOT_FOUND, Alices rad uendret | Ja, etter serverrettelse |
| Alice oppdaterer sin egen samtale | 200 og oppdatert tittel | Ja |
| Alice eksporterer kontoopplysninger | Bare Alices historikk | Ja |
| Uinnlogget eller forfalsket sesjon | 401 | Ja |
| Vanlig bruker åpner administrasjon | 403 | Ja |
| Fiktiv admin åpner diagnostikk | 200 | Ja |
| Lokal database returnerer en umiddelbar feil | 500 HISTORY_READ_FAILED uten interne feildetaljer | Ja |
| Alice sletter egen historikk | Slettet for Alice, Bob uendret | Ja |

## Rød test: misvisende respons ved fremmed historikk-ID

En første kjøring med forventning om **404** feilet på **500** når Bob forsøkte å oppdatere Alices samtale. Dette var en **feil i API-responsen**, ikke et påvist datalekkasjefunn: backend returnerte ingen synlig rad, men `server.js` behandlet `data=null` lik en databasefeil.

- **Rød kjøring:** [GitHub Actions 44341093359](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44341093359), commit `eb15279805189ed042271a6c0328b9f2e13ce87c`. Feilmelding: `Ukjent/andres historikk-ID bør gi 404, ikke 500`.
- **Endring:** `POST /api/history` skiller oppdatering med tomt resultat (`body.id && !error && !data`) fra reell databasefeil. Fremmed ID og ukjent ID gir samme nøytrale `404 NOT_FOUND`; serveren røper ikke om noen andre eier ID-en. Rettet i commit `ebd23c909b784de2896c01941742368bf6a2e0df`.
- **Grønn kjøring:** [GitHub Actions 44341831405](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44341831405), commit `6aae242536a5a7a0cde61dbfa4a28093e9c72616`. `npm test` med **34** delsteg og `npm audit` ble gjennomført med **SUCCESS**.

## Viktig nyanse ved testing av databasefeil

Da den lokale fake-databasen svarte **503 PGRST000**, nådde forespørselen klientens 7-sekunders testtimeout før testens forventede serverrespons (mellomliggende røde kjøringer). Det sier ikke alene om en virkelig Supabase-feil ville tatt like lang tid, og skal **ikke** fremstilles som bevist produksjonslatens. Vi endret derfor dette *testtilfellet* til en umiddelbar syntetisk databaseforespørselsfeil (**400 PGRST100**) for å teste serverens **feilrespons**, ikke responstid ved et nettverksbrudd. Reell timeout og gjenoppretting ved feil på databasen gjenstår separat.

## Lærdom og sikkerhetsbegrensninger

Dette er et konkret testdrevet eksempel: **rød test → lokalisert feil → minimal kodeendring → grønn regresjon**. Det gir mer troverdig dokumentasjon enn generelle påstander om at tilgangsstyring fungerer.

Sammen med den [skrivebeskyttede undersøkelsen av faktisk Supabase RLS og grants](SUPABASE-SIKKERHET-2026-11-18.md) gir det to **ulike** evidensnivåer: live databasekonfigurasjon og isolert HTTP-integrasjon. Vi har **ikke** utført en faktisk ende-til-ende-test med to innloggede testkontoer i den tilknyttede databasen. Dette er fortsatt en sikkerhetsmessig åpen oppgave.

**LIVE/tale:** ikke del av testen og fortsatt kun pilot på separat gren og Render-tjeneste.
