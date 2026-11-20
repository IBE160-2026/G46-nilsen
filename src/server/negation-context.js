// Lokal norsk tekstregel for kilde-/yrkesrelevans, IKKE faglig språkforståelse.
// Negasjon gjelder bare i den aktuelle ytringen/setningsdelen.
// Skill "ingen sikkerhetshendelse" fra "ingen hendelse i går. I dag er det en"
// og "har ikke brukt verneutstyr" (et positivt risikosignal).
const normalize = value => String(value || "")
  .toLocaleLowerCase("nb-NO")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g,"")
  .replace(/[^a-z0-9æøå]+/g," ")
  .trim();

function containsNonNegatedInClause(rawClause, needle) {
  const text=normalize(rawClause);
  if(!text || !needle)return false;
  let offset=0;
  while(offset < text.length) {
    const index=text.indexOf(needle,offset);
    if(index<0)return false;
    const prefix=text.slice(Math.max(0,index-150),index).trim();
    const suffix=text.slice(index+needle.length,index+needle.length+70).trim();
    // Unntak: manglende verneutstyr / manglende sikkerhetstiltak er risiko.
    const explicitlyOutsideScope = /\b(?:ikke\s+(?:snakk|tale)\s+om|gjelder\s+ikke|ingen\s+(?:opplysning(?:er)?|tegn)\s+(?:om|til))\b/u.test(prefix);
    const missingProtection = /^(?:verneutstyr|sikkerhetstiltak|sikring|opplæring|opplaring)\b/u.test(text.slice(index))
      && /\b(?:ingen|ikke|uten)\b/u.test(prefix) && !explicitlyOutsideScope;
    // "Har ikke brukt verneutstyr" / "ikke fulgt sikkerhetsrutinen"
    // beskriver mulige BRUDD, ikke at risikoområdet er irrelevant.
    const unperformedSafetyAction = /\bikke\s+(?:fulgt|brukt|benyttet|kontrollert|oppdatert|utført|utfort|iverksatt|gjennomført|gjennomfort|overholdt|sikret|tilrettelagt|meldt)\b/u.test(prefix);
    const absentTopic =
      /\bingen\b(?:\s+(?:opplysning(?:er)?|tegn|konkret(?:e)?|aktuell(?:e)?))?[^.!?;:]{0,140}$/u.test(prefix) ||
      /\bgjelder\s+ikke\b[^.!?;:]{0,140}$/u.test(prefix) ||
      /\bikke\s+(?:snakk|tale)\s+om\b[^.!?;:]{0,140}$/u.test(prefix) ||
      /\bikke\s+(?:et|en)?\s*(?:tema|problem|utfordring|sak|hendelse)\b[^.!?;:]{0,140}$/u.test(prefix) ||
      /\bikke\s+(?:noen|noe|et|en)?\s*$/u.test(prefix) ||
      (!unperformedSafetyAction && /\bikke\b(?:\s+[a-z0-9æøå]+){0,10}$/u.test(prefix)) ||
      (/\buten(?:\s+at)?\b[^.!?;:]{0,140}$/u.test(prefix) &&
       /^(?:er|var|blir)\s+(?:et\s+|en\s+)?(?:tema|problem|sak|aktuelt|relevant)\b/u.test(suffix)) ||
      /^(?:er|var|blir)\s+ikke\s+(?:et\s+|en\s+)?(?:tema|problem|sak|aktuelt|relevant)\b/u.test(suffix);
    if(!absentTopic || missingProtection)return true;
    offset=index+Math.max(1,needle.length);
  }
  return false;
}

export function containsNonNegatedContextTerm(textValue,termValue) {
  const needle=normalize(termValue);
  if(!needle)return false;
  // Setnings- og kontrastgrenser må bevares frem til ETTER negasjonssjekk.
  const clauses=String(textValue||"").split(/(?:[.!?;:\n]+|\s*,?\s+\b(?:men|derimot)\b\s+)/iu);
  return clauses.some(rawClause=>containsNonNegatedInClause(rawClause,needle));
}
