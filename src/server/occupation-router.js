import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../../data");

const sourceMap = JSON.parse(fs.readFileSync(path.join(dataDir, "OCCUPATION-SOURCE-MAP.json"), "utf8"));
const legalRegistry = JSON.parse(fs.readFileSync(path.join(dataDir, "OCCUPATION-LEGAL-SOURCES.json"), "utf8"));

const normalize = value => String(value || "")
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9æøå]+/g, " ")
  .trim();

const riskTerms = [
  "sikkerhet","påvirket","rus","alkohol","ulykke","nestenulykke","maskin","kjemikal",
  "taushetsplikt","taushetsbrudd","journal","autorisasjon","meldeplikt","pasient",
  "elevsikkerhet","barn","vold","trus","arbeidstid","hviletid","kjøretid","fartsskriver",
  "personvern","informasjonssikkerhet","habilitet","beredskap","dyrevelferd","fiskehelse",
  "rømming","strøm","elektr","høydearbeid","verneutstyr","fartøy","sjøsikkerhet"
];

const generallyOccupationNeutralTopics = new Set([
  "livssituasjoner",
  "samarbeid og kommunikasjon",
  "prestasjon og utvikling"
]);

export function getOccupationSourceMap() {
  return sourceMap;
}

export function getOccupationLegalRegistry() {
  return legalRegistry;
}

export function classifyOccupationLocally(value) {
  const needle = normalize(value);
  if (!needle) {
    return { matched: false, ambiguous: false, sectorId: null, matchMode: "none", matchedValue: null, candidates: [] };
  }

  const matches = [];
  for (const sector of sourceMap.sectors || []) {
    if (sector.id === "other") continue;
    const candidates = [
      ...(sector.occupations || []).map(v => ({ value: v, mode: "occupation" })),
      ...(sector.aliases || []).map(v => ({ value: v, mode: "alias" }))
    ];

    for (const candidate of candidates) {
      const n = normalize(candidate.value);
      if (!n) continue;
      const exact = needle === n;
      const contains = needle.includes(n) || n.includes(needle);
      if (!exact && !contains) continue;

      const score =
        (exact ? 1000 : 100) +
        (candidate.mode === "occupation" ? 20 : 0) +
        Math.min(n.length, 80);

      matches.push({
        score,
        sectorId: sector.id,
        sectorLabel: sector.label,
        matchMode: candidate.mode,
        matchedValue: candidate.value
      });
    }
  }

  matches.sort((a, b) => b.score - a.score);
  if (!matches.length) {
    return { matched: false, ambiguous: false, sectorId: null, matchMode: "none", matchedValue: null, candidates: [] };
  }

  const topScore = matches[0].score;
  const top = matches.filter(match => match.score === topScore);
  const topSectors = [...new Set(top.map(match => match.sectorId))];

  if (topSectors.length > 1) {
    return {
      matched: false,
      ambiguous: true,
      sectorId: null,
      matchMode: "ambiguous",
      matchedValue: null,
      candidates: top.map(({ sectorId, sectorLabel, matchMode, matchedValue }) => ({
        sectorId,
        sectorLabel,
        matchMode,
        matchedValue
      }))
    };
  }

  const best = matches[0];
  return {
    matched: true,
    ambiguous: false,
    sectorId: best.sectorId,
    matchMode: best.matchMode,
    matchedValue: best.matchedValue,
    candidates: []
  };
}

export function shouldUseOccupationContext({ occupation, sectorId, topic, subtopic, situation } = {}) {
  if (!normalize(occupation) && !normalize(sectorId)) return false;

  const text = normalize([topic, subtopic, situation].filter(Boolean).join(" "));
  if (!text) return false;

  const hasRiskTrigger = riskTerms.some(term => text.includes(normalize(term)));
  if (hasRiskTrigger) return true;

  const topicKey = normalize(topic);
  if (generallyOccupationNeutralTopics.has(topicKey)) return false;

  if (topicKey.includes("livssituasjon")) return false;
  if (topicKey.includes("samarbeid")) return false;

  return false;
}

function contextMatchesSource(source, contextText) {
  const text = normalize(contextText);
  if (!text) return false;
  return (source.useFor || []).some(term => {
    const n = normalize(term);
    return n && text.includes(n);
  });
}

export function selectLegalSources({ sectorId, topic, subtopic, situation, maxSources = 6 } = {}) {
  if (!sectorId) return [];
  const contextText = [topic, subtopic, situation].filter(Boolean).join(" ");

  return legalRegistry.sources
    .filter(source => {
      const sectors = source.sectors || [];
      const appliesToSector = sectors.includes("*") || sectors.includes(sectorId);
      if (!appliesToSector) return false;
      if (source.contextualOnly) return contextMatchesSource(source, contextText);
      return true;
    })
    .map(source => {
      const sectors = source.sectors || [];
      const sectorSpecific = sectors.includes(sectorId);
      const contextMatch = contextMatchesSource(source, contextText);
      return {
        ...source,
        score: (sectorSpecific ? 10 : 0) + (contextMatch ? 5 : 0)
      };
    })
    .sort((a, b) => b.score - a.score || a.authority.localeCompare(b.authority, "nb"))
    .slice(0, Math.max(1, maxSources));
}

export function resolveOccupationContext({ occupation, sectorId, topic, subtopic, situation } = {}) {
  let resolvedSectorId = sectorId || null;
  let classification = null;

  const relevant = shouldUseOccupationContext({
    occupation,
    sectorId: resolvedSectorId,
    topic,
    subtopic,
    situation
  });

  // Viktig kostnads-/kontekstregel:
  // Ikke bruk engang lokal/AI-klassifisering av et fritekstyrke når yrket ikke er relevant for saken.
  if (relevant && !resolvedSectorId && occupation) {
    classification = classifyOccupationLocally(occupation);
    if (classification.matched) resolvedSectorId = classification.sectorId;
  }

  const sector = (sourceMap.sectors || []).find(item => item.id === resolvedSectorId) || null;

  const legalSources = relevant && sector
    ? selectLegalSources({
        sectorId: sector.id,
        topic,
        subtopic,
        situation
      })
    : [];

  const authorities = relevant && sector
    ? (sector.primaryAuthorities || []).map(item => ({
        id: item.id,
        label: item.label,
        domain: item.domain
      }))
    : [];

  return {
    selected: Boolean(normalize(occupation) || normalize(sectorId)),
    sectorId: resolvedSectorId,
    sectorLabel: sector?.label || null,
    occupation: occupation || null,
    occupationRelevant: relevant,
    classificationNeeded: Boolean(relevant && occupation && !resolvedSectorId),
    localClassification: classification,
    authorities,
    allowedDomains: authorities.map(item => item.domain),
    sourceIds: legalSources.map(source => source.id),
    legalSources
  };
}

export function getLegalSourcesForSector(sectorId) {
  return legalRegistry.sources.filter(source => (source.sectors || []).includes(sectorId));
}
