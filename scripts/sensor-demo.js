import express from "express";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const app = express();
const port = Number(process.env.PORT || 3000);
const liveVoicePilotEnabled = String(process.env.LIVE_VOICE_PILOT_ENABLED || "false").toLowerCase() === "true";
const liveTranscriptionConfigured = liveVoicePilotEnabled && Boolean(process.env.OPENAI_API_KEY);
const occupationMap = JSON.parse(fs.readFileSync(path.join(root, "data", "OCCUPATION-SOURCE-MAP.json"), "utf8"));
const liveKeywords = [
  "arbeidsmiljøloven", "statsansatteloven", "habilitet", "tariffavtale",
  "tillitsvalgt", "verneombud", "BHT", "AKAN", "IA", "sykefravær",
  "oppsigelse", "helsefagarbeider", "sykepleier", "barnehagelærer"
];

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader(
    "Permissions-Policy",
    liveVoicePilotEnabled
      ? "camera=(), microphone=(self), geolocation=(), payment=(), usb=()"
      : "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  );
  res.setHeader(
    "Content-Security-Policy",
    liveVoicePilotEnabled
      ? "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self' https://api.openai.com; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'"
      : "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'"
  );
  if (req.path.startsWith("/api/")) res.setHeader("Cache-Control", "no-store");
  next();
});
app.use(express.json({ limit: "512kb" }));

const demoUser = {
  id: "sensor-demo-user",
  username: "Sensor demo",
  email: "sensor-demo@example.invalid",
  role: "user",
  createdAt: new Date().toISOString()
};

const topics = [
  { id:"alkohol-rus", title:"Alkohol og rus", subtopic:"Bekymring knyttet til alkohol", words:["alkohol","rus","påvirket","beruset","promille"] },
  { id:"fravaer-oppfolging", title:"Fravær og oppfølging", subtopic:"Hyppig korttidsfravær og egenmeldinger", words:["fravær","sykefravær","egenmelding","oppmøte","for sent","forsent"] },
  { id:"prestasjon-utvikling", title:"Prestasjon og utvikling", subtopic:"Måloppnåelse", words:["prestasjon","leveranse","frist","kvalitet","feil","motivasjon"] },
  { id:"lonn-utvikling", title:"Lønn og utvikling", subtopic:"Forventninger til lønn", words:["lønn","lønns","forfremmelse","kompensasjon"] },
  { id:"samarbeid-kommunikasjon", title:"Samarbeid og kommunikasjon", subtopic:"Samarbeidsutfordringer", words:["samarbeid","konflikt","kommunikasjon","uenig","vakt"] },
  { id:"avslutning-arbeidsforhold", title:"Avslutning av arbeidsforhold", subtopic:"Vurdering før avslutning", words:["oppsigelse","avslutte arbeidsforhold","nedbemanning"] },
  { id:"sikkerhet-ansvar", title:"Sikkerhet og ansvar", subtopic:"Sikkerhetsrutiner og avvik", words:["sikkerhet","hms","risiko","truck","avvik"] },
  { id:"livssituasjoner", title:"Livssituasjoner", subtopic:"Krevende livssituasjon", words:["livssituasjon","familie","omsorg","samlivsbrudd","privat situasjon"] },
  { id:"mobbing-trakassering", title:"Mobbing og trakassering", subtopic:"Krenkende eller utilbørlig atferd", words:["mobbing","trakassering","nedsettende","utestengt","uønsket seksuell","uønsket fysisk kontakt","tar på meg","ta på meg","stryker meg","stryker meg over ryggen","stryker meg på","berører meg","tar på kroppen","legger ofte hånden","trukket meg unna","kommer meg unna","nærgående"] }
];

const history = [];

function inferTopic(text, selectedId = "") {
  const selected = topics.find(topic => topic.id === selectedId);
  if (selected) return selected;
  const q = String(text || "").toLocaleLowerCase("nb-NO");
  // Uten nøkkelordtreff skal demoen ikke velge første tema (alkohol og rus).
  // Samarbeid er en nøytral fallback i mock-demoen, ikke en faglig klassifisering.
  let best = topics.find(topic => topic.id === "samarbeid-kommunikasjon");
  let bestScore = 0;
  for (const topic of topics) {
    const score = topic.words.reduce((sum, word) => sum + (q.includes(word) ? 1 : 0), 0);
    if (score > bestScore) {
      best = topic;
      bestScore = score;
    }
  }
  return best;
}

