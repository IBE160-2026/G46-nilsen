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
