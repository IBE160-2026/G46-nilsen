const fs = require('fs');
const assert = require('assert');
const app = fs.readFileSync('app.js','utf8');
const server = fs.readFileSync('server.js','utf8');
const html = fs.readFileSync('index.html','utf8');
const css = fs.readFileSync('styles.css','utf8');
const sql = fs.readFileSync('V20-SUPABASE-MIGRATION.sql','utf8');
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));

// Version/admin
assert.strictEqual(pkg.version, '20.0.0');
assert(html.includes('id="admin-view"'));
assert(html.includes('data-view="admin"'));
assert(server.includes('const VALID_ROLES = new Set(["user", "editor", "admin"])'));
assert(server.includes('app.get("/api/admin/users", requireAdmin'));
assert(server.includes('app.patch("/api/admin/users/:id/role", requireAdmin'));
assert(server.includes('app.put("/api/admin/content", requireContentEditor'));
assert(server.includes('EDITABLE_CONTENT_KEYS'));
assert(sql.includes('create table if not exists public.content_overrides'));

// Personvern på alle KI-veier
assert(app.includes("add('gendered_language', 'Kjønnet pronomen'"));
assert(app.includes("'gendered_language'"));
assert(app.includes('function updateFollowupPrivacy()'));
assert(app.includes('function updateContinuePrivacy()'));
assert(app.includes('function updateSimulationTurnPrivacy()'));
assert(app.includes('function showDirectSimulationPrivacy(findings)'));
assert(app.includes('function updateFinderPrivacyCheck(inputId, boxId)'));
assert(server.includes('if (blockUnsafeAiText(res, situation)) return;'));
const gateCount = (server.match(/blockUnsafeAiText\(res,/g)||[]).length;
assert(gateCount >= 8); // helper + seven KI-ruter

// Historikk
assert(app.includes('function scanHistoryPrivacy(item)'));
assert(app.includes('Fiks personvern og lagre'));
assert(app.includes('Ingenting endres automatisk'));

// Simulator/layout
assert(css.includes('.simulation-logo-crop{transform:translateY(-15px)}'));
assert(css.includes('.simulation-view .simulation-bubble{transform:translateY(-10px)}'));
assert(html.includes('Ingen tydelige personopplysninger er oppdaget i teksten.'));
assert(css.includes('.simulation-temporary-option{max-width:none;background:transparent'));

// Feilrapport uten automatisk samtaletekst
assert(html.includes('id="report-include-log"'));
assert(app.includes('Teknisk logg (uten samtaletekst)'));
assert(app.includes("window.addEventListener('unhandledrejection'"));

console.log('v20.0 admin/personvern/layout-regresjon OK');
