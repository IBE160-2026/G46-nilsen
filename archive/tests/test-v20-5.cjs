const fs=require('fs');
const assert=require('assert');
const app=fs.readFileSync('app.js','utf8');
const server=fs.readFileSync('server.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('styles.css','utf8');
const cases=JSON.parse(fs.readFileSync('BENCHMARK-CASES.json','utf8')).cases;
const source=JSON.parse(fs.readFileSync('SOURCEBANK.json','utf8'));
const migration=fs.readFileSync('V20-5-SUPABASE-MIGRATION.sql','utf8');
const readme=fs.readFileSync('README.md','utf8');
const pkg=require('./package.json');

function has(haystack,needle,msg){assert(haystack.includes(needle),msg||`Mangler: ${needle}`)}
function lacks(haystack,needle,msg){assert(!haystack.includes(needle),msg||`Skal ikke inneholde: ${needle}`)}

assert.strictEqual(pkg.version,'20.5.0');
assert(app.includes("id: 'mobbing-trakassering'"));
assert(server.includes('id: "mobbing-trakassering"'));
assert(app.includes('Tilrettelegging og arbeidsevne'));
assert(app.includes('Vold og trusler'));
assert.strictEqual(cases.length,112);
const g={}; for(const c of cases){assert(c.id&&c.situation&&c.topicId&&c.subtopic);g[c.topicId+'|'+c.subtopic]=(g[c.topicId+'|'+c.subtopic]||0)+1;}
assert(Object.values(g).every(n=>n>=2));
assert.strictEqual(Object.keys(g).length,56);
assert(server.includes('OPENROUTER_API_KEY'));
assert(server.includes('openrouter/free'));
assert(server.includes('google/gemma-4-26b-a4b-it:free'));
assert(html.includes('id="survey-form"'));
assert(server.includes('/api/survey'));
assert(html.includes('id="admin-create-invite"'));
assert(server.includes('/api/admin/invites'));
assert(migration.includes('survey_responses'));
assert(migration.includes('expires_at'));
assert(css.includes('#admin-view .utility-page-logo{transform:translateY(8px)}'));
assert(source.sources.filter(x=>(x.topics||[]).includes('Mobbing og trakassering')).length>=9);

// Godkjent boblegeometri fra v19.12.3 skal være urørt.
assert(app.includes('const r = 26')||app.includes('const r=26'));
assert(app.includes('const tailH = 26')||app.includes('const tailH=26'));
assert(app.includes('const attachStart = 30')||app.includes('const attachStart=30'));
assert(app.includes('const attachEnd = 52')||app.includes('const attachEnd=52'));
assert(app.includes('const tipOffset = 24')||app.includes('const tipOffset=24'));

// v20.4 sikkerhetsregresjon.
has(server,'app.disable("x-powered-by")');
has(server,'Content-Security-Policy');
has(server,'Strict-Transport-Security');
has(server,'requestOriginAllowed');
has(server,'createRateLimiter');
has(server,'loginLimiter');
has(server,'aiLimiter');
lacks(server,'express.static(__dirname)');
has(server,'publicAssetNames');
for(const marker of ['birthdate','identifier','gendered_language','address','SERVER_COMMON_GIVEN_NAMES','SERVER_HARD_PRIVACY_TYPES']) has(server,marker);
lacks(server,'debugStage'); lacks(server,'apiMessage'); lacks(server,'X-Debug-Request-Id');
has(server,'source_pages:web.sources');
has(server,'Dataminimering: bruks-/kildeloggen kobles ikke til den innloggede brukeren.');
has(server,'aiUsageDays: 90'); has(server,'feedbackAttachmentDays: 90'); has(server,'/api/account/export');
has(html,'id="export-account-data"');
assert(!html.includes('<details class="admin-content-section" id="admin-content-editor" open'));
has(html,'id="admin-source-pages"');
lacks(readme,'?invite=');
has(readme,'npm run invite');

console.log('v20.5 checks OK:',cases.length,'cases,',Object.keys(g).length,'subtopics,',source.sources.length,'sources');