function analysisFor(situation, selectedTopic = "") {
  const topic = topics.find(topic => topic.id === selectedTopic || topic.title === selectedTopic) || inferTopic(situation);
  return {
    confidence: "medium",
    summary: `Dette er lokal sensor-demo. Situasjonen ser primært ut til å handle om ${topic.title.toLocaleLowerCase("nb-NO")}. Svaret er et deterministisk mock-svar, ikke et ekte KI-kall.`,
    facts: [String(situation || "").trim()].filter(Boolean).slice(0, 1),
    dilemma: ["Vær tydelig på observerbare forhold samtidig som medarbeideren får forklare sitt perspektiv."],
    relevant_topics: [topic.title],
    uncertainties: ["Demoen kjenner bare opplysningene som er skrevet inn i situasjonsfeltet."],
    cautions: ["Ikke legg til årsaker, motiv, diagnose eller skyld som ikke er dokumentert."],
    needs_clarification: false,
    clarifications: [],
    ai: false,
    model: "sensor-demo"
  };
}

function guidanceFor(situation, analysis) {
  const topic = analysis?.relevant_topics?.[0] || inferTopic(situation).title;
  return {
    opening: "Jeg vil gjerne ta opp det jeg har observert og høre hvordan du selv opplever situasjonen. Målet er å forstå hva som skjer og avtale et ryddig neste steg.",
    questions: [
      "Hvordan ser du selv på situasjonen?",
      "Er det noe i arbeidssituasjonen, forventningene eller rammene vi bør avklare?",
      "Hva mener du vil være et realistisk neste steg?"
    ],
    reactions: [
      {
        reaction: "Medarbeideren er uenig i beskrivelsen.",
        why_plausible: "Partene kan oppleve samme situasjon ulikt.",
        leader_response: "Hold deg til konkrete observasjoner og be om medarbeiderens versjon før du vurderer videre tiltak."
      },
      {
        reaction: "Medarbeideren blir stille eller usikker.",
        why_plausible: "Temaet kan oppleves vanskelig eller uventet.",
        leader_response: "Gi litt tid, gjenta formålet rolig og still ett åpent spørsmål om gangen."
      }
    ],
    attention: [
      `Hold samtalen konkret og knyttet til ${String(topic).toLocaleLowerCase("nb-NO")}.`,
      "Skill mellom det du vet, det medarbeideren forteller og det som fortsatt må avklares."
    ],
    check_before_meeting: [
      "Skriv ned de konkrete observasjonene du faktisk bygger samtalen på.",
      "Avklar hva du ønsker å oppnå med første samtale."
    ],
    legal_hr_note: "Dette er lokal sensor-demo og ikke juridisk rådgivning. Ved formelle eller rettslig sensitive personalsaker må virksomhetens rutiner og relevant fagstøtte brukes.",
    source_ids: [],
    supplementary_sources: [],
    next_steps: [
      "Gjennomfør samtalen med en konkret åpning og åpne spørsmål.",
      "Oppsummer hva som er avklart og avtal hvem som gjør hva videre.",
      "Avtal tidspunkt for oppfølging hvis saken trenger det."
    ],
    ai: false,
    model: "sensor-demo"
  };
}

app.get("/", (_req, res) => res.sendFile(path.join(root, "index.html")));
for (const filename of ["app.js", "live-pilot.js", "live-pilot.css", "styles.css", "styles-core.css", "styles-responsive.css", "styles-overrides.css", "manifest.webmanifest", "sw.js"]) {
  app.get(`/${filename}`, (_req, res) => res.sendFile(path.join(root, filename)));
}
for (const filename of ["privacy-name-data.js", "privacy-detector.js", "client-data.js", "live-pilot-utils.js"]) {
  app.get(`/src/${filename}`, (_req, res) => res.sendFile(path.join(root, "src", filename)));
}
app.use("/assets", express.static(path.join(root, "assets"), { index: false }));

