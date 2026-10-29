# Versjonshistorikk og commitspor – v20.10

**Status:** Aktiv sporbarhetslogg for sluttfasen  
**Autoritativ branch:** `main`  
**Omfang:** v20.10.4–v20.10.9

Dette dokumentet kobler funksjonelle versjoner til den faktiske commitrekkefølgen i Git. `CHANGELOG.md` beskriver hva som ble levert; denne filen viser hvordan endringene faktisk ble skrevet til repoet.

## Hvorfor har noen versjoner flere `chore: bump versjon`-commits?

Deler av utviklingen ble gjort via en GitHub-tilkobling som oppdaterer én eksisterende fil per write-operasjon. Når samme versjonsnummer må synkroniseres i `package.json`, `package-lock.json`, `server.js`, `index.html`, `app.js` og tester, blir dette derfor flere små commits med samme budskap. De er én samlet versjonsoppdatering, ikke separate produktendringer.

Historikken er bevisst **ikke** omskrevet eller squash'et i etterkant. Det bevarer etterprøvbarheten mellom kode, tester, deploy og dokumentasjon.

## Branch-status

- `main` er autoritativ og brukes av Render.
- `pilot-improvements-2026-10-28` peker på en eldre commit som er fullt innlemmet i `main`.
- `predeploy-check-2026-10-28` inneholder tre midlertidige CI-verifikasjonscommits fra en kontrollgren. De er ikke del av produktets `main`-historikk.

De to arbeidsgrenene er ikke autoritative. Tilgjengelig GitHub-tilkobling i denne arbeidsøkten støtter ikke sletting av branch-ref, så de er dokumentert eksplisitt i stedet for å flyttes eller omskrives.

## v20.10.9

- `6faf8fa737` · 2026-10-29 · docs: merk taksonomigjennomgang som historisk beslutningsgrunnlag
- `8b9a854c28` · 2026-10-29 · docs: legg inn nye refleksjonspunkter fra sluttfasen
- `49d7ae1682` · 2026-10-29 · docs: logg KI-bruk i regresjon og taksonomiarbeid
- `2662a92c46` · 2026-10-29 · docs: lagre refleksjoner fra produksjonsflyt og taksonomi
- `226c5fc9a0` · 2026-10-29 · docs: kompletter changelog for v20.10.4 til v20.10.9
- `fc4b7fc7c5` · 2026-10-29 · docs: dokumenter produksjonsflyt-test og taksonomisynk
- `7760dd9f64` · 2026-10-29 · docs: oppdater arkitekturstatus til v20.10.9
- `85e3e46b68` · 2026-10-29 · docs: synkroniser PRD med v20.10.9
- `f741144658` · 2026-10-29 · docs: synkroniser product brief med 48 undertemaer
- `e4ed49e041` · 2026-10-29 · docs: oppdater README til v20.10.9 og 48 undertemaer
- `ff06dd0293` · 2026-10-29 · test: kjør benchmark-taksonomi i lokal testpakke
- `ef1855756d` · 2026-10-29 · test: lås benchmarkbank mot gjeldende taksonomi
- `d2848bc50d` · 2026-10-29 · test: synkroniser benchmarkbank med 48 undertemaer
- `410d376abe` · 2026-10-28 · test: lås revidert undertemastruktur og versjon 20.10.9
- `95a753b232` · 2026-10-28 · chore: bump versjon til 20.10.9
- `d68706574a` · 2026-10-28 · chore: bump versjon til 20.10.9
- `db5bafe4ee` · 2026-10-28 · chore: bump versjon til 20.10.9
- `aaf907c1a7` · 2026-10-28 · chore: bump versjon til 20.10.9
- `70316a1564` · 2026-10-28 · chore: bump versjon til 20.10.9
- `011d9e5a2d` · 2026-10-28 · ai: synkroniser revidert undertemastruktur
- `ee4b462d46` · 2026-10-28 · ux: forenkle undertemaer og beskrivelser

## v20.10.8

- `65f2f415af` · 2026-10-28 · chore: bump versjon til 20.10.8
- `bbd1e0c156` · 2026-10-28 · chore: bump appversjon til 20.10.8
- `7a7a83ba51` · 2026-10-28 · chore: bump versjon til 20.10.8
- `deaf59f328` · 2026-10-28 · chore: bump versjon til 20.10.8
- `ec5a9d2fe5` · 2026-10-28 · chore: bump versjon til 20.10.8
- `eb532b49be` · 2026-10-28 · chore: bump versjon til 20.10.8
- `ea7fe59a19` · 2026-10-28 · test: lås tre personvernfunn fra full produksjonsflyt
- `115bcd0d51` · 2026-10-28 · test: lås tre personvernfunn fra full produksjonsflyt
- `bfa4580bb5` · 2026-10-28 · privacy: fjern falske navnetreff fra generiske arbeidslivscaser

## v20.10.7

