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
const appVersion = process.env.APP_VERSION || "20.2.0";
const contactEmail = "cecilie.c.nilsen@himolde.no";

app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

app.get("/api/public-config", (req, res) => {
  res.json({ appVersion, contactEmail });
});

const apiKey = process.env.OPENAI_API_KEY;
const defaultModel = process.env.OPENAI_MODEL || "gpt-5.6-luna";
const client = apiKey ? new OpenAI({ apiKey }) : null;

const AI_MODELS = {
  "gpt-5.6-luna": { label: "GPT-5.6 Luna", tier: "Kostnad", inputPerMillion: 0.20, outputPerMillion: 1.20 },
  "gpt-5.6-terra": { label: "GPT-5.6 Terra", tier: "Balansert", inputPerMillion: 2.00, outputPerMillion: 12.00 },
  "gpt-5.6-sol": { label: "GPT-5.6 Sol", tier: "Høyest kvalitet", inputPerMillion: 4.00, outputPerMillion: 20.00 }
};
let activeModelCache = { value: null, expiresAt: 0 };

async function getActiveModel() {
  if (activeModelCache.value && Date.now() < activeModelCache.expiresAt) return activeModelCache.value;
  let selected = defaultModel;
  try {
    const { data, error } = await supabaseAdmin.from('app_settings').select('value').eq('key','ai_model').maybeSingle();
    if (!error && data?.value) {
      const candidate = typeof data.value === 'string' ? data.value : data.value?.model;
      if (candidate && AI_MODELS[candidate]) selected = candidate;
    }
  } catch (_) {}
  if (!AI_MODELS[selected]) selected = 'gpt-5.6-luna';
  activeModelCache = { value: selected, expiresAt: Date.now() + 30000 };
  return selected;
}

function extractWebSearchMeta(response) {
  const queries = [];
  const domains = [];
  let used = false;
  for (const item of response?.output || []) {
    if (item?.type === 'web_search_call') {
      used = true;
      const q = item?.action?.query;
      const qs = item?.action?.queries;
      if (typeof q === 'string' && q.trim()) queries.push(q.trim());
      if (Array.isArray(qs)) queries.push(...qs.filter(x => typeof x === 'string' && x.trim()).map(x => x.trim()));
    }
    if (item?.type === 'message') {
      for (const part of item.content || []) {
        for (const ann of part.annotations || []) {
          const url = ann?.url || ann?.url_citation?.url;
          if (url) {
            try { domains.push(new URL(url).hostname.replace(/^www\./,'')); } catch (_) {}
          }
        }
      }
    }
  }
  return { used, queries: [...new Set(queries)].slice(0,10), domains: [...new Set(domains)].slice(0,20) };
}

async function logAiUsage({ userId=null, functionName='unknown', modelUsed, response }) {
  try {
    const usage = response?.usage || {};
    const inputTokens = Number(usage.input_tokens || usage.inputTokens || 0);
    const outputTokens = Number(usage.output_tokens || usage.outputTokens || 0);
    const meta = AI_MODELS[modelUsed] || { inputPerMillion:0, outputPerMillion:0 };
    const estimatedCostUsd = (inputTokens / 1_000_000) * meta.inputPerMillion + (outputTokens / 1_000_000) * meta.outputPerMillion;
    const web = extractWebSearchMeta(response);
    await supabaseAdmin.from('ai_usage_log').insert({
      user_id:userId, function_name:functionName, model:modelUsed,
      input_tokens:inputTokens, output_tokens:outputTokens, total_tokens:inputTokens+outputTokens,
      estimated_cost_usd:estimatedCostUsd, web_search_used:web.used,
      web_search_queries:web.queries, source_domains:web.domains
    });
  } catch (error) {
    console.warn('Kunne ikke lagre KI-brukslogg:', error?.message || error);
  }
}

async function createTrackedResponse(params) {
  const modelUsed = await getActiveModel();
  const functionName = String(params._functionName || 'unknown');
  const userId = params._userId || null;
  const cleanParams = { ...params };
  delete cleanParams._functionName; delete cleanParams._userId;
  try {
    const response = await client.responses.create({ ...cleanParams, model: modelUsed });
    await logAiUsage({ userId, functionName, modelUsed, response });
    Object.defineProperty(response, '__samtalestotteModel', { value:modelUsed, enumerable:false });
    return response;
  } catch (error) {
    error.samtalestotteModel = modelUsed;
    throw error;
  }
}

function responseModel(response) { return response?.__samtalestotteModel || defaultModel; }


// --- v19.10: KI-basert temaforståelse ---
const topicCatalog = [
  {
    id: "alkohol-rus",
    title: "Alkohol og rus",
    description: "Eksplisitte observasjoner eller bekymringer om alkohol, rusmidler eller påvirkning.",
    subtopics: ["Bekymring knyttet til alkohol","Bekymring knyttet til rusmidler","Påvirkning på jobb","Arbeidsevne og fungering","Sikkerhet og hendelser","Oppfølging og tilbakekomst"]
  },
  {
    id: "fravaer-oppfolging",
    title: "Fravær og oppfølging",
    description: "Fravær, oppmøte, punktlighet, tilbakekomst, arbeidsevne eller tilrettelegging.",
    subtopics: ["Korttidsfravær","Langvarig fravær","Oppmøte og punktlighet","Tilbakekomst til arbeid","Tilrettelegging","Arbeidsevne og kapasitet"]
  },
  {
    id: "prestasjon-utvikling",
    title: "Prestasjon og utvikling",
    description: "Arbeidsutførelse, prioritering, tidsbruk, mål, kvalitet, motivasjon, ansvar, initiativ eller kompetanse.",
    subtopics: ["Måloppnåelse","Motivasjon","Kvalitet i arbeidet","Feil og avvik","Kompetanse og mestring","Ansvar og initiativ"]
  },
  {
    id: "lonn-utvikling",
    title: "Lønn og utvikling",
    description: "Lønn, lønnsforventninger, ansvarstillegg, karriere, forfremmelse eller utviklingsmuligheter.",
    subtopics: ["Lønnsutvikling","Forventninger til lønn","Lønnsforskjeller","Nye oppgaver og ansvar","Utvikling og forfremmelse"]
  },
  {
    id: "samarbeid-kommunikasjon",
    title: "Samarbeid og kommunikasjon",
    description: "Kommunikasjon, tillit, roller, konflikt, teamarbeid, tone, respekt eller personlige grenser.",
    subtopics: ["Kommunikasjon","Tillit","Roller og forventninger","Uenighet og konflikt","Samspill i team","Grenser og respekt"]
  },
  {
    id: "avslutning-arbeidsforhold",
    title: "Avslutning av arbeidsforhold",
    description: "Oppsigelse, prøvetid, avslutning, nedbemanning eller formell videre prosess.",
    subtopics: ["Avslutning av arbeidsforhold","Prøvetid","Endringer i stilling eller behov","Tidligere oppfølging","Frivillig avslutning","Samtale før videre prosess"]
  },
  {
    id: "sikkerhet-ansvar",
    title: "Sikkerhet og ansvar",
    description: "Sikkerhetsrutiner, risiko, avvik, hendelser, rapportering eller informasjonssikkerhet.",
    subtopics: ["Sikkerhetsrutiner","Avvik og hendelser","Risikovurdering","Rapportering","Informasjonssikkerhet","Ansvar og læring etter hendelser"]
  },
  {
    id: "livssituasjoner",
    title: "Livssituasjoner",
    description: "Personlige belastninger, familie, sorg, omsorgsansvar, psykisk belastning eller utmattelse som påvirker arbeidshverdagen.",
    subtopics: ["Samlivs- og familieforhold","Sykdom i nær familie","Sorg og tap","Psykisk belastning","Omsorgsansvar","Belastning og utmattelse"]
  }
];

