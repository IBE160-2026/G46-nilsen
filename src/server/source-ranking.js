import { containsNonNegatedContextTerm } from "./negation-context.js";
import { isSourceValidForQuestion } from "./historical-source-context.js";

// Samtalestøtte – deterministisk prioritering av kuraterte kilder.
// Alle data og regelhjelpere injiseres for å kunne teste kildevalg isolert.
// Selve sorterings- og poengreglene er flyttet uten algoritmeendringer.
export function createRelevantSourceSelector({
  sourceBank,
  occupationLegalSourceBank,
  agreementCuratedSources,
  shouldUseAgreementContext,
  isLegalSourceContext,
  sourceTier,
  employerScopedPrimaryLawBonus
}) {
  // Hovedtemaene er brede UI-kategorier. De skal ikke alene gjøre en
  // kilde om for eksempel rus eller vold relevant for en konkret SHA-sak.
  const broadTopics = new Set([
    "Sikkerhet og ansvar","Samarbeid og kommunikasjon",
    "Fravær og oppfølging","Prestasjon og utvikling","Livssituasjoner"
  ]);
  // Generiske stikkord alene legitimerer ikke en snever spesialistkilde.
  const genericSourceHints = new Set(["sikkerhet","hendelse","støtte","oppfølging"]);

  function selectRelevantSources(analysis = {}, situation = "", { employerType = "", sectorId = "", occupation = "", topic = "", subtopic = "", asOf = new Date(), historicalReview = null } = {}) {
    const topics = new Set(Array.isArray(analysis?.relevant_topics) ? analysis.relevant_topics : []);
    if (topic) topics.add(topic);
    const analysisText = [analysis?.summary, ...(analysis?.dilemma || []), ...(analysis?.cautions || []), ...(analysis?.uncertainties || []), subtopic]
      .filter(Boolean).join(". ");
    // Behold setningsskiller til negasjonssjekken. Ellers vil "ingen vold"
    // tolkes som en positiv årsak til å foreslå en voldskilde.
    const matchText = [situation, analysisText].filter(Boolean).join(". ");
    const q = matchText.toLocaleLowerCase("nb-NO");
    const agreementRelevant = shouldUseAgreementContext({ topic:[...topics].join(" "), subtopic, situation:q });
    const legalContext = isLegalSourceContext(q);

    const globalEmployerSources = (occupationLegalSourceBank.sources || []).filter(source => (source.sectors || []).includes("*"));
    const agreementSources = agreementCuratedSources.filter(source => {
      if (!employerType || !(source.employerTypes || []).includes(employerType)) return false;
      if (source.id === "STATE_PERSONNEL_HANDBOOK") return legalContext;
      return agreementRelevant;
    });

    const candidates = [...(sourceBank.sources || []), ...globalEmployerSources, ...agreementSources];
    const seen = new Set();
    const scored = [];

    const normalizedOccupation = String(occupation || "").toLocaleLowerCase("nb-NO");
    for (const source of candidates) {
      if (!source?.id || seen.has(source.id)) continue;
      // Dato er en selvstendig sperre: relevansscore kan aldri reaktivere
      // en utløpt eller ikke-ikrafttrådt kilde.
      if (!isSourceValidForQuestion(source, asOf, historicalReview)) continue;

      const scopedEmployerTypes = Array.isArray(source.employerTypes) ? source.employerTypes : (Array.isArray(source.employer_types) ? source.employer_types : []);
      if (scopedEmployerTypes.length && (!employerType || !scopedEmployerTypes.includes(employerType))) continue;

      const scopedSectors = Array.isArray(source.sectors) ? source.sectors.filter(id => id !== "*") : [];
      if (scopedSectors.length && (!sectorId || !scopedSectors.includes(sectorId))) continue;
      const scopedOccupations = Array.isArray(source.occupations) ? source.occupations : [];
      if (scopedOccupations.length && normalizedOccupation) {
        const occupationMatch = scopedOccupations.some(value => {
          const n = String(value || "").toLocaleLowerCase("nb-NO");
          return n && (normalizedOccupation === n || normalizedOccupation.includes(n) || n.includes(normalizedOccupation));
        });
        if (!occupationMatch) continue;
      } else if (scopedOccupations.length && !normalizedOccupation) {
        continue;
      }

      seen.add(source.id);
      let score = 0;
      const matchedTopics = (source.topics || []).filter(sourceTopic => topics.has(sourceTopic));
      score += 5 * matchedTopics.length;
      const hints = source.use_when || source.useFor || [];
      const matchedHints = hints
        .map(term => String(term).toLocaleLowerCase("nb-NO"))
        .filter(term => term && containsNonNegatedContextTerm(matchText, term));
      score += 4 * matchedHints.length;

      // Et generelt tema kan brukes til å rangere, men ikke som eneste
      // begrunnelse for en kilde med spesifiserte bruksvilkår. Oppdaterte
      // use_when/useFor-termer lar f.eks. utestenging hente AML/AT, mens
      // SHA-plan ikke automatisk trekker inn rus, trakassering eller vold.
      const onlyBroadTopics = matchedTopics.length > 0 &&
        matchedTopics.every(sourceTopic => broadTopics.has(sourceTopic));
      const hasSpecificMatch = matchedHints.some(term => !genericSourceHints.has(term));
      if (onlyBroadTopics && hints.length && !hasSpecificMatch) continue;

      const tier = sourceTier(source);
      if (!matchedTopics.length && !matchedHints.length) continue;

      if (tier === "primary_law") score += legalContext ? 7 : 2;
      else if (tier === "authority_guidance") score += legalContext ? 6 : 3;
      else if (tier === "collective_agreement") score += agreementRelevant ? 7 : -20;
      else if (tier === "official_employer_reference") score += 4;
      else if (tier === "authority_index") score += 1;
      else if (tier === "research_evidence") score += legalContext ? 1 : 4;
      else if (tier === "research_communication") score += legalContext ? 0.5 : 2;
      else if (tier === "specialist_guidance") score += 3;
      else score += 1;

      score += employerScopedPrimaryLawBonus(source, employerType);
      if (source.authority === "high") score += 1;
      if (source.authority === "medium") score += 0.5;
      scored.push({ source:{ ...source, sourceTier:tier }, score });
    }

    scored.sort((a,b) => b.score - a.score || String(a.source.title||"").localeCompare(String(b.source.title||""),"nb"));
    const legalTiers = ["primary_law","authority_guidance","collective_agreement","official_employer_reference","authority_index"];
    const legal = scored.filter(item => legalTiers.includes(item.source.sourceTier)).slice(0,5);
    const evidence = scored.filter(item => !legalTiers.includes(item.source.sourceTier)).slice(0,5);
    return [...legal, ...evidence].sort((a,b)=>b.score-a.score).slice(0,10).map(item=>item.source);
  }


  return selectRelevantSources;
}
