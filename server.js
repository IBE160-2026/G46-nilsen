import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || "gpt-5.6-terra";
const client = apiKey ? new OpenAI({ apiKey }) : null;


// --- v18: lukket pilot, konto og historikk ---
const dataDir = path.join(__dirname, "data");
const usersFile = path.join(dataDir, "users.json");
const invitesFile = path.join(dataDir, "invites.json");
const historyFile = path.join(dataDir, "history.json");
fs.mkdirSync(dataDir, { recursive: true });
for (const file of [usersFile, invitesFile, historyFile]) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "[]", "utf8");
}

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch (_) { return []; }
}
function writeJson(file, value) {
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(value, null, 2), "utf8");
  fs.renameSync(temp, file);
}
function normalizeEmail(value) { return String(value || "").trim().toLowerCase(); }
function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}
function verifyPassword(password, salt, expected) {
  const actual = crypto.scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expected, "hex");
  return actual.length === expectedBuffer.length && crypto.timingSafeEqual(actual, expectedBuffer);
}
function hashInvite(code) { return crypto.createHash("sha256").update(String(code)).digest("hex"); }

const sessions = new Map();
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;
function parseCookies(req) {
  return Object.fromEntries(String(req.headers.cookie || "").split(";").map(v => v.trim()).filter(Boolean).map(v => {
    const i = v.indexOf("="); return i >= 0 ? [decodeURIComponent(v.slice(0,i)), decodeURIComponent(v.slice(i+1))] : [v, ""];
  }));
}
function currentUser(req) {
  const token = parseCookies(req).samtalestotte_session;
  const session = token ? sessions.get(token) : null;
  if (!session || Date.now() > session.expiresAt) { if (token) sessions.delete(token); return null; }
  return readJson(usersFile).find(u => u.id === session.userId) || null;
}
function requireUser(req, res, next) {
  const user = currentUser(req);
  if (!user) return res.status(401).json({ error: "AUTH_REQUIRED", message: "Du må logge inn." });
  req.user = user; next();
}
function setSession(res, userId) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, { userId, expiresAt: Date.now() + SESSION_MAX_AGE_MS });
  res.setHeader("Set-Cookie", `samtalestotte_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${Math.floor(SESSION_MAX_AGE_MS/1000)}`);
}
function clearSession(req, res) {
  const token = parseCookies(req).samtalestotte_session;
  if (token) sessions.delete(token);
  res.setHeader("Set-Cookie", "samtalestotte_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
}
function publicUser(user) { return user ? { id:user.id, username:user.username, email:user.email, createdAt:user.createdAt } : null; }

app.get("/api/auth/me", (req,res) => res.json({ user: publicUser(currentUser(req)) }));

app.post("/api/auth/register", (req,res) => {
  const username = String(req.body?.username || "").trim();
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");
  const inviteCode = String(req.body?.inviteCode || "").trim();
  if (username.length < 2 || username.length > 40) return res.status(400).json({ error:"INVALID_USERNAME", message:"Brukernavn må være mellom 2 og 40 tegn." });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error:"INVALID_EMAIL", message:"Skriv inn en gyldig e-postadresse." });
  if (password.length < 10) return res.status(400).json({ error:"WEAK_PASSWORD", message:"Passordet må ha minst 10 tegn." });
  if (!inviteCode) return res.status(403).json({ error:"INVITE_REQUIRED", message:"Samtalestøtte er en lukket pilot og krever invitasjon." });
  const invites = readJson(invitesFile);
  const inviteHash = hashInvite(inviteCode);
  const invite = invites.find(i => i.codeHash === inviteHash && !i.usedAt);
  if (!invite) return res.status(403).json({ error:"INVALID_INVITE", message:"Invitasjonen er ugyldig eller allerede brukt." });
  const users = readJson(usersFile);
  if (users.some(u => u.email === email)) return res.status(409).json({ error:"EMAIL_EXISTS", message:"Det finnes allerede en konto med denne e-postadressen." });
  const {salt,hash} = hashPassword(password);
  const user = { id:crypto.randomUUID(), username, email, passwordSalt:salt, passwordHash:hash, createdAt:new Date().toISOString() };
  users.push(user); writeJson(usersFile, users);
  invite.usedAt = new Date().toISOString(); invite.userId = user.id; writeJson(invitesFile, invites);
  setSession(res, user.id);
  return res.status(201).json({ user: publicUser(user) });
});