const topicIds = topicCatalog.map(topic => topic.id);
const allSubtopics = [...new Set(topicCatalog.flatMap(topic => topic.subtopics))];

const topicClassificationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    primary_topic_id: { type: "string", enum: topicIds },
    primary_subtopic: { type: "string", enum: allSubtopics },
    confidence: { type: "string", enum: ["high","medium","low"] },
    reason: { type: "string" },
    alternative_topic_ids: {
      type: "array",
      maxItems: 2,
      items: { type: "string", enum: topicIds }
    }
  },
  required: ["primary_topic_id","primary_subtopic","confidence","reason","alternative_topic_ids"]
};

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

function authenticatedUserClient(accessToken) {
  return createClient(supabaseUrl, supabasePublishableKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}

const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
});

app.get("/api/auth/diagnostic", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({
    ok: true,
    appVersion,
    authRouteAvailable: true,
    supabaseUrlConfigured: Boolean(supabaseUrl),
    publishableKeyConfigured: Boolean(supabasePublishableKey),
    secretKeyConfigured: Boolean(supabaseSecretKey),
    environment: process.env.NODE_ENV || "unspecified"
  });
});

function normalizeEmail(value) { return String(value || "").trim().toLowerCase(); }
function hashInvite(code) { return crypto.createHash("sha256").update(String(code)).digest("hex"); }

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const ACCESS_COOKIE = "samtalestotte_access";
const REFRESH_COOKIE = "samtalestotte_refresh";

function parseCookies(req) {
  return Object.fromEntries(String(req.headers.cookie || "").split(";").map(v => v.trim()).filter(Boolean).map(v => {
    const i = v.indexOf("=");
    return i >= 0 ? [decodeURIComponent(v.slice(0, i)), decodeURIComponent(v.slice(i + 1))] : [v, ""];
  }));
}

