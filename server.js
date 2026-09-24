import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;
const appVersion = process.env.APP_VERSION || "19.0.0";
const contactEmail = String(process.env.CONTACT_EMAIL || "").trim();

app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

app.get("/api/public-config", (req, res) => {
  res.json({ appVersion, contactEmail });
});

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || "gpt-5.6-luna";
const client = apiKey ? new OpenAI({ apiKey }) : null;

// --- v18.1: Supabase Auth + database ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabasePublishableKey || !supabaseSecretKey) {
  throw new Error("Mangler SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY eller SUPABASE_SECRET_KEY i .env");
}

function newUserClient() {
  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}

const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
});

function normalizeEmail(value) { return String(value || "").trim().toLowerCase(); }
function hashInvite(code) { return crypto.createHash("sha256").update(String(code)).digest("hex"); }

const sessions = new Map();
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

function parseCookies(req) {
  return Object.fromEntries(String(req.headers.cookie || "").split(";").map(v => v.trim()).filter(Boolean).map(v => {
    const i = v.indexOf("=");
    return i >= 0 ? [decodeURIComponent(v.slice(0, i)), decodeURIComponent(v.slice(i + 1))] : [v, ""];
  }));
}

function sessionCookie(token, maxAge) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `samtalestotte_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`;
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.user_metadata?.username || user.email?.split("@")[0] || "Bruker",
    email: user.email,
    createdAt: user.created_at || null
  };
}

function setSession(res, authSession, user) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, {
    accessToken: authSession.access_token,
    refreshToken: authSession.refresh_token,
    user: publicUser(user || authSession.user),
    expiresAt: Date.now() + SESSION_MAX_AGE_MS
  });
  res.setHeader("Set-Cookie", sessionCookie(token, Math.floor(SESSION_MAX_AGE_MS / 1000)));
}

function clearSession(req, res) {
  const token = parseCookies(req).samtalestotte_session;
  if (token) sessions.delete(token);
  res.setHeader("Set-Cookie", sessionCookie("", 0));
}

async function resolveSession(req) {
  const token = parseCookies(req).samtalestotte_session;
  const local = token ? sessions.get(token) : null;
  if (!local || Date.now() > local.expiresAt) {
    if (token) sessions.delete(token);
    return null;
  }

  const userClient = newUserClient();
  const { data, error } = await userClient.auth.setSession({
    access_token: local.accessToken,
    refresh_token: local.refreshToken
  });

  if (error || !data.session || !data.user) {
    sessions.delete(token);
    return null;
  }

  local.accessToken = data.session.access_token;
  local.refreshToken = data.session.refresh_token;
  local.user = publicUser(data.user);
  local.expiresAt = Date.now() + SESSION_MAX_AGE_MS;
  return { token, local, userClient, user: local.user };
}

async function requireUser(req, res, next) {
  try {
    const resolved = await resolveSession(req);
    if (!resolved) return res.status(401).json({ error: "AUTH_REQUIRED", message: "Du må logge inn." });
    req.user = resolved.user;
    req.supabase = resolved.userClient;
    next();
  } catch (error) {
    console.error("Auth-feil:", error);
    res.status(500).json({ error: "AUTH_ERROR", message: "Kunne ikke kontrollere innloggingen." });
  }
}

app.get("/api/auth/me", async (req, res) => {
  const resolved = await resolveSession(req);
  res.json({ user: resolved?.user || null });
});