app.get("/api/public-config", (_req, res) => res.json({
  appVersion: "20.11.5",
  contactEmail: "",
  demoMode: true,
  liveVoicePilotEnabled,
  liveTranscriptionConfigured
}));
app.get("/api/auth/me", (_req, res) => res.json({ user: demoUser }));
app.post("/api/auth/login", (_req, res) => res.json({ user: demoUser }));
app.post("/api/auth/register", (_req, res) => res.json({ user: demoUser }));
app.post("/api/auth/logout", (_req, res) => res.json({ ok: true }));
app.post("/api/auth/password-reset-request", (_req, res) => res.json({ ok: true }));
app.post("/api/auth/password-reset-complete", (_req, res) => res.json({ user: demoUser }));
app.get("/api/content", (_req, res) => res.json({ values: {}, setupRequired: false }));
app.get("/api/privacy-ack", (_req, res) => res.json({ acknowledged: true }));
app.post("/api/privacy-ack", (_req, res) => res.json({ ok: true }));
app.get("/api/status", (_req, res) => res.json({ aiConfigured: false, model: "sensor-demo", demoMode: true }));


function normalizeLiveText(value = "") {
  return String(value || "").normalize("NFC").toLocaleLowerCase("nb-NO").replace(/\s+/g, " ").trim();
}

function escapeLiveRegex(value = "") {
  return String(value || "").replace(/[.*+?^$()|[\]{}\\]/g, "\\$&");
}

function exactPhraseInText(text, phrase) {
  const escaped = escapeLiveRegex(phrase).replace(/\s+/g, "\\s+");
  if (!escaped) return false;
  return new RegExp("(?<![\\p{L}\\p{N}])" + escaped + "(?![\\p{L}\\p{N}])", "iu").test(text);
}

function detectLiveOccupation(text) {
  const source = normalizeLiveText(text);
  let best = null;
  for (const sector of occupationMap.sectors || []) {
    for (const occupation of sector.occupations || []) {
      if (!exactPhraseInText(source, normalizeLiveText(occupation))) continue;
      if (!best || String(occupation).length > String(best.occupation).length) {
        best = { sectorId: sector.id, sectorLabel: sector.label, occupation };
      }
    }
  }
  return best;
}

function detectLiveEmployerType(text) {
  const source = normalizeLiveText(text);
  if (/\b(?:stat|staten|statlig|statsansatt(?:e|en)?)\b/u.test(source)) return "state";
  if (/\b(?:kommune(?:n|r)?|kommunal(?:t|e)?|fylkeskommune(?:n|r)?|fylkeskommunal(?:t|e)?)\b/u.test(source)) return "municipal";
  if (/\b(?:helseforetak(?:et|ene)?)\b/u.test(source)) return "health_enterprise";
  if (/\b(?:privat(?:e)?|privat sektor|privat virksomhet|privat selskap)\b/u.test(source)) return "private";
  return "";
}

function liveOccupationRelevant(text) {
  const source = normalizeLiveText(text);
  const terms = [
    ...(occupationMap.selectionPolicy?.useOccupationWhen || []),
    "hms", "risiko", "prosedyre", "sertifikat", "pasientsikkerhet", "brukersikkerhet",
    "elevsikkerhet", "barnesikkerhet", "medisin", "medisinering", "legemiddel",
    "journal", "habilitet", "saksbehandling", "vold", "trussel", "beredskap",
    "politi", "forsvar", "luftfart", "flysikkerhet", "dyrevelferd", "smittevern"
  ].map(normalizeLiveText);
  return terms.some(term => term && source.includes(term));
}

function liveEmployerRelevant(text) {
  return /\b(?:tariff\w*|lønn\w*|oppsig\w*|avskjed\w*|ordensstraff\w*|ansett\w*|personalreglement\w*|drøft\w*|arbeidsforhold\w*|formell\w*)\b/u.test(normalizeLiveText(text));
}

app.get("/api/occupation-options", (_req, res) => {
  res.json({
    enabled: true,
    sectors: (occupationMap.sectors || []).map(sector => ({
      id: sector.id,
      label: sector.label,
      occupations: sector.occupations || []
    })),
    employerTypes: [
      { id: "state", label: "Stat" },
      { id: "municipal", label: "Kommune / fylkeskommune" },
      { id: "health_enterprise", label: "Helseforetak" },
      { id: "private", label: "Privat" },
      { id: "unknown", label: "Usikker / ukjent" }
    ]
  });
});

