# Responskontrakt for KI

Den fremtidige KI-integrasjonen skal returnere strukturert data slik at frontend kan vise resultatet konsekvent.

## Temaidentifikasjon

```json
{
  "main_topic": "Fravær og oppfølging",
  "subtopic": "Oppmøte og punktlighet",
  "confidence": "medium",
  "reason": "Beskrivelsen handler hovedsakelig om gjentatte forsinkelser og oppmøte.",
  "other_relevant_topics": [],
  "needs_followup": true,
  "followup_questions": [
    "Hvor lenge har dette mønsteret pågått?"
  ],
  "uncertainty": "Årsaken til forsinkelsene er ikke kjent."
}
```

## Regler for feltene

- `main_topic`: må være ett av hovedtemaene i Samtalestøtte, eller `null` dersom teksten er for uklar.
- `subtopic`: relevant undertema, eller `null` dersom det ikke kan velges forsvarlig ennå.
- `confidence`: `low`, `medium` eller `high`. Dette uttrykker kun hvor tydelig teksten passer i kategorien, ikke hvor sikker KI-en er på fakta i saken.
- `reason`: kort begrunnelse basert utelukkende på brukerens tekst.
- `other_relevant_topics`: brukes ved reell tematisk overlapp.
- `needs_followup`: true bare når mer informasjon vil gjøre anbefalingen vesentlig bedre eller tryggere.
- `followup_questions`: maksimalt tre spørsmål. Spørsmål skal ikke etterspørre unødvendige sensitive opplysninger.
- `uncertainty`: kort beskrivelse av relevant usikkerhet. Skal være tom streng når ingen viktig usikkerhet trenger å fremheves.

## Viktig

KI-en skal ikke generere skjulte fakta for å fylle feltene. `null`, tom liste eller en tydelig usikkerhet er bedre enn en oppdiktet konklusjon.

Samtidig skal manglende informasjon ikke brukes som grunn til å nekte all hjelp. KI-en skal returnere den delen av analysen som kan gis trygt.


## Avklaringsspørsmål – flervalg
Hvert avklaringsspørsmål kan angi `multi_select: true` når flere alternativer kan være riktige samtidig. Når alternativene er gjensidig utelukkende brukes `multi_select: false`.