function authCookie(name, value, maxAge = SESSION_MAX_AGE_SECONDS) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${name}=${encodeURIComponent(value || "")}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`;
}


const VALID_ROLES = new Set(["user", "editor", "admin"]);
const EDITABLE_CONTENT_KEY_PATTERN = /^(?:home|topic|guidance|simulation|history|settings|about|contact|privacy|terms)\.[a-z0-9._-]{1,160}$/i;

const bootstrapAdminEmails = new Set(
  String(process.env.ADMIN_EMAILS || contactEmail || "")
    .split(",")
    .map(value => normalizeEmail(value))
    .filter(Boolean)
);

function effectiveRole(user) {
  if (!user) return "user";
  if (bootstrapAdminEmails.has(normalizeEmail(user.email))) return "admin";
  const role = String(user.app_metadata?.role || "user").toLowerCase();
  return VALID_ROLES.has(role) ? role : "user";
}

async function requireAdmin(req, res, next) {
  return requireUser(req, res, () => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "ADMIN_REQUIRED", message: "Denne funksjonen krever administratorrettigheter." });
    }
    next();
  });
}

async function requireContentEditor(req, res, next) {
  return requireUser(req, res, () => {
    if (!["editor", "admin"].includes(req.user?.role || "user")) {
      return res.status(403).json({ error: "EDITOR_REQUIRED", message: "Denne funksjonen krever redaktør- eller administratorrettigheter." });
    }
    next();
  });
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.user_metadata?.username || user.email?.split("@")[0] || "Bruker",
    email: user.email,
    role: effectiveRole(user),
    createdAt: user.created_at || null
  };
}

function setSession(res, authSession) {
  if (!authSession?.access_token || !authSession?.refresh_token) {
    throw new Error("Supabase-session mangler access_token eller refresh_token.");
  }
  res.setHeader("Set-Cookie", [
    authCookie(ACCESS_COOKIE, authSession.access_token),
    authCookie(REFRESH_COOKIE, authSession.refresh_token)
  ]);
}

function clearSession(_req, res) {
  res.setHeader("Set-Cookie", [
    authCookie(ACCESS_COOKIE, "", 0),
    authCookie(REFRESH_COOKIE, "", 0),
    authCookie("samtalestotte_session", "", 0)
  ]);
}

async function resolveSession(req, res = null) {
  const cookies = parseCookies(req);
  let accessToken = cookies[ACCESS_COOKIE];
  let refreshToken = cookies[REFRESH_COOKIE];

  if (!accessToken || !refreshToken) {
    return null;
  }

  // 1) Valider access-token direkte mot Supabase. Dette er stateless og
  // overlever Render-redeploy/restart uten serverminne.
  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
  if (!userError && userData?.user) {
    return {
      userClient: authenticatedUserClient(accessToken),
      user: publicUser(userData.user),
      session: { access_token: accessToken, refresh_token: refreshToken }
    };
  }

  // 2) Access-token kan ha utløpt. Forsøk refresh-token én gang.
  try {
    const refreshClient = newUserClient();
    const { data: refreshed, error: refreshError } = await refreshClient.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (!refreshError && refreshed?.session && refreshed?.user) {
      accessToken = refreshed.session.access_token;
      refreshToken = refreshed.session.refresh_token;
      if (res) setSession(res, refreshed.session);

      return {
        userClient: authenticatedUserClient(accessToken),
        user: publicUser(refreshed.user),
        session: refreshed.session
      };
    }

    console.warn("[auth] Session kunne ikke fornyes:", refreshError?.message || userError?.message || "ukjent feil");
  } catch (refreshException) {
    console.warn("[auth] Refresh kastet feil:", refreshException?.message || refreshException);
  }

  if (res) clearSession(req, res);
  return null;
}

async function requireUser(req, res, next) {
  try {
    const cookies = parseCookies(req);
    const hasAccess = Boolean(cookies[ACCESS_COOKIE]);
    const hasRefresh = Boolean(cookies[REFRESH_COOKIE]);
    const resolved = await resolveSession(req, res);

    if (!resolved) {
      console.warn(`[auth] 401 ${req.method} ${req.path} accessCookie=${hasAccess} refreshCookie=${hasRefresh}`);
      return res.status(401).json({
        error: "AUTH_REQUIRED",
        message: "Innloggingssesjonen ble ikke godkjent. Logg inn på nytt.",
        diagnostic: { hasAccessCookie: hasAccess, hasRefreshCookie: hasRefresh }
      });
    }

    req.user = resolved.user;
    req.supabase = resolved.userClient;
    next();
  } catch (error) {
    console.error(`[auth] Feil ${req.method} ${req.path}:`, error);
    res.status(500).json({ error: "AUTH_ERROR", message: "Kunne ikke kontrollere innloggingen." });
  }
}

app.get("/api/auth/me", async (req, res) => {
  const resolved = await resolveSession(req, res);
  res.json({ user: resolved?.user || null });
});


app.get("/api/content", async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from("content_overrides")
    .select("content_key, content_value, updated_at")
    .order("content_key", { ascending: true });
  if (error) {
    const missing = /content_overrides|relation .* does not exist/i.test(String(error.message || ""));
    if (!missing) console.error("Kunne ikke hente redigerbart innhold:", error);
    return res.json({ values: {}, setupRequired: missing });
  }
  const values = Object.fromEntries((data || []).map(row => [row.content_key, row.content_value]));
  res.json({ values, setupRequired: false });
});

app.put("/api/admin/content", requireContentEditor, async (req, res) => {
  const values = req.body?.values && typeof req.body.values === "object" ? req.body.values : null;
  if (!values) return res.status(400).json({ error: "INVALID_CONTENT", message: "Mangler innhold som skal lagres." });
  const entries = Object.entries(values)
    .filter(([key]) => EDITABLE_CONTENT_KEY_PATTERN.test(String(key)))
    .map(([key, value]) => ({
      content_key: String(key),
      content_value: String(value ?? "").slice(0, 20000),
      updated_by: req.user.id,
      updated_at: new Date().toISOString()
    }));
  if (!entries.length) return res.json({ ok: true, saved: 0 });
  const { error } = await supabaseAdmin.from("content_overrides").upsert(entries, { onConflict: "content_key" });
  if (error) {
    const missing = /content_overrides|relation .* does not exist/i.test(String(error.message || ""));
    console.error("Kunne ikke lagre redigerbart innhold:", error);
    return res.status(missing ? 503 : 500).json({
      error: missing ? "CONTENT_TABLE_MISSING" : "CONTENT_SAVE_FAILED",
      message: missing ? "Kjør V20-SUPABASE-MIGRATION.sql i Supabase før innholdsredigering tas i bruk." : "Kunne ikke lagre innholdet."
    });
  }
  res.json({ ok: true, saved: entries.length });
});

app.get("/api/admin/users", requireAdmin, async (_req, res) => {
  const users = [];
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) return res.status(500).json({ error: "USER_LIST_FAILED", message: "Kunne ikke hente brukere." });
    const pageUsers = data?.users || [];
    users.push(...pageUsers.map(user => publicUser(user)));
    if (pageUsers.length < 100) break;
  }
  res.json({ users });
});

app.patch("/api/admin/users/:id/role", requireAdmin, async (req, res) => {
  const targetId = String(req.params.id || "");
  const role = String(req.body?.role || "").toLowerCase();
  if (!VALID_ROLES.has(role)) return res.status(400).json({ error: "INVALID_ROLE", message: "Ugyldig rolle." });
  if (targetId === req.user.id) return res.status(400).json({ error: "SELF_ROLE_CHANGE", message: "Du kan ikke endre din egen rolle her." });
  const { data: targetData, error: targetError } = await supabaseAdmin.auth.admin.getUserById(targetId);
  if (targetError || !targetData?.user) return res.status(404).json({ error: "USER_NOT_FOUND", message: "Fant ikke brukeren." });
  if (bootstrapAdminEmails.has(normalizeEmail(targetData.user.email)) && role !== "admin") {
    return res.status(400).json({ error: "BOOTSTRAP_ADMIN", message: "Denne administratoren er definert som hovedadministrator og kan ikke nedgraderes her." });
  }
  const appMetadata = { ...(targetData.user.app_metadata || {}), role };
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(targetId, { app_metadata: appMetadata });
  if (error || !data?.user) return res.status(500).json({ error: "ROLE_UPDATE_FAILED", message: "Kunne ikke oppdatere rollen." });
  res.json({ user: publicUser(data.user) });
});

app.post("/api/ai-feedback", requireUser, async (req, res) => {
  const category = String(req.body?.category || "Annet").slice(0, 80);
  const comment = String(req.body?.comment || "").trim().slice(0, 2000);
  const surface = String(req.body?.surface || "general").slice(0, 80);
  const includeConversation = Boolean(req.body?.includeConversation);
  const conversationSnapshot = includeConversation && req.body?.conversationSnapshot && typeof req.body.conversationSnapshot === 'object' ? req.body.conversationSnapshot : null;
  if (comment.length < 3) return res.status(400).json({ error:"COMMENT_REQUIRED", message:"Skriv kort hva som var problemet." });
  if (serverPrivacyFindings(comment).length) return res.status(400).json({ error:"PRIVACY_REVIEW_REQUIRED", message:"Fjern tydelige personopplysninger fra tilbakemeldingen." });
  if (conversationSnapshot) {
    const snapshotText = flattenTextValues(conversationSnapshot).join(' ');
    if (serverPrivacyFindings(snapshotText).length) return res.status(400).json({ error:'PRIVACY_REVIEW_REQUIRED', message:'Samtalen inneholder opplysninger som må anonymiseres før den kan legges ved.' });
    if (JSON.stringify(conversationSnapshot).length > 50000) return res.status(413).json({error:'SNAPSHOT_TOO_LARGE',message:'Samtalen er for lang til å legges ved.'});
  }
  const row = { user_id:req.user.id, category, comment, surface, conversation_id:req.body?.conversationId || null, topic_id:String(req.body?.topicId || '').slice(0,100) || null, subtopic:String(req.body?.subtopic || '').slice(0,200) || null, include_conversation:includeConversation, conversation_snapshot:conversationSnapshot };
  const { error } = await supabaseAdmin.from('ai_response_feedback').insert(row);
  if (error) { const missing=/ai_response_feedback|conversation_snapshot|include_conversation|relation .* does not exist/i.test(String(error.message||'')); return res.status(missing?503:500).json({error:missing?'FEEDBACK_TABLE_MISSING':'FEEDBACK_SAVE_FAILED',message:missing?'Kjør V20-2-SUPABASE-MIGRATION.sql i Supabase først.':'Kunne ikke lagre tilbakemeldingen.'}); }
  res.json({ok:true});
});

app.get("/api/admin/ai-feedback", requireAdmin, async (_req,res)=>{
  const { data,error }=await supabaseAdmin.from('ai_response_feedback').select('id,category,comment,surface,include_conversation,conversation_snapshot,created_at').order('created_at',{ascending:false}).limit(100);
  if(error){const missing=/ai_response_feedback|relation .* does not exist/i.test(String(error.message||''));return res.status(missing?503:500).json({error:'FEEDBACK_LOAD_FAILED',message:missing?'Kjør V20-2-SUPABASE-MIGRATION.sql i Supabase først.':'Kunne ikke hente tilbakemeldinger.'});}
  res.json({items:data||[]});
});

app.get('/api/admin/ai-settings', requireAdmin, async (_req,res)=>{
  const activeModel = await getActiveModel();
  res.json({ activeModel, models:Object.entries(AI_MODELS).map(([id,meta])=>({id,...meta})) });
});

app.put('/api/admin/ai-settings', requireAdmin, async (req,res)=>{
  const modelId = String(req.body?.model || '');
  if (!AI_MODELS[modelId]) return res.status(400).json({error:'INVALID_MODEL',message:'Ugyldig KI-modell.'});
  const { error } = await supabaseAdmin.from('app_settings').upsert({ key:'ai_model', value:{model:modelId}, updated_at:new Date().toISOString(), updated_by:req.user.id });
  if (error) return res.status(500).json({error:'MODEL_SAVE_FAILED',message:'Kunne ikke lagre modellvalget. Kjør V20-2-SUPABASE-MIGRATION.sql først.'});
  activeModelCache={value:modelId,expiresAt:Date.now()+30000};
  res.json({ok:true,activeModel:modelId});
});

app.get('/api/admin/ai-usage', requireAdmin, async (_req,res)=>{
  const since = new Date(Date.now()-30*24*60*60*1000).toISOString();
  const { data,error }=await supabaseAdmin.from('ai_usage_log').select('function_name,model,input_tokens,output_tokens,total_tokens,estimated_cost_usd,web_search_used,web_search_queries,source_domains,created_at').gte('created_at',since).order('created_at',{ascending:false}).limit(2000);
  if(error) return res.status(500).json({error:'USAGE_LOAD_FAILED',message:'Kunne ikke hente KI-bruk. Kjør V20-2-SUPABASE-MIGRATION.sql først.'});
  const rows=data||[];
  const now=Date.now();
  const sumDays=d=>rows.filter(r=>new Date(r.created_at).getTime()>=now-d*86400000).reduce((a,r)=>a+Number(r.estimated_cost_usd||0),0);
  const domainCounts={}; const queryCounts={};
  for(const r of rows){ for(const d of r.source_domains||[]) domainCounts[d]=(domainCounts[d]||0)+1; for(const q of r.web_search_queries||[]) queryCounts[q]=(queryCounts[q]||0)+1; }
  const top=(obj,n=12)=>Object.entries(obj).sort((a,b)=>b[1]-a[1]).slice(0,n).map(([name,count])=>({name,count}));
  res.json({summary:{cost24h:sumDays(1),cost7d:sumDays(7),cost30d:sumDays(30),calls30d:rows.length,webSearchCalls30d:rows.filter(r=>r.web_search_used).length},recent:rows.slice(0,100),topDomains:top(domainCounts),topQueries:top(queryCounts)});
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

  setSession(res, signedIn.session);
  res.status(201).json({ user: publicUser(signedIn.user) });
});

app.post("/api/auth/login", async (req, res) => {
  const requestId = crypto.randomBytes(5).toString("hex");
  res.setHeader("X-Debug-Request-Id", requestId);
  res.setHeader("Cache-Control", "no-store");
  const identifier = String(req.body?.identifier || req.body?.email || "").trim();
  const password = String(req.body?.password || "");
  const idType = identifier.includes("@") ? "email" : "username";
  console.log(`[auth-debug ${requestId}] login received type=${idType} identifierLength=${identifier.length}`);
  if (!identifier || !password) {
    console.log(`[auth-debug ${requestId}] stopped: missing fields`);
    return res.status(400).json({ error: "MISSING_LOGIN", message: "Skriv inn e-post eller brukernavn og passord.", debugStage: "request-validation" });
  }

  let email = identifier.includes("@") ? normalizeEmail(identifier) : "";
  if (!email) {
    const wanted = identifier.toLocaleLowerCase("nb-NO");
    try {
      for (let page = 1; page <= 10 && !email; page += 1) {
        const { data: listed, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 100 });
        if (listError) throw listError;
        const users = listed?.users || [];
        const match = users.find(user => String(user.user_metadata?.username || "").trim().toLocaleLowerCase("nb-NO") === wanted);
        if (match?.email) email = normalizeEmail(match.email);
        if (users.length < 100) break;
      }
      console.log(`[auth-debug ${requestId}] username lookup ${email ? "matched" : "no-match"}`);
    } catch (lookupError) {
      console.error(`[auth-debug ${requestId}] username lookup failed:`, lookupError?.message || lookupError);
      return res.status(500).json({ error: "USERNAME_LOOKUP_FAILED", message: "Kunne ikke slå opp brukernavnet akkurat nå.", debugStage: "username-lookup" });
    }
  }

  if (!email) {
    console.log(`[auth-debug ${requestId}] stopped: no matching email`);
    return res.status(401).json({ error: "INVALID_LOGIN", message: "Feil e-post/brukernavn eller passord.", debugStage: "identifier-resolution" });
  }
  console.log(`[auth-debug ${requestId}] identifier resolved; contacting Supabase Auth`);
  const authClient = newUserClient();
  const { data, error } = await authClient.auth.signInWithPassword({ email, password });
  if (error || !data.session || !data.user) {
    console.log(`[auth-debug ${requestId}] Supabase sign-in rejected: ${error?.message || "missing session/user"}`);
    return res.status(401).json({ error: "INVALID_LOGIN", message: "Feil e-post/brukernavn eller passord.", debugStage: "supabase-sign-in" });
  }
  console.log(`[auth-debug ${requestId}] Supabase sign-in OK; creating app session`);
  setSession(res, data.session);
  console.log(`[auth-debug ${requestId}] app session created`);
  res.json({ user: publicUser(data.user), debugStage: "complete" });
});


const passwordResetAttempts = new Map();

app.post("/api/auth/password-reset-request", async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: "INVALID_EMAIL", message: "Skriv inn en gyldig e-postadresse." });
  }

  // Enkel brems mot gjentatt utsending. Svaret avslører aldri om kontoen finnes.
  const throttleKey = crypto.createHash("sha256").update(`${req.ip}|${email}`).digest("hex");
  const last = passwordResetAttempts.get(throttleKey) || 0;
  if (Date.now() - last < 60_000) {
    return res.json({ ok: true });
  }
  passwordResetAttempts.set(throttleKey, Date.now());

  const baseUrl = String(process.env.APP_BASE_URL || `${req.protocol}://${req.get("host")}`).replace(/\/+$/, "");
  const authClient = newUserClient();
  const { error } = await authClient.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/?password-reset=1`
  });

  if (error) {
    console.error("Passordreset-feil:", error.message || error);
    // Generisk svar for å unngå kontooppslag via endepunktet.
  }
  res.json({ ok: true });
});

app.post("/api/auth/password-reset-complete", async (req, res) => {
  const accessToken = String(req.body?.accessToken || "");
  const refreshToken = String(req.body?.refreshToken || "");
  const password = String(req.body?.password || "");

  if (password.length < 10) {
    return res.status(400).json({ error: "WEAK_PASSWORD", message: "Passordet må ha minst 10 tegn." });
  }
  if (!accessToken || !refreshToken) {
    return res.status(400).json({ error: "RESET_TOKEN_MISSING", message: "Tilbakestillingslenken mangler eller er utløpt." });
  }

  const authClient = newUserClient();
  const { data: sessionData, error: sessionError } = await authClient.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  });
  if (sessionError || !sessionData?.session || !sessionData?.user) {
    return res.status(401).json({ error: "RESET_TOKEN_INVALID", message: "Tilbakestillingslenken er ugyldig eller utløpt. Be om en ny lenke." });
  }

  const { data: updated, error: updateError } = await authClient.auth.updateUser({ password });
  if (updateError || !updated?.user) {
    console.error("Kunne ikke oppdatere passord:", updateError);
    return res.status(500).json({ error: "PASSWORD_UPDATE_FAILED", message: "Kunne ikke endre passordet. Prøv igjen." });
  }

  // Hent den eventuelt roterte sessionen og behold brukeren innlogget.
  const { data: refreshed } = await authClient.auth.getSession();
  const finalSession = refreshed?.session || sessionData.session;
  setSession(res, finalSession);
  res.json({ ok: true, user: publicUser(updated.user) });
});

app.post("/api/auth/logout", async (req, res) => {
  const resolved = await resolveSession(req, res);
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



function serverPrivacyFindings(text) {
  const source = String(text || "");
  const findings = [];
  const add = (type, message) => { if (!findings.some(item => item.type === type)) findings.push({ type, message }); };
  if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(source)) add("email", "Fjern e-postadresse.");
  if (/(?:\+47\s?)?(?:\d[\s-]?){8}\b/.test(source)) add("phone", "Fjern telefonnummer.");
  if (/\b\d{11}\b/.test(source) || /\b(?:fødselsnummer|personnummer|ansattnummer|ansattnr\.?)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/i.test(source)) add("identifier", "Fjern identifikasjonsnummer.");
  if (/\b(?:han|hun|ham|henne|hans|hennes)\b/i.test(source)) add("gendered_language", "Bruk kjønnsnøytral formulering, for eksempel «hen» eller «medarbeideren».");
  return findings;
}

function blockUnsafeAiText(res, texts) {
  const findings = (Array.isArray(texts) ? texts : [texts]).flatMap(serverPrivacyFindings);
  const unique = findings.filter((item, index, all) => all.findIndex(other => other.type === item.type) === index);
  if (!unique.length) return false;
  res.status(400).json({ error: "PRIVACY_REVIEW_REQUIRED", message: "Teksten må gjennom personvernsjekken før den kan sendes til KI.", findings: unique });
  return true;
}

function flattenTextValues(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flattenTextValues);
  if (value && typeof value === "object") return Object.values(value).flatMap(flattenTextValues);
  return [];
}

function leaderTurnTexts(turns) {
  if (!Array.isArray(turns)) return [];
  return turns
    .filter(turn => turn?.role === "leader")
    .map(turn => String(turn?.text || ""));
}

app.post("/api/classify-topic", requireUser, async (req, res) => {
  if (!client) {
    return res.status(503).json({ error: "AI_NOT_CONFIGURED", message: "OPENAI_API_KEY mangler på serveren." });
  }

  const situation = String(req.body?.situation || "").trim();
  const selectedTopicId = String(req.body?.selectedTopicId || "").trim();

  if (situation.length < 4) {
    return res.status(400).json({ error: "MISSING_SITUATION", message: "Beskriv situasjonen litt mer før tema foreslås." });
  }
  if (blockUnsafeAiText(res, situation)) return;

  const catalogText = topicCatalog.map(topic =>
    `- ${topic.id} | ${topic.title}: ${topic.description}\n  Undertemaer: ${topic.subtopics.join(" | ")}`
  ).join("\n");

  const classificationInstructions = `Du klassifiserer en kort arbeidslivssituasjon til Samtalestøttes temaer.