app.post("/api/live/context-check", (req, res) => {
  if (!liveVoicePilotEnabled) return res.status(404).json({ error: "LIVE_PILOT_DISABLED" });
  const text = String(req.body?.text || "").trim();
  if (!text) return res.status(400).json({ error: "MISSING_TEXT", message: "Mangler tekst for kontekstkontroll." });
  const occupation = detectLiveOccupation(text);
  const employerType = detectLiveEmployerType(text);
  res.json({
    occupation,
    occupationRelevant: liveOccupationRelevant(text),
    employerType,
    employerTypeRelevant: liveEmployerRelevant(text)
  });
});

const liveTokenBuckets = new Map();
function liveTokenAllowed(req) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const max = 20;
  const key = crypto.createHash("sha256").update(String(req.ip || "unknown")).digest("hex");
  const previous = liveTokenBuckets.get(key);
  const entry = !previous || previous.resetAt <= now ? { count: 0, resetAt: now + windowMs } : previous;
  entry.count += 1;
  liveTokenBuckets.set(key, entry);
  return entry.count <= max;
}

app.post("/api/live/transcription-token", async (req, res) => {
  if (!liveVoicePilotEnabled) return res.status(404).json({ error: "LIVE_PILOT_DISABLED" });
  if (!liveTokenAllowed(req)) return res.status(429).json({ error: "LIVE_RATE_LIMIT", message: "For mange LIVE-tilkoblinger. Prøv igjen senere." });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "LIVE_TRANSCRIPTION_NOT_CONFIGURED",
      message: "LIVE-transkripsjon er ikke konfigurert i pilotmiljøet."
    });
  }
  try {
    const safetyId = crypto.createHash("sha256").update("samtalestotte-live-pilot|" + String(req.ip || "unknown")).digest("hex");
    const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json",
        "OpenAI-Safety-Identifier": safetyId
      },
      body: JSON.stringify({
        expires_after: { anchor: "created_at", seconds: 300 },
        session: {
          type: "transcription",
          audio: {
            input: {
              noise_reduction: { type: "near_field", strength: 0.85 },
              transcription: {
                model: "gpt-live-transcribe",
                languages: ["no"],
                keywords: liveKeywords
              },
              turn_detection: null
            }
          }
        }
      })
    });
    const raw = await response.text();
    let payload = {};
    try { payload = raw ? JSON.parse(raw) : {}; } catch (_) {}
    if (!response.ok || !payload.value) {
      console.error("[live-pilot] Kunne ikke opprette client secret:", response.status, payload?.error?.code || "ukjent");
      return res.status(502).json({
        error: "LIVE_TRANSCRIPTION_TOKEN_FAILED",
        message: "Kunne ikke starte LIVE-transkripsjon."
      });
    }
    res.json({
      clientSecret: payload.value,
      expiresAt: payload.expires_at || null,
      model: "gpt-live-transcribe"
    });
  } catch (error) {
    console.error("[live-pilot] Client secret-feil:", error?.message || error);
    res.status(502).json({ error: "LIVE_TRANSCRIPTION_TOKEN_FAILED", message: "Kunne ikke starte LIVE-transkripsjon." });
  }
});

app.post("/api/classify-topic", (req, res) => {
  const situation = String(req.body?.situation || "").trim();
  if (situation.length < 4) {
    return res.status(400).json({ error: "MISSING_SITUATION", message: "Beskriv situasjonen litt mer før tema foreslås." });
  }
  const topic = inferTopic(situation, String(req.body?.selectedTopicId || ""));
  res.json({
    primary_topic_id: topic.id,
    primary_subtopic: topic.subtopic,
    confidence: "medium",
    reason: "Deterministisk klassifisering i lokal sensor-demo.",
    alternative_topic_ids: [],
    ai: false,
    model: "sensor-demo"
  });
});

app.post("/api/analyze-situation", (req, res) => {
  const situation = String(req.body?.situation || "").trim();
  if (!situation) {
    return res.status(400).json({ error: "MISSING_SITUATION", message: "Situasjonsbeskrivelse mangler." });
  }
  res.json(analysisFor(situation, String(req.body?.selectedTopic || "")));
});

app.post("/api/generate-guidance", (req, res) => {
  const situation = String(req.body?.situation || "").trim();
  if (!situation) {
    return res.status(400).json({ error: "MISSING_SITUATION", message: "Situasjonsbeskrivelse mangler." });
  }
  const analysis = req.body?.analysis || analysisFor(situation);
  res.json(guidanceFor(situation, analysis));
});

