const normalize = value => String(value || "")
  .toLocaleLowerCase("nb-NO")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9æøå]+/g, " ")
  .trim();

const highRiskTopicPattern = /oppsig|avskjed|mobb|trakass|diskrimin|varsling|sikkerhet|alkohol|rus/u;

const concreteSourceTerms = [
  "sykmeld", "sykefravær", "tilrettelegg", "kontrolltiltak", "overvåk", "personvern",
  "vold", "trus", "ulykke", "sikkerhet", "sikkerhets", "fatigue", "arbeidsevne",
  "hviletid", "arbeidstid", "kjøretid", "autorisasjon", "journal", "taushetsplikt",
  "plantevern", "dyrevelferd", "maskin", "verneutstyr", "høydearbeid", "elektr",
  "kjemikal", "pasient", "elevkrenk", "elevsikkerhet"
];

export function containsNonNegatedSourceTerm(textValue, termValue) {
  const text = normalize(textValue);
  const needle = normalize(termValue);
  if (!text || !needle) return false;

  let fromIndex = 0;
  while (fromIndex < text.length) {
    const index = text.indexOf(needle, fromIndex);
    if (index < 0) return false;

    const prefix = text.slice(Math.max(0, index - 150), index).trim();
    const explicitlyAbsent =
      /\bingen\b[^.!?;:]{0,140}$/u.test(prefix) ||
      /\bgjelder\s+ikke\b[^.!?;:]{0,140}$/u.test(prefix) ||
      /\bikke\s+(?:snakk|tale)\s+om\b[^.!?;:]{0,140}$/u.test(prefix) ||
      /\bikke\s+(?:et|en)?\s*(?:tema|problem|utfordring|sak|hendelse)\b[^.!?;:]{0,140}$/u.test(prefix) ||
      /\bikke\b(?:\s+[a-z0-9æøå]+){0,10}$/u.test(prefix);

    if (!explicitlyAbsent) return true;
    fromIndex = index + needle.length;
  }
  return false;
}

export function shouldRetainCuratedSources({
  requestedTopic = "",
  resolvedTopic = "",
  subtopic = "",
  situation = "",
  employerType = "",
  occupationContext = null
} = {}) {
  if (occupationContext?.occupation?.occupationRelevant) return true;

  const agreement = occupationContext?.agreement;
  if (
    agreement?.relevant &&
    !agreement?.needsEmployerType &&
    ["state", "municipal", "health_enterprise"].includes(employerType) &&
    (agreement.suggestions || []).length
  ) return true;

  // Bruk brukerens eksplisitt valgte hovedtema når det finnes. KI-analysen kan
  // ellers overklassifisere en ordinær samarbeids-/oppfølgingssak som høyrisiko.
  const topicText = normalize(requestedTopic || resolvedTopic);
  if (highRiskTopicPattern.test(topicText)) return true;

  // Konkrete risikosignaler teller bare når de ikke uttrykkelig er avkreftet
  // ("ingen sikkerhetshendelse", "ikke personvernproblem" osv.).
  const concrete = `${subtopic || ""} ${situation || ""}`;
  return concreteSourceTerms.some(term => containsNonNegatedSourceTerm(concrete, term));
}


export function requiredEmployerScopedPrimaryLawIds(sources = [], employerType = "") {
  const employer = String(employerType || "").trim();
  if (!employer) return [];

  const seen = new Set();
  return (Array.isArray(sources) ? sources : [])
    .filter(source => {
      const role = source?.sourceRole || source?.source_role || "";
      const scopedEmployers = Array.isArray(source?.employerTypes)
        ? source.employerTypes
        : (Array.isArray(source?.employer_types) ? source.employer_types : []);
      return role === "primary_law" && scopedEmployers.includes(employer);
    })
    .map(source => source.id)
    .filter(id => id && !seen.has(id) && seen.add(id))
    .slice(0, 2);
}


export function isLegalSourceContext(textValue = "") {
  const text = normalize(textValue);
  return /\b(?:lov\w*|regelverk\w*|rettighet\w*|plikt\w*|oppsig\w*|avskjed\w*|varsling\w*|trakassering\w*|diskrimin\w*|sykefravær\w*|sykmeld\w*|tilrettelegg\w*|arbeidstid\w*|overtid\w*|kontrolltiltak\w*|overvåk\w*|hms\w*|sikkerhet\w*|tariff\w*|lønn\w*|forhandling\w*|medbestemmelse\w*|tillitsvalgt\w*)\b/u.test(text);
}

export function employerScopedPrimaryLawBonus(source = {}, employerType = "") {
  const role = source?.sourceRole || source?.source_role || "";
  const scopedEmployers = Array.isArray(source?.employerTypes)
    ? source.employerTypes
    : (Array.isArray(source?.employer_types) ? source.employer_types : []);
  return role === "primary_law" && employerType && scopedEmployers.includes(employerType) ? 10 : 0;
}
