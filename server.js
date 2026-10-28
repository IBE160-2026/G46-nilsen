import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { topicCatalog, topicClassificationSchema } from "./src/server/topic-contracts.js";
import { analysisSchema, createGuidanceSchema } from "./src/server/ai-schemas.js";
import "./src/privacy-name-data.js";
import "./src/privacy-detector.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;
const appVersion = process.env.APP_VERSION || "20.10.5";
const contactEmail = process.env.CONTACT_EMAIL || "";

app.disable("x-powered-by");
app.set("trust proxy", 1);

// v20.4: sikkerhetsheadere, mindre angrepsflate og same-origin-beskyttelse.
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  if (req.path.startsWith("/api/")) res.setHeader("Cache-Control", "no-store");
  next();
});

app.use(express.json({ limit: "512kb", type: "application/json" }));

function requestOriginAllowed(req) {
  const origin = String(req.get("origin") || "").trim();
  if (!origin) return true; // CLI/server-to-server-kall har ofte ikke Origin.
  const forwardedProto = String(req.get("x-forwarded-proto") || req.protocol || "https").split(",")[0].trim();
  const host = String(req.get("host") || "").trim();
  const allowed = new Set();
  if (host) allowed.add(`${forwardedProto}://${host}`);
  const configured = String(process.env.APP_BASE_URL || "").replace(/\/+$/, "");
  if (configured) allowed.add(configured);
  return allowed.has(origin.replace(/\/+$/, ""));
}

app.use("/api", (req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && !requestOriginAllowed(req)) {
    return res.status(403).json({ error: "ORIGIN_REJECTED", message: "Forespørselen ble avvist av sikkerhetskontrollen." });
  }
  next();
});

function createRateLimiter({ windowMs, max, keyPrefix }) {
  const buckets = new Map();
  let lastSweep = 0;
  return (req, res, next) => {
    const now = Date.now();
    if (now - lastSweep > windowMs) {
      for (const [key, value] of buckets) if (value.resetAt <= now) buckets.delete(key);
      lastSweep = now;
    }
    const rawKey = `${keyPrefix}|${req.ip || "unknown"}`;
    const key = crypto.createHash("sha256").update(rawKey).digest("hex");
    let entry = buckets.get(key);
    if (!entry || entry.resetAt <= now) entry = { count: 0, resetAt: now + windowMs };
    entry.count += 1;
    buckets.set(key, entry);
    if (entry.count > max) {
      res.setHeader("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
      return res.status(429).json({ error: "RATE_LIMITED", message: "For mange forsøk. Vent litt og prøv igjen." });
    }
    next();
  };
}

const generalApiLimiter = createRateLimiter({ windowMs: 15 * 60_000, max: 600, keyPrefix: "api" });
const loginLimiter = createRateLimiter({ windowMs: 15 * 60_000, max: 12, keyPrefix: "login" });
const registerLimiter = createRateLimiter({ windowMs: 60 * 60_000, max: 8, keyPrefix: "register" });
const resetLimiter = createRateLimiter({ windowMs: 15 * 60_000, max: 6, keyPrefix: "reset" });
const aiLimiter = createRateLimiter({ windowMs: 10 * 60_000, max: 80, keyPrefix: "ai" });
const benchmarkLimiter = createRateLimiter({ windowMs: 60 * 60_000, max: 120, keyPrefix: "benchmark" });
app.use("/api", generalApiLimiter);

// Server kun eksplisitt offentlige frontend-filer. SQL, .env, tester og dokumentasjon er ikke web-tilgjengelige.
const publicAssetNames = new Set([
  "index.html", "app.js", "styles.css", "src/client-data.js", "src/privacy-name-data.js", "src/privacy-detector.js", "assets/images/snakkeboble.svg",
  "assets/images/logo.png", "assets/images/logo-light.png", "assets/images/logo-symbol.png", "assets/images/logo-symbol-light.png",
  "assets/images/profile-ai.png", "assets/images/profile-ai-light.png", "assets/images/profile-human.png", "assets/images/profile-human-light.png",
  "assets/images/hero-conversation-exact.png",
  "assets/images/topics/topic-alkohol-rus.png", "assets/images/topics/topic-avslutning-arbeidsforhold.png", "assets/images/topics/topic-fravaer-oppfolging.png",
  "assets/images/topics/topic-livssituasjoner.png", "assets/images/topics/topic-lonn-utvikling.png", "assets/images/topics/topic-prestasjon-utvikling.png",
  "assets/images/topics/topic-samarbeid-kommunikasjon.png", "assets/images/topics/topic-sikkerhet-ansvar.png", "assets/images/topics/topic-mobbing-trakassering.png"
]);
app.get("/", (_req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.use((req, res, next) => {
  const asset = decodeURIComponent(String(req.path || "").replace(/^\/+/, ""));
  if (!publicAssetNames.has(asset)) return next();
  return res.sendFile(path.join(__dirname, asset));
});

app.get("/api/public-config", (_req, res) => {
  res.json({ appVersion, contactEmail });
});

const apiKey = process.env.OPENAI_API_KEY;
const openRouterApiKey = process.env.OPENROUTER_API_KEY;
const defaultModel = process.env.OPENAI_MODEL || (openRouterApiKey ? "openrouter/free" : "gpt-5.6-luna");
const client = apiKey ? new OpenAI({ apiKey }) : null;
const openRouterClient = openRouterApiKey ? new OpenAI({
  apiKey: openRouterApiKey,
  baseURL: "https://openrouter.ai/api/v1",
  timeout: 90000,
  maxRetries: 0,
  defaultHeaders: {
    "HTTP-Referer": process.env.APP_BASE_URL || "https://g46-nilsen-samtalestotte.onrender.com",
    "X-Title": "Samtalestøtte"
  }
}) : null;
function hasAnyAiClient(){ return Boolean(client || openRouterClient); }
function modelClient(modelId){ return AI_MODELS[modelId]?.provider === "openrouter" ? openRouterClient : client; }

const AI_MODELS = {
  "gpt-5.6-luna": { label: "GPT-5.6 Luna", tier: "Kostnad", provider:"openai", inputPerMillion: 0.20, outputPerMillion: 1.20 },
  "gpt-5.6-terra": { label: "GPT-5.6 Terra", tier: "Balansert", provider:"openai", inputPerMillion: 2.00, outputPerMillion: 12.00 },
  "gpt-5.6-sol": { label: "GPT-5.6 Sol", tier: "Høyest kvalitet", provider:"openai", inputPerMillion: 4.00, outputPerMillion: 20.00 },
  "openrouter/free": { label: "OpenRouter Free Router", tier: "Gratis · variabel modell", provider:"openrouter", inputPerMillion: 0, outputPerMillion: 0 },
  "google/gemma-4-26b-a4b-it:free": { label: "Gemma 4 26B A4B (OpenRouter)", tier: "Gratis · fast modell", provider:"openrouter", inputPerMillion: 0, outputPerMillion: 0 }
};
const WEB_SEARCH_CALL_USD = 0.01; // OpenAI web search: $10 / 1000 calls (2026-09).
const benchmarkCasePath = path.join(__dirname, "data/BENCHMARK-CASES.json");
let benchmarkCases = [];
try {
  benchmarkCases = JSON.parse(fs.readFileSync(benchmarkCasePath, "utf8")).cases || [];
} catch (error) {
  console.warn("Kunne ikke lese BENCHMARK-CASES.json:", error?.message || error);
}
const benchmarkCaseById = new Map(benchmarkCases.map(item => [item.id, item]));
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
  if (!AI_MODELS[selected]) selected = openRouterClient ? 'openrouter/free' : 'gpt-5.6-luna';
  if (!modelClient(selected)) selected = openRouterClient ? 'openrouter/free' : 'gpt-5.6-luna';
  activeModelCache = { value: selected, expiresAt: Date.now() + 30000 };
  return selected;
}

function extractWebSearchMeta(response) {
  const queries = [];
  const domains = [];
  const sources = [];
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
          const citation = ann?.url_citation || ann || {};
          const url = citation?.url;
          if (!url) continue;
          try {
            const parsed = new URL(url);
            const domain = parsed.hostname.replace(/^www\./,'');
            domains.push(domain);
            sources.push({
              url: parsed.toString().slice(0, 2000),
              title: String(citation?.title || '').trim().slice(0, 500) || null,
              domain
            });
          } catch (_) {}
        }
      }
    }
  }
  const uniqueSources = [];
  const seenUrls = new Set();
  for (const source of sources) {
    if (!source.url || seenUrls.has(source.url)) continue;
    seenUrls.add(source.url);
    uniqueSources.push(source);
    if (uniqueSources.length >= 30) break;
  }
  return {
    used,
    count: (response?.output || []).filter(item => item?.type === 'web_search_call').length,
    queries: [...new Set(queries)].slice(0,10),
    domains: [...new Set(domains)].slice(0,20),
    sources: uniqueSources
  };
}

