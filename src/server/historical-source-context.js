import { isSourceValidOn } from "./source-validity.js";

// Historiske arbeidsretts-/tariffspørsmål trenger dokumentasjon fra riktig
// periode. Dette er en FORSIKTIGHETSSPERRE, ikke juridisk rekonstruksjon.
// Ikke bruk et vilkårlig årstall (f.eks. ansettelsesår) som rettslig dato.

const relevantRights = /\b(?:tariff\w*|hovedtariff\w*|hovedavtale\w*|overenskomst\w*|lønn\w*|lonn\w*|overtid\w*|tillegg\w*|godtgjør\w*|godtgjor\w*|rettighet\w*|lov\w*|regel\w*|arbeidstid\w*|oppsig\w*|medbestemmelse\w*)\b/iu;
const pastEntitlement = /\b(?:gjaldt|historisk\w*|den\s+gangen|på\s+den\s+tiden|etterbetal\w*|etteroppgjør\w*|tilbakevirk\w*|hadde\s+(?:\w+\s+){0,5}?(?:krav|rett)|hvilke\s+(?:regler|rettigheter)\s+var|hvilken\s+(?:tariffavtale|hovedavtale|lov)\s+var)\b/iu;
const dateValid = value => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(value + "T00:00:00.000Z");
  return Number.isFinite(time) && new Date(time).toISOString().slice(0,10) === value;
};

function norwayYear(asOf) {
  if (typeof asOf === "string" && dateValid(asOf)) return Number(asOf.slice(0,4));
  if (!(asOf instanceof Date) || Number.isNaN(asOf.getTime())) return null;
  return Number(new Intl.DateTimeFormat("en-GB", {
    timeZone:"Europe/Oslo",year:"numeric"
  }).format(asOf));
}

export function detectHistoricalSourceQuestion(textValue, asOf = new Date()) {
  const text = String(textValue || "").toLocaleLowerCase("nb-NO");
  const currentYear = norwayYear(asOf);
  if (!currentYear || !relevantRights.test(text)) return null;
  const years = [...new Set(
    [...text.matchAll(/\b(?:19\d{2}|20\d{2})\b/gu)]
      .map(match => Number(match[0]))
      .filter(year => year < currentYear)
  )].sort((a,b)=>a-b);
  // Et eksplisitt årstall for inneværende kalenderår er ikke det samme
  // som et udatert historisk spørsmål. Vi kan ikke velge historiske
  // tariffperioder ut fra et år som fortsatt løper.
  if (!years.length && new RegExp("\\b"+currentYear+"\\b","u").test(text)) return null;
  // Et eksplisitt spørsmål om fortidige rettigheter uten årstall skal
  // fortsatt flagges; dato må avklares fremfor å velge dagens avtale.
  // «For 2024» må kobles til et lønns-/rettighetsspørsmål. Opplysninger
  // som «ansatt siden 2024» eller «hendelsen var i 2024» alene er ikke nok.
  const periodAsked = years.some(year => new RegExp(
    "\\bfor\\s+(?:året\\s+)?"+year+"\\b","u"
  ).test(text) && /\b(?:avtale|tariff|oppgjør|krav|utbetaling|etterbetaling|lønn)\b/iu.test(text));
  // «Krav fra 2024» er en sak om tidligere opptjening, mens
  // «ansatt siden 2024» bare er bakgrunnsinformasjon.
  const oldClaim = years.some(year => new RegExp(
    "\\b(?:krav|lønnskrav|lønn|overtid|tillegg|godtgjørelse)\\s+fra\\s+"+year+"\\b","u"
  ).test(text));
  if (!pastEntitlement.test(text) && !periodAsked && !oldClaim) return null;
  return { year: years.length === 1 ? years[0] : null, years };
}

/**
 * Preserve a historical rights question through short follow-up messages.
 * Only a clear change in the user's question may change the historical period:
 * explicit new year, explicit present-day question, or clearly different
 * conversational topic. Never infer historical rights from a hiring year.
 *
 * This returns an instruction/period FILTER, never a verified legal answer.
 */
