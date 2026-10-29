# Versjonsstrategi – Samtalestøtte

**Besluttet:** 29.10.2026
**Gjelder fra:** etter v20.10.10

## Hvorfor rydde nå?

Prosjektets tidligere versjonsnumre vokste organisk gjennom mange små utviklings- og testiterasjoner. Historikken er verdifull og skal ikke omskrives, men nummereringen ligner SemVer uten at den alltid har fulgt en konsekvent regel.

Gamle versjonsnumre beholdes uendret. Ryddingen gjelder bare nye versjoner.

## Regel fremover

Format: `HOVED.MILEPÆL.PATCH`.

- **HOVED** endres ved en tydelig produktmilepæl eller release candidate.
- **MILEPÆL** endres når en samlet funksjons-/UX-runde leveres.
- **PATCH** brukes til mindre feilrettinger og små justeringer uten ny funksjonell milepæl.

## Neste versjoner

- **20.10.10** er siste publiserte versjon i den gamle løpende serien.
- **20.11.0** er samlet produksjonsrelease for pilotforbedringene 29.10.2026: mobil-first UX, PWA/installasjon, merkevare, begrepskonsistens og dokumentasjonssynk.
- **20.11.1, 20.11.2 ...** brukes bare dersom produksjonsrelease 20.11 trenger mindre feilrettinger.
- **21.0.0** brukes når produktet når en reell innleverings-/release-candidate-milepæl: prioriterte pilotfunn er behandlet, hovedflytene er testet, dokumentasjonen samsvarer med produktet og løsningen vurderes som klar for sluttkontroll.

## Viktig

Versjon 21 skal ikke utløses av dato, antall commits eller at tallet 20.11 'ser fullt ut'. Hoppet skal representere en faktisk produktmilepæl.

Arbeidsgrener kan utvikle neste milepæl uten å bump'e den publiserte appversjonen. Versjonsnummeret endres først når en samlet versjon skal merges/deployes.
