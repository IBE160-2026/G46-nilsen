import { sourceTier } from "./help-library.js";
import { isSourceValidOn } from "./source-validity.js";

/**
 * Siste kontrollpunkt før kuraterte kildekandidater sendes til KI.
 * Hver delkilde (generell, yrke, tariff) kan komme gjennom ulike
 * rutere. Denne grensen må avvise utløpte / ennå ikke gyldige
 * dokumenter FØR deduplisering og ti-kildersbegrensning.
 * Kildedatoer dokumenterer ikke faktisk avtaledekning eller juridisk
 * innhold.
 */
export function mergeGuidanceSourceCandidates(
  generalSources = [], occupationContext = null, employerType = "", asOf = new Date()
) {
  const prioritized = [];

  if (occupationContext?.occupation?.occupationRelevant) {
    prioritized.push(...(occupationContext.occupation.legalSources || []));
  }

  // For offentlige avtaleområder: disse er bare kandidater og er ikke
  // en bekreftelse på at den konkrete overenskomsten gjelder.
  if (
    occupationContext?.agreement?.relevant &&
    !occupationContext?.agreement?.needsEmployerType &&
    ["state","municipal","health_enterprise"].includes(employerType)
  ) {
    for (const area of occupationContext.agreement.suggestions || []) {
      prioritized.push(...(area.curatedSources || []));
    }
  }

  prioritized.push(...generalSources);

  const seen = new Set();
  return prioritized
    .filter(source => source?.id && isSourceValidOn(source, asOf))
    .map(source => ({
      ...source,
      sourceTier: source.sourceTier || sourceTier(source)
    }))
    .filter(source => !seen.has(source.id) && seen.add(source.id))
    .slice(0, 10);
}
