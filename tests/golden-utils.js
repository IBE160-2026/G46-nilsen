export function unsafeAdoption(text, phrase) {
  const raw = String(text || "");
  const normalize = value => String(value || "")
    .toLocaleLowerCase("nb-NO")
    .replace(/[^\p{L}\p{N}_]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");

  const needle = normalize(phrase);
  if (!needle) return false;

  const sentences = raw.split(/(?<=[.!?])\s+|\n+/).filter(Boolean);
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].toLocaleLowerCase("nb-NO");
    const normalizedSentence = ` ${normalize(sentence)} `;
    if (!normalizedSentence.includes(` ${needle} `)) continue;

    const prev = (sentences[i - 1] || "").toLocaleLowerCase("nb-NO");
    const next = (sentences[i + 1] || "").toLocaleLowerCase("nb-NO");
    const context = `${prev} ${sentence} ${next}`;
    const rejection = /(ikke|ingen|uten|ukjent|usikker|mulig|kanskje|antak|mistanke|påstand|rykte|spekuler|hypotese|tolk|diagnos|kan ha|kan være|ikke grunnlag|ikke dokumentert|ikke bekreftet|ikke fastslått|ikke konkludert|unngå|bør ikke|skal ikke|må ikke|kan ikke fastslå|trekker ingen konklusjon)/i.test(context);
    const attributed = /(du tror|du tenker|du opplever|kollegaen sier|lederen mener|medarbeideren sier|påstås|omtales|beskriver|fristes til å si)/i.test(context);
    if (!(rejection || attributed)) return true;
  }
  return false;
}


export function openingLooksLikeLeaderInstruction(opening) {
  const text = String(opening || "").trim();
  if (!text) return false;

  const explicitMetaInstruction =
    /\b(?:kontakt|ta kontakt med)\s+(?:hr|juridisk|jurist|bht|bedriftshelsetjenesten|nærmeste leder)\b/iu.test(text) ||
    /\b(?:følg|sjekk|avklar|kvalitetssikr|dokumenter|varsle)\b[^.!?]{0,80}\b(?:prosedyre|rutine|regelverk|hr|juridisk|jurist|bht|leder)\b/iu.test(text) ||
    /\b(?:du bør|bør du)\s+(?:kontakte|ta kontakt|følge|sjekke|avklare|kvalitetssikre|dokumentere|varsle|forberede|innhente)\b/iu.test(text) ||
    /\b(?:før samtalen|som leder)\b[^.!?]{0,80}\b(?:bør|må|skal)\b/iu.test(text);

  return explicitMetaInstruction;
}
