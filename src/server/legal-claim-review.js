// KONSERVATIVT varselfilter, IKKE juridisk kvalitetssikring.
// En link, et søketreff eller en modellvalgt kilde-ID bekrefter aldri
// automatisk at det konkrete utsagnet stemmer med originaldokumentet.
// Her lagres kun antall signaler og generiske metadata, aldri råtekst.

const legalContext = /\b(?:arbeidsmiljølov\w*|statsansattelov\w*|loven|lovverk\w*|forskrift\w*|tariff\w*|hovedavtale\w*|oppsig\w*|avskjed\w*|lønn\w*|overtid\w*|tillegg\w*|arbeidstaker\w*|arbeidsgiver\w*|rettighet\w*|permisjon\w*|sykefravær\w*|sykmeld\w*|fravær\w*|varsling\w*|lovpålagt\w*)\b|§/iu;
const assertedRight = /\b(?:har\s+(?:ikke\s+)?(?:rett|krav)\s+(?:til|på)|kan\s+(?:kreve|pålegge)|må\s+(?:utbetales|betales|kompenseres)|skal\s+(?:utbetales|betales)|har\s+(?:en\s+)?plikt\s+til|er\s+(?:lovpålagt|ulovlig|forbudt)|innen\s+\d+\s+(?:dager|uker|måneder)|har\s+\d+\s+(?:dager|uker)\s+frist|(?:retten|kravet|fristen)\s+er|etter\s+(?:arbeidsmiljøloven|statsansatteloven|tariffavtalen|hovedavtalen|lovverket)|ifølge\s+(?:loven|arbeidsmiljøloven|tariffavtalen))\b|§\s*\d+/iu;

export function reviewLegalClaimSignals(texts = [], sources = []) {
  const input = Array.isArray(texts) ? texts : [texts];
  const fragments = input
    .filter(value => typeof value === "string")
    .flatMap(value => value.split(/(?:[.!?](?:\s|$)|\n+|;\s*)/u))
    .map(value => value.trim())
    .filter(Boolean);
  const possibleClaims = fragments.filter(fragment => {
    // Spørsmål og hypotetiske brukerspørsmål er ikke KI-assertive svar.
    if (/^(?:hva|hvordan|hvilke|hvilken|kan jeg|må jeg|har jeg)\b/iu.test(fragment)) return false;
    return legalContext.test(fragment) && assertedRight.test(fragment);
  });
  const relevantSources = Array.isArray(sources) ? sources : [];
  const hasChosenReferences = relevantSources.some(source =>
    source?.evidenceRole === "model_selected"
  );
  return {
    needsManualReview: possibleClaims.length > 0,
    possibleLegalClaimCount: Math.min(20, possibleClaims.length),
    // En lovpåstand med 5 kilder er fremdeles ikke faktasjekket.
    claimToSourceChecked: false,
    hasModelSelectedReferences: hasChosenReferences,
    hasOnlyReferenceLinks: relevantSources.length > 0 && !hasChosenReferences
  };
}
