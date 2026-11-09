const COMMAND_PATTERNS = Object.freeze({
  send: /^(?:send|senn|fem|send nå|send det|send inn|ferdig|jeg er ferdig|nå er jeg ferdig|få råd|gi meg råd|send spørsmålet|send meldingen)[.!?]?$/iu,
  fix: /^(?:fiks feil(?:ene)?|rett feil(?:ene)?|fiks personvern(?:feil(?:ene)?)?|anonymiser teksten|rett han til hen|bruk hen)[.!?]?$/iu,
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

export function editDraftByVoice(draft = "", spoken = "") {
  const command = normalizeSpeechText(spoken).replace(/[.!?]+$/u, "").trim();
  const text = normalizeSpeechText(draft);
  let match = command.match(/^slett (?:det )?(?:siste|siste[n]?) (\\d+|ett|en|to|tre|fire|fem|seks|sju|syv|åtte|ni|ti) ord$/iu);
  if (match) {
    const numbers = {ett:1,en:1,to:2,tre:3,fire:4,fem:5,seks:6,sju:7,syv:7,åtte:8,ni:9,ti:10};
    const count = numbers[match[1].toLocaleLowerCase("nb-NO")] || Number(match[1]);
    if (!Number.isSafeInteger(count) || count < 1 || count > 100) return {handled:true,text,message:"Velg mellom 1 og 100 ord."};
    return {handled:true,text:text.split(/\\s+/u).slice(0,-count).join(" "),message:"Slettet de siste " + count + " ordene."};
  }
  if (/^slett (?:siste|det siste) ord(?:et)?$/iu.test(command)) {
    return {handled:true,text:text.split(/\\s+/u).slice(0,-1).join(" "),message:"Slettet siste ord."};
  }
  match = command.match(/^(?:endre|bytt ut|erstatt) (?:ordet )?(.+?) (?:til|med) (.+)$/iu);
  if (match) {
    const from = match[1].trim(), to = match[2].trim();
    if (!from || !to || from.length > 100 || to.length > 100) return {handled:true,text,message:"Ugyldig ordbytte."};
    const at = text.toLocaleLowerCase("nb-NO").lastIndexOf(from.toLocaleLowerCase("nb-NO"));
    if (at < 0) return {handled:true,text,message:"Fant ikke «" + from + "» i utkastet."};
    const before = text.slice(0,at), after = text.slice(at+from.length);
    if ((before && /[\\p{L}\\p{N}]$/u.test(before)) || (after && /^[\\p{L}\\p{N}]/u.test(after))) return {handled:true,text,message:"Fant ikke «" + from + "» som eget ord."};
    return {handled:true,text:before+to+after,message:"Endret siste «" + from + "» til «" + to + "». Kontroller teksten."};
  }
  return {handled:false,text};
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
  if (/\b(?:kommune(?:n|r)?|kommunal(?:t|e)?|fylkeskommune(?:n|r)?|fylkeskommunal(?:t|e)?)\b/u.test(text)) return "municipal";
  if (/\b(?:helseforetak(?:et|ene)?)\b/u.test(text)) return "health_enterprise";
  if (/\b(?:privat(?:e)?|privat sektor|privat virksomhet|privat selskap)\b/u.test(text)) return "private";
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
