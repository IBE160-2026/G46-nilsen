# Fasit og testsporbarhet – Samtalestøtte

**Formål:** Gjøre det mulig å se hva testene faktisk forventer, hvilke krav de dekker, og hvordan KI-svar vurderes.

## 1. Hvorfor en fasitbank?

Et KI-svar har ikke nødvendigvis én korrekt ordlyd. Samtidig er det utilstrekkelig å teste bare om modellen returnerer et svar.

Samtalestøtte bruker derfor en kombinasjon av:

- deterministiske tester med entydig forventet resultat
- maskinelle kriterier for KI-svar
- eksplisitt menneskelig vurderingsfasit
- kritiske feil som ikke skal aksepteres

## 2. Golden cases

Fasitbanken ligger i:

`tests/AI-GOLDEN-CASES.json`

Den dekker alle ni hovedtemaer:

1. Alkohol og rus
2. Fravær og oppfølging
3. Prestasjon og utvikling
4. Lønn og utvikling
5. Samarbeid og kommunikasjon
6. Avslutning av arbeidsforhold
7. Sikkerhet og ansvar
8. Livssituasjoner
9. Mobbing og trakassering

Hver case inneholder kravspor, forventet tema, maskinelle kontrollpunkter, `MÅ`, `BØR` og kritiske feil.

## 3. To typer fasit

### Maskinell fasit

Brukes der det finnes konkrete og forholdsvis stabile kriterier, for eksempel:

- forventet tema
- behov for avklaringsspørsmål
- struktur i svaret
- kildekrav
- sikkerhetsprioritet
- HR/juridisk kvalitetssikring
- bestemte ubekreftede påstander som ikke må adopteres som fakta

### Menneskelig fasit

Brukes for kriterier som krever faglig skjønn, for eksempel:

- om samtaleåpningen er respektfull og anvendelig
- om rådet skiller fakta fra antakelser på en god måte
- om spørsmålene er relevante
- om rådet er nyansert nok
- om svaret er praktisk for en leder

## 4. Resultatnivåer

`test-ai:golden` bruker:

- **OK** – ingen maskinelle avvik funnet
- **BØR SJEKKES** – ett eller flere kriterier bør vurderes manuelt
- **KRITISK AVVIK** – modellen ser ut til å bryte et eksplisitt sikkerhets-/faktakrav
- **TEKNISK FEIL** – testen kunne ikke gjennomføres på grunn av teknisk/API-relatert feil

Et automatisk `OK` betyr ikke at svaret automatisk er faglig perfekt. Den menneskelige fasiten skal fortsatt brukes.

## 5. Kjøring uten API-nøkkel

Fasitbanken kan valideres uten KI-kall:

```bash
npm run test-golden-schema
```

Denne testen kontrollerer blant annet:

- gyldig struktur
- unike case-ID-er
- kravreferanser
- fasitpunkter
- kritiske feil
- dekning av 9/9 hovedtemaer

Den inngår også i `npm test`.

## 6. Kjøring med ekte KI

```bash
npm run test-ai:golden
```

Denne testen krever konfigurert OpenAI- eller OpenRouter-nøkkel og skriver rapport til `tests/test-results/`.

Rapporten viser både maskinelle funn og den menneskelige fasiten for hver case.

## 7. Sporbarhet

| Testområde | Krav / formål | Bevis |
|---|---|---|
| Personvern | FR-06 / NFR-02 | `tests/test-privacy.js`, `tests/test-server-privacy.cjs` |
| Samtalesimulering | FR-05 | `tests/test-simulation.js` |
| Historikk | FR-09 | `tests/test-history-hotfix.cjs` |
| KI-veiledning | FR-03 / FR-15 | `tests/test-ai.js`, `tests/AI-AUTOTEST-CASES.json` |
| Kritiske KI-saker | FR-03 / FR-15 / AI-01–04 | `tests/test-ai-stress.js`, `tests/cases/AI-STRESS-CASES.json` |
| Golden/fasit | FR-03 / FR-15 / AI-01–04 | `tests/test-ai-golden.js`, `tests/AI-GOLDEN-CASES.json` |
| Modellvalg | FR-13 / FR-14 | `tests/test-model-compare.js` |
| Bred benchmark | FR-14 | `data/BENCHMARK-CASES.json` |

## 8. Kvalitetsprinsipp

Testene skal kontrollere kravene, ikke tvinge produksjonskoden til å tilfredsstille tilfeldige eller foreldede testdetaljer.

Dersom en test feiler, skal det vurderes om:

1. produktet faktisk bryter kravet
2. fasiten er feil eller for rigid
3. testmetoden ikke er egnet til å avgjøre kriteriet automatisk

Dette prinsippet er særlig viktig ved KI-testing, der flere ulike formuleringer kan være faglig gode.