Velg ut fra MENINGEN i hele situasjonen, ikke enkeltord.

Viktige regler:
- Ikke gjett alkohol/rus uten at teksten faktisk omtaler alkohol, rusmiddel, påvirkning eller en tydelig rusbekymring.
- Vanlig privat nettbruk, mye surfing, sosiale medier, telefonbruk, lav arbeidsinnsats, manglende prioritering eller tidsbruk i arbeidstiden hører normalt under "prestasjon-utvikling", med mindre teksten eksplisitt beskriver et sikkerhetsbrudd.
- Ikke velg "sikkerhet-ansvar" bare fordi internett, data eller telefon nevnes. Det krever et faktisk sikkerhets-, risiko-, tilgangs- eller informasjonsproblem.
- Ikke diagnostiser eller utled skjulte årsaker.
- Bruk friteksten som hovedkilde. Et eventuelt allerede valgt tema er bare et svakt hint og skal overstyres dersom teksten passer bedre et annet sted.
- Velg et undertema som faktisk finnes under det valgte hovedtemaet.
- confidence=high når ett tema er klart mest naturlig, medium når to temaer er plausible, low når teksten er for vag.
- reason skal være én kort setning på norsk uten å gjenta sensitive detaljer.

Temaer:
${catalogText}

Allerede valgt tema-id: ${selectedTopicId || "ingen"}`;

  try {
    const response = await createTrackedResponse({
      _functionName:'tema', _userId:req.user.id,
      instructions: classificationInstructions,
      input: [{ role: "user", content: [{ type: "input_text", text: situation }] }],
      text: {
        format: {
          type: "json_schema",
          name: "samtalestotte_temaforstaelse",
          strict: true,
          schema: topicClassificationSchema
        }
      }
    });

    const parsed = JSON.parse(response.output_text);
    const topic = topicCatalog.find(item => item.id === parsed.primary_topic_id);
    if (!topic || !topic.subtopics.includes(parsed.primary_subtopic)) {
      throw new Error("KI returnerte en ugyldig tema/undertema-kombinasjon.");
    }

    return res.json({ ...parsed, ai: true, model: responseModel(response) });
  } catch (error) {
    console.error("OpenAI topic classification failed:", error);
    const status = Number(error?.status) || 500;
    return res.status(status >= 400 && status < 600 ? status : 500).json({
      error: "AI_TOPIC_CLASSIFICATION_FAILED",
      message: "KI-temaforslaget kunne ikke gjennomføres.",
      diagnostic: { status, apiMessage: error?.message || "Ukjent feil", model: error.samtalestotteModel || defaultModel }
    });
  }
});


app.get("/api/status", async (_req, res) => {
  res.json({ aiConfigured: Boolean(client), model: client ? await getActiveModel() : null });
});

app.post("/api/analyze-situation", requireUser, async (req, res) => {
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
  if (blockUnsafeAiText(res, [situation, helpRequest])) return;

  const task = `\n\n## Oppgave i denne forespørselen\nAnalyser situasjonen som samtalepartner, ikke som HR-klassifiserer.\n- Gjengi bare fakta som faktisk står i brukerens tekst.\n- Identifiser det menneskelige/praktiske dilemmaet, ikke bare en kategori.\n- Relevante temaer er kun metadata og skal være maks to.\n- Still bare avklaringsspørsmål dersom svarene kan endre rådet vesentlig.\n- Lag korte klikkbare svaralternativer som dekker sannsynlige svar uten å påstå at de er sanne.