- `1a5a4a6453` · 2026-10-28 · chore: bump versjon til 20.10.7
- `3c6bde3a7a` · 2026-10-28 · chore: bump versjon til 20.10.7
- `3e2b477add` · 2026-10-28 · chore: bump versjon til 20.10.7
- `8330a5539f` · 2026-10-28 · chore: bump versjon til 20.10.7
- `dc92b0fb52` · 2026-10-28 · chore: bump versjon til 20.10.7
- `74ffb9e472` · 2026-10-28 · chore: bump versjon til 20.10.7
- `98ed900320` · 2026-10-28 · test: dekk full produksjonsflyt og mykere kvalitetskontroll
- `a4324d74a9` · 2026-10-28 · admin: tilby full produksjonsflyt-test med 26 saker
- `2f89aedf5f` · 2026-10-28 · admin: legg til full produksjonsflyt-test og mykere vurdering
- `a3a396798f` · 2026-10-28 · test: utvid produksjonsflyt-test til hele goldenbanken

## v20.10.6

- `52dbcfd9af` · 2026-10-28 · chore: bump versjon til 20.10.6
- `f0ca4a4eb7` · 2026-10-28 · chore: bump versjon til 20.10.6
- `05a537c996` · 2026-10-28 · chore: bump versjon til 20.10.6
- `c7332e1851` · 2026-10-28 · chore: bump versjon til 20.10.6
- `73dc3906b4` · 2026-10-28 · chore: bump versjon til 20.10.6
- `ac8e618e19` · 2026-10-28 · chore: bump versjon til 20.10.6
- `ae0ed6ec09` · 2026-10-28 · test: dekk pilotlogging og Gemma rate limit
- `1d6f3f369b` · 2026-10-28 · admin: bevar pilotresultater og håndter Gemma 429
- `e9ee6dc684` · 2026-10-28 · test: logg pilotresultater og forklar Gemma 429

## v20.10.5

- `8ba7258e74` · 2026-10-28 · chore: bump versjon til 20.10.5
- `1090c3c747` · 2026-10-28 · chore: bump versjon til 20.10.5
- `42867b83f2` · 2026-10-28 · chore: bump versjon til 20.10.5
- `e48e23453d` · 2026-10-28 · chore: bump versjon til 20.10.5
- `b4560de197` · 2026-10-28 · chore: bump versjon til 20.10.5
- `7eec60af6e` · 2026-10-28 · chore: bump versjon til 20.10.5
- `7e65e21bd8` · 2026-10-28 · test: ta pilotregresjon inn i lokal testpakke
- `dae0599da6` · 2026-10-28 · test: legg til regresjonstest for pilotkjøring
- `478357c645` · 2026-10-28 · admin: kjør pilotcaser gjennom produksjonsflyten
- `0283495803` · 2026-10-28 · admin: legg til automatisk pilotkontroll
- `66a6605cf7` · 2026-10-28 · test: eksponer pilotcaser og merk testtrafikk
- `9ae3a8da45` · 2026-10-28 · test: legg til automatisk pilotkjøring
- `166877b4c2` · 2026-10-28 · test: vurder pilotåpninger automatisk
- `a2b7c1dcd6` · 2026-10-28 · test: legg inn pilotcaser for menneskelige åpninger

## v20.10.4

- `700a009b7d` · 2026-10-28 · chore: bump versjon til 20.10.4
- `d9181af267` · 2026-10-28 · chore: bump versjon til 20.10.4
- `b5323dd51f` · 2026-10-28 · chore: bump versjon til 20.10.4
- `a096f65a43` · 2026-10-28 · chore: bump versjon til 20.10.4
- `f1b5c3ae2d` · 2026-10-28 · chore: bump versjon til 20.10.4
- `847d4159ed` · 2026-10-28 · chore: bump versjon til 20.10.4
- `5fc7647133` · 2026-10-28 · docs: dokumenter menneskelig språk og tekstmarkering
- `145ecccc4a` · 2026-10-28 · test: oppdater hovedtema i golden-schema
- `406fdf8b46` · 2026-10-28 · test: synkroniser fasitbank med nytt oppsigelsestema
- `1fff1a7938` · 2026-10-28 · test: fang tekstmarkering som følger historikkbytte
- `82a5215347` · 2026-10-28 · fix: nullstill tekstmarkering ved samtalebytte
- `58e5b0ea81` · 2026-10-28 · test: kjør veiledningskvalitet i lokal testpakke
- `c2c6681e7a` · 2026-10-28 · test: legg til kontrakt for menneskelig samtalestøtte
- `30fead5bc7` · 2026-10-28 · test: flagg mekaniske og instruksjonsaktige åpninger
- `524b541114` · 2026-10-28 · ai: stram inn veiledningsformat og temasynk
- `5cca828379` · 2026-10-28 · ai: gjør samtaleåpninger kortere og mer menneskelige
- `cc2e10cdf9` · 2026-10-28 · ai: synkroniser oppsigelsestema med klienten
- `35deb1d535` · 2026-10-28 · ux: tydeliggjør oppsigelse og avslutning

## Prinsipp fremover

- Funksjonsendringer, tester og dokumentasjon skal ha beskrivende commitmeldinger.
- Versjonsnummer skal oppdateres samlet når en ny publisert appversjon faktisk etableres.
- Historiske testresultater skal ikke omskrives som om de gjaldt nyere kode.
- `CHANGELOG.md`, refleksjonsnotater og denne commitloggen skal oppdateres når en endring er viktig for vurdering, testbevis eller læring.
- `main` er fasit for innlevering; midlertidige arbeidsgrener skal ikke brukes som dokumentasjonskilde.