async function logAiUsage({ functionName='unknown', modelUsed, response, isTest=false, benchmarkRunId=null, benchmarkCaseId=null, topicId=null, subtopic=null }) {
  try {
    const usage = response?.usage || {};
    const inputTokens = Number(usage.input_tokens || usage.inputTokens || 0);
    const outputTokens = Number(usage.output_tokens || usage.outputTokens || 0);
    const meta = AI_MODELS[modelUsed] || { inputPerMillion:0, outputPerMillion:0 };
    const web = extractWebSearchMeta(response);
    const tokenCostUsd = (inputTokens / 1_000_000) * meta.inputPerMillion + (outputTokens / 1_000_000) * meta.outputPerMillion;
    const estimatedCostUsd = tokenCostUsd + (web.count * WEB_SEARCH_CALL_USD);
    // Dataminimering: bruks-/kildeloggen kobles ikke til den innloggede brukeren.
    const baseRow = {
      function_name:functionName, model:modelUsed, topic_id:topicId || null, subtopic:subtopic || null,
      input_tokens:inputTokens, output_tokens:outputTokens, total_tokens:inputTokens+outputTokens,
      estimated_cost_usd:estimatedCostUsd, web_search_used:web.used,
      web_search_queries:web.queries, source_domains:web.domains, source_pages:web.sources
    };
    const extendedRow = { ...baseRow, web_search_call_count:web.count, is_test:Boolean(isTest), benchmark_run_id:benchmarkRunId, benchmark_case_id:benchmarkCaseId };
    const { error } = await supabaseAdmin.from('ai_usage_log').insert(extendedRow);
    if (error) {
      // Kompatibilitet før v20.4-migreringen: prøv uten de nyeste feltene.
      const compatibilityRow = {
        function_name:functionName, model:modelUsed,
        input_tokens:inputTokens, output_tokens:outputTokens, total_tokens:inputTokens+outputTokens,
        estimated_cost_usd:estimatedCostUsd, web_search_used:web.used,
        web_search_queries:web.queries, source_domains:web.domains,
        web_search_call_count:web.count, is_test:Boolean(isTest), benchmark_run_id:benchmarkRunId, benchmark_case_id:benchmarkCaseId
      };
      const { error: fallbackError } = await supabaseAdmin.from('ai_usage_log').insert(compatibilityRow);
      if (fallbackError) throw fallbackError;
    }
    return { inputTokens, outputTokens, totalTokens:inputTokens+outputTokens, tokenCostUsd, estimatedCostUsd, web };
  } catch (error) {
    console.warn('Kunne ikke lagre KI-brukslogg:', error?.message || error);
    return null;
  }
}

async function createTrackedResponse(params) {
  const requestedModel = String(params._modelOverride || '');
  const modelUsed = requestedModel && AI_MODELS[requestedModel] ? requestedModel : await getActiveModel();
  const functionName = String(params._functionName || 'unknown');
  const isTest = Boolean(params._isTest);
  const benchmarkRunId = params._benchmarkRunId || null;
  const benchmarkCaseId = params._benchmarkCaseId || null;
  const topicId = params._topicId ? String(params._topicId).slice(0,100) : null;
  const subtopic = params._subtopic ? String(params._subtopic).slice(0,200) : null;
  const trustedInternal = Boolean(params._trustedInternal);
  const privacyTexts = params._privacyTexts;
  // Sentral personverngateway: alle brukerinitierte KI-kall må eksplisitt levere teksten som skal kontrolleres.
  if (!trustedInternal) {
    if (!Array.isArray(privacyTexts)) {
      const error = new Error("KI-kall mangler personvernkontekst.");
      error.code = "PRIVACY_CONTEXT_REQUIRED";
      throw error;
    }
    const findings = privacyTexts.flatMap(serverPrivacyFindings).filter(item => SERVER_HARD_PRIVACY_TYPES.has(item.type));
    if (findings.length) {
      const error = new Error("Personvernsjekk kreves før KI-kall.");
      error.code = "PRIVACY_REVIEW_REQUIRED";
      error.findings = findings;
      throw error;
    }
  }
  const cleanParams = { ...params };
  delete cleanParams._functionName; delete cleanParams._userId; delete cleanParams._modelOverride;
  delete cleanParams._isTest; delete cleanParams._benchmarkRunId; delete cleanParams._benchmarkCaseId;
  delete cleanParams._topicId; delete cleanParams._subtopic; delete cleanParams._privacyTexts; delete cleanParams._trustedInternal;
  try {
    const selectedClient = modelClient(modelUsed);
    if (!selectedClient) { const error=new Error(`API-nøkkel mangler for ${AI_MODELS[modelUsed]?.provider||'valgt provider'}.`); error.code='AI_PROVIDER_NOT_CONFIGURED'; throw error; }
    const response = await selectedClient.responses.create({ ...cleanParams, model: modelUsed });
    const routedModel = AI_MODELS[modelUsed]?.provider === 'openrouter' ? String(response?.model || modelUsed) : modelUsed;
    const usageSummary = await logAiUsage({ functionName, modelUsed:routedModel, response, isTest, benchmarkRunId, benchmarkCaseId, topicId, subtopic });
    Object.defineProperty(response, '__samtalestotteModel', { value:routedModel, enumerable:false });
    Object.defineProperty(response, '__samtalestotteUsage', { value:usageSummary, enumerable:false });
    return response;
  } catch (error) {
    error.samtalestotteModel = modelUsed;
    throw error;
  }
}

function responseModel(response) { return response?.__samtalestotteModel || defaultModel; }


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

// Automatisk dataminimering/lagringsbegrensning for logger, feedback, benchmark og brukertestdata.
const RETENTION = {
  aiUsageDays: 90,
  feedbackAttachmentDays: 90,
  feedbackDays: 365,
  benchmarkDays: 365,
  surveyDays: 365
};
let lastRetentionCleanup = 0;
async function cleanupExpiredData() {
  const now = Date.now();
  if (now - lastRetentionCleanup < 12 * 60 * 60_000) return;
  lastRetentionCleanup = now;
  const isoDaysAgo = days => new Date(now - days * 86400000).toISOString();
  try {
    await supabaseAdmin.from('ai_usage_log').delete().lt('created_at', isoDaysAgo(RETENTION.aiUsageDays));
    await supabaseAdmin.from('ai_response_feedback')
      .update({ include_conversation:false, conversation_snapshot:null })
      .eq('include_conversation', true)
      .lt('created_at', isoDaysAgo(RETENTION.feedbackAttachmentDays));
    await supabaseAdmin.from('ai_response_feedback').delete().lt('created_at', isoDaysAgo(RETENTION.feedbackDays));
    await supabaseAdmin.from('benchmark_results').delete().lt('created_at', isoDaysAgo(RETENTION.benchmarkDays));
    await supabaseAdmin.from('survey_responses').delete().lt('created_at', isoDaysAgo(RETENTION.surveyDays));
    await supabaseAdmin.from('survey_participation').delete().lt('completed_at', isoDaysAgo(RETENTION.surveyDays));
  } catch (error) {
    console.warn('[retention] Opprydding kunne ikke fullføres:', error?.message || 'ukjent feil');
  }
}
app.use('/api', (_req, _res, next) => { cleanupExpiredData().catch(() => {}); next(); });

