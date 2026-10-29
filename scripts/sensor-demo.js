import express from "express";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const app = express();
const port = Number(process.env.PORT || 3000);

app.disable("x-powered-by");
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
for (const filename of ["app.js", "styles.css", "manifest.webmanifest", "sw.js"]) {
  app.get(`/${filename}`, (_req, res) => res.sendFile(path.join(root, filename)));
}
for (const filename of ["privacy-name-data.js", "privacy-detector.js", "client-data.js"]) {
  app.get(`/src/${filename}`, (_req, res) => res.sendFile(path.join(root, "src", filename)));
}
app.use("/assets", express.static(path.join(root, "assets"), { index: false }));

app.get("/api/public-config", (_req, res) => res.json({
  appVersion: "20.11.0-preview",
  contactEmail: "",
  demoMode: true
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
  console.log("Demoen bruker deterministiske mock-svar og ingen eksterne tjenester eller API-nøkler.");
});
