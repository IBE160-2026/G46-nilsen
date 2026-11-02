# Tillegg til versjonshistorikk v20.11 – 02.11.2026

Dette tillegget kompletterer `docs/VERSJONSHISTORIKK-v20.11.md` uten å omskrive den historiske releasebeskrivelsen.

## Status

- formelt produksjonsgrunnlag: **20.11.5**
- senere arbeidsrunde: UI-, cache-, PWA- og dokumentasjonspatcher uten nytt fullverifisert releasenummer
- autoritativ leveringsgren: `main`
- eksperimentelle UX-endringer ble i sluttfasen også prøvd på pilotgren for å skjerme produksjon

## Ny læring om miljøkontroll

Ved overgang mellom KI-samtaler ble fersk kontekst om aktiv pilotgren ikke bevart godt nok. Eldre kontekst førte til at arbeid startet mot `main`. Dette ble oppdaget manuelt.

Ny fast arbeidsregel:
- kontroller aktiv Git-gren før commit
- kontroller korrekt Render-service før deploy
- ikke anta miljø ut fra eldre samtalekontekst

Hendelsen viser at korrekt kode ikke er tilstrekkelig når agenten opererer mot feil miljø.

## Dokumentasjonssynk

Gjeldende V1-status per 02.11.2026:
- 9 hovedtemaer
- 48 undertemaer
- 114 benchmarkcaser
- 26 golden/pilotcaser

Tidligere 56 undertemaer og mindre testbanker beholdes i historiske dokumenter når de beskriver reell tidligere status.

Yrkes-/sektorlaget finnes i backend/data/tester, men er feature-flagget og ikke ferdig aktivt i produksjons-UI.

Direkte samtale og tale er videre arbeid/hypoteser, ikke ferdige leveransefunksjoner.

Se også:
- `docs/DOKUMENTASJON-SYNK-2026-11-02.md`
- `docs/REFLEKSJONSADDENDUM-2026-11-02.md`
