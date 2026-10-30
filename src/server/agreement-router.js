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

export function shouldUseAgreementContext({ topic, subtopic, situation } = {}) {
  const text = normalize([topic, subtopic, situation].filter(Boolean).join(" "));
  if (!text) return false;

  if (agreementTerms.some(term => text.includes(normalize(term)))) return true;

  // "Vakt" alene er ikke tariffrelevant. Formuleringer som "under vakt" eller
  // "på vakt" beskriver ofte bare arbeidssituasjonen. Aktiver avtaleområdet
  // først når teksten faktisk handler om vaktordning, plan, tillegg eller lignende.
  return agreementVaktTerms.some(term => text.includes(normalize(term)));
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
