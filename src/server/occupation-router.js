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
  if (!needle) return { matched: false, sectorId: null, matchMode: "none", matchedValue: null };

  let best = null;
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
      const score = (exact ? 1000 : 100) + Math.min(n.length, 80);
      if (!best || score > best.score) {
        best = { score, sectorId: sector.id, matchMode: candidate.mode, matchedValue: candidate.value };
      }
    }
  }

  return best
    ? { matched: true, sectorId: best.sectorId, matchMode: best.matchMode, matchedValue: best.matchedValue }
    : { matched: false, sectorId: null, matchMode: "none", matchedValue: null };
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

export function resolveOccupationContext({ occupation, sectorId, topic, subtopic, situation } = {}) {
  let resolvedSectorId = sectorId || null;
  let classification = null;

  if (!resolvedSectorId && occupation) {
    classification = classifyOccupationLocally(occupation);
    if (classification.matched) resolvedSectorId = classification.sectorId;
  }

  const sector = (sourceMap.sectors || []).find(item => item.id === resolvedSectorId) || null;
  const relevant = shouldUseOccupationContext({
    occupation,
    sectorId: resolvedSectorId,
    topic,
    subtopic,
    situation
  });

  const sourceIds = relevant && sector
    ? legalRegistry.sources
        .filter(source => (source.sectors || []).includes(sector.id))
        .map(source => source.id)
    : [];

  return {
    selected: Boolean(normalize(occupation) || normalize(sectorId)),
    sectorId: resolvedSectorId,
    sectorLabel: sector?.label || null,
    occupation: occupation || null,
    occupationRelevant: relevant,
    classificationNeeded: Boolean(occupation && !resolvedSectorId),
    localClassification: classification,
    sourceIds
  };
}

export function getLegalSourcesForSector(sectorId) {
  return legalRegistry.sources.filter(source => (source.sectors || []).includes(sectorId));
}
