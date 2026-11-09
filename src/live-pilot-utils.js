const COMMAND_PATTERNS = Object.freeze({
  send: /^(?:send|send nå|send det)[.!?]?$/iu,
  clear: /^(?:slett|slett det|tøm)[.!?]?$/iu,
  restart: /^(?:start på nytt|begynn på nytt)[.!?]?$/iu,
  skip: /^(?:hopp over|gå videre)[.!?]?$/iu,
  continue: /^(?:fortsett|fortsett å lytte)[.!?]?$/iu,
  stopMic: /^(?:stopp mikrofon|slå av mikrofon(?:en)?|mikrofon av)[.!?]?$/iu,
  yes: /^(?:ja|ja det stemmer|stemmer|riktig)[.!?]?$/iu,
  no: /^(?:nei|nei det stemmer ikke|feil)[.!?]?$/iu,
  stopSpeech: /^(?:stopp|stopp opplesning|vær stille)[.!?]?$/iu
});

export function normalizeSpeechText(value = "") {
  return String(value || "")
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();
}

export function voiceCommand(value = "") {
  const text = normalizeSpeechText(value).toLocaleLowerCase("nb-NO");
  if (!text) return null;
  for (const [command, pattern] of Object.entries(COMMAND_PATTERNS)) {
    if (pattern.test(text)) return command;
  }
  return null;
}

export function appendTranscript(draft = "", utterance = "") {
  const a = normalizeSpeechText(draft);
  const b = normalizeSpeechText(utterance);
  if (!b) return a;
  return a ? `${a} ${b}` : b;
}

export function employerTypeFromSpeech(value = "") {
  const text = normalizeSpeechText(value).toLocaleLowerCase("nb-NO");
  if (!text) return "";
  if (/\b(?:stat|staten|statlig|statsansatt(?:e|en)?)\b/u.test(text)) return "state";
  if (/\b(?:kommune|kommunal|fylkeskommune|fylkeskommunal)\b/u.test(text)) return "municipal";
  if (/\b(?:helseforetak|helseforetaket|helseforetakene)\b/u.test(text)) return "health_enterprise";
  if (/\b(?:privat|privat sektor|privat virksomhet|privat selskap)\b/u.test(text)) return "private";
  if (/\b(?:usikker|vet ikke|ukjent)\b/u.test(text)) return "unknown";
  return "";
}

export function employerTypeLabel(value = "") {
  return ({
    state: "stat",
    municipal: "kommune eller fylkeskommune",
    health_enterprise: "helseforetak",
    private: "privat",
    unknown: "ukjent"
  })[value] || "";
}

export function occupationLikelyRelevant(value = "") {
  const text = normalizeSpeechText(value).toLocaleLowerCase("nb-NO");
  if (!text) return false;
  const terms = [
    "sikkerhet", "hms", "risiko", "prosedyre", "sertifikat", "autorisasjon",
    "taushetsplikt", "meldeplikt", "varsling", "pasientsikkerhet", "brukersikkerhet",
    "elevsikkerhet", "barnesikkerhet", "transport", "kjøre", "fartøy", "skip",
    "offshore", "havbruk", "medisin", "medisinering", "legemiddel", "journal",
    "habilitet", "saksbehandling", "vold", "trussel", "beredskap", "politi",
    "forsvar", "luftfart", "flysikkerhet", "dyrevelferd", "smittevern"
  ];
  return terms.some(term => text.includes(term));
}

export function employerTypeLikelyRelevant(value = "") {
  const text = normalizeSpeechText(value).toLocaleLowerCase("nb-NO");
  if (!text) return false;
  return /\b(?:tariff\w*|lønn\w*|oppsig\w*|avskjed\w*|ordensstraff\w*|ansett\w*|personalreglement\w*|drøft\w*|arbeidsforhold\w*|formell\w*)\b/u.test(text);
}

export function matchesStandaloneSend(value = "") {
  return voiceCommand(value) === "send";
}

export const LIVE_TIMEOUTS = Object.freeze({
  warningMs: 45_000,
  stopMs: 60_000,
  utteranceSilenceMs: 850,
  minimumSpeechMs: 240
});
