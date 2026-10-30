const fs=require('fs');
const assert=require('assert');

const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const server=fs.readFileSync('server.js','utf8');
const bank=JSON.parse(fs.readFileSync('tests/AI-GOLDEN-CASES.json','utf8'));

const pilot=(bank.cases||[]).filter(x=>x.pilot_regression);
assert.strictEqual(pilot.length,5,'Pilotbanken skal inneholde de fem faktiske brukertestcasene');
assert.strictEqual((bank.cases||[]).length,26,'Goldenbanken skal inneholde 26 saker totalt');
assert(html.includes('id="pilot-regression-run"'),'Admin mangler knapp for pilotkjøring');
assert(html.includes('id="production-regression-run"'),'Admin mangler knapp for full produksjonsflyt-test');
assert(html.includes('id="pilot-regression-results"'),'Admin mangler område for pilotresultater');
assert(app.includes("async function runPilotRegression(mode='pilot')"),'Klienten mangler automatisk pilot/full produksjonsflyt-kjøring');
assert(app.includes("runPilotRegression('full')"),'Full produksjonsflyt-test er ikke koblet til klienten');
assert(app.includes("mode==='full'?'production-regression':'pilot-regression'"),'Fulltesten merkes ikke som egen testmodus');
assert(app.includes("notes.push('Automatisk ordtreff"),'Ordtreff behandles fortsatt som hard feil i åpningen');
assert(app.includes("const testMode=mode==='full'?'production-regression':'pilot-regression'") && app.includes("JSON.stringify({situation:testCase.input,testMode})") && app.includes("JSON.stringify({situation:testCase.input,analysis,followups:{},testMode})"),'Pilot/fulltest sender ikke testMode til begge KI-kall');
assert(app.includes("fetch('/api/analyze-situation'"),'Pilotkjøringen bruker ikke ekte analyse-endepunkt');
assert(app.includes("fetch('/api/generate-guidance'"),'Pilotkjøringen bruker ikke ekte veilednings-endepunkt');
assert(server.includes("app.get('/api/admin/pilot-regression/cases'"),'Serveren eksponerer ikke pilotcaser til admin');
assert(server.includes("app.post('/api/admin/pilot-regression/result'"),'Serveren mangler mottak/logging av pilotresultater');
assert(server.includes("[pilot-regression-result]"),'Pilotresultater merkes ikke tydelig i serverloggen');
assert(server.includes("[production-regression-result]"),'Full produksjonsflyt-resultater merkes ikke tydelig i serverloggen');
assert(server.includes("req.query?.mode"),'Serveren støtter ikke valg mellom pilot og full testbank');
assert(app.includes("fetch('/api/admin/pilot-regression/result'"),'Klienten sender ikke pilotresultatene til serverloggen');
assert(app.includes("rateLimitedModels"),'Benchmark stopper ikke videre kall til en modell som allerede er ratebegrenset');
assert(app.includes("google/gemma-4-26b-a4b-it:free"),'Gemma Free-håndtering mangler');
assert(server.includes('testMode === "production-regression"'),'Serveren mangler testmerking for full produksjonsflyt');
assert(server.includes('effectiveRole(req.user) === "admin"'),'Serveren beskytter testmerking med adminrolle');
assert(pilot.every(x=>x.opening_checks?.max_words),'Alle pilotcaser skal ha konkret kontroll av åpningen');

console.log('Produksjonsflyt-regresjon: 5 pilotcaser + 26 totalcaser, myk ordvurdering og adminvern OK');
