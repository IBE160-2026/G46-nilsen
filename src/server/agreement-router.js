import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../../data");
const agreementMap = JSON.parse(fs.readFileSync(path.join(dataDir, "AGREEMENT-SOURCE-MAP.json"), "utf8"));

const normalize = value => String(value || "")
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9æøå]+/g, " ")
  .trim();

const agreementTerms = [
  "lønn","lonn","overtid","tillegg","turnus","arbeidstid","beredskap",
  "arbeidsplan","reise","forhandling","opprykk","tariff","overenskomst"
];

const agreementVaktTerms = [
  "vaktordning","vaktplan","vakttillegg","vaktgodtgjørelse","vaktgodtgjoring",
  "vaktbelastning","vaktbytte","vaktordninger"
];

export const employerTypeOptions = [
  { id: "private", label: "Privat" },
  { id: "municipal", label: "Kommune/fylkeskommune" },
  { id: "state", label: "Stat" },
  { id: "health_enterprise", label: "Helseforetak" },
  { id: "unknown", label: "Usikker / vet ikke" }
];

function containsNonNegatedTerm(textValue, termValue) {
  const text = normalize(textValue);
  const needle = normalize(termValue);
  if (!text || !needle) return false;

  let fromIndex = 0;
  while (fromIndex < text.length) {
    const index = text.indexOf(needle, fromIndex);
    if (index < 0) return false;

    const prefix = text.slice(Math.max(0, index - 130), index).trim();
    const explicitlyAbsent =
      /\bingen\b[^.!?;:]{0,120}$/u.test(prefix) ||
      /\bgjelder\s+ikke\b[^.!?;:]{0,120}$/u.test(prefix) ||
      /\bikke\s+(?:snakk|tale)\s+om\b[^.!?;:]{0,120}$/u.test(prefix) ||
      /\bikke\s+(?:et|en)?\s*(?:tema|problem|utfordring|sak)\b[^.!?;:]{0,120}$/u.test(prefix);

    if (!explicitlyAbsent) return true;
    fromIndex = index + needle.length;
  }
  return false;
}

export function shouldUseAgreementContext({ topic, subtopic, situation } = {}) {
  // Et bredt hovedtema som «Lønn og utvikling» skal ikke alene gjøre en
  // karriere-/utviklingssak tariffrelevant. Bruk konkret undertema og situasjon.
  const concreteText = normalize([subtopic, situation].filter(Boolean).join(" "));
  const fallbackText = normalize(topic);

  if (concreteText) {
    if (agreementTerms.some(term => containsNonNegatedTerm(concreteText, term))) return true;
    return agreementVaktTerms.some(term => containsNonNegatedTerm(concreteText, term));
  }

  if (!fallbackText) return false;
  if (agreementTerms.some(term => containsNonNegatedTerm(fallbackText, term))) return true;
  return agreementVaktTerms.some(term => containsNonNegatedTerm(fallbackText, term));
}

function agreementAreasForEmployerType(employerType) {
  switch (employerType) {
    case "state":
      return ["state"];
    case "municipal":
      return ["municipal"];
    case "health_enterprise":
      return ["health_enterprise"];
    case "private":
      return ["private_trade_service","construction_industry","transport","maritime_fisheries","finance"];
    default:
      return [];
  }
}

export function suggestAgreementAreas({
  occupation,
  employerType,
  employerContext,
  topic,
  subtopic,
  situation
} = {}) {
  const relevant = shouldUseAgreementContext({ topic, subtopic, situation });

  if (!relevant) {
    return {
      relevant: false,
      needsEmployerType: false,
      employerTypeOptions: [],
      suggestions: [],
      confirmationRequired: false
    };
  }

  if (!employerType) {
    return {
      relevant: true,
      needsEmployerType: true,
      employerTypeOptions,
      suggestions: [],
      confirmationRequired: false
    };
  }

  if (employerType === "unknown") {
    return {
      relevant: true,
      needsEmployerType: false,
      employerTypeOptions,
      suggestions: [],
      confirmationRequired: false,
      unresolved: true
    };
  }

  const occupationText = normalize(occupation);
  const employerText = normalize(employerContext);
  const allowedAreaIds = new Set(agreementAreasForEmployerType(employerType));
  const suggestions = [];

  for (const area of agreementMap.agreementAreas || []) {
    if (area.id === "unknown") continue;
    if (!allowedAreaIds.has(area.id)) continue;

    let score = 10;

    for (const hint of area.occupationHints || []) {
      const n = normalize(hint);
      if (occupationText && (occupationText.includes(n) || n.includes(occupationText))) score += 3;
    }

    for (const ctx of area.employerContexts || []) {
      const n = normalize(ctx);
      if (employerText && (employerText.includes(n) || n.includes(employerText))) score += 4;
    }

    suggestions.push({ ...area, score });
  }

  suggestions.sort((a,b)=>b.score-a.score || a.label.localeCompare(b.label,"nb"));

  return {
    relevant: true,
    needsEmployerType: false,
    employerTypeOptions,
    suggestions: suggestions.slice(0,3),
    confirmationRequired: suggestions.length > 0,
    unresolved: suggestions.length === 0
  };
}

export function getAgreementMap() {
  return agreementMap;
}
