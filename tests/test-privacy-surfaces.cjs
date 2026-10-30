const fs=require('fs');
const assert=require('assert');
const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const server=fs.readFileSync('server.js','utf8');

const includesAll=(text,parts)=>parts.every(part=>text.includes(part));

for(const id of ['topic-search','topic-detail-search','situation','continue-input','direct-simulation-situation','simulation-input','survey-privacy','ai-feedback-comment','ai-feedback-comment-privacy']){
  assert(html.includes('id="'+id+'"') || html.includes("id='"+id+"'"),id+': felt/varsel mangler i HTML');
}

assert(includesAll(app,["classifyAndContinueFromFinder","updateFinderPrivacyCheck"]),'temafinner mangler personvernsjekk ved innsending');
assert(app.includes("document.querySelector('#situation-form').addEventListener('submit'") && app.includes('const privacyFindings = updatePrivacyCheck() || []'),'situation mangler personvernsjekk ved Få råd');
assert(app.includes('Personvern sjekkes når du trykker «Få råd».'),'situation mangler rolig personvernstatus under skriving');
assert(app.includes('privacy-not-personal-button') && app.includes('Ikke personopplysninger'),'situation mangler eksplisitt falsk-positiv kontroll for navnetreff');
assert(app.includes('data-finder-not-personal'),'temafinner mangler eksplisitt falsk-positiv kontroll for navnetreff');
assert(app.includes('splitPrivacyFindings(privacyFindings).hard.length'),'hovedskjema blokkerer fortsatt på myke personvernfunn');
assert(includesAll(app,["showStructuredGuidance","updateFollowupPrivacy"]),'avklaringsfritekst mangler personvernsjekk ved videre handling');
assert(includesAll(app,["#continue-form","updateContinuePrivacy"]),'oppfølging mangler personvernsjekk ved sending');
assert(includesAll(app,["beginDirectSimulation","showDirectSimulationPrivacy"]),'direkte samtaleøvelse mangler personvernsjekk ved start');
assert(includesAll(app,["#simulation-form","updateSimulationTurnPrivacy"]),'samtaleøvelsemelding mangler personvernsjekk ved sending');
assert(includesAll(app,["#survey-form","updateSurveyPrivacy"]),'brukertestfritekst mangler personvernsjekk ved innsending');
assert(includesAll(app,["#ai-feedback-form","detectSensitiveInfo(comment)"]),'KI-feedback mangler personvernsjekk ved innsending');
assert(!app.includes("document.querySelector('#simulation-input')?.addEventListener('input', updateSimulationTurnPrivacy)"),'samtaleøvelse kjører fortsatt live personvernsjekk mens brukeren skriver');
assert(!app.includes("input.addEventListener('input',updateSurveyPrivacy)"),'brukertest kjører fortsatt live personvernsjekk mens brukeren skriver');
assert(!app.includes("document.querySelector('#ai-feedback-comment')?.addEventListener('input',updateAiFeedbackCommentPrivacy)"),'KI-feedback kjører fortsatt live personvernsjekk mens brukeren skriver');

const apiParts=[
  ["tema","_privacyTexts:[situation]"],
  ["analyse","_privacyTexts:[situation, helpRequest]"],
  ["veiledning","_privacyTexts:[situation, ...flattenTextValues(followups)]"],
  ["oppfolging","_privacyTexts:[situation, question, ...flattenTextValues(followups)]"],
  ["simulering","_privacyTexts:[body.situation, ...flattenTextValues(body.followups), ...leaderTurnTexts(turns)]"],
  ["simulator-hjelp","_privacyTexts:[body.situation, ...flattenTextValues(body.followups), ...leaderTurnTexts(turns)]"],
  ["simulator-tilbakemelding","_privacyTexts:[body.situation, ...flattenTextValues(body.followups), ...leaderTurnTexts(turns)]"]
];
for(const [name,privacy] of apiParts){
  assert(server.includes("_functionName:'"+name+"'") && server.includes(privacy),name+': mangler sentral server-personvernsjekk');
}

assert(server.includes('serverPrivacyFindings(comment)'),'KI-feedback mangler serversjekk');
assert(server.includes('row.improvement_text') && server.includes('row.most_useful_text') && server.includes('serverPrivacyFindings'),'Brukertest mangler serversjekk');
assert(html.includes('<strong>Personvern:</strong> Ikke skriv navn'),'Kontaktskjemaet mangler personvernpåminnelse');

console.log('Personvernflater klient/server: OK');