app.get("/api/auth/diagnostic", requireAdmin, (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({
    ok: true,
    appVersion,
    authRouteAvailable: true,
    authConfigured: Boolean(supabaseUrl && supabasePublishableKey && supabaseSecretKey),
    environment: process.env.NODE_ENV === "production" ? "production" : "development"
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

const cookieSecure = process.env.NODE_ENV === "production" || /^https:\/\//i.test(process.env.APP_BASE_URL || "");

function authCookie(name, value, maxAge = SESSION_MAX_AGE_SECONDS) {
  const secure = cookieSecure ? "; Secure" : "";
  return `${name}=${encodeURIComponent(value || "")}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}; Priority=High`;
}


const VALID_ROLES = new Set(["user", "editor", "admin"]);
const EDITABLE_CONTENT_KEY_PATTERN = /^(?:home|topic|guidance|simulation|history|settings|about|contact|privacy|terms)\.[a-z0-9._-]{1,160}$/i;

const bootstrapAdminEmails = new Set(
  String(process.env.ADMIN_EMAILS || "")
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
  if (process.env.NODE_ENV === "test" && process.env.TEST_AUTH_BYPASS === "1") {
    req.user = { id: "test-user", email: "test@example.com" };
    req.supabase = null;
    return next();
  }
  try {
    const cookies = parseCookies(req);
    const hasAccess = Boolean(cookies[ACCESS_COOKIE]);
    const hasRefresh = Boolean(cookies[REFRESH_COOKIE]);
    const resolved = await resolveSession(req, res);

    if (!resolved) {
      console.warn(`[auth] 401 ${req.method} ${req.path} accessCookie=${hasAccess} refreshCookie=${hasRefresh}`);
      return res.status(401).json({
        error: "AUTH_REQUIRED",
        message: "Innloggingssesjonen ble ikke godkjent. Logg inn på nytt."
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
      message: missing ? "Kjør database/migrations/V20-SUPABASE-MIGRATION.sql i Supabase før innholdsredigering tas i bruk." : "Kunne ikke lagre innholdet."
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
  if (error) { const missing=/ai_response_feedback|conversation_snapshot|include_conversation|relation .* does not exist/i.test(String(error.message||'')); return res.status(missing?503:500).json({error:missing?'FEEDBACK_TABLE_MISSING':'FEEDBACK_SAVE_FAILED',message:missing?'Kjør database/migrations/V20-2-SUPABASE-MIGRATION.sql i Supabase først.':'Kunne ikke lagre tilbakemeldingen.'}); }
  res.json({ok:true});
});

app.get("/api/admin/ai-feedback", requireAdmin, async (_req,res)=>{
  const { data,error }=await supabaseAdmin.from('ai_response_feedback').select('id,category,comment,surface,include_conversation,conversation_snapshot,created_at').order('created_at',{ascending:false}).limit(100);
  if(error){const missing=/ai_response_feedback|relation .* does not exist/i.test(String(error.message||''));return res.status(missing?503:500).json({error:'FEEDBACK_LOAD_FAILED',message:missing?'Kjør database/migrations/V20-2-SUPABASE-MIGRATION.sql i Supabase først.':'Kunne ikke hente tilbakemeldinger.'});}
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
  if (error) return res.status(500).json({error:'MODEL_SAVE_FAILED',message:'Kunne ikke lagre modellvalget. Kjør database/migrations/V20-2-SUPABASE-MIGRATION.sql først.'});
  activeModelCache={value:modelId,expiresAt:Date.now()+30000};
  res.json({ok:true,activeModel:modelId});
});

app.get('/api/admin/ai-usage', requireAdmin, async (req,res)=>{
  const since = new Date(Date.now()-30*24*60*60*1000).toISOString();
  const includeTests = req.query.includeTests === '1';
  let rows=[];
  let extended=true;
  let result=await supabaseAdmin.from('ai_usage_log').select('function_name,model,topic_id,subtopic,input_tokens,output_tokens,total_tokens,estimated_cost_usd,web_search_used,web_search_call_count,web_search_queries,source_domains,source_pages,is_test,benchmark_run_id,benchmark_case_id,created_at').gte('created_at',since).order('created_at',{ascending:false}).limit(2000);
  if(result.error){
    extended=false;
    result=await supabaseAdmin.from('ai_usage_log').select('function_name,model,input_tokens,output_tokens,total_tokens,estimated_cost_usd,web_search_used,web_search_queries,source_domains,created_at').gte('created_at',since).order('created_at',{ascending:false}).limit(2000);
  }
  if(result.error) return res.status(500).json({error:'USAGE_LOAD_FAILED',message:'Kunne ikke hente KI-bruk. Kjør database/migrations/V20-2-SUPABASE-MIGRATION.sql først.'});
  rows=(result.data||[]).map(r=>extended?r:{...r,is_test:false,web_search_call_count:r.web_search_used?1:0});
  if(!includeTests) rows=rows.filter(r=>!r.is_test);
  const now=Date.now();
  const sumDays=d=>rows.filter(r=>new Date(r.created_at).getTime()>=now-d*86400000).reduce((a,r)=>a+Number(r.estimated_cost_usd||0),0);
  const domainCounts={}; const queryCounts={}; const pageCounts=new Map();
  for(const r of rows){
    for(const d of r.source_domains||[]) domainCounts[d]=(domainCounts[d]||0)+1;
    for(const q of r.web_search_queries||[]) queryCounts[q]=(queryCounts[q]||0)+1;
    for(const page of r.source_pages||[]){
      if(!page?.url) continue;
      const current=pageCounts.get(page.url)||{url:page.url,title:page.title||null,domain:page.domain||null,count:0};
      current.count+=1; pageCounts.set(page.url,current);
    }
  }
  const top=(obj,n=12)=>Object.entries(obj).sort((a,b)=>b[1]-a[1]).slice(0,n).map(([name,count])=>({name,count}));
  const topPages=[...pageCounts.values()].sort((a,b)=>b.count-a.count).slice(0,20);
  res.json({summary:{cost24h:sumDays(1),cost7d:sumDays(7),cost30d:sumDays(30),calls30d:rows.length,webSearchCalls30d:rows.filter(r=>r.web_search_used).length},recent:rows.slice(0,100),topDomains:top(domainCounts),topQueries:top(queryCounts),topPages,supportsTestFilter:extended});
});

app.get('/api/admin/benchmark/cases', requireAdmin, async (_req,res)=>{
  const byTopic={};
  for(const item of benchmarkCases){
    if(!byTopic[item.topicId]) byTopic[item.topicId]={topicId:item.topicId,topic:item.topic,subtopics:new Set(),cases:0};
    byTopic[item.topicId].subtopics.add(item.subtopic); byTopic[item.topicId].cases++;
  }
  const topics=Object.values(byTopic).map(x=>({topicId:x.topicId,topic:x.topic,subtopicCount:x.subtopics.size,caseCount:x.cases}));
  const representative=[]; const seen=new Set();
  for(const item of benchmarkCases){ if(item.variant==='A'&&!seen.has(item.topicId)){seen.add(item.topicId);representative.push(item.id);} }
  let storageReady=true;
  const probe=await supabaseAdmin.from('benchmark_results').select('id,source_pages').limit(1);
  if(probe.error) storageReady=false;
  res.json({version:appVersion,totalCases:benchmarkCases.length,totalSubtopics:new Set(benchmarkCases.map(x=>`${x.topicId}|${x.subtopic}`)).size,topics,cases:benchmarkCases,representativeCaseIds:representative,models:Object.entries(AI_MODELS).map(([id,meta])=>({id,...meta})),defaultBudgetUsd:2,maxBudgetUsd:5,storageReady});
});

app.get('/api/admin/pilot-regression/cases', requireAdmin, async (_req,res)=>{
  try {
    const goldenPath = path.join(__dirname, 'tests/AI-GOLDEN-CASES.json');
    const bank = JSON.parse(fs.readFileSync(goldenPath, 'utf8'));
    const cases = (bank.cases || []).filter(item => item.pilot_regression).map(item => ({
      id:item.id,
      theme:item.theme,
      input:item.input,
      opening_checks:item.opening_checks || {},
      manual_fasit:item.manual_fasit || null
    }));
    res.json({ count:cases.length, cases });
  } catch (error) {
    console.error('Kunne ikke lese pilot-regresjonscaser:', error?.message || error);
    res.status(500).json({ error:'PILOT_CASES_FAILED', message:'Kunne ikke hente pilotcasene.' });
  }
});

app.post('/api/admin/pilot-regression/result', requireAdmin, async (req,res)=>{
  try {
    const goldenPath = path.join(__dirname, 'tests/AI-GOLDEN-CASES.json');
    const bank = JSON.parse(fs.readFileSync(goldenPath, 'utf8'));
    const caseId = String(req.body?.caseId || '').slice(0,80);
    const testCase = (bank.cases || []).find(item => item.pilot_regression && item.id === caseId);
    if (!testCase) return res.status(400).json({error:'INVALID_PILOT_CASE',message:'Ukjent pilotcase.'});

    const opening = String(req.body?.opening || '').trim().slice(0,700);
    const model = String(req.body?.model || '').trim().slice(0,120);
    const runId = String(req.body?.runId || '').trim().slice(0,100);
    const ok = req.body?.ok === true;
    const issues = (Array.isArray(req.body?.issues) ? req.body.issues : [])
      .map(value => String(value || '').trim().slice(0,220))
      .filter(Boolean)
      .slice(0,8);

    // Kun faste, personverntrygge pilotcaser logges her. Ingen fri brukersamtale lagres.
    console.info('[pilot-regression-result]', JSON.stringify({
      runId,
      caseId:testCase.id,
      theme:testCase.theme,
      model,
      ok,
      issues,
      opening
    }));
    res.json({ok:true});
  } catch (error) {
    console.error('[pilot-regression-result] logging failed:', error?.message || error);
    res.status(500).json({error:'PILOT_RESULT_LOG_FAILED',message:'Kunne ikke registrere pilotresultatet.'});
  }
});

app.post('/api/admin/benchmark/mock', requireAdmin, async (_req,res)=>{
  const groups=new Map(); const problems=[];
  for(const item of benchmarkCases){
    const key=`${item.topicId}|${item.subtopic}`; groups.set(key,(groups.get(key)||0)+1);
    if(!item.id||!item.situation||!item.topicId||!item.subtopic) problems.push(`${item.id||'ukjent'} mangler obligatorisk felt`);
    if(serverPrivacyFindings(item.situation).length) problems.push(`${item.id} utløser personvernsjekk`);
  }
  for(const [key,count] of groups) if(count<2) problems.push(`${key} har bare ${count} testsak(er)`);
  const topicCounts={}; for(const item of benchmarkCases) topicCounts[item.topic]=(topicCounts[item.topic]||0)+1;
  res.json({ok:problems.length===0,mode:'mock',checks:{cases:benchmarkCases.length,subtopics:groups.size,minTwoPerSubtopic:[...groups.values()].every(n=>n>=2),privacySafe:!problems.some(x=>x.includes('personvernsjekk')),topicCounts},problems});
});

app.post('/api/admin/benchmark/live', benchmarkLimiter, requireAdmin, async (req,res)=>{
  if(!hasAnyAiClient()) return res.status(503).json({error:'AI_NOT_CONFIGURED',message:'Ingen KI-provider er konfigurert. Sett OPENAI_API_KEY eller OPENROUTER_API_KEY på serveren.'});
  const caseId=String(req.body?.caseId||''); const model=String(req.body?.model||'');
  const runId=String(req.body?.runId||'').slice(0,80) || crypto.randomUUID();
  const spentSoFar=Math.max(0,Number(req.body?.spentSoFar||0));
  const budget=Math.min(5,Math.max(0.10,Number(req.body?.budgetUsd||2)));
  const item=benchmarkCaseById.get(caseId);
  if(!item) return res.status(400).json({error:'INVALID_CASE',message:'Ukjent testsak.'});
  if(!AI_MODELS[model]) return res.status(400).json({error:'INVALID_MODEL',message:'Ugyldig KI-modell.'});
  // Reserve 5 cent before each call so the run stops before the requested budget is exhausted.
  if(spentSoFar + 0.05 > budget) return res.status(409).json({error:'BUDGET_LIMIT',message:`Budsjettgrensen på $${budget.toFixed(2)} er nådd.`,spentSoFar,budget});
  const benchmarkPrompt=`Du deltar i en kontrollert benchmark av Samtalestøtte. Gi et kort, konkret og profesjonelt råd til en leder.
Forventet hovedtema: ${item.topic}
Forventet undertema: ${item.subtopic}
Situasjon: ${item.situation}

Krav:
- Svar på norsk.
- 120–180 ord.
- Skill mellom fakta og antakelser.
- Ikke dikt opp virksomhetsregler eller personopplysninger.
- Bruk nettsøk bare dersom oppdatert eller presis ekstern informasjon faktisk er nødvendig.
- Hvis du søker: prioriter norske myndighetskilder og relevante fagmiljøer.
- Ikke omtale dette som en test i selve rådet.`;
  const started=Date.now();
  try{
    const benchmarkTools = AI_MODELS[model]?.provider === 'openai' ? [{type:'web_search',search_context_size:'low'}] : undefined;
    const benchmarkParams={_functionName:'benchmark',_userId:req.user.id,_topicId:item.topicId,_subtopic:item.subtopic,_trustedInternal:true,_modelOverride:model,_isTest:true,_benchmarkRunId:runId,_benchmarkCaseId:caseId,instructions:'Du er Samtalestøtte, et beslutningsstøtteverktøy for ledere. Vær konkret, nøktern og ikke-diagnostiserende.',input:[{role:'user',content:[{type:'input_text',text:benchmarkPrompt}]}],max_output_tokens:450};
    if(benchmarkTools) benchmarkParams.tools=benchmarkTools;
    const response=await createTrackedResponse(benchmarkParams);
    const latencyMs=Date.now()-started; const usage=response.__samtalestotteUsage||{}; const web=usage.web||extractWebSearchMeta(response);
    const row={run_id:runId,case_id:caseId,topic_id:item.topicId,topic:item.topic,subtopic:item.subtopic,variant:item.variant,model,response_text:String(response.output_text||''),input_tokens:Number(usage.inputTokens||0),output_tokens:Number(usage.outputTokens||0),estimated_cost_usd:Number(usage.estimatedCostUsd||0),web_search_count:Number(web.count||0),web_search_queries:web.queries||[],source_domains:web.domains||[],source_pages:web.sources||[],latency_ms:latencyMs,created_by:req.user.id};
    const save=await supabaseAdmin.from('benchmark_results').insert(row).select('id').single();
    if(save.error) return res.status(503).json({error:'BENCHMARK_STORAGE_MISSING',message:'Testen ble kjørt, men resultatet kunne ikke lagres. Kjør database/migrations/V20-3-SUPABASE-MIGRATION.sql før flere betalte tester.',result:row});
    res.json({ok:true,id:save.data?.id,...row});
 }catch(error){
  console.error("Benchmark-feil:", {
    model,
    caseId,
    status: error?.status,
    message: error?.message,
    code: error?.code,
    error: error?.error
  });

  const status=Number(error?.status)||500;

  const providerRateLimited = status === 429 && model === 'google/gemma-4-26b-a4b-it:free';
  res.status(status>=400&&status<600?status:500).json({
    error:'BENCHMARK_FAILED',
    message:providerRateLimited
      ? 'Gemma Free er midlertidig ratebegrenset hos OpenRouter (429). Prøv senere eller velg en annen modell.'
      : (error?.message || 'Benchmark-kallet feilet.'),
    model,
    caseId,
    status:error?.status || null,
    code:error?.code || null
  });
}
});

app.get('/api/admin/benchmark/results', requireAdmin, async (req,res)=>{
  let q=supabaseAdmin.from('benchmark_results').select('id,run_id,case_id,topic_id,topic,subtopic,variant,model,response_text,input_tokens,output_tokens,estimated_cost_usd,web_search_count,web_search_queries,source_domains,source_pages,latency_ms,created_at').order('created_at',{ascending:false}).limit(300);
  const runId=String(req.query.runId||'').trim(); if(runId) q=q.eq('run_id',runId);
  const {data,error}=await q;
  if(error) return res.status(503).json({error:'BENCHMARK_STORAGE_MISSING',message:'Kjør database/migrations/V20-3-SUPABASE-MIGRATION.sql i Supabase først.'});
  res.json({items:data||[]});
});


app.get('/api/survey/status', requireUser, async (req,res)=>{
  const [setting,participation]=await Promise.all([
    supabaseAdmin.from('app_settings').select('value').eq('key','survey_enabled').maybeSingle(),
    supabaseAdmin.from('survey_participation').select('completed_at').eq('user_id',req.user.id).maybeSingle()
  ]);
  const enabled=setting.data?.value?.enabled!==false;
  res.json({enabled,completed:!!participation.data?.completed_at});
});

app.post("/api/survey", requireUser, async (req,res)=>{
  const setting=await supabaseAdmin.from('app_settings').select('value').eq('key','survey_enabled').maybeSingle();
  if(setting.data?.value?.enabled===false)return res.status(403).json({error:'SURVEY_CLOSED',message:'Brukertesten er avsluttet.'});
  const existing=await supabaseAdmin.from('survey_participation').select('completed_at').eq('user_id',req.user.id).maybeSingle();
  if(existing.data?.completed_at)return res.status(409).json({error:'SURVEY_ALREADY_COMPLETED',message:'Du har allerede sendt inn brukertesten. Dersom du har flere tilbakemeldinger, bruk kontaktskjemaet.'});
  const b=req.body||{}; const score=k=>{const n=Number(b[k]); return Number.isInteger(n)&&n>=1&&n<=5?n:null;};
  const row={usability:score('usability'),navigation:score('navigation'),ai_relevance:score('ai_relevance'),practical_usefulness:score('practical_usefulness'),simulation:score('simulation'),privacy:score('privacy'),would_use:score('would_use'),improvement_text:String(b.improvement_text||'').trim().slice(0,1200),most_useful_text:String(b.most_useful_text||'').trim().slice(0,1200)};
  if([row.usability,row.navigation,row.ai_relevance,row.practical_usefulness,row.privacy,row.would_use].some(v=>v===null)) return res.status(400).json({error:'INVALID_SURVEY',message:'Svar på alle obligatoriske spørsmål fra 1 til 5.'});
  const privacyFindings=serverPrivacyFindings(`${row.improvement_text} ${row.most_useful_text}`).filter(x=>SERVER_HARD_PRIVACY_TYPES.has(x.type));
  if(privacyFindings.length)return res.status(400).json({error:'PRIVACY_REVIEW_REQUIRED',message:'Fjern navn eller andre tydelige personopplysninger fra friteksten.'});
  const mark=await supabaseAdmin.from('survey_participation').insert({user_id:req.user.id});
  if(mark.error){if(/duplicate|unique/i.test(String(mark.error.message||'')))return res.status(409).json({error:'SURVEY_ALREADY_COMPLETED',message:'Du har allerede sendt inn brukertesten. Dersom du har flere tilbakemeldinger, bruk kontaktskjemaet.'});return res.status(503).json({error:'SURVEY_SCHEMA_MISSING',message:'Kjør database/migrations/V20-6-SUPABASE-MIGRATION.sql i Supabase først.'});}
  const saved=await supabaseAdmin.from('survey_responses').insert(row);
  if(saved.error){await supabaseAdmin.from('survey_participation').delete().eq('user_id',req.user.id);return res.status(503).json({error:'SURVEY_TABLE_MISSING',message:'Kunne ikke lagre brukertesten.'});}
  res.json({ok:true});
});
app.get("/api/admin/survey", requireAdmin, async (_req,res)=>{
  const {data,error}=await supabaseAdmin.from('survey_responses').select('*').order('created_at',{ascending:false}).limit(500); if(error)return res.status(503).json({error:'SURVEY_TABLE_MISSING',message:'Kjør database/migrations/V20-5-SUPABASE-MIGRATION.sql i Supabase først.'}); const rows=data||[];
  const avg=k=>{const vals=rows.map(x=>Number(x[k])).filter(n=>Number.isFinite(n)); return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null;};
  res.json({count:rows.length,averages:{usability:avg('usability'),navigation:avg('navigation'),aiRelevance:avg('ai_relevance'),practicalUsefulness:avg('practical_usefulness'),simulation:avg('simulation'),privacy:avg('privacy'),wouldUse:avg('would_use')},responses:rows.slice(0,100).map(x=>({created_at:x.created_at,improvement_text:x.improvement_text,most_useful_text:x.most_useful_text}))});
});
app.get('/api/admin/survey/settings', requireAdmin, async (_req,res)=>{const {data}=await supabaseAdmin.from('app_settings').select('value').eq('key','survey_enabled').maybeSingle();res.json({enabled:data?.value?.enabled!==false});});
app.put('/api/admin/survey/settings', requireAdmin, async (req,res)=>{const enabled=req.body?.enabled!==false;const {error}=await supabaseAdmin.from('app_settings').upsert({key:'survey_enabled',value:{enabled},updated_at:new Date().toISOString(),updated_by:req.user.id});if(error)return res.status(503).json({error:'SETTINGS_ERROR',message:'Kunne ikke lagre brukertestinnstillingen.'});res.json({ok:true,enabled});});

app.get('/api/privacy-ack', requireUser, async (req,res)=>{const {data,error}=await supabaseAdmin.from('privacy_acknowledgements').select('acknowledged_at').eq('user_id',req.user.id).maybeSingle();if(error)return res.status(503).json({acknowledged:false});res.json({acknowledged:!!data?.acknowledged_at});});
app.post('/api/privacy-ack', requireUser, async (req,res)=>{const {error}=await supabaseAdmin.from('privacy_acknowledgements').upsert({user_id:req.user.id,acknowledged_at:new Date().toISOString()},{onConflict:'user_id'});if(error)return res.status(503).json({error:'PRIVACY_ACK_ERROR',message:'Kunne ikke lagre bekreftelsen.'});res.json({ok:true});});

app.post("/api/admin/invites", requireAdmin, async (req,res)=>{
  const role=String(req.body?.role||'user').toLowerCase(); if(!VALID_ROLES.has(role))return res.status(400).json({error:'INVALID_ROLE',message:'Ugyldig rolle.'});
  const expiresAt=new Date(req.body?.expiresAt||'2026-12-31T23:59:59+01:00'); if(Number.isNaN(expiresAt.getTime())||expiresAt<=new Date())return res.status(400).json({error:'INVALID_EXPIRY',message:'Velg en gyldig fremtidig utløpsdato.'});
  const code=crypto.randomBytes(18).toString('base64url'); const codeHash=hashInvite(code); const {error}=await supabaseAdmin.from('invites').insert({code_hash:codeHash,role,expires_at:expiresAt.toISOString()});
  if(error)return res.status(503).json({error:'INVITE_SCHEMA_MISSING',message:'Kunne ikke opprette rollebasert invitasjon. Kjør database/migrations/V20-5-SUPABASE-MIGRATION.sql først.'});
  const base=(process.env.APP_BASE_URL||`${req.protocol}://${req.get('host')}`).replace(/\/$/,''); res.status(201).json({url:`${base}/?invite=${code}`,role,expiresAt:expiresAt.toISOString()});
});

app.post("/api/auth/register", registerLimiter, async (req, res) => {
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
    .select("id, used_at, role, expires_at")
    .eq("code_hash", inviteHash)
    .is("used_at", null)
    .maybeSingle();

  if (inviteError) {
    console.error("Invitasjonsfeil:", inviteError);
    return res.status(500).json({ error: "INVITE_LOOKUP_FAILED", message: "Kunne ikke kontrollere invitasjonen." });
  }
  if (!invite) return res.status(403).json({ error: "INVALID_INVITE", message: "Invitasjonen er ugyldig eller allerede brukt." });
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) return res.status(403).json({ error:"INVITE_EXPIRED", message:"Invitasjonen har utløpt. Be om en ny invitasjon." });

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username },
    app_metadata: { role: VALID_ROLES.has(String(invite.role||'user')) ? String(invite.role||'user') : 'user' }
  });

  if (createError || !created.user) {
    const msg = String(createError?.message || "").toLowerCase();
    if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
      return res.status(409).json({ error: "REGISTER_FAILED", message: "Kunne ikke opprette konto med disse opplysningene." });
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

app.post("/api/auth/login", loginLimiter, async (req, res) => {
  const requestId = crypto.randomBytes(5).toString("hex");
  res.setHeader("Cache-Control", "no-store");
  const identifier = String(req.body?.identifier || req.body?.email || "").trim();
  const password = String(req.body?.password || "");
  const idType = identifier.includes("@") ? "email" : "username";
  if (!identifier || !password) {
    return res.status(400).json({ error: "MISSING_LOGIN", message: "Skriv inn e-post eller brukernavn og passord." });
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
    } catch (lookupError) {
      console.error(`[auth ${requestId}] username lookup failed`);
      return res.status(500).json({ error: "USERNAME_LOOKUP_FAILED", message: "Kunne ikke slå opp brukernavnet akkurat nå." });
    }
  }

  if (!email) {
    return res.status(401).json({ error: "INVALID_LOGIN", message: "Feil e-post/brukernavn eller passord." });
  }
  const authClient = newUserClient();
  const { data, error } = await authClient.auth.signInWithPassword({ email, password });
  if (error || !data.session || !data.user) {
    console.warn(`[auth ${requestId}] sign-in rejected`);
    return res.status(401).json({ error: "INVALID_LOGIN", message: "Feil e-post/brukernavn eller passord." });
  }
  setSession(res, data.session);
  res.json({ user: publicUser(data.user) });
});


const passwordResetAttempts = new Map();

app.post("/api/auth/password-reset-request", resetLimiter, async (req, res) => {
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

app.post("/api/auth/password-reset-complete", resetLimiter, async (req, res) => {
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

app.get("/api/account/export", requireUser, async (req, res) => {
  const userId = req.user.id;
  const [{ data: conversations, error: historyError }, { data: feedback, error: feedbackError }] = await Promise.all([
    req.supabase.from("conversations").select("id,title,content,created_at,updated_at").order("created_at", { ascending:true }),
    supabaseAdmin.from("ai_response_feedback").select("id,category,comment,surface,conversation_id,topic_id,subtopic,include_conversation,conversation_snapshot,created_at").eq("user_id", userId).order("created_at", { ascending:true })
  ]);
  if (historyError) return res.status(500).json({ error:"ACCOUNT_EXPORT_FAILED", message:"Kunne ikke hente samtalehistorikken." });
  const exportData = {
    exported_at: new Date().toISOString(),
    app_version: appVersion,
    account: { id:req.user.id, username:req.user.username, email:req.user.email, role:req.user.role, created_at:req.user.createdAt },
    conversations: (conversations || []).map(rowToHistory),
    feedback: feedbackError ? [] : (feedback || [])
  };
  res.setHeader("Content-Disposition", `attachment; filename="samtalestotte-data-${new Date().toISOString().slice(0,10)}.json"`);
  res.type("application/json").send(JSON.stringify(exportData, null, 2));
});

app.delete("/api/account", requireUser, async (req, res) => {
  const userId = req.user.id;
  const { error: historyError } = await req.supabase.from("conversations").delete().eq("user_id", userId);
  if (historyError) return res.status(500).json({ error: "ACCOUNT_DELETE_FAILED", message: "Kunne ikke slette samtalehistorikken." });

  // Feedback kan inneholde frivillig vedlagt samtale og slettes derfor sammen med kontoen.
  const { error: feedbackError } = await supabaseAdmin.from("ai_response_feedback").delete().eq("user_id", userId);
  if (feedbackError && !/relation .* does not exist/i.test(String(feedbackError.message || ""))) {
    return res.status(500).json({ error:"ACCOUNT_DELETE_FAILED", message:"Kunne ikke slette lagrede tilbakemeldinger." });
  }
  // Eldre versjoner koblet tekniske KI-logger til bruker-ID. Fjern den koblingen før kontoen slettes.
  try { await supabaseAdmin.from("ai_usage_log").update({ user_id:null }).eq("user_id", userId); } catch (_) {}

  const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (deleteUserError) {
    console.error("Slett konto-feil");
    return res.status(500).json({ error: "ACCOUNT_DELETE_FAILED", message: "Kunne ikke slette kontoen." });
  }

  clearSession(req, res);
  res.json({ ok: true });
});

const systemPrompt = fs.readFileSync(path.join(__dirname, "docs/ai/AI-SYSTEMPROMPT.md"), "utf8");
const sourceBank = JSON.parse(fs.readFileSync(path.join(__dirname, "data/SOURCEBANK.json"), "utf8"));
const sourceIds = sourceBank.sources.map(source => source.id);
const guidanceSchema = createGuidanceSchema(sourceIds);

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

const SERVER_HARD_PRIVACY_TYPES = new Set(["email", "phone", "birthdate", "identifier", "name", "address", "gendered_language"]);
const sharedPrivacyNameDetector = globalThis.SamtalestottePrivacyDetector;
if (!sharedPrivacyNameDetector) throw new Error("Delt navnedetektor mangler.");
function serverFindLikelyGivenNames(source) {
  return sharedPrivacyNameDetector.findLikelyGivenNames(source);
}

function serverPrivacyFindings(text) {
  const source = String(text || "");
  const findings = [];
  const add = (type, message) => { if (!findings.some(item => item.type === type)) findings.push({ type, message }); };
  if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(source)) add("email", "Fjern e-postadresse.");
  if (/(?:\+47\s?)?(?:\d[\s-]?){8}\b/.test(source)) add("phone", "Fjern telefonnummer.");
  if (/\b(?:\d{1,2}[.\/-]\d{1,2}[.\/-](?:19|20)?\d{2})\b/.test(source) || /\b(?:født|fødselsdato)\s+(?:i\s+)?(?:19|20)\d{2}\b/i.test(source)) add("birthdate", "Fjern fødselsdato eller fødselsår.");
  const ageNumber = "(?:[1-9]|[1-9]\\d|1[01]\\d|120)";
  const explicitAge = new RegExp(
    "\\b(?:(?:er|var|blir|fyller)\\s+" + ageNumber + "\\s*år(?:\\s+gammel)?|" +
    ageNumber + "\\s*år\\s+gammel|" +
    ageNumber + "[-\\s]?åring(?:en)?|" +
    "alder(?:en)?(?:\\s+er|\\s+på)?\\s*" + ageNumber + "|" +
    "(?:medarbeider(?:en)?|ansatt(?:en)?|person(?:en)?|leder(?:en)?|kollega(?:en)?)\\s+på\\s+" + ageNumber + "\\s*år)\\b",
    "i"
  );
  if (explicitAge.test(source)) add("age", "Generaliser konkret alder hvis den ikke er nødvendig.");
  if (/\b(?:fødselsnummer|personnummer|ansattnummer|ansattnr\.?|employee\s*id)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/i.test(source) || /\b\d{11}\b/.test(source)) add("identifier", "Fjern identifikasjonsnummer.");
  if (/\b(?:han|hun|ham|henne|hans|hennes)\b/iu.test(source)) add("gendered_language", "Bruk kjønnsnøytral formulering, for eksempel «hen» eller «medarbeideren».");
  if (/\b[A-ZÆØÅ][a-zæøå]+(?:gate|gata|veien|vegen|allé|stien)\s+\d+[A-Za-z]?\b/.test(source)) add("address", "Fjern konkret gateadresse.");
  for (const name of serverFindLikelyGivenNames(source)) findings.push({ type: "name", message: `Fjern mulig personnavn «${name}».` });

  const familyAgeCombo = /\b(?:har|med|til)\s+(?:(?:ett|to|tre|fire|fem|seks|\d+)\s+)?(?:barn|datter|døtre|sønn|sønner|gutt|gutter|jente|jenter)\b[^.!?]{0,55}\b(?:på\s+)?\d{1,2}(?:\s*(?:,|og)\s*\d{1,2})+(?:\s*år)?\b/iu;
  const singleChildAge = /\b(?:barn|datter|sønn|gutt|jente)\s+(?:som\s+er\s+|på\s+)\d{1,2}\s*år\b/iu;
  const householdCombo = /\b(?:bor|lever)\s+med\s+(?:mannen|kona|ektefellen|samboeren|partneren)\b[^.!?]{0,70}\b(?:barn|datter|døtre|sønn|sønner)\b/iu;
  const uniquenessCombo = /\b(?:den\s+eneste|en\s+av\s+(?:to|tre|fire|\d+))\b[^.!?]{0,70}\b(?:ansatt(?:e|en)?|medarbeider(?:e|en)?|leder(?:e|en)?|ingeniør(?:er|en)?|sykepleier(?:e|en)?|lærer(?:e|en)?|rådgiver(?:e|en)?|tekniker(?:e|en)?|operatør(?:er|en)?|elektriker(?:e|en)?|lege(?:r|n)?|psykolog(?:er|en)?|jurist(?:er|en)?)\b/iu;
  if (familyAgeCombo.test(source) || singleChildAge.test(source) || householdCombo.test(source)) add("family_details", "Generaliser detaljerte familieopplysninger.");
  if (/\bgravid\b[^.!?]{0,30}\b(?:uke|svangerskapsuke)\s*\d{1,2}\b/iu.test(source)) add("pregnancy_detail", "Fjern eksakt svangerskapsuke dersom den ikke er nødvendig.");
  if (uniquenessCombo.test(source)) add("unique_role", "Generaliser opplysninger som peker ut en unik eller svært liten gruppe.");
  const exactWorkplace = /\b(?:jobber|arbeider|ansatt|tjenestegjør)\s+(?:i|på|ved|hos)\s+(?:Forsvaret|[A-ZÆØÅ][\p{L}.-]+(?:\s+[A-ZÆØÅ][\p{L}.-]+){0,3}(?:\s+(?:AS|ASA|kommune|sykehus|barnehage|skole|etat|avdeling|kontor))?)\b/u;
  const namedUnit = /\b(?:ved|på|i)\s+(?:[A-ZÆØÅ][\p{L}.-]+\s+){1,3}(?:avdeling|seksjon|kontor|barnehage|skole|sykehus)\b/u;
  if (exactWorkplace.test(source) || namedUnit.test(source)) add("workplace_detail", "Generaliser konkret arbeidssted eller enhet dersom det ikke er nødvendig.");
  return findings;
}

function blockUnsafeAiText(res, texts) {
  const findings = (Array.isArray(texts) ? texts : [texts]).flatMap(serverPrivacyFindings);
  const hard = findings.filter(item => SERVER_HARD_PRIVACY_TYPES.has(item.type));
  const unique = hard.filter((item, index, all) => all.findIndex(other => other.type === item.type && other.message === item.message) === index);
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

app.post("/api/classify-topic", aiLimiter, requireUser, async (req, res) => {
  if (!hasAnyAiClient()) {
    return res.status(503).json({ error: "AI_NOT_CONFIGURED", message: "Ingen KI-provider er konfigurert. Sett OPENAI_API_KEY eller OPENROUTER_API_KEY på serveren." });
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
      _functionName:'tema', _userId:req.user.id, _topicId:selectedTopicId || null, _privacyTexts:[situation],
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
      message: "KI-temaforslaget kunne ikke gjennomføres."
    });
  }
});


app.get("/api/status", requireUser, async (_req, res) => {
  res.json({ aiConfigured: Boolean(client), model: client ? await getActiveModel() : null });
});

app.post("/api/analyze-situation", aiLimiter, requireUser, async (req, res) => {
  if (!hasAnyAiClient()) {
    return res.status(503).json({
      error: "AI_NOT_CONFIGURED",
      message: "Ingen KI-provider er konfigurert. Sett OPENAI_API_KEY eller OPENROUTER_API_KEY på serveren."
    });
  }

  const { situation, helpRequest = "", selectedTopic = "", selectedSubtopic = "", testMode = "" } = req.body || {};
  const adminPilotTest = testMode === "pilot-regression" && effectiveRole(req.user) === "admin";
  if (typeof situation !== "string" || !situation.trim()) {
    return res.status(400).json({ error: "MISSING_SITUATION", message: "Situasjonsbeskrivelse mangler." });
  }
  if (blockUnsafeAiText(res, [situation, helpRequest])) return;

  const task = `\n\n## Oppgave i denne forespørselen\nAnalyser situasjonen som samtalepartner, ikke som HR-klassifiserer.\n- Gjengi bare fakta som faktisk står i brukerens tekst.\n- Identifiser det menneskelige/praktiske dilemmaet, ikke bare en kategori.\n- Relevante temaer er kun metadata og skal være maks to.\n- Still bare avklaringsspørsmål dersom svarene kan endre rådet vesentlig.\n- Lag korte klikkbare svaralternativer som dekker sannsynlige svar uten å påstå at de er sanne.
- Sett multi_select=true når flere svaralternativer realistisk kan være sanne samtidig eller brukeren kan trenge hjelp med flere ting. Bruk false når alternativene faktisk utelukker hverandre.\n- Spør aldri om diagnose eller unødvendige sensitive opplysninger.\n- Hvis valgt tema/undertema ikke passer teksten, skal friteksten veie tyngst.\n\nValgt tema i grensesnittet: ${selectedTopic || "ikke oppgitt"}\nValgt undertema: ${selectedSubtopic || "ikke oppgitt"}\nHva brukeren ønsker hjelp til: ${helpRequest || "ikke oppgitt"}\n`;

  try {
    const response = await createTrackedResponse({
      _functionName:'analyse', _userId:req.user.id, _topicId:selectedTopic || null, _subtopic:selectedSubtopic || null, _privacyTexts:[situation, helpRequest], _isTest:adminPilotTest,
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
      message: "KI-analysen feilet."
    });
  }
});


app.post("/api/generate-guidance", aiLimiter, requireUser, async (req, res) => {
  if (!hasAnyAiClient()) {
    return res.status(503).json({ error: "AI_NOT_CONFIGURED", message: "Ingen KI-provider er konfigurert. Sett OPENAI_API_KEY eller OPENROUTER_API_KEY på serveren." });
  }

  const { situation, analysis = null, followups = {}, topicId = "", subtopic = "", testMode = "" } = req.body || {};
  const adminPilotTest = testMode === "pilot-regression" && effectiveRole(req.user) === "admin";
  if (typeof situation !== "string" || !situation.trim()) {
    return res.status(400).json({ error: "MISSING_SITUATION", message: "Situasjonsbeskrivelse mangler." });
  }
  if (blockUnsafeAiText(res, [situation, ...flattenTextValues(followups)])) return;

  const relevantSources = selectRelevantSources(analysis, situation);
  const guidanceTask = `\n\n## Oppgave: lag konkret, menneskelig samtalestøtte\nDu skal lage støtte som en leder faktisk kan bruke i en virkelig samtale om kort tid. Ikke skriv som et HR-notat, vedtak, rapport eller KI-assistent. Ikke bruk standardråd som kunne passet enhver leder.\n\n## Forslag til åpning – strenge regler\n- opening skal KUN være ord lederen faktisk kan si høyt direkte til medarbeideren som de første ordene i samtalen.\n- Skriv vanlig, muntlig norsk. Maks 2–4 korte setninger; sikt normalt mot ca. 30–65 ord.\n- Start med hovedbudskapet eller den konkrete observasjonen. Ikke bygg opp lenge før poenget kommer.\n- Ta bare med det som trengs for å åpne samtalen. Ikke gjennomfør hele samtalen i opening.\n- Gi medarbeideren rom til å svare før begrunnelse, detaljer, regelverk og videre plan kommer.\n- opening skal aldri inneholde instruksjoner TIL lederen som «du bør», «kontakt HR», «følg prosedyren», «varsle leder», «kvalitetssikre» eller lignende. Slike råd hører hjemme i de andre feltene.\n- Unngå formelt HR-/rapport-/vedtaksspråk når enklere muntlig språk fungerer. Ikke bruk «jeg ønsker å ...» som standardåpning dersom «jeg vil ...» eller en enda enklere formulering er mer naturlig.\n- Ikke legg juridiske eller faglige forbehold inn i opening med mindre selve budskapet må uttrykkes der for å ivareta akutt sikkerhet. Ved akutt sikkerhet skal du fortsatt skrive en direkte replikk, for eksempel hva lederen faktisk sier for å stoppe arbeidet.\n- Før du svarer, gjør en intern språksjekk: «Høres dette naturlig ut hvis en vanlig leder sier det uten å lese fra et manus?» Hvis nei, skriv opening om.\n\n## Resten av veiledningen\n- Bruk brukerens situasjon, situasjonsanalysen og avklaringssvarene som én samlet kontekst.\n- Prioriter konkret fremfor komplett, muntlig fremfor formelt og kort fremfor uttømmende.\n- questions: gi 2–3 målrettede spørsmål. Hvert spørsmål skal ha en tydelig funksjon i akkurat saken.\n- reactions: gi normalt 2–3 plausible, situasjonsspesifikke reaksjoner. Ikke bruk generelle følelseskategorier med mindre konteksten faktisk gjør dem relevante.\n- For hver reaksjon: forklar kort hvorfor den er plausibel og hvordan lederen kan møte den. Ikke påstå at medarbeideren vil reagere slik.\n- check_before_meeting: maks 3 konkrete forberedelser.\n- attention: maks 3 ting lederen særlig må passe på.\n- next_steps: maks 3 konkrete neste steg.\n- Ikke gjenta samme råd i flere seksjoner. Legg hvert poeng der det hører best hjemme.\n- Skill tydelig mellom hva lederen bør AVKLARE før møtet, hva lederen faktisk kan SI, og hva som eventuelt må kvalitetssikres faglig/juridisk.\n- Ikke be om diagnose eller medisinske detaljer.\n- Ikke dikt opp virksomhetens regler, fakta, forskning eller rettsregler.\n- Bruk den kuraterte fagbanken som førstevalg og kvalitetsanker. Vanlige samtaleråd trenger ikke kilde. Kritiske, rettslige eller tydelig faglige råd bør støttes av relevante kilder.\n- source_ids må kun inneholde ID-er fra den oppgitte fagbanken. Velg 1–4 presise kilder når de faktisk passer.\n- Fagbanken er IKKE en lukket liste. Dersom saken trenger en mer presis, nyere eller manglende kilde, kan du bruke nettsøk og supplere med inntil 2 kilder. Prioriter norsk lov/myndighet, anerkjente fagmiljøer, systematiske oversikter/meta-analyser og fagfellevurdert forskning. Unngå blogger, markedsføring og tilfeldige rådssider.\n- supplementary_sources skal bare inneholde kilder du faktisk har funnet og brukt gjennom nettsøk. Ikke konstruer titler, forfattere eller lenker. Bruk tom liste hvis fagbanken er tilstrekkelig.\n- Kildepresisjon: En kilde må støtte den konkrete påstanden den står ved. Ikke bruk en side bare fordi den nevner et beslektet tema.\n- Organisasjonsattribusjon: Skriv bare «Akan anbefaler», «Arbeidstilsynet sier» eller tilsvarende når kilden faktisk er fra den organisasjonen eller tydelig dokumenterer akkurat den attribusjonen. Ellers formuler rådet uten organisasjonsnavn.\n- Hvis fagbanken allerede dekker påstanden godt, ikke bruk nettsøk bare for å legge til flere lenker.\n- Ved juridisk sensitivitet: prioriter gjeldende norsk lov/myndighetskilde og anbefal relevant arbeidsrettslig/juridisk kvalitetssikring når nødvendig, uten å konkludere definitivt. For andre faglige spørsmål skal kompetansen matches til problemet, for eksempel samtalefag/organisasjonspsykologi, HMS, HR/arbeidsliv eller helse.\n\nSituasjonsanalyse fra første KI-steg: ${JSON.stringify(analysis || {})}\nAvklaringssvar: ${JSON.stringify(followups || {})}\n\n## Relevante, kvalitetssikrede kilder i fagbanken\n${JSON.stringify(relevantSources)}\n`;

  try {
    const response = await createTrackedResponse({
      _functionName:'veiledning', _userId:req.user.id, _topicId:topicId || null, _subtopic:subtopic || null, _privacyTexts:[situation, ...flattenTextValues(followups)], _isTest:adminPilotTest,
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
      error: "AI_GUIDANCE_FAILED", message: "KI-samtalestøtten feilet."
    });
  }
});


app.post("/api/continue-conversation", aiLimiter, requireUser, async (req, res) => {
  if (!hasAnyAiClient()) {
    return res.status(503).json({ error: "AI_NOT_CONFIGURED", message: "Ingen KI-provider er konfigurert. Sett OPENAI_API_KEY eller OPENROUTER_API_KEY på serveren." });
  }
  const { situation, analysis = null, followups = {}, guidance = null, question = "", topicId = "", subtopic = "" } = req.body || {};
  if (typeof question !== "string" || !question.trim()) {
    return res.status(400).json({ error: "MISSING_QUESTION", message: "Oppfølgingsspørsmål mangler." });
  }
  if (blockUnsafeAiText(res, [situation, question, ...flattenTextValues(followups)])) return;
  const relevantSources = selectRelevantSources(analysis, situation);
  const continueTask = `\n\n## Oppgave: svar på oppfølgingsspørsmål i samme sak\nSvar som en konkret samtalepartner. Bruk samme situasjon, analyse, avklaringssvar og tidligere KI-råd.\n- Svar direkte på det brukeren spør om.\n- Unngå generelle standardråd hvis du kan være mer konkret ut fra saken.\n- Ikke dikt opp fakta, motiv eller virksomhetsregler.\n- Ved juridisk sensitivitet: pek på relevant kontrollpunkt og anbefal relevant arbeidsrettslig/juridisk kvalitetssikring, uten å konkludere definitivt. Ved andre faglige spørsmål: pek på den typen kompetanse som faktisk passer saken, ikke HR som standardsvar.\n- Ikke be om diagnose eller unødvendige sensitive opplysninger.\n- Bruk fagbanken som førstevalg. Dersom spørsmålet krever oppdatert eller mer presis faglig dokumentasjon enn banken dekker, kan du bruke nettsøk. Prioriter myndigheter, anerkjente fagmiljøer og fagfellevurdert forskning.\n- Kildepresisjon: bruk bare kilder som faktisk støtter den konkrete påstanden. Ikke tilskriv en organisasjon et råd med mindre den aktuelle kilden faktisk støtter attribusjonen.\n- Hvis fagbanken er tilstrekkelig, ikke bruk nettsøk bare for å legge til flere lenker.\n- Hold svaret kort, direkte og situasjonsnært.
- Svar på akkurat spørsmålet som ble stilt; ikke skriv hovedveiledningen på nytt.
- Sikt mot ca. 90–160 ord. Gå bare over dette når det er nødvendig av sikkerhets- eller juridiske grunner.
- Bruk maksimalt 4 korte avsnitt eller 3 korte punkter.
- Gi høyst 1–2 konkrete formuleringseksempler.
- Ikke bruk nummererte mini-kapitler med mindre brukeren uttrykkelig ber om en stegvis gjennomgang.
- Ikke gjenta risikovarsler, HR-råd eller sikkerhetsforbehold som allerede er gitt, med mindre de er direkte relevante for oppfølgingsspørsmålet.\n\nSituasjon: ${situation || ""}\nAnalyse: ${JSON.stringify(analysis || {})}\nAvklaringssvar: ${JSON.stringify(followups || {})}\nTidligere råd: ${JSON.stringify(guidance || {})}\nRelevante kilder i fagbanken: ${JSON.stringify(relevantSources)}\n`;
  try {
    const response = await createTrackedResponse({
      _functionName:'oppfolging', _userId:req.user.id, _topicId:topicId || null, _subtopic:subtopic || null, _privacyTexts:[situation, question, ...flattenTextValues(followups)],
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
      error: "AI_CONTINUATION_FAILED", message: "KI-oppfølgingen feilet."
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

app.post('/api/simulation-turn', aiLimiter, requireUser, async (req, res) => {
  if (!hasAnyAiClient()) return res.status(503).json({ error: 'AI_NOT_CONFIGURED', message: 'Ingen KI-provider er konfigurert. Sett OPENAI_API_KEY eller OPENROUTER_API_KEY på serveren.' });
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
      _functionName:'simulering', _userId:req.user.id, _topicId:body.topicId || null, _subtopic:body.subtopic || null, _privacyTexts:[body.situation, ...flattenTextValues(body.followups), ...leaderTurnTexts(turns)],
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

app.post('/api/simulation-help', aiLimiter, requireUser, async (req, res) => {
  if (!hasAnyAiClient()) return res.status(503).json({ error: 'AI_NOT_CONFIGURED', message: 'Ingen KI-provider er konfigurert. Sett OPENAI_API_KEY eller OPENROUTER_API_KEY på serveren.' });
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
      _functionName:'simulator-hjelp', _userId:req.user.id, _topicId:body.topicId || null, _subtopic:body.subtopic || null, _privacyTexts:[body.situation, ...flattenTextValues(body.followups), ...leaderTurnTexts(turns)], instructions: systemPrompt, input: [{ role: 'user', content: [{ type: 'input_text', text: prompt }] }] });
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

app.post('/api/simulation-feedback', aiLimiter, requireUser, async (req, res) => {
  if (!hasAnyAiClient()) return res.status(503).json({ error: 'AI_NOT_CONFIGURED', message: 'Ingen KI-provider er konfigurert. Sett OPENAI_API_KEY eller OPENROUTER_API_KEY på serveren.' });
  const body = req.body || {};
  const turns = sanitizeSimulationTurns(body.turns);
  if (!turns.some(turn => turn.role === 'leader')) return res.status(400).json({ error: 'EMPTY_SIMULATION', message: 'Øvelsen har ingen lederutsagn å vurdere.' });
  if (blockUnsafeAiText(res, [body.situation, ...flattenTextValues(body.followups), ...leaderTurnTexts(turns)])) return;
  const task = `\n\n## Oppgave: tilbakemelding etter samtaleøvelse\nDu er trener, ikke medarbeider. Vurder KUN det lederen faktisk sa i transkriptet.\n- Ingen poengsum, karakter eller rangering.\n- Pek på konkrete formuleringer eller grep som fungerte godt.\n- Pek på konkrete steder som kunne vært tydeligere, mer åpne eller mer presise.\n- Ikke anta lederens intensjon utover ordene som står der.\n- Ikke finn på fakta om medarbeideren.\n- Gi én alternativ formulering som passer saken.\n- Avslutt med ett kort læringspunkt.\n\nSituasjon: ${String(body.situation || '').slice(0,12000)}\nAnalyse: ${JSON.stringify(body.analysis || {})}\nTidligere råd: ${JSON.stringify(body.guidance || {})}\nTranskript: ${JSON.stringify(turns)}`;
  try {
    const response = await createTrackedResponse({
      _functionName:'simulator-tilbakemelding', _userId:req.user.id, _topicId:body.topicId || null, _subtopic:body.subtopic || null, _privacyTexts:[body.situation, ...flattenTextValues(body.followups), ...leaderTurnTexts(turns)],
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
  console.log(hasAnyAiClient() ? `KI aktivert (standard ${defaultModel}; admin kan overstyre)` : "KI er ikke aktivert: sett OPENAI_API_KEY eller OPENROUTER_API_KEY i .env");
});