- Sett multi_select=true når flere svaralternativer realistisk kan være sanne samtidig eller brukeren kan trenge hjelp med flere ting. Bruk false når alternativene faktisk utelukker hverandre.\n- Spør aldri om diagnose eller unødvendige sensitive opplysninger.\n- Hvis valgt tema/undertema ikke passer teksten, skal friteksten veie tyngst.\n\nValgt tema i grensesnittet: ${selectedTopic || "ikke oppgitt"}\nValgt undertema: ${selectedSubtopic || "ikke oppgitt"}\nHva brukeren ønsker hjelp til: ${helpRequest || "ikke oppgitt"}\n`;

  try {
    const response = await createTrackedResponse({
      _functionName:'analyse', _userId:req.user.id,
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
    return res.json({ ...parsed, ai: true, model: responseModel(response) });
  } catch (error) {
    console.error("OpenAI analysis failed:", error);
    const status = Number(error?.status) || 500;
    const code = error?.code || error?.error?.code || null;
    const type = error?.type || error?.error?.type || null;
    const rawMessage = error?.message || error?.error?.message || "Ukjent feil fra OpenAI API.";

    let hint = "Se PowerShell-vinduet for detaljer.";
    if (status === 401) hint = "API-nøkkelen ble avvist. Kontroller OPENAI_API_KEY i .env.";
    else if (status === 403) hint = "API-nøkkelen mangler nødvendig tilgang til Responses API eller modellen.";
    else if (status === 404) hint = `Modellen ${error.samtalestotteModel || defaultModel} er ikke tilgjengelig for dette prosjektet, eller modellnavnet er feil.`;
    else if (status === 429) hint = "API-prosjektet har nådd en bruks-/betalingsgrense eller mangler tilgjengelig kreditt.";

    return res.status(status >= 400 && status < 600 ? status : 500).json({
      error: "AI_ANALYSIS_FAILED",
      message: "KI-analysen feilet.",
      diagnostic: { status, code, type, apiMessage: rawMessage, model: error.samtalestotteModel || defaultModel, hint }
    });
  }
});


app.post("/api/generate-guidance", requireUser, async (req, res) => {
  if (!client) {
    return res.status(503).json({ error: "AI_NOT_CONFIGURED", message: "OPENAI_API_KEY mangler på serveren." });
  }

  const { situation, analysis = null, followups = {}, topicId = "", subtopic = "" } = req.body || {};
  if (typeof situation !== "string" || !situation.trim()) {
    return res.status(400).json({ error: "MISSING_SITUATION", message: "Situasjonsbeskrivelse mangler." });
  }
  if (blockUnsafeAiText(res, [situation, ...flattenTextValues(followups)])) return;

  const relevantSources = selectRelevantSources(analysis, situation);
  const guidanceTask = `\n\n## Oppgave: lag konkret samtalestøtte\nDu skal nå lage selve samtalestøtten til akkurat denne saken. Ikke bruk standardråd som kunne passet enhver leder.\n- Bruk brukerens situasjon, situasjonsanalysen og avklaringssvarene som én samlet kontekst.\n- Åpningen skal kunne sies høyt i denne konkrete samtalen.\n- Spørsmålene skal være få og målrettede; hvert spørsmål må ha en tydelig funksjon i akkurat saken.\n- Foreslå 2–4 plausible reaksjoner som er SPESIFIKKE for det som står på spill. Ikke bruk generelle følelseskategorier med mindre konteksten faktisk gjør dem relevante.\n- For hver reaksjon: forklar kort hvorfor den er plausibel og hvordan lederen kan møte den. Ikke påstå at medarbeideren vil reagere slik.\n- Skill mellom hva lederen bør AVKLARE før møtet og hva lederen bør SI i møtet.\n- Ikke be om diagnose eller medisinske detaljer.\n- Ikke dikt opp virksomhetens regler, fakta, forskning eller rettsregler.\n- Bruk den kuraterte fagbanken som førstevalg og kvalitetsanker. Vanlige samtaleråd trenger ikke kilde. Kritiske, rettslige eller tydelig faglige råd bør støttes av relevante kilder.\n- source_ids må kun inneholde ID-er fra den oppgitte fagbanken. Velg 1–4 presise kilder når de faktisk passer.\n- Fagbanken er IKKE en lukket liste. Dersom saken trenger en mer presis, nyere eller manglende kilde, kan du bruke nettsøk og supplere med inntil 2 kilder. Prioriter norsk lov/myndighet, anerkjente fagmiljøer, systematiske oversikter/meta-analyser og fagfellevurdert forskning. Unngå blogger, markedsføring og tilfeldige rådssider.\n- supplementary_sources skal bare inneholde kilder du faktisk har funnet og brukt gjennom nettsøk. Ikke konstruer titler, forfattere eller lenker. Bruk tom liste hvis fagbanken er tilstrekkelig.\n- Ved juridisk sensitivitet: prioriter gjeldende norsk lov/myndighetskilde og anbefal HR/juridisk kvalitetssikring når nødvendig, uten å konkludere definitivt.\n\nSituasjonsanalyse fra første KI-steg: ${JSON.stringify(analysis || {})}\nAvklaringssvar: ${JSON.stringify(followups || {})}\n\n## Relevante, kvalitetssikrede kilder i fagbanken\n${JSON.stringify(relevantSources)}\n`;

  try {
    const response = await createTrackedResponse({
      _functionName:'veiledning', _userId:req.user.id,
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
    return res.json({ ...parsed, evidence_sources: [...curated, ...supplementary], ai: true, model: responseModel(response) });
  } catch (error) {
    console.error("OpenAI guidance failed:", error);
    const status = Number(error?.status) || 500;
    const code = error?.code || error?.error?.code || null;
    const rawMessage = error?.message || error?.error?.message || "Ukjent feil fra OpenAI API.";
    return res.status(status >= 400 && status < 600 ? status : 500).json({
      error: "AI_GUIDANCE_FAILED", message: "KI-samtalestøtten feilet.",
      diagnostic: { status, code, apiMessage: rawMessage, model: error.samtalestotteModel || defaultModel }
    });
  }
});


