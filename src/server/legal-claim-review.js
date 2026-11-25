// KONSERVATIVT varselfilter, IKKE juridisk kvalitetssikring.
// En link, et søketreff eller en modellvalgt kilde-ID bekrefter aldri
// automatisk at det konkrete utsagnet stemmer med originaldokumentet.
// Her lagres kun antall signaler og generiske metadata, aldri råtekst.

const legalContext = /\b(?:arbeidsmiljølov\w*|statsansattelov\w*|loven|lovverk\w*|forskrift\w*|tariff\w*|hovedavtale\w*|oppsig\w*|avskjed\w*|lønn\w*|overtid\w*|tillegg\w*|arbeidstaker\w*|arbeidsgiver\w*|rettighet\w*|permisjon\w*|sykefravær\w*|sykmeld\w*|fravær\w*|varsling\w*|lovpålagt\w*|diagnos\w*|helseopplysning\w*|medisinsk\w*|oppfølgingsplan\w*|dialogmøt\w*|sha[\s-]*plan\w*|byggherr\w*|koordinator\w*|risikovurder\w*|advarsel\w*|disiplinærreaksjon\w*)\b|§/iu;
const assertedRight = /\b(?:har\s+(?:ikke\s+)?(?:rett|krav)\s+(?:til|på)|kan\s+(?:kreve|pålegge)|må\s+(?:utbetales|betales|kompenseres)|skal\s+(?:utbetales|betales)|har\s+(?:en\s+)?plikt\s+til|er\s+(?:lovpålagt|ulovlig|forbudt)|innen\s+\d+\s+(?:dager|uker|måneder)|har\s+\d+\s+(?:dager|uker)\s+frist|(?:retten|kravet|fristen)\s+er|etter\s+(?:arbeidsmiljøloven|statsansatteloven|tariffavtalen|hovedavtalen|lovverket)|ifølge\s+(?:loven|arbeidsmiljøloven|tariffavtalen))\b|§\s*\d+/iu;


// Krav om gjennomføring/oppdatering, negative rettighetsutsagn og frister i ord.
// Signalene krever rettslig/faglig kontekst i SAMME setningsdel.
// Må ikke tolkes som verifisering av rettskilde eller plikt.
const assertedDutyOrRestriction = /\b(?:kan\s+(?:normalt\s+)?ikke\s+kreve|(?:skal|må)\s+(?:(?:du|arbeidsgiver(?:en)?)\s+)?(?:(?:normalt|vanligvis|som\s+hovedregel|også)\s+)?(?:ta\s+initiativ\s+til|utarbeide|innkalle|kalle\s+inn|oppdateres?|gjennomføre\s+dialogmøte|sørge\s+for|risikovurdere|stanses?)|(?:skal|må)\s+ikke\s+(?:oppgis|kreves|være\s+tema)|har\s+(?:(?:det\s+)?(?:overordnede\s+)?)?ansvar(?:et)?\s+for|er\s+(?:en\s+)?disiplinærreaksjon|(?:innen|senest\s+innen)\s+(?:\d+|fire|sju|syv|åtte|ti|tolv)\s+(?:dager|uker|måneder))\b/iu;

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
    return legalContext.test(fragment) && (assertedRight.test(fragment) || assertedDutyOrRestriction.test(fragment));
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