export function resolveHistoricalSourceReview({ situation = "", question = "", asOf = new Date() } = {}) {
  const text = String(question || "").toLocaleLowerCase("nb-NO").trim();
  const original = detectHistoricalSourceQuestion(situation, asOf);
  const explicit = detectHistoricalSourceQuestion(text, asOf);
  if (explicit && explicit.year !== null) return explicit;
  if (explicit && (explicit.years?.length || !original)) return explicit;
  if (!original || !text) return null;

  const currentYear = norwayYear(asOf);
  if (!currentYear) return null;
  const mentionedYears = [...new Set(
    [...text.matchAll(/\b(?:19\d{2}|20\d{2})\b/gu)]
      .map(match => Number(match[0]))
  )].sort((a,b)=>a-b);
  const pastYears = mentionedYears.filter(year => year < currentYear);
  const hasCurrentYear = mentionedYears.some(year => year >= currentYear);

  // "Hva gjelder nå?" is about today's rules despite an old tariff situation.
  // "Kan jeg nå kreve etterbetaling for 2024?" is different: it still
  // concerns a prior earning period. Preserve it if the explicit detector fired.
  const presentRuleQuestion = /\b(?:hva\s+gjelder\s+(?:nå|i\s*dag)|dagens\s+(?:regler|tariff|avtale|lov|rettigheter)|gjeldende\s+(?:regler|tariff|avtale|lov)|nåværende\s+(?:regler|tariff|avtale|lov)|hva\s+med\s+(?:de\s+)?nye\s+(?:reglene|avtalen))(?![\p{L}\p{N}_])/iu.test(text);
  if (presentRuleQuestion) return null;
  // "Hvilken tariffavtale gjaldt da?" has no year, but the existing
  // case already states 2024: don't discard a known period.
  if (explicit && !explicit.years?.length) return original;

  // A new explicit year overrides the period inherited from the situation.
  // If the new message spans past and current years, do not pick a single
  // archival agreement: the question is ambiguous, and needs clarification.
  if (mentionedYears.length) {
    if (hasCurrentYear && !pastYears.length) return null;
    if (hasCurrentYear) return { year:null, years:mentionedYears };
    if (pastYears.length > 1) return { year:null, years:pastYears };
    if (pastYears.length === 1 &&
        (/\b(?:tariff\w*|avtal\w*|krav\w*|frist\w*|lønn\w*|lonn\w*|overtid\w*|tillegg\w*|rett\w*|lov\w*|regel\w*|betaling\w*)\b/iu.test(text) ||
          /\b(?:hva|hvordan|da|den\s+gangen)\b/iu.test(text))) {
      return { year:pastYears[0], years:pastYears };
    }
    return null; // an unrelated reference to a year is not a tariff claim
  }

  // Don't keep historical tariff constraints for a clear switch to an
  // ordinary conversation coaching topic.
  const pureConversation = /\b(?:hvordan\s+(?:starter|åpner|innleder)|hvordan\s+(?:formulerer|ordlegger)|samtaleteknikk|hvilke\s+åpne\s+spørsmål)\b/iu.test(text);
  const rightsInQuestion = /\b(?:tariff\w*|avtal\w*|krav\w*|frist\w*|lønn\w*|lonn\w*|overtid\w*|tillegg\w*|rett\w*|lov\w*|regel\w*|betaling\w*)\b/iu.test(text);
  if (pureConversation && !rightsInQuestion) return null;
  return original;
}

/** Ingen KI-kilde kan bevitne avtalevilkår før dens første gyldighetsår. */
export function isHistoricalAgreementCandidate(source, review) {
  if (!review) return true;
  const role = source?.sourceTier || source?.sourceRole || source?.source_role;
  if (role !== "collective_agreement") return true;
  // Ukjent/flere år eller udaterte avtaledokumenter gir ingen trygg
  // periodekobling. Ikke foreslå en vilkårlig historisk tariffkilde.
  if (!Number.isInteger(review.year)) return false;
  const from = source.validFrom || source.valid_from || null;
  const to = source.validTo || source.valid_to || null;
  if (!dateValid(from) || !dateValid(to) || from > to) return false;
  const yearStart = review.year+"-01-01";
  const yearEnd = review.year+"-12-31";
  return from <= yearEnd && to >= yearStart;
}

/**
 * For et EKSPLISITT historisk avtalespørsmål skal bare periodens
 * dokumenterte, daterte tariffkilder vurderes. En arkivert avtale som
 * var registrert gyldig i 2024 kan da vurderes som historisk kandidat
 * selv om den ikke lenger er gjeldende i 2027.
 *
 * Ikke-kollektive kilder bruker fortsatt dagens gyldighet og må selv
 * kildekontrolleres historisk før rettslige påstander fremsettes.
 */
export function isSourceValidForQuestion(source, asOf = new Date(), review = null) {
  const role = source?.sourceTier || source?.sourceRole || source?.source_role;
  if (review && role === "collective_agreement") {
    return isHistoricalAgreementCandidate(source, review);
  }
  return isSourceValidOn(source, asOf);
}

export function historicalSourceCaution(review) {
  if (!review) return "";
  const period = review.year !== null ? String(review.year)
    : (review.years?.length ? "de nevnte tidligere årene" : "en tidligere periode som ikke er datofestet");
  return [
    "## Historisk regelverk eller tariffperiode – særskilt kildeforbehold",
    "Brukeren spør om hva som gjaldt i "+period+".",
    "En lov, myndighetsveiledning eller tariffavtale som er gjeldende i dag, dokumenterer IKKE i seg selv tidligere rettstilstand eller tariffdekning.",
    "Ikke konkluder om historisk sats, krav, frist, rett eller avtaledekning uten autoritativ historisk dokumentasjon som gjelder den konkrete perioden og virksomheten.",
    "Be om presis hendelses-/opptjeningsperiode når dato eller avtaleforhold er uavklart. Gi ellers praktisk samtalestøtte og forklar hva som må sjekkes."
  ].join("\n");
}