app.post("/api/continue-conversation", requireUser, async (req, res) => {
  if (!client) {
    return res.status(503).json({ error: "AI_NOT_CONFIGURED", message: "OPENAI_API_KEY mangler på serveren." });
  }
  const { situation, analysis = null, followups = {}, guidance = null, question = "" } = req.body || {};
  if (typeof question !== "string" || !question.trim()) {
    return res.status(400).json({ error: "MISSING_QUESTION", message: "Oppfølgingsspørsmål mangler." });
  }
  if (blockUnsafeAiText(res, [situation, question, ...flattenTextValues(followups)])) return;
  const relevantSources = selectRelevantSources(analysis, situation);
  const continueTask = `\n\n## Oppgave: svar på oppfølgingsspørsmål i samme sak\nSvar som en konkret samtalepartner. Bruk samme situasjon, analyse, avklaringssvar og tidligere KI-råd.\n- Svar direkte på det brukeren spør om.\n- Unngå generelle standardråd hvis du kan være mer konkret ut fra saken.\n- Ikke dikt opp fakta, motiv eller virksomhetsregler.\n- Ved juridisk sensitivitet: pek på relevant kontrollpunkt og anbefal HR/juridisk kvalitetssikring, uten å konkludere definitivt.\n- Ikke be om diagnose eller unødvendige sensitive opplysninger.\n- Bruk fagbanken som førstevalg. Dersom spørsmålet krever oppdatert eller mer presis faglig dokumentasjon enn banken dekker, kan du bruke nettsøk. Prioriter myndigheter, anerkjente fagmiljøer og fagfellevurdert forskning.\n- Hold svaret kort, direkte og situasjonsnært.
- Svar på akkurat spørsmålet som ble stilt; ikke skriv hovedveiledningen på nytt.
- Sikt mot ca. 90–160 ord. Gå bare over dette når det er nødvendig av sikkerhets- eller juridiske grunner.
- Bruk maksimalt 4 korte avsnitt eller 3 korte punkter.
- Gi høyst 1–2 konkrete formuleringseksempler.
- Ikke bruk nummererte mini-kapitler med mindre brukeren uttrykkelig ber om en stegvis gjennomgang.
- Ikke gjenta risikovarsler, HR-råd eller sikkerhetsforbehold som allerede er gitt, med mindre de er direkte relevante for oppfølgingsspørsmålet.\n\nSituasjon: ${situation || ""}\nAnalyse: ${JSON.stringify(analysis || {})}\nAvklaringssvar: ${JSON.stringify(followups || {})}\nTidligere råd: ${JSON.stringify(guidance || {})}\nRelevante kilder i fagbanken: ${JSON.stringify(relevantSources)}\n`;
  try {
    const response = await createTrackedResponse({
      _functionName:'oppfolging', _userId:req.user.id,
      tools: [{ type: "web_search", search_context_size: "low" }],
      instructions: systemPrompt + continueTask,
      input: [{ role: "user", content: [{ type: "input_text", text: question.trim() }] }]
    });
    return res.json({ reply: response.output_text, ai: true, model: responseModel(response) });
  } catch (error) {
    console.error("OpenAI continuation failed:", error);
    const status = Number(error?.status) || 500;
    const code = error?.code || error?.error?.code || null;
    const rawMessage = error?.message || error?.error?.message || "Ukjent feil fra OpenAI API.";
    return res.status(status >= 400 && status < 600 ? status : 500).json({
      error: "AI_CONTINUATION_FAILED", message: "KI-oppfølgingen feilet.",
      diagnostic: { status, code, apiMessage: rawMessage, model: error.samtalestotteModel || defaultModel }
    });
  }
});