app.post("/api/auth/login", (req,res) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");
  const user = readJson(usersFile).find(u => u.email === email);
  if (!user || !verifyPassword(password, user.passwordSalt, user.passwordHash)) return res.status(401).json({ error:"INVALID_LOGIN", message:"Feil e-post eller passord." });
  setSession(res, user.id); return res.json({ user: publicUser(user) });
});
app.post("/api/auth/logout", (req,res) => { clearSession(req,res); res.json({ ok:true }); });

app.get("/api/history", requireUser, (req,res) => {
  const items = readJson(historyFile).filter(x => x.userId === req.user.id).sort((a,b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  res.json({ items });
});
app.post("/api/history", requireUser, (req,res) => {
  const body = req.body || {};
  if (body.temporary) return res.json({ skipped:true });
  const all = readJson(historyFile);
  let item = body.id ? all.find(x => x.id === body.id && x.userId === req.user.id) : null;
  const now = new Date().toISOString();
  const payload = {
    title:String(body.title || "Samtale uten tittel").slice(0,120), topic:String(body.topic || "").slice(0,80), subtopic:String(body.subtopic || "").slice(0,100),
    situation:String(body.situation || "").slice(0,20000), analysis:body.analysis || null, guidance:body.guidance || null,
    conversation:Array.isArray(body.conversation) ? body.conversation.slice(-40) : []
  };
  if (item) Object.assign(item, payload, { updatedAt:now });
  else { item={ id:crypto.randomUUID(), userId:req.user.id, ...payload, createdAt:now, updatedAt:now }; all.push(item); }
  writeJson(historyFile, all); res.json({ item });
});
app.delete("/api/history/:id", requireUser, (req,res) => {
  const all = readJson(historyFile); const next = all.filter(x => !(x.id === req.params.id && x.userId === req.user.id));
  if (next.length === all.length) return res.status(404).json({ error:"NOT_FOUND" });
  writeJson(historyFile, next); res.json({ ok:true });
});
app.delete("/api/history", requireUser, (req,res) => {
  writeJson(historyFile, readJson(historyFile).filter(x => x.userId !== req.user.id)); res.json({ ok:true });
});
app.delete("/api/account", requireUser, (req,res) => {
  writeJson(usersFile, readJson(usersFile).filter(u => u.id !== req.user.id));
  writeJson(historyFile, readJson(historyFile).filter(x => x.userId !== req.user.id));
  clearSession(req,res); res.json({ ok:true });
});

const systemPrompt = fs.readFileSync(path.join(__dirname, "AI-SYSTEMPROMPT.md"), "utf8");
const sourceBank = JSON.parse(fs.readFileSync(path.join(__dirname, "SOURCEBANK.json"), "utf8"));
const sourceIds = sourceBank.sources.map(source => source.id);

function selectRelevantSources(analysis = {}, situation = "") {
  const topics = new Set(Array.isArray(analysis?.relevant_topics) ? analysis.relevant_topics : []);
  const analysisText = [analysis?.summary, ...(analysis?.dilemma || []), ...(analysis?.cautions || []), ...(analysis?.uncertainties || [])]
    .filter(Boolean).join(" ");
  const q = `${situation || ""} ${analysisText}`.toLocaleLowerCase("nb-NO");
  const authorityWeight = { high: 2, medium: 1 };
  const scored = sourceBank.sources.map(source => {
    let score = 0;
    source.topics.forEach(topic => { if (topics.has(topic)) score += 5; });
    (source.use_when || []).forEach(term => {
      const normalized = String(term).toLocaleLowerCase("nb-NO");
      if (normalized && q.includes(normalized)) score += 3;
    });
    score += authorityWeight[source.authority] || 0;
    if (source.type === "lovverk" || source.type === "myndighet") score += 1.5;
    if (source.type === "fagfellevurdert forskning") score += 1;
    return { source, score };
  }).filter(item => item.score > 0).sort((a,b) => b.score - a.score);
  return scored.slice(0, 10).map(item => item.source);
}

function publicSources(ids = []) {
  const wanted = new Set(ids);
  return sourceBank.sources.filter(source => wanted.has(source.id)).map(source => ({
    id: source.id, title: source.title, author: source.author, year: source.year, type: source.type, url: source.url, doi: source.doi || null
  }));
}

function webSourceUrls(response) {
  const urls = new Set();
  for (const item of response?.output || []) {
    const sources = item?.action?.sources;
    if (!Array.isArray(sources)) continue;
    for (const source of sources) {
      if (source?.type === "url" && typeof source.url === "string") urls.add(source.url);
    }
  }
  return urls;
}

const analysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    summary: { type: "string" },
    facts: { type: "array", items: { type: "string" }, maxItems: 6 },
    dilemma: { type: "array", items: { type: "string" }, maxItems: 4 },
    relevant_topics: {
      type: "array",
      maxItems: 2,
      items: {
        type: "string",
        enum: [
          "Alkohol og rus",
          "Fravær og oppfølging",
          "Prestasjon og utvikling",
          "Lønn og utvikling",
          "Samarbeid og kommunikasjon",
          "Avslutning av arbeidsforhold",
          "Sikkerhet og ansvar",
          "Livssituasjoner"
        ]
      }
    },
    uncertainties: { type: "array", items: { type: "string" }, maxItems: 4 },
    cautions: { type: "array", items: { type: "string" }, maxItems: 3 },
    needs_clarification: { type: "boolean" },
    clarifications: {
      type: "array",
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          question: { type: "string" },
          options: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 5 },
          allow_custom: { type: "boolean" },
          custom_label: { type: "string" },
          multi_select: { type: "boolean" }
        },
        required: ["id", "question", "options", "allow_custom", "custom_label", "multi_select"]
      }
    }
  },
  required: [
    "confidence",
    "summary",
    "facts",
    "dilemma",
    "relevant_topics",
    "uncertainties",
    "cautions",
    "needs_clarification",
    "clarifications"
  ]
};


const guidanceSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "string" },
    questions: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 5 },
    reactions: {
      type: "array", minItems: 2, maxItems: 4,
      items: {
        type: "object", additionalProperties: false,
        properties: {
          reaction: { type: "string" },
          why_plausible: { type: "string" },
          leader_response: { type: "string" }
        },
        required: ["reaction", "why_plausible", "leader_response"]
      }
    },
    attention: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
    check_before_meeting: { type: "array", items: { type: "string" }, maxItems: 5 },
    legal_hr_note: { type: "string" },
    source_ids: { type: "array", maxItems: 4, items: { type: "string", enum: sourceIds } },
    supplementary_sources: {
      type: "array", maxItems: 2,
      items: {
        type: "object", additionalProperties: false,
        properties: {
          title: { type: "string" }, author: { type: "string" }, year: { type: "string" },
          type: { type: "string" }, url: { type: "string" }
        },
        required: ["title", "author", "year", "type", "url"]
      }
    },
    next_steps: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 }
  },
  required: ["opening", "questions", "reactions", "attention", "check_before_meeting", "legal_hr_note", "source_ids", "supplementary_sources", "next_steps"]
};

app.get("/api/status", (_req, res) => {
  res.json({ aiConfigured: Boolean(client), model: client ? model : null });
});

app.post("/api/analyze-situation", async (req, res) => {
  if (!client) {
    return res.status(503).json({
      error: "AI_NOT_CONFIGURED",
      message: "OPENAI_API_KEY mangler på serveren."
    });
  }

  const { situation, helpRequest = "", selectedTopic = "", selectedSubtopic = "" } = req.body || {};
  if (typeof situation !== "string" || !situation.trim()) {
    return res.status(400).json({ error: "MISSING_SITUATION", message: "Situasjonsbeskrivelse mangler." });
  }

  const task = `\n\n## Oppgave i denne forespørselen\nAnalyser situasjonen som samtalepartner, ikke som HR-klassifiserer.\n- Gjengi bare fakta som faktisk står i brukerens tekst.\n- Identifiser det menneskelige/praktiske dilemmaet, ikke bare en kategori.\n- Relevante temaer er kun metadata og skal være maks to.\n- Still bare avklaringsspørsmål dersom svarene kan endre rådet vesentlig.\n- Lag korte klikkbare svaralternativer som dekker sannsynlige svar uten å påstå at de er sanne.
- Sett multi_select=true når flere svaralternativer realistisk kan være sanne samtidig eller brukeren kan trenge hjelp med flere ting. Bruk false når alternativene faktisk utelukker hverandre.\n- Spør aldri om diagnose eller unødvendige sensitive opplysninger.\n- Hvis valgt tema/undertema ikke passer teksten, skal friteksten veie tyngst.\n\nValgt tema i grensesnittet: ${selectedTopic || "ikke oppgitt"}\nValgt undertema: ${selectedSubtopic || "ikke oppgitt"}\nHva brukeren ønsker hjelp til: ${helpRequest || "ikke oppgitt"}\n`;

  try {
    const response = await client.responses.create({
      model,
      instructions: systemPrompt + task,
      input: [
        {
          role: "user",
          content: [{ type: "input_text", text: situation.trim() }]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "samtalestotte_situasjonsforstaelse",
          strict: true,
          schema: analysisSchema
        }
      }
    });

    const raw = response.output_text;
    const parsed = JSON.parse(raw);
    return res.json({ ...parsed, ai: true, model });
  } catch (error) {
    console.error("OpenAI analysis failed:", error);
    const status = Number(error?.status) || 500;
    const code = error?.code || error?.error?.code || null;
    const type = error?.type || error?.error?.type || null;
    const rawMessage = error?.message || error?.error?.message || "Ukjent feil fra OpenAI API.";

    let hint = "Se PowerShell-vinduet for detaljer.";
    if (status === 401) hint = "API-nøkkelen ble avvist. Kontroller OPENAI_API_KEY i .env.";
    else if (status === 403) hint = "API-nøkkelen mangler nødvendig tilgang til Responses API eller modellen.";
    else if (status === 404) hint = `Modellen ${model} er ikke tilgjengelig for dette prosjektet, eller modellnavnet er feil.`;
    else if (status === 429) hint = "API-prosjektet har nådd en bruks-/betalingsgrense eller mangler tilgjengelig kreditt.";

    return res.status(status >= 400 && status < 600 ? status : 500).json({
      error: "AI_ANALYSIS_FAILED",
      message: "KI-analysen feilet.",
      diagnostic: { status, code, type, apiMessage: rawMessage, model, hint }
    });
  }
});


