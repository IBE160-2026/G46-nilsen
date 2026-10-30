import { resolveOccupationContext } from "./occupation-router.js";
import { suggestAgreementAreas } from "./agreement-router.js";

export function buildOccupationGuidanceContext({
  occupation = "",
  sectorId = "",
  employerType = "",
  employerContext = "",
  topic = "",
  subtopic = "",
  situation = ""
} = {}) {
  const occupationResult = resolveOccupationContext({
    occupation,
    sectorId,
    topic,
    subtopic,
    situation
  });

  const agreementResult = suggestAgreementAreas({
    occupation,
    employerType,
    employerContext,
    topic,
    subtopic,
    situation
  });

  if (!occupationResult.selected) {
    return {
      enabled: false,
      occupation: occupationResult,
      agreement: agreementResult,
      prompt: ""
    };
  }

  if (!occupationResult.occupationRelevant) {
    const lines = [
      "## Yrkes-/næringskontekst",
      `Brukeren har oppgitt yrke/næring: ${occupation || occupationResult.sectorLabel || "ukjent"}.`,
      "Denne yrkeskonteksten er ikke materiell for den aktuelle saken.",
      "Ikke trekk inn sektorlovverk, sikkerhetsregler eller yrkesmetadata bare fordi yrket er valgt.",
      "Gi vanlig, menneskelig lederstøtte ut fra selve situasjonen."
    ];

    // Tariff/avtale kan være relevant selv når yrket i seg selv ikke er det,
    // for eksempel i en lønns- eller arbeidstidssak. Hold disse vurderingene adskilt.
    if (agreementResult.relevant) {
      if (agreementResult.needsEmployerType) {
        lines.push("Tariff/overenskomst kan være relevant, men arbeidsgivertype mangler.");
        lines.push("Ikke gjett avtaleområde. Dersom tariff faktisk påvirker rådet, be om ett kort avklaringssvar: Privat, kommune/fylkeskommune, stat, helseforetak eller usikker.");
      } else if (agreementResult.suggestions.length) {
        lines.push("Mulig avtaleområde er bare et forslag og må bekreftes før konkrete tariffrettigheter brukes.");
        for (const area of agreementResult.suggestions.slice(0, 2)) {
          lines.push(`- Mulig avtaleområde: ${area.label}`);
        }
      }
    }

    return {
      enabled: true,
      occupation: occupationResult,
      agreement: agreementResult,
      prompt: lines.join("\n")
    };
  }

  const lines = [
    "## Yrkes-/næringskontekst",
    `Yrke/næring: ${occupation || "ikke spesifisert"}.`,
    `Arbeidsområde: ${occupationResult.sectorLabel || occupationResult.sectorId || "uavklart"}.`,
    "Bruk yrkeskonteksten diskret: la den merkes i realistiske råd, arbeidsflyt, risiko og eksempler, ikke som metadata-oppramsing.",
    "Start med lederens situasjon og praktiske neste steg. Ikke start med paragrafer eller myndighetsnavn med mindre brukeren uttrykkelig spør hva loven sier.",
    "Hvis regelverk er relevant, forklar hva det betyr i praksis og skill mellom lov/forskrift, tariff/overenskomst og lokale rutiner.",
    "Ikke anta innholdet i virksomhetens lokale rutiner, personalreglement, HMS-rutiner eller lokale avtaler."
  ];

  if (occupationResult.legalSources.length) {
    lines.push("Godkjente autoritative startkilder ved behov:");
    for (const source of occupationResult.legalSources.slice(0, 5)) {
      lines.push(`- ${source.authority}: ${source.title} (${source.url})`);
    }
    lines.push("Bruk fersk autoritativ kilde for konkrete rettslige påstander; ikke stol på modellhukommelse alene.");
  }

  if (agreementResult.relevant) {
    if (agreementResult.needsEmployerType) {
      lines.push("Tariff/overenskomst kan være relevant, men arbeidsgivertype mangler.");
      lines.push("Ikke gjett avtaleområde. Dersom tariff faktisk påvirker rådet, be om ett kort avklaringssvar: Privat, kommune/fylkeskommune, stat, helseforetak eller usikker.");
    } else if (agreementResult.suggestions.length) {
      lines.push("Mulig avtaleområde er bare et forslag og må bekreftes før konkrete tariffrettigheter brukes.");
      for (const area of agreementResult.suggestions.slice(0, 2)) {
        lines.push(`- Mulig avtaleområde: ${area.label}`);
      }
    }
  }

  return {
    enabled: true,
    occupation: occupationResult,
    agreement: agreementResult,
    prompt: lines.join("\n")
  };
}