const simulationStyleInstructions = {
  open: 'Medarbeideren er i utgangspunktet åpen, saklig og samarbeidsvillig, men skal fortsatt ha egne perspektiver og kunne stille spørsmål.',
  uncertain: 'Medarbeideren er usikker og noe tilbaketrukket. Tillat korte svar, nøling, forsiktige formuleringer og behov for tid. Ikke gjør personen kunstig vag.',
  defensive: 'Medarbeideren er defensiv og kan være uenig i lederens beskrivelse eller vurdering. Reager realistisk uten å bli karikert eller aggressiv uten grunnlag.',
  emotional: 'Medarbeideren er tydelig følelsesmessig berørt. La reaksjonen merkes i ordvalg, pauser, nøling, kortere setninger eller vansker med å konkretisere. Svarene skal ikke høres ut som ferdigpolerte refleksjoner eller gå for raskt over i ryddig problemløsning. Ikke gjør personen melodramatisk og ikke dikt opp årsaken til følelsene.',
  critical: 'Medarbeideren er frustrert eller kritisk og kan utfordre lederens vurdering, prosess eller formuleringer. Hold reaksjonen realistisk og saklig nok til at øvelsen er nyttig.',
  surprise: 'Gi en tydelig uventet, men plausibel reaksjon som faktisk endrer hva lederen må forholde seg til i neste replikk. Ikke bruk standardsvar om uklare forventninger eller vanlig samarbeidsvilje med mindre samtalen gjør det genuint overraskende. Varier mellom for eksempel et direkte vanskelig spørsmål tilbake, uventet sterk enighet, kort avvisning, taushet/nøling, en annen problemforståelse eller – i fri modus – en relevant ny opplysning. I faktamodus skal overraskelsen ligge i reaksjonen eller perspektivet, ikke i nye fakta.'
};

const simulationFidelityInstructions = {
  factual: `FAKTABASERT MODUS – «Hold deg til saken»:
- Du kan improvisere følelser, holdninger, uenighet, spørsmål, motstand, usikkerhet og måten medarbeideren uttrykker seg på.
- Du skal IKKE etablere nye verifiserbare fakta som ikke finnes i situasjonen eller tidligere dialog.
- Dette gjelder også tilsynelatende små fakta som «jeg har ikke drukket mer», «vi kommuniserer det vi må», «jeg fikk beskjed forrige uke» eller «jeg har vært mer kort i tonen», dersom dette ikke allerede er oppgitt.
- Når lederen spør om noe som ikke er oppgitt, reager som en medarbeider uten å gjøre et ukjent forhold til et sikkert ja/nei-faktum. Du kan spørre hvorfor lederen spør, avvise premisset, si at du ikke ønsker å gå inn i det, eller formulere deg eksplisitt som en opplevelse når det er naturlig.
- Ikke bruk oppdiktede detaljer som forklaring på følelser eller motstand.`,
  challenge: `FRI TRENINGSMODUS – «Utfordre meg»:
- Du kan introdusere nye, plausible opplysninger, hendelser eller perspektiver for å skape realistiske overraskelser og trene lederen på å håndtere ukjent informasjon.
- Nye opplysninger må være saklig relevante, troverdige og proporsjonale. Ikke lag sensasjonelle eller ekstreme vendinger uten grunn.
- Ikke finn på diagnose, detaljerte familieforhold, ulovlig aktivitet, alvorlige anklager eller andre svært sensitive forhold bare for å gjøre øvelsen vanskeligere, med mindre saken allerede åpner for dette på en tydelig måte.
- Ikke motsi etablerte fakta i saken.
- Opplysninger du finner på er kun simulerte rollespillfakta. De skal aldri presenteres som kjente fakta om den virkelige saken utenfor simulatoren.`
};

function sanitizeSimulationTurns(turns) {
  if (!Array.isArray(turns)) return [];
  return turns.slice(-24).map(turn => ({
    role: turn?.role === 'employee' ? 'employee' : 'leader',
    text: String(turn?.text || '').trim().slice(0, 4000)
  })).filter(turn => turn.text);
}