app.post("/api/generate-guidance", async (req, res) => {
  if (!client) {
    return res.status(503).json({ error: "AI_NOT_CONFIGURED", message: "OPENAI_API_KEY mangler på serveren." });
  }

  const { situation, analysis = null, followups = {} } = req.body || {};
  if (typeof situation !== "string" || !situation.trim()) {
    return res.status(400).json({ error: "MISSING_SITUATION", message: "Situasjonsbeskrivelse mangler." });
  }

  const relevantSources = selectRelevantSources(analysis, situation);
  const guidanceTask = `\n\n## Oppgave: lag konkret samtalestøtte\nDu skal nå lage selve samtalestøtten til akkurat denne saken. Ikke bruk standardråd som kunne passet enhver leder.\n- Bruk brukerens situasjon, situasjonsanalysen og avklaringssvarene som én samlet kontekst.\n- Åpningen skal kunne sies høyt i denne konkrete samtalen.\n- Spørsmålene skal være få og målrettede; hvert spørsmål må ha en tydelig funksjon i akkurat saken.\n- Foreslå 2–4 plausible reaksjoner som er SPESIFIKKE for det som står på spill. Ikke bruk generelle følelseskategorier med mindre konteksten faktisk gjør dem relevante.\n- For hver reaksjon: forklar kort hvorfor den er plausibel og hvordan lederen kan møte den. Ikke påstå at medarbeideren vil reagere slik.\n- Skill mellom hva lederen bør AVKLARE før møtet og hva lederen bør SI i møtet.\n- Ikke be om diagnose eller medisinske detaljer.\n- Ikke dikt opp virksomhetens regler, fakta, forskning eller rettsregler.\n- Bruk den kuraterte fagbanken som førstevalg og kvalitetsanker. Vanlige samtaleråd trenger ikke kilde. Kritiske, rettslige eller tydelig faglige råd bør støttes av relevante kilder.\n- source_ids må kun inneholde ID-er fra den oppgitte fagbanken. Velg 1–4 presise kilder når de faktisk passer.\n- Fagbanken er IKKE en lukket liste. Dersom saken trenger en mer presis, nyere eller manglende kilde, kan du bruke nettsøk og supplere med inntil 2 kilder. Prioriter norsk lov/myndighet, anerkjente fagmiljøer, systematiske oversikter/meta-analyser og fagfellevurdert forskning. Unngå blogger, markedsføring og tilfeldige rådssider.\n- supplementary_sources skal bare inneholde kilder du faktisk har funnet og brukt gjennom nettsøk. Ikke konstruer titler, forfattere eller lenker. Bruk tom liste hvis fagbanken er tilstrekkelig.\n- Ved juridisk sensitivitet: prioriter gjeldende norsk lov/myndighetskilde og anbefal HR/juridisk kvalitetssikring når nødvendig, uten å konkludere definitivt.\n\nSituasjonsanalyse fra første KI-steg: ${JSON.stringify(analysis || {})}\nAvklaringssvar: ${JSON.stringify(followups || {})}\n\n## Relevante, kvalitetssikrede kilder i fagbanken\n${JSON.stringify(relevantSources)}\n`;

  try {
    const response = await client.responses.create({
      model,
      tools: [{ type: "web_search", search_context_size: "low" }],
      instructions: systemPrompt + guidanceTask,
      input: [{ role: "user", content: [{ type: "input_text", text: situation.trim() }] }],
      text: {
        format: {
          type: "json_schema",
          name: "samtalestotte_konkret_veiledning",
          strict: true,
          schema: guidanceSchema
        }
      }
    });
    const parsed = JSON.parse(response.output_text);
    const curated = publicSources(parsed.source_ids);
    const usedWebUrls = webSourceUrls(response);
    const supplementary = (Array.isArray(parsed.supplementary_sources) ? parsed.supplementary_sources : [])
      .filter(source => source?.url && usedWebUrls.has(source.url));
    return res.json({ ...parsed, evidence_sources: [...curated, ...supplementary], ai: true, model });
  } catch (error) {
    console.error("OpenAI guidance failed:", error);
    const status = Number(error?.status) || 500;
    const code = error?.code || error?.error?.code || null;
    const rawMessage = error?.message || error?.error?.message || "Ukjent feil fra OpenAI API.";
    return res.status(status >= 400 && status < 600 ? status : 500).json({
      error: "AI_GUIDANCE_FAILED", message: "KI-samtalestøtten feilet.",
      diagnostic: { status, code, apiMessage: rawMessage, model }
    });
  }
});


