const fs=require('fs');
const assert=require('assert');
const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const server=fs.readFileSync('server.js','utf8');

const includesAll=(text,parts)=>parts.every(part=>text.includes(part));

for(const id of ['topic-search','topic-detail-search','situation','continue-input','direct-simulation-situation','simulation-input','survey-privacy','ai-feedback-comment','ai-feedback-comment-privacy']){
  assert(html.includes('id="'+id+'"') || html.includes("id='"+id+"'"),id+': felt/varsel mangler i HTML');
}

assert(includesAll(app,["#topic-search","updateFinderPrivacyCheck"]),'topic-search mangler live personvernsjekk');
assert(includesAll(app,["#topic-detail-search","updateFinderPrivacyCheck"]),'topic-detail-search mangler live personvernsjekk');
assert(includesAll(app,["#situation","updatePrivacyCheck"]),'situation mangler live personvernsjekk');
assert(app.includes('privacy-not-personal-button') && app.includes('Ikke personopplysninger'),'situation mangler eksplisitt falsk-positiv kontroll for navnetreff');
assert(app.includes('data-finder-not-personal'),'temafinner mangler eksplisitt falsk-positiv kontroll for navnetreff');
assert(app.includes('splitPrivacyFindings(privacyFindings).hard.length'),'hovedskjema blokkerer fortsatt på myke personvernfunn');
assert(includesAll(app,["data-followup-custom-input","updateFollowupPrivacy"]),'avklaringsfritekst mangler live personvernsjekk');
assert(includesAll(app,["#continue-input","updateContinuePrivacy"]),'oppfølging mangler live personvernsjekk');
assert(includesAll(app,["#direct-simulation-situation","showDirectSimulationPrivacy"]),'direkte simulering mangler personvernsjekk');
assert(includesAll(app,["#simulation-input","updateSimulationTurnPrivacy"]),'simulatormelding mangler live personvernsjekk');
assert(includesAll(app,["#survey-form textarea","updateSurveyPrivacy"]),'brukertestfritekst mangler live personvernsjekk');
assert(includesAll(app,["#ai-feedback-comment","updateAiFeedbackCommentPrivacy"]),'KI-feedback mangler live personvernsjekk');

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