function simulationContextText({ situation = '', analysis = null, followups = {}, guidance = null, fidelity = 'factual', style = 'open', turns = [] }) {
  return `\n\n## Samtalesimulering\nDu spiller KUN medarbeideren i en øvelse for en leder. Brukeren spiller lederen.\n\nViktige grenser:\n- Ikke gi råd til lederen mens du spiller medarbeideren.\n- Ikke fortell hva lederen bør gjøre. Svar bare slik medarbeideren plausibelt kunne svart.\n- Ikke gjør tredjepartsopplysninger om til egne observasjoner.\n- Hold hvert medarbeidersvar naturlig og relativt kort, vanligvis 1–4 setninger.\n- Reaksjonen skal utvikle seg ut fra det lederen faktisk sier, ikke låses mekanisk til én tone.\n- Hold rollespillfakta og den virkelige saken strengt adskilt.\n\nValgt simuleringsmodus: ${fidelity}. ${simulationFidelityInstructions[fidelity] || simulationFidelityInstructions.factual}\n\nValgt reaksjonsstil: ${style}. ${simulationStyleInstructions[style] || simulationStyleInstructions.open}\n\nSituasjon: ${String(situation).slice(0, 12000)}\nAnalyse: ${JSON.stringify(analysis || {})}\nAvklaringssvar: ${JSON.stringify(followups || {})}\nTidligere råd: ${JSON.stringify(guidance || {})}\nSamtalen så langt: ${JSON.stringify(sanitizeSimulationTurns(turns))}\n`;
}

app.post('/api/simulation-turn', requireUser, async (req, res) => {
  if (!client) return res.status(503).json({ error: 'AI_NOT_CONFIGURED', message: 'OPENAI_API_KEY mangler på serveren.' });
  const body = req.body || {};
  const turns = sanitizeSimulationTurns(body.turns);
  if (!turns.length || turns[turns.length - 1].role !== 'leader') {
    return res.status(400).json({ error: 'MISSING_LEADER_TURN', message: 'Skriv først hva du vil si som leder.' });
  }
  const style = Object.prototype.hasOwnProperty.call(simulationStyleInstructions, body.style) ? body.style : 'open';
  const fidelity = Object.prototype.hasOwnProperty.call(simulationFidelityInstructions, body.fidelity) ? body.fidelity : 'factual';
  if (blockUnsafeAiText(res, [body.situation, ...flattenTextValues(body.followups), ...leaderTurnTexts(turns)])) return;
  try {
    const response = await createTrackedResponse({
      _functionName:'simulering', _userId:req.user.id,
      instructions: systemPrompt + simulationContextText({ ...body, fidelity, style, turns }),
      input: [{ role: 'user', content: [{ type: 'input_text', text: 'Svar nå som medarbeideren på lederens siste utsagn. Ikke kommenter øvelsen eller gi lederråd.' }] }]
    });
    res.json({ reply: String(response.output_text || '').trim(), ai: true, model: responseModel(response) });
  } catch (error) {
    console.error('Simulation turn failed:', error);
    const status = Number(error?.status) || 500;
    res.status(status >= 400 && status < 600 ? status : 500).json({ error: 'SIMULATION_FAILED', message: 'Samtalesimuleringen feilet.' });
  }
});

app.post('/api/simulation-help', requireUser, async (req, res) => {
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
  if (blockUnsafeAiText(res, [body.situation, ...flattenTextValues(body.followups), ...leaderTurnTexts(turns)])) return;
  const prompt = `Du er nå trener, IKKE medarbeider. ${task}\nBruk bare opplysninger som finnes i saken og samtalen. Ikke dikt opp fakta. Ikke gi en lang forklaring. Maks 80 ord.\n\nSituasjon: ${String(body.situation || '').slice(0,12000)}\nAnalyse: ${JSON.stringify(body.analysis || {})}\nTidligere råd: ${JSON.stringify(body.guidance || {})}\nSamtalen så langt: ${JSON.stringify(turns)}`;
  try {
    const response = await createTrackedResponse({
      _functionName:'simulator-hjelp', _userId:req.user.id, instructions: systemPrompt, input: [{ role: 'user', content: [{ type: 'input_text', text: prompt }] }] });
    res.json({ help: String(response.output_text || '').trim(), ai: true, model: responseModel(response) });
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

app.post('/api/simulation-feedback', requireUser, async (req, res) => {
  if (!client) return res.status(503).json({ error: 'AI_NOT_CONFIGURED', message: 'OPENAI_API_KEY mangler på serveren.' });
  const body = req.body || {};
  const turns = sanitizeSimulationTurns(body.turns);
  if (!turns.some(turn => turn.role === 'leader')) return res.status(400).json({ error: 'EMPTY_SIMULATION', message: 'Øvelsen har ingen lederutsagn å vurdere.' });
  if (blockUnsafeAiText(res, [body.situation, ...flattenTextValues(body.followups), ...leaderTurnTexts(turns)])) return;
  const task = `\n\n## Oppgave: tilbakemelding etter samtaleøvelse\nDu er trener, ikke medarbeider. Vurder KUN det lederen faktisk sa i transkriptet.\n- Ingen poengsum, karakter eller rangering.\n- Pek på konkrete formuleringer eller grep som fungerte godt.\n- Pek på konkrete steder som kunne vært tydeligere, mer åpne eller mer presise.\n- Ikke anta lederens intensjon utover ordene som står der.\n- Ikke finn på fakta om medarbeideren.\n- Gi én alternativ formulering som passer saken.\n- Avslutt med ett kort læringspunkt.\n\nSituasjon: ${String(body.situation || '').slice(0,12000)}\nAnalyse: ${JSON.stringify(body.analysis || {})}\nTidligere råd: ${JSON.stringify(body.guidance || {})}\nTranskript: ${JSON.stringify(turns)}`;
  try {
    const response = await createTrackedResponse({
      _functionName:'simulator-tilbakemelding', _userId:req.user.id,
      instructions: systemPrompt + task,
      input: [{ role: 'user', content: [{ type: 'input_text', text: 'Gi strukturert tilbakemelding på øvelsen.' }] }],
      text: { format: { type: 'json_schema', name: 'samtalesimulering_tilbakemelding', strict: true, schema: simulationFeedbackSchema } }
    });
    res.json({ ...JSON.parse(response.output_text), ai: true, model: responseModel(response) });
  } catch (error) {
    console.error('Simulation feedback failed:', error);
    const status = Number(error?.status) || 500;
    res.status(status >= 400 && status < 600 ? status : 500).json({ error: 'SIMULATION_FEEDBACK_FAILED', message: 'Tilbakemeldingen feilet.' });
  }
});

app.listen(port, () => {
  console.log(`Samtalestøtte kjører på http://localhost:${port}`);
  console.log(client ? `KI aktivert (standard ${defaultModel}; admin kan overstyre)` : "KI er ikke aktivert: sett OPENAI_API_KEY i .env");
});
