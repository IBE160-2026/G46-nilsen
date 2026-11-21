import fs from "node:fs";
import { containsNonNegatedContextTerm } from "./negation-context.js";
import { isSourceValidOn } from "./source-validity.js";
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
  // Et bredt hovedtema som «Lønn og utvikling» skal ikke alene gjøre en
  // karriere-/utviklingssak tariffrelevant. Bruk konkret undertema og situasjon.
  // Behold setningsgrensene! Den tidligere lokale tekstnormaliseringen
  // fjernet punktum/linjeskift før negasjonssjekken, slik at et eldre
  // "ikke lønn" kunne undertrykke en NY faktisk overtids-/tariffsak.
  const concreteText = [subtopic, situation].filter(Boolean).join(". ");
  const fallbackText = topic || "";
  const allTerms = [...agreementTerms, ...agreementVaktTerms];
  if (concreteText.trim()) {
    // "Har ikke fått utbetalt lønn" er en mulig avtalekonflikt,
    // ikke en avkreftelse av at lønn er relevant. Falske positive må
    // fortsatt fanges i regresjonene for "ikke snakk om lønn".
    const payDispute = /\b(?:ikke|aldri)\s+(?:fått|fikk|mottatt|utbetalt)\b(?:\s+[a-z0-9æøå]+){0,5}\s+(?:lønn\w*|lonn\w*|overtid\w*|tillegg\w*|godtgjørelse\w*|godtgjorelse\w*)\b/iu;
    if (payDispute.test(concreteText)) return true;
    return allTerms.some(term => containsNonNegatedContextTerm(concreteText, term));
  }
  return allTerms.some(term => containsNonNegatedContextTerm(fallbackText, term));
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
  situation,
  asOf = new Date()
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

    // Avtaleområdet kan være relevant selv når den sist registrerte
    // avtalen er utløpt. Vis da området, men aldri den utløpte avtalen
    // som om den fremdeles var en gjeldende kildekandidat.
    suggestions.push({
      ...area,
      curatedSources: (area.curatedSources || []).filter(source => isSourceValidOn(source, asOf)),
      score
    });
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