app.post("/api/continue-conversation", (req, res) => {
  const question = String(req.body?.question || req.body?.message || "").trim();
  if (!question) {
    return res.status(400).json({ error: "MISSING_QUESTION", message: "Oppfølgingsspørsmål mangler." });
  }
  res.json({
    reply: `I lokal sensor-demo brukes et fast mock-svar. Ta utgangspunkt i det som faktisk er observert, spør åpent om medarbeiderens perspektiv og avtal et konkret neste steg. Du spurte: «${question.slice(0, 180)}».`,
    ai: false,
    model: "sensor-demo"
  });
});

app.post("/api/simulation-turn", (req, res) => {
  const turns = Array.isArray(req.body?.turns) ? req.body.turns : [];
  const last = [...turns].reverse().find(turn => turn?.role === "leader")?.text || "";
  res.json({
    reply: last
      ? "Jeg hører hva du sier, men jeg opplever situasjonen litt annerledes. Kan du forklare mer konkret hva du har observert og hva du forventer av meg videre?"
      : "Hva ønsker du å snakke med meg om?",
    ai: false,
    model: "sensor-demo"
  });
});

app.post("/api/simulation-help", (_req, res) => res.json({
  help: "Hold deg til én konkret observasjon og still ett åpent spørsmål, for eksempel: «Hvordan ser du selv på dette?»",
  ai: false,
  model: "sensor-demo"
}));

app.post("/api/simulation-feedback", (_req, res) => res.json({
  worked_well: ["Du gjennomførte en full lokal demo av simulatorflyten."],
  could_be_clearer: ["I en virkelig samtale bør formuleringene tilpasses den konkrete situasjonen."],
  alternative_phrase: "Jeg vil gjerne forstå hvordan du ser på situasjonen før vi avtaler veien videre.",
  takeaway: "Skill observasjon fra tolkning, og avslutt med et konkret neste steg.",
  ai: false,
  model: "sensor-demo"
}));

app.get("/api/history", (_req, res) => {
  res.json({ items: [...history].sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt))) });
});
app.post("/api/history", (req, res) => {
  const body = req.body || {};
  const now = new Date().toISOString();
  let item;
  if (body.id) {
    const index = history.findIndex(row => row.id === body.id);
    item = {
      ...(index >= 0 ? history[index] : {}),
      ...body,
      id: body.id,
      createdAt: index >= 0 ? history[index].createdAt : now,
      updatedAt: now
    };
    if (index >= 0) history[index] = item;
    else history.push(item);
  } else {
    item = { ...body, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
    history.push(item);
  }
  res.json({ item });
});
app.delete("/api/history/:id", (req, res) => {
  const index = history.findIndex(row => row.id === req.params.id);
  if (index < 0) return res.status(404).json({ error: "NOT_FOUND" });
  history.splice(index, 1);
  res.json({ ok: true });
});
app.delete("/api/history", (_req, res) => {
  history.splice(0);
  res.json({ ok: true });
});

app.get("/api/account/export", (_req, res) => {
  const payload = {
    exported_at: new Date().toISOString(),
    app_version: "20.11.0-preview",
    account: demoUser,
    conversations: history,
    feedback: []
  };
  res.type("application/json").send(JSON.stringify(payload, null, 2));
});
app.delete("/api/account", (_req, res) => {
  history.splice(0);
  res.json({ ok: true });
});
app.post("/api/ai-feedback", (_req, res) => res.json({ ok: true }));
app.get("/api/survey/status", (_req, res) => res.json({ enabled: true, completed: false }));
app.post("/api/survey", (_req, res) => res.json({ ok: true }));

app.use("/api", (_req, res) => {
  res.status(404).json({
    error: "DEMO_ROUTE_NOT_IMPLEMENTED",
    message: "Denne admin-/driftsfunksjonen er ikke del av lokal sensor-demo. Bruk publisert testversjon for full funksjonalitet."
  });
});
app.use((_req, res) => res.status(404).send("Ikke funnet"));

const host = process.env.HOST || "0.0.0.0";
app.listen(port, host, () => {
  console.log(`Samtalestøtte sensor-demo kjører på http://${host}:${port}`);
  console.log("Demoen bruker deterministiske mock-svar for råd.");
  console.log(liveVoicePilotEnabled
    ? "LIVE-pilot aktivert. Transkripsjon: " + (liveTranscriptionConfigured ? "konfigurert" : "ikke konfigurert") + "."
    : "LIVE-pilot er deaktivert.");
});