app.post("/api/auth/register", async (req, res) => {
  const username = String(req.body?.username || "").trim();
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");
  const inviteCode = String(req.body?.inviteCode || "").trim();

  if (username.length < 2 || username.length > 40) return res.status(400).json({ error: "INVALID_USERNAME", message: "Brukernavn må være mellom 2 og 40 tegn." });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: "INVALID_EMAIL", message: "Skriv inn en gyldig e-postadresse." });
  if (password.length < 10) return res.status(400).json({ error: "WEAK_PASSWORD", message: "Passordet må ha minst 10 tegn." });
  if (!inviteCode) return res.status(403).json({ error: "INVITE_REQUIRED", message: "Samtalestøtte er en lukket betaversjon og krever invitasjon." });

  const inviteHash = hashInvite(inviteCode);
  const { data: invite, error: inviteError } = await supabaseAdmin
    .from("invites")
    .select("id, used_at")
    .eq("code_hash", inviteHash)
    .is("used_at", null)
    .maybeSingle();

  if (inviteError) {
    console.error("Invitasjonsfeil:", inviteError);
    return res.status(500).json({ error: "INVITE_LOOKUP_FAILED", message: "Kunne ikke kontrollere invitasjonen." });
  }
  if (!invite) return res.status(403).json({ error: "INVALID_INVITE", message: "Invitasjonen er ugyldig eller allerede brukt." });

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username }
  });

  if (createError || !created.user) {
    const msg = String(createError?.message || "").toLowerCase();
    if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
      return res.status(409).json({ error: "EMAIL_EXISTS", message: "Det finnes allerede en konto med denne e-postadressen." });
    }
    console.error("Opprett bruker-feil:", createError);
    return res.status(500).json({ error: "REGISTER_FAILED", message: "Kunne ikke opprette konto." });
  }

  const now = new Date().toISOString();
  const { data: usedRows, error: useInviteError } = await supabaseAdmin
    .from("invites")
    .update({ used_at: now, user_id: created.user.id })
    .eq("id", invite.id)
    .is("used_at", null)
    .select("id");

  if (useInviteError || !usedRows?.length) {
    await supabaseAdmin.auth.admin.deleteUser(created.user.id);
    return res.status(409).json({ error: "INVITE_ALREADY_USED", message: "Invitasjonen ble brukt av noen andre. Be om en ny invitasjon." });
  }

  const signInClient = newUserClient();
  const { data: signedIn, error: signInError } = await signInClient.auth.signInWithPassword({ email, password });
  if (signInError || !signedIn.session) {
    console.error("Innlogging etter registrering feilet:", signInError);
    return res.status(201).json({ user: publicUser(created.user), loginRequired: true });
  }

  setSession(res, signedIn.session, signedIn.user);
  res.status(201).json({ user: publicUser(signedIn.user) });
});

app.post("/api/auth/login", async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");
  const authClient = newUserClient();
  const { data, error } = await authClient.auth.signInWithPassword({ email, password });
  if (error || !data.session || !data.user) return res.status(401).json({ error: "INVALID_LOGIN", message: "Feil e-post eller passord." });
  setSession(res, data.session, data.user);
  res.json({ user: publicUser(data.user) });
});

app.post("/api/auth/logout", async (req, res) => {
  const resolved = await resolveSession(req);
  if (resolved) {
    try { await resolved.userClient.auth.signOut(); } catch (_) {}
  }
  clearSession(req, res);
  res.json({ ok: true });
});

function historyPayload(body = {}) {
  return {
    title: String(body.title || "Samtale uten tittel").slice(0, 120),
    topic: String(body.topic || "").slice(0, 80),
    subtopic: String(body.subtopic || "").slice(0, 100),
    situation: String(body.situation || "").slice(0, 20000),
    analysis: body.analysis || null,
    guidance: body.guidance || null,
    conversation: Array.isArray(body.conversation) ? body.conversation.slice(-40) : [],
    simulation: body.simulation && typeof body.simulation === "object" ? {
      mode: String(body.simulation.mode || "solo").slice(0, 20),
      style: String(body.simulation.style || "open").slice(0, 30),
      turns: Array.isArray(body.simulation.turns) ? body.simulation.turns.slice(-40).map(turn => ({
        role: turn?.role === "employee" ? "employee" : "leader",
        text: String(turn?.text || "").slice(0, 5000)
      })) : [],
      feedback: body.simulation.feedback || null
    } : null
  };
}

