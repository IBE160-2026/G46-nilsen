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
  function selectRelevantSources(analysis = {}, situation = "", { employerType = "", sectorId = "", occupation = "", topic = "", subtopic = "" } = {}) {
    const topics = new Set(Array.isArray(analysis?.relevant_topics) ? analysis.relevant_topics : []);
    if (topic) topics.add(topic);
    const analysisText = [analysis?.summary, ...(analysis?.dilemma || []), ...(analysis?.cautions || []), ...(analysis?.uncertainties || []), subtopic]
      .filter(Boolean).join(" ");
    const q = `${situation || ""} ${analysisText}`.toLocaleLowerCase("nb-NO");
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
      let matched = false;
      for (const sourceTopic of source.topics || []) {
        if (topics.has(sourceTopic)) { score += 5; matched = true; }
      }
      for (const term of source.use_when || source.useFor || []) {
        const normalized = String(term).toLocaleLowerCase("nb-NO");
        if (normalized && q.includes(normalized)) { score += 4; matched = true; }
      }

      const tier = sourceTier(source);
      if (!matched) continue;

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
