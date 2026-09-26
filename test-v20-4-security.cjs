const fs = require('fs');
const assert = require('assert');

const server = fs.readFileSync('server.js','utf8');
const app = fs.readFileSync('app.js','utf8');
const index = fs.readFileSync('index.html','utf8');
const migration = fs.readFileSync('V20-4-SUPABASE-MIGRATION.sql','utf8');
const readme = fs.readFileSync('README.md','utf8');

function has(haystack, needle, message){ assert(haystack.includes(needle), message || `Mangler: ${needle}`); }
function lacks(haystack, needle, message){ assert(!haystack.includes(needle), message || `Skal ikke inneholde: ${needle}`); }

assert.strictEqual(require('./package.json').version, '20.4.0');
has(server, 'app.disable("x-powered-by")');
has(server, 'Content-Security-Policy');
has(server, 'Strict-Transport-Security');
has(server, 'requestOriginAllowed');
has(server, 'createRateLimiter');
has(server, 'loginLimiter');
has(server, 'aiLimiter');
lacks(server, 'express.static(__dirname)', 'Hele prosjektmappen skal ikke serveres statisk');
has(server, 'publicAssetNames');

// Server-side privacy gateway must cover the main hard identifiers.
for (const marker of ['birthdate','identifier','gendered_language','address','SERVER_COMMON_GIVEN_NAMES','SERVER_HARD_PRIVACY_TYPES']) {
  has(server, marker, `Server-personvern mangler ${marker}`);
}

// No debug internals to browser.
lacks(server, 'debugStage');
lacks(server, 'apiMessage');
lacks(server, 'X-Debug-Request-Id');

// Usage/source logging is decoupled from user ID and stores exact pages.
has(server, 'source_pages:web.sources');
has(server, 'Dataminimering: bruks-/kildeloggen kobles ikke til den innloggede brukeren.');
has(migration, 'new.user_id := null');
has(migration, 'update public.ai_usage_log set user_id = null');
has(migration, 'source_pages jsonb');

// Retention and account controls.
has(server, 'aiUsageDays: 90');
has(server, 'feedbackAttachmentDays: 90');
has(server, '/api/account/export');
has(server, "from(\"ai_response_feedback\").delete().eq(\"user_id\", userId)");
has(index, 'id="export-account-data"');

// Admin editor starts collapsed and source monitoring exposes concrete pages.
has(index, '<details class="admin-content-section" id="admin-content-editor">');
assert(!index.includes('<details class="admin-content-section" id="admin-content-editor" open'), 'Rediger innhold skal være lukket som standard');
has(index, 'id="admin-source-pages"');
has(app, 'p.topPages');
has(app, 'source_pages');

// README must not publish live invite tokens.
lacks(readme, '?invite=');
has(readme, 'npm run invite');

console.log('v20.4 security regression: OK');