function rowToHistory(row) {
  let stored = {};
  try { stored = JSON.parse(row.content || "{}"); } catch (_) {}
  return {
    id: String(row.id),
    ...stored,
    title: row.title || stored.title || "Samtale uten tittel",
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

app.get("/api/history", requireUser, async (req, res) => {
  const { data, error } = await req.supabase
    .from("conversations")
    .select("id,title,content,created_at,updated_at")
    .order("updated_at", { ascending: false });
  if (error) return res.status(500).json({ error: "HISTORY_READ_FAILED", message: "Kunne ikke hente historikken." });
  res.json({ items: (data || []).map(rowToHistory) });
});

app.post("/api/history", requireUser, async (req, res) => {
  const body = req.body || {};
  if (body.temporary) return res.json({ skipped: true });
  const payload = historyPayload(body);
  const now = new Date().toISOString();
  let query;

  if (body.id) {
    query = req.supabase
      .from("conversations")
      .update({ title: payload.title, content: JSON.stringify(payload), updated_at: now })
      .eq("id", body.id)
      .select("id,title,content,created_at,updated_at")
      .maybeSingle();
  } else {
    query = req.supabase
      .from("conversations")
      .insert({ user_id: req.user.id, title: payload.title, content: JSON.stringify(payload), updated_at: now })
      .select("id,title,content,created_at,updated_at")
      .single();
  }

  const { data, error } = await query;
  if (error || !data) {
    console.error("Lagre historikk-feil:", error);
    return res.status(500).json({ error: "HISTORY_SAVE_FAILED", message: "Kunne ikke lagre samtalen." });
  }
  res.json({ item: rowToHistory(data) });
});

app.delete("/api/history/:id", requireUser, async (req, res) => {
  const { data, error } = await req.supabase
    .from("conversations")
    .delete()
    .eq("id", req.params.id)
    .select("id");
  if (error) return res.status(500).json({ error: "HISTORY_DELETE_FAILED", message: "Kunne ikke slette samtalen." });
  if (!data?.length) return res.status(404).json({ error: "NOT_FOUND" });
  res.json({ ok: true });
});

app.delete("/api/history", requireUser, async (req, res) => {
  const { error } = await req.supabase.from("conversations").delete().eq("user_id", req.user.id);
  if (error) return res.status(500).json({ error: "HISTORY_DELETE_FAILED", message: "Kunne ikke slette historikken." });
  res.json({ ok: true });
});

app.delete("/api/account", requireUser, async (req, res) => {
  const userId = req.user.id;
  const { error: historyError } = await req.supabase.from("conversations").delete().eq("user_id", userId);
  if (historyError) return res.status(500).json({ error: "ACCOUNT_DELETE_FAILED", message: "Kunne ikke slette samtalehistorikken." });

  const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (deleteUserError) {
    console.error("Slett konto-feil:", deleteUserError);
    return res.status(500).json({ error: "ACCOUNT_DELETE_FAILED", message: "Kunne ikke slette kontoen." });
  }

  clearSession(req, res);
  res.json({ ok: true });
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


const simulationStyleInstructions = {
  open: 'Medarbeideren er i utgangspunktet åpen, saklig og samarbeidsvillig, men skal fortsatt ha egne perspektiver og kunne stille spørsmål.',
  uncertain: 'Medarbeideren er usikker og noe tilbaketrukket. Svarene kan være korte eller forsiktige, men ikke kunstig vage.',
  defensive: 'Medarbeideren er defensiv og kan være uenig i lederens beskrivelse eller vurdering. Reager realistisk uten å bli karikert eller aggressiv uten grunnlag.',
  emotional: 'Medarbeideren kan bli følelsesmessig berørt av temaet. Vis dette naturlig uten å dikte opp årsaker, diagnose eller privat bakgrunn.',
  critical: 'Medarbeideren er frustrert eller kritisk og kan utfordre lederens vurdering, prosess eller formuleringer. Hold reaksjonen realistisk og saklig nok til at øvelsen er nyttig.',
  surprise: 'Velg en realistisk reaksjonsmåte som passer saken og utviklingen i samtalen. Ikke opplys brukeren om hvilken stil du valgte.'
};

function sanitizeSimulationTurns(turns) {
  if (!Array.isArray(turns)) return [];
  return turns.slice(-24).map(turn => ({
    role: turn?.role === 'employee' ? 'employee' : 'leader',
    text: String(turn?.text || '').trim().slice(0, 4000)
  })).filter(turn => turn.text);
}

function simulationContextText({ situation = '', analysis = null, followups = {}, guidance = null, style = 'open', turns = [] }) {
  return `\n\n## Samtalesimulering\nDu spiller KUN medarbeideren i en øvelse for en leder. Brukeren spiller lederen.\n\nViktige grenser:\n- Ikke gi råd til lederen mens du spiller medarbeideren.\n- Ikke fortell hva lederen bør gjøre. Svar bare slik medarbeideren plausibelt kunne svart.\n- Ikke finn på diagnose, familieforhold, traumer, konflikter, rusbruk, motiv, hendelser eller annen personlig bakgrunn som ikke finnes i saken.\n- Ikke gjør tredjepartsopplysninger om til egne observasjoner.\n- Du kan uttrykke usikkerhet, uenighet, følelser eller spørsmål uten å forklare dem med oppdiktede fakta.\n- Hold hvert medarbeidersvar naturlig og relativt kort, vanligvis 1–4 setninger.\n- Reaksjonen skal utvikle seg ut fra det lederen faktisk sier, ikke låses mekanisk til én tone.\n\nValgt reaksjonsstil: ${style}. ${simulationStyleInstructions[style] || simulationStyleInstructions.open}\n\nSituasjon: ${String(situation).slice(0, 12000)}\nAnalyse: ${JSON.stringify(analysis || {})}\nAvklaringssvar: ${JSON.stringify(followups || {})}\nTidligere råd: ${JSON.stringify(guidance || {})}\nSamtalen så langt: ${JSON.stringify(sanitizeSimulationTurns(turns))}\n`;
}

app.post('/api/simulation-turn', async (req, res) => {
  if (!client) return res.status(503).json({ error: 'AI_NOT_CONFIGURED', message: 'OPENAI_API_KEY mangler på serveren.' });
  const body = req.body || {};
  const turns = sanitizeSimulationTurns(body.turns);
  if (!turns.length || turns[turns.length - 1].role !== 'leader') {
    return res.status(400).json({ error: 'MISSING_LEADER_TURN', message: 'Skriv først hva du vil si som leder.' });
  }
  const style = Object.prototype.hasOwnProperty.call(simulationStyleInstructions, body.style) ? body.style : 'open';
  try {
    const response = await client.responses.create({
      model,
      instructions: systemPrompt + simulationContextText({ ...body, style, turns }),
      input: [{ role: 'user', content: [{ type: 'input_text', text: 'Svar nå som medarbeideren på lederens siste utsagn. Ikke kommenter øvelsen eller gi lederråd.' }] }]
    });
    res.json({ reply: String(response.output_text || '').trim(), ai: true, model });
  } catch (error) {
    console.error('Simulation turn failed:', error);
    const status = Number(error?.status) || 500;
    res.status(status >= 400 && status < 600 ? status : 500).json({ error: 'SIMULATION_FAILED', message: 'Samtalesimuleringen feilet.' });
  }
});

app.post('/api/simulation-help', async (req, res) => {
  if (!client) return res.status(503).json({ error: 'AI_NOT_CONFIGURED', message: 'OPENAI_API_KEY mangler på serveren.' });
  const body = req.body || {};
  const helpKinds = {
    formulation: 'Gi ett kort forslag til hva lederen kan si som neste formulering.',
    question: 'Gi ett eller to gode spørsmål lederen kan stille akkurat nå.',
    clearer: 'Hjelp lederen å formulere sitt siste budskap tydeligere og mer respektfullt.',
    avoid: 'Nevn kort hva lederen særlig bør unngå å si akkurat nå, og hvorfor.'
  };
  const task = helpKinds[body.kind] || helpKinds.formulation;
  const turns = sanitizeSimulationTurns(body.turns);
  const prompt = `Du er nå trener, IKKE medarbeider. ${task}\nBruk bare opplysninger som finnes i saken og samtalen. Ikke dikt opp fakta. Ikke gi en lang forklaring. Maks 80 ord.\n\nSituasjon: ${String(body.situation || '').slice(0,12000)}\nAnalyse: ${JSON.stringify(body.analysis || {})}\nTidligere råd: ${JSON.stringify(body.guidance || {})}\nSamtalen så langt: ${JSON.stringify(turns)}`;
  try {
    const response = await client.responses.create({ model, instructions: systemPrompt, input: [{ role: 'user', content: [{ type: 'input_text', text: prompt }] }] });
    res.json({ help: String(response.output_text || '').trim(), ai: true, model });
  } catch (error) {
    console.error('Simulation help failed:', error);
    const status = Number(error?.status) || 500;
    res.status(status >= 400 && status < 600 ? status : 500).json({ error: 'SIMULATION_HELP_FAILED', message: 'KI-støtten feilet.' });
  }
});

const simulationFeedbackSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    worked_well: { type: 'array', minItems: 1, maxItems: 4, items: { type: 'string' } },
    could_be_clearer: { type: 'array', minItems: 1, maxItems: 4, items: { type: 'string' } },
    alternative_phrase: { type: 'string' },
    takeaway: { type: 'string' }
  },
  required: ['worked_well', 'could_be_clearer', 'alternative_phrase', 'takeaway']
};

app.post('/api/simulation-feedback', async (req, res) => {
  if (!client) return res.status(503).json({ error: 'AI_NOT_CONFIGURED', message: 'OPENAI_API_KEY mangler på serveren.' });
  const body = req.body || {};
  const turns = sanitizeSimulationTurns(body.turns);
  if (!turns.some(turn => turn.role === 'leader')) return res.status(400).json({ error: 'EMPTY_SIMULATION', message: 'Øvelsen har ingen lederutsagn å vurdere.' });
  const task = `\n\n## Oppgave: tilbakemelding etter samtaleøvelse\nDu er trener, ikke medarbeider. Vurder KUN det lederen faktisk sa i transkriptet.\n- Ingen poengsum, karakter eller rangering.\n- Pek på konkrete formuleringer eller grep som fungerte godt.\n- Pek på konkrete steder som kunne vært tydeligere, mer åpne eller mer presise.\n- Ikke anta lederens intensjon utover ordene som står der.\n- Ikke finn på fakta om medarbeideren.\n- Gi én alternativ formulering som passer saken.\n- Avslutt med ett kort læringspunkt.\n\nSituasjon: ${String(body.situation || '').slice(0,12000)}\nAnalyse: ${JSON.stringify(body.analysis || {})}\nTidligere råd: ${JSON.stringify(body.guidance || {})}\nTranskript: ${JSON.stringify(turns)}`;
  try {
    const response = await client.responses.create({
      model,
      instructions: systemPrompt + task,
      input: [{ role: 'user', content: [{ type: 'input_text', text: 'Gi strukturert tilbakemelding på øvelsen.' }] }],
      text: { format: { type: 'json_schema', name: 'samtalesimulering_tilbakemelding', strict: true, schema: simulationFeedbackSchema } }
    });
    res.json({ ...JSON.parse(response.output_text), ai: true, model });
  } catch (error) {
    console.error('Simulation feedback failed:', error);
    const status = Number(error?.status) || 500;
    res.status(status >= 400 && status < 600 ? status : 500).json({ error: 'SIMULATION_FEEDBACK_FAILED', message: 'Tilbakemeldingen feilet.' });
  }
});

app.listen(port, () => {
  console.log(`Samtalestøtte kjører på http://localhost:${port}`);
  console.log(client ? `KI aktivert (${model})` : "KI er ikke aktivert: sett OPENAI_API_KEY i .env");
});