app.post("/api/continue-conversation", async (req, res) => {
  if (!client) {
    return res.status(503).json({ error: "AI_NOT_CONFIGURED", message: "OPENAI_API_KEY mangler på serveren." });
  }
  const { situation, analysis = null, followups = {}, guidance = null, question = "" } = req.body || {};
  if (typeof question !== "string" || !question.trim()) {
    return res.status(400).json({ error: "MISSING_QUESTION", message: "Oppfølgingsspørsmål mangler." });
  }
  const relevantSources = selectRelevantSources(analysis, situation);
  const continueTask = `\n\n## Oppgave: svar på oppfølgingsspørsmål i samme sak\nSvar som en konkret samtalepartner. Bruk samme situasjon, analyse, avklaringssvar og tidligere KI-råd.\n- Svar direkte på det brukeren spør om.\n- Unngå generelle standardråd hvis du kan være mer konkret ut fra saken.\n- Ikke dikt opp fakta, motiv eller virksomhetsregler.\n- Ved juridisk sensitivitet: pek på relevant kontrollpunkt og anbefal HR/juridisk kvalitetssikring, uten å konkludere definitivt.\n- Ikke be om diagnose eller unødvendige sensitive opplysninger.\n- Bruk fagbanken som førstevalg. Dersom spørsmålet krever oppdatert eller mer presis faglig dokumentasjon enn banken dekker, kan du bruke nettsøk. Prioriter myndigheter, anerkjente fagmiljøer og fagfellevurdert forskning.\n- Hold svaret kort og praktisk. Bruk 2–5 tydelige nummererte seksjoner når svaret har flere deler, for eksempel «1. Hva du kan si», «2. Spørsmål du kan stille», «3. Vær oppmerksom på». Bruk punktlister der det gir bedre oversikt.\n\nSituasjon: ${situation || ""}\nAnalyse: ${JSON.stringify(analysis || {})}\nAvklaringssvar: ${JSON.stringify(followups || {})}\nTidligere råd: ${JSON.stringify(guidance || {})}\nRelevante kilder i fagbanken: ${JSON.stringify(relevantSources)}\n`;
  try {
    const response = await client.responses.create({
      model,
      tools: [{ type: "web_search", search_context_size: "low" }],
      instructions: systemPrompt + continueTask,
      input: [{ role: "user", content: [{ type: "input_text", text: question.trim() }] }]
    });
    return res.json({ reply: response.output_text, ai: true, model });
  } catch (error) {
    console.error("OpenAI continuation failed:", error);
    const status = Number(error?.status) || 500;
    const code = error?.code || error?.error?.code || null;
    const rawMessage = error?.message || error?.error?.message || "Ukjent feil fra OpenAI API.";
    return res.status(status >= 400 && status < 600 ? status : 500).json({
      error: "AI_CONTINUATION_FAILED", message: "KI-oppfølgingen feilet.",
      diagnostic: { status, code, apiMessage: rawMessage, model }
    });
  }
});

app.listen(port, () => {
  console.log(`Samtalestøtte kjører på http://localhost:${port}`);
  console.log(client ? `KI aktivert (${model})` : "KI er ikke aktivert: sett OPENAI_API_KEY i .env");
});
