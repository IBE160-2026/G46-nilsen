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
  "lønn","lonn","overtid","tillegg","turnus","arbeidstid","vakt","beredskap",
  "arbeidsplan","reise","forhandling","opprykk","tariff","overenskomst"
];

export function shouldUseAgreementContext({ topic, subtopic, situation } = {}) {
  const text = normalize([topic, subtopic, situation].filter(Boolean).join(" "));
  if (!text) return false;
  return agreementTerms.some(term => text.includes(normalize(term)));
}

export function suggestAgreementAreas({ occupation, employerContext, topic, subtopic, situation } = {}) {
  if (!shouldUseAgreementContext({ topic, subtopic, situation })) {
    return { relevant:false, suggestions:[], confirmationRequired:false };
  }

  const occupationText = normalize(occupation);
  const employerText = normalize(employerContext);
  const suggestions=[];

  for (const area of agreementMap.agreementAreas || []) {
    if (area.id === "unknown") continue;
    let score=0;

    for (const hint of area.occupationHints || []) {
      const n=normalize(hint);
      if (occupationText && (occupationText.includes(n) || n.includes(occupationText))) score += 2;
    }
    for (const ctx of area.employerContexts || []) {
      const n=normalize(ctx);
      if (employerText && (employerText.includes(n) || n.includes(employerText))) score += 4;
    }

    if (score>0) suggestions.push({ ...area, score });
  }

  suggestions.sort((a,b)=>b.score-a.score || a.label.localeCompare(b.label,"nb"));

  return {
    relevant:true,
    suggestions:suggestions.slice(0,3),
    confirmationRequired:true
  };
}

export function getAgreementMap() {
  return agreementMap;
}
